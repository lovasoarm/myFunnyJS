---
stability: intemporel
---

# ADR-002 : périmètre du portage (ce qu'on porte, ce qu'on laisse)

## Statut
Accepté : 2026-05

## Contexte

Le Rasengan Engine JS contient : moteur de règles, cache, adapter HTTP,
CLI. Tout porter serait plusieurs semaines. Il faut un périmètre qui
prouve le transfert sans être disproportionné.

## Décision

On porte **le noyau de règles + le cache**, on ne porte pas la CLI ni les
adapters HTTP. Le portage est prouvé si les mêmes fixtures d'entrée
produisent les mêmes sorties dans les deux implémentations (test de
parité).

## Alternatives écartées

- **Tout porter** : temps disproportionné, dilue l'apprentissage. Écarté.
- **Porter seulement 3 fonctions** : trop maigre pour prouver un transfert
  d'architecture. Écarté.

## Conséquences

- **Positif** : périmètre tenable en 2-3 jours par un dev seul,
  démonstration architecturale claire.
- **Négatif** : le portage ne couvre pas la couche transport, donc n'expose
  pas les différences net/HTTP JS vs Go. Consigné comme limite.
