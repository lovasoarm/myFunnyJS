---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
> (attention) **OUTIL PÉRISSABLE** : le tooling JS bouge chaque année. Traite ce module comme une REVUE, pas une bible. `Principes durables` en bas.

> **Périssable : valable 2026.** L'outil change vite ; le principe (build, format, lint, package) est **intemporel**.

# BENCHMARK KIT : SAVOIR SI TON CODE EST RAPIDE, PAS JUSTE "PAS LENT EN APPARENCE"
Temps de lecture ~8 min

"Je pense que cette version est plus rapide" c'est une opinion. Un benchmark (mesure de performance comparative) c'est un fait. La différence entre les deux, c'est souvent la différence entre optimiser ce qui compte vraiment et perdre du temps sur un détail qui change rien.

---

## 1) POURQUOI "ÇA A L'AIR RAPIDE" NE SUFFIT PAS

```js
// Deux façons de filtrer un tableau, laquelle est la plus rapide ?
function filtrerAvecFilter(tableau) {
 return tableau.filter(x => x > 10);
}

function filtrerAvecBoucle(tableau) {
 const resultat = [];
 for (let i = 0; i < tableau.length; i++) {
  if (tableau[i] > 10) resultat.push(tableau[i]);
 }
 return resultat;
}
```

Sans mesure, t'as que des intuitions. Et les intuitions sur la perf JS sont souvent fausses : le moteur JS optimise (JIT : compilation à la volée) des patterns différemment selon le contexte, la taille des données, le navigateur ou la version de Node.

**Risque réel :** passer 2 heures à "optimiser" une fonction qui représente 0.01% du temps d'exécution total, pendant qu'une vraie lenteur ailleurs (une requête réseau, une boucle imbriquée sur de grosses données) reste invisible parce que jamais mesurée. C'est l'erreur de Vegeta contre Cell : il s'entraîne sur les mauvaises choses pendant que la vraie menace grossit en silence. Mesure d'abord, optimise ensuite.

---

## 2) LA BASE : PERFORMANCE.NOW()

```js
// performance.now() retourne un timestamp en millisecondes,
// avec une précision bien plus fine que Date.now()
const debut = performance.now();

// ... du code à mesurer ...

const fin = performance.now();
console.log(`Durée : ${fin - debut} ms`);
```

**Technique :** `performance.now()` est conçu spécifiquement pour mesurer des durées, pas pour donner une heure absolue. Sa précision (généralement sub-milliseconde) le rend plus fiable que `Date.now()` pour comparer deux exécutions rapprochées.

Ce mécanisme de base existe déjà ailleurs dans le curriculum (module performance). Ici, on l'emballe dans un outil réutilisable, pour pas réécrire ce chrono à chaque fois.

---

## 3) CONSTRUIRE LE BENCHMARK KIT

```js
// benchmark.js

function mesurer(nom, fn, iterations = 1000) {
 // on "chauffe" le moteur JS avant de mesurer pour de vrai
 // (le JIT optimise le code après quelques exécutions, sans warmup
 // tu mesures aussi le coût de cette optimisation, ce qui fausse le résultat)
 for (let i = 0; i < 10; i++) fn();

 const debut = performance.now();

 for (let i = 0; i < iterations; i++) {
  fn();
 }

 const fin = performance.now();
 const dureeTotale = fin - debut;
 const dureeMoyenne = dureeTotale / iterations;

 return {
  nom,
  iterations,
  dureeTotale_ms: Number(dureeTotale.toFixed(3)),
  dureeMoyenne_ms: Number(dureeMoyenne.toFixed(6)),
 };
}

function comparer(candidats, iterations = 1000) {
 // candidats : [{ nom: "...", fn: () => {...} }, ...]
 const resultats = candidats.map(c => mesurer(c.nom, c.fn, iterations));

 // trie du plus rapide au plus lent
 resultats.sort((a, b) => a.dureeMoyenne_ms - b.dureeMoyenne_ms);

 const plusRapide = resultats[0];

 return resultats.map(r => ({
  ...r,
  facteurVsPlusRapide: Number((r.dureeMoyenne_ms / plusRapide.dureeMoyenne_ms).toFixed(2)),
 }));
}

module.exports = { mesurer, comparer };
```

```js
// Utilisation : comparer les deux fonctions de filtrage vues plus haut
const { comparer } = require('./benchmark');

const tableauTest = Array.from({ length: 10000 }, (_, i) => i);

const resultats = comparer([
 { nom: "filter natif", fn: () => filtrerAvecFilter(tableauTest) },
 { nom: "boucle manuelle", fn: () => filtrerAvecBoucle(tableauTest) },
], 5000);

console.table(resultats);
// console.table affiche un tableau lisible directement dans le terminal
```

**Pourquoi le warmup compte :** un moteur JS moderne recompile (JIT) ton code en code machine optimisé après l'avoir vu s'exécuter plusieurs fois. Sans warmup, ta mesure inclut le coût de cette compilation initiale, ce qui peut totalement fausser la comparaison entre deux fonctions.

**Pourquoi le facteur comparatif compte :** "fonction A : 0.002ms, fonction B : 0.0035ms" c'est difficile à interpréter d'un coup d'oeil. "fonction B est 1.75x plus lente que fonction A" se comprend immédiatement.

---

## 4) LE PIÈGE DE LA MESURE UNIQUE

```js
// MAUVAIS : une seule mesure, peu fiable
const debut = performance.now();
maFonction();
const fin = performance.now();
console.log(fin - debut); // peut varier énormément d'une exécution à l'autre
```

```
UNE SEULE EXÉCUTION --> sensible au bruit système (autres process, garbage collector qui se déclenche, etc.)
PLUSIEURS ITÉRATIONS MOYENNÉES --> lisse ce bruit, donne une mesure représentative
```

**Qui casse une conclusion de benchmark :** mesurer une seule fois, tomber sur un moment où le garbage collector (nettoyeur de mémoire) se déclenche pile pendant la mesure, et conclure à tort qu'une fonction est lente alors que c'était un produit ponctuel. Le kit ci-dessus moyenne sur des centaines ou milliers d'itérations pour éviter ce piège.

---

## 5) CE QUE LE BENCHMARK NE TE DIT PAS

```
le benchmark te dit --> QUELLE version est plus rapide, ET DE COMBIEN
le benchmark te dit PAS --> SI cette différence compte vraiment dans ton contexte réel
```

```js
// fonction A : 0.001 ms
// fonction B : 0.002 ms
// B est "2x plus lente" en facteur, mais la différence ABSOLUE est de 0.001 ms
// Sur un appel UNIQUE dans ton app, cette différence est invisible pour l'utilisateur

// Le vrai réflexe : mesurer le facteur ET se demander
// "cette fonction tourne combien de fois dans mon vrai usage ?"
```

**Risque réel :** optimiser une fonction "2x plus rapide" qui ne représente que 0.001ms sur un total de 2000ms de traitement. Le gain réel est invisible, mais le temps passé à l'optimiser, lui, est bien réel.

---

## EXERCICES

EXO 1 : Le duel chronométré :
Implémente le kit ci-dessus, puis compare deux façons de construire une chaîne de caractères à partir d'un tableau de 10 000 éléments : concaténation avec `+=` dans une boucle, vs `array.join("")`. Note le facteur de différence.

EXO 2 : Le piège du warmup :
Modifie temporairement ton kit pour désactiver le warmup (les 10 exécutions avant la vraie mesure). Compare les résultats avec et sans warmup sur la même fonction. Explique en une phrase ce qui a changé et pourquoi.

EXO 3 : Le gain qui compte pas :
Trouve ou invente deux implémentations où l'une est mesurée "3x plus rapide" que l'autre, mais où la différence absolue est inférieure à 0.01ms. Calcule combien de fois il faudrait appeler cette fonction dans une vraie app pour que la différence devienne perceptible (au-delà d'1ms cumulé, par exemple).

---

## RÉSUMÉ

Un benchmark transforme une intuition ("ça a l'air rapide") en mesure vérifiable. `performance.now()` donne la précision nécessaire, mais une seule mesure reste peu fiable : il faut moyenner sur plusieurs itérations et chauffer le moteur JS avant de mesurer pour de vrai. Le facteur comparatif rend les résultats lisibles d'un coup d'oeil, mais un facteur élevé sur une différence absolue minuscule ne veut souvent rien dire en pratique. Mesurer avant d'optimiser, toujours, sinon tu optimises à l'aveugle ce qui te semble lent au lieu de ce qui l'est vraiment. Dans Breaking Bad, Walter White ne touche jamais à une formule sans en valider les paramètres. Il mesure, compare, ajuste. Toi pareil avec ton code.
