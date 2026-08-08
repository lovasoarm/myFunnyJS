## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

`Pick`, `Omit`, `Partial`, `Readonly` : dériver des types au lieu de les recopier. La carte n'a pas besoin de tout le `Project`.

## OBJECTIF

Tes props sont dérivées du modèle.

## APPLICATION

- Déclare `ProjectCardProps` comme un `Pick` des seuls champs affichés par la carte.
- Déclare l'entrée de ta factory avec `Partial`.
- Vérifie qu'ajouter un champ à `Project` ne casse rien inutilement.

## Critère de réussite

- [ ] Déclare `ProjectCardProps` comme un `Pick` des seuls champs affichés par la carte.
- [ ] Déclare l'entrée de ta factory avec `Partial`.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi dériver plutôt que redéclarer les champs à la main ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes props sont dérivées du modèle.

Une seule source de vérité de type dans tout le site. Commit.
