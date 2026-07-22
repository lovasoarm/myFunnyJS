---
perennite: intemporel
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Variables, portée, fonctions, types : socle mental valable dans n'importe quel langage.
---
> **Statut de pérennité :** **intemporel** | évolutif | périssable
> Statut effectif de ce module : **intemporel**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

# POURQUOI CE MODULE MÉRITE TON TEMPS : LES FONDAMENTAUX

> **Durée de vie : intemporel.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.
Temps de lecture ~8 min

Tu peux écrire `const x = 5` sans savoir ce qui se passe en mémoire. Ça marche. Jusqu'au jour où ton state mute tout seul, où ta closure garde une variable vivante alors que la fonction est morte, où ton `===` te trahit. Là, tu ne débugges plus : tu pries.

Les fondamentaux, c'est le sol. Pas le décor.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

JS a une particularité brutale : il te laisse écrire du code qui marche sans que tu comprennes pourquoi. Pas d'erreur de compilation qui te sauve. Pas de garde-fou strict comme dans un langage typé statiquement. Tu peux muter un objet partagé entre 4 fonctions et JS ne dira rien. Le bug apparaîtra ailleurs, plus tard, dans un composant qui n'a rien à voir.

Sans les fondamentaux, tu codes au feeling. Tu copies un pattern qui a marché une fois, tu pries qu'il remarche. Quand ça casse, tu changes des trucs au hasard jusqu'à ce que ça reparte. C'est la définition exacte d'un développeur qui ne contrôle pas son code.

Avec les fondamentaux, tu sais à l'avance ce qu'une ligne va faire avant de l'exécuter. Tu lis une closure (fonction qui garde en mémoire le contexte dans lequel elle a été créée) et tu vois immédiatement le piège. Tu vois un `const obj = {}` et tu sais que `const` bloque la réassignation, pas la mutation. La différence change toute ta façon de coder.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui ne maîtrise pas les fondamentaux souffre en silence pendant des mois. Il code, ça marche en dev, ça casse en prod sur un cas qu'il n'avait pas prévu : deux variables qui pointent vers le même objet, une fonction qui ferme sur une variable de boucle et capture toujours la même valeur, une coercition de type qui transforme `"5" + 3` en `"53"` au lieu de `8`.

Le pire : ces bugs ne crashent pas toujours. Ils corrompent silencieusement une donnée. Imagine un moteur de combat comme celui du `01_rasengan_engine` : les stats de chakra d'un ninja mutent par accident parce que deux fonctions partagent la même référence. Le bug n'explose pas : il calcule en silence des dégâts faux pendant 3 tours.

L'équipe entière souffre aussi. Un dev qui ne comprend pas le scope (portée d'une variable : l'endroit où elle est visible et accessible) écrit du code qui fuit des variables globales, qui pollue des modules, qui rend chaque review plus longue parce que personne ne sait si telle variable est safe à modifier.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

Partout, en permanence, sans exception :

```
state d'une app React/Vue   --> mutation accidentelle --> bug de rendu fantôme
config partagée entre modules --> référence partagée   --> un module casse un autre
boucle for avec var      --> closure capte la mauvaise valeur
cache en mémoire       --> deep vs shallow copy  --> données corrompues
parsing d'input utilisateur  --> coercition de type   --> comparaison qui foire
```

Un bug de fondamentaux n'est jamais isolé. Il se propage parce que toute ton app repose sur des variables qui se passent de la donnée entre elles. Si la base est pourrie, chaque étage au-dessus hérite du problème.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Intemporel. Total. Zéro doute.

La syntaxe des frameworks change tous les deux ans. React d'aujourd'hui ne ressemble plus à React de 2018. Mais le comportement d'une closure, le fonctionnement du scope, la différence entre passage par valeur et passage par référence : ça n'a pas changé depuis que JS existe, et ça ne changera pas demain.

C'est la seule partie du métier qui ne devient jamais obsolète. Apprendre un fondamental, c'est un investissement qui ne se déprécie jamais.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

`var` est passé de standard à legacy (ancien code à maintenir) à cause de son scope flou (function-scope au lieu de block-scope) et de ses problèmes de hoisting (le comportement qui fait "monter" la déclaration en haut du scope avant exécution). `let` et `const` ont pris le relais en apportant un scope de bloc clair.

Les boucles ont aussi évolué : avant on bouclait avec `for` classique partout, maintenant `map`, `filter`, `reduce` dominent parce qu'ils expriment l'intention sans exposer la mécanique. Le `for` classique reste utile quand tu as besoin de `break` ou de performance brute sur de très gros volumes, mais ce n'est plus le réflexe par défaut.

La détection de type a aussi mûri : on est passé d'un usage abusif de `typeof` partout vers des vérifications plus précises avec des helpers dédiés, parce que `typeof null === "object"` a piégé des générations de devs.

---

## 6) NOYAU DUR DU MÉTIER ?

Oui, sans discussion. Ce bloc fait partie des "6 blocs prioritaires" du curriculum pour une raison simple : tout le reste en dépend. `03_async`, `09_data_structures`, `11_functional_js` : chacun de ces modules suppose que tu maîtrises déjà closures, scope, types, fonctions. Sauter ce module, c'est construire un immeuble sans fondations et espérer que ça tienne au 5ème étage.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Dans 5 ans, un nouveau framework aura remplacé celui que tu utilises aujourd'hui. Mais la closure fonctionnera toujours pareil. Le moteur JS (V8, SpiderMonkey, peu importe) continuera de compiler à la volée (JIT : compilation à la volée) avec les mêmes règles de base.

Un dev qui maîtrise les fondamentaux apprend un nouveau framework en une semaine. Un dev qui ne les maîtrise pas reste dépendant de tutoriels toute sa carrière, parce qu'il ne comprend jamais vraiment ce qu'il copie-colle.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

Sans ce module, tout code que tu écris repose sur du sable. C'est ici que les bugs silencieux prennent racine : mutation accidentelle, scope mal compris, coercition surprise. Et contrairement à la syntaxe des frameworks, ce que tu apprends ici ne se démode jamais.

Maintenant, ouvre `01_intro_variables.md`. Et cette fois, regarde vraiment ce qui se passe en mémoire.
