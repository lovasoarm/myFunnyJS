## CONTEXTE

Un portal rend un élément ailleurs dans le DOM tout en gardant l'arbre React. C'est la bonne réponse pour la modale « fiche projet » qui ne doit pas être coupée par un `overflow: hidden` de rangée.

## APPLICATION

- Crée un composant `Modal` qui rend ses enfants via `createPortal` dans `document.body`.
- Ouvre-le au clic sur une carte projet, ferme-le avec Échap et au clic sur le fond.
- Vérifie qu'il s'affiche par-dessus la rangée même quand celle-ci scrolle.

## Vérification

Pourquoi le portal résout-il le problème de découpage alors qu'un simple `z-index` ne suffisait pas ?

## 🎬 Ta modale projet s'ouvre proprement

La fiche projet en overlay, c'est la moitié de l'expérience Netflix. Commit ce composant, tu le réutiliseras partout.
