---
stability: intemporel
---

# DEVTOOLS DEBUGGER : LIRE LE CODE EN TRAIN DE S'EXÉCUTER

Temps de lecture ~8 min


`console.log` te dit ce qui s'est passé.
Le debugger te montre ce qui se passe, maintenant, instruction par instruction.

C'est la différence entre lire le rapport d'une mission et être sur le terrain pendant la mission.
Ce fichier t'apprend à utiliser le terrain.

---

## 1) OUVRIR LE DEBUGGER

### Dans le navigateur (Chrome/Edge/Brave)

```
F12 --> onglet "Sources"
```

À gauche : l'arborescence de fichiers du projet.
Au centre : le code source.
À droite : le panneau de contrôle du debugger (call stack, variables, breakpoints).

### Dans VS Code

```
Run --> Start Debugging (F5)
Choisir "Node.js" comme environnement
```

VS Code affiche les mêmes panneaux qu'un navigateur, directement dans l'éditeur.

### Via Node.js en terminal

```bash
node --inspect script.js    # démarre Node avec le debugger activé
node --inspect-brk script.js  # idem, mais pause au tout premier démarrage
```

Puis ouvrir Chrome et aller sur `chrome://inspect`.

---

## 2) LES BREAKPOINTS

Un breakpoint (point d'arrêt) : une instruction donnée à JS de mettre l'exécution en pause à cet endroit.
À la pause, toutes les variables du scope (portée) courant sont inspectables.

### Breakpoint de ligne

Cliquer sur le numéro de ligne dans l'onglet Sources. Une pastille bleue apparaît.

```js
function calculerPuissance(base, niveau) {
 const chakraBase = base * 100      // <-- breakpoint ici
 const multiplicateur = Math.pow(2, niveau)
 return chakraBase * multiplicateur
}
```

Quand l'exécution atteint cette ligne, elle s'arrête.
Dans le panneau de droite, tu vois `base`, `niveau`, `chakraBase` avec leurs valeurs exactes.

### Breakpoint conditionnel

Clic droit sur un numéro de ligne --> "Add conditional breakpoint".

```js
// Pause seulement si Vegeta a moins de chakra que Goku
joueur.chakra < adversaire.chakra
```

Utile pour les boucles avec 10 000 itérations : tu ne pauses que quand la condition t'intéresse, pas à chaque passage.

### Logpoint (log sans toucher le code)

Clic droit sur un numéro de ligne --> "Add logpoint".

```
Tu entres : [tour {tour}] chakra = {joueur.chakra}, adversaire = {adversaire.nom}
```

JS évalue et logue à chaque passage, sans s'arrêter, sans modifier le code.
Équivalent propre d'un `console.log` temporaire, que tu supprimes en fermant les DevTools.

---

## 3) NAVIGUER DANS L'EXÉCUTION

Une fois en pause sur un breakpoint, tu as quatre actions.

```
F8  (ou bouton Play)      Resume / Continue
   --> reprend l'exécution jusqu'au prochain breakpoint ou la fin du programme

F10 (ou Step Over)       Passer à la ligne suivante
   --> exécute la ligne courante sans entrer dans les fonctions appelées

F11 (ou Step Into)       Entrer dans la fonction
   --> si la ligne courante appelle une fonction : entre dans son code

Shift+F11 (ou Step Out)     Sortir de la fonction courante
   --> exécute le reste de la fonction et revient à l'appelant
```

### Quand utiliser quoi

```
SITUATION                ACTION

Tu cherches la ligne qui plante     F10 (step over) jusqu'à la trouver
Tu veux inspecter une fonction suspecte F11 (step into) pour y entrer
Tu as déjà vu ce que tu voulais     Shift+F11 (step out) pour sortir
Tu veux aller au prochain breakpoint  F8 (continue)
```

Exemple : combat DBZ, le score de puissance sort à 0 alors qu'il devrait être à 9000.

```js
function combatDBZ(goku, vegeta) {
 const puissanceGoku  = calculerPuissance(goku)  // ligne 3 : step into ici
 const puissanceVegeta = calculerPuissance(vegeta)
 return puissanceGoku > puissanceVegeta ? 'Goku' : 'Vegeta'
}

function calculerPuissance(combattant) {
 const base = combattant.stats.force        // ligne 8 : qu'est-ce que stats ?
 const niveau = combattant.stats.niveau
 return base * Math.pow(10, niveau)
}
```

Démarche :
1. Breakpoint ligne 3
2. Pause. Inspecter `goku` dans le panneau de droite : est-ce que `goku.stats` existe ?
3. F11 (step into) pour entrer dans `calculerPuissance`
4. Ligne 8. Inspecter `combattant.stats.force` : vaut `undefined` ? C'est là que ça casse.

---

## 4) LES PANNEAUX DE DROITE

### Call Stack

La pile d'appels en cours au moment de la pause.

```
combatDBZ (combat.js:3)    <-- fonction où tu es actuellement
<anonymous> (game.js:45)    <-- qui a appelé combatDBZ
```

Cliquer sur une entrée du call stack : le code de cette fonction s'affiche au centre, avec ses variables locales.
Utile pour remonter le chemin d'exécution sans lire la stack trace.

### Scope

Trois sections :
- **Local** : variables déclarées dans la fonction courante.
- **Closure** : variables capturées depuis des fonctions parentes (closures actives).
- **Global** : variables globales (window en navigateur, global en Node).

```js
function creerCompteur(depart) {
 let count = depart // sera visible dans "Closure" depuis les fonctions internes

 return function incrementer(step) {
  count += step  // ici, "count" apparaît dans Closure, pas dans Local
  return count
 }
}
```

Si une variable vaut `undefined` alors qu'elle devrait avoir une valeur : cherche dans quel scope elle vit vraiment. Souvent la réponse est là.

### Watch Expressions

Tu peux évaluer des expressions JS pendant la pause.

```
goku.stats.force * 10    --> 0 (si force est 0, pas undefined)
typeof goku.stats.niveau   --> "string" (si niveau est "3" au lieu de 3)
JSON.stringify(vegeta)    --> voir tout l'objet sans surprise
```

Utile pour tester une hypothèse sans modifier le code.

---

## 5) DEBUGGER EN NODE.JS VIA VS CODE

Pour débugger un script Node dans VS Code :

Créer un fichier `.vscode/launch.json` à la racine du projet :

```json
{
 "version": "0.2.0",
 "configurations": [
  {
   "type": "node",
   "request": "launch",
   "name": "Debug script",
   "program": "${workspaceFolder}/src/index.js",
   "console": "integratedTerminal"
  }
 ]
}
```

Puis F5. Les breakpoints posés dans VS Code fonctionnent directement.

Pour TypeScript, ajouter `"sourceMaps": true` et `"outFiles": ["${workspaceFolder}/dist/**/*.js"]`.
Le debugger mappe le JS compilé vers les sources TypeScript : tu poses les breakpoints dans le `.ts`, tu debuggues dans le `.ts`.

---

## 6) LE CAS QUI CASSE

Scénario : tu poses un breakpoint, tu regardes la variable, elle a la bonne valeur.
Tu continues. Elle a une mauvaise valeur 10 lignes plus loin. Tu n'as pas vu quand ça a changé.

Solution : le breakpoint de mutation (Chrome uniquement).

Dans le panneau "Scope", clic droit sur une variable --> "Break on value change".
JS s'arrêtera exactement à la ligne qui modifie cette variable.

```
Exemple : `stock.munitions` passe à -5 quelque part dans le pipeline.
Break on value change sur stock.munitions.
L'exécution s'arrête exactement là où la mutation se produit.
```

Alternative si le breakpoint de mutation n'est pas disponible : wrapper la propriété avec un setter.

```js
// Transformer une propriété en setter qui loggue toute modification
function watchProperty(obj, prop) {
 let val = obj[prop]
 Object.defineProperty(obj, prop, {
  get: () => val,
  set: (newVal) => {
   console.trace(`[WATCH] ${prop} changed: ${val} --> ${newVal}`)
   val = newVal
  }
 })
}

watchProperty(stock, 'munitions')
// Maintenant chaque modification de stock.munitions affiche une stack trace complète
```

---

## EXERCICES

EXO 1 : Débugger sans toucher le code (~15 min)

Le moteur de combat DBZ calcule des scores incorrects. Lance ce code dans le navigateur, pose les breakpoints nécessaires, et trouve le bug sans modifier une seule ligne.

```js
const combattants = {
 goku:  { stats: { force: '9000', niveau: 1 } },  // intentionnellement problématique
 vegeta: { stats: { force: 8500, niveau: 1 } }
}

function calculerPuissance(combattant) {
 const base = combattant.stats.force
 const niveau = combattant.stats.niveau
 return base * Math.pow(10, niveau)
}

function combat(a, b) {
 const pa = calculerPuissance(combattants[a])
 const pb = calculerPuissance(combattants[b])
 return pa > pb ? a : b
}

console.log(combat('goku', 'vegeta')) // doit retourner 'goku' mais retourne 'vegeta'
```

Exercice :
1. Pose un breakpoint sur la ligne `const base = combattant.stats.force`
2. Inspecte `base` dans le panneau Scope quand `combattant` est `goku`
3. Inspecte `base` quand `combattant` est `vegeta`
4. Utilise Watch Expressions pour évaluer `typeof base` dans les deux cas
5. Identifie le bug. Explique pourquoi `'9000' * Math.pow(10, 1)` ne vaut pas `90000`

EXO 2 : Trouver la mutation fantôme (~20 min)

Le stock de munitions du camp de Rick baisse plus vite que prévu. Utilise `watchProperty` ou un breakpoint de mutation pour trouver quelle ligne modifie le stock sans permission.

```js
const camp = {
 stock: { munitions: 500, nourriture: 200, medicaments: 50 }
}

watchProperty(camp.stock, 'munitions')

async function rondeNocturne(camp) {
 const gardes = ['Rick', 'Daryl', 'Michonne']
 await Promise.all(gardes.map(async nom => {
  const tirs = Math.floor(Math.random() * 20) + 5
  camp.stock.munitions -= tirs
  console.log(`${nom} a tiré ${tirs} fois`)
 }))
}

async function patrouille(camp) {
 camp.stock.munitions = camp.stock.munitions - 10 // consommation de patrouille
}

// Les deux lancés en parallèle
Promise.all([rondeNocturne(camp), patrouille(camp)])
 .then(() => console.log('Stock final:', camp.stock.munitions))
```

Exercice :
1. Implémente `watchProperty` (voir section 6)
2. Observe les stack traces quand `munitions` change
3. Explique pourquoi le total final peut être inférieur à ce qu'on attendrait
4. Propose une correction architecturale (pas juste un patch)

---

## RÉSUMÉ

Le debugger te donne accès au code en train de s'exécuter, pas au résultat final.
Breakpoint de ligne : pause à un endroit précis pour inspecter les variables.
Breakpoint conditionnel : pause seulement quand une condition est vraie, pas à chaque passage.
Step over (F10) pour avancer, step into (F11) pour entrer dans une fonction, step out (Shift+F11) pour en sortir.
Le panneau Scope te montre local, closure, global : si une variable vaut `undefined`, cherche dans quel scope elle vit.
`watchProperty` pour attraper une mutation au vol quand tu ne sais pas qui mute.
