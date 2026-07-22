---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# TOPOLOGICAL SORT : L'ORDRE QUI RESPECTE LES DÉPENDANCES
Temps de lecture ~11 min

Tu as des tâches. Certaines dépendent d'autres. Tu ne peux pas faire B avant A. Tu ne peux pas installer un package avant ses dépendances. Tu ne peux pas compiler un module avant ceux qu'il importe.

Le topological sort prend un graphe orienté acyclique (DAG) et retourne un ordre d'exécution où chaque noeud apparaît avant tous ceux qui dépendent de lui. Si le graphe a un cycle : pas de solution possible, et l'algo le détecte.

C'est exactement ce que fait `npm install`, les systèmes de build (Webpack, Make), les pipelines CI/CD, et les planificateurs de tâches.

---

## 1) LE DAG : PRÉREQUIS

Topological sort ne fonctionne que sur des **graphes orientés acycliques**. Les deux conditions :

**Orienté :** les arêtes ont un sens. "A dépend de B" ≠ "B dépend de A".
**Acyclique :** pas de cycle. Si A→B→C→A, il n'existe aucun ordre valide.

```
Graphe valide (DAG) :    Graphe invalide (cycle) :

A ──> B ──> D        A ──> B
│     ↑         ↑   │
└──> C ───┘         └──── C
```

---

## 2) ALGORITHME DE KAHN : BFS-BASED

L'idée : un noeud peut être traité quand tous ses prédécesseurs ont été traités. On commence par les noeuds sans prédécesseurs (in-degree = 0). On les retire du graphe, ce qui peut rendre d'autres noeuds libres.

```js
function topoSortKahn(graph) {
 // graph : Map<node, Set<neighbor>> (arêtes sortantes)
 // calculer l'in-degree de chaque noeud
 const inDegree = new Map();
 for (const node of graph.keys()) inDegree.set(node, 0);

 for (const [, neighbors] of graph) {
  for (const neighbor of neighbors) {
   inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
  }
 }

 // queue : tous les noeuds sans prédécesseur
 const queue = [];
 for (const [node, degree] of inDegree) {
  if (degree === 0) queue.push(node);
 }

 const result = [];

 while (queue.length > 0) {
  const node = queue.shift();
  result.push(node);

  for (const neighbor of graph.get(node) || []) {
   inDegree.set(neighbor, inDegree.get(neighbor) - 1);
   // ce voisin est maintenant libre si tous ses prédécesseurs sont traités
   if (inDegree.get(neighbor) === 0) queue.push(neighbor);
  }
 }

 // si result n'a pas tous les noeuds : il y avait un cycle
 if (result.length !== graph.size) {
  throw new Error("Cycle détecté : topological sort impossible");
 }

 return result;
}
```

---

## 3) EXEMPLE : DÉPENDANCES DE MODULES JS

```js
// Modules et leurs dépendances (A dépend de B => arête A→B)
const modules = new Map([
 ["app", new Set(["router", "store", "utils"])],
 ["router", new Set(["utils"])],
 ["store", new Set(["api", "utils"])],
 ["api", new Set(["utils", "config"])],
 ["utils", new Set(["config"])],
 ["config", new Set()],
]);

console.log(topoSortKahn(modules));
// ["config", "utils", "api", "router", "store", "app"]
// ou une autre permutation valide
// contrainte : config avant utils, utils avant api, etc.
```

**Trace :**

```
in-degrees : config=0, utils=1, api=1, router=1, store=1, app=0...
       config=0 (personne ne dépend de config comme source? Si, utils dépend de config)
       Recalcul :
       config : in=0 (personne ne pointe vers config)
       utils : in=2 (router et app et store... non)

Arêtes : app→router, app→store, app→utils
     router→utils
     store→api, store→utils
     api→utils, api→config
     utils→config

in-degrees :
 app  : 0 (personne ne pointe vers app)
 router : 1 (app→router)
 store : 1 (app→store)
 utils : 3 (app→utils, router→utils, store→utils, api→utils = 4... non, compter)
 api  : 1 (store→api)
 config : 2 (api→config, utils→config)

Queue initiale : [app]  (seul noeud avec in-degree 0)

Pop app : result=[app], décrémenter router(0), store(0), utils(3-1=3)
 => queue = [router, store]

Pop router : result=[app,router], décrémenter utils(3-1=2)
 => queue = [store]

Pop store : result=[app,router,store], décrémenter api(0), utils(2-1=1)
 => queue = [api]

Pop api : result=[app,router,store,api], décrémenter utils(1-1=0), config(2-1=1)
 => queue = [utils]

Pop utils : result=[app,router,store,api,utils], décrémenter config(1-1=0)
 => queue = [config]

Pop config : result=[app,router,store,api,utils,config]

=> ordre de build valide mais inversé pour l'ordre d'import :
  pour charger app, on charge d'abord config, utils, api, store, router, puis app
```

---

## 4) DFS-BASED : L'AUTRE APPROCHE

DFS post-order : explorer récursivement, ajouter un noeud au résultat **après** avoir fini tous ses voisins. Inverser le résultat.

```js
function topoSortDFS(graph) {
 const visited = new Set();
 const onStack = new Set(); // pour détecter les cycles
 const result = [];

 function dfs(node) {
  if (onStack.has(node)) {
   throw new Error(`Cycle détecté au noeud: ${node}`);
  }
  if (visited.has(node)) return;

  onStack.add(node);
  visited.add(node);

  for (const neighbor of graph.get(node) || []) {
   dfs(neighbor);
  }

  onStack.delete(node);
  result.push(node); // post-order : après avoir visité tous les voisins
 }

 for (const node of graph.keys()) {
  if (!visited.has(node)) dfs(node);
 }

 return result.reverse(); // inverser pour avoir l'ordre topologique
}
```

**Différence Kahn vs DFS :**

```
Kahn (BFS) :
+ Détecte le cycle clairement (résultat incomplet)
+ Naturel pour des systèmes avec arrivées dynamiques
+ Plus facile à paralléliser (tous les noeuds de in-degree 0 peuvent s'exécuter en parallèle)
- Nécessite de calculer les in-degrees en avance

DFS :
+ Pas de précalcul
+ Plus compact
- Cycle détecté via `onStack`, légèrement plus subtil
```

---

## 5) DÉTECTION DE CYCLE

```js
function hasCycle(graph) {
 const WHITE = 0,
  GRAY = 1,
  BLACK = 2;
 const color = new Map();
 for (const node of graph.keys()) color.set(node, WHITE);

 function dfs(node) {
  color.set(node, GRAY); // en cours de traitement

  for (const neighbor of graph.get(node) || []) {
   if (color.get(neighbor) === GRAY) return true; // back edge = cycle
   if (color.get(neighbor) === WHITE && dfs(neighbor)) return true;
  }

  color.set(node, BLACK); // traitement terminé
  return false;
 }

 for (const node of graph.keys()) {
  if (color.get(node) === WHITE && dfs(node)) return true;
 }

 return false;
}

// Exemple avec cycle
const cyclic = new Map([
 ["A", new Set(["B"])],
 ["B", new Set(["C"])],
 ["C", new Set(["A"])], // cycle !
]);
console.log(hasCycle(cyclic)); // true
```

---

## 6) APPLICATION : COURSE SCHEDULE

Problème classique d'entretien : `n` cours, `prerequisites[[a,b]]` signifie "suivre b avant a". Peut-on tous les terminer ?

```js
function canFinish(numCourses, prerequisites) {
 const graph = new Map();
 for (let i = 0; i < numCourses; i++) graph.set(i, new Set());

 for (const [course, prereq] of prerequisites) {
  graph.get(course).add(prereq);
 }

 try {
  topoSortDFS(graph);
  return true; // pas de cycle = on peut tout terminer
 } catch {
  return false; // cycle = impossible
 }
}

// Plus propre : utiliser hasCycle directement
function canFinishClean(numCourses, prerequisites) {
 const graph = new Map();
 for (let i = 0; i < numCourses; i++) graph.set(i, new Set());
 for (const [a, b] of prerequisites) graph.get(a).add(b);
 return !hasCycle(graph);
}

console.log(canFinishClean(2, [[1, 0]])); // true : 0 avant 1, pas de cycle
console.log(
 canFinishClean(2, [
  [1, 0],
  [0, 1],
 ]),
); // false : 0 avant 1 et 1 avant 0 = cycle
```

---

## 7) PARALLEL SCHEDULING : TOUTES LES TÂCHES EN PARALLÈLE

Kahn révèle quelque chose de puissant : à chaque étape, tous les noeuds avec in-degree 0 peuvent s'exécuter **en parallèle**. Ça donne directement le temps minimum d'exécution si on a des ressources infinies.

```js
function parallelSchedule(graph) {
 const inDegree = new Map();
 for (const node of graph.keys()) inDegree.set(node, 0);
 for (const [, neighbors] of graph) {
  for (const n of neighbors) inDegree.set(n, (inDegree.get(n) || 0) + 1);
 }

 const waves = []; // chaque wave = ensemble de tâches parallélisables
 let queue = [...inDegree.entries()]
  .filter(([, d]) => d === 0)
  .map(([n]) => n);

 while (queue.length > 0) {
  waves.push([...queue]);
  const nextQueue = [];

  for (const node of queue) {
   for (const neighbor of graph.get(node) || []) {
    inDegree.set(neighbor, inDegree.get(neighbor) - 1);
    if (inDegree.get(neighbor) === 0) nextQueue.push(neighbor);
   }
  }

  queue = nextQueue;
 }

 return waves;
}

// Pipeline CI/CD de Fox River Prison
const pipeline = new Map([
 ["lint", new Set(["test"])],
 ["type-check", new Set(["test"])],
 ["test", new Set(["build"])],
 ["build", new Set(["deploy"])],
 ["e2e", new Set(["deploy"])],
 ["deploy", new Set()],
]);

console.log(parallelSchedule(pipeline));
// Wave 1 : ["lint", "type-check"]  :en parallèle
// Wave 2 : ["test"]         :après lint ET type-check
// Wave 3 : ["build", "e2e"]     :en parallèle après test
// Wave 4 : ["deploy"]        :après build ET e2e
// Temps min : 4 waves au lieu de 5 si séquentiel
```

---

## EXERCICES

## EXO 1 : LE GESTIONNAIRE DE MISSIONS DE L'ESCOUADE
_~15 min_


La mission S-rank de Naruto a des sous-tâches avec des dépendances. Implémenter `orderMissions(tasks, deps)` qui retourne l'ordre d'exécution. Lever une erreur si les dépendances forment un cycle.

```js
const tasks = [
 "briefing",
 "equipement",
 "transport",
 "infiltration",
 "combat",
 "extraction",
];
const deps = [
 ["equipement", "briefing"], // briefing avant equipement
 ["transport", "equipement"],
 ["infiltration", "transport"],
 ["combat", "infiltration"],
 ["extraction", "combat"],
];
```

---

## EXO 2 : RÉSOUDRE UN COURS SCHEDULE
_~20 min_


Implémenter `courseScheduleOrder(n, prerequisites)` qui retourne l'ordre dans lequel il faut suivre les cours, ou `null` si c'est impossible.

```js
// 4 cours (0, 1, 2, 3)
// prerequisites : [[1,0],[2,0],[3,1],[3,2]]
// => 0 avant 1, 0 avant 2, 1 avant 3, 2 avant 3
// ordre valide : [0, 1, 2, 3] ou [0, 2, 1, 3]
```

---

## EXO 3 : PIPELINE CI/CD AVEC DURÉES
_~25 min_


Chaque étape du pipeline a une durée (en secondes). Calculer le temps minimum d'exécution si les étapes parallélisables tournent en parallèle.

```js
const stages = {
 lint: 30,
 "type-check": 45,
 "unit-tests": 60,
 integration: 120,
 build: 90,
 e2e: 180,
 deploy: 30,
};
const deps = [
 ["unit-tests", "lint"],
 ["unit-tests", "type-check"],
 ["integration", "unit-tests"],
 ["build", "unit-tests"],
 ["e2e", "build"],
 ["deploy", "integration"],
 ["deploy", "e2e"],
];
```

Implémenter `minPipelineTime(stages, deps)`. Retourner le temps minimum et les waves de parallélisation.

---

## EXO 4 : TROUVER LE CYCLE
_~20 min_


Dans le graphe suivant, la tâche "déploiement" ne peut jamais être exécutée à cause d'un cycle. Implémenter `findCycle(graph)` qui retourne les noeuds formant le cycle.

```js
const broken = new Map([
 ["A", new Set(["B", "E"])],
 ["B", new Set(["C"])],
 ["C", new Set(["D"])],
 ["D", new Set(["B"])], // cycle : B→C→D→B
 ["E", new Set(["F"])],
 ["F", new Set()],
]);
// résultat attendu : ["B", "C", "D"] ou rotation du cycle
```

---

## RÉSUMÉ

Topological sort : deux approches, même résultat. Kahn (BFS) part des noeuds sans prédécesseurs, les retire un par un, met à jour les in-degrees. DFS post-order visite récursivement, ajoute après, inverse le tableau. Kahn révèle la parallélisation naturelle : tous les noeuds avec in-degree 0 au même niveau peuvent s'exécuter en même temps. Si le résultat final n'a pas tous les noeuds : il y avait un cycle, topological sort impossible. Application directe : `npm install`, pipelines CI/CD, compilation de modules, tout système de tâches avec dépendances.
