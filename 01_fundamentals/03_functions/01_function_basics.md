---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# FUNCTION BASICS : UNE FONCTION EST UN OBJET VIVANT
Temps de lecture ~7 min

Arrête de croire qu'une fonction = juste du code.

En JavaScript, une fonction est un **objet spécial**.

**Objet** = une structure en mémoire qui peut contenir des données et des comportements.

Donc une fonction c'est :

- Du code exécutable
- \+ un objet en mémoire
- \+ une référence (adresse mémoire)
- \+ des propriétés possibles

Oui. Une fonction peut avoir des propriétés. Oui. Elle peut être stockée. Oui. Elle peut être manipulée comme une variable. _(Bref, elle fait ce qu'elle veut : c'est une citoyenne de première classe.)_

C'est pour ça qu'on dit que les fonctions sont des **first-class citizens** : des valeurs traitées comme n'importe quelle autre valeur.

---

## 1) UNE FONCTION EST UNE VALEUR

```javascript
function greet() {
 console.log("Hello");
}
```

Ce que tu crois :

```
greet = du code
```

Ce que JS fait vraiment :

```
greet → référence → objet fonction en mémoire
```

Donc si tu fais :

```javascript
let copy = greet;
copy(); // Hello
```

Tu ne copies pas le code. Tu copies **la référence** (adresse mémoire). `copy` et `greet` pointent vers le **même objet fonction** -> même logique que les objets.

---

## 2) UNE FONCTION PEUT ÊTRE STOCKÉE

```javascript
let actions = [];

actions.push(function () {
 console.log("Attack");
});

actions[0](); // Attack
```

Pourquoi ça marche ? Parce qu'une fonction est une valeur. Comme un nombre. Comme une string. Comme un objet. Elle peut aller partout où une valeur peut aller.

---

## 3) UNE FONCTION PEUT ÊTRE PASSÉE EN ARGUMENT

```javascript
function execute(fn) {
 fn();
}

execute(function () {
 console.log("Boom");
});
```

On passe une fonction à une autre fonction. Ça s'appelle un **callback** : une fonction donnée à une autre pour être exécutée plus tard.

C'est la base de :

- `setTimeout`
- Événements
- Promesses
- React
- Middleware (Code qui se place entre deux choses : généralement entre la requête qui arrive et la réponse qui repart.)

> Si tu comprends les callbacks, tu as déjà déverrouillé 80% du JS asynchrone. _(Les 20% restants ? On y vient.)_

---

## 4) UNE FONCTION PEUT RETOURNER UNE FONCTION

```javascript
function outer() {
 return function () {
  console.log("Inside");
 };
}

let fn = outer();
fn(); // Inside
```

Chaque appel à `outer` crée une **nouvelle fonction** et la retourne. Chaque fonction retournée peut capturer son **environnement lexical** : la zone mémoire qui l'entoure au moment de sa création.

Et là, tu entres dans le monde des closures.

---

## 5) UNE FONCTION PEUT AVOIR DES PROPRIÉTÉS

```javascript
function power() {}

power.level = 9000;

console.log(power.level); // 9000
```

Pourquoi ? Parce qu'une fonction est un objet. Et les objets peuvent avoir des propriétés.

Donc techniquement, ceci :

```javascript
function test() {}
```

est mentalement proche de :

```javascript
let test = new Function(); // version simplifiée
```

> C'est bizarre. C'est JS. Accueille-le.

---

## 6) CE QUI SE PASSE EN MÉMOIRE

Quand tu écris :

```javascript
function attack() {}
```

JS fait trois choses :

1. Crée un **objet fonction** en mémoire (Ce que JS crée en mémoire quand tu déclares une fonction.)
2. Crée une **variable** `attack`
3. Met la **référence** de l'objet dedans

```
attack → adresse → objet fonction
```

Si tu fais ensuite :

```javascript
let a = attack;
```

Tu obtiens :

```
a → même adresse → même objet
```

Ce n'est **pas une copie**. C'est un **pointeur** : une deuxième étiquette sur la même boîte.

---

## 7) POURQUOI C'EST CRUCIAL ?

| Concept         | Repose sur les fonctions-objets |
| ----------------------- | ------------------------------- |
| Callbacks        | ok               |
| Closures        | ok               |
| Hooks React       | ok               |
| Middleware       | ok               |
| Architecture JS moderne | ok               |

Si tu comprends que les fonctions sont des objets, tu comprends pourquoi JS est flexible.
Si tu ne comprends pas ça, tu **subis** le langage.

---

## MISSION FUNCTION BASICS

## La Team Functions

1. Crée une fonction `attack()` qui affiche `"Slash"`
2. Copie-la dans une variable `move`
3. Exécute `move()`
4. Ajoute une propriété `damage = 50` à `attack`
5. Affiche `attack.damage`
6. Crée un tableau `skills` et mets `attack` dedans
7. Exécute la fonction depuis le tableau
8. Copie `attack` dans une autre variable et vérifie si `attack === move`

```javascript
// Ton code ici
```

> Comprends. Ne regarde pas juste le résultat. Réfléchis à la **référence** : deux noms, un seul objet en mémoire.

---

## RÉSUMÉ

Une fonction en JS est un objet de première classe : elle peut être assignée à une variable, passée en argument, retournée depuis une autre fonction, stockée dans un tableau.

Declaration vs expression vs arrow : trois syntaxes, trois comportements différents sur le hoisting (remontée de déclaration) et sur `this`. Les arrows n'ont pas leur propre `this`.

Deux variables qui référencent la même fonction pointent vers le même objet. Copier une référence de fonction ne copie pas la fonction.
