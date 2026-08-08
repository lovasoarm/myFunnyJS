## TYPE

Micro-drill

## Niveau

🗸 Intermédiaire

## CONTEXTE

Parsing, layout, paint, composite : savoir quelles propriétés CSS sont chères explique pourquoi une animation Netflix rame ou non.

## APPLICATION

- Anime le survol d'une carte avec `width`/`top`, mesure dans l'onglet performance.
- Refais la même animation avec `transform` et `opacity` seulement.
- Compare le nombre de recalculs de layout.

## Critère de réussite

- [ ] Anime le survol d'une carte avec `width`/`top`, mesure dans l'onglet performance.
- [ ] Refais la même animation avec `transform` et `opacity` seulement.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi `transform` évite-t-il le recalcul de mise en page ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : le survol de tes cartes est fluide à 60 fps.

L'effet le plus visible du site est aussi le moins coûteux. Commit les classes Tailwind correspondantes.
