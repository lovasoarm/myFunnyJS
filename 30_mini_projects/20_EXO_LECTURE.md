---
stability: intemporel
---

# EXO LECTURE : 15-25 minutes (30_mini_projects)

> **LOCK : pas d'édition avant HYPOTHESES.md signé.** Tu ne modifies AUCUN fichier avant que ton `HYPOTHESES.md` soit signé (>= 3 hypothèses, chacune avec preuve attendue). Sinon, l'exo ne compte pas.
>
> **Budget lecture** : 500 lignes en 15 min chrono. Si tu dépasses, note pourquoi dans `MAP.md`. Objectif progressif : tu dois pouvoir tenir 500 lignes en 15 min à la fin du curriculum.
>
> **Protocole de cartographie** : suis `31_annexes/reading/cartographie_15min.md` si tu ne sais pas par où entrer.

Temps de lecture ~2 min

Compétence : lire un README de mini-projet inconnu et en extraire, sans
coder, ce que le projet évalue vraiment.

## L'extrait

Ouvre au hasard le `README.md` d'un mini-projet que tu n'as PAS encore
fait (par exemple `13_memory_hunter/README.md` ou
`14_system_design_lab/README.md`).

## Questions (10 min, chronomètre)

Note tes réponses sur un scratch. Pas de recherche, pas d'IA.

1. Quelle est la **compétence-cible unique** évaluée par ce projet, en une
   phrase ?
2. Cite **trois pièges** que le README annonce explicitement.
3. Quels **modules du curriculum** sont prérequis pour finir ce projet ?
4. Quel est le **livrable minimal** qui prouve que tu l'as terminé (au-delà
   du code) ?
5. Dans quel ordre lirais-tu les fichiers du dossier avant de coder :
   `README.md`, `ADR/*`, `tests/README.md`, `POSTMORTEM.md` ?

## Auto-évaluation (5 min)

- 5/5 juste : tu peux attaquer le projet.
- 3-4/5 juste : relis le README avec plus d'attention avant d'attaquer.
- ≤ 2/5 juste : tu allais commencer à coder sans savoir ce qu'on attend
  de toi. C'est **exactement** le piège que ce module veut éviter.

## RÈGLE READ_ONLY_FIRST (non négociable)

**Tu n'as PAS le droit de modifier le code tant que tu ne peux pas :**

1. Expliquer à voix haute ce que fait la fonction / le fichier, en 3 phrases.
2. Prédire correctement la sortie sur au moins 2 entrées distinctes (sans exécuter).
3. Nommer une hypothèse implicite du code (ex : "suppose que l'input est trié", "suppose qu'il y a un seul thread").

Tant que ces 3 points ne sont pas faits, `git status` doit rester `working tree clean` sur ce fichier. La lecture précède l'écriture. Un dev qui modifie avant d'avoir lu est un dev qui casse.

Si tu veux "juste renommer une variable pour comprendre" : **note-le dans `HYPOTHESES.md`, ne le fais pas dans le fichier**.
