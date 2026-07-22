---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# THIS KEYWORD RULES : THIS SELON LE CALL-SITE
Temps de lecture ~7 min

`this` n'est pas fixé à l'écriture de la fonction. Il est fixé au moment de l'appel, selon comment la fonction est invoquée : c'est le call-site (point d'appel : l'endroit précis dans le code où la fonction est réellement exécutée). C'est la source numéro un des bugs `this` mal compris en JS.

## 1) RÈGLE 1 : APPEL EN MÉTHODE -> `this` = L'OBJET AVANT LE POINT

```js
const ninja = {
 nom: "Naruto",
 presenter() {
  return `Je suis ${this.nom}`;
 }
};

ninja.presenter(); // "Je suis Naruto" : this = ninja, l'objet avant le point
```

`this` vaut l'objet qui se trouve juste avant le point au moment de l'appel. Pas l'objet où la méthode a été définie : l'objet utilisé pour appeler.

## 2) RÈGLE 2 : APPEL EN FONCTION LIBRE -> `this` = UNDEFINED (MODE STRICT) OU GLOBAL

```js
const presenter = ninja.presenter;
presenter(); // TypeError : Cannot read properties of undefined (en mode strict)
```

Dès que tu extrais la méthode de son objet et que tu l'appelles seule, le lien avec `ninja` est perdu. `this` devient `undefined` en mode strict (ou l'objet global en mode non strict, le vieux piège du fichier 02). C'est exactement ce qui se passe quand tu passes une méthode en callback sans précaution :

```js
setTimeout(ninja.presenter, 1000); // même bug : presenter perd son "this"
```

## 3) RÈGLE 3 : LES ARROW FUNCTIONS N'ONT PAS LEUR PROPRE `this`

```js
const ninja2 = {
 nom: "Sasuke",
 presenterDans: function() {
  setTimeout(() => {
   console.log(`Je suis ${this.nom}`); // "Je suis Sasuke"
  }, 1000);
 }
};

ninja2.presenterDans();
```

Une arrow function ne définit jamais son propre `this`. Elle va chercher le `this` du scope (portée : zone du code où une variable est visible) qui l'entoure au moment de l'écriture, pas de l'appel. C'est pour ça que les arrow functions sont devenues l'outil standard pour les callbacks à l'intérieur d'une méthode : elles capturent le bon `this` automatiquement.

```js
const ninja3 = {
 nom: "Sakura",
 presenterCasse: () => {
  console.log(`Je suis ${this.nom}`); // undefined : this vient du scope global ici, pas de ninja3
 }
};

ninja3.presenterCasse(); // "Je suis undefined"
```

Une arrow function définie directement comme méthode d'un objet littéral ne capture jamais l'objet : elle capture le scope englobant à l'endroit où le fichier est écrit. C'est une faute classique chez les devs qui pensent que "arrow function = this auto-réparé partout".

## 4) L'EXEMPLE QUI CASSE : LE CALLBACK DANS UN ÉVÉNEMENT

```js
class Bouton {
 constructor(nom) {
  this.nom = nom;
 }

 onClick() {
  console.log(`${this.nom} cliqué`);
 }
}

const bouton = new Bouton("Activer le Rasengan");

document.querySelector("#btn").addEventListener("click", bouton.onClick);
// au clic réel : "undefined cliqué" ou crash, selon le contexte
```

`addEventListener` appelle `bouton.onClick` comme une fonction libre, pas comme une méthode de `bouton`. La règle 2 s'applique : `this` n'est plus `bouton`. C'est l'un des bugs les plus fréquents en intégration front, et il survient uniquement en prod, jamais visible en lisant le code statiquement.

```
écriture du code : bouton.onClick semble "lié" à bouton
    |
    v
exécution réelle au clic : onClick appelée seule, this perdu
    |
    v
this.nom --> undefined.nom --> crash ou résultat faux
```

## 5) LES TROIS FAÇONS DE RÉPARER

```js
// 1. arrow function dans le constructeur (this figé à la création de l'instance)
class BoutonA {
 constructor(nom) {
  this.nom = nom;
  this.onClick = () => console.log(`${this.nom} cliqué`);
 }
}

// 2. bind explicite (vu en détail au fichier 05)
const handler = bouton.onClick.bind(bouton);

// 3. wrapper arrow function au moment de l'appel
document.querySelector("#btn").addEventListener("click", () => bouton.onClick());
```

## TIPS D'ÉVOLUTION

Avant les arrow functions (ES6, 2015), réparer `this` perdu demandait de stocker `var self = this;` en haut de la méthode, et d'utiliser `self` dans le callback. C'était fonctionnel mais verbeux et facile à oublier. Les arrow functions ont rendu ce problème beaucoup plus rare en pratique, mais elles ne suppriment pas la règle : elles changent juste l'endroit où `this` se résout.

## EXERCICES

EXO 1 : trahison du callback :
Crée une `class Garde` avec un `nom` et une méthode `alerter()` qui logge `this.nom`. Passe `garde.alerter` directement à un `setTimeout`. Constate le bug, puis corrige-le avec une arrow function wrapper.

EXO 2 : le piège de la méthode fléchée :
Écris un objet littéral avec une méthode définie en arrow function qui utilise `this`. Appelle-la et explique en commentaire pourquoi le résultat n'est pas celui qu'un débutant attendrait.

EXO 3 : audit de call-site :
Prends 4 appels de fonctions différents dans un mini-script (appel en méthode, appel en fonction libre, appel via callback, appel via arrow function dans une méthode). Pour chacun, écris en commentaire la valeur de `this` avant d'exécuter, puis vérifie avec `console.log`.

## RÉSUMÉ

`this` se décide au moment de l'appel, pas à l'écriture de la fonction, sauf pour les arrow functions qui capturent le `this` du scope englobant. Extraire une méthode de son objet pour l'appeler seule, ou la passer en callback sans précaution, casse systématiquement `this`. Les arrow functions réparent ce problème dans les callbacks internes à une méthode, mais créent un nouveau piège si elles sont utilisées comme méthode directe d'un objet.
