---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LE HEAP : LA STRUCTURE QUI CONNAÎT TOUJOURS LE MEILLEUR
Temps de lecture ~11 min

Tu as 10 000 joueurs. Tu veux toujours savoir qui a le meilleur xG cette saison.
Solution naïve : trier les 10 000 à chaque ajout. O(n log n) à chaque update. Catastrophe.

Solution correcte : un heap.
Un heap garde toujours le max (ou le min) accessible en O(1).
Insérer un nouvel élément : O(log n).
Retirer le meilleur : O(log n).

C'est la structure derrière Dijkstra, les priority queues, les schedulers, les systèmes de ranking.
Si tu comprends le heap, tu comprends comment les algos rapides restent rapides.

---

## 1) LA PROPRIÉTÉ HEAP : L'ORDRE QUI COMPTE

Un heap est un **arbre binaire presque complet** avec une contrainte simple.

Pour un **max-heap** : chaque noeud est plus grand ou égal à ses enfants.
Pour un **min-heap** : chaque noeud est plus petit ou égal à ses enfants.

Max-heap example (les meilleurs scoreurs) :
```
      Mbappé(35)
     /      \
  Haaland(31)   Salah(28)
  /   \     /   \
Kane(24) Benzema(22) Son(18) Lewandowski(24)
```

Ce que cette structure garantit :
- la racine = toujours le max
- un enfant n'est JAMAIS plus grand que son parent
- pas de garantie entre frères/soeurs : Kane(24) et Lewandowski(24) peuvent être dans n'importe quel ordre

Ce que cette structure ne garantit PAS :
- un ordre total de gauche à droite : c'est PAS un BST
- accès rapide à n'importe quel élément sauf le sommet

---

## 2) REPRÉSENTATION EN TABLEAU : L'ASTUCE QUI SIMPLIFIE TOUT

On stocke le heap dans un tableau. L'arbre est implicite : pas de pointeurs.

```
Arbre :
      Mbappé(35)     index 0
     /      \
  Haaland(31)   Salah(28) index 1, 2
  /   \
Kane(24) Benzema(22)      index 3, 4

Tableau : [35, 31, 28, 24, 22]
      0  1  2  3  4
```

Formules pour naviguer :
```
parent(i)   = Math.floor((i - 1) / 2)
enfantGauche(i) = 2 * i + 1
enfantDroit(i) = 2 * i + 2
```

Vérification sur l'exemple :
```
enfantGauche(0) = 1 => tableau[1] = 31 (Haaland)
enfantDroit(0) = 2 => tableau[2] = 28 (Salah)
parent(3)    = 1 => tableau[1] = 31 (Haaland, parent de Kane)
```

Pourquoi c'est brillant : pas d'allocation de noeuds, pas de pointeurs, cache-friendly.
Un arbre de n éléments = un tableau de n éléments. Rien de plus.

---

## 3) IMPLÉMENTATION : LE MAX-HEAP

```js
class MaxHeap {
 constructor() {
  this.data = []
 }

 size() {
  return this.data.length
 }

 peek() {
  // O(1) : la racine est toujours le max
  return this.data[0] ?? null
 }

 // index helpers
 _parent(i)   { return Math.floor((i - 1) / 2) }
 _leftChild(i)  { return 2 * i + 1 }
 _rightChild(i) { return 2 * i + 2 }

 _swap(i, j) {
  [this.data[i], this.data[j]] = [this.data[j], this.data[i]]
 }

 insert(value) {
  // on ajoute en fin de tableau (feuille)
  this.data.push(value)
  // puis on remonte jusqu'à ce que la propriété heap soit restaurée
  this._bubbleUp(this.data.length - 1)
 }

 _bubbleUp(index) {
  while (index > 0) {
   const parentIndex = this._parent(index)

   if (this.data[parentIndex] < this.data[index]) {
    // le parent est plus petit que l'enfant : violation de la propriété heap
    // on échange et on continue à monter
    this._swap(parentIndex, index)
    index = parentIndex
   } else {
    break // propriété heap respectée : on arrête
   }
  }
 }

 extractMax() {
  if (this.data.length === 0) return null
  if (this.data.length === 1) return this.data.pop()

  const max = this.data[0]

  // on met la dernière feuille à la racine
  // puis on la fait descendre
  this.data[0] = this.data.pop()
  this._siftDown(0)

  return max
 }

 _siftDown(index) {
  const n = this.data.length

  while (true) {
   let plus_grand = index
   const gauche = this._leftChild(index)
   const droite = this._rightChild(index)

   // trouver le plus grand parmi le noeud, son fils gauche, son fils droit
   if (gauche < n && this.data[gauche] > this.data[plus_grand]) {
    plus_grand = gauche
   }
   if (droite < n && this.data[droite] > this.data[plus_grand]) {
    plus_grand = droite
   }

   if (plus_grand !== index) {
    // le noeud courant n'est pas le plus grand : on descend
    this._swap(index, plus_grand)
    index = plus_grand
   } else {
    break // on est à la bonne place
   }
  }
 }
}
```

---

## 4) TRACE D'EXÉCUTION : VOIR LE HEAP VIVRE

```
MaxHeap vide : []

insert(10) :
 data = [10]
 bubbleUp(0) : index=0, rien à faire

insert(20) :
 data = [10, 20]
 bubbleUp(1) : parent(1)=0, data[0]=10 < data[1]=20 --> swap
 data = [20, 10]

insert(15) :
 data = [20, 10, 15]
 bubbleUp(2) : parent(2)=0, data[0]=20 > data[2]=15 --> stop
 data = [20, 10, 15]

insert(25) :
 data = [20, 10, 15, 25]
 bubbleUp(3) : parent(3)=1, data[1]=10 < data[3]=25 --> swap
 data = [20, 25, 15, 10]
 bubbleUp(1) : parent(1)=0, data[0]=20 < data[1]=25 --> swap
 data = [25, 20, 15, 10]

extractMax() :
 max = 25
 data[0] = data.pop() => data = [10, 20, 15]
 siftDown(0) :
  plus_grand = 0, gauche=1 (20>10 --> plus_grand=1), droite=2 (15<20 --> pas de changement)
  plus_grand=1 !== 0 --> swap(0,1)
  data = [20, 10, 15]
  siftDown(1) :
   gauche=3 (hors limites), droite=4 (hors limites)
   plus_grand=1 --> stop
 retourne 25
```

---

## 5) LE MIN-HEAP : JUSTE UNE INVERSION

Min-heap = exactement le même code, mais on inverse les comparaisons.
Au lieu de "le parent doit être plus grand", "le parent doit être plus petit".

```js
class MinHeap {
 constructor() {
  this.data = []
 }

 peek()  { return this.data[0] ?? null }
 size()  { return this.data.length }

 _parent(i)   { return Math.floor((i - 1) / 2) }
 _leftChild(i) { return 2 * i + 1 }
 _rightChild(i) { return 2 * i + 2 }
 _swap(i, j)  { [this.data[i], this.data[j]] = [this.data[j], this.data[i]] }

 insert(value) {
  this.data.push(value)
  this._bubbleUp(this.data.length - 1)
 }

 _bubbleUp(index) {
  while (index > 0) {
   const p = this._parent(index)
   if (this.data[p] > this.data[index]) { // inversion : parent > enfant = violation
    this._swap(p, index)
    index = p
   } else {
    break
   }
  }
 }

 extractMin() {
  if (this.data.length === 0) return null
  if (this.data.length === 1) return this.data.pop()

  const min = this.data[0]
  this.data[0] = this.data.pop()
  this._siftDown(0)
  return min
 }

 _siftDown(index) {
  const n = this.data.length

  while (true) {
   let plus_petit = index
   const g = this._leftChild(index)
   const d = this._rightChild(index)

   if (g < n && this.data[g] < this.data[plus_petit]) plus_petit = g
   if (d < n && this.data[d] < this.data[plus_petit]) plus_petit = d

   if (plus_petit !== index) {
    this._swap(index, plus_petit)
    index = plus_petit
   } else {
    break
   }
  }
 }
}
```

---

## 6) HEAPIFY : CONSTRUIRE UN HEAP DEPUIS UN TABLEAU EXISTANT

Si t'as déjà un tableau et tu veux en faire un heap, tu peux faire n inserts : O(n log n).
Ou tu fais `heapify` : O(n). Deux fois plus rapide sur un grand tableau.

L'idée : les feuilles sont déjà des heaps valides (un seul élément respecte tout).
On commence au dernier noeud interne et on siftDown vers le haut.

```js
function heapifyMax(arr) {
 const n = arr.length

 // le dernier noeud interne est à Math.floor(n/2) - 1
 // les éléments après sont des feuilles : déjà OK
 for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
  siftDownInPlace(arr, i, n)
 }

 return arr // modifié en place
}

function siftDownInPlace(arr, index, n) {
 while (true) {
  let plus_grand = index
  const g = 2 * index + 1
  const d = 2 * index + 2

  if (g < n && arr[g] > arr[plus_grand]) plus_grand = g
  if (d < n && arr[d] > arr[plus_grand]) plus_grand = d

  if (plus_grand !== index) {
   [arr[index], arr[plus_grand]] = [arr[plus_grand], arr[index]]
   index = plus_grand
  } else {
   break
  }
 }
}

// Classement des buteurs à heapifier
const buteurs = [18, 35, 22, 24, 31, 28, 24]
heapifyMax(buteurs)
// => [35, 31, 28, 24, 22, 18, 24]
//   ^-- Mbappé toujours au sommet
```

Pourquoi O(n) et pas O(n log n) ?
Parce que les noeuds proches des feuilles ont peu de chemin à descendre.
La majorité des noeuds sont des feuilles (O(n/2)) et font 0 opérations.
Les noeuds du niveau au-dessus font au plus 1 swap.
La somme géométrique de tout ça converge vers O(n).

---

## 7) LE PIÈGE CLASSIQUE : HEAP ≠ TRI COMPLET

Le heap ne trie pas tout. Il garantit juste que la racine est le max (ou min).

```js
const h = new MaxHeap()
h.insert(10)
h.insert(5)
h.insert(8)
h.insert(3)
h.insert(7)

// data pourrait être [10, 7, 8, 3, 5]
// 10 est bien le max
// mais 7 et 8 ne sont pas forcément dans l'ordre

// si tu veux les éléments triés :
const trie = []
while (h.size() > 0) {
 trie.push(h.extractMax())
}
// => [10, 8, 7, 5, 3] -- maintenant c'est trié (heap sort)
// mais tu as vidé le heap pour ça
```

Si tu veux itérer sur tous les éléments dans l'ordre : heap sort ou simple Array.sort.
Le heap, c'est pour accéder au max/min **sans avoir besoin du reste trié**.

---

## EXERCICES

## EXO 1 : LE CLASSEMENT DE L'ÉQUIPE
_~15 min_


T'as un tableau de joueurs `{ nom, buts, passes }`.
Implémenter un `MaxHeap` qui compare par `buts + passes` (contributions totales).
- `insert(joueur)` : ajouter un joueur
- `extractBest()` : retirer et retourner le meilleur contributeur
- `top(n)` : retourner les n meilleurs sans vider le heap

(Indice : top(n) nécessite d'extraire n fois puis de réinsérer, ou de copier le heap.)

---

## EXO 2 : LE STREAM DE DONNÉES
_~20 min_


Tu reçois un stream de valeurs une par une (simulation de données live d'un match).
À chaque nouvelle valeur, tu dois pouvoir répondre : "quelle est la médiane actuelle ?"

La médiane c'est la valeur du milieu : si 5 valeurs, c'est la 3ème quand elles sont triées.

Utiliser deux heaps :
- un max-heap pour la moitié basse (les petites valeurs)
- un min-heap pour la moitié haute (les grandes valeurs)

La médiane = soit la racine d'un des deux heaps (si tailles inégales), soit la moyenne des deux racines.

Implémenter `MedianTracker` :
- `ajouter(valeur)` : ajoute la valeur et rééquilibre les deux heaps
- `mediane()` : retourne la médiane courante en O(1)

---

## EXO 3 : HEAP SORT
_~25 min_


Implémenter `heapSort(arr)` en utilisant `heapify` + `extractMax` successifs.
L'algorithme doit trier en place sans tableau auxiliaire.

Complexité cible : O(n log n) temps, O(1) espace supplémentaire.

(Indice : après heapify, la racine est le max. Swap racine avec le dernier élément, réduis la taille effective du heap de 1, siftDown depuis la racine. Répète.)

---

## RÉSUMÉ

Le heap est un arbre binaire dans un tableau : parent(i) = floor((i-1)/2), enfants = 2i+1 et 2i+2.
Max-heap : parent >= enfants. Min-heap : parent <= enfants.
Insert : on ajoute en fin, on bubbleUp. O(log n).
ExtractMax/Min : on prend la racine, on met la dernière feuille à la place, on siftDown. O(log n).
Peek : accès au max/min en O(1) : c'est la raison d'être du heap.
Heapify depuis un tableau existant : O(n), pas O(n log n).
Le heap ne trie pas tout : il garantit juste l'accès rapide au meilleur.
