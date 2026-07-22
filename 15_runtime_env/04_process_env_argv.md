---
stability: intemporel
---

# PROCESS.ENV ET PROCESS.ARGV : LA CONFIG QUI NE SE HARD-CODE PAS
Temps de lecture ~8 min

Hard-coder une clé API dans le code, c'est l'erreur de débutant qui finit sur GitHub, puis dans les logs de ton concurrent, puis dans une post-mortem. Hard-coder un chemin de base de données, c'est le script qui marche sur ta machine et crash en prod.

`process.env` et `process.argv` existent pour ça : lire la config de l'extérieur, sans la mettre dans le code. C'est la différence entre du code réutilisable et du code jetable.

---

## 1) PROCESS.ENV : LES VARIABLES D'ENVIRONNEMENT

```js
// process.env = un objet qui contient les variables d'environnement du système
// elles sont injectées au démarrage du processus, pas dans le code

console.log(process.env.NODE_ENV); // 'development' | 'production' | 'test'
console.log(process.env.PORT); // '3000':toujours une string, jamais un number
console.log(process.env.DB_URL); // 'postgresql://localhost:5432/mydb'
console.log(process.env.API_KEY); // undefined si non définie
```

Comment les définir :

```bash
# en ligne de commande (temporaire, pour ce processus uniquement)
PORT=8080 NODE_ENV=production node server.js

# dans un fichier .env (avec dotenv)
# ne jamais commit ce fichier : toujours dans .gitignore
```

```js
// avec dotenv : charger un fichier .env dans process.env
import "dotenv/config";
// ou
import dotenv from "dotenv";
dotenv.config();

// maintenant process.env.API_KEY est disponible si .env contient :
// API_KEY=secret123
```

---

## 2) LIRE LES ENV VARS PROPREMENT

Le piège : `process.env` retourne toujours une string ou `undefined`. Jamais un number, jamais un boolean.

```js
// mauvais : on fait confiance à ce qui arrive
const port = process.env.PORT;
app.listen(port); // port est une string '3000', pas le number 3000
// Express coerce ça... mais d'autres libs ne le font pas

// mauvais : boolean piège classique
const debug = process.env.DEBUG;
if (debug) {
 /* ... */
} // 'false' est truthy:le string 'false' n'est pas false

// bon : on valide et on convertit à l'entrée
function getConfig() {
 const port = parseInt(process.env.PORT ?? "3000", 10);
 const debug = process.env.DEBUG === "true";
 const apiKey = process.env.API_KEY;

 if (!apiKey) {
  throw new Error(
   "API_KEY manquante : configure la variable d'environnement",
  );
 }

 return { port, debug, apiKey };
}

// toutes les erreurs de config éclatent au démarrage, pas en cours de route
const config = getConfig();
```

---

## 3) PROCESS.ARGV : LES ARGUMENTS EN LIGNE DE COMMANDE

```js
// process.argv = tableau des arguments passés à Node
// argv[0] = chemin de node
// argv[1] = chemin du script
// argv[2+] = tes arguments

// commande : node ballon-dor.js --player "Messi" --year 2026
console.log(process.argv);
// [
//  '/usr/bin/node',   -- argv[0] : l'exécutable node
//  '/app/ballon-dor.js', -- argv[1] : ton script
//  '--player',      -- argv[2] : premier arg
//  'Messi',       -- argv[3] : valeur du premier arg
//  '--year',       -- argv[4]
//  '2026'        -- argv[5] : toujours une string
// ]

// récupérer uniquement tes args (sans node et le script)
const args = process.argv.slice(2);
// ['--player', 'Messi', '--year', '2026']
```

---

## 4) PARSER LES ARGS MANUELLEMENT

```js
// parser basique pour comprendre la mécanique
function parseArgs(argv) {
 const args = {};
 const raw = argv.slice(2); // on enlève node et le script

 for (let i = 0; i < raw.length; i++) {
  const current = raw[i];

  if (current.startsWith("--")) {
   const key = current.slice(2); // '--player' -> 'player'
   const next = raw[i + 1];

   if (!next || next.startsWith("--")) {
    // flag sans valeur : --verbose
    args[key] = true;
   } else {
    // flag avec valeur : --player Messi
    args[key] = next;
    i++; // on saute la valeur, on l'a déjà consommée
   }
  }
 }

 return args;
}

// node vote.js --player "Lamine Yamal" --year 2026 --verbose
const { player, year, verbose } = parseArgs(process.argv);
console.log(player); // 'Lamine Yamal'
console.log(year); // '2026':string, à convertir si besoin
console.log(verbose); // true:flag sans valeur
```

---

## 5) PROCESS.STDIN, STDOUT, STDERR

```js
// process.stdout : écrire dans le terminal (sans newline automatique)
process.stdout.write("Calcul en cours...");
// après traitement
process.stdout.write(" OK\n");

// process.stderr : pour les erreurs (séparé de stdout)
// utile pour rediriger les erreurs indépendamment
process.stderr.write("Erreur critique : fichier introuvable\n");

// process.stdin : lire depuis le terminal (interactif)
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (input) => {
 const vote = input.trim();
 console.log(`Vote enregistré : ${vote}`);
});

// lire stdin en mode pipe (données provenant d'une autre commande)
// cat players.txt | node process-votes.js
if (!process.stdin.isTTY) {
 // les données arrivent depuis un pipe, pas depuis un clavier
 let data = "";
 process.stdin.on("data", (chunk) => (data += chunk));
 process.stdin.on("end", () => processVotes(data));
}
```

---

## 6) PROCESS : LES AUTRES PROPRIÉTÉS UTILES

```js
// sortir du processus avec un code
process.exit(0); // succès
process.exit(1); // erreur:convention universelle
// ne jamais utiliser process.exit() dans une lib : uniquement dans les CLIs et scripts

// gérer les erreurs non catchées
process.on("uncaughtException", (err) => {
 console.error("Exception non catchée :", err.message);
 process.exit(1); // on quitte proprement plutôt que de continuer dans un état cassé
});

process.on("unhandledRejection", (reason) => {
 console.error("Promise non gérée :", reason);
 process.exit(1);
});

// infos sur le processus
console.log(process.pid); // PID du processus
console.log(process.platform); // 'linux' | 'darwin' | 'win32'
console.log(process.cwd()); // répertoire de travail courant
console.log(process.memoryUsage().heapUsed); // mémoire consommée par V8
```

---

## EXERCICES

## EXO 1 : le loader de config sécurisé

Écris `loadConfig()` qui lit ces variables d'environnement :

- `PORT` (number, défaut 3000)
- `NODE_ENV` ('development' | 'production' | 'test', défaut 'development')
- `DB_URL` (string, obligatoire)
- `DEBUG` (boolean, défaut false)

Si une variable obligatoire manque : throw une erreur claire avec le nom de la variable. Si une valeur est invalide (NODE_ENV avec une valeur non autorisée) : throw une erreur claire.

---

## EXO 2 : le parser d'arguments du vote

Le script `vote.js` accepte ces flags :

- `--player <nom>` (obligatoire)
- `--points <number>` (obligatoire, entre 1 et 15)
- `--journalist <nom>` (optionnel)
- `--dry-run` (flag, pas de valeur)

Écris `parseVoteArgs(argv)` qui retourne un objet validé. Si `--player` ou `--points` manquent : affiche une erreur dans stderr et appelle `process.exit(1)`.

---

## EXO 3 : le script qui lit stdin

Écris un script `count-goals.js` qui :

- reçoit des lignes JSON sur stdin (une par ligne)
- chaque ligne : `{"player": "Messi", "type": "goal", "minute": 23}`
- filtre uniquement les events de type `goal`
- affiche le total par joueur dans stdout à la fin
- usage : `cat match-events.ndjson | node count-goals.js`

---

## RÉSUMÉ

`process.env` donne accès aux variables d'environnement : toujours des strings, à valider et convertir à l'entrée. `process.argv` donne les arguments de la ligne de commande : `argv[0]` et `argv[1]` c'est Node et le script, tes args commencent à `argv[2]`. `process.exit(1)` pour les erreurs, `process.exit(0)` pour le succès. `uncaughtException` et `unhandledRejection` : toujours gérer dans les CLIs pour éviter les crashs silencieux.
