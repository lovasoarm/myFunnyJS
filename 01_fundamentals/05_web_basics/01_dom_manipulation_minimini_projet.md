## CONTEXTE

En React on ne touche pas le DOM à la main : sauf pour ce que React ne gère pas : focus, mesure, scroll. Un carrousel Netflix a besoin des trois.

## APPLICATION

- Dans un composant client de rangée, crée une `ref` sur le conteneur scrollable.
- Ajoute deux boutons flèche qui font défiler la rangée en modifiant `scrollLeft`.
- Vérifie que tu n'as créé ni sélecteur `document.querySelector` ni manipulation de classe à la main.

## Vérification

Dans quels cas précis une `ref` est-elle légitime plutôt qu'un state ?

##Ta rangée défile comme sur Netflix

Le geste signature du site fonctionne, et il est écrit en React idiomatique. Montre ce résultat à quelqu'un en 2 minutes.
