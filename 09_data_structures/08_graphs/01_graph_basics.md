---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# GRAPHES : MODÉLISER CE QUI EST CONNECTÉ
Temps de lecture ~8 min

Un arbre c'est un graphe contraint. Un réseau social, un GPS, un système de dépendances : des graphes. La différence entre quelqu'un qui modélise un problème bien et quelqu'un qui ne le modélise pas du tout, c'est souvent la reconnaissance du graphe.

Réseaux, dépendances, chemins, détection de cycles : tous ces problèmes ont une structure commune. Celle d'un graphe.

---

## 1) LE VOCABULAIRE

```
Noeud (vertex) : un élément du graphe
 exemple : une ville, un shinobi, un fichier, un personnage

Arête (edge) : une connexion entre deux noeuds
 exemple : une route, une amitié, un import, une relation

Directed (dirigé) : les arêtes ont un sens
 A --> B ≠ B --> A
 exemple : Twitter (follower/suivi), dépendances npm

Undirected (non dirigé) : les arêtes sont bidirectionnelles
 A -- B == B -- A
 exemple : Facebook (ami mutuel), routes entre villes

Weighted (pondéré) : chaque arête a un poids
 exemple : distance entre villes, temps de trajet, coût

Unweighted : toutes les arêtes ont le même poids (implicitement 1)

Cycle : un chemin qui revient au point de départ
 A --> B --> C --> A

Connexe : tout noeud est atteignable depuis tout autre noeud

Acyclique : sans cycle
 DAG = Directed Acyclic Graph (graphe de dépendances typique)
```

---

## 2) DEUX REPRÉSENTATIONS EN MÉMOIRE

### Adjacency List (liste d'adjacence)

Chaque noeud pointe vers la liste de ses voisins.

```js
// réseau de distribution de Walter White
// noeud = ville, arête = route (pondérée par risque)

const graph = {
 "Albuquerque": [{ node: "Santa Fe", weight: 45 }, { node: "Roswell", weight: 120 }],
 "Santa Fe":  [{ node: "Taos", weight: 70 }],
 "Roswell":   [{ node: "El Paso", weight: 95 }],
 "Taos":    [],
 "El Paso":   [{ node: "Albuquerque", weight: 110 }]
}

// espace : O(V + E) où V = noeuds, E = arêtes
// lookup voisins de X : O(degree(X))
// check si X-Y connectés : O(degree(X))
```

### Adjacency Matrix (matrice d'adjacence)

Tableau 2D : `matrix[i][j]` = poids de l'arête i→j, ou 0 si pas d'arête.

```js
// même graphe en matrice (indices : 0=Albuquerque, 1=SantaFe, 2=Roswell, 3=Taos, 4=ElPaso)
const matrix = [
 // Alb SF Ros Taos EP
 [ 0,  45, 120,  0,  0 ], // Albuquerque
 [ 0,  0,  0, 70,  0 ], // Santa Fe
 [ 0,  0,  0,  0, 95 ], // Roswell
 [ 0,  0,  0,  0,  0 ], // Taos
 [ 110,  0,  0,  0,  0 ], // El Paso
]

// espace : O(V²) -- coûteux sur les grands graphes peu denses
// lookup voisins : O(V) -- doit parcourir toute la ligne
// check si X-Y connectés : O(1) -- matrix[i][j]
```

### Lequel choisir ?

```
Adjacency List --> graphe peu dense (peu d'arêtes vs V²) : la plupart des cas réels
Adjacency Matrix --> graphe dense, ou besoin de O(1) pour "X et Y sont-ils connectés ?"
```

En prod, 99% du temps : adjacency list.

---

## 3) CLASSE GRAPH EN JS

```js
class Graph {
 constructor(directed = false) {
  this.adjacencyList = new Map()
  this.directed   = directed
 }

 // ajouter un noeud
 addVertex(vertex) {
  if (!this.adjacencyList.has(vertex)) {
   this.adjacencyList.set(vertex, [])
  }
 }

 // ajouter une arête
 addEdge(v1, v2, weight = 1) {
  // crée les noeuds s'ils n'existent pas encore
  this.addVertex(v1)
  this.addVertex(v2)

  this.adjacencyList.get(v1).push({ node: v2, weight })

  // si non dirigé : arête dans les deux sens
  if (!this.directed) {
   this.adjacencyList.get(v2).push({ node: v1, weight })
  }
 }

 // voisins d'un noeud
 getNeighbors(vertex) {
  return this.adjacencyList.get(vertex) ?? []
 }

 // supprimer une arête
 removeEdge(v1, v2) {
  this.adjacencyList.set(
   v1,
   this.adjacencyList.get(v1).filter(e => e.node !== v2)
  )
  if (!this.directed) {
   this.adjacencyList.set(
    v2,
    this.adjacencyList.get(v2).filter(e => e.node !== v1)
   )
  }
 }

 // supprimer un noeud et toutes ses arêtes
 removeVertex(vertex) {
  this.adjacencyList.delete(vertex)
  // supprime toutes les arêtes qui pointent vers ce noeud
  for (const [v, edges] of this.adjacencyList) {
   this.adjacencyList.set(v, edges.filter(e => e.node !== vertex))
  }
 }
}
```

---

## 4) CONSTRUIRE LE RÉSEAU DE DISTRIBUTION DE WALTER WHITE

```js
const supply = new Graph(true) // dirigé : les routes ont un sens

supply.addEdge("Albuquerque", "Santa Fe", { risque: 2, km: 100 })
supply.addEdge("Albuquerque", "Roswell",  { risque: 5, km: 200 })
supply.addEdge("Santa Fe",  "Taos",   { risque: 1, km: 130 })
supply.addEdge("Roswell",   "El Paso",  { risque: 7, km: 180 })
supply.addEdge("El Paso",   "Albuquerque", { risque: 9, km: 420 }) // cycle !

supply.getNeighbors("Albuquerque")
// [{ node: "Santa Fe", weight: ... }, { node: "Roswell", weight: ... }]

supply.getNeighbors("El Paso")
// [{ node: "Albuquerque", weight: ... }]
```

Le cycle Albuquerque → ... → El Paso → Albuquerque : Walter a une route qui revient sur elle-même. Dans un graphe de dépendances, ça serait une erreur. Dans un réseau de distribution, c'est une boucle logistique.

---

## 5) MODÉLISER D'AUTRES PROBLÈMES EN GRAPHE

```
Réseau social (Twitter) :
 noeuds = shinobis
 arêtes = follows (dirigé)
 problème typique : qui sont les influenceurs ? (noeuds avec le plus d'arêtes entrantes)

Dépendances npm :
 noeuds = packages
 arêtes = dépendances (dirigé, non pondéré)
 problème typique : ordre d'installation (topological sort), cycles de dépendance

Plan de métro :
 noeuds = stations
 arêtes = lignes (non dirigé, pondéré par temps de trajet)
 problème typique : chemin le plus court (Dijkstra)

Plan d'évasion de Fox River :
 noeuds = sections de la prison
 arêtes = passages entre sections (dirigé par les horaires des gardes)
 problème typique : chemin d'A à Z sans se faire attraper
```

---

## EXERCICES

## EXO 1 : le réseau social de Konoha
_~15 min_


Construis un graphe non dirigé des relations d'amitié entre ninjas :

```
Naruto -- Sasuke
Naruto -- Sakura
Naruto -- Hinata
Sasuke -- Sakura
Sakura -- Ino
Ino  -- Shikamaru
```

Implémente :
- `friendsOf(name)` : retourne la liste des amis directs
- `mutualFriends(a, b)` : retourne les amis communs entre deux ninjas
- `mostConnected()` : retourne le ninja avec le plus d'amis

---

## EXO 2 : les dépendances du projet CrazyDevs
_~12 min_


Tu as un fichier de dépendances entre modules :

```js
const deps = [
 ["03_async",    "01_fundamentals"],
 ["03_testing",   "01_fundamentals"],
 ["03_testing",   "03_async"],
 ["07_structures", "01_fundamentals"],
 ["10_algorithms", "07_structures"],
 ["10_patterns",  "09_functional"],
 ["10_patterns",  "13_refactoring"],
]
// [module, prérequis] : pour installer module, il faut d'abord prérequis
```

Construis un graphe dirigé. Implémente `canBuild(module)` : retourne `true` si le module est atteignable depuis "01_fundamentals" (toutes ses dépendances sont disponibles).

---

## EXO 3 : convertir liste → matrice et matrice → liste
_~20 min_


Tu reçois parfois des graphes dans un format, tu as besoin de l'autre.

Implémente :
- `listToMatrix(adjacencyList, vertices)` : convertit en matrice carrée
- `matrixToList(matrix, vertices)` : convertit en adjacency list

Vérifie que la conversion aller-retour produit le même graphe. Teste sur le réseau Walter White (5 noeuds).

---

## RÉSUMÉ

Un graphe c'est des noeuds et des arêtes. Directed si les arêtes ont un sens, weighted si elles ont un poids. Deux représentations : adjacency list (O(V+E), efficace sur les graphes peu denses) et adjacency matrix (O(V²), rapide pour "X et Y sont-ils connectés ?"). En pratique : adjacency list. Les graphes modélisent les réseaux, les dépendances, les plans de navigation. Dès que ton problème a des connexions entre entités, pense graphe.
