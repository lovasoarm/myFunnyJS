# LEGACY DUNGEON

Les 9 projets précédents, quelqu'un a pensé à toi en les écrivant. Celui-là, non. Tu clones un vrai dépôt open source, jamais écrit pour t'apprendre quoi que ce soit, et tu dois en sortir vivant : une carte du terrain, un bug corrigé, une décision d'architecture déduite après coup.

C'est ça, ton premier jour dans une équipe. Le code existe déjà. Personne ne te fait la visite guidée.

---

## CE QUE ÇA FAIT

```
$ git clone <repo-choisi-par-toi> dungeon/
$ cd dungeon
$ find . -name "*.js" -o -name "*.ts" | grep -v node_modules | xargs wc -l | tail -1
   47832 total   # tu mesures, tu ne supposes jamais

[CARTOGRAPHIE] 2h chrono, MAP.md produit
  - point d'entrée réel localisé
  - 6 fichiers où vit la vraie logique
  - diagramme ASCII du flux principal
  - liste honnête de ce qui reste flou

[BUGFIX] 1 bug imposé, corrigé
  - test qui échouait avant : ROUGE
  - test qui passe après : VERT
  - cause réelle expliquée, pas juste constatée

[ADR RÉTROSPECTIVE] 1 décision d'architecture du repo, déduite
  - indices : date des commits, contraintes visibles, absence de TS à l'époque
  - "la prendrais-tu pareil en 2026 ?"
```

---

## INSTALLATION

```
Node.js        : v20+
npm            : v10+
Variables env  : aucune
Outils externes: git
```

```bash
# ÉTAPE 0 : choisis ton dépôt (voir cahierdescharges.md pour les 4 critères et les 3 candidats)
git clone <url-du-repo-choisi> dungeon/
cd dungeon

# mesure ce que tu viens de cloner, ne fais confiance à personne, même pas à GitHub
find . -name "*.js" -o -name "*.ts" | grep -v node_modules | xargs wc -l | tail -1

# pas de npm install obligatoire : ce projet c'est lire, pas exécuter
```

---

## STRUCTURE DE CE QUE TU PRODUIS

```
10_legacy_dungeon/
├── cahierdescharges.md      # spec complète, les 3 étapes, les 4 critères de choix
├── README.md                 # ce fichier
├── TDD_JOURNAL.md             # journal d'investigation : l'ordre réel de ta lecture
├── POSTMORTEM.md              # ce qui t'a perdu, ce que t'as fini par piger
├── ADR/
│   └── ADR-001_pourquoi_ce_code_est_ce_quil_est.md   # template à remplir, décision déduite
├── MAP.md                     # à créer toi-même : la carte du repo (ÉTAPE 1)
└── BUGFIX.md                  # à créer toi-même : la preuve avant/après (ÉTAPE 2)

dungeon/                       # le repo OSS que tu clones, à côté, pas dans ce dossier
```

Pas de `src/`, pas de `tests/` ici comme dans les autres mini-projets. Le "src" de ce projet, c'est le dépôt externe que tu choisis et clones à côté.

---

## MODULE CRAZYDEVS COUVERT

| Module | Où ça se voit |
|---|---|
| `27_team_craft` | navigation de codebase (`04_navigate_codebase.md`) appliquée pour de vrai, ADR rétrospective, technical writing dans MAP.md/POSTMORTEM.md |

Mobilisés en lecture, sans être le coeur du projet : `05_debugging` (stack traces inconnues), `04_error_handling` (comprendre une stratégie qu'on n'a pas choisie), `13_refactoring/03_code_smells` (reconnaître sans corriger), `06_testing` (lire des tests existants comme documentation).

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. L'ÉTAPE 1 (cartographie) est chronométrée à 2h. Dépasser casse l'objectif :
   sentir la pression d'un vrai premier jour, pas explorer en confort
2. Un seul bug corrigé, avec preuve avant/après. Trois bugs bâclés < un bug propre
3. Aucune ligne du repo cloné touchée en dehors du strict nécessaire au bugfix :
   pas de refactoring "pendant que t'y es"
4. L'ADR reconstruit le pourquoi de quelqu'un d'autre, pas tes préférences :
   "j'aurais fait autrement" sans contexte déduit = exercice raté
5. Le POSTMORTEM documente au moins un vrai moment de confusion : zéro moment
   perdu = repo trop simple ou honnêteté insuffisante
```

---

## DOCUMENTS DU PROJET

```
cahierdescharges.md   --> spécification complète, les 4 critères de choix du repo, les 3 étapes
TDD_JOURNAL.md         --> ordre réel de l'investigation, pas du TDD classique : adapté à l'exploration
POSTMORTEM.md          --> ce qui a coincé, ce qui a été appris
ADR/                   --> décision d'architecture du repo, déduite après coup
```
