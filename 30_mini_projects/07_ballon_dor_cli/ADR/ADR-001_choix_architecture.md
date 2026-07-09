---
stability: intemporel
---

# ADR-001 : persistance des votes via fichier JSON local plutôt que base de données
Temps de lecture ~6 min

## Statut
Accepté : 2026-01

## Contexte
Le Ballon d'Or CLI doit persister les votes entre les sessions : `node src/cli.js vote --player Mbappé` doit être retrouvable après avoir fermé et rouvert le terminal. Deux questions se posent : quel format de stockage utiliser, et comment garantir la cohérence des données entre les appels CLI concurrents (deux processus Node qui écrivent en même temps).

Le projet est un outil CLI Node.js. Il couvre `15_runtime_env` (process.argv, filesystem, Worker Threads) et `05_error_handling`. Ce n'est pas une API avec des connexions persistantes : chaque commande est un processus Node qui démarre, lit/écrit, et se termine.

## Décision
Les votes sont persistés dans `data/votes.json`, un fichier JSON structuré lu et écrit via `fs.readFileSync`/`fs.writeFileSync`. Chaque écriture est atomique : on écrit dans un fichier temporaire `data/votes.tmp.json`, puis on renomme (`fs.renameSync`) vers `data/votes.json`. Le renommage est atomique sur la plupart des systèmes de fichiers UNIX : pas de fenêtre de corruption partielle.

```
data/votes.json --> { "Mbappé": 12, "Haaland": 9, "Bellingham": 7, ... }

Cycle de lecture-écriture :
1. fs.readFileSync('data/votes.json')  --> charger l'état actuel
2. modifier les votes en mémoire
3. fs.writeFileSync('data/votes.tmp.json', JSON.stringify(newState))
4. fs.renameSync('data/votes.tmp.json', 'data/votes.json') --> atomique
```

Les Worker Threads (module 15) servent uniquement aux simulations de vote massif (`cli.js simulate --count 10000`) : la simulation est CPU-bound et peut paralléliser sans risque car elle écrit dans un buffer en mémoire, pas directement dans le fichier.

## Alternatives considérées

**SQLite via better-sqlite3**
- Avantages : transactions ACID, index sur les joueurs, requêtes SQL pour les statistiques avancées
- Limites : ajoute une dépendance binaire native : `better-sqlite3` se compile à l'installation, ce qui peut échouer sur certaines configurations ; pour un outil CLI qui stocke 50 lignes de votes, SQL est surdimensionné
- Rejeté parce que : ce projet enseigne le filesystem Node.js (`fs`, `path`, streams) : utiliser SQLite contourne l'apprentissage central du module `15_runtime_env`

**Base de données en mémoire (Map JavaScript)**
- Avantages : le plus simple, zéro I/O, lecture/écriture en nanosecondes
- Limites : les votes disparaissent à la fermeture du processus : `node src/cli.js vote Mbappé` puis `node src/cli.js rank` donne un classement vide, ce qui rend l'outil inutilisable
- Rejeté parce que : la persistance entre sessions est une contrainte fonctionnelle non négociable pour un outil CLI réaliste

## Conséquences

Gains :
- le fichier `data/votes.json` est inspectable à tout moment avec un éditeur de texte ou `cat` : pas besoin d'un client SQL pour voir l'état des votes
- le renommage atomique protège contre la corruption en cas d'interruption au milieu d'une écriture (crash, Ctrl+C)
- `fs.readFileSync` et `fs.writeFileSync` sont les APIs centrales de `15_runtime_env` : leur usage sur de vraies données les ancre dans un contexte concret

Sacrifices :
- les écritures concurrentes de plusieurs processus Node simultanés (ex : deux terminaux qui votent en même temps) ne sont pas protégées par un lock : un vote peut écraser l'autre ; acceptable pour un outil mono-utilisateur, problématique en prod multi-process
- le fichier JSON devient lent à parser au-delà de quelques millions de lignes : largement hors périmètre ici, mais à documenter pour que l'apprenant comprenne la limite

Décisions liées :
- ADR-002 portera sur la stratégie de containerisation Docker : multi-stage build pour réduire l'image finale, volume mount pour persister `data/votes.json` en dehors du container
- ADR-003 portera sur la structure des custom errors : `InvalidVoteError`, `PlayerNotFoundError`, `QuotaExceededError` et leur gestion dans le handler global de la CLI
