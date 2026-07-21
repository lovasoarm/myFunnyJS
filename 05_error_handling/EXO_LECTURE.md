---
stability: intemporel
---

# EXO LECTURE : 15-25 minutes (Error Handling)

> **LOCK : pas d'édition avant HYPOTHESES.md signé.** Tu ne modifies AUCUN fichier avant que ton `HYPOTHESES.md` soit signé (>= 3 hypothèses, chacune avec preuve attendue). Sinon, l'exo ne compte pas.
>
> **Budget lecture** : 170 lignes en 15 min chrono. Si tu dépasses, note pourquoi dans `MAP.md`. Objectif progressif : tu dois pouvoir tenir 500 lignes en 15 min à la fin du curriculum.
>
> **Protocole de cartographie** : suis `31_annexes/reading/cartographie_15min.md` si tu ne sais pas par où entrer.

Temps de lecture ~2 min

Compétence : lire du code réel que tu n'as pas écrit et le comprendre AVANT de le modifier. C'est 80% du métier.

## L'extrait

On te fournit un extrait qui mixe `try/catch`, erreur custom, propagation asynchrone : issu de `05_error_handling/02_custom_errors.md` ou d'un mini-projet. 15-25 minutes de lecture, pas plus.

## Le protocole (15 min chrono)

1. **POINT D'ENTRÉE** : quelle ligne s'exécute en premier ? Qui appelle ce code ? Quel est le trigger externe ?
2. **HYPOTHÈSE SUR LE COMPORTEMENT** : sans exécuter, écris ce que tu crois qu'il fait, entrée -> sortie. Nomme au moins 1 cas limite que tu suspectes de casser.
3. **VÉRIFICATION** : exécute (ou lis les tests), compare à ton hypothèse, explique tout écart. Le nombre d'écarts est le vrai résultat de l'exercice.

## Livrable

`LECTURE_<nom>.md` avec tes 3 sections remplies. Interdiction absolue de modifier l'extrait avant que les 3 sections soient écrites au propre. Cf `13_refactoring/07_do_not_touch_before_explain.md`.

## (attention) Ce que l'exo révèle

Si ton hypothèse était fausse, tant mieux : tu viens d'apprendre où ton modèle mental cloche sur Error Handling. Un dev qui lit vite mais faux est plus dangereux qu'un dev lent mais juste.

## Enchainement

- Fait 3 fois de suite avec 3 extraits différents avant de passer au prochain module.
- Croise avec `EXO_JEUNE_IA.md` du même module quand il existe : compare ton hypothèse humaine à celle qu'une IA produirait sur le même extrait.

---

stability: intemporel

## RÈGLE READ_ONLY_FIRST (non négociable)

**Tu n'as PAS le droit de modifier le code tant que tu ne peux pas :**

1. Expliquer à voix haute ce que fait la fonction / le fichier, en 3 phrases.
2. Prédire correctement la sortie sur au moins 2 entrées distinctes (sans exécuter).
3. Nommer une hypothèse implicite du code (ex : "suppose que l'input est trié", "suppose qu'il y a un seul thread").

Tant que ces 3 points ne sont pas faits, `git status` doit rester `working tree clean` sur ce fichier. La lecture précède l'écriture. Un dev qui modifie avant d'avoir lu est un dev qui casse.

Si tu veux "juste renommer une variable pour comprendre" : **note-le dans `HYPOTHESES.md`, ne le fais pas dans le fichier**.
