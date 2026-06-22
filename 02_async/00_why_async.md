# POURQUOI CE MODULE MÉRITE TON TEMPS : ASYNC & EVENT LOOP

Ton code JS tourne sur un seul thread (fil d'exécution). Une seule ligne à la fois, jamais deux en même temps. Et pourtant ton serveur gère 10 000 requêtes simultanées sans bloquer. Si tu ne comprends pas comment, tu codes avec un fantôme que tu ne contrôles pas.

L'event loop (boucle d'événements), c'est le moteur caché derrière chaque `fetch`, chaque `setTimeout`, chaque réponse API. Tant que tu ne le vois pas, tu codes async au hasard.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Un serveur qui lit un fichier, interroge une base de données, ou attend une réponse réseau ne peut pas juste freezer pendant l'attente. Si JS bloquait sur chaque opération lente, ton serveur planterait dès 2 utilisateurs simultanés : le premier bloquerait tout le monde pendant qu'il attend sa réponse.

L'event loop résout exactement ça : il permet à JS de lancer une opération longue, de continuer à faire autre chose en attendant, puis de revenir traiter le résultat quand il est prêt. Pas de thread supplémentaire. Pas de magie. Juste une file d'attente bien organisée et un ordre d'exécution précis entre microtasks (tâches micro : promises) et macrotasks (tâches macro : setTimeout, I/O).

Sans comprendre ce mécanisme, le code async devient une boîte noire : tu écris `async/await` parce que "ça marche", mais tu ne sais pas pourquoi deux promises s'exécutent dans un ordre qui te surprend à chaque fois.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui ne comprend pas l'event loop écrit du code qui semble fonctionner... jusqu'à ce qu'il ne fonctionne plus. Une boucle `forEach` avec un `await` dedans qui ne fait pas ce qu'il croit — `forEach` ignore les promises retournées, donc tes opérations s'enchaînent dans le désordre. Un `setTimeout` à 0ms qui s'exécute après tous les `.then()`, et personne ne comprend pourquoi.

Dans `02_garo_no_kronika`, les Chevaliers d'Or doivent répondre à plusieurs alertes Horror en parallèle. Un dev qui ne maîtrise pas `Promise.allSettled` et `Promise.race` va soit bloquer chaque combat l'un après l'autre, soit rater la limite des 99.9 secondes d'armure sans le voir venir. Pas de crash : juste un système qui fonctionne de travers.

Le débogage devient un cauchemar : les erreurs async qu'on oublie de catcher tombent en silence, le stack trace (trace de la pile d'appels) devient illisible parce que l'exécution a sauté entre plusieurs ticks d'event loop.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
appel API                     --> Promise --> attente --> résolution ou rejet
upload de fichier             --> stream asynchrone  --> progress events
notification temps réel       --> WebSocket/SSE      --> event loop qui dispatch
plusieurs requêtes en parallèle --> Promise.all/allSettled --> agrégation
timeout sur une opération     --> Promise.race       --> annulation logique
```

Chaque fois que ton code attend quelque chose qui ne dépend pas du CPU local (réseau, disque, timer), l'event loop est dans la boucle. Un backend Node, un dashboard qui poll une API, une UI qui réagit à des clics pendant qu'un fetch tourne en fond : tout ça, c'est le même mécanisme.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Le mécanisme est intemporel : l'event loop existe depuis les origines de JS dans le navigateur, et Node l'a repris tel quel côté serveur. Ce qui a évolué, c'est la syntaxe pour l'utiliser.

La compréhension de l'event loop lui-même ne se démode jamais. Le moteur tourne pareil en 2026 qu'en 2015 : une seule pile d'exécution, une queue de microtasks, une queue de macrotasks, et un ordre de traitement précis entre les deux.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, on enchaînait les callbacks (fonctions passées en argument pour être appelées plus tard) les unes dans les autres : ça donnait le fameux "callback hell" (pyramide de callbacks imbriqués illisible). Chaque opération async ajoutait un niveau d'indentation, et après 4 ou 5 niveaux, le code devenait impossible à lire ou à débugger.

Les Promises ont résolu le problème de lisibilité en aplatissant la chaîne avec `.then()`. Puis `async/await` a fait la même chose, mais en rendant le code async lisible comme du code synchrone : plus besoin de chaîner mentalement des callbacks, tu lis de haut en bas comme une recette de cuisine.

Le changement n'est pas cosmétique : moins d'erreurs silencieuses, gestion des erreurs centralisée avec `try/catch`, et un code que n'importe quel dev peut relire 6 mois plus tard sans reconstruire la logique dans sa tête.

---

## 6) NOYAU DUR DU MÉTIER ?

Oui, directement dans le noyau dur défini par le curriculum. `01 + 02` (fundamentals + async) forment le duo "sans ça, t'es aveugle". Impossible de toucher à une API, un serveur Node, ou n'importe quel système réseau sans cette base. Le testing, l'error handling, le realtime : tout ce qui vient après suppose que tu sais déjà comment l'event loop traite une opération asynchrone.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Les frameworks changeront leur façon d'exposer l'async (nouveaux hooks, nouvelles abstractions), mais le moteur dessous restera le même tant que JS reste mono-thread avec un event loop. Comprendre ce mécanisme, c'est comprendre pourquoi `async/await` n'est qu'un emballage par-dessus les Promises, qui elles-mêmes ne sont qu'un emballage par-dessus les callbacks et la queue de tâches.

Un dev qui maîtrise l'event loop débugue un problème de performance async en minutes. Un dev qui ne le maîtrise pas ajoute des `await` partout en espérant que ça règle un problème qu'il ne comprend pas.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

JS est mono-thread, et pourtant il gère des milliers d'opérations en attente sans bloquer. Ce module explique comment. Sans lui, l'ordre d'exécution de ton code async reste une superstition. Avec lui, tu lis un `await` dans une boucle et tu sais exactement ce qui va foirer avant même de l'exécuter.

Maintenant, ouvre `01_callback_maze.md`. Le labyrinthe t'attend, et cette fois tu as le plan.
