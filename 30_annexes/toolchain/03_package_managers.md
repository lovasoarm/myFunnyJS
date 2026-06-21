# PACKAGE MANAGERS : NPM, YARN, PNPM, LES DIFFÉRENCES QUI COMPTENT VRAIMENT EN 2026

Le camp dépend de fournitures extérieures : médicaments, munitions, essence. Personne ne fabrique tout soi-même, c'est impossible. Un package manager (gestionnaire de paquets) c'est exactement ça : il gère tout le code écrit par d'autres dont ton projet dépend, sans que t'aies à le retaper.

---

## 1) CE QUE FAIT VRAIMENT UN PACKAGE MANAGER

Trois jobs, pas un seul :

```
1. résoudre les dépendances --> qui a besoin de quoi, dans quelle version
2. télécharger et stocker   --> récupérer le code depuis un registre (registry)
3. organiser sur le disque  --> structurer node_modules pour que require/import fonctionne
```

```js
// package.json déclare ce dont ton projet a besoin
{
  "dependencies": {
    "express": "^4.18.0"  // ^ veut dire : accepte les mises à jour mineures et patch, pas majeures
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
│   └── node_modules/
│       └── lodash@4.17.0/    <-- copie complète
├── package-b/
│   └── node_modules/
│       └── lodash@4.17.0/    <-- même version, copiée AUSSI
```

Si deux paquets utilisent la même version de `lodash`, npm classique en stocke parfois plusieurs copies physiques selon la profondeur de l'arbre. Ça gonfle le disque.

### pnpm : stockage centralisé avec liens symboliques

```
~/.pnpm-store/             <-- UN SEUL endroit sur la machine, pour TOUS les projets
└── lodash@4.17.0/

projet-A/node_modules/lodash --> lien symbolique vers le store global
projet-B/node_modules/lodash --> lien symbolique vers le MÊME store global
```

```
npm/yarn classique  --> chaque projet duplique ses dépendances
pnpm                --> un seul exemplaire physique par version, partagé entre TOUS tes projets
```

**Pourquoi ça compte concrètement :** si t'as 15 projets Node sur ta machine et qu'ils utilisent tous `react`, npm classique stocke `react` 15 fois sur le disque. pnpm le stocke une fois et fait des liens symboliques (raccourcis pointant vers le même fichier physique). Gain de place réel, gain de vitesse d'installation aussi (pas besoin de re-télécharger ce qui existe déjà dans le store).

**Qui casse en prod :** les liens symboliques de pnpm créent une structure de `node_modules` plus stricte. Un paquet qui accédait à une dépendance qu'il avait pas déclarée explicitement (mais qui traînait "par hasard" dans node_modules grâce à un autre paquet) plante avec pnpm, alors qu'il marchait avec npm. C'est en fait une bonne chose : ça révèle des dépendances cachées non déclarées, un vrai bug de configuration que npm laissait passer.

---

## 3) LOCKFILES : LE CONTRAT DE VERSION EXACTE

```json
// package.json dit : "j'accepte express en version 4.18.x ou plus récente en mineur"
"express": "^4.18.0"
```

Mais ça, c'est une plage de versions, pas une version précise. Sans lockfile, deux installations à des moments différents pourraient récupérer des versions légèrement différentes.

```
package-lock.json   --> npm
yarn.lock           --> yarn
pnpm-lock.yaml       --> pnpm
```

```js
// Le lockfile fige la version EXACTE de chaque dépendance ET sous-dépendance
// "express": "4.18.2" précisément, pas "^4.18.0"
// Si Daryl installe le projet aujourd'hui et Glenn dans 2 mois,
// ils obtiennent EXACTEMENT les mêmes versions, à la lettre près
```

**Technique :** le lockfile résout le problème de la reproductibilité (obtenir le même résultat à chaque installation, peu importe quand ou où). Sans lui, ton projet pourrait fonctionner aujourd'hui et planter dans 3 mois juste parce qu'une dépendance a publié une nouvelle version mineure avec un bug.

**Qui casse en prod :** committer pas le lockfile dans Git. Résultat, chaque environnement (ta machine, le serveur CI, la prod) peut installer des versions légèrement différentes. Un bug apparaît en prod, introuvable en local, parce que la version exacte d'une dépendance diffère silencieusement.

```
RÈGLE D'OR : le lockfile se committe TOUJOURS. Sans exception.
```

---

## 4) SEMVER : LIRE UNE VERSION COMME UN CONTRAT

```
4  .  18  .  2
^     ^      ^
|     |      |
MAJOR MINOR  PATCH
```

```
MAJOR --> changement qui casse la compatibilité (breaking change)
MINOR --> nouvelle fonctionnalité, mais rétrocompatible
PATCH --> correction de bug, rétrocompatible
```

```js
"express": "^4.18.0"   // accepte 4.18.0 jusqu'à (mais pas) 5.0.0
"express": "~4.18.0"   // accepte 4.18.0 jusqu'à (mais pas) 4.19.0, plus strict
"express": "4.18.0"    // EXACTEMENT cette version, aucune tolérance
```

**Pourquoi ça compte :** semver (versionnage sémantique) c'est une promesse, pas une garantie technique. Rien n'empêche un auteur de paquet de publier un breaking change en version mineure par erreur. Le symbole `^` te protège en théorie, mais pas en pratique à 100%. D'où l'importance du lockfile, qui fige la réalité plutôt que de faire confiance à la promesse.

---

## EXERCICES

EXO 1 : Le grand nettoyage du camp :
Prends un petit projet Node existant avec npm, supprime `node_modules`, installe-le avec pnpm à la place. Compare la taille du `node_modules` généré (commande `du -sh node_modules`) entre les deux approches sur le même projet.

EXO 2 : Le lockfile oublié :
Simule le chaos : modifie légèrement la plage de version d'une dépendance dans `package.json` (genre passer de `^4.17.0` à `^4.18.0`), supprime le lockfile, réinstalle. Observe comment le lockfile change et explique en une phrase pourquoi committer ce fichier protège toute l'équipe.

EXO 3 : Audit de dépendances fantômes :
Dans un projet avec plusieurs dépendances, identifie un import dans le code qui utilise un paquet jamais déclaré dans `package.json` (il "marche" seulement parce qu'il traîne dans node_modules grâce à une autre dépendance). Corrige en l'ajoutant explicitement aux dépendances déclarées.

---

## RÉSUMÉ

Un package manager résout, télécharge et organise les dépendances : trois jobs distincts, pas une simple commande magique. npm, yarn et pnpm font le même boulot mais stockent différemment sur le disque : pnpm centralise et économise l'espace via des liens symboliques. Le lockfile fige des versions exactes et se committe toujours, sans exception, parce que semver est une promesse, pas une garantie absolue. Sans ça, "ça marche chez moi" devient une phrase que tu répètes en boucle.
