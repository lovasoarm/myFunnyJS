## CONTEXTE

Décorer, c'est ajouter un comportement sans modifier l'existant : un cache ou un chronomètre autour de ton fetch GitHub.

## APPLICATION

- Écris `withLogging(fn)` qui enveloppe une fonction asynchrone et journalise durée et issue.
- Applique-la à ton appel GitHub sans toucher à son code.
- Retire le décorateur et vérifie que tout fonctionne encore.

## Vérification

Pourquoi un décorateur est-il préférable à un `console.log` ajouté dans la fonction ?

##Ton appel réseau est instrumenté

Tu peux mesurer sans polluer la logique métier. Commit ce helper.
