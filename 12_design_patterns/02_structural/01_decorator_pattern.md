---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# DECORATOR : AJOUTER DU COMPORTEMENT SANS TOUCHER À LA SOURCE
Temps de lecture ~9 min

Tu as une fonction qui marche. Elle fait exactement ce qu'elle doit faire.
Et là tu reçois un ticket : "ajoute du logging". Puis un autre : "ajoute du caching". Puis un autre : "ajoute de la validation".

Solution naïve : tu modifies la fonction originale. Trois fois. Elle grossit. Elle fait cinq choses. Elle est fragilisée.

Solution Decorator : tu *enveloppes* la fonction. Tu ne la touches pas. Tu ajoutes le comportement par-dessus, comme une armure sur un ninja.

En prod, Decorator est partout : middleware Express, `@Injectable` Angular, `React.memo`, `withRouter`, les HOC en général. Chaque fois qu'on wrape quelque chose sans toucher au core : c'est un Decorator.

---

## 1) LE PROBLÈME QUE LE DECORATOR RÉSOUT

Sans Decorator, quand tu veux ajouter du comportement :

```js
// la fonction originale
function getPlayerStats(playerId) {
 return fetch(`/api/players/${playerId}`)
}

// version "modifiée pour tout faire" :
// logging + cache + retry + auth check
// cette fonction fait maintenant 4 choses
// et si le cache bugue, tu retestes tout
function getPlayerStats(playerId) {
 console.log(`[LOG] fetching ${playerId}`)        // responsabilité 1
 if (cache.has(playerId)) return cache.get(playerId)   // responsabilité 2
 const result = fetch(`/api/players/${playerId}`)    // responsabilité 3
 cache.set(playerId, result)               // responsabilité 2 bis
 return result
}
```

C'est le God Function : une fonction qui sait tout faire, donc qui peut tout casser.

---

## 2) LE DECORATOR EN JS : LA VERSION FONCTIONNELLE

Le principe : une fonction qui prend une fonction et retourne une fonction augmentée.

```js
// on ne touche pas à getPlayerStats
// on crée un wrapper qui ajoute juste le logging
function withLogging(fn) {
 return function(...args) {
  // on log l'appel avant
  console.log(`[LOG] calling ${fn.name} with`, args)
  const result = fn(...args)
  // on log le résultat après
  console.log(`[LOG] ${fn.name} returned`, result)
  return result
 }
}

// usage : on décore, on ne modifie pas
const getPlayerStats = (playerId) => fetch(`/api/players/${playerId}`)
const loggedGetPlayerStats = withLogging(getPlayerStats)

// getPlayerStats est intact
// loggedGetPlayerStats fait la même chose + le logging
```

---

## 3) STACKER LES DECORATORS

L'intérêt : chaque Decorator fait une seule chose. On les compose.

```js
// Decorator 1 : logging
function withLogging(fn) {
 return function(...args) {
  console.log(`[LOG] ${fn.name}(${args})`)
  return fn(...args)
 }
}

// Decorator 2 : cache simple
function withCache(fn) {
 const cache = new Map()
 return function(...args) {
  const key = JSON.stringify(args)
  // si la réponse est en cache : on coupe court
  if (cache.has(key)) {
   console.log(`[CACHE HIT] ${fn.name}`)
   return cache.get(key)
  }
  const result = fn(...args)
  cache.set(key, result)
  return result
 }
}

// Decorator 3 : retry automatique sur erreur
function withRetry(fn, maxRetries = 3) {
 return async function(...args) {
  let lastError
  for (let i = 0; i < maxRetries; i++) {
   try {
    return await fn(...args)
   } catch (err) {
    lastError = err
    // petit délai avant de retenter (comme Scofield qui reprend son plan)
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
   }
  }
  throw lastError
 }
}

// fonction originale : fait UNE chose
async function fetchPlayerStats(playerId) {
 const res = await fetch(`/api/players/${playerId}`)
 if (!res.ok) throw new Error(`Player ${playerId} not found`)
 return res.json()
}

// composition : on décore de l'intérieur vers l'extérieur
// ordre de lecture : retry > cache > logging > fetchPlayerStats
const getPlayerStats = withLogging(
 withCache(
  withRetry(fetchPlayerStats, 3)
 )
)

// on appelle exactement comme la fonction originale
await getPlayerStats("messi")
```

Diagramme de l'exécution :

```
getPlayerStats("messi")
  |
  v
withLogging wrapper
  --> [LOG] fetchPlayerStats(messi)
  |
  v
withCache wrapper
  --> cache miss ? continue
  --> cache hit ? return early
  |
  v
withRetry wrapper
  --> attempt 1 : OK ? return
  --> attempt 1 : FAIL ? wait + attempt 2
  |
  v
fetchPlayerStats("messi")  // la vraie logique, intacte
  |
  v
résultat remonte la chaîne
```

---

## 4) DECORATOR SUR DES OBJETS (VERSION OOP)

Même principe, appliqué à des objets. Utile quand tu travailles avec des classes.

```js
// l'objet ninja de base
class Ninja {
 constructor(name) {
  this.name = name
  this.chakra = 100
 }

 attack(target) {
  this.chakra -= 10
  return `${this.name} frappe ${target} : -10 chakra`
 }

 getChakra() {
  return this.chakra
 }
}

// Decorator : ajoute des logs sans toucher à Ninja
class LoggedNinja {
 constructor(ninja) {
  // on stocke l'original : on ne l'hérite pas, on le contient
  this.ninja = ninja
 }

 attack(target) {
  console.log(`[COMBAT] ${this.ninja.name} attaque ${target}`)
  const result = this.ninja.attack(target)     // on délègue à l'original
  console.log(`[CHAKRA] reste : ${this.ninja.getChakra()}`)
  return result
 }

 getChakra() {
  return this.ninja.getChakra()           // délégation pure
 }
}

// Decorator : ajoute un shield temporaire
class ShieldedNinja {
 constructor(ninja, shieldDuration = 3) {
  this.ninja = ninja
  this.shieldDuration = shieldDuration
  this.turnsLeft = shieldDuration
 }

 attack(target) {
  // le shield n'intervient pas sur l'attaque : on délègue directement
  return this.ninja.attack(target)
 }

 takeDamage(dmg) {
  if (this.turnsLeft > 0) {
   this.turnsLeft--
   // comme le susanoo de Sasuke : absorbe les dégâts
   return `Shield absorbe ${dmg} dmg (${this.turnsLeft} tours restants)`
  }
  return `${this.ninja.name} prend ${dmg} dmg`
 }

 getChakra() {
  return this.ninja.getChakra()
 }
}

// composition
const naruto = new Ninja("Naruto")
const loggedNaruto = new LoggedNinja(naruto)
const shieldedLoggedNaruto = new ShieldedNinja(loggedNaruto)

// l'interface reste la même à chaque niveau
shieldedLoggedNaruto.attack("Pain")
shieldedLoggedNaruto.takeDamage(50)
```

---

## 5) LE PIÈGE : DECORATOR VS HÉRITAGE

Pourquoi pas `extends` ?

```js
// mauvaise approche : héritage
class LoggedNinja extends Ninja {
 attack(target) {
  console.log(`[LOG]`)
  return super.attack(target)
 }
}

// le problème : tu ne peux pas combiner
class ShieldedNinja extends Ninja { ... }

// impossible de faire ça proprement avec extends :
class LoggedShieldedNinja extends ??? {
 // extends qui ? LoggedNinja ? ShieldedNinja ?
 // choix forcé, couplage fort
}
```

Avec Decorator : tu composes librement.
Avec héritage : tu choisis une hiérarchie fixe.

Règle : quand le comportement varie selon les cas (parfois on log, parfois on cache, parfois les deux), Decorator bat l'héritage.

---

## EXERCICES

## EXO 1 : L'ARMURE DE GARO

Garo équipe son armure par couches : d'abord le core (vitesse de base), puis le module de résistance, puis le système de détection. Chaque couche ajoute un comportement.

Crée une fonction `createKnight(name)` qui retourne un objet avec `attack()` et `defend()`.
Crée trois Decorators :
- `withSpeedBoost(knight)` : multiplie les dégâts par 1.5 mais baisse la défense de 10
- `withArmorCore(knight)` : ajoute un log de chaque defend + absorbe 20 dmg de plus
- `withHorrorSensor(knight)` : avant chaque attack, log si la cible est un Horror ou un humain (simulé avec `Math.random()`)

Contrainte : les Decorators doivent être empilables dans n'importe quel ordre.

---

## EXO 2 : LE MIDDLEWARE DE RICK GRIMES

Rick a besoin d'un système de commandes pour gérer le camp. Chaque commande (`scavenge`, `fortify`, `ration`) peut être décorée avec :
- logging (qui a lancé la commande, quand)
- validation (les ressources sont-elles suffisantes ?)
- dry-run (simuler sans exécuter pour tester le plan)

Crée un système de fonctions décorables.
La commande `fortify(materials)` doit pouvoir être appelée comme `withDryRun(withLogging(withValidation(fortify)))`.

Contrainte : withDryRun ne doit jamais modifier l'état. Il doit juste logger ce qui *aurait* changé.

---

## EXO 3 : LE BUG À TROUVER

Ce code utilise un Decorator pour cacher les appels API. Trouve pourquoi le cache ne fonctionne jamais :

```js
function withCache(fn) {
 const cache = {}
 return function(playerId) {
  const key = playerId
  if (cache[key]) return cache[key]
  const result = fn(playerId)   // fn retourne une Promise
  cache[key] = result
  return result
 }
}

async function fetchPlayer(id) {
 const res = await fetch(`/api/players/${id}`)
 return res.json()
}

const cachedFetch = withCache(fetchPlayer)
await cachedFetch("messi")
await cachedFetch("messi")  // censé hitter le cache
```

(indice : qu'est-ce que `fn(playerId)` retourne réellement avant le `await` ?)

---

## RÉSUMÉ

Le Decorator wrape une fonction ou un objet pour y ajouter du comportement sans modifier l'original.
Chaque Decorator fait une seule chose : on compose pour en faire plusieurs.
Contrairement à l'héritage, la composition Decorator s'adapte à l'exécution : on décore ce dont on a besoin, quand on en a besoin.
En prod : middleware, HOC, cache layers, retry logic : tout ça, c'est du Decorator.
Le signe que tu as besoin d'un Decorator : tu modifies une fonction pour la dixième fois pour y ajouter un comportement orthogonal au core.

**Note : 10/10**
