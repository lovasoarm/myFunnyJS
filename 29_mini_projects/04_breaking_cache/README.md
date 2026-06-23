# BREAKING CACHE

Réseau de distribution de Walter White. Des villes, des routes pondérées par le coût et le risque, des distributeurs à prioriser, des lots à trier avant livraison. Chaque décision se prend avec des données mesurées, pas avec des intuitions.

Zéro bibliothèque d'algorithmes externe. Dijkstra, Heap, BFS, Quick Sort, Merge Sort : tout est écrit from scratch. Et tout tourne sous profilage.

---

## CE QUE ÇA FAIT

```
$ node src/index.js

[RESEAU] 12 villes chargées, 31 routes indexées
[DIJKSTRA] Route la plus sûre ABQ --> Juarez : cout total 47, risque 2.3
[HEAP] Distributeur prioritaire : Albuquerque Sud (stock critique)
[TRI] 5000 lots triés par QuickSort : 12ms
[TRI] 5000 lots triés par MergeSort : 18ms
[BENCHMARK] O(n log n) confirmé sur 10k, 100k, 1M éléments
```

---

## INSTALLATION

```
Node.js        : v20+
npm            : v10+
Variables env  : aucune
Outils externes: aucun
```

```bash
npm install
node src/index.js   # charge le graphe, lance tous les algos, écrit les benchmarks
npm test             # lance la suite de tests
```

Pas de build step. Le code tourne tel qu'il est écrit.

---

## ARCHITECTURE

```
src/
├── graph/
│   ├── graphBuilder.js     # construit le graphe depuis les données brutes
│   ├── adjacencyList.js    # représentation par liste d'adjacence
│   └── graphData.js        # villes et routes du réseau Walter White
│
├── algorithms/
│   ├── dijkstra.js         # chemin le plus sûr dans un graphe pondéré
│   ├── bfs.js              # détection de routes compromises
│   └── dfs.js              # exploration complète du réseau
│
├── structures/
│   ├── minHeap.js          # min-heap pour prioriser les urgences
│   └── priorityQueue.js    # abstraction au-dessus du heap
│
├── sorting/
│   ├── quickSort.js        # rapide en pratique, unstable
│   ├── mergeSort.js        # stable, garanti O(n log n)
│   └── sortingRace.js      # comparaison sur 10k, 100k, 1M éléments
│
├── dp/
│   └── stockOptimizer.js   # knapsack : maximiser le stock sous contraintes
│
├── profiling/
│   └── benchmarker.js      # performance.now() sur chaque algo
│
└── index.js                # point d'entrée : lance tout, sort les résultats

tests/
├── graph.test.js
├── dijkstra.test.js
├── heap.test.js
├── sorting.test.js
└── dp.test.js
```

Flux d'appel principal :

```
index.js
  --> graphBuilder.build(graphData)
  --> dijkstra.shortestPath(graph, "ABQ", "Juarez")
  --> minHeap.extractMin()           # distributeur le plus urgent
  --> sortingRace.compare(lots)      # quickSort vs mergeSort
  --> stockOptimizer.knapsack(stock, contraintes)
  --> benchmarker.report()
```

---

## MODULES CRAZYDEVS COUVERTS

| Module | Où ça se voit |
|---|---|
| `07_data_structures` | `graphBuilder.js` (graphe), `minHeap.js` (heap), `adjacencyList.js` |
| `08_algorithms` | `dijkstra.js`, `bfs.js`, `quickSort.js`, `mergeSort.js`, `stockOptimizer.js` |
| `06_memory_performance` | `benchmarker.js` : `performance.now()` sur chaque algo, Big-O analysé |

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. Aucune bibliothèque d'algorithmes externe (pas de graphlib, pas de heap npm)
2. Chaque algo est profilé : performance.now() avant et après, résultat loggé
3. La complexité Big-O de chaque algo est documentée en commentaire dans le fichier
4. Les benchmarks tournent sur au moins trois tailles d'input : 1k, 10k, 100k
```

---

## DOCUMENTS DU PROJET

```
cahierdescharges.md   --> spécification complète, ordre de construction, cas limites
TDD_JOURNAL.md        --> trace de l'écriture des tests, dans l'ordre réel
POSTMORTEM.md         --> ce qui a coincé, ce qui a été appris
ADR/                  --> décisions d'architecture documentées
```
