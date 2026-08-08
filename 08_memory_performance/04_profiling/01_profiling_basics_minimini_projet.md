## TYPE

Projet fil rouge

## Niveau

🗸 Intermédiaire

## CONTEXTE

« Le site est rapide » n'est pas une mesure. Profiler une page réelle du portfolio remplace l'impression par des chiffres reproductibles.

## OBJECTIF

Tu disposes d'une mesure de départ sur une page réelle du portfolio.

## APPLICATION

- Lance le build de production en local et ouvre l'accueil du portfolio.
- Enregistre un profil de performance pendant le chargement, puis pendant une interaction (ouverture d'une fiche projet).
- Relève trois chiffres : temps de chargement perçu, tâche la plus longue, poids du JavaScript envoyé.
- Note ces chiffres dans `docs/performance.md` comme point de référence daté, avant toute optimisation.

## Critère de réussite

- [ ] Fait : les trois chiffres sont relevés sur un build de production, pas en développement.
- [ ] Fait : `docs/performance.md` contient une mesure de référence datée.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi une mesure faite en mode développement peut-elle induire en erreur ?

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

Dans ce scénario, tu as vérifié que : la performance de ton site peut être décrite par des chiffres reproductibles.

Toute optimisation future se comparera à cette référence. Commit `docs/performance.md`.
