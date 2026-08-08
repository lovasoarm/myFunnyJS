## TYPE

Micro-drill

## Niveau

🗸 Intermédiaire

## CONTEXTE

ARIA complète le HTML sémantique, il ne le remplace pas. Une carte cliquable doit être un lien ou un bouton, pas une `div` avec `role`.

## APPLICATION

- Vérifie que chaque carte projet est un vrai lien vers sa fiche.
- Donne à chaque rangée un intitulé accessible (`aria-label` ou titre lié).
- Vérifie que ta modale a `role="dialog"`, `aria-modal` et un titre associé.

## Critère de réussite

- [ ] Vérifie que chaque carte projet est un vrai lien vers sa fiche.
- [ ] Donne à chaque rangée un intitulé accessible (`aria-label` ou titre lié).
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quand un attribut ARIA devient-il inutile parce que le HTML fait déjà le travail ?

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta structure est annoncée correctement.

Les rangées et la modale du portfolio sont compréhensibles sans les voir. Commit.
