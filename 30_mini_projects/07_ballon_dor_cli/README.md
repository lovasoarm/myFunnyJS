---
stability: intemporel
---

[PORTFOLIO]

[ATELIER]

# BALLON D'OR CLI

-> ~6 min

Les journalistes du monde entier votent. Les points s'agrègent. Le classement se met à jour. La v1 a été codée en une nuit par un stagiaire pressé : elle fonctionne, mais personne n'ose la toucher. La v2, c'est toi qui l'écris. Et cette fois, elle est testée, refactorisée, containerisée.

---

## CE QUE ÇA FAIT

```
$ node src/cli.js vote --joueur "Vinicius Jr" --journaliste "L'Equipe-FR" --points 7
[VOTE] L'Equipe-FR --> Vinicius Jr : 7 points enregistrés

$ node src/cli.js rank
CLASSEMENT BALLON D'OR 2026
═══════════════════════════════════════
1. Vinicius Jr  (Real Madrid)  147 pts  ████████████████
2. Bellingham   (Real Madrid)  134 pts  ███████████████
3. Pedri     (Barcelona)   121 pts  █████████████
═══════════════════════════════════════

$ node src/cli.js simulate --votes 500
[SIM] 500 votes aléatoires générés et enregistrés (4 Worker Threads)

$ node src/cli.js export --format csv
[EXPORT] classement_2026-06-23.csv créé (23 lignes)
```

---

## INSTALLATION

```
Node.js    : v20+
npm      : v10+
Docker     : v24+ (optionnel, pour la containerisation)
Variables env : aucune
Outils externes: aucun
```

```bash
npm install
node src/cli.js rank      # classement actuel
npm test            # tests complets
docker build -t ballon-dor .  # après que les tests passent
docker run ballon-dor rank
```

---

## ARCHITECTURE

```
src/
├── cli.js       # point d'entrée : parse process.argv, dispatche les commandes
│
├── commands/
│  ├── voteCommand.js # logique de la commande vote
│  ├── rankCommand.js # logique de la commande rank
│  ├── simCommand.js  # logique de la commande simulate (Worker Threads)
│  ├── resetCommand.js # remet les votes à zéro
│  └── exportCommand.js # exporte en CSV ou JSON
│
├── store/
│  └── voteStore.js  # lecture/écriture JSON sur le disque (persistence)
│
├── workers/
│  └── simWorker.js  # Worker Thread pour la génération de votes en parallèle
│
├── errors/
│  ├── InvalidVoteError.js
│  ├── PlayerNotFoundError.js
│  └── QuotaExceededError.js
│
├── utils/
│  ├── formatter.js  # affichage du classement dans le terminal
│  └── csvExporter.js # sérialisation CSV depuis les votes
│
└── data/
  └── joueurs.json  # liste des 23 nominés avec leurs stats

tests/
├── voteCommand.test.js
├── rankCommand.test.js
├── voteStore.test.js
└── errors.test.js
```

Flux d'une commande `vote` :

```
cli.js --> parseArgs()
 --> voteCommand.execute({ joueur, journaliste, points })
    --> PlayerNotFoundError si joueur inconnu
    --> QuotaExceededError si journaliste a déjà voté 3x aujourd'hui
    --> voteStore.save(vote)
       --> fs.readFileSync (votes actuels)
       --> JSON.parse
       --> ... ajout du vote ...
       --> JSON.stringify
       --> fs.writeFileSync
    --> formatter.printConfirmation(vote)
```

---

## MODULES CRAZYDEVS COUVERTS

| Module       | Où ça se voit                          |
| ------------------- | --------------------------------------------------------------- |
| `15_runtime_env`  | `process.argv`, `fs`, Worker Threads pour la simulation     |
| `13_refactoring`  | v1 spaghetti → v2 modulaire : SRP sur chaque commande   |
| `05_error_handling` | `InvalidVoteError`, `PlayerNotFoundError`, `QuotaExceededError` |
| `31_annexes`    | Git workflow, Docker, CI/CD sur chaque push           |

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. Chaque commande est dans son propre fichier : un fichier = une responsabilité
2. Les erreurs ont des classes custom avec des messages précis
3. La commande simulate utilise Worker Threads : jamais bloquer l'event loop principal
4. voteStore.js ne fait que lire et écrire, jamais de logique métier
5. Le Dockerfile est multi-stage : image de prod aussi légère que possible
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
