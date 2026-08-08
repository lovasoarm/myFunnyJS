## CONTEXTE

`async/await` est la forme lisible des promesses, et l'App Router l'autorise directement dans un Server Component.

## APPLICATION

- Convertis tes fetchs en `async/await` dans un Server Component asynchrone.
- Ajoute un `loading.tsx` sur la route concernée.
- Vérifie visuellement l'état de chargement en throttlant le réseau.

## Vérification

Que fait Next.js pendant que ton composant asynchrone attend ?

##Ta page a un vrai état de chargement

Le portfolio ne montre plus jamais un écran vide pendant l'attente. Commit `loading.tsx`.
