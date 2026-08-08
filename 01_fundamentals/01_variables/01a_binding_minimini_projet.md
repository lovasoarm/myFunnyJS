## CONTEXTE

Le binding, c'est le lien entre un nom et un emplacement mémoire : pas la valeur elle-même. En React, comprendre ça évite de croire qu'on « modifie » une prop alors qu'on relie juste un nouveau nom à la même valeur.

## APPLICATION

- Dans un fichier de test rapide (`scratch.js`), déclare un objet `personalInfo`, puis un second nom `me` relié au même objet.
- Modifie une propriété via `me` et affiche `personalInfo` : observe.
- Puis réassigne complètement `me` à un nouvel objet et réaffiche `personalInfo`.
- Note en commentaire, en une phrase, la différence entre les deux opérations.

## Vérification

Quand tu écris `me = {...}`, qu'est-ce qui change exactement : la valeur ou le lien ?

## 🎬 Tu vois la différence entre lien et valeur

Tu viens d'éliminer la source n°1 des bugs « mon state ne se met pas à jour » que tu croiseras dans le portfolio. Ce fichier est un brouillon : supprime-le une fois la note prise.
