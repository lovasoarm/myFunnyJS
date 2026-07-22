---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# GREEDY EN CONDITIONS RÉELLES : CONTRAINTES, PRIORITÉS, DEADLINES
Temps de lecture ~12 min

Le greedy des livres : trier et itérer. Le greedy en prod : plusieurs contraintes simultanées, des priorités qui changent, des deadlines qui se chevauchent. La mécanique reste la même : choix local optimal à chaque étape. Mais définir ce que "optimal" veut dire, c'est là que tout se joue.

Ce fichier, c'est du greedy appliqué sur des problèmes qui ressemblent à ce qu'on code vraiment : scheduling de tâches, affectation de ressources, optimisation sous contraintes.

---

## 1) JOB SCHEDULING AVEC DEADLINES

N tâches. Chacune a un profit et une deadline (elle doit être terminée avant ce temps). Une seule tâche s'exécute à la fois. Chaque tâche prend exactement 1 unité de temps. Maximiser le profit total.

**Choix greedy :** trier par profit décroissant. Pour chaque tâche, la placer dans le slot disponible le plus tardif avant sa deadline.

Pourquoi le slot le plus tardif ? Pour garder les slots tôt libres pour des tâches avec des deadlines courtes.

```js
function jobScheduling(jobs) {
 // trier par profit décroissant : les plus rentables d'abord
 const sorted = [...jobs].sort((a, b) => b.profit - a.profit);

 const maxDeadline = Math.max(...jobs.map((j) => j.deadline));

 // tableau de slots : null = libre
 const slots = new Array(maxDeadline).fill(null);
 let totalProfit = 0;

 for (const job of sorted) {
  // chercher le slot disponible le plus tardif avant la deadline
  for (let t = job.deadline - 1; t >= 0; t--) {
   if (slots[t] === null) {
    slots[t] = job.id;
    totalProfit += job.profit;
    break; // slot trouvé, tâche placée
   }
  }
  // si aucun slot libre avant la deadline : tâche abandonnée
 }

 return {
  schedule: slots.filter(Boolean),
  totalProfit,
  slots,
 };
}

// La squad de Naruto doit compléter des missions S-rank avant les deadlines du Hokage
const missions = [
 { id: "M1", profit: 100, deadline: 2 }, // +100 si finie avant t=2
 { id: "M2", profit: 19, deadline: 1 },
 { id: "M3", profit: 27, deadline: 2 },
 { id: "M4", profit: 25, deadline: 1 },
 { id: "M5", profit: 15, deadline: 3 },
];

const result = jobScheduling(missions);
console.log(result.schedule); // ['M2' ou 'M4', 'M1', 'M5'] selon l'ordre
console.log(result.totalProfit); // 142
```

**Trace :**

```
Tri par profit : M1(100), M3(27), M4(25), M2(19), M5(15)

M1 deadline=2 : slot t=1 libre ? oui -> slots[1] = M1, profit=100
M3 deadline=2 : slot t=1 pris, t=0 libre ? oui -> slots[0] = M3, profit=127
M4 deadline=1 : slot t=0 pris -> aucun slot avant deadline=1, skip
M2 deadline=1 : slot t=0 pris -> skip
M5 deadline=3 : slot t=2 libre ? oui -> slots[2] = M5, profit=142

Schedule : [M3, M1, M5], profit = 142
```

---

## 2) AFFECTATION DE TÂCHES À DES WORKERS

N tâches, M workers. Chaque tâche a une durée. Minimiser le temps total (makespan) : le moment où toutes les tâches sont finies.

**Choix greedy :** trier les tâches par durée décroissante (les plus longues d'abord), les affecter au worker le moins chargé.

Heuristique LPT (Longest Processing Time first) : prouvée à max 4/3 de l'optimal. Pas parfaite, mais très bonne.

```js
function lptScheduling(tasks, workerCount) {
 // tâches les plus longues en premier : elles sont les plus difficiles à caser
 const sorted = [...tasks].sort((a, b) => b.duration - a.duration);

 // charge de chaque worker : initialement 0
 const load = new Array(workerCount).fill(0);
 const assignments = Array.from({ length: workerCount }, () => []);

 for (const task of sorted) {
  // trouver le worker avec la charge minimale
  const minLoad = Math.min(...load);
  const workerIdx = load.indexOf(minLoad);

  assignments[workerIdx].push(task);
  load[workerIdx] += task.duration;
 }

 return {
  assignments,
  makespan: Math.max(...load), // quand le dernier worker finit
  loads: load,
 };
}

// L'équipe de Breaking Bad : répartir les étapes de production
const tasks = [
 { name: "Synthèse Blue Sky", duration: 8 },
 { name: "Conditionnement", duration: 6 },
 { name: "Contrôle qualité", duration: 4 },
 { name: "Emballage lot 1", duration: 3 },
 { name: "Emballage lot 2", duration: 3 },
 { name: "Transport", duration: 2 },
];

const result = lptScheduling(tasks, 2); // Walter + Jesse
console.log(result.makespan); // 13
// Worker 0 : [8, 3, 2] = 13
// Worker 1 : [6, 4, 3] = 13:parfaitement équilibré ici
```

---

## 3) INTERVAL SCHEDULING MAXIMIZATION (WEIGHTED)

Activités avec un poids/profit. Pas de contrainte 1-slot-par-unité-de-temps. Deux activités se chevauchent si elles s'intersectent. Maximiser le profit total sans chevauchement.

Ce problème est la frontière exacte où greedy (non pondéré) cède à la DP (pondéré).

```js
// Version non pondérée : greedy fonctionne (tri par end time, vu dans greedy_basics)

// Version pondérée : greedy échoue
// Contre-exemple :
// A : [0, 10], profit 10
// B : [0, 3], profit 5
// C : [5, 10], profit 5
//
// greedy (profit) : A = 10
// DP optimal : B + C = 10 (ex-aequo ici, mais si B=6 et C=6 : DP gagne avec 12 vs 10)

// Solution DP pour la version pondérée :
function weightedIntervalScheduling(intervals) {
 // trier par heure de fin
 const sorted = [...intervals].sort((a, b) => a.end - b.end);
 const n = sorted.length;

 // p[i] = index de la dernière interval qui finit avant que i commence
 const p = sorted.map((curr, i) => {
  for (let j = i - 1; j >= 0; j--) {
   if (sorted[j].end <= curr.start) return j;
  }
  return -1;
 });

 // dp[i] = profit max en considérant les intervals 0..i
 const dp = new Array(n + 1).fill(0);
 for (let i = 1; i <= n; i++) {
  const curr = sorted[i - 1];
  // choix : prendre l'interval i (profit + dp[p[i-1]+1]) ou ne pas la prendre (dp[i-1])
  const take = curr.profit + (p[i - 1] >= 0 ? dp[p[i - 1] + 1] : 0);
  dp[i] = Math.max(dp[i - 1], take);
 }

 return dp[n];
}
```

---

## 4) HUFFMAN ENCODING : GREEDY SUR UN ARBRE

Compression de données. Chaque caractère a une fréquence. Construire un arbre binaire qui minimise la longueur totale encodée.

**Choix greedy :** fusionner toujours les deux noeuds de fréquence minimale.

C'est un des rares cas où greedy est prouvé optimal sur une structure d'arbre.

```js
class HuffmanNode {
 constructor(char, freq, left = null, right = null) {
  this.char = char;
  this.freq = freq;
  this.left = left;
  this.right = right;
 }
}

function buildHuffmanTree(text) {
 // compter les fréquences
 const freq = {};
 for (const char of text) freq[char] = (freq[char] || 0) + 1;

 // min-heap simulé avec un tableau trié (version simplifiée)
 let nodes = Object.entries(freq).map(([char, f]) => new HuffmanNode(char, f));

 while (nodes.length > 1) {
  // trier par fréquence : les plus faibles d'abord
  nodes.sort((a, b) => a.freq - b.freq);

  // fusionner les deux noeuds de fréquence minimale
  const left = nodes.shift();
  const right = nodes.shift();
  const merged = new HuffmanNode(null, left.freq + right.freq, left, right);
  nodes.push(merged);
 }

 return nodes[0]; // racine de l'arbre
}

function getHuffmanCodes(node, prefix = "", codes = {}) {
 if (!node) return codes;
 if (node.char !== null) {
  codes[node.char] = prefix || "0"; // cas d'un seul caractère
  return codes;
 }
 getHuffmanCodes(node.left, prefix + "0", codes);
 getHuffmanCodes(node.right, prefix + "1", codes);
 return codes;
}

// Compression d'un message SZA
const text = "trapsoul";
const tree = buildHuffmanTree(text);
const codes = getHuffmanCodes(tree);
console.log(codes);
// chaque char a un code binaire, les plus fréquents ont les codes les plus courts
```

---

## 5) GREEDY AVEC PRIORITÉS DYNAMIQUES : SIMULATION

Quand les priorités changent à chaque pas (nouvelles tâches arrivent, deadlines se rapprochent), greedy statique ne suffit plus. On utilise une priority queue pour maintenir le choix optimal en temps réel.

```js
// Simulation d'un scheduler de tâches avec arrivées dynamiques
class PriorityQueue {
 constructor(compareFn) {
  this.heap = [];
  this.compare = compareFn;
 }

 push(item) {
  this.heap.push(item);
  this.heap.sort(this.compare); // simplification : en prod, utiliser un vrai heap
 }

 pop() {
  return this.heap.shift();
 }
 peek() {
  return this.heap[0];
 }
 get size() {
  return this.heap.length;
 }
}

function greedyDynamicScheduler(taskStream, processTime) {
 // taskStream : [{task, arrivalTime, priority}]
 // processTime : combien de temps prend chaque tâche

 const pq = new PriorityQueue((a, b) => b.priority - a.priority);
 let currentTime = 0;
 let taskIdx = 0;
 const completed = [];

 while (taskIdx < taskStream.length || pq.size > 0) {
  // faire entrer toutes les tâches arrivées jusqu'à currentTime
  while (
   taskIdx < taskStream.length &&
   taskStream[taskIdx].arrivalTime <= currentTime
  ) {
   pq.push(taskStream[taskIdx]);
   taskIdx++;
  }

  if (pq.size === 0) {
   // rien en queue, sauter jusqu'à la prochaine arrivée
   currentTime = taskStream[taskIdx]?.arrivalTime ?? currentTime;
   continue;
  }

  // exécuter la tâche de priorité maximale
  const task = pq.pop();
  currentTime += processTime;
  completed.push({ ...task, completedAt: currentTime });
 }

 return completed;
}
```

---

## 6) LE PIÈGE : GREEDY AVEC DES CONTRAINTES COUPLÉES

Quand une décision greedy affecte les options futures de façon non triviale, greedy peut paraître optimal localement tout en dégradant fortement la solution globale.

```js
// Problème : assigner des étudiants à des cours
// Chaque étudiant a des préférences ordonnées
// Chaque cours a une capacité maximale

// Greedy naïf : chaque étudiant prend son premier choix disponible
// Problème : un étudiant qui prend un cours populaire peut bloquer
//      d'autres étudiants qui n'ont ce cours qu'en premier choix

// Solution correcte : algorithme de Gale-Shapley (stable matching)
// => ni greedy pur, ni DP : une classe à part
// => preuve que "optimal localement" peut créer des situations instables globalement
```

---

## EXERCICES

## EXO 1 : LE TOURNOI DES CAPITAINES DE CHAMPIONS LEAGUE
_~20 min_


8 équipes. Chaque équipe a un match de qualification dans les prochaines 5 semaines. Un match prend 1 semaine. Chaque match a un gain de points UEFA. Chaque équipe ne peut jouer qu'un match par semaine. Maximiser les points totaux pour chaque équipe.

```js
const matchCalendar = [
 { team: "Real Madrid", week: 1, points: 3 },
 { team: "Real Madrid", week: 1, points: 1 },
 { team: "Real Madrid", week: 2, points: 3 },
 { team: "Real Madrid", week: 3, points: 2 },
 // ... plus de matchs
];
```

Implémenter `optimizeMatchSchedule(calendar)`. Pour chaque équipe, planifier les matchs qui maximisent les points. Un match par semaine par équipe.

---

## EXO 2 : LA RADIO TRAPSOUL
_~15 min_


La radio trapsoul doit programmer des sessions d'artistes. Chaque session a :

- une durée (en minutes)
- un score d'audience estimé
- une contrainte : doit passer avant une heure limite

Capacité totale de la radio : 180 minutes par jour. Maximiser l'audience totale.

```js
const sessions = [
 { artist: "SZA", duration: 45, audience: 9200, deadline: 120 },
 { artist: "Bryson Tiller", duration: 30, audience: 7400, deadline: 90 },
 { artist: "Frank Ocean", duration: 60, audience: 11000, deadline: 180 },
 { artist: "The Weeknd", duration: 40, audience: 8800, deadline: 100 },
 { artist: "H.E.R.", duration: 35, audience: 6500, deadline: 150 },
];
```

Implémenter `programRadio(sessions, totalMinutes)`. Retourner la liste des sessions choisies et l'audience totale.

(indice : c'est un fractional knapsack si on peut couper les sessions, 0/1 knapsack si non)

---

## EXO 3 : BENCHMARK GREEDY VS DP
_~25 min_


Implémenter les deux versions du weighted interval scheduling (greedy et DP). Générer 100 intervalles aléatoires avec des profits aléatoires. Comparer les résultats des deux approches sur 20 instances. Dans combien de cas greedy donne l'optimal ? Dans combien de cas il sous-performe ?

---

## RÉSUMÉ

Le greedy en conditions réelles, c'est choisir la bonne définition de "optimal" à chaque étape. Job scheduling : optimal = profit le plus élevé, placé dans le slot le plus tardif. LPT scheduling : optimal = donner la tâche la plus longue au worker le moins chargé. Huffman : optimal = fusionner les deux fréquences les plus basses. Quand les priorités changent dynamiquement, une priority queue remplace le tri statique. La ligne rouge reste la même qu'en `01_greedy_basics` : dès que les décisions sont couplées et qu'un choix maintenant peut bloquer une meilleure combinaison plus tard, greedy cède à la DP.
