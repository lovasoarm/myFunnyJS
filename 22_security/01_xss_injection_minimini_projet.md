## TYPE

Projet fil rouge

## Niveau

🗸 Avancé

## Prérequis

- Connaître la frontière Server / Client de l'App Router Next.js

## CONTEXTE

Le portfolio affiche du contenu qui ne vient pas toujours de toi : champ de recherche, message d'un formulaire de contact, réponse d'une API externe. Toute valeur affichée telle quelle est une surface d'injection potentielle.

## OBJECTIF

Une valeur non fiable affichée dans le portfolio ne s'exécute pas comme du code.

## APPLICATION

- Repère chaque endroit du portfolio où une valeur externe est affichée (formulaire, paramètre d'URL, données d'API).
- Injecte volontairement une chaîne de test du type `<img src=x onerror=...>` dans un champ, puis observe le rendu.
- Vérifie qu'aucun `dangerouslySetInnerHTML` n'affiche une valeur non validée ; si un cas existe, assainis la valeur ou remplace-le par du texte.
- Note dans `docs/security.md` la liste des entrées non fiables et le traitement appliqué à chacune.

## Critère de réussite

- [ ] Fait : la chaîne de test s'affiche comme du texte, pas comme du HTML exécuté.
- [ ] Fait : chaque entrée non fiable est listée dans `docs/security.md`.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi l'échappement par défaut de React ne suffit-il plus dès qu'on utilise `dangerouslySetInnerHTML` ?

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

Dans ce scénario, tu as vérifié que : une valeur non fiable affichée dans le portfolio est traitée comme du texte.

Tu as relié un concept de sécurité théorique à un point d'entrée réel de ton propre site. Commit `docs/security.md`.
