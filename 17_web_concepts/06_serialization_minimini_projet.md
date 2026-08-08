## TYPE

Micro-drill

## Niveau

🗸 Avancé

## Prérequis

- Connaître la frontière Server / Client de l'App Router Next.js

## CONTEXTE

Les props traversant la frontière Server Component → Client Component doivent respecter les valeurs que le mécanisme de sérialisation de React/Next.js autorise. Teste notamment une fonction et une `Map` pour observer les limites.

## APPLICATION

- Essaie de passer une `Map` ou une fonction en prop d'un composant `"use client"` : lis l'erreur.
- Corrige en passant des données simples et en gardant la logique côté serveur.
- Note la règle de frontière en commentaire.

## Critère de réussite

- [ ] Essaie de passer une `Map` ou une fonction en prop d'un composant `"use client"`.
- [ ] Corrige en passant des données simples et en gardant la logique côté serveur.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelles valeurs peuvent franchir la frontière serveur → client, et pourquoi cette limite existe-t-elle ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta frontière de sérialisation est comprise.

Tu sais identifier quelles valeurs franchissent la frontière serveur → client et lesquelles doivent rester côté serveur. Commit.
