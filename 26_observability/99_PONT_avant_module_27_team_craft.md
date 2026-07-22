---
stability: perissable_2027
---

# PONT : de observer un système à collaborer avec des humains à l'artisanat en équipe

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `26_observability` et `27_team_craft`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

L'observabilité rend visible le comportement du code. `27_team_craft/` rend visible le comportement de l'équipe : revue de code, mentorat, désaccord technique, PR bloquante. Le principe est le même : ce qui n'est pas mesurable ne s'améliore pas.

## CE QUE TU MAÎTRISES DÉJÀ

- Instrumenter un service avec logs, metrics, traces.
- Repérer un SLI utile d'un vanity metric.
- Écrire un postmortem qui apprend, pas qui blâme.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **Revue de code** : un rituel de qualité, pas un tribunal.
- **RFC / ADR** : décision technique tracée par écrit.
- **Blameless postmortem** : chercher la cause, pas le coupable.
- **Bus factor** : combien de personnes doivent partir avant que le projet meure.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Traiter une PR comme un examen : "c'est bien ou c'est mal ?". Une revue utile pose des questions et propose des trade-offs, pas des verdicts.

## EXERCICE-CHARNIÈRE (5 min chrono)

Écris un commentaire de revue sur un code que tu n'aurais pas écrit comme ça. Deux versions : (a) verdictale ("c'est faux, refais"), (b) dialoguée ("j'aurais tenté X pour telle raison, qu'est-ce qui t'a fait choisir Y ?"). Compare les effets. `27_team_craft/03_code_review.md`.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
