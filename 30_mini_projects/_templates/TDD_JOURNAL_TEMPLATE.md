---
stability: intemporel
---

# TDD JOURNAL : {projet}

Temps de lecture ~6 min

Ce journal trace l'ordre RÉEL dans lequel les tests ont été écrits.

## ÉTAPE 1 : le socle

[premier test écrit, avant tout le reste]

## ÉTAPE 2 : le suivant

[...]

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Cette section est **obligatoire**. Force à formuler explicitement le lien entre
le code que tu viens de refactorer et sa nouvelle testabilité. Sans cette section,
le refactoring paraît décoratif. Avec, il devient une preuve.

Format attendu :
- Version pré-refacto : [ce que le code faisait qui rendait le test impossible]
- Ce qui bloquait : [effet de bord non isolable, dépendance dure, temps réel, ...]
- Refacto appliqué : [injection, séparation, pureté, port/adaptateur, ...]
- Test devenu possible : [test précis maintenant écrivable]
