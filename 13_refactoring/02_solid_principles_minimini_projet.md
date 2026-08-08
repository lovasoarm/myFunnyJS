## TYPE

Micro-drill

## Niveau

🗸 Avancé

## CONTEXTE

Les principes SOLID peuvent aider à analyser certaines responsabilités et dépendances dans une architecture frontend, mais ils ne constituent pas une checklist obligatoire pour chaque composant React.

## APPLICATION

- Vérifie que `ProjectCard` ne fait qu'afficher, `Row` qu'organiser, `lib/` que sélectionner.
- Repère une violation (par ex. un composant qui filtre ET affiche) et corrige-la.
- Note quel principe était enfreint.

## Critère de réussite

- [ ] Vérifie que `ProjectCard` ne fait qu'afficher, `Row` qu'organiser, `lib/` que sélectionner.
- [ ] Repère une violation (par ex. un composant qui filtre ET affiche) et corrige-la.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Lequel des cinq principes ton code enfreignait-il le plus, et à quel signe l'as-tu vu ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes responsabilités sont séparées.

Ton architecture de composants se défend ligne à ligne. Commit.
