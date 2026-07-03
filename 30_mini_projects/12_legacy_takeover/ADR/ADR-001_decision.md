# ADR-001 : reprise vs réécriture

Statut : accepté

## Contexte
Le repo repris a une dette technique visible. Tentation de tout réécrire.
## Décision
On garde l'architecture existante, on corrige le bug ciblé, on ajoute des tests de régression.
## Conséquences
- Positif : livraison rapide, historique préservé, risque faible.
- Négatif : on hérite de la dette ; consignée dans `ONBOARDING.md` pour un refactor futur.
## Alternatives écartées
- Réécriture complète : coûteuse, casse la compatibilité, non demandée. Écartée.
