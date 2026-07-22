---
stability: intemporel
---

[PORTFOLIO]

# WALKING DEAD PROTOCOL

-> ~6 min

Le groupe de Rick Grimes gère un camp : inventaire de ressources, rotations de garde, niveaux de sécurité par périmètre. Le code existe déjà dans `legacy/campV1.js` : écrit en pleine nuit sous pression, une fonction de 300 lignes, des variables globales partout, zéro test. Personne ne sait exactement ce qu'il fait.

Ce projet n'ajoute aucune feature avant d'avoir des tests. Il refactore le legacy étape par étape, jamais d'un bloc, et construit une v2 propre sans jamais toucher au v1.

---

## CE QUE ÇA FAIT

```
$ node src/cli.js status
[CAMP RICK] Alexandria : jour 47
[SECURITE] Périmètre nord : OK | Périmètre sud : ALERTE (niveau 3)
[INVENTAIRE] Nourriture : 14 jours | Munitions : 847 | Médicaments : CRITIQUE (3 unités)
[GARDES] Rotation suivante dans 4h | Poste A : Daryl | Poste B : Michonne

$ node src/cli.js rotate-guards
[ROTATION] Nouvelle rotation : Daryl -> Glenn | Michonne -> Carl
[LOG] Rotation enregistrée à 22:41

$ node src/cli.js consume --resource food --amount 3
[INVENTAIRE] Nourriture : 11 jours restants
[ALERTE] Seuil critique atteint dans 6 jours si consommation constante
```

---

## INSTALLATION

```
Node.js    : v20+
npm      : v10+
Outils externes: Playwright (installé via npm install)
```

```bash
npm install
npx playwright install chromium  # navigateur pour les tests E2E

node src/cli.js status  # interagir avec le camp
npm test         # tests unitaires + intégration
npm run test:e2e     # tests E2E Playwright
```

Pas de serveur web : le camp se gère en ligne de commande. Playwright teste le CLI via des processus Node enfants, pas via un navigateur.

---

## ARCHITECTURE

```
legacy/
└── campV1.js       # le spaghetti original : JAMAIS modifié, référence comportementale

src/
├── cli.js         # point d'entrée
├── parser/argsParser.js  # parse process.argv
├── router/commandRouter.js # route vers le bon handler
├── handlers/        # statusHandler, consumeHandler, rotateGuardsHandler, addThreatHandler, resetHandler
├── services/        # inventoryService, guardService, securityService : état pur, zéro fs direct
├── store/fileStore.js   # seul point d'accès au filesystem (fs.promises)
├── alerts/alertService.js # seuils et alertes
├── workers/threatSimulator.js # Worker Thread, simulation de vagues de menaces
├── logger/structuredLogger.js # JSON logging (logs/camp.jsonl)
└── debug/scenarioReplayer.js  # rejoue un état passé depuis les logs

tests/    # unit + intégration
e2e/     # Playwright
mocks/    # fileStore.mock.js, alertService.mock.js
```

Flux d'une commande :

```
node src/cli.js consume --resource food --amount 3
 --> argsParser.parse(process.argv)
 --> commandRouter.route(parsedArgs)
 --> consumeHandler.execute(args)
    --> inventoryService.consume('food', 3)  // état pur, pas de fs ici
       --> fileStore.read / fileStore.write // c'est le handler qui lit/écrit
       --> alertService.check(updated)
    --> logger.info('consume', { resource: 'food', amount: 3, remaining: 11 })
    --> renderer.print(result)
```

---

## MODULES CRAZYDEVS COUVERTS

| Module      | Où ça se voit                                    |
| ---------------- | ------------------------------------------------------------------------------------ |
| `06_testing`   | `tests/` (unit + intégration), `e2e/` (Playwright), `mocks/`             |
| `13_refactoring` | legacy → src/, SOLID appliqué, code smells éliminés                 |
| `15_runtime_env` | `cli.js` (argv), `fileStore.js` (fs.promises), `threatSimulator.js` (Worker Threads) |
| `32_tools`    | `structuredLogger.js` (JSON), `scenarioReplayer.js` (replay de logs)         |

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. legacy/campV1.js reste intact, jamais modifié : c'est la référence comportementale
2. Aucune feature sans test rouge écrit avant : red/green/refactor, toujours
3. Les services ne touchent jamais le filesystem directement : ils reçoivent
  un état, retournent un nouvel état. Seul le handler appelle fileStore.
```

---

## DOCUMENTS DU PROJET

```
cahierdescharges.md  --> spécification complète, ordre de construction en 2 phases, cas limites
TDD_JOURNAL.md    --> phase 1 (couvrir le legacy) puis phase 2 (TDD sur la v2)
POSTMORTEM.md     --> différences de comportement entre v1 et v2
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
