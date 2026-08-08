## CONTEXTE

Les génériques évitent de dupliquer un utilitaire par type. Ton `take(n)` ou ton `sortBy` doivent marcher sur n'importe quelle liste.

## APPLICATION

- Rends `take` et `sortBy` génériques.
- Vérifie au survol que le type de sortie conserve `Project` quand tu les appliques au catalogue.
- Interdis toute perte de type vers `any[]`.

## Vérification

Que perds-tu concrètement si tu remplaces le générique par `unknown[]` ?

##Tes utilitaires sont réutilisables et typés

Une bibliothèque interne minuscule mais solide. Commit.
