## TYPE

Mini-projet

## Niveau

🗸 Avancé

## CONTEXTE

Les mapped types transforment tous les champs d'un type d'un coup : une version « brouillon » de `Project`, ou une version figée.

## OBJECTIF

Ton catalogue est immuable au niveau des types.

## APPLICATION

- Déclare un type `ReadonlyDeep`-like appliqué à `Project` pour figer aussi `stack` et `description`.
- Applique-le à ton catalogue exporté.
- Constate l'erreur en tentant un `push` sur `stack`.

## Critère de réussite

- [ ] Déclare un type `ReadonlyDeep`-like appliqué à `Project` pour figer aussi `stack` et `description`.
- [ ] Applique-le à ton catalogue exporté.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle différence pratique entre `Readonly<Project>` et ta version profonde ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton catalogue est immuable au niveau des types.

La règle d'immutabilité du module 11 est désormais vérifiée par le compilateur. Commit.
