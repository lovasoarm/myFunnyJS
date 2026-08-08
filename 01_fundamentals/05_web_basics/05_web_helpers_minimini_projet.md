## TYPE

Mini-projet

## Niveau

🗸 Fondamental

## CONTEXTE

Les API natives du navigateur (IntersectionObserver, matchMedia, clipboard) remplacent des dépendances entières. Un portfolio léger doit s'appuyer dessus.

## OBJECTIF

Ton site respecte les préférences système.

## APPLICATION

- Écris un hook `usePrefersReducedMotion` basé sur `matchMedia`.
- Utilise-le pour désactiver l'animation d'entrée des cartes.
- Ajoute un bouton « copier mon email » utilisant l'API clipboard, avec un retour visuel.

## Critère de réussite

- [ ] Écris un hook `usePrefersReducedMotion` basé sur `matchMedia`.
- [ ] Utilise-le pour désactiver l'animation d'entrée des cartes.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quel bénéfice concret un visiteur tire-t-il de `prefers-reduced-motion` respecté ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton site respecte les préférences système.

Deux fonctionnalités réelles, zéro dépendance ajoutée. Commit ces hooks.
