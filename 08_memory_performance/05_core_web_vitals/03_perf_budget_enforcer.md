---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LE BUDGET DE PERFORMANCE : TU LE POSES, LE CI LE FAIT RESPECTER
Temps de lecture ~9 min

Ton site est rapide aujourd'hui.
Dans 6 mois, quelqu'un a ajouté une librairie d'analytics, un widget de chat, trois fonts Google, et un carousel. LCP : 4.2s. CLS : 0.31. Le score Lighthouse est passé de 94 à 61 sans que personne s'en aperçoive.

Le budget de performance, c'est le garde du corps que tu mets en place avant que ça arrive.
Il bloque le build si une métrique dépasse le seuil. Pas un warning. Un blocage.

Sans ça, la perf se dégrade en silence : chaque PR est "juste un petit truc", et au bout de 20 PRs t'as un site qui charge en 6 secondes.

---

## 1) C'EST QUOI UN BUDGET DE PERF

Un budget de performance c'est un ensemble de seuils que ton projet ne peut pas dépasser.

```
LCP    <= 2.5s
INP    <= 200ms
CLS    <= 0.1
JS bundle <= 200kb (gzipped)
Score   >= 90
```

Ce n'est pas une recommandation. C'est un contrat.
Si le build dépasse ces seuils : il échoue. La PR ne merge pas.

```
Développeur    CI Pipeline     Merge
   |         |         |
   |--- push code ---> |         |
   |         |-- run audit ----> |
   |         |         |
   |         | LCP: 3.1s    |
   |         | BUDGET: 2.5s  |
   |         |         |
   |         |-- FAIL ----------|
   |         |         |
   |<-- build failed--|         |
   |  "LCP exceeded budget"       |
```

---

## 2) POSER LE BUDGET AVEC LIGHTHOUSE CI

`@lhci/cli` est l'outil officiel pour automatiser Lighthouse.

```bash
npm install -D @lhci/cli
```

Configuration dans `lighthouserc.js` à la racine du projet :

```js
// lighthouserc.js
// le contrat de performance du projet:on ne touche pas sans discussion
module.exports = {
 ci: {
  collect: {
   // l'URL à auditer:en local ou sur un serveur de preview
   url: ["http://localhost:3000", "http://localhost:3000/about"],
   numberOfRuns: 3, // on fait la moyenne sur 3 runs pour éviter les faux positifs
  },
  assert: {
   assertions: {
    // Core Web Vitals:les seuils Google "Good"
    "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
    "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
    "total-blocking-time": ["error", { maxNumericValue: 200 }],

    // taille du bundle JS:ce qui se paye à chaque chargement
    "resource-summary:script:size": ["error", { maxNumericValue: 204800 }], // 200kb

    // score global:le plancher en dessous duquel on ne descend pas
    "categories:performance": ["error", { minScore: 0.9 }],
    "categories:accessibility": ["warn", { minScore: 0.9 }],
   },
  },
  upload: {
   target: "temporary-public-storage", // stocke les rapports en ligne pendant 7 jours
  },
 },
};
```

Lancer l'audit :

```bash
# démarre l'app d'abord, puis
npx lhci autorun
```

Si une assertion échoue, la commande sort avec un code non-zéro : le CI le détecte et bloque.

---

## 3) INTÉGRER DANS GITHUB ACTIONS

```yaml
# .github/workflows/perf-budget.yml
name: Performance Budget

on:
 pull_request:
  branches: [main]
 push:
  branches: [main]

jobs:
 lighthouse:
  runs-on: ubuntu-latest

  steps:
   - uses: actions/checkout@v4

   - name: Setup Node
    uses: actions/setup-node@v4
    with:
     node-version: "20"

   - name: Install dependencies
    run: npm ci

   - name: Build
    run: npm run build

   - name: Start server
    run: npm run start & # démarre en background
    env:
     PORT: 3000

   - name: Wait for server
    run: npx wait-on http://localhost:3000 --timeout 30000

   - name: Run Lighthouse CI
    run: npx lhci autorun
    env:
     LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

Résultat : chaque PR affiche un commentaire avec les scores et bloque le merge si un seuil est dépassé.

```
PR #47 : "Add analytics widget"
----------------------------------------
 LCP:  3.1s  [NON] budget: 2.5s
 CLS:  0.08  [OK]
 TBT:  180ms [OK]
 JS:  312kb [NON] budget: 200kb
 Score: 81   [NON] budget: 90

 2 assertions failed. Merge blocked.
```

---

## 4) BUDGET PAR RESSOURCE AVEC BUNDLESIZE

Lighthouse mesure les métriques runtime. `bundlesize` mesure les fichiers statiques.
Les deux se complètent : l'un voit le résultat final, l'autre voit les fichiers jutsus.

```bash
npm install -D bundlesize
```

Dans `package.json` :

```json
{
 "bundlesize": [
  {
   "path": "./dist/js/*.js",
   "maxSize": "200 kB" // gzipped par défaut
  },
  {
   "path": "./dist/css/*.css",
   "maxSize": "30 kB"
  },
  {
   "path": "./dist/images/*.{jpg,png,webp}",
   "maxSize": "100 kB"
  }
 ],
 "scripts": {
  "size": "bundlesize"
 }
}
```

```bash
npm run size

 PASS ./dist/js/main.js: 187.4kB < 200kB (gzip)
 FAIL ./dist/js/vendor.js: 234.1kB > 200kB (gzip)
 PASS ./dist/css/app.css: 22.3kB < 30kB (gzip)
```

---

## 5) SCRIPT DE VÉRIFICATION LOCALE

Avant de pousser, tu veux savoir si tu vas casser le budget.

```js
// Scofield check : est-ce que le plan tient avant d'exécuter ?

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BUDGET = {
 lcp: 2500, // ms
 cls: 0.1,
 tbt: 200, // ms
 jsBundleKb: 200, // kb gzipped
 score: 90,
};

function checkBundleSize() {
 const distDir = path.join(__dirname, "../dist/js");

 if (!fs.existsSync(distDir)) {
  console.error("dist/ introuvable : lance le build d'abord");
  process.exit(1);
 }

 const files = fs.readdirSync(distDir).filter((f) => f.endsWith(".js"));
 let totalBytes = 0;

 for (const file of files) {
  const stats = fs.statSync(path.join(distDir, file));
  totalBytes += stats.size;
 }

 // approximation gzip : ~30% de la taille réelle
 const estimatedGzipKb = Math.round((totalBytes * 0.3) / 1024);
 const status = estimatedGzipKb <= BUDGET.jsBundleKb ? "PASS" : "FAIL";

 console.log(
  `[${status}] JS bundle: ~${estimatedGzipKb}kb (budget: ${BUDGET.jsBundleKb}kb)`,
 );

 return status === "PASS";
}

function printBudgetReminder() {
 console.log("\n--- BUDGET DE PERFORMANCE ---");
 console.log(`LCP    <= ${BUDGET.lcp}ms`);
 console.log(`CLS    <= ${BUDGET.cls}`);
 console.log(`TBT    <= ${BUDGET.tbt}ms`);
 console.log(`JS bundle <= ${BUDGET.jsBundleKb}kb`);
 console.log(`Score   >= ${BUDGET.score}`);
 console.log("-----------------------------\n");
}

printBudgetReminder();
const bundleOk = checkBundleSize();

if (!bundleOk) {
 console.error(
  '\nBudget bundle dépassé. Lance "npm run build -- --analyze" pour identifier la source.',
 );
 process.exit(1);
}

console.log("\nBudget bundle OK. Lance lhci pour les métriques runtime.");
```

---

## 6) QUAND UN SEUIL SE CASSE : PROCESSUS DE DÉCISION

Le budget bloque une PR. Deux options, pas trois :

```
Budget cassé
   |
   |--> est-ce qu'on peut réduire la source ?
   |     |
   |     |--> OUI : lazy loading, code splitting, image compression
   |     |     tree shaking, remplacer une lib lourde
   |     |
   |     |--> NON : la feature vaut-elle la dégradation ?
   |          |
   |          |--> NON : la feature sort pas
   |          |
   |          |--> OUI : réviser le budget, documenter la décision
   |               => c'est un choix assumé, pas un oubli
```

Réviser le budget sans documenter pourquoi : c'est de la dette silencieuse.
Si tu montes le seuil LCP à 3s, tu l'écris dans le commit. Et tu sais pourquoi.

---

## EXERCICES

## EXO 1 : le contrat de Scofield

Tu rejoins une équipe. L'app actuelle a ces métriques selon le dernier audit Lighthouse :

```
LCP:  2.8s
CLS:  0.06
TBT:  310ms
Score: 84
JS:  287kb gzipped
```

1. Écris un `lighthouserc.js` avec des budgets réalistes pour cette app (objectif : atteindre "Good" sur tous les CWV en 3 sprints)
2. Définis des seuils `warn` pour les métriques proches du budget et `error` pour celles qui dépassent clairement
3. Explique pourquoi TBT à 310ms est le problème le plus urgent à régler

---

## EXO 2 : l'analytics qui tue le score

Un dev a intégré une librairie d'analytics. Le build passe mais le score Lighthouse est passé de 91 à 78. TBT est monté à 420ms.

```js
// lib ajoutée dans le bundle principal
import AnalyticsSuite from "analytics-suite"; // 89kb gzipped
```

1. Propose deux stratégies pour réintégrer cette lib sans casser le budget TBT
2. Implémente le chargement lazy de cette lib en JS pur (pas de framework)
3. Écris l'assertion `bundlesize` qui aurait bloqué cette PR avant le merge

---

## EXO 3 : le script de guardrail local

Écris un script Node.js `check-budget.js` qui :

- lit les fichiers du dossier `dist/`
- calcule la taille totale des `.js` et `.css`
- applique une estimation gzip (facteur 0.3)
- compare aux seuils du budget
- sort avec `process.exit(1)` si dépassement
- affiche un message clair avec quelle catégorie dépasse et de combien

(indice : `fs.readdirSync` + `fs.statSync` + filtre par extension)

---

## RÉSUMÉ

Un budget de performance sans CI, c'est une règle que personne ne respecte.
Le flow : tu définis les seuils dans `lighthouserc.js`, tu intègres dans GitHub Actions, le build bloque si les métriques dépassent.
`bundlesize` surveille les fichiers statiques. Lighthouse CI surveille les métriques runtime. Les deux ensemble couvrent tout.
Quand un budget est cassé : tu réduis la source ou tu révises le seuil en documentant pourquoi. Jamais en silence.
