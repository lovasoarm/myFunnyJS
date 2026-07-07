---
stability: intemporel
---

# ADR-001 : approche TDD-first sur codebase existante avant tout refactoring
Temps de lecture ~6 min

## Statut
Accepté : 2026-01

## Contexte
Le Walking Dead Protocol hérite d'un codebase existant : le système de gestion de camp de Rick Grimes, écrit en pleine apocalypse zombie, sans tests, avec des responsabilités mélangées. Le code fonctionne : à peu près. Mais personne ne peut certifier ce qu'il fait vraiment, et toute modification risque de casser quelque chose d'invisible.

Deux stratégies s'affrontent pour aborder ce projet : réécrire d'abord (v2 propre from scratch, puis migrer les données), ou couvrir d'abord (tests sur la v1, puis refactoring progressif avec filet de sécurité).

Le choix de stratégie conditionne tout le reste : l'ordre des fichiers à créer, la façon dont on valide le refactoring, et la confiance qu'on peut avoir dans le résultat final.

## Décision
On applique une approche TDD-first (Test-Driven Development : développement piloté par les tests) sur la codebase existante. Aucune nouvelle feature avant que la suite de tests couvre le comportement actuel. Aucune modification de code avant qu'un test rouge documente ce qu'on veut changer. Le refactoring SOLID intervient après, protégé par les tests existants.

```
Ordre d'attaque :
1. Lire le code existant --> comprendre ce qu'il fait (pas ce qu'il devrait faire)
2. Écrire les tests    --> capturer le comportement réel (même les bugs connus)
3. Vérifier que les tests passent sur la v1
4. Refactorer       --> SOLID, SRP, DIP : un smell à la fois
5. Vérifier que les tests passent toujours
6. Ajouter les nouvelles features en TDD pur : test rouge --> code --> test vert
```

## Alternatives considérées

**Réécriture from scratch (big bang rewrite)**
- Avantages : code propre dès le départ, pas de compromis avec les choix douteux de la v1
- Limites : on perd la connaissance du comportement existant ; le risque de régression (perdre une feature qui marchait) est maximum ; c'est la stratégie qui a tué plus de projets que n'importe quel zombie
- Rejeté parce que : ce projet est précisément l'exercice inverse : apprendre à travailler avec du code existant, le comprendre, le sécuriser, puis le transformer : la compétence la plus utile dans une vraie équipe

**Refactoring direct sans tests préalables**
- Avantages : plus rapide à démarrer, moins de fichiers à créer avant de toucher au code
- Limites : comment savoir si le refactoring a cassé quelque chose si rien ne mesurait le comportement avant ? Le refactoring sans tests, c'est de la chirurgie les yeux bandés
- Rejeté parce que : l'objectif pédagogique est précisément de montrer que les tests sont le filet de sécurité du refactoring, pas un bonus ajouté après

## Conséquences

Gains :
- chaque étape de refactoring est vérifiable : si les tests passent avant et après, le comportement est préservé
- les tests écrits sur la v1 documentent aussi les bugs connus : ils seront corrigés explicitement, pas par accident
- Playwright peut tester le CLI de bout en bout : `node src/cli.js status` doit produire le même output avant et après refactoring

Sacrifices :
- la phase de "lire et comprendre la v1" est inconfortable et longue : il faut résister à l'envie de réécrire avant d'avoir tout couvert
- certains comportements de la v1 sont si entremêlés qu'il est difficile d'écrire un test unitaire propre sans déjà avoir refactoré : dans ces cas, on commence par un test d'intégration large, puis on affine

Décisions liées :
- ADR-002 portera sur la stratégie de mocking pour les simulations d'attaque zombie : Jest mock modules vs dependency injection manuelle
- ADR-003 portera sur l'usage de Worker Threads pour les simulations de menace parallèles : faut-il les paralleliser dès la v1 ou seulement en v2 une fois le code refactoré
