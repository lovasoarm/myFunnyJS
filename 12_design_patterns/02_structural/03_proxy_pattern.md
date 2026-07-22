---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PROXY : INTERCEPTER LES ACCÈS SANS CHANGER L'ORIGINAL
Temps de lecture ~11 min

Quelqu'un essaie de lire une propriété de ton objet. Avant que ça arrive, tu veux logger, valider, cacher, ou bloquer. Mais tu ne veux pas modifier l'objet lui-même.

Un Proxy s'installe entre l'appelant et l'objet cible. L'appelant pense parler directement à l'objet. En réalité, le Proxy intercepte chaque accès et décide quoi faire.

JS a un objet natif pour ça : `Proxy`. C'est un des rares patterns où le langage donne les outils directement.

En prod : validation de formulaires, lazy loading, observabilité de l'état, protection de propriétés sensibles, memoization automatique.

---

## 1) LA STRUCTURE DE BASE D'UN PROXY JS

```js
const target = { name: "Naruto", chakra: 100 }

const handler = {
 // intercepte les lectures : obj.property
 get(target, property) {
  console.log(`[READ] ${String(property)}`)
  return target[property]  // on délègue à l'original
 },

 // intercepte les écritures : obj.property = value
 set(target, property, value) {
  console.log(`[WRITE] ${String(property)} = ${value}`)
  target[property] = value
  return true  // set doit retourner true : sinon TypeError en strict mode
 }
}

const ninja = new Proxy(target, handler)

ninja.name      // [READ] name --> "Naruto"
ninja.chakra = 80  // [WRITE] chakra = 80
ninja.chakra     // [READ] chakra --> 80

// l'original est modifié aussi : le Proxy ne copie pas, il intercepte
console.log(target.chakra)  // 80
```

---

## 2) PROXY POUR LA VALIDATION

Cas concret : tu ne veux pas qu'un bug ou qu'un shinobi mette des données invalides dans l'état.

```js
function createValidatedNinja(ninja) {
 return new Proxy(ninja, {
  set(target, property, value) {
   // chakra : doit rester entre 0 et 100
   if (property === "chakra") {
    if (typeof value !== "number") {
     throw new TypeError(`chakra doit être un nombre, reçu : ${typeof value}`)
    }
    if (value < 0 || value > 100) {
     throw new RangeError(`chakra hors limites : ${value} (attendu 0-100)`)
    }
   }

   // name : string non vide
   if (property === "name") {
    if (typeof value !== "string" || value.trim() === "") {
     throw new TypeError("name doit être une string non vide")
    }
   }

   target[property] = value
   return true
  }
 })
}

const naruto = createValidatedNinja({ name: "Naruto", chakra: 100 })

naruto.chakra = 80   // ok
naruto.chakra = 150   // RangeError : chakra hors limites
naruto.chakra = "full" // TypeError : chakra doit être un nombre
naruto.name = ""    // TypeError : name doit être une string non vide
```

Sans Proxy : tu répètes cette validation partout où tu modifies l'objet.
Avec Proxy : une seule définition, appliquée automatiquement à chaque écriture.

---

## 3) PROXY POUR LE CACHING (LAZY LOADING)

Le Proxy intercepte la première lecture d'une propriété coûteuse, calcule, stocke, et retourne le cache pour les lectures suivantes.

```js
function createLazyStats(playerId) {
 const cache = {}

 return new Proxy({}, {
  get(target, property) {
   // si déjà calculé : on retourne le cache directement
   if (property in cache) {
    console.log(`[CACHE HIT] ${property}`)
    return cache[property]
   }

   // sinon : on calcule (simulé ici)
   if (property === "careerGoals") {
    console.log(`[COMPUTE] calcul des buts en carrière pour ${playerId}...`)
    cache[property] = 672  // en vrai : requête DB ou calcul lourd
    return cache[property]
   }

   if (property === "heatmap") {
    console.log(`[COMPUTE] génération de la heatmap...`)
    cache[property] = { zones: ["left", "center"], intensity: 0.87 }
    return cache[property]
   }

   return undefined
  }
 })
}

const messiStats = createLazyStats("messi")

messiStats.careerGoals  // [COMPUTE] calcul... --> 672
messiStats.careerGoals  // [CACHE HIT]      --> 672
messiStats.heatmap    // [COMPUTE] génération...
messiStats.heatmap    // [CACHE HIT]
```

Diagramme :

```
appelant     Proxy           données réelles
  |        |               |
  |--.careerGoals->|               |
          |--> cache miss        |
          |--> [COMPUTE] ------------->|
          |<-- résultat ---------------|
          |--> cache.set(result)    |
  |<-- résultat ---|               |
  |        |               |
  |--.careerGoals->|               |
          |--> cache hit        |
  |<-- résultat ---|  (pas de calcul)      |
```

---

## 4) PROXY POUR LA PROTECTION DE PROPRIÉTÉS

Walter White a des données que personne ne doit toucher directement.

```js
const PRIVATE = Symbol("private")

function createProtectedFormula(data) {
 const privateData = { ...data }  // on travaille sur une copie

 return new Proxy(privateData, {
  get(target, property) {
   // les propriétés qui commencent par _ sont privées
   if (typeof property === "string" && property.startsWith("_")) {
    throw new Error(`Accès refusé : ${property} est privé`)
   }
   return target[property]
  },

  set(target, property, value) {
   if (typeof property === "string" && property.startsWith("_")) {
    throw new Error(`Modification refusée : ${property} est en lecture seule`)
   }
   target[property] = value
   return true
  },

  // intercepte les suppressions
  deleteProperty(target, property) {
   if (typeof property === "string" && property.startsWith("_")) {
    throw new Error(`Suppression refusée : ${property} est protégé`)
   }
   delete target[property]
   return true
  }
 })
}

const formula = createProtectedFormula({
 name: "Blue Sky",
 purity: 99.1,
 _secretIngredient: "methylamine"  // propriété privée
})

formula.name          // "Blue Sky"
formula.purity         // 99.1
formula._secretIngredient    // Error : Accès refusé
formula._secretIngredient = "x" // Error : Modification refusée
```

---

## 5) PROXY POUR L'OBSERVABILITÉ D'ÉTAT

Version simplifiée de ce que font Vue.js et MobX : détecter automatiquement les changements d'état.

```js
function createObservable(target, onChange) {
 return new Proxy(target, {
  set(obj, property, value) {
   const oldValue = obj[property]
   obj[property] = value

   // notifie seulement si la valeur a vraiment changé
   if (oldValue !== value) {
    onChange(property, oldValue, value)
   }

   return true
  }
 })
}

// état du camp dans Walking Dead
let campState = createObservable(
 { survivors: 12, food: 45, ammo: 200, security: "medium" },
 (prop, oldVal, newVal) => {
  console.log(`[STATE CHANGE] ${prop}: ${oldVal} --> ${newVal}`)
  if (prop === "food" && newVal < 10) {
   console.log("[ALERT] rations critiques : convocation du conseil immédiate")
  }
  if (prop === "security" && newVal === "low") {
   console.log("[ALERT] niveau de sécurité critique : doublement des gardes")
  }
 }
)

campState.food = 40   // [STATE CHANGE] food: 45 --> 40
campState.food = 8   // [STATE CHANGE] food: 45 --> 8 + [ALERT] rations critiques
campState.security = "low"  // [STATE CHANGE] security: medium --> low + [ALERT]
```

---

## 6) LE PIÈGE : PROXY ET PERFORMANCE

Un Proxy ajoute une couche d'indirection sur *chaque* accès. Sur un objet accédé des millions de fois dans une boucle : ça se sent.

```js
const plain = { x: 1, y: 2 }
const proxied = new Proxy({ x: 1, y: 2 }, { get(t, p) { return t[p] } })

// en boucle à 10M iterations :
// plain.x     : ~5ms
// proxied.x    : ~40ms (x8 plus lent)

// règle : Proxy sur les données d'état applicatif, oui
// Proxy sur les inner loops de calcul : non
```

---

## 7) CAS QUI CASSE (mais fun)

```js
// Proxy sur une classe : le `this` part en vrille
class Knight {
 constructor(name) {
  this.name = name
  this._health = 100
 }
 takeDamage(dmg) {
  // `this` ici est le Proxy, pas l'instance Knight
  this._health -= dmg    // OK pour les primitives
  return this._health
 }
}

const leon = new Proxy(new Knight("León"), {
 get(target, prop) {
  const val = target[prop]
  // si c'est une méthode, on la bind sur le Proxy... pas sur la vraie instance
  return typeof val === 'function' ? val.bind(target) : val
  // sans ce bind : `this` dans takeDamage est le Proxy
  // avec ce bind : `this` est l'instance → ça marche
  // oublier le bind : le Proxy intercepte ses propres set depuis les méthodes internes
 }
})

// Sans bind : leon.takeDamage(10) peut planter ou produire un comportement inattendu
// selon comment le handler set est configuré
leon.takeDamage(20) // OK avec bind, bug silencieux sans
```

Le bug classique : un Proxy sur une instance de classe, et les méthodes internes n'arrivent plus à accéder à leurs propres propriétés. La solution : toujours binder les fonctions extraites sur l'objet target, pas sur le Proxy.

Deuxième cas : `Proxy.revocable()` : le Proxy révocable qui est révoqué trop tôt.

```js
const { proxy, revoke } = Proxy.revocable({ chakra: 500 }, {
 get(t, p) { return t[p] }
})

revoke() // l'armure se désintègre

proxy.chakra // TypeError: Cannot perform 'get' on a proxy that has been revoked
// Naruto essaie d'accéder à sa stat après que le Proxy ait été révoqué : crash immédiat
```

`Proxy.revocable()` est utile pour des accès temporaires contrôlés. Mais si une référence au proxy survit à la révocation : crash garanti.

---

## EXERCICES

## EXO 1 : L'ARMURE PROXY DE GARO

Garo a des statistiques de combat. Chaque modification doit respecter des contraintes :
- `health` : entre 0 et 100, si ça tombe à 0 → log "ARMOR COLLAPSE"
- `attackPower` : ne peut que monter, jamais descendre
- `armorTime` : ne peut pas dépasser 99.9

Crée `createKnightProxy(knight)` qui wrape l'objet avec un Proxy validant.

Contrainte : le Proxy doit aussi intercepter les lectures sur `armorTime` et retourner `"ARMOR CRITICAL"` si la valeur est en dessous de 10.

---

## EXO 2 : LE SPY DE TEST

Michael Scofield a besoin de surveiller chaque accès à un objet de configuration sensible.

Crée `createSpy(obj)` qui retourne un Proxy qui :
- log chaque lecture (property, valeur retournée)
- log chaque écriture (property, ancienne valeur, nouvelle valeur)
- expose une méthode `getAccessLog()` qui retourne l'historique complet des accès

(indice : `getAccessLog` est une propriété spéciale du Proxy lui-même, pas de l'objet wrappé : il faut l'intercepter dans `get`)

---

## EXO 3 : LE BUG À TROUVER

Ce Proxy est censé logguer toutes les modifications. Pourquoi ne log-t-il rien ?

```js
const state = { score: 0, players: ["Messi"] }

const proxy = new Proxy(state, {
 set(target, property, value) {
  console.log(`[CHANGE] ${property}`)
  target[property] = value
 }
})

proxy.score = 1      // censé logger
proxy.players.push("CR7") // censé logger
```

(indice : il y a deux bugs distincts : un sur le `set`, un sur la mutation profonde)

---

## RÉSUMÉ

Le Proxy JS intercepte les opérations fondamentales sur un objet : lecture, écriture, suppression, vérification d'existence.
Il ne modifie pas l'objet cible : il contrôle l'accès à cet objet.
Les cas d'usage canoniques : validation automatique, lazy loading, observabilité d'état, protection de propriétés.
Le piège de performance : Proxy sur un inner loop de calcul intensif, ça coûte.
Différence avec Decorator : Decorator enveloppe des appels de fonctions, Proxy intercepte les accès aux propriétés d'un objet.

**Note : 10/10**
