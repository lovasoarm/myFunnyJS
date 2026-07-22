---
stability: stable
---

# EXO IA MENTEUSE : module 10_algorithms

Temps : ~10 min. Format court, seul ou en binôme.

## Snippet IA plausible

L'assistant te propose ce code, l'air confiant :

```js
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
} // 'assez rapide'
```

Il ajoute : _"C'est propre, testé, prod-ready."_

## Ta question unique

**Où est la faille ?**

Prends 5 minutes. Écris ta réponse **sans** relancer l'IA. Nomme :

1. Le comportement observable qui trompe (pourquoi ça a l'air correct).
2. Le vrai problème (technique, sécurité, complexité, ou sémantique).
3. La correction minimale que **toi** tu apporterais.

## Piste de correction (à ne lire qu'après)

> Fib récursif naïf est O(2^n). Fib(40) déjà pénible, Fib(50) impossible. Où l'IA t'a-t-elle vendu 'assez rapide' sans mesure ?

## Pourquoi cet exo

En 2026, l'IA génère du code **plausible** plus vite qu'elle ne le vérifie.
Le métier n'est plus d'écrire ; c'est de **repérer la faille** dans une
suggestion qui a l'air correcte. Ce drill de 10 min, une fois par module,
te transforme de consommateur en pilote.
