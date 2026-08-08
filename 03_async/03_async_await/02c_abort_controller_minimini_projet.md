## CONTEXTE

Annuler une requête devenue inutile évite les réponses en retard qui écrasent l'affichage : typique d'une recherche de projets qui filtre à la frappe.

## APPLICATION

- Implémente la recherche du catalogue avec un appel asynchrone (même simulé).
- Tape vite plusieurs lettres et observe les réponses arriver dans le désordre.
- Ajoute un `AbortController` annulé au nettoyage du `useEffect`.

## Vérification

Pourquoi une réponse arrivée en retard est-elle un bug d'affichage et pas seulement du gaspillage ?

## 🎬 Ta recherche affiche toujours le bon résultat

La barre de recherche du portfolio est fiable même en frappe rapide. Commit ce composant.
