---
stability: stable
---

# EXO IA MENTEUSE : module 08_memory_performance

Temps : ~10 min. Format court, seul ou en binôme.

## Snippet IA plausible

L'assistant te propose ce code, l'air confiant :

```js
const cache = {};
function get(k) {
  if (!cache[k]) cache[k] = fetch(k);
  return cache[k];
}
```

Il ajoute : _"C'est propre, testé, prod-ready."_

## Ta question unique

**Où est la faille ?**

Prends 5 minutes. Écris ta réponse **sans** relancer l'IA. Nomme :

1. Le comportement observable qui trompe (pourquoi ça a l'air correct).
2. Le vrai problème (technique, sécurité, complexité, ou sémantique).
3. La correction minimale que **toi** tu apporterais.

## Piste de correction (à ne lire qu'après)

> cache[k] = fetch(k) stocke la Promise, pas le résultat. Et le cache n'a aucune éviction : fuite mémoire garantie en prod. Où l'IA a-t-elle inventé la 'mémoïsation' sans la nommer ?

## Pourquoi cet exo

En 2026, l'IA génère du code **plausible** plus vite qu'elle ne le vérifie.
Le métier n'est plus d'écrire ; c'est de **repérer la faille** dans une
suggestion qui a l'air correcte. Ce drill de 10 min, une fois par module,
te transforme de consommateur en pilote.
