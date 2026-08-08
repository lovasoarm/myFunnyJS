## CONTEXTE

Un garde de type restreint `unknown` à quelque chose d'utilisable. Indispensable pour valider une réponse d'API avant affichage.

## APPLICATION

- Écris `isGithubRepo(value: unknown)` qui vérifie la présence des champs attendus.
- Utilise-le avant ton adaptateur : si le garde échoue, renvoie le repli.
- Vérifie que TypeScript t'autorise l'accès aux champs seulement après le garde.

## Vérification

Pourquoi le compilateur ne peut-il pas vérifier seul la forme d'une réponse réseau ?

## 🎬 Tes données externes sont validées au runtime

La frontière entre le monde extérieur et ton code typé est étanche. Commit.
