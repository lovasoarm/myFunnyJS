---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# BUBBLE SORT & INSERTION SORT : LES LENTS QUI T'APPRENNENT TOUT
Temps de lecture ~8 min

Deux algos que personne n'utilise en prod. Deux algos que tout le monde devrait comprendre.

Pourquoi ? Parce que Bubble et Insertion t'apprennent à voir le coût d'un algorithme à l'oeil nu. Quand tu regardes Merge Sort ou Quick Sort après ça, tu comprends *pourquoi* ils sont rapides. Sans la douleur du O(n²), t'as pas la référence.

---

## 1) BUBBLE SORT : FAIRE REMONTER LE MAX À CHAQUE PASSE

L'idée : comparer deux voisins, swapper si besoin, répéter. À chaque passe, le plus grand élément "remonte" à sa place finale comme une bulle.

Après 1 passe : le max est à la fin.
Après 2 passes : les 2 derniers sont en place.
Après n passes : tout est trié.

```
Tableau initial : [5, 3, 8, 1, 9, 2]

Passe 1 :
[5,3] --> swap --> [3,5,8,1,9,2]
[5,8] --> ok
[8,1] --> swap --> [3,5,1,8,9,2]
[8,9] --> ok
[9,2] --> swap --> [3,5,1,8,2,9]
               ^
               9 est en place, définitivement
```

```js
function bubbleSort(arr) {
 const a = [...arr] // on ne mute pas l'original : Walter White ne laisse pas de traces

 for (let i = 0; i < a.length; i++) {
  let swapped = false

  // chaque passe : on compare jusqu'à l'avant-dernière position non triée
  for (let j = 0; j < a.length - 1 - i; j++) {
   if (a[j] > a[j + 1]) {
    // swap classique : deux lignes, zéro variable temporaire
    ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
    swapped = true
   }
  }

  // optimisation : si aucun swap cette passe, c'est déjà trié
  if (!swapped) break
 }

 return a
}

console.log(bubbleSort([5, 3, 8, 1, 9, 2]))
// [1, 2, 3, 5, 8, 9]
```

**Complexité :**

| Cas | Complexité |
|-----|-----------|
| Meilleur (déjà trié) | O(n) avec l'optimisation `swapped` |
| Moyen | O(n²) |
| Pire (trié à l'envers) | O(n²) |

**Espace :** O(1), on trie en place.

---

## 2) INSERTION SORT : TRIER COMME TU TIENS UNE MAIN DE CARTES

Imagine Naruto qui ramasse ses cartes une par une. À chaque nouvelle carte, il la glisse à la bonne position dans sa main. Sa main gauche est toujours triée. La droite est le reste à traiter.

```
Main actuelle (triée) : [3, 5, 8]
Nouvelle carte : 1

On recule 8 --> [3, 5, _, 8]
On recule 5 --> [3, _, 5, 8]
On recule 3 --> [_, 3, 5, 8]
On insère 1 --> [1, 3, 5, 8]
```

```js
function insertionSort(arr) {
 const a = [...arr]

 for (let i = 1; i < a.length; i++) {
  const current = a[i] // la carte qu'on tient en main
  let j = i - 1

  // on recule tous les éléments plus grands que current
  while (j >= 0 && a[j] > current) {
   a[j + 1] = a[j] // décalage vers la droite
   j--
  }

  // on pose la carte à sa place
  a[j + 1] = current
 }

 return a
}

console.log(insertionSort([5, 3, 8, 1, 9, 2]))
// [1, 2, 3, 5, 8, 9]
```

**Complexité :**

| Cas | Complexité |
|-----|-----------|
| Meilleur (déjà trié) | O(n) |
| Moyen | O(n²) |
| Pire (trié à l'envers) | O(n²) |

---

## 3) BUBBLE VS INSERTION : LA VRAIE DIFFÉRENCE

Les deux sont O(n²). Mais Insertion sort est presque toujours plus rapide en pratique.

Pourquoi ?

```
Bubble sort : compare et swap en permanence, même si presque trié
Insertion sort : dès qu'il trouve la bonne position, il s'arrête
```

Sur des tableaux "presque triés" (cas fréquent en vrai) : Insertion sort approche O(n).
Sur des tableaux complètement aléatoires : les deux souffrent pareil.

**Où Insertion sort est encore utilisé aujourd'hui :**
- Tim Sort (algo de Python et Java) l'utilise sur les petits sous-tableaux (< 64 éléments)
- Arrays déjà quasi-triés en streaming
- Entrées de taille < 20 où le overhead de Merge Sort ne vaut pas le coup

```js
// exemple qui casse : 10 000 éléments aléatoires
// Insertion sort : ~50 millions de comparaisons
// Merge sort : ~130 000 comparaisons
// La différence devient visible très vite

function benchmark(sortFn, arr) {
 const start = performance.now()
 sortFn([...arr])
 return performance.now() - start
}

const big = Array.from({ length: 10_000 }, () => Math.random() * 10_000 | 0)

console.log('insertion sort :', benchmark(insertionSort, big).toFixed(2), 'ms')
// tu verras la différence quand tu arriveras à mergeSort
```

---

## 4) VISUALISER LE O(n²)

```
n = 4 : comparaisons = 3 + 2 + 1 = 6
n = 8 : comparaisons = 7 + 6 + ... + 1 = 28
n = 16 : comparaisons = 120
n = 1000 : ~500 000 comparaisons
n = 10000 : ~50 000 000 comparaisons

       Nombre d'opérations
       |
 50M     |                  *
       |
 12.5M    |             *
       |
 0.5M    |       *
       |   *
       |____________________________ n
       1K  3K  7K  10K
```

La courbe n'est pas linéaire. Elle explose. C'est ça le O(n²) dans la vraie vie.

---

## EXERCICES

## EXO 1 : Le classement des Ballon d'Or
_~10 min_

Tu reçois un tableau de joueurs avec leurs scores de vote. Implémente un **insertion sort** qui les trie par score décroissant. Contrainte : stable : si deux joueurs ont le même score, l'ordre original est préservé.

```js
const candidats = [
 { nom: "Messi", score: 580 },
 { nom: "Mbappé", score: 612 },
 { nom: "Vinicius", score: 612 },
 { nom: "Bellingham", score: 490 }
]
// résultat attendu : Mbappé, Vinicius, Messi, Bellingham
// (Vinicius reste après Mbappé : même score, ordre original conservé)
```

---

## EXO 2 : Bubble sort avec compteur de swaps
_~15 min_

Modifie bubble sort pour qu'il retourne `{ sorted: [...], swaps: N }`. Lance-le sur ces trois tableaux et compare les swaps :
- `[1, 2, 3, 4, 5]` (déjà trié)
- `[3, 1, 4, 1, 5, 9, 2, 6]` (aléatoire)
- `[5, 4, 3, 2, 1]` (inversé)

(indice : le nombre de swaps est une mesure directe du désordre initial)

---

## EXO 3 : Le cas qui casse tout
_~12 min_

Crée un tableau de 50 000 entiers aléatoires. Mesure le temps d'exécution de `insertionSort` vs `[...arr].sort((a, b) => a - b)` (le sort natif JS). Note la différence. Explique en deux lignes pourquoi le sort natif écrase insertion sort sur ce cas.

---

## RÉSUMÉ

Bubble sort et Insertion sort sont des O(n²) : chaque élément supplémentaire coûte de plus en plus cher. Bubble fait remonter le max à chaque passe. Insertion glisse chaque élément à sa place dans une sous-liste triée. Insertion sort est plus intelligent sur les données quasi-triées et reste utilisé dans Tim Sort pour les petits tableaux. Le vrai intérêt de ces deux algos : comprendre pourquoi O(n log n) change tout.
