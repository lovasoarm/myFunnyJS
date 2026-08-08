## TYPE

Projet fil rouge

## Niveau

🗸 Avancé

## CONTEXTE

En production, tu ne peux pas ouvrir un débogueur. Ce que tu as consigné au moment de l'incident est tout ce qu'il te reste : les logs de ton portfolio doivent donc être structurés et pas décoratifs.

## OBJECTIF

Les logs de ton portfolio permettent de reconstituer un appel qui a échoué.

## APPLICATION

- Remplace les `console.log` restants de ton code serveur par un log structuré (objet avec niveau, message, contexte).
- Ajoute systématiquement un identifiant de requête, la route et la durée de l'appel.
- Provoque une erreur sur ton appel externe (GitHub injoignable) et vérifie que le log seul suffit à comprendre ce qui s'est passé.
- Note dans `docs/observability.md` ce que tu ne dois jamais consigner (données personnelles, secrets, jetons).

## Critère de réussite

- [ ] Fait : un seul log suffit à identifier route, durée et cause de l'échec.
- [ ] Fait : aucun secret ni donnée personnelle n'apparaît dans les logs.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Qu'apporte un identifiant de requête que l'horodatage seul ne permet pas de reconstituer ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Garde-fou

Avant de modifier le projet fil rouge :

1. Vérifie que le projet fonctionne.
2. Fais une modification minimale.
3. Vérifie le comportement demandé.
4. Lance les tests/build disponibles.
5. Ne supprime pas une fonctionnalité existante pour satisfaire l'exercice.
6. Si l'expérience est volontairement destructive, fais-la dans `scratch/` ou dans une branche dédiée.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : un échec de ton portfolio est reconstituable à partir des logs.

Tu as rendu ton propre site observable. Commit `docs/observability.md`.
