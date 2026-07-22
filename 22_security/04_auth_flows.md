---
stability: intemporel
---

# OAUTH, SESSIONS, JWT
Temps de lecture ~11 min

Trois modèles d'auth. Trois cas d'usage différents. Choisir le mauvais en prod c'est soit une faille de sécurité, soit une complexité inutile que tu vas payer en maintenance.

---

## 1) SESSIONS : L'ÉTAT CÔTÉ SERVEUR

### Le quoi

Sessions : le serveur garde l'état de connexion. Il génère un identifiant de session (session ID) aléatoire, le stocke côté serveur (en mémoire, Redis, DB), et envoie uniquement l'identifiant au navigateur via un cookie. À chaque requête, le navigateur renvoie le cookie, le serveur récupère la session associée.

```
Connexion  --> serveur crée une session { userId: 42, role: 'user' }
      --> stocke en Redis sous la clé "sess:abc123"
      --> envoie le cookie : sessionId=abc123
Requête   --> navigateur envoie cookie sessionId=abc123
      --> serveur cherche "sess:abc123" dans Redis
      --> trouve { userId: 42 } --> utilisateur authentifié
Déconnexion --> serveur supprime "sess:abc123" de Redis
      --> session invalide immédiatement
```

### Avantages / inconvénients

```
Avantages :
- révocation immédiate (supprimer la session = déconnexion instantanée)
- l'état est côté serveur : le client ne sait rien sur sa session
- compatible avec les navigateurs sans config supplémentaire

Inconvénients :
- nécessite du stockage serveur (Redis ou DB pour les apps distribuées)
- scalabilité : plusieurs instances serveur doivent partager le même store de sessions
- pas adapté aux clients non-navigateur (apps mobiles, APIs tierces)
```

### Implémentation

```js
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

app.use(session({
 store: new RedisStore({ client: redisClient }), // persiste les sessions dans Redis
 secret: process.env.SESSION_SECRET, // clé de signature du cookie : jamais en dur dans le code
 resave: false,       // ne re-sauvegarde pas si la session n'a pas changé
 saveUninitialized: false,  // ne crée pas de session pour les visiteurs non connectés
 cookie: {
  httpOnly: true,  // JS ne peut pas lire le cookie
  secure: true,   // HTTPS uniquement
  sameSite: 'Strict', // protection CSRF
  maxAge: 1000 * 60 * 60 * 24 // 24h en millisecondes
 }
}));

app.post('/quarry-gate', async (req, res) => {
 const user = await verifyCredentials(req.body.email, req.body.password);
 if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });

 req.session.userId = user.id; // stocker uniquement l'ID dans la session, pas le mot de passe
 req.session.role = user.role;
 res.json({ message: 'Connecté' });
});

app.post('/logout', (req, res) => {
 req.session.destroy(); // supprime la session côté serveur --> déconnexion immédiate
 res.clearCookie('connect.sid');
 res.json({ message: 'Déconnecté' });
});
```

---

## 2) JWT : L'ÉTAT CÔTÉ CLIENT

### Le quoi

JWT (JSON Web Token : jeton web JSON) : le serveur encode l'état dans un token signé, l'envoie au client. Le client renvoie ce token à chaque requête. Le serveur vérifie la signature, extrait les données. Aucun stockage côté serveur.

```
JWT = header.payload.signature

header  --> { "alg": "HS256", "typ": "JWT" } (encodé en base64)
payload  --> { "userId": 42, "role": "user", "exp": 1700000000 } (encodé en base64)
signature --> HMAC-SHA256(header + "." + payload, SECRET_KEY)

La signature garantit que le payload n'a pas été modifié.
Si quelqu'un change "role": "user" en "role": "admin", la signature ne correspond plus.
```

### Avantages / inconvénients

```
Avantages :
- stateless (sans état) : aucun stockage serveur nécessaire
- parfait pour les microservices et APIs multi-services
- compatible avec les apps mobiles et les clients non-navigateur
- scalable horizontalement sans partager un store

Inconvénients :
- révocation difficile : tu ne peux pas "invalider" un token avant son expiration
- si le token est volé, il est valide jusqu'à expiration (sauf si tu implémentes une blacklist)
- le payload est lisible (base64, pas chiffré) : ne jamais y mettre de données sensibles
```

### Implémentation

```js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // jamais en dur, jamais dans git
const ACCESS_TOKEN_EXPIRY = '15m'; // court : si volé, valide 15 minutes max
const REFRESH_TOKEN_EXPIRY = '7d'; // long : pour regénérer l'access token

// Génération au login
app.post('/quarry-gate', async (req, res) => {
 const user = await verifyCredentials(req.body.email, req.body.password);
 if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });

 // access token : courte durée, contient les infos nécessaires pour les requêtes
 const accessToken = jwt.sign(
  { userId: user.id, role: user.role }, // payload : seulement ce qui est nécessaire
  JWT_SECRET,
  { expiresIn: ACCESS_TOKEN_EXPIRY }
 );

 // refresh token : longue durée, stocké en cookie httpOnly (pas en localStorage)
 const refreshToken = jwt.sign(
  { userId: user.id },
  JWT_SECRET,
  { expiresIn: REFRESH_TOKEN_EXPIRY }
 );

 // refresh token en cookie httpOnly : JS ne peut pas y accéder
 res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
 });

 res.json({ accessToken }); // access token renvoyé au client, stocké en mémoire JS
});

// Middleware de vérification
const requireAuth = (req, res, next) => {
 const authHeader = req.headers.authorization;
 if (!authHeader?.startsWith('Bearer ')) {
  return res.status(401).json({ error: 'Token manquant' });
 }

 const token = authHeader.split(' ')[1];

 try {
  const decoded = jwt.verify(token, JWT_SECRET); // vérifie signature + expiration
  req.user = decoded; // { userId, role, iat, exp }
  next();
 } catch (err) {
  if (err.name === 'TokenExpiredError') {
   return res.status(401).json({ error: 'Token expiré', code: 'TOKEN_EXPIRED' });
  }
  return res.status(401).json({ error: 'Token invalide' });
 }
};

// Endpoint de refresh : regénérer l'access token depuis le refresh token
app.post('/refresh', (req, res) => {
 const refreshToken = req.cookies.refreshToken;
 if (!refreshToken) return res.status(401).json({ error: 'Refresh token manquant' });

 try {
  const decoded = jwt.verify(refreshToken, JWT_SECRET);
  const newAccessToken = jwt.sign(
   { userId: decoded.userId, role: decoded.role },
   JWT_SECRET,
   { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
  res.json({ accessToken: newAccessToken });
 } catch {
  res.status(401).json({ error: 'Refresh token invalide ou expiré' });
 }
});
```

### Où stocker le JWT côté client

```
localStorage  --> persistant, accessible via JS --> vulnérable aux XSS : à éviter pour les tokens sensibles
sessionStorage --> disparaît à la fermeture de l'onglet, accessible via JS --> même problème
memory (variable JS) --> disparaît au refresh, non-accessible depuis d'autres onglets --> le mieux pour l'access token
cookie httpOnly   --> pas accessible via JS --> protégé contre XSS --> utilisé pour le refresh token
```

La stratégie recommandée : access token en mémoire (short-lived), refresh token en cookie httpOnly.

---

## 3) OAUTH 2.0 : DÉLÉGUER L'AUTHENTIFICATION

### Le quoi

OAuth 2.0 (Open Authorization : autorisation ouverte) : protocole qui permet à un utilisateur d'autoriser ton app à accéder à ses ressources chez un autre service (Google, GitHub, Twitter), sans partager son mot de passe avec toi.

Ce n'est pas un protocole d'authentification (qui es-tu ?) mais d'autorisation (à quoi autorises-tu l'accès ?). OpenID Connect (OIDC) est la couche qui ajoute l'identité au-dessus d'OAuth 2.0.

### Le flow Authorization Code (le plus sécurisé)

```
1. Utilisateur clique "Se connecter avec Google"
2. Ton app redirige vers Google avec : client_id, redirect_uri, scope, state (nonce anti-CSRF)
3. L'utilisateur s'authentifie sur Google et accepte les permissions
4. Google redirige vers ton redirect_uri avec un "code" d'autorisation
5. Ton SERVEUR (pas le client) échange ce code contre un access_token + id_token
  (appel serveur à serveur : le code n'est jamais exposé au client)
6. Ton serveur vérifie l'id_token (JWT signé par Google) et extrait l'identité
7. Ton app crée ou retrouve l'utilisateur dans ta DB, génère sa session/JWT
```

```
Client --> [1] Redirige vers Google
Google --> [2] Authentification + consentement
Google --> [3] Redirige vers ton app avec un code
Serveur --> [4] Échange le code contre les tokens (appel privé)
Serveur --> [5] Vérifie l'id_token, crée la session utilisateur
Client --> [6] Connecté
```

### Le paramètre state : protection anti-CSRF dans OAuth

```js
// Avant la redirection, générer un state aléatoire et le stocker en session
app.get('/auth/google', (req, res) => {
 const state = crypto.randomBytes(16).toString('hex'); // imprévisible
 req.session.oauthState = state; // stocké en session pour vérification au retour

 const params = new URLSearchParams({
  client_id: process.env.GOOGLE_CLIENT_ID,
  redirect_uri: 'https://app.com/auth/google/callback',
  response_type: 'code',
  scope: 'openid email profile',
  state: state // envoyé à Google, renvoyé dans le callback
 });

 res.redirect(`https://accounts.google.com/o/oauth2/auth?${params}`);
});

app.get('/auth/google/callback', async (req, res) => {
 const { code, state } = req.query;

 // vérifier que le state correspond à ce qu'on a envoyé (protection CSRF OAuth)
 if (state !== req.session.oauthState) {
  return res.status(403).send('State invalide : possible attaque CSRF');
 }

 // échanger le code contre les tokens (appel serveur à serveur)
 const tokens = await exchangeCodeForTokens(code);
 const userInfo = verifyIdToken(tokens.id_token);

 // créer ou retrouver l'utilisateur dans ta DB
 const user = await upsertUser(userInfo);
 req.session.userId = user.id;
 res.redirect('/dashboard');
});
```

---

## 4) QUAND CHOISIR QUOI

```
Sessions  --> app web classique avec navigateur, tu veux la révocation immédiate
JWT    --> API publique, microservices, apps mobiles, clients multiples
OAuth   --> "connecte-toi avec Google/GitHub", accès à des resources tierces

Ne pas utiliser JWT comme remplacement des sessions si :
- tu as besoin de déconnexion immédiate (ex : sécurité, compromission de compte)
- ton app est uniquement web avec navigateur (les sessions sont plus simples)
- tu n'as pas de microservices qui doivent vérifier l'identité indépendamment
```

---

## EXERCICES

**EXO 1 : Prison Break Auth**
L'API Prison Break a besoin de deux types d'auth : sessions pour l'interface web des gardiens (déconnexion immédiate requise si un gardien est compromis), JWT pour l'API mobile des autorités externes. Implémenter les deux middlewares d'auth et la logique de login/logout pour chaque cas.
Contrainte : le middleware JWT doit gérer `TokenExpiredError` et renvoyer un code d'erreur distinct (`TOKEN_EXPIRED`) que le client peut utiliser pour déclencher un refresh automatique.

**EXO 2 : La rotation des tokens**
TrapSoul Radio a des tokens d'accès de 15 minutes. Un utilisateur écoute de la musique pendant 3 heures. Implémenter le mécanisme de refresh automatique côté client (sans framework, vanilla JS) : intercepter les 401 avec `TOKEN_EXPIRED`, appeler `/refresh`, retenter la requête originale avec le nouveau token.
Contrainte : si plusieurs requêtes échouent simultanément, n'appeler `/refresh` qu'une seule fois (pas de race condition).

**EXO 3 : OAuth sans bibliothèque**
Implémenter le flow Authorization Code OAuth avec GitHub (pas Google, pour changer) sans utiliser passport.js ou d'autre bibliothèque OAuth. Uniquement `fetch` pour les appels API et `crypto` pour le state.
Contrainte : valider le state au retour du callback, et gérer le cas où GitHub renvoie une erreur dans les query params.

---

## RÉSUMÉ

Sessions, JWT et OAuth ne sont pas interchangeables : chacun résout un problème précis. Sessions pour la révocation immédiate sur des apps web. JWT pour les APIs distribuées et les clients mobiles. OAuth pour déléguer l'authentification à un tiers. La règle qui s'applique aux trois : les secrets (SESSION_SECRET, JWT_SECRET, CLIENT_SECRET) ne sont jamais dans le code, toujours dans les variables d'environnement. Et les tokens sensibles ne vont jamais dans localStorage.
