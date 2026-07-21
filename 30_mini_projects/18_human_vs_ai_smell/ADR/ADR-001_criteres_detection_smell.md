---
stability: intemporel
---

# ADR-001 criteres detection smell

Temps de lecture ~3 min

## Contexte
Definir les 5 signaux qui font qu'un extrait de code sent l'IA (naming trop generique, verbosite defensive inutile, patterns copies hors contexte, imports morts, commentaires paraphrase).

## Decision
5 signaux + une regex ou une check-list par signal. Un code qui coche >= 3 signaux est marque suspect.

## Alternatives ecartees
- Detection 100 % ML : hors scope du curriculum, on veut un raisonnement lisible.
- Detection 100 % manuelle : ne passe pas a l'echelle.

## Consequences
Un livrable defendable en entretien : "voici comment je detecte du code IA, et voici pourquoi ma methode a des limites".

## Statut
Accepte.
