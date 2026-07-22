---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
> (attention) **OUTIL PÉRISSABLE** : le tooling JS bouge chaque année. Traite ce module comme une REVUE, pas une bible. `Principes durables` en bas.

> **Périssable : valable 2026.** L'outil change vite ; le principe (build, format, lint, package) est **intemporel**.

# DEBUG TOOLKIT : SAVOIR OÙ ÇA CASSE SANS SEMER DES CONSOLE.LOG PARTOUT
Temps de lecture ~9 min

Un `console.log` te montre une valeur. Il te montre pas SI cette valeur est censée être là, ni CE QUI s'est passé juste avant pour qu'elle arrive dans cet état. Un vrai outil de debug te donne du contexte, pas juste un chiffre isolé balancé dans le terminal.

---

## 1) LE PROBLÈME DU CONSOLE.LOG EN BOUCLE

```js
// Le réflexe classique face à un bug
function calculerRations(survivants, stock) {
 console.log("survivants:", survivants); // ajouté pour débugger
 console.log("stock:", stock); // ajouté pour débugger
 const ration = stock / survivants.length;
 console.log("ration:", ration); // ajouté pour débugger
 return ration;
}
```

```
problèmes :
- 3 lignes de debug ajoutées, à supprimer après (et souvent oubliées)
- aucune indication de SI la valeur est correcte ou pas
- si le bug est ailleurs (genre survivants est undefined), tu dois rajouter ENCORE des logs en remontant
```

**Risque réel :** des `console.log` de debug qu'on oublie de supprimer, qui partent en prod, qui polluent les vrais logs structurés et exposent parfois des données sensibles par erreur.

---

## 2) L'ASSERTION : VÉRIFIER UNE HYPOTHÈSE, PAS JUSTE AFFICHER UNE VALEUR

```js
// assert.js

function assert(condition, message, context = {}) {
 if (!condition) {
  // on construit une erreur avec TOUT le contexte utile,
  // pas juste un message vague
  const erreur = new Error(`Assertion échouée : ${message}`);
  erreur.context = context;
  throw erreur;
 }
}

module.exports = { assert };
```

```js
// Utilisation : on VÉRIFIE une hypothèse au lieu de juste afficher une valeur
const { assert } = require('./assert');

function calculerRations(survivants, stock) {
 assert(
  Array.isArray(survivants) && survivants.length > 0,
  "survivants doit être un tableau non vide",
  { survivants }
 );
 assert(
  typeof stock === "number" && stock >= 0,
  "stock doit être un nombre positif",
  { stock }
 );

 return stock / survivants.length;
}

calculerRations([], 50);
// Error: Assertion échouée : survivants doit être un tableau non vide
// erreur.context = { survivants: [] }
// Le bug est identifié INSTANTANÉMENT, avec la cause exacte, pas une valeur à interpréter
```

**Technique :** une assertion ne te montre pas un état, elle vérifie qu'un état respecte une attente, et plante immédiatement avec un message clair si c'est faux. C'est la différence entre observer passivement ("voilà la valeur, débrouille-toi") et vérifier activement ("voici ce qui devait être vrai, et c'est faux, voici pourquoi"). C'est le réflexe de Luca Hood dans Banshee : avant d'entrer quelque part, il vérifie que les conditions sont réunies. Si elles ne le sont pas, il n'entre pas. Ton `assert` fait pareil avec ton code.

**Pourquoi ça vaut mieux que console.log :** une assertion qui échoue te montre EXACTEMENT où l'hypothèse casse, au lieu de te montrer 10 valeurs et te laisser comparer toi-même ce qui cloche.

---

## 3) L'INSPECTEUR D'ÉTAT : UN SNAPSHOT COMPLET, PAS UNE VALEUR ISOLÉE

```js
// inspect.js

function inspecter(label, donnees) {
 // structuredClone fait une copie profonde, donc si "donnees" est modifié
 // APRÈS cet appel, le snapshot affiché reste celui du moment de l'appel
 const snapshot = structuredClone(donnees);

 console.log(`\n--- INSPECTION : ${label} ---`);
 console.log(JSON.stringify(snapshot, null, 2)); // null, 2 = indentation lisible
 console.log(`--- FIN : ${label} ---\n`);

 // on retourne les données originales, pour pouvoir chaîner l'inspection
 // dans une expression sans casser le flux du code
 return donnees;
}

module.exports = { inspecter };
```

```js
// Utilisation : on inspecte SANS casser le flux normal du code
const { inspecter } = require('./inspect');

function traiterCamp(etat) {
 const etatApresGarde = inspecter("avant rotation de garde", etat);
 // ... logique de rotation ...
 return inspecter("après rotation de garde", etatApresGarde);
}
```

**Pourquoi le clone profond compte :** si tu logges juste une référence d'objet sans la cloner, et que cet objet est modifié plus tard dans le code, certains environnements affichent l'état FINAL de l'objet dans la console, pas l'état au moment du `console.log`. `structuredClone` fige un vrai instantané (snapshot), fiable même si l'objet change après.

---

## 4) LE TRACE : SUIVRE LE CHEMIN D'EXÉCUTION SANS DEVINER

```js
// trace.js

function creerTraceur() {
 const etapes = [];

 function tracer(nom, donnees = {}) {
  etapes.push({
   etape: etapes.length + 1,
   nom,
   timestamp: performance.now(),
   donnees,
  });
 }

 function afficherTrace() {
  console.log("\n=== TRACE D'EXÉCUTION ===");
  etapes.forEach(e => {
   console.log(`${e.etape}. [${e.timestamp.toFixed(2)}ms] ${e.nom}`, e.donnees);
  });
  console.log("=== FIN DE TRACE ===\n");
 }

 return { tracer, afficherTrace };
}

module.exports = { creerTraceur };
```

```js
// Utilisation : on suit le CHEMIN exact que le code a emprunté
const { creerTraceur } = require('./trace');

function evaluerMenace(secteur) {
 const { tracer, afficherTrace } = creerTraceur();

 tracer("debut evaluation", { secteur });

 const niveauBase = secteur === "nord" ? 3 : 1;
 tracer("niveau de base calcule", { niveauBase });

 const niveauFinal = niveauBase * 2;
 tracer("niveau final calcule", { niveauFinal });

 afficherTrace();
 return niveauFinal;
}
```

**Pourquoi ça aide sur un bug de logique complexe :** un bug du genre "le résultat final est faux, mais je sais pas à quelle étape ça part en vrille" se résout direct avec une trace : tu vois CHAQUE étape, dans l'ordre, avec les données du moment. Le problème saute aux yeux au lieu d'être deviné. C'est le jutsu de Naruto pour analyser un combat après coup : il rejoue chaque échange dans sa tête, étape par étape, pour comprendre où la stratégie a cassé. Le traceur fait ça pour ton code.

---

## 5) QUAND UTILISER QUOI

```
assert()   --> tu as une HYPOTHÈSE précise ("ce tableau ne doit jamais être vide ici")
inspecter()  --> tu veux voir l'état COMPLET à un instant donné, sans casser le flux
creerTraceur() --> tu veux suivre un CHEMIN D'EXÉCUTION sur plusieurs étapes liées
debugger natif (module toolchain) --> tu veux explorer interactivement, pas à pas, en temps réel
```

**Technique :** ces outils maison et le débogueur intégré de l'éditeur (vu dans le module toolchain) sont complémentaires, pas concurrents. Le débogueur excelle pour une exploration interactive en local. Ces outils maison excellent pour laisser une trace exploitable même quand tu peux pas attacher un débogueur (genre dans un test automatisé, ou un environnement distant).

---

## EXERCICES

EXO 1 : L'hypothèse vérifiée :
Prends une fonction qui suppose des choses sur ses arguments (genre un tableau jamais vide, un nombre toujours positif) sans les vérifier. Ajoute des `assert()` à l'entrée de la fonction, puis appelle-la volontairement avec des valeurs invalides pour voir l'erreur claire apparaître.

EXO 2 : Le snapshot figé :
Utilise `inspecter()` avant et après une fonction qui modifie un objet (mutation directe). Vérifie que les deux snapshots affichés sont bien différents et reflètent l'état réel à chaque moment, pas l'état final pour les deux.

EXO 3 : La trace qui révèle le bug :
Écris une fonction avec un bug de logique en plusieurs étapes (genre un calcul en 4 étapes où l'une d'elles est fausse). Utilise `creerTraceur()` pour tracer chaque étape, affiche la trace, et identifie visuellement à quelle étape précise le résultat part en vrille.

---

## RÉSUMÉ

Un `console.log` isolé montre une valeur sans contexte ni vérification. Une assertion vérifie une hypothèse et plante immédiatement avec une cause claire si elle est fausse. Un inspecteur d'état fige un snapshot complet et fiable grâce à un clone profond, sans casser le flux du code. Un traceur suit un chemin d'exécution étape par étape, utile pour des bugs de logique répartis sur plusieurs calculs liés. Ces outils maison complètent le débogueur intégré de l'éditeur, ils le remplacent pas : chacun a son terrain où il excelle.
