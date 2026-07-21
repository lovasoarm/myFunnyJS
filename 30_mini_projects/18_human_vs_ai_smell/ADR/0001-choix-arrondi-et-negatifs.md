# ADR 0001 : arrondi, négatifs et dépassement dans formatArenaTime

## Contexte

`formatArenaTime(seconds)` reçoit des entrées bruitées : flottants, négatifs, gigantesques. Chaque style (humain, IA) a inventé sa propre règle silencieuse. Silence = bug de production dans 6 mois.

## Décision (à remplir par l'apprenant)

- Arrondi retenu : `Math.floor` / `Math.round` / rejet ?
- Négatif : erreur explicite / valeur absolue / clamp à 0 ?
- Dépassement 24h : formatter en `Xd Yh Zm Ws` / laisser en heures cumulées ?
- Non entier : arrondi silencieux / erreur ?

## Alternatives rejetées

- ...

## Conséquences

- Sur les tests : ...
- Sur la lecture future : ...
- Sur l'usage réel (arène temps réel, replay, export CSV) : ...

## Preuve

- Test qui bloque le retour en arrière sur cette décision : `tests/tests.js` cas ...
