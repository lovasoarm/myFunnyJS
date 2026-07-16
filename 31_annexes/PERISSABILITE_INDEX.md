---
stability: intemporel
---

# PÉRISSABILITÉ INDEX

-> ~2 min

Index rapide, écrit à la main, complémentaire de `PERISSABILITE.md`. Ici
tu vois **par horizon de péremption** ce qui va vieillir en premier, et
ce qui est protégé long terme. C'est la version « quels dossiers je
révise en priorité si je reviens sur le repo en 2027 / 2028 ».

## Périssable : horizon 2027

Contenu qui devrait tenir jusqu'en 2027 mais qui bougera dans la fenêtre
2026 → 2027 (versions LTS, breaking changes d'outillage) :

- `14_typescript/**` : strictness, flags, patterns évoluent au rythme des releases TS.
- `26_observability/04_metrics_alerting.md` : surface OTLP encore en mouvement.
- `31_annexes/perissabilite_notes.md` : notes de veille, par nature datées.

## Périssable : horizon 2028

Contenu qui a la durée de vie la plus courte du repo. À rouvrir avant
tout autre en 2028 si tu réutilises MyFunnyJS pour te remettre à jour :

- `05_error_handling/05_sentry_in_prod.md`
- `06_testing/08_e2e_playwright_beast.md`
- `32_tools/**`
- `23_ai_native_dev/**`
- `29_ai_agents_and_autonomy/**`

## Intemporel (protégé)

Fondations. Elles ne bougent pas : si tu les as, tu les as pour de bon :

- `01_fundamentals/**`, `03_async/**`, `07_math_basics/**`, `08_memory_performance/**`
- `09_data_structures/**`, `10_algorithms/**`, `11_functional_js/**`
- `12_design_patterns/**`, `18_oop_js/**`, `28_edge_cases/**`

## Comment mettre à jour cet index

À la main. Quand un fichier change de tag `stability:` dans son
front-matter, tu ajoutes / retires la ligne correspondante ici. Aucun
script ne le fait pour toi : c'est voulu : l'index doit refléter un
choix éditorial, pas un `grep` sur le disque.
