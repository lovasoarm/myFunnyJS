---
stability: intemporel
---

# TDD JOURNAL : BREAKING CACHE
Temps de lecture ~7 min

Ce journal trace l'ordre réel dans lequel les tests ont été écrits. Le cahier des charges impose l'ordre : structures d'abord, algorithmes ensuite, benchmarks en dernier. Voici comment ça s'est passé.

---

## ÉTAPE 1 : `minHeap.js` : la structure qui priorise

Le heap est utilisé par Dijkstra. Si Dijkstra est testé avant le heap, les tests du heap vont être écrits sous pression de faire passer l'intégration. Mauvaise idée. Heap d'abord.

**Premier test écrit :**

```js
test('insert() maintient la propriété de heap (parent <= enfants)', () => {
 const heap = new MinHeap();
 heap.insert({ priorite: 5, ville: 'ABQ' });
 heap.insert({ priorite: 2, ville: 'Juarez' });
 heap.insert({ priorite: 8, ville: 'Santa Fe' });

 expect(heap.peek().priorite).toBe(2); // minimum toujours en tête
});
```

Rouge. Implémenté `insert` avec `bubbleUp`. Vert.

**Deuxième test, le plus important :**

```js
test('extractMin() retourne le minimum et maintient la propriété après extraction', () => {
 const heap = new MinHeap();
 [5, 2, 8, 1, 9, 3].forEach(p => heap.insert({ priorite: p }));

 expect(heap.extractMin().priorite).toBe(1);
 expect(heap.extractMin().priorite).toBe(2);
 expect(heap.extractMin().priorite).toBe(3);
});
```

`sinkDown` après extraction : la partie la plus délicate. Bug initial : l'échange se faisait avec l'enfant gauche systématiquement au lieu du plus petit des deux enfants. Attrapé par ce test. Fix : comparer `left` et `right` avant d'échanger.

---

## ÉTAPE 2 : `adjacencyList.js` et `graphBuilder.js`

Le graphe doit être testable indépendamment de Dijkstra.

```js
test('addEdge() crée une route bidirectionnelle avec cout et risque', () => {
 const graph = new AdjacencyList();
 graph.addEdge('ABQ', 'Juarez', { cout: 10, risque: 0.3 });

 expect(graph.getNeighbors('ABQ')).toContainEqual({
  destination: 'Juarez', cout: 10, risque: 0.3
 });
 expect(graph.getNeighbors('Juarez')).toContainEqual({
  destination: 'ABQ', cout: 10, risque: 0.3
 });
});

test('un noeud sans voisins retourne un tableau vide, pas une erreur', () => {
 const graph = new AdjacencyList();
 expect(graph.getNeighbors('ville-inexistante')).toEqual([]);
});
```

Le deuxième test a révélé un crash : premier implémentation faisait `return this.liste[node]` sans vérifier que le noeud existe. Ajout d'un `?? []`.

---

## ÉTAPE 3 : `dijkstra.js` : la zone de résistance principale

Le cahier des charges prévenait : Dijkstra est l'algo le plus complexe du projet. Tester le cas simple d'abord.

```js
test('retourne la distance 0 pour source === destination', () => {
 expect(dijkstra(graph, 'ABQ', 'ABQ').cout).toBe(0);
});

test('trouve le chemin le plus court dans un graphe simple', () => {
 // A --5-- B --3-- C
 const result = dijkstra(simpleGraph, 'A', 'C');
 expect(result.cout).toBe(8);
 expect(result.chemin).toEqual(['A', 'B', 'C']);
});
```

Le cas `A --> C` avec un raccourci `A --20-- C` :

```js
test('préfère le chemin indirect si il est moins cher', () => {
 // A --5-- B --3-- C
 // A --------20--- C (direct mais plus cher)
 const result = dijkstra(graphAvecRaccourci, 'A', 'C');
 expect(result.cout).toBe(8);  // passe par B, pas direct
 expect(result.chemin).toEqual(['A', 'B', 'C']);
});
```

Ce test a attrapé un bug de reconstruction de chemin : le tableau `predecesseur` n'était pas initialisé à `null` pour chaque noeud, ce qui donnait un chemin partiel au lieu du chemin complet.

---

## ÉTAPE 4 : `bfs.js` et `dfs.js`

Tests classiques de traversée, plus simples après Dijkstra.

```js
test('bfs() visite tous les noeuds connectés exactement une fois', () => {
 const visited = bfs(graph, 'ABQ');
 expect(new Set(visited).size).toBe(visited.length); // pas de doublon
 expect(visited.length).toBe(graph.nodeCount());
});

test('dfs() respecte l\'ordre profondeur avant largeur', () => {
 // sur un graphe linéaire A --> B --> C --> D
 const result = dfs(linearGraph, 'A');
 expect(result).toEqual(['A', 'B', 'C', 'D']); // profondeur complète d'abord
});
```

---

## ÉTAPE 5 : `quickSort.js` et `mergeSort.js`

Tests de tri sur des cas connus.

```js
test('quickSort trie correctement un tableau de lots par priorité', () => {
 const lots = [{ id: 3, urgence: 5 }, { id: 1, urgence: 1 }, { id: 2, urgence: 3 }];
 const triés = quickSort(lots, (a, b) => a.urgence - b.urgence);
 expect(triés.map(l => l.urgence)).toEqual([1, 3, 5]);
});

test('mergeSort est stable : éléments égaux gardent leur ordre initial', () => {
 const lots = [{ id: 1, urgence: 3 }, { id: 2, urgence: 3 }, { id: 3, urgence: 1 }];
 const triés = mergeSort(lots, (a, b) => a.urgence - b.urgence);
 // les deux éléments à urgence=3 restent dans l'ordre id:1 avant id:2
 expect(triés[1].id).toBe(1);
 expect(triés[2].id).toBe(2);
});
```

Le test de stabilité de `mergeSort` a confirmé un choix d'implémentation : utiliser `<=` au lieu de `<` dans la condition de merge garantit la stabilité.

---

## ÉTAPE 6 : `stockOptimizer.js` : dynamic programming

```js
test('knapsack retourne la valeur maximale sous la contrainte de poids', () => {
 const items = [
  { nom: 'bleu', valeur: 60, poids: 10 },
  { nom: 'rouge', valeur: 100, poids: 20 },
  { nom: 'vert', valeur: 120, poids: 30 },
 ];
 const result = knapsack(items, 50);
 expect(result.valeurTotale).toBe(220); // rouge + vert
});

test('ne sélectionne rien si capacité 0', () => {
 expect(knapsack(items, 0).valeurTotale).toBe(0);
});
```

---

## RÉCAPITULATIF DE L'ORDRE RÉEL

```
1. minHeap.js     (pré-requis pour Dijkstra)
2. adjacencyList.js  (graphe isolé, sans algo)
3. graphBuilder.js   (construction depuis les données)
4. dijkstra.js     (algo principal, le plus long à tester)
5. bfs.js + dfs.js   (traversées)
6. quickSort.js    (tri en place, unstable)
7. mergeSort.js    (tri stable)
8. stockOptimizer.js  (DP, dernier)
9. benchmarker.js   (pas de tests unitaires : vérification à l'oeil)
```

Total : 47 tests à la fin, répartis sur 5 fichiers de test.

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Section obligatoire (chantier v14 #15.5). À remplir avec au moins un exemple
concret par refactoring notable du projet :

- Version pré-refacto : ...
- Ce qui bloquait : ...
- Refacto appliqué : ...
- Test devenu possible : ...
