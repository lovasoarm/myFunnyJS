# MODULE FACTORY : LES MODULES JS (IMPORT / EXPORT)

Bienvenue dans un des concepts les plus importants du JavaScript moderne : les **modules**.

Un ingénieur JS ne code jamais tout dans un seul fichier. Sinon ça devient illisible, impossible à maintenir, impossible à scaler. Donc on **découpe le code**.

Chaque fichier devient un **module** : un fichier JS qui expose certaines choses au monde extérieur. Comme une boîte noire. Comme une usine de pièces. Tu exportes ce que tu fabriques, tu importes ce dont tu as besoin.

---

## LE CONCEPT SIMPLE

Imagine un jeu vidéo :

```
weapons.js  → fabrique les armes
player.js   → utilise ces armes
```

Les fichiers communiquent avec `import/export`. Chacun fait une chose. Personne ne se marche dessus.

---

## EXPORTER

**Exporter** = rendre une chose disponible pour d'autres fichiers.

```javascript
// weaponFactory.js

export function makeWeapon(name, damage) {
  return {
    name,
    damage,
    attack() {
      console.log(name + " inflige " + damage + " dégâts");
    },
  };
}
```

---

## IMPORTER

```javascript
// game.js

import { makeWeapon } from "./weaponFactory.js";

let sword = makeWeapon("Sword", 50);
sword.attack();
```

JS charge le module et donne accès à la fonction. Rien d'autre ne fuite.

---

## EXPORT DEFAULT

Un module peut avoir **un export principal** : la chose principale qu'il fabrique.

```javascript
// playerFactory.js

export default function createPlayer(name) {
  return {
    name,
    hp: 100,
    attack() {
      console.log(name + " attaque !");
    },
  };
}
```

```javascript
import createPlayer from "./playerFactory.js"; // pas d'accolades
```

**Différence de syntaxe à l'import :**

| Type d'export               | Syntaxe d'import          | Nom modifiable ?        |
| --------------------------- | ------------------------- | ----------------------- |
| `export function X` (named) | `import { X } from "..."` | non : doit correspondre |
| `export default`            | `import X from "..."`     | oui : tu choisis le nom |

```javascript
import nImporteQuelNom from "./playerFactory.js"; // valide pour un default export
```

---

## MULTIPLE EXPORTS

Un module peut exporter plusieurs choses :

```javascript
// combat.js

export function heal(player) {
  player.hp += 10;
}

export function damage(player) {
  player.hp -= 10;
}
```

```javascript
import { heal, damage } from "./combat.js";
```

---

## IMPORT TOTAL

Tu peux importer tout le module sous un namespace :

```javascript
import * as combat from "./combat.js";

combat.heal(player);
combat.damage(player);
```

Utile quand un module exporte beaucoup de choses et que tu veux les garder regroupées.

---

## MODULE = ISOLATION

Chaque module a son propre **scope** : les variables ne fuient pas vers les autres fichiers.

```javascript
// weapon.js
let secretDamage = 9999;
```

`secretDamage` n'est **pas accessible** dans les autres fichiers. C'est protégé par le module. Ton code interne reste privé, seul ce que tu exportes explicitement est exposé.

---

## POURQUOI LES MODULES EXISTENT

Sans modules, un projet devient un monstre. 5000 lignes dans `index.js` : bonne chance pour retrouver quoi que ce soit à 23h avec un bug en prod.

Les modules permettent : organisation, séparation logique, réutilisation, architecture propre.

C'est la base de React, Next.js, Node.js, Vue, Angular. Tout repose sur ça.

---

## SCHÉMA

```
module A
   │
 export
   │
   ▼
module B
   │
 import
```

Les modules sont reliés comme un réseau de pièces. Chaque pièce fait une chose. L'assemblage fait le tout.

---

# MISSION — L'ARMURERIE MODULAIRE

Tu vas créer un mini système de modules comme un vrai projet.

**`weaponFactory.js`** : crée et exporte :

```javascript
export function makeWeapon(name, damage)
// retourne : { name, damage, attack() }
```

**`playerFactory.js`** : crée et exporte en default :

```javascript
export default function createPlayer(name)
// retourne : { name, hp: 100, equipWeapon(weapon) }
```

**`battleSystem.js`** : crée et exporte :

```javascript
export function attack(player, weapon)
export function heal(player)
```

**`game.js`** : importe tout, assemble :

```javascript
import createPlayer from "./playerFactory.js";
import { makeWeapon } from "./weaponFactory.js";
import { attack, heal } from "./battleSystem.js";

// Crée un joueur, une arme, fais-le attaquer
```

---

## MISSION BONUS : MONSTER FACTORY

Crée un module `monsterFactory.js` qui fabrique Goblin, Zombie, Dragon. Chaque monstre doit avoir `name`, `hp`, `attack()`. Importe-les dans ton jeu et déclenche le chaos.

---

# LE SECRET DES INGÉNIEURS JS

Un projet professionnel n'est qu'une **collection de modules**. Une app React en production peut en avoir 1000+. Mais chacun fait **une seule chose**.

C'est ça, l'architecture logicielle. Pas de la magie — juste de la discipline.
