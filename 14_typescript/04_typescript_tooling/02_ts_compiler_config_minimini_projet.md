## CONTEXTE

`tsconfig.json` décide de la sévérité du compilateur. `strict` activé dès maintenant coûte une heure ; activé plus tard, une semaine.

## APPLICATION

- Active `strict`, `noUncheckedIndexedAccess` et `noUnusedLocals` dans ton `tsconfig.json`.
- Corrige les erreurs qui apparaissent, en priorité celles liées aux accès par index.
- Vérifie que `next build` passe.

## Vérification

Qu'est-ce que `noUncheckedIndexedAccess` t'a forcé à gérer que tu ignorais ?

## 🎬 Ton compilateur est en mode strict

Le portfolio est protégé par défaut contre les `undefined` silencieux. Commit `tsconfig.json`.
