# 02 : DAY ONE · Premiers pas (ton premier code)

-> ~5 min

> **INTEMPOREL** : la boucle _écrire → exécuter → lire l'erreur → comprendre_
> restera vraie dans tous les langages, à toutes les époques.

## 1. Crée un fichier

```bash
mkdir day_one && cd day_one
echo 'console.log(1 + 1)' > hello.js
node hello.js
```

Attendu : `2`. Si tu vois autre chose, tu viens de faire ton premier bug.
Bienvenue. Note-le dans un carnet : pas dans ta tête.

## 2. Casse volontairement le code

```js
console.log(1 + )
```

Relance. Lis l'erreur **en entier**. Ne scrolle pas. Ne demande pas à l'IA.
Repère : le fichier, la ligne, le token attendu. C'est le geste #1 du métier.

## 3. Répare

Corrige, relance. Réussi ? Tu viens de boucler ton premier cycle
_hypothèse → expérience → réfutation → correction_. Tout le module `04_debugging`
n'est qu'une version musclée de ça.

## Ce qu'on ne fait PAS aujourd'hui

- installer React, Vue, Next, Tailwind, Prisma, Docker, K8s…
- copier-coller une "todo app en 10 min"
- suivre un tuto YouTube

## Ta seule mission

Refaire les étapes 1→3 avec 3 opérations différentes (`*`, `%`, `**`).
Note dans un fichier `TDD_JOURNAL.md` :

- ce que tu attendais,
- ce que tu as obtenu,
- ce que tu ne comprends pas encore.

Prochaine étape : `03_WHERE_YOU_STAND.md` (auto-diagnostic).
