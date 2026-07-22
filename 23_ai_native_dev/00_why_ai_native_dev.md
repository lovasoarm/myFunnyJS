---
perennite: perissable
stability: periss-2028
duree_de_vie_estimee: 1-2 ans
raison: L'écosystème IA bouge tous les 6 mois. La posture critique tient plus longtemps.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : debugging (04_debugging), tests (06_testing), esprit critique (02_problem_solving). Team craft (27_team_craft anticipé) : la posture de code review complète est enseignée plus tard, ce module n'utilise que la checklist de base pour la pratique. Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI CE MODULE MÉRITE TON TEMPS : AI NATIVE DEV

> **Durée de vie : 2-3 ans, revenir en 2028.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Temps de lecture ~8 min

L'IA génère du code en quelques secondes. Du code qui compile, qui a l'air propre, qui répond exactement à ta demande. Et qui peut quand même contenir une fonction qui n'existe pas, une logique métier subtilement fausse, ou une faille de sécurité que tu copies-colles sans la vérifier parce que "ça avait l'air bon".

Coder avec l'IA en 2026, ce n'est pas la laisser coder à ta place. C'est apprendre à la diriger, à valider ce qu'elle produit, et à la remettre à sa place quand elle se trompe avec assurance.

---

## PRÉREQUIS

Ce module n'a pas de prérequis bloquant.
Il devient plus utile si tu as déjà fait `06_testing`, `21_api_craft`, et `22_security`.
Mais il peut être attaqué dès que les fondamentaux sont solides : le contexte prod
rend les exercices plus parlants, pas les concepts eux-mêmes.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

L'IA générative produit du code avec un défaut structurel important : elle peut halluciner (inventer une information fausse avec la même confiance qu'une information vraie) une fonction qui n'existe pas dans une bibliothèque, retourner un JSON malformé, ou affirmer qu'un comportement JS fonctionne d'une certaine façon alors que c'est faux. Le code généré a souvent l'air parfaitement crédible, ce qui rend l'erreur encore plus dangereuse : un bug évident se détecte vite, un bug plausible se glisse en prod.

Ce module construit la discipline pour utiliser l'IA sans lui déléguer ton jugement : un workflow clair qui intègre l'IA sans devenir dépendant, du prompt engineering (l'art de formuler une demande précise pour obtenir du code utile plutôt que du code juste plausible), et surtout, la validation systématique de ce que l'IA produit avec du typage, du parsing strict, et des tests automatiques qui ne font pas confiance au résultat juste parce qu'il "a l'air bon".

Le but n'est jamais de refuser l'IA. C'est de l'utiliser comme un collaborateur puissant mais non fiable par défaut, qu'il faut systématiquement vérifier, exactement comme tu vérifierais le code d'un junior brillant mais encore inexpérimenté.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui copie-colle aveuglément le code généré par une IA sans le valider découvre en prod que la fonction suggérée n'existait pas dans la version de la bibliothèque utilisée, ou que la logique métier générée gérait correctement le cas général mais cassait sur un edge case (cas limite) que l'IA n'avait pas anticipé.

Sur des tâches de génération de tests, ne pas vérifier ce que l'IA produit est encore plus risqué : un test généré qui "passe" sans vérifier réellement le bon comportement donne une fausse impression de sécurité. L'équipe croit que le code est testé, alors que le test ne fait que confirmer que le code retourne ce qu'il retourne, sans vérifier que c'est le bon résultat.

Et sur le plan de la compétence individuelle, le dev qui ne développe jamais sa capacité à juger le code généré reste dépendant de l'IA pour tout, incapable de détecter une erreur subtile, ce qui le rend vulnérable professionnellement face à des collègues qui savent utiliser l'IA en gardant un œil critique.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
fonction générée par l'IA qui n'existe pas réellement      --> hallucination    --> validation par typage/tests
JSON retourné par un LLM mal formé ou tronqué           --> output non fiable  --> parsing strict (ex : Zod)
suggestion de refactoring proposée par l'IA            --> AI refactor partner --> revue critique avant adoption
tests générés automatiquement par l'IA              --> AI test generator  --> vérification qu'ils testent vraiment quelque chose
prompt mal formulé qui donne une réponse plausible mais fausse  --> prompt engineering --> demande précise et contextualisée
```

L'IA s'intègre désormais dans chaque étape du développement : génération de code, suggestion de refactoring, génération de tests, revue de code assistée. Chacune de ces étapes a besoin d'un garde-fou humain qui valide, pas qui accepte par défaut.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Résolument moderne dans son sujet, mais le principe sous-jacent (ne jamais faire confiance à une sortie sans la valider) est intemporel en ingénierie logicielle. Ce module évoluera probablement plus vite que les autres modules du curriculum, parce que les capacités et les limites des modèles d'IA changent rapidement.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Il y a quelques années, l'IA générative pour le code était une curiosité limitée, capable de suggérer de l'autocomplétion basique. Aujourd'hui, elle génère des fonctions entières, des modules, parfois des architectures complètes, avec un niveau de plausibilité qui rend la vérification d'autant plus nécessaire, pas moins.

La tendance qui se renforce : l'IA devient un partenaire de refactoring et de génération de tests, pas juste un générateur de code from scratch. Et la compétence qui devient critique n'est plus "savoir écrire du code", c'est "savoir juger si le code écrit, peu importe qui (ou quoi) l'a écrit, fait vraiment ce qu'il doit faire".

---

## 6) NOYAU DUR DU MÉTIER ?

Pas listé dans les 6 blocs prioritaires historiques, mais devenu une compétence transversale incontournable. Le curriculum précise explicitement : `23_ai_native_dev`, prérequis "aucun bloquant, profite de tout le reste". Cette absence de prérequis bloquant n'est pas un signe de faible importance : c'est au contraire le signe que cette compétence amplifie tout ce que tu as appris dans les autres modules, surtout `06_testing` et `14_typescript` qui te donnent les outils pour valider ce que l'IA produit.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

L'IA générative ne va pas disparaître, et son rôle dans le développement logiciel va continuer de croître. Mais la nécessité de garder un jugement humain critique sur ce qu'elle produit ne disparaîtra pas non plus, parce qu'un modèle qui hallucine avec confiance reste un risque structurel, peu importe à quel point les modèles s'améliorent. Le dev qui maîtrise cette discipline de validation devient plus productif ET plus fiable que celui qui accepte tout sans vérifier.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

L'IA génère du code plausible, pas toujours du code correct, et la différence entre les deux peut te coûter cher en prod. Ça casse de trois façons sans cette discipline : fonctions inventées, JSON malformé, tests qui passent sans rien vérifier de réel. Cette compétence amplifie tout le reste du curriculum, plutôt que de le remplacer.

Maintenant, ouvre `01_ai_workflow.md`. Et apprends à diriger l'IA au lieu de la suivre les yeux fermés.

> Ce module réutilise : le problem solving du module 02 (`02_problem_solving`), le debugging du module 04 (`04_debugging`).


---

## PONT AVEC 22_security

Tu viens de la sécurité classique (input validation, auth, injection, MITM).
Ici tu changes de terrain : l'attaquant n'est plus un humain qui te sonde, c'est
une IA qui te propose du code plausible mais faux. Même posture : méfiance
active : appliquée à un vecteur nouveau.
