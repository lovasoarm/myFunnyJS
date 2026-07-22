---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# SINGLETON PATTERN
Temps de lecture ~11 min

Dans Breaking Bad, il n'y a qu'un seul cook qui dirige le labo à la fois.
Deux Walter White qui décident en même temps : c'est la catastrophe, deux lots incompatibles, deux stocks en conflit.
Une seule instance. Une seule source de vérité. C'est ça, le Singleton.

Le Singleton garantit qu'une classe ne peut être instanciée qu'une seule fois.
Toute tentative de créer une deuxième instance retourne la première.

Cas d'usage légitimes : config globale d'une app, connexion DB partagée, logger centralisé, état partagé de cache.
Cas dangereux : tout le reste. Le Singleton est souvent le premier pas vers le God Object.

---

## 1) LE PROBLÈME QUE SINGLETON RÉSOUT

Certaines ressources doivent exister en un seul exemplaire dans tout le processus.

```js
// sans singleton : deux connexions DB différentes, deux états différents
const db1 = new DatabaseConnection({ host: "localhost", db: "foxriver" });
const db2 = new DatabaseConnection({ host: "localhost", db: "foxriver" });

// db1 et db2 sont deux objets distincts
// si db1 ouvre une transaction, db2 ne le sait pas
// résultat : états incohérents, fuites de connexions, chaos

console.log(db1 === db2); // false:catastrophe
```

Le Singleton fixe ça : une seule connexion, partagée par tout le code qui en a besoin.

---

## 2) IMPLÉMENTATION CLASSIQUE

```js
class LabManager {
 constructor(cook, location) {
  // si une instance existe déjà, on la retourne directement
  if (LabManager._instance) {
   return LabManager._instance;
  }

  // première instanciation : on construit vraiment
  this.cook = cook;
  this.location = location;
  this.batches = [];
  this.status = "operational";

  // on stocke la référence sur la classe elle-même
  LabManager._instance = this;
 }

 addBatch(purity, quantity) {
  this.batches.push({ purity, quantity, timestamp: Date.now() });
  console.log(`Nouveau lot : ${purity}% : ${quantity}kg`);
 }

 getStatus() {
  return `${this.cook} @ ${this.location} : ${this.batches.length} lots jutsus`;
 }

 // réinitialiser l'instance (utile en test uniquement)
 static reset() {
  LabManager._instance = null;
 }
}

const lab1 = new LabManager("Walter White", "Superlab");
const lab2 = new LabManager("Gustavo", "Autre endroit"); // ignoré : instance déjà là

console.log(lab1 === lab2); // true : même objet
console.log(lab2.cook); // "Walter White" : le second new n'a rien écrasé

lab1.addBatch(99.1, 50);
console.log(lab2.getStatus()); // voit aussi le lot ajouté via lab1
// "Walter White @ Superlab : 1 lots jutsus"
```

```
new LabManager()  --> _instance null ?
              |
          oui : on crée, on stocke
              |
          non : on retourne l'existante

new LabManager()  --> _instance existe ?
              |
          oui : on retourne la même
              |
          (le new est ignoré silencieusement)
```

---

## 3) SINGLETON AVEC MODULE

En JS moderne, le module pattern donne un Singleton naturel : un module est chargé une seule fois, son état persiste pour toute la durée du processus.

```js
// config.js:chargé une seule fois par le runtime Node
// tous les imports de ce fichier reçoivent le même objet

let _initialized = false;
let _config = {};

function init(overrides = {}) {
 if (_initialized) {
  // deuxième init : on refuse, on ne silencieuse pas
  throw new Error(
   "Config déjà initialisée : appeler init() deux fois c'est suspect",
  );
 }

 _config = {
  env: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  dbHost: process.env.DB_HOST || "localhost",
  ...overrides,
 };

 _initialized = true;
 console.log(`Config initialisée pour l'env : ${_config.env}`);
}

function get(key) {
 if (!_initialized) {
  throw new Error(`Config non initialisée. Appelle init() d'abord.`);
 }
 return _config[key];
}

function getAll() {
 return { ..._config }; // copie : personne ne modifie l'interne
}

export { init, get, getAll };
```

```js
// main.js
import { init, get } from "./config.js";

init({ env: "production", logLevel: "warn" });
console.log(get("env")); // "production"

// ailleurs dans le code
import { get } from "./config.js";
console.log(get("env")); // toujours "production" : même module, même état
```

C'est la forme la plus propre de Singleton en JS.
Pas de classe. Pas de `_instance`. Juste le système de modules qui fait le boulot.

---

## 4) SINGLETON EN PRATIQUE : LE LOGGER

```js
// logger.js:un seul logger pour toute l'app
const levels = { debug: 0, info: 1, warn: 2, error: 3 };

let _level = "info";
let _history = [];

const logger = {
 setLevel(lvl) {
  if (!levels[lvl]) throw new Error(`Niveau inconnu : ${lvl}`);
  _level = lvl;
 },

 log(level, message, context = {}) {
  if (levels[level] < levels[_level]) return; // filtré selon le niveau actuel

  const entry = {
   timestamp: new Date().toISOString(),
   level,
   message,
   ...context,
  };

  _history.push(entry);
  console.log(JSON.stringify(entry));
 },

 info: (msg, ctx) => logger.log("info", msg, ctx),
 warn: (msg, ctx) => logger.log("warn", msg, ctx),
 error: (msg, ctx) => logger.log("error", msg, ctx),

 getHistory: () => [..._history], // copie défensive
 clear: () => {
  _history = [];
 }, // pour les tests
};

// on exporte l'objet directement : c'est le singleton
export default logger;
```

```js
// n'importe où dans l'app
import logger from "./logger.js";

logger.info("Connexion DB établie", { host: "localhost" });
logger.warn("Rate limit atteint", { endpoint: "/api/vote" });

// dans un autre fichier, même import, même objet, même historique
import logger from "./logger.js";
logger.getHistory(); // contient les deux entrées précédentes
```

---

## 5) CAS QUI CASSE : LES DANGERS DU SINGLETON

### Problème 1 : couplage global caché

```js
// n'importe quelle fonction peut accéder et modifier le state global
import missionState from "./missionState.js"; // singleton

function terminerMission(id) {
 // cette fonction modifie le state global sans que l'appelant le sache
 missionState.set("derniereMission", id);
 missionState.set("rapportEnAttente", true);
 // et si une autre fonction lit missionState.rapportEnAttente au mauvais moment ?
}
```

Le Singleton crée des effets de bord invisibles.
Les fonctions semblent indépendantes : elles ne le sont pas.

### Problème 2 : tests qui s'interfèrent

```js
// test A modifie le singleton
import config from "./config.js";
config.set("env", "test-a");

// test B lit le singleton modifié par A
// si les tests tournent dans le même processus : test B voit l'état de test A
import config from "./config.js";
console.log(config.get("env")); // "test-a":bug de test non obvious
```

C'est pour ça que chaque Singleton sérieux expose une méthode `reset()` pour les tests.
Et c'est pour ça que beaucoup de gens préfèrent l'injection de dépendances.

### Problème 3 : parallélisme (dans les workers)

```js
// en Node avec Worker Threads : chaque worker a son propre module scope
// ton "singleton" n'est pas partagé entre workers
// si tu comptes sur le singleton pour synchroniser des workers : erreur d'architecture
```

Un Singleton ne traverse pas les Workers. Si tu en as besoin : utilise une DB, un cache Redis, ou un message bus.

---

## 6) SINGLETON VS INJECTION DE DÉPENDANCES

Le Singleton est souvent le premier réflexe. L'injection de dépendances est souvent la meilleure décision.

```js
// singleton : couplage fort, difficile à tester
class PlayerService {
 getTopScorer() {
  // dbConnection est global, impossible à remplacer en test
  return dbConnection.query(
   "SELECT * FROM players ORDER BY goals DESC LIMIT 1",
  );
 }
}

// injection : découplé, testable, flexible
class PlayerService {
 constructor(db) {
  this.db = db; // injecté : peut être le vrai ou un mock
 }

 getTopScorer() {
  return this.db.query("SELECT * FROM players ORDER BY goals DESC LIMIT 1");
 }
}

// en prod : vrai DB
const service = new PlayerService(realDb);

// en test : mock DB
const service = new PlayerService({
 query: () => [{ name: "Mbappé", goals: 32 }],
});
```

Règle : si le Singleton est utilisé dans du code qui doit être testé, préfère l'injection.
Le Singleton convient quand la ressource est vraiment unique et globale par nature : config, logger, connexion unique à une ressource externe.

---

## EXERCICES

## EXO 1 : LE CAMP DE RICK GRIMES

Le camp des survivants dans The Walking Dead a un seul `CampManager`.
Il gère l'inventaire global, le nombre de survivants, le niveau d'alerte (0 à 5).

Crée ce Singleton avec :

- `addSurvivor(name)` : ajoute un survivant
- `removeSupply(item, quantity)` : retire une quantité d'un item de l'inventaire (throw si stock insuffisant)
- `setAlertLevel(level)` : 0 à 5 uniquement (throw sinon)
- `getReport()` : retourne un objet avec survivants, inventaire, niveau d'alerte
- `static reset()` : pour les tests

Crée deux variables `camp1` et `camp2` depuis `new CampManager()`.
Prouve que `camp1 === camp2`.
Montre que modifier via `camp1` est visible via `camp2`.

---

## EXO 2 : LA CONFIG DE PRISON BREAK

Michael Scofield n'initialise le plan d'évasion qu'une seule fois.
Après ça, tous les détenus qui consultent le plan voient la même version.

Crée un module `escapePlan.js` (Singleton module pattern) avec :

- `init(prisonName, cellBlock, totalPhases)` : initialise le plan (throw si déjà initialisé)
- `addPhase(description, responsible)` : ajoute une phase au plan
- `completePhase(index)` : marque une phase comme complétée
- `getProgress()` : retourne le nombre de phases complétées vs total
- `reset()` : pour les tests uniquement

Simule trois fichiers différents qui importent `escapePlan.js` et interagissent avec le même état.

---

## EXO 3 : LE DANGER DU GLOBAL

Voici un Singleton de cache partagé :

```js
const cache = {
 _data: {},
 set(key, value) {
  this._data[key] = value;
 },
 get(key) {
  return this._data[key];
 },
};
export default cache;
```

Identifie deux problèmes concrets que ce cache peut causer dans une app multi-fonctions.
Réécris-le en version défensive : TTL par entrée, getter qui retourne `null` si expiré, méthode `clear()` pour les tests.

---

## EXO 4 : SINGLETON OU INJECTION ?

Pour chacun des cas suivants, décide si un Singleton est adapté ou si l'injection de dépendances est préférable. Justifie en une phrase :

1. Logger JSON qui écrit dans `stdout` : tous les modules l'utilisent
2. Connexion WebSocket vers un serveur de match en temps réel
3. Service qui envoie des emails : utilisé dans 3 controllers différents
4. Config d'environnement lue depuis `process.env` au démarrage
5. Compteur de votes du Ballon d'Or partagé entre plusieurs routes Express

---

## RÉSUMÉ

Le Singleton garantit une instance unique d'une ressource partagée dans tout le processus.
En JS, la forme la plus propre c'est le module pattern : un fichier exporté = un singleton naturel.
Les cas légitimes sont rares et précis : config, logger, connexion unique à une ressource externe.
Les dangers sont réels : couplage global caché, tests qui s'interfèrent, parallélisme qui casse.
Dès que le Singleton est utilisé dans du code métier testable : c'est probablement le mauvais choix. L'injection de dépendances est plus solide, plus flexible, et plus honnête sur ce que le code consomme.
