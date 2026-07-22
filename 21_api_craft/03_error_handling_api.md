---
stability: intemporel
---

# LES ERREURS D'API
Temps de lecture ~9 min

Une API sans gestion d'erreurs c'est une bombe à retardement.
Le client reçoit un HTML de crash Express. Ou un timeout. Ou un `{}` vide.
Il ne sait pas ce qui s'est passé. Toi non plus, parce que rien n'a été loggé.
Ce fichier pose l'architecture complète : format d'erreur uniforme, middleware global, status codes qui racontent quelque chose.

---

## 1) LE FORMAT D'ERREUR : DÉCIDE ET TIENS-T'Y

Chaque API qui tient en prod a un format d'erreur unique et cohérent.
Le client peut écrire du code dessus sans surprises.

```js
// format standard CrazyDevs API
{
 "error": {
  "code": "PLAYER_NOT_FOUND",  // code machine : pour le client qui branche une logique dessus
  "message": "joueur 99 introuvable", // message humain : pour les logs et le debug
  "status": 404          // status HTTP répété dans le body : pratique pour les logs
 }
}
```

Pas de `{ message: "error" }`.
Pas de `{ success: false, data: null }`.
Un format. Partout. Toujours.

---

## 2) LES CLASSES D'ERREUR MÉTIER

Les erreurs natives d'Express (`new Error()`) n'ont pas de status HTTP.
On crée des classes avec un status attaché.

```js
// errors/AppError.js

// classe de base : toutes les erreurs API héritent d'ici
export class AppError extends Error {
 constructor(message, statusCode, code) {
  super(message)      // passe le message à Error natif
  this.statusCode = statusCode // status HTTP : 400, 404, 409, etc.
  this.code = code     // code machine : 'PLAYER_NOT_FOUND', etc.
  this.isOperational = true // distingue erreur métier vs bug inattendu
 }
}

// erreurs spécialisées : plus parlantes dans le code
export class NotFoundError extends AppError {
 constructor(resource, id) {
  super(`${resource} ${id} introuvable`, 404, 'NOT_FOUND')
 }
}

export class ValidationError extends AppError {
 constructor(message) {
  super(message, 400, 'VALIDATION_ERROR')
 }
}

export class ConflictError extends AppError {
 constructor(message) {
  super(message, 409, 'CONFLICT')
 }
}

export class UnauthorizedError extends AppError {
 constructor() {
  super('authentification requise', 401, 'UNAUTHORIZED')
 }
}
```

Utilisation dans un handler :
```js
import { NotFoundError, ValidationError } from './errors/AppError.js'

router.get('/:id', (req, res, next) => {
 const player = players.find(p => p.id === Number(req.params.id))

 if (!player) {
  // on throw pas, on passe à next() : Express le route vers le middleware d'erreur
  return next(new NotFoundError('joueur', req.params.id))
 }

 res.json(player)
})

router.post('/', (req, res, next) => {
 const { name } = req.body

 if (!name) {
  return next(new ValidationError('name est requis'))
 }

 // ...
})
```

---

## 3) LE MIDDLEWARE D'ERREUR GLOBAL

Express reconnaît un middleware d'erreur à sa signature à 4 paramètres : `(err, req, res, next)`.
Il doit être monté **après toutes les routes**.

```js
// middleware/errorHandler.js

export function errorHandler(err, req, res, next) {
 // logger l'erreur dans tous les cas (en prod : Sentry, pino, winston)
 console.error({
  method: req.method,
  path: req.path,
  error: err.message,
  stack: err.stack
 })

 // erreur opérationnelle connue : on peut lui faire confiance
 if (err.isOperational) {
  return res.status(err.statusCode).json({
   error: {
    code: err.code,
    message: err.message,
    status: err.statusCode
   }
  })
 }

 // erreur inconnue / bug non géré : 500 générique
 // on ne révèle JAMAIS les détails techniques en prod (stack trace, paths internes)
 res.status(500).json({
  error: {
   code: 'INTERNAL_ERROR',
   message: 'une erreur est survenue',
   status: 500
  }
 })
}
```

```js
// app.js

import { errorHandler } from './middleware/errorHandler.js'

// ... routes montées ici ...

// gestionnaire de route inconnue : doit être après toutes les routes
app.use((req, res, next) => {
 next(new NotFoundError('route', req.path))
})

// middleware d'erreur : TOUJOURS en dernier
app.use(errorHandler)
```

Flux d'une erreur :
```
route handler --> next(new NotFoundError())
 --> Express voit un objet Error passé à next()
 --> skip tous les middlewares normaux
 --> atterrit sur errorHandler(err, req, res, next)
 --> renvoie la réponse d'erreur formatée
```

---

## 4) ERREURS ASYNC : LE PIÈGE CLASSIQUE

Express ne catch pas les erreurs async automatiquement (avant Express 5).
Une Promise rejetée sans catch crashe le processus silencieusement.

```js
// BUG : si db.findPlayer() rejecte, Express ne le catch pas
router.get('/:id', async (req, res) => {
 const player = await db.findPlayer(req.params.id) // peut rejeter
 res.json(player)
})
```

Deux solutions :

**Option A : try/catch + next()**
```js
router.get('/:id', async (req, res, next) => {
 try {
  const player = await db.findPlayer(req.params.id)
  res.json(player)
 } catch (err) {
  next(err) // passe l'erreur au middleware global
 }
})
```

**Option B : wrapper asyncHandler (plus propre)**
```js
// utils/asyncHandler.js
// wrapper qui catch automatiquement les erreurs async et les passe à next()
export const asyncHandler = (fn) => (req, res, next) => {
 Promise.resolve(fn(req, res, next)).catch(next)
}
```

```js
import { asyncHandler } from './utils/asyncHandler.js'

// plus de try/catch à répéter : asyncHandler le fait pour toi
router.get('/:id', asyncHandler(async (req, res) => {
 const player = await db.findPlayer(req.params.id)
 res.json(player)
}))
```

Note : Express 5 (disponible en 2024) gère nativement les erreurs async.
En Express 4 (encore très répandu), le wrapper reste nécessaire.

---

## 5) VALIDATION EN AMONT : FAIL VITE, FAIL CLAIREMENT

Le middleware d'erreur attrape ce qui passe. La validation empêche le pire de passer.

```js
// middleware/validate.js
// factory qui retourne un middleware de validation basé sur un schema Zod
import { z } from 'zod'

export const validate = (schema) => (req, res, next) => {
 const result = schema.safeParse(req.body)

 if (!result.success) {
  // Zod format les erreurs : les mapper vers le format API
  const errors = result.error.errors.map(e => ({
   field: e.path.join('.'),
   message: e.message
  }))

  return res.status(400).json({
   error: {
    code: 'VALIDATION_ERROR',
    message: 'données invalides',
    status: 400,
    fields: errors // détail des champs invalides
   }
  })
 }

 req.validatedBody = result.data // données validées et typées
 next()
}
```

```js
const playerSchema = z.object({
 name: z.string().min(2),
 team: z.string(),
 goals: z.number().int().min(0).optional()
})

// validate() tourne avant le handler : si ça passe pas, le handler tourne jamais
router.post('/', validate(playerSchema), (req, res) => {
 const { name, team, goals } = req.validatedBody // garanti valide
 // ...
})
```

---

## 6) CE QUI CASSE

**Pas d'errorHandler monté après les routes**
Express affiche son HTML de stack trace par défaut. Le client reçoit du HTML alors qu'il attendait du JSON.

**Révéler la stack trace en prod**
```js
// DANGEREUX en prod : expose les chemins internes, les versions de packages
res.status(500).json({ error: err.stack })
// CORRECT : message générique en prod
res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'erreur serveur' } })
```

**Appeler `next()` après avoir déjà envoyé une réponse**
```js
router.get('/:id', (req, res, next) => {
 if (!player) res.status(404).json({ error: 'not found' }) // réponse envoyée
 // ... code qui continue et appelle next()
 // Express : "headers already sent" crash
 // FIX : return res.status(404).json(...)
})
```

---

## EXERCICES

**EXO 1 : Le système d'alerte de l'Armée d'Exploration**
Implémente les classes `MissionNotFoundError`, `SoldierUnavailableError`, `TitanTooStrongError`.
Chaque classe a son status code et son code machine.
Monte un errorHandler global qui les formate uniformément.
Teste que les erreurs inconnues (bug JS classique) renvoient un 500 générique.

**EXO 2 : La validation du formulaire de Walter White**
Tu reçois des requêtes d'inscription : `{ email, plan, region, priority }`.
`product` et `destination` sont obligatoires (strings).
`quantity` est un entier entre 1 et 1000.
`priority` est optionnel mais si présent doit être `"low"`, `"medium"` ou `"high"`.
Implémente le middleware de validation avec Zod. Si invalide : 400 avec la liste des champs en erreur.

**EXO 3 : Le wrapper asyncHandler de Fox River**
Toutes les routes de l'API Prison Break appellent des fonctions async qui peuvent rejeter.
Crée le wrapper `asyncHandler`. Applique-le à 3 routes qui font des opérations async simulées.
Vérifie qu'une rejection est bien catchée et routée vers le errorHandler global.

---

## RÉSUMÉ

Un format d'erreur unique et stable c'est la première chose qui distingue une API sérieuse.
Les classes d'erreur métier (`AppError` et ses enfants) centralisent status code et code machine.
Le middleware d'erreur global attrape tout ce qui passe par `next(err)`.
Les erreurs async doivent être catchées explicitement en Express 4.
La validation en amont évite que des données malformées atteignent le coeur du code.
Ne jamais exposer la stack trace en prod.
