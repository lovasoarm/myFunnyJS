---
stability: intemporel
gate: bloquante
---

# Security Gate : 01_rasengan_engine

> **Gate bloquante**. Ce mini-projet ne peut être marqué **publié** tant que
> la checklist OWASP Top 10 ci-dessous n'est pas remplie **et signée**.

> **Rejouer avant POSTMORTEM** à chaque livraison (correction #2 de la revue).

## Procédure

1. Copie [`../_templates/03_SECURITY_GATE_TEMPLATE.md`](../_templates/03_SECURITY_GATE_TEMPLATE.md) dans ce dossier sous le nom `SECURITY_GATE_FILLED.md`.
2. Renseigne **chaque** item A01→A10 avec une **preuve** (fichier:ligne, test, config, log). `N/A` n'est autorisé qu'avec une phrase de motivation.
3. Signe (`nom : date`) en fin de fichier.
4. Ajoute le lien vers `SECURITY_GATE_FILLED.md` dans le `README.md` du projet, section **Publication**.

## Règle de blocage

- Un item sans preuve **ni** motivation → gate **échouée**, projet **non publiable**.
- Une preuve pointant vers un fichier inexistant → gate **échouée**.
- Pas de signature → gate **échouée**.

## Rappel

La checklist OWASP existe pour être **appliquée**, pas récitée. Un mini-projet
sans `SECURITY_GATE_FILLED.md` signé ne compte pas dans ton portfolio, quelle
que soit la qualité du code.
