[DÉCENNIE]

> ️ **L'architecture a un seul but : rendre le changement moins coûteux.**

# POURQUOI CE MODULE MÉRITE TON TEMPS : ARCHITECTURE PATTERNS

> Ce module reutilise : SOLID (30_oop_js), refactoring (13_refactoring).


> **L'architecture n'est pas là pour être « belle ». Elle est là pour rendre le CHANGEMENT bon marché. Si ton archi rend le prochain changement coûteux, elle a échoué, peu importe combien elle est élégante.**

Temps de lecture ~8 min

Un projet de 5 fichiers tient debout peu importe comment tu l'organises. Un projet de 500 fichiers s'effondre à la première feature mal placée si l'architecture n'a pas été pensée. La différence entre les deux n'est pas la quantité de code : c'est la structure qui détermine si ajouter une feature coûte 1 jour ou 3 semaines.

L'architecture, c'est la décision qui se prend une fois, mais qui détermine le coût de toutes les décisions suivantes.

---

## PRÉREQUIS

Ce module suppose que tu maîtrises :
- design patterns créationnels et structuraux : voir `12_design_patterns/`
- principes SOLID (SRP, OCP, DIP) : voir `13_refactoring/02_solid_principles.md`
- comment Node charge un module : voir `15_runtime_env/01_node_vs_browser.md` et `15_runtime_env/03_commonjs_vs_esm.md`

Si ces bases ne sont pas là : reviens ici après.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Sans architecture pensée, un projet qui grandit devient un plat de spaghetti : chaque fichier dépend de chaque autre fichier, une modification dans un coin du code casse une fonctionnalité dans un coin complètement différent, et personne ne comprend plus pourquoi ces deux parties sont liées.

Les patterns d'architecture (Module Pattern, MVC, Clean Architecture, Event-Driven, Microservices) résolvent ce problème en imposant une séparation claire des responsabilités. Le domaine métier (la vraie logique de ton business) ne dépend pas de l'infrastructure (la base de données, le framework web utilisé). Ça veut dire que tu peux changer de base de données ou de framework sans réécrire ta logique métier, parce qu'elle n'a jamais dépendu de ces détails techniques.

Ce module te donne les structures pour répondre à la question : "comment j'organise ce système pour qu'ajouter une feature dans 6 mois ne nécessite pas de tout réécrire ?"

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev sans vision d'architecture mélange tout dans les mêmes fichiers : la logique métier, l'accès à la base de données, la gestion des requêtes HTTP, tout entremêlé. Résultat : tester la logique métier devient impossible sans monter une vraie base de données, parce que rien n'a été découplé.

L'équipe souffre quand le projet grandit : sans découpage clair, deux devs qui travaillent sur deux features différentes se marchent dessus en permanence, parce que tout le code touche aux mêmes fichiers géants sans frontières claires entre les responsabilités.

Et le pire scénario : un projet qui a choisi les microservices trop tôt, sans en comprendre le vrai coût (complexité opérationnelle, latence réseau entre services, debugging distribué), se retrouve avec toute la complexité d'un système distribué sans en avoir réellement besoin, parce que l'architecture a été choisie par mode plutôt que par besoin réel.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
logique métier mélangée à l'accès base de données      --> clean architecture --> séparation domaine/infra
état de l'app difficile à suivre dans une UI complexe   --> MVC                --> séparation modèle/vue/contrôleur
système qui doit réagir à des événements externes       --> event-driven       --> découplage producteur/réaction
projet qui grossit et devient difficile à découper      --> microservices      --> services indépendants déployables
code global qui fuit partout sans encapsulation         --> module pattern     --> frontières claires et explicites
```

L'architecture n'est jamais visible pour l'shinobi final : il ne voit jamais "ah, ce système utilise du Clean Architecture". Mais il ressent directement les conséquences : un système bien architecturé évolue vite et reste stable, un système mal architecturé devient lent à faire évoluer et de plus en plus fragile.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Les principes structurels (séparation des responsabilités, découplage, dépendance vers l'intérieur du domaine) sont intemporels. Ce qui évolue, c'est la popularité relative de certains patterns selon les contraintes du moment : les microservices ont eu un pic d'adoption massif, suivi d'un retour de balancier où beaucoup d'équipes reviennent vers des architectures plus simples (monolithes bien structurés) pour des projets qui n'ont pas l'échelle qui justifie la complexité distribuée.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, MVC dominait largement comme pattern par défaut pour structurer une app, qu'elle soit backend ou frontend. Avec la montée des apps front-end complexes et des architectures event-driven (événementielles), des patterns alternatifs comme le state management réactif et l'architecture orientée événements ont pris une place importante, surtout pour des UI avec beaucoup d'interactions en temps réel.

La tendance microservices, elle, a suivi un cycle complet : adoption massive portée par les géants de la tech, puis prise de conscience que sa complexité opérationnelle n'est justifiée que pour des équipes et des échelles spécifiques. Aujourd'hui, la décision se prend au cas par cas, en pesant vraiment le coût contre le bénéfice, plutôt que par réflexe de mode.

---

## 6) NOYAU DUR DU MÉTIER ?

Oui, explicitement : "15 + 20, Architecture + API Craft : sans ça, t'es junior à vie". Le module a un prérequis combiné fort : `12_design_patterns` + `13_refactoring`. Tu ne peux pas construire une architecture solide sans déjà savoir reconnaître les patterns de structure et sans savoir nettoyer du code qui dérive.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Les frameworks et les modes architecturales vont continuer à osciller (monolithe, microservices, et probablement un nouveau terme dans 5 ans pour décrire un compromis entre les deux). Mais le principe sous-jacent : séparer ce qui change souvent de ce qui change rarement, découpler le métier de l'infrastructure, rester capable de raisonner sur le système comme un tout cohérent, ce principe ne disparaîtra jamais, peu importe le nom qu'on lui donnera demain.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

L'architecture est la décision qui détermine le coût de toutes les décisions suivantes, et un mauvais choix se paie cher à l'échelle. Ça casse de trois façons sans cette compréhension : code entremêlé impossible à tester, équipe qui se marche dessus, complexité distribuée choisie sans besoin réel. Les modes vont et viennent, mais les principes structurels restent.

Maintenant, ouvre `01_module_pattern.md`. Et commence à voir ton code comme un système, pas comme un tas de fichiers.

> ENCADRÉ : NIVEAU : Ici, l'organisation au niveau d'un système entier (MVC, clean architecture, microservices).

> Distinction à ne jamais confondre : design patterns = échelle classe ; refactoring = transformer du code existant (SOLID) ; architecture = échelle système entier.

> Ce module réutilise : la composition du module 12 (`30_oop_js`), le refactoring du module 14 (`13_refactoring`).

## AILLEURS QUE JS

En Python (Django), le MVC devient MVT ; les couches et le découpage par domaine sont identiques. En Java (Spring), l'injection de dépendances est industrialisée. En Go, on préfère des packages découplés à des hiérarchies profondes. Les patterns d'architecture (couplage faible, cohésion forte, frontières de contexte) sont indépendants du langage : c'est de l'organisation, pas de la syntaxe.
