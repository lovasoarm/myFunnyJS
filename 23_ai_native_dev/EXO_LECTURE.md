# EXO LECTURE : 15 minutes (AI Native Dev)

Temps de lecture ~2 min


Compétence : lire du code réel que tu n'as pas écrit et le comprendre AVANT de le modifier. C'est 80% du métier.

## L'extrait

On te fournit un extrait qui appelle un LLM (streaming, RAG, retries, guardrails) : issu de `23_ai_native_dev/` ou d'un module d'orchestration. 15-30 minutes de lecture, pas plus.

## Le protocole (15 min chrono)

1. **POINT D'ENTRÉE** : quelle ligne s'exécute en premier ? Qui appelle ce code ? Quel est le trigger externe ?
2. **HYPOTHÈSE SUR LE COMPORTEMENT** : sans exécuter, écris ce que tu crois qu'il fait, entrée -> sortie. Nomme au moins 1 cas limite que tu suspectes de casser.
3. **VÉRIFICATION** : exécute (ou lis les tests), compare à ton hypothèse, explique tout écart. Le nombre d'écarts est le vrai résultat de l'exercice.

## Livrable

`LECTURE_<nom>.md` avec tes 3 sections remplies. Interdiction absolue de modifier l'extrait avant que les 3 sections soient écrites au propre. Cf `13_refactoring/06_do_not_touch_before_explain.md`.

## (attention) Ce que l'exo révèle

Si ton hypothèse était fausse, tant mieux : tu viens d'apprendre où ton modèle mental cloche sur AI Native Dev. Un dev qui lit vite mais faux est plus dangereux qu'un dev lent mais juste.

## Enchainement

- Fait 3 fois de suite avec 3 extraits différents avant de passer au prochain module.
- Croise avec `EXO_JEUNE_IA.md` du même module quand il existe : compare ton hypothèse humaine à celle qu'une IA produirait sur le même extrait.

---

stability: intemporel
