---
stability: intemporel
---

# CONCEVOIR POUR CE QUI VA CHANGER
Temps de lecture ~9 min

Le code que tu écris aujourd'hui va être modifié.

Pas peut-être. Certainement. Les specs vont changer. Les besoins vont évoluer. Ce qui est vrai aujourd'hui sera différent dans 6 semaines. Le seul code qui ne change jamais, c'est le code mort.

La question : est-ce que ton architecture résiste aux changements prévisibles sans tout exploser ?

---

## 1) LA DISTINCTION STABLE / VOLATILE

Tout système a des parties qui changent souvent et des parties qui changent rarement.

**Stable** : la logique fondamentale du domaine. Les règles métier de base.
**Volatile** : les détails d'implémentation. Les APIs externes. Les formats de données. Les règles business qui évoluent.

```
Système de combat de ninjas

Stable  : un ninja a du chakra -- il peut lancer des jutsus -- les dégâts sont calculés
Volatile : les formules de calcul des dégâts (équilibrage)
      les jutsus disponibles (nouveau personnage = nouveaux jutsus)
      le format de sauvegarde (JSON aujourd'hui, DB demain)
      les règles de tournoi (modes de jeu différents)
```

La règle : **mettre ce qui est volatile derrière une frontière**. Le coeur stable ne doit jamais dépendre directement des détails volatils.

---

## 2) LE PRINCIPE OCP EN PRATIQUE

Open for extension, closed for modification.

Pas de philosophie : en pratique, ça veut dire que quand une règle change, tu ajoutes du code au lieu de modifier ce qui existe.

```js
// Mauvais : la logique de dégâts est hardcodée dans CombatLoop
// chaque nouveau jutsu = modifier CombatLoop = risque de régresser les autres jutsus

function calculerDegats(jutsu, cible) {
 if (jutsu === "rasengan") return cible.chakra - 50
 if (jutsu === "chidori") return cible.chakra - 60
 if (jutsu === "susanoo") return cible.chakra - 80
 // nouveau jutsu : on MODIFIE cette fonction
}

// ---

// Correct : chaque jutsu définit ses propres dégâts
// nouveau jutsu = ajouter une entrée dans la map, rien d'autre ne change

const jutsus = {
 rasengan : { degats: (cible) => cible.chakra - 50 },
 chidori : { degats: (cible) => cible.chakra - 60 },
 susanoo : { degats: (cible) => cible.chakra - 80 },
 // nouveau jutsu : on AJOUTE ici sans toucher au reste
}

function calculerDegats(nomJutsu, cible) {
 return jutsus[nomJutsu].degats(cible)
}
```

Le test : si tu ajoutes une feature sans modifier le code existant, ton architecture est ouverte à l'extension.

---

## 3) LES POINTS DE VARIABILITÉ

Un point de variabilité : un endroit dans ton système où le comportement va probablement changer.

Stratégie : identifier ces points en avance et les isoler derrière une interface.

```
Système de radio (trapsoul_radio)

Points de variabilité identifiés :
1. Source audio : fichier local aujourd'hui, streaming externe demain
2. Format de playlist : JSON aujourd'hui, API GraphQL demain
3. Système de recommandation : aléatoire aujourd'hui, ML demain
4. Stockage des préférences shinobi : localStorage aujourd'hui, compte cloud demain

Isolation :

interface AudioSource {
 getTrack(id: string): Promise<Track>
 getNextTrack(current: Track): Promise<Track>
}

// Implémentation aujourd'hui :
class LocalAudioSource implements AudioSource { ... }

// Implémentation demain :
class StreamingAudioSource implements AudioSource { ... }

// CombatLoop ne connaît que AudioSource
// il ne sait pas et n'a pas besoin de savoir si c'est local ou streaming
```

---

## 4) L'ANTI-PATTERN : CODER POUR AUJOURD'HUI SEULEMENT

```js
// Contexte : les ultras du dashboard veulent voir les stats de Ligue 1 seulement

// Mauvais : hardcodé pour Ligue 1
function fetchMatchStats() {
 return fetch("https://api.ligue1.fr/matches")
}

// 3 semaines plus tard : "on ajoute la Premier League et la Bundesliga"
// résultat : refactoring complet, tests à réécrire, risque de régression

// ---

// Correct : paramétré dès le départ pour ce qui va visiblement changer

function fetchMatchStats(league: League) {
 return fetch(league.apiUrl)
}

// 3 semaines plus tard : on ajoute un objet League pour la Premier League
// résultat : 5 lignes de code, zéro régression
```

YAGNI (You Aren't Gonna Need It) s'applique aux features complètes. Pas aux points de variabilité évidents. Rendre les routes paramétrables quand il y a déjà deux ligues en discussion : c'est pas de l'over-engineering, c'est de la lecture du contexte.

---

## 5) LES COUCHES D'ABSTRACTION COMME BOUCLIERS

Quand une API externe change (et elle changera), est-ce que ça casse tout ton système ou juste un adaptateur ?

```
// Sans couche d'abstraction : l'API Sentry est dans tout le code
// Sentry change son SDK : tu modifies 30 fichiers

logger.captureException(err)      // dans combatLoop.js
Sentry.addBreadcrumb({ ... })     // dans jutsusEngine.js
Sentry.setUser({ id: ninja.id })    // dans authModule.js

// ---

// Avec couche d'abstraction : un seul adaptateur
// Sentry change : tu modifies un seul fichier

// monitoring.js -- l'adaptateur
export const monitoring = {
 captureError: (err) => Sentry.captureException(err),
 addContext: (ctx) => Sentry.addBreadcrumb(ctx),
 setUser: (user) => Sentry.setUser(user)
}

// partout ailleurs dans le code :
import { monitoring } from "./monitoring"
monitoring.captureError(err)   // le reste du code ne sait pas que c'est Sentry
```

Si Datadog remplace Sentry demain : tu modifies `monitoring.js`. Une seule fois.

---

## 6) CONCEVOIR LES FRONTIÈRES EN PREMIER

Avant de coder une feature, tu dessines ses frontières.

```
Feature : système de notification du Conseil de Surveillance (garo_no_kronika)

Frontière de la notification :
 entrée : CombatEvent (résultat d'un combat, quel qu'il soit)
 sortie : void (la notification est envoyée, le système de combat s'en fout du résultat)
 contrat : le système de combat ne sait pas comment la notification est envoyée
      (email, SSE, WebSocket, Slack : ça change pas le contrat)

Ce qui peut changer sans toucher au système de combat :
 - le canal de notification (SSE aujourd'hui, WebSocket demain)
 - le format du message (JSON, XML, proto)
 - les destinataires (Conseil, Chevaliers, logs)

Ce qui ne peut pas changer sans toucher au système de combat :
 - la structure de CombatEvent (c'est le contrat, donc c'est stable)
```

---

## EXERCICES

## EXO 1 : Identifier le stable et le volatile

Pour chaque système, identifie 3 éléments stables et 3 éléments volatils :

**Système A** : le pipeline de vote du Ballon d'Or
**Système B** : l'API de Fox River (prison_break_api)
**Système C** : le système de camp de Rick Grimes

---

## EXO 2 : Refactorer pour l'extension

Voici une fonction du système d'évasion de Michael Scofield :

```js
function validerCheckpoint(checkpoint, prisonnier) {
 if (checkpoint.type === "grille") {
  return prisonnier.outilsTunnel.includes("pince")
 }
 if (checkpoint.type === "garde") {
  return prisonnier.déguisements.includes("uniforme")
 }
 if (checkpoint.type === "alarme") {
  return prisonnier.compétences.includes("électronique")
 }
 return false
}
```

Refactore cette fonction pour qu'ajouter un nouveau type de checkpoint ne nécessite pas de modifier `validerCheckpoint`.

---

## EXO 3 : La frontière de l'API externe

Le dashboard des ultras utilise directement l'API Sportradar dans 8 composants différents.

Sportradar change son format de réponse (du JSON au Protobuf) dans 2 semaines.

Dessine l'architecture d'un adaptateur qui limite l'impact de ce changement à un seul fichier. Identifie le contrat de l'adaptateur (entrée, sortie). Montre comment deux composants l'utiliseraient.

---

## RÉSUMÉ

Le code qui ne change jamais, c'est le code mort. Identifier le stable et le volatile avant de coder : c'est la base. Les points de variabilité se mettent derrière des interfaces. OCP en pratique : ajouter du code au lieu de modifier ce qui marche. Les dépendances externes (APIs, SDKs) : toujours derrière un adaptateur. Si un changement externe casse plus d'un fichier : l'architecture a une faille.
