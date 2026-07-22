---
stability: intemporel
---

# ASYNC ERROR TRAPS : LES ERREURS QUI TOMBENT EN SILENCE

Temps de lecture ~6 min


En synchrone, une erreur non catchée crash le programme immédiatement. Tu vois le problème.

En async, une erreur non catchée peut disparaître complètement. Ton code continue de tourner. Tu penses que tout va bien. En fait tu livres des données corrompues à l'opérateur depuis 3 heures.

C'est ça le vrai danger de l'async.

---

## 1) LE PIÈGE CLASSIQUE : PROMISE NON CATCHÉE

```js
// ce code "fonctionne":il ne crash pas
function chargerStatsMatch(id) {
 fetch(`/api/matchs/${id}`)
  .then((res) => res.json())
  .then((data) => {
   console.log("stats reçues :", data);
  });
 // pas de .catch()
 // si fetch échoue : l'erreur disparaît en silence
}

chargerStatsMatch(99999); // ID inexistant
// la Promise rejette
// personne ne l'attrape
// Node émet un warning "UnhandledPromiseRejection"
// en prod Node < 15 : le warning est loggué et le process continue
// en prod Node 15+ : le process crash avec exit code 1
```

```
call stack :
 chargerStatsMatch() --> fetch() --> Promise rejetée
 ...
 la fonction est déjà terminée
 personne pour attraper la Promise rejetée
 --> UnhandledPromiseRejection
```

---

## 2) TRY/CATCH AVEC ASYNC/AWAIT

La syntaxe qui rend l'async lisible : et qui récupère les erreurs naturellement.

```js
async function chargerStatsMatch(id) {
 try {
  const res = await fetch(`/api/matchs/${id}`);
  if (!res.ok) {
   throw new NotFoundError("Match", id);
   // fetch ne lève pas d'erreur sur les 404:tu dois le faire toi-même
  }
  const data = await res.json();
  return data;
 } catch (e) {
  if (e instanceof NotFoundError) {
   console.log(`Match ${id} introuvable`);
   return null;
  }
  // erreur réseau ou autre
  throw e;
 }
}
```

Attention : `fetch` ne rejette la Promise que sur des erreurs réseau (pas de connexion, CORS). Un status 404 ou 500 : la Promise résout quand même. Tu dois tester `res.ok` toi-même.

---

## 3) LE PIÈGE DU FOREACH ASYNC

```js
const matchIds = [1, 2, 3, 4, 5];

// MAUVAIS:le forEach n'attend pas les Promises
matchIds.forEach(async (id) => {
 const stats = await chargerStats(id); // retourne une Promise
 console.log(stats);
 // si ça throw ici : l'erreur est dans une Promise que forEach ignore
});

console.log("terminé");
// s'affiche AVANT les stats:forEach n'attend pas
// les erreurs dans les callbacks async : perdues
```

```js
// BON:for...of attend vraiment chaque itération
async function traiterTousLesMatchs(ids) {
 for (const id of ids) {
  try {
   const stats = await chargerStats(id);
   console.log(stats);
  } catch (e) {
   console.error(`Erreur match ${id} :`, e.message);
   // on continue avec les autres
  }
 }
}
```

```js
// BON:Promise.all pour les traitements en parallèle
async function traiterEnParallele(ids) {
 const resultats = await Promise.all(
  ids.map(async (id) => {
   try {
    return await chargerStats(id);
   } catch (e) {
    return { erreur: e.message, id };
    // chaque résultat est soit les stats soit l'erreur wrappée
   }
  }),
 );
 return resultats;
}
```

---

## 4) PROMISE.ALL : UN ÉCHEC COULE TOUT

```js
// Promise.all rejette dès qu'une seule Promise rejette
const [statsA, statsB, statsC] = await Promise.all([
 chargerStats(1), // ok
 chargerStats(999), // rejette
 chargerStats(3), // ok, mais jamais utilisé
]);
// si chargerStats(999) rejette :
// les résultats de 1 et 3 sont perdus
// même si ils ont réussi
```

```js
// Promise.allSettled:chaque résultat individuellement
const resultats = await Promise.allSettled([
 chargerStats(1),
 chargerStats(999),
 chargerStats(3),
]);

resultats.forEach((r, i) => {
 if (r.status === "fulfilled") {
  console.log(`Match ${i + 1} :`, r.value);
 } else {
  console.error(`Match ${i + 1} a échoué :`, r.reason.message);
 }
});
// les trois résultats, succès ou échec, tous disponibles
```

Règle : tu veux que tout réussisse ou rien → `Promise.all`. Tu veux traiter chaque résultat indépendamment → `Promise.allSettled`.

---

## 5) LE PIÈGE DU EVENT EMITTER ASYNC

```js
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("data", async (payload) => {
 // ce handler est async
 const result = await traiterPayload(payload);
 // si traiterPayload rejette :
 // la Promise retournée par le handler est perdue dans le vide
 // EventEmitter ne la surveille pas
});

emitter.emit("data", { matchId: 42 });
// les erreurs async dans les handlers EventEmitter : non catchées par défaut
```

Solution :

```js
emitter.on("data", async (payload) => {
 try {
  const result = await traiterPayload(payload);
  console.log(result);
 } catch (e) {
  emitter.emit("error", e); // déléguer au handler d'erreur de l'emitter
 }
});

emitter.on("error", (e) => {
 console.error("erreur dans le pipeline :", e.message);
});
```

---

## 6) TOP-LEVEL AWAIT ET GESTION D'ERREURS

Dans les modules ES (`type: "module"` ou `.mjs`), tu peux `await` au niveau module. Ce qui veut dire : les erreurs non catchées au top level crash le module entier.

```js
// index.mjs
const config = await chargerConfig();
// si chargerConfig() rejette et qu'il n'y a pas de try/catch
// le module entier échoue au chargement

// version solide
try {
 const config = await chargerConfig();
 demarrerApp(config);
} catch (e) {
 console.error("Impossible de charger la config :", e.message);
 process.exit(1); // crash propre avec message clair
}
```

---

## 7) PATTERN : RESULT TYPE POUR ÉVITER LES THROWS

Inspiré de Rust. Au lieu de throw, tu retournes un objet `{ ok, valeur, erreur }`.

```js
async function chargerStatsSafe(matchId) {
 try {
  const data = await chargerStats(matchId);
  return { ok: true, valeur: data };
 } catch (e) {
  return { ok: false, erreur: e };
 }
}

// utilisation:zéro throw, zéro try/catch à l'extérieur
const result = await chargerStatsSafe(42);

if (!result.ok) {
 console.error("stats indisponibles :", result.erreur.message);
 return;
}

console.log("xG :", result.valeur.xG);
```

Avantage : le code appelant n'a pas à se soucier des try/catch. L'erreur est une valeur normale.

Inconvénient : si tu oublies de vérifier `result.ok`, tu utilises `result.valeur` qui est `undefined`. Fais-le seulement si l'API est interne et contrôlée.

---

## 8) RÉSUMÉ DES PIÈGES EN TABLEAU

```
forEach + async    --> erreurs perdues      --> utiliser for...of
Promise.all      --> un échec coule tout    --> utiliser Promise.allSettled si besoin
fetch sur 404/500   --> pas d'exception native   --> tester res.ok manuellement
EventEmitter async  --> erreurs perdues      --> wrapping try/catch + emit("error")
top-level await    --> crash module entier    --> try/catch au top level
setTimeout callback  --> hors du try/catch externe --> try/catch dans le callback
```

---

## EXERCICES

## EXO 1 : LE FOREACH QUI TRAHIT

Ce code a un bug silencieux. Identifie-le et corrige-le :

```js
const joueurIds = [7, 10, 11, 99999, 9];

joueurIds.forEach(async (id) => {
 const joueur = await fetchJoueur(id); // peut rejeter sur 99999
 console.log(joueur.nom);
});
```

Corrige pour que les erreurs soient loggées et que le traitement continue pour les autres IDs.

---

## EXO 2 : LE TOURNAMENT PROCESSOR

Tu as 5 matchs à charger. Certains peuvent échouer (API instable pendant le tournoi).

Utilise `Promise.allSettled` pour charger tous les matchs en parallèle et retourner :

- la liste des matchs réussis
- la liste des IDs qui ont échoué avec leur message d'erreur

---

## EXO 3 : SAFE WRAPPER

Écris une fonction générique `safeAsync(fn, ...args)` qui :

- exécute `fn(...args)` dans un try/catch
- retourne `{ ok: true, valeur }` ou `{ ok: false, erreur }`

Utilise-la pour wrapper `chargerStats` et teste avec un match existant et un inexistant.

---

## RÉSUMÉ

En async, les erreurs ne crashent pas forcément : elles disparaissent. C'est pire.

`forEach` avec `async` : les erreurs sont perdues. Utilise `for...of` ou `Promise.allSettled`.

`fetch` ne throw pas sur les 404/500 : teste `res.ok` toi-même.

Les EventEmitters ne gèrent pas les erreurs async de leurs handlers. Wrap systématiquement.

Un `UnhandledPromiseRejection` en prod c'est une bombe à retardement : ça crash Node 15+ immédiatement.
