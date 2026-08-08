## TYPE

Mini-projet

## Niveau

🗸 Avancé

## CONTEXTE

Si ton portfolio ajoute un espace protégé (page admin, section privée), il manipule un mot de passe. Un mot de passe ne se chiffre pas et ne se compare pas en clair : il se hache avec un algorithme lent et salé.

## OBJECTIF

Un mot de passe de ton projet n'est jamais stocké ni comparé en clair.

## APPLICATION

- Dans un fichier isolé, hache la même chaîne deux fois avec `bcrypt` (ou `argon2`) et compare les deux empreintes obtenues.
- Explique pourquoi les deux empreintes diffèrent alors que le mot de passe est identique.
- Écris la vérification correcte avec la fonction de comparaison de la bibliothèque, jamais avec `===`.
- Note le coût (nombre de tours) choisi et l'arbitrage sécurité / temps de réponse.

## Critère de réussite

- [ ] Fait : deux hachages du même mot de passe donnent des empreintes différentes.
- [ ] Fait : la comparaison passe par la fonction dédiée de la bibliothèque.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

À quoi sert le sel, et pourquoi un algorithme volontairement lent est-il un avantage ici ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : le hachage produit une empreinte salée et non réversible, comparable seulement via la fonction dédiée.

Tu sais désormais reconnaître un stockage de mot de passe incorrect dans n'importe quel code que tu liras. Commit tes notes.
