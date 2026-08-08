## CONTEXTE

La portée lexicale se lit dans le code, pas à l'exécution. C'est ce qui explique qu'un composant enfant « voie » les props qu'on lui passe et rien d'autre.

## APPLICATION

- Dessine (papier ou commentaire) les portées imbriquées de ton fichier `ProjectCard.jsx` : module → composant → handler `onClick`.
- Utilise dans le handler une variable venant de chacune des trois portées.
- Vérifie que ça compile et explique en une phrase la chaîne de résolution.

## Vérification

Si deux variables portent le même nom dans deux portées imbriquées, laquelle gagne et pourquoi ?

##Ta carte projet a une hiérarchie claire

Tu sais maintenant lire un composant React comme une pile de portées : c'est l'outil mental n°1 pour comprendre le code des autres.
