---
stability: intemporel
---

# ADR-004 strategie tests

Temps de lecture ~3 min

## Contexte
Tests unitaires sur chaque detecteur individuel. Un test d'integration sur le pipeline complet. Un test adversarial : essayer de tromper le detecteur.

## Decision
Coverage detecteurs >= 90 %. Test adversarial documente meme s'il fait chuter la precision.

## Alternatives ecartees
- Detection 100 % ML : hors scope du curriculum, on veut un raisonnement lisible.
- Detection 100 % manuelle : ne passe pas a l'echelle.

## Consequences
Un livrable defendable en entretien : "voici comment je detecte du code IA, et voici pourquoi ma methode a des limites".

## Statut
Accepte.
