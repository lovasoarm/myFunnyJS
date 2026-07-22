---
stability: intemporel
---

# NODE VS BROWSER : MÊME JS, DEUX PLANÈTES
Temps de lecture ~8 min

Même langage. Même syntaxe. Même event loop. Mais t'essaies d'appeler `window` dans Node : crash. T'essaies de faire `fs.readFile` dans le navigateur : crash. Deux environnements, deux boîtes à outils, zéro overlap sur les APIs système.

En prod, savoir où ton code vit, ça détermine ce que tu peux faire, ce que tu ne peux pas faire, et pourquoi ça explose là où tu ne l'attendais pas.

---

## 1) LE RUNTIME : CE QUI TOURNE VRAIMENT SOUS LE CAPOT

JS ne s'exécute pas seul. Il faut un moteur. Les deux utilisent V8 (le moteur de Google). Mais V8 c'est juste le coeur : il évalue le JS, gère la mémoire, compile en JIT. Tout le reste, les APIs, l'accès aux fichiers, le réseau, le DOM, c'est l'environnement qui l'ajoute.

```
[ ton code JS ]
    |
    v
[ V8 : il exécute le JS ]
    |
 _____|_____
 |     |
 v     v
[Node]  [Browser]
 |     |
 v     v
[fs, os, [DOM, window,
 net,   fetch, canvas,
 child_  localStorage,
 process] Web Audio...]
```

Node ajoute des APIs système : fichiers, réseau, processus, threads.
Le navigateur ajoute des APIs UI : DOM, rendu, interactions utilisateur, stockage web.

---

## 2) CE QUE CHAQUE ENVIRONNEMENT APPORTE

**Dans le navigateur :**

```js
// le DOM : accès direct à la page HTML
document.querySelector(".card").addEventListener("click", () => {
 // l'utilisateur a cliqué : on réagit
 document.title = "clicked";
});

// le stockage web : persistance sans fichier
localStorage.setItem("token", "abc123");
const token = localStorage.getItem("token");

// fetch : HTTP depuis le navigateur (intégré, pas besoin d'import)
const data = await fetch("https://api.foot.com/matches").then((r) => r.json());

// window : l'objet global:il contient TOUT dans le navigateur
console.log(window === globalThis); // true
```

**Dans Node :**

```js
// fs : lire et écrire des fichiers sur le disque
import { readFile } from "node:fs/promises";
const content = await readFile("./data.json", "utf-8");

// process : infos sur le processus en cours
console.log(process.env.NODE_ENV); // 'development' ou 'production'
console.log(process.argv); // les arguments passés en ligne de commande

// os : infos sur la machine
import os from "node:os";
console.log(os.cpus().length); // combien de coeurs CPU sur cette machine

// globalThis : l'objet global dans Node (pas window, pas document)
console.log(globalThis === global); // true:mais window n'existe pas ici
```

---

## 3) LES ZONES DE DANGER : CE QUI EXPLOSE

```js
// ---- cas 1 : du code navigateur exécuté dans Node ----

// tu importes une lib qui fait ça :
const el = document.getElementById("app");
// ReferenceError: document is not defined
// Node ne sait pas ce qu'est un DOM

// ---- cas 2 : du code Node exécuté dans le navigateur ----

import { readFileSync } from "fs";
// ModuleNotFoundError:'fs' n'existe pas dans le navigateur

// ---- cas 3 : fetch:l'exception qui piège tout le monde ----

// fetch est natif dans le navigateur depuis toujours
// fetch est natif dans Node depuis v18 seulement
// avant Node 18 : tu devais installer node-fetch ou axios

// résultat en prod : ton code plante sur une ancienne version de Node
// et tu cherches le bug pendant 2 heures

// ---- cas 4 : l'objet global ----

// navigateur :
console.log(typeof window); // 'object'
console.log(typeof global); // 'undefined'

// Node :
console.log(typeof window); // 'undefined'
console.log(typeof global); // 'object'

// les deux :
console.log(typeof globalThis); // 'object':c'est l'API universelle depuis ES2020
```

---

## 4) DÉTECTER L'ENVIRONNEMENT DEPUIS LE CODE

```js
// méthode solide : tester globalThis
function getRuntime() {
 if (typeof window !== 'undefined') return 'browser'
 if (typeof process !== 'undefined' && process.versions?.node) return 'node'
 return 'unknown'
}

// usage concret : une lib qui s'adapte
function readConfig(path) {
 const runtime = getRuntime()

 if (runtime === 'node') {
  // on lit depuis le disque
  const { readFileSync } = await import('node:fs')
  return JSON.parse(readFileSync(path, 'utf-8'))
 }

 if (runtime === 'browser') {
  // on lit depuis le localStorage ou une API
  return JSON.parse(localStorage.getItem(path) ?? '{}')
 }

 throw new Error(`runtime inconnu : ${runtime}`)
}
```

Pourquoi c'est utile : les libs isomorphiques (qui tournent dans les deux environnements) font exactement ça. Lodash, date-fns, zod : ils détectent l'environnement et adaptent leur code.

---

## 5) LE TABLEAU QUI RÉSUME TOUT

```
API / fonctionnalité    Node   Browser  Notes
---------------------------------------------------------
Moteur JS          V8     V8    même coeur
Event loop         oui    oui   même mécanisme
fetch            v18+    oui   attention aux versions
DOM (document, window)   non    oui   ne pas importer côté Node
localStorage        non    oui   --
fs (lecture fichiers)    oui    non   --
process.env         oui    non   --
Worker Threads       oui    --    Web Workers côté navigateur
WebSocket (client)     oui*    oui   *via lib ws en Node
Canvas / WebGL       non    oui   --
crypto (Web Crypto API)   v15+    oui   API unifiée depuis Node 15
globalThis         oui    oui   l'objet global universel
```

---

## EXERCICES

## EXO 1 : le détective de runtime

T'écris une fonction `describeRuntime()` qui retourne un objet :

```js
{
 name: 'node' | 'browser' | 'unknown',
 version: string | null,  // version Node si disponible
 canReadFiles: boolean,
 canAccessDOM: boolean,
 globalObject: 'window' | 'global' | 'globalThis'
}
```

Contrainte : zero try/catch. Utilise uniquement des checks `typeof` et des accès optionnels (`?.`).

---

## EXO 2 : la lib qui s'adapte

T'écris une fonction `readData(key)` qui :

- dans Node : lit depuis un fichier JSON nommé `key + '.json'` dans le dossier courant
- dans le navigateur : lit depuis `localStorage.getItem(key)`
- dans les deux cas : retourne l'objet parsé, ou `null` si la donnée n'existe pas

Teste avec deux exports séparés si tu veux séparer les responsabilités.

---

## EXO 3 : la bombe à désamorcer

Ce code plante. T'as 3 bugs liés au mauvais environnement :

```js
import fs from "fs";

export function saveSession(userId, data) {
 window.sessionId = userId;
 localStorage.setItem("user", JSON.stringify(data));
 fs.writeFileSync(`./sessions/${userId}.json`, JSON.stringify(data));
 document.title = `Session : ${userId}`;
}
```

Identifie les problèmes et propose une version qui tourne dans Node uniquement.

---

## RÉSUMÉ

Node et navigateur partagent V8 et l'event loop. Tout le reste est différent. Le navigateur donne accès au DOM, à localStorage, aux APIs web. Node donne accès au filesystem, au processus, aux APIs système. `fetch` est universel depuis Node 18. `globalThis` est le seul objet global qui fonctionne partout. Pour détecter l'environnement : `typeof window` et `process.versions?.node`.
