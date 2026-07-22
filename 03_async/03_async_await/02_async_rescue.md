---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ASYNC RESCUE : SAUVER CE QUI PEUT L'ÊTRE
Temps de lecture ~9 min

Une opération async peut rater pour 100 raisons différentes.
Le réseau coupe. L'API timeout. Le serveur répond 500. Le JSON est malformé.
Sans stratégie de gestion d'erreur : ton app crash en silence et l'utilisateur ne sait rien.

Ce fichier : comment attraper, décider, et survivre.

---

## 1) `try/catch` EN ASYNC : LA BRIQUE DE BASE

Avec les Promises, les erreurs se catchent dans `.catch()`.
Avec `async/await`, elles se catchent dans un `try/catch` classique.

```js
// version Promise
fetchKnight('leon')
 .then(data => console.log(data))
 .catch(err => console.error('Leon est tombé :', err))

// version async/await
async function getKnight() {
 try {
  const data = await fetchKnight('leon')
  console.log(data)
 } catch (err) {
  // si fetchKnight() rejette : on arrive ici
  console.error('Leon est tombé :', err)
 }
}
```

Le `catch` attrape n'importe quelle erreur qui se passe dans le `try` :
rejets de Promise, erreurs réseau, erreurs de parsing JSON : tout.

---

## 2) CE QUE `try/catch` NE CATCH PAS

```js
async function getKnight() {
 try {
  // fetchKnight démarre...
  const promise = fetchKnight('leon')

  // ...mais on n'await pas
  // si la Promise rejette : personne ne l'attrape
  // le catch ci-dessous ne sera JAMAIS appelé
 } catch (err) {
  console.error(err) // jamais exécuté
 }
}
```

**Règle :** `try/catch` attrape uniquement les Promises que tu `await`.
Une Promise non-awaitée qui rejette = une `UnhandledPromiseRejection`.

---

## 3) GÉRER PLUSIEURS `await` DANS UN SEUL `try`

```js
async function executeHorrorMission(horrorId) {
 try {
  const horror = await detectHorror(horrorId)    // peut rater
  const knight = await dispatchKnight(horror.zone) // peut rater
  const result = await startCombat(knight, horror) // peut rater
  return result
 } catch (err) {
  // on sait qu'il y a eu une erreur, mais laquelle ?
  // detectHorror ? dispatchKnight ? startCombat ?
  // impossible à savoir sans info supplémentaire
  console.error('mission échouée :', err.message)
 }
}
```

Un seul `try` pour tout : pratique, mais tu perds la granularité.
Si tu as besoin de savoir exactement où ça a raté :

```js
async function executeHorrorMission(horrorId) {
 let horror
 try {
  horror = await detectHorror(horrorId)
 } catch (err) {
  throw new Error(`Détection échouée pour ${horrorId} : ${err.message}`)
 }

 let knight
 try {
  knight = await dispatchKnight(horror.zone)
 } catch (err) {
  throw new Error(`Dispatch échoué pour zone ${horror.zone} : ${err.message}`)
 }

 try {
  return await startCombat(knight, horror)
 } catch (err) {
  throw new Error(`Combat échoué : ${knight.name} vs ${horror.name} : ${err.message}`)
 }
}
```

Plus verbeux, mais les logs racontent une histoire.

---

## 4) RETRY : RETENTER AVANT D'ABANDONNER

Certaines erreurs sont temporaires : timeout réseau, 503 passager, rate limit.
Renoncer au premier échec : souvent la mauvaise décision.

```js
// retente jusqu'à maxAttempts fois avant d'abandonner
async function withRetry(fn, maxAttempts = 3, delayMs = 1000) {
 let lastError

 for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  try {
   return await fn()
  } catch (err) {
   lastError = err
   console.warn(`Tentative ${attempt}/${maxAttempts} échouée : ${err.message}`)

   if (attempt < maxAttempts) {
    // attendre avant de retenter : laisse le temps au serveur de respirer
    await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
    // delayMs * attempt = backoff exponentiel progressif
   }
  }
 }

 // toutes les tentatives ont échoué : on propage l'erreur
 throw new Error(`Échec après ${maxAttempts} tentatives : ${lastError.message}`)
}

// utilisation
async function getKnightWithRetry() {
 return withRetry(() => fetchKnight('leon'), 3, 500)
}
```

---

## 5) TIMEOUT : NE PAS ATTENDRE ÉTERNELLEMENT

Une Promise sans timeout peut attendre indéfiniment. L'utilisateur attend. L'UI freeze.

```js
function withTimeout(promise, ms) {
 const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error(`Timeout après ${ms}ms`)), ms)
 )

 // Promise.race : le premier qui se résout gagne
 // si le timeout gagne : l'erreur est propagée
 // si la Promise originale gagne : le timeout est ignoré
 return Promise.race([promise, timeout])
}

// si fetchMission prend plus de 3s : erreur de timeout
async function getMissionSafe() {
 try {
  const mission = await withTimeout(fetchMission('leon'), 3000)
  return mission
 } catch (err) {
  if (err.message.includes('Timeout')) {
   console.error("Leon ne répond plus. On envoie Rei.")
   return fetchMission('rei') // fallback
  }
  throw err // autre type d'erreur : on la propage
 }
}
```

---

## 6) FALLBACK : UN PLAN B QUAND LE PLAN A CRÈVE

```js
async function getHorrorData(horrorId) {
 try {
  // tente l'API principale
  return await fetchFromPrimaryAPI(horrorId)
 } catch (primaryErr) {
  console.warn('API principale indispo, tentative backup...')

  try {
   // fallback sur l'API de backup
   return await fetchFromBackupAPI(horrorId)
  } catch (backupErr) {
   // les deux APIs sont mortes
   // retourne des données dégradées plutôt que de crasher
   console.error('Backup aussi indispo. Mode dégradé.')
   return { id: horrorId, name: 'Unknown Horror', threat: 'unknown' }
  }
 }
}
```

Résultat dégradé > crash total. L'utilisateur voit quelque chose, même si c'est incomplet.

---

## 7) `Promise.allSettled` : TOLÉRER LES ÉCHECS PARTIELS

`Promise.all` = si un échoue, tout échoue.
`Promise.allSettled` = attend tout le monde, récupère les résultats ET les erreurs.

```js
async function getAllKnightReports(knights) {
 const results = await Promise.allSettled(
  knights.map(knight => fetchReport(knight))
 )

 // results = tableau d'objets :
 // { status: 'fulfilled', value: ... }
 // { status: 'rejected', reason: ... }

 const reports = []
 const failures = []

 for (const result of results) {
  if (result.status === 'fulfilled') {
   reports.push(result.value)
  } else {
   failures.push(result.reason)
   console.warn('Un rapport manquant :', result.reason.message)
  }
 }

 // on retourne ce qu'on a, même incomplet
 return { reports, failures }
}
```

Le Conseil reçoit les rapports disponibles.
Si Rei est tombé en mission, ça ne bloque pas les rapports de Leon et Kouga.

---

## EXERCICES

## EXO 1 : LE PIPELINE BLINDÉ

Tu construis le pipeline d'évasion de Michael Scofield. 3 étapes en séquence :

```js
function getBlueprints() { /* peut rejeter : 'Blueprints locked' */ }
function digTunnel(blueprints) { /* peut rejeter : 'Guard patrol' */ }
function reachFreedom(tunnel) { /* peut rejeter : 'Dogs detected' */ }
```

**Mission :** Écris `executeEscape()` avec un `try/catch` par étape. Chaque erreur catchée doit relancer une erreur avec un message qui dit clairement à quelle étape le plan a merdé. Si toutes les étapes réussissent : retourne `'Liberté. Fox River derrière nous.'`

---

## EXO 2 : LEON AVEC UN TIMEOUT ET UN BACKUP

Leon part en mission. Sa réponse prend parfois plus de 5 secondes.

```js
function callLeon() {
 return new Promise((resolve, reject) => {
  const delay = Math.random() > 0.5 ? 2000 : 8000
  setTimeout(() => resolve('Leon disponible'), delay)
 })
}

function callRei() {
 return new Promise(resolve => setTimeout(() => resolve('Rei disponible'), 1000))
}
```

**Mission :** Écris `dispatchKnight()`. Si `callLeon()` prend plus de 5s : timeout, et tu appelles `callRei()` en fallback. Si les deux ratent : retourne `'Aucun Chevalier disponible'` sans crasher.

---

## EXO 3 : LE CONSEIL RÉSILIENT

5 Chevaliers doivent rendre leur rapport. Certains peuvent échouer.

```js
function fetchReport(name) {
 return new Promise((resolve, reject) => {
  // 30% de chance d'échouer
  if (Math.random() < 0.3) {
   reject(new Error(`${name} : rapport indisponible`))
  } else {
   resolve(`${name} : mission accomplie`)
  }
 })
}

const knights = ['Leon', 'Rei', 'Kouga', 'Leo', 'Bado']
```

**Mission :** Récupère tous les rapports avec `Promise.allSettled`. Affiche les rapports reçus. Affiche les noms des Chevaliers dont le rapport est manquant. Le Conseil doit toujours recevoir quelque chose, même si c'est incomplet.

---

## RÉSUMÉ

`try/catch` autour d'un `await` : attrape la rejection de la Promise.
Un `await` manquant = l'erreur passe à travers sans être catchée.
`withRetry` : retente avec délai progressif avant de jeter l'éponge.
`Promise.race` + timeout : ne jamais attendre éternellement.
`Promise.allSettled` : tolérer les échecs partiels et travailler avec ce qui reste.
La règle d'or : un crash silencieux est pire qu'une erreur visible.
