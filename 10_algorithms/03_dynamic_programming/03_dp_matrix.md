---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# DP SUR GRILLE 2D : QUAND L'ESPACE DEVIENT UN GRAPHE
Temps de lecture ~11 min

Tu as une grille. Chaque cellule a un coût, un état, ou un obstacle. Tu dois aller du coin en haut à gauche au coin en bas à droite. La question : quel chemin coûte le moins ? Combien de chemins existent ? Est-ce même possible ?

C'est pas un problème de jeu vidéo. C'est exactement ce que fait Dijkstra sur des cartes, ce que fait Google Maps pour les itinéraires, ce que fait un robot d'entrepôt pour éviter les obstacles.

La grille, c'est juste un graphe avec une topologie régulière. La DP sur grille, c'est mémoriser les sous-problèmes pour ne jamais recalculer depuis le départ.

---

## 1) LA STRUCTURE DU PROBLÈME

Une grille `m x n`. Chaque cellule `grid[i][j]` est soit un coût, soit un obstacle (0 ou 1), soit une valeur à maximiser.

Les mouvements autorisés définissent tout : vers le bas et vers la droite uniquement (problèmes classiques), ou dans 4 directions (problèmes avec obstacles). Les deux ont la même mécanique, pas la même complexité.

```
 0  1  2  3   ← colonnes (j)
0 [1] [3] [1] [2]
1 [1] [5] [1] [1]
2 [4] [2] [1] [1]  ← lignes (i)
```

Le chemin optimal de `(0,0)` à `(2,3)` n'est pas forcément le plus court en distance : c'est celui dont la somme des coûts est minimale.

---

## 2) MINIMUM PATH SUM

Le classique. Grille de coûts. Mouvements : bas ou droite uniquement. Trouver la somme minimale pour atteindre le coin bas-droite.

**L'intuition :** pour arriver en `(i,j)`, tu viens soit de `(i-1,j)` soit de `(i,j-1)`. Tu prends le minimum des deux, tu ajoutes le coût de la cellule actuelle. C'est tout.

```
dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
```

```js
function minPathSum(grid) {
 const m = grid.length
 const n = grid[0].length
 const dp = Array.from({ length: m }, () => new Array(n).fill(0))

 // point de départ : juste le coût de la cellule elle-même
 dp[0][0] = grid[0][0]

 // première ligne : on peut seulement venir de gauche
 for (let j = 1; j < n; j++) {
  dp[0][j] = dp[0][j - 1] + grid[0][j]
 }

 // première colonne : on peut seulement venir du dessus
 for (let i = 1; i < m; i++) {
  dp[i][0] = dp[i - 1][0] + grid[i][0]
 }

 // le reste : minimum entre venir du dessus ou de gauche
 for (let i = 1; i < m; i++) {
  for (let j = 1; j < n; j++) {
   dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1])
  }
 }

 return dp[m - 1][n - 1]
}

const grid = [
 [1, 3, 1],
 [1, 5, 1],
 [4, 2, 1]
]
console.log(minPathSum(grid)) // 7 => chemin : 1→3→1→1→1
```

**Trace d'exécution sur cette grille :**

```
grille originale :    table dp remplie :
[1, 3, 1]         [1, 4, 5]
[1, 5, 1]     -->   [2, 7, 6]
[4, 2, 1]         [6, 8, 7]

réponse : dp[2][2] = 7
```

---

## 3) UNIQUE PATHS : COMPTER LES CHEMINS

Même grille, même contrainte (bas/droite uniquement), mais cette fois on compte combien de chemins distincts existent de `(0,0)` à `(m-1,n-1)`.

**L'intuition :** pour atteindre `(i,j)`, le nombre de chemins = nombre de chemins qui arrivent par le dessus + nombre de chemins qui arrivent par la gauche.

```
dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

```js
function uniquePaths(m, n) {
 // toute la première ligne a exactement 1 chemin possible (aller tout à droite)
 // toute la première colonne a exactement 1 chemin possible (aller tout en bas)
 const dp = Array.from({ length: m }, () => new Array(n).fill(1))

 for (let i = 1; i < m; i++) {
  for (let j = 1; j < n; j++) {
   // venir du dessus + venir de gauche
   dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
  }
 }

 return dp[m - 1][n - 1]
}

console.log(uniquePaths(3, 7)) // 28
console.log(uniquePaths(3, 3)) // 6
```

**Visualisation 3x3 :**

```
[1, 1, 1]
[1, 2, 3]
[1, 3, 6]

=> 6 chemins différents pour aller de (0,0) à (2,2)
```

---

## 4) UNIQUE PATHS AVEC OBSTACLES

Même problème, mais certaines cellules sont bloquées (valeur `1` dans `obstacleGrid`).

La règle change : si une cellule est un obstacle, `dp[i][j] = 0`. Si la cellule de départ ou d'arrivée est un obstacle : réponse directe `0`.

```js
function uniquePathsWithObstacles(obstacleGrid) {
 const m = obstacleGrid.length
 const n = obstacleGrid[0].length

 // départ ou arrivée bloqués : aucun chemin possible
 if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) return 0

 const dp = Array.from({ length: m }, () => new Array(n).fill(0))
 dp[0][0] = 1

 // première colonne : dès qu'il y a un obstacle, tout ce qui suit est 0
 for (let i = 1; i < m; i++) {
  dp[i][0] = obstacleGrid[i][0] === 1 ? 0 : dp[i - 1][0]
 }

 // première ligne : même logique
 for (let j = 1; j < n; j++) {
  dp[0][j] = obstacleGrid[0][j] === 1 ? 0 : dp[0][j - 1]
 }

 for (let i = 1; i < m; i++) {
  for (let j = 1; j < n; j++) {
   // obstacle : cellule inaccessible, contribution = 0
   dp[i][j] = obstacleGrid[i][j] === 1 ? 0 : dp[i - 1][j] + dp[i][j - 1]
  }
 }

 return dp[m - 1][n - 1]
}

const grid = [
 [0, 0, 0],
 [0, 1, 0], // obstacle au centre
 [0, 0, 0]
]
console.log(uniquePathsWithObstacles(grid)) // 2 (le centre est bloqué)
```

---

## 5) OPTIMISATION MÉMOIRE : UNE SEULE LIGNE

Pour `minPathSum` et `uniquePaths`, on n'a besoin que de la ligne précédente à chaque étape. Au lieu d'une grille `m x n`, on peut travailler avec un tableau de taille `n`.

```js
function minPathSumOptimized(grid) {
 const n = grid[0].length
 // dp représente la ligne courante, initialisée avec la première ligne
 const dp = [...grid[0]]

 // on accumule la première ligne vers la droite
 for (let j = 1; j < n; j++) dp[j] += dp[j - 1]

 for (let i = 1; i < grid.length; i++) {
  // première colonne : on vient forcément du dessus
  dp[0] += grid[i][0]

  for (let j = 1; j < n; j++) {
   // dp[j] contient encore la valeur d'en haut (avant update)
   // dp[j-1] contient la valeur de gauche (déjà mise à jour)
   dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1])
  }
 }

 return dp[n - 1]
}
```

Complexité : `O(m*n)` en temps, `O(n)` en mémoire. C'est le même résultat, deux fois moins gourmand.

---

## 6) LE PIÈGE CLASSIQUE : LES BORDS

Les bords d'une grille DP sont le seul endroit où la formule générale ne s'applique pas directement. Oublier de les initialiser correctement casse tout le calcul.

```js
// MAUVAIS : oublier d'initialiser les bords
function broken(grid) {
 const dp = Array.from({ length: grid.length }, () =>
  new Array(grid[0].length).fill(0)
 )
 // on commence directement à i=0, j=0 sans initialisation des bords
 // dp[i-1][j] sur la première ligne = dp[-1][j] = undefined
 for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
   dp[i][j] = grid[i][j] + Math.min(
    dp[i - 1]?.[j] ?? Infinity, // le ?. cache le bug au lieu de le corriger
    dp[i]?.[j - 1] ?? Infinity
   )
  }
 }
 return dp[grid.length - 1][grid[0].length - 1]
}

// CORRECT : initialiser explicitement les bords avant la boucle principale
// première ligne, première colonne, puis le reste
```

Le `?? Infinity` semble défensif. En réalité il masque une erreur de conception. Les bords doivent être initialisés, pas contournés.

---

## 7) QUAND LES 4 DIRECTIONS SONT AUTORISÉES

Dès que tu peux aller dans 4 directions (haut, bas, gauche, droite), la DP tabulaire classique ne suffit plus : une cellule peut dépendre de cellules pas encore calculées. On bascule sur BFS/DFS avec mémoïsation, ou Dijkstra.

```js
// DP classique avec 4 directions => MAUVAIS
// dp[i][j] peut dépendre de dp[i+1][j] qui n'est pas encore calculé
// résultat : valeurs incorrectes, silencieusement

// CORRECT pour 4 directions avec coûts : Dijkstra (voir 06_graph_algorithms)
// CORRECT pour 4 directions sans coûts (maze) : BFS
```

---

## EXERCICES

## EXO 1 : LA ROUTE DE L'EXPÉDITION TITAN
_~20 min_


L'escouade de reconnaissance doit traverser une zone contrôlée par les Titans. La zone est une grille `5x5`. Chaque cellule a un niveau de danger entre 1 et 9. Le trajet part du coin nord-ouest (départ du Mur Maria) et doit atteindre le coin sud-est (la forêt de Shiganshina). Objectif : minimiser l'exposition totale au danger.

Implémenter `minDangerPath(grid)`. Retourner la somme minimale du chemin. Mouvements autorisés : bas et droite uniquement.

(indice : initialise les bords avant la boucle principale)

---

## EXO 2 : COMPTER LES ITINÉRAIRES DE JESSE
_~20 min_


Jesse Pinkman doit livrer la marchandise. La ville est une grille `m x n`. Certaines cases sont des checkpoints de police (obstacle = 1). Walter veut savoir combien d'itinéraires distincts existent du départ à l'arrivée pour calibrer le risque.

Implémenter `countSafeRoutes(grid)`. `grid[i][j] = 1` = checkpoint à éviter.

(indice : si un obstacle bloque la première colonne, toutes les cellules sous lui ont `dp = 0`)

---

## EXO 3 : LE TERRAIN DE JEU DE GARO
_~25 min_


León Luis doit traverser un terrain infesté de Horreurs en collectant des points de force. Grille `m x n`, chaque cellule a une valeur positive ou nulle. Mouvements : bas et droite. Objectif : maximiser la somme collectée.

Implémenter `maxPowerPath(grid)`. Même structure que `minPathSum`, mais avec `Math.max` au lieu de `Math.min`.

---

## EXO 4 : MÉMOIRE OPTIMISÉE
_~25 min_


Reprendre la solution de l'EXO 1 et la réécrire pour n'utiliser qu'un seul tableau de taille `n` au lieu d'une grille `m x n` complète. Vérifier que le résultat est identique.

---

## RÉSUMÉ

La DP sur grille, c'est décomposer un problème de chemin en sous-problèmes locaux : pour arriver ici, d'où je viens, et quel était le coût optimal là-bas. Les bords sont le seul point de vigilance réel : ils n'ont pas de "voisin gauche" ou "voisin supérieur", il faut les traiter à part. Quand les mouvements sont restreints (bas/droite), la DP tabulaire classique suffit. Quand les 4 directions sont libres, on passe à BFS ou Dijkstra : la DP seule ne peut plus garantir que les dépendances sont résolues dans le bon ordre.
