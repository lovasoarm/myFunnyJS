---
stability: intemporel
---

# CLI TOOL BUILDER : CONSTRUIRE UN VRAI OUTIL DISTRIBUABLE
Temps de lecture ~9 min

Jusqu'ici t'as écrit des scripts. Un script, c'est `node mon-script.js`. Un outil CLI distribuable, c'est `ballon-dor vote --player "Messi"` depuis n'importe où sur ta machine, ou depuis n'importe quelle machine qui l'installe via npm.

La différence : un `package.json` bien configuré, un `bin` qui pointe vers le bon fichier, et une lib qui gère les commandes proprement. C'est ce qu'on construit ici.

---

## 1) POURQUOI COMMANDER OU YARGS PLUTÔT QU'UN PARSER MAISON

```js
// parser maison : ça marche, mais t'as réinventé la roue
// et ta roue est carrée

// commander : 15M téléchargements hebdomadaires, utilisé par create-react-app, eslint...
// yargs : similaire, plus de config, plus verbeux

// ce que tu as avec une lib :
// - sous-commandes imbriquées (git remote add, npm install --save-dev)
// - validation des types automatique
// - génération de l'aide
// - complétion shell
// - gestion des erreurs
// - tout ça sans écrire 200 lignes de parsing

import { Command } from "commander";

const program = new Command();

program
 .name("ballon-dor")
 .description("CLI pour gérer le vote du Ballon d'Or")
 .version("1.0.0");

program.parse();
// node ballon-dor.js --help --> aide générée automatiquement
// node ballon-dor.js --version --> 1.0.0
```

---

## 2) DÉFINIR DES SOUS-COMMANDES

```js
import { Command } from "commander";
import { castVote, getRanking, resetVotes } from "./votes.js";

const program = new Command();

program
 .name("ballon-dor")
 .description("Système de vote du Ballon d'Or 2026")
 .version("1.0.0");

// commande vote
program
 .command("vote")
 .description("Enregistrer un vote de journaliste")
 .requiredOption("-p, --player <nom>", "Nom du joueur")
 .requiredOption("-n, --points <nombre>", "Points attribués (1-15)", parseInt)
 .option("-j, --journalist <nom>", "Nom du journaliste", "Anonyme")
 .option("--dry-run", "Simuler sans sauvegarder")
 .action(async (options) => {
  // options = { player: 'Messi', points: 12, journalist: 'Dupont', dryRun: false }
  if (options.points < 1 || options.points > 15) {
   console.error("Les points doivent être entre 1 et 15");
   process.exit(1);
  }

  if (!options.dryRun) {
   await castVote(options);
   console.log(
    `Vote enregistré : ${options.player} (${options.points} pts)`,
   );
  } else {
   console.log(
    `[DRY RUN] Vote simulé : ${options.player} (${options.points} pts)`,
   );
  }
 });

// commande rank
program
 .command("rank")
 .description("Afficher le classement actuel")
 .option("-n, --top <nombre>", "Nombre de joueurs à afficher", parseInt, 10)
 .option("--json", "Sortie en JSON")
 .action(async (options) => {
  const ranking = await getRanking();
  const top = ranking.slice(0, options.top);

  if (options.json) {
   console.log(JSON.stringify(top, null, 2));
  } else {
   top.forEach((entry, i) => {
    console.log(`${i + 1}. ${entry.player.padEnd(20)} ${entry.points} pts`);
   });
  }
 });

// commande reset
program
 .command("reset")
 .description("Remettre tous les votes à zéro")
 .option("--force", "Réinitialiser sans confirmation")
 .action(async (options) => {
  if (!options.force) {
   const { confirm } = await prompt("Effacer tous les votes ? (oui/non) : ");
   if (confirm.toLowerCase() !== "oui") {
    console.log("Annulé.");
    return;
   }
  }
  await resetVotes();
  console.log("Tous les votes ont été réinitialisés.");
 });

program.parse();
```

---

## 3) RENDRE LE SCRIPT EXÉCUTABLE GLOBALEMENT

```json
// package.json
{
 "name": "ballon-dor-cli",
 "version": "1.0.0",
 "type": "module",
 "bin": {
  "ballon-dor": "./src/index.js"
 },
 "dependencies": {
  "commander": "^12.0.0"
 }
}
```

```js
// src/index.js:le shebang est obligatoire pour que le terminal sache comment exécuter
#!/usr/bin/env node

import { Command } from 'commander'
// ... le reste du CLI
```

```bash
# rendre le fichier exécutable (Linux/Mac)
chmod +x src/index.js

# installer globalement sur ta machine (depuis le dossier du projet)
npm link

# maintenant tu peux faire :
ballon-dor vote --player "Messi" --points 12
ballon-dor rank --top 5
ballon-dor --help
```

---

## 4) STRUCTURE D'UN CLI PROFESSIONNEL

```
ballon-dor-cli/
├── package.json     # bin, version, dependencies
├── src/
│  ├── index.js     # point d'entrée : parse, route vers les commandes
│  ├── commands/
│  │  ├── vote.js    # logique de la commande vote
│  │  ├── rank.js    # logique de la commande rank
│  │  └── reset.js   # logique de la commande reset
│  ├── lib/
│  │  ├── storage.js  # lecture/écriture des données
│  │  ├── display.js  # fonctions d'affichage (couleurs, tableaux)
│  │  └── validate.js  # validation des inputs
│  └── utils/
│    └── prompt.js   # wrapper autour de readline
└── tests/
  ├── commands.test.js
  └── storage.test.js
```

```js
// src/index.js : propre, délègue tout
#!/usr/bin/env node

import { Command } from 'commander'
import { voteCommand } from './commands/vote.js'
import { rankCommand } from './commands/rank.js'
import { resetCommand } from './commands/reset.js'

const program = new Command()

program
 .name('ballon-dor')
 .description('Système de vote du Ballon d\'Or 2026')
 .version('1.0.0')

program.addCommand(voteCommand)
program.addCommand(rankCommand)
program.addCommand(resetCommand)

program.parse()
```

---

## 5) PUBLIER SUR NPM

```bash
# vérifier que tout est propre
npm pack --dry-run # voir les fichiers qui seraient publiés

# ajouter un .npmignore pour exclure les fichiers de dev
# (ou utiliser "files" dans package.json)
```

```json
// package.json complet pour publication
{
 "name": "ballon-dor-cli",
 "version": "1.0.0",
 "description": "CLI pour gérer les votes du Ballon d'Or",
 "type": "module",
 "main": "./src/index.js",
 "bin": {
  "ballon-dor": "./src/index.js"
 },
 "files": ["src/"],
 "engines": {
  "node": ">=18.0.0"
 },
 "keywords": ["cli", "ballon-dor", "football"],
 "dependencies": {
  "commander": "^12.0.0"
 },
 "devDependencies": {
  "vitest": "^1.0.0"
 },
 "scripts": {
  "test": "vitest",
  "start": "node src/index.js"
 }
}
```

```bash
# publier (une fois connecté à npm)
npm publish

# maintenant n'importe qui peut faire :
npm install -g ballon-dor-cli
ballon-dor --help
```

---

## 6) TESTER UN CLI

```js
// les CLIs sont testables : on teste les fonctions, pas les commandes
// les commandes sont juste du câblage

// src/lib/ranking.js
export function computeRanking(votes) {
 const totals = {};
 votes.forEach(({ player, points }) => {
  totals[player] = (totals[player] ?? 0) + points;
 });
 return Object.entries(totals)
  .sort(([, a], [, b]) => b - a)
  .map(([player, points], i) => ({ rank: i + 1, player, points }));
}

// tests/ranking.test.js
import { describe, it, expect } from "vitest";
import { computeRanking } from "../src/lib/ranking.js";

describe("computeRanking", () => {
 it("trie par points décroissants", () => {
  const votes = [
   { player: "Messi", points: 8 },
   { player: "Vini", points: 12 },
   { player: "Messi", points: 5 },
  ];
  const result = computeRanking(votes);
  expect(result[0].player).toBe("Vini");
  expect(result[0].points).toBe(12);
  expect(result[1].player).toBe("Messi");
  expect(result[1].points).toBe(13); // 8 + 5
 });

 it("retourne un tableau vide si pas de votes", () => {
  expect(computeRanking([])).toEqual([]);
 });
});
```

---

## EXERCICES

## EXO 1 : le CLI complet avec commander

Reprends tout le CLI du Ballon d'Or des leçons précédentes. Migre-le vers commander. Ajoute une commande `export --format json|csv --output <filepath>` qui exporte le classement.

---

## EXO 2 : les sous-commandes imbriquées

Ajoute une commande `player` avec deux sous-commandes :

- `player add --name <nom> --country <pays>` : ajouter un joueur à la liste
- `player list` : afficher tous les joueurs enregistrés

Stocke les joueurs dans un fichier séparé `players.json`.

---

## EXO 3 : le package publiable

Prépare le CLI pour publication npm :

- `package.json` avec tous les champs requis (name, version, bin, files, engines)
- `.npmignore` ou champ `files` pour exclure les tests et les fichiers de dev
- Un `README.md` avec les instructions d'installation et d'usage
- Lance `npm pack --dry-run` et vérifie que seuls les bons fichiers sont inclus

---

## RÉSUMÉ

Commander structure les sous-commandes, génère l'aide, et valide les types automatiquement. Le shebang `#!/usr/bin/env node` rend le script exécutable. `npm link` installe le CLI globalement pendant le développement. La structure `commands/` + `lib/` sépare le câblage CLI de la logique métier. On teste la logique, pas les commandes. Pour publier : `files` dans `package.json` et `npm publish`.

> Note : 9.5/10 : la séparation commands/lib est un pattern solide que beaucoup de CLIs ratent. Le shebang et `npm link` sont bien expliqués. Moins 0.5 : la complétion shell (tab completion) avec commander aurait fait passer l'outil du niveau "utilitaire" au niveau "outil pro".
