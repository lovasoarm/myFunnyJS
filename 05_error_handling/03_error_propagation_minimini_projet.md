## CONTEXTE

Décider où l'erreur s'arrête : la couche données la remonte, la couche UI la traduit. Mélanger les deux produit des messages incompréhensibles.

## APPLICATION

- Trace le chemin d'une erreur de fetch depuis `lib/` jusqu'au composant.
- Fais en sorte que `lib/` ne rende jamais de JSX et que le composant n'affiche jamais un message technique brut.
- Écris le message destiné au visiteur.

## Vérification

Quelle couche connaît la cause, et quelle couche connaît le bon message ?

## 🎬 Tes erreurs remontent proprement

Le visiteur lit une phrase humaine, toi tu gardes la cause technique dans les logs. Commit.
