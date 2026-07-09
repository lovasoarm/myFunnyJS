# 02 : DAY ONE (contexte, environnement, premier code)

## QUIZ DE NIVEAU (30 secondes, auto-évalué)

Avant de continuer, réponds honnêtement à ces 5 questions :

- [ ] Je sais ouvrir un terminal (Terminal.app, iTerm, Windows Terminal, bash).
- [ ] Je sais lancer `node -v` et lire sa sortie.
- [ ] Je sais ce qu'est une "stack trace" quand une erreur apparaît (même vaguement).
- [ ] Je sais utiliser `cd`, `ls`, `pwd` dans un terminal.
- [ ] Je sais créer un fichier `.js` avec mon éditeur et le sauvegarder.

**Score** :

- **3+ oui** : fonce, tu es prêt pour la suite de ce fichier.
- **< 3 oui** : ouvre d'abord `02_shell_survival.md` (dans ce même dossier) et reviens ici après. Aucune honte : MyFunnyJS n'est pas un cours de terminal, mais on te renvoie vers la bonne ressource.

Ce quiz n'est pas technique JS. Il ne teste que **l'environnement**. Tu peux ne rien connaître à JS et cocher 5/5.

-> ~15 min

> **INTEMPOREL** : les outils changent, l'idée non. Un environnement
> reproductible, la boucle _écrire -> exécuter -> lire l'erreur -> comprendre_,
> et le réflexe de tout noter : ça survivra à toutes les stacks.

Ce fichier réunit le contexte, l'environnement et le premier code. Il te met
en selle en une lecture : pourquoi tu es là, comment monter ton poste, et ton
tout premier cycle de debug.

---

## 1. Ce qu'on fabrique ici

Pas un développeur "qui sait faire une todo-list". Un **ingénieur** qui :

- lit du code inconnu sans paniquer,
- debugge une prod cassée à 3h du matin,
- pilote une IA au lieu de la subir,
- reste employable quand la stack à la mode aura disparu.

### Le contrat

- **Tu lis chaque `.md` avant de coder.** Copier une solution sans la
  comprendre, c'est regarder quelqu'un faire des pompes à ta place.
- **Tu remplis TDD_JOURNAL et POSTMORTEM.** L'expérience non écrite s'oublie.
- **Tu mesures ta dépendance à l'IA** (`DEPENDENCY_LEDGER.md`). Une règle non
  mesurée reste une croyance. **Ce fichier n'existe pas encore : crée-le à la
  racine de ton propre repo maintenant**, en copiant la structure de
  `.audit/DEPENDENCY_LEDGER.md` (fourni comme modèle de référence, pas comme
  contenu à lire).

### Ratio lecture / écriture (règle Thor)

> Objectif : **lire du code 10x plus vite que tu n'en écris**. C'est le métier
> en 2026. L'IA écrit vite. Comprendre reste rare.

---

## 2. Ton environnement (5 min)

Le pas-à-pas complet (Windows / macOS / Linux) est dans
[`01_install.md`](01_install.md). Ici, juste le check express.

```bash
node -v   # doit afficher v20.x ou plus récent (la version de référence est dans .nvmrc)
npm -v    # >= 10
git --version
```

Si l'une des trois requêtes échoue -> ouvre [`01_install.md`](01_install.md)
avant d'aller plus loin. **Ne bricole pas.** Un environnement bancal génère des
bugs fantômes qui te feront perdre des semaines.

### Éditeur

VSCode ou tout éditeur avec :

- coloration syntaxique JS/TS,
- un debugger pas-à-pas (breakpoints, watch, step over/into),
- un terminal intégré.

Vérification finale :

```bash
node -e "console.log('ok')"
```

Sortie attendue : `ok`. Sinon, retour à `01_install.md`.

---

## 3. Ton premier cycle (10 min)

### a. Crée et exécute

```bash
mkdir day_one && cd day_one
echo 'console.log(1 + 1)' > hello.js
node hello.js
```

Attendu : `2`. Si tu vois autre chose, tu viens de faire ton premier bug.
Note-le dans un carnet, pas dans ta tête.

### b. Casse volontairement

```js
console.log(1 + )
```

Relance. Lis l'erreur **en entier**. Ne scrolle pas. Ne demande pas à l'IA.
Repère : le fichier, la ligne, le token attendu. C'est le geste #1 du métier.

### c. Répare

Corrige, relance. Réussi ? Tu viens de boucler ton premier cycle
_hypothèse -> expérience -> réfutation -> correction_. Tout le module
`04_debugging` n'est qu'une version musclée de ça.

### Ce qu'on ne fait PAS aujourd'hui

- installer React, Vue, Next, Tailwind, Prisma, Docker, K8s...
- copier-coller une "todo app en 10 min",
- suivre un tuto YouTube.

### Ta seule mission

Refais les étapes a->c avec 3 opérations différentes (`*`, `%`, `**`).
Note dans un fichier `TDD_JOURNAL.md` :

- ce que tu attendais,
- ce que tu as obtenu,
- ce que tu ne comprends pas encore.

---

Prochaine étape : [`../00_referentiel/where_you_stand.md`](../00_referentiel/where_you_stand.md) (auto-diagnostic).

---

stability: intemporel
