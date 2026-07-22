---
stability: intemporel
---

# Regles de supervision (non negociables)

- Tu ne codes **pas** l'application. Ni un `.js`, ni un `.ts`, ni un
  patch inline "juste pour debloquer".
- Tu peux ecrire : ADR, prompts, reviews, POSTMORTEM, SECURITY_GATE
  rempli, `tests/scenario.sh`. C'est tout.
- Chaque prompt cite l'ADR qui le motive. Sans ADR amont, pas de prompt.
- Chaque review conclut par une decision explicite : `GARDER`,
  `REECRIRE`, `REJETER`. Pas de "plutot ok".
- Un rejet total ne relance **pas** l'IA avec le meme prompt. Tu
  reformules d'abord, tu documentes la reformulation dans `reviews/`.
