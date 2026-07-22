---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PROBABILITY & RANDOM : LE RNG QUI NE MENT PAS
Temps de lecture ~10 min

`Math.random()` retourne un nombre entre 0 et 1. C'est tout ce que la plupart des devs savent.
C'est pas assez.

Un système de drop rate dans un jeu, un A/B test équitable, un shuffle de playlist sans biais, une simulation de match : tout ça repose sur une compréhension correcte des probabilités et des distributions.
Sinon ton RNG ment. Il génère des résultats qui *semblent* aléatoires mais qui ne le sont pas.

---

## 1) Math.random() : CE QU'IL FAIT VRAIMENT

`Math.random()` retourne un flottant dans `[0, 1)` (0 inclus, 1 exclu).
Il utilise un PRNG (Pseudo-Random Number Generator) : pas vraiment aléatoire, déterministe si on connaît la graine.

```js
Math.random()    // 0.7234...
Math.random()    // 0.1891...

// transformer en entier entre min et max (inclus)
function randInt(min, max) {
 return Math.floor(Math.random() * (max - min + 1)) + min
}

randInt(1, 6)  // simule un dé : 1 à 6
randInt(0, 99) // pourcentage : 0 à 99

// piège classique :
Math.floor(Math.random() * 6) + 1 // correct : 1-6
Math.round(Math.random() * 6)   // FAUX : 0 et 6 ont moitié moins de chances
```

**Pourquoi `Math.round` est biaisé :**
```
Math.round distribue les probabilités comme ça :
0     : [0.0, 0.5[ --> 50% de chance
1, 2, 3, 4, 5 : chacun [n-0.5, n+0.5[ --> 100% de chance
6     : [5.5, 6.0] --> 50% de chance

0 et 6 ont moitié moins de chances que les autres.
Math.floor évite ça complètement.
```

---

## 2) DISTRIBUTIONS : UNIFORM VS WEIGHTED

**Distribution uniforme** : chaque valeur a la même probabilité.
**Distribution pondérée** : certaines valeurs ont plus de chances que d'autres.

```js
// distribution uniforme : chaque ninja a 1/4 de chances
const ninjas = ["Naruto", "Sasuke", "Sakura", "Kakashi"]
const picked = ninjas[randInt(0, ninjas.length - 1)]

// distribution pondérée : Naruto est 3x plus probable que Sasuke
function weightedRandom(items) {
 // items = [{ value, weight }, ...]
 const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
 let random = Math.random() * totalWeight

 for (const item of items) {
  random -= item.weight
  if (random <= 0) return item.value
 }
}

const result = weightedRandom([
 { value: "Naruto", weight: 60 },  // 60% de chances
 { value: "Sasuke", weight: 20 },  // 20%
 { value: "Sakura", weight: 15 },  // 15%
 { value: "Kakashi", weight: 5 },  // 5%
])
```

**Visualisation du concept :**
```
poids total = 100

0     60    80    95  100
|---------|---------|---------|-----|
 Naruto  Sasuke  Sakura Kakashi

random() * 100 --> tombe dans la zone --> résultat
```

---

## 3) SYSTÈMES DE DROP RATE : COMME DANS UN VRAI JEU

Les drop rates dans les jeux RPG ne sont pas des `Math.random() < 0.01`.
Les vrais systèmes utilisent des pity systems et des pseudo-random pour éviter les sequences absurdes.

```js
// drop rate naïf : 1% de chances
function naiveDrop() {
 return Math.random() < 0.01 // peut échouer 500x de suite
}

// pity system : la probabilité augmente si on échoue
class PityDrop {
 constructor(baseRate, pityThreshold) {
  this.baseRate = baseRate    // 0.01 = 1%
  this.pityThreshold = pityThreshold // après 100 essais, garanti
  this.attempts = 0
 }

 roll() {
  this.attempts++

  // pity garantied
  if (this.attempts >= this.pityThreshold) {
   this.attempts = 0
   return true
  }

  // taux qui augmente progressivement après 50% du seuil
  const progressRate = this.attempts > this.pityThreshold * 0.5
   ? this.baseRate + (this.attempts / this.pityThreshold) * 0.5
   : this.baseRate

  if (Math.random() < progressRate) {
   this.attempts = 0
   return true
  }

  return false
 }
}

const chakraDrop = new PityDrop(0.01, 100)
// garanti au bout de 100 essais max
// mais la probabilité augmente doucement à partir de l'essai 50
```

---

## 4) SHUFFLE SANS BIAIS : FISHER-YATES

Mélanger un tableau proprement, ça semble trivial. Le naïf `sort(() => Math.random() - 0.5)` est biaisé.

```js
// BIAISÉ : distribue les éléments inégalement
const squad = ["Naruto", "Sasuke", "Sakura", "Kakashi", "Rock Lee"]
squad.sort(() => Math.random() - 0.5)
// certaines permutations apparaissent plus souvent que d'autres

// CORRECT : Fisher-Yates shuffle
function fisherYates(arr) {
 const result = [...arr] // on ne mute pas l'original
 for (let i = result.length - 1; i > 0; i--) {
  const j = randInt(0, i) // j dans [0, i]
  ;[result[i], result[j]] = [result[j], result[i]] // swap
 }
 return result
}

fisherYates(squad) // distribution uniforme garantie
```

**Pourquoi `.sort()` est biaisé :**
```
.sort() appelle le comparateur ~n*log(n) fois.
Chaque appel retourne un résultat aléatoire.
Mais .sort() n'est pas conçu pour ça : les éléments ne sont pas tous comparés entre eux.
Résultat : certaines permutations sont favorisées.

Fisher-Yates : on parcourt de droite à gauche, on échange chaque élément
avec un élément aléatoire à gauche. Chaque permutation a exactement 1/n! de chances.
```

---

## 5) LOI DES GRANDS NOMBRES : TESTER SON RNG

Un bon générateur produit des fréquences qui convergent vers les probabilités théoriques au bout de beaucoup d'essais.

```js
// vérifier qu'un dé à 6 faces est équitable
function testDie(rollFn, trials = 100000) {
 const counts = {}

 for (let i = 0; i < trials; i++) {
  const roll = rollFn()
  counts[roll] = (counts[roll] || 0) + 1
 }

 console.log("Distribution (théorique : 16.67% chacun) :")
 for (const [face, count] of Object.entries(counts)) {
  const pct = ((count / trials) * 100).toFixed(2)
  const bar = "█".repeat(Math.round(count / trials * 100))
  console.log(`Face ${face}: ${pct}% ${bar}`)
 }
}

testDie(() => randInt(1, 6))
// Face 1: 16.72% ████████████████
// Face 2: 16.65% ████████████████
// ...
// si une face est à 25%, ton générateur est biaisé
```

---

## 6) RANDOM CRYPTOGRAPHIQUE : QUAND Math.random() NE SUFFIT PAS

`Math.random()` est prévisible : si un attaquant connaît la graine du PRNG, il peut prédire les prochains nombres.
Pour les tokens de session, les UUID, les codes de reset de mot de passe : utilise `crypto.getRandomValues`.

```js
// DANGEREUX pour du code de sécurité
const resetToken = Math.random().toString(36) // prédictible

// CORRECT : aléatoire cryptographiquement sûr
function secureToken(length = 32) {
 const array = new Uint8Array(length)
 crypto.getRandomValues(array)
 return Array.from(array, b => b.toString(16).padStart(2, "0")).join("")
}

secureToken() // "a3f92c1b8e4d7f0a..." imprévisible

// en Node.js :
import { randomBytes } from "crypto"
const token = randomBytes(32).toString("hex")
```

**Règle simple :**
```
Math.random()     --> jeux, simulations, UI, shuffle de playlist
crypto.getRandomValues --> tokens, sessions, codes, tout ce qui a des implications de sécurité
```

---

## 7) DISTRIBUTION NORMALE : LE BELL CURVE

La plupart des phénomènes réels suivent une distribution normale (en cloche), pas uniforme.
Les stats de joueurs dans FIFA, les temps de réponse d'une API, les scores d'un examen.

```js
// Box-Muller transform : générer une distribution normale depuis Math.random()
function normalRandom(mean = 0, stdDev = 1) {
 const u1 = Math.random()
 const u2 = Math.random()
 // transformation mathématique qui produit une distribution en cloche
 const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
 return mean + z * stdDev
}

// générer des stats de joueur réalistes
function generatePlayerStats() {
 return {
  pace:  Math.round(Math.min(99, Math.max(40, normalRandom(72, 10)))),
  shoot:  Math.round(Math.min(99, Math.max(40, normalRandom(68, 12)))),
  stamina: Math.round(Math.min(99, Math.max(40, normalRandom(75, 8)))),
 }
}

// la majorité des joueurs sera autour de 68-76
// quelques extrêmes à 45 ou 95 : comme dans la vraie vie
```

---

## EXERCICES

## EXO 1 : LE SYSTÈME DE COMBAT DE NARUTO

Implémente un résolveur de combat qui détermine le résultat d'une attaque.
Chaque attaque a :
- un taux de coup critique (`critRate`) entre 0 et 1
- un taux d'esquive de l'adversaire (`dodgeRate`) entre 0 et 1
- des dégâts de base (`baseDamage`)

L'esquive est résolue en premier. Si l'attaque touche :
- les dégâts normaux = `baseDamage * (0.8 + Math.random() * 0.4)` (±20%)
- les dégâts critiques = dégâts normaux * 1.75

Implémente `resolveAttack(attacker, defender)` et teste-le 10 000 fois pour vérifier que les probabilités sont correctes.

---

## EXO 2 : PLAYLIST SHUFFLE ÉQUITABLE

Bryson Tiller a 20 tracks dans sa playlist.
Il veut une fonction `createShuffleQueue(tracks)` qui :
- génère une queue mélangée avec Fisher-Yates
- garantit que chaque track joue exactement une fois avant de recommencer
- si la même track serait en première position deux fois de suite (fin de cycle → début de suivant), la swap avec une position aléatoire

(Hint : garde en mémoire la dernière track jouée)

---

## EXO 3 : A/B TEST REPRODUCTIBLE

T'as un système d'A/B test pour myFunnyJS.
Les shinobis sont assignés au groupe A ou B selon leur `userId`.

Implémente `assignVariant(userId, experimentId, ratio = 0.5)` qui :
- produit la même assignation pour le même `userId + experimentId` (reproductible)
- distribue les shinobis selon le ratio (0.5 = 50/50, 0.3 = 30% groupe A)
- utilise un hash du userId+experimentId pour déterminer l'assignation (pas Math.random)

(Hint : hash(userId + experimentId) % 100 < ratio * 100 --> groupe A)

---

## RÉSUMÉ

`Math.random()` est uniform et prévisible : bon pour les jeux, interdit pour la sécurité.
`.sort(() => Math.random() - 0.5)` est biaisé : Fisher-Yates est l'algo correct pour mélanger.
Les distributions pondérées permettent de contrôler les probabilités sans biais.
La loi des grands nombres : tester son RNG sur 100k itérations révèle les biais cachés.
`crypto.getRandomValues` pour tout ce qui touche à la sécurité : tokens, sessions, codes.
Box-Muller transform si t'as besoin d'une distribution normale depuis `Math.random()`.
