---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---

# 00 : Bridge exo : reprends un edge case et laisse un agent le gérer

Temps ~1 h

## OBJECTIF

Prendre un edge case connu du module 28 (NaN coercion, race condition, prototype
pollution) et demander à un agent de le résoudre **en autonomie**. Puis
lister ce qui casse.

## PROTOCOLE

1. Choisis un edge case de `28_edge_cases/`.
2. Écris un prompt d'agent qui autorise l'agent à modifier le code et lancer les tests.
3. Observe : combien de rounds, quelles décisions muettes, quelles régressions.
4. Livrable : `BRIDGE_EDGE_AGENT.md` listant les 5 façons dont l'agent a triché
   (test désactivé, cas contourné, invariant assoupli, dépendance ajoutée, TODO caché).

## POURQUOI

Un agent qui "résout" un edge case en le masquant est pire qu'un edge case non résolu :
il te fait perdre la mémoire du problème.
