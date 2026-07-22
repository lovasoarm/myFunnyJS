---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# UNION-FIND : GROUPER CE QUI EST CONNECTÉ EN O(α(n))
Temps de lecture ~8 min

Problème : tu as N éléments. Des connexions arrivent une par une. À chaque étape tu dois répondre : "ces deux éléments sont-ils dans le même groupe ?" BFS ou DFS peuvent le faire, mais en O(V+E) à chaque requête. Union-Find répond en O(α(n)) : quasi O(1) : avec deux optimisations.

α(n) c'est la fonction inverse d'Ackermann. Pour n'importe quel N réel ou imaginable, α(n) ≤ 5. En pratique : O(1).

---

## 1) L'IDÉE

Chaque groupe a un **représentant** (root). Deux éléments sont dans le même groupe si et seulement si ils ont le même représentant.

```
Départ : chaque élément est son propre représentant
0 1 2 3 4 5
↑ ↑ ↑ ↑ ↑ ↑
(chacun pointe vers lui-même)

union(0, 1) : 0 et 1 dans le même groupe → un des deux devient représentant de l'autre
union(2, 3) : idem
union(0, 2) : fusionne les deux groupes → un représentant pour {0, 1, 2, 3}

find(1) et find(3) retournent le même représentant → même groupe
find(1) et find(4) retournent des représentants différents → groupes distincts
```

---

## 2) IMPLÉMENTATION DE BASE

```js
class UnionFind {
 constructor(n) {
  // parent[i] : le parent de l'élément i
  // au départ, chaque élément est son propre parent (sa propre racine)
  this.parent = Array.from({ length: n }, (_, i) => i)
  // rank[i] : hauteur approximative du sous-arbre enraciné en i
  // utilisé pour l'union by rank
  this.rank  = new Array(n).fill(0)
  // nombre de composants distincts
  this.count = n
 }

 // trouver la racine de l'élément x
 // sans optimisation : O(n) dans le pire cas (arbre dégénéré)
 find(x) {
  if (this.parent[x] !== x) {
   return this.find(this.parent[x])
  }
  return x
 }

 // fusionner les groupes de x et y
 union(x, y) {
  const rootX = this.find(x)
  const rootY = this.find(y)

  if (rootX === rootY) return false // déjà dans le même groupe

  // attache l'arbre le plus petit sous le plus grand
  if (this.rank[rootX] < this.rank[rootY]) {
   this.parent[rootX] = rootY
  } else if (this.rank[rootX] > this.rank[rootY]) {
   this.parent[rootY] = rootX
  } else {
   // même rank : on choisit rootX, et on augmente son rank
   this.parent[rootY] = rootX
   this.rank[rootX]++
  }

  this.count-- // un composant de moins
  return true  // fusion effectuée
 }

 connected(x, y) {
  return this.find(x) === this.find(y)
 }
}
```

---

## 3) OPTIMISATION 1 : PATH COMPRESSION

Sans path compression, `find` peut remonter une longue chaîne de parents. Avec path compression, on court-circuite : chaque noeud sur le chemin pointe directement vers la racine après le premier `find`.

```js
find(x) {
 if (this.parent[x] !== x) {
  // path compression : on met à jour le parent de x directement vers la racine
  this.parent[x] = this.find(this.parent[x])
 }
 return this.parent[x]
}
```

Avant et après path compression :

```
Avant find(4) :
1 → 2 → 3 → 5 (racine)
    ↑
    4

Après find(4) (path compression) :
5 (racine)
↑ ↑ ↑ ↑
1 2 3 4
(tous pointent directement vers 5)
```

Les prochains `find` sur 1, 2, 3, 4 seront O(1).

---

## 4) OPTIMISATION 2 : UNION BY RANK

Sans union by rank, on risque de créer des arbres très profonds (dégénérés). Avec union by rank, on attache toujours le plus petit arbre sous le plus grand.

```
Sans union by rank, en fusionnant dans le mauvais ordre :
union(0,1) → union(1,2) → union(2,3) → union(3,4)

Résultat : 0 → 1 → 2 → 3 → 4 (liste chaînée, find = O(n))

Avec union by rank :
les deux arbres restent peu profonds, find reste O(log n) au pire
```

Les deux optimisations combinées donnent O(α(n)) amorti.

---

## 5) EN ACTION : LES GROUPES DE SURVIVANTS

Rick doit savoir quels survivants sont dans le même camp sans reconstruire le graphe complet à chaque connexion découverte.

```js
const survivors = ["Rick", "Daryl", "Glenn", "Michonne", "Maggie", "Carl", "Hershel"]
const idx = Object.fromEntries(survivors.map((s, i) => [s, i]))
// { Rick:0, Daryl:1, Glenn:2, Michonne:3, Maggie:4, Carl:5, Hershel:6 }

const uf = new UnionFind(survivors.length)

// connexions découvertes au fil du temps
uf.union(idx["Rick"],   idx["Daryl"])
uf.union(idx["Rick"],   idx["Carl"])
uf.union(idx["Glenn"],  idx["Maggie"])
uf.union(idx["Maggie"],  idx["Hershel"])
uf.union(idx["Michonne"], idx["Rick"])

// questions
uf.connected(idx["Daryl"], idx["Carl"])  // true : même camp Rick
uf.connected(idx["Glenn"], idx["Hershel"]) // true : même camp Glenn/Maggie
uf.connected(idx["Rick"], idx["Glenn"])  // false : deux camps distincts
uf.count // 2 : deux composants

// fusion des deux camps
uf.union(idx["Rick"], idx["Glenn"])
uf.connected(idx["Daryl"], idx["Hershel"]) // true : maintenant un seul camp
uf.count // 1
```

---

## 6) DÉTECTER UN CYCLE AVEC UNION-FIND

Alternative à DFS pour la détection de cycle dans un graphe non dirigé. Plus rapide si on traite les arêtes une par une.

```js
function hasCycle(edges, n) {
 const uf = new UnionFind(n)

 for (const [u, v] of edges) {
  if (uf.connected(u, v)) {
   // u et v sont déjà dans le même composant
   // ajouter cette arête crée un cycle
   return true
  }
  uf.union(u, v)
 }

 return false
}

// dépendances circulaires dans les modules CrazyDevs
const deps = [[0,1], [1,2], [2,3], [3,1]] // 3 → 1 crée un cycle
hasCycle(deps, 4) // true
```

---

## 7) COMPLEXITÉ

```
Sans optimisation  : find O(n),  union O(n)
Union by rank seul  : find O(log n), union O(log n)
Path compression seul: find O(log n) amorti
Les deux ensemble  : find O(α(n)), union O(α(n)) ← quasi O(1)
```

---

## EXERCICES

## EXO 1 : les équipes du tournoi de Konoha
_~20 min_


Un tournoi ninja forme des équipes au fur et à mesure des victoires. Deux ninjas fusionnent leurs équipes quand l'un bat l'autre.

```js
const battles = [
 ["Naruto", "Kiba"],
 ["Sasuke", "Zaku"],
 ["Naruto", "Neji"],
 ["Sasuke", "Rock Lee"],
 ["Naruto", "Sasuke"],
]
```

Après chaque battle, `union` les deux équipes. Implémente `teamOf(ninja)` : retourne tous les membres de l'équipe de ce ninja. Affiche l'évolution du nombre de composants à chaque étape.

---

## EXO 2 : réseau d'amis de Konoha
_~20 min_


Tu reçois un flux de connexions entre ninjas, une par une. Implémente `friendNetwork` avec :
- `connect(a, b)` : connecte a et b
- `areConnected(a, b)` : retourne true/false en O(α(n))
- `groupCount()` : nombre de groupes distincts

Teste avec 10 ninjas et 8 connexions. Démontre que `areConnected` est O(α(n)) et non O(V+E).

---

## EXO 3 : Kruskal's MST (Minimum Spanning Tree)
_~25 min_


Algorithme de Kruskal : construit le spanning tree de coût minimal en triant les arêtes par poids et en ajoutant celles qui ne créent pas de cycle.

Graphe : les routes entre villes de la supply chain de Walter White (5 villes, 7 routes pondérées).

Implémente Kruskal avec Union-Find. Retourne les arêtes du MST et le coût total.

(Hint : pour chaque arête triée par poids croissant, `union(u, v)` si `!connected(u, v)`)

---

## RÉSUMÉ

Union-Find maintient des groupes dynamiques avec deux opérations : `find` (quel groupe ?) et `union` (fusionner deux groupes). Path compression + union by rank donnent O(α(n)) amorti : quasi O(1). Idéal pour les problèmes de connectivité dynamique, la détection de cycle en O(E), et Kruskal's MST. Quand BFS/DFS répondent à "sont-ils connectés ?" en O(V+E), Union-Find répond en O(α(n)).
