---
perennite: evolutif
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Cadre de posture d'ingénieur, indépendant des technos.
---
> **Statut de pérennité :** **intemporel** | évolutif | périssable
> Statut effectif de ce module : **intemporel**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

# Pourquoi ce référentiel ?

Temps de lecture ~2 min


> **Durée de vie : intemporel.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Un curriculum sans référentiel, c'est une carte sans légende. Tu lis des
mots, tu les crois, tu ne peux rien vérifier. Le référentiel te donne
les repères objectifs qui rendent tout le reste opposable.

## À quoi sert ce dossier

- Fixer le vocabulaire commun (bug, régression, hypothèse, drill, spec drift).
  Un mot défini une fois, réutilisé partout, ça évite les malentendus qui
  coûtent des heures en équipe.
- Poser les échelles de gravité et de maturité : "Bloquant / À corriger /
  Améliorable" n'a de sens que si les trois niveaux sont décrits noir sur
  blanc quelque part.
- Rendre le curriculum **auditable** par un pair : sans référentiel, chaque
  lecteur invente ses critères ; avec, on peut débattre sur les mêmes règles.

## Ce que tu y trouveras

- Un glossaire minimal, en français, sans jargon inutile.
- Les conventions de nommage (numérotation continue 01 -> 32, préfixes,
  fichiers `00_why_*`, `00_prereq_check.md`, grimoires en 4 colonnes).
- Les échelles utilisées dans les audits et les postmortems.
- Les critères de "livrable prêt" pour un exercice, un mini-projet, un ADR.

## Règle précise sur `00_why_*.md`

Chaque **module racine** (`01_fundamentals`, `02_problem_solving`, etc.)
a obligatoirement son `00_why_<module>.md`. Ça, c'est non négociable :
32/32 modules le respectent.

Un **sous-dossier thématique interne** (`05_web_basics`, `i18n`,
`04_typescript_tooling`...) n'a besoin de son propre `00_why` que s'il
est suffisamment gros et autonome pour mériter son propre contexte
("pourquoi CE sous-thème précisément, indépendamment du module qui
l'héberge"). C'est le cas d'`i18n` (sous-domaine entier avec ses propres
pièges) ou de `04_typescript_tooling` (bascule complète de registre,
langage vers outillage). Ce n'est pas le cas d'un sous-dossier qui reste
une simple étape de la progression interne du module (`05_web_basics`
dans `01_fundamentals` répond déjà à la question "pourquoi" via
`00_why_fundamentals.md`).

Si un sous-dossier grossit au point de devenir un module à part entière
(plus de 6-8 fichiers, sujet clairement détachable), il mérite son propre
`00_why`. En dessous de ce seuil, le `00_why` du module racine suffit.

## Comment l'utiliser

Ne le lis pas d'un bloc. Reviens-y chaque fois qu'un mot du curriculum te
paraît flou. Traite ce dossier comme le dictionnaire d'un langage : on ne
le lit pas de A à Z, on le consulte au bon moment.

## Signal que tu n'as pas besoin d'y revenir

Tu écris un ADR ou un postmortem sans avoir à chercher une définition, et
un relecteur externe comprend ton texte sans te demander "tu veux dire
quoi par régression / par drill ?". À ce moment-là, le référentiel est
devenu invisible : c'est exactement le but.

## Signal que tu dois y revenir

Un pair te dit "tu utilises ce mot d'une manière bizarre" ou tu hésites en
audit entre "Bloquant" et "À corriger". Reviens à la définition, tranche,
avance.

## Ce que ce dossier n'est PAS

Ce n'est pas un cours. Il ne t'apprend pas JavaScript. Il t'apprend à
parler du projet sans ambiguïté. C'est un outil d'ingénierie
documentaire, pas un tutoriel.
