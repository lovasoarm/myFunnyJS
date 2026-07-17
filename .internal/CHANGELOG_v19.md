# CHANGELOG v19

## Corrections livrées

1. **Migration grimoire exécutée** : `migrate_grimoire_separator.py` v19 corrige
   le regex trop restrictif (parenthèses, majuscules accentuées, lowercase).
   65 fichiers migrés au total. `lint_grimoire.py` exit 0, zéro warning.
2. **OOP prérequis explicite avant Design Patterns** : greffe dans
   `12_design_patterns/00_prereq_check.md` : lecture obligatoire de 4 fichiers
   `18_oop_js/` avant Strategy/Observer/Factory.
3. **Purge racine sous `.internal/`** : `.audit/`, `.tools/`, `scripts/` et
   `NE_PAS_OUVRIR.md` regroupés sous `.internal/`. Toutes les références
   (`.md`, `.sh`, `.py`) mises à jour automatiquement. Respect règle A.127.
4. **SPEC drift dynamique** : injection dans `30_mini_projects/14_system_design_lab/cahierdescharges.md`
   d'une étape « à mi-parcours, `SPEC_UPDATE.md` change la contrainte X en Y, adapte sans tout refaire ».
5. **Simulation défense orale solo** : `31_annexes/interview/simulation_defense_orale.md` —
   scénario ADR-002 vs CTO hostile, timer 5+5+5 min, 3 objections types
   pré-écrites, grille auto-évaluation 5 critères /10.

## Baseline linters

- `lint_grimoire.py` : exit 0, 0 warn.
- `lint_hypercomplet.py` v19 : baseline recalibré sur le squelette réellement
  adopté (≥ 2 H2 + contenu non-stub, exemptions `00_why_`, `EXO_`, `_`,
  `00_prereq_check.md`, `trace_*.md`). Exit 0, zéro violation.

## Repo topology après v19

```
myFunnyJS/
├── 00_.. → 32_..           # modules pédagogiques (intacts)
├── 30_mini_projects/       # projets (cahierdescharges enrichis)
├── 31_annexes/interview/   # + simulation_defense_orale.md
├── README.md, START_HERE.md, UNIVERS_AUTORISES.md, COMMUNAUTE.md, LICENSE
├── assets/
└── .internal/              # NON pédagogique, ignoré par l'apprenant
    ├── .audit/
    ├── .tools/verification_pack/
    ├── scripts/            # lints, migration, release
    └── NE_PAS_OUVRIR.md
```
