---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PRIMITIVES : LES TYPES FONDAMENTAUX EN JS
Temps de lecture ~6 min

En JavaScript, il existe 2 grandes catégories de types :

1. Les types primitifs
2. Les types objets

Aujourd'hui on parle des primitifs.

Un type primitif = une valeur simple, **immuable**
(immuable = on ne peut pas modifier la valeur interne)

Quand tu changes une primitive, tu crées une **nouvelle valeur en mémoire**.

---

## LES 7 TYPES PRIMITIFS

Oui. 7. Pas 6.

1. `string`
2. `number`
3. `boolean`
4. `undefined`
5. `null`
6. `bigint`
7. `symbol` (Utilisé rarement dans le code mais partout dans les internals de JS : itérateurs, promesses, etc.)

---

## 1) STRING

```javascript
let name = "Blob";
```

Une string = du texte. Elle est immuable.

```javascript
let text = "Hi";
text[0] = "B"; // ça ne marche pas
```

Les primitives ne se modifient pas directement. JS t'ignore en silence → pas d'erreur, pas d'effet, juste du néant.

---

## 2) NUMBER

```javascript
let hp = 100;
let price = 19.99;
```

En JS il n'existe qu'**un seul type `number`** (pas `int`, pas `float` séparé).

Attention :
- `NaN` = Not a Number
- `Infinity` existe aussi

---

## 3) BOOLEAN

```javascript
let isAlive = true;
```

Seulement `true` ou `false`. Deux options. Pas de "peut-être".

---

## 4) UNDEFINED

```javascript
let x;
console.log(x); // undefined
```

`undefined` = variable déclarée mais sans valeur. JS a créé la boîte, mais personne n'a rien mis dedans.

---

## 5) NULL

```javascript
let y = null;
```

`null` = absence **volontaire** de valeur.

Différence simple :
- `undefined` = JS n'a rien mis
- `null` = toi tu as mis "rien"

> `null` est une décision. `undefined`, c'est JS qui hausse les épaules.

---

## 6) BIGINT

```javascript
let big = 12345678901234567890n;
```

Pour les très grands nombres. Ajoute un `n` à la fin.

---

## 7) SYMBOL

```javascript
let id = Symbol("id");
```

Type unique utilisé pour créer des clés uniques dans les objets. Avancé, mais important en architecture.

---

## PRIMITIVE VS OBJET : LA DIFFÉRENCE CLÉ

Les primitifs sont **copiés par valeur**. Les objets sont **copiés par référence** : deux noms, une seule boîte en mémoire.

```javascript
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 ← indépendant
```

```javascript
let obj1 = { hp: 100 };
let obj2 = obj1;
obj2.hp = 50;
console.log(obj1.hp); // 50 ← même objet en mémoire
```

> Le mécanisme complet des références et copies est dans `01_variables/02_reference_chaos.js`. Si tu n'as pas fait ce fichier, fais-le : c'est là que ça explose vraiment.

---

## POURQUOI C'EST CRUCIAL ?

| Concept | Repose sur les primitifs |
| --- | --- |
| Comparaisons `==` vs `===` | ok |
| Coercion automatique | ok |
| Bugs de référence | ok |
| Mémoire JS | ok |

---

## MISSION PRIMITIVES

1. Crée une variable `score = 50`
2. Copie-la dans `bestScore`
3. Change `bestScore` à `100`
4. Vérifie si `score` change

Ensuite :

5. Crée un objet `player = { hp: 100 }`
6. Copie-le dans `clone`
7. Modifie `clone.hp`
8. Affiche `player` ET `clone` -> observe que les deux ont changé

```javascript
// Ton code ici
```

> Primitive = copie réelle. Objet = copie référence. La mémoire décide tout.

---

## RÉSUMÉ

Les primitives (string, number, boolean, null, undefined, symbol, BigInt) se copient par valeur : chaque variable a sa propre case mémoire.

Les objets et tableaux se passent par référence : plusieurs variables peuvent pointer vers le même espace mémoire. Modifier l'un modifie tous les autres.

`typeof null === 'object'` est un bug historique de JS qui n'a jamais été corrigé pour des raisons de rétrocompatibilité. Tu dois le connaître. Ne jamais tester `null` avec `typeof`.
