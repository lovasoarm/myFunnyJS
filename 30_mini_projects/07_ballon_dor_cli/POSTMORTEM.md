---
stability: intemporel
---

# POSTMORTEM : BALLON D'OR CLI
Temps de lecture ~5 min

---

## CE QUI A BIEN MARCHÉ

Les tests de caractérisation sur la v1 ont été la meilleure décision du projet. Ils ont permis de refactorer sans peur : tant que les tests de caractérisation passent, le comportement observable n'a pas changé. La v2 peut restructurer tout l'intérieur sans que l'utilisateur voit la différence.

Le refactoring SRP (une responsabilité par fichier) a rendu les tests beaucoup plus simples à écrire. Tester `voteStore.js` séparément de `voteCommand.js` est trivial. Dans la v1, tout était dans un seul fichier `index.js` de 340 lignes.

---

## DÉCISION DIFFICILE N°1 : WORKER THREADS OU SIMPLE BOUCLE POUR SIMULATE ?

La commande `simulate --votes 500` génère 500 votes. Sur une machine rapide, une simple boucle synchrone aurait suffi. Mais le cahier des charges demande Worker Threads.

Décision : Worker Threads avec 4 workers en parallèle, chacun générant 125 votes. Les 4 résultats sont agrégés dans le processus principal.

**Ce que ça coûte en complexité réelle :** Worker Threads introduisent une couche de `postMessage()` et de communication inter-thread qui rend les tests difficiles (on ne peut pas injecter un mock dans un Worker Thread). Solution : tester le worker en isolation avec un `workerData` mockée, et tester l'agrégation sans workers dans les tests unitaires.

---

## DÉCISION DIFFICILE N°2 : PERSISTANCE JSON OU SQLITE ?

La v1 utilisait un fichier JSON. Pour la v2, SQLite aurait été plus robuste (concurrent access, requêtes, indexes).

Décision : garder JSON pour ce projet. La raison principale est la containerisation : un fichier JSON est trivial à monter en volume Docker, alors qu'une DB SQLite dans un container nécessite de la gestion de state. Hors scope pour ce projet.

**Ce que ça coûte :** si deux commandes `vote` arrivent simultanément (rare en CLI, mais possible en simulation), il y a une race condition sur le fichier JSON. Documenté dans `voteStore.js` comme limite connue.

---

## CE QUI A SURPRIS

Le Dockerfile multi-stage a réduit la taille de l'image de 1.2GB (image Node complète avec devDependencies) à 180MB (image Alpine avec seulement les dependencies de prod). C'est la première fois que l'impact de `npm install --only=production` dans un Dockerfile était aussi visible.

Sans le multi-stage, docker pull de l'image aurait pris 40 secondes. Avec, 6 secondes.

---

## CE QUI RESTERAIT À FAIRE DANS UNE V2

```
- Mode interactif : prompt de votes guidé au lieu de flags CLI
- Historique des classements avec comparaison année par année
- Webhook : notifier un endpoint externe à chaque vote (pour un dashboard live)
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
