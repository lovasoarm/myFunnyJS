---
stability: intemporel
---

# ADR-001 : concurrence par défaut de `pMap`

## Statut
Accepté : 2026-05
Auteur : équipe curriculum

## Contexte

`pMap(items, mapper, { concurrency })` orchestre des tâches asynchrones. La
valeur de `concurrency` conditionne la charge sur trois axes :

- **Mémoire** : chaque tâche en vol garde son closure et son résultat en RAM.
- **I/O** : sur du réseau, un seul worker plafonne à la latence de la cible.
- **CPU** : sur du calcul pur, dépasser 1 n'apporte rien puisque Node est
  mono-thread pour le JS user-land.

Un défaut « raisonnable » doit tenir sur les trois axes sans surprise pour
l'utilisateur qui écrit `pMap(items, mapper)` sans lire les options.

## Décision

`concurrency` par défaut = **10**.

Ordre de grandeur : sur des tâches I/O de 50-200 ms, 10 workers saturent
généralement l'endpoint cible sans faire exploser le heap sur un batch de
100 000 items (10 payloads « en vol » simultanément, pas 100 000).

## Alternatives écartées

- **`Infinity`** : simple, mais fait tomber le process au premier batch un peu
  gros (100k `fetch` en vol → EMFILE, OOM, crash socket pool). Écarté : trop
  fragile en production.
- **`1` (série)** : sûr, mais transforme un utilitaire concurrent en boucle
  `for..await`. Aucune raison d'utiliser `pMap` avec ce défaut. Écarté.
- **`os.cpus().length`** : pertinent pour CPU-bound uniquement, non
  représentatif du cas d'usage principal (I/O). Documenté comme option manuelle.
- **Auto-tune basé sur latence observée** : trop complexe pour un utilitaire
  qui doit rester lisible en 40 lignes. Reporté à un ADR ultérieur si besoin.

## Conséquences

- **Positif** : comportement prévisible, empreinte mémoire bornée, pas de
  surprise en prod pour l'utilisateur naïf.
- **Négatif** : sur du CPU-bound pur, 10 workers ne sont pas plus rapides que
  1 (Node mono-thread). Documenté dans le README avec un exemple contre-cas.
- **À surveiller** : si un utilisateur signale un throughput plafonné sur du
  réseau, indiquer d'augmenter `concurrency` à 50-100 selon la latence.

## Signaux de révision

Rouvrir cet ADR si :
- Node ajoute des workers implicites au runtime,
- benchmarks montrent que 10 sature ou sous-utilise dans > 30 % des cas
  rapportés.
