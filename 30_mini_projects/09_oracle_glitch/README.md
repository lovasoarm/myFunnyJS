---
stability: intemporel
---

[PORTFOLIO]

[ATELIER]

# ORACLE GLITCH

-> ~6 min

L'IA se prend pour un génie. Elle analyse ton code JS, détecte des bugs, propose des fixes, génère des tests. Parfois elle a raison. Parfois elle invente des fonctions qui n'existent pas, retourne du JSON malformé à mi-chemin, ou te jure qu'un `NaN === NaN` est `true`. Ton boulot : construire le pipeline qui la surveille.

C'est ça, coder avec l'IA en 2026. Pas la croire. La contrôler.

---

## CE QUE ÇA FAIT

```
$ node src/cli.js analyze src/cible.js

[STREAM] token: "Le code" token: " présente" token: " un" token: "..."
[VALIDATE] Parsing JSON de la réponse IA...
[VALIDATE] Structure valide : bugs[], fixes[], tests[]
[VALIDATE] Bug détecté : NaN === NaN marqué comme 'true' dans le fix proposé
[VALIDATE] Fix rejeté, signalement enregistré

Résultat :
 bugs trouvés : 3
 fixes validés : 2
 fixes rejetés : 1 (NaN === NaN incorrect)
 tests générés : 4
```

---

## INSTALLATION

```
Node.js : v20+
npm : v10+
Variables env : ANTHROPIC_API_KEY (obligatoire pour les appels réels)
Outils externes: aucun
```

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
node src/cli.js analyze src/cible.js # analyse réelle
npm test # mocks IA, 0 appel API réel
```

---

## ARCHITECTURE

```
src/
├── cli.js # point d'entrée : parse le fichier cible, lance l'analyse
│
├── classes/
│ ├── CodeAnalyzer.js # analyse statique du fichier JS avant l'envoi à l'IA
│ ├── PromptBuilder.js # construit le prompt à partir du code analysé
│ └── OutputValidator.js # valide la sortie IA via Zod
│
├── validators/
│ ├── Validator.js # classe de base : interface de validation
│ ├── StrictValidator.js # étend Validator : règles plus restrictives
│ └── LLMOutputValidator.js # étend StrictValidator : règles spécifiques aux LLM
│
├── streaming/
│ └── streamingClient.js # appel Anthropic API avec streaming token-par-token
│
├── mixins/
│ └── loggerMixin.js # mixin pour logger les validations sans héritage
│
├── schemas/
│ └── analysisSchema.js # schéma Zod : shape exacte attendue de la sortie IA
│
└── errors/
 ├── LLMTimeoutError.js
 ├── MalformedResponseError.js
 └── ValidationError.js

tests/
├── codeAnalyzer.test.js
├── outputValidator.test.js
├── streamingClient.test.js # mocke l'API Anthropic
└── edgeCases.test.js # NaN, JSON tronqué, timeout, undefined au milieu d'array
```

Flux d'une analyse :

```
cli.js --> CodeAnalyzer.analyze(fichier)
 --> PromptBuilder.build(analysis)
 --> streamingClient.stream(prompt) # tokens arrivant progressivement
 --> assembler les tokens en JSON
 --> si timeout (3s sans nouveau token) : LLMTimeoutError
 --> OutputValidator.validate(jsonBrut)
 --> Zod parse
 --> si malformé : MalformedResponseError
 --> si NaN incorrectement utilisé : ValidationError
 --> si undefined dans un tableau : ValidationError
 --> cli.js affiche le résultat
```

---

## MODULES CRAZYDEVS COUVERTS

| Module | Où ça se voit |
| ------------------ | ------------------------------------------------------------------------------ |
| `23_ai_native_dev` | Streaming Anthropic, validation Zod, prompt engineering |
| `18_oop_js` | `CodeAnalyzer`, `PromptBuilder`, `OutputValidator` : classes, héritage, mixins |
| `27_team_craft` | ADR pour chaque décision d'architecture, code review outillée |
| `28_edge_cases` | `NaN === NaN`, JSON tronqué, `0.1 + 0.2`, `undefined` dans un array |

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. Les tests n'appellent JAMAIS l'API Anthropic réelle (streamingClient est toujours mocké)
2. Zod valide chaque sortie IA avant de l'afficher ou de l'utiliser
3. Timeout de 3s sur le streaming : si l'IA ne répond plus, LLMTimeoutError, pas de freeze
4. LLMOutputValidator hérite de StrictValidator qui hérite de Validator : la chaîne est intentionnelle
5. Chaque décision d'architecture est documentée dans un ADR avant d'être codée
```

---

## DOCUMENTS DU PROJET

```
cahierdescharges.md --> spécification complète, ordre de construction, cas limites
TDD_JOURNAL.md --> trace de l'écriture des tests, dans l'ordre réel
POSTMORTEM.md --> ce qui a coincé, ce qui a été appris
ADR/ --> décisions d'architecture documentées
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
