---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# MERGE SORT : DIVISER POUR RÉGNER EN O(n log n)
Temps de lecture ~8 min

Bubble sort te demandait de comparer chaque paire. Merge sort fait quelque chose de plus malin : il coupe le problème en deux, résout chaque moitié, puis fusionne les résultats.

C'est la même logique que l'attaque en formation des Chevaliers de Garo : diviser le champ de bataille, nettoyer chaque zone, reconsolider. O(n²) si tu essaies de tout gérer d'un coup. O(n log n) si tu divises intelligemment.

---

## 1) L'IDÉE : DIVISER JUSQU'À L'INDIVISIBLE

Un tableau de taille 1 est toujours trié. C'est le cas de base.

Merge sort exploite ça :
1. Couper le tableau en deux moitiés
2. Trier chaque moitié récursivement (même algo)
3. Fusionner les deux moitiés triées

```
[38, 27, 43, 3, 9, 82, 10]

      Diviser
     /    \
 [38, 27, 43]  [3, 9, 82, 10]
  /   \    /     \
[38] [27,43] [3,9]   [82,10]
    / \   / \     / \
   [27][43] [3] [9]   [82] [10]

      Fusionner
   [27,43]  [3,9]   [10,82]
 [27, 38, 43] [3, 9, 10, 82]
    [3, 9, 10, 27, 38, 43, 82]
```

---

## 2) IMPLÉMENTATION

```js
function mergeSort(arr) {
 // cas de base : un tableau de 0 ou 1 élément est déjà trié
 if (arr.length <= 1) return arr

 const mid = Math.floor(arr.length / 2)

 // diviser
 const left = mergeSort(arr.slice(0, mid))
 const right = mergeSort(arr.slice(mid))

 // fusionner les deux moitiés triées
 return merge(left, right)
}

function merge(left, right) {
 const result = []
 let i = 0 // pointeur gauche
 let j = 0 // pointeur droit

 // on compare les têtes des deux listes et on prend le plus petit
 while (i < left.length && j < right.length) {
  if (left[i] <= right[j]) {
   result.push(left[i])
   i++
  } else {
   result.push(right[j])
   j++
  }
 }

 // il reste peut-être des éléments dans une des deux listes
 // on les colle directement : ils sont déjà triés
 return result.concat(left.slice(i)).concat(right.slice(j))
}

console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]))
// [3, 9, 10, 27, 38, 43, 82]
```

---

## 3) POURQUOI C'EST O(n log n)

```
n = 8 éléments

Niveau 0 (diviser) : 1 tableau de 8
Niveau 1 :      2 tableaux de 4
Niveau 2 :      4 tableaux de 2
Niveau 3 :      8 tableaux de 1  <-- cas de base atteint

Nombre de niveaux = log₂(8) = 3
```

À chaque niveau, on fusionne **n éléments au total** (chaque élément est traité une fois).

```
Niveau 3 (fusion) : 8 opérations
Niveau 2 (fusion) : 8 opérations
Niveau 1 (fusion) : 8 opérations
          ---------------
Total :       3 * 8 = 24 = n * log n
```

```
      Comparaisons
      |
 50M    |               n²
      |
 130K   |           n log n *
      |       *
      |    *
      |  *
      |_________________________________ n
       1K 3K 5K 7K 10K
```

Pour 10 000 éléments : Insertion sort fait ~50M opérations. Merge sort : ~130 000.

---

## 4) STABLE, PRÉVISIBLE, MAIS GOURMAND EN MÉMOIRE

**Avantages :**
- Stable : si `Mbappé` et `Vinicius` ont le même score, leur ordre original est préservé
- Performance garantie : O(n log n) dans tous les cas (pire, moyen, meilleur)
- Parfait pour trier des linked lists (pas besoin d'accès aléatoire)

**Inconvénient :**
- Espace O(n) : chaque `merge` crée un nouveau tableau. Sur 1M d'éléments, ça fait 1M d'allocations supplémentaires.

```js
// exemple qui casse : tri sur des objets avec propriété manquante
const data = [
 { joueur: "Messi", buts: 45 },
 { joueur: "Mbappé", buts: 52 },
 { joueur: "Haaland" } // pas de propriété "buts"
]

// un comparateur naïf va comparer undefined avec des nombres
// le résultat est imprévisible : NaN dans les comparaisons
function mergeSortBy(arr, key) {
 if (arr.length <= 1) return arr
 const mid = Math.floor(arr.length / 2)
 const left = mergeSortBy(arr.slice(0, mid), key)
 const right = mergeSortBy(arr.slice(mid), key)
 return mergeBy(left, right, key)
}

function mergeBy(left, right, key) {
 const result = []
 let i = 0, j = 0
 while (i < left.length && j < right.length) {
  const a = left[i][key] ?? -Infinity // défense contre undefined
  const b = right[j][key] ?? -Infinity
  if (a <= b) { result.push(left[i]); i++ }
  else { result.push(right[j]); j++ }
 }
 return result.concat(left.slice(i)).concat(right.slice(j))
}
```

---

## 5) MERGE SORT DANS LA VRAIE VIE

Tim Sort (Python, Java, V8 pour les tableaux > 64 éléments) est une hybridation Merge Sort + Insertion Sort. Merge Sort gère les grands tableaux. Insertion Sort gère les petits runs déjà quasi-triés.

```js
// le sort natif JS sur les grands tableaux utilise Tim Sort en V8
// ce qui explique pourquoi il est stable depuis Node 11 et Chrome 70

const joueurs = [
 { nom: "Messi", goals: 45 },
 { nom: "Mbappé", goals: 52 },
 { nom: "Ronaldo", goals: 45 },
 { nom: "Haaland", goals: 52 },
]

// stable : les ex-aequo gardent leur ordre original
joueurs.sort((a, b) => b.goals - a.goals)
// [Mbappé, Haaland, Messi, Ronaldo]
// Mbappé avant Haaland car Mbappé était avant dans le tableau original
```

---

## EXERCICES

## EXO 1 : Merge sort sur des objets
_~15 min_

Implémente `mergeSortByScore` qui trie des joueurs de foot par `score` décroissant. Le tri doit être stable.

```js
const classement = [
 { nom: "Messi", score: 580 },
 { nom: "Mbappé", score: 612 },
 { nom: "Vinicius", score: 612 },
 { nom: "Bellingham", score: 490 },
 { nom: "Rodri", score: 550 }
]
// résultat : Mbappé, Vinicius, Messi, Rodri, Bellingham
```

---

## EXO 2 : Compter les inversions
_~20 min_

Une "inversion" c'est une paire `(i, j)` où `i < j` mais `arr[i] > arr[j]`. C'est une mesure du désordre.

Modifie `mergeSort` pour qu'il retourne `{ sorted, inversions }`. Pendant la fusion, chaque fois qu'un élément de `right` passe devant un élément de `left`, compte le nombre d'éléments restants dans `left` : c'est autant d'inversions.

```js
// [3, 1, 2] a 2 inversions : (3,1) et (3,2)
countInversions([3, 1, 2]) // { sorted: [1, 2, 3], inversions: 2 }
```

---

## EXO 3 : Merge de K listes triées
_~15 min_

T'as K listes déjà triées. Tu dois les fusionner en une seule liste triée.

Approche naïve : concat tout, puis sort. O(n log n) mais tu jettes l'information "déjà trié".
Approche correcte : applique `merge` en cascade.

```js
const listes = [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
mergeKLists(listes) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

(indice : `reduce` avec `merge` comme accumulateur)

---

## RÉSUMÉ

Merge sort coupe le tableau en deux récursivement jusqu'aux sous-tableaux de taille 1, puis fusionne en remontant. C'est O(n log n) garanti, peu importe l'ordre d'entrée. Il est stable. Il est prévisible. Son seul coût : O(n) de mémoire supplémentaire pour les tableaux temporaires de fusion. C'est la base de Tim Sort, l'algo qui tourne dans Python, Java et V8 sur les grands tableaux.
