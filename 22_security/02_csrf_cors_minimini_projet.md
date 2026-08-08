## TYPE

Mini-projet

## Niveau

🗸 Avancé

## CONTEXTE

Le portfolio appelle au moins une API (GitHub, formulaire de contact). Qui peut appeler quoi, depuis quelle origine, avec quelles informations d'authentification : c'est ce que règlent CORS et les protections anti-CSRF.

## OBJECTIF

Tu sais quelle origine peut appeler ton API et pourquoi une requête écrite doit être protégée.

## APPLICATION

- Liste les appels sortants et entrants de ton portfolio : URL, méthode, données envoyées, secret éventuel.
- Depuis une page servie sur une autre origine (ou un simple `fetch` dans la console d'un autre site), tente d'appeler ta route d'API et lis le message d'erreur obtenu.
- Vérifie que les en-têtes CORS de ta route n'autorisent que les origines dont tu as besoin.
- Pour toute route qui écrit (formulaire de contact), note quelle protection empêche une soumission déclenchée par un site tiers.

## Critère de réussite

- [ ] Fait : l'appel depuis une origine non autorisée est refusé et tu sais lire le message.
- [ ] Fait : chaque route qui écrit a une protection identifiée par écrit.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

En quoi CORS protège-t-il le navigateur plutôt que ton serveur, et pourquoi une protection anti-CSRF reste-t-elle nécessaire ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton API n'accepte que les origines prévues et que tes routes d'écriture sont protégées.

Tu as transformé deux acronymes en propriétés observables de ton propre projet. Commit tes notes.
