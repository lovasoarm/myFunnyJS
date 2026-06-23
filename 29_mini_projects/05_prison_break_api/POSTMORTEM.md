# POSTMORTEM : PRISON BREAK API

---

## CE QUI A BIEN MARCHÉ

Tester le sanitizer avant de monter Express a évité de devoir écrire des tests d'intégration pour ce qui est en fait une logique de validation pure. La règle "tester le sanitizer sans serveur" semble évidente a posteriori, mais la tentation de tout tester via supertest est forte. Résister à cette tentation a produit des tests plus rapides et plus ciblés.

Le `errorHandler.js` centralisé a payé très vite : aucune route ne s'est retrouvée à gérer l'exposition des stack traces. Une seule règle à un seul endroit.

---

## DÉCISION DIFFICILE N°1 : ALLOWLIST OU BLOCKLIST POUR LA VALIDATION ?

Deux approches pour le sanitizer :
- Blocklist : définir les patterns interdits (injection SQL connue, tags HTML dangereux).
- Allowlist : définir le format exact autorisé et rejeter tout le reste.

Décision : allowlist. La blocklist a un problème fondamental : T-Bag peut encoder autrement, utiliser des variantes Unicode, ou trouver un pattern non prévu. L'allowlist refuse tout ce qui ne correspond pas exactement au format attendu, y compris les variantes futures non anticipées.

**Ce que ça coûte :** être plus restrictif sur les formats d'input. Un code prisonnier ne peut contenir que des lettres, des chiffres, et des tirets. T-Bag ne peut pas rentrer par une porte non prévue.

---

## DÉCISION DIFFICILE N°2 : REDIS POUR QUELS ENDPOINTS ?

Le cahier des charges demandait Redis pour cacher les plans souvent consultés. La question : cacher au niveau route ou au niveau service ?

Décision : niveau service, dans `planService.js`. La route ne sait pas si la réponse vient du cache ou de la DB. Le cache est un détail d'implémentation, pas une responsabilité de la route.

**Ce que ça coûte :** invalidation plus complexe à gérer (si un plan change, `planService` doit invalider le cache). Mis en place via un événement `plan:updated` qui déclenche un `redis.del()`.

---

## CE QUI A SURPRIS

Le test de rate limiting avec `jest.useFakeTimers()` a révélé un comportement inattendu : le `setInterval` interne du rate limiter pour nettoyer les compteurs expirés ne se déclenchait pas correctement avec les faux timers. Fix : appeler `jest.runAllTimers()` explicitement dans le teardown du test.

Ce n'est pas documenté clairement dans la doc Jest. Le bug a coûté une heure de debugging. Documenté ici pour la prochaine fois.

---

## CE QUI RESTERAIT À FAIRE DANS UNE V2

```
- Audit log : chaque accès à un plan est enregistré avec timestamp et identité
- Notifications temps réel (SSE) quand une phase d'évasion est déclenchée
- Tests de charge pour vérifier que le rate limiter tient sous 1000 requêtes/seconde
```
