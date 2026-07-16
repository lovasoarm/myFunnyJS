---
stability: intemporel
---

# NE PAS OUVRIR (v19 : tout est sous `.internal/`)

Trois zones n'ont aucune valeur pédagogique pour toi :

- `.internal/.tools/verification_pack/` : scripts de vérification (CI, drills)
  qui font tourner les `verify.sh` appelés depuis les exercices.
- `.internal/.audit/` : modèle de référence interne (`DEPENDENCY_LEDGER.md`).
- `.internal/scripts/` : outils de maintenance du repo (lint, release,
  migration grimoire).

Tu peux totalement ignorer `.internal/` en tant qu'apprenant. Le dossier est
préfixé par un point pour rester replié dans la plupart des explorateurs de
fichiers, respectant la règle **A.127 (anti-bloat racine)**.

Si tu es curieux : ce sont les mécanismes qui garantissent que les exercices
sont réellement passés (`verify.sh` reste binaire : ça passe ou ça passe pas).

Pour apprendre JS/prod : reste dans les modules numérotés `01_` -> `32_` et
`30_mini_projects/`.
