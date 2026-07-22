---
stability: intemporel
---

# EXERCICE DE TRANSFERT : mode d'emploi

Temps de lecture ~2 min


À la fin de chaque module NOYAU (01, 03, 08, 09, 13, 17), tu ne passes pas au module
suivant tant que tu n'as pas fait un exercice de transfert de 30 min. Le principe est
toujours le même :

```
1. Prends UN concept clé du module que tu viens de finir.
2. Réimplémente-le (ou explique-le en pseudocode exécutable) dans un langage
  non-JS de ton choix : Python, Rust, Go, Java, C, pseudo-langage.
3. Écris 5 lignes : ce qui a été plus facile, plus dur, plus clair, plus obscur,
  et le concept invariant que tu as vu émerger.
4. Range ce document dans le sous-dossier `transferts/` de ton portfolio.
```

## Table des exercices imposés

| Après module     | Concept à transférer            | Cible suggérée   |
|-----------------------|---------------------------------------------|---------------------|
| 01_fundamentals    | Closure + scope lexical           | Python ou Rust   |
| 03_async       | Event loop / microtask           | Pseudo-Rust ou Go  |
| 08_memory_performance | Cycle de vie objet + retainer        | Java (GC roots)   |
| 09_data_structures  | Hash map avec collision           | C ou Zig      |
| 13_design_patterns  | Observer OU Strategy            | Go (interfaces)   |
| 17_architecture    | Injection de dépendance minimale      | Python (protocols) |

## Règle non négociable

Tu n'as pas droit à Copilot ni à ChatGPT pour la réimplémentation elle-même. Tu peux
lire la doc officielle du langage cible, un exemple canonique, un TP. Mais le code
sort de ta tête. Sinon tu ne mesures rien : tu tapes ce que l'IA a compris à ta place.

## Pourquoi c'est obligatoire

Un concept qui ne survit pas au changement de langage n'est pas un concept. C'est
une recette liée à un vocabulaire. En 2026-2031, la valeur d'un ingénieur, c'est
exactement le stock de concepts qui survivent aux migrations. Cet exercice le mesure.

## Validation finale

Après les 6 transferts, tu es prêt pour `final_cross_language_challenge.md` (4h,
Python + Rust + ADR). Sans les 6 transferts en amont, l'épreuve finale est trop dure
et te donnera un faux négatif.
