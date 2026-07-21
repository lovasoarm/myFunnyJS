---
stability: perissable
duree_de_vie_estimee: 1-2 ans
raison: Les styles IA évoluent avec les modèles.
---

# Cahier des charges : 18_human_vs_ai_smell

Temps de lecture ~4 min

## Objectif

Nommer, preuve à l'appui, les trois pièges spécifiques du style humain "vendredi 19h" ET les trois pièges spécifiques du style IA "Copilot prompt court", sur un même problème (`formatArenaTime`).

## Contraintes fonctionnelles

- Le helper accepte : 0, négatif, non entier, très grand nombre.
- La sortie respecte les formats : `"1h 23m 04s"`, `"23m 04s"`, `"04s"`.
- Les tests fournis dans `tests/` doivent passer sans modification.

## Contraintes de méthode

- Lecture obligatoire des deux versions AVANT toute exécution.
- Aucun code produit avant que `AUDIT.md` liste les six pièges (3 humain + 3 IA), chacun avec la ligne exacte et la raison.
- La version corrigée vit dans `src/` et est justifiée dans `FIX.md`.
- Une décision de conception (arrondi, gestion négatif, dépassement de 24h) est actée dans un fichier `ADR/`.

## Livrables attendus

- `AUDIT.md` (6 pièges nommés, 3 par style, ligne + raison)
- `FIX.md` (version corrigée + justification par cas limite)
- `src/format_arena_time.js` (implémentation propre)
- `tests/` verts
- `ADR/0001-choix-arrondi-et-negatifs.md`
- `TDD_JOURNAL.md` rempli au fil de l'eau
- `POSTMORTEM.md` en fin de mission

## Hors périmètre

- Réécrire les deux versions initiales : elles restent volontairement cassées.
- Ajouter des dépendances : Node standard suffit.

## Critères d'acceptation

- Les six pièges sont différents entre les deux styles (pas un doublon déguisé).
- Chaque piège est prouvé par un test qui échoue sur la version originale et passe sur le fix.
- Le postmortem distingue les mécaniques d'erreur "humain fatigué" et "IA plausible mais aveugle sur l'edge case".
