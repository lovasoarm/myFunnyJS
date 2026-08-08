## CONTEXTE

Les règles de `this` (appel simple, méthode, `bind`, fléchée) importent au seul endroit du portfolio où une classe reste obligatoire : l'`ErrorBoundary` React.

## APPLICATION

- Écris une classe `ErrorBoundary` avec `getDerivedStateFromError` et `componentDidCatch`.
- Utilise `this.state` et `this.props` correctement, sans handler perdant son contexte.
- Enveloppe une rangée avec, puis provoque une erreur dans une carte : le reste de la page doit rester debout.

## Vérification

Pourquoi `getDerivedStateFromError` est-elle statique alors que `componentDidCatch` ne l'est pas ?

##Une erreur de carte ne tue plus la page

Ton portfolio dégrade proprement au lieu d'afficher un écran blanc. Commit ce composant.
