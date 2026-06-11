# DÉCOMPOSER UN PROBLÈME

Un dev junior reçoit un problème et commence à coder.
Un dev senior reçoit un problème et commence à le couper.

La décomposition c'est pas une étape optionnelle avant le vrai travail.
C'est le vrai travail. Le code qui vient après, c'est juste la traduction.

Si tu décomposes mal, ton code sera structuré autour d'une mauvaise compréhension du problème.
Et refactorer une mauvaise compréhension, c'est plus dur que refactorer du mauvais code.

---

## 1) UN SYSTÈME C'EST QUOI

Un système c'est un ensemble de pièces qui collaborent pour produire un comportement.

Le piège : on voit le comportement. On ne voit pas les pièces.

```
comportement visible    :  "l'utilisateur vote pour Mbappé et le classement se met à jour"

pièces cachées          :  recevoir le vote
                           valider le vote (pas deux fois le même votant)
                           mettre à jour le score
                           recalculer le classement
                           notifier les abonnés
```

Ces pièces ne sont pas évidentes dans l'énoncé. C'est toi qui les fais apparaître.

---

## 2) LA RÈGLE DES RESPONSABILITÉS UNIQUES

Chaque pièce fait une chose. Une seule.

Pas "une chose simple". Une chose **précise**.

```
// mauvais : cette fonction fait trop
function handleVote(userId, playerId) {
  // valide l'utilisateur
  // enregistre le vote en DB
  // recalcule le classement
  // envoie une notif email
  // retourne le nouveau classement
}

// correct : chaque responsabilité est isolée
function validateVoter(userId) { ... }
function registerVote(userId, playerId) { ... }
function recalculateRanking(votes) { ... }
function notifySubscribers(ranking) { ... }
```

Le test : si tu dois écrire "et" pour décrire ce que fait une fonction, elle fait trop.

`validateVoter` : valide un votant. Pas de "et".
`handleVote` : valide, enregistre, calcule, notifie. Quatre "et". Quatre responsabilités à séparer.

---

## 3) COUPER PAR DOMAINE, PAS PAR TECHNIQUE

Le piège classique : découper selon la technique.

```
// découpage technique (mauvais)
database/
  queries.js
utils/
  helpers.js
controllers/
  everything.js
```

Tout le monde fait ça. Ça donne des fichiers `helpers.js` de 800 lignes où personne ne sait ce qui appartient à quoi.

Découper par **domaine** : regrouper ce qui change ensemble.

```
// découpage domaine (correct)
votes/
  validate.js       // tout ce qui concerne la validation d'un vote
  register.js       // tout ce qui concerne l'enregistrement
  ranking.js        // tout ce qui concerne le calcul du classement

notifications/
  email.js
  realtime.js
```

La règle : si tu changes la logique de vote, tu touches `votes/`. Pas `utils/helpers.js` et `controllers/everything.js` en même temps.

---

## 4) LA TECHNIQUE DU "ET SI"

Pour trouver les pièces cachées d'un système, pose des questions "et si".

Exemple : *"l'utilisateur vote pour son joueur préféré"*

```
et si l'utilisateur vote deux fois ?
et si le joueur n'existe pas ?
et si la période de vote est fermée ?
et si deux votes arrivent en même temps ?
et si la DB est indisponible pendant l'enregistrement ?
```

Chaque "et si" révèle une pièce que ton système doit gérer.
Ceux qui ne posent pas ces questions codent la version qui marche dans le scénario idéal.
En prod, le scénario idéal arrive 30% du temps.

---

## 5) DIAGRAMME AVANT LE CODE

Avant d'écrire une ligne, dessine le flux.

Pas un diagramme UML avec des flèches dans tous les sens.
Un flux simple : entrée --> transformation --> sortie.

```
Exemple : système de vote Ballon d'Or

requête vote
    |
    v
validation votant --> [invalide] --> erreur 403
    |
  [valide]
    |
    v
enregistrement vote --> [échec DB] --> retry x3 --> erreur 500
    |
  [succès]
    |
    v
recalcul classement
    |
    v
notification abonnés
    |
    v
réponse 200 + nouveau classement
```

Ce diagramme te dit combien de fonctions tu vas écrire, dans quel ordre, et où les erreurs peuvent arriver.

Sans ce diagramme, tu codes dans le brouillard.

---

## 6) LES DEUX QUESTIONS À POSER AVANT DE CODER

Avant toute implémentation, deux questions :

**1. Qu'est-ce qui peut changer dans cette pièce ?**

Si la logique de validation peut changer (nouvelles règles métier), elle doit être isolée.
Si le format de la réponse peut changer, il doit être séparé du calcul.

**2. Qui a besoin de savoir que cette pièce existe ?**

Le moins de code possible doit connaître les détails d'une pièce.
Si tout le monde connaît tout le monde, changer une pièce casse tout le reste.

```
// tout le monde connaît les détails (mauvais)
const score = votes.filter(v => v.playerId === id).length * 10 + bonusPoints[id]
// ce calcul est dupliqué partout dans le code

// seul ranking.js connaît ce détail (correct)
const score = ranking.calculateScore(id, votes)
// le reste du code ne sait pas comment le score est calculé
```

---

## EXERCICES

## EXO 1 : autopsie du système de survie

Rick Grimes a un camp. Le camp a : des survivants, un inventaire de nourriture, des rondes de garde, et des alertes zombie.

Voilà l'énoncé qu'il te donne :
> "Le système doit gérer le camp"

Décompose ce système. Liste toutes les pièces, identifie leurs responsabilités, et dessine le flux entre elles. Pose au moins 5 questions "et si" qui révèlent des cas non couverts par l'énoncé.

---

## EXO 2 : trouver le "et"

Ce code existe en prod chez Walter White :

```js
function processShipment(shipmentId) {
  const shipment = db.getShipment(shipmentId)
  if (!shipment) throw new Error("not found")
  
  const route = graph.findShortestPath(shipment.origin, shipment.destination)
  shipment.route = route
  shipment.status = "routed"
  
  db.save(shipment)
  
  const cost = route.distance * shipment.weight * PRICE_PER_KM
  shipment.cost = cost
  
  db.save(shipment)
  email.send(shipment.supplier, `Livraison confirmée : ${cost}€`)
  
  return shipment
}
```

Identifie toutes les responsabilités mélangées. Propose une décomposition propre avec des fonctions qui ne contiennent pas de "et".

---

## EXO 3 : découpage domaine

T'as un projet : une plateforme de radio trapsoul (SZA, Bryson Tiller).

Fonctionnalités : jouer une track, gérer une playlist, afficher les paroles, recommander des tracks similaires, gérer l'abonnement premium.

Propose un découpage par domaine. Justifie pourquoi tu mets chaque fichier là où tu le mets.
(Indice : si deux features changent toujours en même temps, elles appartiennent peut-être au même domaine)

---

## RÉSUMÉ

Décomposer c'est rendre visible ce que l'énoncé cache.

Chaque pièce fait une chose précise. Le test : si tu écris "et" pour la décrire, elle fait trop.

On découpe par domaine, pas par technique. Ce qui change ensemble reste ensemble.

Le diagramme de flux avant le code. Les questions "et si" avant le diagramme.

Un développeur qui sait décomposer peut travailler sur n'importe quel système, même inconnu.
Un développeur qui ne sait pas décomposer réécrit le même code spaghetti dans chaque projet.
