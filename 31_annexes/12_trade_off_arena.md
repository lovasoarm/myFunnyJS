---
stability: intemporel
---

# TRADE-OFF ARENA : 3 SCÉNARIOS, 0 BONNE RÉPONSE
Temps de lecture ~30 min

Le vrai boulot de dev, c'est CHOISIR, pas coder. Ces 3 scénarios ont plusieurs solutions valides. Tu dois choisir ET argumenter. Un pair te challenge.

---

## SCÉNARIO 1 : LA LATENCE CONTRE LE COÛT

Ton API sert 500 req/s. La feature "recommandations" ajoute 200 ms par requête. Solutions candidates :
- Précalculer les recos toutes les nuits (rapide, mais stale).
- Cache Redis avec TTL 5 min.
- Recalcul temps réel avec upgrade CPU (facture x2).

**Livrable** : 1 page. Ton choix, 3 métriques que tu surveilles, 1 scénario où ton choix est faux.

---

## SCÉNARIO 2 : LA DETTE CONTRE LA DEADLINE

Feature critique à livrer dans 5 jours. La refacto propre prend 8 jours. Solutions :
- Livrer moche, ticket de refacto (jamais fait).
- Retarder de 3 jours.
- Livrer une version diminuée qui évite la zone crade.

**Livrable** : 1 page. Ton choix + comment tu le pitches au PM.

---

## SCÉNARIO 3 : LE MONOLITHE CONTRE LES MICROSERVICES

Startup 4 devs, 20k utilisateurs, produit qui pivote tous les 2 mois. On te propose de "casser en microservices tout de suite".

**Livrable** : 1 page. Ton verdict argumenté. Bonus : à partir de quel signal tu changerais d'avis ?

---

## RÈGLE D'OR

Ta réponse est jugée sur l'ARGUMENT, pas sur le choix. Deux réponses opposées peuvent être 10/10.
