[INTEMPOREL]

# ADR-001 : concurrence par défaut de pMap

Statut : accepté

## Contexte
Un `pMap` sans limite lance tout en parallèle et sature la mémoire. Il faut une valeur par défaut.
## Décision
`concurrency` par défaut = 10. Assez pour saturer un I/O réseau typique sans exploser le heap sur des batchs de 100k items.
## Conséquences
- Positif : comportement prévisible, empreinte mémoire bornée.
- Négatif : sur du CPU-bound pur, 10 n'apporte rien (Node est mono-thread) ; documenté dans le README.
## Alternatives écartées
- `Infinity` : simple mais fait tomber le process sous charge. Écarté.
- `1` (série) : sûr mais lent, inutilisable comme défaut. Écarté.
