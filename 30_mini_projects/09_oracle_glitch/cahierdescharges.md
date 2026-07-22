---
stability: intemporel
---

# CAHIER DES CHARGES : ORACLE GLITCH

Temps de lecture ~15 min

## PRÉREQUIS

```
Node.js    : v20+
npm      : v10+
Variables env : ANTHROPIC_API_KEY (obligatoire pour les appels API réels)
Outils externes: aucun

# Installation
$ npm install

# Configurer la clé API (créer un fichier .env à la racine)
ANTHROPIC_API_KEY=sk-ant-...

# Lancer une analyse
$ node src/cli.js analyze src/target.js

# Lancer les tests (n'appellent PAS l'API réelle : streamingClient est mocké)
$ npm test
```

Le modèle utilisé dans `streamingClient.js` : `claude-haiku-4-5-20251001` (le moins coûteux, suffisant pour l'analyse de code). Les tests n'appellent jamais l'API réelle : `streamingClient` est mocké via Jest. Chaque `npm test` coûte 0 token.

---

## C'EST QUOI CE PROJET, CONCRÈTEMENT

L'IA se prend pour un génie. Elle analyse ton code JavaScript, détecte des bugs, propose des fixes, génère des tests. Parfois elle a raison. Parfois elle invente des fonctions qui n'existent pas, retourne du JSON malformé à mi-chemin, te jure qu'un `NaN === NaN` est `true`, ou te propose un fix qui introduit une dépendance circulaire. Ton boulot : construire le pipeline qui la surveille, la valide, et la remet à sa place quand elle délire.

Ce que tu dois voir à la fin :

```
$ node src/cli.js analyze src/target.js

[ORACLE] Analyse en cours... (streaming token par token)

--- sortie LLM brute ---
{
 "bugs": [
  { "line": 14, "description": "Reference error potentiel", "fix": "Vérifier l'existence avant l'accès" }
 ],
 "tests": [
  "test('devrait retourner undefined pour une clé inexistante', () => { ... })"
 ],
 "confidence": 0.87
}
--- fin sortie LLM ---

[VALIDATOR] Schema OK | confidence: 0.87 (> seuil 0.6)
[VALIDATOR] 1 bug détecté | 1 test généré
[OUTPUT] Résultats dans results/analysis_target.json

$ npm test
PASS tests/promptBuilder.test.js (12 tests)
PASS tests/outputValidator.test.js (20 tests)
PASS tests/codeAnalyzer.test.js (14 tests)
PASS tests/edgeCases.test.js (16 tests)
```

Ce projet est le seul qui appelle l'Anthropic API. Il mixe OOP (programmation orientée objet), gestion d'edge cases JS, et la mécanique concrète de "coder avec l'IA sans lui faire confiance aveuglément".

## POURQUOI CE PROJET EXISTE

Ce projet teste une compétence qui n'existait pas dans le métier il y a 5 ans : écrire du code qui contrôle de l'IA.

- **la sortie d'un LLM (Large Language Model : modèle de langage de grande taille) n'est jamais garantie** : même un modèle de haute qualité peut retourner du JSON malformé, une réponse tronquée, un champ avec le mauvais type. Le code qui consomme cette sortie doit être défensif par défaut.
- **streamer token par token, c'est différent de recevoir une réponse complète** : avec le streaming, la réponse arrive progressivement. Le validateur ne peut pas attendre la fin pour valider. Il doit assembler, puis valider.
- **OOP ici n'est pas un exercice scolaire** : `CodeAnalyzer`, `PromptBuilder`, `OutputValidator` ont des responsabilités distinctes. Si les trois étaient dans un seul fichier, tester une partie sans les autres serait impossible.

## LES 4 MODULES QUE CE PROJET COUVRE, ET OÙ ILS SE VOIENT DANS LE CODE

### `23_ai_native_dev` : workflow IA, prompt engineering, validation

**Où ça se voit** : `src/prompt/`, `src/validator/`, `src/streaming/`.
**Pourquoi c'est nécessaire ici** : le prompt n'est pas une chaîne hardcodée. Il est construit dynamiquement selon le code analysé. La sortie est validée selon un schéma attendu. Sans ces deux éléments, le pipeline est un casino.

### `18_oop_js` : classes, prototype chain, mixins

**Où ça se voit** : `src/analyzer/CodeAnalyzer.js`, `src/validator/OutputValidator.js`, `src/validator/StrictValidator.js`.
**Pourquoi c'est nécessaire ici** : `Validator` → `StrictValidator` → `LLMOutputValidator` est une chaîne d'héritage réelle avec un usage intentionnel du prototype. Les mixins composent des comportements (loggable, retryable) sans hériter de tout.

### `27_team_craft` : code review outillée, ADR

**Où ça se voit** : `src/review/`, `ADR/`.
**Pourquoi c'est nécessaire ici** : l'IA propose des fixes. Un humain ne peut pas relire 200 suggestions à la main. Le pipeline de review automatise une première passe : les suggestions qui violent des règles connues (nommage, mutation, dépendances circulaires) sont rejetées avant qu'un humain les lise.

### `28_edge_cases` : NaN, floating point, undefined dans des tableaux

**Où ça se voit** : `src/edgeCases/edgeCaseInjector.js`, `tests/edgeCases.test.js`.
**Pourquoi c'est nécessaire ici** : l'IA ne voit pas que `0.1 + 0.2 !== 0.3`. Elle ne sait pas que `NaN === NaN` est `false`. Ces cas sont injectés délibérément dans les scénarios de test pour vérifier que le pipeline les détecte, même quand l'IA les rate.

### Résumé visuel

```
23_ai_native_dev --> src/prompt/ (PromptBuilder), src/validator/ (schema), src/streaming/
18_oop_js    --> CodeAnalyzer, Validator -> StrictValidator -> LLMOutputValidator, mixins
27_team_craft  --> src/review/ (review automatisée), ADR/ (toutes les décisions du pipeline)
28_edge_cases  --> src/edgeCases/ (injecteur de pièges), tests/edgeCases.test.js
```

## FLUX D'APPEL : QUI APPELLE QUI, DANS QUEL ORDRE

```
src/cli.js analyze src/target.js
 --> codeReader.read('src/target.js')    // lit le fichier cible
 --> codeAnalyzer.analyze(sourceCode)    // prépare l'analyse
    --> promptBuilder.build(sourceCode)  // construit le prompt dynamique
    --> streamingClient.send(prompt)   // appelle l'API Anthropic en streaming
       --> (tokens arrivent un par un)
       --> streamAssembler.append(token) // accumule
    --> streamAssembler.finalize()      // JSON complet assemblé
    --> outputValidator.validate(rawJson)  // valide le schéma
       --> JSON.parse(rawJson)
       --> schemaChecker.check(parsed)  // champs requis, types, valeurs
    --> reviewPipeline.review(validated)   // passe en revue les suggestions
 --> resultWriter.save(result, 'results/') // sauvegarde dans results/
 --> renderer.print(result)        // affiche le résumé dans le terminal
```

## L'ARCHITECTURE DU CODE, FICHIER PAR FICHIER

```
src/
├── analyzer/
│  └── CodeAnalyzer.js
│
├── prompt/
│  └── PromptBuilder.js
│
├── streaming/
│  ├── streamingClient.js
│  └── streamAssembler.js
│
├── validator/
│  ├── Validator.js
│  ├── StrictValidator.js
│  └── LLMOutputValidator.js
│
├── review/
│  └── reviewPipeline.js
│
├── edgeCases/
│  └── edgeCaseInjector.js
│
├── mixins/
│  ├── loggable.js
│  └── retryable.js
│
├── utils/
│  ├── codeReader.js
│  ├── resultWriter.js
│  └── renderer.js
│
└── cli.js

results/      # dossier créé automatiquement à la première analyse

tests/
├── promptBuilder.test.js
├── outputValidator.test.js
├── codeAnalyzer.test.js
└── edgeCases.test.js
```

### `src/analyzer/CodeAnalyzer.js`

**Ce que ça fait** : la classe principale. Orchestre prompt → streaming → validation → review. Ne fait rien elle-même, délègue à chaque spécialiste.
**Entrée** : le code source à analyser (chaîne de texte).
**Sortie** : `{ bugs: [...], tests: [...], confidence: number, reviewPassed: boolean }`.

### `src/prompt/PromptBuilder.js`

**Ce que ça fait** : construit le prompt envoyé à l'API à partir du code source. Inclut les instructions sur le format de sortie attendu (JSON avec schéma précis), les limites (pas d'hallucination de fonctions inexistantes), et des exemples du format souhaité.
**Entrée** : le code source.
**Sortie** : une chaîne (le prompt complet).

### `src/streaming/streamingClient.js`

**Ce que ça fait** : appelle l'API Anthropic avec le streaming activé. Retourne les tokens au fur et à mesure via un callback ou un itérateur.
**Entrée** : un prompt et un callback appelé à chaque token.
**Sortie** : rien de retourné directement (les tokens arrivent via callback).

### `src/streaming/streamAssembler.js`

**Ce que ça fait** : accumule les tokens jusqu'à avoir la réponse complète. Expose `append(token)` et `finalize()`.
**Entrée** : des tokens individuels.
**Sortie** : la chaîne complète assemblée après `finalize()`.

### `src/validator/Validator.js`

**Ce que ça fait** : classe de base. Expose `validate(data)` qui lance `_check(data)`. Contient la logique commune à tous les validateurs.
**Entrée** : des données brutes.
**Sortie** : les données validées ou une exception `ValidationError`.

### `src/validator/StrictValidator.js`

**Ce que ça fait** : étend `Validator`. Ajoute des vérifications strictes sur les types (rejette les `string` là où un `number` est attendu, même si JS ferait la coercition).
**Entrée** : données à valider.
**Sortie** : données validées avec types garantis.

### `src/validator/LLMOutputValidator.js`

**Ce que ça fait** : étend `StrictValidator`. Ajoute les règles spécifiques à la sortie de l'IA : le champ `confidence` doit être entre 0 et 1, le tableau `bugs` doit être un tableau (même vide), chaque bug doit avoir `line` (number) et `description` (string).
**Entrée** : la sortie JSON brute de l'IA après parse.
**Sortie** : un objet validé avec les bons types.

### `src/review/reviewPipeline.js`

**Ce que ça fait** : passe les suggestions de l'IA en revue selon des règles codées. Rejette les suggestions qui violent des règles connues : mutation directe d'état, `eval()`, `innerHTML` sans sanitization.
**Entrée** : les bugs et fixes suggérés par l'IA.
**Sortie** : `{ approved: [...], rejected: [...], reasons: [...] }`.

### `src/edgeCases/edgeCaseInjector.js`

**Ce que ça fait** : génère des scénarios de test contenant des edge cases JS connus (`NaN`, `0.1 + 0.2`, `undefined` dans un tableau, `null` là où un objet est attendu). Utilisé dans les tests pour vérifier que le validator les attrape.
**Entrée** : un type d'edge case.
**Sortie** : un scénario de test injecté dans le code à analyser.

### `src/mixins/loggable.js` et `retryable.js`

**Ce que ça fait** : des mixins (fonctions qui ajoutent des comportements à une classe sans héritage) qui ajoutent respectivement le logging automatique des appels et la logique de retry en cas d'erreur réseau.
**Entrée** : une classe à augmenter.
**Sortie** : la même classe avec le comportement supplémentaire greffé.

## L'ORDRE DE CONSTRUCTION (PAR OÙ COMMENCER)

```
1. src/validator/Validator.js     --> zéro dépendance, testable immédiatement
2. src/validator/StrictValidator.js  --> étend Validator
3. src/validator/LLMOutputValidator.js --> étend StrictValidator
4. src/streaming/streamAssembler.js  --> indépendant du client
5. src/prompt/PromptBuilder.js     --> indépendant du reste
6. src/mixins/             --> testables seuls
7. src/streaming/streamingClient.js  --> dépend de l'API (tester avec un mock)
8. src/review/reviewPipeline.js    --> dépend du validator
9. src/edgeCases/edgeCaseInjector.js  --> utilitaire de test
10. src/analyzer/CodeAnalyzer.js    --> orchestre tout
11. src/utils/ + src/cli.js      --> branche tout
```

## ESTIMATION DE TEMPS ET ZONES DE RÉSISTANCE

**Durée totale estimée** : 16 à 22 heures de travail réel.

| Étape                 | Durée estimée | Zone de résistance                                                        |
| --------------------- | ------------- | ------------------------------------------------------------------------- |
| Validator (3 niveaux) | 3h            | Moyenne : bien utiliser le prototype sans sur-compliquer                  |
| PromptBuilder         | 2h            | Moyenne : construire un prompt qui donne du JSON fiable                   |
| streamAssembler       | 1h            | Faible                                                                    |
| streamingClient       | 2-3h          | **Haute** : l'API Anthropic streaming est différente d'un fetch classique |
| reviewPipeline        | 2h            | Moyenne                                                                   |
| mixins                | 1h30          | Moyenne : comprendre comment greffer sans héritage                        |
| CodeAnalyzer          | 2h            | Faible (orchestre les briques déjà construites)                           |
| edgeCases + tests     | 3h            | Moyenne : inventer des cas où l'IA se plante est créatif                  |

Le streaming client est le plus risqué si c'est la première fois qu'on appelle une API streaming. La différence avec un `fetch` classique : les données arrivent par morceaux, pas d'un coup. Chaque morceau est un event qu'il faut gérer.

## EXEMPLE DE TEST REMPLI

```js
// tests/outputValidator.test.js
import { LLMOutputValidator } from "../src/validator/LLMOutputValidator.js";

describe("LLMOutputValidator", () => {
  const validator = new LLMOutputValidator();

  test("accepte une sortie valide", () => {
    const raw = {
      bugs: [{ line: 14, description: "Reference error potentiel" }],
      tests: ["test('...', () => {})"],
      confidence: 0.87,
    };
    expect(() => validator.validate(raw)).not.toThrow();
  });

  test("rejette si confidence > 1", () => {
    const raw = { bugs: [], tests: [], confidence: 1.5 };
    expect(() => validator.validate(raw)).toThrow("ValidationError");
  });

  test("rejette si bugs est absent", () => {
    const raw = { tests: [], confidence: 0.8 };
    expect(() => validator.validate(raw)).toThrow("ValidationError");
  });

  test("rejette si un bug a line en string au lieu de number", () => {
    const raw = {
      bugs: [{ line: "14", description: "..." }], // string au lieu de number
      tests: [],
      confidence: 0.7,
    };
    expect(() => validator.validate(raw)).toThrow("StrictValidationError");
  });
});

// tests/edgeCases.test.js
import { edgeCaseInjector } from "../src/edgeCases/edgeCaseInjector.js";
import { LLMOutputValidator } from "../src/validator/LLMOutputValidator.js";

describe("edge cases que l'IA ne voit pas", () => {
  test("NaN dans confidence est rejeté", () => {
    const v = new LLMOutputValidator();
    const withNaN = { bugs: [], tests: [], confidence: NaN };
    expect(() => v.validate(withNaN)).toThrow();
  });

  test("0.1 + 0.2 dans un score de confidence ne passe pas 0.3", () => {
    // C'est un test de documentation : 0.1 + 0.2 = 0.30000000000000004 en JS
    expect(0.1 + 0.2).not.toBe(0.3);
    // Le validator arrondit les floats pour les comparaisons de seuil
    const v = new LLMOutputValidator({ confidenceThreshold: 0.3 });
    const almostThree = { bugs: [], tests: [], confidence: 0.1 + 0.2 };
    expect(() => v.validate(almostThree)).not.toThrow(); // 0.3000... > 0.3 : passe
  });
});
```

## CAS LIMITES À TESTER OBLIGATOIREMENT

1. **JSON tronqué à mi-chemin** : l'API coupe la réponse avant la fin (timeout réseau). Le `streamAssembler.finalize()` doit lancer une erreur claire, pas retourner du JSON invalide silencieusement.
2. **Réponse vide de l'API** : l'API retourne une chaîne vide. Pas une erreur HTTP, juste du vide. Le validator doit rejeter.
3. **`confidence: NaN`** : l'IA retourne un nombre invalide. `typeof NaN === 'number'` en JS, donc le check de type ne suffit pas. Il faut `Number.isNaN()`.
4. **Bug suggéré avec une ligne négative** : `{ line: -1, description: "..." }`. Une ligne de code n'est jamais négative. Le validator rejette.
5. **Timeout API à 3 secondes** : si l'API ne répond pas en 3 secondes, abort la requête et throw `APITimeoutError`. Le pipeline ne reste pas bloqué.

## LES RÈGLES QUE TU NE DOIS JAMAIS CASSER

1. **La sortie de l'IA n'est jamais utilisée directement sans passer par le validator.** Même si le JSON semble correct à l'oeil, il passe par `LLMOutputValidator.validate()`.
2. **Chaque appel API a un timeout explicite.** Pas de requête qui peut rester en attente indéfiniment.
3. **`streamingClient` est mocké dans tous les tests.** Zéro appel API dans `npm test`. Jamais. Sinon les tests deviennent lents, coûtent de l'argent, et échouent si la connexion est coupée. Un mock qui retourne des réponses prédéfinies (valide, invalide, tronquée, vide) suffit à tout tester.
4. **Le POSTMORTEM documente au moins un cas où l'IA s'est plantée et comment le pipeline l'a détecté.** Ce fichier est la preuve que le pipeline fait son travail.

## CE QUE TU NE FAIS PAS DANS CE PROJET

- Pas d'interface graphique.
- Pas de TypeScript (ce projet reste JS pour se concentrer sur OOP et edge cases natifs).
- Pas de base de données (les résultats sont sauvegardés en JSON dans `results/`).
- Pas de streaming vidéo/audio.

## LES ADR

```
ADR/001-pourquoi-chaine-heritage-validator-strictvalidator-llmoutputvalidator.md
ADR/002-pourquoi-timeout-3s-sur-tous-les-appels-api.md
ADR/003-pourquoi-review-pipeline-separe-du-validator.md
```

Exemple rempli :

```markdown
# ADR 001 : Chaîne d'héritage Validator -> StrictValidator -> LLMOutputValidator

## Contexte

La validation de la sortie LLM nécessite plusieurs couches : validation de base
(le champ existe), validation stricte (le type est exact), validation métier
(les valeurs ont du sens). On peut tout mettre dans une seule classe ou créer une
hiérarchie.

## Décision

Hiérarchie à 3 niveaux via prototype chain. `Validator` pose le contrat de base.
`StrictValidator` ajoute la rigueur sur les types. `LLMOutputValidator` ajoute
les règles métier spécifiques à l'IA.

## Alternatives considérées

- Une seule grosse classe : rejeté car impossible de tester les couches
  indépendamment. Si la validation stricte plante, on ne sait pas si c'est le
  check de type ou le check métier.
- Composition (passer des validators en paramètre) : valide aussi. Choix de la
  hiérarchie ici pour pratiquer le prototype chain de façon intentionnelle (c'est
  l'objectif pédagogique du module 18_oop_js).

## Conséquences

- Ajouter un nouveau type de validator = créer une sous-classe. Le contrat de base
  est garanti par héritage.
- Les tests peuvent instancier `Validator`, `StrictValidator`, ou `LLMOutputValidator`
  séparément pour isoler ce qui plante.
```

## QUAND EST-CE QUE LE PROJET EST VRAIMENT FINI

```
[ ] une analyse complète d'un fichier JS s'affiche dans la console
[ ] le streaming fonctionne (les tokens s'affichent un par un, pas tout d'un coup)
[ ] le validator rejette les 5 cas limites listés (tests verts)
[ ] le reviewPipeline rejette au moins un type de suggestion dangereuse (eval, innerHTML brut)
[ ] le POSTMORTEM documente un vrai cas où l'IA s'est plantée et le pipeline l'a attrapé
[ ] les mixins loggable et retryable sont utilisés sur au moins une classe
[ ] les 3 ADR sont remplis avec contexte, décision, alternatives, conséquences
[ ] TDD_JOURNAL.md trace quels tests ont été écrits avant le code du validator
[ ] zéro appel à la sortie LLM sans passer par validate() dans le code de production
```

## SÉCURITÉ (gate obligatoire)

Un projet qui marche mais qui est vulnérable n'est pas fini. Traite ces exigences OWASP contextuelles avant de livrer.

- Injection (OWASP A03) : requêtes paramétrées uniquement, jamais de concaténation d'entrée.
- Gestion d'erreurs (OWASP A09) : messages d'erreur génériques, pas de fuite de détails internes.

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
