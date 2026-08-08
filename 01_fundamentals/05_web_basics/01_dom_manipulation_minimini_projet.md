## TYPE

Mini-projet

## Niveau

🗸 Fondamental

## CONTEXTE

En React on ne touche pas le DOM à la main : sauf pour ce que React ne gère pas : focus, mesure, scroll. Un carrousel Netflix a besoin des trois.

## OBJECTIF

Ta rangée défile comme sur Netflix.

## APPLICATION

- Dans un composant client de rangée, crée une `ref` sur le conteneur scrollable.
- Ajoute deux boutons flèche qui font défiler la rangée en modifiant `scrollLeft`.
- Vérifie que tu n'as créé ni sélecteur `document.querySelector` ni manipulation de classe à la main.

## Critère de réussite

- [ ] Dans un composant client de rangée, crée une `ref` sur le conteneur scrollable.
- [ ] Ajoute deux boutons flèche qui font défiler la rangée en modifiant `scrollLeft`.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Dans quels cas précis une `ref` est-elle légitime plutôt qu'un state ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta rangée défile comme sur Netflix.

Le geste signature du site fonctionne, et il est écrit en React idiomatique. Montre ce résultat à quelqu'un en 2 minutes.
