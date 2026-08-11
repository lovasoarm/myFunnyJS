## TYPE

Mini-projet

## Niveau

🗸 Avancé

## CONTEXTE

Une file classique supprime le message dès qu'il est consommé. Un log distribué (journal ordonné, découpé en partitions) le garde à une position, ce qui change qui peut le lire, quand, et combien de fois. Tant que tu n'as pas vu un rééquilibrage de partitions se produire sous tes yeux, la différence reste une phrase de cours.

## OBJECTIF

Un log partitionné et un consumer group tournent dans un seul fichier JS, sans broker installé, et tu peux prouver ce que fait le rééquilibrage.

## APPLICATION

- Écris un log en mémoire : un tableau de partitions, chaque partition étant un tableau de messages jamais supprimés. Un producteur pousse `{ cle, valeur }`, et la partition est choisie à partir de la clé (une somme des codes de caractères modulo le nombre de partitions suffit).
- Écris un consumer group : une liste de workers, une table `offsets[groupe][partition]`, et une fonction d'assignation qui donne chaque partition à un seul worker. Fais tourner la consommation en boucle et affiche `worker X → partition P → message M`.
- Ajoute un worker en cours de route, relance l'assignation, et observe qui récupère quoi. Ajoute-en un de plus que le nombre de partitions.
- Remets les offsets d'un groupe à zéro et relance la consommation : c'est ton replay. Ajoute un deuxième groupe qui lit le même log en parallèle du premier.
- Note les chiffres observés dans `docs/log-partitionne.md`.

## Critère de réussite

- [ ] Fait : deux messages de même clé arrivent toujours dans la même partition, dans l'ordre d'émission.
- [ ] Fait : avec plus de workers que de partitions, le surplus ne reçoit rien, et tu peux le montrer dans la sortie.
- [ ] Fait : le replay relit exactement les mêmes messages, et le second groupe avance indépendamment du premier.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi ajouter un dixième worker sur un topic à trois partitions ne fait-il rien gagner, alors qu'ajouter un dixième worker sur une file classique accélère le traitement ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : le parallélisme d'un consumer group est plafonné par le nombre de partitions, et qu'un log rejouable se relit sans rien réémettre.

Tu as reproduit la mécanique en JS pur, sans broker, sans compte, sans conteneur. Commit `docs/log-partitionne.md`.
