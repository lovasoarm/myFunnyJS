---
perennite: intemporel
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Modéliser avant de coder ne se démode pas.
---
> **Statut de pérennité :** **intemporel** | évolutif | périssable
> Statut effectif de ce module : **intemporel**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

# POURQUOI CE MODULE MÉRITE TON TEMPS : PROBLEM SOLVING

> **Durée de vie : intemporel.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.
Temps de lecture ~7 min

Tu connais la syntaxe. Tu connais les structures de données. Tu connais les patterns. Et pourtant, face à un vrai problème flou ("le dashboard est lent", "ça marche pas pour ce client"), tu ouvres ton éditeur sans savoir par où commencer. Le problème n'est pas technique : il est dans ta façon de penser avant de coder.

Ce module ne t'apprend pas un nouvel outil. Il t'apprend à utiliser ta tête avant tes doigts.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

La majorité des développeurs apprennent la syntaxe, les frameworks, les algorithmes. Très peu apprennent explicitement comment décomposer un problème complexe en pièces gérables, comment transformer une demande floue ("ça marche pas") en problème précis et attaquable, ou comment comparer deux approches avant d'écrire la première ligne de code.

Sans cette compétence, le réflexe naturel est de foncer dans le code dès la première idée qui vient, puis de découvrir 2 heures plus tard que l'approche choisie ne tenait pas la route, et qu'il faut tout recommencer. Le coût de ce mauvais départ n'est pas dans la syntaxe : il est dans le temps perdu à explorer une mauvaise direction avant d'avoir réfléchi.

Ce module structure une démarche que les devs expérimentés utilisent souvent sans la nommer : décomposer un système complexe en pièces qui tiennent seules, modéliser le problème en structures et contrats avant d'ouvrir l'éditeur, comparer plusieurs approches, et concevoir en anticipant ce qui va changer plutôt que ce qui est stable aujourd'hui.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev sans méthode de résolution de problème code au premier réflexe, puis recommence, puis recommence encore, parce qu'il n'a jamais pris le temps de modéliser le problème avant d'attaquer la solution. Il reçoit un ticket vague ("le système de combat bug parfois quand deux jutsus se déclenchent en même temps") et code une solution pour le premier cas qui lui vient en tête, sans avoir creusé pour comprendre le vrai problème caché derrière la formulation floue.

Sur des problèmes complexes, l'absence de décomposition mène à une seule fonction géante qui essaie de tout faire d'un coup, impossible à tester, impossible à déboguer, parce que rien n'a été découpé en pièces indépendantes dès la conception.

Et sur le plan de l'évolution du code : un dev qui conçoit uniquement pour le besoin actuel, sans anticiper ce qui va probablement changer, livre une solution qui devra être entièrement réécrite à la première demande d'évolution, alors qu'une conception un peu plus réfléchie aurait absorbé ce changement sans drame.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
ticket flou ("ça marche pas pour ce cas")     --> read fuzzy requirements --> problème précis et attaquable
système complexe à construire            --> decompose        --> pièces indépendantes et testables
plusieurs solutions possibles à un même problème   --> choose an approach   --> comparaison avant écriture
fonctionnalité qui va probablement évoluer      --> design for change    --> structure qui absorbe le changement
logique métier complexe avant le code         --> model before code    --> contrats clairs entre les pièces
```

Cette compétence apparaît avant même la première ligne de code : en réunion de planification, en lecture de ticket, en conception d'architecture. C'est la phase invisible qui déterminera si le code qui suivra sera solide ou bricolé.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Intemporel, au même titre que la logique elle-même. Décomposer un problème complexe, comparer des approches, anticiper le changement : ce sont des compétences de raisonnement qui ne dépendent d'aucune technologie. Elles existaient avant JS, et elles existeront après le framework que tu utilises aujourd'hui.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Ce qui a évolué, c'est l'urgence de cette compétence à l'ère de l'IA générative. Quand l'IA peut générer du code en quelques secondes, le goulot d'étranglement (bottleneck) n'est plus "écrire du code" : c'est "savoir quoi demander, et juger si la réponse résout vraiment le bon problème". Un dev qui sait décomposer un problème pose les bonnes questions à l'IA et valide correctement ses réponses. Un dev qui ne sait pas décomposer accepte la première solution plausible, même si elle répond à la mauvaise question.

---

## 6) NOYAU DUR DU MÉTIER ?

Pas listé explicitement dans les "6 blocs prioritaires", mais c'est une compétence transversale qui rend tous les autres modules plus efficaces. `02_problem_solving` n'a aucun prérequis bloquant listé, ce qui en fait un module qu'on peut renforcer en parallèle de presque tout le reste du curriculum, et qui améliore directement la qualité de ce que tu produis dans `12_design_patterns`, `16_architecture_patterns`, et `23_ai_native_dev`.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Cette compétence devient plus précieuse à mesure que les outils automatisent de plus en plus l'écriture brute de code. Le dev qui sait poser un problème correctement, le décomposer, et juger une solution proposée (humaine ou générée par IA) restera utile peu importe à quel point ces outils évoluent. C'est la compétence qui ne se fait jamais remplacer par un outil, parce qu'elle est la condition pour utiliser n'importe quel outil correctement.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

La syntaxe ne suffit pas si tu ne sais pas penser le problème avant de coder. Ça casse de trois façons sans cette méthode : mauvais départs répétés, fonctions géantes impossibles à tester, solutions qui ne survivent pas au premier changement. Cette compétence devient encore plus stratégique à l'ère de l'IA générative.

Maintenant, ouvre `02_decompose.md`. Et arrête de foncer dans l'éditeur avant d'avoir compris le vrai problème.
