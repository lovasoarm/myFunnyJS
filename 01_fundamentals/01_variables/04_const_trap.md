---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# THE CONST TRAP : CONST NE VEUT PAS DIRE IMMUABLE
Temps de lecture ~6 min

> Tu crois que `const` protège ton objet. Il protège juste la clé, pas la maison.

---

## 1) CE QUE CONST FAIT VRAIMENT

`const` bloque la **réassignation** de la variable. Pas la modification du contenu.

```js
const team = [{ name: "Zombie1", hp: 100 }];

team[0].hp = 0;   // autorisé : on modifie le contenu
team.push({ name: "Zombie2", hp: 80 });  // autorisé : on modifie le tableau
team = [];     // TypeError (erreur de type : opération incompatible avec le type de donnée) : on réassigne la variable
```

---

## 2) LE SCHÉMA MENTAL

```
const team --> [ adresse mémoire ]
        |
        v
     [ { name, hp }, ... ] <-- ce contenu, tu peux le modifier
```

`const` dit : **cette variable pointera toujours vers la même adresse**.
Il ne dit pas : **le contenu à cette adresse ne changera pas**.

---

## 3) COMPARAISON LET VS CONST AVEC OBJETS

```js
let arr1 = [1, 2, 3];
arr1 = [4, 5, 6];   // let autorise la réassignation

const arr2 = [1, 2, 3];
arr2 = [4, 5, 6];   // TypeError
arr2.push(4);     // le contenu reste modifiable : tu vas à l'adresse 0x1A et tu modifies ce qu'il y a dedans. const s'en fout complètement, il surveille juste la variable, pas le contenu.
```

---

## 4) POUR VRAIMENT FREEZER UN OBJET

Si tu veux qu'un objet soit **vraiment immuable**, utilise `Object.freeze (gel d'objet : méthode empêchant toute modification de ses propriétés directes)` :

```js
const config = Object.freeze({ env: "production", debug: false });
config.debug = true;    // ignoré silencieusement
config.newProp = "oops";  // ignoré aussi
console.log(config.debug); // false : rien n'a changé
```

> Attention : `Object.freeze` est shallow. Les objets imbriqués restent mutables.

#### `Object.freeze` : "Il Gèle Pas Tout, Menteur"

Tu crois avoir tout freezé. T'as juste mis une vitre sur la surface.
```js
const config = Object.freeze({
 env: "production",
 database: { host: "localhost", port: 5432 }
});

config.env = "dev";      // mur de glace : ignoré
config.database.port = 9999; // passe à travers : objet imbriqué vivant
```

#### Ce que freeze voit vraiment :

```
config
 |-- env   --> "production"  <-- gelé, intouchable
 |-- database --> [ adresse ]  <-- l'adresse est gelée... pas ce qu'elle pointe
```

Il protège la **clé**, pas la **maison derrière la clé**. Même arnaque que le shallow copy.

> Pour un vrai deep freeze, il faudrait appeler `Object.freeze` récursivement sur chaque niveau. JS te laisse faire ça toi-même. Sympa de sa part.
---

## MISSION : Trouve le Bug

### Objectif
Identifier quelle ligne plante et pourquoi.

### Instructions

Lis ce code. Sans l'exécuter, dis quelle ligne va lancer une erreur et explique pourquoi.

```js
const heroes = [
 { name: "Shadow", hp: 200 },
 { name: "Blaze", hp: 150 },
];

heroes[0].hp -= 50;    // ligne A
heroes.push({ name: "Frost", hp: 180 }); // ligne B
heroes = [];        // ligne C
heroes[1].hp = 0;     // ligne D
```

### Réponse attendue

```
Ligne A --> autorisé : on modifie le contenu d'un objet
Ligne B --> autorisé : on modifie le tableau (pas la variable)
Ligne C --> TypeError : Assignment to constant variable
      const bloque la réassignation, pas la mutation
Ligne D --> ne s'exécute jamais : le crash vient avant (jamais atteinte : le crash a déjà tué l'exécution. Tout ce qui vient après le mur n'existe plus.)
```

---

## Résumé

| Action            | `const` | `let` |
| ----------------------------- | ------- | ----- |
| Réassigner la variable    | non   | ok  |
| Modifier le contenu      | ok   | ok  |
| Freezer le contenu      | non   | non  |
| Freezer avec `Object.freeze` | ok   | ok  |

> `const` = la clé est soudée à ta main. Mais la maison, tu peux toujours la repeindre.

---

## RÉSUMÉ

`const` interdit la réassignation de la variable : tu ne peux pas pointer vers un autre objet. Mais il n'empêche pas de modifier le contenu de l'objet déjà pointé.

Si tu veux un objet vraiment immuable : `Object.freeze()`. Et `freeze` ne gèle que le premier niveau, donc les objets imbriqués restent mutables.

La règle : `const` = référence verrouillée. Pas objet immuable.
