## CONTEXTE

Les types conditionnels adaptent un type selon un autre. Utile pour une carte dont les props varient selon la variante d'affichage.

## APPLICATION

- Définis une variante `"hero" | "row"` pour la carte.
- Fais qu'en variante `hero`, le champ `description` soit requis, et interdit en variante `row`.
- Vérifie que l'erreur apparaît bien à l'usage.

## Vérification

Ce type conditionnel améliore-t-il vraiment ton code, ou complique-t-il la lecture ? Tranche.

## 🎬 Tes variantes de carte sont contraintes par le type

Impossible d'utiliser la mauvaise variante par erreur. Commit si tu gardes, documente si tu simplifies.
