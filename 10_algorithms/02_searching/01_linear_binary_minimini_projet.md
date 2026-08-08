## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

Retrouver un projet par slug, filtrer par technologie, chercher dans un texte : le portfolio fait déjà de la recherche, sans l'avoir nommée comme telle.

## OBJECTIF

Tu choisis ta stratégie de recherche en fonction de la structure de tes données.

## APPLICATION

- Écris une recherche linéaire de projet par slug, puis mesure-la sur un tableau généré de 100 000 entrées.
- Trie ce tableau par slug et écris une recherche dichotomique équivalente.
- Compare les deux mesures, puis compare-les avec l'accès par `Map` construite une fois.
- Conclus par écrit : dans quel cas chaque stratégie est la plus pertinente pour ton portfolio réel (6 projets) ?

## Critère de réussite

- [ ] Fait : les trois approches renvoient le même projet pour un slug donné.
- [ ] Fait : la comparaison est chiffrée, pas seulement ressentie.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi la recherche dichotomique impose-t-elle une contrainte que la recherche linéaire n'a pas ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : le coût d'une recherche dépend de la structure de données choisie.

Tu as mesuré au lieu de supposer, sur tes propres données. Commit ton banc d'essai.
