---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# CHAÎNER DES OPÉRATIONS ASYNC SANS PERDRE LES ERREURS EN ROUTE
Temps de lecture ~8 min

Un `.then()` retourne une Promise.
Ça veut dire que tu peux en chaîner un autre dessus. Et encore un autre.
C'est le chain reactor : chaque étape reçoit le résultat de la précédente, le transforme, et passe.

Le problème classique : une erreur qui arrive au maillon 3 et que personne ne voit.
Elle tombe dans le vide. Silencieuse. En prod, ça donne un bug impossible à tracer.

Ce module : construire des chaînes solides. Pas juste belles, solides.

---

## 1) LA CHAÎNE DE BASE

Michael Scofield prépare son évasion. Chaque étape dépend de la précédente.
Pas de tunnel sans plan. Pas de plan sans contact. Pas de contact sans argent.

```js
obtenirFinancement()
 .then(argent => contacterComplice(argent))  // reçoit le résultat de l'étape précédente
 .then(complice => dessinerPlan(complice))   // reçoit ce que contacterComplice a résolu
 .then(plan => creuser(plan))          // et ainsi de suite
 .then(tunnel => console.log("sortie trouvée :", tunnel))
 .catch(err => console.log("plan compromis :", err.message))
```

Un seul `.catch()` à la fin attrape n'importe quelle erreur dans toute la chaîne.
C'est la force du chain reactor : une seule sortie d'urgence pour tout le pipeline.

---

## 2) RETOURNER UNE VALEUR VS RETOURNER UNE PROMISE

La règle : ce que tu `return` dans un `.then()` devient la valeur du `.then()` suivant.

Si tu retournes une valeur brute : elle est wrappée automatiquement dans une Promise résolue.
Si tu retournes une Promise : la chaîne attend qu'elle se résout avant de continuer.

```js
Promise.resolve(100)
 .then(n => n * 2)      // retourne 200 (valeur brute => wrappée)
 .then(n => n + 50)     // reçoit 200, retourne 250
 .then(n => {
  return fetchBonus(n)   // retourne une Promise => la chaîne attend
 })
 .then(resultat => {
  // ici on a le résultat résolu de fetchBonus
  console.log(resultat)
 })
```

Erreur classique : oublier le `return`.

```js
.then(n => {
 fetchBonus(n)        // oublié le return => la chaîne passe à None
})
.then(resultat => {
 console.log(resultat)    // undefined. fetchBonus a tourné mais personne l'a attendu.
})
```

---

## 3) GÉRER LES ERREURS AU BON NIVEAU

Un `.catch()` à la fin attrape tout. Mais parfois tu veux récupérer une erreur
à un maillon précis, et continuer la chaîne quand même.

Exemple : T-Bag bloque l'accès aux fournitures. Mais Michael a un plan B.

```js
obtenirFinancement()
 .then(argent => obtenirFournitures(argent))
 .catch(err => {
  // T-Bag a volé les fournitures. Plan B : improviser avec ce qu'on a.
  console.log("fournitures bloquées, on improvise")
  return { outils: ["cuillère", "corde"], improvise: true }
  // si on retourne ici, la chaîne CONTINUE avec ce fallback
 })
 .then(fournitures => dessinerPlan(fournitures))  // reçoit le fallback ou les vraies fournitures
 .then(plan => creuser(plan))
 .catch(err => {
  // ce catch ne voit que les erreurs après le premier catch
  console.log("évasion impossible :", err.message)
 })
```

Ce que `.catch()` fait quand il retourne une valeur : il transforme une rejection en resolution.
La chaîne reprend comme si de rien n'était.

Si tu veux que l'erreur continue à se propager : ne retourne rien, ou re-throw.

```js
.catch(err => {
 console.log("logged :", err.message)
 throw err  // re-throw => la prochaine étape voit toujours une erreur
})
```

---

## 4) FINALLY : CE QUI TOURNE TOUJOURS

Walter White nettoie le labo. Peu importe si la cuisson s'est bien passée ou pas.

```js
preparerLot()
 .then(lot => livrerLot(lot))
 .catch(err => console.log("lot perdu :", err.message))
 .finally(() => {
  // cleanup garanti : connexions fermées, logs écrits, ressources libérées
  nettoyerLaboratoire()
  fermerConnexionDB()
 })
```

`finally` :
- ne reçoit pas de valeur (ni le résultat, ni l'erreur)
- ne modifie pas le résultat de la chaîne
- tourne toujours, resolved ou rejected

---

## 5) ANTI-PATTERN : LE CALLBACK HELL AVEC DES PROMISES

Des Promises imbriquées. Le pire des deux mondes.

```js
// MAUVAIS : pyramid of doom avec des .then() imbriqués
obtenirFinancement().then(argent => {
 contacterComplice(argent).then(complice => {
  dessinerPlan(complice).then(plan => {
   creuser(plan).then(tunnel => {
    console.log(tunnel)
   })
  })
 })
})

// BON : chaîne plate, chaque étape retourne sa Promise
obtenirFinancement()
 .then(argent => contacterComplice(argent))
 .then(complice => dessinerPlan(complice))
 .then(plan => creuser(plan))
 .then(tunnel => console.log(tunnel))
 .catch(err => console.log(err.message))
```

La version imbriquée casse la propagation d'erreur. Chaque niveau a ses propres erreurs isolées.
Un `.catch()` global en bas ne voit rien de ce qui se passe à l'intérieur.

---

## 6) CHAÎNE AVEC TRANSFORMATION DE DONNÉES

Le cas le plus courant en prod : fetch → parse → filtrer → afficher.

```js
fetch("https://api.paradis.sc/personnages")
 .then(response => {
  if (!response.ok) {
   // on transforme une réponse HTTP d'erreur en rejection de Promise
   throw new Error(`HTTP ${response.status}`)
  }
  return response.json()  // retourne une Promise
 })
 .then(personnages => personnages.filter(p => p.regiment === "Exploration"))
 .then(soldats => soldats.map(s => ({ nom: s.nom, rang: s.rang })))
 .then(data => afficher(data))
 .catch(err => {
  // attrape : erreur réseau, HTTP error, erreur de parse JSON, erreur dans filter ou map
  console.log("impossible de charger les personnages :", err.message)
 })
```

Chaque `.then()` fait une seule chose. La chaîne est lisible ligne par ligne.
L'erreur HTTP est convertie manuellement en rejection parce que `fetch` ne rejette pas sur les 4xx/5xx.

---

## EXERCICES

## EXO 1 : le pipeline de vote du Ballon d'Or

La cérémonie approche. Le pipeline doit :
1. `fetchVotes()` : récupère la liste brute des votes (Promise qui résout un tableau)
2. filtrer : garder uniquement les votes valides (champ `joueur` non vide, `points` entre 1 et 10)
3. agréger : calculer le total de points par joueur
4. trier : du plus au moins de points
5. `afficherClassement(classement)` : affiche le top 10

Implémente le pipeline complet avec `.then()`.
Gère les erreurs : si `fetchVotes()` rejette, log l'erreur et retourne un tableau vide (la cérémonie continue avec 0 votes).

---

## EXO 2 : le labo de Walter : nettoyage garanti

Walter prépare un lot. Le processus :
1. `initialiserEquipement()` : peut échouer si le matériel est défectueux
2. `preparerIngredients()` : peut échouer si un ingrédient manque
3. `cuire()` : 45 minutes de cuisson
4. `conditionner()` : mettre en sachets

Peu importe où ça échoue : `nettoyerLabo()` et `fermerGaz()` doivent toujours être appelées.
Si ça échoue à l'étape 1 ou 2, log l'étape précise qui a craqué.

---

## EXO 3 : le rapport de mission : avec récupération partielle

Tu fetches des données depuis trois endpoints différents :
- `/mission/objectif`
- `/mission/equipe`
- `/mission/equipement`

Si `/equipement` échoue, continue avec `{ armes: [], armures: [] }` comme fallback.
Si n'importe quel autre endpoint échoue, la mission est abandonnée.

Construis la chaîne complète avec la récupération partielle sur le troisième endpoint.

---

## RÉSUMÉ

Chaque `.then()` transforme et passe.
Chaque `.catch()` intercepte et peut relancer ou récupérer.
`.finally()` nettoie, sans conditions, sans données.

Erreur la plus fréquente : oublier de `return` une Promise dans un `.then()`.
La chaîne continue avec `undefined`. Le bug est silencieux.

Règle simple : si tu fais un appel async dans un `.then()`, tu le `return`.
Toujours.
