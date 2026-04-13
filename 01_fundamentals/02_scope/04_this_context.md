# THIS : Le Mot-Clé Qui Ment Selon Le Contexte

> `this` ne pointe pas toujours sur ce que tu crois. Il change de personnalité selon comment et où tu l'appelles. Bienvenue dans le chaos contrôlé.

---

## 1. La règle de base

`this` = **l'objet qui a appelé la fonction**.

Pas l'objet où la fonction est écrite. L'objet qui **l'appelle**.

---

## 2. Les quatre visages de `this`

### Cas 1 : Méthode d'objet : `this` = l'objet

```js
const user = {
  name: "Prometheus",
  greet() {
    console.log("Hello", this.name);
  }
};

user.greet(); // "Hello Prometheus" : this = user
```

---

### Cas 2 : Fonction standalone : `this` = undefined (ou window)

```js
function alone() {
  console.log(this);
}

alone(); // undefined en mode strict / window en navigateur
```

Personne n'a appelé la fonction via un objet. `this` ne sait pas où il est.

---

### Cas 3 : Arrow function -> `this` hérité de l'extérieur

```js
const user = {
  name: "Prometheus",
  greet: () => {
    console.log(this.name); // undefined
  }
};

user.greet();
```

L'arrow function ne crée pas son propre `this`. Elle hérite du contexte où elle a été **écrite** —> ici le global, pas `user`.

```js
// La bonne version :
const user = {
  name: "Prometheus",
  greet() {                          // fonction normale
    const show = () => {
      console.log(this.name);        // this hérité de greet → user
    };
    show();
  }
};

user.greet(); // "Prometheus"
```

---

### Cas 4 : `this` dans un callback -> piège classique

```js
const timer = {
  name: "Bombe",
  start() {
    setTimeout(function () {
      console.log(this.name); // undefined : this perdu dans le callback
    }, 100);
  }
};

timer.start();
```

Le `setTimeout` appelle la fonction tout seul : sans objet. `this` est perdu.

**Fix avec arrow function :**

```js
const timer = {
  name: "Bombe",
  start() {
    setTimeout(() => {
      console.log(this.name); // "Bombe" : arrow hérite de start()
    }, 100);
  }
};

timer.start(); // "Bombe"
```

---

## 3. Tableau récap

| Contexte | `this` vaut |
| -------- | ----------- |
| Méthode d'objet `obj.fn()` | `obj` |
| Fonction standalone `fn()` | `undefined` (strict) / `window` |
| Arrow function | `this` du scope parent |
| Callback classique | `undefined` ou `window` |
| `new Fn()` | le nouvel objet créé |

---

## 4. Les environnements

| Environnement | `this` global vaut |
| ------------- | ------------------ |
| Navigateur | `window` |
| Node.js | `{}` (module) ou `global` |
| Mode strict `"use strict"` | `undefined` |

---

## MISSION : Qui Est `this` ?

### Instructions

Lis chaque bloc. **Sans lancer le code**, dis ce que `this` vaut et ce qui s'affiche.

```js
// Bloc A
const hero = {
  name: "Shadow",
  attack() {
    console.log(this.name);
  }
};
hero.attack();

// Bloc B
const fn = hero.attack;
fn(); 

// Bloc C
const hero2 = {
  name: "Blaze",
  attack: () => {
    console.log(this.name);
  }
};
hero2.attack();

// Bloc D
const hero3 = {
  name: "Frost",
  attack() {
    setTimeout(() => {
      console.log(this.name);
    }, 100);
  }
};
hero3.attack();
```

### Résultat attendu

```
Bloc A → "Shadow"     // this = hero, méthode appelée via objet
Bloc B → undefined    // this perdu : fn appelée sans objet (Elle ne se souvient plus qu’elle venait de hero)
Bloc C → undefined    // arrow function hérite du global, pas de hero2
Bloc D → "Frost"      // arrow dans setTimeout hérite de attack() → this = hero3 (Ici, la flèche est définie à l’intérieur de attack(), et attack() a été appelée sur hero3, donc le this dans attack() c’est hero3.)
```

> Le piège du **Bloc B** est le plus classique en prod. Tu extrais une méthode de son objet, tu l'appelles seule —> `this` disparaît. Retiens ça.

---

> Prochain niveau : `bind`, `call`, `apply` —> les trois façons de forcer `this` à être ce que tu veux.
