## TYPE

Projet fil rouge

## Niveau

🗸 Intermédiaire

## CONTEXTE

Une erreur typée porte du sens : `ProjectNotFoundError` se traite autrement qu'une panne réseau, et permet une vraie 404.

## OBJECTIF

Ta 404 projet est correcte.

## APPLICATION

- Crée `lib/errors.js` avec une classe d'erreur métier pour un projet introuvable.
- Lance-la depuis `getProjectBySlug`.
- Sur la route dynamique, attrape-la et déclenche la 404 native de Next.

## Critère de réussite

- [ ] Crée `lib/errors.js` avec une classe d'erreur métier pour un projet introuvable.
- [ ] Lance-la depuis `getProjectBySlug`.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Qu'apporte une classe d'erreur dédiée par rapport à un simple message texte ?

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

Dans ce scénario, tu as vérifié que : ta 404 projet est correcte.

Une URL inexistante rend maintenant une vraie page 404, bonne pour l'utilisateur et pour le SEO. Commit.
