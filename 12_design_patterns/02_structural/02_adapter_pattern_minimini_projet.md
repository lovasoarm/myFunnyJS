## TYPE

Mini-projet

## Niveau

🗸 Avancé

## CONTEXTE

Un adaptateur traduit une forme de données externe vers ta forme interne. La réponse GitHub n'a pas la forme de ton type `Project`.

## OBJECTIF

L'API externe est isolée derrière un adaptateur.

## APPLICATION

- Écris `adaptGithubRepo(reponseBrute)` qui produit exactement les champs dont ton composant a besoin.
- Fais en sorte qu'aucun composant ne manipule la réponse brute.
- Ajoute un test avec un échantillon réel de la réponse.

## Critère de réussite

- [ ] Écris `adaptGithubRepo(reponseBrute)` qui produit exactement les champs dont ton composant a besoin.
- [ ] Fais en sorte qu'aucun composant ne manipule la réponse brute.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Que se passe-t-il dans ton code le jour où GitHub renomme un champ ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : l'API externe est isolée derrière un adaptateur.

Un seul fichier à changer si l'API bouge. Commit.
