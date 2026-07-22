---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# BIG O : LE COÛT DE CHAQUE DÉCISION
Temps de lecture ~10 min

Deux fonctions qui font la même chose. L'une tourne en 2ms sur 1000 éléments. L'autre tourne en 14 minutes sur 1 million. Même résultat. Coût radicalement différent.

Big O, c'est le langage qui décrit ce coût. Pas en millisecondes, les millisecondes dépendent de la machine. En **croissance** : comment le temps d'exécution augmente quand la taille des données augmente. C'est ça qui compte en prod, sur de vraies données, à vraie échelle.

---

## 1) L'IDÉE CENTRALE : LA CROISSANCE, PAS LA VITESSE

```
100 éléments  → 0.1ms
1 000 éléments → 1ms
10 000 éléments → 10ms
```

Si la durée est multipliée par 10 quand les données sont multipliées par 10 : c'est **O(n)**.

Si la durée est multipliée par 100 quand les données sont multipliées par 10 : c'est **O(n²)**.

Si la durée ne change pas quand les données augmentent : c'est **O(1)**.

Big O ignore les constantes et les termes mineurs. On cherche la forme de la courbe, pas la valeur exacte.

```
O(3n + 500) → simplifié en O(n)
O(n² + n)  → simplifié en O(n²)
O(2)    → simplifié en O(1)
```

---

## 2) O(1) : TEMPS CONSTANT

L'opération prend le même temps, quelle que soit la taille des données.

```js
// Accès à un élément d'un tableau par index
function getPlayer(roster, index) {
 return roster[index]; // O(1) : index direct, pas de parcours
}

// Accès à une propriété d'objet (hash map)
function getKillers(stats, type) {
 return stats[type]; // O(1) : lookup en hash table
}

// push sur un tableau (amortized O(1))
const events = [];
events.push({ type: "goal", player: "Mbappe" }); // O(1)
```

```
Données : 10   → 1 opération
Données : 1 000 → 1 opération
Données : 1 000 000 → 1 opération

Courbe : ────────────── (plate)
```

---

## 3) O(n) : TEMPS LINÉAIRE

L'opération grandit proportionnellement à la taille des données.

```js
// Chercher un ninja par son nom dans un tableau
function findNinja(ninjas, name) {
 for (const ninja of ninjas) {
  // on parcourt tous les éléments dans le pire cas
  if (ninja.name === name) return ninja;
 }
 return null;
}
// Si 100 ninjas : max 100 vérifications
// Si 100 000 ninjas : max 100 000 vérifications
```

```js
// Calculer la somme de toutes les stats
function totalPower(ninjas) {
 return ninjas.reduce((sum, n) => sum + n.power, 0); // touche chaque élément une fois
}
```

```
Données : 10   → 10 opérations max
Données : 1 000 → 1 000 opérations max
Données : 1 000 000 → 1 000 000 opérations max

Courbe :    /
       /
       /
      /  (droite)
```

---

## 4) O(n²) : TEMPS QUADRATIQUE

L'opération utilise une boucle dans une boucle. Chaque élément est comparé à tous les autres.

```js
// Trouver tous les duos de ninjas avec la même somme de stats
function findMatchingPairs(ninjas) {
 const pairs = [];

 for (let i = 0; i < ninjas.length; i++) {
  // n
  for (let j = i + 1; j < ninjas.length; j++) {
   // n
   if (ninjas[i].power + ninjas[j].power === 100) {
    pairs.push([ninjas[i], ninjas[j]]);
   }
  }
 }

 return pairs;
}
// 100 ninjas  → ~5 000 vérifications
// 1 000 ninjas → ~500 000 vérifications
// 10 000 ninjas → ~50 000 000 vérifications ← ça commence à piquer
```

```js
// Bubble sort : l'exemple classique de O(n²)
function bubbleSort(arr) {
 for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length - i - 1; j++) {
   if (arr[j] > arr[j + 1]) {
    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
   }
  }
 }
 return arr;
}
```

```
Données : 10   → ~100 opérations
Données : 1 000 → ~1 000 000 opérations
Données : 1 000 000 → ~1 000 000 000 000 opérations

Courbe :      /
         /
        /
      /
    /  (exponentielle : fuit vers le haut)
```

---

## 5) O(log n) : TEMPS LOGARITHMIQUE

À chaque étape, on élimine la moitié des possibilités. Très efficace sur de grandes données.

```js
// Recherche binaire sur un tableau trié
function binarySearch(arr, target) {
 let left = 0;
 let right = arr.length - 1;

 while (left <= right) {
  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target)
   left = mid + 1; // éliminer la moitié gauche
  else right = mid - 1; // éliminer la moitié droite
 }

 return -1;
}
// 1 000 000 éléments → max 20 vérifications (log₂(1 000 000) ≈ 20)
```

```
Données : 10     → ~3 opérations
Données : 1 000   → ~10 opérations
Données : 1 000 000 → ~20 opérations
Données : 1 000 000 000 → ~30 opérations

Courbe :
       ___________
      /
     /
    /  (aplatie très vite)
```

---

## 6) O(n log n) : LE MEILLEUR SORT POSSIBLE

Les meilleurs algorithmes de tri (merge sort, quick sort) ont cette complexité. C'est aussi ce que fait `Array.sort()` en JS.

```js
// Trier les buteurs par nombre de buts
const scorers = [
 { name: "Mbappe", goals: 28 },
 { name: "Haaland", goals: 35 },
 { name: "Benzema", goals: 20 },
];

scorers.sort((a, b) => b.goals - a.goals); // O(n log n)
// Optimal pour le tri général. Impossible de faire mieux sur un tableau non trié.
```

```
Comparaison sur 1 000 000 éléments :

O(n²)   → 1 000 000 000 000 opérations
O(n log n) → 20 000 000 opérations
O(n)    → 1 000 000 opérations
O(log n)  → 20 opérations
O(1)    → 1 opération
```

---

## 7) RÈGLES PRATIQUES POUR LIRE LE BIG O D'UN CODE

```
1 boucle sur n éléments       → O(n)
2 boucles imbriquées sur n éléments → O(n²)
3 boucles imbriquées sur n éléments → O(n³)
Diviser par 2 à chaque étape     → O(log n)
Boucle + diviser par 2        → O(n log n)
Opération directe sans boucle    → O(1)
Récursion qui divise par 2      → O(log n)
Récursion qui génère 2 appels    → O(2ⁿ) ← explosion totale
```

Exemple de lecture rapide :

```js
function mystery(arr) {
 const result = {}; // O(1)

 for (const item of arr) {
  // O(n) : boucle unique
  if (!result[item]) {
   // O(1) : accès hash
   result[item] = 0; // O(1)
  }
  result[item]++; // O(1)
 }

 return result; // O(1)
}
// Complexité totale : O(n)
// La boucle domine. Tout ce qui est à l'intérieur est O(1).
```

```js
function suspicious(arr) {
 for (let i = 0; i < arr.length; i++) {
  // O(n)
  for (let j = 0; j < arr.length; j++) {
   // O(n) : imbriqué
   if (arr[i] === arr[j] && i !== j) {
    console.log(`doublon : ${arr[i]}`);
   }
  }
 }
}
// Complexité totale : O(n²)
// Peut être réécrit en O(n) avec un Set ou une Map
```

---

## EXERCICES

### EXO 1 : CLASSIFIER

Pour chaque fonction, donner sa complexité et justifier.

```js
// Fonction A
function sumFirst(arr) {
 return arr[0] + arr[1];
}

// Fonction B
function hasDuplicate(arr) {
 const seen = new Set();
 for (const item of arr) {
  if (seen.has(item)) return true;
  seen.add(item);
 }
 return false;
}

// Fonction C
function pairSum(arr, target) {
 for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length; j++) {
   if (arr[i] + arr[j] === target) return [i, j];
  }
 }
 return null;
}

// Fonction D
function logPowers(n) {
 let i = 1;
 while (i < n) {
  console.log(i);
  i *= 2; // ← indice clé
 }
}

// Fonction E
function processAll(arr) {
 const sorted = [...arr].sort(); // ← quelle complexité pour sort ?
 for (const item of sorted) {
  console.log(item);
 }
}
```

---

### EXO 2 : OPTIMISER LE SCOUT

Walter White a besoin de vérifier si deux listes de distributeurs ont des éléments en commun. La version actuelle est O(n²). Ta mission : la réécrire en O(n).

```js
// Version O(n²) : à optimiser
function hasCommonDistributor(listA, listB) {
 for (const a of listA) {
  for (const b of listB) {
   if (a.id === b.id) return true;
  }
 }
 return false;
}
```

_(Indice : quelle structure de données offre un lookup en O(1) ?)_

---

### EXO 3 : COMPTER LES OPÉRATIONS

Pour ce code, compter le nombre exact d'opérations en fonction de `n`, puis simplifier en notation Big O.

```js
function analyzeSquad(ninjas) {
 let total = 0; // 1 opération

 for (let i = 0; i < ninjas.length; i++) {
  // n itérations
  total += ninjas[i].power; // 1 opération par itération
 }

 for (let i = 0; i < ninjas.length; i++) {
  // n itérations
  for (let j = 0; j < 10; j++) {
   // TOUJOURS 10:pas n
   total += ninjas[i].stats[j] || 0; // 1 opération
  }
 }

 return total; // 1 opération
}
```

**Question bonus :** la deuxième boucle double est `n × 10`. Est-ce O(n²) ou O(n) ? Pourquoi ?

---

## RÉSUMÉ

Big O mesure comment un algorithme se comporte quand les données grossissent, pas à quelle vitesse il tourne sur ta machine. O(1) est constant, O(n) linéaire, O(n²) quadratique. Une boucle unique sur n éléments donne O(n). Deux boucles imbriquées donnent O(n²). Diviser par 2 à chaque étape donne O(log n). Les constantes et termes mineurs disparaissent : seule la forme de la croissance compte. Reconnaître le Big O d'un code en le lisant, sans le tester, c'est l'une des compétences qui distinguent un dev senior.
