---
stability: intemporel
---

# CAHIER DES CHARGES : BREAKING CACHE

Temps de lecture ~13 min

## PRÉREQUIS

```
Node.js    : v20+
npm      : v10+
Variables env : aucune
Outils externes: aucun

# Installation
$ npm install

# Lancer la démo (charge le graphe, lance tous les algos, écrit les benchmarks)
$ node src/index.js

# Lancer les tests
$ npm test
```

Aucune bibliothèque d'algorithmes externe. Tout est écrit from scratch : c'est l'objectif pédagogique du projet.

---

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Walter White gère un réseau de distribution. Des villes, des routes entre elles avec des coûts de transport et des niveaux de risque, des distributeurs à réapprovisionner, des urgences à prioriser. Chaque décision se prend avec des chiffres, pas avec des intuitions. Le réseau est modélisé comme un graphe orienté pondéré (un ensemble de noeuds reliés par des arêtes avec un coût attaché). Walter veut savoir : quelle est la route la plus sûre pour livrer Albuquerque depuis le laboratoire ? Quel distributeur est le plus urgent à réapprovisionner ? Quel lot trier en priorité avant livraison ?

Et tout ça doit tourner sous profilage. Walter ne tolère pas les inefficacités.

Ce que tu dois voir tourner à la fin :

```
$ node src/index.js

[RÉSEAU] 8 villes | 14 routes chargées
[DIJKSTRA] Labo -> Albuquerque : route optimale = Labo -> Socorro -> Rio Rancho -> Albuquerque (coût: 47, risque: faible)
[HEAP] Urgence n°1 : Santa Fe (stock: 2 unités restantes)
[HEAP] Urgence n°2 : Las Cruces (stock: 8 unités restantes)
[SORT] Tri de 1000 lots par pureté : Merge Sort => 4.2ms | Quick Sort => 3.8ms
[DP] Optimisation de stock sous contrainte budget 50k$ : valeur max = 142k$ (knapsack)
[PERF] Tous les benchmarks dans logs/benchmarks.json

$ npm test
PASS tests/graph.test.js (22 tests)
PASS tests/dijkstra.test.js (16 tests)
PASS tests/heap.test.js (14 tests)
PASS tests/sorting.test.js (12 tests)
PASS tests/dp.test.js (10 tests)
```

Ce projet est pur algorithme et structure de données. Pas de CLI complexe, pas de streaming, pas de refactoring de legacy. Juste des structures bien choisies et des algorithmes mesurés.

## POURQUOI CE PROJET EXISTE

Ce projet force à travailler avec des structures de données non triviales dans un contexte où le choix de la structure change directement la performance :

- **comprendre qu'un graphe est la bonne structure pour un réseau de distribution** : une liste de routes dans un tableau serait inutilisable pour trouver le chemin optimal. Un graphe rend les connexions explicites et les algorithmes possibles.
- **comprendre qu'un heap (tas) est la bonne structure pour gérer des priorités** : trier toute la liste des distributeurs à chaque fois qu'une urgence arrive coûte O(n log n). Un min-heap donne l'urgence la plus haute en O(1) et met à jour en O(log n).
- **mesurer, pas supposer** : l'intuition sur les perfs est souvent fausse. Merge Sort vs Quick Sort sur 1000 lots : lequel est plus rapide ? Le benchmark tranche, pas l'opinion.

## LES 3 MODULES QUE CE PROJET COUVRE, ET OÙ ILS SE VOIENT DANS LE CODE

### `09_data_structures` : graphe et min-heap

**Où ça se voit** : `src/graph/`, `src/heap/`.
**Pourquoi c'est nécessaire ici** : le réseau de distribution est un graphe. Les urgences sont une priority queue (file de priorité) basée sur un min-heap. Ces deux structures ne peuvent pas être remplacées par des tableaux sans exploser la complexité.

### `10_algorithms` : Dijkstra, BFS/DFS, tri comparatif, DP

**Où ça se voit** : `src/algorithms/`.
**Pourquoi c'est nécessaire ici** : trouver la route optimale = Dijkstra. Détecter une route compromise = BFS. Trier les lots = Merge Sort vs Quick Sort avec mesure. Optimiser le stock sous budget = knapsack (problème du sac à dos, algorithme de programmation dynamique).

### `08_memory_performance` : profilage réel sur chaque algo

**Où ça se voit** : `src/profiler/benchmarks.js`, `logs/benchmarks.json`.
**Pourquoi c'est nécessaire ici** : un algorithme sans mesure est une hypothèse. Chaque algo dans ce projet est wrappé dans un benchmark. Les résultats sont loggés. Walter ne valide aucune décision sans chiffres.

### Résumé visuel

```
09_data_structures --> src/graph/ (graphe orienté pondéré), src/heap/ (min-heap)
10_algorithms    --> src/algorithms/ (dijkstra, bfs, mergeSort, quickSort, knapsack)
06_memory_perf   --> src/profiler/benchmarks.js, logs/benchmarks.json
```

## FLUX D'APPEL : QUI APPELLE QUI, DANS QUEL ORDRE

```
src/index.js
 --> graphLoader.load('data/network.json')   // charge le réseau depuis un fichier JSON
 --> graph.addNode(city) / graph.addEdge(...) // construit le graphe en mémoire
 --> dijkstra.findPath(graph, 'Labo', 'Albuquerque') // chemin optimal
 --> bfs.findCompromisedRoutes(graph)     // routes compromises
 --> priorityQueue.build(distributors)     // construit le heap depuis la liste
 --> priorityQueue.extractMin()        // urgence n°1
 --> benchmark.run('mergeSort', mergeSort, lots) // mesure le merge sort
 --> benchmark.run('quickSort', quickSort, lots) // mesure le quick sort
 --> knapsack.optimize(items, budget)     // DP : valeur max sous contrainte
 --> benchmarkLogger.save('logs/benchmarks.json') // sauvegarde les perf
```

## L'ARCHITECTURE DU CODE, FICHIER PAR FICHIER

```
src/
├── graph/
│  ├── graph.js
│  └── graphLoader.js
│
├── heap/
│  └── minHeap.js
│
├── algorithms/
│  ├── dijkstra.js
│  ├── bfs.js
│  ├── mergeSort.js
│  ├── quickSort.js
│  └── knapsack.js
│
├── profiler/
│  └── benchmarks.js
│
└── index.js

data/
└── network.json

logs/
└── benchmarks.json

tests/
├── graph.test.js
├── dijkstra.test.js
├── heap.test.js
├── sorting.test.js
└── dp.test.js
```

### `src/graph/graph.js`

**Ce que ça fait** : implémente un graphe orienté pondéré avec liste d'adjacence (une structure où chaque noeud stocke la liste de ses voisins et le coût de chaque arête).
**Entrée** : des appels à `addNode(id)` et `addEdge(from, to, weight)`.
**Sortie** : `getNeighbors(node)` retourne `[{ node, weight }]`.

### `src/graph/graphLoader.js`

**Ce que ça fait** : lit `data/network.json` et construit un objet graphe. Le fichier JSON a le format suivant :

```json
{
  "nodes": [
    "Labo",
    "Socorro",
    "Rio Rancho",
    "Albuquerque",
    "Santa Fe",
    "Las Cruces",
    "Roswell",
    "El Paso"
  ],
  "edges": [
    { "from": "Labo", "to": "Socorro", "weight": 12, "risk": "faible" },
    { "from": "Socorro", "to": "Rio Rancho", "weight": 18, "risk": "faible" },
    { "from": "Labo", "to": "Albuquerque", "weight": 47, "risk": "élevé" }
  ]
}
```

`weight` est le coût de transport (distance + temps). `risk` est un label narratif, pas utilisé dans les calculs Dijkstra (qui n'utilise que `weight`).
**Entrée** : un chemin de fichier JSON.
**Sortie** : une instance de `graph.js` avec tous les noeuds et arêtes chargés.

### `src/heap/minHeap.js`

**Ce que ça fait** : implémente un min-heap (tas où le plus petit élément est toujours en haut). Opérations : `insert(item, priority)`, `extractMin()`, `peek()`.
**Entrée** : un élément et sa priorité (numérique).
**Sortie** : l'élément de priorité minimale à chaque `extractMin()`.

### `src/algorithms/dijkstra.js`

**Ce que ça fait** : trouve le chemin de coût minimal entre deux noeuds dans un graphe pondéré. Utilise le min-heap comme queue de priorité.
**Entrée** : un graphe, un noeud de départ, un noeud d'arrivée.
**Sortie** : `{ path: ['Labo', 'Socorro', ...], cost: 47 }`.

### `src/algorithms/bfs.js`

**Ce que ça fait** : parcours en largeur (BFS = Breadth-First Search). Utilisé pour détecter les routes compromises (noeuds marqués "risque élevé") accessibles depuis le laboratoire.
**Entrée** : un graphe, un noeud de départ.
**Sortie** : la liste des noeuds compromis trouvés.

### `src/algorithms/mergeSort.js` et `quickSort.js`

**Ce que ça fait** : implémente les deux algorithmes de tri. Les deux acceptent un tableau de lots et un comparateur (fonction qui définit l'ordre de tri).
**Entrée** : un tableau, une fonction de comparaison.
**Sortie** : un nouveau tableau trié (pas de mutation en place).

### `src/algorithms/knapsack.js`

**Ce que ça fait** : résout le problème du sac à dos en programmation dynamique. Maximise la valeur du stock réapprovisionné sous contrainte de budget.
**Entrée** : une liste d'items `{ name, value, cost }`, un budget max.
**Sortie** : `{ selectedItems: [...], totalValue: number, totalCost: number }`.

### `src/profiler/benchmarks.js`

**Ce que ça fait** : wrape une fonction dans un timer, exécute la fonction, retourne le résultat et le temps d'exécution. Sauvegarde les résultats dans `logs/benchmarks.json`.
**Entrée** : un nom, une fonction, ses arguments.
**Sortie** : `{ name, result, durationMs }`.

## L'ORDRE DE CONSTRUCTION (PAR OÙ COMMENCER)

```
1. src/graph/graph.js     --> structure de base, zéro dépendance
2. src/heap/minHeap.js    --> indépendant, testable seul
3. src/algorithms/mergeSort.js + quickSort.js --> indépendants du graphe
4. src/algorithms/knapsack.js --> indépendant du graphe
5. src/graph/graphLoader.js  --> dépend de graph.js + fichier JSON
6. src/algorithms/bfs.js   --> dépend de graph.js
7. src/algorithms/dijkstra.js --> dépend de graph.js + minHeap.js
8. src/profiler/benchmarks.js --> wrape n'importe quelle fonction
9. src/index.js        --> branche tout, lance la démo
```

## ESTIMATION DE TEMPS ET ZONES DE RÉSISTANCE

**Durée totale estimée** : 15 à 22 heures de travail réel.

| Étape                 | Durée estimée | Zone de résistance                                                      |
| --------------------- | ------------- | ----------------------------------------------------------------------- |
| graph.js              | 2h            | Moyenne : bien choisir la structure interne (liste d'adjacence)         |
| minHeap.js            | 3-4h          | **Haute** : l'opération `heapifyDown` après extractMin est le vrai test |
| mergeSort + quickSort | 2h            | Faible si le module 10 est bien maîtrisé                                |
| knapsack.js           | 3h            | Moyenne : construire la table DP étape par étape sans se perdre         |
| dijkstra.js           | 3-4h          | **Haute** : l'intégration avec le heap comme priority queue             |
| bfs.js                | 1h            | Faible                                                                  |
| profiler + index      | 1h30          | Faible                                                                  |
| Tests                 | 2-3h          | Moyenne : tester des algos sur des graphes construits à la main         |

Le min-heap est le point de résistance le plus sous-estimé. L'insertion est simple. C'est `heapifyDown` (remettre l'arbre en ordre après avoir extrait la racine) qui résiste. Si tu bloques là, dessine l'arbre sur papier avant de coder.

## EXEMPLE DE TEST REMPLI

```js
// tests/heap.test.js
import { MinHeap } from "../src/heap/minHeap.js";

describe("MinHeap", () => {
  test("extractMin retourne toujours le plus petit élément", () => {
    const heap = new MinHeap();
    heap.insert("Las Cruces", 8); // stock: 8
    heap.insert("Santa Fe", 2); // stock: 2 --> priorité max
    heap.insert("Albuquerque", 15);

    expect(heap.extractMin().item).toBe("Santa Fe"); // urgence n°1
    expect(heap.extractMin().item).toBe("Las Cruces"); // urgence n°2
  });

  test("l'ordre est correct après plusieurs insertions et extractions", () => {
    const heap = new MinHeap();
    [7, 3, 1, 9, 2].forEach((p) => heap.insert(`city-${p}`, p));

    const extracted = [];
    while (!heap.isEmpty()) extracted.push(heap.extractMin().priority);

    expect(extracted).toEqual([1, 2, 3, 7, 9]); // ordre croissant garanti
  });
});

// tests/dijkstra.test.js
import { Graph } from "../src/graph/graph.js";
import { findPath } from "../src/algorithms/dijkstra.js";

describe("dijkstra", () => {
  test("trouve le chemin de coût minimal dans un graphe simple", () => {
    const g = new Graph();
    g.addNode("A");
    g.addNode("B");
    g.addNode("C");
    g.addEdge("A", "B", 10);
    g.addEdge("A", "C", 3);
    g.addEdge("C", "B", 4); // A->C->B coûte 7, moins que A->B (10)

    const result = findPath(g, "A", "B");
    expect(result.path).toEqual(["A", "C", "B"]);
    expect(result.cost).toBe(7);
  });
});
```

## CAS LIMITES À TESTER OBLIGATOIREMENT

1. **Graphe avec noeud isolé** : un noeud sans arête. `dijkstra.findPath(graph, 'Labo', 'NoeudIsolé')` doit retourner `null` ou `{ path: [], cost: Infinity }`, pas planter.
2. **Heap avec un seul élément** : `extractMin()` puis `isEmpty()` doit retourner `true`.
3. **Tableau vide dans les tris** : `mergeSort([])` et `quickSort([])` retournent `[]`, pas une erreur.
4. **Budget insuffisant dans knapsack** : si le budget est inférieur au coût de n'importe quel item, retourner `{ selectedItems: [], totalValue: 0, totalCost: 0 }`.
5. **Cycle dans le graphe** : Dijkstra ne doit pas boucler infiniment sur un graphe cyclique.

## LES RÈGLES QUE TU NE DOIS JAMAIS CASSER

1. **Chaque algorithme est benchmarké.** Pas un seul algo sans mesure de temps dans l'index.
2. **Les tris ne mutent pas le tableau source.** `mergeSort(lots)` retourne un nouveau tableau.
3. **Dijkstra utilise le min-heap.** Pas un `sort()` à chaque itération (ce serait O(n² log n) au lieu de O((V+E) log V)).

## CE QUE TU NE FAIS PAS DANS CE PROJET

- Pas d'interface graphique pour visualiser le graphe.
- Pas de serveur, pas d'API.
- Pas d'import de bibliothèque d'algorithmes (tout est écrit from scratch).
- Pas de TypeScript.

## LES ADR

```
ADR/001-pourquoi-liste-adjacence-plutot-que-matrice.md
ADR/002-pourquoi-min-heap-pour-dijkstra.md
ADR/003-pourquoi-mesurer-merge-et-quick-plutot-que-choisir-lun.md
```

Exemple rempli :

```markdown
# ADR 001 : Liste d'adjacence plutôt que matrice d'adjacence

## Contexte

Un graphe peut être représenté de deux façons en mémoire : une matrice carrée
(un tableau 2D de taille noeuds x noeuds) ou une liste d'adjacence (chaque noeud
stocke la liste de ses voisins directs).

## Décision

Liste d'adjacence. Le réseau a 8 villes mais seulement 14 routes sur 56 possibles
(graphe sparse = peu dense). La matrice allouerait 56 cases pour stocker 14 arêtes.

## Alternatives considérées

- Matrice d'adjacence : rejetée car inefficace en espace O(V²) pour un graphe sparse.
  Avantage de la matrice : vérifier si une arête existe entre A et B est O(1). Pas utile ici.

## Conséquences

- Vérifier l'existence d'une arête entre deux noeuds est O(degree) au lieu de O(1).
  Acceptable ici car le degré moyen est faible (14 arêtes / 8 noeuds ≈ 1.75).
- L'itération sur les voisins (ce que Dijkstra fait) est plus rapide sur une liste.
```

## QUAND EST-CE QUE LE PROJET EST VRAIMENT FINI

```
[ ] le graphe du réseau se charge depuis data/network.json sans erreur
[ ] Dijkstra trouve le bon chemin sur au moins 3 paires de noeuds testées
[ ] le min-heap retourne les urgences dans le bon ordre (tests verts)
[ ] Merge Sort et Quick Sort sont tous les deux benchmarkés et les résultats sont dans logs/
[ ] knapsack retourne la bonne combinaison sur au moins 2 jeux de données testés
[ ] les 5 cas limites listés ont chacun un test
[ ] aucun tableau n'est muté dans les fonctions de tri
[ ] les 3 ADR sont remplis avec contexte, décision, alternatives, conséquences
[ ] POSTMORTEM.md documente le bug le plus difficile à localiser
[ ] TDD_JOURNAL.md trace l'ordre dans lequel les tests ont été écrits
```

## SÉCURITÉ (gate obligatoire)

Un projet qui marche mais qui est vulnérable n'est pas fini. Traite ces exigences OWASP contextuelles avant de livrer.

- Cache poisoning (OWASP A08 - Data Integrity) : valider les clés de cache pour qu'un utilisateur ne puisse pas empoisonner une entrée partagée.
- Fuite d'info (OWASP A01) : ne jamais servir une entrée de cache appartenant à un autre utilisateur/scope.

Pour chaque exigence : documente dans `SECURITY.md` la menace, ta contre-mesure et le test qui la prouve. Le `verification_pack` de ce projet contient un test de sécurité qui doit passer.

---

## Securite (gate obligatoire, Partie I)

- **Exigence 1** : aucune donnee sensible (secret, token, cle) dans le code source ni dans les logs. Utiliser variables d'environnement + `.env.example` versionne (jamais `.env`).
- **Exigence 2** : toute entree externe (STDIN, fichier, HTTP, CLI) est validee AVANT usage (type, longueur, format). En cas d'invalidite : erreur explicite, jamais un crash silencieux.

Un test dans `node solution.js` (auto-verif ecrite par toi) doit prouver ces deux points (ex : lancer le programme avec une entree malformee et verifier qu'il refuse proprement).

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**
