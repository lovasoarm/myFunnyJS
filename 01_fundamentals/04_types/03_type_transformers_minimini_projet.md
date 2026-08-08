## TYPE

Projet fil rouge

## Niveau

🗸 Fondamental

## CONTEXTE

Transformer proprement une donnée brute en donnée d'affichage (année en libellé, note en étoiles, statut en badge) est le travail de la couche présentation.

## OBJECTIF

Ta couche de formatage existe.

## APPLICATION

- Crée `lib/format.js`.
- Écris trois petites fonctions : `formatYear`, `formatRating`, `formatStatus`, chacune prenant une valeur brute et renvoyant une chaîne prête à afficher.
- Branche-les dans `ProjectCard` : plus aucune transformation dans le JSX.

## Critère de réussite

- [ ] Crée `lib/format.js`.
- [ ] Branche-les dans `ProjectCard`.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi ces conversions vivent-elles dans `lib/` et non à l'intérieur du composant ?

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

Dans ce scénario, tu as vérifié que : ta couche de formatage existe.

`format.js` est une vraie pièce du portfolio, testable au module 6 sans monter un seul composant. Commit-la.
