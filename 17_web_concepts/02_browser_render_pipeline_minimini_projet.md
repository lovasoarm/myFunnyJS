## CONTEXTE

Parsing, layout, paint, composite : savoir quelles propriétés CSS sont chères explique pourquoi une animation Netflix rame ou non.

## APPLICATION

- Anime le survol d'une carte avec `width`/`top`, mesure dans l'onglet performance.
- Refais la même animation avec `transform` et `opacity` seulement.
- Compare le nombre de recalculs de layout.

## Vérification

Pourquoi `transform` évite-t-il le recalcul de mise en page ?

##Le survol de tes cartes est fluide à 60 fps

L'effet le plus visible du site est aussi le moins coûteux. Commit les classes Tailwind correspondantes.
