# SYSTEM CONCEPTS GRIMOIRE
> Tu lis ce fichier et tu peux pas expliquer 10 de ces termes ?
> Slap yourself. Twice. Then come back.

Référence rapide. Tu croises un terme dans un codebase ou une PR review : tu viens ici, tu lis, tu repars.
Pour la théorie complète, suis les renvois vers les modules.

---

## API GATEWAY

Point d'entrée unique pour toutes les requêtes vers tes microservices. Il authentifie, route, rate-limite, loggue avant que ta logique business voie quoi que ce soit : tu évites de dupliquer cette mécanique dans chaque service.

```js
app.use('/api', (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!isValid(key)) return res.status(401).json({ error: 'Unauthorized' });
  logger.info({ path: req.path });
  proxy.web(req, res, { target: routeTo(req.path) });
});
```

> Le videur d'une boîte de nuit : il vérifie ta liste avant que tu entres, chaque service derrière est une salle différente. / Le standard téléphonique d'une grosse boîte : un seul numéro, il sait où t'envoyer.

---

## LOAD BALANCER

Distribue le trafic entrant sur plusieurs instances du même service. Objectif : aucun serveur ne crève sous la charge pendant que les autres tournent à 10%. Stratégies : round-robin, least connections, IP hash.

```js
const servers = ['srv1:3000', 'srv2:3000', 'srv3:3000'];
let i = 0;
function next() {
  const srv = servers[i];
  i = (i + 1) % servers.length; // 0 -> 1 -> 2 -> 0 ...
  return srv;
}
```

> Un chef de caisse qui ouvre des files dès que l'une explose. / Un dispatcher de pizzas qui répartit les commandes sur 4 livreurs au lieu d'en cramer un seul.

---

## REVERSE PROXY

Reçoit les requêtes clients et les transmet aux backends. Le client ne sait jamais à quel serveur il parle. Bonus : SSL termination, compression, cache statique, protection DDoS. Nginx en est l'exemple canonique.

```nginx
location / {
  proxy_pass http://localhost:3000;
  proxy_set_header X-Real-IP $remote_addr;
}
```

> Un agent littéraire : l'éditeur envoie ses manuscrits à l'agent, qui dispatch à l'auteur. L'éditeur ne sait jamais qui écrit. / Un service courrier d'entreprise : tu envoies à "Bureau Paris", le coursier interne choisit l'étage.

---

## RATE LIMITING

Limite le nombre total de requêtes qu'un client peut faire sur une période donnée. Protège contre les abus, scrapers et brute-force. HTTP 429 quand la limite est atteinte.

```js
function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const e = counts.get(ip) || { n: 0, reset: now + 60_000 };
  if (now > e.reset) { e.n = 0; e.reset = now + 60_000; }
  if (++e.n > 100) return res.status(429).end();
  counts.set(ip, e);
  next();
}
```

> Le videur qui compte les entrées : passé 200 personnes, tout le monde attend même avec un billet. / Un robinet avec minuterie : 10 litres par heure maximum, il se coupe automatiquement après.

---

## THROTTLING

Régule la vitesse de traitement plutôt que de compter les requêtes totales. Rate limiting dit "stop". Throttling dit "doucement". Implémentation classique : token bucket.

```js
class TokenBucket {
  constructor(cap, rate) {
    this.tokens = cap;
    this.cap = cap;
    setInterval(() => {
      this.tokens = Math.min(this.cap, this.tokens + 1);
    }, 1000 / rate);
  }
  consume() {
    return this.tokens > 0 ? !!(this.tokens--) : false;
  }
}
```

> L'autoroute qui passe à 70km/h en heure de pointe : tu roules toujours, le flux est régulé. / Un DJ qui baisse le BPM à 3h du mat pour tenir la salle jusqu'à la fermeture.

---

## PAGINATION

Découpe un résultat en pages plutôt que de tout envoyer d'un coup. Stratégies : offset (simple, lent sur gros volumes), cursor (performant, idéal pour les feeds infinis). Ne jamais retourner 100 000 lignes en une réponse.

```js
app.get('/posts', async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;
  const posts = await db.query(
    'SELECT * FROM posts ORDER BY id DESC LIMIT ? OFFSET ?',
    [limit, (page - 1) * limit]
  );
  res.json({ data: posts, page, limit });
});
```

> Un manga publié en volumes : Shonen Jump te balance pas 500 chapitres en PDF, ton téléphone mourrait. / Netflix et ses épisodes : pas toute la saison dans un seul fichier de 20GB.

---

## CACHE STAMPEDE

Bug dit "thundering herd" : le cache expire, des milliers de requêtes arrivent simultanément, toutes tapent la BDD en même temps. La BDD s'effondre. Classique sur les pages les plus populaires à fort trafic.

```js
async function getWithLock(key, fetchFn) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  if (locks.has(key)) {
    await sleep(50);
    return getWithLock(key, fetchFn); // quelqu'un reconstruit déjà : attends
  }
  locks.add(key); // une seule requête va en BDD
  const data = await fetchFn();
  await redis.set(key, JSON.stringify(data), 'EX', 300);
  locks.delete(key);
  return data;
}
```

> 30 élèves qui se ruent tous vers la porte en même temps : si un seul ouvrait et que les autres attendaient, ça irait 10x plus vite. / Panneau "SOLDES 70%" à minuit : 50 000 personnes refresh ensemble, le cache venait d'expirer, le site crash.

---

## IDEMPOTENCY

Une opération idempotente produit le même résultat peu importe combien de fois tu l'exécutes. GET et PUT sont idempotents. POST en général pas. Critique pour les paiements : si le réseau coupe, le client peut retry sans risque de doublon.

```js
app.post('/payment', async (req, res) => {
  const { idempotencyKey, amount } = req.body;
  const existing = await db.find({ idempotencyKey });
  if (existing) return res.json({ status: 'already_processed' });
  const payment = await stripe.charge({ amount });
  await db.save({ idempotencyKey, ...payment });
  res.json({ status: 'success' });
});
```

> Appuyer sur le bouton d'ascenseur déjà allumé : t'appuies 10 fois, l'ascenseur vient une seule fois. / Supprimer un fichier qui n'existe plus : la commande réussit quand même, elle ne plante pas.

---

## GRAPHQL

Le client choisit exactement les données qu'il veut. Fini l'over-fetching (100 champs reçus pour en utiliser 3) et l'under-fetching (une requête ne suffit pas, on en chaîne 5). Un seul endpoint `/graphql`.

```js
const query = `query { user(id: "42") { name email posts(limit: 5) { title } } }`;
await fetch('/graphql', { method: 'POST', body: JSON.stringify({ query }) });
```

> Commander à la carte : avec REST c'est menu fixe. / Un formulaire douanier que tu remplis toi-même : tu coches exactement ce que tu transportes.

→ Leçon complète : `19_api_craft/05_graphql_basics`

---

## gRPC

Framework RPC de Google utilisant Protocol Buffers (binaire, pas JSON). Ultra-rapide, fortement typé, HTTP/2 natif. Taillé pour la communication entre microservices où la performance compte plus que la lisibilité humaine. Contrat défini dans un fichier `.proto`.

```js
// Le contrat est signé dans users.proto avant tout échange
const client = new UserServiceClient('auth:50051', insecure());
client.getUser({ id: '42' }, (err, res) => {
  console.log(res.name); // fortement typé, pas un JSON balade
});
```

> Deux ingénieurs qui échangent des schémas techniques : plus précis, plus rapide, incompréhensible pour un humain lambda. / Un contrat notarié signé avant toute communication : les deux services ont signé le `.proto`, aucune ambiguïté possible.

---

## WEBHOOKS

Le serveur te pousse une notification HTTP dès qu'un événement se produit. Au lieu de poller "t'as du nouveau ?" en boucle, tu enregistres ton URL et tu attends. Toujours vérifier la signature du payload.

```js
app.post('/webhooks/stripe', (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body, req.headers['stripe-signature'], process.env.SECRET
  );
  if (event.type === 'payment_intent.succeeded')
    activatePremium(event.data.object.customer);
  res.status(200).send('OK'); // répondre vite, toujours
});
```

> Une sonnette de porte vs regarder par la fenêtre toutes les 10 secondes. / S'abonner à une newsletter : tu donnes ton URL, l'auteur pousse quand il publie.

---

## JWT

Jeton signé encodé en base64 contenant des claims utilisateur. Stateless : aucun état côté serveur. La signature cryptographique garantit que personne n'a modifié le payload en transit.

```js
// Génération au login
const token = jwt.sign({ userId: 42, role: 'admin' }, process.env.SECRET, { expiresIn: '1h' });

// Vérification sans toucher la BDD
const decoded = jwt.verify(token, process.env.SECRET);
```

> Un bracelet VIP de festival : chaque stand vérifie le bracelet, personne ne rappelle le guichet à chaque fois. / Un passeport : signé par l'État, vérifié à chaque douane, sans ouvrir le dossier complet.

→ Leçon complète : `19_api_craft/04_auth_jwt`

---

## OAUTH

Protocole d'autorisation : une app accède aux ressources d'un utilisateur chez un tiers sans jamais voir son mot de passe. Le flow échange un code contre un token à portée limitée (scope).

```js
const params = new URLSearchParams({
  client_id: process.env.GOOGLE_ID,
  redirect_uri: 'http://localhost:3000/callback',
  response_type: 'code',
  scope: 'email profile' // accès limité, rien d'autre
});
res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
```

> Donner les clés de voiture au voiturier : uniquement la clé de voiture (scope limité), pas ta carte bancaire. / Une procuration pour récupérer un colis précis : pas pour ouvrir tout ton compte.

→ Leçon complète : `20_security/04_auth_flows`

---

## CACHE INVALIDATION

Quand et comment supprimer ou mettre à jour les données en cache quand la source de vérité change. Stratégies : TTL (expiration auto), write-through (cache + BDD mis à jour ensemble), event-driven. L'erreur classique : mettre à jour la BDD sans toucher le cache.

```js
async function updateUser(id, data) {
  await db.users.update(id, data);
  await redis.set(`user:${id}`, JSON.stringify(data), 'EX', 3600);
  // les deux ou rien : jamais la BDD sans le cache
}
```

> Tableau d'affichage dans un couloir : le cours change de salle, tu oublies de mettre à jour, les étudiants arrivent au mauvais endroit. / Un GPS avec carte offline : la nouvelle autoroute ouvre, tu mets pas à jour, il t'envoie dans un champ.

---

## COMPOSITE INDEX

Index de BDD créé sur plusieurs colonnes combinées. L'ordre des colonnes est critique : un index `(a, b)` accélère une requête sur `a` seul, jamais sur `b` seul.

```sql
CREATE INDEX idx ON orders(user_id, status);
-- OK  : WHERE user_id = 42 AND status = 'pending'
-- OK  : WHERE user_id = 42
-- FAIL: WHERE status = 'pending'  -- full scan, index ignoré
```

> Un annuaire trié par NOM puis PRÉNOM : "Dupont Jean" est direct, mais trouver tous les "Jean" te fait tout parcourir. / Un classeur par ANNÉE puis CLIENT : "2024, Prometheus" instantané, "tout Prometheus" tu ouvres chaque classeur un par un.

---

## QUERY OPTIMIZATION

Structurer une requête SQL pour minimiser les aller-retours et le volume scanné. La pire erreur courante : le problème N+1. L'outil indispensable : `EXPLAIN ANALYZE`.

```js
// N+1 : 1 + N aller-retours en BDD
for (const u of users) {
  u.posts = await db.query('SELECT * FROM posts WHERE user_id = ?', [u.id]);
}

// Optimisé : 1 seul aller-retour
await db.query(`
  SELECT u.id, u.name, p.title
  FROM users u LEFT JOIN posts p ON p.user_id = u.id
`);
```

> Un cuisinier qui fait 50 voyages au frigo un ingrédient à la fois, vs un cuisinier qui sort tout avant de commencer. / Chercher 50 mots un par un dans un dictionnaire vs faire la liste et tout chercher en une session.

---

## CAP THEOREM

Un système distribué ne peut garantir simultanément que 2 de ces 3 propriétés : Consistency (donnée la plus récente), Availability (toujours une réponse), Partition Tolerance (résiste aux coupures réseau). En prod, P est non négociable : tu choisis entre CP et AP.

```
CP (MongoDB strict)  -> refuse les écritures si le noeud primaire est isolé.
                        Cohérence garantie, disponibilité sacrifiée.

AP (Cassandra)       -> répond même si un noeud est coupé, avec des données
                        potentiellement en retard. Disponibilité garantie, cohérence éventuelle.
```

> Deux colocataires : l'un toujours fiable mais parfois absent (CP), l'autre toujours là mais pas toujours fiable (AP). / Groupe WhatsApp sans réseau : soit tout le monde attend la reconnexion (CP), soit les messages arrivent dans le désordre (AP).

---

## ACID

Propriétés des transactions en BDD relationnelles. Atomicité (tout ou rien), Consistance (les contraintes restent respectées), Isolation (les transactions simultanées ne s'interfèrent pas), Durabilité (une transaction committée survit à un crash).

```sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
  -- Si une des deux lignes plante : ROLLBACK automatique
  -- Jamais de débit sans crédit en base
COMMIT;
```

> Un distributeur de billets : te donne 200€ et débite ton compte en même temps. Si la machine plante entre les deux, la transaction est annulée. / Un déménagement tout-ou-rien : soit tous les cartons arrivent dans le nouvel appart, soit on remet tout dans l'ancien.

---

## SHARDING

Partitionnement horizontal d'une BDD : les données sont découpées en shards distribués sur plusieurs machines. Obligatoire quand une seule machine ne peut plus tenir le volume. La shard key détermine où chaque donnée atterrit.

```js
const getShard = (userId) => userId % 4;
// user 42 -> shard 2, user 43 -> shard 3

async function getUser(userId) {
  const db = shardConnections[getShard(userId)];
  return db.query('SELECT * FROM users WHERE id = ?', [userId]);
}
```

> Une bibliothèque géante divisée en 4 annexes par thème : moins de monde dans chaque, recherche plus rapide, aucun bâtiment saturé. / Une ville qui ouvre plusieurs bureaux de poste au lieu d'un seul central : chaque bureau gère son quartier.

---

## CIRCUIT BREAKER

Quand un service downstream échoue trop souvent, on ouvre le circuit : on arrête d'appeler, on répond immédiatement en erreur (fail fast). Après un délai, on réessaie prudemment (half-open). Évite les cascades de pannes.

```js
class CircuitBreaker {
  constructor(threshold = 5, timeout = 30_000) {
    this.failures = 0; this.state = 'CLOSED'; this.nextAttempt = null;
  }
  async call(fn) {
    if (this.state === 'OPEN' && Date.now() < this.nextAttempt)
      throw new Error('Circuit OPEN : fail fast');
    try {
      const r = await fn();
      this.failures = 0; this.state = 'CLOSED';
      return r;
    } catch (e) {
      if (++this.failures >= 5) {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.timeout;
      }
      throw e;
    }
  }
}
```

> Le disjoncteur électrique : trop d'appareils branchés, ça claque. Au lieu de cramer l'installation, il coupe. T'attends, tu réenclenches, tu surveilles. / Un médecin qui prescrit "repos complet 3 semaines" : le circuit est ouvert, on réessaie progressivement après la recovery.

---

## LIVELOCK

Deux processus se modifient mutuellement en réponse l'un à l'autre sans jamais avancer. Contrairement au deadlock où tout est gelé, dans un livelock tout le monde bouge : mais aucun progrès. Solution : random backoff pour casser la symétrie.

```js
// Les deux processus se "cèdent" mutuellement à l'infini
// Solution : délai aléatoire avant retry
await sleep(Math.random() * 100 + 10);
// -> l'un repart en premier, la boucle se casse
```

> Deux personnes dans un couloir étroit qui s'écartent du même côté à chaque fois : personne n'est bloqué, mais personne n'avance. / Deux voitures à une intersection sans priorité qui s'arrêtent indéfiniment pour laisser passer l'autre.

---

## CSRF

Un site malveillant forge une requête vers ton app depuis le navigateur d'un utilisateur connecté. Le navigateur envoie automatiquement les cookies de session : la requête arrive authentifiée sans que l'utilisateur l'ait voulue.

```js
app.use(csrf({ cookie: true }));

app.get('/transfer', (req, res) => {
  res.render('transfer', { csrfToken: req.csrfToken() });
  // <input type="hidden" name="_csrf" value="TOKEN">
});
// Token absent ou invalide -> 403 automatique
```

> Quelqu'un signe un chèque à ton nom pendant que t'as le dos tourné : pas besoin de ton mot de passe, juste de ton carnet laissé sur la table. / Un faux bouton "confirmer" dans un mail : tu cliques, tu viens d'autoriser un virement depuis ta session encore active.

→ Leçon complète : `20_security/02_csrf_cors`

---

## BACKPRESSURE

Ralentit le producteur quand le consommateur ne peut plus suivre. Sans backpressure : le buffer déborde, la mémoire explose, le process crash. Node.js streams gèrent ça nativement via `pipe()`.

```js
readable.on('data', (chunk) => {
  const ok = writable.write(chunk);
  if (!ok) {
    readable.pause(); // consommateur saturé : on attend
    writable.once('drain', () => readable.resume()); // buffer vidé : on reprend
  }
});
// ou simplement : readable.pipe(writable)
```

> Un tuyau d'arrosage relié à une pompe industrielle : sans régulateur, le tuyau explose. / Un convoyeur de colis qui ralentit quand la zone d'emballage est pleine : la production se synchronise avec la capacité en aval.

---

## mTLS

Mutual TLS : les deux côtés s'authentifient avec des certificats. En TLS normal, seul le serveur prouve son identité. En mTLS, le client aussi. Indispensable entre microservices dans une architecture zero-trust.

```js
const server = https.createServer({
  key:  fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
  ca:   fs.readFileSync('ca-cert.pem'),
  requestCert: true,
  rejectUnauthorized: true
}, app);
```

> Contrôle niveau ambassade : tu montres ton passeport, mais l'agent montre aussi son badge officiel. Vérification dans les deux sens. / Poignée de main secrète dans une fraternité : les deux membres doivent connaître la séquence complète, sinon la porte reste fermée.

---

## Placement

```
29_annexes/
└── system_design/
    └── system_concepts_grimoire.md
```

Référence transversale pour `22_databases`, `23_scalability`, `20_security`, `18_realtime`.
Pas un module séquentiel : un fichier qu'on ouvre quand on croise un terme inconnu dans un codebase ou une PR review.

---

*CrazyDevs : "Learn it, break it, own it."*
