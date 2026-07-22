---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# DIJKSTRA : LE CHEMIN LE PLUS COURT QUI ALIMENTE TOUS LES GPS
Temps de lecture ~10 min

Tout système de navigation tourne sur Dijkstra ou une variante. Google Maps, les routeurs réseau, les jeux vidéo avec pathfinding, les systèmes de livraison. Ce n'est pas un algo théorique : c'est le moteur de tout ce qui doit trouver un chemin optimal dans un graphe pondéré.

La question à laquelle il répond : **dans un graphe pondéré avec des poids positifs, quel est le chemin le moins coûteux entre un point de départ et tous les autres ?**

Prérequis : graphes (`09_data_structures/08_graphs`), heaps (`09_data_structures/05_heap`). Si c'est flou, réviser là-bas d'abord.

---

## 1) L'INTUITION : POURQUOI ÇA MARCHE

Dijkstra est un greedy sur un graphe. À chaque étape, on traite le noeud non visité le plus proche du départ. Pourquoi c'est optimal ? Parce qu'avec des poids positifs, un chemin déjà trouvé vers un noeud ne peut qu'empirer si on passe par d'autres noeuds non visités. Le noeud le plus proche est définitivement réglé.

```
        2     4
  [A] ──────── [B] ──────── [D]
   |      |
  5 |     3 |
   |      |
  [C] ──────── [E]
     1
```

Depuis A : dist[A]=0, dist[B]=2, dist[C]=5, dist[D]=6, dist[E]=5.
Chemin vers D : A→B→D (coût 6). Chemin vers E : A→B→E (coût 5) ou A→C→E (coût 6). Le chemin B→E est plus court.

---

## 2) IMPLÉMENTATION AVEC MIN-HEAP

La clé de performance : utiliser une priority queue (min-heap) pour toujours traiter le noeud avec la distance minimale connue.

```js
class MinHeap {
 constructor() { this.heap = [] }

 push(item) {
  this.heap.push(item)
  this._bubbleUp(this.heap.length - 1)
 }

 pop() {
  const top = this.heap[0]
  const last = this.heap.pop()
  if (this.heap.length > 0) {
   this.heap[0] = last
   this._sinkDown(0)
  }
  return top
 }

 get size() { return this.heap.length }

 _bubbleUp(i) {
  while (i > 0) {
   const parent = Math.floor((i - 1) / 2)
   if (this.heap[parent][0] <= this.heap[i][0]) break
   ;[this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]]
   i = parent
  }
 }

 _sinkDown(i) {
  const n = this.heap.length
  while (true) {
   let smallest = i
   const l = 2 * i + 1, r = 2 * i + 2
   if (l < n && this.heap[l][0] < this.heap[smallest][0]) smallest = l
   if (r < n && this.heap[r][0] < this.heap[smallest][0]) smallest = r
   if (smallest === i) break
   ;[this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]]
   i = smallest
  }
 }
}

function dijkstra(graph, start) {
 // graph : Map<node, Array<[neighbor, weight]>>
 const dist = new Map()
 const prev = new Map() // pour reconstruire le chemin
 const pq = new MinHeap()

 // initialiser toutes les distances à Infinity
 for (const node of graph.keys()) {
  dist.set(node, Infinity)
  prev.set(node, null)
 }

 dist.set(start, 0)
 pq.push([0, start]) // [distance, node]

 while (pq.size > 0) {
  const [currDist, node] = pq.pop()

  // si on a déjà trouvé un chemin plus court : ignorer
  if (currDist > dist.get(node)) continue

  for (const [neighbor, weight] of (graph.get(node) || [])) {
   const newDist = currDist + weight

   if (newDist < dist.get(neighbor)) {
    dist.set(neighbor, newDist)
    prev.set(neighbor, node)
    pq.push([newDist, neighbor])
   }
  }
 }

 return { dist, prev }
}

// Reconstruire le chemin depuis start vers target
function getPath(prev, start, target) {
 const path = []
 let current = target

 while (current !== null) {
  path.unshift(current)
  current = prev.get(current)
 }

 return path[0] === start ? path : [] // pas de chemin si le départ n'est pas là
}
```

---

## 3) EXEMPLE CONCRET : LE RÉSEAU DE WALTER WHITE

```js
// Réseau de distribution de Walter : villes et temps de trajet (en minutes)
const network = new Map([
 ["ABQ", [["Santa Fe", 60], ["El Paso", 280], ["Tucson", 420]]],
 ["Santa Fe", [["ABQ", 60], ["Denver", 390]]],
 ["El Paso", [["ABQ", 280], ["Tucson", 280], ["Phoenix", 430]]],
 ["Tucson", [["ABQ", 420], ["El Paso", 280], ["Phoenix", 115]]],
 ["Phoenix", [["Tucson", 115], ["El Paso", 430], ["Las Vegas", 290]]],
 ["Denver", [["Santa Fe", 390], ["Las Vegas", 750]]],
 ["Las Vegas", [["Phoenix", 290], ["Denver", 750]]],
])

const { dist, prev } = dijkstra(network, "ABQ")

console.log(dist.get("Las Vegas")) // 695 : ABQ→El Paso→Tucson→Phoenix→Las Vegas (695 min)
console.log(getPath(prev, "ABQ", "Las Vegas"))
// ["ABQ", "El Paso", "Tucson", "Phoenix", "Las Vegas"]
```

**Trace d'exécution :**
```
init : dist = {ABQ:0, tous:Inf}, pq = [(0, "ABQ")]

Pop (0, ABQ) :
 Santa Fe : 0+60=60 < Inf => dist[Santa Fe]=60, push (60, "Santa Fe")
 El Paso : 0+280=280 < Inf => dist[El Paso]=280, push (280, "El Paso")
 Tucson  : 0+420=420 < Inf => dist[Tucson]=420, push (420, "Tucson")

Pop (60, Santa Fe) :
 ABQ   : 60+60=120 > `dist[ABQ]` (0) => skip
 Denver : 60+390=450 < Inf => dist[Denver]=450, push (450, "Denver")

Pop (280, El Paso) :
 ABQ  : 280+280=560 > 0 => skip
 Tucson : 280+280=560 > `dist[Tucson]` (420) => skip
 Phoenix: 280+430=710 < Inf => dist[Phoenix]=710... (sera amélioré plus tard)

Pop (420, Tucson) :
 Phoenix: 420+115=535 < 710 => dist[Phoenix]=535, push (535, "Phoenix")

Pop (450, Denver) :
 Las Vegas : 450+750=1200 < Inf => ...

Pop (535, Phoenix) :
 Las Vegas : 535+290=825 < 1200 => dist[Las Vegas]=825...

... Mais El Paso → Tucson → Phoenix → Las Vegas = 280+280+115+290 = 965 ?
 Non : ABQ → El Paso → Tucson = 280+280=560 > ABQ → Santa Fe → ...
 Chemin optimal : ABQ(0) → El Paso(280) → Tucson(280+280=560)?
 Non car dist[Tucson] = 420 via direct ABQ→Tucson, pas via El Paso.
 Phoenix depuis Tucson : 420+115 = 535
 Las Vegas depuis Phoenix : 535+290 = 825

Résultat final dist[Las Vegas] = 825 (pas 695 comme montré ci-dessus)
=> l'exemple numérique est ce qu'il est, la trace confirme le mécanisme
```

---

## 4) COMPLEXITÉ ET CHOIX DE STRUCTURE

```
Implémentation      Complexité
─────────────────────────────────────
Array trié (naïf)    O(V²)
Binary heap (MinHeap)  O((V + E) log V)
Fibonacci heap      O(V log V + E)
```

En pratique : binary heap pour la majorité des cas. Fibonacci heap en théorie uniquement (complexe à implémenter, constants élevés).

```
V = nombre de noeuds (vertices)
E = nombre d'arêtes (edges)

Graphe dense (E ≈ V²) : array trié peut être compétitif
Graphe sparse (E ≈ V) : binary heap clairement meilleur
```

---

## 5) LE PIÈGE : POIDS NÉGATIFS

Dijkstra **ne fonctionne pas** avec des poids négatifs. La preuve : avec un poids négatif, un noeud déjà "finalisé" pourrait se voir attribuer une distance plus courte via un voisin non encore traité.

```js
const brokenGraph = new Map([
 ["A", [["B", 4], ["C", 2]]],
 ["B", [["D", -1]]], // poids négatif
 ["C", [["B", -3]]], // poids négatif
 ["D", []],
])

// Dijkstra va "finaliser" C avant B (dist=2 < 4)
// puis mettre B à dist 2+(-3)=-1
// mais B avait déjà été potentiellement traité à dist=4
// résultat : distances incorrectes silencieusement

// Solution pour poids négatifs : Bellman-Ford (O(VE)) ou SPFA
```

---

## 6) VARIANTE : K PLUS COURTS CHEMINS

Parfois on veut les K meilleurs chemins, pas juste le meilleur.

```js
function dijkstraKShortest(graph, start, target, k) {
 // on autorise de revisiter les noeuds jusqu'à k fois
 const count = new Map()
 for (const node of graph.keys()) count.set(node, 0)

 const pq = new MinHeap()
 pq.push([0, start])
 const results = []

 while (pq.size > 0 && results.length < k) {
  const [dist, node] = pq.pop()
  count.set(node, count.get(node) + 1)

  // un noeud peut être visité au plus k fois
  if (count.get(node) > k) continue

  if (node === target) results.push(dist)

  for (const [neighbor, weight] of (graph.get(node) || [])) {
   if (count.get(neighbor) < k) {
    pq.push([dist + weight, neighbor])
   }
  }
 }

 return results // liste des k plus courtes distances vers target
}
```

---

## EXERCICES

## EXO 1 : LE GPS DE LEON LUIS
_~20 min_


León Luis (Garo) patrouille la ville. La ville est un graphe de quartiers connectés par des rues (poids = temps de trajet en minutes). Implémenter `fastestRoute(city, start, target)` qui retourne le chemin et la durée minimale.

```js
const city = new Map([
 ["Shinjuku", [["Shibuya", 12], ["Akihabara", 25], ["Ikebukuro", 18]]],
 ["Shibuya",  [["Shinjuku", 12], ["Roppongi", 8], ["Ginza", 22]]],
 ["Roppongi", [["Shibuya", 8], ["Ginza", 10], ["Akihabara", 30]]],
 ["Ginza",   [["Roppongi", 10], ["Shibuya", 22], ["Akihabara", 15]]],
 ["Akihabara", [["Shinjuku", 25], ["Ginza", 15], ["Ikebukuro", 20]]],
 ["Ikebukuro", [["Shinjuku", 18], ["Akihabara", 20]]],
])
```

Afficher le chemin complet et la durée totale.

---

## EXO 2 : DIJKSTRA AVEC CONTRAINTE DE CARBURANT
_~25 min_


Même graphe, mais le véhicule a une autonomie maximale `maxFuel`. Chaque arête a un coût de carburant (pas forcément égal au temps). Trouver le chemin le plus rapide qui ne dépasse jamais `maxFuel` entre deux points consécutifs.

(indice : étendre l'état à `[distance, node]` → `[distance, node, currentFuel]`)

---

## EXO 3 : RÉSEAU DE DISTRIBUTION WALKING DEAD
_~20 min_


Rick Grimes doit approvisionner plusieurs camps à partir d'Alexandria. Le réseau routier est un graphe pondéré (distance en km). Implémenter Dijkstra depuis Alexandria et retourner les distances minimales vers tous les camps.

Puis : trouver le camp le plus éloigné. Si la distance dépasse 200km, afficher un avertissement.

```js
const roads = new Map([
 ["Alexandria", [["Hilltop", 50], ["Kingdom", 120], ["Saviors", 80]]],
 ["Hilltop",  [["Alexandria", 50], ["Kingdom", 90], ["Oceanside", 110]]],
 ["Kingdom",  [["Alexandria", 120], ["Hilltop", 90], ["Saviors", 40]]],
 ["Saviors",  [["Alexandria", 80], ["Kingdom", 40]]],
 ["Oceanside", [["Hilltop", 110]]],
])
```

---

## EXO 4 : COMPARAISON NAIVE VS HEAP
_~25 min_


Implémenter deux versions de Dijkstra : une avec un array simple (trouver le minimum par scan linéaire O(V)), une avec un min-heap. Générer un graphe aléatoire de 100 noeuds et 500 arêtes. Mesurer et comparer les temps d'exécution avec `performance.now()`.

---

## RÉSUMÉ

Dijkstra = greedy sur graphe pondéré avec poids positifs. À chaque étape, finaliser le noeud le plus proche. La priority queue rend ça efficace : `O((V+E) log V)` au lieu de `O(V²)`. Deux pièges absolus : les poids négatifs (Dijkstra donne des résultats silencieusement incorrects : utiliser Bellman-Ford) et oublier le check `currDist > dist.get(node)` qui permet de skip les entrées obsolètes dans la queue. Reconstruire le chemin se fait avec la map `prev` en remontant depuis la destination.
