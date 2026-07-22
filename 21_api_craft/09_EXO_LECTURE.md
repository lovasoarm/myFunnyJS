---
stability: intemporel
---

# EXO LECTURE : 15-25 minutes (API Craft)

> **LOCK : pas d'édition avant HYPOTHESES.md signé.** Tu ne modifies AUCUN fichier avant que ton `HYPOTHESES.md` soit signé (>= 3 hypothèses, chacune avec preuve attendue). Sinon, l'exo ne compte pas.
>
> **Budget lecture** : 400 lignes en 15 min chrono. Si tu dépasses, note pourquoi dans `MAP.md`. Objectif progressif : tu dois pouvoir tenir 500 lignes en 15 min à la fin du curriculum.
>
> **Protocole de cartographie** : suis `31_annexes/reading/cartographie_15min.md` si tu ne sais pas par où entrer.

Temps de lecture ~2 min

Compétence : lire du code réel que tu n'as pas écrit et le comprendre AVANT de le modifier. C'est 80% du métier. Applique le protocole `31_annexes/00_cartographier_codebase_inconnue.md` en version zoom.

## L'extrait

On te fournit un handler Express sans gestion d'erreur centralisée (10-30 lignes ; prends un extrait réel de tes mini-projets ou d'un repo OSS).

## Le protocole (15 min chrono)

1. POINT D'ENTRÉE : quelle ligne s'exécute en premier ? Qui appelle ce code ?
2. HYPOTHÈSE SUR LE COMPORTEMENT : sans l'exécuter, écris ce que tu crois qu'il fait, entrée -> sortie.
3. VÉRIFICATION : exécute, compare à ton hypothèse, explique tout écart.

## Livrable

`LECTURE_<nom>.md` avec tes 3 sections remplies + un dessin ASCII du flux.

## (attention) Ce que l'exo révèle

Si ton hypothèse était fausse, tant mieux : tu viens d'apprendre où ton modèle mental cloche. Un dev qui lit vite mais faux est plus dangereux qu'un dev lent mais juste.

## RÈGLE READ_ONLY_FIRST (non négociable)

**Tu n'as PAS le droit de modifier le code tant que tu ne peux pas :**

1. Expliquer à voix haute ce que fait la fonction / le fichier, en 3 phrases.
2. Prédire correctement la sortie sur au moins 2 entrées distinctes (sans exécuter).
3. Nommer une hypothèse implicite du code (ex : "suppose que l'input est trié", "suppose qu'il y a un seul thread").

Tant que ces 3 points ne sont pas faits, `git status` doit rester `working tree clean` sur ce fichier. La lecture précède l'écriture. Un dev qui modifie avant d'avoir lu est un dev qui casse.

Si tu veux "juste renommer une variable pour comprendre" : **note-le dans `HYPOTHESES.md`, ne le fais pas dans le fichier**.

---

## Livrable obligatoire : MAP_15MIN.md

Ce bloc appartient a "Systeme web complet" / "Ingenierie senior".
A la fin de cet EXO_LECTURE, tu produis un `MAP_15MIN.md` a cote de ce fichier,
en suivant `30_mini_projects/_templates/06_MAP_15MIN_TEMPLATE.md`.

Critere binaire : 15 min chrono, cartographie + chemin critique + 3 points
chauds + 3 hypotheses testables. Sans cet artefact, l'EXO_LECTURE n'est pas
valide.
