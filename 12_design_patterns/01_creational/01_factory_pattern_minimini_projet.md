## TYPE

Mini-projet

## Niveau

🗸 Avancé

## CONTEXTE

Une factory centralise la création d'objets conformes. Pour le portfolio : construire un `Project` complet à partir de données partielles, avec ses valeurs par défaut.

## OBJECTIF

Déclarer un projet devient trivial.

## APPLICATION

- Écris `createProject(partiel)` qui remplit les champs par défaut (`status: "concept"`, `featured: false`, `rating: 3`, `stack: []`) et calcule le `slug` à partir du `title`.
- Fais passer tes six projets par cette fabrique.
- Vérifie qu'un projet déclaré avec trois champs seulement reste affichable.

## Critère de réussite

- [ ] Fais passer tes six projets par cette fabrique.
- [ ] Vérifie qu'un projet déclaré avec trois champs seulement reste affichable.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Qu'est-ce qui serait cassé si chaque projet définissait ses valeurs par défaut lui-même ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : déclarer un projet devient trivial.

Le catalogue accepte des entrées minimalistes sans rien casser à l'affichage. Commit.
