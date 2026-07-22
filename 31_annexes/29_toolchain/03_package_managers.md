---
stability: intemporel
---

# PACKAGE MANAGERS : NPM, YARN, PNPM, LES DIFFÉRENCES QUI COMPTENT VRAIMENT EN 2026
Temps de lecture ~9 min

Le camp dépend de fournitures extérieures : médicaments, munitions, essence. Personne ne fabrique tout soi-même, c'est impossible. Daryl peut piéger du gibier, mais il fabrique pas ses carreaux d'arbalète depuis zéro : il prend ce que le monde a déjà jutsu et il l'intègre à son arsenal.

Un package manager (gestionnaire de paquets) c'est exactement ça : il gère tout le code écrit par d'autres dont ton projet dépend, sans que t'aies à le retaper. npm, Yarn, pnpm : même mission, trois stratégies différentes.

---

## 1) CE QUE FAIT VRAIMENT UN PACKAGE MANAGER

Trois jobs, pas un seul :

```
1. résoudre les dépendances --> qui a besoin de quoi, dans quelle version
2. télécharger et stocker  --> récupérer le code depuis un registre (registry)
3. organiser sur le disque --> structurer node_modules pour que require/import fonctionne
```

```js
// package.json déclare ce dont ton projet a besoin
{
 "dependencies": {
  "express": "^4.18.0" // ^ = accepte les mises à jour mineures et patch, pas majeures
 }
}

// "npm install" lit ça, va chercher express ET tout ce dont express a besoin
// (ses propres dépendances, qui ont elles-mêmes des dépendances...)
```

**Technique :** résoudre les dépendances, c'est un problème de graphe (résolution de versions compatibles entre des dizaines de paquets qui dépendent eux-mêmes d'autres paquets). C'est pour ça qu'un `npm install` peut prendre du temps : il calcule un arbre de compatibilité entier avant de toucher au disque.

---

## 2) NPM, YARN, PNPM : MÊME JOB, STRATÉGIE DE STOCKAGE DIFFÉRENTE

La vraie différence entre les trois en 2026 c'est pas la syntaxe des commandes (qui se ressemblent beaucoup). C'est **comment ils stockent les fichiers sur le disque**.

### npm et yarn classique : duplication

```
node_modules/
├── package-a/
│  └── node_modules/
│    └── lodash@4.17.0/  ← copie complète
├── package-b/
│  └── node_modules/
│    └── lodash@4.17.0/  ← même version, copiée AUSSI
```

Si deux paquets utilisent la même version de `lodash`, npm classique en stocke parfois plusieurs copies physiques selon la profondeur de l'arbre. Ça gonfle le disque : l'équivalent de dupliquer les mêmes munitions dans chaque sacoche de chaque survivant.

### pnpm : stockage centralisé avec liens symboliques

```
~/.pnpm-store/       ← UN SEUL endroit sur la machine, pour TOUS les projets
└── lodash@4.17.0/

projet-A/node_modules/lodash --> lien symbolique vers le store global
projet-B/node_modules/lodash --> lien symbolique vers le MÊME store global
```

```
npm/yarn classique --> chaque projet duplique ses dépendances
pnpm        --> un seul exemplaire physique par version, partagé entre TOUS tes projets
```

**Pourquoi ça compte concrètement :** si t'as 15 projets Node sur ta machine et qu'ils utilisent tous `react`, npm classique stocke `react` 15 fois sur le disque. pnpm le stocke une fois et fait des liens symboliques (raccourcis pointant vers le même fichier physique). Gain de place réel, gain de vitesse d'installation aussi.

**Qui casse en prod :** les liens symboliques de pnpm créent une structure de `node_modules` plus stricte. Un paquet qui accédait à une dépendance qu'il n'avait pas déclarée explicitement (mais qui traînait "par hasard" dans node_modules grâce à un autre paquet) plante avec pnpm, alors qu'il marchait avec npm. C'est en fait une bonne chose : ça révèle des dépendances cachées non déclarées, un vrai bug de configuration que npm laissait passer.

---

## 3) LOCKFILES : LE CONTRAT DE VERSION EXACTE

```json
// package.json dit : "j'accepte express en version 4.18.x ou plus récente en mineur"
"express": "^4.18.0"
```

Mais ça, c'est une plage de versions, pas une version précise. Sans lockfile, deux installations à des moments différents pourraient récupérer des versions légèrement différentes.

```
package-lock.json (npm)
yarn.lock (Yarn)
pnpm-lock.yaml (pnpm)
```

Le lockfile fige les versions exactes de chaque dépendance, directe ET transitive (dépendances de dépendances). Résultat : `npm ci` (install depuis le lockfile, jamais de résolution) garantit que tout le camp reçoit exactement les mêmes fournitures dans la même quantité.

```
RÈGLE : toujours committer le lockfile dans Git
    le .gitignore ne doit jamais l'exclure
    sans lui, deux devs avec des dates d'install différentes ont des versions différentes
```

```js
// npm install  : résout + peut mettre à jour le lockfile
// npm ci    : installe EXACTEMENT le lockfile, échoue si le lockfile est absent
// usage en CI/CD : toujours npm ci, jamais npm install
```

---

## 4) VERSIONS : COMPRENDRE LE SEMVER

```
1.2.3
│ │ │
│ │ └── patch : bug fix, rétrocompatible → npm peut mettre à jour automatiquement
│ └──── minor : nouvelle feature, rétrocompatible → ^ autorise ça
└────── major : breaking change → ^ bloque ça
```

```json
"express": "^4.18.0" // accepte 4.18.x, 4.19.x, mais pas 5.x.x
"express": "~4.18.0" // accepte seulement 4.18.x (tilde plus restrictif que caret)
"express": "4.18.2"  // version exacte, aucune mise à jour automatique
```

**Qui casse en prod :** une dépendance qui ne respecte pas le semver (semantic versioning : convention de numérotation des versions) et introduit un breaking change dans une version mineure. Ça arrive. Le lockfile te protège si tu committes et utilises `npm ci` en prod.

---

## 5) COMMANDES ESSENTIELLES

```bash
# installer toutes les dépendances du projet (depuis package.json)
npm install

# installer depuis le lockfile EXACTEMENT (pour CI/CD)
npm ci

# ajouter une dépendance
npm install express
npm install --save-dev jest  # dépendance de dev uniquement

# supprimer une dépendance
npm uninstall express

# voir ce qui est outdated
npm outdated

# mettre à jour dans la plage autorisée par package.json
npm update

# auditer les vulnérabilités connues
npm audit
npm audit fix  # corrige automatiquement ce qui peut l'être
```

Les commandes Yarn et pnpm suivent la même logique avec des noms similaires (`yarn add`, `pnpm add`, etc.).

---

## EXERCICES

### EXO 1 : le camp et ses fournitures

Tu prends en main un projet JS (`03_walking_dead_protocol`) qui a un `package.json` mais pas de `node_modules` et pas de lockfile. Le projet liste des dépendances avec des plages de versions.

Installe les dépendances. Génère le lockfile. Vérifie avec `npm outdated` si des dépendances ont des mises à jour disponibles. Note quelle version a été installée vs celle autorisée par `package.json`. Explique pourquoi le lockfile est indispensable avant que Carol rejoigne l'équipe avec sa propre machine.

---

### EXO 2 : la fourniture suspecte

Lance `npm audit` sur un projet Node que tu as sur ta machine. Si des vulnérabilités sont détectées, note leur niveau de sévérité (low, moderate, high, critical) et ce que `npm audit fix` peut corriger automatiquement vs ce qui nécessite une intervention manuelle.

(Indice : un projet avec des dépendances anciennes aura probablement des alertes. C'est normal et pédagogique.)

---

### EXO 3 : la migration pnpm

Prends un projet npm existant (lockfile `package-lock.json` présent). Migre-le vers pnpm :
1. installe pnpm globalement si nécessaire
2. supprime `node_modules` et `package-lock.json`
3. lance `pnpm install`
4. vérifie que le projet fonctionne toujours
5. note une dépendance qui a planté à cause de la structure stricte de pnpm (si c'est le cas), et explique pourquoi

---

## RÉSUMÉ

Un package manager fait trois choses : résoudre les dépendances, télécharger, organiser sur le disque.
npm, Yarn, pnpm ont la même mission mais des stratégies de stockage différentes : pnpm est le plus efficace en espace disque.
Le lockfile est un contrat de version exacte : toujours le committer, toujours utiliser `npm ci` en CI/CD.
Le semver définit ce qu'une mise à jour peut casser : `^` autorise les mineures, `~` seulement les patchs.
`npm audit` révèle les vulnérabilités dans tes dépendances : à lancer régulièrement.
