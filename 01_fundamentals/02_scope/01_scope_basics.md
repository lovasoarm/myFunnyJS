# SCOPE BASICS : GLOBAL, LOCAL, BLOCK

Bienvenue dans le royaume des portées.

En JS, **la portée** _(scope)_ définit **où une variable existe et peut être vue**.

---

## 1) GLOBAL SCOPE

Une variable globale vit **partout dans ton code**.

```javascript
let globalVar = "Je suis partout";

function printGlobal() {
  console.log(globalVar); // accessible
}

printGlobal();
console.log(globalVar); // accessible aussi
```

> Attention : trop de variables globales = chaos assuré.

---

## 2) LOCAL SCOPE (FUNCTION)

Une variable locale n'existe **que dans la fonction** où elle a été déclarée.

```javascript
function myFunc() {
  let localVar = "Je suis local";
  console.log(localVar); // OK
}

myFunc();
console.log(localVar); // ReferenceError -> introuvable
```

---

## 3) BLOCK SCOPE (`if`, `for`, `while`)

`let` et `const` respectent le **scope du bloc** :

```javascript
if (true) {
  let blockVar = "Je vis ici";
  console.log(blockVar); // OK
}
console.log(blockVar); // ReferenceError -> le bloc est terminé
```

| Mot-clé | Scope                             |
| ------- | --------------------------------- |
| `var`   | function scope : ignore les blocs |
| `let`   | block scope : safe                |
| `const` | block scope : safe                |

> Règle simple : n'utilise jamais `var`. Préfère toujours `let` ou `const`.

---

## 4) POURQUOI C'EST CRUCIAL ?

- Évite de polluer le scope global
- Prévient les bugs où une variable change sans prévenir
- Permet de gérer correctement les closures et l'async
- Base indispensable avant les patterns avancés et l'architecture JS

---

# MISSION SCOPE BASICS

## La Team Scope

1. Crée une variable globale `hero = "Link"`
2. Crée une fonction `adventure()` qui déclare une variable locale `weapon = "Sword"`
3. Dans la fonction, affiche `hero` et `weapon`
4. Hors de la fonction, essaie d'afficher `weapon` → observe l'erreur
5. Crée un `if (true)` et à l'intérieur déclare `let potion = "Health"`
6. Essaie d'afficher `potion` hors du bloc → observe l'erreur

```javascript
let hero = "Link";

function adventure() {
  let weapon = "Sword";
  console.log("Dans la fonction:", hero, weapon);
}

adventure();

// Ton code ici
```

> **Scope = zone de vie de ta variable.**
> C'est la base avant de te lancer dans les closures, le context et l'event loop.
