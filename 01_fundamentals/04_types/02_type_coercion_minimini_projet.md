## CONTEXTE

JavaScript convertit silencieusement. Une note « 9.1 » venue d'une chaîne, un `progress` à 0 traité comme faux : deux bugs d'affichage classiques sur un portfolio.

## APPLICATION

- Dans un composant, affiche conditionnellement une barre de progression avec `{progress && <Bar/>}` alors que `progress` vaut `0`.
- Constate ce qui s'affiche à l'écran.
- Corrige avec un test explicite sur `null`.
- Note en commentaire les valeurs falsy qui t'ont piégé.

## Vérification

Pourquoi `{0 && <Bar/>}` affiche-t-il `0` à l'écran en React ?

## 🎬 Ta barre de progression ne ment plus

Tu viens de corriger un bug d'affichage réel qui touche exactement Safe-driving (48 %) et MyFunnyJS (62 %). Commit le composant.
