## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## Prérequis

- Connaître la frontière Server / Client de l'App Router Next.js

## CONTEXTE

`async/await` est la forme lisible des promesses, et l'App Router l'autorise directement dans un Server Component.

## OBJECTIF

Ta page a un vrai état de chargement.

## APPLICATION

- Convertis tes fetchs en `async/await` dans un Server Component asynchrone.
- Ajoute un `loading.tsx` sur la route concernée.
- Vérifie visuellement l'état de chargement en throttlant le réseau.

## Critère de réussite

- [ ] Convertis tes fetchs en `async/await` dans un Server Component asynchrone.
- [ ] Ajoute un `loading.tsx` sur la route concernée.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Que fait Next.js pendant que ton composant asynchrone attend ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta page a un vrai état de chargement.

Le portfolio ne montre plus jamais un écran vide pendant l'attente. Commit `loading.tsx`.
