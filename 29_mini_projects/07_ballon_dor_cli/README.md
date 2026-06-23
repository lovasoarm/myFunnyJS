# BALLON D'OR CLI

Les journalistes du monde entier votent. Les points s'agrègent. Le classement se met à jour. La v1 a été codée en une nuit par un stagiaire pressé : elle fonctionne, mais personne n'ose la toucher. La v2, c'est toi qui l'écris. Et cette fois, elle est testée, refactorisée, containerisée.

---

## CE QUE ÇA FAIT

```
$ node src/cli.js vote --joueur "Vinicius Jr" --journaliste "L'Equipe-FR" --points 7
[VOTE] L'Equipe-FR --> Vinicius Jr : 7 points enregistrés

$ node src/cli.js rank
CLASSEMENT BALLON D'OR 2026
═══════════════════════════════════════
1. Vinicius Jr    (Real Madrid)    147 pts   ████████████████
2. Bellingham     (Real Madrid)    134 pts   ███████████████
3. Pedri          (Barcelona)      121 pts   █████████████
═══════════════════════════════════════

$ node src/cli.js simulate --votes 500
[SIM] 500 votes aléatoires générés et enregistrés (4 Worker Threads)

$ node src/cli.js export --format csv
[EXPORT] classement_2026-06-23.csv créé (23 lignes)
```

---

## INSTALLATION

```
Node.js        : v20+
npm            : v10+
Docker         : v24+ (optionnel, pour la containerisation)
Variables env  : aucune
Outils externes: aucun
```

```bash
npm install
node src/cli.js rank           # classement actuel
npm test                        # tests complets
docker build -t ballon-dor .    # après que les tests passent
docker run ballon-dor rank
```

---

## ARCHITECTURE

```
src/
├── cli.js              # point d'entrée : parse process.argv, dispatche les commandes
│
├── commands/
│   ├── voteCommand.js  # logique de la commande vote
│   ├── rankCommand.js  # logique de la commande rank
│   ├── simCommand.js   # logique de la commande simulate (Worker Threads)
│   ├── resetCommand.js # remet les votes à zéro
│   └── exportCommand.js # exporte en CSV ou JSON
│
├── store/
│   └── voteStore.js    # lecture/écriture JSON sur le disque (persistence)
│
├── workers/
│   └── simWorker.js    # Worker Thread pour la génération de votes en parallèle
│
├── errors/
│   ├── InvalidVoteError.js
│   ├── PlayerNotFoundError.js
│   └── QuotaExceededError.js
│
├── utils/
│   ├── formatter.js    # affichage du classement dans le terminal
│   └── csvExporter.js  # sérialisation CSV depuis les votes
│
└── data/
    └── joueurs.json    # liste des 23 nominés avec leurs stats

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

| Module | Où ça se voit |
|---|---|
| `14_runtime_env` | `process.argv`, `fs`, Worker Threads pour la simulation |
| `11_refactoring` | v1 spaghetti → v2 modulaire : SRP sur chaque commande |
| `03_error_handling` | `InvalidVoteError`, `PlayerNotFoundError`, `QuotaExceededError` |
| `30_annexes` | Git workflow, Docker, CI/CD sur chaque push |

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
cahierdescharges.md   --> spécification complète, ordre de construction, cas limites
TDD_JOURNAL.md        --> trace de l'écriture des tests, dans l'ordre réel
POSTMORTEM.md         --> ce qui a coincé, ce qui a été appris
ADR/                  --> décisions d'architecture documentées
```
