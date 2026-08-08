## TYPE

Projet fil rouge

## Niveau

🗸 Fondamental

## CONTEXTE

Deux noms sur le même objet, c'est du partage d'état involontaire. Dans le portfolio, ça arrive dès qu'on trie les projets pour la ligne « Continuer à regarder » tout en réutilisant le même tableau ailleurs.

## OBJECTIF

Ton premier utilitaire non destructif.

## APPLICATION

- Écris une fonction `sortByYear(projects)` qui utilise directement `.sort()` sur le tableau reçu.
- Appelle-la, puis affiche le tableau d'origine : constate qu'il a été réordonné.
- Réécris la fonction pour qu'elle retourne un nouveau tableau trié sans toucher l'entrée.
- Garde la version corrigée dans `lib/projects.js`.

## Critère de réussite

- [ ] Écris une fonction `sortByYear(projects)` qui utilise directement `.sort()` sur le tableau reçu.
- [ ] Appelle-la, puis affiche le tableau d'origine.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelles méthodes de tableau modifient l'original, et comment les repères-tu avant de les utiliser ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Garde-fou

Avant de modifier le projet fil rouge :

1. Vérifie que le projet fonctionne.
2. Fais une modification minimale.
3. Vérifie le comportement demandé.
4. Lance les tests/build disponibles.
5. Ne supprime pas une fonctionnalité existante pour satisfaire l'exercice.
6. Si l'expérience est volontairement destructive, fais-la dans `scratch/` ou dans une branche dédiée.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton premier utilitaire non destructif.

`sortByYear` est une vraie pièce du portfolio : c'est elle qui ordonnera tes rangées de projets. Commit ce fichier, il ne sera plus jamais réécrit.
