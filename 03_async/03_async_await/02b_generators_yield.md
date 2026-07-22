---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
Temps de lecture ~9 min

Ce fichier sort de la numérotation standard. Il couvre un concept connexe à ce chapitre, non bloquant pour la suite. Lis-le si tu veux aller plus loin sur ce point avant de passer au module suivant.

---

# GENERATORS ET YIELD : LA FONCTION QUI FAIT PAUSE

Une fonction normale s'exécute de A à Z sans interruption. Un generator (function* : notation d'une fonction génératrice) peut s'arrêter en plein milieu, rendre la main, et reprendre exactement où elle en était au prochain appel. C'est une autre façon de gérer des séquences d'opérations, en particulier asynchrones.

---

## 1) LA MÉCANIQUE : CE QUI CHANGE AVEC `function*`

```js
// fonction normale : s'exécute en entier, retourne une valeur
function mission() {
 console.log('départ')
 console.log('en route')
 console.log('arrivée')
 return 'terminé'
}

// generator : s'exécute jusqu'au premier yield, puis attend
function* missionGaro() {
 console.log('départ')
 yield 'point de contrôle 1'  // pause ici, retourne la valeur
 console.log('en route')
 yield 'point de contrôle 2'  // pause encore
 console.log('arrivée')
 return 'mission accomplie'
}

const gen = missionGaro() // crée le generator, mais n'exécute RIEN encore

gen.next()
// affiche "départ"
// retourne { value: 'point de contrôle 1', done: false }

gen.next()
// affiche "en route"
// retourne { value: 'point de contrôle 2', done: false }

gen.next()
// affiche "arrivée"
// retourne { value: 'mission accomplie', done: true }

gen.next()
// retourne { value: undefined, done: true } -- generator épuisé
```

`function*` ne crée pas un iterator classique : elle crée un objet qui est à la fois iterable ET iterator. Chaque appel à `.next()` reprend l'exécution jusqu'au prochain `yield` (ou jusqu'à la fin).

---

## 2) PASSER DES VALEURS DANS LES DEUX SENS

`yield` ne fait pas que produire une valeur : il peut aussi en recevoir une.

```js
function* interrogatoire() {
 const réponse1 = yield 'Où est le plan de la prison ?'
 console.log('Réponse reçue :', réponse1)

 const réponse2 = yield 'Combien de gardes ce soir ?'
 console.log('Réponse reçue :', réponse2)

 return `Dossier : ${réponse1} / ${réponse2}`
}

const gen = interrogatoire()

gen.next()      // démarre : { value: 'Où est le plan...', done: false }
gen.next('Section C') // envoie 'Section C' comme valeur du yield
            // affiche "Réponse reçue : Section C"
            // retourne : { value: 'Combien de gardes...', done: false }
gen.next('12 gardes') // envoie '12 gardes'
            // affiche "Réponse reçue : 12 gardes"
            // retourne : { value: 'Dossier : Section C / 12 gardes', done: true }
```

La première valeur passée à `.next()` est ignorée (il n'y a pas de `yield` actif au démarrage). À partir du deuxième `.next(valeur)`, la valeur devient le résultat de l'expression `yield` dans la fonction.

---

## 3) GENERATORS ET ITÉRABLES : LA SYNTAXE PLUS COURTE

Un generator retourne automatiquement un itérable. C'est la façon la plus courte d'implémenter `Symbol.iterator` sur un objet complexe.

```js
// version Symbol.iterator du fichier précédent : ~15 lignes
const squad = {
 membres: ['Naruto', 'Sasuke', 'Sakura'],
 [Symbol.iterator]() {
  let index = 0
  return {
   next: () => {
    if (index < this.membres.length) {
     return { value: this.membres[index++], done: false }
    }
    return { value: undefined, done: true }
   }
  }
 }
}

// version generator : ~5 lignes, même résultat
const squadGen = {
 membres: ['Naruto', 'Sasuke', 'Sakura'],
 *[Symbol.iterator]() {     // generator method : * devant le nom
  for (const m of this.membres) {
   yield m
  }
 }
}

for (const ninja of squadGen) {
 console.log(ninja) // 'Naruto', 'Sasuke', 'Sakura'
}
```

`yield*` (yield étoile) délègue à un autre itérable :

```js
function* tousLesNinjas() {
 yield* ['Naruto', 'Sasuke'] // yield chaque élément de l'array
 yield* ['Sakura', 'Kakashi']
 yield 'Gaara'        // yield un seul élément
}

console.log([...tousLesNinjas()])
// ['Naruto', 'Sasuke', 'Sakura', 'Kakashi', 'Gaara']
```

---

## 4) GENERATORS ASYNCHRONES : `async function*`

Un generator peut être asynchrone : chaque yield peut attendre une opération async.

```js
// async generator : combine async/await et yield
async function* streamScores(matchIds) {
 for (const id of matchIds) {
  const score = await fetch(`/api/match/${id}`).then(r => r.json())
  yield score  // yield le résultat après l'await
 }
}

// consommation avec for await...of (boucle for asynchrone)
async function afficherScores() {
 const ids = ['cl-final-2024', 'cl-final-2023', 'cl-final-2022']

 for await (const score of streamScores(ids)) {
  console.log(score) // chaque score arrive dès qu'il est prêt, pas tous d'un coup
 }
}
```

La différence avec `Promise.all` : `Promise.all` attend que toutes les promesses soient résolues avant de continuer. Le generator async produit les résultats au fur et à mesure, ce qui permet de commencer à traiter le premier résultat pendant que les suivants chargent.

---

## 5) L'EXEMPLE QUI CASSE : OUBLIER QUE LE GENERATOR EST STATEFUL

```js
function* compteur() {
 let n = 0
 while (true) {   // boucle infinie : le generator ne se termine pas
  yield n++
 }
}

const gen = compteur()
console.log(gen.next().value) // 0
console.log(gen.next().value) // 1
console.log(gen.next().value) // 2

// PIÈGE : partager le même generator entre deux contextes
function premierDisponible(gen) {
 return gen.next().value // consomme un élément du generator partagé
}

premierDisponible(gen) // 3 -- OK mais avance le compteur global
premierDisponible(gen) // 4 -- le compteur a avancé, le contexte A ne sait pas
gen.next().value    // 5 -- l'appelant original ne sait pas que gen.next() a été appelé 2x entre temps
```

Un generator a un état interne. Le partager entre plusieurs consommateurs sans contrôle crée des bugs d'état difficiles à tracer. Règle : un generator = un seul consommateur, sauf si tu conçois explicitement un partage.

---

## EXERCICES

## EXO 1 : le générateur de missions Garo

L'Alerte Horror vient de tomber sur 3 villes simultanément. Le Conseil de Surveillance attribue les missions une par une selon la priorité (niveau de menace décroissant), et attend la confirmation du Chevalier avant de passer à la suivante.

```js
const alertes = [
 { ville: 'Valiante', niveau: 9, chevalier: null },
 { ville: 'León', niveau: 7, chevalier: null },
 { ville: 'Toledo', niveau: 5, chevalier: null },
]
```

Crée un generator `distribuerMissions(alertes)` qui :
- Yield chaque alerte dans l'ordre de priorité (niveau décroissant).
- Reçoit en retour du yield le nom du Chevalier assigné (via `.next(nomChevalier)`).
- Stocke ce nom dans l'alerte avant de passer à la suivante.
- Retourne à la fin le tableau d'alertes avec tous les Chevaliers assignés.

---

## EXO 2 : le stream de stats en direct

Le dashboard Champions League veut afficher les stats de chaque équipe au fur et à mesure qu'elles arrivent, sans attendre toutes les réponses.

```js
async function* fetchStatsParEquipe(equipes) {
 // pour chaque équipe, simuler un fetch avec un délai variable
 // yield le résultat dès qu'il arrive
}
```

Implémenter cette fonction pour que le code suivant affiche chaque stat dès qu'elle est disponible (pas toutes en même temps à la fin) :

```js
const equipes = ['PSG', 'Real Madrid', 'Arsenal']

for await (const stats of fetchStatsParEquipe(equipes)) {
 console.log(`Stats reçues : ${stats.equipe} - ${stats.buts} buts`)
}
```

Compare avec une version `Promise.all` : quelle différence d'expérience pour l'utilisateur si chaque fetch prend entre 1 et 3 secondes ?

---

## RÉSUMÉ

`function*` crée une fonction qui peut s'arrêter et reprendre : chaque `yield` est une pause.
Un generator retourne un iterator : `for...of`, spread, déstructuration fonctionnent dessus nativement.
`yield` peut recevoir une valeur via `.next(valeur)` : communication bidirectionnelle avec le générateur.
`async function*` combine generators et async/await : produit des résultats au fur et à mesure, pas tous d'un coup.
Un generator a un état interne : ne le partage pas entre plusieurs consommateurs sans contrôle.
