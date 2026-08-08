## CONTEXTE

`try/catch` protège une frontière, pas tout le code. Sur le portfolio, les frontières sont : appels réseau, lecture de stockage, parsing JSON.

## APPLICATION

- Recense les trois frontières ci-dessus dans ton code.
- Protège chacune avec un `try/catch` qui renvoie une valeur de repli utilisable.
- Vérifie qu'aucun `catch` ne reste vide ou ne se contente d'un `console.log`.

## Vérification

Pourquoi un `catch` vide est-il pire que pas de `catch` du tout ?

##Tes frontières risquées sont couvertes

Trois points de rupture réels du portfolio sont sécurisés. Commit.
