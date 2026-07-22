---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LINEAR SEARCH VS BINARY SEARCH : LA DIFFÉRENCE QUI COMPTE À L'ÉCHELLE
Temps de lecture ~9 min

Chercher un élément. Le truc le plus basique qui soit. Et pourtant la différence entre O(n) et O(log n) peut signifier "trouve en 1 seconde" ou "trouve en 17 jours" sur une base de données réelle.

---

## 1) LINEAR SEARCH : O(n)

Tu regardes chaque élément un par un jusqu'à trouver. Simple. Toujours correct. Lent sur des grands tableaux.

```js
function linearSearch(arr, target) {
 for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) return i // trouvé
 }
 return -1 // pas là
}

// fonctionne sur n'importe quel tableau, trié ou non
const buts = [3, 7, 1, 9, 4, 2]
console.log(linearSearch(buts, 9)) // 3
console.log(linearSearch(buts, 5)) // -1
```

**Complexité :**
- Meilleur cas : O(1) - le premier élément est la cible
- Moyen : O(n/2) = O(n)
- Pire : O(n) - cible absente ou en dernière position

**Quand l'utiliser :**
- tableau non trié
- petits tableaux (< 50 éléments)
- recherche sur des structures sans accès indexé (linked list, stream)
- une seule recherche sur des données qui ne seront pas re-cherchées

---

## 2) BINARY SEARCH : O(log n)

Condition : le tableau doit être **trié**.

Idée : diviser l'espace de recherche par deux à chaque étape. Si la cible est plus petite que le milieu, cherche à gauche. Si plus grande, cherche à droite.

```
Tableau : [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
Cible : 13

Étape 1 : mid = index 4, valeur = 9
     13 > 9 --> cherche à droite
     [11, 13, 15, 17, 19]

Étape 2 : mid = index 7 (dans le tableau original), valeur = 15
     13 < 15 --> cherche à gauche
     [11, 13]

Étape 3 : mid = index 5, valeur = 11
     13 > 11 --> cherche à droite
     [13]

Étape 4 : mid = index 6, valeur = 13
     13 === 13 --> trouvé !
```

```
low         high
[1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
         ^
        mid = 9 < 13 --> cherche à droite

           low     high
        [11, 13, 15, 17, 19]
             ^
            mid = 15 > 13 --> cherche à gauche

           low high
          [11, 13]
           ^
           mid = 11 < 13 --> cherche à droite

             low/high
             [13] --> trouvé
```

```js
function binarySearch(arr, target) {
 let low = 0
 let high = arr.length - 1

 while (low <= high) {
  const mid = low + Math.floor((high - low) / 2)
  // pourquoi low + (high - low) / 2 et pas (low + high) / 2 ?
  // parce que (low + high) peut overflow sur des très grands tableaux en d'autres langages
  // bonne habitude à prendre dès maintenant

  if (arr[mid] === target) return mid  // trouvé
  if (arr[mid] < target) low = mid + 1 // cherche à droite
  else          high = mid - 1 // cherche à gauche
 }

 return -1 // pas trouvé
}

const classement = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
console.log(binarySearch(classement, 13)) // 6
console.log(binarySearch(classement, 10)) // -1
```

---

## 3) VISUALISER O(log n)

```
n éléments --> nombre max d'étapes de binary search

n = 10     --> 4 étapes
n = 100     --> 7 étapes
n = 1 000    --> 10 étapes
n = 1 000 000  --> 20 étapes
n = 1 000 000 000 --> 30 étapes

Comparaison :
n = 1 million

Linear search : jusqu'à 1 000 000 comparaisons
Binary search : 20 comparaisons

C'est la différence entre "1 seconde" et "0.00002 ms"
```

```
Opérations
|
1M | *
  |  *
500K|  *
  |   *
  |      *
20 |         * * * * * *  log n
  |__________________________________________
   10 100 1K 10K 100K 1M
```

---

## 4) BINARY SEARCH RÉCURSIF

```js
function binarySearchRecursive(arr, target, low = 0, high = arr.length - 1) {
 if (low > high) return -1 // cas de base : zone vide = pas trouvé

 const mid = low + Math.floor((high - low) / 2)

 if (arr[mid] === target) return mid
 if (arr[mid] < target)  return binarySearchRecursive(arr, target, mid + 1, high)
 else           return binarySearchRecursive(arr, target, low, mid - 1)
}
```

La version itérative est préférable en JS : pas de risque de stack overflow sur des tableaux très longs. La récursive est plus lisible pédagogiquement.

---

## 5) LE CAS QUI CASSE : BINARY SEARCH SUR TABLEAU NON TRIÉ

```js
// exemple qui casse
const nonTrie = [7, 2, 9, 1, 5, 3]
console.log(binarySearch(nonTrie, 9)) // -1 !!!
// 9 est bien dans le tableau mais binary search ne le trouve pas
// parce qu'il suppose que le tableau est trié pour décider dans quelle moitié chercher

// fix : trier avant de chercher
// mais si tu tris pour une seule recherche --> O(n log n) pour le tri + O(log n) pour la recherche
// = O(n log n), plus lent qu'un simple O(n) de linear search
// binary search n'a de sens que si tu vas chercher plusieurs fois dans le même tableau
```

**Règle :** si tu fais une seule recherche dans un tableau non trié, `linearSearch` est plus rapide. Binary search ne vaut le coup qu'à partir de plusieurs recherches répétées sur la même structure triée.

---

## 6) BINARY SEARCH DANS LA VRAIE VIE

```js
// chercher dans un dictionnaire de mots (millions d'entrées)
// chercher un ID dans une liste triée d'utilisateurs
// chercher un timestamp dans un log trié par date

// exemple pratique : trouver le premier élément >= threshold
function lowerBound(arr, target) {
 let low = 0
 let high = arr.length

 while (low < high) {
  const mid = low + Math.floor((high - low) / 2)
  if (arr[mid] < target) low = mid + 1
  else high = mid
 }

 return low // index du premier élément >= target (-1 si tous < target)
}

const scores = [10, 20, 30, 40, 50, 60, 70, 80]
console.log(lowerBound(scores, 35)) // 3 (index de 40, premier >= 35)
console.log(lowerBound(scores, 30)) // 2 (index de 30 lui-même)
console.log(lowerBound(scores, 85)) // 8 (past-the-end : tous sont < 85)
```

---

## EXERCICES

## EXO 1 : Binary search sur le classement des buteurs
_~10 min_

Tu as un tableau trié de joueurs `{ nom, goals }` trié par `goals` croissant. Trouve l'index du joueur avec exactement N buts. Si aucun joueur n'a ce nombre exact, retourne -1.

```js
const buteurs = [
 { nom: "Bellingham", goals: 18 },
 { nom: "Salah", goals: 24 },
 { nom: "Messi", goals: 30 },
 { nom: "Mbappé", goals: 35 },
 { nom: "Haaland", goals: 42 },
]
findByGoals(buteurs, 30) // 2 (index de Messi)
findByGoals(buteurs, 25) // -1
```

---

## EXO 2 : Première et dernière occurrence
_~12 min_

Dans un tableau trié avec doublons, trouve l'index de la première ET de la dernière occurrence de `target`. Utilise deux binary searches modifiés.

```js
const butsPar = [1, 2, 2, 2, 3, 4, 4, 5]
findRange(butsPar, 2) // [1, 3] (index 1 à 3)
findRange(butsPar, 4) // [5, 6]
findRange(butsPar, 6) // [-1, -1] (absent)
```

(indice : pour trouver la première : `lowerBound`. Pour la dernière : `upperBound - 1`)

---

## EXO 3 : Comparaison de performance
_~15 min_

Génère un tableau de 1 million d'entiers triés. Effectue 10 000 recherches aléatoires avec `linearSearch` puis avec `binarySearch`. Mesure le temps total des 10 000 recherches pour chaque méthode. Le rapport de vitesse doit approcher n / log(n) = 1 000 000 / 20 = 50 000x. Vérifie-le.

---

## RÉSUMÉ

Linear search : O(n), fonctionne sur n'importe quoi, simple. Binary search : O(log n) sur un tableau trié, divise l'espace de recherche par deux à chaque étape. Sur 1 million d'éléments, binary search fait 20 comparaisons là où linear search en fait 1 million. La condition non négociable : le tableau doit être trié. Si tu tries pour une seule recherche, tu perds. Binary search n'a de sens qu'avec des recherches répétées sur des données triées.
