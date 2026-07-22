---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# Closures : expliqué à 3 publics

-> ~10 min

## À UN ENFANT

Imagine une boîte à jouets fermée à clé. Tu donnes la clé à ton frère. Lui n'a jamais vu tes jouets, mais quand il ouvre, il peut jouer avec **exactement les mêmes** que quand tu as fermé la boîte. La fonction qui "ferme la boîte", c'est une closure : elle emporte avec elle les variables telles qu'elles étaient au moment de sa création.

## À UN PAIR DEV

Une closure = une fonction + son environnement lexical capturé. Techniquement, le moteur JS garde vivant le scope parent tant que la fonction interne est référencée. Conséquences concrètes :

- **Data hiding** : émuler du privé sans `#field` (avant ES2022).
- **Module pattern** : IIFE qui expose une API publique, cache l'état interne.
- **Piège mémoire n°1** : une closure sur une grosse variable dans un event handler garde cette variable vivante indéfiniment.
- **Piège n°2** : `for (var i=0;…)` + `setTimeout(()=>console.log(i))` → toutes les closures partagent le même `i`. `let` isole par itération.

## À UN CTO

Les closures sont la base de la modularité JS avant les modules ES6, et restent la source n°1 de fuites mémoire subtiles (heap qui grimpe sans OOM immédiat, dégradation lente sur 48h). Coût : un dev qui ne maîtrise pas les closures produit du code qui **tourne en dev** et **fuit en prod**. Signal d'embauche : "explique-moi une fuite mémoire causée par une closure que tu as debug" → si la réponse est floue, red flag junior.
