---
stability: perissable_2027
---

# 03 : Distributed tracing (papier d'abord)
Temps de lecture ~5 min

> **Principe universel** : dans un système distribué, un ID de corrélation qui traverse **tous** les services est ce qui te rend capable de raisonner.

## Vocabulaire

- **Trace** : le voyage complet d'une requête à travers N services.
- **Span** : une étape (une fonction, un appel réseau).
- **Correlation ID** : l'identifiant unique attaché à la trace, propagé via headers (`traceparent` W3C).

## Exercice papier

On te fournit ces logs bruts :

```
[svc-A] 12:00:00.100 req=abc GET /patrol/42 -> 12:00:00.230 200
[svc-B] 12:00:00.130 req=abc SELECT patrols -> 12:00:00.180
[svc-B] 12:00:00.185 req=abc SELECT scouts -> 12:00:00.220
[svc-C] 12:00:00.140 req=abc radio.check -> 12:00:00.215
```

1. Dessine la trace en cascade (Gantt).
2. Où est le **chemin critique** ?
3. Une optimisation potentielle : laquelle, et quel gain ?
4. Sans le corrélation ID `abc`, qu'est-ce qui devient impossible ?

## (attention) Ce que l'outil cache

Une trace n'explique pas **pourquoi** un span est lent. Elle te dit **où** chercher.
