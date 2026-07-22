---
stability: intemporel
---

# POSTMORTEM : PRISON BREAK API
Temps de lecture ~5 min

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


## Protection des données

Si tu mentionnes des données réelles (users, clients, endpoints internes), anonymise-les ou remplace par des noms fictifs. Un post-mortem est destiné à circuler.


---

## PUBLICATION (obligatoire)

- Lien du dépôt public : `https://github.com/<toi>/<projet>`
- Lien du billet de blog (si rédigé) : ...
- Date de publication : ...
- Peer-review reçue de : `@pseudo`

## Comment j'ai encaissé le drift

Section obligatoire si `SPEC_DRIFT_MODE=on` (voir `SPEC_DRIFT_TRIGGERS.md`).
Une ligne par déclencheur activé (J+1, J+3, J+5) avec le coût réel payé.
---

## OWASP PASSE (obligatoire, gate securite)

> Cette section est un **gate**. Un POSTMORTEM sans elle est rejete par le
> la securite redevient un module theorique.
>
> Reference : `22_security/06_owasp_checklist.md`.

Pour chaque item OWASP Top 10, coche exactement une case :

- [ ] A01 Broken Access Control : verifie / non verifie / non applicable (justifier)
- [ ] A02 Cryptographic Failures : verifie / non verifie / non applicable (justifier)
- [ ] A03 Injection : verifie / non verifie / non applicable (justifier)
- [ ] A04 Insecure Design : verifie / non verifie / non applicable (justifier)
- [ ] A05 Security Misconfiguration : verifie / non verifie / non applicable (justifier)
- [ ] A06 Vulnerable Components : verifie / non verifie / non applicable (justifier)
- [ ] A07 Identification & Auth Failures : verifie / non verifie / non applicable (justifier)
- [ ] A08 Software & Data Integrity Failures : verifie / non verifie / non applicable (justifier)
- [ ] A09 Security Logging & Monitoring : verifie / non verifie / non applicable (justifier)
- [ ] A10 Server-Side Request Forgery : verifie / non verifie / non applicable (justifier)

> Une case "non applicable" sans justification = gate echoue.
