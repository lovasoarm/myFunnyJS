---
stability: intemporel
audience: apprenant
scope: template MAP_15MIN : "lire 10x mieux qu'ecrire"
---

# MAP_15MIN.md : template standardise (livrable obligatoire)

Objectif : convertir la promesse _"lire 10x mieux qu'ecrire"_ en artefact
verifiable. Tu passes **15 minutes chrono** a lire un codebase (le mini-projet
legacy, l'EXO_LECTURE cible, ou le code que tu reprends) SANS ecrire une ligne
de code, et tu produis cette carte.

Livrable obligatoire dans :

- `30_mini_projects/10_legacy_dungeon/`
- `30_mini_projects/12_legacy_takeover/`
- `EXO_LECTURE` des blocs "Systeme web complet" (17_web_concepts,
  20_realtime, 21_api_craft) et "Ingenierie senior" (25_scalability,
  26_observability, 27_team_craft).

## Regles de remplissage (chrono 15 min)

- **5 min** : cartographie fichiers -> ce qui se lit / ce qui s'ignore.
- **5 min** : chemin critique -> par ou entre la donnee, par ou elle sort.
- **3 min** : points chauds -> ce qui a l'air fragile.
- **2 min** : hypotheses -> 3 max, chacune verifiable.

Tu depasses 15 min => tu t'arretes et tu notes que tu as depasse. Le chrono
est un signal, pas une punition.

---

## 1. Contexte (2 lignes)

- Codebase / cible :
- Pourquoi je le lis (une phrase, verbe d'action) :

## 2. Cartographie (5 min)

| Fichier / dossier | Role suppose | Priorite de lecture (1..3) |
| ----------------- | ------------ | -------------------------- |
|                   |              |                            |

## 3. Chemin critique (5 min)

Entree utilisateur -> ... -> sortie observable. En 5 fleches maximum.

```
[entree] -> [???] -> [???] -> [???] -> [sortie]
```

## 4. Points chauds (3 min)

Ce qui semble fragile, mal nomme, ou trop couple. 3 items, pas plus.

1.
2.
3.

## 5. Hypotheses de comportement (2 min)

Chaque hypothese est **testable** en < 5 min (une commande, un input, une
sortie attendue). Elles s'ecrivent aussi dans `HYPOTHESES.md`.

- H1 (verifiable par : ...) :
- H2 (verifiable par : ...) :
- H3 (verifiable par : ...) :

## 6. Ce que je ne lirai PAS aujourd'hui

Une liste. C'est le plus important. Ce n'est pas "je ne comprends pas",
c'est "je choisis de ne pas lire, et je saurai pourquoi si on me le demande".

## Critere de reussite binaire

- [ ] 15 min chrono respectees (ou depassement documente)
- [ ] Cartographie non vide
- [ ] Chemin critique en une seule ligne de fleches
- [ ] Exactement 3 points chauds
- [ ] Exactement 3 hypotheses testables
