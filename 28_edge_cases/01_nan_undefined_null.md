---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# NaN, UNDEFINED, NULL : TROIS FAÇONS DIFFÉRENTES DE DIRE "RIEN"
Temps de lecture ~11 min

JS a trois valeurs pour représenter l'absence de quelque chose.
Elles ne sont pas interchangeables. Elles ne se comportent pas pareil. Et les confondre produit exactement le type de bug qu'on met deux heures à comprendre.

Ce fichier démonte chacune, explique les pièges, et te donne les bons patterns pour les gérer.

---

## 1) LES TROIS VALEURS ET CE QU'ELLES SIGNIFIENT VRAIMENT

```javascript
// UNDEFINED : une variable existe mais n'a pas de valeur assignée
let chakra;
console.log(chakra); // undefined
           // la variable existe dans le scope : elle n'a juste pas de valeur

// NULL : une absence intentionnelle, décidée par le développeur
let currentEnemy = null; // "il n'y a pas d'ennemi actuellement"
             // c'est une décision explicite, pas un oubli

// NaN : le résultat d'une opération mathématique invalide
const damage = parseInt("rasengan"); // "rasengan" n'est pas un nombre
console.log(damage); // NaN
           // Not a Number : une valeur numérique qui représente une erreur de calcul
```

```
undefined --> "personne n'a rien mis ici"
null   --> "quelqu'un a décidé qu'il n'y avait rien ici"
NaN    --> "quelqu'un a essayé de calculer quelque chose d'impossible"
```

Naruto sans chakra assigné : `undefined` (oubli du développeur).
Naruto après avoir tout épuisé son chakra : `null` (état décidé intentionnellement).
Naruto divisé par zéro produit : `NaN` (résultat d'un calcul impossible).

---

## 2) typeof : CE QU'IL DIT ET CE QU'IL CACHE

```javascript
console.log(typeof undefined); // "undefined" -- logique
console.log(typeof null);   // "object"  -- BUG historique de JS depuis 1995
                //        jamais corrigé pour ne pas casser le web
console.log(typeof NaN);    // "number"  -- NaN est de type number
                //        même s'il ne représente pas un nombre valide

// conséquence : typeof ne permet pas de détecter null
function processTarget(target) {
 if (typeof target === 'object') {
  // null passe ici aussi
  target.health -= 10; // TypeError: Cannot read properties of null
 }
}
```

Le guard correct pour null :

```javascript
function processTarget(target) {
 if (target !== null && typeof target === 'object') {
  target.health -= 10; // là c'est safe
 }
}

// ou plus concis avec optional chaining (chaînage optionnel)
function processTarget(target) {
 target?.health && (target.health -= 10);
}
```

---

## 3) NaN : LE SEUL QUI N'EST PAS ÉGAL À LUI-MÊME

```javascript
// NaN n'est jamais égal à NaN : c'est la seule valeur JS avec cette propriété
console.log(NaN === NaN); // false
console.log(NaN == NaN); // false

// comment le détecter ?
// MAUVAISE APPROCHE
function isInvalidDamage(dmg) {
 return dmg === NaN; // toujours false, même si dmg est NaN
}

// BONNE APPROCHE : Number.isNaN (ES6)
function isInvalidDamage(dmg) {
 return Number.isNaN(dmg); // true seulement si dmg est exactement NaN
}

// ATTENTION : isNaN() (sans Number.) est différent
console.log(isNaN("rasengan")); // true -- convertit la string en NaN d'abord
console.log(Number.isNaN("rasengan")); // false -- "rasengan" n'est pas NaN, c'est une string
```

```
isNaN()    : convertit d'abord en nombre, puis vérifie
Number.isNaN() : vérifie si la valeur EST exactement NaN, sans conversion

En 2026 : utilise toujours Number.isNaN()
```

**NaN se propage :**

```javascript
// une seule valeur NaN contamine toute une chaîne de calculs
const scores = [8.5, NaN, 9.0, 7.5];
const total = scores.reduce((acc, s) => acc + s, 0);
console.log(total); // NaN -- un seul NaN et tout le calcul est perdu

// se défendre
const safeTotal = scores
 .filter(s => Number.isFinite(s)) // Number.isFinite exclut NaN ET Infinity
 .reduce((acc, s) => acc + s, 0);
console.log(safeTotal); // 25 -- propre
```

---

## 4) LA COERCITION DE NULL ET UNDEFINED

Ils ne se comportent pas pareil dans les opérations :

```javascript
// addition
console.log(null + 1);   // 1   -- null est converti en 0
console.log(undefined + 1); // NaN  -- undefined est converti en NaN

// comparaison avec ==
console.log(null == undefined); // true -- cas spécial de la spec
console.log(null == 0);     // false -- null ne vaut que null ou undefined en ==
console.log(null == false);   // false -- même chose
console.log(undefined == false); // false -- même chose

// piège classique
function getPlayerScore(player) {
 if (player.score == null) { // attrape null ET undefined en même temps
  return 0;
 }
 return player.score;
}
// ici == null est un des rares cas où == est intentionnel et documenté
// c'est le seul pattern "standard" qui utilise == en 2026
```

```
RÈGLE : utilise === partout
EXCEPTION DOCUMENTÉE : == null pour attraper null ET undefined ensemble
```

---

## 5) OPTIONAL CHAINING ET NULLISH COALESCING

ES2020 a ajouté deux opérateurs qui gèrent null et undefined proprement :

```javascript
// AVANT (verbose et fragile)
const ninjaName = ninja && ninja.profile && ninja.profile.name;

// AVEC optional chaining (?.)
const ninjaName = ninja?.profile?.name;
// retourne undefined si ninja, ninja.profile, ou ninja.profile.name est null/undefined
// ne lance pas TypeError

// NULLISH COALESCING (??) : valeur par défaut uniquement pour null/undefined
const chakra = ninja?.chakra ?? 0;
// 0 seulement si ninja.chakra est null ou undefined
// PAS si c'est 0 (contrairement à ||)

// piège avec ||
const chakra = ninja?.chakra || 0;
// retourne 0 si chakra est 0, null, undefined, false, "", NaN
// souvent ce n'est pas ce qu'on veut : un chakra de 0 est une valeur valide
```

```
||  : remplace toute valeur falsy (fausse) : 0, "", false, null, undefined, NaN
??  : remplace uniquement null et undefined
En 2026 : utilise ?? quand tu veux une valeur par défaut pour "absent"
```

---

## 6) LES TROIS ENSEMBLE : TABLEAU DE COMPORTEMENTS

```javascript
// tableau de référence pour ne plus jamais se tromper

//          undefined  null    NaN
// typeof       "undefined" "object"  "number"
// === undefined   true     false   false
// === null      false    true    false
// Number.isNaN()   false    false   true
// == null      true     true    false
// Boolean()     false    false   false
// Number()      NaN     0     NaN
// String()      "undefined" "null"   "NaN"
// + 1        NaN     1     NaN
// ?? "default"    "default"  "default" NaN  <-- NaN passe, c'est une valeur
// || "default"    "default"  "default" "default" <-- NaN est falsy
```

---


## 7) CAS QUI CASSE (mais fun)

```javascript
// Le parseInt silencieux
parseInt("9 chakra units") // --> 9  (pas d'erreur, juste silencieux)
parseInt("chakra 9")    // --> NaN (le premier char n'est pas un chiffre)

// ça entre dans un calcul :
const damage = parseInt(userInput) + 10
// si userInput = "forte attaque" : NaN + 10 --> NaN
// si userInput = "5 coups"    : 5 + 10 --> 15 (surprise)
// le fix : Number(userInput) échoue proprement sur "5 coups" : NaN
```

```javascript
// L'addition avec null qui surprend
null + 1    // --> 1  (null est coercé en 0)
undefined + 1  // --> NaN (undefined est coercé en NaN)
null + "score" // --> "nullscore" (null est coercé en string "null")
undefined + "score" // --> "undefinedscore" (même chose)

// en prod : une propriété manquante sur un objet API + une opération arithmétique
// = résultat silencieusement faux pendant des semaines
```

```javascript
// NaN dans un tableau sort() : l'ordre devient aléatoire
const scores = [8.5, NaN, 7, NaN, 9]
scores.sort((a, b) => a - b)
// [8.5, NaN, 7, NaN, 9] ou [7, 8.5, 9, NaN, NaN] selon l'implémentation
// le comportement est undefined : NaN casse le tri

// Le fix : filtrer les NaN avant de trier
const valid = scores.filter(Number.isFinite)
valid.sort((a, b) => a - b) // --> [7, 8.5, 9]
```

---

## EXERCICES

**EXO 1 : le calculateur de score qui ment**

Le système de vote du Ballon d'Or reçoit des scores depuis une API externe.
Parfois l'API envoie `null` (joueur non noté), `undefined` (champ absent), ou une string vide `""` (erreur de sérialisation).

```javascript
const apiScores = [8.5, null, undefined, "", 9.0, NaN, 7.5];
```

Écris une fonction `computeAverageScore(scores)` qui :
- ignore les valeurs non-numériques (null, undefined, NaN, strings)
- retourne la moyenne des valeurs numériques valides
- retourne `null` si aucune valeur valide (pas `NaN`, pas `0`)
- ne modifie pas le tableau original

(indice : `Number.isFinite` est ton meilleur ami ici)

---

**EXO 2 : le guard de route Walking Dead**

Rick reçoit des rapports de sécurité. Chaque rapport a une structure variable :

```javascript
const reports = [
 { sector: "A", threat: 5 },
 { sector: "B" },        // threat absent
 { sector: "C", threat: null }, // zone évaluée, aucune menace
 { sector: "D", threat: NaN }, // erreur de capteur
 null,              // rapport corrompu
];
```

Écris une fonction `filterDangerousSectors(reports)` qui retourne uniquement les secteurs avec un `threat` supérieur à 3.
Gère correctement les quatre cas : absent, null, NaN, corrompu.
Explique dans les commentaires comment chaque cas est traité et pourquoi.

---

**EXO 3 : le piège qui casse**

Ce code a un bug. Trouve-le, explique ce qui se passe étape par étape, et corrige-le.

```javascript
function applyJutsu(ninja, jutsuName) {
 const jutsu = ninja.jutsus[jutsuName];

 if (jutsu != null) {
  const cost = jutsu.chakraCost;
  if (ninja.chakra - cost > 0) {
   return {
    ...ninja,
    chakra: ninja.chakra - cost,
    lastJutsu: jutsuName,
   };
  }
 }

 return ninja;
}

const naruto = {
 chakra: 100,
 jutsus: {
  rasengan: { chakraCost: 0 }, // jutsu gratuit
 },
};

const result = applyJutsu(naruto, "rasengan");
console.log(result.chakra); // 100 -- pourquoi le chakra n'a pas bougé ?
```

---

## RÉSUMÉ

`undefined` c'est l'absence non intentionnelle, `null` c'est l'absence intentionnelle, `NaN` c'est l'erreur de calcul : trois concepts différents, pas trois synonymes.
`typeof null === 'object'` est un bug historique permanent : vérifier `null` avec `!== null` explicitement.
`NaN !== NaN` : utiliser `Number.isNaN()` pour détecter NaN, jamais `=== NaN`.
`Number.isNaN()` est strict, `isNaN()` fait une conversion d'abord : utiliser le premier.
`??` remplace uniquement null et undefined, `||` remplace toute valeur falsy : choisir selon l'intention.
`== null` est le seul usage intentionnel de `==` en 2026 : il attrape null et undefined ensemble.
