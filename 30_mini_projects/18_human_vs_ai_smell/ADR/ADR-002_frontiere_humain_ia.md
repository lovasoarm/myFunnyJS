---
stability: intemporel
---

# ADR-002 frontiere humain ia

Temps de lecture ~3 min

## Contexte
Comment tracer la ligne entre 'suspect IA' et 'humain junior mal ecrit' sans faux positif systematique.

## Decision
Grille de 3 questions manuelles apres la detection auto. Si 2/3 humaines : requalifier.

## Alternatives ecartees
- Detection 100 % ML : hors scope du curriculum, on veut un raisonnement lisible.
- Detection 100 % manuelle : ne passe pas a l'echelle.

## Consequences
Un livrable defendable en entretien : "voici comment je detecte du code IA, et voici pourquoi ma methode a des limites".

## Statut
Accepte.
