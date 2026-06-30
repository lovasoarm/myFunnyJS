![MyFunnyJS](./assets/title.svg)

---
Ce projet, c'est le chemin complet pour passer de "je connais quelques trucs en JS"
à "je comprends ce que je fais, pourquoi je le fais, et comment ne pas tout péter en prod".
 
On apprend JavaScript. Mais l'objectif est beaucoup plus large.
Les structures de données, les algorithmes, les patterns d'architecture, la sécurité,
la performance, le testing, l'observabilité, le travail en équipe : tout ça tourne dans
n'importe quel langage. JS n'est que le vecteur. Ce qu'on construit ici, c'est une façon
de penser.
 
Le mot d'ordre : **apprendre sérieusement en s'amusant vraiment**. Pas des slides. Pas des
vidéos de 4 heures. Des fichiers `.js` avec des exercices qui ressemblent à des missions,
des combats, des escape rooms. Ton cerveau retient mieux quand il s'amuse. C'est exploité
sans honte.
 
---
 
## CE QUE ÇA CHANGE CONCRÈTEMENT

Tu vas comprendre ce qui se passe sous le capot au lieu de copier-coller en croisant les doigts.
Lire du code inconnu sans paniquer. Tester avant que la prod te le fasse payer. Observer ce qui
se passe en production plutôt que d'attendre qu'un client te le signale.

En 2026, taper du code vite vaut plus rien : l'IA le fait déjà. Ce qui reste rare, c'est
comprendre le problème, choisir le bon pattern, sécuriser ce qu'on construit, et travailler
avec d'autres sans tout casser. L'IA génère. Elle ne réfléchit pas. Ce curriculum sert à ça.
 
---
 
## LES RÈGLES DU JEU
 
**Lis chaque fichier du début à la fin** avant de coder. Les `.md` contiennent la leçon.
Ne les saute pas.
 
**Code toi-même.** Copier-coller une solution depuis l'IA sans la comprendre, c'est
comme regarder quelqu'un faire des pompes à ta place. Ton cerveau ne se renforce pas.
 
**Utilise l'IA comme un copilote**, pas comme un chauffeur. Elle génère, tu valides.
Elle propose, tu décides. Le module `22_ai_native_dev` t'apprend exactement comment faire ça bien.
 
**Finis les mini-projets.** Les modules t'apprennent des concepts. Les mini-projets te
forcent à les assembler pour de vrai. C'est là que tout se concrétise. Ne les saute pas.
 
**Remplis les TDD_JOURNAL et les POSTMORTEM.** Ce ne sont pas des formalités. C'est
l'expérience capturée par écrit. Les meilleurs développeurs savent exactement pourquoi ils
ont pris telle décision, ce qui a cassé, et ce qu'ils feraient différemment.

**Tiens `DEPENDENCY_LEDGER.md` à jour.** 4 fois dans le curriculum (après 04, 11, 20, 28),
tu rejoues un drill court qui mesure ta dépendance réelle à l'IA, pas ce que tu crois.
Le protocole complet est dans `22_ai_native_dev/07_solo_vs_copilot_drill.md`. Une règle non
mesurée reste une croyance.

**Si tu débarques de zéro, ignore `29_mini_projects/_synthesis/` pour l'instant.** Tu vas
le croiser dans l'arborescence en scrollant, c'est normal, c'est pas pour aujourd'hui. Les
missions de synthèse demandent plusieurs modules déjà digérés. Avant ça, ouvrir ces fichiers,
c'est juste du bruit qui te perd pour rien. Elles sont mentionnées plus loin dans ce README,
au bon moment.

---

## ROADMAP : DANS L'ORDRE, SANS SAUTER D'ÉTAPE
 
```
01  Fundamentals            =>  les bases sans lesquelles tout le reste est du sable
02  Async & Event Loop      =>  comprendre le coeur invisible de JS
03  Error Handling          =>  survivre aux erreurs sans exploser en prod
04  Testing                 =>  tester ce qu'on comprend, pas ce qu'on espère
05  Maths utiles            =>  les maths qui servent vraiment
06  Memory & Performance    =>  comprendre ce qui coûte cher et pourquoi
07  Data Structures         =>  les armes secrètes de tout bon algorithme
08  Algorithms              =>  les patterns qui résolvent 90% des problèmes
09  Functional JS           =>  coder sans effets de bord ni regrets
10  Design Patterns         =>  les recettes de cuisine du code solide
11  Refactoring             =>  transformer du code qui fonctionne en code qui dure
12  Problem Solving         =>  concevoir avant de coder : le cerveau que la syntaxe ne donne pas
13  TypeScript              =>  JS avec un casque et une armure (obligatoire en 2026)
14  Runtime Environment     =>  savoir où ton code vit vraiment
15  Architecture Patterns   =>  construire grand sans tout effondrer
16  Web Concepts            =>  tout ce qu'un ingénieur web doit avoir en tête
17  Accessibility (a11y)    =>  coder pour tout le monde, pas juste pour toi
18  i18n                    =>  parler toutes les langues sans tout réécrire
19  Real-Time               =>  WebSockets, SSE, WebRTC : le web qui respire en direct
20  API Craft               =>  construire ce que le monde consomme
21  Security                =>  ne jamais être la faille que quelqu'un exploite
22  AI Native Dev           =>  utiliser l'IA sans perdre le contrôle
23  Databases               =>  persister intelligemment dans le temps
24  Scalability             =>  tenir quand ça devient sérieux
25  Observability           =>  voir ce qui se passe en prod
26  Team Craft              =>  coder avec des humains, pas juste avec une machine
27  Edge Cases              =>  JS qui se rebelle, et comment y survivre
28  OOP en JS               =>  prototype, classes, héritage : la face cachée de JS
29  Mini Projects           =>  assembler tout ça pour de vrai
30  Annexes                 =>  toolchain, Node CLI, TypeScript avancé
31  Tools                   =>  les gadgets maison pour aller plus vite
```
 
---
 
## LE NOYAU DUR : CE QUE TU DOIS MAÎTRISER EN BÉTON ARMÉ
 
Tu peux pas tout avaler d'un coup. Mais si tu sors de MyFunnyJS avec ces six blocs
verrouillés, t'es dangereux.
 
**01 + 02 : Fundamentals + Async.** Pas négociable. Si tu comprends pas les closures, le
scope, et l'Event Loop, tout le reste flotte dans le vide. C'est le sol. Tu construis pas
une maison sur du sable.
 
**03 + 04 : Error Handling + Testing.** Pas à la fin. Pas "quand t'as le temps". Maintenant.
Les erreurs d'abord : tu peux pas tester ce que tu sais pas attraper. Un dev qui gère pas
ses erreurs et qui teste pas, c'est un pilote sans instruments.
 
**07 + 08 : Data Structures & Algorithms.** Pas pour les entretiens. Pour penser. Savoir
quelle structure choisir dans quel contexte, c'est la différence entre du code qui tient et
du code qui s'effondre sous la charge.
 
**10 + 11 : Design Patterns + Refactoring.** Parce que ton premier jet sera toujours
approximatif. Les patterns t'apprennent à ne pas réinventer la roue. Le refactoring
t'apprend à améliorer sans tout casser.
 
**13 : TypeScript.** En 2026, ne pas savoir TypeScript, c'est se présenter à un entretien
sans chaussures. Ce n'est plus un bonus. C'est le standard.
 
**15 + 20 : Architecture + API Craft.** Sans patterns solides et sans API propres, ton
projet grandit pas : il pourrit.
 
```
        PRIORITÉ ABSOLUE
________________|________________
                |
    01_fundamentals + 02_async         <=  sans ça, t'es aveugle
                |
    03_error_handling + 04_testing     <=  sans ça, t'es imprudent
                |
    07_data_structures + 08_algos      <=  sans ça, t'es limité
                |
    10_design_patterns + 11_refacto    <=  sans ça, t'es un risque pour ton équipe
                |
           13_typescript               <=  sans ça, t'es hors marché en 2026
                |
    15_architecture + 20_api           <=  sans ça, t'es junior à vie
```

---

## DÉPENDANCES ENTRE MODULES
 
Chaque module a des prérequis. Sauter un prérequis, c'est construire sur du sable.
 
```
02_async              =>  prérequis : 01_fundamentals complet
03_error_handling     =>  prérequis : 01_fundamentals + 02_async + 01_fundamentals/08_debugging
04_testing            =>  prérequis : 01_fundamentals + 02_async
07_data_structures    =>  prérequis : 01_fundamentals + 06_memory_performance/03_complexity
08_algorithms         =>  prérequis : 07_data_structures complet
09_functional_js      =>  prérequis : 01_fundamentals/03_functions
10_design_patterns    =>  prérequis : 09_functional_js
13_typescript         =>  prérequis : 01_fundamentals complet (peut démarrer en parallèle de 02_async)
15_architecture       =>  prérequis : 10_design_patterns + 11_refactoring
19_realtime           =>  prérequis : 02_async complet + 16_web_concepts
20_api_craft          =>  prérequis : 14_runtime_env + 16_web_concepts + 03_error_handling
21_security           =>  prérequis : 20_api_craft + 16_web_concepts
22_ai_native_dev      =>  prérequis : aucun bloquant, profite de tout le reste
24_scalability        =>  prérequis : 20_api_craft + 21_security + 15_architecture_patterns
25_observability      =>  prérequis : 14_runtime_env + 20_api_craft
28_oop_js             =>  prérequis : 01_fundamentals complet (27_edge_cases recommandé)
```

---

## MINI-PROJETS : CE QUE TU CONSTRUIS VRAIMENT

9 projets construits depuis zéro, chacun couvrant 3 à 4 modules, plus un 10e à part :
`10_legacy_dungeon`, qui ne fait pas construire mais investiguer, sur du code que tu
n'as pas écrit. Pas des exercices théoriques. Des systèmes qui ont une raison d'exister,
des contraintes qui forcent de vraies décisions.

Le détail complet (pitch, contraintes, ADR, POSTMORTEM) est dans chaque dossier
`29_mini_projects/0X_xxx/README.md`. Ici, juste la carte.

```
01_rasengan_engine       =>  01_fundamentals + 05_math + 09_functional_js + 10_design_patterns
                              moteur de combat Naruto, zéro mutation d'état
02_garo_no_kronika       =>  02_async + 03_error_handling + 19_realtime + 15_architecture
                              alertes async sur des Chevaliers Garo, deadline de 99.9s
03_walking_dead_protocol =>  04_testing + 11_refactoring + 14_runtime_env + 31_tools
                              code spaghetti zombie à tester puis refactorer sans rien casser
04_breaking_cache        =>  07_data_structures + 08_algorithms + 06_memory_performance
                              supply chain façon Walter White, graphe + heap + profiling
05_prison_break_api      =>  20_api_craft + 21_security + 23_databases + 16_web_concepts
                              API sécurisée façon Fox River, T-Bag teste l'injection
06_ultras_dashboard      =>  25_observability + 24_scalability + 13_typescript
                              dashboard temps réel d'un club de foot, 200 events/min
07_ballon_dor_cli        =>  14_runtime_env + 11_refactoring + 03_error_handling + 30_annexes
                              CLI de vote v1 spaghetti à réécrire proprement en v2
08_trapsoul_radio        =>  13_typescript + 16_web_concepts + 17_accessibility + 18_i18n
                              radio web accessible et multilingue, zéro auditeur exclu
09_oracle_glitch         =>  22_ai_native_dev + 28_oop_js + 26_team_craft + 27_edge_cases
                              pipeline qui surveille et valide un LLM qui hallucine
10_legacy_dungeon        =>  26_team_craft (navigation de codebase appliquée pour de vrai)
                              vrai dépôt OSS non-documenté à cartographier, bug imposé à corriger
```

### Les 5 missions de synthèse (`29_mini_projects/_synthesis/`)

Si t'en es encore au module 01 ou 02 : passe ce bloc, reviens-y plus tard. Contrairement
aux 9 projets de construction ci-dessus (3-4 modules chacun), chaque synthèse mobilise
un bloc entier d'un coup. C'est le test qui dit si t'as vraiment digéré le bloc ou juste
enchaîné des leçons.

```
synthese_A  =>  après 01-04   runtime + async + erreurs + tests
synthese_B  =>  après 05-09   perf + structures + algos + FP
synthese_C  =>  après 10-13   patterns + refactor + résolution + TS
synthese_D  =>  après 14-21   runtime web + archi + sécurité (la plus grosse, prévois du temps)
synthese_E  =>  après 22-28   IA + data + scale + observabilité + OOP
```

Fais-les après le bloc correspondant, pas avant.

---
 
## GUIDE DE LECTURE POUR DÉBUTANT

Si t'es arrivé direct sur ce README sans passer par `01_START_HERE.md`, `02_DAY_ONE.md` et
`03_WHERE_YOU_STAND.md` à la racine : fais demi-tour, lis ces trois fichiers dans l'ordre
d'abord. Ils posent le décor avant la roadmap.

Si tu les as déjà lus : direct dans `01_fundamentals/`. Sans sauter. La ROADMAP plus haut
te donne la séquence complète : c'est pas une suggestion, c'est l'ordre dans lequel les
concepts s'empilent sans laisser de trou.

---

**Lovasoarm AKA Aramis**
