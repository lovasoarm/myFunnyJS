---
stability: intemporel
---

[PORTFOLIO]

# BREAKING CACHE

-> ~6 min

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
Node.js    : v20+
npm      : v10+
Variables env : aucune
Outils externes: aucun
```

```bash
npm install
node src/index.js  # charge le graphe, lance tous les algos, écrit les benchmarks
npm test       # lance la suite de tests
```

Pas de build step. Le code tourne tel qu'il est écrit.

---

## ARCHITECTURE

```
src/
├── graph/
│  ├── graphBuilder.js   # construit le graphe depuis les données brutes
│  ├── adjacencyList.js  # représentation par liste d'adjacence
│  └── graphData.js    # villes et routes du réseau Walter White
│
├── algorithms/
│  ├── dijkstra.js     # chemin le plus sûr dans un graphe pondéré
│  ├── bfs.js       # détection de routes compromises
│  └── dfs.js       # exploration complète du réseau
│
├── structures/
│  ├── minHeap.js     # min-heap pour prioriser les urgences
│  └── priorityQueue.js  # abstraction au-dessus du heap
│
├── sorting/
│  ├── quickSort.js    # rapide en pratique, unstable
│  ├── mergeSort.js    # stable, garanti O(n log n)
│  └── sortingRace.js   # comparaison sur 10k, 100k, 1M éléments
│
├── dp/
│  └── stockOptimizer.js  # knapsack : maximiser le stock sous contraintes
│
├── profiling/
│  └── benchmarker.js   # performance.now() sur chaque algo
│
└── index.js        # point d'entrée : lance tout, sort les résultats

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
 --> minHeap.extractMin()      # distributeur le plus urgent
 --> sortingRace.compare(lots)   # quickSort vs mergeSort
 --> stockOptimizer.knapsack(stock, contraintes)
 --> benchmarker.report()
```

---

## MODULES CRAZYDEVS COUVERTS

| Module         | Où ça se voit                                |
| ----------------------- | ---------------------------------------------------------------------------- |
| `09_data_structures`  | `graphBuilder.js` (graphe), `minHeap.js` (heap), `adjacencyList.js`     |
| `10_algorithms`     | `dijkstra.js`, `bfs.js`, `quickSort.js`, `mergeSort.js`, `stockOptimizer.js` |
| `08_memory_performance` | `benchmarker.js` : `performance.now()` sur chaque algo, Big-O analysé    |

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
cahierdescharges.md  --> spécification complète, ordre de construction, cas limites
TDD_JOURNAL.md    --> trace de l'écriture des tests, dans l'ordre réel
POSTMORTEM.md     --> ce qui a coincé, ce qui a été appris
ADR/         --> décisions d'architecture documentées
```

---

## BENCH & DÉCISIONS (obligatoire)

Aucun mini-projet n'est "fini" sans cette section. Documente au moins **un**
trade-off chiffré :

- **Question** : "J'ai comparé X vs Y."
- **Charge** : (taille des données, N itérations, hardware).
- **Résultat** : `X = 12ms`, `Y = 48ms` sur 10 000 items.
- **Décision** : "J'ai retenu X car …"
- **Ce que je n'ai pas mesuré** : (mémoire, DX, coût cloud…).

Sans chiffres, ce n'est pas une décision, c'est une préférence.
Voir `08_memory_performance/00_measure_first.md`.

## Pitch 3 lignes

Ce projet démontre une compétence clé : lire du code inconnu, débugger sous pression, livrer un produit (ADR + tests) qu'un autre dev peut reprendre. Utilisable en portfolio et en entretien.

## Empreinte carbone (critère d'acceptation)

Estime l'empreinte carbone approximative de ton déploiement ou de ton algo. Justifie **un** choix d'optimisation (moins d'invocations, cache, batch, région serveur). Voir `31_annexes/03_finops_greenops.md`.

## THÈME NEUTRE (optionnel)

Si les références Naruto/DBZ ne te parlent pas, remplace mentalement par un domaine que tu connais (foot, cuisine, musique). Le concept technique reste identique.

## Structure attendue

Chaque mini-projet doit contenir a minima :

- `src/` : code source (obligatoire).
- `tests/` : tests unitaires et/ou d'intégration (obligatoire).
- `README.md` : présentation, objectifs, comment lancer.
- `TDD_JOURNAL.md` : trace de la démarche TDD.
- `POSTMORTEM.md` : ce qui a marché, ce qui a cassé, ce que tu retiens.
- `ADR/` : décisions architecturales (Architecture Decision Records).
- `cahierdescharges.md` : contraintes et périmètre.

Un CI check impose la présence de `src/` et `tests/` avant validation.

---

## REPRODUCTIBILITÉ

Installation canonique : `npm ci` (pas `npm install`). `npm ci` respecte strictement le `package-lock.json` : deux personnes qui clonent obtiennent exactement les mêmes versions. Committe toujours ton `package-lock.json`. Sans lui, un `npm install` 3 mois plus tard installera d'autres versions et tu debug un fantôme.
