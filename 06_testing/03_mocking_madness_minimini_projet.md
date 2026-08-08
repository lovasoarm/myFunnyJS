## CONTEXTE

On simule ce qu'on ne contrôle pas : l'API GitHub, `localStorage`, le routeur. Sans mocks, tes tests dépendent du réseau : donc échouent au hasard.

## APPLICATION

- Écris un test de ta fonction de fetch GitHub en simulant `fetch` : un cas succès, un cas erreur.
- Vérifie que la valeur de repli est bien renvoyée en cas d'échec.
- Assure-toi qu'aucun appel réseau réel ne part pendant les tests.

## Vérification

Où passe la frontière entre ce qu'il faut simuler et ce qu'il faut tester réellement ?

## 🎬 Tes tests tournent hors ligne

Ta suite est rapide et déterministe, exécutable dans l'avion. Commit.
