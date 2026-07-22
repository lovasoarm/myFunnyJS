---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
Temps de lecture ~8 min

Ce fichier sort de la numérotation standard. Il couvre un concept connexe à ce chapitre, non bloquant pour la suite. Lis-le si tu veux aller plus loin sur ce point avant de passer au module suivant.

---

# ITERATORS ET SYMBOL.ITERATOR : CRÉER DES STRUCTURES QUI SE PARCOURENT

Tu utilises `for...of` sur des arrays, des strings, des Maps. Mais qu'est-ce qui fait qu'un objet est "itérable" (parcourable avec for...of) ? Ce n'est pas une propriété magique réservée aux built-ins : c'est un protocole (un contrat) que n'importe quel objet peut implémenter. Ce fichier explique ce mécanisme de bout en bout.

---

## 1) LE PROTOCOLE D'ITÉRATION : LE CONTRAT

Deux interfaces constituent le protocole d'itération JS :

```
Iterable   --> un objet qui a une méthode [Symbol.iterator]()
Iterator   --> un objet avec une méthode next() qui retourne { value, done }
```

```
for...of appelle [Symbol.iterator]() sur l'objet
       |
       v
     reçoit un iterator
       |
       v
   appelle .next() à chaque tour de boucle
       |
       v
   { value: X, done: false } --> X est passé à la variable de la boucle
   { value: undefined, done: true } --> la boucle s'arrête
```

`Symbol.iterator` (symbol : type primitif unique, utilisé comme clé de propriété non-collision) est une clé de propriété standard de JS. Quand un objet a cette propriété et qu'elle retourne un iterator valide, cet objet est itérable.

---

## 2) LIRE L'ITERATOR D'UN ARRAY À LA MAIN

```js
const joueurs = ['Naruto', 'Sasuke', 'Sakura']

// récupérer l'iterator manuellement
const iterator = joueurs[Symbol.iterator]()

// appeler next() à la main
console.log(iterator.next()) // { value: 'Naruto', done: false }
console.log(iterator.next()) // { value: 'Sasuke', done: false }
console.log(iterator.next()) // { value: 'Sakura', done: false }
console.log(iterator.next()) // { value: undefined, done: true }

// for...of fait exactement ça, mais automatiquement
for (const j of joueurs) {
 console.log(j) // 'Naruto', 'Sasuke', 'Sakura'
}
```

L'array est itérable parce qu'il a `[Symbol.iterator]` défini nativement. Les objets `{}` ordinaires ne l'ont pas : c'est pourquoi `for...of {}` lève une erreur.

---

## 3) RENDRE UN OBJET ITÉRABLE

```js
// un objet qui représente une squad de ninjas
// objectif : pouvoir écrire "for (const ninja of squad) {...}"

const squad = {
 membres: ['Naruto', 'Sasuke', 'Sakura', 'Kakashi'],

 [Symbol.iterator]() {   // méthode dont la clé est Symbol.iterator
  let index = 0
  const membres = this.membres

  return {         // retourne un iterator
   next() {        // iterator a obligatoirement next()
    if (index < membres.length) {
     return { value: membres[index++], done: false }
    }
    return { value: undefined, done: true }
   }
  }
 }
}

for (const ninja of squad) {
 console.log(ninja) // 'Naruto', 'Sasuke', 'Sakura', 'Kakashi'
}

// le spread operator utilise aussi Symbol.iterator
const liste = [...squad] // ['Naruto', 'Sasuke', 'Sakura', 'Kakashi']

// la déstructuration aussi
const [leader, ...reste] = squad // leader = 'Naruto', reste = [...]
```

---

## 4) ITERATOR AVEC ÉTAT ET LOGIQUE MÉTIER

```js
// un iterator qui filtre à la volée pendant le parcours
// seulement les ninjas disponibles pour une mission

const missionPool = {
 ninjas: [
  { nom: 'Naruto', disponible: true },
  { nom: 'Sasuke', disponible: false },  // en mission solo
  { nom: 'Sakura', disponible: true },
  { nom: 'Rock Lee', disponible: false }, // blessé
  { nom: 'Kakashi', disponible: true },
 ],

 [Symbol.iterator]() {
  let index = 0
  const ninjas = this.ninjas

  return {
   next() {
    // avancer jusqu'au prochain disponible
    while (index < ninjas.length && !ninjas[index].disponible) {
     index++
    }
    if (index < ninjas.length) {
     return { value: ninjas[index++].nom, done: false }
    }
    return { value: undefined, done: true }
   }
  }
 }
}

for (const ninja of missionPool) {
 console.log(ninja) // 'Naruto', 'Sakura', 'Kakashi' (Sasuke et Lee sautés)
}
```

La logique de filtrage est dans l'iterator, pas dans la boucle. Le consommateur n'a pas besoin de savoir comment les ninjas sont sélectionnés.

---

## 5) L'EXEMPLE QUI CASSE : ITERATOR NON RÉINITIALISÉ

```js
const squad = {
 membres: ['Naruto', 'Sasuke'],
 [Symbol.iterator]() {
  let index = 0   // index dans la closure de l'iterator
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

for (const n of squad) console.log(n) // 'Naruto', 'Sasuke'
for (const n of squad) console.log(n) // 'Naruto', 'Sasuke' : OK, nouvel iterator créé

// mais si tu récupères l'iterator et le rejoues...
const it = squad[Symbol.iterator]()
it.next() // { value: 'Naruto', done: false }
it.next() // { value: 'Sasuke', done: false }
it.next() // { value: undefined, done: true }
it.next() // { value: undefined, done: true } -- ÉPUISÉ : il ne repart pas à zéro
// un iterator est à usage unique : pour recommencer, il faut en créer un nouveau
```

Le risque réel : stocker un iterator dans une variable et s'étonner qu'il soit "vide" à la deuxième utilisation. `for...of` crée un nouvel iterator à chaque passage. Toi, si tu gardes la référence, tu travailles sur l'iterator épuisé.

---

## EXERCICES

## EXO 1 : la liste d'attente des Chevaliers Garo

Dans l'univers de Garo, les missions nocturnes s'attribuent par priorité : Chevalier d'Or en premier, puis d'Argent, puis les aspirants. Tu dois créer un objet `fileDesMissions` qui, quand on itère dessus avec `for...of`, retourne les chevaliers dans cet ordre de priorité, en ignorant ceux qui sont marqués `hors_combat: true`.

```js
const fileDesMissions = {
 chevaliers: [
  { nom: 'Léon', rang: 'or', hors_combat: false },
  { nom: 'Alfonso', rang: 'or', hors_combat: true },
  { nom: 'Ema', rang: 'argent', hors_combat: false },
  { nom: 'Germán', rang: 'or', hors_combat: false },
  { nom: 'Herman', rang: 'aspirant', hors_combat: false },
 ],
 // implémenter [Symbol.iterator]
}
```

Le parcours doit retourner : Léon, Germán (or disponibles), puis Ema (argent), puis Herman (aspirant).
Alfonso est ignoré.

Prouve que le spread `[...fileDesMissions]` donne le même résultat que `for...of`.

---

## EXO 2 : l'iterator à fenêtre glissante

Tu travailles sur une analyse de matchs de Champions League. Tu as une série de scores et tu veux calculer des moyennes glissantes sur une fenêtre de N matchs.

Crée un objet `analyseur(scores, taille)` qui retourne un itérable. À chaque tour de `for...of`, il retourne la moyenne des N derniers scores à cette position.

```js
const scores = [1, 3, 2, 4, 1, 5, 2]
// fenêtre de 3 : [1,3,2], [3,2,4], [2,4,1], [4,1,5], [1,5,2]
// moyennes   : 2,    3,    2.33,  3.33,  2.67

for (const moy of analyseur(scores, 3)) {
 console.log(moy.toFixed(2))
}
// 2.00, 3.00, 2.33, 3.33, 2.67
```

Sans Symbol.iterator : comment faisais-tu avant ? Avec un tableau de résultats pré-calculé. Avec Symbol.iterator : tu calcules à la volée, sans stocker l'intégralité des fenêtres en mémoire. La différence compte sur des séries de 100 000 matchs.

---

## RÉSUMÉ

Un objet itérable a une méthode `[Symbol.iterator]()` qui retourne un iterator avec une méthode `next()`.
`for...of`, le spread, la déstructuration : tous utilisent ce protocole.
Un iterator est à usage unique : épuisé, il reste épuisé. `for...of` recrée un iterator frais à chaque passage.
Implémenter `[Symbol.iterator]` sur tes propres structures : ça rend ton code utilisable avec tous les outils natifs JS qui comprennent ce protocole.
