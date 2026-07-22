---
stability: intemporel
---

[PORTFOLIO]

# RASENGAN ENGINE

-> ~6 min

Simulateur de combat textuel. Naruto vs Sasuke, Itachi vs Pain, n'importe quelle paire de ninjas avec leurs stats, leurs jutsus, et leurs cooldowns. Le moteur calcule les dégâts, résout les esquives, applique les critiques, et sort un log de combat lisible directement dans le terminal.

Zéro framework. Zéro bibliothèque externe. Du JS pur, et des décisions de conception qui comptent.

---

## CE QUE ÇA FAIT

```
$ node src/index.js

[COMBAT] Naruto (Uzumaki) vs Sasuke (Uchiha)
[TOUR 1] Naruto utilise Rasengan : 87 dégâts | Sasuke esquive (prob: 32%)
[TOUR 2] Sasuke utilise Chidori : 112 dégâts | Naruto bloqué (chakra: 140/200)
[TOUR 3] Naruto utilise Rasengan Ōdama : CRITIQUE x1.8 => 156 dégâts
[FIN] Sasuke KO au tour 3. Chakra restant de Naruto : 68/200.
```

---

## INSTALLATION

```
Node.js    : v20+
npm      : v10+ (inclus avec Node.js)
Variables env : aucune
Outils externes: aucun
```

```bash
npm install
node src/index.js  # lance un combat
npm test       # lance la suite de tests
```

Pas de build step, pas de transpilation. Le code tourne tel qu'il est écrit.

---

## ARCHITECTURE

```
src/
├── fighters/
│  ├── fighterFactory.js  # crée un ninja prêt au combat (Factory pattern)
│  └── fighterStats.js   # stats de base par ninja connu
│
├── jutsus/
│  ├── jutsuRegistry.js  # registre des jutsus, indexés par nom
│  ├── narutoJutsus.js   # jutsus spécifiques à Naruto (Strategy pattern)
│  └── sasukeJutsus.js   # jutsus spécifiques à Sasuke
│
├── engine/
│  ├── combat.js      # orchestre la boucle de combat
│  ├── turnResolver.js   # résout un tour, retourne un nouvel état
│  └── damageCalc.js    # calcule les dégâts d'une attaque
│
├── utils/
│  ├── rng.js       # générateur de probabilités, déterministe en mode test
│  └── cooldownCycle.js  # gestion des cooldowns par modulo
│
├── logger/
│  └── combatLogger.js   # affichage du combat dans le terminal
│
└── index.js        # point d'entrée

tests/
├── fighter.test.js
├── jutsu.test.js
├── combat.test.js
└── rng.test.js
```

Flux d'appel d'un combat complet :

```
index.js
 --> fighterFactory.createFighter("naruto")
 --> fighterFactory.createFighter("sasuke")
 --> combat.start(naruto, sasuke)
    --> turnResolver.resolve(state)
       --> jutsuRegistry.getJutsu(...)
       --> rng.roll(probability)
       --> damageCalc.compute(...)
       --> cooldownCycle.tick(...)
    --> combat.nextTurn(newState)
 --> combatLogger.printResult(finalState)
```

---

## MODULES CRAZYDEVS COUVERTS

| Module        | Où ça se voit                             |
| -------------------- | ---------------------------------------------------------------------- |
| `01_fundamentals`  | objets ninja, HOF (`map`/`filter`/`reduce`) partout dans `combat.js`  |
| `07_math_basics`   | `rng.js` (probabilités), `cooldownCycle.js` (modulo)          |
| `11_functional_js`  | `turnResolver.js` : chaque tour retourne un nouvel état, zéro mutation |
| `13_design_patterns` | `fighterFactory.js` (Factory), `jutsus/` (Strategy)          |

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. Zéro mutation directe sur un fighter ou sur l'état du combat
2. Zéro if/switch par jutsu dans le moteur : le moteur appelle, il ne connaît pas
3. Zéro bibliothèque externe (pas de lodash, pas de ramda)
4. rng.js doit avoir un mode déterministe pour que les tests ne soient pas flaky
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
