---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 01c : Stack vs Heap : où vit ta valeur ?
Temps de lecture ~5 min

Deux quartiers en mémoire. Le stack, c'est la voie rapide (petit, ordonné, LIFO). Le heap, c'est l'entrepôt (grand, lent, GC-managé). Savoir qui vit où = comprendre pourquoi ton code se comporte bizarrement.

## Règle simple

- **Primitives** (`number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) → stack. Copiées par valeur.
- **Objets** (objects, arrays, functions) → heap. Le stack contient juste une **référence** (une adresse).

## Schéma

```
STACK           HEAP
+-----------+      +-------------------+
| a: 42   |      |          |
| b: 42   |      |  { x: 10 } <----+---+
| obj: ref -+---------->|          |  |
| obj2: ref +-----------+ - - - - - - - - - +---+
+-----------+      +-------------------+
```

`obj` et `obj2` pointent sur le même objet → modifier via `obj.x = 99` change ce que voit `obj2`.

## Piège de débutant

```js
const a = { hp: 100 }
const b = a
b.hp = 0
console.log(a.hp) // 0
```

Tu n'as pas copié. Tu as fait un raccourci vers le même sac.

## Ce que l'analogie cache

Le "stack" JS n'est pas exactement le call stack CPU : le moteur (V8) optimise, inline, met parfois des objets sur le stack via *escape analysis*. Le modèle mental reste valable pour raisonner.

## Mission

Écris un `clone()` qui copie vraiment un objet simple à un niveau. Puis explique pourquoi il casse sur un objet imbriqué.
