# Page verrouillée
Temps de lecture ~20 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## GRIMOIRE : DATA STRUCTURES

---

## ARRAY

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Index | Position numérique d'un élément dans un tableau. Accès direct en O(1). | `arr[3]` retourne le 4e élément | La tribune d'un stade : tu connais le siège, tu y vas direct / Le registre de Konoha : chaque ninja a un numéro, accès immédiat |
| Slice | Copie superficielle d'une portion du tableau. Ne modifie pas l'original. | `arr.slice(2, 5)` retourne les éléments 2, 3, 4 | Découper une section du classement Ballon d'Or sans changer le classement original / Naruto qui extrait une liste de missions sans toucher au registre |
| Spread | Copie tous les éléments dans un nouveau contexte. Shallow copy. | `const copy = [...arr]` | Photocopier la feuille de stats d'un match / Dupliquer la liste d'équipe avant de la modifier |
| map | Transforme chaque élément via une fonction, retourne un nouveau tableau de même longueur. | `arr.map(x => x * 2)` | Convertir les scores de chaque joueur de Ligue 1 en points fantasy / Transformer chaque jutsu en version améliorée |
| filter | Retourne un nouveau tableau ne contenant que les éléments qui passent le test. | `arr.filter(x => x > 10)` | Garder uniquement les joueurs au-dessus de 80 de rating / Filtrer les missions S de la liste complète |
| reduce | Réduit tout le tableau à une seule valeur en accumulant. | `arr.reduce((acc, x) => acc + x, 0)` | Calculer le total des buts marqués sur une saison / Additionner tous les chakra des ninjas d'une équipe |
| Coût insertion/suppression | Insérer ou supprimer au milieu d'un tableau : O(n) car les éléments suivants doivent être décalés. | `arr.splice(2, 0, val)` décale tous les éléments après l'index 2 | Insérer un joueur en milieu de classement : tout le monde descend d'un rang / Retirer un Chevalier de Garo en plein milieu de la formation : les autres se repositionnent |

---

## LINKED LIST

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Node | Unité de base d'une liste chaînée : contient une valeur et un pointeur vers le noeud suivant. | `{ value: 42, next: null }` | Un wagon de train qui connaît le wagon devant lui mais pas sa position dans la rame / Une section de la prison de Fox River qui pointe vers la suivante dans le couloir |
| Head | Premier noeud de la liste. Point d'entrée unique. Si head = null : liste vide. | `this.head = new Node(val)` | Le capitaine d'équipe qui tient la liste des joueurs / Naruto en tête de file pour recevoir les missions |
| Tail | Dernier noeud de la liste. Son `next` est null (ou pointe vers head si liste circulaire). | `this.tail.next = null` | Le dernier joueur dans le tunnel avant le match / La dernière section avant la sortie dans le plan de Michael |
| Singly Linked | Chaque noeud ne connaît que son successeur. Traversal dans un seul sens. | `node.next` seulement | Une file d'attente où chacun ne voit que la personne devant lui / Les étapes d'un jutsu qui ne peuvent s'exécuter que dans l'ordre |
| Doubly Linked | Chaque noeud connaît son successeur ET son prédécesseur. Traversal dans les deux sens. | `node.next` et `node.prev` | Une file de candidats au Ballon d'Or où chacun connaît celui devant et celui derrière / Un couloir de prison où chaque section connaît la précédente et la suivante |
| Insertion en tête | Insérer en O(1) : le nouveau noeud pointe vers l'ancien head, devient le nouveau head. | `newNode.next = this.head; this.head = newNode` | Ajouter un nouveau candidat en tête de liste sans réorganiser les autres / Naruto devient chef de file instantanément |

---

## STACK

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| LIFO | Last In, First Out. Le dernier élément ajouté est le premier extrait. Principe fondamental de la stack. | `stack.push(x); stack.pop()` retourne x | Une pile d'assiettes : on prend toujours du dessus / L'historique de navigation du navigateur : le retour arrière revient toujours à la dernière page visitée |
| push | Ajouter un élément au sommet de la stack en O(1). | `stack.push(val)` | Poser une nouvelle assiette sur la pile / Mémoriser un nouveau noeud pendant un DFS |
| pop | Retirer et retourner l'élément du sommet en O(1). Erreur si stack vide. | `const top = stack.pop()` | Prendre l'assiette du dessus / Revenir en arrière dans le DFS après avoir exploré une branche |
| peek | Lire l'élément du sommet sans le retirer, en O(1). | `stack[stack.length - 1]` | Regarder l'assiette du dessus sans la prendre / Vérifier la prochaine mission sans la démarrer |
| Call Stack | La stack interne du moteur JS qui trace les appels de fonctions actifs. Un stackoverflow = la call stack a dépassé sa limite. | La récursion infinie déborde la call stack | La hiérarchie des commandants de Konoha pendant une mission : chacun attend que le niveau en dessous finisse / Gus Fring qui attend les résultats de chaque niveau avant de passer à l'action |

---

## QUEUE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| FIFO | First In, First Out. Le premier élément ajouté est le premier extrait. Principe fondamental de la queue. | `queue.push(x); queue.shift()` | Une file d'attente au guichet : le premier arrivé est le premier servi / L'ordre d'entrée en scène des Chevaliers de Garo |
| enqueue | Ajouter un élément en queue de file en O(1). | `queue.push(val)` | Rejoindre la file d'attente / Ajouter une tâche au pipeline |
| dequeue | Retirer et retourner le premier élément en O(1) (avec une implémentation correcte). `.shift()` natif est O(n) : préférer une implémentation avec head pointer. | `const first = queue[this.head++]` | Le premier de la file qui passe au guichet / La prochaine tâche du scheduler qui s'exécute |
| Ring Buffer | Implémentation circulaire d'une queue avec taille fixe. Évite les allocations répétées. | `idx = (idx + 1) % capacity` | Un circuit de distribution qui revient toujours au point de départ / Les rotations de garde au camp de Rick |
| BFS Queue | La queue est l'outil central de BFS. Elle garantit le parcours niveau par niveau. | `const queue = [start]; while (queue.length) { const cur = queue.shift(); ... }` | Une épidémie qui se propage en cercles depuis le patient zéro / Michael qui explore les sections de la prison par distance croissante depuis sa cellule |

---

## HEAP

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Min-Heap | Arbre binaire complet où chaque parent est ≤ à ses enfants. La racine est toujours le minimum global. | `heap[0]` est le plus petit. Parent de i : `Math.floor((i-1)/2)` | La salle d'attente médicale où le plus grave passe toujours en premier / Naruto qui reçoit les missions S avant les C |
| Max-Heap | Arbre binaire complet où chaque parent est ≥ à ses enfants. La racine est toujours le maximum global. | `heap[0]` est le plus grand. Structure miroir du min-heap. | Le Ballon d'Or : le meilleur est toujours au sommet / Gus Fring au sommet de son réseau, toujours |
| Bubble Up | Remonter un noeud inséré jusqu'à sa position correcte en swappant avec son parent. O(log n). | `while (i > 0 && heap[parent] > heap[i]) { swap; i = parent }` | Mbappé qui grimpe dans les classements après une grande saison / Un Chevalier promu après une victoire contre un Horror de rang S |
| Sink Down | Descendre la racine extraite jusqu'à sa position correcte en swappant avec le plus grand enfant. O(log n). | `while (largest !== i) { swap; i = largest }` | Walter qui délègue vers le bas après avoir été neutralisé / Le successeur du boss qui descend dans la hiérarchie jusqu'à trouver sa place |
| Heapify | Construire un heap depuis un tableau existant en O(n). Applique sink down de la moitié du tableau vers la racine. | `for (let i = Math.floor(n/2)-1; i >= 0; i--) sinkDown(i)` | Réorganiser toute une équipe après un mercato massif / Restructurer le réseau de Gus après une purge complète |

---

## PRIORITY QUEUE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Priority Queue | Interface sur un heap : enqueue avec priorité, dequeue retourne toujours la priorité max ou min. O(log n) pour les deux. | `pq.enqueue(item, priority)` / `pq.dequeue()` | Les urgences d'un hôpital : le plus grave passe avant tout le monde / Le dispatcher de Garo qui envoie le Chevalier sur la menace la plus critique |
| Stable Priority | Quand deux éléments ont la même priorité, l'ordre d'arrivée est respecté (FIFO). Nécessite un critère secondaire. | `{ value, priority, seq: insertionOrder++ }` | Deux blessés critiques : le premier arrivé aux urgences passe en premier / Deux missions S simultanées : celle reçue en premier s'exécute en premier |

---

## BST (BINARY SEARCH TREE)

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| BST | Arbre binaire : tout ce qui est à gauche d'un noeud est strictement inférieur, tout ce qui est à droite est strictement supérieur. | `val < node.value → gauche ; val > node.value → droite` | L'annuaire qui coupe en deux à chaque recherche / Naruto qui cherche Sasuke en éliminant la moitié du village à chaque indice |
| Insert | Descend jusqu'au premier null en comparant à chaque noeud, puis insère. O(log n) si l'arbre est équilibré. | `while (true) { if (val < cur.val) { if (!cur.left) { cur.left = node; return } cur = cur.left } }` | Classer un nouveau joueur sans réorganiser tout le classement / Ajouter un jutsu dans l'encyclopédie au bon endroit alphabétique |
| Delete cas 3 | Supprimer un noeud avec deux enfants : remplace sa valeur par le successeur in-order (minimum du sous-arbre droit), puis supprime ce successeur. | `const succ = findMin(node.right); node.value = succ.value; deleteNode(node.right, succ.value)` | Gus qui élimine un maillon : le suivant dans la hiérarchie prend sa place / Une section de Fox River supprimée : la section suivante dans le couloir comble le vide |
| Arbre dégénéré | Insertions dans l'ordre trié → l'arbre devient une liste chaînée. Hauteur O(n), toutes les opérations dégénèrent en O(n). | Insérer [1,2,3,4,5] → hauteur 5, pas log(5) | Walter qui insère ses distributeurs par ordre alphabétique : une file droite, zéro efficacité / Un tournoi à élimination directe toujours remporté par la même graine : l'arbre ne se ramifie jamais |
| In-Order | Traversal gauche → noeud → droite. Jutsu toujours une séquence triée sur un BST valide. O(n). | `inOrder(left); result.push(node); inOrder(right)` | Lire le classement de bas en haut / Tsunade qui lit les dossiers dans l'ordre de gravité croissante |
| Pre-Order | Traversal noeud → gauche → droite. Préserve la structure de l'arbre : sérialisation fidèle. O(n). | `result.push(node); preOrder(left); preOrder(right)` | Photographier un organigramme de haut en bas avant de le démonter / Michael qui mémorise le plan de Fox River section par section depuis l'entrée |
| Post-Order | Traversal gauche → droite → noeud. Traite les enfants avant le parent. O(n). | `postOrder(left); postOrder(right); result.push(node)` | Gus qui ferme ses labs de la périphérie vers le centre / Démanteler une équipe des sous-traitants vers les chefs |

---

## HASH TABLE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Hash Function | Transforme une clé en index entier borné. Déterministe : même clé → même index, toujours. | `(charCode * PRIME) % tableSize` | Un casier numéroté selon les initiales du nom / Konoha qui assigne les ninja à leur section selon leur village d'origine |
| Collision | Deux clés distinctes produisent le même index. Inévitable avec suffisamment de clés. Doit être gérée. | `hash("Sasuke", 10) === hash("Sakura", 10)` | Deux ninjas avec le même numéro de casier / Deux suspects avec le même profil qui aboutissent à la même cellule |
| Chaining | Gère les collisions avec une liste par bucket. Chaque case du tableau contient une liste de paires (clé, valeur). | `table[hash(key)].push([key, value])` | Plusieurs dossiers dans la même chemise classeur / Des missions de même rang rangées dans la même pochette |
| Load Factor | Ratio entrées / taille du tableau. Au-delà de ~0.75, performances dégradées → resize. | `if (entries / size > 0.75) resize()` | Le camp de Rick qui agrandit ses défenses quand il approche de la capacité max / Gus qui ouvre un nouveau labo quand la production dépasse 75% |
| Map (JS natif) | Hash table optimisée par le moteur JS. Accepte n'importe quel type de clé, pas seulement les strings. Pas de risque de collision avec `__proto__`. | `const m = new Map(); m.set(key, val); m.get(key)` | Un carnet d'adresses qui accepte n'importe quoi comme étiquette / Le registre de Konoha qui indexe par objet ninja, pas juste par nom |

---

## GRAPHE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Adjacency List | Chaque noeud pointe vers la liste de ses voisins. O(V+E) en espace. Efficace sur les graphes peu denses. | `{ A: [{node:"B", weight:3}], B: [...] }` | Le carnet de contacts de chaque personnage / Michael Scofield avec sa liste de connexions par section de la prison |
| Directed Graph | Les arêtes ont un sens. A → B ne signifie pas B → A. | `addEdge(v1, v2)` sans la réciproque | Twitter : suivre Messi ne veut pas dire qu'il te suit / Les dépendances npm : react dépend de object-assign, pas l'inverse |
| Weighted Graph | Chaque arête a un poids. Indispensable pour Dijkstra et les algos de chemin minimal. | `{ node: "B", weight: 45 }` | Le réseau routier avec les distances entre villes / Walter White avec les niveaux de risque sur chaque route de livraison |
| BFS | Parcours niveau par niveau via une queue. Garantit le plus court chemin en nombre d'arêtes non pondérées. | `queue=[start]; while(queue.length){ cur=queue.shift(); voisins→queue }` | Une épidémie qui se propage en cercles concentriques / Michael qui cartographie la prison section par section depuis sa cellule |
| DFS | Parcours en profondeur via stack ou récursion. Explore une branche entière avant de revenir. | `dfs(node); for (neighbor) if (!visited) dfs(neighbor)` | Daryl qui traque un zombie dans les bois couloir par couloir / Naruto qui suit une piste jusqu'au bout avant d'en essayer une autre |
| Topological Sort | Ordre linéaire des noeuds d'un DAG où chaque arête A→B garantit A avant B. | Kahn : in-degree 0 d'abord. DFS : post-order inversé. | L'ordre d'installation des modules du curriculum MyFunnyJS / Gus Fring qui exécute chaque étape de production dans le bon ordre |
| Composant connexe | Sous-ensemble de noeuds tous mutuellement atteignables. Un graphe peut avoir plusieurs composants isolés. | DFS depuis chaque noeud non visité → un composant par appel | Les groupes de survivants de Rick coupés les uns des autres par les zombies / Les équipes de Chevaliers de Garo qui patrouillent des territoires sans connexion |
| Cycle | Chemin qui revient à son point de départ. Sur un graphe dirigé : détectable via un Set `inProgress` pendant le DFS. | `if (inProgress.has(node)) → cycle détecté` | La supply chain de Walter qui boucle sur Albuquerque / Un import circulaire dans npm qui bloque le build |
| DAG | Directed Acyclic Graph. Graphe dirigé sans cycle. Structure de base pour les dépendances et les pipelines. | Valider avec `hasCycleDirected()` avant d'utiliser | Le pipeline de production de Gus : chaque étape dépend de la précédente, jamais de la suivante / Le curriculum MyFunnyJS : chaque module a ses prérequis, aucun cycle |

---

## UNION-FIND

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Union-Find | Structure qui maintient des groupes dynamiques. Deux opérations : `find` (quel groupe ?) et `union` (fusionner deux groupes). | `uf.find(x)` / `uf.union(x, y)` / `uf.connected(x, y)` | Les camps de survivants de Rick qui fusionnent progressivement / Les équipes du tournoi de Konoha qui s'agrandissent après chaque victoire |
| find | Retourne le représentant (racine) du groupe contenant x. Avec path compression : O(α(n)). | `if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x]` | Trouver le chef d'équipe à partir d'un membre quelconque / Identifier le Chevalier principal d'une zone de patrouille |
| union | Fusionne les groupes de x et y. Avec union by rank : attache le plus petit arbre sous le plus grand. | `parent[rootX] = rootY` ou inverse selon les ranks | Deux camps de survivants qui se rejoignent et élisent un seul chef / Deux équipes ninja qui fusionnent après la mission commune |
| Path Compression | Optimisation de `find` : après avoir trouvé la racine, tous les noeuds sur le chemin pointent directement vers elle. | `parent[x] = find(parent[x])` | Chaque membre apprend directement l'identité du chef sans passer par les intermédiaires / Raccourci direct vers le sommet de la hiérarchie |
| Union by Rank | Optimisation de `union` : attache toujours le plus petit arbre (rank inférieur) sous le plus grand. Évite les arbres dégénérés. | `if (rank[rootX] < rank[rootY]) parent[rootX] = rootY` | Le camp le plus petit rejoint le plus grand, pas l'inverse / La petite équipe ninja s'intègre dans la grande, pas l'inverse |
| α(n) | Fonction inverse d'Ackermann. Complexité de Union-Find avec les deux optimisations. Pour tout n réel, α(n) ≤ 5. Quasi O(1). | `find` et `union` sont O(α(n)) amorti | Aussi rapide que possible sans être O(1) pur / Naruto qui répond en 0.0001 seconde peu importe la taille du village |

---

## FENWICK TREE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Fenwick Tree | Tableau qui supporte les updates et les range sum queries en O(log n). Aussi appelé Binary Indexed Tree (BIT). 1-indexé. | `ft.update(i, delta)` / `ft.rangeSum(l, r)` | Le tableau de stats live d'un match qui se met à jour en O(log n) à chaque action / Le classement Ballon d'Or qui recalcule instantanément après chaque vote |
| lowbit | `i & (-i)` : isole le bit le plus bas de i. Détermine combien d'éléments chaque case du Fenwick Tree couvre. | `lowbit(6) = 6 & (-6) = 2` → couvre 2 éléments | La clé de lecture du casier : le numéro du casier dit combien de dossiers il contient / Le rang du Chevalier qui détermine combien de zones il supervise |
| prefixSum | Somme de tous les éléments de l'index 1 à i. Descend en soustrayant le lowbit à chaque étape. O(log n). | `while (i > 0) { sum += tree[i]; i -= lowbit(i) }` | Le total des passes depuis le début du match jusqu'à la minute i / Les votes cumulés pour tous les candidats jusqu'au rang i |
| update | Met à jour l'index i et propage vers le haut en ajoutant le lowbit. O(log n). | `while (i <= n) { tree[i] += delta; i += lowbit(i) }` | Créditer Messi de 3 passes à la minute 4 et mettre à jour tous les totaux concernés / Ajouter des votes à un candidat et propager vers les agrégats |
| rangeSum | Somme entre l'index l et r : `prefixSum(r) - prefixSum(l-1)`. O(log n). | `return prefixSum(r) - prefixSum(l - 1)` | Total des passes entre la 10e et la 30e minute / Total des votes pour les candidats classés 3e à 7e |

---

## SUFFIX ARRAY

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Suffix | Sous-string qui commence à l'index i et va jusqu'à la fin de la string. Une string de longueur n a n suffixes. | `str.slice(i)` pour tout i de 0 à n-1 | Toutes les façons de terminer une phrase à partir d'un mot donné / Tous les chemins depuis une section de prison jusqu'à la sortie |
| Suffix Array | Tableau des indices des suffixes triés dans l'ordre lexicographique. Permet la recherche de pattern en O(m log n). | `buildSuffixArray("banana")` → `[5, 3, 1, 0, 4, 2]` | L'index d'un livre : toutes les entrées triées alphabétiquement avec leurs numéros de page / L'encyclopédie des jutsu classée alphabétiquement avec leurs positions dans le registre |
| Prefix Doubling | Algorithme de construction du suffix array. Trie par les 2k premiers caractères à chaque itération jusqu'à distinguer tous les suffixes. O(n log² n). | `for (let gap = 1; gap < n; gap *= 2) { sa.sort(...) }` | Classer les joueurs d'abord sur 1 critère, puis 2, puis 4, jusqu'à différencier tout le monde / Trier les missions d'abord par rang, puis par village, puis par date |
| LCP Array | Longest Common Prefix array. `lcp[i]` = longueur du plus long préfixe commun entre `sa[i]` et `sa[i-1]`. Construit en O(n). | `lcp[rank[i]] = h` après comparaison caractère par caractère | La longueur du tronc commun entre deux branches d'arbre généalogique / Combien de séquences de chakra deux jutsu partagent au début |
| Pattern Search | Recherche binaire sur le suffix array : tous les suffixes commençant par le pattern sont contigus. O(m log n) par requête. | `binarySearch(sa, pattern)` sur les m premiers caractères | Chercher un mot dans l'index d'un livre : toutes les occurrences sont sur des pages consécutives / Retrouver un jutsu dans l'encyclopédie : toutes les variantes sont regroupées |

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
