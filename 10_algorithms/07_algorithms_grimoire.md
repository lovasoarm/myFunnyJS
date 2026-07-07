# Page verrouillée
Temps de lecture ~12 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## ALGORITHMS GRIMOIRE : LES PATTERNS ET LEUR TERRAIN D'APPLICATION

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Divide & Conquer** | Découper un problème en sous-problèmes identiques plus petits, résoudre récursivement, combiner les résultats. Base du merge sort, du quick sort, de la FFT. | `function dc(arr) { const mid = Math.floor(arr.length/2); return merge(dc(arr.slice(0,mid)), dc(arr.slice(mid))) }` | Kakashi divise l'escouade en binômes pour couvrir deux zones simultanément / Merger deux équipes de rescue Walking Dead pour couvrir une ville entière |
| **Memoïzation** | Stocker le résultat d'un appel de fonction pour éviter de le recalculer si les mêmes arguments reviennent. DP top-down. | `const memo = new Map(); function fib(n) { if (memo.has(n)) return memo.get(n); const r = fib(n-1)+fib(n-2); memo.set(n,r); return r }` | Sasuke qui note chaque jutsu analysé pour ne pas re-analyser le même deux fois / Walter qui garde ses formules de synthèse pour ne pas refaire les calculs |
| **Tabulation** | Remplir un tableau de bas en haut, en construisant les solutions des sous-problèmes simples vers les plus complexes. DP bottom-up. | `const dp = [0,1]; for(let i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2]; return dp[n]` | Remplir un tableau de stats de matchs semaine par semaine pour calculer la forme sur 5 semaines / Construction progressive du plan d'évasion de Fox River cellule par cellule |
| **Sous-structure optimale** | Propriété d'un problème : sa solution optimale contient les solutions optimales de ses sous-problèmes. Prérequis pour DP et Greedy. | `// shortest path A→C via B = shortest(A→B) + shortest(B→C)` | Le chemin optimal Mbappé→but passe par les passes optimales à chaque étape / La séquence de jutsus optimale de Naruto = enchaînement des jutsus optimaux à chaque round |
| **Chevauchement de sous-problèmes** | Propriété où les mêmes sous-problèmes apparaissent plusieurs fois dans la récursion. Justifie la mémoïzation. | `// fib(5) appelle fib(4) et fib(3). fib(4) appelle fib(3) aussi. fib(3) calculé 2x sans memo` | SZA qui rechante le même hook dans chaque couplet : autant l'enregistrer une fois et le rejouer / Même sous-mission de reconnaissance requise par plusieurs Chevaliers de Garo simultanément |
| **Propriété Greedy** | Un problème a cette propriété si le choix local optimal à chaque étape mène toujours à la solution globale optimale. Sans elle, greedy peut rater. | `// Activity selection : prendre l'activité qui finit le plus tôt libère toujours plus de temps` | Mbappé qui tire dès qu'il a le meilleur angle : le bon moment local est le bon moment global / León qui fonce sur l'Horreur la plus proche : la tactique locale est la tactique globale |
| **Arbre de décision** | Représentation mentale d'un backtracking : chaque noeud = état partiel, chaque arête = un choix, les feuilles = solutions ou impasses. | `// Permutations de [1,2,3] : [] → [1] → [1,2] → [1,2,3] (solution) → pop → [1,3] → ...` | L'arbre des choix d'évasion de Michael Scofield : chaque couloir = une branche, cul-de-sac = backtrack / Arbre de jutsu combinations de Naruto : chaque signe de main = une décision |
| **Pruning** | Couper une branche de l'arbre de décision dès qu'on sait qu'elle ne peut pas mener à une solution. Transforme un backtracking naïf en algo efficace. | `if (candidates[i] > remaining) break // tout ce qui suit est encore plus grand` | Kakashi qui abandonne une piste de tracking dès que les empreintes s'arrêtent / Walter qui abandonne une route de livraison dès que le risque dépasse le seuil |
| **In-degree** | Nombre d'arêtes entrantes d'un noeud dans un graphe orienté. In-degree = 0 signifie aucune dépendance : le noeud peut être traité en premier. | `for(const [,neighbors] of graph) for(const n of neighbors) inDeg.set(n, (inDeg.get(n)\|\|0)+1)` | Un cours sans prérequis a un in-degree de 0 : on peut l'attaquer directement / Une tâche CI sans dépendance peut tourner immédiatement dans le pipeline |
| **DAG** | Directed Acyclic Graph. Graphe orienté sans cycle. Prérequis absolu pour le topological sort. Si cycle : pas d'ordre d'exécution possible. | `// A→B→C→A est un cycle : topological sort impossible` | Planning de missions impossible si Mission A dépend de Mission B qui dépend de Mission A / Modules JS avec circular imports : aucun ne peut être chargé en premier |
| **Admissibilité (heuristique)** | Propriété d'une heuristique A* : elle ne doit jamais surestimer le coût réel. Si admissible : A* trouve toujours l'optimal. | `function h(pos, goal) { return Math.abs(pos[0]-goal[0]) + Math.abs(pos[1]-goal[1]) } // Manhattan : jamais surestimer sur grille 4-dirs` | GPS qui estime toujours "au moins X minutes" : peut être plus long, jamais prédit plus court que la réalité / León qui estime "l'Horror est à au moins N blocks" : il peut être plus loin, jamais plus près |
| **Relaxation d'arête** | Opération Dijkstra : si le chemin vers un voisin via le noeud courant est plus court que le chemin connu, mettre à jour. Coeur de Dijkstra. | `if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u }` | Recalculer l'itinéraire GPS quand une route plus rapide est détectée / Rick Grimes qui réévalue son plan d'attaque dès qu'il trouve un meilleur angle d'approche |
| **f(n) = g(n) + h(n)** | Fonction de coût d'A*. `g(n)` = coût réel depuis le départ, `h(n)` = estimation vers l'arrivée. Dijkstra n'a que `g(n)`. | `const fVal = gCost + heuristic(neighbor, goal); pq.push([fVal, neighbor])` | Haaland qui calcule distance parcourue (g) + distance estimée au but (h) pour décider de tirer / León qui mesure distance déjà parcourue + distance restante estimée vers l'Horror |
| **Topological Order** | Ordre linéaire des noeuds d'un DAG tel que chaque noeud précède tous ceux qui dépendent de lui. Pas unique : plusieurs ordres valides possibles. | `topoSortKahn(modules) // => ["config", "utils", "api", "store", "app"]` | Ordre d'installation npm : les packages sans dépendances d'abord, puis ceux qui en dépendent / Ordre des rounds d'entraînement ninja : les techniques de base avant les jutsu avancés |
| **Bellman-Ford** | Algo de plus court chemin qui gère les poids négatifs. Plus lent que Dijkstra (`O(VE)` vs `O((V+E)logV)`), mais correct avec des arêtes négatives. | `for(let i=0;i<V-1;i++) for(const [u,v,w] of edges) if(dist[u]+w<dist[v]) dist[v]=dist[u]+w` | Route avec une réduction de 20min (poids négatif) : Dijkstra raterait, Bellman-Ford gère / Marché financier avec des actifs qui perdent de la valeur : Dijkstra invalide, Bellman-Ford requis |
| **Fractional Knapsack** | Variante du knapsack où on peut prendre des fractions d'objets. Greedy optimal : trier par ratio valeur/poids, remplir avidement. | `const sorted = items.sort((a,b)=>(b.value/b.weight)-(a.value/a.weight)); // puis remplir` | Jesse qui peut couper un lot de Blue Sky : prendre la fraction optimale par kg / Playlist trapsoul : on peut couper des tracks, on prend les meilleures minutes d'audience par minute |
| **0/1 Knapsack** | Variante où on prend ou ne prend pas un objet entier. Greedy échoue. DP requise : `dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi]+vi)` | `dp[i][w] = items[i].weight > w ? dp[i-1][w] : Math.max(dp[i-1][w], dp[i-1][w-wi]+vi)` | Transport de matériel Walking Dead : on prend la boîte entière ou on la laisse, pas de coupure / Pack de sponsoring d'un club de foot : contrat entier ou rien, impossible de prendre une demi-saison |
| **Coin Change (DP)** | Nombre minimum de pièces pour rendre une somme. DP : `dp[i] = min(dp[i], dp[i-coin]+1)` pour chaque pièce. Greedy échoue avec pièces non standard. | `const dp = new Array(amount+1).fill(Inf); dp[0]=0; for(const c of coins) for(let i=c;i<=amount;i++) dp[i]=Math.min(dp[i],dp[i-c]+1)` | Billets de Ballon d'Or : avec 1, 3, 4 points, combien de votes minimum pour atteindre 6 ? / Jakiro qui alloue du chakra : minimum de techniques pour atteindre exactement 100 de dégâts |
| **LCS (Longest Common Subsequence)** | Longueur de la plus longue sous-séquence commune à deux strings. DP : `dp[i][j] = dp[i-1][j-1]+1` si `s1[i]===s2[j]` sinon `max(dp[i-1][j], dp[i][j-1])`. | `if(s1[i]===s2[j]) dp[i][j]=dp[i-1][j-1]+1; else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1])` | Trouver le style commun entre Bryson Tiller et SZA pour une collab : les similitudes sans forcer / Plan d'évasion commun à Michael et Lincoln : séquence de mouvements partagée |
| **Minimum Spanning Tree** | Arbre couvrant tous les noeuds d'un graphe avec le poids total minimal. Kruskal (trier les arêtes + union-find) ou Prim (greedy à partir d'un noeud). | `// Kruskal : trier edges, union-find pour éviter les cycles, ajouter si pas de cycle` | Câblage réseau d'Alexandria (Walking Dead) : relier tous les camps avec minimum de câble / Réseau de distribution Walter : routes minimales pour couvrir tous les points de livraison |
| **BFS sur graphe pondéré** | BFS ne donne pas le chemin le plus court sur un graphe pondéré. Il donne le chemin avec le moins d'arêtes. Pour les poids : utiliser Dijkstra. | `// BFS optimal : graphe non pondéré (chaque arête = coût 1)` | GPS de métro (nombre de stations) vs GPS routier (temps de trajet) : même réseau, métriques différentes / Nombre de passes pour marquer vs temps pour marquer au foot : deux métriques différentes sur le même terrain |
| **État dans le backtracking** | Ce qu'on a construit à un moment donné dans l'exploration. Doit être copié quand on enregistre une solution, pas passé par référence. | `result.push([...current]) // spread = vraie copie, pas référence` | Snapshot de la grille de sudoku à chaque étape : une photo, pas un lien vers la grille actuelle / Sauvegarde de la configuration du plan d'évasion : état figé, pas modifiable rétrospectivement |
| **Wave / Niveau BFS** | Dans un BFS, tous les noeuds à distance k forment le "niveau k". En topo sort, tous les noeuds libérés en même étape forment une wave parallélisable. | `waves.push([...queue]) // tous les noeuds libres = peuvent s'exécuter en parallèle` | Vague d'attaque de Titans par niveau de menace : tous les niveau-3 simultanément, puis les niveau-4 / Équipes Champions League qualifiées en même temps : phase de groupes = une wave |

---

## CHOISIR LE BON ALGORITHME

```
Problème             Algorithme
──────────────────────────────────────────────────────────────
Toutes les solutions       Backtracking
Solution optimale, contraintes  DP ou Greedy
complexes

Chemin le plus court       Dijkstra (poids positifs)
(graphe pondéré)         Bellman-Ford (poids négatifs)
                 A* (destination connue + heuristique)
                 BFS (non pondéré)

Ordre de dépendances       Topological Sort (Kahn ou DFS)
Détecter un cycle         DFS colorié (WHITE/GRAY/BLACK)

Optimisation sur grille      DP (si mouvements restreints)
                 BFS/Dijkstra (si 4+ directions)
                 A* (si destination connue)

Maximiser/minimiser une      DP (si chevauchement + sous-structure)
quantité sur une séquence     Greedy (si propriété greedy vérifiable)

Compter des combinaisons     DP (comptage)
Lister des combinaisons      Backtracking

Couvrir un arbre/graphe      DFS (exploration complète)
entièrement            BFS (niveau par niveau)
```

---

## COMPLEXITÉS CLÉS

```
Algorithme       Temps      Espace
──────────────────────────────────────────────
Bubble Sort       O(n²)      O(1)
Merge Sort       O(n log n)   O(n)
Quick Sort       O(n log n) avg O(log n)
Binary Search      O(log n)    O(1)

DP Fibonacci      O(n)      O(n) / O(1) avec optimisation
DP Knapsack       O(n*W)     O(n*W) / O(W) avec optimisation
DP LCS         O(m*n)     O(m*n) / O(min(m,n))

Backtracking Permut.  O(n!)      O(n)
Backtracking Subsets  O(2^n)     O(n)
N-Queens        O(n!)      O(n)

Dijkstra (binary heap) O((V+E)log V)  O(V)
Bellman-Ford      O(V*E)     O(V)
A*           O(E log V)   O(V)
BFS/DFS         O(V+E)     O(V)
Topological Sort    O(V+E)     O(V)
```

---

## DÉPENDANCES ENTRE MODULES

- `09_data_structures/05_heap` : min-heap utilisé dans Dijkstra et A*
- `09_data_structures/08_graphs` : représentation des graphes (adjacency list, BFS, DFS)
- `09_data_structures/09_advanced_bonus/01_union_find` : Kruskal MST
- `08_memory_performance/03_complexity` : analyser la complexité de chaque algo
- `10_algorithms/01_sorting` : fondation du divide & conquer
- `10_algorithms/02_searching` : fondation de la recherche binaire et du BFS
- `10_algorithms/03_dynamic_programming` : mémoïsation, tabulation, sous-structure

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
