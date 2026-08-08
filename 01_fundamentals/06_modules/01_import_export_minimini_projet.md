## TYPE

Mini-projet

## Niveau

🗸 Fondamental

## CONTEXTE

ESM, imports nommés vs par défaut, alias `@/` : les conventions d'import décident de la lisibilité du portfolio quand il atteindra 40 fichiers.

## OBJECTIF

Tes imports sont propres partout.

## APPLICATION

- Configure (ou vérifie) l'alias `@/*` dans `tsconfig.json`.
- Convertis tous tes imports relatifs profonds (`../../`) en imports d'alias.
- Adopte une règle : export nommé pour les utilitaires, export par défaut pour les composants de page.

## Critère de réussite

- [ ] Configure (ou vérifie) l'alias `@/*` dans `tsconfig.json`.
- [ ] Convertis tous tes imports relatifs profonds (`../../`) en imports d'alias.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quel problème concret l'alias `@/` résout-il quand tu déplaces un fichier ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes imports sont propres partout.

Le projet est maintenant déplaçable sans casse. Commit `tsconfig.json` et les fichiers touchés.
