---
stability: intemporel
---

# COMMONJS VS ESM : L'HISTOIRE D'UNE GUERRE QUI N'EST PAS FINIE
Temps de lecture ~8 min

En 2009, Node sort sans système de modules standard. La communauté invente CommonJS : `require()`. En 2015, JS standardise les modules avec `import/export` (ESM). Depuis : deux systèmes coexistent, ne sont pas compatibles, et continuent de provoquer des erreurs incompréhensibles en prod.

En 2026, ESM est le standard. Mais CJS est toujours là, dans des millions de packages npm. Comprendre les deux, c'est comprendre pourquoi certains imports cassent.

---

## 1) COMMONJS : LE VIEUX QUI REFUSE DE PARTIR

```js
// ---- exporter ----
// chaque fichier a un objet 'module' implicite
// ce qu'on met dans module.exports = ce que les autres peuvent importer

module.exports = {
 formatScore: (home, away) => `${home} - ${away}`,
 parseLineup: (str) => str.split(",").map((s) => s.trim()),
};

// version raccourcie : exports est un alias de module.exports
exports.formatScore = (home, away) => `${home} - ${away}`;

// ---- importer ----
const { formatScore } = require("./match-utils");
const fs = require("fs"); // module natif Node
const express = require("express"); // package npm
```

Ce qui se passe sous le capot :

```
require('./match-utils')
  |
  v
Node cherche le fichier
  |
  v
Node l'exécute entièrement (synchrone : bloquant)
  |
  v
Il retourne module.exports
  |
  v
Le module est mis en cache : le prochain require() retourne le même objet
```

Synchrone. Bloquant. L'exécution s'arrête jusqu'à ce que le fichier soit chargé. En Node, pour des fichiers locaux, ça va. Pour des centaines de modules au démarrage : ça se voit.

---

## 2) ESM : LE STANDARD QUI A PRIS DU TEMPS À ARRIVER

```js
// ---- exporter ----
export function formatScore(home, away) {
 return `${home} - ${away}`;
}

export const MATCH_DURATION = 90;

// export default : un seul par fichier
export default class MatchEngine {
 /* ... */
}

// ---- importer ----
import { formatScore, MATCH_DURATION } from "./match-utils.js";
// extension obligatoire en ESM Node:pas optionnelle
import MatchEngine from "./match-engine.js";
import * as utils from "./match-utils.js"; // namespace import
```

Ce qui se passe sous le capot :

```
import { formatScore } from './match-utils.js'
  |
  v
Analyse statique : le moteur sait ce qui est importé AVANT d'exécuter
  |
  v
Résolution du graphe de dépendances complet (toutes les dépendances en arbre)
  |
  v
Chargement asynchrone possible
  |
  v
Exécution
```

Statique = le moteur peut faire du tree shaking : il sait exactement ce qui est utilisé, il peut éliminer le reste. C'est pourquoi Vite et Rollup fonctionnent bien avec ESM.

---

## 3) LES DIFFÉRENCES QUI COMPTENT

```
          CommonJS (CJS)     ESM
-----------------------------------------------------------
Syntaxe       require / exports    import / export
Résolution     dynamique        statique
Chargement     synchrone        asynchrone possible
__dirname      disponible       à reconstruire
__filename     disponible       à reconstruire
import() dynamic  non natif        natif
Tree shaking    impossible       natif
Extension fichier  .js ou .cjs      .js (avec type:module) ou .mjs
```

Le `__dirname` qui disparaît en ESM, ça piège beaucoup de devs :

```js
// CJS : __dirname disponible directement
const config = require(path.join(__dirname, "config.json"));

// ESM : __dirname n'existe plus
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url); // chemin du fichier actuel
const __dirname = dirname(__filename); // on le reconstruit manuellement

import { readFileSync } from "node:fs";
const config = JSON.parse(readFileSync(`${__dirname}/config.json`, "utf-8"));
```

---

## 4) CONFIGURER NODE POUR UTILISER ESM

```json
// package.json
{
 "name": "mon-projet",
 "type": "module"
}
```

Avec `"type": "module"` : tous les `.js` sont traités comme ESM. Pour un fichier CJS dans un projet ESM : utilise l'extension `.cjs`.

Sans `"type": "module"` : tous les `.js` sont CJS. Pour un fichier ESM dans un projet CJS : utilise l'extension `.mjs`.

```
Extension  type:module absent  type:module présent
.js     CJS         ESM
.mjs    ESM         ESM
.cjs    CJS         CJS
```

---

## 5) LES ERREURS QUI CASSENT TOUT

```js
// ---- erreur 1 : CJS importe un package ESM-only ----
// certains packages modernes (chalk v5, node-fetch v3...) sont ESM-only
// ils n'exportent plus de version CJS

const chalk = require("chalk"); // ERR_REQUIRE_ESM
// solution : migrer ton projet vers ESM, ou utiliser une version plus ancienne

// ---- erreur 2 : ESM importe CJS sans default ----
// les modules CJS s'importent différemment en ESM
import { specific } from "some-cjs-package"; // peut marcher ou pas selon le package

// la façon fiable :
import cjsModule from "some-cjs-package"; // default import
const { specific } = cjsModule; // destructuration après

// ---- erreur 3 : dynamic import dans le mauvais sens ----
// en ESM, on peut importer du CJS dynamiquement
const { default: module } = await import("./legacy-module.cjs");

// en CJS, on ne peut pas faire d'await au top level
// donc pas d'import() sans être dans une fonction async
```

---

## 6) CE QU'ON UTILISE EN 2026

```
Nouveau projet Node      => ESM, "type": "module" dans package.json
Projet existant legacy    => CJS par défaut, migrer progressivement
Package npm à publier     => dual package si tu dois supporter les deux
Bundler (Vite, Rollup...)   => ESM côté source, CJS ou ESM en output selon config
TypeScript          => ESM en source, transpilé via tsconfig
```

Pour un package npm qui doit supporter les deux :

```json
{
 "main": "./dist/index.cjs",
 "module": "./dist/index.js",
 "exports": {
  ".": {
   "import": "./dist/index.js",
   "require": "./dist/index.cjs"
  }
 }
}
```

---

## EXERCICES

## EXO 1 : convertir un module CJS en ESM

Ce module CJS gère des stats de matchs. Convertis-le en ESM sans changer la logique :

```js
const { mean } = require("./math-utils");

function analyzeMatch(events) {
 const goals = events.filter((e) => e.type === "goal");
 return {
  total: goals.length,
  avgMinute: mean(goals.map((g) => g.minute)),
 };
}

module.exports = { analyzeMatch };
```

Contrainte : gère le `__dirname` si tu en as besoin, utilise les extensions `.js` sur les imports.

---

## EXO 2 : le package dual

T'as un utilitaire simple qui expose `formatDuration(seconds)`. Écris-le pour qu'il soit importable aussi bien via `require()` que via `import`. Utilise le champ `exports` dans `package.json`.

---

## EXO 3 : diagnostiquer l'erreur

Ce projet crash au démarrage. Identifie pourquoi et comment le corriger :

```json
// package.json
{ "type": "module" }
```

```js
// index.js
const path = require("path");
const { readFileSync } = require("fs");

const config = JSON.parse(readFileSync(__dirname + "/config.json", "utf-8"));
console.log(config);
```

---

## RÉSUMÉ

CommonJS est synchrone, dynamique, et utilise `require`. ESM est statique, compatible tree shaking, et utilise `import/export`. En 2026, ESM est le standard : nouveau projet Node → `"type": "module"` dans `package.json`, extensions `.js` explicites sur les imports. `__dirname` n'existe pas en ESM natif : on le reconstruit avec `import.meta.url`. Les packages ESM-only ne peuvent pas être importés avec `require`.
