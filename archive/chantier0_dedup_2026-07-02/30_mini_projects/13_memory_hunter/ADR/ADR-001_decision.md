[INTEMPOREL]

# ADR-001 : politique d'éviction du cache

Statut : accepté

## Contexte
Le cache Map du serveur n'a aucune éviction : il grossit à l'infini.
## Décision
LRU (Least Recently Used) avec taille max de 1000 entrées.
## Conséquences
- Positif : mémoire bornée, entrées chaudes conservées.
- Négatif : coût O(1) amorti mais logique plus complexe qu'une Map nue.
## Alternatives écartées
- TTL seul : ne borne pas la taille sous forte charge. Écarté.
- FIFO : simple mais évince des entrées chaudes. Écarté.
