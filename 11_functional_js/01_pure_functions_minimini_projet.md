## CONTEXTE

Une fonction pure : même entrée, même sortie, aucun effet de bord. C'est ce qui rend `format.js` et `projects.js` testables sans monter React.

## APPLICATION

- Audite tes fonctions de `lib/` et repère celles qui lisent une variable externe ou écrivent quelque part.
- Rends-les pures en passant les dépendances en paramètre.
- Vérifie que tes tests existants passent toujours.

## Vérification

Quelle fonction n'a pas pu devenir pure, et pourquoi c'est légitime ?

##Ta couche lib est pure et testable

Chaque fonction de sélection est vérifiable en une ligne de test. Commit.
