---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# BUILDER PATTERN
Temps de lecture ~10 min

Construire un personnage dans Dragon Ball, c'est pas juste `new Guerrier()`.
Il y a la race (Saiyan, Namekien, humain), le niveau de puissance, les transformations disponibles, l'équipement, les techniques spéciales, la saga d'appartenance.
Tout ça dans un seul constructeur : 8 paramètres, dans le bon ordre, ou c'est Yamcha qui apparaît à la place de Goku.

Le Builder pattern résout exactement ça.
Au lieu d'un constructeur géant, tu construis l'objet étape par étape.
Chaque étape est optionnelle, nommée, et lisible.
À la fin : `.build()`, et l'objet est là.

---

## 1) LE PROBLÈME : LE TELESCOPING CONSTRUCTOR

```js
// sans builder : constructeur qui grossit sans fin
class Guerrier {
 constructor(name, race, powerLevel, transformation, weapon, technique1, technique2, saga) {
  this.name      = name
  this.race      = race
  this.powerLevel   = powerLevel
  this.transformation = transformation || null
  this.weapon     = weapon || null
  this.technique1   = technique1 || null
  this.technique2   = technique2 || null
  this.saga      = saga || "début"
 }
}

// appel : tu comptes les virgules et tu pries
const goku = new Guerrier("Goku", "Saiyan", 9000, "Super Saiyan", null, "Kamehameha", "Rasengan", "Cell")
```

8 paramètres positionnels. Si tu oublies le 5ème, tout se décale.
Si tu veux un guerrier sans arme, tu mets `null` et tu espères.
Si quelqu'un lit ça dans 6 mois : il comprend rien sans regarder la définition.

C'est ce qu'on appelle le Telescoping Constructor. Ça s'aggrave à chaque nouvelle option.

---

## 2) BUILDER FUNCTION : LA VERSION FLUENT

```js
function createGuerrierBuilder(name) {
 // état interne du builder : commence par le minimum vital
 const config = {
  name,
  race:      "Humain",
  powerLevel:   1,
  transformation: null,
  weapon:     null,
  techniques:   [],
  saga:      "début",
  isValidated:  false,
 }

 // chaque méthode modifie la config et retourne le builder lui-même
 // c'est ce qui permet le chaînage fluent
 const builder = {
  race(r) {
   config.race = r
   return builder
  },

  powerLevel(lvl) {
   if (lvl < 1) throw new Error(`${name} ne peut pas avoir un power level négatif. Même Yamcha fait mieux.`)
   config.powerLevel = lvl
   return builder
  },

  transformation(t) {
   config.transformation = t
   return builder
  },

  weapon(w) {
   config.weapon = w
   return builder
  },

  technique(t) {
   config.techniques.push(t)
   return builder
  },

  saga(s) {
   config.saga = s
   return builder
  },

  build() {
   // validation finale : tout ce qui est obligatoire est là ?
   if (!config.name) throw new Error("Un guerrier sans nom, c'est un PNJ.")
   if (config.powerLevel > 9000 && config.transformation === null) {
    console.warn(`${config.name} dépasse 9000 sans transformation : c'est suspect.`)
   }
   // on retourne une copie figée : le builder ne peut plus modifier l'objet jutsu
   return Object.freeze({ ...config })
  }
 }

 return builder
}

// chaînage fluent : chaque étape est explicite, lisible, optionnelle
const goku = createGuerrierBuilder("Goku")
 .race("Saiyan")
 .powerLevel(9001)
 .transformation("Super Saiyan")
 .technique("Kamehameha")
 .technique("Spirit Bomb")
 .saga("Cell")
 .build()

// version minimale : juste les essentiels
const yamcha = createGuerrierBuilder("Yamcha")
 .powerLevel(200)
 .build()

console.log(goku.name)    // "Goku"
console.log(goku.techniques) // ["Kamehameha", "Spirit Bomb"]
console.log(yamcha.weapon)  // null : valeur par défaut, sans crasher
```

Chaque étape est nommée. L'ordre n'a pas d'importance.
Tu vois exactement ce que tu configures. Et ce que tu ne configure pas prend sa valeur par défaut.

---

## 3) BUILDER CLASS : POUR LES CAS COMPLEXES

```js
class MatchBuilder {
 constructor() {
  // valeurs par défaut : un match minimal est valide
  this._homeTeam  = null
  this._awayTeam  = null
  this._competition = "Friendly"
  this._venue    = "Stade neutre"
  this._date    = new Date()
  this._referees  = []
  this._broadcast  = []
  this._vipTickets = 0
  this._weather   = "clear"
 }

 homeTeam(team) {
  this._homeTeam = team
  return this
 }

 awayTeam(team) {
  this._awayTeam = team
  return this
 }

 competition(name) {
  this._competition = name
  return this
 }

 venue(stadium, city) {
  this._venue = { stadium, city }
  return this
 }

 date(d) {
  this._date = new Date(d)
  return this
 }

 addReferee(name, role) {
  this._referees.push({ name, role })
  return this
 }

 addBroadcast(channel, region) {
  this._broadcast.push({ channel, region })
  return this
 }

 vipTickets(count) {
  if (count < 0) throw new Error("Nombre de billets VIP négatif : t'es en train d'inventer.")
  this._vipTickets = count
  return this
 }

 weather(condition) {
  const valid = ["clear", "rain", "snow", "wind", "fog"]
  if (!valid.includes(condition)) throw new Error(`Météo inconnue : ${condition}`)
  this._weather = condition
  return this
 }

 build() {
  // règles métier : les deux équipes sont obligatoires
  if (!this._homeTeam) throw new Error("Équipe à domicile manquante.")
  if (!this._awayTeam) throw new Error("Équipe visiteuse manquante.")
  if (this._homeTeam === this._awayTeam) throw new Error("Un club ne joue pas contre lui-même. Sauf en entraînement.")

  return {
   homeTeam:  this._homeTeam,
   awayTeam:  this._awayTeam,
   competition: this._competition,
   venue:    this._venue,
   date:    this._date,
   referees:  [...this._referees],
   broadcast:  [...this._broadcast],
   vipTickets: this._vipTickets,
   weather:   this._weather,
   createdAt:  Date.now(),
  }
 }
}

// Champions League Final : tout est configuré
const ucl = new MatchBuilder()
 .homeTeam("Real Madrid")
 .awayTeam("Man City")
 .competition("Champions League")
 .venue("Wembley", "London")
 .date("2026-06-01")
 .addReferee("Björn Kuipers", "main")
 .addReferee("Sander van Roekel", "assistant")
 .addBroadcast("Canal+", "France")
 .addBroadcast("BT Sport", "UK")
 .vipTickets(5000)
 .weather("clear")
 .build()

// Match amical : minimum vital
const friendly = new MatchBuilder()
 .homeTeam("PSG")
 .awayTeam("Lyon")
 .build()
```

---

## 4) DIRECTOR : ENCAPSULER LES RECETTES

Le Director est une couche au-dessus du Builder qui encode des configurations courantes.
Tu appelles une recette, pas chaque étape.

```js
class MatchDirector {
 constructor(builder) {
  this.builder = builder
 }

 // recette : finale de Coupe du Monde
 buildWorldCupFinal(home, away, venue) {
  return this.builder
   .homeTeam(home)
   .awayTeam(away)
   .competition("FIFA World Cup Final")
   .venue(venue.stadium, venue.city)
   .addReferee("Désigné par la FIFA", "main")
   .vipTickets(15000)
   .build()
 }

 // recette : match de préparation minimal
 buildFriendly(home, away) {
  return this.builder
   .homeTeam(home)
   .awayTeam(away)
   .competition("International Friendly")
   .build()
 }
}

const director = new MatchDirector(new MatchBuilder())

const wcFinal = director.buildWorldCupFinal(
 "France",
 "Brésil",
 { stadium: "Lusail Stadium", city: "Doha" }
)
```

```
MatchDirector
   |
   +--> buildWorldCupFinal() --> MatchBuilder configuré --> .build() --> objet match
   |
   +--> buildFriendly()    --> MatchBuilder minimal  --> .build() --> objet match
```

Le Director encode le "comment". Le Builder encode le "quoi". Le `.build()` produit le résultat.

---

## 5) CAS QUI CASSE

```js
// piège : construire l'objet avant .build()
const b = new MatchBuilder()
b.homeTeam("PSG")
const prematuredMatch = { homeTeam: b._homeTeam } // accès direct aux internals
// _awayTeam est null : on a un objet invalide
// la validation de .build() n'a jamais tourné

// toujours passer par .build() : c'est lui qui valide et produit
```

```js
// piège : réutiliser un builder sans le réinitialiser
const b = new MatchBuilder()

const match1 = b.homeTeam("PSG").awayTeam("Lyon").build()
// ici b._homeTeam vaut encore "PSG"
const match2 = b.awayTeam("Monaco").build()
// match2 a homeTeam "PSG" parce que tu as réutilisé le même builder !

// si tu veux réutiliser : crée un nouveau builder
const match2 = new MatchBuilder().homeTeam("OL").awayTeam("Monaco").build()
```

---

## 6) BUILDER VS FACTORY : QUAND CHOISIR QUOI

```
Factory   --> objet simple, logique de création cachée, type déterminé à la création
Builder   --> objet complexe, configuration optionnelle, validation en fin de chaîne

Factory : "donne-moi un Titan de type Colossal"
Builder : "crée-moi un match avec ces équipes, cette compétition, ces arbitres, cette météo, et ces options de diffusion"
```

Si l'objet a plus de 3 paramètres optionnels : c'est probablement un Builder.
Si l'objet a une logique de création complexe mais peu d'options : c'est probablement une Factory.

---

## EXERCICES

## EXO 1 : LE JUTSU BUILDER

Dans Naruto, un jutsu a beaucoup de composants : nom, type (`ninjutsu`, `genjutsu`, `taijutsu`), coût en chakra, dégâts, portée, temps de chargement, effets secondaires (optionnels).

Crée un `JutsuBuilder` (class ou function, ton choix) avec :
- chaque propriété configurable par une méthode dédiée
- `.build()` qui valide que `name`, `type`, et `chakraCost` sont présents, et retourne un objet figé (Object.freeze)
- `techniques` peut être ajoutée plusieurs fois avec `.addEffect()`
- Si `chakraCost` est 0 et `damages` est supérieur à 1000 : throw (jutsu trop puissant sans coût, ça sent le cheat)

Crée : le Rasengan, le Chidori, et un genjutsu minimal.

---

## EXO 2 : LE PROFIL D'ÉCOUTE

SZA sort un album. Chaque auditeur a un profil d'écoute avec des préférences, un historique, des playlists sauvegardées, et des paramètres audio.

Crée un `ListenerProfileBuilder` avec :
- `.name(n)` obligatoire
- `.genre(...genres)` ajoutable plusieurs fois
- `.audioQuality(q)` parmi `"low"`, `"medium"`, `"high"`, `"lossless"` (default "medium")
- `.addFavorite(artist)` ajoutable plusieurs fois
- `.notification(bool)` pour activer/désactiver les notifs
- `.build()` qui valide le nom et retourne un profil complet

---

## EXO 3 : LE DIRECTOR DES MISSIONS

Dans Garo Honoo no Kokuin, il y a trois types de missions récurrentes :
- mission d'urgence : un seul Chevalier, délai max 99.9s, aucune préparation
- patrouille standard : deux Chevaliers, délai étendu, zone définie
- mission de conseil : escorte d'un Makai Alchemist, plusieurs Chevaliers, streaming vers le Conseil

Crée un `MissionBuilder` et un `MissionDirector` qui encapsule ces trois recettes.
Le Director prend le Builder en paramètre (injection, pas instanciation interne).
Chaque recette prend les paramètres spécifiques à son type et retourne un objet mission complet.

---

## EXO 4 : LE PIÈGE DU BUILDER RÉUTILISÉ

Voici du code bugué :

```js
const b = new PersonBuilder()

const alice = b.name("Alice").age(28).role("admin").build()
const bob  = b.name("Bob").build()

console.log(bob.role) // ???
console.log(bob.age) // ???
```

Sans exécuter le code : prédit ce que `bob.role` et `bob.age` vont retourner si le builder n'est pas réinitialisé entre les deux `.build()`.
Puis modifie le `PersonBuilder` pour que `.build()` réinitialise l'état interne automatiquement après chaque construction.
(Avantage et inconvénient de cette approche : explique les deux en 2 phrases)

---

## RÉSUMÉ

Le Builder construit des objets complexes étape par étape, chaque étape nommée et optionnelle.
Le chaînage fluent (`return this`) rend la configuration lisible : on voit ce qu'on configure, pas des positions dans une liste de paramètres.
`.build()` est le seul point de validation : c'est lui qui garantit que l'objet produit est cohérent.
Le Director encapsule les configurations courantes : tu appelles une recette, pas chaque étape.
Règle simple : si ton constructeur dépasse 3 paramètres optionnels, le Builder est la bonne réponse.
