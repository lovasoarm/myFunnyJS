---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ADAPTER : BRANCHER DEUX INTERFACES INCOMPATIBLES
Temps de lecture ~9 min

Tu as une API externe qui retourne `{ first_name, last_name, goals_scored }`.
Ton code attend `{ firstName, lastName, goals }`.
C'est la même donnée. C'est pas la même interface.

Solution naïve : tu changes ton code partout pour matcher l'API externe. Deux semaines plus tard, l'API externe change. Tu recommences.

Solution Adapter : tu crées une couche entre les deux. L'extérieur fait ce qu'il veut. Ton code vit dans son propre monde. L'Adapter traduit.

En prod : intégrations third-party, migration de legacy, unification de sources hétérogènes. Chaque fois que tu `map` une réponse API en entrée de ton système : tu écris un Adapter.

---

## 1) LE CAS CONCRET : DEUX SOURCES DE DONNÉES INCOMPATIBLES

```js
// source 1 : ancienne API du camp (Walking Dead, v1)
const legacyAPI = {
 getSurvivor: (id) => ({
  survivor_id: id,
  full_name: "Rick Grimes",
  supply_count: 42,
  threat_level: "HIGH"
 })
}

// source 2 : nouvelle API
const newAPI = {
 getSurvivor: (id) => ({
  id,
  name: { first: "Rick", last: "Grimes" },
  supplies: { food: 20, ammo: 22 },
  threat: { level: 3, label: "HIGH" }
 })
}

// ton code interne attend ce format
function processSurvivor(survivor) {
 // survivor.id
 // survivor.name
 // survivor.supplies
 // survivor.threat
 console.log(`Processing ${survivor.name}, supplies: ${survivor.supplies}`)
}

// sans adapter : tu dois tout dupliquer ou tout conditionner
// avec adapter : tu traduis à l'entrée, ton code reste propre
```

---

## 2) L'ADAPTER FONCTIONNEL

```js
// Adapter pour l'ancienne API
function adaptLegacySurvivor(legacySurvivor) {
 return {
  id: legacySurvivor.survivor_id,
  name: legacySurvivor.full_name,     // on simplifie : string plat
  supplies: legacySurvivor.supply_count,  // on normalise le nom
  threat: legacySurvivor.threat_level    // on normalise le nom
 }
}

// Adapter pour la nouvelle API
function adaptNewSurvivor(newSurvivor) {
 return {
  id: newSurvivor.id,
  name: `${newSurvivor.name.first} ${newSurvivor.name.last}`,
  supplies: newSurvivor.supplies.food + newSurvivor.supplies.ammo,
  threat: newSurvivor.threat.label
 }
}

// ton code interne ne sait pas d'où vient la donnée
const survivor1 = adaptLegacySurvivor(legacyAPI.getSurvivor("rick"))
const survivor2 = adaptNewSurvivor(newAPI.getSurvivor("rick"))

processSurvivor(survivor1) // même fonction, deux sources
processSurvivor(survivor2)
```

Diagramme :

```
legacyAPI.getSurvivor() --> adaptLegacySurvivor() --> processSurvivor()
                    |
                 [traduction]
                    |
newAPI.getSurvivor()   --> adaptNewSurvivor()   --> processSurvivor()
```

---

## 3) L'ADAPTER EN VERSION CLASSE (PLUS STRUCTURÉ)

Quand l'interface à adapter est complexe, une classe Adapter est plus lisible.

```js
// l'interface que ton code attend : un "lecteur de stats de match"
// chaque méthode retourne un format normalisé
class MatchStatsReader {
 getScore() { throw new Error("not implemented") }
 getTopScorer() { throw new Error("not implemented") }
 getFormation() { throw new Error("not implemented") }
}

// source externe 1 : API Opta (format XML-like objet)
class OptaAPI {
 constructor(matchData) { this.data = matchData }
 fetchScore() { return `${this.data.home_goals}-${this.data.away_goals}` }
 fetchTopPerformer() { return this.data.best_player }
 fetchTacticalSetup() { return this.data.formation_code }
}

// source externe 2 : API StatsBomb (format totalement différent)
class StatsBombAPI {
 constructor(matchData) { this.data = matchData }
 getResult() { return { home: this.data.score[0], away: this.data.score[1] } }
 getMVP() { return this.data.players.find(p => p.rating === Math.max(...this.data.players.map(p => p.rating))) }
 getTactics() { return this.data.tactics.formation }
}

// Adapter 1 : brancher OptaAPI sur l'interface attendue
class OptaAdapter extends MatchStatsReader {
 constructor(optaAPI) {
  super()
  this.opta = optaAPI  // on contient l'original, on ne l'hérite pas
 }

 getScore() {
  // opta retourne "2-1" : on parse
  const [home, away] = this.opta.fetchScore().split("-").map(Number)
  return { home, away }
 }

 getTopScorer() {
  return { name: this.opta.fetchTopPerformer() }
 }

 getFormation() {
  return this.opta.fetchTacticalSetup()
 }
}

// Adapter 2 : brancher StatsBombAPI sur la même interface
class StatsBombAdapter extends MatchStatsReader {
 constructor(statsBombAPI) {
  super()
  this.sb = statsBombAPI
 }

 getScore() {
  return this.sb.getResult()  // déjà au bon format
 }

 getTopScorer() {
  const mvp = this.sb.getMVP()
  return { name: mvp.name }  // on normalise la structure
 }

 getFormation() {
  return this.sb.getTactics()
 }
}

// code qui utilise l'interface normalisée : ne sait rien des sources
function displayMatchSummary(statsReader) {
 const score = statsReader.getScore()
 const top = statsReader.getTopScorer()
 console.log(`Score: ${score.home}-${score.away}`)
 console.log(`MVP: ${top.name}`)
}

// on peut passer n'importe quel Adapter
const optaMatch = new OptaAPI({ home_goals: 2, away_goals: 1, best_player: "Messi", formation_code: "4-3-3" })
displayMatchSummary(new OptaAdapter(optaMatch))

const sbMatch = new StatsBombAPI({
 score: [2, 1],
 players: [{ name: "Messi", rating: 9.2 }, { name: "Ronaldo", rating: 8.1 }],
 tactics: { formation: "4-3-3" }
})
displayMatchSummary(new StatsBombAdapter(sbMatch))
```

---

## 4) L'ADAPTER BIDIRECTIONNEL

Parfois les données doivent aller dans les deux sens : lire *et* écrire vers une source externe.

```js
// ton format interne
// { playerId, firstName, lastName, position, marketValue }

// API externe du club (format legacy)
// { id, name, pos, value_EUR }

class PlayerAPIAdapter {
 constructor(externalAPI) {
  this.api = externalAPI
 }

 // externe --> interne
 toInternal(externalPlayer) {
  const [firstName, ...rest] = externalPlayer.name.split(" ")
  return {
   playerId: externalPlayer.id,
   firstName,
   lastName: rest.join(" "),
   position: externalPlayer.pos,
   marketValue: externalPlayer.value_EUR
  }
 }

 // interne --> externe (pour les writes)
 toExternal(internalPlayer) {
  return {
   id: internalPlayer.playerId,
   name: `${internalPlayer.firstName} ${internalPlayer.lastName}`,
   pos: internalPlayer.position,
   value_EUR: internalPlayer.marketValue
  }
 }

 async getPlayer(id) {
  const raw = await this.api.fetch(id)
  return this.toInternal(raw)  // retourne toujours le format interne
 }

 async savePlayer(player) {
  const adapted = this.toExternal(player)  // traduit avant d'envoyer
  return this.api.save(adapted)
 }
}
```

---

## 5) LE PIÈGE : ADAPTER VS FACADE

Les deux wrappent une interface. La différence :

```
Adapter : traduit une interface A vers une interface B
     "je parle ton langage à toi"
     l'interface de sortie est imposée par ton code

Facade : simplifie un système complexe en cachant ses détails
     "je cache la complexité pour toi"
     l'interface de sortie, c'est toi qui la décides
```

```js
// Adapter : le format de sortie est dicté par ce que ton code attend
// ton code attend { id, name, value } --> l'Adapter produit exactement ça

// Facade : le format de sortie est dicté par ce qui est simple à utiliser
// tu decides que fetch + parse + validate, ça devient juste getPlayer(id)
```

---

## EXERCICES

## EXO 1 : LE RÉSEAU DE WALTER WHITE

Walter a deux sources de données pour son réseau : une vieille base de données (format CSV-like) et une API REST moderne.

Format ancien : `"ABQ|Heisenberg|meth|98.1|active"`
Format API REST : `{ city: "ABQ", alias: "Heisenberg", product: "meth", purity: 98.1, status: "active" }`

Ton système interne attend : `{ city, alias, product, purity, isActive }`

Crée deux fonctions Adapter qui normalisent ces deux sources vers le format interne.
Crée une fonction `processDistributor(distributor)` qui ne sait rien des sources et les traite de la même façon.

---

## EXO 2 : L'ADAPTATEUR DE JUTSUS

Naruto a des alliés qui viennent de villages différents. Chaque village a son propre format pour décrire un jutsu :
- Village du Sable : `{ nom, type, degats, cout_chakra }`
- Village du Brouillard : `{ name, category, damage, chakraCost }`
- Village de la Feuille : `{ jutsuName, jutsuType, power, chakra }`

Ton moteur de combat attend : `{ name, type, damage, chakraCost }`

Crée un Adapter par village, puis une fonction `createJutsuAdapter(village)` qui retourne le bon Adapter selon le village d'origine.

---

## EXO 3 : LE BUG À TROUVER

Cet Adapter est censé normaliser des données de joueurs. Pourquoi `displayPlayer` crash ?

```js
function adaptPlayer(rawPlayer) {
 return {
  id: rawPlayer.player_id,
  name: rawPlayer.fullName,
  goals: rawPlayer.stats.goals
 }
}

function displayPlayer(player) {
 console.log(`${player.name} : ${player.goals} buts`)
}

const raw = {
 player_id: 10,
 full_name: "Lionel Messi",  // oups
 stats: { scored: 672 }    // oups
}

displayPlayer(adaptPlayer(raw))
```

(indice : l'Adapter mappe les mauvais noms de champs : c'est le bug le plus commun en production)

---

## RÉSUMÉ

L'Adapter traduit une interface vers une autre. Il ne change pas le comportement : il change le vocabulaire.
Il protège ton code des variations extérieures : quand l'API change, tu changes l'Adapter, pas ton cœur applicatif.
Différence clé avec Decorator : le Decorator ajoute du comportement, l'Adapter change l'interface.
En prod : intégration de third-party, migration de legacy, normalisation de sources hétérogènes.
Règle de décision : si deux systèmes font la même chose mais se parlent des langues différentes, c'est un Adapter.

**Note : 10/10**
