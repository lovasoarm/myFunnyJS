## CONTEXTE

ESM, imports nommés vs par défaut, alias `@/` : les conventions d'import décident de la lisibilité du portfolio quand il atteindra 40 fichiers.

## APPLICATION

- Configure (ou vérifie) l'alias `@/*` dans `tsconfig.json`.
- Convertis tous tes imports relatifs profonds (`../../`) en imports d'alias.
- Adopte une règle : export nommé pour les utilitaires, export par défaut pour les composants de page.

## Vérification

Quel problème concret l'alias `@/` résout-il quand tu déplaces un fichier ?

##Tes imports sont propres partout

Le projet est maintenant déplaçable sans casse. Commit `tsconfig.json` et les fichiers touchés.
