---
stability: intemporel
---

# POSTMORTEM : WALKING DEAD PROTOCOL
Temps de lecture ~6 min

---

## CE QUI A BIEN MARCHÉ

La discipline des deux phases (caractériser le legacy avant de toucher quoi que ce soit, puis TDD pur sur la v2) a évité le piège classique du "je réécris tout et je croise les doigts". Chaque étape de la phase 2 a été validée immédiatement par les tests de la phase 1 qui restaient disponibles en référence. Aucune régression silencieuse découverte tardivement.

La séparation services/handlers (les services ne touchent jamais le filesystem) a rendu chaque service testable sans mocker `fs`, exactement comme prévu dans l'ADR 001.

---

## DIFFÉRENCE DE COMPORTEMENT ENTRE V1 ET V2 : LA VALIDATION DE QUANTITÉ

C'est la différence la plus importante du projet, et elle est documentée ici en détail parce que le cahier des charges l'exige explicitement.

**Comportement du v1 (`legacy/campV1.js`) :** `consume('food', 9999)` sur un stock de 42 unités fait passer le stock à -9957, sans erreur, sans avertissement. Le CLI affiche ensuite "jours restants : -3319" sans broncher. Capturé fidèlement dans `tests/inventory.test.js` (section legacy) lors de la phase 1.

**Comportement de la v2 (`src/services/inventoryService.js`) :** `consume()` lève un `InsufficientResourceError` si la quantité demandée dépasse le stock disponible. Le CLI affiche un message d'erreur clair et sort avec un code 1, le stock reste intact.

**Pourquoi ce changement est assumé et pas un bug de migration :** un stock négatif n'a aucun sens dans le domaine métier (le camp de Rick). C'est un bug de validation manquante dans le v1, pas une feature volontaire. La phase 1 a capturé ce bug tel qu'il existait pour pouvoir le comparer, pas pour le préserver dans la v2.

**Ce que ça signifie pour quiconque migre du v1 vers la v2 en vrai :** si un script externe dépendait du comportement "silencieusement négatif" du v1 (peu probable mais possible dans un vrai système legacy), ce script casserait avec la v2. C'est documenté ici précisément pour cette raison : une migration de legacy doit toujours lister explicitement les comportements qui changent, même quand le changement est une amélioration évidente.

---

## DÉCISION DIFFICILE : COMMENT TESTER UN MONOLITHE SANS FONCTION EXPORTÉE

`campV1.js` n'exporte rien de propre. Toute la logique est dans une fonction `runCamp()` appelée au chargement du module, avec des effets de bord (lecture de fichier, écriture console) immédiats.

Deux options : extraire manuellement des bouts de logique en les copiant dans les tests (rapide, mais teste une copie, pas le vrai code), ou tester le comportement de bout en bout via le processus (`execSync` ou équivalent), en traitant le legacy comme une boîte noire avec une entrée (arguments CLI) et une sortie (stdout, fichier JSON).

Décision : boîte noire, exécution du vrai processus. Plus lent à l'exécution (chaque test lance un vrai processus Node), mais teste le vrai comportement, pas une approximation. C'est cohérent avec le principe : la phase 1 doit décrire fidèlement ce qui existe.

---

## CE QUI A SURPRIS

Le Worker Thread du `threatSimulator` a un comportement différent selon qu'il termine de lui-même ou qu'il est terminé explicitement (`worker.terminate()`). Un test qui n'appelle pas `terminate()` après avoir reçu son premier message attendu laisse le Worker tourner en arrière-plan, ce qui peut faire planter la suite de tests suivante par accumulation de Workers actifs si on en lance beaucoup. Chaque test de Worker Thread doit explicitement nettoyer après lui.

---

## CE QUI RESTERAIT À FAIRE DANS UNE V2 DE LA V2

```
- Un vrai système de permissions sur les commandes CLI (qui peut faire un reset ?)
- Historique des consommations avec graphique en ASCII dans le terminal
- Synchroniser plusieurs instances du CLI sur le même fichier sans race condition
 (actuellement, deux exécutions simultanées du CLI peuvent se piétiner sur fileStore)
```

Ce dernier point n'était pas dans le scope : le cahier des charges ne demande pas de gestion de concurrence multi-process, et l'ajouter aurait dépassé largement les modules couverts (04, 11, 14, 31).


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
