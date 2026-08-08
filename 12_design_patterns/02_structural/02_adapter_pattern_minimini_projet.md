## CONTEXTE

Un adaptateur traduit une forme de données externe vers ta forme interne. La réponse GitHub n'a pas la forme de ton type `Project`.

## APPLICATION

- Écris `adaptGithubRepo(reponseBrute)` qui produit exactement les champs dont ton composant a besoin.
- Fais en sorte qu'aucun composant ne manipule la réponse brute.
- Ajoute un test avec un échantillon réel de la réponse.

## Vérification

Que se passe-t-il dans ton code le jour où GitHub renomme un champ ?

## 🎬 L'API externe est isolée derrière un adaptateur

Un seul fichier à changer si l'API bouge. Commit.
