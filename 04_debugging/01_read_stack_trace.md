---
stability: intemporel
---

# LIRE UNE STACK TRACE : LA CARTE QUI TE DIT OÙ LE CODE A EXPLOSÉ

Temps de lecture ~6 min


Tu vois du rouge dans ta console. Dix lignes. Peut-être vingt.
Premier réflexe de 90% des devs : copier-coller sur Google sans lire.

Mauvais réflexe. La stack trace te dit déjà tout ce dont tu as besoin.
C'est pas une punition : c'est une carte du chemin que le code a pris avant de planter.

Ce fichier t'apprend à la lire, ligne par ligne, sans panique.

---

## 1) CE QU'EST UNE STACK TRACE

Quand JS plante, il prend une photo de la call stack (pile d'appels) au moment du crash.
Cette photo, c'est la stack trace.

La call stack (pile d'appels) : l'empilement des fonctions en cours d'exécution.
Chaque appel de fonction ajoute une entrée. Chaque retour en enlève une.
Quand ça plante, JS affiche cette pile du moment.

```
CALL STACK au moment du crash

 calculerDegats   <-- crash ici (en haut : plus récent)
 lancerJutsu    <-- a appelé calculerDegats
 simulerCombat   <-- a appelé lancerJutsu
 <anonymous>    <-- point d'entrée du script
```

La stack trace lit cette pile de haut en bas : du plus récent au plus ancien.

---

## 2) ANATOMIE D'UNE STACK TRACE RÉELLE

```js
// combat.js : moteur de combat de l'Académie de Konoha
function calculerDegats(attaquant, cible) {
 return attaquant.chakra * attaquant.force / cible.defense // crash : cible est undefined
}

function lancerJutsu(attaquant, victime) {
 return calculerDegats(attaquant, victime)
}

function simulerCombat(ninja1, ninja2) {
 return lancerJutsu(ninja1, ninja2)
}

simulerCombat(
 { chakra: 100, force: 50, jutsus: ['Rasengan'] },
 undefined // victime oubliée à l'appel
)
```

Résultat dans le terminal :

```
TypeError: Cannot read properties of undefined (reading 'defense')
  at calculerDegats (combat.js:2:39)
  at lancerJutsu (combat.js:7:10)
  at simulerCombat (combat.js:11:10)
  at Object.<anonymous> (combat.js:14:1)
  at Module._compile (node:internal/modules/cjs/loader:1364:14)
  at Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
  at Module.load (node:internal/modules/cjs/loader:1203:32)
  at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:128:12)
```

Décomposition ligne par ligne :

```
TypeError: Cannot read properties of undefined (reading 'defense')
^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
type d'erreur          message exact
```

Le type : `TypeError` signifie qu'on a essayé d'utiliser une valeur d'un mauvais type.
Le message : `undefined (reading 'defense')` dit exactement quoi : `cible` vaut `undefined`,
et on a tenté de lire `cible.defense`.

```
  at calculerDegats (combat.js:2:39)
    ^^^^^^^^^^^^^^ ^^^^^^^^^^ ^ ^^
    nom de fonction fichier ligne colonne
```

C'est là que le crash s'est produit : fichier `combat.js`, ligne 2, colonne 39.

```
  at lancerJutsu  (combat.js:7:10)
  at simulerCombat (combat.js:11:10)
  at Object.<anonymous> (combat.js:14:1)
```

Le chemin d'appel : `simulerCombat` -> `lancerJutsu` -> `calculerDegats` -> crash.

```
  at Module._compile (node:internal/modules/cjs/loader:1364:14)
  at Module._extensions..js ...
```

Ces lignes commencent par `node:internal` ou `node:` : ce sont les internes de Node.
Tu n'as pas écrit ce code. Tu ne peux pas le modifier. Tu les ignores.

---

## 3) RÈGLE : CE QUI T'APPARTIENT ET CE QUI NE T'APPARTIENT PAS

```
at calculerDegats (combat.js:2:39)     <- ton code : lis cette ligne
at lancerJutsu  (combat.js:7:10)     <- ton code : lis cette ligne
at simulerCombat (combat.js:11:10)     <- ton code : lis cette ligne
at Object.<anonymous> (combat.js:14:1)   <- ton code (point d'entrée)
at Module._compile (node:internal/...)   <- Node interne : ignore
at Module._extensions (node:internal/...)  <- Node interne : ignore
at Module.load  (node:internal/...)    <- Node interne : ignore
```

Règle simple : dès que tu vois `node:internal`, `node:`, ou un chemin dans `node_modules` :
tu t'arrêtes de lire. Tout ce qui est au-dessus, c'est le tien.

---

## 4) LIRE UNE STACK TRACE ASYNC

Les Promises et async/await complexifient les stacks traces.
Quand une Promise rejette et que l'erreur est catchée plus loin, la trace peut sembler déconnectée.

```js
// patrouille.js : système d'alerte des Chevaliers de Garo
async function envoyerAlerte(horreur) {
 const chevalier = await trouverChevalier(horreur.zone)
 return chevalier.armer() // crash : chevalier est null
}

async function trouverChevalier(zone) {
 const data = await fetchAPI(`/chevaliers?zone=${zone}`)
 return data.chevalier // retourne null si aucun chevalier disponible
}

envoyerAlerte({ zone: 'secteur-nord' })
```

Stack trace async :

```
TypeError: Cannot read properties of null (reading 'armer')
  at envoyerAlerte (patrouille.js:3:24)
  at process.processTicksAndRejections (node:internal/process/task_queues:95:5)

Node.js v20.0.0
(Use `node --async-stack-traces` for better stack traces)
```

Deux différences par rapport à une stack synchrone :

Première différence : la trace est plus courte. Le contexte async est partiellement perdu.
Node affiche souvent `process.processTicksAndRejections` : c'est un interne, ignore.

Deuxième différence : `trouverChevalier` n'apparaît pas dans la trace.
Pourquoi : l'erreur s'est produite dans `envoyerAlerte`, après que `trouverChevalier`
avait déjà résolu sa Promise et libéré sa frame de la stack.

Option utile en Node : `node --async-stack-traces patrouille.js`
Donne une trace plus complète en mode développement. En prod : impact perf, désactiver.

---

## 5) EXEMPLE COMPLET : DIAGNOSTIC EN TROIS SECONDES

Exercice mental. Stack trace suivante :

```
RangeError: Maximum call stack size exceeded
  at puissance (dbz.js:4:10)
  at puissance (dbz.js:5:10)
  at puissance (dbz.js:5:10)
  at puissance (dbz.js:5:10)
  ... (1000 lignes identiques)
  at Object.<anonymous> (dbz.js:8:1)
```

Lecture :
- Type : `RangeError`, message `Maximum call stack size exceeded` : c'est une récursion infinie.
- Fonction en cause : `puissance` dans `dbz.js`.
- Lignes 4 et 5 en alternance : la fonction s'appelle elle-même sans condition d'arrêt.
- Le fichier `dbz.js`, ligne 8 : c'est là où `puissance` a été appelée la première fois.

Diagnostic : vérifier le cas de base (base case) de la récursion dans `puissance`.
S'il est absent ou jamais atteint : récursion infinie garantie.

---

## EXERCICES

EXO 1 : Identifier le bug sans ouvrir le fichier (~8 min)

Le système de combat de Konoha envoie ce message d'erreur :

```
TypeError: ninja.jutsus is not a function
  at selectionnerJutsu (jutsu_selector.js:12:22)
  at preparerAttaque (combat_engine.js:34:10)
  at tour (combat_engine.js:67:5)
  at simulerTour (game.js:103:3)
  at Object.<anonymous> (game.js:156:1)
  at Module._compile (node:internal/modules/cjs/loader:1364:14)
```

Sans voir le code : réponds à ces questions.
- Quel est le type d'erreur ? Qu'est-ce que ça signifie ?
- Dans quel fichier et à quelle ligne le crash s'est-il produit ?
- Quelle propriété ou méthode est en cause ?
- Donne une hypothèse concrète sur la cause.
- Quelle ligne du fichier appelant vaut la peine d'être inspectée en deuxième ?

EXO 2 : Tracer le chemin d'appel (~10 min)

Voici une stack trace d'un système de surveillance de camp (Walking Dead) :

```
TypeError: Cannot read properties of undefined (reading 'niveau')
  at evaluerMenace (securite.js:8:19)
  at calculerAlerte (securite.js:23:7)
  at mettreAJourEtat (camp.js:45:5)
  at tick (simulation.js:89:3)
  at setInterval (node:timers:231:11)
```

Exercice : dessine le chemin d'appel dans l'ordre chronologique (du premier appel au crash).
Ensuite : que vaut probablement la variable passée à `evaluerMenace` au moment du crash ?
Indice : la fonction à la ligne 8 de `securite.js` lit `.niveau` sur quelque chose.

---

## RÉSUMÉ

Une stack trace lit le chemin d'exécution depuis le crash jusqu'à l'origine.
La première ligne donne le type d'erreur et le message exact : c'est ton diagnostic.
Les premières lignes `at ...` pointent ton code : fais-leur confiance.
Tout ce qui commence par `node:internal` ou `node_modules` : ignore.
En async, la trace est parfois incomplète : `node --async-stack-traces` aide en dev.
