---
stability: intemporel
---

# generate_portfolio_report.md
Temps de lecture ~5 min

> Script mental (ou vrai script) qui compile ADR + POSTMORTEM + DEPENDENCY_LEDGER en **un PDF partageable**.

## Ce que le rapport contient

1. **Page de garde** : nom, dates, 3 phrases sur toi.
2. **Sommaire** : projets traités.
3. Pour chaque projet :
  - Problème résolu (1 §)
  - Décisions clés (extraits d'ADR)
  - Ce qui a cassé (extraits de POSTMORTEM)
  - Dépendances externes (extraits du Ledger)
4. **Bilan** : compétences transférables (renvoie à `transferability/`).

## Version manuelle

Ouvre chaque source, copie/colle dans un doc Markdown, exporte en PDF.

## Version scriptée (bonus)

```bash
# script.sh : squelette
cat README.md ADR/*.md POSTMORTEM.md ../DEPENDENCY_LEDGER.md > /tmp/report.md
pandoc /tmp/report.md -o portfolio.pdf
```

## Livrable

`portfolio.pdf` ≤ 12 pages. Lisible sans contexte.
