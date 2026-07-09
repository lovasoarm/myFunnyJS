---
stability: intemporel
---

# CHANGELOG v14

Corrections issues de `correction_à_faire.txt`. 15 chantiers + 5 angles morts.

## Chantier #1 — ADR uniques
- `30_mini_projects/_templates/ADR_TEMPLATE.md` créé (6 sections dont Signal de révision).
- `RULES.md` créé/actualisé sur les 17 projets avec `## ADR_MINIMUM` (3 / 4 / 6).
- ADR-002 à ADR-006 instanciés dans chaque projet jusqu'à atteindre le plancher.
- `scripts/lint_adr.py` + hook dans `scripts/pack_release.sh`.

## Chantier #2 — Objection storm
- `31_annexes/interview/03_objection_storm.md` (5 salves × 5 objections, chrono).
- `.tools/verification_pack/31_annexes/objection_storm.sh` (scoring, refuse < 20/25).

## Chantier #3 — Spec drift structurel
- `SPEC_DRIFT_TRIGGERS.md` sur les 17 projets (J+1, J+3, J+5).
- Bloc `## SPEC_DRIFT_MODE` dans chaque `RULES.md`.
- Section `## Comment j'ai encaissé le drift` ajoutée aux 17 `POSTMORTEM.md`.
- `.tools/verification_pack/30_mini_projects/spec_drift_check.sh`.

## Chantier #4 — Frontmatter périssabilité
- `scripts/apply_stability.py`, `scripts/lint_stability.py`, `scripts/gen_perissabilite_index.py`.
- `31_annexes/PERISSABILITE_INDEX.md` (squelette + regen).

## Chantier #5 — Grimoires séparateur
- `scripts/migrate_grimoire_separator.py` : / -> | en 4e colonne.
- Migration appliquée sur les 3 fichiers cités.
- `scripts/lint_grimoire.py` : refuse si != 2 analogies par ligne data.

## Chantier #6 — Univers narratifs lintés
- `scripts/lint_universes.sh` : liste noire + report `reports/universes.txt`.
- Convention `<!-- lint-universes: allow -->` pour exceptions.

## Chantier #7 — verification_pack caché
- `verification_pack/` déplacé vers `.tools/verification_pack/`.
- `NE_PAS_OUVRIR.md` à la racine.
- `scripts/pack_release.sh` adapté.

## Chantier #8 — Auth JWT réécrite
- `21_api_craft/04_auth_jwt.md` EXO 1 réécrit en objectif métier.
- `scripts/lint_forbidden_words.py`.

## Chantier #9 — Observabilité concrète
- `26_observability/09_instrumenter_ton_projet.md` (docker-compose local).
- `.tools/verification_pack/26_observability/otel_running.sh`.

## Chantier #10 — Pont 28 -> 29
- `28_edge_cases/99_PONT_28_29.md`.
- `29_ai_agents_and_autonomy/00_bridge_exo.md`.
- `scripts/list_missing_bridges.py`.

## Chantier #11 — Hypercomplétude étendue
- `scripts/lint_hypercomplet.py` (rapport 24/25/23/26/27/29/32).

## Chantier #12 — Frontières modules
- `31_annexes/frontieres_modules.md` : matrice pattern/refacto/archi ajoutée.
- Blocs `## Frontière de ce module` dans 12, 13, 16.
- `12_design_patterns/EXO_FRONTIERE.md`.

## Chantier #13 — Security Gate uniforme
- Bloc `## Security Gate` dans les 17 `RULES.md`.
- `SECURITY.md` initialisé sur les 17 projets.
- STRIDE ajouté pour 05, 12, 16.
- `.tools/verification_pack/30_mini_projects/security_gate.sh`.

## Chantier #14 — Compatibilité versions
- `scripts/lint_syntax_min.py` (stub Node 20).
- `scripts/env_matrix.md`.

## Angles morts
- 15.1 `30_mini_projects/synthese/` déplacé -> `31_annexes/synthese_mini_projects/`.
- 15.2 `.rar`/`.zip` supprimés + ajoutés au `.gitignore`.
- 15.4 EXO 5 compteur partagé ajouté à `06_heisenbug_arena.md`.
- 15.5 Template `TDD_JOURNAL_TEMPLATE.md` + section obligatoire ajoutée aux 17 TDD.
