---
stability: intemporel
---

# PÉRISSABILITÉ : vue consolidée

-> ~5 min

Chaque fichier `.md` du repo porte un tag `stability:` en front-matter. Ce fichier agrège les 795 tags en une carte de risque unique, pour que tu (ou un mainteneur en 2028) sache **où le contenu vieillit vite** sans ouvrir 790 fichiers.

## SYNTHÈSE

- **intemporel** : 638 fichiers (concepts qui ne bougent pas : event loop, big-O, closures, SOLID)
- **stable** : 106 fichiers (API/pratiques stables sur 5+ ans : Node LTS, HTTP, SQL)
- **périssable** : 51 fichiers (tooling, IA, écosystème en mouvement rapide)

## MODULES À RISQUE (contenu périssable)

| Module                      | # fichiers périssables | Cause principale                     |
| --------------------------- | ---------------------- | ------------------------------------ |
| `14_typescript`             | 18                     | évolutions TS, strictness options    |
| `23_ai_native_dev`          | 13                     | outils IA, prompts, modèles          |
| `29_ai_agents_and_autonomy` | 11                     | agents IA, frameworks                |
| `32_tools`                  | 7                      | chaîne d'outils dev (bundlers, LSPs) |
| `26_observability`          | 1                      | outillage OTLP en mouvement          |
| `31_annexes`                | 1                      | écosystème mouvant                   |

## MODULES 100% INTEMPORELS (aucune ligne périssable détectée)

- `00_getting_started`
- `00_referentiel`
- `01_fundamentals`
- `02_problem_solving`
- `03_async`
- `04_debugging`
- `05_error_handling`
- `06_testing`
- `07_math_basics`
- `08_memory_performance`
- `09_data_structures`
- `10_algorithms`
- `11_functional_js`
- `12_design_patterns`
- `13_refactoring`
- `15_runtime_env`
- `16_architecture_patterns`
- `17_web_concepts`
- `18_oop_js`
- `19_web_inclusive`
- `20_realtime`
- `21_api_craft`
- `22_security`
- `24_databases`
- `25_scalability`
- `27_team_craft`
- `28_edge_cases`
- `30_mini_projects`

## DERNIER CHECK

Cette vue est générée depuis les tags `stability:` déjà présents dans chaque fichier. Pour la régénérer : `grep -rl '^stability: X' --include='*.md' .` par valeur, en excluant `node solution.js` (critere binaire ecrit par toi) (scripts internes, hors périmètre pédagogique). Aucune campagne de re-tagging nécessaire, seule une régénération de comptage.

## COMMENT L'UTILISER

- Avant de lancer une refonte, ouvre ce fichier : commence par les modules du tableau ci-dessus.
- Un fichier `perissable` de plus de 24 mois sans revue = candidat urgent à relecture.
- Un fichier `intemporel` n'a besoin d'être touché que si le mécanisme sous-jacent change (rare).
- Seules trois valeurs de tag sont valides : `intemporel`, `stable`, `perissable`. Toute autre valeur (variante, typo) casse ce comptage silencieusement : vérifie avec `grep -rh "^stability:" --include="*.md" . | sort -u` que seules ces trois valeurs apparaissent avant de faire confiance à ce fichier.
