---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# INTRO VARIABLES : CE QUI SE PASSE VRAIMENT EN MÉMOIRE

Temps de lecture ~7 min


Tu penses que `let x = 5` c'est juste "mettre 5 dans x". En surface oui. Sous le capot non. Une variable c'est un **binding** (une liaison entre un nom et un emplacement mémoire). Ce concept est le sol de tout le reste. Si tu zappes ça, les bugs de mutation que tu verras en prod te sembleront de la magie noire.

Vraie utilité : comprendre pourquoi un objet "se modifie tout seul" ailleurs dans le code, pourquoi `const` ne verrouille pas ce que tu crois, et pourquoi copier un tableau peut produire un résultat surprenant.

---

## 1) VAR, LET, CONST : TROIS DÉCLARATIONS, TROIS COMPORTEMENTS

### `var` : l'ancêtre qu'on garde en musée

```js
function example() {
 var score = 10;      // score vit dans la fonction entière, pas juste ici

 if (true) {
  var score = 42;     // MÊME variable : pas une nouvelle : écrase l'ancienne
  console.log(score);   // 42
 }

 console.log(score);    // 42 : le if a crasé le score d'en haut
}
```

`var` ignore les blocs `{}`. Sa portée (scope : zone de vie d'une variable), c'est la fonction entière ou le global. Plus de détails dans `02_scope/`.

Risque réel : tu penses déclarer une variable locale dans un `if` ou un `for`, mais tu écrases une variable du scope parent. Aucun message d'erreur. Le bug est silencieux.

### `let` : block-scoped, la version saine

```js
function example() {
 let score = 10;

 if (true) {
  let score = 42;     // NOUVELLE variable, locale au bloc du if
  console.log(score);   // 42
 }

 console.log(score);    // 10 : pas touché, le if avait sa propre copie
}
```

`let` respecte les blocs `{}`. Chaque paire de `{}` crée une zone de vie indépendante.

### `const` : le binding immuable (pas la valeur)

```js
const chakra = 100;
chakra = 200;        // TypeError : Assignment to constant variable
               // le binding lui-même est verrouillé

const ninja = { name: "Kakashi", chakra: 1000 };
ninja.chakra = 500;     // ok : le binding pointe toujours vers le même objet
ninja = { name: "Naruto" }; // TypeError : le binding ne peut pas changer de cible
```

`const` verrouille le lien, pas ce vers quoi il pointe. Un objet déclaré `const` reste entièrement modifiable de l'intérieur. Ce piège est développé dans `04_const_trap.md`.

---

## 2) LA MÉMOIRE : STACK ET HEAP

JS utilise deux zones mémoire différentes selon ce que tu stockes.

```
STACK (pile)           HEAP (tas)
--------------------------    ------------------------------------
Accès rapide, taille limitée   Accès indirect, taille dynamique
Primitives directement      Objets, tableaux, fonctions
Durée de vie = bloc / fonction  Durée de vie gérée par le GC (ramasse-miettes)
```

### Primitives sur le Stack

```js
let a = 42;    // 42 est stocké directement dans a, sur le stack
let b = a;     // b reçoit une COPIE de 42 : deux cases mémoire indépendantes
b = 100;

console.log(a);  // 42 : pas touché
console.log(b);  // 100 : sa propre copie
```

Chaque variable primitive est autonome. Modifier `b` ne touche pas à `a`.

### Objets sur le Heap

```js
let hero = { name: "Kakashi", power: "Sharingan" };
// hero ne contient pas l'objet : il contient une ADRESSE vers l'objet
// l'objet lui-même vit sur le Heap

let alias = hero;
// alias reçoit l'ADRESSE, pas une copie de l'objet
// les deux pointent vers le même endroit en mémoire

alias.power = "Reversed Infinity";

console.log(hero.power);  // "Reversed Infinity" : même objet, même adresse
```

Schéma mémoire :

```
Stack         Heap
-----------      -----------------------------------------
hero --> [ 0x001 ]  --> { name: "Kakashi", power: "Sharingan" }
alias --> [ 0x001 ] -/
```

`hero` et `alias` contiennent la même adresse. Deux clés pour une même maison. Modifier via l'une, l'autre voit le changement.

### Le modèle mental à garder pour la vie

```
Primitive --> la variable stocke la valeur directement
Object   --> la variable stocke une adresse --> l'objet est sur le Heap
```

---

## 3) TYPEOF : LIRE LE TYPE D'UNE VARIABLE

```js
typeof 42      // "number"
typeof "hello"    // "string"
typeof true     // "boolean"
typeof undefined   // "undefined"
typeof null     // "object"  <-- bug historique : null N'EST PAS un objet
typeof {}      // "object"
typeof []      // "object"  <-- les arrays sont des objets en JS
typeof function(){} // "function"
```

`null` retourne `"object"` : c'est un bug de la première implémentation de JS en 1995, jamais corrigé pour ne pas casser la rétrocompatibilité (ancien code existant). Pour tester `null`, tu compares explicitement : `x === null`.

Risque en prod : une fonction qui reçoit `null` et fait `typeof x === "object"` va le traiter comme un objet, planter sur `x.property`, et te donner un `TypeError: Cannot read properties of null`.

---

## 4) LES TROIS NIVEAUX D'EXEMPLES

### Niveau 1 : minimal

```js
// Primitive : copie de valeur
let x = 1;
let y = x;
y = 2;
console.log(x);    // 1 : pas touché
```

### Niveau 2 : réaliste

```js
// Objet : partage de référence
const config = { env: "dev", port: 3000 };
const local = config;  // même adresse, pas une copie
local.env = "prod";
console.log(config.env); // "prod" : la config est compromise
```

### Niveau 3 : celui qui casse en prod

```js
function applyVirus(horde) {
 horde.count = Math.floor(horde.count * 1.5); // mutation directe de l'objet reçu
 return horde;
}

const localHorde = { sectors: ["sector_A", "sector_B"], count: 200 };
const mutated = applyVirus(localHorde);

console.log(localHorde.count);  // 300 : la fonction a muté l'original
console.log(mutated.count);    // 300 : les deux pointent vers le même objet
// résultat : impossible de savoir quelle était la taille de la horde avant la mutation
```

La fonction ne fait pas une copie de la horde : elle reçoit l'adresse et modifie l'objet directement. Le code compile. Le code tourne. Le bug est silencieux jusqu'à ce que le système de détection applique la mutation deux fois de suite et déclenche une fausse alerte de niveau de menace rouge catastrophique.

Ce pattern s'appelle une **mutation non intentionnelle**. C'est le sujet de `03_mutation_madness.md`.

---

## EXERCICES

**EXO 1 : L'inventaire de Rick Grimes**

Le camp Walking Dead a un inventaire central. Hershel copie l'inventaire pour faire son rapport mensuel. Il retire 10 balles pour noter sa consommation. Rick découvre qu'il manque des balles dans l'inventaire officiel alors qu'aucune attaque n'a eu lieu.

```js
const inventory = { bullets: 50, food: 20, medkits: 5 };
const hershelReport = inventory;
hershelReport.bullets -= 10;

console.log(inventory.bullets); // ?
```

Contrainte : explique pourquoi `inventory.bullets` vaut maintenant 40. Corrige le code pour qu'Hershel travaille sur une copie sans affecter l'inventaire officiel. (Indice : spread operator `{ ...inventory }` ou `Object.assign({}, inventory)`)

---

**EXO 2 : Les jutsus de Naruto**

```js
var chakra = 100;        // chakra global

function useJutsu() {
 if (true) {
  var chakra = 50;      // nouvelle variable ou même ?
  console.log(chakra);    // prédit : ?
 }
 console.log(chakra);     // prédit : ?
}

useJutsu();
console.log(chakra);      // prédit : ?
```

Contrainte : sans exécuter le code, prédis chaque `console.log` avec `var`. Explique pourquoi. Réécris ensuite avec `let` pour que le comportement soit celui qu'on attendrait : le chakra de l'intérieur du if ne touche pas au chakra global.

---

**EXO 3 : La config de service qui fout tout en l'air**

```js
const defaults = { timeout: 3000, retries: 3, env: "production" };

function createServiceConfig(overrides) {
 defaults.env = overrides.env || defaults.env;     // problème ici
 defaults.timeout = overrides.timeout || defaults.timeout;
 return defaults;
}

const serviceA = createServiceConfig({ env: "staging", timeout: 5000 });
const serviceB = createServiceConfig({ env: "test" });

console.log(serviceA.env);   // ?
console.log(serviceB.env);   // ?
```

Contrainte : identifie pourquoi `serviceA.env` ne vaut plus "staging" à la fin. Corrige `createServiceConfig` pour qu'elle retourne un nouvel objet sans jamais modifier `defaults`. (Indice : `{ ...defaults, ...overrides }`)

---

## RÉSUMÉ

Une variable n'est pas une boîte. C'est un binding : un nom lié à un emplacement mémoire. Les primitives stockent la valeur directement sur le stack. Les objets stockent une adresse vers le Heap. Copier un objet, c'est copier son adresse, pas son contenu. `const` verrouille le binding, pas ce vers quoi il pointe. `var` ignore les blocs et produit des bugs silencieux. Utilise `let` et `const`, comprends ce qu'ils font en mémoire, et les mutations surprises cesseront d'être de la magie noire.

Suite : `02_reference_chaos.md` va pousser ce modèle jusqu'à ce qu'il soit gravé.
