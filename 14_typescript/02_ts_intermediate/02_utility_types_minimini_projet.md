## CONTEXTE

`Pick`, `Omit`, `Partial`, `Readonly` : dériver des types au lieu de les recopier. La carte n'a pas besoin de tout le `Project`.

## APPLICATION

- Déclare `ProjectCardProps` comme un `Pick` des seuls champs affichés par la carte.
- Déclare l'entrée de ta factory avec `Partial`.
- Vérifie qu'ajouter un champ à `Project` ne casse rien inutilement.

## Vérification

Pourquoi dériver plutôt que redéclarer les champs à la main ?

##Tes props sont dérivées du modèle

Une seule source de vérité de type dans tout le site. Commit.
