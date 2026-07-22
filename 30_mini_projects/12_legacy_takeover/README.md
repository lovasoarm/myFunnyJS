---
stability: intemporel
---

[PORTFOLIO]

[ATELIER]

# Mini-projet 12 : Legacy Takeover

-> ~5 min

> **INTEMPOREL** : reprendre un projet abandonné est **le jour 1** de la
> majorité des postes. Personne ne code sur du green-field.

> Avant de commencer : `10_legacy_dungeon/README.md` a une section
> "Avant de cloner : deux pièges mentaux à désamorcer" (mépris du code
> existant, panique face au volume). Vaut le détour ici aussi, même
> résumée : tu vas retomber sur les deux mêmes réflexes.

## Mission

Choisis un petit repo Node.js OSS **abandonné** (dernière release > 24 mois),
avec ≤ 3 000 LOC et au moins 2 issues ouvertes. Suggestions de critères :

- `package.json` valide,
- au moins un README,
- test suite existante mais qui ne passe plus.

Exemples de terrains (à vérifier au moment où tu lis) : petits loggers CLI,
wrappers d'API météo, générateurs de mocks. Ne prends pas un framework.

## Protocole (5 étapes)

### 1. Fork + install

Clone, `nvm use`, `npm install`. Note **tout** ce qui casse dans
`ONBOARDING.md` : deps deprecated, warnings, node version mismatch.

### 2. Reproduis un bug documenté

Choisis une issue ouverte "bug" (pas "feature request"). **Avant** de coder,
écris dans `REPRO.md` :

- l'input exact,
- la sortie attendue,
- la sortie obtenue,
- ta première hypothèse.

Interdit de patcher tant que le bug n'est pas reproduit **localement** de
façon fiable (cf. `04_debugging/04_repro_before_fix.md`).

### 3. ADR de refonte partielle

Dans `ADR/ADR-003_scope_refonte.md` : quels modules tu refactores, lesquels
tu laisses tels quels, pourquoi (coût vs risque). Utilise le template
`27_team_craft/02_adr_writing.md`.

### 4. CI minimale

Ajoute `.github/workflows/ci.yml` :

```yaml
name: ci
on: [push, pull_request]
jobs:
 test:
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v4
 - uses: actions/setup-node@v4
 with: { node-version-file: ".nvmrc" }
 - run: npm ci
 - run: npm test
 - run: npm run lint --if-present
```

### 5. Write-up avant PR

`WRITE_UP.md` : tu expliques ce que fait le code fautif **avant** de proposer
un correctif. Règle stricte : _interdiction de modifier une ligne avant
d'avoir décrit son comportement actuel_.

## BENCH & DÉCISIONS (obligatoire)

Une décision de refonte doit être appuyée par un chiffre (ex : "les 3
fonctions du module `parser.js` totalisent 68% du temps CPU sur un input
type : mesure `--prof`").

## Livrable

- `ONBOARDING.md`, `REPRO.md`, `ADR/ADR-003_scope_refonte.md`,
 `WRITE_UP.md`, `BENCH.md`,
- PR ouverte sur ton fork,
- CI verte.

## Ce que l'analogie "just refactor it" cache

Refactorer sans tests = casser en silence. Le prérequis absolu : couvrir la
zone à toucher **avant** de la toucher (voir `06_testing/09_test_strategy_not_framework.md`).

## Pitch 3 lignes

Ce projet démontre une compétence clé : lire du code inconnu, débugger sous pression, livrer un produit (ADR + tests) qu'un autre dev peut reprendre. Utilisable en portfolio et en entretien.

## Empreinte carbone (critère d'acceptation)

Estime l'empreinte carbone approximative de ton déploiement ou de ton algo. Justifie **un** choix d'optimisation (moins d'invocations, cache, batch, région serveur). Voir `31_annexes/03_finops_greenops.md`.

## THÈME NEUTRE (optionnel)

Si les références Naruto/DBZ ne te parlent pas, remplace mentalement par un domaine que tu connais (foot, cuisine, musique). Le concept technique reste identique.
