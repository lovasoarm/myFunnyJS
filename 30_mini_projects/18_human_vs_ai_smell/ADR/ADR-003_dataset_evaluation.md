---
stability: intemporel
---

# ADR-003 dataset evaluation

Temps de lecture ~3 min

## Contexte
Choix du corpus d'entrainement mental : 50 extraits (25 humains, 25 IA), stratifie par difficulte.

## Decision
Fichier `fixtures/` avec ground truth. Metriques : precision, rappel, F1 report dans POSTMORTEM.

## Alternatives ecartees
- Detection 100 % ML : hors scope du curriculum, on veut un raisonnement lisible.
- Detection 100 % manuelle : ne passe pas a l'echelle.

## Consequences
Un livrable defendable en entretien : "voici comment je detecte du code IA, et voici pourquoi ma methode a des limites".

## Statut
Accepte.
