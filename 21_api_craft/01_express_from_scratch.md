---
stability: intemporel
---

# EXPRESS FROM SCRATCH
Temps de lecture ~8 min

Un serveur Express c'est pas de la magie.
C'est un processus Node qui écoute un port, reçoit des requêtes HTTP, et décide quoi renvoyer.
Avant d'ajouter des dépendances, des boilerplates, des générateurs : comprendre le mécanisme brut.
Parce que le jour où ça casse en prod, c'est le mécanisme brut que tu cherches.

---

## 1) CE QUE HTTP VEUT VRAIMENT DIRE

HTTP c'est un protocole texte : le client envoie une requête, le serveur répond. Point.

```
CLIENT             SERVEUR
 |                |
 | GET /players/7 HTTP/1.1    |
 | Host: api.football.com    |
 | Authorization: Bearer xyz   |
 |------------------------------> |
 |                |
 | HTTP/1.1 200 OK        |
 | Content-Type: application/json|
 | {"name": "Mbappé", "goals":30}|
 |<------------------------------ |
```

Express intercepte cette conversation et t'y donne accès proprement.
Sans Express, tu pourrais faire ça avec le module `http` natif de Node.
Avec Express, t'as une API plus ergonomique : routes nommées, middleware chainé, réponses simplifiées.

---

## 2) MONTER LE SERVEUR

```js
import express from 'express' // framework HTTP minimaliste

const app = express()     // crée une instance Express : c'est ton application
const PORT = process.env.PORT ?? 3000 // lit le port depuis l'env, sinon 3000 par défaut

// middleware global : parse le body JSON de chaque requête
// sans ça, req.body est undefined même si le client envoie du JSON
app.use(express.json())

// route minimale : GET sur /
app.get('/', (req, res) => {
 // req : tout ce que le client t'a envoyé (headers, params, body, query)
 // res : tout ce que tu peux renvoyer (status, json, redirect, stream)
 res.json({ status: 'alive', message: 'le serveur répond' })
})

// démarre l'écoute sur le port
app.listen(PORT, () => {
 console.log(`serveur sur http://localhost:${PORT}`)
})
```

Trace d'exécution quand `GET /` arrive :
```
requête HTTP reçue
 --> Express analyse la méthode (GET) et le chemin (/)
 --> trouve le handler correspondant
 --> exécute (req, res) => { res.json(...) }
 --> Express sérialise le JSON, ajoute les headers
 --> répond au client
```

---

## 3) LE MIDDLEWARE : LE VRAI MÉCANISME D'EXPRESS

Le middleware (code intermédiaire), c'est ce qui tourne entre la réception de la requête et l'envoi de la réponse.
Chaque middleware reçoit `(req, res, next)` : il peut modifier req/res, puis passer la main avec `next()`.

```
requête
 --> middleware 1 (logger)
 --> middleware 2 (auth)
 --> middleware 3 (validation)
 --> route handler
 --> réponse
```

```js
// middleware logger : logge chaque requête qui passe
app.use((req, res, next) => {
 const start = Date.now()
 console.log(`--> ${req.method} ${req.path}`)

 // res.on('finish') se déclenche quand Express finit d'écrire la réponse
 res.on('finish', () => {
  console.log(`<-- ${res.statusCode} en ${Date.now() - start}ms`)
 })

 next() // OBLIGATOIRE : sans next(), la requête reste bloquée ici
})

// middleware d'auth : vérifie le header Authorization
app.use((req, res, next) => {
 const token = req.headers.authorization

 if (!token) {
  // on ne passe pas next() : la chaîne s'arrête ici
  return res.status(401).json({ error: 'token manquant' })
 }

 // token présent : on attache l'info à req pour les handlers suivants
 req.user = { id: 'decoded-from-token' }
 next()
})
```

L'ordre des `app.use()` est l'ordre d'exécution. Pas d'ordre, pas de contrôle.

---

## 4) ROUTES : MÉTHODES, PARAMS, QUERY

```js
// paramètre de route : :id est dynamique, accessible via req.params.id
app.get('/players/:id', (req, res) => {
 const { id } = req.params // { id: '7' } si l'URL est /players/7
 res.json({ playerId: id, name: 'Mbappé' })
})

// query string : /players?team=psg&position=fw
// accessible via req.query
app.get('/players', (req, res) => {
 const { team, position } = req.query // { team: 'psg', position: 'fw' }
 res.json({ filters: { team, position } })
})

// body JSON : POST avec { name, goals } dans le corps
// nécessite app.use(express.json()) en amont
app.post('/players', (req, res) => {
 const { name, goals } = req.body // parseé automatiquement par le middleware JSON
 res.status(201).json({ created: { name, goals } })
})
```

---

## 5) ROUTER : ORGANISER PAR RESSOURCE

Tout mettre dans un seul fichier c'est le callback hell des routes.
`express.Router()` découpe par ressource.

```js
// players.router.js
import { Router } from 'express'

const router = Router() // un sous-routeur indépendant

router.get('/', (req, res) => res.json({ players: [] }))
router.get('/:id', (req, res) => res.json({ id: req.params.id }))
router.post('/', (req, res) => res.status(201).json({ created: req.body }))

export default router
```

```js
// app.js
import playersRouter from './players.router.js'

// monte le router sur /players
// toutes les routes définies dedans héritent du préfixe /players
app.use('/players', playersRouter)

// GET /players   --> router.get('/')
// GET /players/7  --> router.get('/:id')
// POST /players   --> router.post('/')
```

Structure résultante :
```
app.js
 ├── middleware globaux
 ├── /players --> players.router.js
 ├── /teams  --> teams.router.js
 └── /matches --> matches.router.js
```

---

## 6) CE QUI CASSE

**Oublier `next()` dans un middleware**
La requête reste suspendue. Le client attend. Timeout. Pas d'erreur visible côté serveur.

```js
// BUG : next() absent
app.use((req, res, next) => {
 req.timestamp = Date.now()
 // next() oublié : toutes les requêtes freezent ici
})
```

**Envoyer deux réponses dans le même handler**
```js
app.get('/test', (req, res) => {
 res.json({ ok: true })
 res.json({ ok: false }) // erreur : "Cannot set headers after they are sent"
})
```
Express te hurlera dessus. Le fix : `return res.json(...)` pour couper l'exécution.

**`express.json()` pas monté**
`req.body` sera `undefined`. Le body est là, Express ne sait pas le lire.

---

## EXERCICES

**EXO 1 : Le vestiaire de Michael Scofield**
Tu construis l'API interne de Fox River.
Chaque détenu a un `id`, un `nom`, et une `cellule`.
Monte un serveur Express avec :
- `GET /detenus` : liste tous les détenus (hardcodés en mémoire pour l'instant)
- `GET /detenus/:id` : renvoie un détenu précis, ou 404 si introuvable
- Un middleware logger qui logge méthode + path + durée de chaque requête

**EXO 2 : Le filtre de Walter White**
Ton API gère un catalogue de jutsus.
Ajoute un endpoint `GET /products` qui accepte les query params `category` et `minPrice`.
Si `minPrice` n'est pas un nombre : renvoie un 400 avec un message d'erreur clair.
Sinon : renvoie les jutsus filtrés (simulés en mémoire).

**EXO 3 : La chaîne de middleware du bureau Hokage**
Implémente un middleware `requireApiKey` : chaque requête doit avoir le header `x-api-key` avec la valeur `"survey-corps"`.
Si absent ou mauvais : 403.
Si correct : attache `req.authenticated = true` et passe.
Monte ce middleware uniquement sur les routes `/admin/*`, pas sur le reste.

---

## RÉSUMÉ

Express c'est une couche fine au-dessus de Node HTTP.
Le middleware est le mécanisme central : chaque requête traverse une chaîne.
L'ordre des `app.use()` détermine l'ordre d'exécution.
Les Router découpent le code par ressource, pas par commodité.
`req` c'est ce qui arrive. `res` c'est ce qui part. `next()` c'est ce qui continue.
