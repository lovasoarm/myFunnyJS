## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

`tsconfig.json` décide de la sévérité du compilateur. `strict` activé dès maintenant coûte une heure ; activé plus tard, une semaine.

## OBJECTIF

Ton compilateur est en mode strict.

## APPLICATION

- Active `strict`, `noUncheckedIndexedAccess` et `noUnusedLocals` dans ton `tsconfig.json`.
- Corrige les erreurs qui apparaissent, en priorité celles liées aux accès par index.
- Vérifie que `next build` passe.

## Critère de réussite

- [ ] Active `strict`, `noUncheckedIndexedAccess` et `noUnusedLocals` dans ton `tsconfig.json`.
- [ ] Corrige les erreurs qui apparaissent, en priorité celles liées aux accès par index.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Qu'est-ce que `noUncheckedIndexedAccess` t'a forcé à gérer que tu ignorais ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton compilateur est en mode strict.

Le portfolio est protégé par défaut contre les `undefined` silencieux. Commit `tsconfig.json`.
