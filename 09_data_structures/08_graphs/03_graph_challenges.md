---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# GRAPH CHALLENGES : CYCLES, COMPOSANTS, TOPO SORT
Temps de lecture ~10 min

Trois problèmes classiques sur les graphes. Chacun a un algorithme précis. Chacun apparaît dans des contextes réels : détecter une dépendance circulaire avant de lancer un build, trouver les îlots isolés dans un réseau, déterminer l'ordre d'exécution d'un pipeline. Reconnaître le problème suffit à choisir l'algo.

---

## 1) DÉTECTER UN CYCLE

Un cycle = un chemin qui revient à son point de départ. Sur un graphe non dirigé, c'est simple. Sur un graphe dirigé, c'est plus subtil.

### Graphe non dirigé : DFS + parent tracking

```js
function hasCycleUndirected(graph) {
 const visited = new Set()

 function dfs(current, parent) {
  visited.add(current)

  for (const { node } of graph.getNeighbors(current)) {
   if (!visited.has(node)) {
    if (dfs(node, current)) return true // cycle détecté en dessous
   } else if (node !== parent) {
    // noeud déjà visité qui n'est pas le parent direct : CYCLE
    return true
   }
  }

  return false
 }

 // démarre depuis chaque noeud (le graphe peut ne pas être connexe)
 for (const vertex of graph.adjacencyList.keys()) {
  if (!visited.has(vertex)) {
   if (dfs(vertex, null)) return true
  }
 }

 return false
}
```

Trace sur un exemple :

```
A -- B -- C -- D -- B (retour sur B : cycle)

dfs(A, null)
 visite B (parent = A)
 dfs(B, A)
  visite C (parent = B)
  dfs(C, B)
   visite D (parent = C)
   dfs(D, C)
    voisin B : déjà visité, B !== C (parent) --> CYCLE détecté
```

### Graphe dirigé : DFS + "en cours de visite"

Sur un graphe dirigé, retomber sur un noeud "déjà visité" ne suffit pas : il faut que ce noeud soit dans la stack de récursion actuelle.

```js
function hasCycleDirected(graph) {
 const visited  = new Set() // noeuds entièrement traités
 const inProgress = new Set() // noeuds en cours de traitement (stack actuelle)

 function dfs(current) {
  inProgress.add(current)

  for (const { node } of graph.getNeighbors(current)) {
   if (inProgress.has(node)) return true // retour sur un noeud en cours : CYCLE

   if (!visited.has(node)) {
    if (dfs(node)) return true
   }
  }

  inProgress.delete(current) // traitement terminé pour ce noeud
  visited.add(current)
  return false
 }

 for (const vertex of graph.adjacencyList.keys()) {
  if (!visited.has(vertex)) {
   if (dfs(vertex)) return true
  }
 }

 return false
}
```

Application : les dépendances npm. Si module A dépend de B qui dépend de A : cycle. Le build ne peut jamais démarrer.

```js
const deps = new Graph(true)
deps.addEdge("react",     "object-assign")
deps.addEdge("react-dom",   "react")
deps.addEdge("object-assign", "react") // cycle : react --> object-assign --> react

hasCycleDirected(deps) // true : impossible à installer
```

---

## 2) COMPOSANTS CONNEXES

Un composant connexe = un groupe de noeuds tous mutuellement atteignables. Un graphe peut en avoir plusieurs (les noeuds isolés sont des composants à eux seuls).

```
Graphe :

A -- B   D -- E -- F   G

Trois composants : {A, B}, {D, E, F}, {G}
```

```js
function findConnectedComponents(graph) {
 const visited  = new Set()
 const components = []

 function dfs(vertex, component) {
  visited.add(vertex)
  component.push(vertex)

  for (const { node } of graph.getNeighbors(vertex)) {
   if (!visited.has(node)) dfs(node, component)
  }
 }

 for (const vertex of graph.adjacencyList.keys()) {
  if (!visited.has(vertex)) {
   const component = []
   dfs(vertex, component)
   components.push(component)
  }
 }

 return components
}
```

Application : le camp de Rick après une attaque. Certains groupes de survivants se retrouvent isolés (le graphe de communication est coupé). Trouver les groupes isolés = trouver les composants connexes.

```js
const camp = new Graph(false)
camp.addEdge("Rick",  "Daryl")
camp.addEdge("Rick",  "Carl")
camp.addEdge("Glenn",  "Maggie")  // groupe séparé : Glenn coupé du groupe Rick
camp.addEdge("Michonne", "Hershel") // autre groupe isolé

findConnectedComponents(camp)
// [["Rick", "Daryl", "Carl"], ["Glenn", "Maggie"], ["Michonne", "Hershel"]]
```

---

## 3) TOPOLOGICAL SORT

Sur un DAG (graphe dirigé acyclique), le topological sort donne un ordre linéaire des noeuds tel que pour chaque arête A → B, A apparaît avant B dans l'ordre.

Cas réels : ordre de compilation, ordre d'installation de packages, ordre d'exécution des tâches d'un pipeline.

```
Dépendances du curriculum MyFunnyJS :

01_fundamentals --> 03_async --> 03_testing
01_fundamentals --> 04_errors
07_structures  --> 10_algorithms
09_functional  --> 10_patterns
```

Topological sort valide : `01_fundamentals, 07_structures, 09_functional, 03_async, 04_errors, 03_testing, 10_algorithms, 10_patterns`

### Kahn's Algorithm (BFS-based)

Principe : les noeuds sans dépendance (in-degree = 0) peuvent être traités en premier.

```js
function topologicalSortKahn(graph) {
 const inDegree = new Map() // { noeud : nombre d'arêtes entrantes }
 const result  = []
 const queue  = []

 // initialise in-degree à 0 pour tous les noeuds
 for (const vertex of graph.adjacencyList.keys()) {
  inDegree.set(vertex, 0)
 }

 // calcule l'in-degree de chaque noeud
 for (const [vertex, edges] of graph.adjacencyList) {
  for (const { node } of edges) {
   inDegree.set(node, (inDegree.get(node) ?? 0) + 1)
  }
 }

 // démarre avec les noeuds sans dépendance (in-degree = 0)
 for (const [vertex, degree] of inDegree) {
  if (degree === 0) queue.push(vertex)
 }

 while (queue.length > 0) {
  const current = queue.shift()
  result.push(current)

  // "supprime" le noeud : décrémente l'in-degree de ses voisins
  for (const { node } of graph.getNeighbors(current)) {
   inDegree.set(node, inDegree.get(node) - 1)
   if (inDegree.get(node) === 0) queue.push(node) // nouveau noeud libéré
  }
 }

 // si result.length < nombre de noeuds : il y avait un cycle
 if (result.length !== graph.adjacencyList.size) {
  throw new Error("Cycle détecté : impossible de faire un topological sort")
 }

 return result
}
```

### DFS-based Topological Sort

```js
function topologicalSortDFS(graph) {
 const visited = new Set()
 const stack  = [] // résultat en ordre inverse

 function dfs(vertex) {
  visited.add(vertex)

  for (const { node } of graph.getNeighbors(vertex)) {
   if (!visited.has(node)) dfs(node)
  }

  // on pousse le noeud APRÈS avoir traité tous ses voisins
  stack.push(vertex)
 }

 for (const vertex of graph.adjacencyList.keys()) {
  if (!visited.has(vertex)) dfs(vertex)
 }

 return stack.reverse() // le dernier poussé doit être premier
}
```

Application sur le curriculum :

```js
const curriculum = new Graph(true)
curriculum.addEdge("03_async",   "01_fundamentals") // async dépend de fundamentals
curriculum.addEdge("03_testing",  "01_fundamentals")
curriculum.addEdge("03_testing",  "03_async")
curriculum.addEdge("10_algorithms", "07_structures")

topologicalSortKahn(curriculum)
// ["01_fundamentals", "07_structures", "03_async", "03_testing", "10_algorithms"]
// ordre valide : chaque module après tous ses prérequis
```

---

## 4) LE TOUT ENSEMBLE : PIPELINE DE BUILD

Un pipeline de build réel utilise les trois algos :

```js
function analyzeBuildPipeline(tasks) {
 const graph = new Graph(true)

 // construit le graphe de dépendances
 for (const [task, deps] of Object.entries(tasks)) {
  for (const dep of deps) {
   graph.addEdge(task, dep)
  }
 }

 // 1. y a-t-il un cycle ? (build impossible si oui)
 if (hasCycleDirected(graph)) {
  throw new Error("Dépendance circulaire : build bloqué")
 }

 // 2. composants isolés ? (tâches qui n'ont rien en commun)
 const components = findConnectedComponents(new Graph(false) /* version non dirigée */)

 // 3. ordre d'exécution
 const buildOrder = topologicalSortKahn(graph)

 return { buildOrder, components }
}

const pipeline = {
 "lint":   [],
 "test":   ["lint"],
 "build":  ["test"],
 "deploy":  ["build"],
 "docs":   ["lint"] // docs et test/build sont des branches parallèles
}

analyzeBuildPipeline(pipeline)
// buildOrder : ["lint", "test", "docs", "build", "deploy"] (un ordre valide parmi plusieurs)
```

---

## EXERCICES

## EXO 1 : validation des imports MyFunnyJS
_~20 min_


Tu as les dépendances entre fichiers du projet. Détecte les imports circulaires avant de lancer le build.

```js
const imports = {
 "utils.js":   [],
 "config.js":   ["utils.js"],
 "api.js":    ["config.js", "utils.js"],
 "router.js":   ["api.js"],
 "middleware.js": ["router.js", "config.js"],
 // ajoute "utils.js": ["middleware.js"] pour créer un cycle
}
```

Implémente `detectCircularImports(imports)` : retourne `null` si aucun cycle, ou le cycle trouvé sous forme de tableau `["utils.js", "middleware.js", "router.js", "api.js", "config.js", "utils.js"]`.

---

## EXO 2 : les îlots de résistance dans Walking Dead
_~25 min_


La carte du territoire post-apocalyptique est un graphe. Certaines zones sont coupées des autres par des hordes de zombies. Les survivants dans des zones isolées ne savent pas que Rick existe.

```js
const territory = new Graph(false)
// zone principale
territory.addEdge("Alexandria", "Hilltop")
territory.addEdge("Hilltop",   "Kingdom")
territory.addEdge("Alexandria", "Sanctuary")
// zones isolées
territory.addEdge("Oceanside",  "Junkyard")
territory.addEdge("Terminus",  "Terminus-Nord")
```

Trouve tous les composants connexes. Affiche combien de groupes sont isolés du groupe principal (Alexandria).

---

## EXO 3 : le pipeline de production de Gus Fring
_~20 min_


Gus a un pipeline de production en 8 étapes. Certaines étapes doivent être terminées avant d'autres. Il veut paralléliser au maximum.

```js
const production = {
 "synthèse":    [],
 "purification":  ["synthèse"],
 "test-qualité":  ["purification"],
 "emballage":   ["test-qualité"],
 "distribution":  ["emballage"],
 "comptabilité":  ["synthèse"],      // en parallèle de purification
 "logistique":   ["comptabilité"],     // dépend de comptabilité
 "livraison":   ["distribution", "logistique"] // attend les deux branches
}
```

1. Vérifie qu'il n'y a pas de cycle
2. Retourne l'ordre topologique avec Kahn
3. Identifie les étapes qui peuvent être exécutées en parallèle (même "niveau" dans le tri)

---

## RÉSUMÉ

Trois patterns fondamentaux sur les graphes : détection de cycle (DFS + inProgress pour les dirigés, parent tracking pour les non dirigés), composants connexes (DFS depuis chaque noeud non visité), topological sort (Kahn avec in-degree ou DFS avec post-order). Ces algos s'enchaînent naturellement dans les problèmes réels : un pipeline de build vérifie les cycles, identifie les modules indépendants, puis calcule l'ordre d'exécution. En entretien, les reconnaître suffit à savoir quoi coder.
