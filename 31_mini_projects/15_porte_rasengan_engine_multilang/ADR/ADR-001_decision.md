[INTEMPOREL]

# ADR-001 : choix du langage de portage

Statut : accepté

## Contexte
Porter le Rasengan Engine dans un langage non-JS pour prouver le transfert de compétence.
## Décision
Go, pour son modèle de concurrence explicite (goroutines/channels) qui contraste fort avec l'event loop JS.
## Conséquences
- Positif : apprentissage maximal sur la concurrence, binaire unique.
- Négatif : écosystème de libs plus petit que Python pour certains besoins.
## Alternatives écartées
- Python : plus proche syntaxiquement, donc moins formateur sur la concurrence. Écarté pour ce jet.
