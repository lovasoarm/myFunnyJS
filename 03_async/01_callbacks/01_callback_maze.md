---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LE LABYRINTHE DU CALLBACK
Temps de lecture ~8 min

Avant les Promises. Avant async/await. Il y avait les callbacks.
Et tout le monde s'y est perdu exactement de la même façon.

Ce chapitre existe pour deux raisons : comprendre pourquoi JS a évolué, et lire du code legacy sans paniquer. Du code avec des callbacks existe encore partout en prod : Node.js, des librairies historiques, des APIs tierces. T'as pas le choix de les comprendre.

---

## 1) UN CALLBACK, C'EST QUOI

Une fonction passée à une autre fonction, pour être appelée plus tard.

```js
// exemple minimal
function direBonjour(nom, callback) {
 const message = "Salut " + nom
 callback(message) // on appelle la fonction qu'on a reçue
}

direBonjour("Naruto", function(msg) {
 console.log(msg) // "Salut Naruto"
})
```

C'est tout. Pas de magie. Tu passes une fonction, elle est exécutée au bon moment.

Le truc : JavaScript est single-threaded. Une seule chose à la fois. Quand t'as une opération lente : lire un fichier, faire une requête HTTP, attendre une réponse : tu peux pas juste bloquer et attendre. T'as besoin de dire au runtime : *fais ça, et quand c'est fini, appelle cette fonction*.

```js
// sans callback : t'es bloqué
const data = lireFichier("stats.json") // tout s'arrête ici jusqu'à la fin
afficher(data)

// avec callback : JS continue de tourner
lireFichier("stats.json", function(data) {
 // cette fonction est appelée quand le fichier est prêt
 afficher(data)
})
// ce code s'exécute PENDANT que le fichier se lit
faireAutreChose()
```

---

## 2) L'ERREUR EN PREMIER : error-first callbacks

Convention Node.js. Toutes les librairies Node respectent ça : **le premier argument du callback est toujours une erreur**.

```js
const fs = require("fs")

fs.readFile("mission.txt", "utf8", function(err, data) {
 // err : null si tout va bien, une Error si ça a merdé
 // data : le contenu du fichier si tout va bien

 if (err) {
  console.error("Fichier introuvable :", err.message)
  return // sortir immédiatement : ne pas continuer avec data = undefined
 }

 console.log("Mission :", data)
})
```

Le `return` après le `if (err)` est critique. Beaucoup de bugs viennent de l'absence de ce return : le code continue et utilise `data` qui vaut `undefined`.

```js
// BUG CLASSIQUE : pas de return après l'erreur
fs.readFile("mission.txt", "utf8", function(err, data) {
 if (err) {
  console.error("Erreur :", err.message)
  // pas de return : le code continue
 }
 console.log(data.toUpperCase()) // TypeError: Cannot read properties of undefined
})
```

---

## 3) CALLBACK HELL : ENTRER EST FACILE

Une opération async. Simple.

```js
obtenirJoueur(id, function(err, joueur) {
 if (err) return gererErreur(err)
 console.log(joueur)
})
```

Deux opérations en séquence : déjà moins propre.

```js
obtenirJoueur(id, function(err, joueur) {
 if (err) return gererErreur(err)

 obtenirClub(joueur.clubId, function(err, club) {
  if (err) return gererErreur(err)
  console.log(joueur.nom, "joue au", club.nom)
 })
})
```

Trois opérations. Tu commences à sentir que quelque chose ne va pas.

```js
obtenirJoueur(id, function(err, joueur) {
 if (err) return gererErreur(err)

 obtenirClub(joueur.clubId, function(err, club) {
  if (err) return gererErreur(err)

  obtenirStadium(club.stadiumId, function(err, stadium) {
   if (err) return gererErreur(err)

   console.log(joueur.nom, "joue à", stadium.nom)
  })
 })
})
```

Quatre. La pyramide de la mort est là.

```js
obtenirJoueur(id, function(err, joueur) {
 if (err) return gererErreur(err)

 obtenirClub(joueur.clubId, function(err, club) {
  if (err) return gererErreur(err)

  obtenirStadium(club.stadiumId, function(err, stadium) {
   if (err) return gererErreur(err)

   obtenirCapacite(stadium.id, function(err, capacite) {
    if (err) return gererErreur(err)

    // t'es à 4 niveaux d'indentation
    // et on a pas encore géré les cas limites
    console.log(joueur.nom, "dans un stade de", capacite, "places")
   })
  })
 })
})
```

C'est le callback hell. Pas un problème esthétique : un problème de maintenance. Tu peux plus lire ce code rapidement. Tu peux plus l'isoler. Tu peux plus le tester proprement.

---

## 4) SORTIR DU LABYRINTHE : sans Promises

La solution immédiate : **nommer les fonctions** et les sortir du callback.

```js
// avant : tout imbriqué
obtenirJoueur(id, function(err, joueur) {
 obtenirClub(joueur.clubId, function(err, club) {
  afficher(joueur, club)
 })
})

// après : fonctions nommées, séquence lisible
function surClubRecu(err, club) {
 if (err) return gererErreur(err)
 afficher(joueurEnMemoire, club)
}

function surJoueurRecu(err, joueur) {
 if (err) return gererErreur(err)
 joueurEnMemoire = joueur
 obtenirClub(joueur.clubId, surClubRecu)
}

obtenirJoueur(id, surJoueurRecu)
```

C'est mieux. Mais t'as maintenant des variables partagées entre les fonctions : `joueurEnMemoire` -> ce qui crée d'autres problèmes. C'est pour ça qu'on a inventé les Promises.

---

## 5) INVERSION OF CONTROL : le vrai problème des callbacks

Y'a un problème plus profond que l'imbrication.

Quand tu passes un callback à une fonction tierce, tu lui confies le contrôle. C'est elle qui décide quand appeler ton code. Combien de fois. Avec quels arguments.

```js
// tu passes ton callback à une librairie tierce
bibliothequeExterne.charger(options, function(err, resultat) {
 // cette librairie peut :
 // - appeler ton callback 0 fois (bug silencieux)
 // - l'appeler 2 fois (double traitement)
 // - l'appeler avec des arguments dans le mauvais ordre
 // - ne jamais l'appeler si une exception est levée
 traiterResultat(resultat)
})
```

T'as aucune garantie. T'as abandonné le contrôle.

C'est ce qu'on appelle l'**inversion of control** : tu donnes le pouvoir à quelqu'un d'autre. Les Promises récupèrent ce contrôle : elles garantissent qu'un résultat est résolu une seule fois, et soit en succès, soit en erreur.

---

## EXERCICES

## EXO 1 : LE RAPPORT DE MATCH

L'API du stade est ancienne. Elle utilise des callbacks. Tu dois récupérer les stats d'un match en 3 étapes séquentielles :

1. `obtenirMatch(matchId, callback)` : retourne `{ id, equipe1Id, equipe2Id }`
2. `obtenirEquipe(equipeId, callback)` : retourne `{ id, nom, joueurs }`
3. `calculerMVP(equipe1, equipe2, callback)` : retourne `{ nom, buts, passes }`

Implémente la séquence complète avec gestion d'erreur error-first sur chaque étape. Le rapport final affiche : `"MVP du match : [nom] - [buts] buts, [passes] passes"`.

(Simule les fonctions avec `setTimeout` pour reproduire le comportement async)

## EXO 2 : LE PARALLEL LOADER

Tu veux charger les stats de 3 joueurs en même temps : pas l'un après l'autre. Si t'attends en séquence, ça prend 3x plus longtemps.

```js
// pseudo-API disponible
obtenirStats(joueurId, callback) // callback(err, stats)
```

Lance les 3 appels en parallèle. Quand les 3 sont finis, affiche le classement par nombre de buts.

Contrainte : pas de librairie externe. Juste des callbacks et un compteur.

(Indice : un compteur qui décremente à chaque callback reçu : quand il atteint 0, tout est arrivé)

## EXO 3 : L'ESCAPE ROOM

Ce code a 3 bugs. Trouve-les, nomme-les, corrige-les.

```js
function chargerProfil(userId, callback) {
 lireFichier("profils/" + userId + ".json", function(err, data) {
  if (err) {
   console.log("Erreur fichier")
  }
  const profil = JSON.parse(data)
  callback(profil)
 })
}

chargerProfil("kakashi", function(profil) {
 chargerProfil("naruto", function(profil) {
  console.log("Kakashi :", profil.nom)
  console.log("Naruto :", profil.nom)
 })
})
```

---

## RÉSUMÉ

Un callback c'est une fonction passée à une autre pour être appelée plus tard. La convention error-first est non négociable en Node : le premier argument est toujours l'erreur. Le callback hell naît de l'imbrication en séquence : la solution courte est de nommer les fonctions, la vraie solution c'est les Promises. Le problème fondamental des callbacks c'est l'inversion of control : tu cèdes le contrôle à du code extérieur, sans garantie sur quand ni combien de fois ton code sera appelé.
