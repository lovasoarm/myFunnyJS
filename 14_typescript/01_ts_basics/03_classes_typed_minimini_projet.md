## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

Le portfolio est fonctionnel, mais deux classes restent légitimes : les erreurs métier et l'`ErrorBoundary`. Il faut savoir les typer.

## OBJECTIF

Tes erreurs sont typées et discriminées.

## APPLICATION

- Type proprement la classe d'erreur `ProjectNotFoundError` créée au module 5 (propriété `slug`, `name`).
- Écris un garde de type `isProjectNotFound(e: unknown)`.
- Utilise-le dans ton `catch` au lieu d'un `any`.

## Critère de réussite

- [ ] Type proprement la classe d'erreur `ProjectNotFoundError` créée au module 5 (propriété `slug`, `name`).
- [ ] Écris un garde de type `isProjectNotFound(e: unknown)`.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi le paramètre d'un `catch` est-il `unknown` et pas `Error` ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes erreurs sont typées et discriminées.

Ton `catch` distingue enfin les cas au lieu de tout traiter pareil. Commit.
