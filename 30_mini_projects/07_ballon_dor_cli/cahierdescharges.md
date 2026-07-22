---
stability: intemporel
---

# CAHIER DES CHARGES : BALLON D'OR CLI

Temps de lecture ~13 min

## PRÉREQUIS

```
Node.js    : v20+
npm      : v10+
Docker     : v24+ (pour la containerisation : optionnel pour commencer)
Variables env : aucune
Outils externes: Docker (en dernier, une fois que tout tourne en local)

# Installation
$ npm install

# Lancer une commande CLI
$ node src/cli.js rank

# Lancer les tests
$ npm test

# Construire l'image Docker (une fois que les tests passent)
$ docker build -t ballon-dor-cli .
$ docker run ballon-dor-cli rank
```

Conseil de démarrage : ignore Docker jusqu'à ce que toutes les commandes CLI fonctionnent en local et que tous les tests passent. La containerisation est la dernière étape, pas la première.

---

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Les journalistes du monde entier votent. Chaque vote est soumis depuis le terminal. Les points s'agrègent. Le classement se met à jour. Des commandes disponibles : `vote`, `rank`, `simulate`, `reset`, `export`. Le code v1 a été torché en une nuit par un stagiaire. Il fonctionne. Il est illisible. La v2, c'est toi qui l'écris. Et cette fois, elle est SOLID, testée, containerisée, et déployée proprement.

Ce que tu dois voir tourner à la fin :

```
$ node src/cli.js vote --player "Rodri" --journalist "France Football" --points 15
[VOTE] Rodri reçoit 15 points de France Football

$ node src/cli.js rank
[CLASSEMENT BALLON D'OR 2026]
1. Rodri (Manchester City) : 847 pts
2. Vinicius Jr (Real Madrid) : 761 pts
3. Lamine Yamal (Barcelone) : 698 pts

$ node src/cli.js simulate --journalists 180 --players 30
[SIMULATE] 180 journalistes votent... done (1240ms)

$ node src/cli.js export --format csv --output results/classement.csv
[EXPORT] Classement exporté : results/classement.csv

$ npm test
PASS tests/voteService.test.js (20 tests)
PASS tests/rankingService.test.js (14 tests)
PASS tests/cli.test.js (12 tests)
PASS tests/errors.test.js (8 tests)
```

Ce projet a deux versions qui coexistent dans le repo : `legacy/ballonDorV1.js` (le code du stagiaire) et `src/` (ta v2 propre). Le comportement observable est identique. La structure interne, non.

## POURQUOI CE PROJET EXISTE

Ce projet teste la capacité à comprendre un codebase existant, à le corriger sans le réécrire d'un coup, et à le rendre opérationnel comme un vrai outil :

- **refactorer du code procédural en modules SOLID sans tout casser** : le v1 est un script procédural avec des variables globales, des conditions imbriquées, et une seule responsabilité éparpillée partout. La v2 sépare le CLI de la logique métier de la persistance. Chaque couche a une seule raison de changer.
- **gérer des erreurs dans un contexte CLI** : un CLI a deux types de sorties : stdout pour les résultats, stderr pour les erreurs. Un vote invalide ne doit pas planter le processus avec une stacktrace. Il doit afficher un message clair et sortir avec le bon code de sortie (`process.exit(1)`).
- **automatiser un outil de bout en bout** : containeriser avec Docker, lancer les tests en CI à chaque push, exporter les résultats en CSV. Un outil CLI "qui tourne sur ma machine" n'est pas un livrable.

## LES 4 MODULES QUE CE PROJET COUVRE, ET OÙ ILS SE VOIENT DANS LE CODE

### `15_runtime_env` : CLI Node.js, process.argv, filesystem

**Où ça se voit** : `src/cli.js`, `src/parser/argsParser.js`, `src/export/csvExporter.js`.
**Pourquoi c'est nécessaire ici** : `process.argv` pour lire les flags (`--player`, `--points`). `process.exit(code)` pour le code de sortie. `fs.writeFileSync` pour l'export CSV. C'est le kit de base du CLI Node.

### `13_refactoring` : SOLID sur du code CLI procédural

**Où ça se voit** : tout le passage de `legacy/ballonDorV1.js` vers `src/`.
**Pourquoi c'est nécessaire ici** : le v1 viole SRP (Single Responsibility Principle : une classe/fonction = une responsabilité) à chaque fonction. La v2 sépare le parsing des args, la validation des votes, l'agrégation des scores, et l'affichage. Chaque module peut changer sans toucher les autres.

### `05_error_handling` : custom errors, propagation, exit codes

**Où ça se voit** : `src/errors/`, les `try/catch` dans `cli.js`.
**Pourquoi c'est nécessaire ici** : `InvalidVoteError`, `PlayerNotFoundError`, `QuotaExceededError` permettent de répondre différemment selon le type d'erreur. Un vote invalide = message d'erreur + exit 1. Un joueur introuvable = suggestion de correction + exit 1. Une erreur système = stacktrace sur stderr + exit 2.

### `31_annexes` : Git workflow, Docker, GitHub Actions

**Où ça se voit** : `Dockerfile`, `.github/workflows/ci.yml`, conventions de commits.
**Pourquoi c'est nécessaire ici** : un outil CLI sans containerisation ne peut pas être distribué à 180 journalistes avec des environnements différents. Sans CI : les tests passent en local, échouent chez les autres, personne ne sait.

### Résumé visuel

```
15_runtime_env --> src/cli.js (argv), src/export/csvExporter.js (fs), src/store/jsonStore.js
13_refactoring --> legacy/ -> src/ (SOLID, séparation des couches)
05_error_handling --> src/errors/ (custom errors), exit codes dans cli.js
31_annexes   --> Dockerfile, .github/workflows/ci.yml
```

## FLUX D'APPEL : QUI APPELLE QUI, DANS QUEL ORDRE

```
terminal: node src/cli.js vote --player "Rodri" --points 15 --journalist "FF"
 --> argsParser.parse(process.argv)    // extrait { command: 'vote', player, points, journalist }
 --> commandRouter.route(parsedArgs)   // route vers le bon handler
 --> voteHandler.execute(args)
    --> voteValidator.validate(args)  // throw InvalidVoteError si invalide
    --> voteService.submitVote(vote)  // logique métier
       --> jsonStore.read()     // lit l'état actuel du fichier JSON
       --> jsonStore.write(updated) // écrit le nouvel état
    --> voteRenderer.print(result)   // affiche le résultat dans stdout
 --> process.exit(0)           // succès

(si erreur à n'importe quel niveau)
 --> errorHandler.handle(err)       // classe l'erreur, affiche sur stderr
 --> process.exit(1)           // ou 2 selon la gravité
```

## L'ARCHITECTURE DU CODE, FICHIER PAR FICHIER

```
legacy/
└── ballonDorV1.js       # le code original, jamais modifié

src/
├── cli.js           # point d'entrée, branche les commandes
├── parser/
│  └── argsParser.js      # parse process.argv en objet structuré
├── router/
│  └── commandRouter.js    # route vers le bon handler selon la commande
├── handlers/
│  ├── voteHandler.js
│  ├── rankHandler.js
│  ├── simulateHandler.js
│  ├── resetHandler.js
│  └── exportHandler.js
├── services/
│  ├── voteService.js
│  └── rankingService.js
├── validators/
│  └── voteValidator.js
├── store/
│  └── jsonStore.js
├── export/
│  └── csvExporter.js
├── errors/
│  ├── InvalidVoteError.js
│  ├── PlayerNotFoundError.js
│  └── QuotaExceededError.js
└── renderer/
  └── cliRenderer.js

Dockerfile
.github/workflows/ci.yml

tests/
├── voteService.test.js
├── rankingService.test.js
├── cli.test.js
└── errors.test.js
```

### `src/parser/argsParser.js`

**Ce que ça fait** : transforme `process.argv` brut en un objet structuré lisible.
**Entrée** : `['node', 'cli.js', 'vote', '--player', 'Rodri', '--points', '15']`.
**Sortie** : `{ command: 'vote', player: 'Rodri', points: 15, journalist: undefined }`.

### `src/services/voteService.js`

**Ce que ça fait** : toute la logique métier des votes. Valide les points (entre 1 et 15), vérifie que le journaliste n'a pas déjà voté, agrège les scores.
**Entrée** : un objet vote `{ player, journalist, points }`.
**Sortie** : le vote enregistré, ou une exception typée.

### `src/services/rankingService.js`

**Ce que ça fait** : calcule le classement à partir des votes stockés. Trie par points décroissants. Gère les ex-aequo.
**Entrée** : rien (lit depuis le store).
**Sortie** : un tableau trié `[{ rank, player, club, points }]`.

### `src/store/jsonStore.js`

**Ce que ça fait** : lit et écrit l'état des votes dans un fichier JSON local. Interface simple : `read()` et `write(data)`.
**Entrée** : pour write, les données à persister.
**Sortie** : pour read, l'état actuel.

### `src/export/csvExporter.js`

**Ce que ça fait** : prend le classement et l'écrit dans un fichier CSV.
**Entrée** : un tableau de résultats et un chemin de fichier.
**Sortie** : un fichier CSV créé sur le filesystem.

### `src/renderer/cliRenderer.js`

**Ce que ça fait** : formate et affiche les résultats dans stdout. Sépare la présentation de la logique métier.
**Entrée** : des données brutes (classement, vote enregistré, etc.).
**Sortie** : texte formaté dans stdout.

## L'ORDRE DE CONSTRUCTION (PAR OÙ COMMENCER)

```
1. src/errors/       --> zéro dépendance, testables immédiatement
2. src/parser/argsParser.js --> indépendant, testable avec des argv mockés
3. src/store/jsonStore.js  --> indépendant du reste de la logique
4. src/validators/     --> dépend des errors
5. src/services/voteService.js  --> dépend de store + validators
6. src/services/rankingService.js --> dépend de store
7. src/export/csvExporter.js   --> dépend de rankingService
8. src/handlers/         --> dépend de tous les services
9. src/router/commandRouter.js  --> dépend de tous les handlers
10. src/renderer/cliRenderer.js --> indépendant (pure présentation)
11. src/cli.js          --> branche tout
12. Dockerfile + CI       --> en dernier, une fois que tout tourne
```

## ESTIMATION DE TEMPS ET ZONES DE RÉSISTANCE

**Durée totale estimée** : 14 à 20 heures de travail réel.

| Étape                        | Durée estimée | Zone de résistance                                       |
| ---------------------------- | ------------- | -------------------------------------------------------- |
| errors + parser              | 1h30          | Faible                                                   |
| store + validators           | 2h            | Faible                                                   |
| voteService + rankingService | 3h            | Moyenne : les edge cases de vote (quota, ex-aequo)       |
| handlers + router            | 2h            | Faible                                                   |
| cli.js + renderer            | 1h30          | Faible                                                   |
| csvExporter                  | 1h            | Faible                                                   |
| Dockerfile + CI              | 2-3h          | **Haute** si c'est la première fois qu'on containerise   |
| Tests                        | 2-3h          | Moyenne : tester un CLI avec process.argv est inhabituel |

Le Dockerfile et la CI sont le point de résistance pour quelqu'un qui ne l'a jamais fait. Commence par faire tourner le CLI sans Docker. Une fois que tout est vert en local, containerise.

## EXEMPLE DE TEST REMPLI

```js
// tests/voteService.test.js
import { submitVote } from "../src/services/voteService.js";
import { resetStore } from "../src/store/jsonStore.js";

beforeEach(() => resetStore()); // repart d'un état propre avant chaque test

describe("voteService.submitVote", () => {
  test("enregistre un vote valide", () => {
    const result = submitVote({
      player: "Rodri",
      journalist: "FF",
      points: 15,
    });
    expect(result.recorded).toBe(true);
    expect(result.player).toBe("Rodri");
  });

  test("throw QuotaExceededError si le même journaliste vote deux fois", () => {
    submitVote({ player: "Rodri", journalist: "FF", points: 15 });
    expect(() =>
      submitVote({ player: "Vinicius", journalist: "FF", points: 12 }),
    ).toThrow("QuotaExceededError");
  });

  test("throw InvalidVoteError si les points sont hors de 1-15", () => {
    expect(() =>
      submitVote({ player: "Rodri", journalist: "FF", points: 20 }),
    ).toThrow("InvalidVoteError");
  });
});

// tests/cli.test.js:tester le CLI lui-même
import { execSync } from "child_process";

test("exit code 0 pour un vote valide", () => {
  const result = execSync(
    'node src/cli.js vote --player "Rodri" --journalist "Test" --points 10',
    { encoding: "utf-8" },
  );
  expect(result).toContain("Rodri");
});

test("exit code 1 pour un vote invalide", () => {
  expect(() =>
    execSync(
      'node src/cli.js vote --player "Rodri" --journalist "Test" --points 99',
    ),
  ).toThrow(); // execSync throw si exit code != 0
});
```

## CAS LIMITES À TESTER OBLIGATOIREMENT

1. **Un journaliste vote deux fois** : `QuotaExceededError`, le deuxième vote n'est pas enregistré, le premier reste intact.
2. **Points hors plage (0 ou 16)** : `InvalidVoteError`, message clair sur stderr, exit 1.
3. **Joueur avec des caractères spéciaux dans le nom** : `--player "İlkay Gündoğan"` doit passer sans erreur de parsing.
4. **Export CSV sur un classement vide** : le fichier est créé avec juste les headers, pas une erreur.
5. **Ordre_mission inconnue** : `node src/cli.js unknown_command` affiche l'aide disponible et exit 1.

## LES RÈGLES QUE TU NE DOIS JAMAIS CASSER

1. **Les erreurs vont sur stderr, les résultats sur stdout.** Jamais un mélange. Un script qui parse la sortie du CLI doit pouvoir les distinguer.
2. **Chaque commande a un exit code explicite.** Succès = 0. Erreur métier = 1. Erreur système = 2. Pas de `process.exit()` sans argument.
3. **`legacy/ballonDorV1.js` reste intact.** C'est la référence comportementale. Si un comportement de la v2 diffère du v1, c'est documenté dans `POSTMORTEM.md`.

## CE QUE TU NE FAIS PAS DANS CE PROJET

- Pas d'interface web.
- Pas de base de données (JSON sur le filesystem uniquement).
- Pas de TypeScript.
- Pas de Worker Threads (ce projet reste mono-thread, la simulation est séquentielle).

## LES ADR

```
ADR/001-pourquoi-json-fichier-plutot-que-db-pour-la-persistance.md
ADR/002-pourquoi-exit-codes-distincts-pour-erreur-metier-vs-systeme.md
ADR/003-pourquoi-separer-renderer-des-services.md
```

Exemple rempli :

```markdown
# ADR 002 : Exit codes distincts pour erreur métier vs erreur système

## Contexte

Un CLI peut échouer pour deux raisons très différentes : une règle métier non
respectée (vote invalide, quota dépassé) ou une erreur technique (fichier JSON
corrompu, permission refusée sur le filesystem).

## Décision

Exit code 1 pour les erreurs métier (l'utilisateur a fait quelque chose de
invalide). Exit code 2 pour les erreurs système (l'infra a un problème).

## Alternatives considérées

- Un seul code exit 1 pour tout : rejeté car dans un script qui appelle le CLI,
  on ne peut pas distinguer "le vote était invalide" de "le filesystem est cassé".
- Des codes spécifiques par type d'erreur (10, 11, 12...) : rejeté, sur-ingénierie.
  La convention Unix établit 0/1/2, pas plus.

## Conséquences

- La CI peut détecter les erreurs système (exit 2) et alerter séparément des
  erreurs de validation (exit 1).
- Les scripts qui wrappent ce CLI peuvent brancher leur logique sur ces codes.
```

## QUAND EST-CE QUE LE PROJET EST VRAIMENT FINI

```
[ ] les 5 commandes (vote, rank, simulate, reset, export) fonctionnent en console
[ ] legacy/ballonDorV1.js existe, intact, jamais modifié
[ ] les 5 cas limites ont chacun un test qui passe
[ ] les exit codes sont corrects (testé dans cli.test.js)
[ ] les erreurs vont sur stderr, les résultats sur stdout (vérifié manuellement)
[ ] Dockerfile construit et le CLI tourne dans le container
[ ] le workflow CI tourne les tests à chaque push (fichier .github/workflows présent)
[ ] les 3 ADR sont remplis avec contexte, décision, alternatives, conséquences
[ ] POSTMORTEM.md documente les différences comportementales trouvées entre v1 et v2
[ ] TDD_JOURNAL.md trace dans quel ordre les tests ont été écrits
```

## SÉCURITÉ (gate obligatoire)

Un projet qui marche mais qui est vulnérable n'est pas fini. Traite ces exigences OWASP contextuelles avant de livrer.

- Injection d'arguments (OWASP A03) : valider les arguments CLI, ne jamais passer une entrée brute à un shell/eval.
- Chemins (OWASP A01) : empêcher le path traversal si le CLI lit/écrit des fichiers fournis par l'utilisateur.

Pour chaque exigence : documente dans `SECURITY.md` la menace, ta contre-mesure et le test qui la prouve. Le `verification_pack` de ce projet contient un test de sécurité qui doit passer.

---

## Securite (gate obligatoire, Partie I)

- **Exigence 1** : aucune donnee sensible (secret, token, cle) dans le code source ni dans les logs. Utiliser variables d'environnement + `.env.example` versionne (jamais `.env`).
- **Exigence 2** : toute entree externe (STDIN, fichier, HTTP, CLI) est validee AVANT usage (type, longueur, format). En cas d'invalidite : erreur explicite, jamais un crash silencieux.

Un test dans `node solution.js` (auto-verif ecrite par toi) doit prouver ces deux points (ex : lancer le programme avec une entree malformee et verifier qu'il refuse proprement).

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**
