---
stability: intemporel
---

# WORKER THREADS : PARALLÉLISER SANS BLOQUER L'EVENT LOOP
Temps de lecture ~9 min

Node est single-threaded. Un seul thread d'exécution, un seul event loop. C'est parfait pour l'I/O asynchrone : des milliers de requêtes réseau en parallèle, zéro problème. Mais tu lances un calcul CPU intensif, genre parser 500k lignes de CSV ou générer un rapport de classement : l'event loop est bloqué. Aucune autre requête ne passe. Ton serveur freeze.

Worker Threads règlent ça. Tu crées un thread séparé, tu lui confies le calcul, et l'event loop continue de tourner.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

```js
// scénario : calcul le classement Ballon d'Or depuis 500k votes
// chaque vote = parsing JSON + pondération + agrégation

function computeRanking(votes) {
 // opération synchrone intensive : bloque le thread principal
 return votes
  .flatMap(v => v.players)
  .reduce((acc, { name, points }) => {
   acc[name] = (acc[name] ?? 0) + points
   return acc
  }, {})
}

// si cette fonction met 3 secondes :
// pendant 3 secondes, ton serveur Express ne répond plus à rien
// toutes les requêtes HTTP attendent dans la queue
// les timeouts se déclenchent
// les utilisateurs voient un spinner qui tourne
app.get('/ranking', (req, res) => {
 const ranking = computeRanking(votes) // l'event loop est bloqué ici
 res.json(ranking)
})
```

```
Sans Worker Thread :
Event Loop ---|--calcul 3s--|--> requêtes en attente --> timeout

Avec Worker Thread :
Event Loop ---|---> autres requêtes --> OK
Worker   ---|--calcul 3s--|--> résultat --> Event Loop
```

---

## 2) CRÉER UN WORKER THREAD

Il faut deux fichiers : le thread principal qui crée le worker, et le worker qui fait le calcul.

```js
// --- main.js : le thread principal ---
import { Worker } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function computeRankingAsync(votes) {
 return new Promise((resolve, reject) => {
  const worker = new Worker(
   join(__dirname, 'ranking-worker.js'),
   { workerData: votes } // les données à envoyer au worker
  )

  worker.on('message', (result) => {
   // le worker a terminé et envoie son résultat
   resolve(result)
  })

  worker.on('error', (err) => {
   // une erreur non catchée dans le worker
   reject(err)
  })

  worker.on('exit', (code) => {
   if (code !== 0) {
    reject(new Error(`Worker terminé avec le code ${code}`))
   }
  })
 })
}

// l'event loop reste libre pendant le calcul
const ranking = await computeRankingAsync(votes)
```

```js
// --- ranking-worker.js : le worker ---
import { workerData, parentPort } from 'node:worker_threads'

// workerData = les données envoyées depuis main.js
const votes = workerData

// on fait le calcul intensif ici, dans un thread séparé
const ranking = votes
 .flatMap(v => v.players)
 .reduce((acc, { name, points }) => {
  acc[name] = (acc[name] ?? 0) + points
  return acc
 }, {})

// on envoie le résultat au thread principal
parentPort.postMessage(ranking)
// le worker se termine automatiquement après ça
```

---

## 3) COMMUNICATION BIDIRECTIONNELLE

```js
// --- worker avancé : envoyer des updates de progression ---

// ranking-worker.js
import { workerData, parentPort } from 'node:worker_threads'

const { votes, batchSize } = workerData
const total = votes.length
const acc = {}

for (let i = 0; i < total; i += batchSize) {
 const batch = votes.slice(i, i + batchSize)

 batch.forEach(({ name, points }) => {
  acc[name] = (acc[name] ?? 0) + points
 })

 // on envoie la progression au thread principal
 parentPort.postMessage({
  type: 'progress',
  percent: Math.round(((i + batchSize) / total) * 100)
 })
}

// calcul terminé : on envoie le résultat final
parentPort.postMessage({ type: 'result', data: acc })
```

```js
// --- main.js : gérer les deux types de messages ---
const worker = new Worker('./ranking-worker.js', {
 workerData: { votes, batchSize: 10000 }
})

worker.on('message', ({ type, percent, data }) => {
 if (type === 'progress') {
  process.stdout.write(`\r Calcul en cours : ${percent}%`)
 }

 if (type === 'result') {
  console.log('\n Classement final :', data)
 }
})
```

---

## 4) WORKER POOL : RÉUTILISER LES WORKERS

Créer un worker pour chaque requête, c'est coûteux. En prod, on crée un pool de workers et on les réutilise.

```js
// version simplifiée d'un worker pool
class WorkerPool {
 constructor(workerPath, size) {
  this.workers = Array.from({ length: size }, () => ({
   thread: new Worker(workerPath),
   busy: false
  }))
  this.queue = [] // tâches en attente si tous les workers sont occupés
 }

 run(data) {
  return new Promise((resolve, reject) => {
   const available = this.workers.find(w => !w.busy)

   if (available) {
    this.#dispatch(available, data, resolve, reject)
   } else {
    // tous les workers sont occupés : on met en attente
    this.queue.push({ data, resolve, reject })
   }
  })
 }

 #dispatch(worker, data, resolve, reject) {
  worker.busy = true
  worker.thread.postMessage(data)

  worker.thread.once('message', (result) => {
   worker.busy = false
   resolve(result)

   // y'a des tâches en attente ? on les traite
   if (this.queue.length > 0) {
    const next = this.queue.shift()
    this.#dispatch(worker, next.data, next.resolve, next.reject)
   }
  })

  worker.thread.once('error', (err) => {
   worker.busy = false
   reject(err)
  })
 }
}

// usage
const pool = new WorkerPool('./ranking-worker.js', 4) // 4 workers
const result = await pool.run(votes)
```

---

## 5) SHARED ARRAY BUFFER : MÉMOIRE PARTAGÉE

```js
// par défaut, les données entre worker et main thread sont copiées (pas partagées)
// pour de gros volumes : utiliser SharedArrayBuffer

// main.js
const sharedBuffer = new SharedArrayBuffer(4) // 4 octets = 1 Int32
const counter = new Int32Array(sharedBuffer)
counter[0] = 0

const worker = new Worker('./counter-worker.js', {
 workerData: { sharedBuffer } // on partage le buffer, pas une copie
})

// le worker peut modifier counter[0] et le main thread voit la modification
// sans envoyer de message

// contre-indication : les race conditions
// deux workers qui écrivent en même temps = données corrompues
// solution : Atomics.add(), Atomics.compareExchange() pour les opérations atomiques
Atomics.add(counter, 0, 1) // incrément atomique thread-safe
```

---

## EXERCICES

## EXO 1 : le calcul hors thread

T'as cette fonction qui analyse les stats d'un match (supposons qu'elle soit lente) :

```js
function analyzeMatchData(events) {
 // simulation d'un calcul intensif
 let result = {}
 for (let i = 0; i < 10_000_000; i++) {
  const e = events[i % events.length]
  result[e.player] = (result[e.player] ?? 0) + 1
 }
 return result
}
```

Déplace ce calcul dans un Worker Thread. Le thread principal doit rester libre (teste avec un `setInterval` qui print un compteur toutes les 100ms : il ne doit pas s'interrompre pendant le calcul).

---

## EXO 2 : la progression du vote

Crée un worker qui simule le comptage de 1 million de votes. Il envoie des updates de progression toutes les 100k votes. Le thread principal affiche une barre de progression dans le terminal.

---

## EXO 3 : le pool de simulation

Simule 9 matchs de Champions League en parallèle (fixtures hardcodées). Crée un pool de 3 workers. Chaque worker simule un match (5 secondes simulées). Les résultats arrivent au fur et à mesure. Affiche chaque résultat dès qu'il est prêt, pas en attente que tous soient terminés.

---

## RÉSUMÉ

Node est single-threaded : un calcul CPU intensif bloque l'event loop. Worker Threads créent des threads séparés pour ces calculs. Les données transitent par message (copie) ou SharedArrayBuffer (mémoire partagée). En prod : un pool de workers réutilisables plutôt que créer un worker par requête. La règle de décision : si c'est de l'I/O, `async/await` suffit. Si c'est du CPU pur, Worker Thread.

> Note : 9.5/10 : le schéma ASCII event loop vs worker est efficace. Le pool est bien calibré pour le niveau. Moins 0.5 : les pièges de SharedArrayBuffer (race conditions) mériteraient un exemple cassé + Atomics côte à côte.
