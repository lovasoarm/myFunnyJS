---
perennite: intemporel
stability: moderne
duree_de_vie_estimee: 3-5 ans
raison: Node/Bun/Deno bougent, les concepts (event loop, streams) tiennent.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : event loop (03_async), modules (01_fundamentals), mémoire (08_memory_performance). Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI CE MODULE MÉRITE TON TEMPS : RUNTIME ENVIRONMENT

> **Durée de vie : intemporel.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Temps de lecture ~7 min

`window` n'existe pas dans Node. `require` ne marche pas pareil que `import`. Un script qui tourne parfaitement dans le navigateur peut crasher instantanément côté serveur, et vice-versa. JS est un seul langage, mais il vit dans plusieurs mondes différents, et chaque monde a ses propres règles.

Si tu ne sais pas dans quel environnement ton code va réellement s'exécuter, tu codes à l'aveugle.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

JS n'a pas un seul runtime (moteur d'exécution) : il en a plusieurs, et chacun expose des APIs différentes. Le navigateur te donne accès au DOM, à `window`, à `localStorage`. Node te donne accès au système de fichiers, à `process`, à des modules natifs, mais aucun de ces deux mondes ne connaît les APIs de l'autre. Un dev qui ne fait pas cette distinction écrit du code qui utilise `document` dans un script Node, ou qui utilise `fs` dans un script qui doit tourner dans un navigateur, et ça plante immédiatement.

Ce module clarifie ce qui appartient à quel monde : les streams et buffers pour traiter des données volumineuses sans tout charger en mémoire d'un coup, CommonJS vs ESM (les deux systèmes de modules, leur histoire, et pourquoi l'un a progressivement remplacé l'autre), `process.env` et `process.argv` pour lire la configuration sans la hardcoder dans le code, et les worker threads pour paralléliser du travail lourd sans bloquer l'event loop principal.

Comprendre le runtime, c'est savoir exactement ce que ton code a le droit de faire, où il s'exécute, et quelles ressources système il peut réellement toucher.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui ne distingue pas les runtimes écrit du code qui fonctionne par accident dans un environnement, et qui plante mystérieusement dans un autre. Un script qui utilise une variable globale du navigateur, déployé par erreur sur un serveur Node, génère une erreur cryptique du type "window is not defined", qui laisse le dev perplexe s'il ne comprend pas que ces deux mondes ne partagent pas les mêmes globals.

Sur des tâches de traitement de données volumineuses, ne pas connaître les streams force le dev à charger des fichiers entiers en mémoire avant de les traiter, ce qui marche sur un fichier de 10 Mo et fait crasher le process sur un fichier de 2 Go, alors qu'un traitement en streaming aurait géré le fichier morceau par morceau sans jamais saturer la mémoire.

Et sur des tâches CPU-intensives (calcul lourd, traitement d'image, parsing massif), ignorer les worker threads veut dire bloquer l'event loop principal pendant le calcul, ce qui gèle TOUT le serveur Node pour TOUS les utilisateurs connectés pendant que le calcul tourne, juste pour une seule requête.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
script qui doit tourner côté serveur ET côté client  --> node_vs_browser --> détection d'environnement
traitement d'un fichier volumineux (logs, exports)   --> streams/buffers --> traitement par morceaux
configuration d'app (clé API, environnement)      --> process.env   --> config externalisée et sécurisée
calcul lourd qui bloquerait le serveur entier      --> worker threads --> parallélisation sans freeze
outil CLI distribuable (générateur, linter custom)   --> node CLI scripts --> automatisation réutilisable
```

Chaque backend Node sérieux croise ces concepts : lire une variable d'environnement pour la config, gérer un upload de fichier volumineux en streaming, ou paralléliser un traitement lourd sans bloquer les autres requêtes pendant ce temps.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Les principes sont stables, mais le terrain évolue : Node reste le runtime serveur dominant en JS, mais l'écosystème autour (gestionnaires de modules, outils CLI) continue d'évoluer. CommonJS vs ESM est un exemple typique : la transition n'est pas terminée partout, donc comprendre les deux systèmes reste nécessaire, pas juste le plus récent.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, CommonJS (`require`/`module.exports`) était le standard incontesté côté Node, pendant que le navigateur n'avait pas de vrai système de modules natif. Aujourd'hui, ESM (`import`/`export`) est devenu le standard officiel du langage, supporté nativement par le navigateur ET par Node, ce qui unifie progressivement les deux mondes. Mais une grande partie de l'écosystème legacy tourne encore en CommonJS, donc savoir naviguer entre les deux reste indispensable, pas optionnel.

Les worker threads sont aussi relativement récents dans Node : avant leur arrivée, paralléliser du travail CPU-intensif en Node demandait des solutions plus lourdes (processus séparés, clustering), alors qu'aujourd'hui les worker threads offrent une parallélisation plus légère directement intégrée au runtime.

---

## 6) NOYAU DUR DU MÉTIER ?

Ce module ouvre la porte à deux modules majeurs qui en dépendent directement : `21_api_craft` (prérequis `15_runtime_env` + `17_web_concepts` + `05_error_handling`) et `26_observability` (prérequis `15_runtime_env` + `21_api_craft`). Impossible de construire une API Node solide ou un système d'observabilité sans comprendre d'abord dans quel environnement ce code va réellement s'exécuter.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Tant que JS tournera dans plusieurs environnements différents (et ça ne va pas changer), la distinction entre ces runtimes restera nécessaire. Les APIs spécifiques évolueront, de nouveaux runtimes pourraient même apparaître, mais le réflexe de te demander "où ce code va-t-il s'exécuter, et qu'est-ce que cet environnement me permet réellement de faire" restera une question fondamentale, peu importe la réponse exacte à un instant donné.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

JS vit dans plusieurs mondes différents, et chaque monde a ses propres règles, ses propres APIs, ses propres limites. Ça casse de trois façons sans cette distinction : code qui plante en changeant d'environnement, mémoire saturée par un fichier trop gros, serveur entier gelé par un calcul mal placé. Cette compréhension reste un prérequis direct pour construire des systèmes serveur sérieux.

Maintenant, ouvre `01_node_vs_browser.md`. Et arrête de mélanger deux mondes qui ne se parlent pas pareil.

> Ce module réutilise : l'event loop du module 03 (`03_async`), la mémoire du module 08 (`08_memory_performance`).

---

## AILLEURS QUE JS

Ce que tu apprends ici n'est pas JS-spécifique :

- **Python / Java / Go / Rust** partagent 90 % de ces mécanismes (allocation
  heap vs stack, contention, backpressure, isolation runtime).
- Le vocabulaire change (`GIL` en Python, `goroutine` en Go, `borrow checker`
  en Rust), le mécanisme sous-jacent reste. Si tu comprends ici, tu portes
  ailleurs en 2 semaines de lecture ciblée.
- Test : explique à quelqu'un qui code Python ce que tu viens d'apprendre.
  Si tu peux, c'est acquis. Sinon, relis.
