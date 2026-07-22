---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ORCHESTRER SANS PERDRE LE FIL
Temps de lecture ~9 min

T'as compris ce qu'est un callback. T'as vu le labyrinthe.
Maintenant on code dedans : avec les contraintes du monde réel.

Séquence, parallèle, timeout, annulation. Les quatre situations que tu vas croiser dans du code legacy ou des APIs tierces qui n'ont pas migré vers les Promises. Si tu sais pas les gérer, t'es bloqué.

---

## 1) SÉQUENCE CONTRÔLÉE

Quand chaque étape dépend du résultat de la précédente, t'as pas le choix : ça doit être séquentiel.

Le piège : transformer ça en pyramide de la mort. La solution : **nommer chaque étape et la passer comme callback**.

```js
// SCÉNARIO : construire le dossier d'un joueur
// étape 1 : profil => étape 2 : contrat => étape 3 : performances

function etape3_chargerPerfs(contrat, callback) {
 chargerPerformances(contrat.joueurId, function(err, perfs) {
  if (err) return callback(err)
  callback(null, { contrat, perfs })
 })
}

function etape2_chargerContrat(profil, callback) {
 chargerContrat(profil.contractId, function(err, contrat) {
  if (err) return callback(err)
  etape3_chargerPerfs(contrat, callback)
 })
}

function etape1_chargerProfil(joueurId, callback) {
 chargerProfil(joueurId, function(err, profil) {
  if (err) return callback(err)
  etape2_chargerContrat(profil, callback)
 })
}

// point d'entrée unique
etape1_chargerProfil("lewandowski", function(err, dossier) {
 if (err) return console.error("Dossier inaccessible :", err.message)
 console.log("Dossier complet :", dossier)
})
```

La pyramide est cassée. Chaque étape est lisible. L'erreur remonte proprement à chaque niveau.

---

## 2) PARALLÈLE : plusieurs opérations en même temps

Quand les opérations sont indépendantes les unes des autres, les faire en séquence c'est juste gaspiller du temps.

Pattern : lancer tout, compter les retours, agir quand tout est arrivé.

```js
// charger les stats de 4 joueurs en parallèle
const joueurs = ["mbappe", "vinicius", "bellingham", "haaland"]
const resultats = {}
let compteur = joueurs.length // on attend N réponses

joueurs.forEach(function(id) {
 chargerStats(id, function(err, stats) {
  if (err) {
   console.error("Erreur pour", id, ":", err.message)
   // gestion d'erreur partielle : on continue avec les autres
  } else {
   resultats[id] = stats
  }

  compteur-- // une réponse de moins à attendre

  if (compteur === 0) {
   // tous les callbacks sont revenus
   console.log("Stats complètes :", resultats)
   classerParButs(resultats)
  }
 })
})
```

Le `compteur` est le mécanisme de synchronisation. Chaque callback qui arrive décrémente. Quand il atteint 0 : tout est là.

Attention : l'ordre d'arrivée est imprévisible. `vinicius` peut arriver avant `mbappe`. T'utilises un objet `resultats` indexé par id : pas un tableau : pour éviter ce problème.

---

## 3) TIMEOUT : ne pas attendre indéfiniment

Un callback peut ne jamais arriver. API qui plante, réseau coupé, serveur qui répond pas. Si tu gères pas ça, ton code tourne et attend pour toujours.

```js
function chargerAvecTimeout(joueurId, delaiMs, callback) {
 let estTermine = false

 // lancer l'opération réelle
 chargerStats(joueurId, function(err, stats) {
  if (estTermine) return // le timeout est déjà passé, on ignore
  estTermine = true
  clearTimeout(minuteur) // annuler le timeout
  callback(err, stats)
 })

 // lancer le minuteur en parallèle
 const minuteur = setTimeout(function() {
  if (estTermine) return // la réponse est déjà arrivée, on ignore
  estTermine = true
  callback(new Error("Timeout : " + joueurId + " n'a pas répondu en " + delaiMs + "ms"))
 }, delaiMs)
}

// utilisation
chargerAvecTimeout("mbappe", 3000, function(err, stats) {
 if (err) return console.error(err.message)
 console.log("Stats de Mbappé :", stats)
})
```

Le booléen `estTermine` garantit que le callback est appelé une seule fois : soit par le résultat, soit par le timeout. Jamais les deux.

---

## 4) RETRY : réessayer en cas d'échec

Une API instable. Un réseau capricieux. Des fois tu réessaies plutôt que d'abandonner directement.

```js
function chargerAvecRetry(joueurId, tentativesMax, callback) {
 let tentative = 0

 function essayer() {
  tentative++

  chargerStats(joueurId, function(err, stats) {
   if (!err) {
    // succès : on transmet le résultat
    return callback(null, stats)
   }

   if (tentative >= tentativesMax) {
    // plus de tentatives disponibles : on abandonne
    return callback(new Error(
     "Echec après " + tentativesMax + " tentatives : " + err.message
    ))
   }

   // on réessaie
   console.log("Tentative", tentative, "échouée, on réessaie...")
   setTimeout(essayer, tentative * 500) // délai qui augmente à chaque échec
  })
 }

 essayer() // lancer la première tentative
}

chargerAvecRetry("haaland", 3, function(err, stats) {
 if (err) return console.error("Abandon :", err.message)
 console.log("Stats de Haaland :", stats)
})
```

Le `setTimeout(essayer, tentative * 500)` crée un délai croissant : 500ms, 1000ms, 1500ms. C'est du backoff exponentiel basique. Ça évite de bombarder un serveur qui est déjà sous pression.

---

## 5) QUEUE : ne pas tout lancer en même temps

Le problème inverse du parallèle : tu veux contrôler combien d'opérations tournent simultanément.

Exemple : 100 joueurs à charger, mais ton API accepte max 5 requêtes en parallèle.

```js
function chargerEnQueue(joueurIds, concurrenceMax, callback) {
 const resultats = []
 let index = 0    // prochain joueur à traiter
 let actif = 0    // combien d'opérations tournent actuellement
 let termine = 0   // combien ont fini

 function lancerProchain() {
  // lancer autant d'opérations que la limite le permet
  while (actif < concurrenceMax && index < joueurIds.length) {
   const id = joueurIds[index]
   const position = index // capturer la position pour le résultat
   index++
   actif++

   chargerStats(id, function(err, stats) {
    actif--
    termine++
    resultats[position] = err ? null : stats

    if (termine === joueurIds.length) {
     // tout le monde est passé
     callback(null, resultats)
    } else {
     // lancer le prochain dans la queue
     lancerProchain()
    }
   })
  }
 }

 lancerProchain()
}

const ids = ["mbappe", "vinicius", "bellingham", "haaland", "salah", "kane"]
chargerEnQueue(ids, 2, function(err, stats) {
 // max 2 requêtes en parallèle à tout moment
 console.log("Stats :", stats)
})
```

---

## EXERCICES

## EXO 1 : LE PIPELINE DE TRANSFERT

Un club veut finaliser le transfert d'un joueur. Les étapes sont obligatoirement séquentielles :

1. `verifierDisponibilite(joueurId, callback)` : retourne `{ disponible: true/false }`
2. `calculerPrix(joueurId, callback)` : retourne `{ prix, currency }`
3. `validerBudget(prix, clubId, callback)` : retourne `{ valide: true/false }`
4. `finaliserTransfert(joueurId, clubId, callback)` : retourne `{ confirmation }`

Si n'importe quelle étape échoue, le transfert est annulé et une erreur descriptive est retournée. Implémente le pipeline complet sans pyramide.

## EXO 2 : LE TABLEAU DE BORD DU COACH

Le coach veut voir les stats de ses 11 joueurs titulaires en même temps. Tu as `chargerStats(joueurId, callback)`.

Implémente un chargement parallèle avec :
- max 3 requêtes simultanées (protection API)
- si un joueur échoue, ses stats valent `null` dans le résultat final
- quand tous les 11 sont chargés, afficher le classement par note

## EXO 3 : L'API CAPRICIEUSE

Tu travailles avec une API de scouting qui plante aléatoirement 40% du temps.

```js
// simule une API instable
function obtenirRapportScout(joueurId, callback) {
 setTimeout(function() {
  if (Math.random() < 0.4) {
   callback(new Error("API instable"))
  } else {
   callback(null, { joueurId, note: Math.floor(Math.random() * 30) + 70 })
  }
 }, 200)
}
```

Construis un wrapper `obtenirRapportFiable(joueurId, callback)` qui :
- réessaie jusqu'à 4 fois avec un délai de 300ms entre chaque tentative
- abandonne avec une erreur claire si les 4 tentatives échouent
- ne réessaie pas si l'erreur est autre chose qu'un problème réseau

---

## RÉSUMÉ

Quatre patterns, quatre problèmes. Séquence : nommer les étapes et les chaîner proprement. Parallèle : lancer tout, compter avec un compteur, agir quand il atteint zéro. Timeout : un booléen `estTermine` qui garantit une seule exécution du callback. Retry : une fonction récursive avec un compteur de tentatives et un délai croissant. Dans les quatre cas : error-first, `return` après chaque erreur, jamais de code qui continue après un `if (err)` sans return.
