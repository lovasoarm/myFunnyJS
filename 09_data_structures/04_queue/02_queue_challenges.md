---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# QUEUE EN ACTION : LES VRAIS PROBLÈMES
Temps de lecture ~11 min

Tu connais la structure. Maintenant t'as besoin de savoir quand et comment t'en servir.
La queue résout trois types de problèmes distincts :

- simuler un système de traitement ordonné (tickets, missions, jobs)
- parcourir un graphe en largeur (BFS)
- gérer des streams d'événements sans perdre l'ordre

Ces trois là, tu vas les croiser en prod.

---

## 1) SIMULATION : LE SYSTÈME DE TICKETS DU CONSEIL DE SURVEILLANCE

Dans Garo, le Conseil de Surveillance reçoit des rapports de mission.
Chaque Chevalier soumet un rapport. Ils sont traités dans l'ordre d'arrivée.
Un opérateur traite un rapport à la fois. Si le Conseil est surchargé, les rapports s'accumulent.

```js
class TicketSystem {
 constructor(operateurs = 1) {
  this.queue = new Queue(); // les tickets en attente
  this.operateurs = operateurs; // capacité de traitement parallèle
  this.enTraitement = []; // tickets actifs
  this.traites = []; // historique
 }

 soumettre(chevalier, rapport) {
  const ticket = {
   id: Date.now() + Math.random(),
   chevalier,
   rapport,
   soumisA: Date.now(),
  };
  this.queue.enqueue(ticket);
  console.log(
   `Ticket soumis par ${chevalier} : position : ${this.queue.size}`,
  );
  return ticket.id;
 }

 traiterProchain() {
  if (this.queue.isEmpty()) {
   console.log("Aucun rapport en attente");
   return null;
  }

  if (this.enTraitement.length >= this.operateurs) {
   console.log("Tous les opérateurs sont occupés");
   return null;
  }

  const ticket = this.queue.dequeue();
  ticket.debutTraitement = Date.now();
  this.enTraitement.push(ticket);

  // simuler un traitement asynchrone
  setTimeout(() => {
   this.finaliser(ticket.id);
  }, Math.random() * 1000);

  return ticket;
 }

 finaliser(id) {
  const index = this.enTraitement.findIndex((t) => t.id === id);
  if (index === -1) return;

  const ticket = this.enTraitement.splice(index, 1)[0];
  ticket.finTraitement = Date.now();
  ticket.duree = ticket.finTraitement - ticket.debutTraitement;
  this.traites.push(ticket);

  console.log(`Rapport de ${ticket.chevalier} traité en ${ticket.duree}ms`);

  // automatiquement on prend le suivant
  this.traiterProchain();
 }

 stats() {
  return {
   enAttente: this.queue.size,
   enTraitement: this.enTraitement.length,
   traites: this.traites.length,
   tempsMovenMs: this.traites.length
    ? Math.round(
      this.traites.reduce((sum, t) => sum + t.duree, 0) /
       this.traites.length,
     )
    : 0,
  };
 }
}
```

Ce pattern : queue + pool d'workers = base de tout système de jobs distribués.
Celery en Python, Bull en Node, AWS SQS : c'est la même logique.

---

## 2) BFS : PARCOURIR UN GRAPHE EN LARGEUR

BFS (Breadth-First Search) : explorer un graphe niveau par niveau.
T'explores tous les voisins directs avant d'aller plus loin.

Pourquoi une queue ? Parce que FIFO garantit que tu traites les noeuds par distance croissante.
Avec une stack (DFS), t'irais en profondeur d'abord : chemin le plus long, pas le plus court.

```
Graphe :
  A
  / \
 B  C
 / \  \
D  E  F

BFS depuis A :
niveau 0 : [A]
niveau 1 : [B, C]
niveau 2 : [D, E, F]

ordre de visite : A --> B --> C --> D --> E --> F
```

```js
function bfs(graphe, depart) {
 // graphe = { "A": ["B", "C"], "B": ["D", "E"], "C": ["F"], ... }

 const queue = new Queue();
 const visites = new Set(); // éviter les cycles
 const ordre = [];

 queue.enqueue(depart);
 visites.add(depart);

 while (!queue.isEmpty()) {
  const noeud = queue.dequeue();
  ordre.push(noeud);

  const voisins = graphe[noeud] || [];

  for (const voisin of voisins) {
   if (!visites.has(voisin)) {
    visites.add(voisin); // marquer AVANT d'enqueue
    queue.enqueue(voisin); // pas après:sinon doublons possibles
   }
  }
 }

 return ordre;
}

// Exemple : réseau de Chevaliers d'Or
const reseau = {
 Leon: ["Alfonso", "Mendoza"],
 Alfonso: ["Ryuga", "German"],
 Mendoza: ["German"],
 Ryuga: [],
 German: ["Ryuga"],
};

bfs(reseau, "Leon");
// => ["Leon", "Alfonso", "Mendoza", "Ryuga", "German"]
```

Le piège qui revient tout le temps : marquer un noeud comme visité quand on l'**enqueue**, pas quand on le **déqueue**.
Si tu marques au déqueue, le même noeud peut être enqueue plusieurs fois avant d'être traité.
Résultat : boucles infinies sur les graphes avec cycles.

---

## 3) CHEMIN LE PLUS COURT AVEC BFS

BFS garantit le chemin le plus court en nombre d'arêtes (graphe non pondéré).
Dijkstra c'est pour les graphes pondérés : on verra ça dans `10_algorithms`.
Pour les grilles, les labyrinthes, les réseaux sans poids : BFS est la bonne arme.

```js
function cheminLePlusCourt(graphe, depart, arrivee) {
 if (depart === arrivee) return [depart];

 const queue = new Queue();
 const visites = new Set();
 // stocker le chemin complet jusqu'à chaque noeud
 // pas juste le noeud
 const chemins = new Map();

 queue.enqueue(depart);
 visites.add(depart);
 chemins.set(depart, [depart]);

 while (!queue.isEmpty()) {
  const noeud = queue.dequeue();
  const cheminActuel = chemins.get(noeud);

  const voisins = graphe[noeud] || [];

  for (const voisin of voisins) {
   if (!visites.has(voisin)) {
    const nouveauChemin = [...cheminActuel, voisin];
    chemins.set(voisin, nouveauChemin);

    if (voisin === arrivee) {
     return nouveauChemin; // on arrête dès qu'on trouve
    }

    visites.add(voisin);
    queue.enqueue(voisin);
   }
  }
 }

 return null; // pas de chemin entre depart et arrivee
}

// Trouver le chemin entre deux ninjas dans le réseau de Konoha
const konoha = {
 Naruto: ["Sasuke", "Sakura", "Kakashi"],
 Sasuke: ["Naruto", "Orochimaru"],
 Sakura: ["Naruto", "Tsunade"],
 Kakashi: ["Naruto", "Minato"],
 Minato: ["Kakashi"],
 Tsunade: ["Sakura"],
 Orochimaru: ["Sasuke"],
};

cheminLePlusCourt(konoha, "Minato", "Orochimaru");
// => ["Minato", "Kakashi", "Naruto", "Sasuke", "Orochimaru"]
```

---

## 4) BFS SUR UNE GRILLE : LE LABYRINTHE

La grille 2D c'est juste un graphe où chaque cellule a jusqu'à 4 voisins (haut, bas, gauche, droite).
BFS trouve le chemin le plus court en nombre de cases.

```js
function labyrintheBFS(grille, depart, arrivee) {
 // grille[ligne][col] : 0 = libre, 1 = mur
 // depart / arrivee : [ligne, col]

 const lignes = grille.length;
 const cols = grille[0].length;
 const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
 ]; // haut, bas, gauche, droite

 const queue = new Queue();
 const visites = new Set();
 const parent = new Map(); // pour reconstruire le chemin

 const cle = (l, c) => `${l},${c}`;

 queue.enqueue(depart);
 visites.add(cle(...depart));

 while (!queue.isEmpty()) {
  const [l, c] = queue.dequeue();

  if (l === arrivee[0] && c === arrivee[1]) {
   // reconstruire le chemin depuis la destination
   const chemin = [];
   let pos = cle(l, c);

   while (pos) {
    chemin.unshift(pos.split(",").map(Number));
    pos = parent.get(pos);
   }

   return chemin;
  }

  for (const [dl, dc] of directions) {
   const nl = l + dl;
   const nc = c + dc;
   const k = cle(nl, nc);

   if (
    nl >= 0 &&
    nl < lignes &&
    nc >= 0 &&
    nc < cols &&
    grille[nl][nc] === 0 &&
    !visites.has(k)
   ) {
    visites.add(k);
    parent.set(k, cle(l, c));
    queue.enqueue([nl, nc]);
   }
  }
 }

 return null; // aucun chemin
}

// Le plan d'évasion de Michael Scofield
const prison = [
 [0, 1, 0, 0, 0],
 [0, 1, 0, 1, 0],
 [0, 0, 0, 1, 0],
 [1, 1, 0, 0, 0],
 [0, 0, 0, 1, 0],
];

labyrintheBFS(prison, [0, 0], [4, 4]);
// => [[0,0], [1,0], [2,0], [2,1], [2,2], [3,2], [4,2], [4,3]... ]
```

---

## 5) QUEUE POUR LES EVENTS ASYNCHRONES : LE TASK SCHEDULER

Un pattern classique en Node : tu reçois plus de tasks que tu peux en traiter simultanément.
La queue absorbe le surplus. Les workers traitent à leur rythme.

```js
class TaskScheduler {
 constructor(concurrence = 3) {
  this.queue = new Queue();
  this.actifs = 0;
  this.concurrence = concurrence; // max tasks simultanées
 }

 ajouter(task) {
  // task = fonction async qui retourne une Promise
  this.queue.enqueue(task);
  this.traiter(); // essaye de démarrer si un slot est libre
 }

 async traiter() {
  if (this.actifs >= this.concurrence || this.queue.isEmpty()) return;

  this.actifs++;
  const task = this.queue.dequeue();

  try {
   await task();
  } catch (err) {
   console.error("Task échouée :", err.message);
  } finally {
   this.actifs--;
   this.traiter(); // on prend la suivante dès qu'on libère un slot
  }
 }
}

// Exemple : 10 analyses de code, max 3 en parallèle
const scheduler = new TaskScheduler(3);

for (let i = 1; i <= 10; i++) {
 scheduler.ajouter(async () => {
  const duree = Math.random() * 500 + 100;
  await new Promise((resolve) => setTimeout(resolve, duree));
  console.log(`Analyse ${i} terminée (${Math.round(duree)}ms)`);
 });
}
```

C'est le coeur de `p-limit`, `bottleneck`, `async-pool` : une queue + un compteur de slots actifs.

---

## EXERCICES

## EXO 1 : LE SYSTÈME DE MISSIONS DE L'ESCOUADE
_~15 min_


L'escouade de Levi reçoit des missions contre les Titans. Chaque mission a :

- un `id`, un `cible` (type de Titan), une `priorite` (1 à 5)
- un `temps` de traitement simulé (en ms)

Implémenter `MissionDispatcher` :

- `soumettre(mission)` : ajoute en queue
- `dispatchProchaine()` : retire et "exécute" la prochaine mission (setTimeout sur le `temps`)
- `dispatchTout(concurrence)` : exécute toutes les missions avec N workers max en parallèle
- Retourner une Promise qui resolve quand toutes les missions sont terminées

---

## EXO 2 : BFS SUR UN RÉSEAU DE DISTRIBUTION
_~20 min_


Walter White a un réseau de distribution : les villes sont des noeuds, les routes sont des arêtes.
Certaines routes sont bloquées (Hank est dans le coin).

Implémenter :

- `trouverTousLesChemins(graphe, depart, arrivee)` : retourne TOUS les chemins possibles (pas juste le plus court)
- `distanceMinimale(graphe, depart, arrivee)` : nombre d'arêtes du chemin le plus court
- `composantsConnexes(graphe)` : grouper les villes en groupes connectés entre eux

(Indice pour les composants connexes : BFS depuis chaque noeud non visité : chaque BFS complète = un composant.)

---

## EXO 3 : LE REPLAY EN TEMPS RÉEL
_~20 min_


Un système de replay de match. Les events arrivent dans une queue.
La simulation tourne à vitesse x2 (chaque minute de match dure 500ms réel).

Implémenter `MatchReplay` :

- `charger(events)` : charge une liste d'events ordonnés par minute dans la queue
- `demarrer()` : démarre la simulation, emit chaque event au bon moment
- `pause()` / `reprendre()` : stoppe et reprend sans perdre d'events
- Les events suivants doivent attendre sans bloquer le thread principal

Structure d'un event : `{ minute: 45, type: "but", joueur: "Mbappé", equipe: "PSG" }`

---

## RÉSUMÉ

La queue n'est pas juste une structure : c'est un mécanisme d'ordonnancement.
BFS utilise une queue pour garantir l'ordre par niveau : c'est pour ça qu'il trouve le chemin le plus court.
Marquer les noeuds visités à l'enqueue, pas au dequeue : erreur classique, conséquences graves.
Task scheduler = queue + compteur de slots : base de tout système de jobs concurrent en Node.
Grille 2D = graphe implicite : chaque cellule a 4 voisins : BFS s'applique directement.
