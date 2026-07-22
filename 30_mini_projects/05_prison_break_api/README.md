---
stability: intemporel
---

[PORTFOLIO]

# PRISON BREAK API

-> ~6 min

Fox River State Penitentiary. Michael Scofield a tatoué le plan sur son corps. Maintenant il faut l'infrastructure. Profils de prisonniers, access logs par section, phases d'évasion séquentielles. T-Bag essaie d'injecter du SQL depuis l'intérieur. L'API doit tenir sous pression et ne jamais exposer ce qui doit rester secret.

---

## CE QUE ÇA FAIT

```
$ curl -X POST http://localhost:3000/evasion/badge \
 -H "Content-Type: application/json" \
 -d '{"code": "scofield-83712", "pin": "S0a0r0i3"}'

{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "role": "inmate" }

$ curl http://localhost:3000/plan/phase/2 \
 -H "Authorization: Bearer eyJhbGc..."

{ "phase": 2, "objectif": "Infirmerie", "acces": ["couloir-C", "ventilation-3"] }

$ curl -X POST http://localhost:3000/evasion/badge \
 -d '{"code": "tbag"; DROP TABLE prisonniers; --", "pin": "x"}'

{ "error": "InvalidCredentialsError", "code": 401 }
// T-Bag n'a rien cassé
```

---

## INSTALLATION

```
Node.js    : v20+
npm      : v10+
Variables env : PORT (optionnel, défaut 3000)
Outils externes: aucun (SQLite embedded via better-sqlite3)
```

```bash
npm install
node src/server.js  # démarre l'API
npm test       # tests (ne pas lancer le serveur en parallèle)
```

---

## ARCHITECTURE

```
src/
├── server.js        # point d'entrée Express
│
├── routes/
│  ├── evasionRoutes.js    # POST /evasion/badge, POST /evasion/renouveler-badge
│  ├── prisonnierRoutes.js # CRUD sur les profils
│  ├── planRoutes.js    # GET /plan/phase/:n (auth requise)
│  └── sectionRoutes.js  # GET /sections/:id/logs (accès restreint)
│
├── middleware/
│  ├── authMiddleware.js  # vérifie et décode le JWT
│  ├── rateLimiter.js   # 5 tentatives max / 15min par IP sur /evasion/badge
│  ├── sanitizer.js    # nettoyage des inputs contre XSS et injection SQL
│  └── errorHandler.js   # handler global : format d'erreur uniforme
│
├── services/
│  ├── evasionService.js   # sign, verify, refresh du JWT
│  ├── prisonnierService.js
│  └── planService.js
│
├── db/
│  ├── connection.js    # connexion SQLite unique (singleton)
│  ├── schema.sql     # DDL : tables, indexes, contraintes
│  └── seed.js       # données initiales (Fox River prêt à l'emploi)
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

| Module      | Où ça se voit                      |
| ----------------- | -------------------------------------------------------- |
| `21_api_craft`  | Express complet, CRUD, error middleware, OpenAPI     |
| `22_security`   | JWT, bcrypt, rate limiting, sanitization XSS/SQL     |
| `24_databases`  | SQLite, modélisation, indexes, Redis cache sur les plans |
| `17_web_concepts` | HTTP verbes, status codes, browser render pipeline    |

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. Zéro mot de passe en clair dans la DB : bcrypt uniquement, coût minimum 12
2. Chaque endpoint protégé vérifie le JWT avant tout traitement
3. Rate limiter actif sur /evasion/badge avant même de chercher le prisonnier en DB
4. Tous les inputs de l'utilisateur passent par le sanitizer avant d'atteindre la DB
5. Les erreurs ne leak jamais de stack trace ni de détail interne vers le client
```

---

## DOCUMENTS DU PROJET

```
cahierdescharges.md  --> spécification complète, ordre de construction, cas limites
TDD_JOURNAL.md    --> trace de l'écriture des tests, dans l'ordre réel
POSTMORTEM.md     --> ce qui a coincé, ce qui a été appris
ADR/         --> décisions d'architecture documentées
```

---

## BENCH & DÉCISIONS (obligatoire)

Aucun mini-projet n'est "fini" sans cette section. Documente au moins **un**
trade-off chiffré :

- **Question** : "J'ai comparé X vs Y."
- **Charge** : (taille des données, N itérations, hardware).
- **Résultat** : `X = 12ms`, `Y = 48ms` sur 10 000 items.
- **Décision** : "J'ai retenu X car …"
- **Ce que je n'ai pas mesuré** : (mémoire, DX, coût cloud…).

Sans chiffres, ce n'est pas une décision, c'est une préférence.
Voir `08_memory_performance/00_measure_first.md`.

## Pitch 3 lignes

Ce projet démontre une compétence clé : lire du code inconnu, débugger sous pression, livrer un produit (ADR + tests) qu'un autre dev peut reprendre. Utilisable en portfolio et en entretien.

## Empreinte carbone (critère d'acceptation)

Estime l'empreinte carbone approximative de ton déploiement ou de ton algo. Justifie **un** choix d'optimisation (moins d'invocations, cache, batch, région serveur). Voir `31_annexes/03_finops_greenops.md`.

## THÈME NEUTRE (optionnel)

Si les références Naruto/DBZ ne te parlent pas, remplace mentalement par un domaine que tu connais (foot, cuisine, musique). Le concept technique reste identique.

## Structure attendue

Chaque mini-projet doit contenir a minima :

- `src/` : code source (obligatoire).
- `tests/` : tests unitaires et/ou d'intégration (obligatoire).
- `README.md` : présentation, objectifs, comment lancer.
- `TDD_JOURNAL.md` : trace de la démarche TDD.
- `POSTMORTEM.md` : ce qui a marché, ce qui a cassé, ce que tu retiens.
- `ADR/` : décisions architecturales (Architecture Decision Records).
- `cahierdescharges.md` : contraintes et périmètre.

Un CI check impose la présence de `src/` et `tests/` avant validation.

---

## REPRODUCTIBILITÉ

Installation canonique : `npm ci` (pas `npm install`). `npm ci` respecte strictement le `package-lock.json` : deux personnes qui clonent obtiennent exactement les mêmes versions. Committe toujours ton `package-lock.json`. Sans lui, un `npm install` 3 mois plus tard installera d'autres versions et tu debug un fantôme.
