## CONTEXTE

`this` dépend de l'appel, pas de la déclaration. En React fonctionnel tu l'évites presque partout : sauf dans une classe `ErrorBoundary`, que le portfolio aura pour ne jamais afficher un écran blanc.

## APPLICATION

- Écris un objet avec une méthode classique et une méthode fléchée qui lisent toutes deux `this`.
- Extrais chaque méthode dans une variable, appelle-la, compare le résultat.
- Déduis-en pourquoi une classe React lie ses handlers avec des propriétés fléchées.

## Vérification

Quelle règle détermine la valeur de `this` lors d'un appel de fonction classique ?

##Tu maîtrises le piège du this détaché

Tu es prêt à écrire une `ErrorBoundary` correcte au module 5 sans copier un exemple sans le comprendre.
