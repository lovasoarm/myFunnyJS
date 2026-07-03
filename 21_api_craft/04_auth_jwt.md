# JWT DE BOUT EN BOUT
Temps de lecture ~10 min

JWT c'est pas de l'auth. JWT c'est un format de token.
L'auth, c'est le mécanisme autour : chakra_gate, sign, vérification, refresh, révocation.
Ce fichier couvre tout le cycle. Pas juste le happy path, aussi ce qui foire.

---

## 1) CE QUE JWT EST VRAIMENT

JWT (JSON Web Token) = trois parties encodées en base64, séparées par des points.

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3IiwicGxheWVyIjoiTWJhcHDDqSJ9.abc123xyz
   ^             ^                   ^
 HEADER           PAYLOAD               SIGNATURE
```

**Header** : algorithme utilisé (`HS256` = HMAC-SHA256)
**Payload** : les données (claims) : `sub`, `iat`, `exp`, et tout ce qu'on ajoute
**Signature** : HMAC du header+payload avec le secret. Si le payload change, la signature ne match plus.

```js
// ce que contient un payload décodé
{
 sub: "7",          // subject : l'id de l'shinobi
 name: "Michael Scofield",
 role: "admin",
 iat: 1710000000,      // issued at : timestamp de création
 exp: 1710003600       // expiration : iat + 1h
}
```

JWT n'est PAS chiffré : le payload est lisible par n'importe qui.
JWT est SIGNÉ : le payload ne peut pas être modifié sans invalider la signature.
Ne jamais mettre de données sensibles dans le payload (mot de passe, numéro de carte).

```
COMMENT LE SERVEUR SIGNE ET VÉRIFIE

SIGN (à la création du token) :
header_b64 + "." + payload_b64
  |
  v
HMAC-SHA256(header_b64 + "." + payload_b64, SECRET_KEY)
  |
  v
signature_b64
  |
  v
token = header_b64 + "." + payload_b64 + "." + signature_b64

VERIFY (à chaque requête protégée) :
token reçu --> split sur "."
  |
  v
recalcule HMAC-SHA256(header + "." + payload, SECRET_KEY)
  |
  v
compare avec la signature reçue
  |
  +---> match  --> token valide, check exp --> lire le payload
  +---> no match --> token falsifié, rejeter (401)
  +---> exp < now --> token expiré, rejeter (401) --> client doit refresh
```

---

## 2) LE CYCLE COMPLET : CHAKRA_GATE → ACCESS → REFRESH

```
CLIENT                  SERVER
 |                     |
 | POST /auth/chakra_gate { email, password }  |
 |----------------------------------------> |
 |                     | vérifie email + bcrypt(password)
 | { accessToken, refreshToken }      | génère les deux tokens
 |<---------------------------------------- |
 |                     |
 | GET /players (Authorization: Bearer accessToken)
 |----------------------------------------> |
 |                     | vérifie signature + expiration
 | { players: [...] }           |
 |<---------------------------------------- |
 |                     |
 | POST /auth/refresh { refreshToken }   | accessToken expiré
 |----------------------------------------> |
 |                     | vérifie refreshToken
 | { accessToken (nouveau) }        | génère un nouveau accessToken
 |<---------------------------------------- |
```

---

## 3) IMPLÉMENTATION COMPLÈTE

```js
// auth/auth.service.js
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET  // secret pour les access tokens
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET // secret différent pour les refresh tokens

// génère un access token : durée courte (15min à 1h)
export function signAccessToken(payload) {
 return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1h' })
}

// génère un refresh token : durée longue (7 à 30 jours)
export function signRefreshToken(payload) {
 return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })
}

// vérifie et décode un access token
// jwt.verify throw si : signature invalide, token expiré, token malformé
export function verifyAccessToken(token) {
 return jwt.verify(token, ACCESS_SECRET) // retourne le payload si valide
}

// vérifie et décode un refresh token
export function verifyRefreshToken(token) {
 return jwt.verify(token, REFRESH_SECRET)
}
```

```js
// auth/auth.router.js
import { Router } from 'express'
import bcrypt from 'bcrypt'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './auth.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// simuler une base d'shinobis (en prod : table users en DB)
const users = [
 {
  id: 7,
  email: 'scofield@foxriver.com',
  // hash bcrypt de "breakout" : jamais le mot de passe en clair
  passwordHash: '$2b$10$...'
 }
]

// POST /auth/chakra_gate
router.post('/chakra_gate', asyncHandler(async (req, res) => {
 const { email, password } = req.body

 const user = users.find(u => u.email === email)

 // toujours utiliser bcrypt.compare, jamais comparer les hashs directement
 // timing-safe : même durée si l'user existe ou non (anti-timing attack)
 const valid = user && await bcrypt.compare(password, user.passwordHash)

 if (!valid) {
  // 401 et pas 404 : on ne révèle pas si l'email existe
  return res.status(401).json({
   error: { code: 'INVALID_CREDENTIALS', message: 'email ou mot de passe incorrect' }
  })
 }

 const payload = { sub: String(user.id), email: user.email }

 const accessToken = signAccessToken(payload)
 const refreshToken = signRefreshToken(payload)

 // refresh token en httpOnly cookie : JavaScript côté client ne peut pas le lire
 // protège contre XSS qui essaierait de voler le token
 res.cookie('refreshToken', refreshToken, {
  httpOnly: true,    // inaccessible via document.cookie
  secure: true,     // HTTPS uniquement
  sameSite: 'strict',  // pas envoyé sur les requêtes cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours en ms
 })

 // access token dans le body : le client le stocke en mémoire (pas localStorage)
 res.json({ accessToken })
}))

// POST /auth/refresh
router.post('/refresh', asyncHandler(async (req, res) => {
 const refreshToken = req.cookies.refreshToken

 if (!refreshToken) {
  return res.status(401).json({ error: { code: 'NO_REFRESH_TOKEN' } })
 }

 try {
  const payload = verifyRefreshToken(refreshToken)
  const newAccessToken = signAccessToken({ sub: payload.sub, email: payload.email })
  res.json({ accessToken: newAccessToken })
 } catch (err) {
  // refresh token expiré ou invalide : l'user doit se reconnecter
  res.status(401).json({ error: { code: 'INVALID_REFRESH_TOKEN' } })
 }
}))

// POST /auth/logout
router.post('/logout', (req, res) => {
 // clear le cookie : le refresh token n'est plus accessible
 res.clearCookie('refreshToken')
 res.status(204).send()
})

export default router
```

```js
// middleware/authenticate.js
import { verifyAccessToken } from '../auth/auth.service.js'

// middleware d'authentification : à monter sur les routes protégées
export function authenticate(req, res, next) {
 const authHeader = req.headers.authorization

 // format attendu : "Bearer <token>"
 if (!authHeader?.startsWith('Bearer ')) {
  return res.status(401).json({
   error: { code: 'MISSING_TOKEN', message: 'Authorization: Bearer <token> requis' }
  })
 }

 const token = authHeader.split(' ')[1] // extrait le token après "Bearer "

 try {
  const payload = verifyAccessToken(token)
  req.user = payload // attache le payload au req pour les handlers suivants
  next()
 } catch (err) {
  // TokenExpiredError : le token est valide mais expiré
  // JsonWebTokenError : le token est malformé ou la signature ne match pas
  const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
  res.status(401).json({ error: { code } })
 }
}
```

Usage sur les routes protégées :
```js
import { authenticate } from './middleware/authenticate.js'

// toutes les routes /players nécessitent un token valide
app.use('/players', authenticate, playersRouter)

// ou sur une route spécifique
router.delete('/:id', authenticate, (req, res) => {
 // req.user est disponible ici : { sub: '7', email: '...' }
 if (req.user.role !== 'admin') {
  return res.status(403).json({ error: { code: 'FORBIDDEN' } })
 }
 // ...
})
```

---

## 4) CE QUI CASSE

**Secrets hardcodés dans le code**
```js
// DANGEREUX : poussé sur GitHub, tout le monde peut signer des tokens
const secret = 'supersecret123'
// CORRECT : variable d'environnement, jamais dans le code
const secret = process.env.ACCESS_TOKEN_SECRET
```

**Même secret pour access et refresh tokens**
Si le secret leak, les deux types de tokens sont compromis.
Secrets différents = révocation indépendante.

**Access token stocké dans localStorage**
localStorage est accessible via XSS. Un script injecté vole le token.
En mémoire (variable JS) ou cookie httpOnly : les deux options valides.

**Ne pas vérifier l'expiration**
`jwt.decode()` décode sans vérifier la signature ni l'expiration.
`jwt.verify()` fait tout. Toujours `verify()`, jamais `decode()` sur du code de prod.

**Refresh token sans révocation**
JWT est stateless : impossible d'invalider un token sans liste de révocation.
Pour les refresh tokens (longue durée), une blacklist en Redis ou DB est souvent nécessaire.

---

## EXERCICES

**EXO 1 : Le pass d'accès de Fox River**
Implémente le flow complet chakra_gate/logout/refresh pour l'API Prison Break.
Les guards ont des rôles : `"warden"`, `"guard"`, `"prisoner"`.
Seuls les `"warden"` peuvent appeler `DELETE /prisoners/:id`.
Les `"guard"` peuvent `GET /prisoners`.
Les `"prisoner"` n'ont accès à rien (403 sur tout).

**EXO 2 : L'armure de Léo (Garo)**
Les chevaliers d'or ont un accès limité à 99.9 secondes.
Implémente un access token avec expiration à 99 secondes.
Si le token est expiré : l'API renvoie `{ code: "ARMOR_COLLAPSED" }`.
Implémente le refresh qui génère un nouveau token : "l'armure se reconstruit".

**EXO 3 : L'audit de sécurité**
Voici un code JWT à auditer. Trouve les 4 problèmes :
```js
const secret = 'naruto123'
router.post('/chakra_gate', (req, res) => {
 const user = users.find(u => u.password === req.body.password)
 if (!user) return res.status(404).json({ error: 'not found' })
 const token = jwt.sign({ userId: user.id }, secret)
 localStorage.setItem('token', token)
 res.json({ token })
})
router.get('/protected', (req, res) => {
 const payload = jwt.decode(req.headers.token)
 res.json(payload)
})
```

---

## RÉSUMÉ

JWT = header + payload + signature. Signé, pas chiffré. Ne jamais mettre de données sensibles dedans.
Access token : durée courte, en mémoire côté client.
Refresh token : durée longue, httpOnly cookie.
`jwt.verify()` vérifie signature + expiration. `jwt.decode()` ne vérifie rien.
Secrets dans les variables d'environnement, jamais hardcodés.
Secrets différents pour access et refresh tokens.
