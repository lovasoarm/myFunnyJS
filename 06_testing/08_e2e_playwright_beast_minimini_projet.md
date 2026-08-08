## CONTEXTE

Le test end-to-end vérifie le parcours réel : arrivée sur l'accueil, clic sur une carte, lecture de la fiche projet. C'est le seul test qui prouve que le site marche.

## APPLICATION

- Installe Playwright et écris un unique scénario : ouvrir l'accueil, cliquer sur la carte MyFunnyJS, vérifier le titre de la fiche.
- Ajoute une assertion sur l'URL du slug.
- Fais tourner le test contre le build de production local.

## Vérification

Pourquoi ce test doit-il viser des rôles et textes visibles plutôt que des classes CSS ?

##Ton parcours principal est verrouillé

Le chemin qu'empruntera un recruteur est testé automatiquement. Commit le scénario.
