## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

On simule ce qu'on ne contrôle pas : l'API GitHub, `localStorage`, le routeur. Sans mocks, tes tests dépendent du réseau : donc échouent au hasard.

## OBJECTIF

Tes tests tournent hors ligne.

## APPLICATION

- Écris un test de ta fonction de fetch GitHub en simulant `fetch` : un cas succès, un cas erreur.
- Vérifie que la valeur de repli est bien renvoyée en cas d'échec.
- Assure-toi qu'aucun appel réseau réel ne part pendant les tests.

## Critère de réussite

- [ ] Écris un test de ta fonction de fetch GitHub en simulant `fetch`.
- [ ] Vérifie que la valeur de repli est bien renvoyée en cas d'échec.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Où passe la frontière entre ce qu'il faut simuler et ce qu'il faut tester réellement ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes tests tournent hors ligne.

Ta suite est rapide et déterministe, exécutable dans l'avion. Commit.
