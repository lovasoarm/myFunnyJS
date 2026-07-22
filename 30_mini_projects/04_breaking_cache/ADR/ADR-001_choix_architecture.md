---
stability: intemporel
---

# ADR-001 : implémentation from scratch de tous les algorithmes sans bibliothèque externe
Temps de lecture ~6 min

## Statut
Accepté : 2026-01

## Contexte
Breaking Cache modélise le réseau de distribution de Walter White : un graphe orienté pondéré avec des routes, des risques, des stocks, et des urgences. Les algorithmes nécessaires sont identifiés : Dijkstra pour les chemins les plus sûrs, min-heap pour les priorités, BFS/DFS pour l'exploration, Merge Sort et Quick Sort pour le tri des lots, Dynamic Programming pour l'optimisation du stock (knapsack).

La question centrale : utilise-t-on des bibliothèques qui fournissent ces structures (ex : `heap.js`, `graphlib`) ou implémente-t-on tout from scratch ?

L'objectif pédagogique du projet est explicitement : `09_data_structures` + `10_algorithms` + `08_memory_performance`. Comprendre ces algorithmes de l'intérieur est le point.

## Décision
Tous les algorithmes et structures de données sont implémentés from scratch. Aucune bibliothèque d'algorithmes externe. Le graphe, le heap, Dijkstra, BFS, DFS, les algorithmes de tri, et le solveur knapsack sont tous écrits dans `src/`. Chaque implémentation tourne sous `performance.now()` : pas d'algorithme non mesuré.

```
src/
├── graph.js     (graphe orienté pondéré : adjacency list)
├── heap.js      (min-heap : insert en O(log n), extractMin en O(log n))
├── dijkstra.js    (chemin le plus court : O((V + E) log V) avec heap)
├── bfs.js      (routes compromises : O(V + E))
├── sorting.js    (mergeSort + quickSort : avec benchmarks comparatifs)
├── knapsack.js    (DP tabulation : O(n × W) avec W = capacité du stock)
└── profiler.js    (wrappeur performance.now() autour de chaque algo)
```

## Alternatives considérées

**Utiliser des bibliothèques éprouvées (graphlib, heap.js, lodash.sortBy)**
- Avantages : moins de code à écrire, algorithmes déjà testés, on se concentre sur la logique métier de Walter
- Limites : opaque : `graphlib.alg.dijkstra(graph, start)` fonctionne mais l'apprenant ne sait pas pourquoi ; le profilage d'une boîte noire ne mesure pas la compréhension, juste la latence d'appel
- Rejeté parce que : l'objectif n'est pas de livrer un réseau de distribution fonctionnel, c'est de comprendre pourquoi Dijkstra avec un heap est O((V + E) log V) et sans heap c'est O(V²)

**Implémentation from scratch sans profilage**
- Avantages : simplifie le code, moins de boilerplate autour de chaque algo
- Limites : le Big-O reste théorique ; sans `performance.now()` sur 10k, 100k, 1M éléments, la différence entre O(n log n) et O(n²) n'est qu'un chiffre sur un tableau
- Rejeté parce que : Walter ne tolère pas les inefficacités : et l'apprenant non plus après avoir vu Quick Sort battre Merge Sort sur des données presque triées, ou l'inverse en pire cas

## Conséquences

Gains :
- chaque implémentation est lisible ligne par ligne : l'apprenant peut voir exactement où le heap maintient l'ordre, où Dijkstra rerelaxe une arête
- le profilage comparatif est intégré au projet : `node src/index.js` produit un rapport de benchmark sur chaque algo avec des jeux de données croissants
- zéro dépendance externe : `npm install` installe uniquement les dépendances de test (Jest)

Sacrifices :
- les implémentations maison ne gèrent pas tous les edge cases d'une bibliothèque production : c'est intentionnel : la robustesse industrielle n'est pas l'objectif ici
- le volume de code à écrire est plus important : environ 600-800 lignes de logique pure avant d'avoir tous les algos opérationnels

Décisions liées :
- ADR-002 portera sur la représentation du graphe : adjacency list (liste d'adjacence) vs adjacency matrix (matrice d'adjacence) : et pourquoi l'une est O(V + E) en espace et l'autre O(V²)
