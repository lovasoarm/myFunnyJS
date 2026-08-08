## TYPE

Projet fil rouge

## Niveau

🗸 Avancé

## Prérequis

- Connaître la frontière Server / Client de l'App Router Next.js

## CONTEXTE

Un bon prompt donne le contexte réel : stack, types existants, contraintes. Sans ça, tu récupères du React générique incompatible avec ton App Router.

## OBJECTIF

Tu as un modèle de prompt réutilisable.

## APPLICATION

- Rédige un prompt pour générer un composant de rangée, en y incluant ton type `Project`, ta stack exacte et tes contraintes d'accessibilité.
- Compare le résultat avec un prompt vague sur la même tâche.
- Garde ton meilleur prompt dans `docs/prompts.md`.

## Critère de réussite

- [ ] Rédige un prompt pour générer un composant de rangée, en y incluant ton type `Project`, ta stack exacte et tes contraintes d'accessibilité.
- [ ] Compare le résultat avec un prompt vague sur la même tâche.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quel élément de contexte a le plus changé la qualité du résultat ?

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

Dans ce scénario, tu as vérifié que : tu as un modèle de prompt réutilisable.

Chaque futur composant partira d'un contexte complet. Commit `docs/prompts.md`.
