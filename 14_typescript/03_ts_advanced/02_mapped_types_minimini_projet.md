## CONTEXTE

Les mapped types transforment tous les champs d'un type d'un coup : une version « brouillon » de `Project`, ou une version figée.

## APPLICATION

- Déclare un type `ReadonlyDeep`-like appliqué à `Project` pour figer aussi `stack` et `description`.
- Applique-le à ton catalogue exporté.
- Constate l'erreur en tentant un `push` sur `stack`.

## Vérification

Quelle différence pratique entre `Readonly<Project>` et ta version profonde ?

## 🎬 Ton catalogue est immuable au niveau des types

La règle d'immutabilité du module 11 est désormais vérifiée par le compilateur. Commit.
