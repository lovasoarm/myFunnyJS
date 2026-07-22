---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# MICROTASK MADNESS
Temps de lecture ~9 min

JS ne fait qu'une chose à la fois.
Mais il fait des choix sur l'ordre dans lequel il fait ces choses.
Ces choix ont des règles précises : et si tu les connais pas, ton code se comporte bizarrement sans que tu comprennes pourquoi.

Ce fichier t'apprend à prédire l'ordre d'exécution avant de lancer le code.
C'est ça, comprendre le moteur.

---

## 1) LE MOTEUR JS : UN SEUL THREAD, DEUX FILES D'ATTENTE

JS est single-threaded : une seule chose à la fois, pas de parallélisme natif.
Mais le moteur gère deux files d'attente avec des priorités différentes.

```
CALL STACK      MICROTASK QUEUE    MACROTASK QUEUE
(exécution)     (haute priorité)    (basse priorité)
-----------     ----------------    ---------------
code sync      Promise.then()     setTimeout()
           queueMicrotask()    setInterval()
           MutationObserver    setImmediate()
           await (résolution)   I/O callbacks
```

La règle d'or :

```
call stack vide --> vider toute la microtask queue --> prendre UNE macrotask --> recommencer
```

C'est ça l'event loop.

```
CALL STACK       WEB APIs / Node APIs    TASK QUEUES
----------       --------------------    -----------
| fn() | ---------> | fetch (réseau)  |     Microtask : [ resolvePromise() ]
| main()|       | setTimeout    | -------> Macrotask : [ setTimeout_cb() ]
----------       | fs.readFile   |     -----------
   ^         --------------------        |
   |                           |
   +-------------------- EVENT LOOP --------------------+
           (call stack vide ?
           oui -> microtask en premier,
               puis UNE macrotask,
               puis recommence)

Ordre de priorité : Microtask AVANT Macrotask, toujours.
Une Promise résolue passe devant un setTimeout(fn, 0), sans exception.
```

---

## 2) CALL STACK : LA PILE D'EXÉCUTION

Chaque appel de fonction empile une frame. Chaque `return` dépile.

```js
function tuer(villain) {
 return `${villain} est éliminé`
}

function mission(ninja) {
 const cible = "Pain"
 return tuer(cible)
 // tuer() est empilé par-dessus mission()
 // quand tuer() return, il est dépilé
 // mission() continue et return à son tour
}

mission("Naruto")
```

Visualisation de la pile :

```
APPEL :
[mission("Naruto")]  --> [tuer("Pain")]  --> return "Pain est éliminé"

DÉPILAGE :
tuer() sort --> mission() sort --> call stack vide
```

Quand la call stack est vide, l'event loop regarde les queues.
C'est là que le fun commence.

---

## 3) MICROTASK QUEUE : LA FILE VIP

Les microtasks passent avant tout le monde.
Une fois que la call stack est vide, l'event loop vide **toute** la microtask queue avant de toucher aux macrotasks.

Sources de microtasks :
- `Promise.then()` / `Promise.catch()` / `Promise.finally()`
- `await` (ce qui suit le `await` dans une async function)
- `queueMicrotask()`
- `MutationObserver`

```js
// Exemple 1 : prédis l'ordre avant de lire la réponse
console.log("A")

Promise.resolve().then(() => {
 console.log("B") // microtask
})

console.log("C")

// Ordre : A --> C --> B
// Pourquoi :
// A : code sync, exécuté immédiatement
// C : code sync, exécuté immédiatement
// B : microtask, exécuté APRES que tout le code sync est fini
```

---

## 4) LE TRUC QUI SURPREND TOUT LE MONDE

```js
// Exemple 2 : microtasks imbriquées
console.log("début")

Promise.resolve()
 .then(() => {
  console.log("microtask 1")
  // on planifie une nouvelle microtask depuis une microtask
  return Promise.resolve()
 })
 .then(() => {
  console.log("microtask 2")
 })

console.log("fin")

// Ordre : début --> fin --> microtask 1 --> microtask 2
```

Ce qui se passe dans le moteur :

```
1. code sync tourne    --> "début", "fin" sont affichés
2. call stack vide     --> event loop vérifie microtask queue
3. microtask 1 s'exécute  --> affiche "microtask 1", planifie microtask 2
4. microtask 2 planifiée  --> elle s'ajoute à la microtask queue
5. event loop continue   --> microtask 2 s'exécute
6. queue vide       --> event loop peut passer aux macrotasks
```

La microtask queue se vide entièrement avant que l'event loop passe à autre chose.
Si une microtask en planifie une autre : cette nouvelle s'exécute dans le même tour.

---

## 5) AWAIT : C'EST UNE MICROTASK DÉGUISÉE

`await` suspend la fonction async et reprend à la prochaine microtask.

```js
async function naruto() {
 console.log("Naruto commence")

 await Promise.resolve()
 // tout ce qui suit le await est une microtask

 console.log("Naruto finit son rasengan")
}

console.log("avant")
naruto()
console.log("après")

// Ordre : avant --> Naruto commence --> après --> Naruto finit son rasengan
```

Ligne par ligne :

```
"avant"          --> code sync
naruto() est appelée   --> entre dans la fonction
"Naruto commence"     --> code sync dans naruto()
await Promise.resolve()  --> suspend naruto(), sort de la fonction
"après"          --> code sync du dessus reprend
call stack vide      --> microtask queue : reprendre naruto()
"Naruto finit son rasengan" --> suite de naruto()
```

C'est pour ça que le code après `naruto()` s'exécute avant la suite de `naruto()`.
La fonction se met en pause, rend la main, reprend plus tard.

---

## 6) LE PIÈGE DU MICROTASK LOOP INFINI

Une microtask qui s'appelle elle-même bloque tout.

```js
// NE PAS FAIRE EN PROD
function blackHole() {
 Promise.resolve().then(blackHole)
 // planifie une microtask qui planifie une microtask qui planifie...
}

blackHole()
// les macrotasks ne tournent jamais
// setTimeout, setInterval, render : tout est bloqué
// le navigateur gèle
```

C'est le Susanoo de Sasuke sur l'event loop : il absorbe tout et ne laisse rien passer.

---

## EXERCICES

## EXO 1 : LE CLASSEMENT PROPHÉTIQUE

Donne l'ordre exact des logs avant d'exécuter ce code.
Chaque erreur de prédiction = une ligne que tu n'as pas comprise.

```js
console.log("1")

setTimeout(() => console.log("2"), 0)

Promise.resolve().then(() => console.log("3"))

console.log("4")

Promise.resolve()
 .then(() => {
  console.log("5")
  return Promise.resolve()
 })
 .then(() => console.log("6"))

setTimeout(() => console.log("7"), 0)
```

Écris l'ordre attendu, puis lance le code et compare.
Si tu t'es trompé : identifie exactement quelle règle tu as ratée.

(indice : les setTimeout vont dans la macrotask queue : ils passent APRÈS toutes les microtasks)

---

## EXO 2 : LA MISSION ASYNC DE SASUKE

```js
async function sasuke(jutsu) {
 console.log(`${jutsu} - début`)

 const resultat = await fetch_simulé(jutsu)

 console.log(`${jutsu} - résultat reçu : ${resultat}`)
 return resultat
}

function fetch_simulé(nom) {
 return Promise.resolve(`${nom} a réussi`)
}

console.log("Départ")
sasuke("Chidori")
sasuke("Amaterasu")
console.log("Missions lancées")
```

Question : dans quel ordre s'affichent les logs ?
Deuxième question : est-ce que "Missions lancées" apparaît avant ou après les résultats des deux jutsus ? Pourquoi ?

---

## EXO 3 : DÉBOGUER L'ORDRE CASSÉ

Ce code est censé afficher les étapes dans l'ordre 1 → 2 → 3 → 4.
Il ne le fait pas. Trouve pourquoi et corrige sans changer la logique métier.

```js
async function pipeline() {
 setTimeout(() => console.log("étape 4 : archivage"), 0)

 console.log("étape 1 : lancement")

 await Promise.resolve()
 console.log("étape 3 : traitement")

 Promise.resolve().then(() => console.log("étape 2 : validation"))
}

pipeline()
```

(indice : l'ordre des `await` et des `.then()` détermine la priorité)

---

## RÉSUMÉ

JS est mono-thread mais il a une file d'attente prioritaire pour les microtasks.
Quand la call stack est vide : toutes les microtasks tournent d'abord, puis une macrotask, puis retour aux microtasks.
`Promise.then()` et `await` créent des microtasks.
`setTimeout`, `setInterval` créent des macrotasks : ils passent toujours après.
Prédire l'ordre d'exécution sans lancer le code : c'est le vrai test de compréhension du moteur JS.


## Schéma : timeline complète

Code :
```js
console.log("A")
setTimeout(() => console.log("B"), 0)
Promise.resolve().then(() => console.log("C"))
queueMicrotask(() => console.log("D"))
Promise.resolve().then(() => console.log("E"))
console.log("F")
```

Timeline :
```
t=0 | STACK    | MICROTASK Q   | MACROTASK Q
-----|-------------|------------------|-------------------
   | log("A")  |         | setTimeout(cb_B)
   | log("F")  | then(cb_C)    |
   |       | queueMT(cb_D)  |
   |       | then(cb_E)    |
-----|-------------|------------------|-------------------
   | drain micro | -> log C     |
   |       | -> log D     |
   |       | -> log E     |
-----|-------------|------------------|-------------------
   | macro tick |         | -> log B
```

Sortie : `A F C D E B`.

### Ce que l'analogie cache

La microtask queue est **drainée entièrement** entre deux macrotasks. Une microtask qui en ajoute une autre = boucle infinie qui bloque le rendu. Le navigateur ne rendra jamais un frame.
