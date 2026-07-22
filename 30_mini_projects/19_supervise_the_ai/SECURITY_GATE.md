---
stability: intemporel
gate: bloquante
---

# Security Gate : 19_supervise_the_ai

> **Gate bloquante**. Ce mini-projet ne peut etre marque **publie** tant
> que la checklist OWASP Top 10 ci-dessous n'est pas remplie **et signee**.
> **Rejouer avant POSTMORTEM** (correction #2 de la revue).

## Procedure

1. Copie `../_templates/03_SECURITY_GATE_TEMPLATE.md` dans ce dossier
   sous le nom `SECURITY_GATE_FILLED.md`.
2. Renseigne **chaque** item A01 -> A10 avec une **preuve** (ADR, prompt,
   review, test, log). `N/A` n'est autorise qu'avec une phrase de
   motivation.
3. Signe (`nom : date`) en fin de fichier.
4. Ajoute le lien vers `SECURITY_GATE_FILLED.md` dans `README.md`,
   section **Publication**.

## Regle de blocage

- Un item sans preuve **ni** motivation -> gate **echouee**, projet
  **non publiable**.
- La supervision n'exempte pas : si l'IA a genere du code sans qu'un
  ADR couvre la deps utilisee, la gate echoue meme si le code compile.
