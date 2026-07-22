---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# SORTING RACE : BUBBLE VS MERGE VS QUICK SUR DES VRAIS VOLUMES
Temps de lecture ~8 min

T'as vu les algos en isolation. Maintenant on les fait se battre.

10k éléments. 100k. 1M. Sur des tableaux aléatoires, triés, inversés, avec doublons. Les courbes de complexité que t'as vues en théorie vont devenir des chiffres réels. Certains résultats vont te surprendre.

---

## 1) LE SETUP DE BENCHMARK

```js
// générateurs de données
const random = n => Array.from({ length: n }, () => Math.random() * n | 0)
const sorted = n => Array.from({ length: n }, (_, i) => i)
const reversed = n => Array.from({ length: n }, (_, i) => n - i)
const duplicates = n => Array.from({ length: n }, () => Math.random() * 10 | 0)

// timer propre
function benchmark(label, fn, arr) {
 const input = [...arr] // on ne mute pas le tableau de référence
 const start = performance.now()
 fn(input)
 const duration = performance.now() - start
 console.log(`${label.padEnd(20)} : ${duration.toFixed(2).padStart(8)} ms`)
 return duration
}
```

---

## 2) LA COURSE : 10k, 100k, 1M ÉLÉMENTS

```js
// implémentations à utiliser
// (reprises des leçons précédentes)

for (const n of [10_000, 100_000, 1_000_000]) {
 console.log(`\n=== n = ${n.toLocaleString()} ===`)
 const data = random(n)

 benchmark('bubble sort',  arr => bubbleSort(arr),        data) // skip pour n > 10k
 benchmark('insertion sort', arr => insertionSort(arr),      data) // skip pour n > 50k
 benchmark('merge sort',   arr => mergeSort(arr),        data)
 benchmark('quick sort',   arr => quickSortRandom([...arr]),   data)
 benchmark('Array.sort',   arr => arr.sort((a, b) => a - b),   data)
}
```

**Résultats typiques (Chrome/Node, données aléatoires) :**

```
=== n = 10 000 ===
bubble sort     :  350.00 ms
insertion sort    :  28.00 ms
merge sort      :   3.50 ms
quick sort      :   2.80 ms
Array.sort      :   1.20 ms

=== n = 100 000 ===
bubble sort     : [skip - >30s]
insertion sort    : 2800.00 ms
merge sort      :  45.00 ms
quick sort      :  30.00 ms
Array.sort      :  12.00 ms

=== n = 1 000 000 ===
insertion sort    : [skip - impraticable]
merge sort      :  550.00 ms
quick sort      :  320.00 ms
Array.sort      :  130.00 ms
```

---

## 3) ANALYSER CHAQUE TYPE DE DONNÉES

```js
const SIZES = [10_000, 100_000]

function raceOn(label, dataFn) {
 console.log(`\n--- Données : ${label} ---`)
 for (const n of SIZES) {
  const data = dataFn(n)
  console.log(`n = ${n}`)
  benchmark('merge sort', arr => mergeSort(arr), data)
  benchmark('quick sort', arr => quickSortRandom([...arr]), data)
  benchmark('Array.sort', arr => arr.sort((a, b) => a - b), data)
 }
}

raceOn('aléatoire', random)
raceOn('trié', sorted)
raceOn('inversé', reversed)
raceOn('doublons', duplicates)
```

**Ce que tu vas observer :**

```
Données triées :
 merge sort  --> pareil, O(n log n) garanti
 quick sort  --> pareil avec pivot random, O(n log n) moyen
 Array.sort  --> beaucoup plus rapide : Tim Sort détecte les runs triés

Données inversées :
 merge sort  --> identique à aléatoire
 quick sort  --> identique à aléatoire (pivot random)
 Array.sort  --> très rapide : Tim Sort détecte le run inversé et l'inverse d'un coup

Données avec doublons :
 quick sort classique --> ralenti sur certaines distributions
 quick sort 3-way   --> gagne ici
```

---

## 4) POURQUOI ARRAY.SORT ÉCRASE TOUT

Array.sort dans V8 (Node/Chrome) utilise **Tim Sort**.

Tim Sort est une hybridation :
- détecte les "runs" naturels dans le tableau (séquences déjà triées ou triées à l'envers)
- sur les runs courts (< 64 éléments) : Insertion Sort
- fusionne les runs avec une version optimisée de Merge Sort

```
Tableau avec runs naturels :
[1, 3, 5, 7 | 8, 6, 4, 2 | 10, 11, 12]
 run trié   run inversé  run trié

Tim Sort :
1. Détecte les 3 runs
2. Inverse le run décroissant : [2, 4, 6, 8]
3. Fusionne les 3 runs triés

Résultat : beaucoup moins d'opérations que Merge Sort pur sur les données "réelles"
```

```js
// démonstration du comportement avec runs
const avecRuns = [
 ...sorted(1000),      // déjà trié
 ...reversed(1000),     // à l'envers
 ...random(1000)      // aléatoire
].slice(0, 2000)

console.time('array sort avec runs')
;[...avecRuns].sort((a, b) => a - b)
console.timeEnd('array sort avec runs')
// beaucoup plus rapide que sur 2000 éléments purement aléatoires
```

---

## 5) CHOISIR LE BON ALGO SELON LE CONTEXTE

```
Contexte             Algo recommandé
-------------------------------- ----------------
Données primitives en JS     Array.sort() (Tim Sort)
Objets avec comparateur custom  Array.sort() (stable depuis Node 11)
Stabilité critique        Merge Sort (ou Array.sort stable)
Mémoire contrainte        Quick Sort in-place
Linked list à trier        Merge Sort (pas d'accès aléatoire nécessaire)
Données avec beaucoup de doublons Quick Sort 3-way
Très petits tableaux (< 20)    Insertion Sort (overhead minimal)
Pédagogie / entretiens      Savoir implémenter les trois
```

---

## 6) LE VRAI MESSAGE DE CETTE LEÇON

```
n = 100 000

Insertion sort : ~5 000 000 000 opérations (50 milliards sur 1M)
Merge sort :     ~1 700 000 opérations
Quick sort :     ~1 700 000 opérations
Tim Sort :        < 1 000 000 opérations (avec runs naturels)
```

La différence entre O(n²) et O(n log n) n'est pas abstraite. Sur 100k éléments, c'est la différence entre "2 secondes" et "45ms". Sur 1M, c'est la différence entre "se lever et aller faire un café" et "ça tourne déjà".

---

## EXERCICES

## EXO 1 : La race complète
_~20 min_

Implémente le benchmark complet avec tous les algos sur les 4 types de données (aléatoire, trié, inversé, doublons) pour n = 10k et n = 100k. Documente les résultats dans un tableau Markdown. Identifie quel algo gagne sur quel type de données et explique pourquoi.

---

## EXO 2 : Trouver le break-even
_~15 min_

À partir de quelle taille de tableau Merge sort commence-t-il à battre Insertion sort de manière significative (>2x) ? Écris un script qui trouve ce seuil empiriquement en testant n = 10, 20, 50, 100, 500, 1000, 5000.

---

## EXO 3 : Départager 100 000 lignes de stats sans planter le site en pleine soirée de match
_~25 min_

Tu reçois un tableau de 100 000 entrées de match avec `{ équipe, buts, passes, minutes }`. Tu dois les trier par `buts` décroissant, avec `passes` comme critère de départage. Le tri doit être stable. Choisis le bon algo et justifie ton choix dans un commentaire.

```js
const stats = Array.from({ length: 100_000 }, () => ({
 équipe: ["PSG", "Real", "Bayern", "City"][Math.random() * 4 | 0],
 buts: Math.random() * 5 | 0,
 passes: Math.random() * 20 | 0,
 minutes: 90
}))
```

---

## RÉSUMÉ

Sur des données aléatoires de taille moyenne : Quick sort gagne sur Merge sort à cause du cache. Sur des données avec structure (runs, quasi-triés) : Tim Sort (Array.sort) les écrase tous les deux en exploitant la structure existante. Insertion sort reste utile sous 64 éléments et sur des données quasi-triées. Le vrai enseignement : O(n log n) n'est pas un monolithe. Les constantes cachées et la structure des données font la différence en pratique.
