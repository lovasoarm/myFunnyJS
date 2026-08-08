## TYPE

Projet fil rouge

## Niveau

🗸 Fondamental

## Prérequis

- Connaître la frontière Server / Client de l'App Router Next.js

## CONTEXTE

La portée décide de ce qu'un morceau de code peut voir. Dans Next.js App Router, cette distinction devient également importante pour comprendre quelles données appartiennent au code serveur et lesquelles peuvent être exposées au client.

> Attention : une variable au niveau module n'est pas une garantie de sécurité. Une donnée secrète doit rester dans une frontière serveur appropriée.

## OBJECTIF

Ta page est rangée par portée.

## APPLICATION

- Dans `app/page.tsx`, déclare une constante au niveau module et une autre dans le corps du composant.
- Essaie d'utiliser la seconde dans une fonction déclarée hors du composant : lis l'erreur.
- Range ce qui est réutilisable au niveau module, ce qui dépend du rendu dans le composant.

## Critère de réussite

- [ ] Dans `app/page.tsx`, déclare une constante au niveau module et une autre dans le corps du composant.
- [ ] Essaie d'utiliser la seconde dans une fonction déclarée hors du composant.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle question te poses-tu pour décider si une valeur doit vivre au niveau module ou dans le composant ?

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

Dans ce scénario, tu as vérifié que : ta page est rangée par portée.

Tu viens d'adopter le réflexe qui garde tes fichiers Next.js lisibles quand ils grossissent. Commit cette page.
