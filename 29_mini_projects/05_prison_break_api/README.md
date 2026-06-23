# PRISON BREAK API

Fox River State Penitentiary. Michael Scofield a tatoué le plan sur son corps. Maintenant il faut l'infrastructure. Profils de prisonniers, access logs par section, phases d'évasion séquentielles. T-Bag essaie d'injecter du SQL depuis l'intérieur. L'API doit tenir sous pression et ne jamais exposer ce qui doit rester secret.

---

## CE QUE ÇA FAIT

```
$ curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"code": "scofield-83712", "pin": "S0a0r0i3"}'

{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "role": "inmate" }

$ curl http://localhost:3000/plan/phase/2 \
  -H "Authorization: Bearer eyJhbGc..."

{ "phase": 2, "objectif": "Infirmerie", "acces": ["couloir-C", "ventilation-3"] }

$ curl -X POST http://localhost:3000/auth/login \
  -d '{"code": "tbag"; DROP TABLE prisonniers; --", "pin": "x"}'

{ "error": "InvalidCredentialsError", "code": 401 }
// T-Bag n'a rien cassé
```

---

## INSTALLATION

```
Node.js        : v20+
npm            : v10+
Variables env  : PORT (optionnel, défaut 3000)
Outils externes: aucun (SQLite embedded via better-sqlite3)
```

```bash
npm install
node src/server.js   # démarre l'API
npm test              # tests (ne pas lancer le serveur en parallèle)
```

---

## ARCHITECTURE

```
src/
├── server.js               # point d'entrée Express
│
├── routes/
│   ├── authRoutes.js       # POST /auth/login, POST /auth/refresh
│   ├── prisonnierRoutes.js # CRUD sur les profils
│   ├── planRoutes.js       # GET /plan/phase/:n (auth requise)
│   └── sectionRoutes.js    # GET /sections/:id/logs (accès restreint)
│
├── middleware/
│   ├── authMiddleware.js   # vérifie et décode le JWT
│   ├── rateLimiter.js      # 5 tentatives max / 15min par IP sur /login
│   ├── sanitizer.js        # nettoyage des inputs contre XSS et injection SQL
│   └── errorHandler.js     # handler global : format d'erreur uniforme
│
├── services/
│   ├── authService.js      # sign, verify, refresh du JWT
│   ├── prisonnierService.js
│   └── planService.js
│
├── db/
│   ├── connection.js       # connexion SQLite unique (singleton)
│   ├── schema.sql          # DDL : tables, indexes, contraintes
│   └── seed.js             # données initiales (Fox River prêt à l'emploi)
│
└── errors/
    ├── AuthError.js
    ├── NotFoundError.js
    └── ForbiddenError.js

tests/
├── auth.test.js
├── prisonniers.test.js
├── plan.test.js
└── security.test.js
```

Flux d'une requête :

```
client
  --> rateLimiter (bloque si trop de tentatives)
  --> sanitizer (nettoie l'input)
  --> authMiddleware (vérifie le JWT si route protégée)
  --> route handler
  --> service
  --> db
  --> errorHandler (si ça plante)
  --> client
```

---

## MODULES CRAZYDEVS COUVERTS

| Module | Où ça se voit |
|---|---|
| `20_api_craft` | Express complet, CRUD, error middleware, OpenAPI |
| `21_security` | JWT, bcrypt, rate limiting, sanitization XSS/SQL |
| `23_databases` | SQLite, modélisation, indexes, Redis cache sur les plans |
| `16_web_concepts` | HTTP verbes, status codes, browser render pipeline |

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. Zéro mot de passe en clair dans la DB : bcrypt uniquement, coût minimum 12
2. Chaque endpoint protégé vérifie le JWT avant tout traitement
3. Rate limiter actif sur /auth/login avant même de chercher le prisonnier en DB
4. Tous les inputs de l'utilisateur passent par le sanitizer avant d'atteindre la DB
5. Les erreurs ne leak jamais de stack trace ni de détail interne vers le client
```

---

## DOCUMENTS DU PROJET

```
cahierdescharges.md   --> spécification complète, ordre de construction, cas limites
TDD_JOURNAL.md        --> trace de l'écriture des tests, dans l'ordre réel
POSTMORTEM.md         --> ce qui a coincé, ce qui a été appris
ADR/                  --> décisions d'architecture documentées
```
