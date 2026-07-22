---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
> (attention) **OUTIL PÉRISSABLE** : le tooling JS bouge chaque année. Traite ce module comme une REVUE, pas une bible. `Principes durables` en bas.

> **Périssable : valable 2026.** L'outil change vite ; le principe (build, format, lint, package) est **intemporel**.

# CLI SCAFFOLDER : GÉNÉRER UNE STRUCTURE DE PROJET EN UNE COMMANDE, PAS NEUF FOIS À LA MAIN
Temps de lecture ~8 min

Les 9 mini-projets de MyFunnyJS partagent tous la même arborescence cible : `cahierdescharges.md`, `README.md`, `TDD_JOURNAL.md`, `POSTMORTEM.md`, `ADR/`, puis les dossiers de travail `src/` et `tests/` que l'apprenant crée pendant le projet. Recréer cette base à la main, projet après projet, c'est le genre de tâche répétitive où une faute de frappe ou un dossier oublié finit toujours par arriver. Un scaffolder (générateur de structure) élimine ce risque en une commande.

---

## 1) LE PROBLÈME DE LA RÉPÉTITION MANUELLE

```
9 mini-projets, chacun avec la même structure cible à créer à la main :
mkdir 01_rasengan_engine
cd 01_rasengan_engine
touch cahierdescharges.md README.md TDD_JOURNAL.md POSTMORTEM.md
mkdir ADR src tests
cd ..
# Répété 9 fois, avec le risque d'oublier un dossier ou de mal nommer un fichier
```

**Risque réel :** sur 9 répétitions manuelles, un dossier `ADR` oublié, ou un fichier nommé `TDD_journal.md` au lieu de `TDD_JOURNAL.md` (incohérence de casse), passe souvent inaperçu jusqu'à ce qu'un script ou un outil qui s'attend à la structure exacte plante dessus. Dans Garo, le Chevalier ne reforge pas son armure à la main à chaque combat : la structure est définie, le processus est reproductible, le résultat est garanti. Ton scaffolder, c'est pareil pour les mini-projets.

---

## 2) LES BRIQUES DE BASE : FS ET PATH

```js
// scaffold.js
const fs = require('fs');
const path = require('path');

// fs.mkdirSync crée un dossier, "recursive: true" crée aussi les parents si besoin
function creerDossier(cheminComplet) {
 fs.mkdirSync(cheminComplet, { recursive: true });
}

// fs.writeFileSync crée un fichier avec un contenu initial
function creerFichier(cheminComplet, contenu = "") {
 fs.writeFileSync(cheminComplet, contenu, 'utf-8');
}
```

**Technique :** `path.join` (utilisé plus bas) construit des chemins de façon compatible entre systèmes d'exploitation (Windows utilise `\`, Linux/Mac utilisent `/`). Coder un chemin en dur avec des `/` partout casse silencieusement sur certains environnements Windows.

---

## 3) LE SCAFFOLDER COMPLET

```js
// scaffold.js (suite)

const STRUCTURE_MINI_PROJET = {
 fichiers: [
  "cahierdescharges.md",
  "README.md",
  "TDD_JOURNAL.md",
  "POSTMORTEM.md",
 ],
 dossiers: ["ADR", "src", "tests"],
};

function genererMiniProjet(nomProjet) {
 const racine = path.join(process.cwd(), nomProjet);

 if (fs.existsSync(racine)) {
  throw new Error(`Le dossier "${nomProjet}" existe déjà, scaffolding annulé`);
 }

 creerDossier(racine);

 // chaque fichier markdown démarre avec un titre minimal, pas vide
 STRUCTURE_MINI_PROJET.fichiers.forEach(nomFichier => {
  const titre = nomFichier.replace(".md", "").replace(/_/g, " ");
  creerFichier(
   path.join(racine, nomFichier),
   `# ${titre}\n\n> À compléter.\n`
  );
 });

 STRUCTURE_MINI_PROJET.dossiers.forEach(nomDossier => {
  creerDossier(path.join(racine, nomDossier));
 });

 return racine;
}

module.exports = { genererMiniProjet };
```

```js
// Utilisation directe en script
const { genererMiniProjet } = require('./scaffold');

const cheminCree = genererMiniProjet("10_nouveau_projet");
console.log(`Projet généré : ${cheminCree}`);
```

**Pourquoi vérifier `fs.existsSync` avant de créer :** sans cette vérification, relancer le scaffolder sur un projet déjà existant écraserait silencieusement des fichiers déjà remplis avec du vrai contenu. La vérification transforme une erreur destructrice silencieuse en message clair et bloquant.

---

## 4) LE TRANSFORMER EN VRAIE COMMANDE CLI

```js
// cli.js
#!/usr/bin/env node
// la ligne au-dessus indique au système que ce script s'exécute avec Node
// elle permet de lancer le script directement (./cli.js) sans taper "node" devant

const { genererMiniProjet } = require('./scaffold');

// process.argv contient les arguments passés en ligne de commande
// [0] = chemin de node, [1] = chemin du script, [2] = premier argument réel
const nomProjet = process.argv[2];

if (!nomProjet) {
 console.error("Usage : node cli.js <nom-du-projet>");
 process.exit(1); // code de sortie différent de 0 = signale une erreur au shell
}

try {
 const chemin = genererMiniProjet(nomProjet);
 console.log(`Projet "${nomProjet}" généré avec succès dans ${chemin}`);
} catch (erreur) {
 console.error(`Échec : ${erreur.message}`);
 process.exit(1);
}
```

```bash
# Utilisation en ligne de commande, une seule fois par mini-projet
node cli.js 10_nouveau_projet
# Projet "10_nouveau_projet" généré avec succès dans /chemin/vers/10_nouveau_projet
```

**Technique :** `process.exit(1)` communique au shell (et donc à un éventuel script ou pipeline CI qui appelle cette commande) que l'exécution a échoué. Un code 0 veut dire succès, n'importe quel autre code veut dire échec. C'est cette convention qui permet à un pipeline CI de savoir automatiquement si une étape a réussi ou pas.

---

## 5) AJOUTER UNE OPTION DE PERSONNALISATION

```js
// Permettre de choisir QUELS éléments générer, pas toujours tout
function genererStructure(nomProjet, options = {}) {
 const {
  inclureADR = true,
  inclureTests = true,
 } = options;

 const racine = path.join(process.cwd(), nomProjet);
 creerDossier(racine);

 STRUCTURE_MINI_PROJET.fichiers.forEach(nomFichier => {
  creerFichier(path.join(racine, nomFichier), `# ${nomFichier.replace(".md", "")}\n`);
 });

 creerDossier(path.join(racine, "src"));
 if (inclureTests) creerDossier(path.join(racine, "tests"));
 if (inclureADR) creerDossier(path.join(racine, "ADR"));

 return racine;
}
```

```js
// Un petit projet d'exercice qui a pas besoin d'ADR formel
genererStructure("exercice_rapide", { inclureADR: false });

// Un mini-projet complet, structure complète par défaut
genererStructure("05_prison_break_api");
```

**Pourquoi ça compte :** un scaffolder rigide qui génère toujours TOUT, même pour un petit exercice qui n'a pas besoin d'ADR, pousse à soit l'utiliser à moitié soit à le contourner complètement. Des options simples avec des valeurs par défaut sensées le rendent utile dans plus de contextes.

---

## EXERCICES

EXO 1 : Le générateur de base :
Implémente `genererMiniProjet`, lance-le sur un nom de projet test, et vérifie que les 4 fichiers et 3 dossiers attendus existent bien, avec le bon contenu initial dans chaque fichier markdown.

EXO 2 : La protection contre l'écrasement :
Lance le scaffolder une première fois sur un nom de projet, ajoute du vrai contenu dans un des fichiers générés, puis relance le scaffolder sur le MÊME nom. Vérifie que ça lève bien une erreur claire au lieu d'écraser silencieusement ton contenu.

EXO 3 : La commande complète :
Transforme ton scaffolder en script CLI utilisable avec `node cli.js <nom>`. Teste le cas sans argument (doit afficher un message d'usage et sortir en erreur) et le cas avec un nom déjà existant (doit afficher l'erreur du scaffolder, pas planter avec une stack trace brute).

---

## RÉSUMÉ

Un scaffolder élimine le risque d'erreur humaine sur une structure de projet répétée plusieurs fois, en s'appuyant sur `fs` et `path` pour créer dossiers et fichiers de façon fiable et compatible entre systèmes. Vérifier l'existence avant de créer protège contre l'écrasement silencieux de contenu déjà rempli. Transformé en script CLI avec gestion de `process.argv` et de codes de sortie corrects, l'outil devient utilisable en une seule commande, intégrable dans n'importe quel pipeline. Le but : que créer un nouveau mini-projet prenne 2 secondes et zéro risque d'oubli, au lieu de 5 minutes et un risque de structure incohérente. Michael Scofield a le plan de Fox River tatoué sur lui, toujours identique, toujours complet. Ton scaffolder, c'est ça : la structure du projet, reproductible à la commande, sans dépendre de ta mémoire du moment.
