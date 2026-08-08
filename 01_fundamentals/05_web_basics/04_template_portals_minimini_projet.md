## TYPE

Mini-projet

## Niveau

🗸 Fondamental

## CONTEXTE

Un portal rend un élément ailleurs dans le DOM tout en gardant l'arbre React. C'est la bonne réponse pour la modale « fiche projet » qui ne doit pas être coupée par un `overflow: hidden` de rangée.

## OBJECTIF

Ta modale projet s'ouvre proprement.

## APPLICATION

- Crée un composant `Modal` qui rend ses enfants via `createPortal` dans `document.body`.
- Ouvre-le au clic sur une carte projet, ferme-le avec Échap et au clic sur le fond.
- Vérifie qu'il s'affiche par-dessus la rangée même quand celle-ci scrolle.

## Critère de réussite

- [ ] Crée un composant `Modal` qui rend ses enfants via `createPortal` dans `document.body`.
- [ ] Ouvre-le au clic sur une carte projet, ferme-le avec Échap et au clic sur le fond.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi le portal résout-il le problème de découpage alors qu'un simple `z-index` ne suffisait pas ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta modale projet s'ouvre proprement.

La fiche projet en overlay, c'est la moitié de l'expérience Netflix. Commit ce composant, tu le réutiliseras partout.
