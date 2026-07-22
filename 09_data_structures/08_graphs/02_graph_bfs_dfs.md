---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# BFS VS DFS : DEUX FAÇONS DE TRAVERSER UN GRAPHE
Temps de lecture ~9 min

BFS et DFS traversent tous les noeuds d'un graphe. Le résultat final est le même : tous les noeuds visités. Mais l'ordre de visite est radicalement différent. Et cet ordre détermine lequel des deux résout ton problème.

Règle : BFS pour le chemin le plus court, DFS pour l'exploration complète.

---

## 1) BFS : BREADTH-FIRST SEARCH

Visite les noeuds niveau par niveau, en s'éloignant progressivement du point de départ.

```
Graphe (non dirigé, non pondéré) :

   A
  / \
  B  C
 / \  \
 D  E  F
```

BFS depuis A :
```
Niveau 0 : A
Niveau 1 : B, C
Niveau 2 : D, E, F

Ordre de visite : A, B, C, D, E, F
```

Outil : une queue (FIFO).

```js
function bfs(graph, start) {
 const visited = new Set()
 const queue  = [start]
 const result = []

 visited.add(start)

 while (queue.length > 0) {
  const current = queue.shift() // prend le premier (FIFO)
  result.push(current)

  // enfile tous les voisins non encore visités
  for (const { node } of graph.getNeighbors(current)) {
   if (!visited.has(node)) {
    visited.add(node)
    queue.push(node)
   }
  }
 }

 return result
}
```

BFS garantit : quand il visite un noeud pour la première fois, c'est via le chemin le plus court (en nombre d'arêtes).

---

## 2) BFS : CHEMIN LE PLUS COURT

Pour retourner le chemin et pas juste l'ordre de visite, on trace les parents.

```js
function bfsShortestPath(graph, start, end) {
 if (start === end) return [start]

 const visited = new Set()
 const queue  = [start]
 const parent = new Map() // { noeud : noeud parent }

 visited.add(start)

 while (queue.length > 0) {
  const current = queue.shift()

  for (const { node } of graph.getNeighbors(current)) {
   if (!visited.has(node)) {
    visited.add(node)
    parent.set(node, current)
    queue.push(node)

    // destination atteinte : reconstruction du chemin
    if (node === end) return reconstructPath(parent, start, end)
   }
  }
 }

 return null // pas de chemin
}

function reconstructPath(parent, start, end) {
 const path = []
 let current = end

 while (current !== start) {
  path.unshift(current)
  current = parent.get(current)
 }

 path.unshift(start)
 return path
}
```

Trace sur le plan d'évasion de Fox River (Michael cherche le chemin le plus court vers la sortie) :

```js
const prison = new Graph(false)
prison.addEdge("Cellule B5", "Couloir 3")
prison.addEdge("Couloir 3", "Salle médicale")
prison.addEdge("Couloir 3", "Cuisine")
prison.addEdge("Cuisine",  "Sortie")
prison.addEdge("Salle médicale", "Sortie")

bfsShortestPath(prison, "Cellule B5", "Sortie")
// --> ["Cellule B5", "Couloir 3", "Cuisine", "Sortie"] (3 arêtes)
// --> ["Cellule B5", "Couloir 3", "Salle médicale", "Sortie"] (3 arêtes aussi)
// BFS retourne l'un des deux (les deux font 3 arêtes, les deux sont "plus courts")
```

---

## 3) DFS : DEPTH-FIRST SEARCH

Va aussi loin que possible dans une direction avant de revenir en arrière.

```
Même graphe :

   A
  / \
  B  C
 / \  \
 D  E  F

DFS depuis A (version récursive, gauche d'abord) :
A --> B --> D (cul-de-sac, revient) --> E (cul-de-sac, revient) --> C --> F

Ordre de visite : A, B, D, E, C, F
```

Outil : une stack (LIFO) : ou simplement la call stack via récursion.

```js
// version récursive
function dfsRecursive(graph, start, visited = new Set(), result = []) {
 visited.add(start)
 result.push(start)

 for (const { node } of graph.getNeighbors(start)) {
  if (!visited.has(node)) {
   dfsRecursive(graph, node, visited, result)
  }
 }

 return result
}

// version itérative (stack explicite)
function dfsIterative(graph, start) {
 const visited = new Set()
 const stack  = [start]
 const result = []

 while (stack.length > 0) {
  const current = stack.pop() // prend le dernier (LIFO)

  if (!visited.has(current)) {
   visited.add(current)
   result.push(current)

   for (const { node } of graph.getNeighbors(current)) {
    if (!visited.has(node)) stack.push(node)
   }
  }
 }

 return result
}
```

---

## 4) COMPARAISON DIRECTE

```
Même graphe, même point de départ A :

   A
  / \
  B  C
 / \  \
 D  E  F

BFS : A, B, C, D, E, F  (niveau par niveau : proche avant lointain)
DFS : A, B, D, E, C, F  (profondeur d'abord : loin avant large)
```

```
        BFS             DFS
Structure    Queue (FIFO)        Stack (LIFO)
Ordre      Niveau par niveau      Profondeur d'abord
Mémoire     O(largeur max du graphe)  O(profondeur max)
Chemin court  Garantit le plus court   Ne garantit pas
Détection cycle Oui             Oui
Topological sort Non            Oui
Explorat. complète Oui           Oui
```

---

## 5) QUAND UTILISER LEQUEL

**BFS :**
- chemin le plus court (non pondéré)
- niveau de séparation entre deux noeuds ("Michael est à combien d'étapes de la sortie ?")
- propagation : infection, rumeur, signal (combien d'étapes pour contaminer tout le réseau ?)
- BFS sur un graphe sans cycles = parcours niveau par niveau d'un arbre

**DFS :**
- détecter un cycle
- topological sort (ordre de compilation, ordre d'installation de packages)
- trouver tous les chemins possibles entre deux noeuds
- résoudre des puzzles / labyrinthes (backtracking)
- composants connexes

---

## 6) DFS POUR TOUS LES CHEMINS

DFS explore toutes les branches. Avec backtracking, on peut lister tous les chemins possibles.

```js
function allPaths(graph, start, end) {
 const allRoutes = []

 function dfs(current, path) {
  if (current === end) {
   allRoutes.push([...path]) // copie le chemin actuel
   return
  }

  for (const { node } of graph.getNeighbors(current)) {
   if (!path.includes(node)) { // évite les cycles
    path.push(node)
    dfs(node, path)
    path.pop() // backtrack
   }
  }
 }

 dfs(start, [start])
 return allRoutes
}

allPaths(prison, "Cellule B5", "Sortie")
// [
//  ["Cellule B5", "Couloir 3", "Cuisine", "Sortie"],
//  ["Cellule B5", "Couloir 3", "Salle médicale", "Sortie"]
// ]
```

BFS n'aurait retourné qu'un seul chemin. DFS les trouve tous.

---

## EXERCICES

## EXO 1 : la propagation du virus dans le camp de Rick
_~20 min_


Le camp de Rick a un graphe de contacts entre survivants (non dirigé). Si un survivant est infecté, tous ses contacts directs sont exposés au jour 1, leurs contacts au jour 2, etc.

```js
const contacts = new Graph(false)
contacts.addEdge("Rick",  "Daryl")
contacts.addEdge("Rick",  "Glenn")
contacts.addEdge("Daryl",  "Michonne")
contacts.addEdge("Glenn",  "Maggie")
contacts.addEdge("Maggie", "Hershel")
contacts.addEdge("Michonne","Carl")
```

Implémente `spreadInfection(start)` qui retourne un objet `{ noeud: jouréExposition }` pour tous les contacts. Utilise BFS.

---

## EXO 2 : est-ce que la prison est évadable ?
_~15 min_


Michael a un graphe de sections de la prison. Certaines sections sont bloquées (liste noire). Il veut savoir si la sortie est atteignable depuis sa cellule sans passer par les sections bloquées.

Implémente `canEscape(graph, start, end, blockedSections)`. Utilise DFS. Retourne `true/false`.

---

## EXO 3 : le réseau des Champions League
_~20 min_


Un graphe dirigé représente les résultats de matchs aller du groupe A :

```js
const group = new Graph(true)
group.addEdge("Bayern",    "Barcelona", { goals: "3-2" })
group.addEdge("Barcelona",  "PSG",    { goals: "4-1" })
group.addEdge("PSG",     "Juventus",  { goals: "2-0" })
group.addEdge("Juventus",   "Bayern",   { goals: "1-3" })
group.addEdge("Bayern",    "PSG",    { goals: "2-1" })
group.addEdge("Barcelona",  "Juventus",  { goals: "1-1" })
```

1. BFS depuis "Bayern" : dans quel ordre les équipes sont-elles atteignables ?
2. DFS : tous les chemins depuis "Bayern" vers "Juventus"
3. Le cycle existe-t-il ? (Bayern bat PSG, PSG bat Juve, Juve bat Bayern : pas de champion clair)

---

## RÉSUMÉ

BFS explore niveau par niveau via une queue : garantit le plus court chemin en arêtes. DFS plonge en profondeur via une stack ou la récursion : trouve tous les chemins, détecte les cycles, permet le topological sort. En pratique : BFS = "combien d'étapes entre A et B ?", DFS = "est-ce que A et B sont connectés, et par quels chemins ?". Les deux utilisent un Set `visited` pour éviter les boucles infinies sur les graphes avec cycles.
