# Pourquoi ce référentiel ?

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

---
stability: intemporel
