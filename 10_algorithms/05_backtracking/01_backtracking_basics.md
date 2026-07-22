---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# BACKTRACKING : EXPLORER L'ARBRE DES POSSIBLES SANS SE PERDRE
Temps de lecture ~11 min

Imagine que tu dois trouver la combinaison d'un coffre-fort. Tu essaies un chiffre, puis un autre, puis un autre. Si ça bloque, tu reviens en arrière et tu essaies autre chose. C'est ça le backtracking : exploration exhaustive avec retour en arrière.

C'est plus lent que greedy, plus simple à raisonner que DP. Sa force : il trouve **toujours** la solution si elle existe. Son coût : exponentiel dans le pire cas. Son arme secrète : **le pruning** , couper les branches de l'arbre qu'on sait stériles avant d'aller au bout.

En prod, backtracking c'est les solveurs de contraintes, les générateurs de puzzles, les systèmes de planification, les compilateurs qui cherchent des patterns.

---

## 1) LES TROIS CONCEPTS QUI FONT TOUT

**L'arbre de décision :** chaque noeud est un état partiel. Chaque branche est un choix. Les feuilles sont soit des solutions valides, soit des impasses.

**L'état :** ce qu'on a construit jusqu'ici. Un tableau, une grille partiellement remplie, une chaîne. À chaque appel récursif, on étend l'état avec un nouveau choix.

**Le pruning :** avant d'explorer une branche, vérifier si elle peut mener à une solution. Si non : couper. C'est ce qui sépare un backtracking efficace d'une force brute naïve.

```
       []
      / | \
     [1] [2] [3]
     /\  ...
   [1,2][1,3]
    /
  [1,2,3] ← solution si valide
```

---

## 2) LE TEMPLATE UNIVERSEL

Tous les problèmes de backtracking ont la même structure :

```js
function backtrack(state, choices, result) {
 // cas de base : est-ce qu'on a une solution complète ?
 if (isSolution(state)) {
  result.push([...state]); // copier, pas référencer
  return;
 }

 for (const choice of choices) {
  // est-ce que ce choix est valide depuis l'état actuel ?
  if (!isValid(state, choice)) continue; // pruning

  // faire le choix : étendre l'état
  state.push(choice);

  // explorer depuis ce nouvel état
  backtrack(state, nextChoices(state, choice), result);

  // défaire le choix : retour en arrière
  state.pop();
 }
}
```

Les trois opérations : **choisir**, **explorer**, **défaire**. L'ordre est fixe. L'oublier = bugs impossibles à déboguer.

---

## 3) PERMUTATIONS : L'EXEMPLE DE BASE

Générer toutes les permutations d'un tableau.

```js
function permutations(nums) {
 const result = [];

 function backtrack(current, remaining) {
  // cas de base : plus rien à placer, on a une permutation complète
  if (remaining.length === 0) {
   result.push([...current]);
   return;
  }

  for (let i = 0; i < remaining.length; i++) {
   // choisir remaining[i]
   current.push(remaining[i]);

   // explorer : remaining sans l'élément choisi
   backtrack(current, [...remaining.slice(0, i), ...remaining.slice(i + 1)]);

   // défaire
   current.pop();
  }
 }

 backtrack([], nums);
 return result;
}

console.log(permutations([1, 2, 3]));
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
// 3! = 6 permutations
```

**Arbre de décision :**

```
        []
     /   |   \
    [1]  [2]  [3]
    /  \
  [1,2] [1,3]
   |   |
 [1,2,3] [1,3,2]
```

Complexité : `O(n!)`. Sur `n=10` : 3.6 millions. Sur `n=15` : 1.3 trillion. Le pruning devient vital dès que n grandit.

---

## 4) SUBSETS : TOUTES LES COMBINAISONS

Générer tous les sous-ensembles d'un tableau (le power set).

```js
function subsets(nums) {
 const result = [];

 function backtrack(start, current) {
  // chaque état partiel est un sous-ensemble valide : on l'ajoute
  result.push([...current]);

  for (let i = start; i < nums.length; i++) {
   current.push(nums[i]);
   backtrack(i + 1, current); // start = i+1 : on ne revient pas en arrière
   current.pop();
  }
 }

 backtrack(0, []);
 return result;
}

console.log(subsets([1, 2, 3]));
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
// 2^3 = 8 sous-ensembles
```

Différence avec les permutations : `start = i + 1` garantit qu'on ne prend chaque élément qu'une fois et dans un ordre fixe. Pas de `[2,1]` et `[1,2]` : juste `[1,2]`.

---

## 5) N-QUEENS : LE PRUNING EN ACTION

Placer N reines sur un échiquier N×N sans qu'aucune ne s'attaque.

C'est le problème où le pruning fait toute la différence. Sans pruning : `O(N^N)` états à explorer. Avec pruning (vérifier les conflits avant de placer) : on coupe 99%+ des branches sur de grandes valeurs de N.

```js
function solveNQueens(n) {
 const result = [];
 // cols[i] = colonne de la reine dans la ligne i
 const cols = [];

 function isValid(row, col) {
  for (let r = 0; r < row; r++) {
   if (
    cols[r] === col || // même colonne
    cols[r] - col === r - row || // même diagonale
    cols[r] - col === row - r // même anti-diagonale
   )
    return false;
  }
  return true;
 }

 function backtrack(row) {
  if (row === n) {
   // convertir cols[] en représentation visuelle
   result.push(cols.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)));
   return;
  }

  for (let col = 0; col < n; col++) {
   if (!isValid(row, col)) continue; // pruning : conflit détecté, skip cette colonne

   cols[row] = col;
   backtrack(row + 1);
   // pas besoin de "défaire" cols[row] explicitement : il sera écrasé au prochain tour
  }
 }

 backtrack(0);
 return result;
}

console.log(solveNQueens(4).length); // 2 solutions pour 4x4
console.log(solveNQueens(8).length); // 92 solutions pour 8x8
```

**Visualisation 4x4 (solution 1) :**

```
. Q . .
. . . Q
Q . . .
. . Q .
```

**Impact du pruning :**

```
Sans pruning (force brute) : 4^4 = 256 états pour n=4
Avec pruning colonne uniquement : ~24 états
Avec pruning colonne + diagonales : ~8 états
=> ratio 32x sur un petit problème, >1000x sur n=8
```

---

## 6) COMBINATION SUM : PRUNING PAR SEUIL

Trouver toutes les combinaisons de nombres dans `candidates` qui somment à `target`. Les candidats peuvent être réutilisés.

```js
function combinationSum(candidates, target) {
 const result = [];
 candidates.sort((a, b) => a - b); // tri pour le pruning

 function backtrack(start, current, remaining) {
  if (remaining === 0) {
   result.push([...current]);
   return;
  }

  for (let i = start; i < candidates.length; i++) {
   // pruning : si le candidat dépasse le remaining, tous les suivants aussi (tableau trié)
   if (candidates[i] > remaining) break;

   current.push(candidates[i]);
   backtrack(i, current, remaining - candidates[i]); // i, pas i+1 : réutilisation permise
   current.pop();
  }
 }

 backtrack(0, [], target);
 return result;
}

// Les pièces de chakra de Naruto : quelles combinaisons font exactement 7 ?
console.log(combinationSum([2, 3, 5], 7));
// [[2,2,3], [2,5], [5,2]] => [[2,2,3], [2,5]] après déduplication de l'ordre
```

Le `break` au lieu de `continue` est le pruning crucial ici. Puisque le tableau est trié, dès qu'un candidat dépasse `remaining`, tous ceux après lui le dépasseront aussi. On coupe toute la branche.

---

## 7) LE PIÈGE : OUBLIER DE COPIER L'ÉTAT

```js
function permutationsBuggy(nums) {
 const result = [];

 function backtrack(current) {
  if (current.length === nums.length) {
   result.push(current); // BUG : référence, pas copie
   return;
  }
  for (const n of nums) {
   if (current.includes(n)) continue;
   current.push(n);
   backtrack(current);
   current.pop();
  }
 }

 backtrack([]);
 return result;
}

// Résultat : tableau de tableaux vides
// Pourquoi : current est toujours le même objet, il finit vide après tous les pop()
// Tous les éléments de result pointent vers le même tableau vide

// CORRECT :
result.push([...current]); // spread crée une vraie copie
```

C'est le bug le plus courant en backtracking. Chaque fois qu'on ajoute une solution, il faut copier l'état courant, pas l'enregistrer par référence.

---

## 8) MÉMOÏSATION SUR LE BACKTRACKING

Si les mêmes sous-problèmes apparaissent plusieurs fois (ce qui n'est pas toujours le cas), on peut mémoïser pour éviter de les recalculer.

```js
function wordBreak(s, wordDict) {
 const wordSet = new Set(wordDict);
 const memo = new Map(); // état -> résultat

 function canBreak(start) {
  if (start === s.length) return true;
  if (memo.has(start)) return memo.get(start); // résultat déjà calculé

  for (let end = start + 1; end <= s.length; end++) {
   const word = s.slice(start, end);
   if (wordSet.has(word) && canBreak(end)) {
    memo.set(start, true);
    return true;
   }
  }

  memo.set(start, false);
  return false;
 }

 return canBreak(0);
}

// "leetcode" avec dict ["leet", "code"] => true
// "applepenapple" avec dict ["apple", "pen"] => true
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])); // false
```

Quand le backtracking a une mémoïsation complète sur tous les sous-problèmes, il devient de la DP. La frontière est floue : backtracking avec memo = DP top-down.

---

## EXERCICES

## EXO 1 : LES CLÉS DE FOX RIVER
_~15 min_


Michael Scofield a besoin de toutes les combinaisons possibles de 3 chiffres parmi `[1, 2, 3, 4, 5]` pour tester les serrures. Les chiffres ne se répètent pas dans une combinaison. Ordre compte (123 ≠ 321).

Implémenter `generateCombinations(digits, k)`. Retourner toutes les combinaisons de longueur `k` sans répétition.

(c'est les permutations partielles : `n! / (n-k)!` résultats attendus)

---

## EXO 2 : LA FORMATION D'ATTAQUE DE L'ESCOUADE
_~20 min_


Sasuke doit former une équipe de 3 ninjas parmi 6 disponibles. Peu importe l'ordre (Naruto+Sakura+Kakashi = Kakashi+Naruto+Sakura). Générer toutes les formations possibles.

```js
const ninjas = ["Naruto", "Sasuke", "Sakura", "Kakashi", "Rock Lee", "Neji"];
```

Implémenter `formSquads(ninjas, size)`. Retourner tous les sous-ensembles de taille `size`. Résultat attendu : `C(6,3) = 20` formations.

---

## EXO 3 : TITAN WALLS N-QUEENS VARIANT
_~20 min_


L'humanité doit placer N tours de défense sur une grille N×N. Contrainte : deux tours ne peuvent pas partager la même ligne, colonne, ou diagonale (mêmes règles que les reines aux échecs).

Implémenter `placeTowers(n)`. Retourner le nombre de configurations valides. Vérifier : `n=1 => 1`, `n=4 => 2`, `n=8 => 92`.

Ajouter un compteur du nombre de branches pruned vs total de branches explorées. Afficher le ratio.

---

## EXO 4 : COMBINATION SUM SANS RÉUTILISATION
_~25 min_


Variante de `combinationSum` : chaque candidat ne peut être utilisé **qu'une seule fois**. Le tableau peut contenir des doublons : les solutions dupliquées sont interdites.

```js
const candidates = [10, 1, 2, 7, 6, 1, 5];
const target = 8;
// solutions attendues : [[1,1,6], [1,2,5], [1,7], [2,6]]
```

Implémenter `combinationSum2(candidates, target)`. Pas de solution en doublon dans le résultat.

(indice : trier d'abord. Sauter `candidates[i] === candidates[i-1]` quand `i > start`)

---

## RÉSUMÉ

Backtracking, c'est trois opérations dans un ordre fixe : choisir, explorer, défaire. L'arbre de décision est l'outil mental central : chaque noeud est un état, chaque branche est un choix. La complexité brute est exponentielle, mais le pruning peut la ramener à quelque chose de gérable en coupant les branches stériles avant d'aller au bout. Le bug le plus courant : pousser une référence dans le résultat plutôt qu'une copie. Quand les mêmes états apparaissent plusieurs fois, mémoïser transforme le backtracking en DP top-down.
