---
stability: intemporel
---

# AUTHENTIFICATION ET AUTORISATION : DEUX PROBLÈMES DIFFÉRENTS
Temps de lecture ~10 min

À Fox River, il y a deux barrières distinctes.
La première : qui es-tu ? (Prisonnier ? Garde ? Visiteur ?)
La deuxième : qu'est-ce que tu as le droit de faire ici ?

Même processus en dev.
Authentification (AuthN) : qui tu es. Prouver ton identité.
Autorisation (AuthZ) : ce que tu peux faire. Vérifier tes droits.

Confondre les deux, c'est confondre l'entrée du bâtiment avec les règles à l'intérieur.
Bug de sécurité garanti.

---

## 1) AUTHENTIFICATION : PROUVER QUI TU ES

Trois façons classiques de prouver son identité :

```
Ce que tu sais  => mot de passe, PIN, réponse secrète
Ce que tu as   => téléphone (OTP), clé physique, certificat
Ce que tu es   => empreinte digitale, reconnaissance faciale (biométrie)
```

MFA (Multi-Factor Authentication : authentification multi-facteurs) = combiner au moins deux de ces catégories.

En web, les deux patterns les plus courants :

**Session-based (sessions) :** le serveur crée une session et donne un identifiant (cookie) au client.

```
Client --POST /fox-river/entree {matricule, code_acces}--> Serveur
Serveur vérifie les credentials (matricule + code d'accès)
Serveur crée une session en base : { sessionId: "xyz", matricule: 94941, expiresAt: ... }
Serveur --Set-Cookie: sessionId=xyz; HttpOnly; Secure--> Client

Client --GET /dossier + Cookie: sessionId=xyz--> Serveur
Serveur vérifie la session en base, retourne les données du prisonnier
```

**JWT-based (JSON Web Token) :** le serveur génère un token signé, le client le stocke et l'envoie.

```
Client --POST /fox-river/entree {matricule, code_acces}--> Serveur
Serveur vérifie le couple matricule + code_acces
Serveur génère un JWT signé avec sa clé secrète
Serveur --200 OK {token: "eyJ..."}--> Client

Client --GET /dossier + Authorization: Bearer eyJ...--> Serveur
Serveur vérifie la signature du JWT (pas besoin de DB)
Serveur retourne les données si la signature est valide
```

---

## 2) JWT EN PROFONDEUR

Un JWT (JSON Web Token) a trois parties séparées par des points :

```
eyJhbGciOiJIUzI1NiJ9 . eyJ1c2VySWQiOjQyfQ . SflKxwRJSMeKKF2QT4fwpMeJf36P
   Header          Payload       Signature
```

```js
// Décoder manuellement pour comprendre la structure
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyfQ.SflKx...';
const [headerB64, payloadB64] = token.split('.');

// base64url decode (décodage base64 adapté aux URLs)
const header = JSON.parse(atob(headerB64));
// => { "alg": "HS256" } -- l'algorithme utilisé pour la signature

const payload = JSON.parse(atob(payloadB64));
// => { "userId": 42, "role": "prisoner", "iat": 1720000000, "exp": 1720086400 }
// iat (issued at) : timestamp de création du token
// exp (expiration) : timestamp d'expiration
```

La signature est la clé de tout : elle garantit que le payload n'a pas été modifié.

```js
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET; // jamais en dur dans le code

// Générer un token à la connexion
function generateTokens(userId, role) {
 const accessToken = jwt.sign(
  { userId, role },     // payload : données utiles dans le token
  SECRET,          // clé secrète pour signer
  { expiresIn: '15m' }   // access token court : 15 minutes
 );

 const refreshToken = jwt.sign(
  { userId },
  process.env.REFRESH_SECRET, // clé différente pour le refresh token
  { expiresIn: '7d' }    // refresh token long : 7 jours
 );

 return { accessToken, refreshToken };
}

// Middleware de vérification : s'assurer que le token est valide
function requireAuth(req, res, next) {
 const authHeader = req.headers.authorization;

 if (!authHeader?.startsWith('Bearer ')) {
  return res.status(401).json({ error: 'Token manquant' });
 }

 const token = authHeader.split(' ')[1]; // extraire le token après "Bearer "

 try {
  const decoded = jwt.verify(token, SECRET); // vérifie signature ET expiration
  req.user = decoded; // attacher les infos du user à la requête
  next();
 } catch (err) {
  if (err.name === 'TokenExpiredError') {
   return res.status(401).json({ error: 'TOKEN_EXPIRED' }); // le client doit refresh
  }
  return res.status(401).json({ error: 'Token invalide' });
 }
}
```

---

## 3) LE FLOW DE REFRESH TOKEN

Un access token court (15min) + refresh token long (7j) : le meilleur compromis sécurité/UX.

```
Client se connecte --> reçoit { accessToken (15min), refreshToken (7j) }

Requête normale :
Client --> GET /api/dossier + Authorization: Bearer accessToken --> Serveur --> 200 OK

Access token expiré :
Client --> GET /api/dossier + Authorization: Bearer accessToken --> Serveur --> 401 TOKEN_EXPIRED
Client --> POST /fox-river/renouveler-badge + { refreshToken } --> Serveur
Serveur vérifie le refresh token en DB (les refresh tokens sont stockés en DB)
Serveur --> { new accessToken, new refreshToken } --> Client
Client re-tente la requête originale avec le nouvel access token
```

```js
// Côté client : interceptor (intercepteur) qui gère automatiquement le refresh
async function apiFetch(url, options = {}) {
 let accessToken = localStorage.getItem('accessToken'); // ATTENTION : voir note sécurité

 const response = await fetch(url, {
  ...options,
  headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
 });

 if (response.status === 401) {
  const body = await response.json();

  if (body.error === 'TOKEN_EXPIRED') {
   // Tenter le refresh
   const refreshed = await refreshAccessToken();
   if (!refreshed) {
    // Refresh échoué : déconnecter l'utilisateur
    logout();
    throw new Error('Session expirée : reconnexion requise');
   }

   // Re-tenter la requête avec le nouveau token
   accessToken = localStorage.getItem('accessToken');
   return fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
   });
  }
 }

 return response;
}
```

**Note sécurité : localStorage vs cookie HttpOnly**

```
localStorage  => accessible par JS --> vulnérable aux attaques XSS
cookie HttpOnly => inaccessible par JS --> protégé contre XSS

Recommandation : stocker les tokens dans des cookies HttpOnly, Secure, SameSite=Strict.
Le cookie est envoyé automatiquement par le navigateur sur chaque requête.
```

---

## 4) AUTORISATION : QU'EST-CE QUE TU PEUX FAIRE

Après authentification, il faut vérifier les droits.
Deux patterns principaux :

**RBAC (Role-Based Access Control : contrôle d'accès basé sur les rôles)**

```js
// Les rôles définissent des groupes de permissions
const PERMISSIONS = {
 admin: ['read:all', 'write:all', 'delete:all', 'manage:users'],
 guard: ['read:prisoners', 'write:reports', 'read:schedule'],
 prisoner: ['read:ownProfile', 'write:ownRequests'],
};

// Middleware d'autorisation
function requirePermission(permission) {
 return (req, res, next) => {
  const userPermissions = PERMISSIONS[req.user.role] || [];

  if (!userPermissions.includes(permission)) {
   // 403 : authentifié mais PAS autorisé (différent de 401 : pas authentifié)
   return res.status(403).json({ error: `Permission requise : ${permission}` });
  }

  next();
 };
}

// Utilisation dans les routes
app.delete('/api/prisoners/:id',
 requireAuth,             // 1. authentifié ?
 requirePermission('delete:all'),   // 2. autorisé à supprimer ?
 async (req, res) => {
  await deletePrisoner(req.params.id);
  res.status(204).end();
 }
);
```

**ABAC (Attribute-Based Access Control : contrôle basé sur les attributs)**

Plus flexible que RBAC : la décision dépend de plusieurs attributs contextuels.

```js
// L'autorisation dépend de l'user, de la ressource, et du contexte
function canAccess(user, resource, action) {
 // Un prisonnier peut seulement lire son propre profil
 if (action === 'read' && resource.type === 'prisoner') {
  return user.role === 'admin' || user.role === 'guard' || user.id === resource.id;
 }

 // Seul le créateur d'un rapport peut le modifier, ou un admin
 if (action === 'update' && resource.type === 'report') {
  return user.role === 'admin' || resource.createdBy === user.id;
 }

 // Par défaut : refuser
 return false;
}

app.get('/api/prisoners/:id', requireAuth, async (req, res) => {
 const prisoner = await getPrisoner(req.params.id);

 if (!canAccess(req.user, { type: 'prisoner', id: prisoner.id }, 'read')) {
  return res.status(403).json({ error: 'Accès refusé' });
 }

 res.json(prisoner);
});
```

---

## 5) OAUTH 2.0 : SE CONNECTER AVEC UN SERVICE TIERS

OAuth 2.0 : standard pour déléguer l'authentification à un service externe (Google, GitHub, etc.).

```
Flux Authorization Code (le plus sécurisé) :

1. Client --> redirige vers Google/GitHub avec client_id et redirect_uri
2. User se connecte sur Google, autorise l'app
3. Google --> redirige vers redirect_uri avec un `code` temporaire
4. Serveur --> échange le `code` contre un access_token auprès de Google (requête serveur → serveur)
5. Serveur --> utilise l'access_token pour récupérer les infos du user chez Google
6. Serveur --> crée ou met à jour l'user en base, génère sa propre session/JWT
```

L'app ne voit jamais le mot de passe Google. Elle reçoit juste les données du profil.

---

## EXERCICES

**EXO 1 : Implémenter le middleware d'auth de Fox River**
Crée `requireAuth` et `requireRole(...roles)` pour Express.
`requireAuth` : vérifie le JWT dans le header Authorization.
`requireRole('admin', 'guard')` : vérifie que l'user a l'un des rôles autorisés.
Protège une route de listing des prisonniers (guard + admin) et une route de suppression (admin seulement).

**EXO 2 : Le flow de refresh token**
Implémente un endpoint `POST /auth/refresh` qui :
- vérifie le refresh token (stocké en DB avec une liste de tokens valides)
- invalide l'ancien refresh token
- génère un nouveau access token (15min) et un nouveau refresh token (7j)
- retourne les deux au client

**EXO 3 : RBAC vs ABAC**
Tu as trois rôles : `warden` (directeur), `guard`, `prisoner`.
Scénario 1 : les guards peuvent lire tous les dossiers des prisonniers → RBAC suffit.
Scénario 2 : un prisonnier peut voir son propre dossier mais pas celui des autres → ABAC.
Implémente les deux middlewares pour gérer ces deux cas.

---

## RÉSUMÉ

Authentification : qui tu es. Autorisation : ce que tu peux faire. Confondre les deux = bug de sécurité.
JWT : payload signé, vérifié par signature. Pas besoin de DB pour vérifier : mais tu perds le contrôle de révocation.
Access token court + refresh token long : le meilleur équilibre sécurité/expérience utilisateur.
`HttpOnly` cookie > `localStorage` pour stocker les tokens. XSS ne peut pas lire les cookies HttpOnly.
401 = non authentifié. 403 = non autorisé. Deux erreurs différentes, deux raisons différentes.
RBAC pour des permissions simples par rôle. ABAC quand les droits dépendent du contexte de la ressource.
