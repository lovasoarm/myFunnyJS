[INTEMPOREL]

# PORTFOLIO CI : badge signé pour ton dépôt d'apprenant

## Ce que ça fait

`verify_portfolio.sh` audite ton dépôt et sort un score sur 100 + badge
`passing/failing` en JSON. Le workflow GitHub Actions (`.github/workflows/portfolio_audit.yml`)
l'exécute à chaque push et te bloque à < 80/100.

## Utilisation

```bash
./scripts/portfolio_ci/verify_portfolio.sh /chemin/vers/ton-repo
```

## Les 10 critères audités

1. README.md racine
2. DEPENDENCY_LEDGER.md
3. CHANGELOG.md
4. Au moins 3 dossiers ADR
5. Au moins 3 POSTMORTEM.md
6. Au moins 5 TDD_JOURNAL
7. Au moins 3 fichiers de transferts cross-language
8. Au moins 1 LEAK_REPORT
9. Au moins 5 verify.sh de verification_pack utilisés
10. Distributed arena livrée + drill IA journalisés + rapport cross-lang final

## Pourquoi 80/100 et pas 100/100

Un portfolio parfait n'existe pas. 80/100 prouve la couverture des livrables clefs
sans exiger la perfection sur chaque case. Un CTO exigeant reconnaît le signal.

## Étendre pour ton projet

Ajoute tes propres `check "..." "..."`  dans `verify_portfolio.sh`. Chaque check =
+ 1 point sur le total. La structure JSON reste stable pour les consommateurs.

## Badge Markdown à coller dans ton README

```
[![Portfolio Audit](https://github.com/<user>/<repo>/actions/workflows/portfolio_audit.yml/badge.svg)](https://github.com/<user>/<repo>/actions/workflows/portfolio_audit.yml)
```
