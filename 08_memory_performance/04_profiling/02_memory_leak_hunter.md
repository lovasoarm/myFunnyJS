---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# MEMORY LEAK HUNTER : LA CHASSE AU FANTÔME
Temps de lecture ~10 min

Une fuite mémoire, c'est un objet que tu as fini d'utiliser, mais que JS refuse d'effacer.
Il reste là. Il prend de la place. Et il continue de grossir.

Le problème : les fuites mémoire ne lèvent pas d'erreur. Elles ralentissent. Elles dégradent.
Elles finissent par crasher l'app, 20 minutes après le vrai problème.

C'est pour ça que c'est une chasse au fantôme : quelque chose rôde, tu ne le vois pas, mais tu sens sa présence.

---

## 1) COMMENT UNE FUITE ARRIVE

Le GC efface les objets que plus rien ne référence.
Une fuite = un objet que tu as oublié de déréférencer. Il reste vivant par accident.

Les quatre sources les plus courantes :

**1. Listeners non supprimés**

```js
// le dashboard des Ultras ajoute un listener à chaque match
function lancerMatch(matchId) {
 const data = chargerDonneesMatch(matchId) // gros objet en mémoire

 document.addEventListener('keydown', (e) => {
  // cette closure retient `data` en mémoire
  if (e.key === 'r') afficherStats(data)
 })
}

// problème : chaque appel à lancerMatch() ajoute un listener
// après 10 matchs : 10 listeners, 10 copies de data en mémoire
// après 100 matchs : la RAM explose

// correction :
function lancerMatch(matchId) {
 const data = chargerDonneesMatch(matchId)

 const handler = (e) => {
  if (e.key === 'r') afficherStats(data)
 }

 document.addEventListener('keydown', handler)

 // retourner un cleanup ou l'appeler quand le match se termine
 return () => document.removeEventListener('keydown', handler)
}
```

**2. Timers non clearés**

```js
// cooldown du jutsu de Naruto : mise à jour toutes les 100ms
function demarrerCooldown(jutsu) {
 const interval = setInterval(() => {
  jutsu.cooldown -= 100
  if (jutsu.cooldown <= 0) {
   jutsu.pret = true
   // BUG : on oublie de clearInterval
   // l'intervalle tourne pour toujours, retient jutsu en mémoire
  }
 }, 100)
}

// correction :
function demarrerCooldown(jutsu) {
 const interval = setInterval(() => {
  jutsu.cooldown -= 100
  if (jutsu.cooldown <= 0) {
   jutsu.pret = true
   clearInterval(interval) // ici
  }
 }, 100)
}
```

**3. Caches sans limite**

```js
// cache des stats de joueurs : pratique, mais dangereux
const statsCache = new Map()

function getStats(joueurId) {
 if (!statsCache.has(joueurId)) {
  statsCache.set(joueurId, chargerStats(joueurId))
 }
 return statsCache.get(joueurId)
}

// problème : statsCache grossit à l'infini
// après 1 saison : 500 joueurs en cache, jamais supprimés

// correction option A : LRU cache avec taille max
// correction option B : WeakMap (le GC peut effacer les entrées automatiquement)
const weakCache = new WeakMap() // les clés doivent être des objets

function getStats(joueurObj) {
 if (!weakCache.has(joueurObj)) {
  weakCache.set(joueurObj, chargerStats(joueurObj.id))
 }
 return weakCache.get(joueurObj)
}
// quand joueurObj n'est plus référencé ailleurs, le GC peut supprimer l'entrée
```

**4. Closures qui retiennent trop**

```js
// analyse de match : on garde une référence inutile à un gros tableau
function creerAnalyseur(historique) {
 // historique peut peser plusieurs MB
 const premierMatch = historique[0] // on veut juste ça

 return {
  getPremierMatch: () => premierMatch,
  // problème : la closure retient TOUT historique en mémoire
  // même si on n'a besoin que de premierMatch
 }
}

// correction : extraire ce dont on a besoin, laisser le reste au GC
function creerAnalyseur(historique) {
 const premierMatch = { ...historique[0] } // copie, pas référence
 // historique peut maintenant être collecté par le GC

 return {
  getPremierMatch: () => premierMatch
 }
}
```

---

## 2) DÉTECTER AVEC DEVTOOLS : LES 3 OUTILS

### Memory Heap Snapshot

```
DevTools > Memory > Heap Snapshot > Take Snapshot
```

Prends un snapshot, fais des actions dans l'app, prends un second snapshot.
Compare les deux. Les objets présents dans le second mais pas dans le premier : suspects.

Ce qu'on cherche :
- des objets dont le nombre augmente entre les snapshots
- des `(closure)` ou `(array)` qui grossissent sans raison
- des références retenues vers des nœuds DOM détachés

### Allocation Timeline

```
DevTools > Memory > Allocation instrumentation on timeline > Start
```

Lance l'enregistrement, utilise l'app, arrête.
Les barres bleues = allocations. Les barres grises = mémoire libérée.
Si des barres restent bleues longtemps : quelque chose n'est pas libéré.

### Performance Monitor

```
DevTools > More tools > Performance monitor
```

Regarde JS heap size en temps réel pendant que tu utilises l'app.
Une courbe qui monte sans jamais descendre : c'est une fuite.
Une courbe en dents de scie (monte puis descend) : c'est normal, c'est le GC qui travaille.

---

## 3) SIMULER ET DÉTECTER EN CODE

Avant d'aller dans DevTools, tu peux déjà logger l'usage mémoire en Node.

```js
// Node.js uniquement
function logMemoire(label) {
 const mem = process.memoryUsage()
 console.log(`[${label}]`)
 console.log(` heap utilisé : ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`)
 console.log(` heap total  : ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`)
 console.log(` RSS     : ${(mem.rss / 1024 / 1024).toFixed(2)} MB`)
}

logMemoire('avant')

// simuler une fuite : garder des références dans un tableau global
const leakArray = []

for (let i = 0; i < 10_000; i++) {
 leakArray.push({
  id: i,
  data: new Array(1000).fill('zombie'), // chaque objet pèse ~8KB
  timestamp: Date.now()
 })
}

logMemoire('après fuite simulée')

// [avant]
//  heap utilisé : 4.23 MB
// [après fuite simulée]
//  heap utilisé : 92.17 MB
```

---

## 4) LE PATTERN CLEANUP

Dans une app sérieuse, chaque setup a son teardown.
C'est une règle, pas une option.

```js
// architecture event-driven de garo_no_kronika
// chaque Chevalier s'abonne aux alertes Horror

class Chevalier {
 constructor(nom) {
  this.nom = nom
  this.listeners = []
 }

 sAbonnerAuxAlertes(emitter) {
  const handler = (horror) => this.reagir(horror)

  emitter.on('horror-detecte', handler)

  // stocker la référence pour pouvoir cleanup plus tard
  this.listeners.push({ emitter, event: 'horror-detecte', handler })
 }

 reagir(horror) {
  console.log(`${this.nom} répond à l'Horror ${horror.id}`)
 }

 // appelé quand le Chevalier se retire
 cleanup() {
  for (const { emitter, event, handler } of this.listeners) {
   emitter.off(event, handler)
  }
  this.listeners = []
  console.log(`${this.nom} a nettoyé tous ses listeners`)
 }
}

const leon = new Chevalier('León Luís')
leon.sAbonnerAuxAlertes(alertEmitter)

// plus tard, quand la mission est finie :
leon.cleanup() // sans ça : leon reste en mémoire tant que alertEmitter existe
```

---

## 5) `WeakRef` ET `FinalizationRegistry` : LES OUTILS AVANCÉS

Depuis ES2021, JS a des outils pour les caches qui doivent laisser le GC travailler.

```js
// cache avec WeakRef : le GC peut collecter l'objet si nécessaire
const cache = new Map()

function getOrLoad(key, loader) {
 const ref = cache.get(key)
 const cached = ref?.deref() // .deref() retourne l'objet ou undefined si collecté

 if (cached) return cached

 const value = loader()
 cache.set(key, new WeakRef(value))

 return value
}

// FinalizationRegistry : être notifié quand un objet est collecté
const registry = new FinalizationRegistry((key) => {
 console.log(`L'objet associé à "${key}" a été collecté : nettoyage de la Map`)
 cache.delete(key)
})

function getOrLoadWithRegistry(key, loader) {
 const ref = cache.get(key)
 const cached = ref?.deref()

 if (cached) return cached

 const value = loader()
 cache.set(key, new WeakRef(value))
 registry.register(value, key) // notifier quand value est collecté

 return value
}
```

Note : WeakRef et FinalizationRegistry sont pour des cas avancés.
Le GC ne garantit pas quand (ou si) il va collecter. Ne pas construire de logique critique dessus.

---

## EXERCICES

## EXO 1 : TROUVER LA FUITE

Ce code a une fuite. Trouve-la, explique pourquoi, corrige-la.

```js
class RadioTrapSoul {
 constructor() {
  this.playlist = []
  this.listeners = []
 }

 ajouterTrack(track) {
  this.playlist.push(track)
  this.notifier('track-ajoutee', track)
 }

 onEvent(event, callback) {
  this.listeners.push({ event, callback })
 }

 notifier(event, data) {
  this.listeners
   .filter(l => l.event === event)
   .forEach(l => l.callback(data))
 }
}

const radio = new RadioTrapSoul()

// l'app ajoute un listener à chaque fois que le shinobi change de page
function changerDePage(pageId) {
 radio.onEvent('track-ajoutee', (track) => {
  console.log(`Page ${pageId} : nouvelle track : ${track.titre}`)
 })
}

// simuler 50 changements de page
for (let i = 0; i < 50; i++) {
 changerDePage(i)
}

radio.ajouterTrack({ titre: 'Bryson Tiller : Exchange' })
// combien de fois ce log s'affiche ? c'est le bug.
```

## EXO 2 : LE CAMP DE RICK

Le camp de Rick a un système de surveillance qui log toutes les 500ms.
Après 5 secondes, le camp est abandonné. Le log doit s'arrêter.
Implémente le cleanup correctement.

```js
function demarrerSurveillance(camp) {
 // à toi de jouer
 // retourner une fonction cleanup
}

const camp = { nom: 'Prison', survivants: 30, niveau: 'secure' }
const stopSurveillance = demarrerSurveillance(camp)

setTimeout(stopSurveillance, 5000) // le camp est abandonné
```

## EXO 3 : LE CACHE QUI EXPLOSE

Tu as un cache simple. Il grossit sans limite.
Implémente une version avec une taille max de 100 entrées.
Quand la limite est atteinte, la plus ancienne entrée est supprimée (FIFO).

```js
class StatsCacheUltras {
 constructor(maxSize = 100) {
  // à implémenter
 }

 get(joueurId) {
  // à implémenter
 }

 set(joueurId, stats) {
  // à implémenter
 }
}
```

---

## RÉSUMÉ

Une fuite mémoire, c'est un objet que le GC ne peut pas collecter parce que quelque chose le retient encore.
Les quatre sources classiques : listeners non supprimés, timers non clearés, caches sans limite, closures qui retiennent trop.
Tout setup a son teardown : c'est une règle de prod, pas une option.
DevTools Memory tab : heap snapshot pour voir ce qui reste, allocation timeline pour voir ce qui n'est pas libéré.
`process.memoryUsage()` en Node pour détecter une fuite sans ouvrir DevTools.
