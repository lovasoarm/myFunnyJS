## CONTEXTE

Deux noms sur le même objet, c'est du partage d'état involontaire. Dans le portfolio, ça arrive dès qu'on trie les projets pour la ligne « Continuer à regarder » tout en réutilisant le même tableau ailleurs.

## APPLICATION

- Écris une fonction `sortByYear(projects)` qui utilise directement `.sort()` sur le tableau reçu.
- Appelle-la, puis affiche le tableau d'origine : constate qu'il a été réordonné.
- Réécris la fonction pour qu'elle retourne un nouveau tableau trié sans toucher l'entrée.
- Garde la version corrigée dans `lib/projects.js`.

## Vérification

Quelles méthodes de tableau modifient l'original, et comment les repères-tu avant de les utiliser ?

##Ton premier utilitaire non destructif

`sortByYear` est une vraie pièce du portfolio : c'est elle qui ordonnera tes rangées de projets. Commit ce fichier, il ne sera plus jamais réécrit.
