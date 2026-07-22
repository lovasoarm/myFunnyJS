---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# DEVTOOLS DEEP DIVE : LIRE UN FLAMEGRAPH
Temps de lecture ~9 min

Le flamegraph est le radiographie de ton code sous charge.
Il te dit exactement quelle fonction tourne, combien de temps, et ce qu'elle a appelé.

Sans lui, t'optimises à l'aveugle.
Avec lui, tu vois le vrai coupable.

---

## 1) COMPRENDRE LA STRUCTURE DU FLAMEGRAPH

Un flamegraph se lit de bas en haut.

```
           [ filtrerJoueurs ] ← fonction qui prend 60% du temps
       [ chargerStats ] [ trierParScore ]
    [ fetchAPI ]          [ comparateur ]
[ main ]
```

- Le bas = le point d'entrée (la fonction appelante)
- Le haut = les feuilles (les fonctions terminales)
- La largeur = le temps passé

Plus une barre est large, plus cette fonction coûte cher.
Tu cherches les barres larges en haut de la pile : c'est là que c'est lent.

---

## 2) ENREGISTRER UN PROFIL

```
DevTools > Performance > bouton Record (rouge)
Fais l'action lente dans l'app
Stop
```

L'enregistrement génère trois zones :

**CPU chart** (en haut) : la consommation CPU dans le temps. Un pic = quelque chose de lourd s'exécute.

**Main thread** (au milieu) : les tâches sur le thread principal. C'est là que tu vois les blocs de code.

**Flamechart** (en bas) : la pile d'appels à chaque instant. C'est là que tu lis qui appelle quoi.

---

## 3) LES ZONES DE COULEUR

Chaque couleur représente une catégorie de travail :

```
Jaune (Scripting) → ton JavaScript s'exécute
Violet (Rendering) → le browser calcule les styles et le layout
Vert (Painting)  → le browser peint les pixels
Gris (Other/Idle) → système, extensions, attente
```

Si tu vois beaucoup de jaune sur une action : ton JS est lent.
Si tu vois beaucoup de violet : tu forces trop de reflows.
Si tu vois beaucoup de vert : tu peins trop souvent.

---

## 4) LIRE UNE TÂCHE LONGUE

Une tâche de plus de 50ms est marquée en rouge dans DevTools. C'est un "Long Task".
Au-delà de 50ms, le navigateur ne peut plus répondre aux inputs utilisateur.
Résultat : l'interface semble figée. Mauvais INP. Mauvais Ballon d'Or de l'UX.

```
DevTools > Performance > Long Tasks section
```

Clique sur une Long Task. Tu vois la pile d'appels complète.
Cherche la fonction la plus large en haut : c'est le coupable.

---

## 5) EXEMPLE CONCRET : ANALYSER LE DASHBOARD DES ULTRAS

Imagine ce code sur le dashboard live :

```js
function mettreAJourDashboard(events) {
 // appelée 200 fois par minute pendant un match
 const stats = calculerStats(events); // 30ms ?
 const heatmap = genererHeatmap(events); // 80ms ?
 const classement = trierJoueurs(stats); // 5ms ?

 afficherDashboard(stats, heatmap, classement); // 2ms
}

function genererHeatmap(events) {
 // boucle naïve : O(n²):passe chaque event contre chaque zone
 return zones.map((zone) => {
  return events.filter((e) => estDansZone(e, zone)).length;
 });
}
```

Dans le flamegraph, tu verrais :

```
[mettreAJourDashboard : 117ms]
 [calculerStats : 30ms] [genererHeatmap : 80ms] [trierJoueurs : 5ms]
              [estDansZone x 10000]
```

La heatmap prend 80ms sur 117ms. Et c'est `estDansZone` appelé 10 000 fois.
Solution : O(n) au lieu de O(n²) : trier les events par zone une fois, pas à chaque zone.

```js
function genererHeatmapOptimisee(events) {
 // O(n) : un seul passage sur les events
 const comptes = {};

 for (const event of events) {
  const zone = determinerZone(event); // O(1)
  comptes[zone] = (comptes[zone] || 0) + 1;
 }

 return zones.map((zone) => comptes[zone] || 0);
}
```

Résultat dans DevTools après : `genererHeatmap : 4ms`.

---

## 6) LES MARKERS DANS LE FLAMEGRAPH

Les `performance.mark()` de la leçon précédente apparaissent dans DevTools.
C'est utile pour identifier ta propre logique dans le flux d'exécution.

```js
// le pipeline de validation de oracle_glitch
performance.mark("validation-debut");

const parsed = parseOutput(rawLLMOutput);
performance.mark("parse-ok");

const validated = validateWithZod(parsed);
performance.mark("zod-ok");

const sanitized = sanitizeOutput(validated);
performance.mark("sanitize-ok");

performance.measure("étape-parse", "validation-debut", "parse-ok");
performance.measure("étape-zod", "parse-ok", "zod-ok");
performance.measure("étape-sanitize", "zod-ok", "sanitize-ok");
```

Dans DevTools Performance, tu verras tes markers comme des balises colorées dans la timeline.
Tu sais exactement où dans le flamegraph se trouve chaque étape de ton code.

---

## 7) IDENTIFIER UN REFLOW FORCÉ

Un reflow forcé (Forced Synchronous Layout), c'est quand ton JS lit une propriété de layout
juste après avoir modifié le DOM. Le browser est forcé de recalculer tout le layout immédiatement.

```js
// code qui force un reflow à chaque itération
function mettreAJourCarteJoueurs(joueurs) {
 joueurs.forEach((joueur) => {
  const el = document.getElementById(`joueur-${joueur.id}`);
  el.style.width = "200px"; // write : invalide le layout
  const hauteur = el.offsetHeight; // read : force le recalcul immédiat
  el.style.height = hauteur * 1.5 + "px"; // write à nouveau
 });
}
// 50 joueurs = 50 reflows forcés
```

Dans DevTools, tu verras un triangle rouge "Forced reflow" dans la tâche.

```js
// correction : séparer les reads des writes
function mettreAJourCarteJoueurs(joueurs) {
 // phase READ : tout lire d'abord
 const hauteurs = joueurs.map((joueur) => {
  const el = document.getElementById(`joueur-${joueur.id}`);
  return el.offsetHeight; // lecture batch
 });

 // phase WRITE : tout écrire ensuite
 joueurs.forEach((joueur, i) => {
  const el = document.getElementById(`joueur-${joueur.id}`);
  el.style.width = "200px";
  el.style.height = hauteurs[i] * 1.5 + "px";
 });
}
// 1 reflow au lieu de 50
```

---

## 8) WORKFLOW COMPLET

```
1. Identifier le problème visible
  "le dashboard lag quand un but est marqué"

2. Enregistrer pendant le problème
  DevTools > Performance > Record > déclencher l'action > Stop

3. Trouver la Long Task
  Chercher la barre rouge dans le CPU chart

4. Cliquer sur la Long Task
  Voir la pile d'appels dans le flamechart

5. Identifier la barre la plus large en haut de la pile
  C'est la fonction qui coûte le plus

6. Lire le call stack complet
  Qui a appelé quoi pour arriver là

7. Optimiser la fonction identifiée

8. Ré-enregistrer et comparer
  La Long Task doit avoir disparu ou réduit
```

---

## EXERCICES

## EXO 1 : LIRE UN FLAMEGRAPH TEXTUEL

Voici une représentation simplifiée d'un flamegraph. Réponds aux questions.

```
[handleMatchEvent : 143ms]
 [mettreAJourStats : 12ms] [calculerXG : 118ms]      [logEvent : 2ms]
                [evaluerTirs x 200 : 115ms]
                 [distanceAuBut : 80ms]
                  [Math.sqrt x 200 : 78ms]
```

Questions :

- Quelle fonction est le coupable principal ?
- Quelle est la complexité probable de `evaluerTirs` ?
- Que ferais-tu pour optimiser `distanceAuBut` qui appelle `Math.sqrt` 200 fois ?
- Si `handleMatchEvent` est appelée 200 fois par minute, quel est l'impact sur le thread principal ?

---

## EXO 2 : CORRIGER LE REFLOW

Ce code provoque des reflows forcés. Identifie-les et réécris sans reflow.

```js
function animerClassementBallonDor(candidats) {
 candidats.forEach((candidat, index) => {
  const el = document.querySelector(`[data-id="${candidat.id}"]`);
  const largeurActuelle = el.offsetWidth; // lecture
  const position = el.getBoundingClientRect().top; // lecture

  el.style.transform = `translateY(${index * 60}px)`; // écriture
  el.style.width = largeurActuelle > 200 ? "200px" : largeurActuelle + "px"; // écriture

  const nouvelleLargeur = el.offsetWidth; // lecture après écriture = reflow forcé
  console.log(`${candidat.nom} : ${nouvelleLargeur}px`);
 });
}
```

---

## EXO 3 : BENCHMARK ET FLAMEGRAPH SIMULÉ

Implémente ces deux versions de la même fonction. Mesure-les avec le benchmark de la leçon 01.
Prédit ce que tu verrais dans un flamegraph pour chacune.

```js
const matchEvents = Array.from({ length: 5000 }, (_, i) => ({
 id: i,
 type: ["passe", "tir", "duel", "faute"][i % 4],
 x: Math.random() * 100,
 y: Math.random() * 100,
 joueur: `Joueur_${i % 22}`,
}));

// version A : O(n²)
function analyserMatchV1(events) {
 return events.map((event) => {
  const eventsDuJoueur = events.filter((e) => e.joueur === event.joueur);
  return {
   ...event,
   totalActionsJoueur: eventsDuJoueur.length,
  };
 });
}

// version B : O(n):à toi de l'implémenter
function analyserMatchV2(events) {
 // précalculer les comptes par joueur d'abord
 // puis construire le résultat en un seul passage
}
```

Compare les résultats. Sur 5000 events, la différence doit être nette.

---

## RÉSUMÉ

Le flamegraph se lit de bas en haut : la barre la plus large en haut est le coupable.
Les couleurs révèlent le type de travail : jaune (JS), violet (layout), vert (paint).
Une Long Task dépasse 50ms : au-delà, l'interface ne répond plus.
Les reflows forcés arrivent quand tu lis une propriété de layout juste après avoir écrit dans le DOM.
Le workflow : voir le lag → enregistrer → trouver la Long Task → identifier la barre large → optimiser → remesurer.
`performance.mark()` place tes repères directement dans le flamegraph.
