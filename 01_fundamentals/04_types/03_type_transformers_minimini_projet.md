## CONTEXTE

Transformer proprement une donnée brute en donnée d'affichage (année en libellé, note en étoiles, statut en badge) est le travail de la couche présentation.

## APPLICATION

- Crée `lib/format.js`.
- Écris trois petites fonctions : `formatYear`, `formatRating`, `formatStatus`, chacune prenant une valeur brute et renvoyant une chaîne prête à afficher.
- Branche-les dans `ProjectCard` : plus aucune transformation dans le JSX.

## Vérification

Pourquoi ces conversions vivent-elles dans `lib/` et non à l'intérieur du composant ?

## 🎬 Ta couche de formatage existe

`format.js` est une vraie pièce du portfolio, testable au module 6 sans monter un seul composant. Commit-la.
