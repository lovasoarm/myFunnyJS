---
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Un plan de migration est un produit durable, indépendant du contenu.
---

# MIGRATION_LEARNER : passer d'une version à l'autre sans casser ton parcours

Temps de lecture ~5 min

> Tu es à mi-parcours en v19, un pull te ramène en v20. Ce fichier te dit ce qui change, ce qu'il faut rejouer, et ce qu'il faut ignorer.

## LE PRINCIPE

À chaque bump majeur du curriculum, ce fichier gagne une section. Une section = trois choses :

1. **Fichier** : ce qui a changé de nom, s'est déplacé, a été supprimé.
2. **Concept** : ce qui a changé pédagogiquement (angle réécrit, exercice remplacé, section ajoutée).
3. **À rejouer** : les leçons ou exercices qu'il faut refaire pour rester cohérent.

## v19 -> v20 (juillet 2026)

### Fichier

- `19_web_inclusive/00_why_accessibility.md` -> `00_why_web_inclusive.md`. Le contenu s'étend à a11y + i18n.
- `14_typescript/04_typescript_tooling/00_why_typescript_advanced.md` -> `00_why_typescript_tooling.md`. Le périmètre est clarifié : tooling ici, types avancés dans `03_ts_advanced/`.
- 11 nouveaux ponts `99_PONT_*` ajoutés : voir `31_annexes/PONTS_INTER_MODULES.md` pour la table complète.
- 4 nouveaux fichiers : `23_ai_native_dev/07_faux_positifs_ia.md`, `23_ai_native_dev/08_prompt_safety.md`, `31_annexes/soft_skills/demander_aide.md`, `31_annexes/versioning/MIGRATION_LEARNER.md`.
- Endpoints `/login` renommés en analogies autorisées (Naruto, DBZ, Walking Dead) dans les exemples d'auth.

### Concept

- Frontmatter YAML `stability` ajouté à tous les `00_why_*.md` : intemporel, moderne, périssable.
- Chaque grimoire a une ligne "durée de vie" en pied.
- `04_debugging/scenarios/` : `HYPOTHESES.md` désormais obligatoire avant tout édit (verrouillage par critere binaire ecrit avant tout code).
- `EXO_LECTURE.md` : chaque exo a un budget lecture chiffré et un LOCK "pas d'édition avant HYPOTHESES.md signé".

### À rejouer

- Rien d'obligatoire. Les changements sont additifs : ton parcours v19 reste valide.
- Si tu es en train de faire `23_ai_native_dev/`, ajoute les leçons 07 et 08 à ta séquence.
- Si tu as sauté un pont v19 parce qu'il n'existait pas, envisage de lire le nouveau pont correspondant (voir la table).

## RÈGLE DES BUMPS

- **v20.x** (mineur) : ajouts, corrections, pas de rejouer.
- **v21** (majeur suivant) : possibles renommages, rejouer signalé au cas par cas.
- **vN** (majeur) : gagnera sa section ici avec les mêmes trois entrées.

## SI TU DÉBUTES EN v20

Ignore ce fichier. Il ne sert qu'aux apprenants qui étaient déjà dedans avant le bump.
