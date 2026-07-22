---
stability: intemporel
---

# CODE SMELLS
Temps de lecture ~8 min
Un code smell, c'est pas un bug. Ça compile, ça tourne, les tests passent (s'il y en a).
Mais ça pue. Et ce qui pue aujourd'hui devient l'incendie de demain.
Avantage : repérer un smell tôt = refacto en 10 minutes. Inconvénient : ignoré 6 mois = refacto de 3 jours, en sueur, sans filet.

---

## 1) GOD CLASS : LA CLASSE QUI VEUT TOUT CONTRÔLER

Une god class, c'est une classe qui connaît tout, fait tout, et que personne n'ose toucher.

```js
// la classe qui gère TOUT le camp de Rick Grimes
class CampManager {
 constructor() {
  this.survivors = []
  this.inventory = []
  this.guardSchedule = []
  this.threatLevel = 0
 }

 addSurvivor(name) { this.survivors.push(name) }
 removeSurvivor(name) { this.survivors = this.survivors.filter(s => s !== name) }
 addItem(item) { this.inventory.push(item) }
 consumeRation(amount) { /* ... */ }
 assignGuard(survivor, slot) { /* ... */ }
 rotateGuards() { /* ... */ }
 detectThreat(zombieCount) { this.threatLevel = zombieCount }
 raiseAlarm() { /* ... */ }
 sendRadioMessage(msg) { /* ... */ }
 saveToDisk() { /* ... */ }
}
```

`CampManager` gère les survivants, l'inventaire, les gardes, les menaces, la radio, et la persistance. Touche une seule méthode, et tu prends le risque de casser les 5 autres responsabilités qui vivent dans la même classe.

```
CampManager (700 lignes)
 --> survivants
 --> inventaire
 --> gardes
 --> menaces
 --> radio
 --> sauvegarde
```

Le fix : éclater en plusieurs classes (`SurvivorRegistry`, `InventoryManager`, `GuardScheduler`, `ThreatMonitor`...), chacune avec sa propre raison de changer (cf SRP du chapitre précédent).

---

## 2) FEATURE ENVY : LA FONCTION QUI ENVIE LES DONNÉES D'UN AUTRE

Feature envy, c'est quand une fonction passe plus de temps à fouiller dans les données d'un autre objet que dans les siennes.

```js
// PlayerCard n'a presque pas de données propres : tout vient de match
class PlayerCard {
 renderRating(match) {
  const total = match.stats.goals * 4 + match.stats.assists * 3 + match.stats.passes * 0.1
  const normalized = total / match.minutesPlayed
  return normalized > 8 ? 'MVP' : normalized > 5 ? 'Solide' : 'Discret'
 }
}
```

`PlayerCard` calcule une note entière à partir des données de `match`. Si la formule change, c'est `PlayerCard` qui doit changer, alors que la logique appartient vraiment à `match`.

```js
// le calcul vit avec les données qu'il utilise
class MatchStats {
 calculateRating() {
  const total = this.goals * 4 + this.assists * 3 + this.passes * 0.1
  return total / this.minutesPlayed
 }
}

class PlayerCard {
 renderRating(matchStats) {
  const rating = matchStats.calculateRating()
  return rating > 8 ? 'MVP' : rating > 5 ? 'Solide' : 'Discret'
 }
}
```

Règle simple pour repérer une feature envy : si une méthode utilise `objetB.x`, `objetB.y`, `objetB.z` plus que ses propres données, cette méthode devrait probablement vivre dans `objetB`.

---

## 3) LONG METHOD : LA FONCTION-FLEUVE

Une long method, c'est une fonction qui fait 10 choses, avec 5 niveaux d'indentation, et que tu dois lire en entier pour comprendre le moindre bout.

```js
// extrait du Oracle Glitch v1 : validation LLM en 1 seul bloc géant
function validateLLMOutput(raw) {
 let parsed
 try {
  parsed = JSON.parse(raw)
 } catch (e) {
  return { valid: false, reason: 'json invalide' }
 }
 if (!parsed.suggestions) {
  return { valid: false, reason: 'pas de suggestions' }
 }
 for (const s of parsed.suggestions) {
  if (!s.file || !s.line || !s.fix) {
   return { valid: false, reason: 'suggestion incomplète' }
  }
  if (typeof s.line !== 'number' || s.line < 0) {
   return { valid: false, reason: 'ligne invalide' }
  }
  if (s.fix.length > 500) {
   return { valid: false, reason: 'fix trop long, suspect' }
  }
 }
 if (parsed.confidence && (parsed.confidence < 0 || parsed.confidence > 1)) {
  return { valid: false, reason: 'confidence hors limites' }
 }
 return { valid: true, data: parsed }
}
```

40 lignes, 4 responsabilités cachées : parser le JSON, valider la structure globale, valider chaque suggestion, valider la confidence.

```js
// découpé : chaque étape de validation a son nom
function parseJson(raw) {
 try {
  return { ok: true, data: JSON.parse(raw) }
 } catch {
  return { ok: false, reason: 'json invalide' }
 }
}

function validateSuggestion(suggestion) {
 if (!suggestion.file || !suggestion.line || !suggestion.fix) return 'suggestion incomplète'
 if (typeof suggestion.line !== 'number' || suggestion.line < 0) return 'ligne invalide'
 if (suggestion.fix.length > 500) return 'fix trop long, suspect'
 return null
}

function validateConfidence(confidence) {
 if (confidence == null) return null
 if (confidence < 0 || confidence > 1) return 'confidence hors limites'
 return null
}

function validateLLMOutput(raw) {
 const parsedResult = parseJson(raw)
 if (!parsedResult.ok) return { valid: false, reason: parsedResult.reason }

 const { data } = parsedResult
 if (!data.suggestions) return { valid: false, reason: 'pas de suggestions' }

 for (const suggestion of data.suggestions) {
  const error = validateSuggestion(suggestion)
  if (error) return { valid: false, reason: error }
 }

 const confidenceError = validateConfidence(data.confidence)
 if (confidenceError) return { valid: false, reason: confidenceError }

 return { valid: true, data }
}
```

`validateLLMOutput` raconte maintenant l'histoire complète en 12 lignes, et chaque détail est isolé, testable, remplaçable.

---

## 4) BONUS : DUPLICATION ET MAGIC NUMBERS

Deux smells rapides qui traînent partout :

```js
// duplication : la même règle écrite 3 fois, 3 risques de divergence
function canVoteBallonDor(journalist) {
 return journalist.accreditedYears >= 3 && journalist.country !== 'banned'
}

function canModerateVotes(journalist) {
 return journalist.accreditedYears >= 3 && journalist.country !== 'banned' && journalist.role === 'admin'
}
```

```js
// extraction : une seule source de vérité
function isAccreditedJournalist(journalist) {
 return journalist.accreditedYears >= 3 && journalist.country !== 'banned'
}

function canVoteBallonDor(journalist) {
 return isAccreditedJournalist(journalist)
}

function canModerateVotes(journalist) {
 return isAccreditedJournalist(journalist) && journalist.role === 'admin'
}
```

```js
// magic numbers : 99.9, ça veut dire quoi ?
if (fightDuration > 99.9) collapseArmor()

// nommé : maintenant ça raconte une histoire
const ARMOR_COLLAPSE_THRESHOLD_SECONDS = 99.9
if (fightDuration > ARMOR_COLLAPSE_THRESHOLD_SECONDS) collapseArmor()
```

---

## EXERCICES

## EXO 1 : nomme le smell
Pour chaque extrait, identifie le smell (god class / feature envy / long method / duplication / magic number) :

```js
// A
const interest = balance * 0.0825 // ???

// B
class OracleGlitch {
 analyzeCode() {}
 generateTests() {}
 sendSlackNotification() {}
 trainModel() {}
 manageUserAuth() {}
}
```

## EXO 2 : feature envy sur le dashboard Ultras
Une classe `AlertBanner` calcule si une alerte doit être rouge, orange ou verte en lisant directement `match.stats.errorRate`, `match.stats.latency`, `match.stats.activeUsers`.

Mission : propose où devrait vivre cette logique de calcul de couleur, et donne le nom de la méthode + sa classe d'accueil (pas besoin du code complet).

## EXO 3 : démonte la long method
Voici une fonction `processGuardRotation(camp)` (du Walking Dead Protocol) qui : vérifie les survivants disponibles, calcule les créneaux, attribue les postes, et envoie une alerte si un poste reste vide.

Mission : liste les 3-4 sous-fonctions que tu créerais, avec un nom clair pour chacune.

---

## RÉSUMÉ
Un code smell ne casse rien aujourd'hui, c'est pour ça qu'on l'ignore. Mais god class, feature envy, long method, duplication et magic numbers sont des signaux d'alarme silencieux. Plus tu les laisses traîner, plus le refacto coûte cher. Apprendre à les sentir, c'est apprendre à payer la dette en petite monnaie au lieu d'un crash boursier.
