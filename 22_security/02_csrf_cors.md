---
stability: intemporel
---

# CSRF ET CORS
Temps de lecture ~9 min

Deux acronymes. Deux problèmes complètement différents. Un seul point commun : si tu les confonds ou tu les misconfigures (mal configurer), tu ouvres une faille que tu ne verras pas venir.

CSRF (Cross-Site Request Forgery : falsification de requête cross-site) est une attaque. CORS (Cross-Origin Resource Sharing : partage de ressources cross-origine) est un mécanisme de sécurité du navigateur. Les deux parlent de "cross-site" mais dans des sens opposés.

---

## 1) CSRF : L'ATTAQUANT QUI SE FAIT PASSER POUR TOI

### Le quoi

CSRF : un site malveillant déclenche une requête vers ton API en utilisant la session active d'un détenu authentifié. Le serveur voit la requête, voit le cookie de session valide, et l'exécute. Le détenu ne sait pas que ça s'est passé.

### Pourquoi ça marche

Les navigateurs envoient automatiquement les cookies de session avec chaque requête vers le domaine correspondant. Même si la requête vient d'un autre site.

```
Détenu --> se connecte sur bank.com --> reçoit un cookie de session
Attaquant  --> envoie un email avec un lien vers evil.com
Détenu --> visite evil.com (le cookie bank.com est toujours actif)
evil.com  --> déclenche un formulaire POST vers bank.com/transfer?to=attaquant&amount=5000
Navigateur --> envoie la requête AVEC le cookie bank.com (automatique)
bank.com  --> voit un cookie valide --> exécute le transfert
```

### Exemple qui casse

```html
<!-- evil.com : cette page est invisible, chargée automatiquement -->
<!-- Le formulaire se soumet dès le chargement de la page -->
<body onload="document.getElementById('attack').submit()">
 <form id="attack" action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attaquant123">
  <input type="hidden" name="amount" value="5000">
 </form>
</body>
<!-- Le navigateur envoie le cookie bank.com avec ce POST : le détenu a transféré 5000€ sans le savoir -->
```

### La fix : tokens CSRF

```js
// Côté serveur : générer un token CSRF unique par session
const crypto = require('crypto');

// Middleware qui génère et stocke le token dans la session
app.use((req, res, next) => {
 if (!req.session.csrfToken) {
  // token aléatoire de 32 octets en hex : imprévisible par l'attaquant
  req.session.csrfToken = crypto.randomBytes(32).toString('hex');
 }
 // exposer le token pour que le frontend puisse l'inclure dans les requêtes
 res.locals.csrfToken = req.session.csrfToken;
 next();
});

// Sur chaque formulaire côté HTML : inclure le token dans un champ caché
// <input type="hidden" name="_csrf" value="<%= csrfToken %>">

// Middleware de vérification sur les routes qui modifient l'état
const verifyCsrf = (req, res, next) => {
 const tokenFromRequest = req.body._csrf || req.headers['x-csrf-token'];
 const tokenFromSession = req.session.csrfToken;

 // comparaison en temps constant pour éviter les timing attacks (attaques par mesure du temps de réponse)
 const valid = crypto.timingSafeEqual(
  Buffer.from(tokenFromRequest || '', 'utf8'),
  Buffer.from(tokenFromSession || '', 'utf8')
 );

 if (!valid) return res.status(403).json({ error: 'CSRF token invalide' });
 next();
};

// Le POST de transfert est maintenant protégé
app.post('/transfer', verifyCsrf, (req, res) => {
 // evil.com ne connaît pas le csrfToken, sa requête est rejetée
 processTransfer(req.body);
});
```

### SameSite : la protection native du navigateur

```js
// Option de cookie qui empêche le navigateur de l'envoyer depuis d'autres sites
res.cookie('sessionId', token, {
 httpOnly: true,  // JS ne peut pas lire ce cookie (protection contre XSS)
 secure: true,   // cookie envoyé uniquement en HTTPS
 sameSite: 'Strict' // JAMAIS envoyé depuis un autre site : protection CSRF native
 // sameSite: 'Lax' : envoyé uniquement sur les navigations GET (moins strict, mais compatible OAuth)
 // sameSite: 'None' : toujours envoyé, mais secure obligatoire
});
```

`SameSite: Strict` est la meilleure protection CSRF si ton app n'a pas besoin de cookies cross-site. Pour OAuth et les redirections, `SameSite: Lax` est souvent le bon compromis.

---

## 2) CORS : LE VIDEUR DE TA PORTE D'ENTRÉE

### Le quoi

CORS : politique du navigateur qui bloque les requêtes JavaScript vers un domaine différent de celui de la page. Par défaut, `fetch('https://api.example.com')` depuis `https://app.example.com` est bloqué.

C'est une protection, pas une attaque. Le navigateur fait ça pour toi.

### Pourquoi ça existe

Sans CORS, un script sur `evil.com` pourrait faire des requêtes vers ton API en utilisant les credentials (identifiants : cookies, headers d'auth) du détenu et lire les réponses.

```
Même origine (same-origin)  --> même protocole + même domaine + même port --> autorisé
Origines différentes (cross-origin) --> tout autre cas --> bloqué par défaut
```

```
https://app.com  vs https://api.app.com  --> cross-origin (sous-domaine différent)
https://app.com  vs http://app.com    --> cross-origin (protocole différent)
https://app.com  vs https://app.com:3001 --> cross-origin (port différent)
```

### Le flux de vérification

```
Navigateur --> veut faire un fetch vers une autre origine
      --> envoie d'abord une "preflight request" (requête de vérification préalable) OPTIONS
      --> le serveur répond avec les headers CORS qui indiquent ce qui est autorisé
      --> si OK, le navigateur envoie la vraie requête
      --> si non OK, le navigateur bloque et renvoie une erreur CORS à JS
```

Les requêtes "simples" (GET/POST avec certains content-types) passent sans preflight, mais le navigateur vérifie quand même les headers CORS sur la réponse avant de l'exposer à JS.

### Configuration CORS en Express

```js
const cors = require('cors');

// MAUVAIS : autoriser tout le monde --> CORS ne protège plus rien
app.use(cors()); // équivalent à Access-Control-Allow-Origin: * --> n'importe quel site peut lire tes réponses

// BON : liste blanche d'origines autorisées
const allowedOrigins = [
 'https://app.example.com',  // ton front en prod
 'https://staging.example.com' // ton front en staging
];

// En dev uniquement : ajouter localhost
if (process.env.NODE_ENV !== 'production') {
 allowedOrigins.push('http://localhost:3000');
}

app.use(cors({
 origin: (origin, callback) => {
  // origin est undefined pour les requêtes directes (Postman, curl)
  if (!origin || allowedOrigins.includes(origin)) {
   callback(null, true); // autorisé
  } else {
   callback(new Error(`Origine non autorisée : ${origin}`)); // bloqué
  }
 },
 methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // verbes HTTP autorisés
 allowedHeaders: ['Content-Type', 'Authorization'],  // headers que le client peut envoyer
 credentials: true, // autorise l'envoi des cookies cross-origin (nécessite une origin précise, pas *)
}));
```

### Le piège classique : CORS + credentials

```js
// Mauvais combo : credentials avec wildcard --> le navigateur bloque de toute façon
app.use(cors({
 origin: '*',    // wildcard
 credentials: true // --> ERREUR : le navigateur refuse ce combo
}));

// Correct : une origin précise avec credentials
app.use(cors({
 origin: 'https://app.example.com', // précise
 credentials: true          // maintenant valide
}));
```

### CORS ne protège pas côté serveur

CORS est une protection navigateur. `curl` et les requêtes serveur-à-serveur ignorent CORS. Si ton API a des données sensibles, CORS ne suffit pas : il faut aussi une authentification côté serveur.

```
CORS  --> empêche un script JS cross-origin de LIRE ta réponse
Auth  --> empêche n'importe qui d'appeler ton API sans permission
Les deux sont nécessaires, ils protègent des choses différentes.
```

---

## 3) CSRF VS CORS : LA DIFFÉRENCE EN UNE LIGNE

```
CSRF --> l'attaquant déclenche une requête à ta place (il n'a pas besoin de lire la réponse)
CORS --> l'attaquant essaie de LIRE la réponse d'une requête cross-origin
```

Un attaquant CSRF se fout de lire la réponse : il veut juste que l'action s'exécute (virement, suppression de compte, changement de mot de passe). CORS ne protège pas contre ça.

---

## EXERCICES

**EXO 1 : Le virement forcé**
L'app Prison Break a un endpoint `POST /api/escape-plan/execute` qui exécute le plan d'évasion si le détenu est connecté. Une page externe peut potentiellement le déclencher via un formulaire caché.
Implémenter la protection CSRF complète : génération du token, middleware de vérification, et le formulaire côté HTML.
Contrainte : ne pas utiliser de bibliothèque CSRF tierce, uniquement `crypto` natif.

**EXO 2 : L'API du dashboard Ultras**
L'API du dashboard tourne sur `api.ultras-stats.com`. Le front tourne sur `app.ultras-stats.com` (prod) et `localhost:3000` (dev). Des partenaires externes ont besoin d'accès en lecture seule (GET uniquement) depuis n'importe quelle origine.
Configurer CORS pour : autoriser le front prod et dev en lecture/écriture avec cookies, autoriser les partenaires en lecture seule sans cookies.
Contrainte : pas de wildcard, chaque cas traité séparément.

**EXO 3 : Détecter la misconfiguration**
Le code suivant a trois problèmes de sécurité. Les identifier et proposer la version corrigée.

```js
app.use(cors({ origin: '*', credentials: true }));
app.use(session({ secret: 'secret', cookie: { sameSite: 'None' } }));
app.post('/delete-account', (req, res) => deleteAccount(req.session.userId));
```

(Indice : cherche le combo interdit, la protection manquante, et l'option de cookie risquée)

---

## RÉSUMÉ

CSRF exploite la confiance du serveur envers le navigateur du détenu. La défense : tokens imprévisibles ou `SameSite` sur les cookies. CORS contrôle qui peut lire tes réponses depuis le navigateur. La configuration : liste blanche stricte, pas de wildcard avec credentials. Les deux protègent des choses différentes et les deux sont nécessaires dans une app authentifiée.
