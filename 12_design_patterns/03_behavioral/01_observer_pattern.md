---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# OBSERVER : UN ÉVÉNEMENT SE PASSE, TOUT LE MONDE QUI ÉCOUTE RÉAGIT
Temps de lecture ~9 min

Un but est marqué en direct. Le tableau d'affichage change. Les commentateurs crient. Les stats s'actualisent. Le classement se recalcule. Quatre systèmes différents, un seul événement source.

Solution naïve : la logique qui gère le but appelle directement chaque système. Elle grossit. Elle devient couplée à tout. Quand tu ajoutes un cinquième système, tu modifies la logique du but.

Solution Observer : la logique du but publie un événement. Les quatre systèmes se sont abonnés à cet événement. Ils réagissent tous, sans que la source sache qui ils sont.

En prod : `addEventListener`, EventEmitter Node.js, les stores Redux, les subjects RxJS, les `$watch` de Vue, les signals de SolidJS. Tous : Observer.

---

## 1) LA MÉCANIQUE : PUBLISHER ET SUBSCRIBERS

```
Publisher (source)
  |
  |--> notifie tous les abonnés
  |
  +--> Subscriber 1
  +--> Subscriber 2
  +--> Subscriber 3
```

Le Publisher ne connaît pas les Subscribers. Les Subscribers s'abonnent et se désabonnent librement. Le découplage est total.

---

## 2) IMPLÉMENTATION DEPUIS ZÉRO

```js
class EventEmitter {
 constructor() {
  // une Map event --> liste de callbacks
  this.listeners = new Map()
 }

 on(event, callback) {
  if (!this.listeners.has(event)) {
   this.listeners.set(event, [])
  }
  this.listeners.get(event).push(callback)
  // retourner une fonction de désabonnement : pratique en prod
  return () => this.off(event, callback)
 }

 off(event, callback) {
  if (!this.listeners.has(event)) return
  const callbacks = this.listeners.get(event).filter(cb => cb !== callback)
  this.listeners.set(event, callbacks)
 }

 emit(event, ...args) {
  if (!this.listeners.has(event)) return
  // on copie le tableau avant de l'itérer
  // un callback pourrait appeler off() et modifier le tableau pendant l'itération
  const callbacks = [...this.listeners.get(event)]
  callbacks.forEach(cb => cb(...args))
 }

 once(event, callback) {
  // wrapper qui se désabonne automatiquement après le premier déclenchement
  const wrapper = (...args) => {
   callback(...args)
   this.off(event, wrapper)
  }
  this.on(event, wrapper)
 }
}
```

---

## 3) CAS CONCRET : LE MATCH EN DIRECT

```js
const matchBus = new EventEmitter()

// Subscriber 1 : le tableau d'affichage
matchBus.on("goal", ({ scorer, team, minute }) => {
 console.log(`[SCOREBOARD] ${team} : but de ${scorer} à la ${minute}'`)
})

// Subscriber 2 : les stats live
matchBus.on("goal", ({ scorer }) => {
 console.log(`[STATS] +1 but enregistré pour ${scorer}`)
})

// Subscriber 3 : le système de notification push
matchBus.on("goal", ({ team, minute }) => {
 console.log(`[PUSH] notification envoyée : ${team} marque à ${minute}'`)
})

// Subscriber 4 : le classement
matchBus.on("goal", ({ team }) => {
 console.log(`[RANKING] mise à jour du classement pour ${team}`)
})

// Subscriber 5 : alerte une seule fois si penalty
matchBus.once("penalty", ({ team }) => {
 console.log(`[ALERT] premier penalty du match pour ${team}`)
})

// le Publisher : la logique de jeu ne connaît aucun des subscribers
function scoreGoal(scorer, team, minute) {
 // ... logique de validation du but
 matchBus.emit("goal", { scorer, team, minute })
 // c'est tout : les quatre systèmes réagissent automatiquement
}

scoreGoal("Messi", "Barcelona", 23)
// [SCOREBOARD] Barcelona : but de Messi à la 23'
// [STATS] +1 but enregistré pour Messi
// [PUSH] notification envoyée : Barcelona marque à 23'
// [RANKING] mise à jour du classement pour Barcelona
```

---

## 4) OBSERVER AVEC ÉTAT : LE STORE RÉACTIF

Pattern plus avancé : l'Observer protège un état et notifie automatiquement quand il change.

```js
class ReactiveStore {
 constructor(initialState) {
  this.state = { ...initialState }
  this.emitter = new EventEmitter()
 }

 get(key) {
  return this.state[key]
 }

 set(key, value) {
  const oldValue = this.state[key]
  if (oldValue === value) return  // pas de changement : pas de notification

  this.state[key] = value
  // notifie sur l'event spécifique à la clé
  this.emitter.emit(`change:${key}`, { key, oldValue, newValue: value })
  // et sur un event global
  this.emitter.emit("change", { key, oldValue, newValue: value })
 }

 watch(key, callback) {
  return this.emitter.on(`change:${key}`, callback)
 }

 watchAll(callback) {
  return this.emitter.on("change", callback)
 }
}

// état du camp zombie
const campStore = new ReactiveStore({
 survivors: 12,
 food: 45,
 threat: "low"
})

// chaque watcher réagit indépendamment
const unsubFood = campStore.watch("food", ({ newValue }) => {
 if (newValue < 10) console.log("[CRITICAL] rations en dessous du seuil d'urgence")
})

campStore.watch("threat", ({ oldValue, newValue }) => {
 console.log(`[THREAT] niveau de menace : ${oldValue} --> ${newValue}`)
})

campStore.watchAll(({ key, newValue }) => {
 console.log(`[LOG] ${key} mis à jour : ${newValue}`)
})

campStore.set("food", 8)
// [LOG] food mis à jour : 8
// [CRITICAL] rations en dessous du seuil d'urgence

campStore.set("threat", "high")
// [LOG] threat mis à jour : high
// [THREAT] niveau de menace : low --> high

// désabonnement propre quand le watcher n'est plus nécessaire
unsubFood()
campStore.set("food", 3)  // plus de [CRITICAL] : le watcher food est désabonné
```

---

## 5) LE PIÈGE : LES MEMORY LEAKS

C'est le bug le plus courant avec Observer : on s'abonne, on oublie de se désabonner, les callbacks restent en mémoire même si l'objet est censé être détruit.

```js
class Dashboard {
 constructor(store) {
  this.store = store
  // PIÈGE : on s'abonne mais on ne stocke pas la fonction de désabonnement
  this.store.watch("score", this.updateDisplay.bind(this))
 }

 updateDisplay({ newValue }) {
  console.log(`Score: ${newValue}`)
 }

 destroy() {
  // le Dashboard est détruit mais le callback est encore en mémoire
  // store.listeners.get("change:score") contient encore une référence à ce Dashboard
  // memory leak garanti si on crée/détruit beaucoup de Dashboards
 }
}

// version corrigée
class Dashboard {
 constructor(store) {
  this.store = store
  // on stocke la fonction de désabonnement
  this.unsubscribe = this.store.watch("score", this.updateDisplay.bind(this))
 }

 updateDisplay({ newValue }) {
  console.log(`Score: ${newValue}`)
 }

 destroy() {
  // désabonnement propre : le callback est retiré de la liste
  this.unsubscribe()
 }
}
```

Règle : tout `on()` a un `off()` correspondant. Tout `addEventListener` a un `removeEventListener`. Toujours.

---

## 6) LE PIÈGE : L'ORDRE DES CALLBACKS

```js
const emitter = new EventEmitter()

emitter.on("event", () => console.log("premier"))
emitter.on("event", () => console.log("deuxième"))
emitter.on("event", () => console.log("troisième"))

emitter.emit("event")
// premier
// deuxième
// troisième
// l'ordre est préservé, mais ne jamais en dépendre pour la logique métier
// si "deuxième" doit ABSOLUMENT s'exécuter avant "premier" : c'est une dépendance déguisée
// et une dépendance déguisée, ça se corrige en architecture, pas en ordonnant les abonnements
```

---

## EXERCICES

## EXO 1 : LE CONSEIL DE SURVEILLANCE DE GARO

Le Conseil surveille tous les Chevaliers de la Flamme en temps réel. Quand un Horror apparaît, plusieurs systèmes doivent réagir :
- le Logger de menaces
- le Dispatcher de Chevaliers (le plus proche reçoit la mission)
- le Système d'alerte civile (si le Horror est en zone urbaine)
- l'Historique des apparitions

Crée un `HorrorEventBus` basé sur un `EventEmitter`.
Implémente les events : `horror:appeared`, `horror:defeated`, `horror:escaped`.
Branche les quatre systèmes comme subscribers.

Contrainte : le système d'alerte civile ne doit réagir que si `location.type === "urban"`.
Contrainte 2 : si un Chevalier tombe au combat, émettre `knight:down` et désabonner automatiquement ce Chevalier de tous ses events.

---

## EXO 2 : LE TRAPSOUL RADIO STATE

La radio a un état : `{ currentTrack, volume, listeners, isLive }`.
Plusieurs composants d'UI réagissent aux changements :
- l'affichage du titre change quand `currentTrack` change
- le slider de volume se met à jour visuellement
- le compteur d'auditeurs se rafraîchit
- un badge "ON AIR" s'allume quand `isLive` passe à true

Crée un `RadioStore` basé sur le pattern ReactiveStore du cours.
Simule les changements d'état et vérifie que chaque composant réagit correctement.

Contrainte : le badge "ON AIR" ne doit s'allumer qu'une seule fois, même si `isLive` passe plusieurs fois de `false` à `true`. (utilise `once` ou garde l'état précédent)

---

## EXO 3 : LE BUG À TROUVER

Ce code Observer a deux bugs. Lesquels ?

```js
class EventBus {
 constructor() {
  this.listeners = {}
 }

 on(event, callback) {
  this.listeners[event] = this.listeners[event] || []
  this.listeners[event].push(callback)
 }

 emit(event, data) {
  this.listeners[event].forEach(cb => cb(data))
 }
}

const bus = new EventBus()
bus.on("goal", () => console.log("but !"))
bus.emit("offside")  // bug 1
bus.emit("goal", { scorer: "Messi" })

// bug 2 : cherche dans la mécanique du on/off
// (indice : que se passe-t-il si deux callbacks identiques sont enregistrés ?)
```

---

## RÉSUMÉ

Observer découple le Publisher de ses Subscribers : la source n'a pas besoin de connaître les réactions.
L'implémentation JS de base : `Map<event, callback[]>` + méthodes `on/off/emit`.
Le pattern réactif avancé (store + watch) est la base de Vue, MobX, les signals.
Le piège systématique : oublier de se désabonner crée des memory leaks.
En prod : partout où un changement d'état doit déclencher plusieurs réactions indépendantes : c'est Observer.

**Note : 10/10**
