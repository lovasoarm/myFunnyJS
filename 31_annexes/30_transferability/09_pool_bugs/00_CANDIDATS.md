---
stability: intemporel
---

# POOL DE BUGS : CANDIDATS CALIBRÉS

Temps de lecture ~2 min


Trois dépôts par langage, sélectionnés pour être :
- ni triviaux (pas un TODO à 3 fichiers),
- ni gigantesques (< 20k lignes de code utile),
- riches en bugs historiques bien documentés (issues fermées, PR de fix).

## Python

1. `httpx` : client HTTP asyncio. Chercher issues label `bug` closed.
2. `sanic` : framework asyncio. Bugs de concurrence documentés.
3. Un projet perso à toi > 6 mois d'existence (le meilleur choix).

## Rust

1. `serde_json` : parsing, edge cases numériques.
2. `tokio` (exemples) : concurrence, cancellation.
3. Un starter Rust que tu casses volontairement (voir `CHAOS_INSTRUCTIONS.md`).

## Règle d'or

Tu ne cherches pas un bug ouvert non résolu. Tu prends un bug **déjà corrigé**, tu
`git checkout` sur le commit d'AVANT le fix, et tu essaies de le retrouver seul.
Puis tu compares ton diagnostic au fix officiel. C'est la seule façon d'avoir un
oracle honnête sur ta perf.
