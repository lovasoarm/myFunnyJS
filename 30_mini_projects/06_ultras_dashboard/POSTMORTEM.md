---
stability: intemporel
---

# POSTMORTEM : ULTRAS DASHBOARD
Temps de lecture ~5 min

---

## CE QUI A BIEN MARCHÉ

TypeScript a attrapé des bugs avant même de lancer un test. Deux exemples concrets : une fonction de `aggregateStage` qui retournait `number | undefined` au lieu de `number` (attrapé par le type de retour du stage), et une tentative de passer une string là où un timestamp `number` était attendu. Sans TypeScript, ces bugs auraient nécessité des tests supplémentaires pour être détectés au runtime.

Le système d'alertes avec seuils configurables a payé pendant les tests : pouvoir créer un `AlertEngine({ xGThreshold: 0.001 })` pour forcer les alertes dans les tests est bien plus simple que de simuler 2.5 xG d'events réels.

---

## DÉCISION DIFFICILE N°1 : GENERICS SUR LE PIPELINE OU TYPES UNION ?

Pour que `Pipeline<Input, Output>` soit utile, chaque stage doit avoir un type d'entrée et un type de sortie compatibles avec le stage précédent.

Deux options :
1. Generics chainés : `Stage<A, B>` puis `Stage<B, C>` etc. TypeScript valide la composition au compile time.
2. Type union : chaque stage accepte `MatchEvent<any>` et retourne `MatchEvent<any>`.

Décision : generics chainés. La sécurité de type sur la composition du pipeline est exactement ce que ce projet doit démontrer. L'option union aurait été plus simple à coder mais aurait vidé l'intérêt de TypeScript.

**Ce que ça coûte :** construire un pipeline est plus verbeux (chaque étape doit typer explicitement input et output). Payant quand le pipeline est stable, pénible quand il change souvent.

---

## DÉCISION DIFFICILE N°2 : SENTRY EN PROD SEULEMENT, OU AUSSI EN DEV ?

Envoyer des événements Sentry pendant les tests est une mauvaise idée : ça pollue le projet Sentry, ça ralentit les tests, et ça rend la surveillance de prod moins lisible.

Décision : `sentryClient.ts` vérifie `process.env.NODE_ENV` avant tout appel. En `test` ou en `development`, les appels sont loggés localement au lieu d'être envoyés. En `production`, tout passe.

**Ce que ça coûte :** une condition à chaque appel Sentry. Alternative : un `SentryClient` abstrait avec une implémentation prod et une implémentation no-op injectée selon l'environnement. Préféré pour une V2 : plus propre que le check en ligne.

---

## CE QUI A SURPRIS

`Object.freeze()` sur les snapshots de gauges a causé une erreur difficile à comprendre pendant les tests : Jest essaie de cloner les objets pour les comparer, et un objet frozen ne peut pas toujours être cloné de la même façon selon la version de V8. Fix : utiliser `expect(snapshot).toMatchObject(expected)` au lieu de `toEqual`, qui ne requiert pas de clonage profond.

---

## CE QUI RESTERAIT À FAIRE DANS UNE V2

```
- WebSocket pour pousser les alertes en temps réel vers le dashboard front
- Tests de charge simulés : 1000 ultras connectés, 200 events/min, vérifier que les métriques ne dérivent pas
- Distributed tracing sur plusieurs instances : tester que le correlation ID traverse les workers
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
