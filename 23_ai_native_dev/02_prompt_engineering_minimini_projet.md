## CONTEXTE

Un bon prompt donne le contexte réel : stack, types existants, contraintes. Sans ça, tu récupères du React générique incompatible avec ton App Router.

## APPLICATION

- Rédige un prompt pour générer un composant de rangée, en y incluant ton type `Project`, ta stack exacte et tes contraintes d'accessibilité.
- Compare le résultat avec un prompt vague sur la même tâche.
- Garde ton meilleur prompt dans `docs/prompts.md`.

## Vérification

Quel élément de contexte a le plus changé la qualité du résultat ?

##Tu as un modèle de prompt réutilisable

Chaque futur composant partira d'un contexte complet. Commit `docs/prompts.md`.
