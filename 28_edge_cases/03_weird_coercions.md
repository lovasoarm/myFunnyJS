---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LES COERCIONS QUI FONT RIRE ET QUI FONT MAL
Temps de lecture ~11 min

JS ne plante pas quand tu mélanges des types incompatibles.
Il décide tout seul de les convertir.
Parfois ça donne un résultat logique. Souvent non.
C'est le genre de comportement qui te fait passer 3 heures à debugger une condition qui "devrait fonctionner".

---

## 1) LA RÈGLE DE BASE : COERCITION IMPLICITE VS EXPLICITE

**Coercition explicite** (conversion délibérée) :

```js
Number("42"); // 42 - tu choisis de convertir
String(true); // "true" - tu décides
Boolean(0); // false - intentionnel
```

**Coercition implicite** (JS décide à ta place) :

```js
"5" + 3; // "53" - JS transforme 3 en string
"5" - 3; // 2  - JS transforme "5" en number
true + true; // 2  - JS transforme les booléens en numbers
```

La règle de JS :

- `+` avec une string → tout devient string (concaténation gagne)
- `-`, `*`, `/` → tout devient number
- comparaison avec `==` → coercition selon des règles internes obscures

> Goku vs Vegeta : quand deux types différents se rencontrent avec `+`, c'est pas le plus fort qui gagne, c'est la string. Toujours la string.

---

## 2) [] + {} ET {} + [] : LES DEUX PLUS CÉLÈBRES

```js
[] + {}; // "[object Object]"
{
}
+[]; // 0
```

Pourquoi deux résultats complètement différents pour ce qui semble être la même opération ?

**Cas 1 : `[] + {}`**

```js
// [] est converti en string → ""
// {} est converti en string → "[object Object]"
// "" + "[object Object]" → "[object Object]"
console.log([] + {}); // "[object Object]"
```

**Cas 2 : `{} + []`**

```js
// Ici {} au début d'une ligne = bloc vide, pas un objet
// JS lit ça comme : bloc vide ; +[] (opérateur unaire +)
// +[] convertit [] en number → 0
// Résultat : 0
console.log({} + []); // 0
// Mais dans une expression, {} redevient un objet :
console.log({} + []); // "[object Object]"
```

Le diagramme :

```
{} au début de ligne --> bloc vide (ignoré)
{} dans une expression --> objet littéral

[] converti en string --> ""
[] converti en number --> 0
{} converti en string --> "[object Object]"
```

> C'est comme Piccolo : selon le contexte où tu le places, c'est pas la même entité du tout.

---

## 3) LES COERCIONS AVEC L'OPÉRATEUR ==

`==` applique des règles de conversion avant de comparer. `===` compare directement sans conversion.

```js
0 == false; // true - false converti en 0
0 == ""; // true - "" converti en 0
"" == false; // true - "" → 0, false → 0, donc 0 == 0
null == undefined; // true - cas spécial dans la spec JS
null == 0; // false - null ne se compare qu'à undefined avec ==
NaN == NaN; // false - NaN n'est jamais égal à lui-même
```

L'algorithme de `==` en simplifié :

```
Si les deux types sont identiques → comparaison directe
Si null et undefined → true
Si number et string → string converti en number
Si boolean → boolean converti en number
Si object et primitive → object converti via valueOf() ou toString()
```

```js
// Piège classique en prod
const input = ""; // input vide d'un formulaire
if (input == false) {
 // true : et là tu penses avoir catché le cas "pas d'input"
 console.log("aucune valeur");
}
// Mais input == 0 aussi...
// Et "" == 0 aussi...
// Donc ta condition attrape des choses que tu voulais pas attraper

// Fix : toujours === en prod
if (input === "") {
 console.log("input vide : exactement ça et rien d'autre");
}
```

---

## 4) ADDITION DE TYPES MIXTES : LA TABLE DES HORREURS

```js
true + true     // 2   : booleans → numbers
true + false     // 1
false + false    // 0
true + "1"      // "true1" : + string = concaténation
[] + []       // ""   : deux arrays vides → deux strings vides → concat
[] + {}       // "[object Object]"
{} + []       // 0 (en statement) ou "[object Object]" (en expression)
null + 1       // 1   : null → 0
undefined + 1    // NaN  : undefined → NaN
undefined + "x"   // "undefinedx" : string gagne encore
"" + null      // "null"
"" + undefined    // "undefined"
"" + false      // "false"
"" + 0        // "0"
```

Règle mentale à garder :

```
string + anything --> string toujours
number + boolean  --> number (boolean → 0 ou 1)
number + null   --> number (null → 0)
number + undefined --> NaN
```

---

## 5) COERCIONS EN CONDITION : LES VALEURS FALSY

En condition (`if`, `&&`, `||`), JS convertit tout en boolean.

Les 7 valeurs **falsy** (qui deviennent `false`) :

```js
false;
0 - 0;
0n; // BigInt zéro
(""); // string vide
null;
undefined;
NaN;
```

Tout le reste est **truthy** : y compris des choses surprenantes :

```js
if ([])  // true : un tableau vide est truthy
if ({})  // true : un objet vide est truthy
if ("0")  // true : la string "0" est truthy
if ("false") // true : la string "false" est truthy
```

```js
// Piège en prod : vérifier si un array est "rempli"
const scores = [];

if (scores) {
 console.log("il y a des scores"); // s'exécute - [] est truthy
}

// Fix : vérifier la longueur
if (scores.length > 0) {
 console.log("il y a des scores"); // s'exécute seulement si non vide
}
```

---

## 6) L'OPÉRATEUR || ET && : PAS QUE DES BOOLÉENS

`||` et `&&` ne retournent pas `true` ou `false`. Ils retournent une des valeurs originales.

```js
// || retourne le premier opérande truthy, ou le dernier si tous falsy
"Naruto" || "Sasuke"; // "Naruto" : truthy trouvé en premier
0 || "Sasuke"; // "Sasuke" : 0 est falsy, donc on continue
0 || null; // null   : les deux falsy, retourne le dernier
null || undefined; // undefined

// && retourne le premier opérande falsy, ou le dernier si tous truthy
"Naruto" && "Sasuke"; // "Sasuke" : tous truthy, retourne le dernier
0 && "Sasuke"; // 0    : falsy trouvé, retour immédiat
"Naruto" && 0; // 0
```

```js
// Usage courant : valeur par défaut
const chakra = player.chakra || 100; // si chakra est 0 ou undefined, on prend 100

// PIÈGE : 0 est une vraie valeur ici, mais || traite 0 comme falsy
const chakra = 0;
const displayChakra = chakra || 100; // 100:MAUVAIS, 0 est une valeur valide

// Fix : opérateur ?? (nullish coalescing : fusion de nullité)
const displayChakra = chakra ?? 100; // 0 : correct, ?? ignore seulement null et undefined
```

---

## 7) CONVERSION IMPLICITE DANS LES TEMPLATES

```js
const niveau = null;
const message = `Niveau : ${niveau}`; // "Niveau : null"
// null est converti en string dans les templates

const score = undefined;
const affichage = `Score : ${score}`; // "Score : undefined"
```

Pas de crash. Juste une conversion silencieuse qui produit quelque chose que tu voulais probablement pas afficher.

---

## CAS QUI CASSENT

```js
// 1. Comparaison entre 0 et chaîne vide
"" == 0; // true : les deux valent 0 après conversion
"" ===
 0 + // false : types différents, pas de conversion
  // 2. Array converti en number
  [] + // 0
  [1] + // 1
  [1, 2]; // NaN : plusieurs éléments → string "1,2" → NaN

// 3. Additions avec null et undefined dans un calcul
function total(a, b) {
 return a + b;
}
total(5, undefined); // NaN : undefined casse tout ce qu'il touche avec les maths
total(5, null); // 5  : null = 0, donc ça passe

// 4. La string "0" qui n'est pas falsy
const input = "0";
if (input) console.log("truthy"); // s'exécute : "0" est truthy
if (+input) console.log("truthy"); // ne s'exécute PAS : +input = 0 = falsy
```

---

## EXERCICES

**EXO 1 : l'arbitre des coercions**
Naruto et Sasuke débattent du résultat de 15 expressions JS impliquant `==`, `+`, `||`, `&&`. Avant d'exécuter quoi que ce soit, prédis le résultat et le type de chaque expression. Vérifie ensuite avec la console. Documente les 3 surprises qui t'ont le plus déconcerté et explique pourquoi JS se comporte comme ça.

**EXO 2 : le bug du dashboard football**
Un dashboard affiche les stats d'un joueur. La fonction `displayStat(val)` reçoit parfois `0`, parfois `null`, parfois `undefined`, parfois une vraie valeur. Avec `||`, le dashboard affiche "N/A" même quand un joueur a vraiment marqué 0 but. Réécris la logique avec `??` et `===` pour que chaque cas soit traité correctement et que 0 but s'affiche comme 0 but.

**EXO 3 : le validateur de formulaire de Prison Break**
Michael Scofield soumet un formulaire d'évasion. Les champs sont récupérés depuis le DOM : ce sont toujours des strings. L'étage est `"0"`, le secteur est `""`, le code est `"false"`. Écris une fonction de validation qui ne se fait pas piéger par la coercition : chaque champ doit être vérifié pour sa vraie valeur sémantique, pas juste sa truthy/falsy nature.

**EXO 4 : le débogueur de Breaking Bad**
Walter White a une fonction de calcul de profits qui plante silencieusement : elle retourne `NaN` au lieu d'un nombre. La fonction reçoit des inputs qui peuvent être `null`, `undefined`, des strings numériques, ou des vrais numbers. Sans modifier les inputs, écris une version défensive de la fonction qui convertit proprement chaque valeur et ne retourne jamais `NaN` sans l'avoir signalé explicitement.

---

## RÉSUMÉ

La coercition implicite de JS est un système de règles qui fonctionne toujours, mais que la plupart des devs ne connaissent pas assez pour anticiper. Le résultat : des bugs silencieux dans les conditions, des additions qui produisent des strings au lieu de numbers, et des comparaisons qui passent quand elles ne devraient pas. La réponse n'est pas de tout éviter : c'est de comprendre les règles pour utiliser `===` quand il faut, `??` à la place de `||` quand 0 est une valeur valide, et convertir explicitement quand le type d'un input est incertain.
