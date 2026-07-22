---
stability: intemporel
---

# 01 : La méthode Polya (avant de toucher au clavier)
Temps de lecture ~5 min

> **Principe universel** : résoudre un problème, ce n'est **pas** commencer à taper. C'est une routine en 4 étapes qui existe depuis 1945 et n'a jamais vieilli.

## Les 4 étapes

### 1. Comprendre le problème
- Quelles sont les **entrées** ? Types, plages, cas dégénérés (vide, null, énorme) ?
- Quelle est la **sortie attendue** ? Format, contraintes ?
- Reformule le problème **avec tes mots**, à voix haute.

### 2. Élaborer un plan
- As-tu déjà vu un problème **similaire** ?
- Peux-tu résoudre un cas plus **simple** d'abord (n=1, n=2) ?
- Découpe en sous-problèmes. Chaque sous-problème doit tenir en une phrase.

### 3. Exécuter le plan
- Traduis chaque sous-problème en fonction.
- Une fonction, un rôle. Nom explicite.

### 4. Regarder en arrière
- Le résultat est-il correct sur les cas limites ?
- Peux-tu réutiliser la méthode ailleurs ?
- Peux-tu **simplifier** le code que tu viens d'écrire ?

## Exercice : découpe avant de coder

Problème : "Étant donné une liste de virements bancaires (from, to, amount), calcule le solde final de chaque compte et détecte les cycles suspects."

Livrable **avant** toute ligne de code :
- Types d'entrée / sortie (schema).
- Cas limites (5 minimum).
- Plan en 4 étapes maximum.
- Sur papier ou dans un `.md`. **Aucun `.js` autorisé** à ce stade.

## (attention) Ce que la précipitation cache

Coder tout de suite = tu résous **le problème que tu as compris**, pas le vrai. La différence tue en prod.
