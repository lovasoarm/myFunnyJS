---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# RUNTIME RACE : O(n log n) VS O(n²) SUR 100K ÉLÉMENTS
Temps de lecture ~10 min

Sur 10 éléments, O(n²) et O(n log n) semblent identiques. La différence est invisible. Alors on ne s'en préoccupe pas. Et puis un jour, les données grossissent, et l'app se fige.

Ce fichier, c'est le moment où on sort les chiffres réels. Pas des formules théoriques : des mesures, des courbes, et la différence entre "ça tourne" et "ça tourne encore dans 30 minutes". Sur 100k éléments, la différence entre O(n²) et O(n log n) est souvent celle entre 2 secondes et 3 heures.

---

## 1) LES CHIFFRES D'ABORD

Sur différentes tailles de données, avec les opérations estimées :

```
n     O(n log n)      O(n²)
────────  ──────────────────  ──────────────────────────
100    700 ops       10 000 ops
1 000   10 000 ops      1 000 000 ops
10 000   130 000 ops     100 000 000 ops
100 000  1 700 000 ops    10 000 000 000 ops
1 000 000 20 000 000 ops    1 000 000 000 000 ops
```

À 100 000 éléments : O(n log n) fait ~1,7 million d'opérations.
O(n²) en fait **10 milliards**. C'est 6 000 fois plus.

---

## 2) LE BENCHMARK : METTRE ÇA EN PRATIQUE

```js
// Outil de mesure minimaliste
function bench(label, fn) {
 const start = performance.now();
 const result = fn();
 const end = performance.now();
 console.log(`[${label}] : ${(end - start).toFixed(2)}ms`);
 return result;
}

// Générer un tableau de n éléments aléatoires
function generateData(n) {
 return Array.from({ length: n }, (_, i) => ({
  id: i,
  score: Math.random() * 1000,
 }));
}
```

---

## 3) RACE 1 : TRI : BUBBLE SORT VS ARRAY.SORT

```js
// Bubble sort:O(n²)
function bubbleSort(arr) {
 const a = [...arr]; // on ne mute pas l'original
 for (let i = 0; i < a.length; i++) {
  for (let j = 0; j < a.length - i - 1; j++) {
   if (a[j].score > a[j + 1].score) {
    [a[j], a[j + 1]] = [a[j + 1], a[j]];
   }
  }
 }
 return a;
}

// Array.sort natif:O(n log n) sous le capot (TimSort dans V8)
function nativeSort(arr) {
 return [...arr].sort((a, b) => a.score - b.score);
}

// La course
const sizes = [100, 1_000, 5_000, 10_000];

for (const n of sizes) {
 const data = generateData(n);

 console.log(`\n── n = ${n} ──`);
 bench(`bubble sort O(n²)  `, () => bubbleSort(data));
 bench(`native sort O(n log n)`, () => nativeSort(data));
}
```

Résultats typiques (machine standard, Node 20) :

```
── n = 100 ──
bubble sort O(n²)   : 0.08ms
native sort O(n log n): 0.02ms

── n = 1 000 ──
bubble sort O(n²)   : 6ms
native sort O(n log n): 0.3ms

── n = 5 000 ──
bubble sort O(n²)   : 140ms
native sort O(n log n): 1.2ms

── n = 10 000 ──
bubble sort O(n²)   : 580ms
native sort O(n log n): 2.5ms
```

À 10 000 éléments : bubble sort prend **230 fois plus longtemps**. Et ça empire de façon quadratique après.

---

## 4) RACE 2 : RECHERCHE : O(n) VS O(log n)

```js
// Recherche linéaire:O(n)
function linearSearch(arr, targetId) {
 for (const item of arr) {
  if (item.id === targetId) return item;
 }
 return null;
}

// Recherche binaire:O(log n):nécessite un tableau trié
function binarySearch(arr, targetId) {
 let left = 0;
 let right = arr.length - 1;

 while (left <= right) {
  const mid = Math.floor((left + right) / 2);
  if (arr[mid].id === targetId) return arr[mid];
  if (arr[mid].id < targetId) left = mid + 1;
  else right = mid - 1;
 }

 return null;
}

// Données triées par id (requis pour binary search)
const LARGE = 100_000;
const sortedData = generateData(LARGE).sort((a, b) => a.id - b.id);

// On cherche 1000 cibles différentes pour avoir une mesure représentative
const targets = Array.from({ length: 1000 }, () =>
 Math.floor(Math.random() * LARGE),
);

bench("linear search O(n)  ", () => {
 for (const t of targets) linearSearch(sortedData, t);
});

bench("binary search O(log n)", () => {
 for (const t of targets) binarySearch(sortedData, t);
});
```

Résultats typiques sur 100 000 éléments, 1000 recherches :

```
linear search O(n)   : 85ms  ← parcourt en moyenne 50 000 éléments par recherche
binary search O(log n) : 0.4ms  ← parcourt max 17 éléments par recherche
```

200 fois plus rapide. Pour chercher dans une liste de candidats au Ballon d'Or, c'est anecdotique. Pour un moteur de recherche sur des millions d'entrées, c'est la différence entre utilisable et inutilisable.

---

## 5) RACE 3 : DÉTECTION DE DOUBLONS : O(n²) VS O(n)

```js
// Version naïve:O(n²)
function hasDuplicateNaive(arr) {
 for (let i = 0; i < arr.length; i++) {
  for (let j = i + 1; j < arr.length; j++) {
   if (arr[i].id === arr[j].id) return true;
  }
 }
 return false;
}

// Version avec Set:O(n)
function hasDuplicateSet(arr) {
 const seen = new Set();
 for (const item of arr) {
  if (seen.has(item.id)) return true;
  seen.add(item.id);
 }
 return false;
}

const sizes2 = [1_000, 5_000, 10_000, 50_000];

for (const n of sizes2) {
 // Cas pessimiste : pas de doublon, on parcourt tout
 const data = generateData(n);

 console.log(`\n── n = ${n} ──`);
 if (n <= 10_000) {
  // au-delà bubble sort prend trop de temps pour être intéressant
  bench(`naive O(n²)`, () => hasDuplicateNaive(data));
 }
 bench(`set  O(n) `, () => hasDuplicateSet(data));
}
```

Résultats typiques :

```
── n = 1 000 ──
naive O(n²) : 3ms
set  O(n) : 0.05ms

── n = 5 000 ──
naive O(n²) : 80ms
set  O(n) : 0.2ms

── n = 10 000 ──
naive O(n²) : 310ms
set  O(n) : 0.4ms

── n = 50 000 ──
(naive : estimé > 7 secondes)
set  O(n) : 2ms
```

---

## 6) LA COURBE VISUELLEMENT

```
temps (ms)
│
│                      O(n²)
│                     ╱
│                   ╱
│                  ╱
│                ╱
│               ╱
│            ╱
│         ╱
│      ╱          O(n log n)
│   ╱          ────────────────────
│ ╱       O(n) ─────────────────
│ ────────────────────────────────────  O(log n)
│ ────────────────────────────────────────────── O(1)
└──────────────────────────────────────────────── n
  100  1k  10k  100k  1M
```

Le point de douleur de O(n²) se situe entre 10 000 et 100 000 éléments. En dessous, c'est tolérable. Au-dessus, c'est rédhibitoire.

---

## 7) QUAND EST-CE QUE ÇA COMPTE EN PROD ?

```
Opération           Taille typique  Complexité à viser
──────────────────────────  ───────────────  ──────────────────
Trier une liste de résultats 10-10 000     O(n log n) ou moins
Chercher un utilisateur    1M+        O(log n) ou O(1)
Détecter des doublons     10k-1M      O(n)
Construire un index      1M+        O(n)
Matcher deux ensembles    100k+       O(n) avec Set/Map
Générer toutes les paires   >1 000      Éviter O(n²)
```

La règle empirique : si les données peuvent dépasser 10 000 éléments et que l'opération doit être interactive, O(n²) n'est pas acceptable.

---

## EXERCICES

### EXO 1 : REPRODUIRE LE BENCHMARK

Lancer le code de la Race 1 (bubble sort vs native sort) sur ta machine avec les tailles `[100, 500, 1000, 5000]`. Relever les temps, calculer le ratio O(n²)/O(n log n) à chaque taille. Est-ce que le ratio croît ? De combien entre 1000 et 5000 ?

_(Indice : si l'algo est vraiment O(n²) vs O(n log n), le ratio devrait être proportionnel à `n / log n`)_

---

### EXO 2 : OPTIMISER LE SCANNER DE ROUTES

La supply chain de Walter White a un bug de performance. Cette fonction tourne sur 50 000 routes à chaque requête et met 8 secondes. Analyse la complexité, identifie le problème, propose la version optimisée.

```js
function findComplementaryRoutes(routes, budget) {
 const valid = [];

 for (let i = 0; i < routes.length; i++) {
  for (let j = i + 1; j < routes.length; j++) {
   if (routes[i].cost + routes[j].cost === budget) {
    valid.push([routes[i].id, routes[j].id]);
   }
  }
 }

 return valid;
}
```

**Contrainte supplémentaire :** il peut y avoir plusieurs paires valides. La solution optimisée doit toutes les retouver.

_(Indice : le problème "two sum" a une solution O(n) avec une Map)_

---

### EXO 3 : MESURER ET PROJETER

Tu as mesuré ces temps sur ton système :

```
n = 1 000  → 2ms
n = 2 000  → 8ms
n = 4 000  → 32ms
```

En déduire :

1. La complexité de cet algorithme (O(n), O(n log n), O(n²) ?)
2. Le temps estimé pour n = 10 000
3. Le temps estimé pour n = 100 000

Méthode : si doubler n multiplie le temps par 4 → O(n²). Par 2 → O(n). Par ~2.1 → O(n log n).

---

## RÉSUMÉ

O(n²) et O(n log n) semblent proches sur de petites données. À 10 000 éléments, O(n²) est déjà 200 à 400 fois plus lent. À 100 000, c'est plusieurs milliers de fois. Le benchmark réel confirme ce que la théorie prédit : bubble sort à 10k éléments prend 600ms, native sort prend 2.5ms. Chercher avec `includes` dans une boucle est O(n²) : remplacer par un Set donne O(n). La mesure avec `performance.now()` transforme le Big O en quelque chose de visible et de décidable.
