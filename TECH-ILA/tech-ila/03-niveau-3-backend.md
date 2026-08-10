---
statut: revu
last_reviewed: 2026-08
proprietaire: mainteneur TECH-ILA
revue: trimestrielle
companion: MyFunnyJS
---

[← Sommaire TECH-ILA](../README.md)

> **Tu viens de** : [02-niveau-2-frontend.md](./02-niveau-2-frontend.md) (React, état, Vite, routing/formulaires/a11y, Next.js, React Native)
> **Tu dois déjà savoir** : `node:http` et les fondamentaux Node (`01-niveau-1-socle.md`), composition de fonctions (`11_functional_js/03_composition.md`), les patrons SOLID de base (`16_architecture_patterns/02_solid_principles.md`)
> **Ensuite** : [04-niveau-4-systemes.md](./04-niveau-4-systemes.md) (CI/CD, cloud, observabilité, résilience)

# Niveau 3 : Backend (section 6)

---

## 6 : Niveau 3 : Backend

### 6.1 : Express (et les micro-frameworks)

**Express** : Tag : PROFESSIONNELLE (omniprésent en legacy et en petit service) ·
Coût : ~8 h avant utilité · Durée de vie : ~6 ans · À apprendre après : `node:http`, composition de fonctions

- **Ancrage MyFunnyJS** : [01_express_from_scratch.md](../../21_api_craft/01_express_from_scratch.md), tu as déjà écrit le routeur et la chaîne de middlewares à la main
- **Ce qu'il ajoute** : un routeur, une chaîne de middlewares, et rien d'autre. C'est sa force et sa limite.
- **Ce qu'il masque** : qu'une erreur jetée dans un handler `async` n'est pas attrapée par défaut, et qu'une variable capturée au niveau module est partagée par toutes les requêtes.
- **Ce qu'il ne résout pas** : l'organisation du code passé une certaine taille d'équipe ; aucune validation, aucune injection de dépendances par défaut.
- **Quand ne pas le choisir** : pas avant que l'équipe dépasse trois personnes sur une API qui grossit : sans structure imposée, chacun invente la sienne.
- **Exemple qui casse** : une route `async` qui jette est invisible pour le gestionnaire d'erreurs ; le client attend jusqu'au timeout, et le process affiche parfois `ERR_UNHANDLED_REJECTION` avant de mourir si rien ne capte le rejet au niveau global.
- **Preuve que c'est acquis** : tu sais écrire un middleware d'erreur unique qui voit toutes tes routes, y compris les async · **Si tu bloques, reviens à** : [01_express_from_scratch.md](../../21_api_craft/01_express_from_scratch.md)

**Ce qu'il ajoute par-dessus `node:http` :** un routeur, une chaîne de middlewares, et rien d'autre. C'est sa force et sa limite.

#### Ce que MyFunnyJS permet déjà de comprendre

- [01_express_from_scratch.md](../../21_api_craft/01_express_from_scratch.md) : tu as déjà écrit le routeur et la chaîne de middlewares à la main ; Express n'en fait pas plus.
- [03_composition.md](../../11_functional_js/03_composition.md) : un middleware est une fonction composée, avec un droit de court-circuit.
- [04_currying.md](../../11_functional_js/04_currying.md) : un middleware configurable est une factory qui retourne un handler.
- [04_async_error_traps.md](../../05_error_handling/04_async_error_traps.md) : la promesse rejetée qu'aucun middleware ne voit, et le client qui attend jusqu'au timeout.
- [02_closure_trap.md](../../01_fundamentals/02_scope/02_closure_trap.md) : une variable capturée au niveau module est partagée par **toutes** les requêtes.

**Le modèle mental : la chaîne de middlewares :**

```text
requête → [logger] → [cors] → [auth] → [validation] → [handler] → réponse
                                 ↓ next(err)
                          [gestionnaire d'erreurs]
```

C'est une **composition de fonctions** ([03_composition.md](../../11_functional_js/03_composition.md)) où chaque maillon peut court-circuiter ou passer la main. Si tu as compris la composition et le pattern Chain of Responsibility (`12_design_patterns/`), tu as compris Express en dix minutes.

**Ce qu'il masque : la frontière async invisible.** Dans Express 4, une erreur jetée dans un handler `async` n'est **pas** attrapée par le gestionnaire d'erreurs : la promesse rejetée n'est vue par personne. Le client attend jusqu'au timeout, et un `unhandledRejection` non traité au niveau du process peut afficher `ERR_UNHANDLED_REJECTION` avant de faire crasher l'application. C'est [04_async_error_traps.md](../../05_error_handling/04_async_error_traps.md) en production. Correctif : un wrapper `asyncHandler`, ou Express 5, ou un framework qui gère l'async nativement.

**Sécurité dans le code, pas seulement en prose :**

```js
// Handler avec validation de schéma en frontière et requête paramétrée
app.post("/streams/:id/events", requireApiKey, async (req, res, next) => {
  const parsed = eventSchema.safeParse(req.body); // validation en frontière
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  const apiSecret = process.env.INGEST_SECRET; // secret depuis l'environnement
  // console.log("secret utilisé:", apiSecret); // MAUVAIS : ne jamais journaliser un secret

  try {
    // requête paramétrée : jamais de concaténation de chaîne SQL
    await db.query("INSERT INTO events (stream_id, payload) VALUES ($1, $2)", [
      req.params.id,
      parsed.data,
    ]);
    // MAUVAIS : await db.query(`INSERT INTO events (stream_id, payload) VALUES (${req.params.id}, '${JSON.stringify(parsed.data)}')`);
    res.status(202).end();
  } catch (err) {
    next(err); // toute erreur passe par le middleware d'erreur unique
  }
});
```

#### Ce qui casse en production : trois pièges classiques

- **La configuration capturée une seule fois.** Un middleware qui met en cache une configuration dans une closure au niveau module (`config ??= await loadConfig(...)`) fonctionne parfaitement en développement, avec un seul tenant. En production multi-clients, le client B reçoit la configuration du client A : sans erreur, sans log, une fuite de données pure.
- **La concurrence non bornée.** Un service qui rafraîchit 800 flux avec `Promise.all(streams.map(fetchStats))` envoie 800 requêtes simultanées : le fournisseur bannit l'IP, le pool de connexions à la base explose. Le correctif n'est pas un framework différent, c'est une concurrence bornée (huit appels en vol maximum, pas huit cents).
- **Le code HTTP mal choisi.** Une route qui renvoie `500` pour un identifiant introuvable déclenche l'alerting à tort, fait réessayer un client qui croit à une panne transitoire, et noie le vrai incident du lendemain dans le bruit. C'était un `404`.
- **Le succès qui ment.** Une API qui renvoie `{ "error": "Utilisateur introuvable" }` avec un statut `200` pousse chaque consommateur à parser le message lui-même. Le jour où la phrase change, les intégrations qui la comparaient cassent en silence. Un code stable (`USER_NOT_FOUND`) et le bon statut HTTP rendent la faute impossible.

**Quand le choisir.** Petit service, prototype, code legacy à maintenir, besoin de contrôle total sans opinion imposée.
**Quand ne pas le choisir.** Équipe de plus de trois personnes sur une API qui grossit : sans structure imposée, chacun invente la sienne. Six mois plus tard, personne ne sait où mettre un nouveau fichier.

#### Alternatives

| Alternative        | Tag             | Ce qui change                                                        | Ce que ça change côté mécanisme MyFunnyJS                                                            |
| ------------------ | --------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Fastify**        | PROFESSIONNELLE | plus rapide, validation de schéma intégrée, excellent défaut moderne | le pipe de validation remplace le middleware maison, même chaîne de responsabilité                   |
| **Hono**           | CONTEXTUELLE    | léger, multi-runtime, edge                                           | la même composition de middlewares tourne aussi hors Node (Deno, Bun, Workers)                       |
| **Koa**            | PÉRISSABLE      | middlewares en `async/await` natif dès l'origine                     | plus besoin de wrapper `asyncHandler`, le piège async d'Express disparaît structurellement           |
| **Deno** (runtime) | CONTEXTUELLE    | permissions explicites, TypeScript natif                             | le modèle de sécurité par permission remplace la confiance implicite de Node                         |
| **Bun** (runtime)  | CONTEXTUELLE    | démarrage et installation très rapides                               | même graphe de middlewares, mais l'event loop et le profil mémoire diffèrent                         |
| **Go** (net/http)  | CONTEXTUELLE    | typage statique, goroutines au lieu de l'event loop                  | le concept de middleware existe encore, mais la concurrence n'est plus coopérative en un seul thread |

Le concept de middleware est identique partout.

> **Exercice : Le piège de l'erreur async**
> **Temps réaliste** : 1 h 30 · **Prérequis matériel / compte** : aucun · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : écris trois routes : une qui jette de façon synchrone, une qui jette dans une promesse non enveloppée, une qui jette depuis un `setTimeout` ; un seul middleware d'erreur, aucun `try/catch` dupliqué dans les handlers, un log structuré par erreur.
> **Réutilise** : [04_async_error_traps.md](../../05_error_handling/04_async_error_traps.md)
> **Piège** : la troisième ne sera jamais rattrapée par un simple wrapper de handler : dis pourquoi et ce que tu mets en place à la place (écoute sur `process.on('uncaughtException')`, mais seulement pour logguer et arrêter proprement, jamais pour continuer).
> **À observer** : le code HTTP reçu par le client, le temps qu'il attend, et ce que le process fait de l'erreur non gérée.
> **Vérification** (observable, chiffrée) : `curl` sur les trois routes renvoie une réponse en moins d'une seconde et aucun rejet non géré n'apparaît dans les logs du process.
> **Repli 100 % local et gratuit** : tout l'exercice tourne en local, aucun repli nécessaire.
> **Extension** : ajoute un middleware qui capture une valeur de configuration au niveau module, et prouve qu'un second client reçoit la configuration du premier.
> **Preuve du jeûne demandée** : avant d'écrire le code, rédige en 5 lignes ton hypothèse écrite sur laquelle des trois routes échappera au wrapper et pourquoi, horodatée avant toute exécution.

---

### 6.2 : NestJS

**NestJS** : Tag : PROFESSIONNELLE (dominant sur les gros backends Node en Europe) ·
Coût : ~35 h avant utilité · Durée de vie : ~7 ans · À apprendre après : POO, TypeScript, patrons de conception, architecture propre

- **Ancrage MyFunnyJS** : [02_solid_principles.md](../../16_architecture_patterns/02_solid_principles.md), l'injection de dépendances est l'inversion de dépendance de SOLID
- **Ce qu'il ajoute** : une architecture imposée, décorateurs, injection de dépendances, guards/interceptors/pipes ordonnés.
- **Ce qu'il masque** : le conteneur d'injection et la résolution des dépendances : symptôme typique, un module qui n'exporte pas ce qu'un autre importe.
- **Ce qu'il ne résout pas** : ton modèle de domaine ; Nest range les fichiers, il ne conçoit pas ton métier.
- **Quand ne pas le choisir** : pas avant d'avoir une équipe de plusieurs personnes et un backend fait pour durer : un petit service ou une fonction serverless paie un coût d'entrée disproportionné.
- **Exemple qui casse** : `Nest can't resolve dependencies of the IngestService (?). Please make sure that the argument at index 0 is available in the current context.` : un module n'exporte pas ce qu'un autre importe.
- **Preuve que c'est acquis** : tu sais réciter l'ordre exact middleware → guard → interceptor → pipe → handler → interceptor → filtre, et dire à quelle étape une requête invalide est rejetée · **Si tu bloques, reviens à** : [02_solid_principles.md](../../16_architecture_patterns/02_solid_principles.md)

#### Pourquoi il existe

Express ne dit rien sur l'organisation. Passé une certaine taille, chaque équipe réinvente sa structure, sa validation, son injection de dépendances, sa gestion d'erreurs. NestJS impose une architecture, largement inspirée d'Angular et de Spring.

#### Ce que MyFunnyJS permet déjà de comprendre

- **Décorateurs** : c'est le pattern Decorator ([01_decorator_pattern.md](../../12_design_patterns/02_structural/01_decorator_pattern.md)) avec de la métadonnée. `@Injectable()` ne fait pas de magie : il marque une classe pour le conteneur.
- **Injection de dépendances** : c'est l'inversion de dépendance de SOLID ([02_solid_principles.md](../../16_architecture_patterns/02_solid_principles.md)). Ta classe ne construit plus ses collaborateurs, on les lui donne. Conséquence pratique : tu peux tester en injectant un faux.
- **Guards / Interceptors / Pipes** : la même chaîne de responsabilité qu'Express, nommée et ordonnée.
- **Providers et cycle de vie** : un provider en portée singleton conserve son état entre les requêtes. Y stocker des données de requête est un bug de sécurité, pas un bug de performance.

#### Le cycle de vie d'une requête : à connaître par cœur (c'est du concept, pas de l'API)

```text
                       CYCLE DE VIE D'UNE REQUÊTE NESTJS

  requête HTTP
       │
       ▼
  ┌───────────┐  brut, façon Express
  │ Middleware │
  └─────┬─────┘
        ▼
  ┌───────────┐  ai-je le droit ? → sinon 403
  │   Guard    │
  └─────┬─────┘
        ▼
  ┌───────────────┐  avant : logs, timers
  │ Interceptor(1) │
  └───────┬───────┘
          ▼
  ┌───────────┐  validation + transformation → sinon 400
  │    Pipe    │
  └─────┬─────┘
        ▼
  ┌───────────┐  la logique métier
  │  Handler   │
  └─────┬─────┘
        ▼
  ┌───────────────┐  après : mapping de la réponse
  │ Interceptor(2) │
  └───────┬───────┘
          ▼
  ┌──────────────────┐  transforme les erreurs en réponses HTTP
  │ Exception filter  │  (capte aussi les erreurs jetées à toute étape ci-dessus)
  └─────────┬─────────┘
            ▼
        réponse HTTP
```

Quand tu débogues "pourquoi mon code ne s'exécute pas", 80 % du temps la réponse est dans cet ordre.

#### Exemple réaliste, avec sécurité montrée dans le code

```ts
@Controller("ingest")
export class IngestController {
  constructor(private readonly ingest: IngestService) {} // DI, pas de `new`

  @UseGuards(ApiKeyGuard) // guard AVANT le pipe : un appelant non autorisé n'atteint jamais la validation
  @Post("events")
  async push(@Body() dto: PushEventsDto) {
    // Pipe de validation en frontière
    const secret = process.env.INGEST_SIGNING_SECRET; // secret depuis l'environnement
    // this.logger.log(`secret: ${secret}`); // MAUVAIS : ne jamais journaliser un secret
    return this.ingest.enqueue(dto.events);
  }
}
```

Ce qui est invisible ici et qui compte : le guard s'exécute avant le pipe, donc un appelant non autorisé n'atteint jamais ta validation. Bonne nouvelle pour la sécurité, mauvaise nouvelle si tu comptais logger les payloads invalides.

#### Ce qu'il masque

Le conteneur d'injection et la résolution des dépendances. Symptôme littéral : `Nest can't resolve dependencies of the IngestService (?). Please make sure that the argument at index 0 is available in the current context.` : un module n'exporte pas ce qu'un autre importe. L'erreur est intimidante ; elle dit littéralement quel argument est manquant, à quelle position.

#### Ce qu'il ne résout pas

Ton modèle de domaine. Une architecture NestJS impeccable avec une logique métier étalée dans les contrôleurs reste du code jetable. Nest range les fichiers ; il ne conçoit pas ton métier.

#### Exemple qui casse : la dépendance directe au driver

Une équipe veut migrer de MongoDB vers PostgreSQL. Le code métier importe le driver Mongo dans 47 fichiers et manipule des `ObjectId` jusque dans le calcul des droits. La migration, estimée à trois semaines, en prend sept mois : ce n'est plus une migration de base, c'est une réécriture. La même application, avec un repository par agrégat derrière une interface, aurait changé quatre fichiers : exactement ce que l'inversion de dépendance de SOLID est censée acheter.

#### Testing

L'injection de dépendances est ton point de test : ta classe ne construit plus ses collaborateurs, tu lui injectes un faux dans un module de test. Les tests unitaires ciblent les services ; les tests d'intégration frappent l'application complète pour vérifier l'ordre guard → pipe → handler → exception filter, qui est justement ce que l'unitaire ne voit pas.

#### Sécurité

Le guard s'exécute avant le pipe : un appelant non autorisé n'atteint jamais ta validation. Deuxième point, moins connu : un provider en portée singleton conserve son état entre les requêtes. Y stocker des données de requête est un bug de sécurité (fuite d'un utilisateur vers un autre), pas un bug de performance.

#### Observabilité

C'est le point où l'architecture de NestJS paye vraiment. Les préoccupations transverses ont un endroit prévu : un **interceptor** entoure chaque handler, un **exception filter** voit toutes les erreurs sortantes, un logger injecté remplace le logger par défaut sans toucher un seul service.

Ce que ça donne concrètement : un identifiant de corrélation généré à l'entrée, propagé dans le contexte, présent dans chaque ligne de log et dans chaque span ([01_structured_logging.md](../../26_observability/01_structured_logging.md), [02_distributed_tracing.md](../../26_observability/02_distributed_tracing.md)). Instrumenter après coup un Express écrit à la main demande de toucher trente fichiers ; ici, un.

Le piège spécifique : un exception filter qui journalise et **renvoie une réponse 200**, ou qui renvoie la trace complète au client. Le premier rend l'erreur invisible pour l'appelant, le second lui offre le chemin de tes fichiers et parfois ta requête SQL.

#### Déploiement

Une application NestJS est un process Node de longue durée. Trois conséquences que la fiche Express ne pose pas de la même manière :

1. **L'arrêt gracieux n'est pas optionnel.** Sur `SIGTERM`, l'orchestrateur coupe. Sans `enableShutdownHooks`, les requêtes en vol sont perdues et les connexions à la base ne sont pas fermées proprement. Chaque déploiement produit alors une poignée d'erreurs 502 que personne ne relie au déploiement ([04_process_env_argv.md](../../15_runtime_env/04_process_env_argv.md)).
2. **Le pool de connexions se dimensionne par instance, pas par service.** Dix instances à vingt connexions font deux cents connexions sur une base qui en accepte cent. Le service tombe à la montée en charge, c'est-à-dire au pire moment. Symptôme observable : des requêtes qui échouent avec un timeout de pool (`timeout exceeded when trying to connect`), jamais avec un message clair sur la cause réelle (trop d'instances, pas assez de connexions autorisées côté base).
3. **La configuration se lit au démarrage, pas au build.** Contrairement au frontend, rien n'est inliné : un secret reste un secret. En revanche, une variable manquante doit faire **échouer le démarrage**, pas produire un `undefined` qui se propage jusqu'en production. Valide la configuration au boot avec le même schéma que tes DTO.

Sur le reste, c'est un conteneur Node standard : image de base à jour, utilisateur non root, endpoint de santé distinct de l'endpoint de disponibilité ([04_load_balancing.md](../../25_scalability/04_load_balancing.md)).

##### Pont vers les modules MyFunnyJS

[02_solid_principles.md](../../16_architecture_patterns/02_solid_principles.md) (la DI et le graphe de modules), [04_clean_architecture.md](../../16_architecture_patterns/04_clean_architecture.md) (ce que la structure ne remplace pas), [02_singleton_pattern.md](../../12_design_patterns/01_creational/02_singleton_pattern.md) (l'état dans un provider singleton), [02_closure_trap.md](../../01_fundamentals/02_scope/02_closure_trap.md) (la même fuite, vue côté closure), [01_structured_logging.md](../../26_observability/01_structured_logging.md) et [02_distributed_tracing.md](../../26_observability/02_distributed_tracing.md) (les interceptors ci-dessus), [02_custom_errors.md](../../05_error_handling/02_custom_errors.md) (ce qu'un exception filter doit formater).

#### Quand le choisir

Backend qui va vivre des années, équipe de plusieurs personnes, besoin d'une structure commune, TypeScript assumé, beaucoup de préoccupations transverses (auth, logs, validation, traçage).

#### Quand ne pas le choisir

Petit service, fonction serverless, prototype, équipe rebutée par les classes et les décorateurs. Le coût d'entrée est réel : concepts empruntés à Angular et Spring, beaucoup de fichiers pour un premier endpoint.

#### Matrice de décision : Express / Fastify / NestJS

| Contrainte                                                         | Express                                | Fastify                        | NestJS                                                  |
| ------------------------------------------------------------------ | -------------------------------------- | ------------------------------ | ------------------------------------------------------- |
| Équipe de 1-2 personnes, prototype rapide                          | bon                                    | bon                            | coût d'entrée trop élevé                                |
| Équipe de 4+ personnes, backend qui vivra des années               | risqué sans discipline forte           | correct si conventions écrites | **choix par défaut si tu n'as pas le temps**            |
| Débit très élevé, latence critique                                 | correct                                | **meilleur défaut mesuré**     | correct mais overhead du conteneur DI                   |
| Beaucoup de préoccupations transverses (auth, traçage, validation) | tout à câbler soi-même                 | à câbler avec des plugins      | **structure déjà prévue**                               |
| Fonction serverless, cold start critique                           | **léger, démarre vite**                | léger                          | coût de démarrage du conteneur DI perceptible           |
| Code legacy à maintenir sans réécriture                            | **déjà là, ne pas migrer sans raison** | migration à évaluer en ADR     | migration coûteuse, à réserver à une réécriture assumée |

**Choix par défaut si tu n'as pas le temps de trancher** : Fastify pour un service neuf sans contrainte de structure imposée ; NestJS si l'équipe dépasse trois personnes et que le projet doit vivre plus de deux ans.

#### Alternatives et transfert

|                  | NestJS                      | Spring Boot (PROFESSIONNELLE) | .NET / ASP.NET Core (PROFESSIONNELLE) | FastAPI (PROFESSIONNELLE) |
| ---------------- | --------------------------- | ----------------------------- | ------------------------------------- | ------------------------- |
| DI               | conteneur + décorateurs     | conteneur + annotations       | conteneur intégré                     | dépendances par fonction  |
| Validation       | pipes + class-validator/Zod | Bean Validation               | DataAnnotations / FluentValidation    | Pydantic                  |
| Filtres d'erreur | exception filters           | `@ControllerAdvice`           | middleware / filtres                  | handlers d'exception      |
| Interception     | interceptors                | AOP / aspects                 | middleware / filtres                  | dépendances + middleware  |

Regarde ce tableau. **Ce sont les mêmes idées avec des noms différents.** Apprendre NestJS sérieusement, c'est apprendre 70 % de Spring Boot d'avance. C'est exactement l'objectif du niveau 5.

> **Exercice : Rate limiting distribué avec Redis**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : Redis local (conteneur) · **Coût max** : 0 €
> **Mode** : assistant autorisé
> **Contraintes** : implémente un guard qui limite le débit par clé d'API, avec compteur en Redis ; la limite doit tenir avec plusieurs instances du service, et un dépassement renvoie 429 avec un header `Retry-After`.
> **Réutilise** : [05_race_condition_hunter.md](../../28_edge_cases/05_race_condition_hunter.md)
> **Piège** : la version naïve `get` puis `set` a une race condition : prouve-la avec 200 requêtes concurrentes, puis corrige-la avec une opération atomique (`INCR` + `EXPIRE` ou script Lua).
> **À observer** : le nombre de requêtes réellement acceptées sur 200 envoyées en rafale, avec et sans correction.
> **Vérification** (observable, chiffrée) : avec la version naïve, le nombre accepté dépasse la limite fixée ; avec la version corrigée, il ne la dépasse jamais, sur 10 exécutions.
> **Repli 100 % local et gratuit** : Redis en conteneur local, aucune instance cloud nécessaire.
> **Extension** : que se passe-t-il si Redis devient indisponible pendant une rafale : le guard doit-il fermer (bloquer tout) ou ouvrir (laisser tout passer) ?

**Moment Thor.** Tu ne récites plus "NestJS c'est structuré". Tu sais que la structure est un ordre d'exécution, que la DI est un point de test, et que rien de tout ça ne remplace un modèle de domaine correct.

---

### 6.3 : Validation, authentification, autorisation

**Auth / validation** : Tag : NOYAU DURABLE ·
Coût : ~12 h avant utilité · Durée de vie : ~10 ans (concepts) · À apprendre après : Express ou NestJS

- **Ancrage MyFunnyJS** : [04_auth_flows.md](../../22_security/04_auth_flows.md), la différence entre prouver qui tu es et obtenir un droit
- **Ce qu'elle ajoute** : une frontière explicite entre données non fiables et logique métier.
- **Ce qu'elle masque** : que vérifier la présence d'un token ne vérifie pas la propriété de la ressource : l'écart entre authentification et autorisation.
- **Ce qu'elle ne résout pas** : la conception du modèle de rôles ; une validation parfaite avec des rôles mal pensés reste exploitable.
- **Quand ne pas la choisir de façon superficielle** : ne jamais valider "juste côté client" : la validation client est un confort, jamais une protection.
- **Exemple qui casse** : un utilisateur authentifié change un identifiant dans l'URL et lit les données d'un autre : aucune erreur serveur, juste une mauvaise autorisation qui laisse passer.
- **Preuve que c'est acquis** : tu as des tests qui prouvent qu'un utilisateur A ne peut ni lire, ni modifier, ni supprimer une ressource de B en étant authentifié · **Si tu bloques, reviens à** : [05_auth_authz.md](../../17_web_concepts/05_auth_authz.md)

#### Ce que MyFunnyJS permet déjà de comprendre

- [04_auth_flows.md](../../22_security/04_auth_flows.md) : la différence entre prouver qui tu es et obtenir un droit est déjà posée.
- [05_auth_authz.md](../../17_web_concepts/05_auth_authz.md) : pourquoi vérifier la présence d'un token ne vérifie pas la propriété de la ressource.
- [04_auth_jwt.md](../../21_api_craft/04_auth_jwt.md) : ce qu'un JWT contient, et pourquoi ce contenu vieillit mal.
- [05_hashing_bcrypt.md](../../22_security/05_hashing_bcrypt.md) : sel, coût, algorithme dédié : un hachage rapide est un défaut, pas une optimisation.
- [01_nan_undefined_null.md](../../28_edge_cases/01_nan_undefined_null.md) : une valeur absente n'est pas une valeur fausse ; beaucoup de contournements d'autorisation viennent de là.

**Validation.** Règle unique : **rien n'entre dans ton système sans être validé à la frontière**. Body, query, params, headers, webhooks (appels HTTP entrants déclenchés chez toi par un service tiers), messages de file, variables d'environnement au démarrage. Un schéma, une erreur 400 explicite, et un type dérivé. Zod côté TS, Pydantic côté Python, Bean Validation côté Java, DataAnnotations côté .NET : même geste.

**Authentification (qui es-tu ?) vs autorisation (as-tu le droit ?).** Confondre les deux produit la faille la plus courante des API : un utilisateur authentifié qui lit les données d'un autre en changeant un ID dans l'URL. Il faut vérifier **la propriété de la ressource**, pas seulement la présence d'un token.

**Sécurité dans le code, pas seulement en prose :**

```ts
async function getInvoice(req: AuthedRequest, res: Response) {
  const invoice = await db.query(
    "SELECT * FROM invoices WHERE id = $1 AND owner_id = $2", // requête paramétrée + filtre de propriété
    [req.params.id, req.user.id],
  );
  // MAUVAIS : const invoice = await db.query(`SELECT * FROM invoices WHERE id = ${req.params.id}`);
  // MAUVAIS (l'erreur classique) : oublier `AND owner_id = $2` : la requête est "sûre" contre l'injection
  // mais n'importe quel utilisateur authentifié peut lire la facture de n'importe qui.
  if (!invoice) return res.status(404).end();
  return res.json(invoice);
}
```

**Sessions vs JWT : le vrai compromis :**

|             | Session serveur                    | JWT                                                                |
| ----------- | ---------------------------------- | ------------------------------------------------------------------ |
| Révocation  | immédiate                          | difficile (il faut une liste de révocation, donc… un état serveur) |
| Scalabilité | nécessite un store partagé (Redis) | sans état                                                          |
| Taille      | cookie court                       | token plus lourd à chaque requête                                  |
| Piège       | store à opérer                     | on met des données périmées dedans, on ne peut plus les invalider  |

Il n'y a pas de gagnant. Il y a un contexte. Un JWT de 24 h pour une application bancaire est une mauvaise décision ; pour une API machine-à-machine, c'est raisonnable.

**Mots de passe.** Jamais en clair, jamais en SHA-256 nu. Algorithme dédié au hachage de mot de passe (bcrypt, scrypt, argon2), avec sel, coût paramétrable ([05_hashing_bcrypt.md](../../22_security/05_hashing_bcrypt.md)). Et si tu peux déléguer à un fournisseur d'identité, délègue.

**Autorisation à l'échelle.** RBAC (rôles) est simple et suffit souvent. ABAC (attributs) est plus fin et plus complexe. Règle transférable : **les rôles ne se stockent jamais côté client, ni dans un champ modifiable par l'utilisateur.** Sinon, escalade de privilèges triviale.

> **Exercice : Prouver l'absence de fuite entre utilisateurs** : jeûne d'IA obligatoire
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : aucun · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : prends une API à trois endpoints ; écris les tests qui prouvent qu'un utilisateur A ne peut pas lire, modifier ni supprimer une ressource de B, en étant parfaitement authentifié.
> **Réutilise** : [05_auth_authz.md](../../17_web_concepts/05_auth_authz.md)
> **Piège** : un endpoint peut être protégé en lecture et oublié en écriture : teste les trois verbes, pas seulement GET.
> **À observer** : le code HTTP renvoyé pour chaque tentative croisée (403 ou 404, jamais 200 ni 500).
> **Vérification** (observable, chiffrée) : 3 endpoints × 3 verbes × 1 tentative croisée = 9 tests, tous rouges avant correction, tous verts après.
> **Repli 100 % local et gratuit** : base de test locale ou en mémoire, aucun service externe nécessaire.
> **Extension** : ajoute un rôle admin qui peut légitimement tout voir : comment le tests-tu sans casser les 9 précédents ?
> **Preuve du jeûne demandée** : avant d'écrire les tests, note en 5 lignes ton hypothèse écrite sur l'endroit précis où la vérification de propriété doit se faire (couche route, service, ou requête SQL), horodatée avant toute exécution.

---

### 6.4 : Redis

**Redis** : Tag : PROFESSIONNELLE ·
Coût : ~10 h avant utilité · Durée de vie : ~8 ans · À apprendre après : structures de données de base, stratégies de cache

- **Ancrage MyFunnyJS** : `09_data_structures/`, les mêmes structures que tu connais, partagées entre processus et persistantes au redémarrage
- **Ce qu'il ajoute** : un espace de structures de données en mémoire partagé par toutes tes instances : chaînes, hashes, ensembles, ensembles triés, listes, flux, compteurs atomiques, verrous, pub/sub.
- **Ce qu'il masque** : que « mettre en cache » n'est pas gratuit : chaque cache introduit une deuxième source de vérité, donc une question d'invalidation jamais totalement résolue.
- **Ce qu'il ne résout pas** : la cohérence. Deux sources de vérité (base + cache) divergeront toujours à un moment.
- **Quand ne pas le choisir** : pas comme base principale de données que tu ne peux pas te permettre de perdre sans configuration de persistance sérieuse ; pour un cache local à un seul process, une Map avec TTL suffit.
- **Son mode de panne principal : l'invalidation.** Une clé très demandée expire, des milliers de requêtes constatent le vide au même instant et frappent la base simultanément (cache stampede) : le cache censé protéger la base la tue.
- **Exemple qui casse** : une page d'accueil met son bloc de statistiques en cache 300 s. Un déploiement vide le cache ; à la réouverture, 4 000 requêtes simultanées trouvent le vide et partent toutes en base sur la même requête d'agrégation à 900 ms. La base sature, les timeouts commencent, les clients réessaient, la charge double : sans aucun message d'erreur avant l'effondrement complet.
- **Preuve que c'est acquis** : tu sais nommer, sans hésiter, ce que tu ne mets jamais dans Redis, et le compromis fraîcheur/coût de chaque clé que tu y places · **Si tu bloques, reviens à** : [04_redis_caching.md](../../24_databases/04_redis_caching.md)

**Ce que c'est vraiment.** Un espace de structures de données en mémoire, partagé par toutes tes instances. Pas juste "un cache" : chaînes, hashes, ensembles, ensembles triés, listes, flux, compteurs atomiques, verrous, publication/abonnement.

#### Ce que MyFunnyJS permet déjà de comprendre

Redis n'introduit aucune structure nouvelle : il te donne celles que tu connais **partagées entre processus et persistantes au redémarrage de ton app**. Un `Set` JavaScript meurt avec ton process ; un `SET` Redis survit et est vu par toutes tes instances.

- `09_data_structures/` : chaînes, hashes, ensembles, listes, ensembles triés : déjà implémentées, ici exposées par le réseau.
- [04_redis_caching.md](../../24_databases/04_redis_caching.md) : ce qu'on met en cache, pour combien de temps, et ce qu'on n'y met jamais.
- [04_caching_strategies.md](../../17_web_concepts/04_caching_strategies.md) : TTL, invalidation, `stale-while-revalidate` : le compromis fraîcheur/coût est déjà connu.
- [05_race_condition_hunter.md](../../28_edge_cases/05_race_condition_hunter.md) : un `get` puis `set` sur un compteur partagé est une race condition, même côté client mono-thread.
- `08_memory_performance/01_gc/` : un cache sans limite de taille est une fuite mémoire avec un joli nom.

**Cas d'usage honnêtes :**

| Usage                 | Pourquoi Redis            | Piège                                                 |
| --------------------- | ------------------------- | ----------------------------------------------------- |
| Cache de lecture      | latence sub-milliseconde  | invalidation : le problème difficile                  |
| Rate limiting         | compteurs atomiques + TTL | sans atomicité, race condition                        |
| Sessions              | partagé entre instances   | attention à la durabilité                             |
| File de tâches légère | listes / streams          | pas de garanties d'un vrai broker                     |
| Verrou distribué      | `SET NX PX`               | plus subtil qu'il n'y paraît : expiration et horloges |

#### Ce que tu logues ici et avec quel identifiant

Journalise chaque `MISS` de cache avec la clé demandée et l'identifiant de corrélation de la requête entrante, jamais la valeur mise en cache elle-même si elle contient des données personnelles. Journalise chaque invalidation explicite avec la clé, la raison (expiration naturelle, invalidation manuelle, purge) et l'identifiant de corrélation, pour pouvoir reconstituer après coup pourquoi une donnée était périmée au moment d'un incident.

**Exemple qui casse : la ruée sur le cache (cache stampede).** Une clé très demandée expire. 3 000 requêtes constatent le vide au même instant et frappent la base simultanément. La base s'effondre. Le cache censé protéger la base vient de la tuer. Correctifs : verrou de recalcul, expiration avec jitter, ou `stale-while-revalidate` (servir le périmé pendant qu'on recalcule).

**Ce que Redis ne résout pas.** La cohérence. Deux sources de vérité (base + cache) divergeront. Le seul cache toujours correct est celui qui n'existe pas. Chaque cache est un **compromis assumé entre fraîcheur et coût** : et ce compromis doit être écrit quelque part, pas subi.

**Quand ne pas l'utiliser.** Comme base principale de données que tu ne peux pas te permettre de perdre, sans configuration de persistance sérieuse. Et pour un cache local à un seul process, une Map avec TTL suffit : n'ajoute pas un service pour ça.

> **Exercice : Provoquer puis éteindre une ruée sur le cache**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : Redis local (conteneur) · **Coût max** : 0 €
> **Mode** : assistant autorisé
> **Contraintes** : place un cache Redis devant une requête coûteuse (au moins 300 ms) avec un TTL court ; envoie 500 requêtes concurrentes juste après l'expiration de la clé, compte les appels réellement arrivés à la base, puis ramène ce nombre à un seul.
> **Réutilise** : [05_race_condition_hunter.md](../../28_edge_cases/05_race_condition_hunter.md)
> **Piège** : la première idée qui vient (allonger le TTL) déplace le problème au lieu de le résoudre : mesure-le.
> **À observer** : le nombre d'appels à la base par vague, la latence p99 des 500 requêtes, et le comportement quand le recalcul lui-même échoue.
> **Vérification** (observable, chiffrée) : la même vague relancée trois fois donne le même nombre d'appels ; sinon ton correctif est chanceux, pas correct.
> **Repli 100 % local et gratuit** : Redis en conteneur local, script de charge en local, aucun service cloud requis.
> **Extension** : compare verrou de recalcul, TTL avec jitter et `stale-while-revalidate`, et dis en trois lignes lequel tu déploies.

---

### 6.5 : Files de messages et workers

**Files / queues** : Tag : NOYAU DURABLE (le pattern) / CONTEXTUELLE (l'outil) ·
Coût : ~15 h avant utilité · Durée de vie : ~10 ans (pattern) / ~4 ans (outil) · À apprendre après : Redis, event-driven

- **Ancrage MyFunnyJS** : [07_message_queues.md](../../25_scalability/07_message_queues.md), file, producteur, consommateur, livraison au moins une fois
- **Ce qu'elle ajoute** : une réponse rapide à l'appelant, un traitement lent découplé et rejouable.
- **Ce qu'elle masque** : que « au moins une fois » signifie qu'un job sera parfois livré deux fois : l'idempotence n'est pas optionnelle, elle est la condition de correction.
- **Ce qu'elle ne résout pas** : l'ordre global (presque jamais garanti) ni la visibilité (sans métrique de profondeur de file, le problème se découvre par un client).
- **Quand ne pas la choisir** : pas avant d'avoir un vrai volume ou un vrai besoin de découplage : introduire Kafka pour 50 messages par minute ajoute un système distribué à opérer pour un problème qu'une table PostgreSQL réglait.
- **Exemple qui casse** : un worker tué en plein traitement (`docker kill`) relance le même job au redémarrage ; sans idempotence, la ligne est comptée deux fois, sans aucune erreur visible.
- **Preuve que c'est acquis** : tu sais faire tourner deux workers en parallèle et prouver qu'aucun traitement n'est compté deux fois · **Si tu bloques, reviens à** : [07_message_queues.md](../../25_scalability/07_message_queues.md)

**Le problème.** Une requête HTTP doit répondre vite. Certains travaux sont lents : génération de rapport, transformation de fichiers, appel à un tiers capricieux, envoi en masse. Les faire dans le handler, c'est bloquer l'utilisateur et perdre le travail si le process redémarre.

#### Ce que MyFunnyJS permet déjà de comprendre

- [07_message_queues.md](../../25_scalability/07_message_queues.md) : file, producteur, consommateur, livraison au moins une fois : le modèle est déjà posé.
- [05_event_driven.md](../../16_architecture_patterns/05_event_driven.md) : publier un événement au lieu d'appeler une fonction, et ce que ça coûte en traçabilité.
- [06_backpressure.md](../../03_async/06_backpressure.md) : un producteur plus rapide que ses workers finit toujours par remplir quelque chose.
- `12_design_patterns/` (patron Command) : un job est une commande sérialisée, c'est pour ça qu'il peut être rejoué.
- [05_error_strategy.md](../../05_error_handling/05_error_strategy.md) : quelle erreur mérite un retry et laquelle part en dead-letter est une stratégie, pas un réflexe.

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

#### Ce que tu logues ici et avec quel identifiant

Journalise, à la publication du job, l'identifiant de job et l'identifiant de corrélation de la requête d'origine, propagés ensemble jusqu'au worker. Journalise, à chaque tentative du worker, le numéro de tentative et le résultat (succès, échec retryable, échec définitif vers la DLQ) sous ce même identifiant de job : sans ce fil, un job qui échoue trois fois puis réussit apparaît comme trois incidents distincts au lieu d'un seul.

**Outils.**

| Outil                   | Tag             | Ce que ça change côté mécanisme MyFunnyJS                                                                 |
| ----------------------- | --------------- | --------------------------------------------------------------------------------------------------------- |
| **BullMQ** (Redis)      | PROFESSIONNELLE | même Redis que la fiche 6.4, les jobs sont des structures de données Redis sérialisées                    |
| **RabbitMQ**            | PROFESSIONNELLE | routage riche par exchange, le modèle producteur/consommateur devient explicite dans la configuration     |
| **Kafka**               | CONTEXTUELLE    | flux à très haut débit, rejouables, coût opérationnel élevé : un log distribué, pas une file classique    |
| **SQS**                 | CONTEXTUELLE    | managé, visibilité et DLQ fournies nativement, mais latence de livraison plus élevée                      |
| **pgboss** (PostgreSQL) | PROFESSIONNELLE | la file vit dans ta base existante : souvent le meilleur choix tant qu'il n'y a pas de problème d'échelle |

**Le piège d'architecture.** Introduire Kafka pour 50 messages par minute. Tu viens d'ajouter un système distribué à opérer pour un problème qu'une table PostgreSQL réglait. C'est une décision qui se défend en ADR, ou qui ne se prend pas.

> **Exercice : Pipeline résilient au redémarrage d'un worker**
> **Temps réaliste** : 3 h · **Prérequis matériel / compte** : Docker local · **Coût max** : 0 €
> **Mode** : assistant autorisé
> **Contraintes** : construis un pipeline : un endpoint accepte un fichier de mesures, publie un job, un worker le traite par lots et écrit un résumé ; le worker est tué au milieu du traitement (fais-le vraiment, `docker kill`), le job doit reprendre sans doublon, et un job qui échoue trois fois part en dead-letter.
> **Réutilise** : [07_message_queues.md](../../25_scalability/07_message_queues.md)
> **Piège** : rendre un job idempotent en le vérifiant "s'il existe déjà" introduit sa propre race condition si deux workers le voient en même temps : teste avec deux workers en parallèle, pas un seul.
> **À observer** : le nombre de lignes comptées dans le résumé final, le nombre de tentatives par job, et le contenu de la dead-letter après un échec forcé.
> **Vérification** (observable, chiffrée) : lance deux workers en parallèle et prouve qu'aucune ligne n'est comptée deux fois, sur au moins 3 exécutions du scénario `docker kill`.
> **Repli 100 % local et gratuit** : file en conteneur local (Redis ou PostgreSQL selon l'outil choisi), aucun service managé nécessaire.
> **Extension** : que se passe-t-il si le worker crashe juste après avoir écrit le résumé mais avant d'accuser réception du job ?

**Arme débloquée.** Tu peux désormais lire une architecture asynchrone sans confondre "ça marche" et "ça survit à un redémarrage".

---

### 6.6 : Temps réel : WebSocket et SSE

**Temps réel** : Tag : NOYAU DURABLE (les concepts) ·
Coût : ~10 h avant utilité · Durée de vie : ~9 ans · À apprendre après : files de messages, event loop

- **Ancrage MyFunnyJS** : `20_realtime/`, connexion persistante, flux d'événements, reconnexion
- **Ce qu'il ajoute** : un canal ouvert qui pousse des données sans que le client les redemande.
- **Ce qu'il masque** : qu'une connexion ouverte est un état attaché à une instance précise du serveur : avec plusieurs instances, un message publié sur A doit atteindre un client connecté à B.
- **Ce qu'il ne résout pas** : la décision produit "que se passe-t-il pour les messages émis pendant une coupure réseau" : perdus, rejoués, signalés comme trou dans le flux.
- **Quand ne pas le choisir** : pas avant que le client ait un vrai besoin d'émettre en continu : si le client n'a rien à envoyer, SSE suffit et coûte dix fois moins cher en complexité que WebSocket.
- **Exemple qui casse** : un handler de socket qui capture l'état d'un utilisateur dans une closure le garde en vie après sa déconnexion : fuite mémoire multipliée par le nombre de clients, sans erreur visible avant la saturation.
- **Preuve que c'est acquis** : tu sais dire, pour ton cas, ce qui arrive aux messages émis pendant une coupure de 20 secondes, et pourquoi tu as choisi cette réponse · **Si tu bloques, reviens à** : [06_backpressure.md](../../03_async/06_backpressure.md)

#### Ce que MyFunnyJS permet déjà de comprendre

- `20_realtime/` : le module entier : connexion persistante, flux d'événements, reconnexion.
- `12_design_patterns/` (patron Observer) : un abonnement sans désabonnement est une fuite, ici multipliée par le nombre de clients.
- [06_backpressure.md](../../03_async/06_backpressure.md) : émettre plus vite que le client ne consomme fait monter la mémoire du serveur, pas celle du client.
- [02_closure_trap.md](../../01_fundamentals/02_scope/02_closure_trap.md) : un handler de socket qui capture l'état d'un utilisateur le garde en vie après sa déconnexion.

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
- **La backpressure.** Si tu émets plus vite que le client ne consomme, la mémoire serveur monte. Tu as déjà vu ça : [06_backpressure.md](../../03_async/06_backpressure.md).

#### Ce qui casse en production

Un tableau de bord diffuse chaque événement à **tous** les clients connectés, sans filtrage ni regroupement. En démonstration, quatre navigateurs : tout va bien. En production, 900 clients et 200 événements par minute donnent 180 000 messages par minute ; la boucle d'événements du serveur ne redescend plus, et le service tombe en cascade. Le correctif n'est pas de changer de bibliothèque : c'est de regrouper les événements par fenêtre de temps et de n'envoyer qu'aux abonnés réellement concernés.

> **Exercice : Reconnexion sans trou silencieux**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : aucun · **Coût max** : 0 €
> **Mode** : assistant autorisé
> **Contraintes** : diffuse un flux d'événements à plusieurs clients avec SSE ; coupe le réseau d'un client 20 secondes ; à la reconnexion, il doit récupérer ce qu'il a manqué, ou recevoir explicitement un signal "trou dans le flux".
> **Réutilise** : `20_realtime/`
> **Piège** : `Last-Event-ID` ne fonctionne que si le serveur a conservé un historique : sans buffer côté serveur, la reconnexion "automatique" ne rattrape rien et masque silencieusement une perte.
> **À observer** : les événements reçus par le client avant coupure, pendant, et juste après reconnexion.
> **Vérification** (observable, chiffrée) : sur 5 coupures de 20 s répétées, le client affiche à chaque fois soit la totalité des événements manqués soit un signal explicite de trou, jamais un silence.
> **Repli 100 % local et gratuit** : tout l'exercice tourne en local avec une coupure simulée (couper le processus client), aucun service externe requis.
> **Extension** : choisis, et justifie en trois lignes, ce que tu ferais si le volume manqué pendant la coupure dépassait la taille du buffer serveur.

---

### 6.7 : GraphQL

**GraphQL** : Tag : CONTEXTUELLE ·
Coût : ~15 h avant utilité · Durée de vie : ~6 ans · À apprendre après : REST solide, N+1 et bases de données

- **Ancrage MyFunnyJS** : [05_graphql_basics.md](../../21_api_craft/05_graphql_basics.md), schéma, requête, résolveur
- **Ce qu'il ajoute** : un schéma typé fort, une seule requête pour un graphe de données, une évolution sans versioning brutal.
- **Ce qu'il masque** : que le cache HTTP standard disparaît (tout passe par un `POST /graphql`), et que l'autorisation doit se faire par champ, pas par endpoint.
- **Ce qu'il ne résout pas** : le N+1 : une requête imbriquée génère des centaines de requêtes SQL sans DataLoader, GraphQL ne le prévient pas de lui-même.
- **Quand ne pas le choisir** : pas avant d'avoir vraiment plusieurs clients aux besoins divergents : une API, un client, du CRUD, REST suffit et se cache mieux.
- **Exemple qui casse** : une requête imbriquée sur 50 entités liées génère des centaines de requêtes SQL individuelles, invisible avec 3 entités de test, écroulant en production à partir d'un certain volume.
- **Preuve que c'est acquis** : tu sais activer le log SQL, compter les requêtes réellement émises, et les ramener à un ordre de grandeur constant avec un DataLoader · **Si tu bloques, reviens à** : [05_db_in_js.md](../../24_databases/05_db_in_js.md)

**Le problème résolu.** Des clients hétérogènes (web, mobile, tiers) qui ont besoin de formes de données différentes, et une API REST qui multiplie les endpoints ou sur-transfère.

#### Ce que MyFunnyJS permet déjà de comprendre

- [05_graphql_basics.md](../../21_api_craft/05_graphql_basics.md) : schéma, requête, résolveur : les trois pièces sont déjà connues.
- `09_data_structures/` (graphes, BFS/DFS) : une requête GraphQL est un parcours de graphe, et sa profondeur est ton coût.
- [05_db_in_js.md](../../24_databases/05_db_in_js.md) : le N+1 vient de ce qu'un résolveur ignore ce que son voisin a déjà chargé.
- [04_caching_strategies.md](../../17_web_concepts/04_caching_strategies.md) : ce que tu perds en faisant passer tout le trafic par un `POST` unique.
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

> **Exercice : Rendre visible puis corriger le N+1**
> **Temps réaliste** : 2 h 30 · **Prérequis matériel / compte** : base PostgreSQL locale · **Coût max** : 0 €
> **Mode** : assistant autorisé
> **Contraintes** : expose trois entités liées (flux → mesures → auteur) en GraphQL, puis rends visible et corrige le N+1 ; active le log SQL, écris une requête imbriquée sur 50 flux, compte les requêtes SQL réellement émises, puis ramène ce nombre à un ordre de grandeur constant.
> **Réutilise** : [05_db_in_js.md](../../24_databases/05_db_in_js.md)
> **Piège** : avec trois flux de test tout va bien ; le bug n'existe qu'à partir d'un certain volume, exactement comme en production.
> **À observer** : le nombre de requêtes SQL par requête GraphQL, la latence p95, et l'effet d'un `DataLoader` sur les deux.
> **Vérification** (observable, chiffrée) : la même requête sur 5, 50 puis 500 flux : le nombre de requêtes SQL ne doit pas suivre le nombre de flux.
> **Repli 100 % local et gratuit** : base PostgreSQL en conteneur local, données de test générées par script.
> **Extension** : ajoute une limite de profondeur et de complexité, puis écris la requête qui aurait écroulé le serveur sans elle.

---

### 6.8 : Exercice de lecture de codebase : backend Node/TypeScript

> **Exercice : Cartographier un backend Nest ou Fastify open source**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : accès à un dépôt public (GitHub) · **Coût max** : 0 €
> **Mode** : assistant autorisé
> **Contraintes** : choisis un backend Nest ou Fastify open source d'au moins 5 000 lignes ; réponds aux 9 questions de la grille de lecture du niveau 5 (point d'entrée, dépendances critiques, flux d'une requête typique, gestion d'erreur, tests existants, configuration et secrets, points d'extension, dette visible, ce que tu changerais en premier) sans exécuter le code au-delà du démarrage local.
> **Réutilise** : la grille de lecture de codebase du niveau 5 (`05-niveau-5-transfert.md`)
> **Piège** : le point d'entrée réel n'est presque jamais `main.ts` : c'est le premier module importé qui déclenche la cascade de providers ; le confondre avec le fichier de démarrage fait rater la moitié de la carte.
> **À observer** : le nombre de modules avant d'atteindre un premier handler HTTP, la présence ou l'absence de validation en frontière, et la façon dont les secrets sont chargés.
> **Vérification** (observable, chiffrée) : les 9 questions sont répondues avec au moins une preuve textuelle (extrait de fichier, nom de ligne) pour chacune, et la carte tient sur une seule page.
> **Repli 100 % local et gratuit** : clone en local, aucune exécution en production ni compte cloud nécessaire.
> **Extension** : présente ta carte à quelqu'un qui ne connaît pas le projet ; chronomètre le temps qu'il lui faut pour situer où il modifierait un endpoint existant.
> **Livrable** : une carte en une page (texte ou schéma) répondant aux 9 questions, remise avant toute exécution de code au-delà du démarrage local.

---

### 6.9 : ADR : choix du framework backend

> **Exercice : ADR : Express, Fastify ou NestJS pour ce projet** : jeûne d'IA obligatoire
> **Temps réaliste** : 1 h 30 · **Prérequis matériel / compte** : aucun · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : rédige un ADR complet (contexte, options considérées, décision, conséquences) sur le choix du framework backend pour un projet réel ou fictif que tu peux décrire en 5 lignes ; utilise la matrice de décision de la section 6.2.
> **Réutilise** : la matrice de décision Express / Fastify / NestJS ci-dessus
> **Piège** : un ADR qui ne mentionne que des critères techniques (performance, syntaxe) sans contrainte d'équipe (taille, expérience, durée de vie attendue) n'est pas un ADR défendable : un vrai ADR pèse aussi le coût humain.
> **À observer** : est-ce que ta décision resterait la même si l'équipe passait de 2 à 8 personnes ? Si non, dis-le dans l'ADR.
> **Vérification** (observable, chiffrée) : l'ADR tient sur une page, cite au moins deux options rejetées avec leur raison, et une personne qui ne connaît pas le projet peut dire, après lecture, ce qui ferait changer la décision.
> **Repli 100 % local et gratuit** : exercice purement écrit, aucun coût.
> **Extension** : réécris la même décision en 5 lignes pour un responsable produit, sans un seul nom de techno.
> **Preuve du jeûne demandée** : rédige d'abord, à la main et sans assistance, la liste des critères que tu comptes utiliser, horodatée avant de commencer la rédaction complète de l'ADR.

---

[← 02-niveau-2-frontend](./02-niveau-2-frontend.md) · [Sommaire](../README.md) · [04-niveau-4-systemes →](./04-niveau-4-systemes.md)
