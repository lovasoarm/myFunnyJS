---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# FENWICK TREE : SOMMES DE PRÉFIXES EN O(log n)
Temps de lecture ~9 min

Problème : un tableau de valeurs qui change en permanence. À chaque instant tu dois pouvoir répondre à "quelle est la somme des éléments entre l'index 2 et l'index 7 ?". Naïvement : O(n) par requête. Avec un tableau de préfixes statique : O(1) par requête mais O(n) par update. Le Fenwick Tree (Binary Indexed Tree) : O(log n) pour les deux.

Cas réels : scores cumulés en temps réel, statistiques de match live, fréquences dans des algorithmes de compression.

---

## 1) LE PROBLÈME

```
Tableau de stats de passes par minute pendant un match :
[3, 1, 4, 1, 5, 9, 2, 6]
 0 1 2 3 4 5 6 7

Requête : somme entre minute 2 et minute 5 ?
Naïf : arr[2] + arr[3] + arr[4] + arr[5] = 4+1+5+9 = 19 : O(n)

Update : Messi vient de faire 3 passes de plus à la minute 3 → arr[3] += 3
Tableau de préfixes : il faut tout recalculer : O(n)

Fenwick Tree :
 update(3, +3) : O(log n)
 query(2, 5)  : O(log n)
```

---

## 2) L'ASTUCE BINAIRE

Le Fenwick Tree utilise la représentation binaire des indices pour décider quels éléments chaque case "couvre".

```
Index en binaire :
1 = 001 → couvre 1 élément (lui-même)
2 = 010 → couvre 2 éléments (indices 1..2)
3 = 011 → couvre 1 élément (lui-même)
4 = 100 → couvre 4 éléments (indices 1..4)
5 = 101 → couvre 1 élément (lui-même)
6 = 110 → couvre 2 éléments (indices 5..6)
7 = 111 → couvre 1 élément (lui-même)
8 = 1000 → couvre 8 éléments (indices 1..8)
```

La règle : le nombre d'éléments couverts par l'index i = le bit le plus bas de i (lowbit).

```
lowbit(i) = i & (-i)

lowbit(6) = 6 & (-6) = 110 & 010 = 010 = 2 → couvre 2 éléments
lowbit(4) = 4 & (-4) = 100 & 100 = 100 = 4 → couvre 4 éléments
```

---

## 3) IMPLÉMENTATION

Le Fenwick Tree est 1-indexé (l'index 0 est ignoré).

```js
class FenwickTree {
 constructor(n) {
  // tree[i] contient la somme partielle selon la règle lowbit
  this.tree = new Array(n + 1).fill(0)
  this.n  = n
 }

 // bit le plus bas : la clé de toute la structure
 _lowbit(i) {
  return i & (-i)
 }

 // update : ajoute delta à l'index i (1-indexé)
 // propage la mise à jour vers le haut en O(log n)
 update(i, delta) {
  while (i <= this.n) {
   this.tree[i] += delta
   i += this._lowbit(i) // monte au parent responsible
  }
 }

 // prefix sum : somme de tree[1..i] en O(log n)
 prefixSum(i) {
  let sum = 0
  while (i > 0) {
   sum += this.tree[i]
   i -= this._lowbit(i) // descend au sous-arbre précédent
  }
  return sum
 }

 // range sum : somme de tree[l..r] en O(log n)
 rangeSum(l, r) {
  return this.prefixSum(r) - this.prefixSum(l - 1)
 }
}
```

---

## 4) CONSTRUIRE DEPUIS UN TABLEAU EXISTANT

```js
// O(n log n) : appeler update pour chaque élément
function buildFromArray(arr) {
 const ft = new FenwickTree(arr.length)
 for (let i = 0; i < arr.length; i++) {
  ft.update(i + 1, arr[i]) // +1 : 1-indexé
 }
 return ft
}

// O(n) : méthode plus efficace
function buildFromArrayFast(arr) {
 const n = arr.length
 const ft = new FenwickTree(n)
 // copie directe
 for (let i = 1; i <= n; i++) ft.tree[i] = arr[i - 1]
 // propage vers le haut
 for (let i = 1; i <= n; i++) {
  const parent = i + (i & (-i))
  if (parent <= n) ft.tree[parent] += ft.tree[i]
 }
 return ft
}
```

---

## 5) EN ACTION : STATS DE MATCH LIVE

Le dashboard des Ultras reçoit les stats de passes d'un match de Champions League en temps réel. L'entraîneur demande des sommes sur des plages de minutes.

```js
// passes par minute (minutes 1 à 10)
const passes = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
const ft   = buildFromArray(passes)

// somme des passes entre la 3e et la 7e minute (1-indexé)
ft.rangeSum(3, 7) // 4 + 1 + 5 + 9 + 2 = 21

// Messi vient d'être crédité de 3 passes supplémentaires à la minute 4
ft.update(4, 3)

// recalcul instantané
ft.rangeSum(3, 7) // 4 + 4 + 5 + 9 + 2 = 24

// total sur tout le match (minutes 1 à 10)
ft.prefixSum(10)  // 39 + 3 = 42
```

---

## 6) TRACER UN UPDATE

Visualiser ce qui se passe quand on fait `update(3, +5)` sur un Fenwick Tree de taille 8 :

```
update(3, 5) :

i=3 : tree[3] += 5 (lowbit(3) = 1, prochain = 3+1 = 4)
i=4 : tree[4] += 5 (lowbit(4) = 4, prochain = 4+4 = 8)
i=8 : tree[8] += 5 (lowbit(8) = 8, prochain = 8+8 = 16 > n, stop)

Seulement 3 opérations pour n=8 : O(log 8) = O(3)
```

Et pour `prefixSum(7)` :

```
prefixSum(7) :

i=7 : sum += tree[7] (lowbit(7) = 1, prochain = 7-1 = 6)
i=6 : sum += tree[6] (lowbit(6) = 2, prochain = 6-2 = 4)
i=4 : sum += tree[4] (lowbit(4) = 4, prochain = 4-4 = 0, stop)

3 opérations pour n=8 : O(log 8) = O(3)
```

---

## 7) COMPARAISON

```
Structure       | Update  | Query (range sum) | Espace
Tableau brut      | O(1)   | O(n)        | O(n)
Tableau de préfixes  | O(n)   | O(1)        | O(n)
Fenwick Tree      | O(log n) | O(log n)      | O(n)
Segment Tree      | O(log n) | O(log n)      | O(4n)
```

Fenwick Tree vs Segment Tree : le Fenwick est plus simple à implémenter et plus compact en mémoire. Le Segment Tree supporte plus de types de requêtes (min, max, GCD, pas seulement la somme). Pour les sommes de préfixes dynamiques : Fenwick.

---

## EXERCICES

## EXO 1 : classement live du Ballon d'Or
_~20 min_


8 candidats ont des scores qui s'accumulent pendant la cérémonie. Les votes arrivent en temps réel.

```js
const candidats = ["Messi", "Mbappé", "Haaland", "Vinicius", "Bellingham", "Salah", "Kane", "Pedri"]
// scores initiaux (votes déjà comptés)
const scores = [120, 95, 88, 102, 79, 85, 91, 73]
```

Implémente avec Fenwick Tree :
- `addVotes(candidatIdx, votes)` : ajoute des votes au candidat
- `totalVotesInRange(l, r)` : total des votes pour les candidats entre l et r (1-indexé)
- `totalVotes()` : total général

Simule 5 updates en temps réel et affiche le total à chaque étape.

---

## EXO 2 : fréquence des artistes dans une playlist
_~25 min_


Une playlist trapsoul reçoit des écoutes en temps réel. Chaque artiste a un index.

Implémente un système qui :
- reçoit des écoutes une par une : `listen(artistIdx)`
- répond à : "combien d'écoutes pour les artistes entre index 3 et 7 ?" en O(log n)
- répond à : "quel artiste a le plus d'écoutes ?" en O(n log n) max

---

## EXO 3 : inversion count
_~20 min_


Problème classique de sorting : compter le nombre d'inversions dans un tableau (paires i < j où arr[i] > arr[j]). Une mesure du "désordre" du tableau.

```js
countInversions([3, 1, 2, 5, 4]) // 3 : (3,1), (3,2), (5,4)
countInversions([1, 2, 3, 4, 5]) // 0 : déjà trié
countInversions([5, 4, 3, 2, 1]) // 10 : complètement inversé
```

Implémente avec Fenwick Tree en O(n log n). Pour chaque élément, compte combien d'éléments déjà insérés sont plus grands que lui.

---

## RÉSUMÉ

Le Fenwick Tree (BIT) résout les range sum queries dynamiques en O(log n) pour les updates et les requêtes. La clé : `lowbit(i) = i & (-i)` détermine la portée de chaque case. 1-indexé. Plus simple qu'un Segment Tree pour les sommes pures. Cas d'usage : statistiques live, classements dynamiques, inversion count. Le code est court (~20 lignes) mais le raisonnement binaire sous-jacent est non trivial : comprendre `lowbit` est suffisant pour l'utiliser correctement.
