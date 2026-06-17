# Se souvenir vite pour ne pas redemander à chaque fois

Ta DB répond en 50ms à une requête. C'est rapide sur le papier. Mais si 10 000 users demandent la même donnée à la seconde, tu refais ce calcul de 50ms 10 000 fois pour le même résultat. Le cache (mémoire tampon rapide) dit : calcule une fois, garde le résultat, ressors-le instantanément la prochaine fois.

Redis (Remote Dictionary Server) est la DB clé-valeur en mémoire (RAM) la plus utilisée pour ça. Vu dans `02_nosql_basics` côté famille clé-valeur, ici on rentre dans le concret : comment l'utiliser sans se tirer une balle dans le pied.

Avantage : latence (temps de réponse) en sous-milliseconde, simplicité d'usage.
Inconvénient : c'est une source de vérité TEMPORAIRE, jamais la source de vérité PRINCIPALE.

---

## 1) LE PRINCIPE : CACHE-ASIDE

Le pattern le plus courant : ton appli vérifie le cache avant d'aller en DB.

```
REQUÊTE arrive
    |
    v
Cache contient la donnée ?
    |
   OUI ---------> retourne direct (cache HIT, rapide)
    |
   NON
    |
    v
Va chercher en DB (cache MISS)
    |
    v
Stocke le résultat dans le cache
    |
    v
Retourne la donnée
```

```js
async function getProduct(id) {
  const cacheKey = `product:${id}`
  const cached = await redis.get(cacheKey)

  if (cached) {
    return JSON.parse(cached) // cache HIT, pas de requête DB du tout
  }

  const product = await db.query('SELECT * FROM products WHERE id = $1', [id])
  await redis.set(cacheKey, JSON.stringify(product), 'EX', 3600) // TTL 1h
  return product
}
```

Le pourquoi : la première requête paie le coût DB, toutes les suivantes (pendant la durée du cache) sont quasi gratuites. Sur un produit consulté 50 000 fois par jour, tu passes de 50 000 requêtes DB à potentiellement 1 par heure.

---

## 2) TTL : LE CACHE QUI S'AUTODÉTRUIT (ET C'EST VOULU)

TTL (time to live : durée de vie) définit combien de temps une clé reste valide avant expiration automatique.

```js
await redis.set('session:abc123', data, 'EX', 3600)   // expire en 1h
await redis.set('cache:homepage', html, 'EX', 60)      // expire en 1 minute
await redis.set('otp:user42', '482913', 'EX', 300)     // code OTP, expire en 5 min
```

Le pourquoi : sans TTL, une clé reste en RAM pour toujours, même si la donnée sous-jacente a changé en DB depuis longtemps. Tu finis par servir des données complètement obsolètes (stale data) à l'infini, ou par saturer la RAM avec des clés mortes que personne ne nettoie.

```
SANS TTL :
clé créée --> reste en RAM pour toujours --> RAM se remplit --> serveur Redis sature

AVEC TTL :
clé créée --> expire automatiquement --> RAM se libère --> cycle de vie sain
```

Le risque réel : un TTL trop long sur une donnée qui change souvent (prix, stock) donne l'impression à l'utilisateur que le produit est dispo alors qu'il est épuisé depuis 10 minutes. Un TTL trop court annule l'intérêt du cache (tu recharges la DB en permanence). Le bon TTL dépend de la fréquence de changement réelle de la donnée, pas d'un chiffre arbitraire copié d'un tuto.

---

## 3) INVALIDATION : LE VRAI PROBLÈME DIFFICILE DU CACHE

Il y a une blague connue chez les devs : "il y a deux choses difficiles en informatique : le cache invalidation, le nommage des variables, et les erreurs off-by-one." La blague marche parce que c'est vrai.

```js
// Le produit change de prix en DB
await db.query('UPDATE products SET price = $1 WHERE id = $2', [39.99, productId])

// Si tu oublies ÇA, le cache sert encore l'ancien prix jusqu'à expiration du TTL
await redis.del(`product:${productId}`) // invalide le cache immédiatement
```

```
SANS invalidation à l'écriture :
DB mise à jour --> cache PAS mis à jour --> incohérence pendant tout le TTL restant

AVEC invalidation à l'écriture :
DB mise à jour --> cache supprimé immédiatement --> prochaine lecture recharge le frais
```

Le risque réel (exemple qui casse) : un user paie 39.99€ pour un produit, mais le cache encore actif lui montrait 29.99€ pendant qu'il naviguait. Incohérence visible, ticket support, perte de confiance. La règle d'or : **toute écriture qui change une donnée cachée doit invalider (ou mettre à jour) le cache correspondant, dans la même opération logique**.

---

## 4) STRUCTURES REDIS : PAS QUE DES STRINGS

Redis n'est pas qu'un dictionnaire clé/string. Il a des structures natives qui évitent de réinventer la roue en JS.

```js
// String : la base
await redis.set('user:1:name', 'aramis')

// Hash : un objet avec plusieurs champs, sans tout sérialiser en JSON
await redis.hset('user:1', { name: 'aramis', role: 'admin' })
await redis.hget('user:1', 'role')

// List : une file ou une pile (vu dans 07_data_structures/03_stack et 04_queue)
await redis.lpush('queue:emails', JSON.stringify({ to: 'a@b.com' }))
await redis.rpop('queue:emails')

// Set : des valeurs uniques, opérations d'ensemble natives
await redis.sadd('online:users', 'user:1', 'user:2')
await redis.sismember('online:users', 'user:1') // true

// Sorted Set : comme un Set mais avec un score, parfait pour un leaderboard
await redis.zadd('leaderboard', 1500, 'player:1')
await redis.zrevrange('leaderboard', 0, 9) // top 10
```

Le pourquoi : utiliser la bonne structure native évite de tout faire en JSON stringifié (coûteux à parser/sérialiser à chaque accès) et profite d'opérations atomiques (qui s'exécutent sans interruption possible) déjà optimisées par Redis lui-même.

---

## 5) STRATÉGIES DE CACHE : PAS QUE CACHE-ASIDE

```
CACHE-ASIDE (lazy loading)
  --> l'appli vérifie le cache, sinon va en DB et remplit le cache
  --> simple, le cache ne contient que ce qui a vraiment été demandé

WRITE-THROUGH
  --> chaque écriture en DB écrit AUSSI dans le cache, immédiatement
  --> cache toujours à jour, mais chaque écriture coûte un peu plus cher

WRITE-BEHIND (write-back)
  --> l'écriture va d'abord dans le cache, puis est répercutée en DB plus tard (async)
  --> très rapide à l'écriture, mais risque de perte si le cache crash avant la sync DB

STALE-WHILE-REVALIDATE (vu aussi dans 16_web_concepts/04_caching_strategies)
  --> sert la version en cache MÊME périmée, tout en rafraîchissant en arrière-plan
  --> l'utilisateur n'attend jamais, au prix d'une fraîcheur légèrement décalée
```

Le quand : cache-aside pour la majorité des cas (simple, sûr). Write-through quand la cohérence cache/DB est critique. Write-behind quand la vitesse d'écriture prime sur tout (analytics, compteurs de vues) et qu'une perte rare est tolérable.

---

## 6) CE QUI CASSE (MAIS FUN) : LE CACHE STAMPEDE

```js
// exemple minimal : ça marche tranquille en dev
async function getHomepage() {
  const cached = await redis.get('homepage')
  if (cached) return cached
  const html = await renderExpensiveHomepage() // coûte 2 secondes à générer
  await redis.set('homepage', html, 'EX', 60)
  return html
}

// exemple réaliste : 10 000 users arrivent en même temps PILE quand le cache expire
// exemple qui casse (cache stampede / thundering herd) :
// les 10 000 requêtes voient TOUTES "cache vide" en même temps
// les 10 000 lancent TOUTES renderExpensiveHomepage() en parallèle
// ton serveur DB/CPU prend 10 000 calculs de 2 secondes d'un coup --> il tombe
```

La correction : un verrou (lock) qui dit "une seule requête recalcule, les autres attendent ou reçoivent l'ancienne version" :

```js
async function getHomepage() {
  const cached = await redis.get('homepage')
  if (cached) return cached

  const lockAcquired = await redis.set('homepage:lock', '1', 'NX', 'EX', 5) // NX = only if not exists
  if (!lockAcquired) {
    // une autre requête recalcule déjà : on attend un peu et on relit le cache
    await sleep(100)
    return await redis.get('homepage') ?? await renderExpensiveHomepage()
  }

  const html = await renderExpensiveHomepage()
  await redis.set('homepage', html, 'EX', 60)
  await redis.del('homepage:lock')
  return html
}
```

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, beaucoup de devs géraient leur "cache" à la main avec un simple objet JS en mémoire (`const cache = {}`) dans le process Node. Ça marche en local, sur un seul serveur. Maintenant, dès que t'as plusieurs instances de ton serveur (scalabilité horizontale, vue dans `24_scalability`), un cache en mémoire locale devient incohérent entre instances : chaque serveur a SA version du cache. Redis externalisé résout ça : toutes les instances partagent le même cache, peu importe combien de serveurs tournent.

---

## EXERCICES

**EXO 1 : Calibrer le TTL**
Pour chacune de ces données, propose un TTL et justifie : (a) le profil public d'un user (photo, bio), (b) le stock disponible d'un produit, (c) un token de réinitialisation de mot de passe, (d) le classement général d'un jeu mis à jour en continu. (15 minutes)

**EXO 2 : Trouve le bug d'invalidation**
Un système cache le nombre de followers d'un user avec un TTL de 24h. Un user gagne 10 000 followers suite à une viralité. Décris le problème UX exact que ça crée pendant les 24h, et propose 2 corrections différentes (pas juste "réduire le TTL"). (15 minutes)

**EXO 3 : Simuler le stampede**
Reprends l'exemple de la homepage avec lock du point 6. Explique ce qui se passerait si tu retirais le `EX` (expiration) du lock lui-même, et pourquoi c'est dangereux si le process qui détient le lock crash avant de faire `redis.del`. (10 minutes)

---

## RÉSUMÉ

Redis cache pour éviter de recalculer ou re-requêter ce qui a déjà une réponse connue, en l'échange contre une fraîcheur relative qu'on contrôle via le TTL. Le vrai défi n'est jamais "comment je cache", c'est "comment j'invalide proprement" et "comment j'évite que 10 000 requêtes recalculent en même temps quand le cache expire". Un cache sans stratégie d'invalidation claire n'est pas un cache, c'est une source de bugs à retardement.
