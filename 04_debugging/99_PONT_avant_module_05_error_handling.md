---
stability: intemporel
---

# PONT : de chasser un bug à l'organiser en amont à la gestion d'erreur

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `04_debugging` et `05_error_handling`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

Debug = tu réagis après. Error handling = tu prévois avant. Le passage change ta posture : tu arrêtes d'être pompier, tu deviens architecte de l'échec.

## CE QUE TU MAÎTRISES DÉJÀ

- Reproduire un bug de façon déterministe.
- Écrire une hypothèse avant d'éditer.
- Lire une stack trace jusqu'au frame utile.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **Erreur attendue** : une condition prévue (fichier absent, réseau coupé), traitée comme un cas normal.
- **Erreur inattendue** : une invariante brisée, un bug, doit crasher fort.
- **Fail loud** : logger et lever tout de suite, pas silencieusement.
- **Domain error** vs **infrastructure error** : deux natures, deux traitements.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Vouloir `try/catch` partout. Un `catch` qui avale l'erreur sans agir masque un bug qu'un vrai debug aurait révélé en 5 min. Le bon `catch` a un plan.

## EXERCICE-CHARNIÈRE (5 min chrono)

Regarde ce code :
```js
try { JSON.parse(input); } catch (e) {}
```
Nomme les 3 informations que tu perds. Puis écris une version qui distingue "input malformé attendu" et "vraie surprise".

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
