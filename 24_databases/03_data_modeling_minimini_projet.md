## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

Tes projets vivent aujourd'hui dans un fichier de données. Les modéliser comme des tables oblige à nommer les entités, les relations et les contraintes que le fichier laissait implicites.

## OBJECTIF

Le modèle de données de ton portfolio est explicite, avec ses relations et ses contraintes.

## APPLICATION

- Liste les entités réelles de ton portfolio : projet, technologie, éventuellement article ou message de contact.
- Écris le schéma correspondant : clés, types, champs obligatoires, relation projet ↔ technologies.
- Décide comment représenter la relation plusieurs-à-plusieurs et justifie ce choix en une ligne.
- Vérifie ton modèle contre trois questions réelles : lister les projets par date, trouver un projet par slug, filtrer par technologie.

## Critère de réussite

- [ ] Fait : les trois questions se répondent avec le modèle, sans champ improvisé.
- [ ] Fait : chaque contrainte (unicité du slug, champ obligatoire) est écrite noir sur blanc.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle information ton fichier de données laissait-elle implicite, et que le schéma rend maintenant explicite ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton modèle de données répond aux questions réelles de ton site.

Tu as modélisé avant d'implémenter. Commit ton schéma dans `docs/`.
