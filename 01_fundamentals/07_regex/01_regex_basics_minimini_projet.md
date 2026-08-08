## CONTEXTE

Une regex simple suffit pour générer et valider les slugs d'URL de tes projets (`/projects/safe-driving`). Un slug faux = une 404.

## APPLICATION

- Écris `slugify(title)` dans `lib/format.js` : minuscules, accents retirés, tout caractère non alphanumérique remplacé par un tiret, tirets en trop supprimés.
- Teste-la sur les six titres réels du catalogue.
- Vérifie que `Safe-driving` et `MyFunnyJS` produisent bien ce que tu attends.

## Vérification

Quelle partie de ta regex empêche les doubles tirets, et pourquoi le drapeau `g` est-il nécessaire ?

##Tes URLs de projets sont générées

Les routes dynamiques du portfolio ont maintenant une source fiable. Commit `format.js`.
