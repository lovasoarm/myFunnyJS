---
stability: intemporel
---

# CAHIER DES CHARGES : PRISON BREAK API

Temps de lecture ~13 min

## PRÉREQUIS

```
Node.js    : v20+
npm      : v10+
Variables env : PORT (optionnel, défaut : 3000)
Outils externes: aucun (SQLite est embedded, pas de serveur à démarrer séparément)

# Installation
$ npm install

# Démarrer le serveur
$ node src/server.js

# Lancer les tests (le serveur ne doit pas tourner en parallèle)
$ npm test
```

SQLite est inclus via le package `better-sqlite3` : pas de base de données externe à installer ni à configurer.

---

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Fox River State Penitentiary. Michael Scofield a tatoué le plan sur son corps. Maintenant il faut l'infrastructure derrière. Chaque prisonnier a un profil. Chaque section de la prison (B-Company, Death Row, l'infirmerie) a des access logs. Le plan d'évasion est une série de phases séquentielles avec des accès réservés. T-Bag essaie de hacker le système depuis l'intérieur. L'API doit tenir sous pression, ne jamais exposer ce qui ne doit pas l'être, et résister.

Ce que tu dois voir tourner à la fin :

```
$ node src/server.js
[SERVER] Fox River API en écoute sur le port 3000

$ curl -X POST http://localhost:3000/api/evasion/badge \
 -d '{"id": "michael_scofield", "password": "linc_is_innocent"}'
{ "token": "eyJhbGci..." }

$ curl http://localhost:3000/api/prisoners \
 -H "Authorization: Bearer eyJhbGci..."
{ "prisoners": [ { "id": "scofield", "section": "B-Company", "status": "actif" }, ... ] }

$ curl -X POST http://localhost:3000/api/escape-plan \
 -H "Authorization: Bearer ..." \
 -d '{"phase": 1, "section": "infirmerie"}'
{ "status": "accès validé", "nextPhase": 2, "coordinates": "..." }

$ npm test
PASS tests/auth.test.js (20 tests)
PASS tests/prisoners.test.js (16 tests)
PASS tests/escapePlan.test.js (18 tests)
PASS tests/security.test.js (14 tests)
```

C'est le premier projet avec un vrai serveur. Tout ce qui précède tournait en Node pur. Ici tu as des requêtes HTTP, une base de données (SQLite pour rester simple), et une surface d'attaque réelle.

## POURQUOI CE PROJET EXISTE

Ce projet force à penser sécurité et robustesse ensemble, pas séparément :

- **concevoir une API qui ne révèle pas d'information sensible dans ses erreurs** : "utilisateur non trouvé" vs "mot de passe incorrect" sont deux messages différents qui donnent des infos à un attaquant. Fox River répond toujours "identifiants invalides", jamais plus précis.
- **protéger chaque endpoint avec le bon niveau d'authentification** : il y a des endpoints publics (la liste des sections), des endpoints authentifiés (les profils), et des endpoints avec rôle (les phases du plan d'évasion). Pas de route qui accepte n'importe qui par oubli.
- **résister aux attaques d'injection et de force brute** : T-Bag envoie des payloads malformés, des apostrophes dans les IDs, des tokens expirés, 500 requêtes de badge en une minute. Le serveur doit tenir.

## LES 4 MODULES QUE CE PROJET COUVRE, ET OÙ ILS SE VOIENT DANS LE CODE

### `21_api_craft` : Express, CRUD, middleware, versioning

**Où ça se voit** : toute l'arborescence `src/routes/` et `src/middleware/`.
**Pourquoi c'est nécessaire ici** : structurer une API Express proprement (pas un seul fichier de 500 lignes) avec des routes séparées, des middlewares réutilisables, et une gestion d'erreur centralisée.

### `22_security` : JWT, bcrypt, XSS, injection, rate limiting

**Où ça se voit** : `src/auth/`, `src/middleware/rateLimiter.js`, `src/middleware/sanitizer.js`.
**Pourquoi c'est nécessaire ici** : bcrypt sur les mots de passe, JWT signé pour l'auth, rate limiting par IP pour bloquer T-Bag qui force, sanitization des inputs pour l'injection.

### `24_databases` : SQLite, modélisation, indexes, Redis cache

**Où ça se voit** : `src/db/`, `src/cache/`.
**Pourquoi c'est nécessaire ici** : les profils et le plan d'évasion sont persistés en SQLite. Les plans souvent consultés sont cachés en Redis (simulé avec une Map en mémoire si Redis n'est pas disponible).

### `17_web_concepts` : HTTP, status codes, headers, caching

**Où ça se voit** : partout. Chaque réponse a le bon status code, les bons headers, le bon format d'erreur.
**Pourquoi c'est nécessaire ici** : un 200 quand la ressource n'existe pas, un 500 quand c'est une erreur métier : c'est du code qui ment. Fox River répond avec précision.

### Résumé visuel

```
21_api_craft  --> src/routes/, src/middleware/errorHandler.js, src/server.js
22_security   --> src/auth/ (JWT + bcrypt), src/middleware/rateLimiter.js + sanitizer.js
24_databases  --> src/db/ (SQLite), src/cache/ (Redis simulé)
17_web_concepts --> status codes, headers, format d'erreur uniforme
```

## FLUX D'APPEL : QUI APPELLE QUI, DANS QUEL ORDRE

```
HTTP Request
 --> express router (src/routes/index.js)
 --> middleware: rateLimiter.js  // bloque si trop de requêtes depuis cette IP
 --> middleware: sanitizer.js   // nettoie les inputs, bloque les injections
 --> middleware: evasionGuard.js   // vérifie le JWT si la route est protégée
 --> route handler (ex: prisonersRouter.js)
    --> prisonerService.js   // logique métier
       --> db.query(...)   // requête SQLite
       --> cache.get(...)  // cherche en cache d'abord
    --> réponse JSON formatée
 --> middleware: errorHandler.js  // catch toutes les erreurs non gérées
```

Chaque requête passe par les middlewares dans l'ordre. Si un middleware rejette (rate limit, token invalide), la requête ne va pas plus loin.

## L'ARCHITECTURE DU CODE, FICHIER PAR FICHIER

```
src/
├── routes/
│  ├── index.js
│  ├── evasionRouter.js
│  ├── prisonersRouter.js
│  ├── sectionsRouter.js
│  └── escapePlanRouter.js
│
├── middleware/
│  ├── evasionGuard.js
│  ├── rateLimiter.js
│  ├── sanitizer.js
│  └── errorHandler.js
│
├── auth/
│  ├── jwtService.js
│  └── passwordService.js
│
├── services/
│  ├── prisonerService.js
│  ├── sectionService.js
│  └── escapePlanService.js
│
├── db/
│  ├── database.js
│  ├── migrations/
│  │  └── 001_initial_schema.sql
│  └── seeds/
│    └── foxriver_data.sql
│
├── cache/
│  └── cacheService.js
│
└── server.js

tests/
├── auth.test.js
├── prisoners.test.js
├── escapePlan.test.js
└── security.test.js
```

### `src/server.js`

**Ce que ça fait** : initialise Express, branche les middlewares globaux, monte les routes, démarre l'écoute.
**Entrée** : rien (lit `process.env.PORT`).
**Sortie** : un serveur HTTP qui écoute.

### `src/routes/evasionRouter.js`

**Ce que ça fait** : `POST /api/evasion/badge` et `POST /api/evasion/renouveler-badge`. Aucune autre route.
**Entrée** : `{ id, password }` en body.
**Sortie** : `{ token }` ou une erreur 401.

### `src/middleware/evasionGuard.js`

**Ce que ça fait** : extrait et vérifie le JWT depuis le header `Authorization: Bearer ...`. Injecte le payload décodé dans `req.user`.
**Entrée** : `req, res, next`.
**Sortie** : appelle `next()` si valide, répond 401 sinon.

### `src/middleware/rateLimiter.js`

**Ce que ça fait** : bloque une IP qui fait plus de N requêtes en X secondes sur un endpoint donné (ex : max 5 tentatives d'évasion par minute par IP).
**Entrée** : `req, res, next`.
**Sortie** : appelle `next()` ou répond 429 (Too Many Requests).

### `src/middleware/sanitizer.js`

**Ce que ça fait** : nettoie les inputs du body et des query params. Bloque les apostrophes non échappées dans les IDs, les balises HTML dans les champs texte.
**Entrée** : `req, res, next`.
**Sortie** : `req.body` et `req.query` nettoyés, ou une erreur 400.

### `src/auth/jwtService.js`

**Ce que ça fait** : signe et vérifie les tokens JWT. Gère les tokens expirés (erreur typée), les tokens invalides (autre erreur typée).
**Entrée** : un payload pour signer, un token pour vérifier.
**Sortie** : un token signé ou le payload décodé.

### `src/auth/passwordService.js`

**Ce que ça fait** : hash un mot de passe en clair avec bcrypt, compare un mot de passe en clair avec un hash stocké.
**Entrée** : un mot de passe en clair (et un hash pour la comparaison).
**Sortie** : un hash, ou un booléen pour la comparaison.

### `src/services/prisonerService.js`

**Ce que ça fait** : toute la logique métier sur les prisonniers (lister, chercher par ID, mettre à jour le statut). Passe par le cache avant la DB.
**Entrée** : des paramètres de requête.
**Sortie** : des objets prisonnier, ou une erreur métier.

### `src/db/database.js`

**Ce que ça fait** : initialise la connexion SQLite, expose une fonction `query(sql, params)` qui execute une requête de façon sécurisée (requêtes paramétrées, pas de concaténation).
**Entrée** : une requête SQL et des paramètres séparés.
**Sortie** : les résultats de la requête.

### `src/cache/cacheService.js`

**Ce que ça fait** : un cache en mémoire avec TTL (Time To Live : durée de vie d'une entrée en cache). `get(key)`, `set(key, value, ttlMs)`, `delete(key)`.
**Entrée** : une clé et une valeur.
**Sortie** : la valeur cachée ou `null`.

## L'ORDRE DE CONSTRUCTION (PAR OÙ COMMENCER)

```
1. src/db/database.js + migrations/ --> la base de tout, testable avec des requêtes directes
2. src/auth/passwordService.js    --> indépendant, testable seul
3. src/auth/jwtService.js       --> indépendant, testable seul
4. src/cache/cacheService.js     --> indépendant, testable seul
5. src/services/prisonerService.js  --> dépend de db + cache
6. src/middleware/ (tous)       --> testables avec des req/res mockés
7. src/routes/ (dans l'ordre : auth, prisoners, sections, escapePlan)
8. src/server.js           --> branche tout
9. tests de sécurité (security.test.js) --> en dernier, après que tout tourne
```

## ESTIMATION DE TEMPS ET ZONES DE RÉSISTANCE

**Durée totale estimée** : 18 à 25 heures de travail réel.

| Étape                        | Durée estimée | Zone de résistance                                           |
| ---------------------------- | ------------- | ------------------------------------------------------------ |
| db + migrations              | 2h            | Moyenne : écrire un schema propre dès le début               |
| passwordService + jwtService | 2h            | Faible si le module 22 est maîtrisé                          |
| cacheService                 | 1h            | Faible                                                       |
| prisonerService              | 2h            | Moyenne : logique cache-first                                |
| middlewares                  | 3-4h          | **Haute** : rateLimiter et sanitizer sont subtils            |
| routes complètes             | 3h            | Moyenne                                                      |
| server.js                    | 30min         | Faible                                                       |
| Tests de sécurité            | 3-4h          | **Haute** : tester une injection SQL, un XSS, un brute force |

Le rateLimiter est sous-estimé systématiquement. Gérer le compteur par IP avec un TTL glissant (pas juste une fenêtre fixe) est plus complexe qu'il n'y paraît.

## EXEMPLE DE TEST REMPLI

```js
// tests/auth.test.js
import request from "supertest";
import app from "../src/server.js";

describe("POST /api/evasion/badge", () => {
  test("retourne un token valide avec les bons identifiants", async () => {
    const res = await request(app)
      .post("/api/evasion/badge")
      .send({ id: "michael_scofield", password: "linc_is_innocent" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe("string");
  });

  test("retourne 401 avec un message générique (pas de fuite d'info)", async () => {
    const res = await request(app)
      .post("/api/evasion/badge")
      .send({ id: "michael_scofield", password: "mauvais_mdp" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("identifiants invalides"); // message générique
    expect(res.body.message).not.toContain("mot de passe"); // pas de détail
    expect(res.body.message).not.toContain("utilisateur"); // pas de détail
  });
});

// tests/security.test.js
describe("rate limiting sur /api/evasion/badge", () => {
  test("bloque après 5 tentatives échouées en moins d'une minute", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/api/evasion/badge")
        .send({ id: "tbag", password: "wrong" });
    }

    const blocked = await request(app)
      .post("/api/evasion/badge")
      .send({ id: "tbag", password: "wrong" });

    expect(blocked.status).toBe(429);
  });
});
```

## CAS LIMITES À TESTER OBLIGATOIREMENT

1. **Token expiré** : une requête avec un token expiré doit recevoir 401, pas 500.
2. **Injection SQL dans un paramètre** : `GET /api/prisoners/1' OR '1'='1` doit retourner 400 ou une réponse vide, pas une fuite de données.
3. **Body malformé (JSON invalide)** : `POST /api/evasion/badge` avec un body `"notjson"` doit retourner 400, pas planter le serveur.
4. **Accès à un endpoint protégé sans token** : 401, pas 403, pas 200, pas 500.
5. **Rate limit doit se réinitialiser après la fenêtre de temps** : après 1 minute, les tentatives doivent être à nouveau acceptées.

## LES RÈGLES QUE TU NE DOIS JAMAIS CASSER

1. **Zéro requête SQL construite par concaténation de chaînes.** Toujours des requêtes paramétrées : `db.query('SELECT * FROM prisoners WHERE id = ?', [id])`.
2. **Zéro information sur la raison d'un refus d'authentification dans la réponse.** "identifiants invalides", toujours, même si l'ID n'existe pas.
3. **Chaque route protégée a `authGuard` en middleware.** Pas d'endpoint qui oublie son garde.

## CE QUE TU NE FAIS PAS DANS CE PROJET

- Pas d'interface graphique.
- Pas de WebSocket (ce sera dans un autre projet).
- Pas de TypeScript.
- Pas de déploiement en prod (le focus est sur le code, pas l'infra).
- SQLite uniquement pour la persistance (pas Postgres, pas MongoDB ici).
- Redis est simulé par une Map en mémoire dans `cacheService.js`, pas par un vrai serveur Redis. Raison : ajouter Redis introduit une dépendance infra externe (un process séparé à démarrer, configurer, monitorer) qui sort du scope de ce projet. La logique de cache reste la même : `get`, `set`, TTL, invalidation. Seul le backend change. Si tu veux brancher un vrai Redis plus tard, seul `cacheService.js` est à modifier.

## LES ADR

```
ADR/001-pourquoi-sqlite-plutot-que-postgres.md
ADR/002-pourquoi-jwt-stateless-plutot-que-sessions.md
ADR/003-pourquoi-message-erreur-generique-pour-lauth.md
```

Exemple rempli :

```markdown
# ADR 003 : Message d'erreur générique pour l'authentification

## Contexte

Quand une tentative d'évasion échoue, deux informations peuvent manquer : l'ID ou le mot de passe.
Retourner un message différent selon le cas aide l'utilisateur légitime.
Mais ça aide aussi l'attaquant à savoir si un ID existe dans la base.

## Décision

Toujours retourner "identifiants invalides", quelle que soit la raison réelle.
Le temps de réponse est aussi rendu constant (même délai si l'ID n'existe pas
et si le mot de passe est faux) pour résister aux timing attacks.

## Alternatives considérées

- Message différent selon le cas : rejeté car information leak.
- Message générique mais temps de réponse variable : rejeté car timing attack possible
  (un attaquant mesure le délai et en déduit si l'ID existe).

## Conséquences

- Expérience utilisateur légèrement dégradée (le formulaire de récupération de
  compte devient le seul recours).
- Surface d'attaque réduite sur l'endpoint d'évasion.
```

## QUAND EST-CE QUE LE PROJET EST VRAIMENT FINI

```
[ ] le serveur démarre sans erreur et les endpoints répondent
[ ] /evasion/badge retourne un token valide et un 401 générique en cas d'échec
[ ] les 5 cas limites de sécurité ont chacun un test qui passe
[ ] aucune requête SQL n'est construite par concaténation
[ ] le rate limiter bloque après 5 tentatives (test vérifié)
[ ] le cache est utilisé dans prisonerService (vérifié en logs)
[ ] les 3 ADR sont remplis avec contexte, décision, alternatives, conséquences
[ ] POSTMORTEM.md documente au moins une faille trouvée et corrigée pendant le dev
[ ] TDD_JOURNAL.md trace quels tests de sécurité ont été écrits en premier
```

---

## SURPRISE MI-PARCOURS (spec drift, obligatoire)

Spec drift obligatoire, voir `30_mini_projects/synthese/spec_drift.md`
(protocole unique, tirage aléatoire, déclenchement à 40 % d'avancement).

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**
