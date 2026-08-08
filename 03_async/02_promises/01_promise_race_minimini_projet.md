## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

Une requête trop lente peut retarder une partie de l'interface. `Promise.race` permet de définir une limite de temps pour décider quand abandonner l'attente côté application.

## OBJECTIF

Ton application n'attend plus indéfiniment la réponse GitHub.

## APPLICATION

- Écris un helper `withTimeout(promise, ms)` basé sur `Promise.race`.
- Applique-le à ton fetch GitHub avec 2 secondes.
- Vérifie que la page s'affiche même si l'API ne répond pas (simule avec une URL injoignable).

## Critère de réussite

- [ ] Écris un helper `withTimeout(promise, ms)` basé sur `Promise.race`.
- [ ] Applique-le à ton fetch GitHub avec 2 secondes.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Que devient la promesse perdante de la course, et pourquoi est-ce important de le savoir ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton application n'attend plus indéfiniment la réponse GitHub.

Attention : `Promise.race` n'annule pas la requête réseau : la requête perdante continue en arrière-plan. L'annulation réelle viendra avec `AbortController` (voir `02c_abort_controller`) : `Promise.race` → timeout logique → `AbortController` → annulation réelle. Commit `withTimeout`.
