---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# 10 : Juger une réponse d'IA avant de la tester

Temps de lecture ~2 min


Accroche : l'IA te rend un code qui compile, qui a l'air propre, qui passe ton test rapide. Et pourtant il est cassé sur un edge case que tu n'as pas vu. Ton job d'ingénieur : douter AVANT d'exécuter.

## La situation

Tu demandes à une IA une fonction qui découpe un tableau en lots (chunks) de taille N. Elle te répond, très sûre d'elle :

```js
function chunk(arr, size) {
 const out = [];
 for (let i = 0; i < arr.length; i += size) {
  out.push(arr.slice(i, i + size));
 }
 return out;
}
```

Ça marche pour `chunk([1,2,3,4,5], 2)`. L'IA affirme que c'est robuste.

## Ta mission (avant de lancer quoi que ce soit)

1. AVANT d'exécuter : écris dans un fichier `JUGEMENT.md` ta prédiction. Cette fonction est-elle fiable ? Sur quels inputs va-t-elle mentir ?
2. Liste au moins 3 edge cases non couverts par l'exemple de l'IA.
3. ENSUITE seulement, teste tes edge cases et compare à ta prédiction.

## Pistes de doute (ne les lis qu'après avoir écrit ta prédiction)

- `size = 0` : boucle infinie. L'IA n'a pas gardé le cas.
- `size` négatif : comportement absurde silencieux.
- `arr` non-tableau : crash non géré, message qui fuit l'implémentation.

## Critère de réussite

Tu as identifié au moins un bug AVANT de le tester. Si tu ne l'as vu qu'après exécution, tu as encore le réflexe "je fais confiance puis je vérifie". Le bon réflexe : "je juge, PUIS je vérifie mon jugement".

## (attention) CE QUE L'EXERCICE RÉVÈLE

Une IA n'a pas honte de se tromper avec assurance. Comme un coéquipier trop confiant qui jure que la passe va passer : tu ne le crois pas sur parole, tu regardes le terrain. La fiabilité d'une réponse ne se lit pas dans son ton, elle se prouve sur les edge cases.
