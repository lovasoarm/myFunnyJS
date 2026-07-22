---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ARITHMÉTIQUE FLOTTANTE : POURQUOI 0.1 + 0.2 N'EST PAS 0.3
Temps de lecture ~10 min

```javascript
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
```

Ce n'est pas un bug JS. C'est le comportement d'IEEE 754 (standard international pour l'arithmétique flottante en virgule flottante binaire), adopté par Python, Java, C, Rust, et JS. Tous les langages modernes ont ce comportement.

Ce que JS fait de particulier : il n'a qu'un seul type numérique. Pas d'entier, pas de float, pas de double. Tout est `number`, et tous les `number` sont des flottants 64 bits IEEE 754. Ce qui amplifie les surprises par rapport aux langages qui ont des entiers séparés.

---

## 1) POURQUOI ÇA ARRIVE : L'EXPLICATION SANS FORMULE

Les nombres décimaux comme `0.1` ne s'écrivent pas exactement en binaire.
C'est comme essayer d'écrire `1/3` en décimal : `0.333333...` ne finit jamais.

```
0.1 en binaire : 0.0001100110011001100110011... (répétition infinie)

Un ordinateur stocke un nombre fini de bits (64 bits pour un double IEEE 754).
Il coupe la répétition à 52 bits significatifs.
Le résultat stocké est une approximation, pas la valeur exacte.

Quand tu additionnes deux approximations : tu obtiens une approximation.
Cette approximation n'est pas toujours celle que tu attends.
```

```javascript
// la valeur stockée n'est pas exactement 0.1
console.log(0.1.toPrecision(20)); // "0.10000000000000000555"
console.log(0.2.toPrecision(20)); // "0.20000000000000001110"
// addition des deux approximations :
console.log((0.1 + 0.2).toPrecision(20)); // "0.30000000000000004441"
```

---

## 2) QUAND ÇA POSE UN PROBLÈME RÉEL

**Calculs financiers :**

```javascript
// système de tribut : Walter White vend 0.1 kg à 100€/kg trois fois
const price = 0.1 * 100; // prix unitaire
const total = price + price + price;
console.log(total); // 30.000000000000004 -- pas 30
console.log(total === 30); // false

// si le système compare avec === 30 pour valider le tribut : ça casse
```

**Systèmes de scoring :**

```javascript
// classement Ballon d'Or : somme de votes pondérés
const weights = [0.3, 0.3, 0.4]; // doit sommer à 1.0
const sum = weights.reduce((a, b) => a + b, 0);
console.log(sum); // 0.9999999999999999 -- pas 1.0
console.log(sum === 1.0); // false

// validation du formulaire de vote : "les poids doivent sommer à 100%"
// avec === : toujours invalide même si c'est correct
```

**Boucles avec flottants :**

```javascript
// PIÈGE : boucle dont la condition dépend d'une comparaison flottante
for (let i = 0; i !== 1; i += 0.1) {
 console.log(i);
 // ne s'arrête jamais correctement : i passe par 0.9999999999999999
 // puis dépasse 1.0 sans jamais être exactement 1.0
 // boucle infinie
}
```

---

## 3) LES SOLUTIONS

### Solution 1 : epsilon pour les comparaisons

```javascript
// ne jamais comparer des flottants avec ===
// utiliser une tolérance (epsilon) à la place

const EPSILON = Number.EPSILON; // 2.220446049250313e-16 : la plus petite différence représentable

function floatEqual(a, b, epsilon = Number.EPSILON) {
 return Math.abs(a - b) < epsilon;
}

console.log(floatEqual(0.1 + 0.2, 0.3)); // true

// pour des cas financiers où la précision à 2 décimales suffit :
function floatEqualCents(a, b) {
 return Math.abs(a - b) < 0.000001; // tolérance plus large, adapté aux euros
}
```

### Solution 2 : travailler en entiers

```javascript
// stratégie : multiplier pour travailler en entiers, diviser pour afficher

// MAUVAIS : flottants partout
const price = 19.99;
const tax = 0.20;
const total = price * (1 + tax); // 23.987999999999996

// BON : travailler en centimes (entiers)
const priceInCents = 1999;   // 19.99€ en centimes
const taxRate = 20;       // 20% en entier
const totalInCents = Math.round(priceInCents * (1 + taxRate / 100));
const total = totalInCents / 100; // 23.99€ propre
```

### Solution 3 : toFixed pour l'affichage

```javascript
// toFixed() pour afficher, pas pour calculer
const score = 0.1 + 0.2;
console.log(score.toFixed(2)); // "0.30" -- string, pas number
console.log(parseFloat(score.toFixed(2))); // 0.3 -- back to number

// attention : toFixed est pour l'affichage, pas pour la logique
// faire tous les calculs d'abord, convertir à la fin
```

### Solution 4 : BigInt pour les très grands entiers

```javascript
// BigInt pour les entiers qui dépassent Number.MAX_SAFE_INTEGER
const big = 9007199254740993n; // le n indique BigInt
const normal = 9007199254740993;

console.log(big);  // 9007199254740993n -- exact
console.log(normal); // 9007199254740992 -- perd un bit, représentation incorrecte

// BigInt ne fonctionne pas pour les décimaux : uniquement pour les très grands entiers
// pour les calculs financiers avec décimales : bibliothèques comme decimal.js
```

---

## 4) LES LIMITES DE NUMBER

```javascript
// valeurs limites importantes
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991 (2^53 - 1)
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991

// au-delà de MAX_SAFE_INTEGER : les entiers ne sont plus représentés exactement
console.log(Number.MAX_SAFE_INTEGER + 1); // 9007199254740992 -- ok
console.log(Number.MAX_SAFE_INTEGER + 2); // 9007199254740992 -- MÊME résultat, perte de précision

// Number.isSafeInteger pour vérifier
console.log(Number.isSafeInteger(9007199254740991)); // true
console.log(Number.isSafeInteger(9007199254740992)); // true (pair, représentable exactement)
console.log(Number.isSafeInteger(9007199254740993)); // false -- risque de perte de précision

// Infinity : résultat d'un dépassement
console.log(1 / 0);       // Infinity
console.log(-1 / 0);       // -Infinity
console.log(Infinity + 1);    // Infinity
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isFinite(NaN));   // false -- NaN n'est pas fini non plus
```

---

## 5) TABLEAU DE RÉFÉRENCE : LES SURPRISES CLASSIQUES

```javascript
// surprises de l'arithmétique flottante en JS

console.log(0.1 + 0.2);     // 0.30000000000000004
console.log(0.3 - 0.1);     // 0.19999999999999998
console.log(1.005.toFixed(2));  // "1.00" -- pas "1.01" : erreur d'arrondi
console.log(0.1 * 0.2);     // 0.020000000000000004
console.log(1 / 3 * 3);     // 1 -- ok dans ce cas précis
console.log(0.1 / 0.3 * 3);   // 0.9999999999999999

// les entiers < 2^53 sont exacts
console.log(0.1 + 0.9);     // 1 -- exact
console.log(1 + 2);       // 3 -- exact
console.log(1000000 + 0.1);   // 1000000.1 -- exact
```

---


## 6) CAS QUI CASSE (mais fun)

```javascript
// La comparaison qui échoue en silence
const price = 0.1 + 0.2       // 0.30000000000000004
if (price === 0.3) {
 console.log("transaction OK")
}
// Ne s'affiche jamais.
// Si c'est un système de tribut : le bug passe en prod, personne ne comprend pourquoi les transactions "échouent"

// Le fix :
Math.abs(price - 0.3) < Number.EPSILON // true
```

```javascript
// toFixed qui ment
(1.005).toFixed(2) // --> "1.00" pas "1.01"
// 1.005 n'est pas représentable exactement en IEEE 754
// il vaut 1.00499999... en binaire, donc toFixed arrondit à 1.00

// en prod : un affichage de prix qui arrondit mal sur certaines valeurs
// le fix : travailler en centimes (entiers), convertir uniquement pour l'affichage
```

```javascript
// Le bug des grandes boucles
let total = 0
for (let i = 0; i < 1_000_000; i++) {
 total += 0.1
}
// Expected : 100000
// Got   : 100000.00000133288...
// L'erreur s'accumule à chaque addition

// En stats, en jeux, en simulations : cette dérive est réelle
// Fix : Kahan summation algorithm, ou travailler en entiers
```

---

## EXERCICES

**EXO 1 : le système de tribut de la prison**

Michael Scofield doit payer des gardiens. Le système calcule :

```javascript
function calculateBribes(guards) {
 // guards : [{ name: string, amount: number }]
 const total = guards.reduce((sum, g) => sum + g.amount, 0);
 if (total === 15.0) {
  return "budget exact : évasion autorisée";
 }
 return `budget inexact : ${total}€ au lieu de 15€`;
}

const guards = [
 { name: "Brad", amount: 4.50 },
 { name: "Chad", amount: 5.25 },
 { name: "Wade", amount: 5.25 },
];

console.log(calculateBribes(guards)); // que retourne ça, et pourquoi ?
```

1. Explique ce qui se passe
2. Corrige la comparaison pour qu'elle fonctionne correctement
3. Modifie le système pour travailler en centimes

---

**EXO 2 : le compteur de chakra**

```javascript
// compte le chakra dépensé par Naruto en incréments de 0.1
let chakraSpent = 0;
const increment = 0.1;
const target = 1.0;

while (chakraSpent !== target) {
 chakraSpent += increment;
 console.log(chakraSpent);
}
console.log("cible atteinte");
```

Ce code a un bug critique. Identifie-le, explique pourquoi il se produit, et propose deux corrections différentes (l'une utilisant epsilon, l'autre changeant la structure de la boucle).

---

**EXO 3 : le classement flottant**

Le système Ballon d'Or calcule une moyenne pondérée pour chaque joueur :

```javascript
function weightedAverage(scores, weights) {
 // scores : [number], weights : [number] (doivent sommer à 1)
 const weightSum = weights.reduce((a, b) => a + b, 0);
 if (weightSum !== 1) {
  throw new Error(`les poids ne somment pas à 1 : ${weightSum}`);
 }
 return scores.reduce((total, score, i) => total + score * weights[i], 0);
}

const scores = [9, 8, 7];
const weights = [0.5, 0.3, 0.2]; // somme théorique : 1.0

console.log(weightedAverage(scores, weights)); // lance une erreur ?
```

1. Que se passe-t-il exactement ?
2. Corrige la validation des poids
3. Vérifie aussi que la moyenne finale est arrondie à 2 décimales pour l'affichage

---

## RÉSUMÉ

`0.1 + 0.2 !== 0.3` n'est pas un bug JS : c'est IEEE 754, présent dans tous les langages modernes.
JS a un seul type numérique (flottant 64 bits) : ce qui amplifie les surprises par rapport aux langages avec des entiers séparés.
Pour comparer des flottants : utiliser une tolérance epsilon, jamais `===`.
Pour les calculs financiers : travailler en entiers (centimes), diviser uniquement pour l'affichage.
`toFixed()` c'est pour l'affichage, pas pour la logique : ça retourne une string, et ça a ses propres erreurs d'arrondi.
`Number.MAX_SAFE_INTEGER` : au-delà de `2^53 - 1`, les entiers perdent leur précision. Utiliser BigInt pour les très grands entiers.

---

## Ou l'analogie casse (floating point)

Garde-fou epistemologique : l'analogie seduisante est utile a l'entree, dangereuse a la sortie.
Ce tableau liste les endroits **precis** ou l'analogie courante trompe.

| Analogie courante | Ou elle casse |
|-------------------|---------------|
| "`0.1 + 0.2 === 0.3`" | Faux : IEEE-754 binaire ne represente pas 0.1 exactement. Utilise `Number.EPSILON`, un decimal library, ou des entiers (centimes). |
| "Argent = number" | Non : monetaire = **entier en plus petite unite** (centimes) ou `BigInt`/`Decimal`. |
| "Number.MAX_SAFE_INTEGER est enorme" | 2^53 - 1, atteint plus vite qu on ne croit (timestamps ns, ids). |

Regle : si tu ne peux pas nommer *une* case ou ton analogie casse, tu ne l'as
pas encore comprise ; tu l'as juste memorisee.
