# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~12 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## SYSTEM CONCEPTS GRIMOIRE

> Tu lis ce fichier et tu peux pas expliquer 10 de ces termes ? Slap yourself. Twice. Then come back.

Référence rapide. Tu croises un terme dans un codebase ou une PR review : tu viens ici, tu lis, tu repars.
Pour la théorie complète, suis les renvois vers les modules.

---

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| API Gateway | Point d'entrée unique pour toutes les requêtes vers tes microservices. Authentifie, route, rate-limite, loggue avant que ta logique business voie quoi que ce soit. | `app.use('/api', (req, res, next) => { if (!isValid(req.headers['x-api-key'])) return res.status(401).end(); proxy.web(req, res, { target: routeTo(req.path) }); });` |le videur d'une boîte de nuit qui vérifie la liste avant que tu entres | le standard radio unique du QG des Chevaliers Garo, qui sait où te connecter|
| Load Balancer | Distribue le trafic entrant sur plusieurs instances du même service pour qu'aucun serveur ne crève sous la charge. Stratégies : round-robin, least connections, IP hash. | `const srv = servers[i]; i = (i + 1) % servers.length;` |un sensei qui répartit les recrues sur 4 terrains d'entraînement au lieu d'en saturer un seul | Kakashi qui redistribue les missions entre plusieurs équipes au lieu d'en surcharger une|
| Reverse Proxy | Reçoit les requêtes clients et les transmet aux backends. Le client ne sait jamais à quel serveur il parle. Bonus : SSL termination, compression, cache statique. | `location / { proxy_pass http://localhost:3000; proxy_set_header X-Real-IP $remote_addr; }` |l'agent de Michael Scofield qui transmet ses messages sans révéler la source | le service courrier de Fox River, le détenu ne sait jamais quel garde a transporté le pli|
| Rate Limiting | Limite le nombre total de requêtes qu'un client peut faire sur une période donnée. Protège contre les abus, scrapers et brute-force. HTTP 429 si dépassé. | `if (++e.n > 100) return res.status(429).end();` |le videur qui compte les entrées : passé 200 personnes, tout le monde attend même avec un billet | le quota de jutsus par jour imposé à un genin, pour pas qu'il s'épuise|
| Throttling | Régule la vitesse de traitement plutôt que de compter les requêtes totales. Rate limiting dit stop, throttling dit doucement. Implémentation classique : token bucket. | `class TokenBucket { consume() { return this.tokens > 0 ? !!(this.tokens--) : false; } }` |l'autoroute qui passe à 70km | h en heure de pointe : tu roules toujours, le flux est régulé | le rythme de chakra que Naruto doit s'imposer pour pas vider sa réserve trop vite|
| Pagination | Découpe un résultat en pages plutôt que de tout envoyer d'un coup. Offset (simple, lent sur gros volumes) ou cursor (performant, idéal pour les feeds infinis). | `const posts = await db.query('SELECT * FROM combats ORDER BY id DESC LIMIT ? OFFSET ?', [limit, (page-1)*limit]);` |un manga publié en volumes : pas 500 chapitres en PDF d'un coup, ton téléphone mourrait | le journal de bord de Garo, lu mission par mission, pas l'historique complet en une fois|
| Cache Stampede | Le cache expire, des milliers de requêtes arrivent simultanément, toutes tapent la DB en même temps : elle s'effondre. Classique sur les pages les plus populaires. | `if (locks.has(key)) { await sleep(50); return getWithLock(key, fetchFn); } locks.add(key);` |toute la foule des ultras qui se rue sur le live au coup d'envoi, le cache venait d'expirer | tous les Chevaliers qui interrogent le réseau en même temps après une coupure radio|
| Idempotency | Une opération idempotente artefact le même résultat peu importe combien de fois tu l'exécutes. GET et PUT le sont, POST en général pas. Critique pour éviter les doublons sur retry réseau. | `const existing = await db.find({ idempotencyKey }); if (existing) return res.json({ status: 'already_processed' });` |appuyer 10 fois sur le bouton d'ascenseur déjà allumé : il vient une seule fois | réactiver l'armure Garo déjà active : rien ne se double, l'état reste le même|
| GraphQL | Le client choisit exactement les données qu'il veut. Fini l'over-fetching et l'under-fetching. Un seul endpoint `/graphql`. | `query { ninja(id: "42") { name jutsus(limit: 5) { titre } } }` |commander à la carte plutôt que le menu fixe de REST | un formulaire douanier que tu remplis toi-même : tu coches exactement ce que tu transportes|
| gRPC | Framework RPC de Google avec Protocol Buffers (binaire, pas JSON). Ultra-rapide, fortement typé, HTTP/2 natif. Taillé pour la comm entre microservices. Contrat défini dans un fichier `.proto`. | `client.getNinja({ id: '42' }, (err, res) => console.log(res.name));` |deux ingénieurs qui échangent des schémas techniques : précis, rapide, illisible pour un humain lambda | le protocole d'armure Garo signé d'avance entre deux Chevaliers, aucune ambiguïté|
| Webhooks | Le serveur te pousse une notification HTTP dès qu'un événement se produit, au lieu que tu interroges en boucle. Toujours vérifier la signature du payload. | `app.post('/webhooks/combat', (req, res) => { const event = verifySignature(req.body, req.headers['signature']); handleEvent(event); res.status(200).end(); });` |une sonnette de porte vs regarder par la fenêtre toutes les 10 secondes | l'alerte Horror envoyée directement au Chevalier le plus proche, pas un appel toutes les 5 minutes pour vérifier|
| JWT | Jeton signé encodé en base64 contenant des claims. Stateless : aucun état côté serveur. La signature cryptographique garantit que le payload n'a pas été modifié en transit. | `const token = jwt.sign({ ninjaId: 42, rank: 'jonin' }, SECRET, { expiresIn: '1h' });` |le bracelet VIP d'un festival : chaque stand le vérifie, personne ne rappelle le guichet | le sceau d'un Hokage sur un parchemin de mission, vérifiable sans repasser par le bureau|
| OAuth | Protocole d'autorisation : une app accède aux ressources d'une personne chez un tiers sans jamais voir son mot de passe. Échange un code contre un token à portée limitée. | `res.redirect(\`https://provider.com/oauth2/auth?scope=lecture_profil\`);` |donner les clés de voiture au voiturier : juste la clé de la voiture, pas la carte bancaire | une procuration pour récupérer un colis précis, pas pour ouvrir tout le compte|
| Cache Invalidation | Quand et comment supprimer ou mettre à jour le cache quand la source de vérité change. Stratégies : TTL, write-through, event-driven. L'erreur classique : mettre à jour la DB sans toucher le cache. | `await db.ninjas.update(id, data); await redis.set(\`ninja:${id}\`, JSON.stringify(data), 'EX', 3600);` |le tableau d'affichage dans un couloir : le cours change de salle, on oublie de le mettre à jour, les étudiants se perdent | le tableau de menace du camp de Rick, pas mis à jour après une attaque repoussée|
| Composite Index | Index de DB créé sur plusieurs colonnes combinées. L'ordre des colonnes est critique : un index `(a, b)` accélère une requête sur `a` seul, jamais sur `b` seul. | `CREATE INDEX idx ON missions(ninja_id, statut);` |un annuaire trié par nom puis prénom : "Uzumaki Naruto" est direct, mais trouver tous les "Naruto" te fait tout parcourir | un classeur par saison puis par équipe au Ballon d'Or : "2026, Brésil" instantané, "tout le Brésil" tu ouvres chaque saison une par une|
| Query Optimization | Structurer une requête pour minimiser les aller-retours et le volume scanné. La pire erreur courante : le problème N+1. L'outil indispensable : `EXPLAIN ANALYZE`. | `SELECT n.id, n.name, c.titre FROM ninjas n LEFT JOIN combats c ON c.ninja_id = n.id;` |un cuisinier qui fait 50 voyages au frigo un ingrédient à la fois, vs tout sortir avant de commencer | interroger chaque Chevalier Garo séparément au lieu d'un seul appel radio collectif|
| CAP Theorem | Un système distribué ne peut garantir que 2 des 3 propriétés : Consistency, Availability, Partition Tolerance. En prod, P est non négociable : tu choisis entre CP et AP. | `// CP : refuse les écritures si le noeud primaire est isolé\n// AP : répond même coupé, données potentiellement en retard` |deux Chevaliers : l'un toujours fiable mais parfois injoignable (CP), l'autre toujours là mais pas toujours à jour (AP) | un groupe de survivants sans réseau : soit tous attendent la reconnexion (CP), soit les messages arrivent dans le désordre (AP)|
| ACID | Propriétés des transactions en DB relationnelle : Atomicité (tout ou rien), Consistance, Isolation, Durabilité. | `BEGIN; UPDATE comptes SET solde = solde - 100 WHERE id = 1; UPDATE comptes SET solde = solde + 100 WHERE id = 2; COMMIT;` |le plan d'évasion de Michael : chaque étape ou rien, pas de demi-mesure | le rituel Garo, complet ou totalement annulé|
| Sharding | Partitionnement horizontal d'une DB : les données sont découpées en shards distribués sur plusieurs machines, obligatoire quand une seule machine ne tient plus le volume. | `const getShard = (ninjaId) => ninjaId % 4; const db = shardConnections[getShard(ninjaId)];` |une bibliothèque de jutsus divisée en 4 annexes par thème : moins de monde dans chacune, recherche plus rapide | le réseau de distribution de Walter White, étalé sur plusieurs villes au lieu d'un seul entrepôt saturé|
| Circuit Breaker | Quand un service downstream échoue trop souvent, on ouvre le circuit : on arrête d'appeler, on répond direct en erreur (fail fast). Après un délai, on réessaie prudemment (half-open). | `if (this.state === 'OPEN' && Date.now() < this.nextAttempt) throw new Error('Circuit OPEN');` |le disjoncteur électrique : trop d'appareils branchés, ça claque avant de cramer l'installation | Rick qui coupe une mission en cours après trop d'échecs, et attend avant de retenter|
| Livelock | Deux processus se modifient mutuellement en réponse l'un à l'autre sans jamais avancer. Contrairement au deadlock où tout est gelé, ici tout bouge mais rien ne progresse. | `await sleep(Math.random() * 100 + 10); // délai aléatoire pour casser la symétrie` |deux Chevaliers dans un couloir étroit qui s'écartent du même côté à chaque fois : personne n'avance | deux survivants qui se cèdent le passage à l'infini devant une porte du camp|
| CSRF | Un site malveillant forge une requête vers ton app depuis le navigateur d'un utilisateur connecté. Le navigateur envoie les cookies de session automatiquement : la requête arrive authentifiée sans consentement réel. | `app.use(csrf({ cookie: true })); res.render('mission', { csrfToken: req.csrfToken() });` |T-Bag qui signe un ordre de transfert à ta place pendant que t'as le dos tourné | un faux bouton "confirmer mission" dans un message : tu cliques, tu valides un truc que t'as jamais voulu|
| Backpressure | Ralentit le producteur quand le consommateur ne peut plus suivre. Sans backpressure : le buffer déborde, la mémoire explose, le process crash. Node.js streams gèrent ça via `pipe()`. | `if (!writable.write(chunk)) { readable.pause(); writable.once('drain', () => readable.resume()); }` |un tuyau d'arrosage relié à une pompe industrielle : sans régulateur, le tuyau explose | le flux de Horrors qui ralentit l'arrivée des renforts si le QG Garo ne peut plus traiter les alertes|
| mTLS | Mutual TLS : les deux côtés s'authentifient avec des certificats. En TLS normal, seul le serveur prouve son identité, en mTLS le client aussi. Indispensable en zero-trust entre microservices. | `https.createServer({ key, cert, ca, requestCert: true, rejectUnauthorized: true }, app);` |contrôle niveau ambassade : tu montres ton passeport, l'agent montre aussi son badge officiel | la poignée de main secrète entre deux Chevaliers Garo, les deux doivent la connaître sinon la porte reste fermée|

---

Référence transversale pour `24_databases`, `25_scalability`, `22_security`, `20_realtime`, `21_api_craft`.
Pas un module séquentiel : un fichier qu'on ouvre quand on croise un terme inconnu dans un codebase ou une PR review.

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
