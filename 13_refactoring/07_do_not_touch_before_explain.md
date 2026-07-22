---
stability: intemporel
---

# NE TOUCHE À RIEN AVANT DE POUVOIR L'EXPLIQUER

-> ~7 min

## RÈGLE

Face à une codebase inconnue, **aucune modification** n'est autorisée avant
que tu puisses expliquer, à voix haute et sans lire, ce que fait le fichier
que tu veux toucher.

Ce n'est pas une posture morale. C'est une garantie anti-régression : 80 %
des bugs de refactor viennent d'un dev qui a "compris grosso modo" avant
d'éditer.

## PROTOCOLE

1. **Lecture passive** : lis le fichier entier, sans éditer, sans même
   ouvrir ton clavier de code.
2. **Explication au canard** : verbalise, en français, ce que ce fichier
   fait, pourquoi il existe, et **où il peut casser**.
3. **Écris un `RESUME_AVANT_EDIT.md`** de 10 lignes qui résume ta compréhension.
4. **Seulement ensuite**, tu peux éditer : et ton premier commit doit
   correspondre exactement à ce que ton résumé disait vouloir faire.

## ANTI-PATTERN À REPÉRER

- "Je vais juste renommer ça vite fait" → non, tu casses un contrat.
- "L'IA me dit que c'est ok" → l'IA n'a pas lu le fichier entier avec toi.
- "Le test passe, donc c'est bon" → les tests couvrent 40 %, pas 100 %.

## VÉRIFIABLE

Livrable : `RESUME_AVANT_EDIT.md` + diff du commit. Un pair te lit et vote :
"tu avais compris avant de toucher, oui/non". Non = tu recommences.
