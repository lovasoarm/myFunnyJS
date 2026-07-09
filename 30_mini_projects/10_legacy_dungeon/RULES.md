# RÈGLE ABSOLUE : Legacy Dungeon
Temps de lecture ~5 min

> **Il est interdit de modifier le code avant d'avoir expliqué son fonctionnement dans `MAP.md`.**

## Pourquoi

Modifier avant de comprendre = tu casses ce que tu n'as pas mesuré.
Le vrai skill legacy : **lire, cartographier, formuler des hypothèses**, puis toucher.

## Livrable obligatoire avant tout commit : `MAP.md`

- Point d'entrée réel du repo (fichier + ligne d'appel initial).
- Arborescence commentée : rôle **supposé** de chaque fichier.
- Les 6 fichiers où vit la vraie logique métier.
- Un diagramme ASCII du flux principal (de l'entrée à la sortie).
- 3 hypothèses sur ce qui va casser si on touche à `X`.
- Liste honnête de ce qui reste flou.
- 1 zone que tu **n'oses pas** encore approcher, et pourquoi.

Aucun autre nom de livrable n'est valide pour ce projet : c'est `MAP.md`, un seul fichier, ce format exact.

## Contrôle

`git log --oneline` doit montrer `docs: MAP.md` **avant** tout `fix:` ou `refactor:`.

---
stability: intemporel
