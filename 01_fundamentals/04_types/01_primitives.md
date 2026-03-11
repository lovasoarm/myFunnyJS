# PRIMITIVES : LES TYPES FONDAMENTAUX EN JS

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
7. `symbol`

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

Les primitives ne se modifient pas directement. JS t'ignore en silence — pas d'erreur, pas d'effet, juste du néant.

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

## PRIMITIVE VS OBJET

**Primitif — copié par valeur** (valeur copiée directement) :

```javascript
let a = 10;
let b = a;

b = 20;

console.log(a); // 10
```

`b` reçoit une copie indépendante. Modifier `b` ne touche pas `a`.

**Objet — copié par référence** (adresse mémoire partagée) :

```javascript
let obj1 = { hp: 100 };
let obj2 = obj1;

obj2.hp = 50;

console.log(obj1.hp); // 50
```

`obj2` reçoit l'adresse de `obj1`. Deux noms, une seule boîte en mémoire.

---

## POURQUOI C'EST CRUCIAL ?

- Comprendre les comparaisons (`==` vs `===`)
- Comprendre la **coercion** (conversion automatique de type)
- Comprendre les bugs liés aux références
- Base pour maîtriser la mémoire en JS

---

# MISSION PRIMITIVES

1. Crée une variable `score = 50`
2. Copie-la dans `bestScore`
3. Change `bestScore` à `100`
4. Vérifie si `score` change

Ensuite :

5. Crée un objet `player = { hp: 100 }`
6. Copie-le dans `clone`
7. Modifie `clone.hp`
8. Observe la différence

```javascript
// Ton code ici
```

> Primitive = copie réelle. Objet = copie référence. La mémoire décide tout.
