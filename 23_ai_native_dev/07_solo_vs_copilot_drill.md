---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# SOLO VS COPILOT : MESURER CE QUE TU CROIS SAVOIR
Temps de lecture ~10 min

`01_ai_workflow.md` t'a donné la règle : utilise l'IA pour aller plus vite, pas pour éviter de penser. Le problème avec une règle, c'est qu'elle ne dit pas où t'en es, là, maintenant. Tu peux réciter "je dois pas dépendre de l'IA" et dépendre de l'IA quand même, sans le voir venir, parce que personne ne mesure rien.

Ce fichier, c'est la mesure. Pas la théorie. Un protocole que tu rejoues plusieurs fois dans le curriculum, à des moments différents, pour voir une vraie courbe : est-ce que ton autonomie monte, descend, ou stagne ?

---

## 1) POURQUOI UN SEUL TEST NE SUFFIT PAS

`01_ai_workflow.md` EXO 3 te fait déjà coder un `debounce` sans IA puis avec IA, une fois. C'est un bon point de départ, mais un seul point ne fait pas une courbe. Si tu codes un `debounce` correctement aujourd'hui, ça dit juste que tu sais coder un `debounce` aujourd'hui. Ça ne dit rien sur dans 3 mois, après 200 sessions où l'IA a réfléchi à ta place.

```
UN SEUL TEST          PLUSIEURS TESTS DANS LE TEMPS
------------------------    ------------------------------
"je sais faire ça"       "je sais TOUJOURS faire ça"
photo              film
rassurant à tort        honnête, même si ça pique
```

Le drill de ce fichier se rejoue à 4 moments clés du curriculum : après le bloc 01-04, après le bloc 07-11, après le bloc 13-20, après le bloc 22-28. Quatre points sur une courbe, c'est une tendance. Un point, c'est une illusion.

---

## 2) LE PROTOCOLE, ÉTAPE PAR ÉTAPE

### CE QU'ON NE FAIT PAS

Refaire un mini-projet entier deux fois (sans IA puis avec IA) prendrait 24 à 80 heures selon le projet choisi, rien que pour UNE comparaison. C'est ni réaliste, ni nécessaire : la dépendance se mesure sur des unités de travail courtes, pas sur des marathons. Si tu veux mesurer un marathon, mesure ta vitesse sur 400 mètres, plusieurs fois, à des moments différents. C'est ça, un drill.

### CE QU'ON FAIT À LA PLACE

```
1. CHOISIR UNE TÂCHE CALIBRÉE (15-45 minutes en solo)
  --> tirée d'un mini-projet déjà fait ou en cours, JAMAIS un mini-projet entier
  --> une seule fonction, un seul module isolable, un seul bug à corriger
  --> voir la liste de tâches calibrées en section 3

2. ROUND SOLO : chrono démarré, zéro IA, zéro doc en ligne
  --> tu codes depuis ta tête et tes notes perso uniquement
  --> tu t'arrêtes au chrono même si c'est pas fini : note où t'en es
  --> tu notes : temps écoulé, niveau de blocage, ce que t'as dû deviner

3. ROUND COPILOT : même tâche, repartie de zéro, IA autorisée
  --> chrono redémarré à zéro
  --> tu utilises l'IA comme tu le ferais normalement
  --> tu notes : temps écoulé, ce que l'IA a apporté que t'avais pas

4. COMPARAISON IMMÉDIATE (5 minutes)
  --> diff entre les deux versions : qu'est-ce qui change vraiment ?
  --> est-ce que le round solo est arrivé à un résultat CORRECT, juste plus lent ?
  --> ou est-ce que le round solo a un bug que le round copilot évite ?
  --> ces deux cas ne racontent pas la même histoire (voir section 4)

5. CONSIGNATION DANS DEPENDENCY_LEDGER.md
  --> tu notes les résultats des deux rounds, datés
  --> tu compares avec les sessions précédentes si t'en as déjà fait
```

Durée totale d'un drill complet : 35 à 95 minutes selon la tâche choisie. Ça rentre dans une session normale de travail, pas besoin de bloquer une journée entière.

---

## 3) TÂCHES CALIBRÉES : OÙ LES TROUVER

Chaque mini-projet contient des unités de travail isolables. Voici des exemples concrets, un par mini-projet déjà construit, choisis pour tenir dans 15-45 minutes :

```
01_rasengan_engine  --> coder rng.js en mode déterministe (seed injectable) sans
             regarder le cahierdescharges, depuis la spec orale que tu
             te formules toi-même
02_garo_no_kronika  --> implémenter le Promise.race avec timeout des 99.9 secondes,
             gestion d'erreur incluse
03_walking_dead_protocol --> écrire 5 tests unitaires sur une fonction existante du
             projet, sans relire le code source d'abord (depuis les
             specs uniquement)
04_breaking_cache   --> implémenter BFS sur un graphe simple représenté en
             Map<string, string[]>
05_prison_break_api  --> écrire le middleware d'auth JWT (verify + extraction
             du payload), sans dépendance externe
06_ultras_dashboard  --> écrire un wrapper de structured logging avec
             correlation ID généré par requête
07_ballon_dor_cli   --> parser process.argv pour extraire des flags et leurs
             valeurs, avec gestion des flags sans valeur (booléens)
08_trapsoul_radio   --> écrire la fonction de pluralisation pour 2 locales
             (français, anglais) sans bibliothèque i18n
09_oracle_glitch   --> écrire un schema Zod pour valider une réponse LLM
             avec 4 champs typés et un enum
```

Tu peux aussi inventer ta propre tâche calibrée à partir de n'importe quel module déjà digéré : la seule contrainte, c'est 15-45 minutes en solo, une unité de travail isolable, jamais un projet entier.

---

## 4) LIRE LE RÉSULTAT : 4 CAS, PAS UN SEUL

Un drill solo-vs-copilot ne donne pas juste un "plus rapide" ou "plus lent". Il donne un signal sur LA NATURE de ta dépendance.

```
CAS A : solo plus lent, mais résultat CORRECT
 --> signal : tu sais faire, juste moins vite que l'IA pour taper la syntaxe
 --> c'est SAIN. C'est le niveau 2-3 du cycle de montée en compétence
   (voir 01_ai_workflow.md section 7). L'IA t'économise du temps de frappe,
   pas du temps de réflexion.

CAS B : solo plus lent ET résultat avec bug ou incomplet
 --> signal : un vrai trou de compétence, pas juste un trou de vitesse
 --> ATTENTION : identifie PRÉCISÉMENT quel concept a manqué (pas "je suis nul",
   mais "j'ai oublié comment gérer le cas où le tableau est vide")
 --> retourne lire le module concerné AVANT de refaire le drill

CAS C : solo et copilot arrivent au même résultat, temps similaire
 --> signal : sur cette tâche précise, t'as pas vraiment besoin de l'IA
 --> c'est rare et c'est une bonne nouvelle : note-le, ça compte dans le ledger

CAS D : copilot plus lent que solo
 --> signal possible 1 : la tâche était trop simple pour justifier un prompt
   (le temps de formuler le prompt dépasse le temps de coder directement)
 --> signal possible 2 : l'IA a halluciné quelque chose et t'as perdu du temps
   à débugger SA sortie au lieu de coder la tienne
 --> dans les deux cas : note lequel des deux signaux c'était. Ne mélange pas.
```

Le CAS B est celui qui doit te faire réagir. Pas en culpabilisant : en identifiant la lacune précise et en la travaillant. C'est exactement à ça que sert la mesure : pas à te juger, à te dire où regarder.

---

## 5) CE QUE TU NE FAIS JAMAIS DANS CE DRILL

```
NE JAMAIS faire le round copilot en premier
 --> si tu vois la solution de l'IA avant d'essayer toi-même, le round solo
   n'est plus un vrai test : c'est de la récitation, pas de la mesure

NE JAMAIS regarder ta solution du round précédent pendant le round solo
 --> si t'as déjà fait ce drill il y a un mois, tu codes depuis ta tête
   d'aujourd'hui, pas depuis ta mémoire d'un fichier que t'as écrit avant

NE JAMAIS arrondir les temps ou enjoliver le résultat dans le ledger
 --> "30 minutes" alors que c'était 52 minutes casse l'intérêt de la mesure
 --> le POSTMORTEM de tes mini-projets t'a déjà appris ça : l'honnêteté
   compte plus que l'image
```

---

## EXERCICES

**EXO 1 : Premier drill complet**
Choisis une tâche calibrée dans la liste de la section 3, idéalement tirée d'un mini-projet que t'as déjà fini (tu connais le contexte, tu peux te concentrer sur la mesure). Fais le protocole complet : round solo, round copilot, comparaison, consignation dans `DEPENDENCY_LEDGER.md`. (35-95 minutes selon la tâche)

**EXO 2 : Identifier ton CAS**
Sur le drill de l'EXO 1, détermine précisément lequel des 4 CAS (section 4) tu as vécu. Si c'est le CAS B, identifie le concept précis qui a manqué et note le module à relire. (10 minutes)

**EXO 3 : Le drill à froid**
Choisis une tâche calibrée tirée d'un mini-projet que t'as fait il y a au moins 3 modules de distance (donc pas le plus récent). Refais le drill complet. Compare ce résultat à un drill que t'aurais fait sur ce même type de tâche à l'époque, si tu l'as fait. Sinon, ce drill devient ton point de départ pour la prochaine comparaison. (35-95 minutes)

---

## RÉSUMÉ

Une règle non mesurée reste une croyance. Le drill solo-vs-copilot transforme "je crois que je dépends pas trop de l'IA" en une donnée datée et comparable. Le protocole tient sur des tâches courtes (15-45 minutes), jamais sur des mini-projets entiers refaits en double : c'est la fréquence et la répétition dans le temps qui donnent une vraie courbe, pas la taille d'un seul test. Quatre cas de lecture possibles, et un seul demande une vraie action : solo plus lent ET buggé, signe d'un trou de compétence précis à combler, pas d'une honte à porter.
