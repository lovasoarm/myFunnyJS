## CONTEXTE

L'application partielle fige certains arguments. Elle simplifie les handlers React : un `onSelect` déjà lié au projet de la carte.

## APPLICATION

- Dans ta rangée, crée les handlers de sélection par application partielle plutôt qu'avec une fonction fléchée en ligne recréée à chaque rendu.
- Mémorise-les avec `useCallback` là où c'est pertinent.
- Vérifie que le comportement est identique.

## Vérification

Quand la mémorisation d'un handler apporte-t-elle réellement quelque chose ?

##Tes handlers sont préconfigurés

Code plus court, rendus plus stables. Commit.
