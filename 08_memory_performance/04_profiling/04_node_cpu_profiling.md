---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# NODE CPU PROFILING : TROUVER CE QUI BOUFFE LE CPU EN PROD
Temps de lecture ~9 min

DevTools est parfait côté navigateur. Mais en Node, tu n'as pas de flamegraph cliquable dans un onglet. Tu as des processus qui saturent à 100% CPU et des logs qui ne te disent rien. Le profiling Node, c'est un autre outil, un autre workflow, les mêmes principes.

Ce fichier couvre : `--cpu-prof`, la lecture des profils `.cpuprofile`, `clinic.js` pour les prod-like situations, et la différence entre un profil de développement et un profil représentatif.

Prérequis : `01_profiling_basics.md`, `03_devtools_deep_dive.md`.

---

## 1) `--cpu-prof` : LE PROFIL INTÉGRÉ À NODE

Node.js génère un fichier `.cpuprofile` directement sans bibliothèque externe.

```js
// script.js : traitement de données Walking Dead
// on simule une supply chain qui calcule les rations pour 300 survivants
const survivors = Array.from({ length: 300 }, (_, i) => ({
 id: i,
 name: `Survivor_${i}`,
 calories: Math.floor(Math.random() * 2000) + 1500,
}))

function calculateDailyNeed(group) {
 // O(n²) naïf : pour chaque survivant, on recalcule la moyenne du groupe entier
 return group.map(s => {
  const avg = group.reduce((sum, x) => sum + x.calories, 0) / group.length
  return { ...s, surplus: s.calories - avg }
 })
}

// Appel 10 000 fois pour simuler une charge réelle
for (let i = 0; i < 10_000; i++) {
 calculateDailyNeed(survivors)
}
```

```bash
# Lancer avec profiling CPU actif
node --cpu-prof script.js

# Node génère : CPU.20260629.143021.12345.0.001.cpuprofile
# Ce fichier s'ouvre directement dans Chrome DevTools > Performance > Load Profile
```

Ce que tu vois dans le flamegraph : `calculateDailyNeed` → `reduce` → les milliers d'appels imbriqués. La hotspot est immédiatement visible.

---

## 2) LIRE UN `.cpuprofile` SANS CHROME

Tu n'as pas Chrome sur le serveur. Ou tu veux parser programmatiquement.

```js
// analyser-profil.js : lecture directe du fichier .cpuprofile
const fs = require('fs')

const profile = JSON.parse(fs.readFileSync('./mon_profil.cpuprofile', 'utf-8'))

// Les nodes contiennent la call tree (arbre d'appels)
const nodes = profile.nodes

// Trouver les fonctions les plus coûteuses (hitCount élevé)
const hotNodes = nodes
 .filter(n => n.hitCount > 0)
 .sort((a, b) => b.hitCount - a.hitCount)
 .slice(0, 10)

// Afficher les 10 plus coûteuses
hotNodes.forEach(n => {
 const fn = n.callFrame
 console.log(`[${n.hitCount} hits] ${fn.functionName || '(anonymous)'} : ${fn.url}:${fn.lineNumber}`)
})
```

`hitCount` : combien de fois le profiler a "vu" cette fonction active pendant les samples. Plus c'est haut, plus cette fonction mange du CPU.

---

## 3) PROFILING AVEC `clinic.js` : LES DIAGRAMMES QUI PARLENT

`clinic.js` est l'outil standard pour diagnostiquer les problèmes Node en conditions réelles.

```bash
# Installation
npm install -g clinic

# Trois outils disponibles
clinic doctor -- node script.js   # diagnostic général : CPU, event loop, mémoire
clinic flame -- node script.js    # flamegraph interactif
clinic bubbleprof -- node script.js # profil async : temps passé à attendre vs à travailler
```

```bash
# Exemple : diagnostiquer un serveur Express sous charge
# D'abord lancer autocannon (ou wrk) pour générer du trafic
npm install -g autocannon

# Terminal 1 : serveur avec profiling
clinic flame -- node server.js

# Terminal 2 : charge synthétique
autocannon -c 100 -d 10 http://localhost:3000/api/data
# -c 100 : 100 connexions simultanées
# -d 10 : pendant 10 secondes

# clinic génère un .html interactif dans ./node_modules/.clinic/
```

La différence entre `clinic flame` et `--cpu-prof` : clinic génère un flamegraph déjà interprété, coloré par type d'opération (JS user, Node core, V8 internals). Plus lisible, moins brut.

---

## 4) IDENTIFIER UN EVENT LOOP BLOCK

Le cas le plus fréquent en prod Node : une opération CPU-intensive qui bloque l'event loop.

```js
// server.js : Walking Dead camp management API
const http = require('http')

function computeOptimalRotation(survivors) {
 // Tri + calcul : opération synchrone coûteuse
 // Sur 10 000 survivants, ça prend ~200ms
 return survivors
  .sort((a, b) => a.fatigue - b.fatigue)
  .map((s, i) => ({ ...s, shift: i % 3 }))
}

const server = http.createServer((req, res) => {
 if (req.url === '/rotate') {
  // PROBLÈME : cette opération bloque pendant ~200ms
  // pendant ce temps, AUCUNE autre requête ne peut être traitée
  const rotation = computeOptimalRotation(generateSurvivors(10_000))
  res.end(JSON.stringify(rotation))
 } else {
  res.end('camp is up')
 }
})

server.listen(3000)
```

```bash
# clinic bubbleprof identifie précisément le blocage
clinic bubbleprof -- node server.js
```

Dans le rapport bubbleprof, tu vois le temps passé dans les callbacks async vs le temps bloqué en synchrone. Si la bulle "sync" est énorme : c'est ici que ça bloque.

La solution : `worker_threads` pour sortir le calcul lourd du main thread (voir `15_runtime_env/05_worker_threads.md`).

---

## 5) CAS QUI CASSE (mais fun)

```js
// Profiler un script qui démarre et finit immédiatement : résultat inutile
node --cpu-prof script-qui-finit-en-5ms.js
// Le fichier .cpuprofile contient quelques centaines de samples
// Impossible de voir quoi que ce soit : la résolution est trop basse

// Règle : pour qu'un profil CPU soit exploitable, le script doit tourner
// au minimum 2-3 secondes avec une charge représentative
// Moins de ça : le profil ne contient pas assez de samples pour être fiable
```

Deuxième cas : profiler en mode development avec `--inspect` actif.

```bash
# Ne pas faire ça
node --inspect --cpu-prof server.js
# L'inspecteur V8 et le CPU profiler partagent les mêmes hooks internes
# Sur certaines versions Node : le profil est inexact ou incomplet
# Profiler en mode production, pas en mode debug
```

Troisième cas : le profil qui montre `(program)` partout.

```
[843 hits] (program)
[12 hits] calculateSurvivorNeeds
```

`(program)` avec un hitCount très élevé = l'overhead du runtime JS lui-même. Ça n'indique pas de hotspot dans ton code. Si tu vois ça : ton vrai problème est peut-être dans les I/O, pas dans le CPU : utilise `clinic bubbleprof` à la place de `clinic flame`.

---

## EXERCICES

## EXO 1 : DIAGNOSTIQUER LA SUPPLY CHAIN
_~20 min_

La supply chain de Breaking Bad calcule les routes optimales pour 500 points de distribution. Sur 50 000 recalculs, ça prend 8 secondes.

Lance `--cpu-prof` sur le script, identifie la fonction la plus coûteuse dans le rapport, et propose une optimisation (mémoïsation, réduction de la complexité, ou sortie vers un worker).

Contrainte : tu ne peux pas changer l'algorithme de base. Tu dois d'abord mesurer, puis cibler uniquement la hotspot réelle.

(Indice : génère d'abord 50 000 appels à une fonction O(n²) simple sur un tableau de 500 éléments, lance le profil, lis le hitCount)

---

## EXO 2 : EVENT LOOP BLOCKED
_~15 min_

Un serveur Express calcule un classement de joueurs de façon synchrone à chaque requête. Il semble lent sous charge mais les logs ne disent rien.

Utilise `clinic doctor` ou `clinic flame` pour identifier le blocage. Documente ce que tu observes : quelle section du flamegraph est saturée, quelle est la durée approximative du blocage par requête.

(Indice : simule une charge avec `autocannon -c 50 -d 5 http://localhost:3000/rank` et observe les latences qui explosent)

---

## EXO 3 : LIRE UN PROFIL À LA MAIN
_~10 min_

Ouvre le fichier `.cpuprofile` généré dans l'EXO 1 directement dans un éditeur. Structure JSON.

Écris un script Node qui lit ce fichier et affiche : les 5 fonctions avec le plus haut `hitCount`, leur `url` (fichier source), et leur `lineNumber`.

Compare ton résultat avec ce que Chrome DevTools montrait graphiquement : tu dois obtenir les mêmes fonctions.

---

## RÉSUMÉ

`--cpu-prof` génère un `.cpuprofile` lisible dans Chrome DevTools ou parsable en JSON. Utilise-le pour les hotspots évidents dans des scripts Node simples.

`clinic flame` génère un flamegraph interactif annoté. Utilise-le quand tu veux un diagnostic rapide sous charge réelle avec moins de friction.

`clinic bubbleprof` visualise le temps async : temps de travail vs temps d'attente. Utilise-le quand tu suspectes un event loop block ou des problèmes de concurrence async.

Un profil n'est valide que si le script tourne assez longtemps avec une charge représentative. Profiler 50ms de startup ne donne rien d'exploitable.

Ne pas confondre hitCount élevé sur `(program)` (overhead du runtime) avec une vraie hotspot dans ton code : si `(program)` domine, le problème est probablement dans les I/O ou le GC, pas dans un algorithme.
