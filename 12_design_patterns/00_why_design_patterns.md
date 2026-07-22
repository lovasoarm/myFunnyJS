---
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: GoF depuis 1994, toujours pertinent.
---

> **Frontière avec les modules voisins (12/13/16/18)** : lis d'abord `31_annexes/17_frontieres_modules.md` : table de contrat (échelle, point de départ, livrable, zones grises assumées) pour savoir ce qui appartient à ce module et ce qui appartient au module d'à côté.

> **CE MODULE RÉUTILISE** : FP (11_functional_js), fonctions (01_fundamentals). Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

> **Ce module ressemble à 12/13/16/18 ?** Lis d'abord [`31_annexes/17_frontieres_modules.md`](../31_annexes/17_frontieres_modules.md) : table de contrat qui te dit quel module ouvrir selon ta question réelle. Évite 30 min de tournage en rond.

# POURQUOI CE MODULE MÉRITE TON TEMPS : DESIGN PATTERNS

> ## CE MODULE VS LES DEUX AUTRES
>
> - **Ce module apporte** : vocabulaire partage pour reconnaitre des solutions eprouvees a des problemes de conception recurrents (Observer, Strategy, Factory).
> - **Vs 13_refactoring** : refactoring change du code existant qui sent mauvais. Les patterns donnent la cible vers laquelle refactorer.
> - **Vs 16_architecture_patterns** : les patterns vivent a l'echelle d'une classe ou d'un module. L'architecture vit a l'echelle du systeme entier.
> - **Non recouvrant** : ici on apprend a nommer une intention de conception, pas a la deployer ni a la reparer.

---


> **Durée de vie : 5+ ans.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.
> Temps de lecture ~7 min

Tu as déjà résolu le même problème d'architecture deux fois, en deux façons complètement différentes, dans deux projets différents. Et probablement, aucune des deux n'était la meilleure solution : c'était juste la première idée qui t'est venue. Les design patterns existent pour arrêter ça.

Un pattern n'est pas une règle imposée d'en haut. C'est une solution déjà testée, déjà éprouvée, pour un problème de structure que des milliers de devs avant toi ont déjà rencontré.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Sans vocabulaire de design patterns, chaque problème de structure se résout au cas par cas, souvent mal. Tu as besoin qu'un événement déclenche plusieurs réactions ? Tu codes un système ad hoc avec des callbacks éparpillés, alors que le pattern Observer existe précisément pour ce cas, avec une structure claire et testée. Tu as besoin de changer d'algorithme à la volée selon le contexte ? Tu codes une cascade de `if/else`, alors que le pattern Strategy permet d'interchanger des comportements sans toucher au code appelant.

Les design patterns te donnent un vocabulaire partagé pour discuter d'architecture sans réinventer la roue à chaque conversation. Dire "on utilise un Factory ici" communique instantanément une structure précise à n'importe quel dev qui connaît le pattern, alors qu'expliquer la même chose sans ce mot prendrait 5 minutes de description.

Ils résolvent aussi un problème plus profond : le couplage (dépendance forte entre deux blocs de code). Un pattern comme Adapter ou Proxy existe spécifiquement pour réduire le couplage entre deux parties du système qui ne devraient pas dépendre l'une de l'autre directement.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui ne connaît pas les patterns réinvente des solutions à chaque problème, souvent moins bonnes que des solutions éprouvées depuis des décennies. Il crée un Singleton sans le savoir, avec tous ses pièges (état global caché, difficile à tester), parce qu'il pensait juste "avoir une seule instance partagée" sans comprendre les risques que ça implique.

Dans `02_garo_no_kronika`, chaque Chevalier d'Or doit réagir aux alertes Horror en temps réel. Sans le pattern Observer, le dispatcher de missions devient un bloc monolithique qui appelle manuellement chaque chevalier à chaque event. Ajouter un nouveau chevalier veut dire toucher au dispatcher. Avec Observer, chaque chevalier s'abonne aux alertes qui le concernent, et le dispatcher ne sait même pas combien de chevaliers existent.

L'équipe souffre en review : sans vocabulaire commun, chaque PR (pull request) devient un débat sur "comment on structure ça", alors qu'un nom de pattern partagé permettrait de trancher en une phrase.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
créer des objets sans exposer la logique de construction  --> Factory  --> instanciation centralisée
garantir une seule instance partagée (config, connexion)  --> Singleton --> accès unique contrôlé
construire un objet complexe étape par étape        --> Builder  --> configuration progressive
ajouter du comportement sans toucher au code source     --> Decorator --> extension sans modification
brancher deux interfaces incompatibles           --> Adapter  --> compatibilité sans réécriture
intercepter les accès à un objet (cache, log, validation) --> Proxy   --> contrôle transparent
un événement déclenche plusieurs réactions         --> Observer --> découplage event/réaction
changer d'algorithme à la volée selon le contexte      --> Strategy --> comportement interchangeable
encapsuler une action pour pouvoir l'annuler/rejouer    --> Command  --> actions réversibles
```

Observer est littéralement le mécanisme derrière les events DOM et la plupart des state managers modernes. Strategy est le pattern derrière chaque système qui permet de "brancher" un comportement différent sans changer le code appelant.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Intemporel. Les design patterns classiques : formalisés par 4 ingénieurs (Gang of Four) dans les années 90 : décrivent des structures de résolution de problèmes qui restent valides peu importe le langage ou l'époque, parce qu'ils répondent à des problèmes structurels universels : comment créer, comment composer, comment faire communiquer des objets sans les coupler trop fort.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Ce qui a changé, c'est la façon d'implémenter ces patterns en JS : avant, on simulait des classes avec des fonctions constructeurs et des prototypes manuels pour appliquer des patterns orientés objet stricts. Avec l'arrivée de la syntaxe `class` et des fonctions comme citoyens de première classe (first-class functions), beaucoup de patterns se sont simplifiés : un Strategy en JS moderne, c'est souvent juste une fonction qu'on passe en argument, pas une hiérarchie de classes complexe comme dans des langages plus rigides.

La tendance actuelle privilégie aussi la composition plutôt que l'héritage pour la plupart des patterns structurels, parce que l'héritage profond crée des couplages fragiles qui rendent le code difficile à faire évoluer.

---

## FRONTIÈRE AVEC LES MODULES VOISINS

Ce module N'EST PAS `13_refactoring` : ici on choisit une structure de code au moment de la concevoir (recette réutilisable pour un problème récurrent). Là-bas, on transforme du code existant qui marche déjà mais qui a mal vieilli.
Exemple : décider d'implémenter un Observer pour découpler UI et logique = design pattern. Extraire une fonction de 200 lignes en 3 fonctions plus courtes sans changer son comportement = refactoring.

Ce module N'EST PAS `16_architecture_patterns` : ici on parle de l'échelle d'une classe ou d'un petit groupe de classes. Là-bas, on parle de l'organisation macro d'un système entier (modules, couches, frontières de contexte).
Exemple : un Factory pour créer les instances d'un objet = design pattern. Décider MVC vs Clean Architecture pour tout le back = architecture pattern.

---

## 6) NOYAU DUR DU MÉTIER ?

Oui, explicitement : "10 + 11, Design Patterns + Refacto : sans ça, t'es un risque pour ton équipe". Ce module dépend directement de `11_functional_js` (beaucoup de patterns s'appuient sur le traitement des fonctions comme valeurs), et il devient à son tour un prérequis de `16_architecture_patterns`.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Les patterns décrivent des problèmes de structure récurrents qui ne disparaissent jamais : il y aura toujours besoin de créer des objets, de découpler des comportements, d'adapter des interfaces incompatibles. Le nom du framework qui implémente ces idées changera, mais le problème structurel sous-jacent restera identique. Un dev qui connaît les patterns reconnaît instantanément la bonne structure à appliquer, peu importe l'outil du moment.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

Les patterns sont des solutions déjà éprouvées à des problèmes de structure que tu vas rencontrer encore et encore. Sans eux : réinvention de solutions médiocres, couplage fort, débats d'architecture sans vocabulaire commun. Avec eux : tu nommes le problème, tu nommes la solution, l'équipe comprend immédiatement.

Maintenant, ouvre `01_factory_pattern.md`. Et commence à reconnaître les patterns que tu as déjà codés sans le savoir.

> ENCADRÉ : NIVEAU : Ici, les recettes de conception au niveau d'une classe ou d'un petit groupe de classes.

> Distinction à ne jamais confondre : design patterns = échelle classe ; refactoring = transformer du code existant (SOLID) ; architecture = échelle système entier.

---

stability: intemporel


## Frontière de ce module

Ce module s'arrête aux **outils tactiques nommés (Strategy, Observer, etc.)**. Si tu vises :
- une transformation locale à comportement identique -> `13_refactoring`
- une décision structurelle multi-module -> `16_architecture_patterns`
- l'usage d'un pattern nommé bien connu -> `12_design_patterns`
- au-delà, réfléchis avant d'y aller.
