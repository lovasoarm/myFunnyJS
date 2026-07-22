---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# QUICK SORT : LE PLUS RAPIDE EN PRATIQUE, LE MOINS STABLE EN THÉORIE
Temps de lecture ~9 min

Merge sort est prévisible et stable. Quick sort est imprévisible et agressif. En pratique, Quick sort gagne presque toujours.

L'idée : choisir un pivot, mettre tout ce qui est plus petit à gauche, tout ce qui est plus grand à droite. Le pivot est à sa place définitive. Recommencer sur chaque moitié.

C'est exactement le plan d'évasion de Michael Scofield : identifier le point central, séparer les obstacles à gauche et à droite, et traiter chaque zone séparément. Aucune étape de "fusion" nécessaire. En place.

---

## 1) LE MÉCANISME : PARTITION

La partition est le coeur de Quick sort. Tout repose là-dessus.

```
Tableau : [3, 6, 8, 10, 1, 2, 1]
Pivot choisi : dernier élément = 1

Parcours :
[3] > 1 --> reste à droite
[6] > 1 --> reste à droite
[8] > 1 --> reste à droite
[10] > 1 --> reste à droite
[1] <= 1 --> passe à gauche
[2] > 1 --> reste à droite
[1] <= 1 --> passe à gauche (c'est le pivot)

Résultat : [1, 1, 8, 10, 6, 2, 3]
        ^
        le pivot est à sa place définitive (index 1 dans cet exemple)
```

```
Avant partition :
[3, 6, 8, 10, 1, 2, 1]
           ^pivot

Après partition :
[1, 1 | 8, 10, 6, 2, 3]
    ^
    pivotIndex : tout à gauche est <= pivot
          tout à droite est > pivot
```

---

## 2) IMPLÉMENTATION

```js
function quickSort(arr, low = 0, high = arr.length - 1) {
 if (low >= high) return arr // cas de base : sous-tableau de 0 ou 1 élément

 const pivotIndex = partition(arr, low, high)

 // trier récursivement les deux moitiés
 quickSort(arr, low, pivotIndex - 1)
 quickSort(arr, pivotIndex + 1, high)

 return arr
}

function partition(arr, low, high) {
 const pivot = arr[high] // on prend le dernier comme pivot
 let i = low - 1 // i = index de la dernière valeur <= pivot

 for (let j = low; j < high; j++) {
  if (arr[j] <= pivot) {
   i++
   // swap : arr[j] passe dans la zone gauche
   ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
 }

 // on place le pivot à sa position finale
 ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]

 return i + 1 // index final du pivot
}

const scores = [38, 27, 43, 3, 9, 82, 10]
console.log(quickSort([...scores]))
// [3, 9, 10, 27, 38, 43, 82]
```

**Important :** Quick sort trie en place. Il mute le tableau d'entrée. Si tu veux garder l'original, passe `[...arr]`.

---

## 3) LE PROBLÈME DU PIVOT : LE CAS QUI CASSE

```
Tableau trié : [1, 2, 3, 4, 5]
Pivot = dernier élément = 5

Partition :
[1, 2, 3, 4 | 5]
       ^ pivot à sa place

Récursion gauche : [1, 2, 3, 4]
Pivot = 4
[1, 2, 3 | 4]

Récursion gauche : [1, 2, 3]
...
```

Sur un tableau déjà trié avec pivot = dernier élément :
- À chaque étape, la partition est totalement déséquilibrée
- Un sous-tableau de taille n-1 d'un côté, 0 de l'autre
- On obtient O(n²) : exactement ce qu'on voulait éviter

```
Partitions équilibrées (idéal) :
     [1..n]
    /    \
  [1..n/2] [n/2..n]  log n niveaux x n opérations = O(n log n)

Partitions déséquilibrées (pire cas) :
  [1..n]
  /    \
 []    [1..n-1]
      /   \
     []    [1..n-2]  n niveaux x n opérations = O(n²)
```

---

## 4) LA SOLUTION : PIVOT ALÉATOIRE

```js
function quickSortRandom(arr, low = 0, high = arr.length - 1) {
 if (low >= high) return arr

 const pivotIndex = partitionRandom(arr, low, high)
 quickSortRandom(arr, low, pivotIndex - 1)
 quickSortRandom(arr, pivotIndex + 1, high)

 return arr
}

function partitionRandom(arr, low, high) {
 // on choisit un pivot aléatoire et on le met en dernier
 const randomIndex = low + Math.floor(Math.random() * (high - low + 1))
 ;[arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]]

 // le reste c'est exactement partition() d'avant
 return partition(arr, low, high)
}
```

Avec un pivot aléatoire, la probabilité de tomber sur le pire cas à chaque niveau devient astronomiquement faible. En pratique : O(n log n) moyen garanti.

---

## 5) QUICK SORT VS MERGE SORT : LA VRAIE DIFFÉRENCE

```
          Quick Sort     Merge Sort
Complexité moy.  O(n log n)     O(n log n)
Complexité pire  O(n²)        O(n log n)
Mémoire      O(log n) stack   O(n) tableaux
Stable       NON         OUI
Cache-friendly   OUI (in-place)   moins (allocations)
Usage réel     V8 pour primitives Tim Sort (grands tris)
```

Quick sort est plus rapide en pratique parce qu'il est **cache-friendly** : il travaille sur le même tableau en mémoire, sans créer de nouvelles allocations. Le processeur précharge les données adjacentes. Moins de cache miss.

```js
// Quick sort n'est PAS stable
// ce comportement peut surprendre

const matchs = [
 { tour: 1, but: "Mbappé" },
 { tour: 3, but: "Messi" },
 { tour: 1, but: "Vinicius" }, // même tour que Mbappé
]

quickSort(matchs, ...) // ne garantit pas Mbappé avant Vinicius
// l'ordre des éléments de même valeur est imprévisible

// si tu tris des objets et que l'ordre des ex-aequo compte : utilise Merge Sort
```

---

## 6) THREE-WAY QUICK SORT : POUR LES TABLEAUX AVEC DOUBLONS

Si le tableau contient beaucoup de valeurs identiques, le Quick sort classique les compare inutilement.

```js
// Dutch National Flag partition (Dijkstra)
// 3 zones : < pivot | == pivot | > pivot

function quickSortThreeWay(arr, low = 0, high = arr.length - 1) {
 if (low >= high) return arr

 const pivot = arr[low]
 let lt = low  // arr[low..lt-1] < pivot
 let gt = high // arr[gt+1..high] > pivot
 let i = low  // pointeur courant

 while (i <= gt) {
  if (arr[i] < pivot) {
   ;[arr[lt], arr[i]] = [arr[i], arr[lt]]
   lt++
   i++
  } else if (arr[i] > pivot) {
   ;[arr[i], arr[gt]] = [arr[gt], arr[i]]
   gt-- // ne pas incrémenter i : l'élément swappé n'a pas encore été examiné
  } else {
   i++ // == pivot : déjà à sa place dans la zone du milieu
  }
 }

 // récursion sur les zones < et > seulement
 // la zone == pivot est déjà en place définitivement
 quickSortThreeWay(arr, low, lt - 1)
 quickSortThreeWay(arr, gt + 1, high)

 return arr
}

// sur un tableau avec beaucoup de doublons :
const beaucoupDeDoublons = [3, 3, 1, 3, 3, 2, 3, 1, 2]
console.log(quickSortThreeWay([...beaucoupDeDoublons]))
// [1, 1, 2, 2, 3, 3, 3, 3, 3]
```

---

## EXERCICES

## EXO 1 : Quick sort sur les stats de match
_~15 min_

Tu as un tableau de joueurs avec `{ nom, goals, assists }`. Implémente un quick sort qui trie par `goals + assists` décroissant (contributions totales). Utilise un pivot aléatoire.

```js
const joueurs = [
 { nom: "Mbappé", goals: 28, assists: 8 },
 { nom: "Messi", goals: 22, assists: 18 },
 { nom: "De Bruyne", goals: 9, assists: 21 },
 { nom: "Haaland", goals: 35, assists: 4 },
]
```

---

## EXO 2 : Kième plus petit élément
_~20 min_

Quick select : une variante de Quick sort pour trouver le kième plus petit élément en O(n) en moyenne, sans trier tout le tableau.

Algorithme : après partition, si le pivot tombe à l'index k, c'est notre réponse. Sinon on récurse seulement sur la moitié qui contient k.

```js
quickSelect([7, 2, 1, 6, 5, 3, 4], 3) // 3 (le 3ème plus petit)
quickSelect([7, 2, 1, 6, 5, 3, 4], 1) // 1 (le minimum)
```

---

## EXO 3 : Détecter le pire cas
_~20 min_

Génère 5 tableaux de taille 1000 :
- trié croissant
- trié décroissant
- aléatoire
- tous identiques
- presque trié (1 inversion)

Applique Quick sort avec pivot = dernier élément sur chacun. Mesure le temps. Lequel est le plus lent ? Pourquoi ? Maintenant applique la version avec pivot aléatoire. Est-ce que le pire cas disparaît ?

---

## RÉSUMÉ

Quick sort choisit un pivot, partitionne le tableau en deux zones (< et >) autour de lui, et récurse. Le pivot est à sa place définitive après chaque partition. Sans récursion de fusion : tout se passe en place en O(log n) de stack. Le pire cas O(n²) arrive sur des tableaux déjà triés avec un pivot mal choisi : un pivot aléatoire l'élimine en pratique. Quick sort n'est pas stable mais il est cache-friendly et rapide sur des données réelles. V8 l'utilise pour trier des primitives.
