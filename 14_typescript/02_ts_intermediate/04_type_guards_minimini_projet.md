## TYPE

Micro-drill

## Niveau

🗸 Intermédiaire

## CONTEXTE

Un garde de type restreint `unknown` à quelque chose d'utilisable. Indispensable pour valider une réponse d'API avant affichage.

## APPLICATION

- Écris `isGithubRepo(value: unknown)` qui vérifie la présence des champs attendus.
- Utilise-le avant ton adaptateur : si le garde échoue, renvoie le repli.
- Vérifie que TypeScript t'autorise l'accès aux champs seulement après le garde.

## Critère de réussite

- [ ] Écris `isGithubRepo(value: unknown)`.
- [ ] Utilise-le avant ton adaptateur.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi le compilateur ne peut-il pas vérifier seul la forme d'une réponse réseau ?

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes données externes sont validées au runtime.

La frontière entre le monde extérieur et ton code typé est étanche. Commit.
