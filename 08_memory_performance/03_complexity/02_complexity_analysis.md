---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ANALYSER UN ALGORITHME LIGNE PAR LIGNE
Temps de lecture ~10 min

Donner le Big O d'un algorithme complet sans formule magique. Juste une lecture attentive du code, ligne par ligne, et une règle simple pour combiner les complexités.

C'est ce que font les devs seniors quand ils reviewent une PR. Pas besoin de calculer. Juste de voir.

---

## 1) LA RÈGLE DE COMBINAISON

Quand tu lis un algorithme complet, tu rencontres des blocs en séquence et des blocs imbriqués.

**Blocs en séquence** (l'un après l'autre) → on garde le plus grand.

```
O(n) puis O(n²) puis O(1)
→ O(n + n² + 1)
→ simplifié en O(n²)
```

**Blocs imbriqués** (l'un dans l'autre) → on multiplie.

```
O(n) à l'intérieur d'un O(n)
→ O(n × n)
→ O(n²)
```

**Constantes et termes mineurs** → supprimés.

```
O(3n² + 2n + 100)
→ O(n²)
```

---

## 2) EXERCICE DE LECTURE : L'ALGORITHME DE WALTER

Walter White analyse sa supply chain. Voici l'algorithme complet. On le lit bloc par bloc.

```js
function analyzeChain(routes, blacklist, threshold) {
 // Bloc A : construire un Set depuis blacklist
 const blocked = new Set(blacklist); // O(m):m = taille blacklist

 // Bloc B : filtrer les routes valides
 const valid = routes.filter((r) => !blocked.has(r.id)); // O(n):n = taille routes

 // Bloc C : calculer le score de chaque route
 const scored = valid.map((route) => ({
  // O(n)
  ...route,
  score: route.distance * route.risk,
 }));

 // Bloc D : trier par score
 const sorted = scored.sort((a, b) => a.score - b.score); // O(n log n)

 // Bloc E : trouver les paires de routes qui se complètent
 const pairs = [];
 for (let i = 0; i < sorted.length; i++) {
  // O(n)
  for (let j = i + 1; j < sorted.length; j++) {
   // O(n)
   if (sorted[i].score + sorted[j].score < threshold) {
    pairs.push([sorted[i], sorted[j]]);
   }
  }
 }

 return pairs;
}
```

Lecture bloc par bloc :

```
Bloc A : O(m)    : construire le Set
Bloc B : O(n)    : filter avec lookup O(1) dans le Set
Bloc C : O(n)    : map transforme chaque élément une fois
Bloc D : O(n log n) : sort
Bloc E : O(n²)    : double boucle imbriquée

Combinaison (séquence) :
O(m + n + n + n log n + n²)
→ O(m + n²)

Si m << n (petite blacklist) → O(n²)
```

**L'algo est dominé par le Bloc E.** Le sort O(n log n) est écrasé par la double boucle.

---

## 3) LIRE LES APPELS DE FONCTIONS

Un appel de fonction cache sa complexité. Il faut regarder ce qu'il fait.

```js
function processTeam(team) {
 team.sort(...)       // O(n log n) : caché derrière .sort()
 team.forEach(p => {    // O(n)
  if (team.includes(p)) { // includes = O(n) → O(n) dans une boucle O(n) = O(n²) !
   console.log(p)
  }
 })
}
```

`includes` est O(n). Utilisé dans un `forEach` O(n), ça donne O(n²) total.

```js
// Réécrit en O(n)
function processTeam(team) {
 const teamSet = new Set(team)  // O(n) une fois

 team.sort(...)         // O(n log n)
 team.forEach(p => {       // O(n)
  if (teamSet.has(p)) {     // O(1) : lookup Set
   console.log(p)
  }
 })
}
// Complexité totale : O(n log n) - dominé par le sort
```

Méthodes JS et leur complexité réelle :

```
arr.indexOf(x)    → O(n) : parcours linéaire
arr.includes(x)   → O(n) : idem
arr.find(fn)     → O(n)
arr.filter(fn)    → O(n)
arr.map(fn)     → O(n)
arr.sort()      → O(n log n)
arr[i]        → O(1) : accès direct
obj[key]       → O(1) : hash lookup
set.has(x)      → O(1)
map.get(x)      → O(1)
```

---

## 4) LIRE LA RÉCURSION

La récursion demande une étape supplémentaire : comprendre l'arbre des appels.

### Récursion linéaire : O(n)

```js
// Calculer la somme de tous les chakras dans une chaîne de ninjas
function sumChain(ninja) {
 if (!ninja) return 0;
 return ninja.chakra + sumChain(ninja.next); // 1 appel récursif
}
```

```
sumChain(ninja1)
 → sumChain(ninja2)
  → sumChain(ninja3)
   → sumChain(null) → 0

n appels en chaîne → O(n)
```

---

### Récursion binaire : O(2ⁿ)

```js
// Fibonacci naïf : le classique à éviter
function fib(n) {
 if (n <= 1) return n;
 return fib(n - 1) + fib(n - 2); // 2 appels récursifs
}
```

```
fib(5)
├── fib(4)
│  ├── fib(3)
│  │  ├── fib(2) ...
│  │  └── fib(1)
│  └── fib(2) ...
└── fib(3)
  ├── fib(2) ...
  └── fib(1)

À chaque niveau : 2× plus d'appels
→ O(2ⁿ) : explose à partir de n=40
```

La même chose mémoïsée :

```js
function fib(n, memo = {}) {
 if (n in memo) return memo[n]; // O(1) si déjà calculé
 if (n <= 1) return n;
 memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
 return memo[n];
}
// Chaque valeur calculée une seule fois → O(n)
```

---

### Diviser pour régner : O(n log n)

```js
// Merge sort
function mergeSort(arr) {
 if (arr.length <= 1) return arr;

 const mid = Math.floor(arr.length / 2);
 const left = mergeSort(arr.slice(0, mid)); // O(log n) niveaux de récursion
 const right = mergeSort(arr.slice(mid));

 return merge(left, right); // O(n) par niveau
}
```

```
Niveau 0 : [1,5,3,2,8,4,7,6]     n éléments à merger
Niveau 1 : [1,5,3,2] [8,4,7,6]    n/2 + n/2 = n
Niveau 2 : [1,5] [3,2] [8,4] [7,6]  n éléments en tout
Niveau 3 : [1] [5] [3] [2] ...    n éléments en tout

log n niveaux × n travail par niveau → O(n log n)
```

---

## 5) L'ANALYSE COMPLÈTE : UN EXEMPLE EN CONDITIONS RÉELLES

Voici un extrait du système de scoring des Ultras. Analyse complète.

```js
function buildMatchReport(events, players, config) {
 // 1. Filtrer les events valides
 const valid = events.filter((e) => e.minute <= 90); // O(e)

 // 2. Grouper par joueur
 const byPlayer = {};
 for (const event of valid) {
  // O(e)
  if (!byPlayer[event.playerId]) {
   byPlayer[event.playerId] = [];
  }
  byPlayer[event.playerId].push(event); // O(1) amortized
 }

 // 3. Calculer les stats de chaque joueur
 const stats = players.map((player) => {
  // O(p)
  const playerEvents = byPlayer[player.id] || []; // O(1)
  return {
   ...player,
   goals: playerEvents.filter((e) => e.type === "goal").length, // O(e/p) moyen
   shots: playerEvents.filter((e) => e.type === "shot").length,
  };
 });

 // 4. Trouver les matchups (chaque joueur vs chaque adversaire)
 const matchups = [];
 for (let i = 0; i < stats.length; i++) {
  // O(p)
  for (let j = 0; j < stats.length; j++) {
   // O(p)
   if (stats[i].team !== stats[j].team) {
    matchups.push({ a: stats[i], b: stats[j] });
   }
  }
 }

 return { stats, matchups };
}
```

Analyse :

```
e = nombre d'events
p = nombre de joueurs

Étape 1 : O(e)
Étape 2 : O(e)
Étape 3 : O(p × e/p) = O(e) : chaque event touché une fois en tout
Étape 4 : O(p²)

Total : O(e + e + e + p²) = O(e + p²)

Si p << e (peu de joueurs, beaucoup d'events) → O(e)
Si p et e sont du même ordre → O(p²) ou O(e²) : à surveiller
```

**Signal d'alerte :** l'étape 4 génère tous les matchups. Pour 22 joueurs, c'est 484 comparaisons. Pour 1000 joueurs (catalogue complet), c'est 1 000 000. À repenser si p est grand.

---

## EXERCICES

### EXO 1 : ANALYSE COMPLÈTE

Donne la complexité temporelle de cet algorithme et identifie le goulot d'étranglement.

```js
function detectCheatersInTournament(scores, knownCheaters) {
 const cheaterSet = new Set(knownCheaters);

 const clean = scores.filter((s) => !cheaterSet.has(s.playerId));

 const ranked = clean.sort((a, b) => b.score - a.score);

 const suspicious = [];
 for (let i = 0; i < ranked.length; i++) {
  for (let j = 0; j < ranked.length; j++) {
   if (i !== j && Math.abs(ranked[i].score - ranked[j].score) < 0.001) {
    suspicious.push([ranked[i].playerId, ranked[j].playerId]);
   }
  }
 }

 return suspicious.slice(0, 10);
}
```

Bonus : propose une réécriture qui descend d'un ordre de complexité sur la partie O(n²).

---

### EXO 2 : RÉCURSION : COMPTER LES APPELS

Pour `fib(6)` non mémoïsé, dessine l'arbre d'appels et compte le nombre total d'appels effectués. Vérifier que le résultat correspond à la formule O(2ⁿ).

---

### EXO 3 : TROUVER LE VRAI COÛT

Ce code prétend être O(n). Prouve qu'il ne l'est pas et donne sa vraie complexité.

```js
function findCommonElements(arr1, arr2) {
 const result = [];

 for (const item of arr1) {
  // O(n)
  if (arr2.includes(item)) {
   // ???
   result.push(item);
  }
 }

 return result;
}
```

Réécris-le en O(n) réel.

---

## RÉSUMÉ

Analyser la complexité d'un algorithme complet se fait bloc par bloc : séquence → garder le plus grand terme, imbrication → multiplier. Les appels de fonction cachent leur complexité : `includes`, `indexOf`, `find` sont O(n), pas O(1). La récursion se lit dans l'arbre des appels : un appel par étape = O(n), deux appels par étape = O(2ⁿ), diviser par deux = O(log n). La mémoïsation transforme un O(2ⁿ) récursif en O(n). Identifier le goulot d'étranglement, c'est trouver le terme qui domine les autres.
