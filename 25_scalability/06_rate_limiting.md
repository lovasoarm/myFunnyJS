---
stability: intemporel
---

# Protéger ton API sans punir les gens honnêtes
Temps de lecture ~10 min

T-Bag essaie de bruteforcer l'API de Fox River : 5000 tentatives par seconde sur `/login`. Sans protection, il fait tomber le serveur et coupe l'accès à TOUS les détenus : Michael Scofield compris, qui avait besoin de cet endpoint pour sa vraie mission. Rate limiting (limitation de débit) c'est la règle qui dit "passé un certain nombre de requêtes dans un temps donné, je bloque ou je ralentis" : les légitimes restent, l'abus trinque.

Pourquoi ça compte : sans rate limiting, un seul client (malveillant ou juste buggé, genre une boucle infinie côté front) peut saturer ton serveur à lui seul, et empêcher TOUS les autres users d'accéder au service. C'est littéralement une porte ouverte au déni de service (DoS : denial of service).

Avantage : protection contre l'abus, contrôle des coûts (vu aussi dans `23_ai_native_dev/01_ai_workflow` pour les appels LLM qui coûtent cher).
Inconvénient : mal calibré, tu bloques des détenus légitimes du système et tu crées une mauvaise expérience.

---

## 1) LE PRINCIPE : COMPTER, COMPARER, DÉCIDER

```
REQUÊTE arrive d'une IP/user
  |
  v
Combien de requêtes déjà faites dans la fenêtre de temps actuelle ?
  |
  SOUS LA LIMITE -----> laisse passer, incrémente le compteur
  |
  AU-DESSUS -----------> rejette (429 Too Many Requests) ou met en file d'attente
```

```js
// Version naïve avec Redis (vu en détail dans 24_databases/04_redis_caching)
async function isAllowed(userId) {
 const key = `ratelimit:${userId}`
 const count = await redis.incr(key) // incrémente, crée la clé à 1 si elle n'existe pas

 if (count === 1) {
  await redis.expire(key, 60) // la fenêtre dure 60 secondes
 }

 return count <= 100 // max 100 requêtes par minute
}
```

---

## 2) LES ALGORITHMES : PAS TOUS ÉGAUX FACE AUX PICS

```
FIXED WINDOW (fenêtre fixe)
 --> compte les requêtes dans des blocs de temps fixes (minute 1, minute 2, ...)
 --> simple, mais permet un pic à la frontière entre deux fenêtres

SLIDING WINDOW (fenêtre glissante)
 --> regarde les X dernières secondes en continu, pas des blocs fixes
 --> plus précis, légèrement plus coûteux à calculer

TOKEN BUCKET (seau à jetons)
 --> chaque user a un seau qui se remplit de jetons à vitesse constante
 --> chaque requête consomme un jeton, permet des pics courts si le seau est plein
```

Le piège du fixed window, concrètement :

```
Limite : 100 requêtes par minute, fenêtre fixe

Minute 1 (00:00 à 00:59) : 100 requêtes à 00:59 --> autorisé, limite atteinte juste à temps
Minute 2 (01:00 à 01:59) : 100 requêtes à 01:00 --> autorisé, nouvelle fenêtre, compteur à 0

Résultat réel : 200 requêtes en 1 SECONDE (de 00:59 à 01:00),
alors que la limite annoncée est 100 par MINUTE
```

```
SLIDING WINDOW corrige ça :
peu importe où tu regardes, "les 60 dernières secondes" contiennent toujours
au maximum 100 requêtes, jamais de pic caché à la frontière
```

Le token bucket est différent dans l'intention : il autorise volontairement des pics courts (le seau plein), tant que la moyenne sur la durée respecte le débit configuré. C'est utile quand un utilisateur légitime peut avoir un usage en rafale (genre charger une page qui déclenche 10 requêtes d'un coup), suivi de calme.

```js
// Token bucket simplifié
class TokenBucket {
 constructor(capacity, refillRatePerSecond) {
  this.capacity = capacity
  this.tokens = capacity
  this.refillRate = refillRatePerSecond
  this.lastRefill = Date.now()
 }

 tryConsume() {
  const now = Date.now()
  const elapsedSeconds = (now - this.lastRefill) / 1000
  this.tokens = Math.min(this.capacity, this.tokens + elapsedSeconds * this.refillRate)
  this.lastRefill = now

  if (this.tokens >= 1) {
   this.tokens -= 1
   return true // requête autorisée, un jeton consommé
  }
  return false // seau vide, requête rejetée
 }
}
```

---

## 3) PAR QUOI LIMITER : IP, USER, OU LES DEUX

```
PAR IP
 --> simple à mettre en place, mais punit tout un réseau (NAT d'entreprise,
   plusieurs users derrière la même IP publique) si un seul abuse

PAR USER (via token d'authentification)
 --> plus juste, chaque compte a sa propre limite
 --> mais inutile contre un attaquant non authentifié (avant login)

PAR ENDPOINT
 --> /login a une limite stricte (cible privilégiée du bruteforce)
 --> /search a une limite plus souple (usage normal plus fréquent)
```

Le pourquoi combiner les trois : un attaquant qui essaie de deviner un mot de passe tape `/login` en boucle, AVANT d'avoir un token valide. Limiter seulement par user ne le bloque jamais, puisqu'il n'a pas de compte. Limiter par IP sur cet endpoint précis le ralentit vraiment.

```js
// Limite différente selon le contexte, pas une règle unique pour tout le site
const limits = {
 '/enter-arena': { byIP: 5, window: 60 },    // strict : cible de bruteforce
 '/search': { byUser: 100, window: 60 },  // souple : usage normal fréquent
 '/export': { byUser: 3, window: 3600 }  // très strict : opération lourde
}
```

---

## 4) LA RÉPONSE QUAND ON BLOQUE : NE PAS LAISSER LE SHINOBI DANS LE FLOU

```js
app.use((req, res, next) => {
 if (!isAllowed(req.user.id)) {
  return res.status(429)
   .set('Retry-After', '30') // dit au client QUAND réessayer
   .json({ error: 'Trop de requêtes, réessaie dans 30 secondes' })
 }
 next()
})
```

Le pourquoi : un statut `429 Too Many Requests` avec un header `Retry-After` permet au client (souvent un autre programme, une autre API) de savoir exactement quand retenter, au lieu de retenter en boucle immédiatement (ce qui aggrave le problème) ou d'abandonner complètement. C'est une question de design d'API autant que de protection, vu aussi dans `21_api_craft/05_error_handling_api`.

---

## 5) CE QUI CASSE (MAIS FUN) : LE RATE LIMIT QUI PUNIT LES INNOCENTS

```js
// exemple minimal : limite par IP, ça marche pour un attaquant isolé
// exemple réaliste : une grosse boîte avec 5000 employés derrière la même IP
// publique (NAT d'entreprise) utilise ton service en même temps

// exemple qui casse : ta limite "100 requêtes par minute par IP" bloque
// TOUTE l'entreprise après quelques secondes d'usage normal,
// parce que le rate limiter voit "1 IP, 100+ requêtes" sans savoir
// que ce sont en fait 200 personnes différentes derrière
```

La correction : combiner IP et identité applicative (user authentifié, clé API) plutôt que IP seule, dès que ton jutsu vise un usage B2B (entreprise à entreprise) où le NAT partagé est fréquent. La limite par IP seule fonctionne bien pour du grand public (chaque user a généralement sa propre IP), mais devient un piège en contexte entreprise.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, le rate limiting se codait souvent à la main, en mémoire locale du process (un simple objet JS qui compte). Ça casse immédiatement dès que tu scale out (vu dans `02_horizontal_vs_vertical`) : chaque serveur a SON propre compteur, donc la vraie limite globale devient (limite x nombre de serveurs) sans que personne s'en rende compte. Maintenant, le rate limiting passe systématiquement par un store partagé (Redis, vu dans `24_databases/04_redis_caching`) ou un service dédié au niveau du load balancer/API gateway (voir `16_architecture_patterns/06_microservices_intro.md` pour la définition complète), pour que la limite reste vraie peu importe combien de serveurs traitent le trafic.

---

## EXERCICES

**EXO 1 : Calibre les limites de la prison**
Michael Scofield a besoin que l'API de Fox River soit accessible sans qu'aucun gardien ne détecte une activité suspecte. Propose une limite (nombre + fenêtre de temps) et l'algorithme (fixed window, sliding window, token bucket) pour : (a) `/login`, (b) `/search` (recherche dans les plans), (c) `/upload-photo` (transfert de documents lourds), (d) un webhook reçu du réseau Bagwell (partenaire de confiance). Justifie chaque choix. (20 minutes)

**EXO 2 : Le bug du fixed window dans la prison**
Démontre avec un exemple chiffré précis (comme dans la section 2) comment une limite de "1000 requêtes par heure" en fixed window peut laisser passer 2000 requêtes en seulement 2 minutes : exactement le genre de pic que les détecteurs d'anomalies de Fox River repéreraient. (10 minutes)

**EXO 3 : Le piège du NAT dans l'équipe de Michael**
L'API impose une limite stricte par IP. T-Bag se plaint : "50 membres de mon réseau sont bloqués alors qu'on vient juste de commencer à utiliser le système." Tout le réseau de T-Bag passe par un seul point NAT (un seul routeur, donc une seule IP sortante). Diagnostique le problème exact et propose la correction : rate limit par user token plutôt que par IP. (15 minutes)

---

## RÉSUMÉ

Rate limiting protège ton service contre l'abus, qu'il soit malveillant ou juste accidentel (un bug en boucle côté client). Fixed window est simple mais laisse passer des pics à la frontière des fenêtres, sliding window corrige ça, token bucket autorise des rafales contrôlées. La vraie compétence n'est pas d'activer une limite, c'est de la calibrer selon le contexte réel (IP vs user, NAT d'entreprise, endpoint sensible vs endpoint normal), et de répondre proprement (429 + Retry-After) plutôt que de juste claquer une porte au nez du client.
