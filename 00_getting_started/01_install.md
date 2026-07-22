---
stability: intemporel
---

# 01 : Installation pas-à-pas (Windows / macOS / Linux)
Temps de lecture ~5 min

> **INTEMPOREL** : les URLs changent, le protocole ne change pas :
> *installer proprement → vérifier → figer la version → documenter*.

Les numéros de version ci-dessous sont à jour pour 2026. Voir `.nvmrc`
à la racine pour la version canonique en cours.

> **C'est quoi `.nvmrc` ?** Un fichier texte d'une seule ligne (ex. `20`) placé
> à la racine du projet. `nvm` (Node Version Manager) lit ce fichier et bascule
> Node sur la version indiquée quand tu tapes `nvm use` dans le dossier. C'est
> **la source de vérité unique** de la version Node du curriculum : si un
> exercice ne marche pas, vérifie d'abord `node -v` contre `cat .nvmrc`. Tu
> n'as rien à créer : le fichier est déjà là.

---

## 0. Règle d'or

Tu n'installes **rien à la va-vite**. À chaque étape, tu vérifies avec une
commande. Si la vérification échoue, tu ne passes pas à la suivante.

---

## 1. Node.js

### macOS / Linux (recommandé : `nvm`)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
# ferme et rouvre le terminal
nvm install --lts
nvm use --lts
node -v  # doit renvoyer v22.x ou plus (aligné sur `.nvmrc` = 22)
```

### Windows

Option A (recommandée) : [`nvm-windows`](https://github.com/coreybutler/nvm-windows).
Option B : installeur officiel [nodejs.org](https://nodejs.org) → LTS.

Vérifie dans PowerShell :

```powershell
node -v
npm -v
```

Si `node` n'est pas reconnu : ferme et rouvre PowerShell. Toujours pas ?
→ variable `PATH` mal configurée. Cherche "Environment Variables" dans les
paramètres système, ajoute le dossier d'install de Node.


---

## 1bis. Fenêtre Node testée (à vérifier avant tout autre install)

Ce curriculum est testé et validé sur **Node 20.x → 22.x** (LTS actifs à la
date de review). Node 18 est en fin de vie ; Node 23-24 peuvent émettre des
warnings de deprecation qui perturbent le premier click.

Vérifie **maintenant**, avant même le premier exercice :

```bash
node -e 'const [maj] = process.versions.node.split(".").map(Number); if (maj < 20 || maj > 22) { console.error("Node hors fenêtre testée (20-22). Version:", process.versions.node); process.exit(1); } else { console.log("Node OK:", process.versions.node); }'
```

Si la commande échoue avec `Node hors fenêtre testée` :

- Ré-installe via `nvm install 22 && nvm use 22`.
- Si tu **dois** rester sur une autre version (contrainte projet), documente-le
  dans ton `PLATEAU_JOURNAL.md` : tu acceptes que certains warnings soient
  attendus et non-bloquants.

Le fichier `.nvmrc` à la racine du repo donne la version canonique en cours.

---

## 2. Git

- macOS : `xcode-select --install`
- Linux : `sudo apt install git` (Debian/Ubuntu) ou équivalent
- Windows : [git-scm.com](https://git-scm.com/)

Vérifie : `git --version`.

Configure une fois pour toutes :

```bash
git config --global user.name "Ton Prénom"
git config --global user.email "toi@example.com"
git config --global init.defaultBranch main
```

---

## 3. Éditeur

VSCode ([code.visualstudio.com](https://code.visualstudio.com/)) suffit.
Extensions minimales utiles :

- ESLint
- Prettier
- Error Lens
- GitLens

Rien de plus au démarrage. Chaque plugin est une dette cognitive.

---

## 4. Vérification finale

```bash
node -e "console.log('node ok')"
npm -e "console.log('npm ok')" 2>/dev/null || npm --version
git --version
```

Les trois doivent répondre. Sinon → retour à l'étape correspondante.

---

## 5. Fige ta version Node

À la racine du curriculum, un fichier `.nvmrc` déclare la version canonique.

```bash
cd chemin/vers/MyFunnyJS_Thor_Edition
nvm use  # lit .nvmrc automatiquement
```

Si `nvm use` renvoie "version not installed" → `nvm install`.

---

## Permissions (piège classique)

- **macOS/Linux** : ne fais **jamais** `sudo npm install -g …`. C'est le signe
 que ton install Node est mal placée. Réinstalle via `nvm`.
- **Windows** : si un `npm install` échoue avec `EPERM`, ferme les processus
 Node/VSCode ouverts et relance en tant qu'utilisateur (pas admin).

---

## (attention) Ce que l'analogie "installer c'est juste cliquer" cache

Installer, c'est **configurer un environnement d'exécution**. Chaque outil
ajoute des variables `PATH`, des permissions, des caches. Un environnement
sale génère des bugs fantômes que tu attribueras à ton code. D'où : versions
figées (`.nvmrc`), vérifications systématiques, réinstall via gestionnaire
(`nvm`) plutôt que par installeur global.

Retour à `02_day_one.md`.
