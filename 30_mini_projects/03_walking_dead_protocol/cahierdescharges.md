---
stability: intemporel
---

# CAHIER DES CHARGES : WALKING DEAD PROTOCOL

Temps de lecture ~17 min

## PRÉREQUIS

```
Node.js    : v20+
npm      : v10+
Variables env : aucune
Outils externes: Playwright (installé via npm install)

# Installation
$ npm install
$ npx playwright install chromium  # navigateur pour les tests E2E

# Lancer le camp (le CLI de gestion)
$ node src/cli.js status

# Lancer les tests unitaires et d'intégration
$ npm test

# Lancer les tests E2E
$ npm run test:e2e
```

Pas de serveur web. Le camp se gère depuis la ligne de commande. Playwright teste le comportement du CLI via des processus Node enfants.

---

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Le groupe de Rick Grimes a besoin d'un système de gestion de camp : inventaire de ressources, rotations de garde, rations alimentaires, niveaux de sécurité par périmètre. Le code existe déjà : `legacy/campV1.js`. Il a été écrit en pleine nuit, sous la pression des morts-vivants. C'est du spaghetti. Une seule fonction de 300 lignes. Des variables globales partout. Zéro test. Personne ne sait ce qu'il fait vraiment.

Ton boulot : ne jamais ajouter de feature avant d'avoir des tests. Refactorer sans rien casser. Transformer ce camp en forteresse de code propre.

Ce que tu dois voir tourner à la fin :

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

$ node src/cli.js add-threat --level 4 --perimeter south
[SECURITE] Menace enregistrée : périmètre sud, niveau 4
[ALERTE] Niveau critique : évacuation possible dans 2h

$ npm test
PASS tests/inventory.test.js (22 tests)
PASS tests/guards.test.js (18 tests)
PASS tests/security.test.js (16 tests)
PASS tests/cli.test.js (20 tests)

$ npm run test:e2e
PASS e2e/campWorkflow.spec.js (8 scénarios)
```

Ce projet a deux versions coexistantes : `legacy/campV1.js` (jamais modifié) et `src/` (ta v2 propre). Même comportement observable, structure interne entièrement différente.

## POURQUOI CE PROJET EXISTE

Ce projet teste une compétence que les juniors évitent systématiquement : travailler sur du code existant qu'on n'a pas écrit, sans le réécrire d'un bloc.

- **écrire des tests sur du code sans tests** : avant de toucher quoi que ce soit dans `legacy/campV1.js`, tu dois le couvrir par des tests. C'est la seule façon de savoir si ta refactorisation casse quelque chose.
- **refactorer sans régression** : chaque petite étape de refactoring est validée par les tests. Pas de grand saut. Pas de "je réécris tout et je vois si ça marche". Étape par étape, test vert après test vert.
- **TDD pur sur les nouvelles features** : une fois la v2 en place, chaque nouvelle fonctionnalité suit le cycle red/green/refactor. Le test arrive avant le code, toujours.

## LES 4 MODULES QUE CE PROJET COUVRE, ET OÙ ILS SE VOIENT DANS LE CODE

### `06_testing` : unit, intégration, mocking, E2E Playwright

**Où ça se voit** : tout le dossier `tests/` et `e2e/`.
**Pourquoi c'est nécessaire ici** : couvrir un legacy sans tests, puis passer au TDD pour les nouvelles features. Les deux exercices en un. Playwright simule un opérateur qui tape des commandes dans le terminal.

### `13_refactoring` : SOLID sur du code procédural, code smells

**Où ça se voit** : le passage de `legacy/campV1.js` vers `src/`. Chaque module de `src/` correspond à une responsabilité extraite du monolithe original.
**Pourquoi c'est nécessaire ici** : `campV1.js` viole SRP (une seule fonction fait tout), OCP (ajouter une feature = modifier la fonction existante), DIP (la logique métier dépend directement du filesystem). La v2 corrige les trois.

### `15_runtime_env` : CLI Node.js, fs, Worker Threads

**Où ça se voit** : `src/cli.js`, `src/store/fileStore.js`, `src/workers/threatSimulator.js`.
**Pourquoi c'est nécessaire ici** : `process.argv` pour les commandes CLI, `fs.promises` pour la persistance JSON, Worker Threads pour simuler des vagues de menaces en parallèle sans bloquer le CLI.

### `32_tools` : logger structuré, benchmark, debug toolkit

**Où ça se voit** : `src/logger/`, `src/debug/`.
**Pourquoi c'est nécessaire ici** : les opérations du camp sont loggées en JSON structuré avec timestamp et niveau. Le debug toolkit permet de rejouer un scénario passé depuis les logs. Ce sont des outils réutilisables dans n'importe quel autre projet du curriculum.

### Résumé visuel

```
06_testing  --> tests/ (unit + integration), e2e/ (Playwright), mocks/
13_refactoring --> legacy/ -> src/ (SOLID, code smells éliminés)
15_runtime_env --> src/cli.js (argv), src/store/fileStore.js (fs), src/workers/
32_tools    --> src/logger/ (JSON structuré), src/debug/ (replay de scénarios)
```

## FLUX D'APPEL : QUI APPELLE QUI, DANS QUEL ORDRE

```
terminal: node src/cli.js consume --resource food --amount 3
 --> argsParser.parse(process.argv)     // { command: 'consume', resource: 'food', amount: 3 }
 --> commandRouter.route(parsedArgs)     // route vers consumeHandler
 --> consumeHandler.execute(args)
    --> inventoryService.consume('food', 3)
       --> fileStore.read('inventory.json')  // lit l'état actuel
       --> inventoryService.validate(current, 3) // assez de ressources ?
       --> inventoryService.applyConsumption(current, 3) // calcule le nouvel état
       --> fileStore.write('inventory.json', updated)  // persiste
       --> alertService.check(updated)     // seuils dépassés ?
    --> logger.info('consume', { resource: 'food', amount: 3, remaining: 11 })
    --> renderer.print(result)      // affiche dans stdout
 --> process.exit(0)

(Worker Thread : tourne en arrière-plan pendant les simulations)
threatSimulator
 --> parentPort.postMessage({ type: 'threat', level, perimeter })
 --> securityService.registerThreat(threat)
 --> alertService.evaluate(threats)
```

## L'ARCHITECTURE DU CODE, FICHIER PAR FICHIER

```
legacy/
└── campV1.js            # le spaghetti original : jamais modifié

src/
├── cli.js             # point d'entrée, branche les commandes
├── parser/
│  └── argsParser.js        # parse process.argv
├── router/
│  └── commandRouter.js      # route vers le bon handler
├── handlers/
│  ├── statusHandler.js
│  ├── consumeHandler.js
│  ├── rotateGuardsHandler.js
│  ├── addThreatHandler.js
│  └── resetHandler.js
├── services/
│  ├── inventoryService.js
│  ├── guardService.js
│  └── securityService.js
├── store/
│  └── fileStore.js        # lecture/écriture JSON (fs.promises)
├── alerts/
│  └── alertService.js       # seuils et alertes
├── workers/
│  └── threatSimulator.js     # Worker Thread pour simulations
├── logger/
│  └── structuredLogger.js     # JSON logging avec timestamp et niveau
└── debug/
  └── scenarioReplayer.js     # rejoue un scénario depuis les logs

tests/
├── inventory.test.js
├── guards.test.js
├── security.test.js
└── cli.test.js

e2e/
└── campWorkflow.spec.js

mocks/
├── fileStore.mock.js        # mock du filesystem pour les tests unitaires
└── alertService.mock.js
```

### `legacy/campV1.js`

**Ce que ça fait** : le code original du stagiaire. Une seule fonction `runCamp()` de ~300 lignes avec des `if` imbriqués, des variables globales, et des appels `fs.readFileSync` directs au milieu de la logique métier. Jamais touché.
**Rôle** : référence comportementale. Si la v2 se comporte différemment du v1 sur un cas, c'est documenté dans `POSTMORTEM.md`.

### `src/services/inventoryService.js`

**Ce que ça fait** : toute la logique métier de l'inventaire. Consommer une ressource, ajouter un approvisionnement, calculer les jours restants, vérifier les seuils critiques.
**Entrée** : un état d'inventaire (objet) et une opération.
**Sortie** : un nouvel état d'inventaire (jamais de mutation directe).

### `src/services/guardService.js`

**Ce que ça fait** : gestion des rotations de garde. Calculer la prochaine rotation, enregistrer un poste occupé, détecter un poste vacant.
**Entrée** : l'état des gardes et une commande (`rotate`, `assign`, `status`).
**Sortie** : un nouvel état des gardes.

### `src/services/securityService.js`

**Ce que ça fait** : gestion des niveaux de menace par périmètre. Enregistrer une menace, calculer le niveau global du camp, déclencher l'alerte d'évacuation.
**Entrée** : une menace `{ level, perimeter }`.
**Sortie** : l'état de sécurité mis à jour.

### `src/store/fileStore.js`

**Ce que ça fait** : interface de persistance. `read(filename)` lit depuis `data/`, `write(filename, data)` écrit. Utilise `fs.promises` pour rester async. Jamais appelé directement depuis les services (les services reçoivent l'état en paramètre, c'est le handler qui lit/écrit).
**Entrée** : un nom de fichier et des données.
**Sortie** : les données lues, ou un accusé d'écriture.

### `src/alerts/alertService.js`

**Ce que ça fait** : vérifie les seuils sur l'état global du camp. Si la nourriture passe sous 7 jours : alerte. Si les médicaments tombent à 0 : alerte critique. Si une menace dépasse le niveau 4 : alerte évacuation.
**Entrée** : l'état courant du camp.
**Sortie** : un tableau d'alertes actives (vide si tout va bien).

### `src/workers/threatSimulator.js`

**Ce que ça fait** : Worker Thread qui simule des vagues de zombies à intervalle régulier. Envoie des événements au thread principal via `parentPort.postMessage`. Utilisé pour les démos et les tests de charge.
**Entrée** : une config `{ intensity, duration, perimeters }`.
**Sortie** : des messages `{ type: 'threat', level, perimeter }` envoyés au thread principal.

### `src/logger/structuredLogger.js`

**Ce que ça fait** : log en JSON avec timestamp ISO, niveau (`info`, `warn`, `error`), et champs contextuels. Chaque opération du camp produit une ligne de log. Les logs sont écrits dans `logs/camp.jsonl` (JSONL = une ligne JSON par entrée).
**Entrée** : un niveau, un message, un objet contexte.
**Sortie** : une ligne JSON dans `logs/camp.jsonl` et dans stdout.

### `src/debug/scenarioReplayer.js`

**Ce que ça fait** : lit `logs/camp.jsonl` et rejoue les opérations dans l'ordre. Utile pour reproduire un état passé du camp ou débugger une séquence d'actions qui a mené à un crash.
**Entrée** : un chemin vers un fichier de logs et un filtre optionnel (depuis quelle entrée rejouer).
**Sortie** : l'état reconstruit du camp après replay.

## L'ORDRE DE CONSTRUCTION (PAR OÙ COMMENCER)

```
PHASE 1 : couvrir le legacy avant de toucher quoi que ce soit

1. Lire et comprendre legacy/campV1.js entièrement
2. Écrire tests/inventory.test.js sur le comportement observé du v1 (sans modifier v1)
3. Écrire tests/guards.test.js idem
4. Écrire tests/security.test.js idem
  => à ce stade : les tests décrivent le legacy. Ils sont verts sur v1.

PHASE 2 : construire la v2 module par module, test vert à chaque étape

5. src/store/fileStore.js    --> zéro dépendance, mockable immédiatement
6. src/logger/structuredLogger.js --> zéro dépendance
7. src/alerts/alertService.js  --> dépend uniquement de l'état (objet pur)
8. src/services/inventoryService.js --> dépend de alertService
9. src/services/guardService.js   --> indépendant des autres services
10. src/services/securityService.js --> dépend de alertService
11. src/parser/argsParser.js     --> indépendant
12. src/handlers/          --> dépendent des services
13. src/router/commandRouter.js   --> dépend des handlers
14. src/cli.js            --> branche tout
15. tests/cli.test.js        --> teste les commandes via execSync
16. src/workers/threatSimulator.js  --> en dernier (Worker Thread)
17. src/debug/scenarioReplayer.js  --> en dernier
18. e2e/campWorkflow.spec.js     --> une fois que tout tourne
```

La règle de la phase 1 est non-négociable : si tu n'as pas de tests sur le v1 avant de commencer la v2, tu n'as aucun filet de sécurité.

## ESTIMATION DE TEMPS ET ZONES DE RÉSISTANCE

**Durée totale estimée** : 16 à 24 heures de travail réel.

| Étape                         | Durée estimée | Zone de résistance                                                                         |
| ----------------------------- | ------------- | ------------------------------------------------------------------------------------------ |
| Lire et comprendre campV1.js  | 1-2h          | **Haute psychologiquement** : du spaghetti intentionnel, c'est déstabilisant               |
| Tests sur le legacy (phase 1) | 3-4h          | **Haute** : tester du code sans interface claire demande de l'ingéniosité                  |
| fileStore + logger + alerts   | 2h            | Faible                                                                                     |
| services (3)                  | 3h            | Moyenne                                                                                    |
| handlers + router + cli       | 2h            | Faible                                                                                     |
| tests/cli.test.js             | 1h30          | Faible                                                                                     |
| Worker Thread                 | 2-3h          | Moyenne : les Worker Threads ont une API distincte, postMessage prend du temps à maîtriser |
| E2E Playwright                | 2-3h          | Moyenne : premier contact avec Playwright via CLI                                          |
| scenarioReplayer              | 1h30          | Faible                                                                                     |

La zone de résistance inattendue est la phase 1 : écrire des tests sur du code procédural sans interface claire. Il n'y a pas de fonctions exportées proprement dans `campV1.js`. La solution : extraire les comportements observables en lançant le programme, pas en lisant le code. Tester les sorties stdout plutôt que les fonctions internes.

## EXEMPLE DE TEST REMPLI

```js
// tests/inventory.test.js
import {
  consume,
  addSupply,
  getDaysRemaining,
  isLow,
} from "../src/services/inventoryService.js";

describe("inventoryService", () => {
  const baseInventory = {
    food: { units: 42, dailyConsumption: 3 }, // 14 jours
    ammo: { units: 847 },
    medicine: { units: 3, lowThreshold: 10 },
  };

  test("consume réduit les unités correctement", () => {
    const updated = consume(baseInventory, "food", 9);
    expect(updated.food.units).toBe(33);
  });

  test("consume ne mute pas l'inventaire original", () => {
    consume(baseInventory, "food", 9);
    expect(baseInventory.food.units).toBe(42); // original intact
  });

  test("getDaysRemaining calcule correctement", () => {
    expect(getDaysRemaining(baseInventory, "food")).toBe(14);
  });

  test("isLow détecte quand une ressource est sous le seuil", () => {
    expect(isLow(baseInventory, "medicine")).toBe(true); // 3 < 10
    expect(isLow(baseInventory, "food")).toBe(false);
  });

  test("consume throw si quantité insuffisante", () => {
    expect(() => consume(baseInventory, "food", 100)).toThrow(
      "InsufficientResourceError",
    );
  });
});

// tests/cli.test.js
import { execSync } from "child_process";

beforeEach(() => {
  // Réinitialise l'état du camp avant chaque test CLI
  execSync("node src/cli.js reset --confirm", { encoding: "utf-8" });
});

test("status affiche les ressources du camp", () => {
  const output = execSync("node src/cli.js status", { encoding: "utf-8" });
  expect(output).toContain("CAMP");
  expect(output).toContain("INVENTAIRE");
  expect(output).toContain("SECURITE");
});

test("consume réduit les ressources et l'affiche", () => {
  const output = execSync(
    "node src/cli.js consume --resource food --amount 3",
    { encoding: "utf-8" },
  );
  expect(output).toContain("11 jours");
});

test("exit 1 si ressource inconnue", () => {
  expect(() =>
    execSync("node src/cli.js consume --resource dragon --amount 1"),
  ).toThrow(); // execSync throw si exit code != 0
});
```

```js
// e2e/campWorkflow.spec.js
import { test, expect } from "@playwright/test";
import { execSync } from "child_process";

// Playwright teste le CLI via des processus Node
// On teste les workflows complets, pas les fonctions isolées

test("workflow complet : consommation + alerte de seuil", () => {
  execSync("node src/cli.js reset --confirm");

  // Consommer jusqu'au seuil critique
  execSync("node src/cli.js consume --resource medicine --amount 2");
  const output = execSync("node src/cli.js status", { encoding: "utf-8" });

  expect(output).toContain("CRITIQUE");
  expect(output).toContain("medicine");
});

test("workflow rotation de garde : assign, rotate, verify", () => {
  execSync("node src/cli.js reset --confirm");
  execSync("node src/cli.js assign-guard --post A --guard Daryl");
  execSync("node src/cli.js assign-guard --post B --guard Michonne");

  const before = execSync("node src/cli.js status", { encoding: "utf-8" });
  expect(before).toContain("Daryl");

  execSync("node src/cli.js rotate-guards");

  const after = execSync("node src/cli.js status", { encoding: "utf-8" });
  expect(after).not.toContain("Daryl"); // Daryl a changé de poste
});
```

## CAS LIMITES À TESTER OBLIGATOIREMENT

1. **Consommation supérieure au stock** : `consume --resource food --amount 9999` doit throw `InsufficientResourceError`, stderr propre, exit 1. Le stock ne bouge pas.
2. **Rotation de garde avec un poste vacant** : si un garde est absent (malade, KO), la rotation doit remplir le poste vacant en priorité plutôt que de tourner normalement.
3. **Alerte multiple simultanée** : menace niveau 4 + médicaments CRITIQUE en même temps : le CLI doit afficher les deux alertes, pas seulement la plus récente.
4. **Reset confirme avant d'effacer** : `node src/cli.js reset` sans `--confirm` doit demander une confirmation, pas effacer immédiatement. `node src/cli.js reset --confirm` efface sans demander.
5. **Worker Thread qui plante** : si le `threatSimulator` lance une exception, le thread principal doit logger l'erreur et continuer. Le camp ne doit pas crasher parce qu'une simulation de zombie a échoué.

## LES RÈGLES QUE TU NE DOIS JAMAIS CASSER

1. **`legacy/campV1.js` reste intact et jamais modifié.** C'est la référence comportementale. Si un comportement de la v2 diffère, c'est documenté dans `POSTMORTEM.md`.
2. **Aucune nouvelle feature avant que les tests correspondants soient écrits en premier.** Red/green/refactor. Si tu te retrouves à écrire du code sans test rouge qui l'attendait, tu t'es écarté du TDD.
3. **Les services ne touchent jamais le filesystem directement.** `inventoryService.consume()` prend un état en paramètre et retourne un nouvel état. C'est le handler qui appelle `fileStore.read()` et `fileStore.write()`. Cette séparation rend les services testables sans mocker le filesystem.

## CE QUE TU NE FAIS PAS DANS CE PROJET

- Pas d'interface web.
- Pas de TypeScript.
- Pas de base de données SQL (JSON sur le filesystem uniquement).
- Pas de communication réseau (le Worker Thread communique via `postMessage`, pas via HTTP ou WebSocket).
- Pas de benchmark de performance (c'est le projet `04_breaking_cache` qui couvre ça).

## LES ADR

```
ADR/001-pourquoi-services-sans-acces-filesystem-direct.md
ADR/002-pourquoi-tdd-avant-refactoring-plutot-qu-apres.md
ADR/003-pourquoi-worker-thread-pour-la-simulation-de-menaces.md
```

Exemple rempli :

```markdown
# ADR 002 : TDD avant refactoring, pas après

## Contexte

Le code legacy (campV1.js) fonctionne. On pourrait le réécrire directement,
vérifier que ça marche encore en lançant le programme, et écrire les tests après.

## Décision

Les tests sur le legacy sont écrits AVANT de toucher une seule ligne de v2.
La couverture de tests sur le v1 est le filet de sécurité qui valide chaque
étape de refactoring.

## Alternatives considérées

- Réécrire d'abord, tester après : rejeté. Si la v2 a un bug, on ne sait pas
  si c'est un bug introduit ou un comportement qui existait déjà dans le v1.
  Sans tests, on ne peut pas distinguer les deux.
- Réécrire d'un bloc et tester le résultat final : rejeté. Un refactoring d'un
  bloc est un remplacement, pas un refactoring. On perd la traçabilité.

## Conséquences

- La phase 1 (tests sur le legacy) prend du temps qui ne produit pas de features.
  C'est un investissement, pas du temps perdu.
- Chaque commit de refactoring peut être vérifié en lançant npm test.
  Si un test passe au rouge, on sait exactement quelle étape a cassé quelque chose.
```

## QUAND EST-CE QUE LE PROJET EST VRAIMENT FINI

```
[ ] legacy/campV1.js est couvert par des tests avant que la v2 soit commencée
  (vérifiable par git : les tests sur le legacy sont dans un commit séparé)
[ ] les 5 commandes (status, consume, rotate-guards, add-threat, reset) fonctionnent
[ ] les services ne lisent ni n'écrivent jamais le filesystem directement
[ ] les 5 cas limites ont chacun un test qui passe
[ ] le Worker Thread envoie des events au thread principal sans crasher le CLI
[ ] les logs structurés sont en JSON valide dans logs/camp.jsonl après utilisation
[ ] le scenarioReplayer reconstruit un état de camp depuis les logs (testé manuellement)
[ ] les tests E2E Playwright couvrent au moins 2 workflows complets
[ ] les 3 ADR sont remplis avec contexte, décision, alternatives, conséquences
[ ] POSTMORTEM.md documente au moins une différence de comportement entre v1 et v2
[ ] TDD_JOURNAL.md trace dans quel ordre les tests ont été écrits (phase 1 vs phase 2)
```

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**
