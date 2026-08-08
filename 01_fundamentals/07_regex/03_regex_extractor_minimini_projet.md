## TYPE

Mini-projet

## Niveau

🗸 Fondamental

## CONTEXTE

Extraire, pas seulement valider : si tes fiches projets deviennent des fichiers Markdown, il faudra en tirer le front-matter et les titres.

## OBJECTIF

Ton sommaire de fiche projet se génère seul.

## APPLICATION

- Prends la `description` d'un projet en Markdown.
- Écris une fonction qui extrait tous les titres `##` avec leur texte en utilisant les groupes de capture.
- Utilise le résultat pour générer un sommaire cliquable sur la page détail.

## Critère de réussite

- [ ] Prends la `description` d'un projet en Markdown.
- [ ] Écris une fonction qui extrait tous les titres `##` avec leur texte en utilisant les groupes de capture.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

À quoi sert un groupe de capture par rapport à une simple correspondance ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton sommaire de fiche projet se génère seul.

La page détail gagne une navigation interne automatique. Commit ce helper.
