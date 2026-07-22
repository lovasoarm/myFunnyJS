---
stability: intemporel
---

# CACHING STRATEGIES : METTRE EN CACHE SANS METTRE EN DANGER
Temps de lecture ~10 min

Walter White a un problème de distribution.
Chaque client veut sa livraison immédiate. Il ne peut pas tout produire à la demande.
Solution : avoir du stock pré-produit dans des points stratégiques.
Mais du stock qui périme est dangereux. Du stock mal géré, c'est du gâchis.

Le cache web, c'est ça : avoir la réponse déjà calculée, disponible immédiatement.
Mais du cache qui expire mal : tu montres de vieilles données. Du cache trop agressif : t'as des bugs en prod que personne ne comprend.

---

## 1) POURQUOI LE CACHE EXISTE

Sans cache :

```
Client --> Serveur --> Base de données --> Serveur --> Client
Délai : 200ms à 2s selon le réseau et la DB
```

Avec cache navigateur :

```
Client --> Cache local (si hit) --> Client
Délai : 0ms
```

Avec cache CDN (Content Delivery Network : réseau de distribution de contenu) :

```
Client --> CDN (serveur proche géographiquement) --> Client
Délai : 10ms à 50ms au lieu de 200ms
```

Le cache est une hiérarchie. Chaque niveau en a un :

```
Navigateur (memory cache, disk cache)
  |
CDN / Proxy cache
  |
API Gateway cache
  |
Application cache (Redis, Memcached)
  |
Base de données (query cache)
```

---

## 2) CACHE-CONTROL : LE HEADER QUI COMMANDE TOUT

`Cache-Control` est le header HTTP qui dit au navigateur et aux proxys quoi faire avec la réponse.

```
Cache-Control: max-age=3600
=> stocker en cache, valide pendant 3600 secondes (1 heure)

Cache-Control: no-cache
=> stocker en cache mais revalider (vérifier) auprès du serveur avant d'utiliser

Cache-Control: no-store
=> ne jamais stocker, toujours re-télécharger (données sensibles : session, banking)

Cache-Control: private
=> seulement dans le cache du navigateur, pas dans les CDNs ni les proxys partagés

Cache-Control: public
=> peut être stocké partout : navigateur, CDN, proxy

Cache-Control: s-maxage=86400
=> durée de validité spécifiquement pour les CDNs (s = shared)

Cache-Control: stale-while-revalidate=60
=> servir le cache périmé pendant 60s PENDANT qu'on récupère la version fraîche en arrière-plan

Cache-Control: immutable
=> ce fichier ne changera jamais (CSS/JS avec hash dans le nom), ne revalide jamais
```

Exemples concrets selon le type de ressource :

```js
// Dans Express : configurer les headers de cache selon le type de ressource

// Assets statiques avec hash (ex: main.abc123.js) : ne changent jamais
// Si le fichier change, il a un nouveau nom donc un nouveau hash
app.use('/static', express.static('dist', {
 setHeaders(res) {
  res.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 an
 }
}));

// Pages HTML : revalider à chaque fois (le contenu change souvent)
app.get('/', (req, res) => {
 res.set('Cache-Control', 'no-cache'); // stocker mais vérifier si c'est encore frais
 res.sendFile('index.html');
});

// API avec données qui changent : pas de cache CDN, cache court navigateur
app.get('/api/scores', (req, res) => {
 res.set('Cache-Control', 'private, max-age=30'); // 30s dans le navigateur uniquement
 res.json(scores);
});

// Données sensibles : jamais en cache
app.get('/api/account', (req, res) => {
 res.set('Cache-Control', 'no-store'); // ne stocker nulle part
 res.json(accountData);
});
```

---

## 3) ETAG ET CONDITIONAL REQUESTS

ETag (Entity Tag) : empreinte (fingerprint) unique d'une ressource.
Le navigateur la stocke. À la prochaine requête, il l'envoie au serveur.
Si la ressource n'a pas changé, le serveur répond 304 Not Modified : pas de téléchargement.

```
1ère requête :
Client --GET /api/products--> Serveur
    <--200 OK + data + ETag: "abc123"--

2ème requête (If-None-Match) :
Client --GET /api/products + If-None-Match: "abc123"--> Serveur
Si data n'a pas changé : <--304 Not Modified (pas de body)--
Si data a changé :    <--200 OK + nouvelle data + ETag: "xyz789"--
```

```js
// Côté serveur : générer et vérifier les ETags
import crypto from 'crypto';

app.get('/api/products', (req, res) => {
 const products = getProducts(); // récupérer les données
 const data = JSON.stringify(products);

 // Générer un ETag basé sur le contenu : si le contenu change, l'ETag change
 const etag = `"${crypto.createHash('md5').update(data).digest('hex')}"`;

 // Vérifier si le client a déjà cette version
 if (req.headers['if-none-match'] === etag) {
  return res.status(304).end(); // pas de body : économie de bande passante
 }

 res.set({
  'ETag': etag,
  'Cache-Control': 'public, max-age=0, must-revalidate', // revalider à chaque fois
 });

 res.json(products);
});
```

**Last-Modified** : alternative à ETag basée sur la date de modification.

```js
app.get('/api/article', (req, res) => {
 const article = getArticle();
 const lastModified = article.updatedAt.toUTCString();

 // Si le client a la version de cette date ou plus récente : 304
 if (req.headers['if-modified-since'] === lastModified) {
  return res.status(304).end();
 }

 res.set('Last-Modified', lastModified);
 res.json(article);
});
```

---

## 4) STALE-WHILE-REVALIDATE : LA STRATÉGIE LA PLUS UTILE

Le problème classique : tu veux du cache mais pas de données trop vieilles.

```
max-age trop court => trop de requêtes serveur
max-age trop long  => données périmées affichées
```

`stale-while-revalidate` (périmé pendant la revalidation) résout ça :

```
Cache-Control: max-age=60, stale-while-revalidate=300
```

Comportement :
- 0 à 60s : réponse fraîche depuis le cache, aucune requête serveur.
- 60 à 360s : servir le cache périmé IMMÉDIATEMENT, ET déclencher une requête serveur en arrière-plan pour mettre à jour le cache.
- Après 360s : toujours vérifier auprès du serveur avant de répondre.

```
Utilisation à t=50s  --> cache frais, réponse immédiate
Utilisation à t=90s  --> cache périmé, réponse immédiate + refresh en cours
Utilisation à t=70s  --> maintenant c'est le cache frais du refresh
Utilisation à t=400s --> revalider avec le serveur
```

C'est la stratégie parfaite pour du contenu qui change mais pas trop vite : articles de blog, classements, données de catalogue.

---

## 5) CACHE CÔTÉ APPLICATION : REDIS

Pour les données coûteuses à recalculer (requêtes DB complexes, appels API externes), le cache applicatif (Redis, Memcached) est incontournable.

```js
// Pattern cache-aside (cache en parallèle) : lire le cache avant la DB
async function getLeaderboard() {
 const cacheKey = 'ballon-dor:leaderboard:2026';

 // 1. Vérifier le cache d'abord (Redis ultra rapide : < 1ms)
 const cached = await redis.get(cacheKey);
 if (cached) {
  return JSON.parse(cached); // cache hit (succès) : on évite la DB
 }

 // 2. Cache miss (raté) : aller chercher en base (peut prendre 50ms à 500ms)
 const leaderboard = await db.query(`
  SELECT players.name, SUM(votes.points) as total
  FROM votes JOIN players ON votes.player_id = players.id
  GROUP BY players.id ORDER BY total DESC LIMIT 10
 `);

 // 3. Stocker en cache avec TTL (Time To Live : durée de vie)
 await redis.setex(cacheKey, 3600, JSON.stringify(leaderboard)); // TTL : 1 heure

 return leaderboard;
}

// Invalidation (suppression) du cache quand les données changent
async function addVote(playerId, points) {
 await db.insertVote(playerId, points);

 // Les votes ont changé : le classement en cache est périmé
 await redis.del('ballon-dor:leaderboard:2026'); // invalider le cache
 // La prochaine requête recalculera et re-populera le cache
}
```

---

## 6) LES PIÈGES DU CACHE

**Piège 1 : Cache poisoning (empoisonnement)**
Un CDN cache une réponse qui contient du contenu malveillant ou erroné.
Tous les utilisateurs reçoivent la réponse empoisonnée jusqu'à l'invalidation.

**Piège 2 : Cache stampede (ruée vers le cache)**
Le cache expire. 1000 requêtes simultanées arrivent en même temps, toutes vont en DB.
La DB est submergée.

```js
// Solution : mutex (verrou) pour éviter la stampede
const locks = new Map();

async function getCachedData(key, fetchFn) {
 const cached = await redis.get(key);
 if (cached) return JSON.parse(cached);

 // Si une requête est déjà en train de recalculer, attendre son résultat
 if (locks.has(key)) {
  await locks.get(key); // attendre que le verrou soit libéré
  return JSON.parse(await redis.get(key)); // maintenant le cache est chaud
 }

 // Premier à arriver : poser le verrou
 let resolve;
 const lock = new Promise(r => (resolve = r)); // créer une promesse non résolue
 locks.set(key, lock);

 try {
  const data = await fetchFn();
  await redis.setex(key, 3600, JSON.stringify(data));
  return data;
 } finally {
  resolve(); // libérer le verrou
  locks.delete(key);
 }
}
```

**Piège 3 : Stale data (données périmées) affichées trop longtemps**
`max-age` trop long + pas d'ETag + pas d'invalidation = users qui voient de vieilles données.
Toujours avoir un mécanisme d'invalidation explicite en plus du TTL.

---

## EXERCICES

**EXO 1 : La stratégie de Walter White**
Tu as quatre types de ressources : logo du site, page d'accueil HTML, API de prix (change toutes les heures), données de compte utilisateur.
Définis le header `Cache-Control` exact pour chacune. Justifie chaque choix avec un argument de sécurité ou performance.

**EXO 2 : Implémenter un cache avec ETag**
Crée un endpoint Express `/api/standings` (classement du Ballon d'Or).
Le classement change seulement quand `standings.json` est modifié.
Implémente la revalidation avec ETag basé sur le hash MD5 du contenu.
Si rien n'a changé : 304 No Content. Si changé : 200 avec le nouveau contenu et le nouvel ETag.

**EXO 3 : Résoudre le cache stampede**
Simule un stampede : 100 fonctions async qui appellent `getCachedData('ballon-dor', fetchLeaderboard)` simultanément.
Sans protection : `fetchLeaderboard` est appelée 100 fois.
Avec le pattern mutex ci-dessus : elle est appelée une seule fois.
Implémente les deux versions et mesure le nombre d'appels à `fetchLeaderboard` avec un compteur.

---

## RÉSUMÉ

Le cache existe pour éviter de recalculer ce qui n'a pas changé. Chaque niveau de la stack peut en avoir un.
`Cache-Control` commande tout : `max-age` pour la durée, `no-store` pour les données sensibles, `private` pour les données personnelles.
Les assets statiques avec hash dans le nom : `immutable` et `max-age=31536000`. Le nom change quand le contenu change.
ETag : le serveur donne une empreinte, le client la renvoie, le serveur dit si ça a changé. 304 = pas de re-téléchargement.
`stale-while-revalidate` : servir le cache périmé immédiatement ET rafraîchir en arrière-plan. Le meilleur des deux mondes.
