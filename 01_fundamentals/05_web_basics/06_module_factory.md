---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# SCOPE ISOLÉ : ARRÊTER DE POLLUER LE GLOBAL
Temps de lecture ~9 min

Le problème c'est simple : tu as 5 fichiers `.js` dans ta page. Tout le monde déclare des variables dans le global. `window.data` écrase `window.data`. Deux scripts parlent de `chakra` mais ce ne sont pas les mêmes. Le résultat : un dépôt de déchets toxiques dans `window`. Un bug qui vient de nulle part. Et toi qui te demandes quel script est responsable.

C'est ça, le code web non structuré. La solution tient en deux mots : scope isolé. Pas besoin de framework, pas besoin de build tool. Juste des fonctions et du scope, bien utilisés.

> **Pour aller plus loin :** ce fichier couvre la base (IIFE, scope isolé). La version complète : Factory Pattern, Revealing Module Pattern, organisation à grande échelle, c'est dans `12_design_patterns/01_creational/01_factory_pattern.md`. Tu reviens ici une fois que tu as vu les closures et les fonctions en profondeur, et tout prend son sens.

Vraie utilité : tout projet vanilla JS (sans framework), tout legacy à maintenir, toute extension navigateur, tout script embarqué dans un CMS. Comprendre ça, c'est aussi comprendre POURQUOI les frameworks comme React ou Vue existent.

---

## 1) LE PROBLÈME : LE SCOPE GLOBAL EST UNE POUBELLE

```html
<!-- index.html -->
<script src="ninja.js"></script>
<script src="combat.js"></script>
```

```js
// ninja.js
var data = { name: "Naruto", role: "genin" }; // pollue window.data
var init = function () {
 /* ... */
}; // pollue window.init

// combat.js
var data = { jutsus: [], degats: 0 }; // ECRASE window.data de ninja.js
var init = function () {
 /* ... */
}; // ECRASE window.init de ninja.js
```

Tout ce qui n'est pas encapsulé (enfermé dans une portée) finit dans `window`. C'est la zone partagée entre tous tes scripts. Résultat : collision garantie sur les noms, bugs silencieux, debugging cauchemardesque.

---

## 2) L'IIFE : CRÉER UNE PORTÉE ISOLÉE

L'IIFE (Immediately Invoked Function Expression : fonction qui s'exécute immédiatement) crée un bloc de scope sans polluer le global.

```js
// La structure de base
(function () {
 // tout ce qui est ici est privé : invisible depuis l'extérieur
 var secret = "invisible";
 console.log(secret); // accessible ici
})();

console.log(secret); // ReferenceError : secret n'existe pas dans ce scope
```

Pourquoi les deux paires de parenthèses ? La première `()` crée l'expression de fonction. La deuxième `()` l'exécute immédiatement. Sans les premières parenthèses, JS lit `function` et attend un nom : syntax error.

### Appliqué au problème du scope global

```js
// ninja.js
var NinjaModule = (function () {
 // une seule variable dans window : NinjaModule
 var data = { name: "Naruto" }; // privé : invisible de l'extérieur
 var role = "genin"; // privé

 function getDisplayName() {
  // privé
  return data.name + " (" + role + ")";
 }

 return {
  // seule cette partie est exposée
  getName: function () {
   return data.name;
  },
  getDisplay: getDisplayName,
  setName: function (n) {
   data.name = n;
  },
 };
})();

// combat.js
var CombatModule = (function () {
 // une seule variable dans window : CombatModule
 var jutsus = []; // privé

 return {
  add: function (jutsu) {
   jutsus.push(jutsu);
  },
  getCount: function () {
   return jutsus.length;
  },
 };
})();
```

```
AVANT           APRÈS
window.data   <-- clash window.NinjaModule.getName()
window.data   <-- clash window.CombatModule.add()
window.init   <-- clash
window.init   <-- clash
```

Un seul nom exposé par module. Tout le reste est encapsulé.

---

## 3) UN AVANT-GOÛT DE LA FACTORY : INSTANCES INDÉPENDANTES

L'IIFE crée un singleton (une seule instance). Mais parfois tu veux plusieurs instances indépendantes du même genre d'objet, chacune avec ses propres données privées. C'est le rôle d'une fonction factory.

```js
// Chaque appel retourne un ninja indépendant
function createNinja(name, chakra) {
 // données privées : dans la closure (portée fermée de la fonction)
 let _chakra = chakra;
 let _name = name;

 // méthodes publiques exposées dans l'objet retourné
 return {
  getName() {
   return _name; // accès aux données privées via closure
  },
  useJutsu(jutsuName, cost) {
   if (_chakra < cost) {
    return `${_name} n'a plus assez de chakra`;
   }
   _chakra -= cost; // modification de l'état privé
   return `${_name} utilise ${jutsuName} (chakra restant : ${_chakra})`;
  },
 };
}

const naruto = createNinja("Naruto", 1000);
const sasuke = createNinja("Sasuke", 800);

console.log(naruto.useJutsu("Rasengan", 200)); // Naruto utilise Rasengan (chakra restant : 800)
console.log(sasuke.useJutsu("Chidori", 300)); // Sasuke utilise Chidori (chakra restant : 500)

console.log(naruto._chakra); // undefined : vraiment privé, pas accessible de dehors
```

Chaque ninja est indépendant. Ses données vivent dans la closure de sa fonction. Tu ne peux pas accéder à `_chakra` depuis l'extérieur même en essayant.

Ce réflexe (une fonction qui fabrique des objets avec un état privé isolé) a un nom officiel et une famille entière de variantes : c'est le **Factory Pattern**. Tu le retrouveras en profondeur, avec ses cousins (Revealing Module Pattern, Builder, Singleton), dans `12_design_patterns`.

---

## 4) L'ÉVOLUTION : VERS LES MODULES ES6

L'IIFE a dominé pendant des années pour isoler le scope. ES6 a introduit `import/export` en 2015 et propose une solution native au même problème.

```js
// AVANT (IIFE)
var CombatModule = (function () {
 let jutsus = [];
 return {
  add(jutsu) {
   jutsus.push(jutsu);
  },
 };
})();

// APRÈS (ES Module)
// combat.js
let jutsus = [];
export function add(jutsu) {
 jutsus.push(jutsu);
}

// main.js
import { add } from "./combat.js";
```

Avantages des ES Modules par rapport aux IIFE :

- syntaxe plus lisible
- dépendances explicites (`import` au lieu d'ordre de `<script>`)
- tree shaking (élimination du code mort) possible par les bundlers
- analyse statique (erreur à la compilation si l'import n'existe pas)

Quand tu utilises encore l'IIFE : legacy sans bundler, extensions navigateur, scripts embarqués dans un environnement sans module support, injection dans des pages tiers. Ce n'est pas mort, c'est contexte-dépendant.

---

## EXERCICES

**EXO 1 : La salle de garde de Banshee**

Le shérif Lucas Hood a besoin d'un scope isolé pour gérer une liste de suspects en planque, sans que rien ne fuite dans le global.

```js
var WatchModule = (function () {
 // à compléter
})();

WatchModule.addSuspect("Proctor");
WatchModule.addSuspect("Rabbit");
console.log(WatchModule.getCount()); // 2
// WatchModule._suspects => undefined : vraiment privé
```

Contrainte technique : implémenter avec une IIFE. Le tableau interne des suspects ne doit jamais être accessible directement depuis l'extérieur.

---

**EXO 2 : Le clone qui se souvient**

Crée une fonction `createClone(nom, chakraDepart)` qui fabrique des clones indépendants façon Kage Bunshin. Chaque clone garde son propre niveau de chakra en mémoire (closure), expose `getChakra()` et `consommer(montant)`, et refuse de descendre sous zéro.

```js
const clone1 = createClone("Clone-A", 100);
const clone2 = createClone("Clone-B", 50);

clone1.consommer(30);
console.log(clone1.getChakra()); // 70
console.log(clone2.getChakra()); // 50 (indépendant de clone1)
```

Contrainte technique : aucune variable partagée entre deux clones. Chaque instance doit être totalement indépendante.

---

## RÉSUMÉ

Le scope global c'est une poubelle partagée : tout le monde y jette, tout le monde marche dedans. L'IIFE crée un scope isolé pour chaque module : une seule variable exposée dans `window`, tout le reste encapsulé. Une fonction factory pousse l'idée plus loin : elle fabrique des instances indépendantes avec un état privé vivant dans la closure. Les ES Modules natifs ont remplacé ce pattern dans les projets modernes, mais comprendre l'IIFE et les closures, c'est comprendre POURQUOI les modules existent. La structure continue dans `07_web_grimoire.md`, et le Factory Pattern en entier t'attend dans `12_design_patterns`.
