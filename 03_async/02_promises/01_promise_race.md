---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PROMISE.RACE, ALLSETTLED, ANY : QUAND PLUSIEURS OPÉRATIONS S'AFFRONTENT
Temps de lecture ~7 min

Tu as plusieurs Promises qui tournent en parallèle.
La question c'est : tu attends qui ?

`Promise.all` : tout le monde ou personne.
`Promise.race` : le premier arrivé gagne, les autres sont ignorés.
`Promise.allSettled` : tout le monde finit, victoire ou défaite.
`Promise.any` : le premier qui réussit, les autres peu importe.

Quatre combinators. Quatre réponses à des situations différentes.
Choisir le mauvais, c'est soit une app qui se bloque, soit des erreurs qu'on rate silencieusement.

---

## 1) PROMISE.ALL : TOUT LE MONDE OU RIEN

La formation de Naruto pour une mission S-rank. Si un seul tombe, la mission échoue.

```js
const mission = Promise.all([
 recupererChakraNaruto(),  // async
 recupererChakraSasuke(),  // async
 recupererChakraSakura()   // async
])

// tout le monde revient => on démarre
mission.then(([chakraNaruto, chakraSasuke, chakraSakura]) => {
 console.log("formation complète, on attaque")
})

// Sasuke déserte => tout s'arrête
// le catch se déclenche dès la première rejection
mission.catch(err => {
 console.log("mission annulée :", err.message)
})
```

Résultat : un tableau dans le même ordre que les Promises passées.
Risque : une seule rejection coupe tout. Même si les deux autres ont réussi.

---

## 2) PROMISE.RACE : LE PREMIER ARRIVÉ GAGNE

Kakashi contre Obito. Peu importe qui frappe en premier, c'est lui qui détermine la suite.

```js
const combat = Promise.race([
 kakashiAttaque(),  // 200ms
 obitoContre()  // 150ms
])

// Obito est plus rapide => c'est lui qui remporte la race
combat.then(resultat => {
 console.log("premier coup :", resultat) // résultat de obitoContre
})
```

Ce que `race` ne fait PAS : annuler les autres Promises.
Elles continuent de tourner en background. On récupère juste le premier résultat.

Cas d'usage réel : timeout maison.

```js
function avecTimeout(promise, ms) {
 const timer = new Promise((_, reject) =>
  setTimeout(() => reject(new Error(`timeout après ${ms}ms`)), ms)
 )

 // la première qui se résout (ou rejette) gagne
 return Promise.race([promise, timer])
}

avecTimeout(fetchDonneesMission(), 3000)
 .then(data => console.log("données reçues :", data))
 .catch(err => console.log("trop long :", err.message))
```

Si l'API répond en 5 secondes : le timer gagne. La Promise de fetch continue de vivre,
mais on a déjà traité le timeout.

---

## 3) PROMISE.ALLSETTLED : TOUT LE MONDE FINIT, VICTOIRE OU PAS

Le recensement après l'attaque de Konoha par Pain. Certains shinobis ont survécu, certains sont tombés.
On veut le rapport complet, pas juste les vivants.

```js
const missions = Promise.allSettled([
 evacuerQuartier1(), // résout
 evacuerQuartier2(), // rejette : effondrement
 evacuerQuartier3()  // résout
])

missions.then(resultats => {
 resultats.forEach((res, i) => {
  if (res.status === "fulfilled") {
   console.log(`village ${i + 1} sauvé :`, res.value)
  } else {
   console.log(`village ${i + 1} perdu :`, res.reason.message)
  }
 })
})
```

Chaque résultat a un `status` : `"fulfilled"` ou `"rejected"`.
Si `fulfilled` : `res.value`. Si `rejected` : `res.reason`.

`allSettled` ne rejette jamais. Il attend tout, il rapporte tout.

---

## 4) PROMISE.ANY : LE PREMIER QUI RÉUSSIT

Trois équipes shinobi cherchent le même parchemin interdit dans des zones différentes.
Une seule suffit à le trouver. On se fout de savoir qui échoue.

```js
const recherche = Promise.any([
 equipeKakashi.chercher(), // rejette
 equipeGai.chercher(), // résout en premier => gagne
 equipeAsuma.chercher()  // résout mais trop tard
])

recherche.then(fragment => {
 console.log("fragment trouvé par :", fragment)
})

// Si TOUTES rejettent => AggregateError
recherche.catch(err => {
 console.log("toutes les équipes ont échoué")
 console.log(err.errors) // tableau de toutes les erreurs
})
```

`any` est l'inverse de `all`. Un seul suffit à réussir. Tous doivent échouer pour que ça rejette.

---

## TABLEAU RÉCAPITULATIF

```
Combinator     Résout quand     Rejette quand
---------------------------------------------------------
Promise.all    TOUS réussissent   UN seul échoue
Promise.race    LE PREMIER finit   LE PREMIER échoue
Promise.allSettled TOUS finissent    jamais
Promise.any    UN seul réussit    TOUS échouent
```

---

## EXERCICES

## EXO 1 : le tournoi des villages cachés

Konoha organise une compétition : trois villages envoient leurs meilleurs ninjas chercher un parchemin secret dans des zones différentes.

- Village du Sable : 800ms pour trouver
- Village de la Brume : 1200ms
- Village de la Roche : timeout à 500ms (ils abandonnent)

Implémente une fonction `lancerTournoi()` qui simule les trois recherches avec des `setTimeout`.
Utilise le bon combinator pour récupérer le premier parchemin trouvé, peu importe les abandons.

(indice : `Promise.race` ne te donnera pas la victoire si la Roche abandonne en premier)

---

## EXO 2 : rapport de mission post-invasion

Après l'invasion de Konoha, l'Hokage doit établir un rapport complet sur 4 opérations simultanées.
Certaines ont réussi, d'autres pas. Il a besoin de **toutes** les réponses, même les échecs.

Implémente `genererRapport(operations)` qui prend un tableau de Promises et retourne un objet :

```js
{
 reussies: [{ index: 0, resultat: "..." }, ...],
 echouees: [{ index: 2, erreur: "..." }, ...]
}
```

---

## EXO 3 : le timeout générique

Tu remarques que dans toute l'app, chaque fetch peut bloquer indéfiniment.

Écris une fonction `withTimeout(promise, ms, message)` qui :
- résout si la Promise originale finit avant `ms`
- rejette avec un `TimeoutError` (custom error) contenant `message` si elle dépasse

Teste avec une Promise qui met 5 secondes et un timeout de 2 secondes.

---

## RÉSUMÉ

Quatre combinators, quatre situations.
`all` : synchronisation totale, tout ou rien.
`race` : premier arrivé, premier servi : utilisé massivement pour les timeouts.
`allSettled` : rapport complet, aucune information perdue.
`any` : résilience : un seul succès suffit.

La plupart du temps en prod, tu utilises `all` ou `allSettled`.
`race` sort pour les timeouts. `any` sort pour les systèmes redondants.
