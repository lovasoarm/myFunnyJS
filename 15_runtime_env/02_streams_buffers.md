---
stability: intemporel
---

# STREAMS ET BUFFERS : LIRE SANS AVALER
Temps de lecture ~8 min

Charger un fichier de 2GB en mémoire pour le lire ligne par ligne : c'est comme avaler tout un repas d'un coup pour savoir si ça a bon goût. Résultat : t'exploites toute la RAM, le processus crash, et l'utilisateur attend.

Les streams règlent ça. Tu lis par morceaux, tu traites pendant que ça arrive, et tu n'accumules jamais ce que tu n'as pas besoin de garder. C'est le modèle derrière nginx, les téléchargements, les pipelines de données, les logs en prod.

---

## 1) CE QU'EST UN BUFFER

Un Buffer, c'est un bloc de mémoire brute en dehors du heap V8. Il stocke des données binaires : des octets, pas des caractères. Avant de lire un fichier texte, les données passent par là.

```js
// créer un buffer depuis une string
const buf = Buffer.from("Ballon dOrient", "utf-8");
// les octets bruts : [66, 97, 108, 108, 111, 110, ...]
console.log(buf);

// lire la longueur en octets (pas en caractères)
console.log(buf.length); // 14 octets pour 14 caractères ASCII
// mais un 'é' UTF-8 = 2 octets, pas 1

// convertir en string
console.log(buf.toString("utf-8")); // 'Ballon dOrient'

// buffer depuis un tableau d'octets
const raw = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
console.log(raw.toString()); // 'Hello'
```

Le buffer existe parce que V8 ne gère pas efficacement les données binaires massives. Pour les fichiers, les sockets, les streams réseau : tout passe par des Buffers avant de devenir des strings.

---

## 2) LES 4 TYPES DE STREAMS

```
Readable  --> on reçoit des données (lecture de fichier, requête HTTP entrante)
Writable  --> on envoie des données (écriture de fichier, réponse HTTP)
Duplex   --> les deux en même temps (socket TCP)
Transform  --> on reçoit, on transforme, on renvoie (compression gzip, chiffrement)
```

```js
import { createReadStream, createWriteStream } from "node:fs";

// lire un fichier de log en stream
// jamais chargé entièrement en mémoire : chunk par chunk
const reader = createReadStream("./logs/match.log", {
 encoding: "utf-8",
 highWaterMark: 64 * 1024, // taille des chunks : 64KB à la fois
});

reader.on("data", (chunk) => {
 // chunk = un morceau du fichier, pas le fichier entier
 process.stdout.write(chunk);
});

reader.on("end", () => {
 console.log("fichier lu complètement");
});

reader.on("error", (err) => {
 // si le fichier n'existe pas, si les permissions manquent
 console.error("erreur lecture :", err.message);
});
```

---

## 3) LE PIPE : BRANCHER UN STREAM SUR UN AUTRE

```js
import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";

// compresser un fichier de 500MB sans jamais le charger en mémoire
// chaque chunk est lu --> compressé --> écrit immédiatement
createReadStream("./replays/finale.mp4")
 .pipe(createGzip()) // transform : compresse à la volée
 .pipe(createWriteStream("./replays/finale.mp4.gz"))
 .on("finish", () => {
  console.log("compression terminée");
 });

// ce qui se passe en mémoire pendant l'opération :
// pas 500MB:juste 64KB de buffer à la fois
// le reste : toujours sur le disque
```

---

## 4) STREAM AVEC ASYNC ITERATOR : LA FAÇON MODERNE

```js
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

// lire un fichier CSV ligne par ligne
// sans jamais charger tout le CSV en mémoire
async function processMatchStats(filepath) {
 const stream = createReadStream(filepath);
 const lines = createInterface({ input: stream });

 const results = [];

 for await (const line of lines) {
  // chaque ligne arrive une par une
  const [joueur, buts, passes] = line.split(",");
  results.push({ joueur, buts: +buts, passes: +passes });
 }

 return results;
}

// sur un CSV de 1M de lignes : mémoire stable
// sans stream : on charge tout avant de traiter la première ligne
```

---

## 5) LE CAS QUI CASSE : BACKPRESSURE

```js
// le problème : le readable envoie plus vite que le writable peut consommer
const fastReader = createReadStream("./big_file.bin");
const slowWriter = createWriteStream("./output.bin");

// mauvaise version : on ignore le signal "stop"
fastReader.on("data", (chunk) => {
 slowWriter.write(chunk); // write() retourne false si le buffer est plein
 // on ignore ça -> la mémoire explose
});

// bonne version : on respecte la backpressure
fastReader.on("data", (chunk) => {
 const canContinue = slowWriter.write(chunk);
 if (!canContinue) {
  // le writer est saturé : on pause le reader
  fastReader.pause();
  slowWriter.once("drain", () => {
   // le writer a vidé son buffer : on reprend
   fastReader.resume();
  });
 }
});

// version encore plus simple : pipe() gère la backpressure automatiquement
fastReader.pipe(slowWriter);
```

La backpressure c'est le mécanisme qui empêche un stream rapide de noyer un stream lent. `pipe()` le gère pour toi. Si tu gères les events manuellement : t'as besoin de le gérer toi-même.

---

## 6) STREAM TRANSFORM : FABRIQUER LE SIEN

```js
import { Transform } from "node:stream";

// un transformer qui compte les buts dans un flux de données de match
class GoalCounter extends Transform {
 constructor() {
  super({ objectMode: true }); // on travaille avec des objets, pas des buffers
  this.goals = 0;
 }

 _transform(event, encoding, callback) {
  // event = un objet JS qui représente un event du match
  if (event.type === "goal") {
   this.goals++;
   this.push({ ...event, totalGoals: this.goals }); // on enrichit et on passe
  } else {
   this.push(event); // on laisse passer sans modifier
  }
  callback(); // "j'ai fini, envoie le prochain chunk"
 }
}

// usage
const counter = new GoalCounter();
matchEventStream.pipe(counter).pipe(destinationStream);
```

---

## EXERCICES

## EXO 1 : le compteur de lignes

Écris `countLines(filepath)` : une fonction async qui retourne le nombre de lignes d'un fichier sans jamais le charger entièrement en mémoire. Contrainte : utiliser `createInterface` + `for await`.

---

## EXO 2 : le filtre de stream

T'as un fichier de logs bruts. Chaque ligne est un event JSON. Écris un Transform stream `FilterByType(type)` qui laisse passer uniquement les events dont `event.type === type`. Branche-le entre un ReadStream et un WriteStream.

---

## EXO 3 : le crash à expliquer

Ce code fonctionne sur un fichier de 10MB. Il crash sur un fichier de 2GB avec un `Heap out of memory`. Pourquoi ? Comment le corriger ?

```js
import { readFile, writeFile } from "node:fs/promises";

async function processLog(input, output) {
 const content = await readFile(input, "utf-8");
 const lines = content.split("\n").filter((l) => l.includes("ERROR"));
 await writeFile(output, lines.join("\n"));
}
```

---

## RÉSUMÉ

Un Buffer, c'est de la mémoire brute pour les données binaires. Un Stream, c'est un canal qui envoie ces données par morceaux. `pipe()` branche deux streams et gère la backpressure automatiquement. Les Transform streams permettent de transformer les données à la volée. La règle d'or : si les données peuvent être grandes, utilise un stream : jamais `readFile` suivi d'un traitement complet en mémoire.

> Note : 9.5/10 : la backpressure est rarement expliquée clairement. Les exemples football/logs sont bien ancrés. Moins 0.5 : un diagramme ASCII du pipeline read→transform→write aurait rendu le flow encore plus lisible.
