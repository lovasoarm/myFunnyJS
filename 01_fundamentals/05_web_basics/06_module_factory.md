# MODULE FACTORY : ORGANISER SON CODE WEB SANS FRAMEWORK

Le problème c'est simple : tu as 5 fichiers `.js` dans ta page. Tout le monde déclare des variables dans le global. `window.data` écrase `window.data`. Deux scripts parlent de `user` mais ce ne sont pas les mêmes. Le résultat : un dépôt de déchets toxiques dans `window`. Un bug qui vient de nulle part. Et toi qui te demandes quel script est responsable.

C'est ça, le code web non structuré. Le Module Factory Pattern résout ça sans framework, sans build tool, sans rien. Juste des fonctions et du scope.

Vraie utilité : tout projet vanilla JS (sans framework), tout legacy à maintenir, toute extension navigateur, tout script embarqué dans un CMS. Comprendre ça, c'est aussi comprendre POURQUOI les frameworks comme React ou Vue existent.

---

## 1) LE PROBLÈME : LE SCOPE GLOBAL EST UNE POUBELLE

```html
<!-- index.html -->
<script src="user.js"></script>
<script src="cart.js"></script>
<script src="payment.js"></script>
```

```js
// user.js
var data = { name: "Luffy", role: "captain" }; // pollue window.data
var init = function () {
  /* ... */
}; // pollue window.init

// cart.js
var data = { items: [], total: 0 }; // ECRASE window.data de user.js
var init = function () {
  /* ... */
}; // ECRASE window.init de user.js
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
// user.js
var UserModule = (function () {
  // une seule variable dans window : UserModule
  var data = { name: "Luffy" }; // privé : invisible de l'extérieur
  var role = "captain"; // privé

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

// cart.js
var CartModule = (function () {
  // une seule variable dans window : CartModule
  var items = []; // privé

  return {
    add: function (item) {
      items.push(item);
    },
    getCount: function () {
      return items.length;
    },
  };
})();
```

```
AVANT                      APRÈS
window.data     <-- clash  window.UserModule.getName()
window.data     <-- clash  window.CartModule.add()
window.init     <-- clash
window.init     <-- clash
```

Un seul nom exposé par module. Tout le reste est encapsulé.

---

## 3) LE MODULE FACTORY : CRÉER DES INSTANCES

L'IIFE crée un singleton (une seule instance). Le Factory Pattern crée des instances multiples du même module.

```js
// Ninja factory : chaque appel retourne un ninja indépendant
function createNinja(name, chakra) {
  // données privées : dans la closure (portée fermée de la fonction)
  let _health = 100; // convention _ = "privé par convention"
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

    getStats() {
      return { name: _name, health: _health, chakra: _chakra };
    },
  };
}

const naruto = createNinja("Naruto", 1000);
const sasuke = createNinja("Sasuke", 800);

console.log(naruto.useJutsu("Rasengan", 200)); // Naruto utilise Rasengan (chakra restant : 800)
console.log(sasuke.useJutsu("Chidori", 300)); // Sasuke utilise Chidori (chakra restant : 500)

console.log(naruto._chakra); // undefined : vraiment privé, pas accessible de dehors
```

Chaque ninja est indépendant. Ses données vivent dans la closure de sa factory. Tu ne peux pas accéder à `_chakra` depuis l'extérieur même en essayant.

---

## 4) LE REVEALING MODULE PATTERN

Variante courante : toutes les fonctions sont déclarées en privé, et on expose uniquement ce qu'on choisit.

```js
const CartService = (function () {
  // tout est privé par défaut
  let _items = [];
  let _discount = 0;

  function _calculateTotal() {
    // fonction privée
    return _items.reduce((acc, item) => acc + item.price, 0) * (1 - _discount);
  }

  function addItem(item) {
    // sera exposé
    _items.push(item);
  }

  function applyDiscount(percent) {
    // sera exposé
    _discount = percent / 100;
  }

  function getCart() {
    // sera exposé
    return {
      items: [..._items], // copie pour ne pas exposer le tableau original
      total: _calculateTotal(),
    };
  }

  // on révèle seulement ce qu'on décide d'exposer
  return { addItem, applyDiscount, getCart };
})();

CartService.addItem({ name: "hoodie", price: 50 });
CartService.addItem({ name: "tshirt", price: 30 });
CartService.applyDiscount(10);

console.log(CartService.getCart());
// { items: [...], total: 72 }

console.log(CartService._items); // undefined : vraiment privé
console.log(CartService._calculateTotal); // undefined : vraiment privé
```

L'avantage du Revealing Module : tu listes explicitement ce que tu exposes. Lire le `return` suffit pour comprendre l'API publique du module.

---

## 5) NAMESPACE : ORGANISER PLUSIEURS MODULES

Pour un projet plus grand, un namespace (espace de noms) évite les collisions entre modules.

```js
// Déclarer le namespace une seule fois au départ
var MyApp = MyApp || {}; // si MyApp existe déjà, on le garde ; sinon on crée

// Chaque module s'accroche au namespace
MyApp.UserModule = (function () {
  return {
    /* ... */
  };
})();

MyApp.CartModule = (function () {
  return {
    /* ... */
  };
})();

MyApp.PaymentModule = (function () {
  return {
    /* ... */
  };
})();

// usage
MyApp.CartModule.add(item);
MyApp.UserModule.getName();
```

Une seule variable dans `window` : `MyApp`. Tout le reste est structuré en dessous.

---

## 6) L'ÉVOLUTION : VERS LES MODULES ES6

Le Module Factory Pattern a dominé pendant des années. ES6 a introduit `import/export` en 2015 et propose une solution native au même problème.

```js
// AVANT (IIFE / Factory)
var CartModule = (function () {
  let items = [];
  return {
    add(item) {
      items.push(item);
    },
  };
})();

// APRÈS (ES Module)
// cart.js
let items = [];
export function add(item) {
  items.push(item);
}

// main.js
import { add } from "./cart.js";
```

Avantages des ES Modules par rapport aux IIFE :

- syntaxe plus lisible
- dépendances explicites (`import` au lieu d'ordre de `<script>`)
- tree shaking (élimination du code mort) possible par les bundlers
- analyse statique (erreur à la compilation si l'import n'existe pas)

Quand tu utilises encore le Module Factory Pattern : legacy sans bundler, extensions navigateur, scripts embarqués dans un environnement sans module support, injection dans des pages tiers. Ce n'est pas mort, c'est contexte-dépendant.

---

## EXERCICES

**EXO 1 : La salle des opérations de Banshee**

Le shérif Lucas Hood a besoin d'un module `IntelService` pour gérer les informations sensibles sur les criminels de Banshee. Les données ne doivent jamais être exposées directement : tout accès passe par des méthodes contrôlées.

```js
const IntelService = (function () {
  // à compléter
})();

IntelService.addTarget("Proctor");
IntelService.addTarget("Rabbit");
IntelService.flag("Rabbit", "priority");

console.log(IntelService.getTargets()); // les deux targets
console.log(IntelService.getPriority()); // seulement "Rabbit"
// IntelService._targets => undefined : vraiment privé
```

Contrainte technique : implémenter avec le Revealing Module Pattern. Les données `_targets` ne doivent jamais être accessibles directement depuis l'extérieur.

---

**EXO 2 : Le camp de Prison Break**

Michael Scofield a besoin de créer un module factory pour chaque prisonnier. Chaque prisonnier a un profil privé et expose uniquement ce dont il a besoin pour le plan.

```js
function createPrisoner(name, role) {
  // à compléter
}

const michael = createPrisoner("Michael", "architect");
const lincoln = createPrisoner("Lincoln", "muscle");

michael.updatePlan("T-Bag doit rester à l'écart");
console.log(michael.getPlan()); // le plan de Michael
console.log(lincoln.getPlan()); // le plan de Lincoln (indépendant)

// michael._plan => undefined
```

Contrainte technique : chaque instance est complètement indépendante. Les plans ne se partagent pas entre instances.

---

## RÉSUMÉ

Le scope global c'est une poubelle partagée : tout le monde y jette, tout le monde marche dedans. L'IIFE crée un scope isolé pour chaque module. Le Module Factory Pattern crée des instances multiples avec des données vraiment privées via les closures. Le Revealing Module Pattern rend l'API publique lisible au premier regard. Les ES Modules natifs ont remplacé ce pattern dans les projets modernes, mais comprendre les factories et les IIFE, c'est comprendre POURQUOI les modules existent. La structure continue dans `07_web_grimoire.md`.
