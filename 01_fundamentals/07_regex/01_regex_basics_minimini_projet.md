## TYPE

Micro-drill

## Niveau

🗸 Fondamental

## CONTEXTE

Une regex simple suffit pour générer et valider les slugs d'URL de tes projets (`/projects/safe-driving`). Un slug faux = une 404.

## APPLICATION

- Écris `slugify(title)` dans `lib/format.js` : minuscules, accents retirés, tout caractère non alphanumérique remplacé par un tiret, tirets en trop supprimés.
- Teste-la sur les six titres réels du catalogue.
- Vérifie que `Safe-driving` et `MyFunnyJS` produisent bien ce que tu attends.

## Critère de réussite

- [ ] Teste-la sur les six titres réels du catalogue.
- [ ] Vérifie que `Safe-driving` et `MyFunnyJS` produisent bien ce que tu attends.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle partie de ta regex empêche les doubles tirets, et pourquoi le drapeau `g` est-il nécessaire ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes URLs de projets sont générées.

Les routes dynamiques du portfolio ont maintenant une source fiable. Commit `format.js`.
