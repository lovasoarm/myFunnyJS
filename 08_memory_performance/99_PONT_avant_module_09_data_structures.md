---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PONT : de mesurer une ressource à choisir la bonne structure à les structures de données

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `08_memory_performance` et `09_data_structures`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

Tu sais lire un profil mémoire, un flamegraph, une complexité en O(). Reste à choisir la structure qui te donne le bon O() dès le départ. `09_data_structures/` transforme ton intuition perf en décisions de conception.

## CE QUE TU MAÎTRISES DÉJÀ

- Estimer un coût mémoire d'ordre de grandeur.
- Lire une complexité asymptotique.
- Repérer une fuite via une heap snapshot.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **Array vs Linked List** : accès O(1) vs insertion O(1).
- **Map vs Object** : clés arbitraires, ordre d'insertion, perf différente.
- **Set** : unicité gratuite.
- **Tree / Heap / Trie** : structures qui coûtent à construire, rentables à interroger.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Choisir `Array.prototype.includes()` sur 100 000 éléments dans une boucle. Tu viens de transformer un O(n) en O(n²) sans t'en rendre compte. Un `Set` t'aurait rendu O(n).

## EXERCICE-CHARNIÈRE (5 min chrono)

Tu dois vérifier 50 000 IDs contre une whitelist de 20 000. Compare mentalement : `array.includes` vs `set.has`. Nomme la complexité totale de chaque, et le facteur de gain. Réponse : O(n·m) vs O(n+m). Si tu bloques, `08_memory_performance/03_complexity/`.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
