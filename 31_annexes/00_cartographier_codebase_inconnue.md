---
stability: intemporel
---

# Cartographier une codebase inconnue en 15 minutes
-> ~10 min lecture, 15 min drill

Protocole reproductible, sans IA, sans lire le code ligne à ligne. À la sortie,
tu sais **où on entre**, **où on sort**, **où c'est testé**, **où c'est fragile**.
C'est la compétence Pierre 6 qui sépare le Kick-Ass du Thor.

## Les 6 étapes (2-3 min chacune, chrono)

### 1. `README.md` : 90 secondes
Lis. Cherche 3 choses seulement :
- à quoi ça sert (une phrase)
- comment on lance ça en local (une requête)
- ce qui est promis (contrats externes, endpoints, formats)
Note : si le README n'a pas ces 3 choses, c'est déjà un signal.

### 2. `package.json` : 90 secondes
- champ `scripts` : c'est la table des matières exécutable du projet.
- champ `dependencies` vs `devDependencies` : les runtime lourds (framework HTTP,
  ORM, moteur de rendu) te donnent la forme du projet en 3 secondes.
- champ `main` / `exports` / `bin` : les points d'entrée déclarés.

### 3. Point(s) d'entrée : 3 min
- `main`/`bin` ou `src/index.*` / `src/server.*` / `src/cli.*`.
- Ouvre le fichier. Note en 5 lignes : qui il importe, qui l'appelle.
- Trace un mini schéma ASCII : entree -> module X -> module Y -> sortie.

### 4. `tests/` : 3 min
Les tests documentent l'intention. Ouvre 3 fichiers de tests au hasard.
- Nom des `describe` / `it` : c'est la spec vivante.
- Fixtures (dossier `__fixtures__` ou `tests/data/`) : format des entrées reelles.
Si aucun test : gros signal, note-le dans ton dessin final.

### 5. `git log --oneline -50` (ou `--stat`) : 2 min
- Les 10 derniers commits te disent l'humeur du repo (feature, bugfix, refacto,
  panique). Les zones qui bougent souvent sont les zones fragiles.
- `git shortlog -sn` : qui connait quoi.

### 6. Dessin ASCII final : 3 min
Sur papier ou dans un fichier `CARTE.md` local :

```
[ CLI / HTTP ]
      |
      v
[ src/router.* ]---> [ auth ]     [ db/repo ]
      |                              ^
      v                              |
[ services/* ] --------------------- +
      |
      v
[ tests/ : happy path OK, edge cases minces ]
FRAGILE : services/payment.ts (10 commits en 2 semaines)
```

Ce dessin est le livrable. Il tient sur un post-it. Si tu ne peux pas le
dessiner, tu n'as pas encore cartographie : rejoue les etapes qui manquent.

## Ce qui n'est PAS dans le protocole (et pourquoi)

- **Lire tout le code** : non. Tu ne peux pas en 15 min. Tu veux la carte,
  pas le territoire.
- **Ouvrir l'IDE pour explorer les references** : plus tard. La carte d'abord,
  le zoom apres.
- **Demander a l'IA "explique-moi ce repo"** : le protocole existe justement
  pour t'en passer. La reponse IA est plausible, pas verifiable.

## Drill de validation

Prends un repo OSS que tu n'as jamais lu (ex : `expressjs/express`,
`sindresorhus/ky`, `pinojs/pino`). Chronomètre 15 min. Livre un `CARTE.md`.
Puis compare avec la doc officielle. Ecart = angle mort personnel a corriger.

## Où l'analogie casse

On dit "carte". Une vraie carte est stable, une codebase change chaque
semaine : ta carte a une date de peremption. Refais-la si tu reviens
apres 2 mois.

## Livrable exige

- `CARTE.md` avec les 6 sections remplies + un dessin ASCII.
- Une phrase "zone la plus fragile a mon avis, pourquoi".
- Une phrase "ce qui me manque encore pour toucher au code".

## Ou l'exercer

- `EXO_LECTURE.md` de tous les modules qui en portent un (voir liste dans
  `31_annexes/ARBORESCENCE.md`).
- Mini-projet `30_mini_projects/10_legacy_dungeon/` et
  `30_mini_projects/12_legacy_takeover/` : le protocole est la premiere
  chose a executer avant toute modification.
