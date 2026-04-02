# THE CONST TRAP : `const` ne veut pas dire immuable

> Tu crois que `const` protège ton objet. Il protège juste la clé, pas la maison.

---

## 1. Ce que `const` fait vraiment

`const` bloque la **réassignation** de la variable. Pas la modification du contenu.

```js
const team = [{ name: "Zombie1", hp: 100 }];

team[0].hp = 0;     //  autorisé : on modifie le contenu
team.push({...});   //  autorisé : on modifie le tableau
team = [];          //  TypeError : on réassigne la variable
```

---

## 2. Le schéma mental

```
const team ──→ [ adresse mémoire ]
               ↓
          [ { name, hp }, ... ]  ← ce contenu, tu peux le modifier
```

`const` dit : **cette variable pointera toujours vers la même adresse**.
Il ne dit pas : **le contenu à cette adresse ne changera pas**.

---

## 3. Comparaison `let` vs `const` avec objets

```js
let arr1 = [1, 2, 3];
arr1 = [4, 5, 6];     // let autorise la réassignation

const arr2 = [1, 2, 3];
arr2 = [4, 5, 6];     // TypeError
arr2.push(4);         // le contenu reste modifiable
```

---

## 4. Pour vraiment freezer un objet

Si tu veux qu'un objet soit **vraiment immuable**, utilise `Object.freeze` :

```js
const config = Object.freeze({ env: "production", debug: false });
config.debug = true;        // ignoré silencieusement
config.newProp = "oops";    // ignoré aussi
console.log(config.debug);  // false : rien n'a changé
```

> Attention : `Object.freeze` est shallow. Les objets imbriqués restent mutables.

---

## MISSION : Trouve le Bug

### Objectif
Identifier quelle ligne plante et pourquoi.

### Instructions

Lis ce code. Sans l'exécuter, dis quelle ligne va lancer une erreur et explique pourquoi.

```js
const heroes = [
  { name: "Shadow", hp: 200 },
  { name: "Blaze",  hp: 150 },
];

heroes[0].hp -= 50;        // ligne A
heroes.push({ name: "Frost", hp: 180 }); // ligne B
heroes = [];               // ligne C
heroes[1].hp = 0;          // ligne D
```

### Réponse attendue

```
Ligne A → autorisé : on modifie le contenu d'un objet
Ligne B → autorisé : on modifie le tableau (pas la variable)
Ligne C → TypeError : Assignment to constant variable
           const bloque la réassignation, pas la mutation
Ligne D → ne s'exécute jamais : le crash vient avant
```

---

## Résumé

| Action                        | `const` | `let` |
| ----------------------------- | ------- | ----- |
| Réassigner la variable        | non     | ok    |
| Modifier le contenu           | ok      | ok    |
| Freezer le contenu            | non     | non   |
| Freezer avec `Object.freeze`  | ok      | ok    |

> `const` = la clé est soudée à ta main. Mais la maison, tu peux toujours la repeindre.
