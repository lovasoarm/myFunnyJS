---
stability: stable
---

# EXO IA MENTEUSE : module 27_team_craft

Temps : ~10 min. Format court, seul ou en binôme.

## Snippet IA plausible

L'assistant te propose ce code, l'air confiant :

```js
Le PR fait 800 lignes mais 'c'est cohérent, tout va ensemble, à merger d'un coup'.
```

Il ajoute : _"C'est propre, testé, prod-ready."_

## Ta question unique

**Où est la faille ?**

Prends 5 minutes. Écris ta réponse **sans** relancer l'IA. Nomme :

1. Le comportement observable qui trompe (pourquoi ça a l'air correct).
2. Le vrai problème (technique, sécurité, complexité, ou sémantique).
3. La correction minimale que **toi** tu apporterais.

## Piste de correction (à ne lire qu'après)

> Un PR de 800 lignes est ininspectable ; la review devient 'LGTM par lassitude'. Où l'IA (et le collègue) confond-ils 'cohérent' et 'reviewable' ?

## Pourquoi cet exo

En 2026, l'IA génère du code **plausible** plus vite qu'elle ne le vérifie.
Le métier n'est plus d'écrire ; c'est de **repérer la faille** dans une
suggestion qui a l'air correcte. Ce drill de 10 min, une fois par module,
te transforme de consommateur en pilote.
