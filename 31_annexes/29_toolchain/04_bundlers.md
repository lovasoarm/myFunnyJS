---
stability: intemporel
---

# BUNDLERS : WEBPACK, VITE, ESBUILD, ROLLUP : CHOISIR SANS SUBIR
Temps de lecture ~9 min

Le camp a des dizaines de fournitures éparpillées : munitions ici, médicaments là, eau ailleurs. Avant un raid, on regroupe tout en un seul sac, organisé, prêt à partir. Un bundler (empaqueteur) fait pareil avec ton code : des dizaines de fichiers JS éparpillés deviennent un (ou quelques) fichiers prêts pour le navigateur.

---

## 1) POURQUOI UN BUNDLER EXISTE

Ton code en dev ressemble à ça :

```
src/
├── index.js
├── camp/
│  ├── inventaire.js
│  ├── rations.js
│  └── garde.js
└── utils/
  └── format.js
```

```js
// index.js
import { gererInventaire } from "./camp/inventaire.js";
import { calculerRations } from "./camp/rations.js";
```

Le navigateur PEUT charger des modules ESM (ES Modules) nativement aujourd'hui. Mais à grande échelle, ça pose des problèmes concrets :

```
sans bundler --> le navigateur fait une requête HTTP PAR fichier importé
         100 fichiers = 100 requêtes réseau au chargement de la page
         chaque requête a sa propre latence

avec bundler --> tout est regroupé en 1 ou quelques fichiers optimisés
         100 fichiers = 1 requête réseau
```

**Technique :** un bundler construit un graphe de dépendances (qui importe quoi) en partant d'un point d'entrée, puis assemble tout dans un ordre cohérent, en éliminant ce qui n'est jamais utilisé.

**Qui casse en prod sans bundler :** un site avec 200 fichiers JS non bundlés sur une connexion lente. Chaque fichier est une requête séparée, avec sa latence propre. Le temps de chargement explose, le LCP (Largest Contentful Paint : métrique de performance mesurant quand le contenu principal est visible) est catastrophique.

---

## 2) TREE SHAKING : ÉLIMINER LE CODE MORT

```js
// utils/survival.js
export function calculerRations(nourriture, personnes) {
 return nourriture / personnes;
}
export function calculerMenace(zombies, distance) {
 return zombies / distance;
}
export function calculerMoral(événements, temps) {
 return événements / temps;
}

// index.js : on utilise SEULEMENT calculerRations
import { calculerRations } from "./utils/survival.js";
console.log(calculerRations(48, 12));
```

```
sans tree shaking --> le bundle final contient les 3 fonctions
avec tree shaking --> le bundle final contient SEULEMENT calculerRations
```

**Pourquoi ça marche :** le tree shaking (secouer l'arbre pour faire tomber les feuilles mortes) analyse statiquement (sans exécuter le code) quels exports sont réellement importés ailleurs, et supprime le reste du bundle final. Ça fonctionne uniquement avec des imports/exports ESM, écrits de façon analysable statiquement.

**Qui casse le tree shaking :**

```js
// Cette forme EMPÊCHE le tree shaking, le bundler peut pas savoir
// statiquement ce qui sera importé
const utilName = condition ? "./camp.js" : "./horde.js";
import(utilName); // import dynamique avec variable : imprévisible à l'analyse statique
```

---

## 3) WEBPACK VS VITE VS ESBUILD : PAS LE MÊME COMBAT

### Webpack : le vétéran complet, mais lent

```
Forces : écosystème énorme, configurable à l'extrême, loaders pour tout (CSS, images, fonts)
Faiblesses : config complexe, rebuild lent sur les gros projets
Usage : applications complexes qui ont besoin de configurations avancées, projets legacy
```

```js
// webpack.config.js:le minimum pour une app Node/JS
const path = require("path");

module.exports = {
 entry: "./src/index.js",
 output: {
  filename: "bundle.js",
  path: path.resolve(__dirname, "dist"),
 },
 mode: "production", // active tree shaking, minification, optimisations automatiques
};
```

### Vite : le rapide pour le dev moderne

```
Forces : démarrage quasi-instantané (pas de bundle en dev, ESM natif), HMR ultra-rapide
Faiblesses : basé sur Rollup pour le build prod, moins configurable que Webpack sur les cas extrêmes
Usage : projets Vue, React, Svelte modernes:devenu le standard de facto en 2024-2026
```

**Pourquoi Vite est rapide en dev :** Vite ne bundle pas en développement. Il sert les fichiers directement au navigateur via ESM natif. Le navigateur charge ce dont il a besoin à la demande. Le rebuild n'est que le fichier modifié, pas toute l'app. Sur un projet de 500 fichiers, le démarrage reste sous la seconde.

```bash
# créer un projet avec Vite
npm create vite@latest mon-camp -- --template vanilla
cd mon-camp && npm install && npm run dev
```

### esbuild : le bulldozer de la compilation

```
Forces : 10-100x plus rapide que Webpack sur la compilation pure (écrit en Go, pas JS)
Faiblesses : moins de features (pas de CSS modules natifs, HMR limité), API bas niveau
Usage : outil de compilation interne dans d'autres outils (Vite l'utilise en production)
```

### Rollup : le spécialiste des librairies

```
Forces : excellent tree shaking, génère des bundles propres, supporte CJS + ESM en sortie
Faiblesses : moins adapté aux apps web complexes (pas de HMR), moins de plugins que Webpack
Usage : créer des librairies JS (pas des apps):utilisé par Vue, React, lodash pour leur build
```

---

## 4) CHOISIR LE BON BUNDLER EN 2026

```
Tu construis une app web (React, Vue, Svelte...) → Vite
Tu reprends un projet legacy avec Webpack → reste sur Webpack (migration = risque)
Tu crées une librairie JS publiée sur npm → Rollup
Tu as besoin de vitesse de compilation maximale en CI → esbuild ou Vite (qui l'utilise)
Tu as des besoins très spécifiques (Workers, Module Federation...) → Webpack
```

Règle générale : commence par Vite pour les nouveaux projets. Si tu hits une limitation, tu migres. La migration Vite → Webpack est rare. La migration Webpack → Vite est fréquente et voulue.

---

## 5) CE QU'UN BUNDLER FAIT EN PLUS DU BUNDLING

Un bundler moderne fait souvent bien plus que concaténer des fichiers :

```
Minification     → supprime les espaces, raccourcit les noms de variables
            "function calculerRations(nourriture, personnes)" → "function a(b,c)"
            réduit souvent de 40-60% la taille du fichier final

Source maps     → fichiers qui relient le code minifié au code source original
            quand une erreur arrive en prod, la stack trace pointe vers le bon fichier

Code splitting    → diviser le bundle en morceaux chargés à la demande
            la page de classement n'a pas besoin du code de vote au chargement initial

Asset processing   → images compressées, CSS transpilé, fonts sous-ensemble

Environment variables → remplacer process.env.NODE_ENV par "production" dans le bundle
            toutes les branches "if dev" disparaissent du bundle final
```

---

## EXERCICES

### EXO 1 : le premier bundle du camp

Prends le code de `03_walking_dead_protocol` (ou un projet JS simple à toi). Configure Vite en mode vanilla (sans framework). Lance le serveur de dev. Modifie un fichier et observe la vitesse de rechargement. Lance ensuite `npm run build` et inspecte le contenu du dossier `dist/` : que contient-il ? Quelle est la taille du fichier final ?

---

### EXO 2 : le code mort à éliminer

Crée un fichier `utils/camp-tools.js` avec 5 fonctions exportées (calculer des rations, des niveaux de menace, de la durée de garde, des stocks, des distances). Dans `index.js`, n'en importe que 2. Lance le build avec tree shaking activé. Vérifie dans le bundle final que les 3 fonctions non utilisées ont bien disparu.

(Indice : cherche les noms des fonctions dans le bundle minifié : si elles sont absentes, le tree shaking a fonctionné)

---

### EXO 3 : Webpack vs Vite sur ton projet

Si tu as un projet existant avec Webpack, note le temps de démarrage du serveur de dev (`npm start` ou `webpack serve`). Crée un projet équivalent minimal avec Vite. Compare les temps de démarrage et de rebuild. Note les différences et les cas où Webpack aurait encore l'avantage.

---

## RÉSUMÉ

Un bundler regroupe des dizaines de fichiers JS en un ou quelques fichiers optimisés pour le navigateur.
Le tree shaking élimine le code non utilisé : ça fonctionne seulement avec des imports ESM statiques.
Vite est le choix par défaut pour les apps modernes : démarrage quasi-instantané, HMR rapide.
Webpack reste pertinent pour les gros projets legacy ou les besoins très spécifiques.
Rollup est le bon choix pour créer des librairies JS publiées sur npm.
esbuild est un moteur de compilation ultra-rapide utilisé en interne par d'autres outils (Vite notamment).
