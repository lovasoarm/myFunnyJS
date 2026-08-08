[← Sommaire TECH-ILA](../README.md)

# Niveau 4 : Systèmes professionnels (section 7)

---

## 7 : Niveau 4 : Systèmes professionnels

C'est le niveau qui sépare "je sais coder une feature" de "je sais livrer et exploiter un système". C'est aussi celui que les formations sautent.

### 7.1 : CI/CD

**Tag : NOYAU DURABLE** (le concept) / **PÉRISSABLE** (la syntaxe YAML) · Prérequis : `06_testing/`, `27_team_craft/01_code_review.md`

#### Ce que MyFunnyJS permet déjà de comprendre

- `06_testing/09_test_strategy_not_framework.md` : l'ordre des étapes d'un pipeline est une stratégie de test, pas une contrainte d'outil.
- `04_debugging/07_flaky_bugs.md` : un test instable est un bug de non-déterminisme, jamais une raison de relancer.
- `27_team_craft/01_code_review.md` : le pipeline automatise le vérifiable pour que la revue parle du reste.
- `22_security/09_supply_chain_sbom.md` : le CI a accès à tes secrets et installe du code tiers : c'est ta chaîne d'approvisionnement.
- `00_getting_started/04_package_managers.md` : le lockfile est ce qui rend un build reproductible d'une machine à l'autre.

**Le pipeline minimal défendable :**

```text
push / PR
   ↓ install déterministe (lockfile)
   ↓ lint + typecheck            ← rapide, échoue tôt
   ↓ tests unitaires
   ↓ tests d'intégration (services en conteneurs)
   ↓ build de l'artefact
   ↓ scan de vulnérabilités des dépendances
   ↓ [main uniquement] publication de l'image
   ↓ déploiement préprod → tests de fumée → prod
```

**Ce qui compte et ne changera pas :** l'ordre (le rapide et le pas cher d'abord), le déterminisme (même entrée, même sortie), l'artefact unique promu d'environnement en environnement, la capacité de rollback.

**Ce qui change tous les deux ans :** la syntaxe GitHub Actions, GitLab CI, Jenkins, CircleCI. Ne mémorise pas. Comprends le modèle : des jobs, des étapes, un cache, des artefacts, des secrets, des conditions.

**Tests flaky (instables) en CI.** Un test qui échoue une fois sur vingt détruit la confiance de l'équipe : les gens relancent au lieu de lire. C'est `04_debugging/07_flaky_bugs.md` en contexte d'équipe. Traite-les comme des bugs de production : isole, reproduis, corrige ou supprime. Jamais "relance".

**Sécurité du pipeline.** Le CI a accès à tes secrets de déploiement. Une action tierce non épinglée peut les exfiltrer. Épingle par SHA, limite les permissions du token, ne donne pas les secrets de prod aux PR venant de forks.

> **Exercice.** Écris un pipeline qui échoue si la couverture baisse de plus de 2 points **ou** si la taille du bundle augmente de plus de 5 %. Puis fais volontairement une PR qui viole la règle et vérifie que ça bloque. Un garde-fou non testé n'existe pas.

---

### 7.2 : Cloud et déploiement

**Tag : CONTEXTUELLE** dans les détails, **NOYAU DURABLE** dans les concepts

Les fournisseurs diffèrent. Les concepts, non :

| Concept  | Ce que tu dois savoir expliquer                                                        |
| -------- | -------------------------------------------------------------------------------------- |
| Calcul   | VM vs conteneur vs serverless : latence de démarrage, coût, contraintes                |
| Réseau   | VPC, sous-réseaux, groupes de sécurité, ce qui est public et ce qui ne doit pas l'être |
| Stockage | objets (fichiers), blocs (disques), base managée                                       |
| Identité | rôles et permissions minimales : le principe du moindre privilège                      |
| Secrets  | gestionnaire dédié, rotation, jamais dans le dépôt                                     |
| Coût     | la facture est une métrique d'architecture (`31_annexes/03_finops_greenops.md`)        |
| IaC      | l'infrastructure décrite en code, versionnée, revue en PR                              |

#### Ce que MyFunnyJS permet déjà de comprendre

- `15_runtime_env/04_process_env_argv.md` : config et secrets viennent de l'environnement : c'est la base du 12-factor et de tout déploiement cloud.
- `25_scalability/01_distributed_thinking.md` : ce que tu gagnes en répliquant et ce que tu perds en cohérence.
- `31_annexes/03_finops_greenops.md` : la facture est une métrique d'architecture, mesurable comme la latence.
- `08_memory_performance/00_measure_first.md` : dimensionner sans mesurer produit soit une facture inutile, soit un incident.
- `22_security/09_supply_chain_sbom.md` : le moindre privilège s'applique aux rôles cloud comme aux dépendances.

**Serverless : le vrai compromis.** Zéro serveur à gérer, mise à l'échelle automatique, facturation à l'usage. En échange : démarrage à froid, durée d'exécution limitée, pas d'état en mémoire, pool de connexions base de données à repenser (chaque instance ouvre sa connexion → saturation de PostgreSQL). Excellent pour l'événementiel et le sporadique, discutable pour un service à trafic constant.

**Ce que l'IA n'automatisera pas ici.** Le choix entre trois architectures valides selon ton budget, ton équipe et ton SLA. Elle produira volontiers un Terraform plausible pour une architecture que personne dans ton équipe ne sait exploiter à 3h du matin.

> **Exercice.** Déploie le même petit service de deux façons : un conteneur toujours allumé, et une fonction serverless. Contraintes : mesure trois choses sur chacun (latence du premier appel après 15 minutes d'inactivité, latence en charge soutenue, coût estimé sur 30 jours à ton trafic réel), puis écris une décision argumentée d'une page avec le seuil de trafic qui te ferait changer d'avis. Réutilise `15_runtime_env/04_process_env_argv.md` : le même artefact doit tourner dans les deux cas, seule la configuration change. Piège réaliste : ouvre une connexion PostgreSQL dans la version serverless et monte à 50 appels concurrents, puis compte les connexions ouvertes côté base. À observer : le démarrage à froid, le nombre de connexions à la base, et la courbe de coût selon le trafic. Vérification : les deux déploiements répondent la même chose sur le même endpoint de santé, et tes trois mesures sont écrites, pas estimées de mémoire. Extension : à quel volume ta conclusion s'inverse-t-elle, et quelle métrique surveilles-tu pour le détecter avant la facture ?

---

### 7.3 : Observabilité

**Tag : NOYAU DURABLE** · Prérequis : module `26_observability/` complet

Le module MyFunnyJS t'a donné les trois piliers. Voici l'outillage et les décisions.

#### Ce que MyFunnyJS permet déjà de comprendre

- `26_observability/01_structured_logging.md` : un log est une donnée requêtable, pas une phrase.
- `26_observability/02_distributed_tracing.md` : la propagation de contexte à travers les services et les files.
- `26_observability/04_metrics_alerting.md` : pourquoi la moyenne cache exactement les utilisateurs qui souffrent.
- `26_observability/07_prod_stack_trace_drill.md` : lire une trace de production sans le code sous les yeux.
- `08_memory_performance/00_measure_first.md` : sans mesure préalable, une optimisation est une croyance.

**Logs structurés.** JSON, un niveau, un message stable, des champs. Jamais `console.log("user " + id + " failed")` : impossible à requêter. Toujours un identifiant de corrélation propagé de la requête HTTP jusqu'au worker, en passant par la file. Sans lui, tu ne peux pas reconstituer une histoire.

**Métriques.** Quatre signaux dorés : latence, trafic, erreurs, saturation. En pratique : latence p50/p95/p99 (**jamais la moyenne** : la moyenne cache exactement les utilisateurs qui souffrent), taux d'erreur, profondeur de file, lag de l'event loop, connexions base de données utilisées.

**Traces.** OpenTelemetry est le standard qui compte : instrumentation vendor-neutral, exportable vers n'importe quel backend. C'est **NOYAU DURABLE**. Le backend (Jaeger, Grafana, Datadog, Sentry) est **PÉRISSABLE / CONTEXTUELLE** : il changera au gré des contrats de ta boîte.

**Exemple réaliste.** Une API répond en 90 ms au p50 et 4,2 s au p99. Le tableau de bord "temps de réponse moyen : 210 ms" est vert. Personne ne bouge. En réalité, 1 % des utilisateurs : souvent ceux qui ont le plus de données : subissent 4 secondes. La trace montre un appel base de données répété 340 fois : un N+1 déclenché uniquement au-delà d'un certain volume. Sans trace, ce bug est invisible pendant des mois.

**SLO et budget d'erreur.** Décider "99,9 % des requêtes sous 300 ms sur 30 jours" transforme une discussion d'opinion en décision mesurable. Et le budget d'erreur restant dit à l'équipe si elle peut prendre des risques cette semaine.

> **Exercice.** Instrumente un de tes mini-projets avec OpenTelemetry. Provoque une lenteur artificielle dans une dépendance. Trouve-la **uniquement** avec la trace, sans lire ton code. Écris le chemin de diagnostic en cinq lignes. C'est exactement l'exercice `26_observability/07_prod_stack_trace_drill.md`, avec de vrais outils.

---

### 7.4 : Résilience et architecture distribuée

**Tag : NOYAU DURABLE** · Prérequis : `25_scalability/03_distributed_fallacies.md`, `28_edge_cases/`

#### Ce que MyFunnyJS permet déjà de comprendre

- `25_scalability/03_distributed_fallacies.md` : le réseau n'est pas fiable, la latence n'est pas nulle : tous les patrons ci-dessous en découlent.
- `28_edge_cases/` : les cas limites chassés en local deviennent des pannes partielles en distribué.
- `03_async/02_promises/01_promise_race.md` : un timeout est une course entre ton appel et une horloge.
- `07_math_basics/05_probability_random.md` : le jitter d'un retry est du hasard utile ; sans lui, tous tes clients réessaient à la même seconde.
- `05_error_handling/05_error_strategy.md` : dégrader proprement est une décision d'erreur, prise avant l'incident.

Les sophismes du calcul distribué (le réseau est fiable, la latence est nulle, la bande passante infinie…) sont dans MyFunnyJS. Voici les patrons qui en découlent, valables dans **tous** les langages :

| Patron                       | Problème traité                         | Piège                                                      |
| ---------------------------- | --------------------------------------- | ---------------------------------------------------------- |
| **Timeout**                  | un appel qui ne revient jamais          | sans timeout, tu épuises ton pool de connexions            |
| **Retry + backoff + jitter** | panne transitoire                       | retry sans jitter = tempête synchronisée                   |
| **Idempotence**              | retry qui duplique                      | une clé d'idempotence, ou rien                             |
| **Circuit breaker**          | dépendance morte                        | tu arrêtes de frapper, tu dégrades proprement              |
| **Bulkhead**                 | une dépendance lente épuise tout        | pools séparés par dépendance                               |
| **Dégradation gracieuse**    | service partiel                         | mieux vaut une page sans recommandations qu'une erreur 500 |
| **Backpressure**             | producteur plus rapide que consommateur | tu jettes, tu ralentis, ou tu meurs : choisis              |

**Micro-services : la position honnête.** Ils résolvent un problème **organisationnel** (des équipes qui veulent déployer indépendamment) au prix d'un problème **technique** (le réseau, la cohérence, l'observabilité, la latence). Une équipe de cinq personnes avec sept micro-services a acheté tous les coûts sans aucun bénéfice. Le monolithe modulaire est un choix professionnel respectable et souvent le bon (`16_architecture_patterns/06_microservices_intro.md`).

**Cohérence.** Dans un système distribué, tu choisis ce que tu sacrifies. La cohérence à terme (eventual consistency) est acceptable pour un compteur de vues, inacceptable pour un solde. Ce n'est pas une question technique, c'est une question métier : et c'est à toi d'aller la poser.

> **Exercice : postmortem.** Simule une panne : ta dépendance externe répond en 30 s au lieu de 100 ms. Observe l'effondrement en cascade. Ajoute timeout + circuit breaker. Mesure la différence. Rédige un postmortem (`26_observability/08_oncall_drill.md`) : chronologie, impact, cause racine, action corrective, action préventive. Sans accuser personne : c'est la règle.

**Réflexe gagné.** Devant une nouvelle dépendance externe, ta première question n'est plus "comment je l'appelle ?" mais "que se passe-t-il quand elle est lente ?".

---

### 7.5 : Sécurité de production

**Tag : NOYAU DURABLE** · Prérequis : module `22_security/` complet

Ce que MyFunnyJS t'a appris (XSS, CSRF, injection, pollution de prototype, OWASP, chaîne d'approvisionnement) se traduit en production par une poignée de gestes :

- **Secrets** : gestionnaire dédié, rotation, jamais dans Git, jamais dans une image, jamais dans un bundle client. Un secret commité est compromis, même après suppression : l'historique le garde.
- **Moindre privilège** : l'utilisateur base de données de ton API n'a pas besoin de `DROP TABLE`. Le conteneur ne tourne pas en root.
- **En-têtes** : CSP, HSTS, `X-Content-Type-Options`. Une CSP bien faite transforme une XSS exploitable en tentative bloquée.
- **Limitation de débit** sur tout ce qui est public, en particulier l'authentification.
- **Journalisation d'audit** sur les actions sensibles : et **jamais** de données personnelles ou de secrets dans les logs (RGPD, `22_security/08_privacy_and_aiact.md`).
- **Dépendances** : scan en CI, mises à jour visibles en PR, SBOM (Software Bill of Materials : inventaire exhaustif des dépendances livrées) si le contexte l'exige.

#### Ce que MyFunnyJS permet déjà de comprendre

- `22_security/01_xss_injection.md` : la zone protégée et la zone exposée de chaque framework, et pourquoi une CSP est une seconde barrière.
- `22_security/02_csrf_cors.md` : CORS n'est pas une protection serveur ; `SameSite` en est une.
- `22_security/09_supply_chain_sbom.md` : le scan en CI et le SBOM formalisent ce que tu as déjà audité à la main.
- `22_security/08_privacy_and_aiact.md` : une donnée personnelle dans un log est une fuite avec rétention.
- `26_observability/01_structured_logging.md` : une journalisation d'audit non structurée n'est pas exploitable en incident.

> **Exercice : audit de fuite.** Cherche activement trois fuites dans un de tes projets, sans lire le code d'abord : un secret présent dans l'historique Git, une donnée personnelle ou un token dans les logs, une valeur sensible présente dans le bundle client. Contraintes : chaque trouvaille est prouvée par une commande, pas par une intuition, et corrigée avec la bonne réponse (rotation du secret, champ masqué, variable déplacée côté serveur). Réutilise `22_security/09_supply_chain_sbom.md` : produis la liste de tes dépendances et repère celles qui exécutent un script à l'installation. Piège réaliste : supprimer un secret du fichier ne le supprime pas de l'historique : un secret commité est compromis, la seule correction est la rotation. À observer : le commit exact où le secret apparaît, la ligne de log fautive, et le fichier du bundle qui contient la valeur. Vérification : refais l'audit après correction ; les trois recherches reviennent vides et l'ancien secret ne fonctionne plus. Extension : ajoute une étape de CI qui refuse une PR contenant un motif de secret, puis tente de la contourner.

**Ce que l'IA ne fera pas à ta place.** Elle écrira un middleware d'authentification correct dans 80 % des cas. Elle ne saura pas que, dans **ton** métier, un utilisateur du service support a le droit de voir la ressource d'un autre client mais pas de la modifier. Ce contexte n'est nulle part dans le prompt, et c'est exactement là que naissent les failles d'autorisation.

---
