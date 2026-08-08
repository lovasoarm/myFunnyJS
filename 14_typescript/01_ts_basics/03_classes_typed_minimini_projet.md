## CONTEXTE

Le portfolio est fonctionnel, mais deux classes restent légitimes : les erreurs métier et l'`ErrorBoundary`. Il faut savoir les typer.

## APPLICATION

- Type proprement la classe d'erreur `ProjectNotFoundError` créée au module 5 (propriété `slug`, `name`).
- Écris un garde de type `isProjectNotFound(e: unknown)`.
- Utilise-le dans ton `catch` au lieu d'un `any`.

## Vérification

Pourquoi le paramètre d'un `catch` est-il `unknown` et pas `Error` ?

##Tes erreurs sont typées et discriminées

Ton `catch` distingue enfin les cas au lieu de tout traiter pareil. Commit.
