[← Sommaire TECH-ILA](../TECH-ILA.md)

# Niveau 3 : Backend (section 6)

---

## 6 : Niveau 3 : Backend

### 6.1 : Express (et les micro-frameworks)

**Tag : PROFESSIONNELLE** (omniprésent en legacy et en petit service) · Prérequis : `21_api_craft/01_express_from_scratch.md`

**Ce qu'il ajoute par-dessus `node:http` :** un routeur, une chaîne de middlewares, et rien d'autre. C'est sa force et sa limite.

#### Ce que MyFunnyJS permet déjà de comprendre

- `21_api_craft/01_express_from_scratch.md` : tu as déjà écrit le routeur et la chaîne de middlewares à la main ; Express n'en fait pas plus.
- `11_functional_js/03_composition.md` : un middleware est une fonction composée, avec un droit de court-circuit.
- `11_functional_js/04_currying.md` : un middleware configurable est une factory qui retourne un handler.
- `05_error_handling/04_async_error_traps.md` : la promesse rejetée qu'aucun middleware ne voit, et le client qui attend jusqu'au timeout.
- `01_fundamentals/02_scope/02_closure_trap.md` : une variable capturée au niveau module est partagée par **toutes** les requêtes.

**Le modèle mental : la chaîne de middlewares :**

```text
requête → [logger] → [cors] → [auth] → [validation] → [handler] → réponse
                                 ↓ next(err)
                          [gestionnaire d'erreurs]
```

C'est une **composition de fonctions** (`11_functional_js/03_composition.md`) où chaque maillon peut court-circuiter ou passer la main. Si tu as compris la composition et le pattern Chain of Responsibility (`12_design_patterns/`), tu as compris Express en dix minutes.

**Piège classique.** Dans Express 4, une erreur jetée dans un handler `async` n'est **pas** attrapée par le gestionnaire d'erreurs : la promesse rejetée n'est vue par personne. Le client attend jusqu'au timeout. C'est `05_error_handling/04_async_error_traps.md` en production. Correctif : un wrapper `asyncHandler`, ou Express 5, ou un framework qui gère l'async nativement.

**Quand le choisir.** Petit service, prototype, code legacy à maintenir, besoin de contrôle total sans opinion imposée.
**Quand ne pas le choisir.** Équipe de plus de trois personnes sur une API qui grossit : sans structure imposée, chacun invente la sienne. Six mois plus tard, personne ne sait où mettre un nouveau fichier.

**Alternatives.** Fastify (plus rapide, validation de schéma intégrée, excellent défaut moderne), Hono (léger, multi-runtime, edge), Koa. Le concept de middleware est identique partout.

> **Exercice.** Reproduis puis corrige le piège de l'erreur async. Écris trois routes : une qui jette de façon synchrone, une qui jette dans une promesse non enveloppée, une qui jette depuis un `setTimeout`. Contraintes : un seul middleware d'erreur, aucun `try/catch` dupliqué dans les handlers, un log structuré par erreur. Réutilise `05_error_handling/04_async_error_traps.md` : explique en trois lignes pourquoi ton middleware d'erreur ne voit pas les deux dernières. Piège réaliste : la troisième ne sera jamais rattrapée par un simple wrapper de handler : dis pourquoi et ce que tu mets en place à la place. À observer : le code HTTP reçu par le client, le temps qu'il attend, et ce que le process fait de l'erreur non gérée. Vérification : `curl` sur les trois routes renvoie une réponse en moins d'une seconde et aucun rejet non géré n'apparaît. Extension : ajoute un middleware qui capture une valeur de configuration au niveau module, et prouve qu'un second client reçoit la configuration du premier.

---

### 6.2 : NestJS

**Tag : PROFESSIONNELLE** (dominant sur les gros backends Node en Europe) · Prérequis : `18_oop_js/` complet, `14_typescript/`, `12_design_patterns/`, `16_architecture_patterns/04_clean_architecture.md`

#### Pourquoi il existe

Express ne dit rien sur l'organisation. Passé une certaine taille, chaque équipe réinvente sa structure, sa validation, son injection de dépendances, sa gestion d'erreurs. NestJS impose une architecture, largement inspirée d'Angular et de Spring.

#### Ce que MyFunnyJS permet déjà de comprendre

- **Décorateurs** : c'est le pattern Decorator (`12_design_patterns/02_structural/01_decorator_pattern.md`) avec de la métadonnée. `@Injectable()` ne fait pas de magie : il marque une classe pour le conteneur.
- **Injection de dépendances** : c'est l'inversion de dépendance de SOLID (`16_architecture_patterns/02_solid_principles.md`). Ta classe ne construit plus ses collaborateurs, on les lui donne. Conséquence pratique : tu peux tester en injectant un faux.
- **Guards / Interceptors / Pipes** : la même chaîne de responsabilité qu'Express, nommée et ordonnée.
- **Providers et cycle de vie** : un provider en portée singleton conserve son état entre les requêtes. Y stocker des données de requête est un bug de sécurité, pas un bug de performance.

#### Le cycle de vie d'une requête : à connaître par cœur (c'est du concept, pas de l'API)

```text
requête
  ↓ Middleware        (brut, façon Express)
  ↓ Guard             ai-je le droit ? → 403
  ↓ Interceptor       avant : logs, timers
  ↓ Pipe              validation + transformation du payload → 400
  ↓ Handler           la logique métier
  ↓ Interceptor       après : mapping de la réponse
  ↓ Exception filter  transformation des erreurs en réponses HTTP
réponse
```

Quand tu débogues "pourquoi mon code ne s'exécute pas", 80 % du temps la réponse est dans cet ordre.

#### Exemple réaliste

```ts
@Controller("ingest")
export class IngestController {
  constructor(private readonly ingest: IngestService) {} // DI, pas de `new`

  @UseGuards(ApiKeyGuard)
  @Post("events")
  async push(@Body() dto: PushEventsDto) {
    // Pipe de validation
    return this.ingest.enqueue(dto.events);
  }
}
```

Ce qui est invisible ici et qui compte : le guard s'exécute avant le pipe, donc un appelant non autorisé n'atteint jamais ta validation. Bonne nouvelle pour la sécurité, mauvaise nouvelle si tu comptais logger les payloads invalides.

#### Ce qu'il masque

Le conteneur d'injection et la résolution des dépendances. Symptôme typique : `Nest can't resolve dependencies of X` : un module n'exporte pas ce qu'un autre importe. L'erreur est intimidante ; elle dit littéralement quel argument est manquant, à quelle position.

#### Ce qu'il ne résout pas

Ton modèle de domaine. Une architecture NestJS impeccable avec une logique métier étalée dans les contrôleurs reste du code jetable. Nest range les fichiers ; il ne conçoit pas ton métier.

#### Testing

L'injection de dépendances est ton point de test : ta classe ne construit plus ses collaborateurs, tu lui injectes un faux dans un module de test. Les tests unitaires ciblent les services ; les tests d'intégration frappent l'application complète pour vérifier l'ordre guard → pipe → handler → exception filter, qui est justement ce que l'unitaire ne voit pas.

#### Sécurité

Le guard s'exécute avant le pipe : un appelant non autorisé n'atteint jamais ta validation. Deuxième point, moins connu : un provider en portée singleton conserve son état entre les requêtes. Y stocker des données de requête est un bug de sécurité (fuite d'un utilisateur vers un autre), pas un bug de performance.

#### Observabilité

C'est le point où l'architecture de NestJS paye vraiment. Les préoccupations transverses ont un endroit prévu : un **interceptor** entoure chaque handler, un **exception filter** voit toutes les erreurs sortantes, un logger injecté remplace le logger par défaut sans toucher un seul service.

Ce que ça donne concrètement : un identifiant de corrélation généré à l'entrée, propagé dans le contexte, présent dans chaque ligne de log et dans chaque span (`26_observability/01_structured_logging.md`, `02_distributed_tracing.md`). Instrumenter après coup un Express écrit à la main demande de toucher trente fichiers ; ici, un.

Le piège spécifique : un exception filter qui journalise et **renvoie une réponse 200**, ou qui renvoie la trace complète au client. Le premier rend l'erreur invisible pour l'appelant, le second lui offre le chemin de tes fichiers et parfois ta requête SQL.

#### Déploiement

Une application NestJS est un process Node de longue durée. Trois conséquences que la fiche Express ne pose pas de la même manière :

1. **L'arrêt gracieux n'est pas optionnel.** Sur `SIGTERM`, l'orchestrateur coupe. Sans `enableShutdownHooks`, les requêtes en vol sont perdues et les connexions à la base ne sont pas fermées proprement. Chaque déploiement produit alors une poignée d'erreurs 502 que personne ne relie au déploiement (`15_runtime_env/04_process_env_argv.md`).
2. **Le pool de connexions se dimensionne par instance, pas par service.** Dix instances à vingt connexions font deux cents connexions sur une base qui en accepte cent. Le service tombe à la montée en charge, c'est-à-dire au pire moment.
3. **La configuration se lit au démarrage, pas au build.** Contrairement au frontend, rien n'est inliné : un secret reste un secret. En revanche, une variable manquante doit faire **échouer le démarrage**, pas produire un `undefined` qui se propage jusqu'en production. Valide la configuration au boot avec le même schéma que tes DTO.

Sur le reste, c'est un conteneur Node standard : image de base à jour, utilisateur non root, endpoint de santé distinct de l'endpoint de disponibilité (`25_scalability/04_load_balancing.md`).

##### Pont vers les modules MyFunnyJS

`16_architecture_patterns/02_solid_principles.md` (la DI et le graphe de modules), `16_architecture_patterns/04_clean_architecture.md` (ce que la structure ne remplace pas), `12_design_patterns/01_creational/02_singleton_pattern.md` (l'état dans un provider singleton), `01_fundamentals/02_scope/02_closure_trap.md` (la même fuite, vue côté closure), `26_observability/01_structured_logging.md` et `02_distributed_tracing.md` (les interceptors ci-dessus), `05_error_handling/02_custom_errors.md` (ce qu'un exception filter doit formater).

#### Quand le choisir

Backend qui va vivre des années, équipe de plusieurs personnes, besoin d'une structure commune, TypeScript assumé, beaucoup de préoccupations transverses (auth, logs, validation, traçage).

#### Quand ne pas le choisir

Petit service, fonction serverless, prototype, équipe rebutée par les classes et les décorateurs. Le coût d'entrée est réel : concepts empruntés à Angular et Spring, beaucoup de fichiers pour un premier endpoint.

#### Alternatives et transfert

|                  | NestJS                      | Spring Boot             | .NET (ASP.NET Core)                | FastAPI                  |
| ---------------- | --------------------------- | ----------------------- | ---------------------------------- | ------------------------ |
| DI               | conteneur + décorateurs     | conteneur + annotations | conteneur intégré                  | dépendances par fonction |
| Validation       | pipes + class-validator/Zod | Bean Validation         | DataAnnotations / FluentValidation | Pydantic                 |
| Filtres d'erreur | exception filters           | `@ControllerAdvice`     | middleware / filtres               | handlers d'exception     |
| Interception     | interceptors                | AOP / aspects           | middleware / filtres               | dépendances + middleware |

Regarde ce tableau. **Ce sont les mêmes idées avec des noms différents.** Apprendre NestJS sérieusement, c'est apprendre 70 % de Spring Boot d'avance. C'est exactement l'objectif du niveau 5.

> **Exercice.** Implémente un guard qui limite le débit par clé d'API, avec compteur en Redis. Contraintes : la limite doit tenir avec plusieurs instances du service, et un dépassement renvoie 429 avec un header `Retry-After`. Piège : la version naïve `get` puis `set` a une race condition : prouve-la avec 200 requêtes concurrentes, puis corrige-la avec une opération atomique.

**Moment Thor.** Tu ne récites plus "NestJS c'est structuré". Tu sais que la structure est un ordre d'exécution, que la DI est un point de test, et que rien de tout ça ne remplace un modèle de domaine correct.

---

### 6.3 : Validation, authentification, autorisation

**Tag : NOYAU DURABLE** · Prérequis : `22_security/04_auth_flows.md`, `17_web_concepts/05_auth_authz.md`, `21_api_craft/04_auth_jwt.md`

#### Ce que MyFunnyJS permet déjà de comprendre

- `22_security/04_auth_flows.md` : la différence entre prouver qui tu es et obtenir un droit est déjà posée.
- `17_web_concepts/05_auth_authz.md` : pourquoi vérifier la présence d'un token ne vérifie pas la propriété de la ressource.
- `21_api_craft/04_auth_jwt.md` : ce qu'un JWT contient, et pourquoi ce contenu vieillit mal.
- `22_security/05_hashing_bcrypt.md` : sel, coût, algorithme dédié : un hachage rapide est un défaut, pas une optimisation.
- `28_edge_cases/01_nan_undefined_null.md` : une valeur absente n'est pas une valeur fausse ; beaucoup de contournements d'autorisation viennent de là.

**Validation.** Règle unique : **rien n'entre dans ton système sans être validé à la frontière**. Body, query, params, headers, webhooks (appels HTTP entrants déclenchés chez toi par un service tiers), messages de file, variables d'environnement au démarrage. Un schéma, une erreur 400 explicite, et un type dérivé. Zod côté TS, Pydantic côté Python, Bean Validation côté Java, DataAnnotations côté .NET : même geste.

**Authentification (qui es-tu ?) vs autorisation (as-tu le droit ?).** Confondre les deux produit la faille la plus courante des API : un utilisateur authentifié qui lit les données d'un autre en changeant un ID dans l'URL. Il faut vérifier **la propriété de la ressource**, pas seulement la présence d'un token.

**Sessions vs JWT : le vrai compromis :**

|             | Session serveur                    | JWT                                                                |
| ----------- | ---------------------------------- | ------------------------------------------------------------------ |
| Révocation  | immédiate                          | difficile (il faut une liste de révocation, donc… un état serveur) |
| Scalabilité | nécessite un store partagé (Redis) | sans état                                                          |
| Taille      | cookie court                       | token plus lourd à chaque requête                                  |
| Piège       | store à opérer                     | on met des données périmées dedans, on ne peut plus les invalider  |

Il n'y a pas de gagnant. Il y a un contexte. Un JWT de 24 h pour une application bancaire est une mauvaise décision ; pour une API machine-à-machine, c'est raisonnable.

**Mots de passe.** Jamais en clair, jamais en SHA-256 nu. Algorithme dédié au hachage de mot de passe (bcrypt, scrypt, argon2), avec sel, coût paramétrable (`22_security/05_hashing_bcrypt.md`). Et si tu peux déléguer à un fournisseur d'identité, délègue.

**Autorisation à l'échelle.** RBAC (rôles) est simple et suffit souvent. ABAC (attributs) est plus fin et plus complexe. Règle transférable : **les rôles ne se stockent jamais côté client, ni dans un champ modifiable par l'utilisateur.** Sinon, escalade de privilèges triviale.

> **Exercice.** Prends une API à trois endpoints. Écris les tests qui prouvent qu'un utilisateur A ne peut pas lire, modifier ni supprimer une ressource de B : en étant parfaitement authentifié. Si tu n'as pas ces tests, tu n'as pas d'autorisation, tu as de l'espoir.

---

### 6.4 : Redis

**Tag : PROFESSIONNELLE** · Prérequis : `24_databases/04_redis_caching.md`, `17_web_concepts/04_caching_strategies.md`

**Ce que c'est vraiment.** Un espace de structures de données en mémoire, partagé par toutes tes instances. Pas juste "un cache" : chaînes, hashes, ensembles, ensembles triés, listes, flux, compteurs atomiques, verrous, publication/abonnement.

#### Ce que MyFunnyJS permet déjà de comprendre

Redis n'introduit aucune structure nouvelle : il te donne celles que tu connais **partagées entre processus et persistantes au redémarrage de ton app**. Un `Set` JavaScript meurt avec ton process ; un `SET` Redis survit et est vu par toutes tes instances.

- `09_data_structures/` : chaînes, hashes, ensembles, listes, ensembles triés : déjà implémentées, ici exposées par le réseau.
- `24_databases/04_redis_caching.md` : ce qu'on met en cache, pour combien de temps, et ce qu'on n'y met jamais.
- `17_web_concepts/04_caching_strategies.md` : TTL, invalidation, `stale-while-revalidate` : le compromis fraîcheur/coût est déjà connu.
- `28_edge_cases/05_race_condition_hunter.md` : un `get` puis `set` sur un compteur partagé est une race condition, même côté client mono-thread.
- `08_memory_performance/01_gc/` : un cache sans limite de taille est une fuite mémoire avec un joli nom.

**Cas d'usage honnêtes :**

| Usage                 | Pourquoi Redis            | Piège                                                 |
| --------------------- | ------------------------- | ----------------------------------------------------- |
| Cache de lecture      | latence sub-milliseconde  | invalidation : le problème difficile                  |
| Rate limiting         | compteurs atomiques + TTL | sans atomicité, race condition                        |
| Sessions              | partagé entre instances   | attention à la durabilité                             |
| File de tâches légère | listes / streams          | pas de garanties d'un vrai broker                     |
| Verrou distribué      | `SET NX PX`               | plus subtil qu'il n'y paraît : expiration et horloges |

**Exemple qui casse : la ruée sur le cache (cache stampede).** Une clé très demandée expire. 3 000 requêtes constatent le vide au même instant et frappent la base simultanément. La base s'effondre. Le cache censé protéger la base vient de la tuer. Correctifs : verrou de recalcul, expiration avec jitter, ou `stale-while-revalidate` (servir le périmé pendant qu'on recalcule).

**Ce que Redis ne résout pas.** La cohérence. Deux sources de vérité (base + cache) divergeront. Le seul cache toujours correct est celui qui n'existe pas. Chaque cache est un **compromis assumé entre fraîcheur et coût** : et ce compromis doit être écrit quelque part, pas subi.

**Quand ne pas l'utiliser.** Comme base principale de données que tu ne peux pas te permettre de perdre, sans configuration de persistance sérieuse. Et pour un cache local à un seul process, une Map avec TTL suffit : n'ajoute pas un service pour ça.

> **Exercice.** Provoque une ruée sur le cache, puis éteins-la. Place un cache Redis devant une requête coûteuse (au moins 300 ms) avec un TTL court. Contraintes : envoie 500 requêtes concurrentes juste après l'expiration de la clé, compte les appels réellement arrivés à la base, puis ramène ce nombre à un seul. Réutilise `28_edge_cases/05_race_condition_hunter.md` : la version naïve `get` puis `set` laisse une fenêtre : nomme-la précisément avant de la corriger. Piège réaliste : la première idée qui vient (allonger le TTL) déplace le problème au lieu de le résoudre : mesure-le. À observer : le nombre d'appels à la base par vague, la latence p99 des 500 requêtes, et le comportement quand le recalcul lui-même échoue. Vérification : la même vague relancée trois fois donne le même nombre d'appels ; sinon ton correctif est chanceux, pas correct. Extension : compare verrou de recalcul, TTL avec jitter et `stale-while-revalidate`, et dis en trois lignes lequel tu déploies.

---

### 6.5 : Files de messages et workers

**Tag : NOYAU DURABLE** (le pattern) / **CONTEXTUELLE** (l'outil) · Prérequis : `25_scalability/07_message_queues.md`, `16_architecture_patterns/05_event_driven.md`

**Le problème.** Une requête HTTP doit répondre vite. Certains travaux sont lents : génération de rapport, transformation de fichiers, appel à un tiers capricieux, envoi en masse. Les faire dans le handler, c'est bloquer l'utilisateur et perdre le travail si le process redémarre.

#### Ce que MyFunnyJS permet déjà de comprendre

- `25_scalability/07_message_queues.md` : file, producteur, consommateur, livraison au moins une fois : le modèle est déjà posé.
- `16_architecture_patterns/05_event_driven.md` : publier un événement au lieu d'appeler une fonction, et ce que ça coûte en traçabilité.
- `03_async/06_backpressure.md` : un producteur plus rapide que ses workers finit toujours par remplir quelque chose.
- `12_design_patterns/` (patron Command) : un job est une commande sérialisée, c'est pour ça qu'il peut être rejoué.
- `05_error_handling/05_error_strategy.md` : quelle erreur mérite un retry et laquelle part en dead-letter est une stratégie, pas un réflexe.

```text
HTTP  →  valide  →  publie un job  →  202 Accepted (immédiat)
                          ↓
                     [ FILE ]
                          ↓
                  Worker (autre process, scalable indépendamment)
                          ↓
              résultat stocké / notification / webhook
```

**Les cinq notions qui comptent, indépendamment de l'outil :**

1. **Au moins une fois** : ton job sera parfois livré deux fois. Donc **tes handlers doivent être idempotents**. Ce n'est pas optionnel.
2. **Retry avec backoff exponentiel** : réessayer immédiatement en boucle achève un service déjà en difficulté.
3. **Dead-letter queue (DLQ)** (file d'attente de mise à l'écart des messages définitivement en échec) : après N échecs, on met de côté au lieu de boucler à l'infini.
4. **Ordre** : presque jamais garanti globalement. Si tu en as besoin, c'est une contrainte forte et coûteuse.
5. **Visibilité** : combien de jobs en attente, quel âge a le plus vieux ? Sans cette métrique, tu découvres le problème par un client.

**Outils.** BullMQ (Redis, écosystème Node, simple à démarrer), RabbitMQ (routage riche), Kafka (**CONTEXTUELLE** : flux à très haut débit, rejouables, coût opérationnel élevé), SQS (managé), pgboss (file dans PostgreSQL : souvent le meilleur choix quand tu as déjà PostgreSQL et pas encore de problème d'échelle).

**Le piège d'architecture.** Introduire Kafka pour 50 messages par minute. Tu viens d'ajouter un système distribué à opérer pour un problème qu'une table PostgreSQL réglait. C'est une décision qui se défend en ADR, ou qui ne se prend pas.

> **Exercice.** Construis un pipeline : un endpoint accepte un fichier de mesures, publie un job, un worker le traite par lots et écrit un résumé. Contraintes : le worker est tué au milieu du traitement (fais-le vraiment, `docker kill`), le job doit reprendre sans doublon, et un job qui échoue trois fois part en dead-letter. Vérification : lance deux workers en parallèle et prouve qu'aucune ligne n'est comptée deux fois.

**Arme débloquée.** Tu peux désormais lire une architecture asynchrone sans confondre "ça marche" et "ça survit à un redémarrage".

---

### 6.6 : Temps réel : WebSocket et SSE

**Tag : NOYAU DURABLE** (les concepts) · Prérequis : module `20_realtime/` complet

#### Ce que MyFunnyJS permet déjà de comprendre

- `20_realtime/` : le module entier : connexion persistante, flux d'événements, reconnexion.
- `12_design_patterns/` (patron Observer) : un abonnement sans désabonnement est une fuite, ici multipliée par le nombre de clients.
- `03_async/06_backpressure.md` : émettre plus vite que le client ne consomme fait monter la mémoire du serveur, pas celle du client.
- `01_fundamentals/02_scope/02_closure_trap.md` : un handler de socket qui capture l'état d'un utilisateur le garde en vie après sa déconnexion.

|                 | SSE                                                    | WebSocket                                |
| --------------- | ------------------------------------------------------ | ---------------------------------------- |
| Sens            | serveur → client                                       | bidirectionnel                           |
| Transport       | HTTP standard                                          | protocole distinct après upgrade         |
| Reconnexion     | automatique, avec `Last-Event-ID`                      | à ta charge                              |
| Proxies / infra | passe partout                                          | parfois bloqué, config nécessaire        |
| Bon pour        | notifications, flux de logs, progression, streaming IA | collaboration, jeux, chat bidirectionnel |

**Règle de décision honnête :** si le client n'a rien à envoyer en continu, SSE suffit et coûte dix fois moins cher en complexité. Beaucoup d'équipes déploient du WebSocket pour afficher une barre de progression.

**Ce que personne n'anticipe :**

- **La montée en charge.** Une connexion ouverte est un état sur une instance précise. Avec plusieurs instances, un message publié sur l'instance A doit atteindre un client connecté à l'instance B → il te faut un bus (Redis pub/sub, broker).
- **La reconnexion.** Le réseau mobile coupe. Que se passe-t-il pour les messages émis pendant la coupure ? Perdus ? Rejoués ? Cette question est une décision produit, pas technique.
- **La backpressure.** Si tu émets plus vite que le client ne consomme, la mémoire serveur monte. Tu as déjà vu ça : `03_async/06_backpressure.md`.

> **Exercice.** Diffuse un flux d'événements à plusieurs clients avec SSE. Coupe le réseau d'un client 20 secondes. À la reconnexion, il doit récupérer ce qu'il a manqué : ou recevoir explicitement un signal "trou dans le flux". Choisis, et justifie en trois lignes.

---

### 6.7 : GraphQL

**Tag : CONTEXTUELLE** · Prérequis : `21_api_craft/05_graphql_basics.md`

**Le problème résolu.** Des clients hétérogènes (web, mobile, tiers) qui ont besoin de formes de données différentes, et une API REST qui multiplie les endpoints ou sur-transfère.

#### Ce que MyFunnyJS permet déjà de comprendre

- `21_api_craft/05_graphql_basics.md` : schéma, requête, résolveur : les trois pièces sont déjà connues.
- `09_data_structures/` (graphes, BFS/DFS) : une requête GraphQL est un parcours de graphe, et sa profondeur est ton coût.
- `24_databases/05_db_in_js.md` : le N+1 vient de ce qu'un résolveur ignore ce que son voisin a déjà chargé.
- `17_web_concepts/04_caching_strategies.md` : ce que tu perds en faisant passer tout le trafic par un `POST` unique.
- `22_security/` : l'autorisation par champ est le même raisonnement que par endpoint, appliqué N fois.

**Ce qu'il ajoute.** Un schéma typé fort, une seule requête pour un graphe de données, une évolution sans versioning brutal, un outillage de découverte excellent.

**Ce qu'il complique : et c'est sérieux :**

| Problème        | Détail                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| N+1             | une requête imbriquée génère des centaines de requêtes SQL sans DataLoader                                       |
| Cache HTTP      | perdu : tout passe par un `POST /graphql`                                                                        |
| Autorisation    | à faire **par champ**, pas par endpoint                                                                          |
| Déni de service | une requête profondément imbriquée peut écrouler le serveur → limite de profondeur et de complexité obligatoires |
| Observabilité   | toutes les requêtes sur une seule URL : les métriques par endpoint ne veulent plus rien dire                     |

**Quand le choisir.** Beaucoup de clients aux besoins divergents, un domaine réellement en graphe, une équipe capable d'opérer ces cinq points.
**Quand ne pas le choisir.** Une API, un client, du CRUD. REST + un bon typage partagé (ou tRPC en monorepo TypeScript) est plus simple, mieux caché, plus facile à observer.

C'est **CONTEXTUELLE** et pas **PROFESSIONNELLE** dans ce document parce que son adoption est réelle mais très inégale selon les secteurs. Sache le lire, sache quand le refuser.

> **Exercice.** Expose trois entités liées (flux → mesures → auteur) en GraphQL, puis rends visible et corrige le N+1. Contraintes : active le log SQL, écris une requête imbriquée sur 50 flux, compte les requêtes SQL réellement émises, puis ramène ce nombre à un ordre de grandeur constant. Réutilise `24_databases/05_db_in_js.md` : explique pourquoi le problème vient de l'indépendance des résolveurs et non de la base. Piège réaliste : avec trois flux de test tout va bien ; le bug n'existe qu'à partir d'un certain volume, exactement comme en production. À observer : le nombre de requêtes SQL par requête GraphQL, la latence p95, et l'effet d'un `DataLoader` sur les deux. Vérification : la même requête sur 5, 50 puis 500 flux : le nombre de requêtes SQL ne doit pas suivre le nombre de flux. Extension : ajoute une limite de profondeur et de complexité, puis écris la requête qui aurait écroulé le serveur sans elle.

---
