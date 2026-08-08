## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## Prérequis

- Connaître `useEffect`

## CONTEXTE

Annuler une requête devenue inutile évite les réponses en retard qui écrasent l'affichage : typique d'une recherche de projets qui filtre à la frappe.

## OBJECTIF

Ta recherche affiche toujours le bon résultat.

## APPLICATION

- Implémente la recherche du catalogue avec un appel asynchrone (même simulé).
- Tape vite plusieurs lettres et observe les réponses arriver dans le désordre.
- Ajoute un `AbortController` annulé au nettoyage du `useEffect`.

## Critère de réussite

- [ ] Implémente la recherche du catalogue avec un appel asynchrone (même simulé).
- [ ] Tape vite plusieurs lettres et observe les réponses arriver dans le désordre.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi une réponse arrivée en retard est-elle un bug d'affichage et pas seulement du gaspillage ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta recherche affiche toujours le bon résultat.

La barre de recherche du portfolio est fiable même en frappe rapide. Commit ce composant.
