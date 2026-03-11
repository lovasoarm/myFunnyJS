# SOLUTION : L'ARMURERIE MODULAIRE

Voici la solution complète, fichier par fichier. Lis chaque partie **avant** de regarder le code — sinon tu passes à côté de la logique.

---

## `weaponFactory.js` : La Forge

```javascript
// weaponFactory.js

export function makeWeapon(name, damage) {
  return {
    name, // shorthand pour name: name
    damage, // shorthand pour damage: damage
    attack() {
      console.log(`${name} inflige ${damage} dégâts !`);
    },
  };
}
```

**Ce qui se passe ici :**

- `makeWeapon` est une **function factory** : elle fabrique et retourne un objet à chaque appel
- `name` et `damage` sont capturés en **closure** : la méthode `attack()` les lit même après la fin de `makeWeapon`
- `export` devant `function` = **named export** : à l'import, les accolades `{ }` seront obligatoires

> **Tip :** `{ name, damage }` est du shorthand ES6. C'est équivalent à `{ name: name, damage: damage }`. Si la clé et la variable ont le même nom, JS accepte la version courte. Tu vas écrire ça des milliers de fois.

---

## `playerFactory.js` : Le Générateur de Héros

```javascript
// playerFactory.js

export default function createPlayer(name) {
  return {
    name,
    hp: 100,
    weapon: null, // pas d'arme au départ — le joueur est nu comme un newborn

    equipWeapon(weapon) {
      this.weapon = weapon;
      console.log(`${name} équipe : ${weapon.name}`);
    },
  };
}
```

**Ce qui se passe ici :**

- `export default` = **export principal du fichier** : à l'import, pas d'accolades, et tu peux choisir n'importe quel nom
- `weapon: null` initialise la propriété à vide : bonne pratique pour déclarer la structure complète dès le départ
- `this.weapon` dans `equipWeapon` : `this` pointe vers l'objet courant (le joueur lui-même)

> **Tip :** `export default` vs `export` : la règle simple : **un seul `default` par fichier**, autant de named exports que tu veux. Le `default`, c'est "la chose principale" du module. Si le fichier ne fabrique qu'une seule chose, `default` est souvent le bon choix.

---

## `battleSystem.js` : Le Moteur de Combat

```javascript
// battleSystem.js

export function attack(player, weapon) {
  if (!player.weapon && !weapon) {
    console.log(`${player.name} attaque à mains nues... pathétique.`);
    return;
  }

  const w = weapon || player.weapon; // arme passée en argument OU arme équipée
  console.log(`${player.name} attaque avec ${w.name} : -${w.damage} HP`);
}

export function heal(player, amount = 20) {
  player.hp += amount;
  console.log(`${player.name} récupère ${amount} HP → ${player.hp} HP`);
}
```

**Ce qui se passe ici :**

- Deux **named exports** dans le même fichier : c'est le pattern le plus courant pour les modules utilitaires
- `amount = 20` est une **valeur par défaut** : si tu appelles `heal(player)` sans préciser le montant, il soigne de 20 HP automatiquement
- `weapon || player.weapon` : l'opérateur `||` retourne la première valeur truthy : si une arme est passée en argument, on l'utilise, sinon on prend celle équipée

> **Tip :** Les fonctions pures comme `attack` et `heal` qui reçoivent leurs données en arguments (plutôt que de les lire dans un état global) sont plus faciles à tester, réutiliser et déboguer. C'est la base du style fonctionnel.

---

## `game.js` : L'Assemblage Final

```javascript
// game.js

import createPlayer from "./playerFactory.js";
import { makeWeapon } from "./weaponFactory.js";
import { attack, heal } from "./battleSystem.js";

// --- Création ---
const hero = createPlayer("Blob");
const sword = makeWeapon("Épée Légendaire", 75);

// --- Équipement ---
hero.equipWeapon(sword);

// --- Combat ---
attack(hero); // utilise l'arme équipée
heal(hero); // soigne de 20 HP (valeur par défaut)
heal(hero, 50); // soigne de 50 HP

console.log(`HP final de ${hero.name} :`, hero.hp);
```

**Sortie console :**

```
Blob équipe : Épée Légendaire
Blob attaque avec Épée Légendaire : -75 HP
Blob récupère 20 HP → 120 HP
Blob récupère 50 HP → 170 HP
HP final de Blob : 170
```

**Ce qui se passe ici :**

- `import createPlayer from` → pas d'accolades car c'est un `default export`
- `import { makeWeapon }` → accolades car c'est un `named export`
- `import { attack, heal }` → on importe les deux named exports de `battleSystem.js` en une ligne
- `game.js` est le **point d'entrée** du projet : il assemble les pièces mais ne fabrique rien lui-même

> **Tip architecture :** `game.js` joue le rôle d'un **chef d'orchestre**. Il importe, connecte, et lance. Il ne contient pas de logique métier — ça, c'est le boulot des autres modules. Cette séparation des responsabilités est ce qui rend un projet maintenable à grande échelle.

---

## RÉCAP DES IMPORTS / EXPORTS

```
weaponFactory.js  →  export function makeWeapon     →  import { makeWeapon }
playerFactory.js  →  export default createPlayer    →  import createPlayer
battleSystem.js   →  export function attack         →  import { attack, heal }
                  →  export function heal
```

| Export  | Syntaxe export            | Syntaxe import  | Nom imposé ?     |
| ------- | ------------------------- | --------------- | ---------------- |
| Named   | `export function X`       | `import { X }`  | oui              |
| Default | `export default function` | `import X`      | non : tu choisis |
| Tout    | —                         | `import * as X` | non              |

---

# MISSION BONUS : MONSTER FACTORY

```javascript
// monsterFactory.js

export function makeMonster(name, hp, damagePower) {
  return {
    name,
    hp,
    attack() {
      console.log(`${name} attaque sauvagement pour ${damagePower} dégâts !`);
    },
    takeDamage(amount) {
      this.hp -= amount;
      console.log(`${name} reçoit ${amount} dégâts → ${this.hp} HP restants`);
      if (this.hp <= 0) console.log(`${name} est mort. Paix à son âme verte.`);
    },
  };
}

// Trois fabriques dédiées : des raccourcis avec des valeurs pré-remplies
export function makeGoblin() {
  return makeMonster("Goblin", 30, 15);
}
export function makeZombie() {
  return makeMonster("Zombie", 60, 20);
}
export function makeDragon() {
  return makeMonster("Dragon", 500, 100);
}
```

```javascript
// game.js : mise à jour avec les monstres

import createPlayer from "./playerFactory.js";
import { makeWeapon } from "./weaponFactory.js";
import { attack, heal } from "./battleSystem.js";
import { makeGoblin, makeZombie, makeDragon } from "./monsterFactory.js";

const hero = createPlayer("Blob");
const sword = makeWeapon("Épée Légendaire", 75);
hero.equipWeapon(sword);

// Création de la horde
const goblin = makeGoblin();
const zombie = makeZombie();
const dragon = makeDragon();

// Le chaos commence
goblin.attack();
hero.weapon.attack();
goblin.takeDamage(75); // le goblin explose

zombie.attack();
heal(hero, 30);

dragon.attack(); // aïe
hero.weapon.attack();
dragon.takeDamage(75); // 425 HP restants... va falloir revenir
```

**Sortie console :**

```
Goblin attaque sauvagement pour 15 dégâts !
Épée Légendaire inflige 75 dégâts !
Goblin reçoit 75 dégâts → -45 HP restants
Goblin est mort. Paix à son âme verte.
Zombie attaque sauvagement pour 20 dégâts !
Blob récupère 30 HP → 130 HP
Dragon attaque sauvagement pour 100 dégâts !
Épée Légendaire inflige 75 dégâts !
Dragon reçoit 75 dégâts → 425 HP restants
```

> **Tip :** Le pattern `makeGoblin()` qui appelle `makeMonster()` avec des valeurs pré-remplies s'appelle un **wrapper** ou **preset factory**. Tu définis une fois les stats, tu exposes une API claire. Celui qui appelle `makeGoblin()` n'a pas besoin de savoir que le Goblin a 30 HP et 15 de dégâts : c'est encapsulé.

---

## CE QU'IL FAUT RETENIR

```
Un module = une responsabilité
Un export = un contrat
Un import = une dépendance déclarée
```

Chaque fichier sait ce qu'il fait, rien de plus. `weaponFactory.js` fabrique des armes : il ne sait pas qu'un joueur existe. `playerFactory.js` fabrique des joueurs — il ne sait pas que des monstres existent. `game.js` fait les présentations.

C'est ça, l'architecture modulaire. Et c'est exactement comme ça que fonctionne chaque app React, Vue ou Node.js que tu utiliseras.
