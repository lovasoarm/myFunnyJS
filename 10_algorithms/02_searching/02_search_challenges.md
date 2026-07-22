---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# SEARCH CHALLENGES : LES VARIANTES QUI PIÈGENT
Temps de lecture ~11 min

Binary search basique c'est acquis. Maintenant les cas qui font planter les gens aux entretiens et en prod.

Trois scénarios : tableau rotaté, matrice 2D, recherche dans un stream. Chaque fois, la même question : est-ce que je peux encore appliquer binary search ? Et si oui, comment j'adapte la condition de split ?

---

## 1) ROTATED SORTED ARRAY : LE TABLEAU QUI A GLISSÉ

Imagine un classement trié `[1, 3, 5, 7, 9, 11]` qui a "glissé" :
`[7, 9, 11, 1, 3, 5]`

Il y a un pivot de rotation. À gauche : trié. À droite : trié. L'ensemble : pas trié.

Binary search classique ne marche plus directement. Mais on peut l'adapter.

```
[4, 5, 6, 7, 0, 1, 2]  cible = 0
     ^
    mid = 7

7 > 4 (arr[low]) --> la moitié gauche [4,5,6,7] est triée
0 < 4 ou 0 > 7 --> la cible n'est pas dans [4..7]
donc cherche à droite : [0, 1, 2]
```

```js
function searchRotated(arr, target) {
 let low = 0
 let high = arr.length - 1

 while (low <= high) {
  const mid = low + Math.floor((high - low) / 2)

  if (arr[mid] === target) return mid

  // détermine quelle moitié est triée
  if (arr[low] <= arr[mid]) {
   // moitié gauche triée
   if (target >= arr[low] && target < arr[mid]) {
    // la cible est dans la moitié gauche
    high = mid - 1
   } else {
    // la cible est dans la moitié droite
    low = mid + 1
   }
  } else {
   // moitié droite triée
   if (target > arr[mid] && target <= arr[high]) {
    // la cible est dans la moitié droite
    low = mid + 1
   } else {
    // la cible est dans la moitié gauche
    high = mid - 1
   }
  }
 }

 return -1
}

console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)) // 4
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 3)) // -1
console.log(searchRotated([1], 0))           // -1
console.log(searchRotated([1], 1))           // 0
```

**Complexité :** O(log n). On divise toujours par deux, on regarde juste quelle moitié est triée avant de décider.

---

## 2) VARIANTE : TROUVER LE PIVOT DE ROTATION

Parfois tu veux juste trouver le plus petit élément (= l'index du pivot).

```js
function findRotationPivot(arr) {
 let low = 0
 let high = arr.length - 1

 // si pas rotaté : le minimum est en position 0
 if (arr[low] <= arr[high]) return 0

 while (low < high) {
  const mid = low + Math.floor((high - low) / 2)

  if (arr[mid] > arr[high]) {
   // le pivot est dans la moitié droite
   low = mid + 1
  } else {
   // le pivot est dans la moitié gauche (ou c'est mid lui-même)
   high = mid
  }
 }

 return low // index du minimum
}

console.log(findRotationPivot([4, 5, 6, 7, 0, 1, 2])) // 4 (valeur 0)
console.log(findRotationPivot([1, 2, 3, 4, 5]))    // 0 (pas rotaté)
```

---

## 3) MATRIX SEARCH : BINARY SEARCH SUR UNE GRILLE

Tu as une matrice `m x n` où :
- chaque ligne est triée de gauche à droite
- la première valeur de chaque ligne est plus grande que la dernière valeur de la ligne précédente

```
[[ 1, 3, 5, 7],
 [10, 11, 16, 20],
 [23, 30, 34, 60]]

C'est un tableau trié "aplati" en 2D.
```

**Approche naïve :** binary search sur chaque ligne = O(m log n). Peut mieux faire.

**Approche optimale :** traiter la matrice comme un tableau 1D aplati. Binary search sur les indices 0 à m*n-1. Convertir l'index en `(row, col)`.

```js
function searchMatrix(matrix, target) {
 const m = matrix.length
 const n = matrix[0].length
 let low = 0
 let high = m * n - 1

 while (low <= high) {
  const mid = low + Math.floor((high - low) / 2)

  // convertir l'index 1D en coordonnées 2D
  const row = Math.floor(mid / n)
  const col = mid % n
  const val = matrix[row][col]

  if (val === target) return [row, col]
  if (val < target)  low = mid + 1
  else        high = mid - 1
 }

 return null // pas trouvé
}

const matrix = [
 [ 1, 3, 5, 7],
 [10, 11, 16, 20],
 [23, 30, 34, 60]
]

console.log(searchMatrix(matrix, 3))  // [0, 1]
console.log(searchMatrix(matrix, 13)) // null
console.log(searchMatrix(matrix, 34)) // [2, 2]
```

**Complexité :** O(log(m*n)) = O(log m + log n).

---

## 4) VARIANTE : MATRICE PARTIELLEMENT TRIÉE

```
[[ 1, 4, 7, 11],
 [ 2, 5, 8, 12],
 [ 3, 6, 9, 16],
 [10, 13, 14, 17]]
```

Ici : chaque ligne est triée, chaque colonne est triée, mais la première valeur d'une ligne n'est pas forcément plus grande que la dernière de la ligne précédente.

Binary search sur tableau aplati ne marche plus. Solution : partir du coin supérieur droit.

```js
function searchMatrixII(matrix, target) {
 let row = 0
 let col = matrix[0].length - 1

 // depuis le coin supérieur droit :
 // si valeur > target : col-- (élimine toute la colonne)
 // si valeur < target : row++ (élimine toute la ligne)
 // si égale : trouvé

 while (row < matrix.length && col >= 0) {
  const val = matrix[row][col]

  if (val === target) return [row, col]
  if (val > target)  col-- // trop grand : élimine la colonne
  else        row++ // trop petit : élimine la ligne
 }

 return null
}

const matrix2 = [
 [ 1, 4, 7, 11],
 [ 2, 5, 8, 12],
 [ 3, 6, 9, 16],
 [10, 13, 14, 17]
]

console.log(searchMatrixII(matrix2, 5))  // [1, 1]
console.log(searchMatrixII(matrix2, 20)) // null
```

**Complexité :** O(m + n). Pas O(log n) ici, mais optimal pour ce type de matrice.

---

## 5) SEARCH IN STREAM : QUAND TU N'AS PAS LA TAILLE

Tu reçois des données en streaming. Tu ne connais pas la longueur. Impossible de calculer `high = arr.length - 1`. Que faire ?

```js
// API simulée : tableau de taille inconnue
// getElement(i) retourne arr[i] ou Infinity si hors limites
function createStream(arr) {
 return {
  get: (i) => i < arr.length ? arr[i] : Infinity
 }
}

function searchInfiniteArray(stream, target) {
 // d'abord, trouver des bornes : doubler jusqu'à dépasser la cible
 let low = 0
 let high = 1

 while (stream.get(high) < target) {
  low = high
  high *= 2 // exponentiel : O(log n) pour trouver les bornes
 }

 // maintenant binary search dans [low, high]
 while (low <= high) {
  const mid = low + Math.floor((high - low) / 2)
  const val = stream.get(mid)

  if (val === target) return mid
  if (val < target)  low = mid + 1
  else        high = mid - 1
 }

 return -1
}

const stream = createStream([1, 3, 5, 7, 9, 11, 13, 15, 17, 19])
console.log(searchInfiniteArray(stream, 13)) // 6
console.log(searchInfiniteArray(stream, 4))  // -1
```

**Complexité :** O(log n) pour trouver les bornes + O(log n) pour binary search = O(log n).

---

## 6) LE CAS QUI CASSE TOUT : DOUBLONS DANS LE TABLEAU ROTATÉ

```js
// [1, 3, 1, 1, 1] : le tableau rotaté avec doublons
// arr[low] === arr[mid] : impossible de savoir quelle moitié est triée

function searchRotatedWithDuplicates(arr, target) {
 let low = 0
 let high = arr.length - 1

 while (low <= high) {
  const mid = low + Math.floor((high - low) / 2)

  if (arr[mid] === target) return true

  // cas ambigu : arr[low] === arr[mid]
  // on ne sait pas quelle moitié est triée
  if (arr[low] === arr[mid] && arr[mid] === arr[high]) {
   low++  // recule d'un pas : O(n) dans le pire cas avec beaucoup de doublons
   high--
  } else if (arr[low] <= arr[mid]) {
   if (target >= arr[low] && target < arr[mid]) high = mid - 1
   else low = mid + 1
  } else {
   if (target > arr[mid] && target <= arr[high]) low = mid + 1
   else high = mid - 1
  }
 }

 return false
}

// avec doublons : pire cas O(n), pas O(log n) garanti
console.log(searchRotatedWithDuplicates([2, 5, 6, 0, 0, 1, 2], 0)) // true
console.log(searchRotatedWithDuplicates([2, 5, 6, 0, 0, 1, 2], 3)) // false
```

---

## EXERCICES

## EXO 1 : Trouver le minimum dans un tableau rotaté
_~20 min_

Le tableau a été rotaté k fois (k inconnu). Trouve le minimum en O(log n).

```js
findMin([3, 4, 5, 1, 2])  // 1
findMin([4, 5, 6, 7, 0, 1, 2]) // 0
findMin([11, 13, 15, 17]) // 11 (pas rotaté)
```

---

## EXO 2 : Recherche multi-cibles dans une matrice
_~15 min_

Tu as la matrice triée ligne+colonne (type II). Trouve toutes les positions de plusieurs cibles en une seule traversée de la matrice.

```js
const matrix = [[ 1, 4, 7, 11], [ 2, 5, 8, 12], [ 3, 6, 9, 16]]
searchMultiple(matrix, [5, 9, 20])
// { 5: [1,1], 9: [2,2], 20: null }
```

---

## EXO 3 : Peak element
_~20 min_

Un "peak element" est un élément plus grand que ses voisins. Trouve l'index d'un peak en O(log n). Il peut y en avoir plusieurs, retourne n'importe lequel.

```js
findPeak([1, 2, 3, 1])     // 2 (valeur 3)
findPeak([1, 2, 1, 3, 5, 6, 4]) // 5 ou 6 (valeur 6)
findPeak([1])         // 0
```

(indice : si `arr[mid] > arr[mid+1]`, il existe un peak dans la moitié gauche ou mid lui-même est un peak)

---

## RÉSUMÉ

Binary search s'adapte à bien plus que les tableaux triés basiques. Tableau rotaté : identifier quelle moitié est triée, chercher dans celle qui contient la plage cible. Matrice 2D totalement triée : binary search sur les indices 1D aplatis. Matrice partiellement triée : partir du coin supérieur droit, éliminer lignes ou colonnes. Stream infini : doubler les bornes exponentiellement avant de binary searcher. Dans chaque cas, la question est : est-ce que je peux éliminer la moitié de l'espace de recherche à chaque étape ?
