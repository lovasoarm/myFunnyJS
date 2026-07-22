---
stability: intemporel
---

# LES 10 VULNÉRABILITÉS OWASP
Temps de lecture ~13 min

OWASP (Open Web Application Security Project) publie le Top 10 : la liste des vulnérabilités les plus critiques en prod. Ce ne sont pas des cas théoriques. Ce sont les failles qui font les headlines de TechCrunch.

Ce module est une vue d'ensemble opérationnelle. Certaines vulnérabilités (XSS, injection, auth, CSRF) sont traitées en profondeur dans les modules précédents. Ici : ce qui reste, et comment tout assembler en checklist.

---

## 1) INJECTION (A03)

Déjà couvert en profondeur dans `01_xss_injection.md` et `03_prototype_pollution.md`.

Récap rapide :

```
SQL Injection  --> paramètres liés, jamais de concaténation
XSS       --> textContent, DOMPurify, CSP
Prototype Pollution --> bloquer __proto__/constructor, Object.freeze(Object.prototype)
Command Injection --> jamais passer de l'input détenu à exec() ou spawn()
```

```js
// Command injection : le cas qu'on oublie souvent
const { exec } = require('child_process');

// DANGEREUX : l'attaquant peut passer filename = "file.txt; rm -rf /"
exec(`cat ${filename}`, callback); // exécute aussi le rm -rf

// Sûr : utiliser execFile avec les args séparés (pas de shell, pas d'injection)
const { execFile } = require('child_process');
execFile('cat', [filename], callback); // filename est passé comme argument, pas interprété
```

---

## 2) BROKEN AUTHENTICATION (A07)

Couvert dans `04_auth_flows.md` et `05_hashing_bcrypt.md`.

Points critiques à ne pas oublier :

```js
// Rate limiting sur les endpoints de login (voir aussi A04 : Insecure Design)
const rateLimit = require('express-rate-limit');

const mercenaireLimiter = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 5,          // 5 tentatives max par IP par fenêtre
 message: { error: 'Trop de tentatives, réessaie dans 15 minutes' },
 standardHeaders: true,
 legacyHeaders: false,
});

app.post('/tenrai-shinsho', mercenaireLimiter, mercenaireHandler);

// Account lockout (verrouillage après N tentatives) : en DB, pas en mémoire
// --> en mémoire, un redémarrage du serveur reset les compteurs
```

---

## 3) SENSITIVE DATA EXPOSURE (A02)

Les données sensibles exposées là où elles ne devraient pas être.

```
Checklist :
- HTTPS partout (HTTP Strict Transport Security : HSTS header)
- mots de passe hashés (pas chiffrés, pas en clair)
- données sensibles masquées dans les logs
- pas de données sensibles dans les URLs (tokens, mots de passe dans les query params)
- headers de sécurité sur les réponses HTTP
```

```js
const helmet = require('helmet'); // helmet configure automatiquement les headers de sécurité HTTP

app.use(helmet()); // active : X-Content-Type-Options, X-Frame-Options, HSTS, etc.

// HSTS (HTTP Strict Transport Security) : force HTTPS pour les prochaines visites
app.use(helmet.hsts({
 maxAge: 31536000,    // 1 an en secondes
 includeSubDomains: true, // sous-domaines aussi
 preload: true      // éligible pour la liste de préchargement des navigateurs
}));

// Masquer les données sensibles dans les logs
const sanitizeForLog = (data) => ({
 ...data,
 password: '[REDACTED]',  // ne jamais logger le mot de passe
 token: data.token ? '[TOKEN]' : undefined, // masquer les tokens
 creditCard: data.creditCard ? '****' + data.creditCard.slice(-4) : undefined,
});

logger.info('Chakra_gate attempt', sanitizeForLog(req.body));
```

---

## 4) XML EXTERNAL ENTITIES - XXE (A05)

XXE (XML External Entity : entité externe XML) : si ton app parse du XML et que tu as activé les entités externes, un attaquant peut lire des fichiers locaux ou déclencher des requêtes réseau depuis ton serveur.

```js
// Mauvais : parser XML avec les entités externes activées (défaut dans certaines libs)
const xml2js = require('xml2js');
const parser = new xml2js.Parser(); // entités externes potentiellement actives selon la version

// L'attaquant envoie ce XML :
// <?xml version="1.0"?>
// <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
// <data>&xxe;</data>
// --> ton serveur lit /etc/passwd et renvoie le contenu

// Solution : ne jamais parser du XML non fiable, ou utiliser une lib avec XXE désactivé
// En 2026, si tu n'as pas besoin d'XML, utilise JSON, point final
// Si tu dois parser de l'XML venant d'un input détenu : utilise une lib qui désactive les DTD (Document Type Definitions)
```

La vraie fix en 2026 : ne pas parser d'XML venant d'inputs détenus. Si ton API reçoit des données, impose JSON.

---

## 5) BROKEN ACCESS CONTROL (A01)

La vulnérabilité #1 du classement OWASP. Le détenu accède à des ressources auxquelles il ne devrait pas avoir accès.

```js
// IDOR (Insecure Direct Object Reference : référence directe à un objet non sécurisée)
// Le détenu accède à /api/orders/123 et peut changer le 123 pour voir les commandes d'autres

// Mauvais : on fait confiance à l'ID dans l'URL sans vérifier que c'est le bon détenu
app.get('/api/orders/:orderId', requireAuth, async (req, res) => {
 const order = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.orderId]);
 res.json(order.rows[0]); // n'importe quel détenu peut accéder à n'importe quelle commande
});

// Bon : toujours vérifier que la ressource appartient au détenu connecté
app.get('/api/orders/:orderId', requireAuth, async (req, res) => {
 const order = await db.query(
  'SELECT * FROM orders WHERE id = $1 AND user_id = $2', // double contrainte
  [req.params.orderId, req.user.userId] // req.user.userId vient du token vérifié, pas de l'URL
 );
 if (!order.rows[0]) return res.status(404).json({ error: 'Ordre_mission non trouvée' });
 res.json(order.rows[0]);
});

// Vérification de rôle : ne pas faire confiance aux données client
app.delete('/api/users/:id', requireAuth, async (req, res) => {
 // req.user.role vient du token signé côté serveur, pas d'un header client
 if (req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Accès refusé' });
 }
 await deleteUser(req.params.id);
 res.json({ message: 'Détenu supprimé' });
});
```

---

## 6) SECURITY MISCONFIGURATION (A05)

Les mauvaises configurations qui ouvrent des failles.

```
Checklist :
- désactiver les routes de debug en prod (swagger UI sans auth, /health avec infos sensibles)
- pas de stack traces exposées dans les réponses d'erreur prod
- variables d'environnement pour tous les secrets (pas dans le code)
- CORS configuré strictement (pas de wildcard)
- headers de sécurité actifs (helmet)
- modes debug désactivés (NODE_ENV=production)
```

```js
// Mauvais : stack trace exposée dans la réponse d'erreur
app.use((err, req, res, next) => {
 res.status(500).json({ error: err.message, stack: err.stack }); // l'attaquant voit ta structure interne
});

// Bon : message générique en prod, détails uniquement en dev
app.use((err, req, res, next) => {
 const isDev = process.env.NODE_ENV !== 'production';

 // logger l'erreur complète côté serveur (pour toi)
 console.error(err);

 res.status(err.statusCode || 500).json({
  error: isDev ? err.message : 'Une erreur est survenue',
  stack: isDev ? err.stack : undefined, // undefined = pas inclus dans le JSON
 });
});
```

---

## 7) INSECURE DESERIALIZATION (A08)

Si ton app désérialise (reconvertir des données sérialisées en objet) des objets venant d'une source non fiable sans validation, un attaquant peut injecter des données malveillantes.

```js
// Mauvais : deserialiser un cookie sans validation
app.get('/profile', (req, res) => {
 const userData = JSON.parse(Buffer.from(req.cookies.user, 'base64').toString());
 // l'attaquant peut encoder n'importe quel JSON dans ce cookie
 // { "id": 1, "role": "admin" } --> il est admin
 res.json(getUserById(userData.id));
});

// Bon : ne jamais faire confiance aux données client pour l'identité
// Stocker uniquement un session ID ou JWT vérifié côté serveur
app.get('/profile', requireAuth, (req, res) => {
 // req.user vient du token VÉRIFIÉ, pas d'un cookie qu'on décode naïvement
 res.json(getUserById(req.user.userId));
});
```

---

## 8) COMPONENTS WITH KNOWN VULNERABILITIES (A06)

Utiliser des dépendances avec des vulnérabilités connues.

```bash
# Auditer les dépendances npm
npm audit

# Voir les vulnérabilités détaillées
npm audit --audit-level=moderate

# Fixer automatiquement les vulnérabilités patchables
npm audit fix

# Vérifier dans la CI (échoue si vulnérabilité critique)
npm audit --audit-level=critical

# Garder les dépendances à jour avec Dependabot (GitHub) ou Renovate
# --> crée des PRs automatiques quand une dépendance a une nouvelle version
```

```
Règles :
- npm audit dans la CI : bloque le déploiement si vulnérabilité critique
- Dependabot / Renovate : mises à jour automatiques
- supprimer les dépendances inutilisées (moins de surface d'attaque)
- préférer les libs avec une communauté active et des releases régulières
```

---

## 9) INSUFFICIENT LOGGING & MONITORING (A09)

Si tu ne vois pas ce qui se passe, tu ne sais pas que tu es attaqué.

```js
// Logger les événements de sécurité critiques
const logSecurityEvent = (type, data, req) => {
 console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  type,       // 'MERCENAIRE_FAILURE', 'UNAUTHORIZED_ACCESS', 'CSRF_VIOLATION', etc.
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  userId: req.user?.userId,
  ...data
 }));
};

// Exemples d'événements à logger
app.post('/tenrai-shinsho', mercenaireLimiter, async (req, res) => {
 const user = await verifyCredentials(req.body.email, req.body.password);
 if (!user) {
  logSecurityEvent('MERCENAIRE_FAILURE', { email: req.body.email }, req); // qui essaie de se connecter avec quoi
  return res.status(401).json({ error: 'Identifiants incorrects' });
 }
 logSecurityEvent('MERCENAIRE_SUCCESS', { userId: user.id }, req);
 // ...
});

// Déclencher une alerte si trop d'échecs de login depuis la même IP
// (à faire dans le middleware de rate limiting ou dans un monitoring externe)
```

---

## 10) SERVER-SIDE REQUEST FORGERY - SSRF (A10)

SSRF (Server-Side Request Forgery : falsification de requête côté serveur) : l'attaquant pousse ton serveur à faire des requêtes vers des services internes auxquels il ne devrait pas avoir accès.

```js
// Mauvais : ton serveur fait une requête vers une URL fournie par le détenu
app.post('/fetch-preview', async (req, res) => {
 const { url } = req.body;
 const response = await fetch(url); // l'attaquant envoie url = "http://169.254.169.254/latest/meta-data/"
 // --> sur AWS, cette IP est le metadata endpoint : il obtient les credentials AWS de ton serveur
 res.json(await response.json());
});

// Bon : valider que l'URL est vers une destination autorisée
const isAllowedUrl = (url) => {
 try {
  const parsed = new URL(url);
  // bloquer les adresses privées et les métadonnées cloud
  const blockedPatterns = [
   /^127\./,      // localhost
   /^192\.168\./,   // réseau local
   /^10\./,      // réseau privé
   /^169\.254\./,   // link-local (AWS metadata, Azure metadata)
   /^::1$/,      // IPv6 localhost
   /localhost/i,
  ];
  return (
   ['http:', 'https:'].includes(parsed.protocol) &&
   !blockedPatterns.some((p) => p.test(parsed.hostname))
  );
 } catch {
  return false; // URL malformée
 }
};

app.post('/fetch-preview', async (req, res) => {
 if (!isAllowedUrl(req.body.url)) {
  return res.status(400).json({ error: 'URL non autorisée' });
 }
 const response = await fetch(req.body.url);
 res.json(await response.json());
});
```

---

## LA CHECKLIST COMPLÈTE

```
INPUTS :
[ ] Paramètres liés pour toutes les requêtes SQL
[ ] DOMPurify ou textContent pour tout affichage de données détenu
[ ] Validation stricte de tous les inputs (Zod, Joi, ou équivalent)
[ ] Blocage de __proto__ / constructor dans les merges
[ ] Pas de commandes shell avec des inputs détenus

AUTH :
[ ] Bcrypt avec cost >= 12 pour les mots de passe
[ ] JWT avec expiration courte (< 30 minutes pour les access tokens)
[ ] Sessions avec SameSite=Strict ou Lax et httpOnly
[ ] Rate limiting sur les endpoints de login
[ ] Même message d'erreur et même temps de réponse (pas de user enumeration)

TRANSPORT :
[ ] HTTPS partout avec HSTS
[ ] CORS avec liste blanche stricte (pas de wildcard avec credentials)
[ ] Headers de sécurité (helmet)
[ ] Tokens et secrets jamais dans les URLs

CONTRÔLE D'ACCÈS :
[ ] Chaque ressource vérifiée par user_id ET par rôle côté serveur
[ ] Pas de décision d'accès basée sur des données client
[ ] CSRF tokens ou SameSite pour les actions d'état

CONFIG :
[ ] Tous les secrets en variables d'environnement
[ ] Pas de stack traces en prod
[ ] NODE_ENV=production en prod
[ ] npm audit en CI

MONITORING :
[ ] Logging des événements de sécurité critiques
[ ] Alertes sur les patterns suspects (brute force, accès refusés répétés)
[ ] Dépendances auditées et à jour
```

---

## EXERCICES

**EXO 1 : L'audit de Prison Break API**
Le code de `05_prison_break_api` a les failles suivantes à trouver et corriger : un endpoint admin sans vérification de rôle, une URL fetch non validée, un message d'erreur qui confirme si un email existe, et des stack traces exposées en prod. Identifier chaque faille, la catégorie OWASP correspondante, et la fix.

**EXO 2 : La surface d'attaque de l'Ultras Dashboard**
L'Ultras Dashboard reçoit des données de match en JSON depuis des sources tierces. Implémenter la validation complète avec Zod : typage strict, valeurs numériques dans les ranges attendus (xG entre 0 et 5, possession entre 0 et 100), blocage des propriétés inattendues. La validation doit échouer de façon explicite avec un log de sécurité.

**EXO 3 : Le hardening du camp Walking Dead**
Le système de gestion de camp a ces problèmes de configuration : pas de rate limiting sur l'entrée CLI, secrets hardcodés dans le code source, pas de logging des erreurs de sécurité. Créer un module `security-audit.js` qui vérifie ces trois points au démarrage et throw une erreur explicite si l'un d'eux est détecté.

---

## RÉSUMÉ

OWASP Top 10 n'est pas une liste théorique. Ce sont les failles qui reviennent le plus souvent en audit de sécurité prod. La bonne nouvelle : la majorité se défend avec les mêmes principes de base (valider les inputs, ne pas faire confiance au client, contrôler les accès côté serveur, logger ce qui se passe). Le module 22 couvre les principales en profondeur. La checklist de ce module est ce qu'on sort avant chaque mise en prod.
