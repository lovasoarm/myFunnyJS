## CONTEXTE

Une pile : dernier entré, premier sorti. C'est exactement l'historique « Continuer à regarder » et la pile de modales ouvertes.

## APPLICATION

- Implémente la liste des projets récemment vus comme une pile bornée à 5 entrées, sans doublons.
- Vérifie que revoir un projet le remonte en tête.
- Branche-la sur le hook `useRecentlyViewed`.

## Vérification

Pourquoi une pile bornée et pas une simple liste qui grandit ?

##Ton historique se comporte comme Netflix

Le dernier projet consulté apparaît en premier, comme attendu. Commit.
