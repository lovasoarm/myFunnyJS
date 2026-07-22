---
stability: intemporel
---

# PONT : de modéliser un problème à raisonner sur le temps à l'asynchrone

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `02_problem_solving` et `03_async`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

Tu viens de modéliser des états, invariants, transitions. `03_async/` ajoute une dimension : le temps qui passe entre deux états. Un modèle statique juste devient un modèle faux dès qu'on introduit une attente réseau, un timer, un handler d'événement.

## CE QUE TU MAÎTRISES DÉJÀ

- Décrire un domaine en états et transitions.
- Identifier des invariants qui doivent tenir tout le temps.
- Séparer données, contrat, et implémentation.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **Callback** : une fonction qu'on te promet d'appeler plus tard.
- **Promise** : un contrat sur une valeur pas encore là.
- **Event loop** : l'ordonnanceur qui décide quoi exécuter maintenant.
- **Microtask / macrotask** : deux files d'attente avec des priorités distinctes.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Croire qu'un `await` "bloque" comme un appel synchrone. Il ne bloque pas : il rend la main à l'event loop et reprend plus tard. Ton modèle mental doit intégrer que d'autres choses se passent entre le début et la fin d'une fonction async.

## EXERCICE-CHARNIÈRE (5 min chrono)

Sans lancer Node : quel est l'ordre d'affichage ?
```js
console.log('A');
queueMicrotask(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
Promise.resolve().then(() => console.log('D'));
console.log('E');
```
Réponse attendue : `A E B D C`. Si tu hésites, ouvre `03_async/04_event_loop/`.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
