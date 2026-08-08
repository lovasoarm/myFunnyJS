## TYPE

Mini-projet

## Niveau

🗸 Avancé

## CONTEXTE

Une route publique de ton portfolio (formulaire de contact, API projets) peut être appelée en boucle. Limiter le débit est la première protection, avant toute mise à l'échelle.

## OBJECTIF

Une route publique de ton projet refuse proprement un débit anormal.

## APPLICATION

- Choisis la route la plus exposée de ton portfolio et définis une limite chiffrée (requêtes par minute et par appelant).
- Implémente la limite, avec une réponse claire quand elle est atteinte (statut dédié et information sur le délai d'attente).
- Écris un petit script qui envoie assez de requêtes pour déclencher la limite, et observe les réponses.
- Note la limite retenue et son raisonnement dans `docs/rate-limiting.md`.

## Critère de réussite

- [ ] Fait : au-delà de la limite, la réponse indique explicitement le refus et le délai.
- [ ] Fait : sous la limite, un usage normal n'est jamais bloqué.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi une limite stockée en mémoire d'un seul processus devient-elle insuffisante dès qu'il y a plusieurs instances ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta route exposée applique une limite de débit observable.

Tu as protégé un point d'entrée réel, avec un chiffre que tu peux défendre. Commit `docs/rate-limiting.md`.
