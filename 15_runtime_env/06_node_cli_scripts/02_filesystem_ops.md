---
stability: intemporel
---

# FILESYSTEM : LIRE ET ÉCRIRE SANS S'ARRACHER LES CHEVEUX
Temps de lecture ~8 min

Tout finit par toucher le disque. Les fichiers de config, les logs, les exports CSV, les données de cache, les résultats d'un script. `fs`, `path`, `readline` : le kit de base pour interagir avec le système de fichiers sans se prendre les pieds dans les chemins relatifs et les encodages.

---

## 1) LES DEUX VERSIONS DE FS : CALLBACK VS PROMISES

```js
// l'ancienne version (toujours disponible, à éviter dans le nouveau code)
import fs from "node:fs";

fs.readFile("./votes.json", "utf-8", (err, data) => {
 if (err) throw err;
 console.log(JSON.parse(data));
});

// la version moderne : fs/promises:async/await natif
import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";

const data = await readFile("./votes.json", "utf-8");
const votes = JSON.parse(data);
// si le fichier n'existe pas : throw ENOENT
// si les permissions manquent : throw EACCES
```

---

## 2) LIRE ET ÉCRIRE DES FICHIERS

```js
import { readFile, writeFile, appendFile } from "node:fs/promises";

// ---- lire ----
async function loadVotes(filepath) {
 try {
  const raw = await readFile(filepath, "utf-8");
  return JSON.parse(raw);
 } catch (err) {
  if (err.code === "ENOENT") {
   // fichier inexistant : retourner un état vide plutôt que crasher
   return [];
  }
  throw err; // autre erreur (permissions, disque plein...) : on laisse remonter
 }
}

// ---- écrire (remplace le contenu entier) ----
async function saveVotes(filepath, votes) {
 await writeFile(filepath, JSON.stringify(votes, null, 2), "utf-8");
 // null, 2 = JSON indenté avec 2 espaces:lisible dans le terminal
}

// ---- ajouter sans écraser ----
async function appendLog(filepath, entry) {
 const line = JSON.stringify(entry) + "\n"; // NDJSON : un objet JSON par ligne
 await appendFile(filepath, line, "utf-8");
}
```

---

## 3) PATH : CONSTRUIRE DES CHEMINS SANS LES BUGS

```js
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// en ESM : reconstruire __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// construire des chemins cross-platform (Windows utilise \, Linux/Mac utilisent /)
const configPath = path.join(__dirname, "config", "votes.json");
// '/app/config/votes.json' sur Linux
// 'C:\\app\\config\\votes.json' sur Windows (path.join gère ça)

// décomposer un chemin
const info = path.parse("/app/data/players.csv");
// { root: '/', dir: '/app/data', base: 'players.csv', ext: '.csv', name: 'players' }

console.log(info.ext); // '.csv':avec le point
console.log(info.name); // 'players':sans extension
console.log(info.dir); // '/app/data'

// chemin relatif vs absolu
path.isAbsolute("./votes.json"); // false
path.isAbsolute("/app/votes.json"); // true

// résoudre depuis le répertoire courant
path.resolve("./votes.json"); // '/app/votes.json' si process.cwd() = '/app'
```

---

## 4) VÉRIFIER CE QUI EXISTE

```js
import { access, stat, constants } from "node:fs/promises";

// vérifier l'existence d'un fichier ou dossier
async function exists(filepath) {
 try {
  await access(filepath, constants.F_OK);
  return true;
 } catch {
  return false;
 }
}

// vérifier les permissions
async function isReadable(filepath) {
 try {
  await access(filepath, constants.R_OK);
  return true;
 } catch {
  return false;
 }
}

// infos sur un fichier
async function getFileInfo(filepath) {
 const info = await stat(filepath);
 return {
  size: info.size, // en octets
  isFile: info.isFile(),
  isDirectory: info.isDirectory(),
  modified: info.mtime, // Date de dernière modification
  created: info.birthtime, // Date de création
 };
}
```

---

## 5) MANIPULER LES DOSSIERS

```js
import { mkdir, readdir, rm } from "node:fs/promises";

// créer un dossier (et les parents si nécessaire)
await mkdir("./exports/2026/final", { recursive: true });
// recursive: true = pas d'erreur si le dossier existe déjà

// lister le contenu d'un dossier
const entries = await readdir("./data");
// ['players.json', 'votes.json', 'config']:noms seulement

// avec les infos sur chaque entrée
const detailed = await readdir("./data", { withFileTypes: true });
detailed.forEach((entry) => {
 if (entry.isFile()) {
  console.log(`fichier : ${entry.name}`);
 } else if (entry.isDirectory()) {
  console.log(`dossier : ${entry.name}/`);
 }
});

// supprimer (récursivement)
await rm("./exports/old", { recursive: true, force: true });
// force: true = pas d'erreur si ça n'existe pas
```

---

## 6) TRAVERSER UNE ARBORESCENCE

```js
import { readdir } from "node:fs/promises";
import path from "node:path";

// lister tous les fichiers d'un dossier récursivement
async function walkDir(dir, extensions = null) {
 const entries = await readdir(dir, { withFileTypes: true });
 const files = [];

 for (const entry of entries) {
  const fullPath = path.join(dir, entry.name);

  if (entry.isDirectory()) {
   // récursion : on descend dans le sous-dossier
   const subFiles = await walkDir(fullPath, extensions);
   files.push(...subFiles);
  } else if (entry.isFile()) {
   // filtre optionnel par extension
   if (!extensions || extensions.includes(path.extname(entry.name))) {
    files.push(fullPath);
   }
  }
 }

 return files;
}

// trouver tous les fichiers JSON dans le dossier data
const jsonFiles = await walkDir("./data", [".json"]);
console.log(jsonFiles);
// ['./data/votes.json', './data/players.json', './data/archives/2025.json']
```

---

## 7) READLINE : LIRE LIGNE PAR LIGNE

```js
import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";

// lire un CSV ligne par ligne sans le charger en mémoire
async function parseCSV(filepath) {
 const stream = createReadStream(filepath);
 const rl = createInterface({ input: stream, crlfDelay: Infinity });

 const rows = [];
 let isFirstLine = true;

 for await (const line of rl) {
  if (isFirstLine) {
   isFirstLine = false;
   continue; // on saute le header
  }
  if (line.trim()) {
   // on ignore les lignes vides
   rows.push(line.split(",").map((s) => s.trim()));
  }
 }

 return rows;
}

// interactif : poser une question dans le terminal et attendre la réponse
function prompt(question) {
 const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
 });

 return new Promise((resolve) => {
  rl.question(question, (answer) => {
   rl.close();
   resolve(answer.trim());
  });
 });
}

// usage
const playerName = await prompt("Entrez le nom du joueur : ");
const pointsStr = await prompt("Points (1-15) : ");
```

---

## EXERCICES

## EXO 1 : la persistance du vote

Reprends le CLI de vote de la leçon précédente. Ajoute la persistance :

- les votes sont sauvegardés dans `./data/votes.json` après chaque `vote`
- au démarrage, les votes existants sont chargés depuis ce fichier
- si le fichier n'existe pas : démarrer avec un tableau vide

---

## EXO 2 : l'export CSV

Écris `exportRanking(votes, outputPath)` qui :

- calcule le classement depuis les votes
- écrit un CSV avec les colonnes `rank,player,points,votes`
- crée le dossier parent si nécessaire
- log le nombre de joueurs exportés

---

## EXO 3 : le nettoyeur d'archives

Écris un script `cleanup.js` qui :

- traverse le dossier `./logs`
- trouve tous les fichiers `.log` modifiés il y a plus de 30 jours
- les déplace dans `./logs/archive/` (en les renommant `YYYY-MM-DD_nom-original.log`)
- affiche un résumé : combien de fichiers déplacés, taille totale libérée

---

## RÉSUMÉ

`fs/promises` pour tout le async. `path.join()` pour les chemins cross-platform. `stat()` pour vérifier existence et métadonnées. `readdir({ withFileTypes: true })` pour distinguer fichiers et dossiers. `readline.createInterface` pour lire ligne par ligne sans charger tout en mémoire. Les codes d'erreur `err.code` (ENOENT, EACCES, EEXIST) pour gérer proprement les cas d'échec.
