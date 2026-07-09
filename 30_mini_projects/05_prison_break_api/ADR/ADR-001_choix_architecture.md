---
stability: intemporel
---

# ADR-001 : SQLite embedded via better-sqlite3 comme base de données principale
Temps de lecture ~6 min

## Statut
Accepté : 2026-01

## Contexte
La Prison Break API persiste des données : profils de prisonniers, sections de la prison (B-Company, Death Row, infirmerie), access logs, phases du plan d'évasion. Ces données ont des relations (un prisonnier est affecté à une section, un log référence une section et un prisonnier), ce qui oriente vers une base relationnelle plutôt qu'un store clé-valeur.

Trois options sont évaluées : PostgreSQL (base relationnelle complète, nécessite un serveur séparé), SQLite via `better-sqlite3` (embedded, fichier local), ou une persistance JSON en mémoire/fichier.

Contrainte du projet : `npm install` + `node src/server.js` doit suffire à lancer l'API sur n'importe quelle machine. Pas de serveur de base de données externe à installer ni à configurer.

## Décision
On utilise SQLite via `better-sqlite3` comme base de données principale. La DB tient dans un fichier `data/fox_river.db` créé au démarrage si absent. Les migrations de schéma sont gérées par un script `src/migrations.js` qui s'exécute au lancement.

```
src/
├── server.js     (Express : routing, middleware, démarrage)
├── migrations.js   (CREATE TABLE IF NOT EXISTS : idempotent, safe à relancer)
├── db.js       (singleton better-sqlite3 : une seule connexion partagée)
├── routes/
│  ├── prisoners.js (CRUD prisonnier)
│  ├── sections.js  (CRUD section + access logs)
│  └── plan.js    (phases d'évasion : séquentielles, accès par rôle)
└── middleware/
  ├── auth.js    (vérification JWT sur chaque route protégée)
  └── rateLimit.js (IP-based : 100 req/min, T-Bag ne brute-forcera pas)
```

## Alternatives considérées

**PostgreSQL**
- Avantages : base de prod réelle, ACID complet, extensions (UUID, JSON, full-text search), connexions concurrentes natives
- Limites : nécessite un serveur PostgreSQL séparé (Docker ou install locale), une URL de connexion, un utilisateur, un mot de passe : le projet devient `npm install && docker-compose up && node src/server.js` avec un docker-compose qui peut échouer pour dix raisons différentes selon la machine
- Rejeté parce que : la complexité d'installation masque la complexité pédagogique : le projet enseigne l'API REST, la sécurité, et la modélisation de données, pas la gestion d'une infra Postgres

**Persistance JSON (fichier ou mémoire)**
- Avantages : zéro dépendance, lecture/écriture simple avec `fs.readFileSync`/`JSON.parse`
- Limites : pas de relations, pas d'indexes, pas de transactions : si T-Bag injecte pendant qu'on écrit le fichier JSON, la corruption de données est plausible ; les requêtes "tous les logs de la section B dans les 24 dernières heures" deviennent du filtrage en mémoire O(n) sur tout le tableau
- Rejeté parce que : le module `24_databases` justifie SQL précisément pour les relations, les indexes et les transactions : ne pas utiliser SQL dans ce projet revient à ignorer la leçon principale de ce module

## Conséquences

Gains :
- zéro serveur externe : `npm install` installe `better-sqlite3`, le fichier DB est créé au premier lancement
- SQL réel : JOIN, INDEX, EXPLAIN, transactions : tout ce que le module 24 couvre est applicable directement
- synchrone par défaut avec `better-sqlite3` : pas de `await` sur chaque requête, le code reste lisible
- la DB est un simple fichier : facile à inspecter avec `sqlite3 data/fox_river.db`, facile à supprimer pour repartir de zéro

Sacrifices :
- SQLite ne supporte pas les connexions concurrentes multiples avec écriture : sur un vrai serveur multi-process (Node cluster), des conflits d'écriture peuvent apparaître : acceptable pour un serveur single-process pédagogique, pas pour une prod à 1000 req/s
- `better-sqlite3` est synchrone : sur des requêtes lourdes (pas le cas ici), elle bloquerait l'event loop : contrainte à documenter pour ne pas copier ce pattern en prod async

Décisions liées :
- ADR-002 portera sur la stratégie d'auth JWT : HS256 vs RS256, durée des access tokens, stockage des refresh tokens
- ADR-003 portera sur Redis comme cache des plans d'évasion souvent consultés : TTL, invalidation sur modification
