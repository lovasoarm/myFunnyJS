## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

Les génériques évitent de dupliquer un utilitaire par type. Ton `take(n)` ou ton `sortBy` doivent marcher sur n'importe quelle liste.

## OBJECTIF

Tes utilitaires sont réutilisables et typés.

## APPLICATION

- Rends `take` et `sortBy` génériques.
- Vérifie au survol que le type de sortie conserve `Project` quand tu les appliques au catalogue.
- Interdis toute perte de type vers `any[]`.

## Critère de réussite

- [ ] Rends `take` et `sortBy` génériques.
- [ ] Vérifie au survol que le type de sortie conserve `Project` quand tu les appliques au catalogue.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Que perds-tu concrètement si tu remplaces le générique par `unknown[]` ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes utilitaires sont réutilisables et typés.

Une bibliothèque interne minuscule mais solide. Commit.
