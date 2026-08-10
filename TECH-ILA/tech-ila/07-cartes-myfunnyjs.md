---
statut: revu
last_reviewed: 2026-08
proprietaire: mainteneur TECH-ILA
revue: trimestrielle
companion: MyFunnyJS
---

[← Sommaire TECH-ILA](../README.md)

> **Tu viens de** : [06-niveau-6-ia.md](./06-niveau-6-ia.md)
> **Tu dois déjà savoir** : les six niveaux de TECH-ILA, au moins en survol
> **Ensuite** : [08-ia-exercices-marche-audit.md](./08-ia-exercices-marche-audit.md)

# Cartes MyFunnyJS ↔ technologies

Cette annexe se consulte, elle ne se lit pas. Tu ne dois jamais l'ouvrir en entier : tu
arrives ici avec un symptôme (une techno qui te résiste, un module MyFunnyJS que tu viens de
finir) et tu repars avec un lien. Les fiches complètes : coût, durée de vie, exemple qui
casse : sont dans les fichiers de niveau 01 à 06. Ici, tu trouves seulement le pont entre les
32 modules de MyFunnyJS et le monde technologique qui les réutilise.

**Point de couplage le plus fragile du document.** Cette carte est le seul endroit où TECH-ILA
dépend de l'arborescence exacte de MyFunnyJS. Si un lien casse, c'est ici en premier : un fichier
MyFunnyJS déplacé sans répercussion ici produit un lien mort. Contrat de dépendance : TECH-ILA
référence MyFunnyJS à l'état de la dernière revue trimestrielle (voir le rituel de recomptage du
[README](../README.md)), et un fichier MyFunnyJS référencé ici ne se déplace pas sans que le
déplacement soit répercuté dans le même changement. Le point de contrôle est le lien, pas le fichier.

Deux entrées possibles :

- **Section 10** : tu sors d'un module MyFunnyJS, tu veux savoir où ça sert.
- **Section 11** : tu es bloqué sur une techno, tu veux savoir quel mécanisme MyFunnyJS relire.

## Index alphabétique des technologies

<a id="idx-tech"></a>

Angular, Vue, Svelte · [Module 01](#mod-01) : CSS/design systems · [Module 19](#mod-19)
· Docker · [Module 15](#mod-15), [22](#mod-22) : Express · [Module 01](#mod-01),
[21](#mod-21) : FastAPI/Spring/.NET · [Module 21](#mod-21), [22](#mod-22) : GraphQL ·
[Module 21](#mod-21) : Java/Spring Boot · [Module 01](#mod-01), [03](#mod-03),
[18](#mod-18) : Kubernetes · [Module 25](#mod-25) : MongoDB · [Module 16](#mod-16),
[24](#mod-24) : NestJS · [Module 01](#mod-01), [16](#mod-16), [21](#mod-21) : Next.js ·
[Module 16](#mod-16), [17](#mod-17), [19](#mod-19) : Node.js · [Module 01](#mod-01),
[03](#mod-03), [15](#mod-15) : npm/pnpm · [Module 22](#mod-22) : OpenTelemetry ·
[Module 26](#mod-26) : PostgreSQL · [Module 24](#mod-24), [28](#mod-28) : Prisma/Drizzle ·
[Module 16](#mod-16), [24](#mod-24) : Python · [Module 01](#mod-01), [03](#mod-03) ·
React · [Module 01](#mod-01), [08](#mod-08), [11-12](#mod-11-12) : Redis ·
[Module 17](#mod-17), [20](#mod-20), [25](#mod-25) : Sentry · [Module 26](#mod-26) ·
SQL/index · [Module 07](#mod-07), [09-10](#mod-09-10), [24](#mod-24) : TypeScript ·
[Module 01](#mod-01), [14](#mod-14) : WebSocket/SSE · [Module 20](#mod-20).

## Index par module MyFunnyJS

<a id="idx-mod"></a>

01 [Fundamentals](#mod-01) · 02 [Problem solving](#mod-02) · 03 [Async](#mod-03) ·
04 [Debugging](#mod-04) · 05 [Error handling](#mod-05) · 06 [Testing](#mod-06) ·
07 [Math basics](#mod-07) · 08 [Memory & performance](#mod-08) · 09-10
[Structures & algos](#mod-09-10) · 11-12 [Functional & design patterns](#mod-11-12) ·
13 [Refactoring](#mod-13) · 14 [TypeScript](#mod-14) · 15 [Runtime env](#mod-15) ·
16 [Architecture patterns](#mod-16) · 17 [Web concepts](#mod-17) · 18 [OOP JS](#mod-18) ·
19 [Web inclusive](#mod-19) · 20 [Realtime](#mod-20) · 21 [API craft](#mod-21) ·
22 [Security](#mod-22) · 23 [AI native dev](#mod-23) · 24 [Databases](#mod-24) ·
25 [Scalability](#mod-25) · 26 [Observability](#mod-26) · 27 [Team craft](#mod-27) ·
28 [Edge cases](#mod-28) · 29 [AI agents & autonomy](#mod-29) · 30-31
[Mini-projects & annexes](#mod-30-31) · 32 [Tools](#mod-32).

---

## 10 : Carte MyFunnyJS → technologies, module par module

Chaque entrée tient en trois lignes : le mécanisme qu'on apprend, où il ressurgit, ce que ça
change concrètement. Quand un module n'a pas d'application technologique directe, c'est écrit
sans détour : inventer un lien serait pire que n'en donner aucun.

<a id="mod-00"></a>**Prélude : `00_getting_started/` et `00_referentiel/`.**
Shell, Git, gestionnaires de paquets, hygiène de sécurité perso, grille intemporel/périssable :
le socle qu'on utilise sans le nommer, tous les jours, dans tout écosystème. `07_repetition_espacee.md`
n'a aucune application technologique : c'est une méthode d'apprentissage, pas un concept transférable.
Technos : Linux, Git/GitHub, npm/pnpm/pip/Maven, 2FA et signature de commits.

<a id="mod-01"></a>**01 · `01_fundamentals/`.** Portée, référence, mutation, coercition :
le socle qui explique la moitié des bugs « ça marche en dev, pas en prod ». Une closure
capture des variables, pas des valeurs : c'est le piège classique des `useEffect` React et
des middlewares Express qui partagent un état entre tenants. Muter au lieu de remplacer casse
le re-rendu React et fait persister des entités ORM à ton insu.
Technos : React, Node.js, NestJS, TypeScript, Python, Java/Spring : `08_git_core.md` renvoie
directement à [4.2](./01-niveau-1-socle.md#42--git-et-github).

<a id="mod-02"></a>**02 · `02_problem_solving/`.** Clarifier une demande floue avant de coder
est la seule compétence que l'IA ne remplace pas. Aucun framework, aucun compilateur, aucun
test ne signale une spécification contradictoire : ils exécuteront fidèlement la mauvaise
chose. S'applique à la modélisation SQL, à la conception d'API, à l'architecture, au
prompting.

<a id="mod-03"></a>**03 · `03_async/`.** Ordre d'exécution, microtâches, annulation,
pression de flux. Un `await` mal placé bloque l'event loop pour toutes les requêtes en vol,
pas seulement la sienne. `Promise.all` sans limite de concurrence est un déni de service
envers ta propre base : `Promise.allSettled` et `mapWithConcurrency` existent pour ça.
Technos : Node.js, React (Suspense, transitions), NestJS, Python `asyncio` (même modèle,
`gather` ≈ `Promise.all`), Java/.NET (rupture : parallélisme réel).

<a id="mod-04"></a>**04 · `04_debugging/`.** Reproduire avant de corriger, formuler une
hypothèse falsifiable, distinguer symptôme et cause racine. C'est la compétence la plus
universelle du document : un débogueur méthodique reste utile dans un langage qu'il ne
connaît pas. Un `catch` vide qui fait taire un bug n'est pas un correctif, c'est un report
de facture.

<a id="mod-05"></a>**05 · `05_error_handling/`.** Une erreur est une donnée qui voyage :
décider où l'attraper, quoi transformer, quoi laisser remonter. Un `500` renvoyé pour une
entrée invalide fausse l'alerting, le retry automatique et le SLO en même temps.
Technos : API HTTP (4xx/5xx), NestJS (exception filters), Express (async non attrapé), React
(error boundaries), files (retry vs dead-letter).

<a id="mod-06"></a>**06 · `06_testing/`.** Voir la fiche outillage en
[4.8](./01-niveau-1-socle.md#48--testing-en-conditions-r%C3%A9elles). Le point qui ne bouge
pas : une suite verte où tout est mocké ne prouve rien, et une couverture à 90 % sans un seul
cas d'erreur testé ne vaut pas mieux.
Technos : Vitest/Jest/JUnit/pytest, Testcontainers, Playwright, Pact (contract testing).

<a id="mod-07"></a>**07 · `07_math_basics/`.** Verdict global : indirect, avec des
exceptions nettes : on n'invente pas de lien ici. Logique booléenne → clauses `WHERE` et
feature flags ; hachage → index, partitionnement, dédoublonnage ; probabilités → jitter de
retry et tests A/B. La manipulation binaire n'a quasiment aucune application en web courant :
sa valeur est de ne pas paniquer devant un masque binaire dans une bibliothèque.

<a id="mod-08"></a>**08 · `08_memory_performance/`.** Mesurer avant d'optimiser, comprendre
ce qui retient la mémoire. Un script qui vit 3 secondes pardonne tout ; un serveur qui vit
3 semaines ne pardonne rien. Un cache sans limite de taille est une fuite mémoire avec un
joli nom.
Technos : Node en production (OOM), React (listeners non nettoyés), SQL (`EXPLAIN`), JVM/.NET
(heap dumps), Core Web Vitals.

<a id="mod-09-10"></a>**09-10 · `09_data_structures/` et `10_algorithms/`.** Indirect
mais fondamental : le module que les juniors jugent inutile et que les seniors utilisent
tous les jours sans le nommer. Hash table = index de base et cache Redis. B-tree = tout
index SQL. Recherche binaire = `git bisect`. Programmation dynamique : rare en web, surtout
utile en entretien.

<a id="mod-11-12"></a>**11-12 · `11_functional_js/` et `12_design_patterns/`.** Pureté,
immutabilité, composition, puis Factory, Singleton, Decorator, Observer, Strategy. En
Java/C#, ces patrons sont souvent des classes ; en JS/Python, des fonctions : même intention,
forme différente. Un Singleton Node qui masque un état global partagé, un Observer sans
désabonnement : deux fuites classées ailleurs sous d'autres noms.

<a id="mod-13"></a>**13 · `13_refactoring/`.** SOLID, code smells, et la règle la plus
professionnelle du curriculum : ne réécris pas ce que tu ne peux pas expliquer. Le réflexe
junior face à une fonction de 400 lignes est de la réécrire ; le réflexe professionnel est de
l'entourer de tests caractérisants d'abord.

<a id="mod-14"></a>**14 · `14_typescript/`.** Voir
[4.5](./01-niveau-1-socle.md#45--typescript-en-conditions-r%C3%A9elles). Génériques et unions
discriminées se transfèrent vers Java/C#/Kotlin/Rust. Les types utilitaires acrobatiques, non :
s'ils prennent plus de temps à comprendre que le code qu'ils protègent, c'est un smell.

<a id="mod-15"></a>**15 · `15_runtime_env/`.** Node vs navigateur, streams, CommonJS vs
ESM, variables d'environnement, threads. Le service qui casse avec `ERR_REQUIRE_ESM` illustre
une règle qui vaut trois heures perdues à chaque nouveau projet : ESM se résout de façon
asynchrone, CommonJS de façon synchrone, on ne peut pas `require` un module ESM.

<a id="mod-16"></a>**16 · `16_architecture_patterns/`.** Le domaine ne dépend de rien ;
l'infrastructure en dépend. Un import d'ORM dans une règle métier, un `ObjectId` qui infiltre
le calcul des droits : deux symptômes d'une frontière qui n'existe que sur le schéma. Appliquer
la Clean Architecture intégralement à un service de 800 lignes est du sur-design : commence
par isoler le calcul métier, rien d'autre.
Technos : NestJS (DI par interface), Prisma/Drizzle (repository), Spring Boot, Next.js
(server actions).

<a id="mod-17"></a>**17 · `17_web_concepts/`.** HTTP/REST, cache, état et flux de données,
auth, sérialisation, SEO : le module le plus dense en transferts directs. Un cache est un
pari : donnée possiblement périmée contre latence et charge. Les questions restent les mêmes
partout : qui écrit, qui invalide, que se passe-t-il quand c'est vide, quand ça ment.
Technos : HTTP/CDN, Next.js (cache à trois niveaux), Redis, TanStack Query, PostgreSQL.

<a id="mod-18"></a>**18 · `18_oop_js/`.** Héritage contre composition : React a tranché en
supprimant l'option. Une `BaseExporter` qui accumule des drapeaux booléens pour désactiver ses
propres étapes est le signe que la hiérarchie décrit son historique plutôt que le domaine.
Technos : NestJS (providers plutôt que classes de base héritées), Java/C# (compilateur plus
tolérant à l'héritage profond, donc plus tentant), Go/Rust (pas d'héritage du tout).

<a id="mod-19"></a>**19 · `19_web_inclusive/`.** Accessibilité (i18n compris) : un instant
et sa représentation sont deux choses différentes, stocker en UTC, convertir à l'affichage.
Une colonne `timestamp` sans fuseau est le bug le plus cher et le plus silencieux d'une base.
Technos : PostgreSQL (`timestamptz`), API REST (ISO 8601), React/Next (hydratation multi-fuseaux),
ARIA, NVDA/VoiceOver, `Intl.NumberFormat`.

<a id="mod-20"></a>**20 · `20_realtime/`.** WebSocket, SSE, WebRTC : une décision de
topologie, pas une préférence. Diffuser un événement à tous les clients au lieu des seuls
abonnés concernés transforme un pic de charge modeste en cascade de pannes.
Technos : Redis pub/sub (multi-instance), load balancer (sessions collantes, arrêt gracieux),
WebRTC (contextuelle, rarement le bon premier outil).

<a id="mod-21"></a>**21 · `21_api_craft/`.** Une API est un contrat public : ses erreurs en
font partie, sa version aussi. RFC 9457 (`application/problem+json`) est le seul terrain
neutre entre écosystèmes.
Technos : Express (middleware d'erreur), NestJS (DTO, pipes), OpenAPI, FastAPI/Spring,
GraphQL (contextuelle, justifiée par des clients hétérogènes).

<a id="mod-22"></a>**22 · `22_security/`.** Ton code n'est pas ta surface d'attaque : tes
dépendances le sont. Un `postinstall` s'exécute sur ton poste, avec tes droits, avant toute
revue.
Technos : npm/pnpm (lockfile, audit), CI (scan bloquant, SBOM), Docker (CVE héritées), OWASP
(indépendant du langage).

<a id="mod-23"></a>**23 · `23_ai_native_dev/`.** Le code généré est une proposition, pas un
livrable. Le taux d'invention monte avec la niche de l'écosystème : sur React le modèle a vu
des millions d'exemples, sur ton framework interne il improvise avec le même aplomb.
Technos : assistants de code, CI (juge non complaisant), gestionnaires de paquets
(hallucination de dépendances).

<a id="mod-24"></a>**24 · `24_databases/`.** Le modèle de données survit à tous les
frameworks du projet. Une contrainte en base est la seule règle que personne ne peut
contourner : une unicité vérifiée seulement en JavaScript ne protège rien sous charge.
Technos : PostgreSQL, Prisma/Drizzle, MongoDB (contextuelle), Redis, modèle en étoile pour
l'analytique.

<a id="mod-25"></a>**25 · `25_scalability/`.** Le réseau échoue, la latence n'est pas
nulle : chaque appel distant peut partiellement réussir. Un timeout absent transforme une
panne partielle chez un tiers en panne totale chez toi.
Technos : HTTP interservices (retries, disjoncteur), files de messages (idempotence),
bases répliquées, Kubernetes.

<a id="mod-26"></a>**26 · `26_observability/`.** En production, pas de point d'arrêt : ce
qui n'a pas été instrumenté n'existe pas. La moyenne cache tout ; le p99 raconte l'expérience
réelle des clients mécontents.
Technos : pino/Winston, OpenTelemetry (standard multi-langage), Sentry, Prometheus/Grafana.

<a id="mod-27"></a>**27 · `27_team_craft/`.** Une décision non écrite n'existe pas. Un ADR
fige le contexte, les options, le choix et ses conséquences : y compris celles qu'on accepte
de subir. C'est le module le plus transférable du curriculum : aucun de ses gestes ne dépend
d'un langage.

<a id="mod-28"></a>**28 · `28_edge_cases/`.** `0.1 + 0.2 !== 0.3` n'est pas une bizarrerie
JavaScript, c'est la norme IEEE 754. Un montant en flottant est une comptabilité qui dérive
en silence.
Technos : PostgreSQL (`NUMERIC`), Java/C# (`BigDecimal`/`decimal`), API/JSON (arrondi en
transit).

<a id="mod-29"></a>**29 · `29_ai_agents_and_autonomy/`.** Un agent exécute ce qui est
vérifiable. Une consigne sans critère observable produit un travail qu'on ne peut ni valider
ni refuser : ce module vieillira vite, mais savoir écrire un critère d'acceptation et lire une
trace ne dépend d'aucun outil.

<a id="mod-30-31"></a>**30-31 · `30_mini_projects/` et `31_annexes/`.** Pas de fiche par
fichier : ce sont des lieux d'application, pas de concept. Les mini-projets se regroupent par
archétype de compétence (moteur métier sans framework, API sous contrainte, legacy, systèmes
distribués, transfert multi-langage, supervision de l'IA). Les annexes se piochent par
sous-dossier au moment où TECH-ILA en a besoin : `31_annexes/23_reading/`,
`31_annexes/29_toolchain/` et `31_annexes/30_transferability/` sont les plus réutilisés.
Attention au piège de lecture : les sous-dossiers d'annexes ont leur propre numérotation,
indépendante de celle des 32 modules. `31_annexes/23_reading/` n'a rien à voir avec
`23_ai_native_dev/`. Dans TECH-ILA, un chemin d'annexe s'écrit TOUJOURS préfixé de
`31_annexes/`.

<a id="mod-32"></a>**32 · `32_tools/`.** Construire soi-même l'outil minimal qu'on utilise
tous les jours, pour comprendre ce qu'une bibliothèque enrobe : pas pour le mettre en
production. Le geste professionnel : le construire une fois, puis adopter l'outil éprouvé en
sachant ce qu'il fait.

**Seuil franchi.** Les 32 modules sont cartographiés. Tu ne cherches plus « où réviser » : tu
pars du symptôme technologique et tu remontes au mécanisme. C'est l'objet de la section
suivante.

---

## 11 : Carte inverse : technologie → fichiers MyFunnyJS

Tu es bloqué dans une techno. Pars du symptôme, retrouve le mécanisme.

```text
Technologie
    ↓ Mécanisme utilisé
    ↓ Fichier MyFunnyJS à relire
    ↓ Compétence opérationnelle
```

| Symptôme rencontré                                    | Mécanisme réel                            | Fichier à relire                                                                                                                                                                                                                 | Ce que tu sauras faire                                         |
| ----------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| React : mon `setInterval` compte jusqu'à 1            | closure figée                             | [`01_fundamentals/02_scope/02_closure_trap.md`](../../01_fundamentals/02_scope/02_closure_trap.md)                                                                                                                               | lire un tableau de dépendances au lieu de le deviner           |
| React : la mauvaise réponse s'affiche                 | race condition                            | [`28_edge_cases/05_race_condition_hunter.md`](../../28_edge_cases/05_race_condition_hunter.md), [`03_async/03_async_await/02c_abort_controller.md`](../../03_async/03_async_await/02c_abort_controller.md)                             | annuler une requête obsolète                                   |
| React : muter l'état ne rerend pas                    | identité de référence                     | [`01_fundamentals/01_variables/02_reference_chaos.md`](../../01_fundamentals/01_variables/02_reference_chaos.md)                                                                                                                 | expliquer pourquoi l'immutabilité est une contrainte technique |
| Node : `heap out of memory`                           | tout chargé en mémoire                    | [`15_runtime_env/02_streams_buffers.md`](../../15_runtime_env/02_streams_buffers.md), [`08_memory_performance/04_profiling/`](../../08_memory_performance/04_profiling/)                                                         | passer en streaming et le prouver                              |
| Node : l'API entière ralentit                         | event loop bloquée                        | [`03_async/04_event_loop/`](../../03_async/04_event_loop/)                                                                                                                                                                       | déporter le CPU en worker                                      |
| Node : le client attend indéfiniment                  | rejet async non attrapé                   | [`05_error_handling/04_async_error_traps.md`](../../05_error_handling/04_async_error_traps.md)                                                                                                                                   | fermer tous les chemins d'erreur                               |
| Express : mon middleware d'erreur ne s'exécute jamais | promesse rejetée hors chaîne              | [`05_error_handling/03_error_propagation.md`](../../05_error_handling/03_error_propagation.md)                                                                                                                                   | envelopper les handlers async                                  |
| NestJS : `can't resolve dependencies`                 | graphe d'injection                        | [`16_architecture_patterns/02_solid_principles.md`](../../16_architecture_patterns/02_solid_principles.md)                                                                                                                       | lire un graphe de modules                                      |
| NestJS : données d'un client vues par un autre        | état dans un singleton                    | [`01_fundamentals/02_scope/02_closure_trap.md`](../../01_fundamentals/02_scope/02_closure_trap.md), [`12_design_patterns/01_creational/02_singleton_pattern.md`](../../12_design_patterns/01_creational/02_singleton_pattern.md) | placer l'état au bon endroit                                   |
| SQL : rapide en dev, lent en prod                     | plan d'exécution / index                  | [`09_data_structures/06_bst/`](../../09_data_structures/06_bst/), [`08_memory_performance/03_complexity/`](../../08_memory_performance/03_complexity/)                                                                           | lire un `EXPLAIN ANALYZE`                                      |
| SQL : doublons malgré la vérification                 | lecture-modification-écriture concurrente | [`28_edge_cases/05_race_condition_hunter.md`](../../28_edge_cases/05_race_condition_hunter.md)                                                                                                                                   | poser une contrainte d'unicité en base                         |
| SQL : montants faux au centime                        | flottants                                 | [`28_edge_cases/02_floating_point.md`](../../28_edge_cases/02_floating_point.md)                                                                                                                                                 | utiliser un type décimal                                       |
| Redis : la base s'effondre à l'expiration             | ruée sur le cache                         | [`17_web_concepts/04_caching_strategies.md`](../../17_web_concepts/04_caching_strategies.md)                                                                                                                                     | jitter, verrou, stale-while-revalidate                         |
| File : le job s'exécute deux fois                     | livraison au moins une fois               | [`25_scalability/07_message_queues.md`](../../25_scalability/07_message_queues.md)                                                                                                                                               | rendre le handler idempotent                                   |
| Docker : `permission denied`                          | uid / permissions                         | [`00_getting_started/02_shell_survival.md`](../../00_getting_started/02_shell_survival.md)                                                                                                                                       | lire des permissions Unix                                      |
| Docker : requêtes coupées au déploiement              | `SIGTERM` ignoré                          | [`15_runtime_env/04_process_env_argv.md`](../../15_runtime_env/04_process_env_argv.md)                                                                                                                                           | implémenter un arrêt gracieux                                  |
| CI : le test échoue 1 fois sur 20                     | test flaky                                | [`04_debugging/07_flaky_bugs.md`](../../04_debugging/07_flaky_bugs.md)                                                                                                                                                           | isoler la source de non-déterminisme                           |
| Prod : moyenne verte, clients furieux                 | p99 vs moyenne                            | [`26_observability/04_metrics_alerting.md`](../../26_observability/04_metrics_alerting.md)                                                                                                                                       | raisonner en percentiles                                       |
| Prod : erreur illisible dans la trace                 | source maps absentes                      | [`26_observability/07_prod_stack_trace_drill.md`](../../26_observability/07_prod_stack_trace_drill.md)                                                                                                                           | remonter à la ligne d'origine                                  |
| Python : ma closure ne modifie rien                   | `nonlocal`                                | [`01_fundamentals/02_scope/`](../../01_fundamentals/02_scope/)                                                                                                                                                                   | transférer le mécanisme entre langages                         |
| Java : `LazyInitializationException` / N+1            | chargement paresseux                      | [`24_databases/05_db_in_js.md`](../../24_databases/05_db_in_js.md), [`08_memory_performance/03_complexity/`](../../08_memory_performance/03_complexity/)                                                                         | reconnaître le N+1 dans tout ORM                               |
| C# : dictionnaire corrompu sous charge                | parallélisme réel                         | [`03_async/07_shared_memory_concurrency.md`](../../03_async/07_shared_memory_concurrency.md)                                                                                                                                     | comprendre ce que JS t'épargnait                               |
| IA : le code semble correct et casse en prod          | chemins d'erreur absents                  | [`23_ai_native_dev/03_validate_ai_output.md`](../../23_ai_native_dev/03_validate_ai_output.md)                                                                                                                                   | exiger une preuve avant de faire confiance                     |

**Arme débloquée.** Tu as une table de routage entre les symptômes du monde réel et les
mécanismes que tu connais. C'est exactement ce qu'un senior a dans la tête : sauf que la
tienne est écrite.

---

[← 06 · IA](./06-niveau-6-ia.md) · [Sommaire](../README.md) · [08 · Exercices & audit marché →](./08-ia-exercices-marche-audit.md)
