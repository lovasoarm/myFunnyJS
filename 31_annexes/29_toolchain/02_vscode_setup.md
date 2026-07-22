---
stability: intemporel
---

# VSCODE SETUP : TON CAMP DE BASE, CONFIGURÉ POUR TENIR
Temps de lecture ~8 min

Daryl a sa moto réglée au millimètre : il sait exactement comment elle réagit, où sont ses limites, ce qu'elle tolère. Ton éditeur c'est pareil. Tu vas passer des milliers d'heures dedans. Un setup par défaut, c'est une moto jamais réglée : elle roule, mais elle te trahit au pire moment.

---

## 1) LE CONCEPT DERRIÈRE VSCODE : LSP

VSCode lui-même est un éditeur de texte assez basique. Ce qui le rend puissant, c'est le LSP (Language Server Protocol : protocole qui connecte un éditeur à une "intelligence" du langage).

```
ton code --> LSP --> serveur de langage (analyse en arrière-plan) --> autocomplétion, erreurs, refactoring
```

```js
// Quand tu tapes ça dans VSCode avec l'extension TypeScript active :
const survivant = { nom: "Daryl", arme: "arbalète" };
survivant.arm // <-- VSCode te propose "arme" en autocomplétion

// Ce n'est PAS VSCode qui "devine". C'est le serveur de langage TypeScript
// qui a analysé ton fichier en arrière-plan et qui répond en temps réel
```

**Technique :** le LSP tourne dans un processus séparé de l'éditeur. C'est pour ça que tu peux avoir le même niveau d'autocomplétion sur VSCode, Vim, ou Neovim : ils parlent tous au même serveur de langage. L'éditeur est juste l'interface, le LSP fait le vrai travail d'analyse.

**Qui casse en prod (enfin, en dev) :** un gros projet avec un LSP mal configuré qui re-analyse tout le projet à chaque frappe. Résultat : l'éditeur rame, l'autocomplétion met 3 secondes à apparaître, tu perds patience et tu désactives tout. La cause est presque toujours une config TypeScript qui inclut trop de fichiers (genre `node_modules` par erreur).

---

## 2) EXTENSIONS : LE MINIMUM VIABLE POUR DU JS/TS SÉRIEUX

Pas besoin de 80 extensions. Le camp voyage léger.

```
ESLint       --> détecte les erreurs de style ET les vrais bugs potentiels avant l'exécution
Prettier      --> formate le code automatiquement, fin des débats sur les espaces
GitLens       --> voit qui a écrit quelle ligne et pourquoi, directement dans l'éditeur
Error Lens     --> affiche les erreurs inline, pas juste dans un panneau qu'on regarde jamais
```

```js
// Sans ESLint, ce genre de bug part en prod sans prévenir :
if (rationsRestantes = 0) { // bug classique : = au lieu de ===
 alerterPenurie();
}
// ESLint hurle immédiatement : "Expected a conditional expression and instead saw an assignment"
```

**Pourquoi ça compte :** ESLint et Prettier ont des rôles différents qu'on confond souvent.

```
ESLint  --> qualité et correction du code (logique, bugs potentiels, conventions)
Prettier --> apparence du code (indentation, guillemets, longueur de ligne)
```

L'un détecte les pièges, l'autre uniformise le style. Les deux ensemble, configurés pour pas se marcher dessus, c'est le combo standard en 2026.

---

## 3) SETTINGS.JSON : LA CONFIG QUI VOYAGE AVEC LE PROJET

Un fichier `.vscode/settings.json` à la racine du projet, c'est une config qui s'applique à tout le camp, pas juste à toi.

```json
{
 // formate automatiquement à chaque sauvegarde, fini le "j'oublie de formater"
 "editor.formatOnSave": true,

 // utilise Prettier comme formateur par défaut pour le JS et le TS
 "editor.defaultFormatter": "esbenp.prettier-vscode",

 // ESLint corrige automatiquement ce qu'il peut à la sauvegarde
 "editor.codeActionsOnSave": {
  "source.fixAll.eslint": "explicit"
 },

 // n'affiche pas les fichiers générés dans l'arborescence, moins de bruit visuel
 "files.exclude": {
  "node_modules": true,
  "dist": true
 }
}
```

**Technique :** ce fichier se committe dans Git (contrairement aux préférences perso de l'éditeur). Résultat : Daryl, Glenn et Rick ouvrent le même projet, et leur éditeur se comporte pareil, sans configuration manuelle de chacun.

**Qui casse en prod :** chaque membre de l'équipe avec un format différent (tabs vs espaces, guillemets simples vs doubles). Chaque commit devient un diff (différence) énorme rempli de changements de formatage qui noient les vrais changements de logique. Une review devient impossible à lire.

---

## 4) DEBUGGER INTÉGRÉ : ARRÊTE DE DÉBUGGER AVEC CONSOLE.LOG

VSCode a un débogueur (debugger) intégré qui peut s'attacher directement à un processus Node.

```json
// .vscode/launch.json
{
 "version": "0.2.0",
 "configurations": [
  {
   "type": "node",
   "request": "launch",
   "name": "Debug camp-manager",
   "program": "${workspaceFolder}/src/index.js",
   "skipFiles": ["<node_internals>/**"]
  }
 ]
}
```

```js
// Dans ton code, tu poses un breakpoint (point d'arrêt) en cliquant à gauche de la ligne
function calculerRations(survivants, stock) {
 const rationParPersonne = stock / survivants.length; // <-- breakpoint ici
 return rationParPersonne;
}

// L'exécution s'arrête EXACTEMENT à cette ligne
// Tu inspectes "survivants", "stock", "rationParPersonne" en temps réel
// Tu avances ligne par ligne, tu vois l'état évoluer
```

**Pourquoi c'est mieux que console.log :** un `console.log` te montre une valeur à un instant donné, que t'as deviné à l'avance. Un breakpoint te montre TOUT l'état du programme, à l'endroit exact où ça part en vrille, sans avoir à deviner où regarder.

**Qui casse en prod (enfin, en perte de temps) :** un dev qui passe 20 minutes à ajouter des `console.log("ici1")`, `console.log("ici2")` partout, puis à les supprimer après. Le débogueur fait ça en 30 secondes, sans polluer le code.

---

## EXERCICES

EXO 1 : Le camp configuré :
Crée un fichier `.vscode/settings.json` pour un petit projet Node, avec format à la sauvegarde, ESLint qui corrige automatiquement, et exclusion de `node_modules` de l'arborescence visible. Vérifie que ça fonctionne en sauvegardant un fichier mal indenté et en regardant VSCode le corriger tout seul.

EXO 2 : Le piège du `=` :
Écris volontairement un bug du genre `if (x = 5)` dans un fichier JS avec ESLint actif. Capture comment VSCode te le signale, et explique en une phrase pourquoi ce genre d'erreur est dangereux en prod si personne ne la voit avant le déploiement.

EXO 3 : Chasse au bug sans console.log :
Prends une fonction avec un bug logique (une boucle qui calcule mal une somme, par exemple), configure un `launch.json`, pose un breakpoint, et retrouve le bug uniquement en inspectant les variables pendant l'exécution pas à pas. Interdiction d'utiliser `console.log`.

---

## RÉSUMÉ

VSCode est puissant grâce au LSP qui tourne en arrière-plan, pas par magie. ESLint chasse les bugs et les mauvaises pratiques, Prettier uniformise le style : deux jobs différents, pas un doublon. Un `settings.json` committé fait que toute l'équipe a le même comportement d'éditeur, sans diffs (différences) parasites dans les commits. Le débogueur intégré remplace `console.log` pour inspecter un état complet, pas une valeur isolée devinée à l'avance.
