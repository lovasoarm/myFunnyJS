## TYPE

Micro-drill

## Niveau

🗸 Avancé

## CONTEXTE

Microtâches avant macrotâches : c'est ce qui explique l'ordre exact des mises à jour et certains scintillements d'interface.

## APPLICATION

- Écris dans un handler de clic un `console.log` synchrone, un `Promise.resolve().then(...)` et un `setTimeout(..., 0)`.
- Prédis l'ordre AVANT d'exécuter, puis compare.
- Note l'écart éventuel entre ta prédiction et la réalité.

## Critère de réussite

- [ ] Écris dans un handler de clic un `console.log` synchrone, un `Promise.resolve().then(...)` et un `setTimeout(..., 0)`.
- [ ] Prédis l'ordre AVANT d'exécuter, puis compare.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi un `setTimeout(fn, 0)` s'exécute-t-il après une promesse déjà résolue ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tu prédis l'ordre d'exécution.

Tu peux maintenant raisonner sur les timings d'animation du splash sans deviner.
