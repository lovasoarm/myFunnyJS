## CONTEXTE

Une factory centralise la création d'objets conformes. Pour le portfolio : construire un `Project` complet à partir de données partielles, avec ses valeurs par défaut.

## APPLICATION

- Écris `createProject(partiel)` qui remplit les champs par défaut (`status: "concept"`, `featured: false`, `rating: 3`, `stack: []`) et calcule le `slug` à partir du `title`.
- Fais passer tes six projets par cette fabrique.
- Vérifie qu'un projet déclaré avec trois champs seulement reste affichable.

## Vérification

Qu'est-ce qui serait cassé si chaque projet définissait ses valeurs par défaut lui-même ?

## 🎬 Déclarer un projet devient trivial

Le catalogue accepte des entrées minimalistes sans rien casser à l'affichage. Commit.
