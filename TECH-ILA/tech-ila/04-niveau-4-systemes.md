---
statut: revu
last_reviewed: 2026-08
proprietaire: mainteneur TECH-ILA
revue: trimestrielle
companion: MyFunnyJS
---

[← Sommaire TECH-ILA](../README.md)

> **Tu viens de** : [03-niveau-3-backend.md](./03-niveau-3-backend.md)
> **Tu dois déjà savoir** : Docker de base (`01-niveau-1-socle.md`), un backend NestJS ou Express qui tourne, les bases de la file d'attente et du pool de connexions.
> **Ensuite** : [05-niveau-5-transfert.md](./05-niveau-5-transfert.md)

# Niveau 4 : Systèmes professionnels (section 7)

---

## 7 : Niveau 4 : Systèmes professionnels

C'est le niveau qui sépare "je sais coder une feature" de "je sais livrer et exploiter un système". C'est aussi celui que les formations sautent. C'est également le niveau le plus long du corpus, et ce n'est pas un hasard : c'est lui qui décide de ton employabilité backend.

### 7.1 : CI/CD

**Tag : NOYAU DURABLE** (le concept) / **PÉRISSABLE** (la syntaxe YAML) · Coût : ~15 h avant utilité · Durée de vie : ~10 ans (le modèle) · À apprendre après : `06_testing/` complet · Prérequis : `06_testing/`, `27_team_craft/01_code_review.md`

#### Ce que MyFunnyJS permet déjà de comprendre

- `06_testing/09_test_strategy_not_framework.md` : l'ordre des étapes d'un pipeline est une stratégie de test, pas une contrainte d'outil.
- `04_debugging/07_flaky_bugs.md` : un test instable est un bug de non-déterminisme, jamais une raison de relancer.
- `27_team_craft/01_code_review.md` : le pipeline automatise le vérifiable pour que la revue parle du reste.
- `22_security/09_supply_chain_sbom.md` : le CI a accès à tes secrets et installe du code tiers — c'est ta chaîne d'approvisionnement.
- `00_getting_started/04_package_managers.md` : le lockfile est ce qui rend un build reproductible d'une machine à l'autre.

**Le pipeline minimal défendable, en vrai YAML commenté.** Ce n'est pas un pseudo-code : c'est la structure que tu retrouveras, aux noms de clés près, dans GitHub Actions, GitLab CI ou CircleCI.

```yaml
# .github/workflows/ci.yml — pipeline minimal défendable
name: ci

on:
  pull_request:
  push:
    branches: [main]

# Permissions minimales par défaut : le token du job ne peut rien écrire
# tant qu'un job ne le demande pas explicitement. Principe du moindre privilège.
permissions:
  contents: read

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      # Épinglage par SHA, pas par tag mouvant (voir encadré sécurité plus bas)
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - uses: actions/setup-node@60edb5dd545a775178f52524783378180af0d1f # v4.1.0
        with:
          node-version: 22
          cache: npm

      # Install déterministe : le lockfile fait foi, jamais `npm install`
      - run: npm ci

      # Rapide et pas cher d'abord : échoue en secondes, pas en minutes
      - run: npm run lint
      - run: npm run typecheck

      - run: npm run test:unit

      # Services en conteneurs pour les tests d'intégration (Postgres réel,
      # pas un mock) — voir Testcontainers (PROFESSIONNELLE) plus bas
      - run: npm run test:integration

      - run: npm run build

      # Scan de vulnérabilités des dépendances : ne bloque le merge que sur
      # les failles critiques, pour ne pas noyer l'équipe sous les faux positifs
      - run: npm audit --audit-level=critical

      # L'artefact produit ici est celui qui sera promu tel quel, sans
      # rebuild, à travers préprod puis prod
      - uses: actions/upload-artifact@6f51ac03b9356f520e9adb1b1b7802705f340c2b # v4.5.0
        with:
          name: app-build
          path: dist/

  deploy-preprod:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: preprod
    permissions:
      id-token: write # nécessaire pour l'authentification cloud sans secret statique
    steps:
      - uses: actions/download-artifact@fa0a91b85d4f404e444e00e005971372dc801d16 # v4.1.8
        with:
          name: app-build
      - run: ./scripts/deploy.sh preprod
      - run: ./scripts/smoke-test.sh preprod

  deploy-prod:
    needs: deploy-preprod
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: prod # gate manuel possible ici : validation humaine avant prod
    steps:
      - uses: actions/download-artifact@fa0a91b85d4f404e444e00e005971372dc801d16 # v4.1.8
        with:
          name: app-build
      - run: ./scripts/deploy.sh prod
      - run: ./scripts/smoke-test.sh prod
```

**Ce qui compte et ne changera pas :** l'ordre (le rapide et le pas cher d'abord), le déterminisme (même entrée, même sortie), l'artefact unique promu d'environnement en environnement sans rebuild, la capacité de rollback.

**Ce qui change tous les deux ans :** la syntaxe GitHub Actions, GitLab CI, Jenkins, CircleCI. Ne mémorise pas la syntaxe. Comprends le modèle : des jobs, des étapes, un cache, des artefacts, des secrets, des conditions.

**Tests flaky (instables) en CI.** Un test qui échoue une fois sur vingt détruit la confiance de l'équipe : les gens relancent au lieu de lire. C'est `04_debugging/07_flaky_bugs.md` en contexte d'équipe. Traite-les comme des bugs de production : isole, reproduis, corrige ou supprime. Jamais "relance".

**Sécurité du pipeline — épinglage par SHA, pas de folklore.** Le CI a accès à tes secrets de déploiement. `actions/checkout@v4` est un tag mouvant : son propriétaire peut repointer `v4` vers un commit malveillant demain matin, et ton pipeline exécutera ce code avec tes secrets sans qu'aucune ligne n'ait changé chez toi. `actions/checkout@11bd719...` (le SHA complet) est un commit précis, immuable : c'est la seule garantie que l'action que tu exécutes aujourd'hui est celle que tu as auditée. C'est exactement le scénario `22_security/09_supply_chain_sbom.md` appliqué à ton CI. En complément : limite les permissions du token au strict nécessaire (`permissions: contents: read` par défaut), et ne donne jamais les secrets de prod aux pipelines déclenchés par une PR venant d'un fork.

**Procédure de rollback en 6 gestes.** Un rollback ne s'improvise pas à 3 h du matin — il s'exécute :

1. **Identifier** la dernière version stable connue (le tag ou l'artefact précédent, jamais "le commit d'avant" à l'œil).
2. **Geler** les déploiements en cours pour ne pas rollback par-dessus un déploiement à moitié fait.
3. **Redéployer l'artefact précédent tel quel** — jamais un nouveau build, même si "c'est juste une ligne à corriger" : un rollback n'est pas le moment de coder.
4. **Vérifier le healthcheck de readiness**, pas seulement que le processus démarre (voir 7.4 pour la distinction liveness/readiness).
5. **Confirmer sur une métrique métier** (taux d'erreur, latence p99) que l'incident est résolu, pas seulement que le déploiement a réussi.
6. **Annoncer** la fin du rollback et ouvrir le postmortem (voir 7.4).

**Feature flags et déploiement progressif.** Un rollback de code prend des minutes ; couper un feature flag prend des secondes, et c'est réversible sans redéploiement. Le principe : la nouvelle fonctionnalité est déployée éteinte, activée pour 1 % du trafic, puis 10 %, puis 100 %, avec une métrique surveillée à chaque palier. Cela découple le déploiement (mettre le code en prod) de la release (l'exposer aux utilisateurs) — deux décisions que le CI/CD classique confond. Le piège : un flag qui vit six mois en prod devient une branche morte invisible ; chaque flag a une date de suppression décidée à sa création.

> **Exercice — pipeline avec garde-fou**
> **Temps réaliste** : 2 à 3 h · **Prérequis matériel / compte** : un dépôt Git avec CI activable (GitHub Actions gratuit sur dépôt public) · **Coût max** : 0 € ·
> **Mode** : assistant autorisé
> **Contraintes** : le pipeline doit échouer si la couverture baisse de plus de 2 points ou si la taille du bundle augmente de plus de 5 %.
> **Réutilise** : `06_testing/09_test_strategy_not_framework.md`
> **Piège** : un garde-fou non testé n'existe pas — vérifie qu'il bloque vraiment avant de le faire confiance.
> **À observer** : le job qui échoue, et le message exact affiché dans les logs CI.
> **Vérification** (observable, chiffrée) : une PR qui viole volontairement la règle est bloquée par le pipeline, une PR conforme passe.
> **Repli 100 % local et gratuit** : GitHub Actions sur dépôt public est déjà gratuit ; si indisponible, exécute les mêmes étapes dans un script bash local et vérifie le code de sortie.
> **Extension** : ajoute un job qui échoue si une dépendance sous licence copyleft forte (GPL, AGPL) est ajoutée.

---

### 7.2 : Cloud et déploiement

**4.10 t'a appris à mettre en ligne ; ici tu apprends à exploiter.** Le niveau 1 t'a fait pousser un service sur une plateforme gratuite et vérifier qu'il répond. Ici, la question change : ce service tourne depuis six mois, il a des pics de charge, une dépendance externe qui tombe parfois, et une facture qui monte. Exploiter, c'est savoir pourquoi il est lent un mardi à 14h et combien ça coûte de le garder allumé.

**Tag : CONTEXTUELLE** dans les détails, **NOYAU DURABLE** dans les concepts · Coût : ~20 h avant utilité · Durée de vie : ~8 ans pour les concepts · À apprendre après : 7.1 CI/CD

Les fournisseurs diffèrent. Les concepts, non :

| Concept  | Ce que tu dois savoir expliquer                                                        | Comment tu le vérifies |
| -------- | --------------------------------------------------------------------------------------- | ----------------------- |
| Calcul   | VM vs conteneur vs serverless : latence de démarrage, coût, contraintes                 | mesure le temps de la première requête après 15 min d'inactivité |
| Réseau   | VPC, sous-réseaux, groupes de sécurité, ce qui est public et ce qui ne doit pas l'être  | tente de joindre ta base depuis l'extérieur du réseau privé — ça doit échouer |
| Stockage | objets (fichiers), blocs (disques), base managée                                        | vérifie que le stockage objet survit à la suppression de l'instance de calcul |
| Identité | rôles et permissions minimales : le principe du moindre privilège                       | lis le rôle attribué et retire toute permission que le service n'utilise pas, puis relance-le |
| Secrets  | gestionnaire dédié, rotation, jamais dans le dépôt                                       | cherche le secret dans l'historique Git avec `git log -p` — il ne doit jamais apparaître |
| Coût     | la facture est une métrique d'architecture (`31_annexes/03_finops_greenops.md`)         | calcule le coût mensuel à partir d'une grille tarifaire figée (voir 7.2 bis) |
| IaC      | l'infrastructure décrite en code, versionnée, revue en PR (Infrastructure as Code : plus de clic dans une console, chaque changement passe par une revue comme du code applicatif) | ouvre une PR qui change une ressource et vérifie qu'elle est visible au diff |

#### Ce que MyFunnyJS permet déjà de comprendre

- `15_runtime_env/04_process_env_argv.md` : config et secrets viennent de l'environnement — c'est la base du 12-factor (douze règles de conception pour une application cloud portable, dont « la config vit dans l'environnement, jamais dans le code ») et de tout déploiement cloud.
- `25_scalability/01_distributed_thinking.md` : ce que tu gagnes en répliquant et ce que tu perds en cohérence.
- `31_annexes/03_finops_greenops.md` : la facture est une métrique d'architecture, mesurable comme la latence.
- `08_memory_performance/00_measure_first.md` : dimensionner sans mesurer produit soit une facture inutile, soit un incident.
- `22_security/09_supply_chain_sbom.md` : le moindre privilège s'applique aux rôles cloud comme aux dépendances.

**Orchestration : ce que tu dois savoir sans être ops.** Tu ne vas pas administrer un cluster Kubernetes, mais tu vas déployer dessus, et tes déploiements y meurent parfois pour des raisons que tu dois savoir lire.

- Un orchestrateur (Kubernetes est le standard de fait) prend une déclaration ("je veux 3 copies de ce conteneur, avec ces limites de ressources") et la fait respecter en continu : il redémarre ce qui meurt, répartit la charge entre les copies, et remplace un conteneur défaillant sans qu'on te réveille — sauf si le remplacement échoue aussi.
- **OOMKill** : ton conteneur a une limite de mémoire déclarée. S'il la dépasse, le noyau le tue sans préavis ni exception à attraper — c'est un `SIGKILL`, pas une erreur applicative. Le symptôme côté logs applicatifs : rien, le processus s'arrête net. Le symptôme côté orchestrateur : `OOMKilled` dans le statut du pod.
- **Liveness vs readiness** : deux questions différentes que l'orchestrateur pose en boucle à ton service. Liveness = "es-tu vivant, ou dois-je te redémarrer ?" (une boucle infinie qui répond encore aux requêtes HTTP mais ne fait plus rien de correct passe ce test à tort — c'est pour ça qu'un bon liveness vérifie un minimum de logique). Readiness = "es-tu prêt à recevoir du trafic maintenant ?" (au démarrage, tant que la connexion base n'est pas établie, réponds "non prêt" plutôt que de planter des requêtes).
- **Limites de ressources** : tu déclares un minimum garanti (requests) et un maximum autorisé (limits) en CPU et mémoire. Sous-déclarer les requests fait cohabiter trop de conteneurs sur une machine et dégrade tout le monde ; ne pas déclarer de limits laisse un conteneur affamer ses voisins jusqu'à l'OOMKill collectif.
- Ce que tu n'as pas besoin de savoir à ce stade : écrire un manifeste Kubernetes complet, administrer le cluster lui-même, ou choisir entre les dizaines de contrôleurs d'ingress. Ça, c'est le métier d'un ops.

**Matrice de décision : conteneur vs serverless.**

| Contrainte | Conteneur toujours allumé | Serverless |
| --- | --- | --- |
| Charge | constante ou prévisible | sporadique, en pics, événementielle |
| Taille d'équipe | équipe avec un minimum de culture ops, ou plateforme managée (Cloud Run, App Runner) | petite équipe sans ops dédié |
| SLA | latence garantie même à froid, état en mémoire toléré | tolère un démarrage à froid occasionnel, pas d'état en mémoire entre requêtes |
| Budget | facturation prévisible, coût fixe même à vide | facturation à l'usage, gratuit à trafic nul, mais imprévisible en pic |
| **Choix par défaut si tu n'as pas le temps de trancher** | **conteneur derrière une plateforme managée** (moins de surprises de facturation et de latence, migration vers serverless possible plus tard sans tout réécrire) | — |

**Serverless : le vrai compromis.** Zéro serveur à gérer, mise à l'échelle automatique, facturation à l'usage. En échange : démarrage à froid, durée d'exécution limitée, pas d'état en mémoire, pool de connexions base de données à repenser (chaque instance ouvre sa connexion → saturation de PostgreSQL). Excellent pour l'événementiel et le sporadique, discutable pour un service à trafic constant.

**Ce que l'IA n'automatisera pas ici.** Le choix entre trois architectures valides selon ton budget, ton équipe et ton SLA. Elle produira volontiers un Terraform (`Terraform` — CONTEXTUELLE — outil d'IaC déclaratif qui décrit l'infrastructure cloud en fichiers versionnés) plausible pour une architecture que personne dans ton équipe ne sait exploiter à 3h du matin.

> **Exercice — conteneur contre serverless, sans carte bancaire**
> **Temps réaliste** : une demi-journée · **Prérequis matériel / compte** : Docker installé, aucun compte cloud requis · **Coût max** : 0 € ·
> **Mode** : assistant autorisé
> **Contraintes** : mesure trois choses sur chaque option — latence du premier appel après 15 minutes d'inactivité simulée, latence en charge soutenue, coût estimé sur 30 jours à un trafic donné.
> **Réutilise** : `15_runtime_env/04_process_env_argv.md` — le même artefact doit tourner dans les deux cas, seule la configuration change.
> **Piège** : ouvre une connexion PostgreSQL dans la version "serverless" locale et monte à 50 appels concurrents, puis compte les connexions ouvertes côté base.
> **À observer** : le démarrage à froid, le nombre de connexions à la base, la courbe de coût selon le trafic simulé.
> **Vérification** (observable, chiffrée) : les deux déploiements répondent la même chose sur le même endpoint de santé, et tes trois mesures sont écrites, pas estimées de mémoire.
> **Repli 100 % local et gratuit** : lance le conteneur "toujours allumé" avec Docker Compose ; simule le serverless avec un émulateur local (par exemple une fonction déclenchée par un petit script qui démarre et tue le processus entre chaque appel pour reproduire le démarrage à froid) ; simule le trafic avec un script qui envoie des requêtes à intervalles contrôlés au lieu d'un outil de charge cloud ; calcule le coût avec la grille tarifaire figée ci-dessous, jamais avec une facture réelle.
> **Extension** : à quel volume ta conclusion s'inverse-t-elle, et quelle métrique surveilles-tu pour le détecter avant la facture ?

**Grille tarifaire figée pour les exercices de ce document** (ordres de grandeur fixes, à ne jamais remplacer par une facture réelle pour ces exercices) : conteneur toujours allumé ≈ 0,02 €/heure quel que soit le trafic ; fonction serverless ≈ 0,0000002 € par appel + 0,0000167 €/Go-seconde d'exécution ; base de données managée ≈ 0,05 €/heure. Ces chiffres suffisent à comparer deux architectures ; ils ne remplacent jamais un devis réel avant un vrai déploiement.

---

### 7.3 : Observabilité

**Tag : NOYAU DURABLE** · Coût : ~12 h avant utilité · Durée de vie : ~10 ans (les trois piliers ne changent pas) · À apprendre après : 7.1 CI/CD · Prérequis : module `26_observability/` complet

Le module MyFunnyJS t'a donné les trois piliers. Voici l'outillage et les décisions.

#### Ce que MyFunnyJS permet déjà de comprendre

- `26_observability/01_structured_logging.md` : un log est une donnée requêtable, pas une phrase.
- `26_observability/02_distributed_tracing.md` : la propagation de contexte à travers les services et les files.
- `26_observability/04_metrics_alerting.md` : pourquoi la moyenne cache exactement les utilisateurs qui souffrent.
- `26_observability/07_prod_stack_trace_drill.md` : lire une trace de production sans le code sous les yeux.
- `08_memory_performance/00_measure_first.md` : sans mesure préalable, une optimisation est une croyance.

| Pilier | Ce que tu dois savoir expliquer | Comment tu le vérifies |
| --- | --- | --- |
| Logs structurés | JSON, un niveau, un message stable, des champs — jamais `console.log("user " + id + " failed")`, impossible à requêter | exécute une requête filtrée sur un champ précis dans tes logs et vérifie qu'elle renvoie exactement les lignes attendues |
| Métriques | quatre signaux dorés — latence, trafic, erreurs, saturation ; latence en p50/p95/p99, **jamais la moyenne** | compare la moyenne et le p99 sur un même intervalle et vérifie qu'ils racontent deux histoires différentes |
| Traces | identifiant de corrélation propagé de la requête HTTP jusqu'au worker, en passant par la file | suis un identifiant de trace unique depuis le log d'entrée jusqu'au log de sortie sur trois services différents |
| SLO et budget d'erreur | "99,9 % des requêtes sous 300 ms sur 30 jours" transforme une opinion en décision mesurable | calcule le budget d'erreur restant du mois et vérifie qu'il correspond au nombre réel d'incidents survenus |

**Traces.** OpenTelemetry est le standard qui compte : instrumentation vendor-neutral, exportable vers n'importe quel backend. C'est **NOYAU DURABLE**. Le backend (Jaeger, Grafana, Datadog, Sentry) est **PÉRISSABLE / CONTEXTUELLE** : il changera au gré des contrats de ta boîte.

**Exemple réaliste.** Une API répond en 90 ms au p50 et 4,2 s au p99. Le tableau de bord "temps de réponse moyen : 210 ms" est vert. Personne ne bouge. En réalité, 1 % des utilisateurs — souvent ceux qui ont le plus de données — subissent 4 secondes. La trace montre un appel base de données répété 340 fois : un N+1 déclenché uniquement au-delà d'un certain volume. Sans trace, ce bug est invisible pendant des mois.

#### Ce qui casse en production — la fuite qu'un heap snapshot révèle en 30 secondes

Une API met en cache ses résultats dans une `Map` au niveau module, sans limite ni TTL. En développement : douze entrées, invisible. En production : une entrée par combinaison de filtres, 400 000 entrées après trois jours, redémarrage par OOM toutes les 48 heures. L'équipe programme un redémarrage automatique nocturne et considère le problème réglé pendant huit mois. Un simple heap snapshot montrait la `Map` en trente secondes — encore fallait-il le prendre.


**Diagramme — flux d'une trace distribuée à travers une file.**

```text
Client HTTP
   │  trace_id: abc123 (généré à l'entrée)
   ▼
Service API  ──── span "http.request" ────────┐
   │ publie un message avec trace_id=abc123    │
   ▼                                           │
File d'attente (Kafka/RabbitMQ/SQS)            │  toutes ces étapes
   │ le trace_id voyage dans les métadonnées    │  partagent le même
   │ du message, pas dans son corps métier      │  trace_id : c'est ça
   ▼                                           │  qui permet de
Worker consommateur ── span "queue.process" ───┤  reconstituer
   │ lit trace_id=abc123, ouvre un span enfant  │  l'histoire complète
   ▼                                           │  dans le backend
Appel base de données ── span "db.query" ──────┘  de traces (Jaeger,
   │                                              Grafana Tempo...)
   ▼
Réponse assemblée, tous les spans envoyés
au collecteur OpenTelemetry sous le même trace_id
```

> **Exercice — diagnostic par trace**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : un mini-projet Node instrumentable, Docker pour le collecteur local · **Coût max** : 0 € ·
> **Mode** : jeûne d'IA obligatoire — journal de raisonnement écrit avant toute exécution
> **Contraintes** : instrumente un de tes mini-projets avec OpenTelemetry, provoque une lenteur artificielle dans une dépendance, trouve-la uniquement avec la trace, sans lire ton code.
> **Réutilise** : `26_observability/07_prod_stack_trace_drill.md`
> **Piège** : la tentation de relire le code source dès que la trace est ambiguë — tiens le jeûne jusqu'au bout.
> **À observer** : le span le plus long, son nombre de répétitions, son parent direct.
> **Vérification** (observable, chiffrée) : le chemin de diagnostic écrit en cinq lignes désigne exactement la ligne de code fautive, confirmée seulement après coup.
> **Repli 100 % local et gratuit** : un collecteur OpenTelemetry local (conteneur `otel-collector` + Jaeger en local via Docker Compose) remplace tout SaaS d'observabilité payant.
> **Extension** : refais l'exercice en modifiant uniquement le seuil du N+1 pour qu'il n'apparaisse qu'au-delà de 500 lignes — la trace le montre-t-elle encore aussi clairement ?

---

### 7.4 : Résilience et architecture distribuée

**Tag : NOYAU DURABLE** · Coût : ~15 h avant utilité · Durée de vie : ~15 ans (les patrons sont indépendants du langage) · À apprendre après : 7.3 Observabilité · Prérequis : `25_scalability/03_distributed_fallacies.md`, `28_edge_cases/`

#### Ce que MyFunnyJS permet déjà de comprendre

- `25_scalability/03_distributed_fallacies.md` : le réseau n'est pas fiable, la latence n'est pas nulle — tous les patrons ci-dessous en découlent.
- `28_edge_cases/` : les cas limites chassés en local deviennent des pannes partielles en distribué.
- `03_async/02_promises/01_promise_race.md` : un timeout est une course entre ton appel et une horloge.
- `07_math_basics/05_probability_random.md` : le jitter d'un retry est du hasard utile — sans lui, tous tes clients réessaient à la même seconde.
- `05_error_handling/05_error_strategy.md` : dégrader proprement est une décision d'erreur, prise avant l'incident.

| Patron | Problème traité | Piège |
| --- | --- | --- |
| **Timeout** | un appel qui ne revient jamais | sans timeout, tu épuises ton pool de connexions |
| **Retry + backoff + jitter** | panne transitoire | retry sans jitter = tempête synchronisée |
| **Idempotence** | retry qui duplique | une clé d'idempotence, ou rien |
| **Circuit breaker** | dépendance morte | tu arrêtes de frapper, tu dégrades proprement |
| **Bulkhead** | une dépendance lente épuise tout | pools séparés par dépendance |
| **Dégradation gracieuse** | service partiel | mieux vaut une page sans recommandations qu'une erreur 500 |
| **Backpressure** | producteur plus rapide que consommateur | tu jettes, tu ralentis, ou tu meurs — choisis |

**Exemple qui casse : le timeout absent.** Un service appelle un fournisseur externe sans timeout configuré. Le fournisseur ralentit à 40 s au lieu de 200 ms. Les connexions du pool restent occupées, le pool se vide, et le service tombe entièrement — y compris les endpoints qui n'utilisent pas ce fournisseur. Une panne partielle chez un tiers devient une panne totale chez toi, à cause d'une valeur par défaut absente.


#### Encadré — les quatre pannes que tu vas causer toi-même

Ce ne sont pas des pannes exotiques. Ce sont celles que produit un junior en ajoutant, avec les meilleures intentions, un cache et un retry "pour améliorer les perfs".

1. **Timeout en cascade.** Ton service A appelle B qui appelle C, chacun avec un timeout de 10 s. Si C traîne, B attend 10 s avant d'échouer, puis A attend encore 10 s de plus : le client final patiente 20 s pour un échec que tu voulais éviter. Contre-mesure : un **budget de timeout décroissant** — si le client accepte 8 s au total, A garde 6 s pour lui-même et B, B garde 4 s pour lui-même et C, ainsi de suite ; chaque timeout se calcule à partir du temps déjà consommé, pas d'une constante fixe.
2. **Cache incohérent.** Redis répond vite, mais rien ne garantit qu'il répond juste après une mise à jour ailleurs. Le symptôme classique : l'utilisateur modifie son profil, revoit l'ancienne valeur pendant deux minutes. Contre-mesure : **invalidation par clé de version** — la clé de cache inclut un numéro de version incrémenté à chaque écriture (`user:42:v7`), jamais une simple expiration temporelle qui masque le problème sans le résoudre.
3. **Retry amplificateur.** Un service lent reçoit trois fois plus de requêtes parce que chaque client déçu retente, ce qui le ralentit encore plus, ce qui déclenche encore plus de retries. Contre-mesure : **plafond de tentatives + jitter** — jamais plus de 3 essais, et un délai aléatoire (pas fixe) entre chaque essai pour désynchroniser les clients.
4. **Panne partielle « 200 avec données périmées ».** Le service répond avec un code de succès mais sert un cache qui n'a pas pu être rafraîchi parce que la dépendance amont est en panne — personne ne le voit, l'alerte ne se déclenche pas, l'incident dure des heures. Contre-mesure : **disjoncteur (circuit breaker)** — au lieu de servir silencieusement du périmé, le service doit exposer explicitement l'état dégradé (en-tête, champ de réponse, métrique) pour que la dégradation soit visible et alertable.

**Micro-services : la position honnête.** Ils résolvent un problème **organisationnel** (des équipes qui veulent déployer indépendamment) au prix d'un problème **technique** (le réseau, la cohérence, l'observabilité, la latence). Une équipe de cinq personnes avec sept micro-services a acheté tous les coûts sans aucun bénéfice. Le monolithe modulaire est un choix professionnel respectable et souvent le bon (`16_architecture_patterns/06_microservices_intro.md`).

**Cohérence.** Dans un système distribué, tu choisis ce que tu sacrifies. La cohérence à terme (eventual consistency) est acceptable pour un compteur de vues, inacceptable pour un solde. Ce n'est pas une question technique, c'est une question métier — et c'est à toi d'aller la poser.

#### Page — incident en 7 gestes

Sous incident, on n'exécute pas des concepts, on exécute une procédure. Voici celle qui sert à 3 h du matin sur un service que tu n'as pas écrit :

1. **Constater** — l'alerte dit-elle vrai ? Reproduis le symptôme sur un endpoint de santé avant d'agir.
2. **Borner l'impact** — combien d'utilisateurs, quelle fonctionnalité, depuis quand. Ne cherche pas encore la cause.
3. **Stabiliser** — coupe un feature flag, isole la dépendance en panne (bulkhead), active le disjoncteur si ce n'est pas déjà fait — sans corriger le fond.
4. **Décider rollback ou correctif** — un rollback si le déploiement récent coïncide avec l'incident (règle par défaut) ; un correctif ciblé seulement si le rollback est impossible ou inefficace.
5. **Communiquer** — un message court, à intervalle régulier, même pour dire "toujours en cours" : le silence est ce qui panique le plus une équipe.
6. **Rétablir** — vérifie sur une métrique métier, pas seulement sur le déploiement réussi, que le service est réellement revenu à la normale.
7. **Postmortem** — voir plus bas. Sans accuser personne : c'est la règle.

> **Exercice — postmortem de panne en cascade**
> **Temps réaliste** : une demi-journée · **Prérequis matériel / compte** : un mini-service local avec une dépendance simulable · **Coût max** : 0 € ·
> **Mode** : assistant autorisé
> **Contraintes** : simule une panne — ta dépendance externe répond en 30 s au lieu de 100 ms — observe l'effondrement en cascade, ajoute timeout + circuit breaker, mesure la différence.
> **Réutilise** : `26_observability/08_oncall_drill.md`
> **Piège** : corriger uniquement le symptôme visible (le timeout) sans traiter l'amplification par retry.
> **À observer** : le nombre de connexions ouvertes avant et après correction, le temps de récupération du service.
> **Vérification** (observable, chiffrée) : le service dégradé répond en dégradé (pas en erreur totale) sous panne simulée, avec un temps de réponse mesuré et non estimé.
> **Repli 100 % local et gratuit** : simule la dépendance lente avec un petit serveur HTTP local qui répond après un délai configurable — aucun service cloud requis.
> **Extension** : rédige le postmortem complet (voir ADR/postmortem ci-dessous).

> **Exercice chronométré — casse ta préprod et reviens en moins de 5 minutes**
> **Temps réaliste** : 30 min, chronométré · **Prérequis matériel / compte** : un environnement de préprod local (Docker Compose suffit) · **Coût max** : 0 € ·
> **Mode** : assistant autorisé
> **Contraintes** : provoque volontairement une panne de déploiement dans ton environnement de préprod local, puis exécute la procédure de rollback en 6 gestes (7.1) chronomètre en main.
> **Réutilise** : la procédure de rollback en 6 gestes de 7.1
> **Piège** : sauter l'étape de vérification du readiness pour gagner du temps — le rollback qui n'est pas vérifié n'est pas terminé.
> **À observer** : le temps réellement écoulé entre la détection de la panne et le retour au vert du healthcheck.
> **Vérification** (observable, chiffrée) : le service répond correctement sur son endpoint de santé en moins de 5 minutes depuis le déclenchement de la panne, chronométré et noté.
> **Repli 100 % local et gratuit** : tout l'exercice se fait en local, aucune infrastructure cloud requise.
> **Extension** : refais l'exercice une semaine plus tard sans relire tes notes — le temps s'améliore-t-il ?

**Réflexe gagné.** Devant une nouvelle dépendance externe, ta première question n'est plus "comment je l'appelle ?" mais "que se passe-t-il quand elle est lente ?".

---

### 7.5 : Sécurité de production

**Tag : NOYAU DURABLE** · Coût : ~10 h avant utilité · Durée de vie : ~10 ans · À apprendre après : 7.4 Résilience · Prérequis : module `22_security/` complet

Ce que MyFunnyJS t'a appris (XSS, CSRF, injection, pollution de prototype, OWASP, chaîne d'approvisionnement) se traduit en production par une poignée de gestes :

- **Secrets** : gestionnaire dédié, rotation, jamais dans Git, jamais dans une image, jamais dans un bundle client. Un secret commité est compromis, même après suppression — l'historique le garde.
- **Moindre privilège** : l'utilisateur base de données de ton API n'a pas besoin de `DROP TABLE`. Le conteneur ne tourne pas en root.
- **En-têtes** : CSP, HSTS, `X-Content-Type-Options`. Une CSP bien faite transforme une XSS exploitable en tentative bloquée.
- **Limitation de débit** sur tout ce qui est public, en particulier l'authentification.
- **Journalisation d'audit** sur les actions sensibles — et **jamais** de données personnelles ou de secrets dans les logs (RGPD, `22_security/08_privacy_and_aiact.md`).
- **Dépendances** : scan en CI, mises à jour visibles en PR (Renovate/Dependabot), SBOM (Software Bill of Materials : inventaire exhaustif des dépendances livrées) si le contexte l'exige.

**Exemple qui casse : la dépendance transitive piégée.** Une petite bibliothèque de formatage, 40 lignes, vit en dépendance transitive de quatre paquets. Le mainteneur transfère le dépôt à un inconnu. La version suivante ajoute un script `postinstall` qui lit les variables d'environnement ; le build CI l'exécute avec les jetons de déploiement dans son environnement. Personne n'a jamais lu ce paquet — personne ne savait même qu'il était installé.


#### Ce que MyFunnyJS permet déjà de comprendre

- `22_security/01_xss_injection.md` : la zone protégée et la zone exposée de chaque framework, et pourquoi une CSP est une seconde barrière.
- `22_security/02_csrf_cors.md` : CORS n'est pas une protection serveur ; `SameSite` en est une.
- `22_security/09_supply_chain_sbom.md` : le scan en CI et le SBOM formalisent ce que tu as déjà audité à la main.
- `22_security/08_privacy_and_aiact.md` : une donnée personnelle dans un log est une fuite avec rétention.
- `26_observability/01_structured_logging.md` : une journalisation d'audit non structurée n'est pas exploitable en incident.

> **Exercice — audit de fuite**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : un de tes projets avec historique Git · **Coût max** : 0 € ·
> **Mode** : assistant autorisé
> **Contraintes** : cherche activement trois fuites sans lire le code d'abord — un secret présent dans l'historique Git, une donnée personnelle ou un token dans les logs, une valeur sensible présente dans le bundle client.
> **Réutilise** : `22_security/09_supply_chain_sbom.md`
> **Piège** : supprimer un secret du fichier ne le supprime pas de l'historique — la seule correction est la rotation.
> **À observer** : le commit exact où le secret apparaît, la ligne de log fautive, le fichier du bundle qui contient la valeur.
> **Vérification** (observable, chiffrée) : refais l'audit après correction — les trois recherches reviennent vides et l'ancien secret ne fonctionne plus.
> **Repli 100 % local et gratuit** : tout se fait sur ton dépôt local, sans service tiers.
> **Extension** : ajoute une étape de CI qui refuse une PR contenant un motif de secret, puis tente de la contourner.

**Ce que l'IA ne fera pas à ta place.** Elle écrira un middleware d'authentification correct dans 80 % des cas. Elle ne saura pas que, dans **ton** métier, un utilisateur du service support a le droit de voir la ressource d'un autre client mais pas de la modifier. Ce contexte n'est nulle part dans le prompt, et c'est exactement là que naissent les failles d'autorisation.

---

### 7.6 : Décider et documenter — ADR et postmortem

Le niveau 4 est celui où une mauvaise décision d'architecture coûte le plus cher. Deux livrables obligatoires, avec grille de relecture commune.

**Grille de relecture en 5 points (pour les deux livrables) :** (1) la décision est datée et nommée sans ambiguïté ; (2) au moins deux options réellement envisagées sont listées, pas une seule habillée en choix ; (3) le critère de décision est explicite et mesurable ; (4) les conséquences négatives assumées sont écrites, pas seulement les bénéfices ; (5) une version en 5 lignes, sans nom de techno, est lisible par quelqu'un qui ne code pas.

**Exemple qui casse : l'ADR qu'on n'a jamais écrit.** Une équipe choisit une file de messages plutôt qu'un appel direct, pour absorber les pics d'un partenaire. Deux ans plus tard, le partenaire a disparu, la file coûte de l'exploitation et ajoute de la latence, et personne n'ose la retirer : personne ne sait pourquoi elle est là. Un ADR de quinze lignes aurait rendu la suppression évidente en cinq minutes.


> **Exercice — ADR conteneur vs serverless**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : aucun · **Coût max** : 0 € ·
> **Mode** : assistant autorisé
> **Contraintes** : rédige un ADR complet suivant `27_team_craft/02_adr_writing.md`, à partir des mesures de l'exercice de 7.2. Ajoute la contrainte suivante : réécris la décision en 5 lignes pour un responsable produit, sans un seul nom de techno.
> **Réutilise** : `27_team_craft/02_adr_writing.md`
> **Piège** : justifier la décision par une préférence personnelle déguisée en critère technique.
> **À observer** : le nombre d'options réellement comparées avant de trancher.
> **Vérification** (observable, chiffrée) : la grille de relecture en 5 points est satisfaite point par point, cochée explicitement.
> **Repli 100 % local et gratuit** : aucune dépense, l'exercice est un livrable écrit.
> **Extension** : fais relire ta version "5 lignes sans techno" par quelqu'un qui ne code pas et note ce qu'il n'a pas compris.

> **Exercice — postmortem sans accusation**
> **Temps réaliste** : 1 h 30 · **Prérequis matériel / compte** : l'incident simulé de 7.4 · **Coût max** : 0 € ·
> **Mode** : assistant autorisé
> **Contraintes** : chronologie, impact, cause racine, action corrective, action préventive — format `26_observability/08_oncall_drill.md`. Ajoute la version 5 lignes sans nom de techno pour un responsable produit.
> **Réutilise** : `26_observability/08_oncall_drill.md`
> **Piège** : écrire "erreur humaine" comme cause racine — ce n'est jamais une cause racine, c'est un symptôme d'un système qui permettait l'erreur.
> **À observer** : le nombre d'actions préventives réellement actionnables (pas "faire plus attention").
> **Vérification** (observable, chiffrée) : la grille de relecture en 5 points est satisfaite point par point.
> **Repli 100 % local et gratuit** : aucune dépense.
> **Extension** : identifie quelle action préventive aurait aussi empêché une des quatre pannes de l'encadré 7.4.

**Diagramme — topologie conteneur/réseau Docker.**

```text
Hôte Docker
│
├── réseau bridge "app-net" (isolé du reste de la machine)
│   │
│   ├── conteneur "api"        ← port 3000 exposé UNIQUEMENT sur app-net
│   │     non-root, FS lecture seule sauf /tmp
│   │
│   ├── conteneur "db"         ← port 5432 exposé UNIQUEMENT sur app-net
│   │     jamais de port publié vers l'hôte : personne dehors ne l'atteint
│   │
│   └── conteneur "worker"     ← pas de port exposé du tout
│         consomme la file, écrit dans "db"
│
└── port 8080 de l'hôte → publié UNIQUEMENT vers "api" via un reverse proxy
      (seul point d'entrée public ; db et worker restent invisibles depuis
      l'extérieur de l'hôte, ce qui est la moitié du travail de sécurité réseau)
```

---

### Fiches canoniques — technos citées

**Terraform** — Tag : CONTEXTUELLE (périssable au niveau syntaxe) · Coût : ~10 h avant utilité · Durée de vie : ~6 ans · À apprendre après : 7.2 Cloud
- **Ancrage MyFunnyJS** : `31_annexes/03_finops_greenops.md` — décrire l'infra en code rend la facture relisible en PR
- **Ce qu'elle ajoute** : traçabilité et reproductibilité de l'infrastructure
- **Ce qu'elle masque** : la dérive d'état si quelqu'un modifie l'infra à la main entre deux applications
- **Ce qu'elle ne résout pas** : les mauvaises décisions d'architecture — elle les rend juste reproductibles
- **Quand ne pas la choisir** : pas avant d'avoir plus d'une poignée de ressources à gérer
- **Exemple qui casse** : `Error: resource already exists` après une création manuelle dans la console cloud
- **Preuve que c'est acquis** : tu peux relire un `terraform plan` et dire ce qu'il va détruire · **Si tu bloques, reviens à** : 7.2

**Jaeger / Grafana / Datadog / Sentry** — Tag : PÉRISSABLE / CONTEXTUELLE (le backend change, OpenTelemetry reste) · Coût : ~4 h par outil · Durée de vie : ~4 ans · À apprendre après : 7.3 Observabilité — ce que ça change côté mécanisme MyFunnyJS : aucun, ce sont des visualisations de ce que `26_observability/02_distributed_tracing.md` décrit déjà.

**OpenTelemetry** — Tag : NOYAU DURABLE · Coût : ~8 h avant utilité · Durée de vie : ~10 ans · À apprendre après : module `26_observability/`
- **Ancrage MyFunnyJS** : `26_observability/02_distributed_tracing.md` — c'est l'implémentation standard de la propagation de contexte
- **Ce qu'elle ajoute** : instrumentation vendor-neutre, portable d'un backend à l'autre
- **Ce qu'elle masque** : le coût de performance de l'instrumentation elle-même si mal configurée
- **Ce qu'elle ne résout pas** : elle ne choisit pas quoi tracer — c'est encore une décision humaine
- **Quand ne pas la choisir** : pas avant d'avoir au moins deux services qui se parlent
- **Exemple qui casse** : `Error: exporter timeout` quand le collecteur local n'est pas démarré
- **Preuve que c'est acquis** : tu retrouves une lenteur uniquement via la trace, sans lire le code · **Si tu bloques, reviens à** : 7.3

**Renovate / Dependabot** — Tag : PROFESSIONNELLE · Coût : ~2 h avant utilité · Durée de vie : ~6 ans · À apprendre après : 7.1 — ce que ça change côté mécanisme MyFunnyJS : automatise `00_getting_started/04_package_managers.md`, ne remplace pas la lecture du changelog avant de merger.

**Testcontainers** — Tag : PROFESSIONNELLE · Coût : ~4 h avant utilité · Durée de vie : ~6 ans · À apprendre après : 7.1
- **Ancrage MyFunnyJS** : `06_testing/09_test_strategy_not_framework.md` — tester contre un vrai PostgreSQL en conteneur plutôt qu'un mock
- **Ce qu'elle ajoute** : des tests d'intégration qui ressemblent vraiment à la prod
- **Ce qu'elle masque** : la lenteur du démarrage de conteneur si mal mis en cache en CI
- **Ce qu'elle ne résout pas** : les tests unitaires restent nécessaires, elle ne les remplace pas
- **Quand ne pas la choisir** : pas avant d'avoir une vraie dépendance externe à tester (base, file)
- **Exemple qui casse** : `Could not find a valid Docker environment` en CI sans Docker-in-Docker activé
- **Preuve que c'est acquis** : ton test d'intégration détecte une contrainte SQL que le mock aurait laissée passer · **Si tu bloques, reviens à** : 7.1

---

[← Niveau 3 : Backend](./03-niveau-3-backend.md) · [Sommaire](../README.md) · [Niveau 5 : Transfert →](./05-niveau-5-transfert.md)
