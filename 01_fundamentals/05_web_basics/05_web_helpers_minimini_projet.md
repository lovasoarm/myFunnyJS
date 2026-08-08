## CONTEXTE

Les API natives du navigateur (IntersectionObserver, matchMedia, clipboard) remplacent des dépendances entières. Un portfolio léger doit s'appuyer dessus.

## APPLICATION

- Écris un hook `usePrefersReducedMotion` basé sur `matchMedia`.
- Utilise-le pour désactiver l'animation d'entrée des cartes.
- Ajoute un bouton « copier mon email » utilisant l'API clipboard, avec un retour visuel.

## Vérification

Quel bénéfice concret un visiteur tire-t-il de `prefers-reduced-motion` respecté ?

##Ton site respecte les préférences système

Deux fonctionnalités réelles, zéro dépendance ajoutée. Commit ces hooks.
