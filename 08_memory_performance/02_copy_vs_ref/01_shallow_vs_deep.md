---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# SHALLOW VS DEEP : COPIER LA SURFACE OU COPIER LE FOND
Temps de lecture ~10 min

Tu copies un objet. Tu modifies la copie. Et l'original change aussi.

Bienvenue dans le bug le plus silencieux de JavaScript. Pas d'erreur. Pas de warning. Juste un état corrompu que tu découvres trois heures plus tard en mode panique.

La raison : copier un objet en JS ne signifie pas forcément copier ce qu'il contient. Ça dépend de si tu copies en surface ou en profondeur : et par défaut, JS copie en surface.

---

## 1) VALEUR VS RÉFÉRENCE : LE FONDEMENT

En JS, les données se divisent en deux catégories :

```
STACK (valeurs primitives)     HEAP (objets, tableaux, fonctions)
--------------------------     ----------------------------------
| score  = 42     |     | { hp: 100,           |
| level  = 7      |     |  name: "Naruto",       |
| ninja ----> [ ref ] ---+--------> |  jutsus: ["Rasengan", ...]  |
--------------------------     | }               |
                  ----------------------------------

Copier score : nouvelle valeur indépendante. Changer l'une ne change pas l'autre.
Copier ninja : même objet dans le heap. Modifier depuis deux endroits = même objet muté.
C'est pour ça que deux variables peuvent "bouger ensemble" sans qu'on l'ait demandé.
```

**Primitives** : copiées par valeur. Chaque variable a sa propre copie.

```js
let chakra = 9000;
let cloneChakra = chakra; // copie de la valeur

cloneChakra = 1; // modifie la copie
console.log(chakra); // → 9000:l'original ne bouge pas
```

**Objets (et tableaux, et fonctions)** : copiés par référence. Deux variables peuvent pointer vers le même objet.

```js
const naruto = { name: "Naruto", power: 9000 };
const shadowClone = naruto; // copie de la RÉFÉRENCE, pas de l'objet

shadowClone.power = 1; // modifie l'objet pointé
console.log(naruto.power); // → 1:l'original est aussi touché
```

```
PRIMITIVES
──────────
chakra   → [9000]
cloneChakra → [9000]  ← copie indépendante

OBJETS
──────
naruto   ──┐
       ▼
shadowClone ──► { name: "Naruto", power: 9000 }
       ← les deux pointent vers le même objet
```

---

## 2) SHALLOW COPY : LA COPIE EN SURFACE

Une shallow copy crée un **nouvel objet** avec les mêmes propriétés de premier niveau. Mais si ces propriétés sont elles-mêmes des objets, elles ne sont pas dupliquées : elles sont partagées.

### Spread operator

```js
const ninja = {
 name: "Sasuke",
 stats: { speed: 95, power: 85 }, // objet imbriqué
 jutsus: ["Chidori", "Sharingan"], // tableau imbriqué
};

const copy = { ...ninja };

// Modifier une propriété primitive → OK, indépendant
copy.name = "Itachi";
console.log(ninja.name); // → "Sasuke":non touché

// Modifier une propriété imbriquée → DANGER
copy.stats.power = 0;
console.log(ninja.stats.power); // → 0:l'original est touché

copy.jutsus.push("Susanoo");
console.log(ninja.jutsus); // → ["Chidori", "Sharingan", "Susanoo"]:touché
```

```
APRÈS SPREAD
────────────
ninja ──► { name: "Sasuke", stats: ──┐, jutsus: ──┐ }
copy ──► { name: "Itachi", stats: ──┘, jutsus: ──┘ }
                 ▲       ▲
             objet partagé  tableau partagé
```

`name` est une primitive : chaque objet a sa propre valeur.
`stats` et `jutsus` sont des objets/tableaux : les deux copies partagent la même référence.

### Object.assign

Même comportement que le spread : shallow.

```js
const copy2 = Object.assign({}, ninja);
// identique à { ...ninja } pour les cas simples
```

### Array spread

Pareil pour les tableaux :

```js
const squad = [{ name: "Naruto" }, { name: "Sasuke" }];

const copySquad = [...squad];

copySquad[0].name = "Rock Lee";
console.log(squad[0].name); // → "Rock Lee":partagé
```

---

## 3) DEEP COPY : COPIER JUSQU'AU FOND

Une deep copy duplique l'objet **et tous les objets imbriqués**. Aucune référence n'est partagée avec l'original.

### structuredClone : la méthode moderne

```js
const ninja = {
 name: "Sasuke",
 stats: { speed: 95, power: 85 },
 jutsus: ["Chidori", "Sharingan"],
 sensei: { name: "Kakashi", rank: "Jonin" },
};

const deepCopy = structuredClone(ninja);

deepCopy.stats.power = 0;
deepCopy.jutsus.push("Susanoo");
deepCopy.sensei.rank = "Hokage";

console.log(ninja.stats.power); // → 85:non touché
console.log(ninja.jutsus); // → ["Chidori", "Sharingan"]:non touché
console.log(ninja.sensei.rank); // → "Jonin":non touché
```

```
APRÈS structuredClone
─────────────────────
ninja ──► { stats: ──► { power: 85 }, jutsus: ──► ["Chidori"...] }

deepCopy ──► { stats: ──► { power: 0 }, jutsus: ──► ["Chidori", "Susanoo"] }

Chaque niveau est un objet distinct. Aucune référence partagée.
```

`structuredClone` gère :

- objets imbriqués
- tableaux imbriqués
- `Date`, `Map`, `Set`, `ArrayBuffer`
- références circulaires

`structuredClone` **ne gère pas** :

- fonctions
- `undefined` (converti en propriété manquante)
- prototypes personnalisés (l'objet copié sera un plain object)

### JSON.parse + JSON.stringify : l'ancienne méthode (avec ses pièges)

```js
const deepCopyJson = JSON.parse(JSON.stringify(ninja));
```

Fonctionnait avant `structuredClone`. Mais :

```js
const problematic = {
 name: "Walter",
 cook: () => "meth", // ← fonction : PERDUE dans la copie
 date: new Date(), // ← Date : converti en string, pas en Date
 value: undefined, // ← undefined : PERDU (clé supprimée)
 score: NaN, // ← NaN : converti en null
};

const bad = JSON.parse(JSON.stringify(problematic));
// bad.cook   → undefined (la fonction a disparu)
// bad.date   → string (plus un objet Date)
// bad.value   → clé inexistante
// bad.score   → null
```

**Règle :** utilise `structuredClone` si tu es en environnement moderne (Node 17+, Chrome 98+). Utilise JSON en dernier recours sur des données purement sérialisables.

---

## 4) LE TABLEAU DE DÉCISION

```
Tu as besoin de...            Utilise...
─────────────────────────────────────   ──────────────────
copier un objet plat (pas d'imbrication) { ...obj }
copier un tableau d'éléments simples   [...arr]
copier en profondeur, données modernes  structuredClone()
copier en profondeur, vieux environnement JSON.parse(JSON.stringify())
copier en gardant les fonctions      bibliothèque lodash _.cloneDeep()
```

---

## 5) CAS RÉEL : LE STATE MANAGEMENT

Dans tout système avec un état (Redux, Zustand, signal custom), shallow vs deep est la décision qui fait ou casse la détection de changement.

```js
// Système de stats de match pour les ultras
const matchState = {
 score: { home: 0, away: 0 },
 events: [],
 players: {
  mbappe: { goals: 0, assists: 2 },
 },
};

// MAUVAISE mise à jour:mute l'état directement
function badGoal(team) {
 matchState.score[team]++; // mutation directe
 // un comparateur shallow (===) ne verra aucune différence
 // matchState est toujours le même objet en mémoire
 // React, Vue, ou ton système de détection ne se déclenchera pas
}

// BONNE mise à jour:retourne un nouvel état
function goal(state, team) {
 return {
  ...state,
  score: {
   ...state.score,
   [team]: state.score[team] + 1,
  },
 };
 // nouveau score, nouvel objet → détection de changement = OK
 // mais attention : events et players sont toujours partagés (shallow)
}

// MEILLEURE mise à jour si events ou players changent aussi
function goalDeep(state, team) {
 const newState = structuredClone(state);
 newState.score[team]++;
 return newState;
}
```

---

## EXERCICES

### EXO 1 : IDENTIFIER LA PROFONDEUR

Pour chaque opération ci-dessous, dire si la modification de `copy` affecte `original`, et pourquoi.

```js
// Cas A
const original = { name: "Goku", power: 9000 };
const copy = { ...original };
copy.power = 1;

// Cas B
const original = { name: "Vegeta", stats: { ki: 8000 } };
const copy = { ...original };
copy.stats.ki = 0;

// Cas C
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);

// Cas D
const original = [{ name: "Piccolo" }, { name: "Krilin" }];
const copy = [...original];
copy[0].name = "Cell";

// Cas E
const original = { name: "Freezer", minions: [{ name: "Zarbon" }] };
const copy = structuredClone(original);
copy.minions[0].name = "Dodoria";
```

---

### EXO 2 : LE SYSTÈME D'INVENTAIRE DE RICK GRIMES

Rick a un camp. Chaque camp a un inventaire avec des ressources imbriquées. Une fonction doit retourner un état mis à jour sans jamais muter l'état original.

```js
const campState = {
 name: "Prison",
 resources: {
  food: { cans: 50, water: 20 },
  weapons: ["rifle", "axe", "crossbow"],
 },
 survivors: [
  { name: "Rick", role: "leader" },
  { name: "Daryl", role: "scout" },
 ],
};
```

**Ta mission :**

1. Écrire `consumeFood(state, amount)` : retire `amount` cans, retourne un nouvel état (shallow suffit ici : pourquoi ?)
2. Écrire `addWeapon(state, weapon)` : ajoute une arme, retourne un nouvel état (shallow suffit aussi : pourquoi ?)
3. Écrire `promoteSurvivor(state, name, newRole)` : change le rôle d'un survivant, retourne un nouvel état (shallow ne suffit plus : pourquoi ?)
4. Vérifier que `campState` est toujours intact après chaque opération.

---

### EXO 3 : DEEP CLONE SANS STRUCTURED CLONE

`structuredClone` n'existe pas dans ton environnement (vieux Node, env restreint). Implémente `deepClone(obj)` récursif qui gère :

- objets plats
- objets imbriqués
- tableaux (y compris imbriqués)
- `null` et `undefined`
- primitives

Ne pas gérer `Date`, `Map`, `Set`, `Function` : les ignorer ou les copier par référence en les signalant.

_(Indice : `Array.isArray()` te sauvera la vie. Et pense aux cas limite : que faire si `obj` est une primitive ?)_

---

## RÉSUMÉ

Spread et `Object.assign` font une shallow copy : les propriétés primitives sont copiées par valeur, les objets imbriqués sont partagés. `structuredClone` fait une deep copy : tout est dupliqué indépendamment, jusqu'au fond. `JSON.parse/stringify` fonctionne sur des données sérialisables mais perd les fonctions, les `Date`, et les `undefined`. Dans un système avec état, toujours retourner un nouvel objet plutôt que de muter l'existant : c'est ce qui permet la détection de changement et évite les bugs silencieux.
