---
stability: intemporel
---

# CLI BASICS : PARLER AU TERMINAL SANS BÉGAYER
Temps de lecture ~8 min

Un CLI (Command Line Interface), c'est un programme que t'invoques depuis le terminal. `git commit -m "fix"`, `npm install`, `node script.js --env prod` : tous des CLIs. Derrière chaque commande : un script Node qui lit des arguments, écrit dans le terminal, et sort avec un code.

C'est le premier outil que tout dev Node finit par écrire. Et c'est souvent mal fait : args parsés à la main avec des bugs, output illisible, zéro gestion des erreurs. Ce module couvre la version propre.

---

## 1) LIRE LES ARGUMENTS : PROCESS.ARGV

```js
// node ballon-dor.js vote --player "Lamine Yamal" --points 12 --journalist "Mbappe"
//
// process.argv :
// [0] = '/usr/local/bin/node'  -- toujours là
// [1] = '/app/ballon-dor.js'   -- toujours là
// [2] = 'vote'          -- commande principale
// [3] = '--player'        -- flag
// [4] = 'Lamine Yamal'      -- valeur du flag
// [5] = '--points'
// [6] = '12'
// [7] = '--journalist'
// [8] = 'Mbappe'

const [, , command, ...flags] = process.argv;
// command = 'vote'
// flags = ['--player', 'Lamine Yamal', '--points', '12', '--journalist', 'Mbappe']
```

---

## 2) PARSER LES FLAGS PROPREMENT

```js
// parser les flags --key value et les boolean flags --verbose
function parseFlags(args) {
 const flags = {};
 let i = 0;

 while (i < args.length) {
  const arg = args[i];

  if (arg.startsWith("--")) {
   const key = arg.slice(2); // '--player' -> 'player'
   const next = args[i + 1];

   if (!next || next.startsWith("--")) {
    // flag booléen : --verbose sans valeur
    flags[key] = true;
    i++;
   } else {
    // flag avec valeur : --player "Messi"
    flags[key] = next;
    i += 2;
   }
  } else {
   i++;
  }
 }

 return flags;
}

const [, , command, ...rawFlags] = process.argv;
const flags = parseFlags(rawFlags);

// node vote.js vote --player "Messi" --points 10 --dry-run
// command = 'vote'
// flags = { player: 'Messi', points: '10', 'dry-run': true }
```

---

## 3) ÉCRIRE DANS LE TERMINAL

```js
// stdout : la sortie normale
// stderr : les erreurs:séparé, redirectable indépendamment

// console.log écrit dans stdout avec \n automatique
console.log("Classement mis à jour");

// process.stdout.write : contrôle total, pas de \n automatique
process.stdout.write("Calcul en cours...");
// ... traitement ...
process.stdout.write(" OK\n");

// pour les erreurs : stderr
console.error("Erreur : joueur introuvable"); // stderr
process.stderr.write("Erreur critique : sortie\n"); // stderr

// pourquoi séparer stdout et stderr :
// l'utilisateur peut faire : node vote.js 2>errors.log
// les erreurs vont dans errors.log, les outputs normaux dans le terminal
```

---

## 4) COULEURS ET MISE EN FORME DANS LE TERMINAL

```js
// les codes ANSI : séquences d'échappement que le terminal interprète comme des couleurs
const COLORS = {
 reset: "\x1b[0m",
 bold: "\x1b[1m",
 red: "\x1b[31m",
 green: "\x1b[32m",
 yellow: "\x1b[33m",
 blue: "\x1b[34m",
 cyan: "\x1b[36m",
};

function colorize(text, ...codes) {
 return codes.map((c) => COLORS[c]).join("") + text + COLORS.reset;
}

console.log(colorize("Ballon d'Or 2026", "bold", "yellow"));
console.log(colorize(" Erreur : joueur introuvable", "red"));
console.log(colorize(" Vote enregistré", "green"));

// détecter si le terminal supporte les couleurs
// (pour éviter les codes ANSI dans les fichiers de log ou les pipes)
function supportsColor() {
 return process.stdout.isTTY && process.env.TERM !== "dumb";
}

function print(text, color = null) {
 if (color && supportsColor()) {
  console.log(colorize(text, color));
 } else {
  console.log(text); // version sans couleur pour les pipes et les fichiers
 }
}
```

---

## 5) AFFICHER DE L'AIDE ET VALIDER LES ARGUMENTS

```js
const USAGE = `
Usage : node ballon-dor.js <command> [options]

Commands :
 vote   Enregistrer un vote de journaliste
 rank   Afficher le classement actuel
 reset   Remettre les votes à zéro

Options :
 --player <nom>    Nom du joueur (requis pour vote)
 --points <1-15>    Points attribués (requis pour vote)
 --journalist <nom>  Nom du journaliste
 --dry-run       Simuler sans sauvegarder
 --help        Afficher cette aide

Exemples :
 node ballon-dor.js vote --player "Messi" --points 12
 node ballon-dor.js rank
`;

function validateArgs(command, flags) {
 const errors = [];

 if (command === "vote") {
  if (!flags.player) errors.push("--player est requis pour la commande vote");
  if (!flags.points) errors.push("--points est requis pour la commande vote");

  const points = parseInt(flags.points, 10);
  if (isNaN(points) || points < 1 || points > 15) {
   errors.push("--points doit être un nombre entre 1 et 15");
  }
 }

 return errors;
}

// point d'entrée principal
const [, , command, ...rawFlags] = process.argv;
const flags = parseFlags(rawFlags);

if (flags.help || !command) {
 process.stdout.write(USAGE);
 process.exit(0);
}

const errors = validateArgs(command, flags);
if (errors.length > 0) {
 errors.forEach((e) => console.error(colorize(` ${e}`, "red")));
 process.stderr.write("\nUtilise --help pour voir les options disponibles\n");
 process.exit(1);
}
```

---

## 6) CODES DE SORTIE : LA CONVENTION QUE TOUT LE MONDE SUIT

```js
// 0 = succès
// 1 = erreur générique
// 2 = mauvaise utilisation (mauvais arguments)
// 126 = commande trouvée mais non exécutable
// 127 = commande introuvable

// dans un pipeline bash :
// node vote.js && echo "succès" -- "succès" s'affiche uniquement si exit(0)
// node vote.js || node fallback.js -- fallback si exit(1)

// dans une CI/CD :
// si le script sort avec un code != 0 : le pipeline échoue automatiquement

try {
 await runCommand(command, flags);
 process.exit(0); // succès
} catch (err) {
 console.error(colorize(` ${err.message}`, "red"));
 process.exit(1); // erreur
}
```

---

## EXERCICES

## EXO 1 : le parser complet

Écris `parseArgs(argv)` qui supporte :

- les flags `--key value`
- les flags boolean `--verbose`
- les flags `--key=value` (avec signe égal, sans espace)
- les arguments positionnels (sans `--`) : `node script.js upload file.csv`

Retourne `{ command, flags, positionals }`.

---

## EXO 2 : le CLI de vote minimal

Crée un script `vote.js` avec ces commandes :

- `vote --player <nom> --points <n>` : enregistre un vote en mémoire
- `rank` : affiche le top 5 des joueurs triés par points
- `reset` : remet les votes à zéro

Ajoute une aide (`--help`), de la validation, et les couleurs. Les votes persistent dans un fichier JSON (voir le module suivant pour la partie filesystem).

---

## EXO 3 : la barre de progression

Implémente `progressBar(current, total, width = 30)` qui affiche une barre de progression dans le terminal, sur la même ligne (pas de saut de ligne à chaque update) :

```
[ Comptage des votes ] [██████████░░░░░░░░░░░░░░░░░░░░] 33% (330k / 1M)
```

Utilise `\r` pour réécrire la même ligne. Teste avec un `setInterval` qui incrémente le compteur.

---

## RÉSUMÉ

Un CLI Node lit ses arguments depuis `process.argv.slice(2)`. Les flags `--key value` se parsent manuellement ou avec une lib. `stdout` pour les outputs normaux, `stderr` pour les erreurs : toujours les deux séparément. Les codes de sortie (`process.exit(0)` / `process.exit(1)`) sont la convention que les pipelines bash et les CI/CD attendent. Les codes ANSI donnent les couleurs, mais toujours avec un check `isTTY` pour ne pas polluer les pipes.
