## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

L'application partielle fige certains arguments. Elle simplifie les handlers React : un `onSelect` déjà lié au projet de la carte.

## OBJECTIF

Tes handlers sont préconfigurés.

## APPLICATION

- Dans ta rangée, crée les handlers de sélection par application partielle plutôt qu'avec une fonction fléchée en ligne recréée à chaque rendu.
- Mémorise-les avec `useCallback` là où c'est pertinent.
- Vérifie que le comportement est identique.

## Critère de réussite

- [ ] Dans ta rangée, crée les handlers de sélection par application partielle plutôt qu'avec une fonction fléchée en ligne recréée à chaque rendu.
- [ ] Mémorise-les avec `useCallback` là où c'est pertinent.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quand la mémorisation d'un handler apporte-t-elle réellement quelque chose ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes handlers sont préconfigurés.

Code plus court, rendus plus stables. Commit.
