---
stability: intemporel
---

# DEPENDENCY_LEDGER.md : registre des dépendances et de la progression

Temps de lecture ~3 min

Ce fichier vit à la racine du repo. C'est ton registre personnel, rempli au
fil de ton avancée dans les modules 01 → 32 et les 17 mini-projets. Il sert
deux fonctions distinctes, gardées dans le même fichier pour éviter d'avoir
à jongler entre plusieurs documents de suivi.

## Fonction 1 : liens vers tes dépôts publics de mini-projets

Chaque mini-projet terminé (voir `30_mini_projects/README.md`) doit être
poussé sur un dépôt public et référencé ici, avec la date et un lien direct.

```markdown
## Mini-projets

| # | Projet | Dépôt public | Date de fin |
|---|--------|--------------|--------------|
| 01 | rasengan_engine | (ton lien) | (date) |
| 02 | garo_no_kronika | (ton lien) | (date) |
...
```

Ajoute une ligne à chaque mini-projet terminé. Ne retire jamais une ligne
existante : ce registre est un historique, pas un tableau de bord qu'on
nettoie.

## Fonction 2 : suivi de ta dépendance à l'IA dans le temps

Chaque fois que tu complètes un `PARTITION_<date>.md` (voir
`23_ai_native_dev/06_partition_drill.md`) ou un drill `07_solo_vs_copilot`,
ajoute une ligne ici avec le résultat chiffré.

```markdown
## Dépendance IA (drill solo-vs-copilot)

| Date | Module en cours | Ratio delegue/garde | Notes |
|------|------------------|----------------------|-------|
| (date) | (module) | (ex: 30% delegue / 70% garde) | (observation libre) |
```

L'objectif n'est pas d'atteindre un ratio cible précis : c'est de voir si
ta dépendance à l'IA évolue dans le temps (à la hausse ou à la baisse) et
de comprendre pourquoi, pas de viser un chiffre en particulier.

## Pourquoi un seul fichier pour ces deux fonctions

Les deux sont des registres qui grossissent au même rythme que ta
progression dans le curriculum (un par mini-projet, un par drill), donc les
garder ensemble évite d'avoir à maintenir deux fichiers séparés qui
racontent la même histoire de progression sous deux angles.

## Ce que ce fichier n'est PAS

Ce n'est pas un ADR, pas un POSTMORTEM. Ces documents restent dans le
dossier de chaque mini-projet : ce ledger ne fait que pointer vers eux, il
ne duplique pas leur contenu.
