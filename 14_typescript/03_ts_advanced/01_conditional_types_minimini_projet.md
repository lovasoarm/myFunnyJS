## TYPE

Mini-projet

## Niveau

🗸 Avancé

## CONTEXTE

Les types conditionnels adaptent un type selon un autre. Utile pour une carte dont les props varient selon la variante d'affichage.

## OBJECTIF

Tes variantes de carte sont contraintes par le type.

## APPLICATION

- Définis une variante `"hero" | "row"` pour la carte.
- Fais qu'en variante `hero`, le champ `description` soit requis, et interdit en variante `row`.
- Vérifie que l'erreur apparaît bien à l'usage.

## Critère de réussite

- [ ] Définis une variante `"hero" | "row"` pour la carte.
- [ ] Fais qu'en variante `hero`, le champ `description` soit requis, et interdit en variante `row`.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Ce type conditionnel améliore-t-il vraiment ton code, ou complique-t-il la lecture ? Tranche.

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes variantes de carte sont contraintes par le type.

Impossible d'utiliser la mauvaise variante par erreur. Commit si tu gardes, documente si tu simplifies.
