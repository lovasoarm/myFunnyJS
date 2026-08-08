## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

`try/catch` protège une frontière, pas tout le code. Sur le portfolio, les frontières sont : appels réseau, lecture de stockage, parsing JSON.

## OBJECTIF

Tes frontières risquées sont couvertes.

## APPLICATION

- Recense les trois frontières ci-dessus dans ton code.
- Protège chacune avec un `try/catch` qui renvoie une valeur de repli utilisable.
- Vérifie qu'aucun `catch` ne reste vide ou ne se contente d'un `console.log`.

## Critère de réussite

- [ ] Recense les trois frontières ci-dessus dans ton code.
- [ ] Protège chacune avec un `try/catch` qui renvoie une valeur de repli utilisable.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi un `catch` vide est-il pire que pas de `catch` du tout ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes frontières risquées sont couvertes.

Trois points de rupture réels du portfolio sont sécurisés. Commit.
