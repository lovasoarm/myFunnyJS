## TYPE

Projet fil rouge

## Niveau

🗸 Intermédiaire

## CONTEXTE

Les projets du portfolio s'affichent dans un ordre. Aujourd'hui cet ordre est probablement celui du tableau source ; il devrait être une décision explicite : date, popularité, ordre manuel de mise en avant.

## OBJECTIF

L'ordre d'affichage de tes projets est une règle de tri explicite et testable.

## APPLICATION

- Dans `lib/`, écris une fonction `sortProjects(projects, criterion)` qui trie par date, puis par titre à date égale.
- Utilise-la dans la page qui liste les projets, à la place de l'ordre implicite du tableau.
- Vérifie qu'elle ne mute pas le tableau d'origine (travaille sur une copie).
- Compare le coût de ton tri sur 6 projets et sur 5 000 objets générés : note ce que le changement d'échelle rend visible.

## Critère de réussite

- [ ] Fait : la liste affichée suit la règle de tri annoncée, y compris en cas d'égalité.
- [ ] Fait : le tableau source reste inchangé après appel.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi la stabilité du tri devient-elle importante dès qu'il existe des valeurs égales sur le critère principal ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Garde-fou

Avant de modifier le projet fil rouge :

1. Vérifie que le projet fonctionne.
2. Fais une modification minimale.
3. Vérifie le comportement demandé.
4. Lance les tests/build disponibles.
5. Ne supprime pas une fonctionnalité existante pour satisfaire l'exercice.
6. Si l'expérience est volontairement destructive, fais-la dans `scratch/` ou dans une branche dédiée.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton ordre d'affichage vient d'une règle de tri explicite et non mutante.

Tu as appliqué un algorithme classique à tes données réelles. Commit `lib/sortProjects`.
