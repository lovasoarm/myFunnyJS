# Variables & Références : La Vie Secrète de tes Données

> JS ne t'apprend pas juste à coder. Il t'apprend à comprendre ce qui se passe **vraiment** en mémoire.

---

## 1. Deux types, deux comportements

### Primitives — `number`, `string`, `boolean`, `null`, `undefined`

Tu copies la **valeur directement**. Chaque variable vit de façon indépendante.

```js
let a = 42;
let b = a;
b = 100;

console.log(a); // 42 : pas touché
console.log(b); // 100
```

Modifier `b` ne change pas `a`. Ils ont chacun leur propre valeur.

---

### Objets : `array`, `object`, `function`

Tu ne copies pas la maison. Tu copies **la clé**.

```js
let house = { color: "red" };
let copy = house;
copy.color = "blue";

console.log(house.color); // "blue" —> surprise
```

`house` et `copy` pointent sur la **même maison**. Modifier via l'une, l'autre le voit aussi.

---

## 2. Le schéma mental à retenir

```
Primitive  →  Variable stocke la valeur directement
Object     →  Variable stocke une adresse → l'objet est ailleurs en mémoire
```

> **La variable = la clé. L'objet = la maison.**
> Deux clés peuvent ouvrir la même porte.

---

## 3. Résumé

| Type      | Ce que la variable stocke | Modifier l'un affecte l'autre ? |
| --------- | ------------------------- | ------------------------------- |
| Primitif  | La valeur directement     |               Nope              |
| Objet     | Une référence (adresse)   |                ok               |

---

> La suite ? On va voir ce chaos en action. Bienvenue dans `02_reference_chaos.md`.
