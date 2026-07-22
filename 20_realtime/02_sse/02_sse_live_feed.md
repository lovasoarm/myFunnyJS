---
stability: intemporel
---

# 02_SSE_LIVE_FEED : LE DASHBOARD DE MATCH EN TEMPS RÉEL
Temps de lecture ~9 min

Objectif concret : un dashboard live pour suivre un match de foot.
Possession, xG (expected goals : buts attendus selon la qualité des occasions), tirs, alertes de but.
Les données arrivent via SSE depuis un serveur de stats.
Les ultras regardent le dashboard : si ça lag ou ça freeze, c'est la catastrophe.

On construit quelque chose qui tient sous charge et qui se comporte proprement quand la connexion flanche.

---

## 1) ARCHITECTURE DU SYSTÈME

```
[Moteur de match]
    |
    v
[Event Ingester] --> stocke les events dans une queue en mémoire
    |
    v
[SSE Handler] --> diffuse aux clients connectés
    |
 _____|_____
 |  |  |
 C1  C2  C3  (navigateurs des ultras)
```

Le moteur de match envoie des events bruts.
L'ingester les structure.
Le SSE handler les pousse à tous les clients.

---

## 2) LE SERVEUR : STRUCTURÉ ET ROBUSTE

```js
import express from "express";

const app = express();
app.use(express.json());

// structure du state de match:tout est immutable, on ne mute pas directement
let matchState = {
 id: "ultras-vs-rivaux-2026",
 minute: 0,
 score: { home: 0, away: 0 },
 possession: { home: 50, away: 50 },
 xG: { home: 0, away: 0 },
 shots: { home: 0, away: 0 },
 status: "pre_match", // pre_match | live | half_time | full_time
};

// event log:chaque event du match conservé dans l'ordre
const eventLog = [];
let eventIdCounter = 0;

// registry des clients SSE
const sseClients = new Set();

// ---- Helpers SSE ----

function formatSSEPayload(eventType, data, id) {
 return `id: ${id}\nevent: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
}

function broadcastEvent(eventType, data) {
 const id = ++eventIdCounter;
 const payload = formatSSEPayload(eventType, data, id);

 // stocker dans le log pour la reprise après reconnexion
 eventLog.push({ id, eventType, data, timestamp: Date.now() });

 // garder seulement les 100 derniers events en mémoire
 if (eventLog.length > 100) eventLog.shift();

 // broadcaster à tous les clients connectés
 sseClients.forEach((res) => {
  try {
   res.write(payload);
  } catch (err) {
   // le client a disparu sans fermeture propre:on le retire
   sseClients.delete(res);
  }
 });
}

// ---- Endpoint SSE ----

app.get("/match/live", (req, res) => {
 res.setHeader("Content-Type", "text/event-stream");
 res.setHeader("Cache-Control", "no-cache");
 res.setHeader("Connection", "keep-alive");
 res.setHeader("Access-Control-Allow-Origin", "*"); // CORS pour le dashboard
 res.flushHeaders();

 const lastEventId = req.headers["last-event-id"]
  ? parseInt(req.headers["last-event-id"])
  : null;

 // envoyer le state courant immédiatement:pas d'attente du prochain event
 res.write(formatSSEPayload("state_sync", matchState, 0));

 // rejouer les events manqués si le client se reconnecte
 if (lastEventId !== null) {
  const missed = eventLog.filter((e) => e.id > lastEventId);
  missed.forEach(({ id, eventType, data }) => {
   res.write(formatSSEPayload(eventType, data, id));
  });
 }

 sseClients.add(res);

 // heartbeat toutes les 30s pour éviter les timeouts de proxy
 const heartbeat = setInterval(() => {
  res.write(": heartbeat\n\n"); // ligne de commentaire SSE:ignorée par EventSource
 }, 30000);

 req.on("close", () => {
  clearInterval(heartbeat);
  sseClients.delete(res);
 });
});

// ---- Endpoints pour mettre à jour le match ----

app.post("/match/event", (req, res) => {
 const { type, payload } = req.body;

 switch (type) {
  case "goal": {
   const side = payload.team === "home" ? "home" : "away";
   matchState = {
    ...matchState, // immutabilité : on crée un nouvel objet
    score: { ...matchState.score, [side]: matchState.score[side] + 1 },
   };

   broadcastEvent("goal", {
    team: payload.team,
    player: payload.player,
    minute: matchState.minute,
    score: matchState.score,
   });
   break;
  }

  case "possession_update": {
   matchState = {
    ...matchState,
    possession: payload,
   };
   broadcastEvent("possession_update", payload);
   break;
  }

  case "xg_update": {
   matchState = {
    ...matchState,
    xG: payload,
   };
   broadcastEvent("xg_update", payload);
   break;
  }

  case "status_change": {
   matchState = { ...matchState, status: payload.status };
   broadcastEvent("status_change", { status: payload.status });
   break;
  }

  default:
   return res.status(400).json({ error: "event type inconnu" });
 }

 res.json({ ok: true, clients: sseClients.size });
});

app.listen(3000, () => console.log("Dashboard SSE actif sur port 3000"));
```

---

## 3) LE CLIENT : LE DASHBOARD

```js
class MatchDashboard {
 constructor(sseUrl) {
  this.sseUrl = sseUrl;
  this.state = null;
  this._connect();
 }

 _connect() {
  // EventSource utilise automatiquement Last-Event-ID si tu fermes/rouvres
  this.source = new EventSource(this.sseUrl);

  // state initial ou resync après reconnexion
  this.source.addEventListener("state_sync", (event) => {
   this.state = JSON.parse(event.data);
   this._render();
  });

  this.source.addEventListener("goal", (event) => {
   const goal = JSON.parse(event.data);
   this.state = { ...this.state, score: goal.score };
   this._renderGoalAlert(goal);
   this._render();
  });

  this.source.addEventListener("possession_update", (event) => {
   const possession = JSON.parse(event.data);
   this.state = { ...this.state, possession };
   this._render();
  });

  this.source.addEventListener("xg_update", (event) => {
   const xG = JSON.parse(event.data);
   this.state = { ...this.state, xG };
   this._render();
  });

  this.source.addEventListener("status_change", (event) => {
   const { status } = JSON.parse(event.data);
   this.state = { ...this.state, status };
   this._render();
  });

  this.source.addEventListener("error", () => {
   // EventSource retente automatiquement:on signale juste l'état
   console.log("Connexion perdue : reconnexion en cours...");
  });

  this.source.addEventListener("open", () => {
   console.log("Dashboard connecté au flux SSE");
  });
 }

 _render() {
  if (!this.state) return;

  // dans un vrai dashboard : mettre à jour le DOM ici
  console.clear();
  console.log(`MATCH : ${this.state.status.toUpperCase()}`);
  console.log(`Score : ${this.state.score.home} - ${this.state.score.away}`);
  console.log(
   `Possession : ${this.state.possession.home}% / ${this.state.possession.away}%`,
  );
  console.log(
   `xG : ${this.state.xG.home.toFixed(2)} / ${this.state.xG.away.toFixed(2)}`,
  );
 }

 _renderGoalAlert({ player, team, minute }) {
  console.log(`*** GOAL ! ${player} (${team}) à la ${minute}e minute ***`);
 }

 disconnect() {
  this.source.close();
 }
}

// Usage
const dashboard = new MatchDashboard("http://localhost:3000/match/live");
```

---

## 4) LE HEARTBEAT : POURQUOI C'EST OBLIGATOIRE EN PROD

Sans heartbeat, les proxies et load balancers coupent les connexions inactives après 30 à 60 secondes.
La connexion SSE est coupée, l'EventSource reconnecte, le client rate peut-être des events.

```js
// côté serveur : envoyer un commentaire SSE régulièrement
// un commentaire commence par ':':EventSource l'ignore, le proxy voit de l'activité
const heartbeat = setInterval(() => {
 res.write(": ping\n\n");
}, 25000); // 25 secondes:en dessous du timeout typique de 30s

// ne pas oublier de clear l'interval au close
req.on("close", () => clearInterval(heartbeat));
```

Côté client : EventSource ne voit pas les commentaires. Aucun code à ajouter.
C'est de la plomberie serveur pure.

---

## 5) GESTION DE LA CHARGE : PREVIEW POUR 10K CLIENTS

> **Note** : cette section anticipe des concepts traités en détail dans `25_scalability`.
> L'objectif ici est de voir le problème, pas d'implémenter la solution complète.

Avec 10,000 clients SSE :

- chaque `res.write()` est synchrone dans Node.js
- un broadcast naïf = boucle de 10,000 writes dans le thread principal
- résultat : le serveur freeze pendant le broadcast, les autres requêtes attendent

La solution immédiate : `setImmediate` pour céder le contrôle entre chaque write.

```js
function broadcastEventBuffered(eventType, data) {
 const id = ++eventIdCounter;
 const payload = formatSSEPayload(eventType, data, id);

 // setImmediate laisse Node.js traiter les autres callbacks entre chaque write
 // évite de bloquer l'event loop (boucle d'événements) sur un grand broadcast
 const clientsArray = [...sseClients];
 let index = 0;

 function writeNext() {
  if (index >= clientsArray.length) return;

  const client = clientsArray[index++];
  if (client.writable) {
   client.write(payload);
  }

  setImmediate(writeNext); // cède le contrôle après chaque write
 }

 writeNext();
}
```

Pour des volumes très élevés (100k+ clients) : Redis Pub/Sub + plusieurs instances Node.js.
C'est exactement ce que couvre `25_scalability/07_message_queues.md`.

---

## RÉSUMÉ

Un live feed SSE tient sur trois piliers : le state sync au connect (pas d'attente du prochain event), le heartbeat contre les timeouts de proxy, et la reprise sur `Last-Event-ID` après reconnexion.
La difficulté à l'échelle, c'est le broadcast synchrone qui bloque l'event loop sur 10k+ clients.
Pour un dashboard de match où seul le serveur parle : SSE est la bonne décision : WebSocket serait du sur-engineering ici.

---

## EXERCICES

**EXO 1 : Simuler un match complet**

Écris un script Node.js qui simule un match de 90 minutes en envoyant des events `POST /match/event` avec un intervalle de 100ms par minute de jeu.
Le match doit générer des events aléatoires : possession toutes les 5 minutes, xG après chaque tir, but avec une probabilité de 5% par tir.

Contrainte : le dashboard SSE doit refléter le match en direct, pas avoir besoin d'être rafraîchi.
(Indice : `setInterval` pour simuler le temps, `Math.random()` pour les probabilités)

---

**EXO 2 : Le dashboard qui survit à une coupure**

Modifie le client pour qu'il :

- affiche un indicateur "Reconnexion..." pendant que la connexion est coupée
- affiche "Reprise depuis l'event N" quand il se reconnecte avec un `Last-Event-ID`
- compte et affiche le nombre de reconnexions depuis l'ouverture de la page

Contrainte : sans modifier le serveur : tout se passe dans le code client.
(Indice : tracker `this.reconnectCount` et écouter les events `open` et `error` sur EventSource)
