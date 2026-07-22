---
stability: intemporel
---

# 02_WS_CHAT_ROOM : LE CHAT ROOM QUI TIENT EN PROD
Temps de lecture ~9 min

Un chat room WebSocket c'est le test de feu de tout ce qu'on a vu.
Multi-utilisateurs. Rooms séparées. Broadcast (diffusion à tous). Historique qui persiste.
Si t'arrives à construire ça proprement, t'as compris WebSocket.

Ce qu'on construit : un système de chat inspiré du Conseil des Chevaliers de Garo.
Chaque ville a sa room. Les chevaliers communiquent en temps réel.
Si Léon envoie un message dans la room "Valiante", seuls les clients de "Valiante" le reçoivent.

---

## 1) ARCHITECTURE : CE QUI CHANGE QUAND T'AS PLUSIEURS CLIENTS

Avec un seul client : trivial. Avec N clients : il faut gérer qui est où.

```
Client A (room: Valiante) ---|
Client B (room: Valiante) ---|--> [Room Manager] --> broadcast room Valiante
Client C (room: Aldana) ---|
Client D (room: Aldana) ---|--> [Room Manager] --> broadcast room Aldana
```

Le Room Manager doit :

- savoir dans quelle room est chaque client
- diffuser un message à tous les membres d'une room
- nettoyer une room quand un client se déconnecte

---

## 2) LE ROOM MANAGER : LE COEUR DU SYSTÈME

```js
// rooms est une Map : clé = nom de la room, valeur = Set de WebSockets
// Map + Set = la combo parfaite : lookup O(1) (temps constant), itération propre
const rooms = new Map();

function joinRoom(roomName, ws) {
 // créer la room si elle n'existe pas encore
 if (!rooms.has(roomName)) {
  rooms.set(roomName, new Set());
 }

 // ajouter ce client dans la room
 rooms.get(roomName).add(ws);

 // stocker sur le socket lui-même dans quelle room il est
 // utile pour le nettoyer au close sans itérer toutes les rooms
 ws.currentRoom = roomName;

 console.log(
  `Client rejoint "${roomName}" : membres : ${rooms.get(roomName).size}`,
 );
}

function leaveRoom(ws) {
 const roomName = ws.currentRoom;
 if (!roomName || !rooms.has(roomName)) return;

 rooms.get(roomName).delete(ws);

 // nettoyer la room si elle est vide:pas de Map qui grossit à l'infini
 if (rooms.get(roomName).size === 0) {
  rooms.delete(roomName);
  console.log(`Room "${roomName}" supprimée : plus personne`);
 }
}

function broadcastToRoom(roomName, message, excludeWs = null) {
 if (!rooms.has(roomName)) return;

 const payload = JSON.stringify(message);

 rooms.get(roomName).forEach((client) => {
  // vérifier que le client est toujours connecté avant d'envoyer
  // WebSocket.OPEN = 1 (état ouvert)
  if (client !== excludeWs && client.readyState === 1) {
   client.send(payload);
  }
 });
}
```

---

## 3) LE SERVEUR COMPLET

```js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// historique des messages par room:50 derniers messages max
const history = new Map();

function addToHistory(roomName, message) {
 if (!history.has(roomName)) {
  history.set(roomName, []);
 }

 const roomHistory = history.get(roomName);
 roomHistory.push(message);

 // slice(-50) retourne les 50 derniers éléments:pas de tableau qui grossit sans limite
 if (roomHistory.length > 50) {
  history.set(roomName, roomHistory.slice(-50));
 }
}

wss.on("connection", (ws) => {
 console.log("Nouveau client connecté");

 ws.on("message", (data) => {
  let message;

  try {
   message = JSON.parse(data.toString());
  } catch {
   // JSON malformé : on ignore plutôt que de crasher le serveur
   ws.send(JSON.stringify({ type: "error", reason: "invalid_json" }));
   return;
  }

  switch (message.type) {
   case "join": {
    // quitter la room précédente si le client en avait une
    if (ws.currentRoom) leaveRoom(ws);

    joinRoom(message.room, ws);
    ws.username = message.username || "Anonyme";

    // envoyer l'historique à ce client uniquement
    const roomHistory = history.get(message.room) || [];
    ws.send(JSON.stringify({ type: "history", messages: roomHistory }));

    // notifier les autres membres
    broadcastToRoom(
     message.room,
     {
      type: "system",
      text: `${ws.username} a rejoint la room`,
      timestamp: Date.now(),
     },
     ws,
    ); // on exclut le client lui-même
    break;
   }

   case "message": {
    if (!ws.currentRoom) {
     ws.send(JSON.stringify({ type: "error", reason: "not_in_room" }));
     return;
    }

    const chatMessage = {
     type: "message",
     username: ws.username,
     text: message.text,
     timestamp: Date.now(),
    };

    addToHistory(ws.currentRoom, chatMessage);

    // broadcast à toute la room, expéditeur inclus
    // le client voit son propre message confirmé par le serveur
    broadcastToRoom(ws.currentRoom, chatMessage);
    break;
   }

   default:
    ws.send(JSON.stringify({ type: "error", reason: "unknown_type" }));
  }
 });

 ws.on("close", () => {
  if (ws.currentRoom) {
   broadcastToRoom(
    ws.currentRoom,
    {
     type: "system",
     text: `${ws.username} a quitté la room`,
     timestamp: Date.now(),
    },
    ws,
   );

   leaveRoom(ws);
  }
 });

 ws.on("error", (err) => {
  // logger l'erreur mais ne pas crasher le processus Node
  console.error("Erreur client WebSocket :", err.message);
  leaveRoom(ws);
 });
});

console.log("Conseil de Garo actif sur le port 8080");
```

---

## 4) LE CLIENT

```js
class ChatClient {
 constructor(url) {
  this.url = url;
  this.socket = null;
  this.handlers = new Map(); // type d'event --> handler
  this._connect();
 }

 _connect() {
  this.socket = new WebSocket(this.url);

  this.socket.addEventListener("message", (event) => {
   const message = JSON.parse(event.data);
   const handler = this.handlers.get(message.type);
   // si un handler est enregistré pour ce type, on l'appelle
   if (handler) handler(message);
  });

  this.socket.addEventListener("close", (event) => {
   if (!event.wasClean) {
    // reconnexion automatique avec backoff exponentiel
    // délai qui double à chaque tentative, plafonné à 30s
    const delay = Math.min(1000 * 2 ** this._retries, 30000);
    this._retries = (this._retries || 0) + 1;
    console.log(`Déconnecté : retry dans ${delay}ms`);
    setTimeout(() => this._connect(), delay);
   }
  });

  this.socket.addEventListener("open", () => {
   this._retries = 0; // reset le compteur de tentatives après succès
  });
 }

 on(type, handler) {
  // enregistrer un handler pour un type de message
  this.handlers.set(type, handler);
  return this; // chainable
 }

 join(room, username) {
  this._sendWhenOpen({ type: "join", room, username });
 }

 sendMessage(text) {
  this._sendWhenOpen({ type: "message", text });
 }

 _sendWhenOpen(data) {
  if (this.socket.readyState === WebSocket.OPEN) {
   this.socket.send(JSON.stringify(data));
  } else {
   // socket pas encore prête : attendre open puis envoyer
   this.socket.addEventListener(
    "open",
    () => {
     this.socket.send(JSON.stringify(data));
    },
    { once: true },
   ); // once:true = handler auto-supprimé après premier appel
  }
 }
}

// Usage
const chat = new ChatClient("wss://conseil-garo.com/ws");

chat
 .on("history", ({ messages }) => {
  messages.forEach((m) => console.log(`[${m.username}] ${m.text}`));
 })
 .on("message", ({ username, text }) => {
  console.log(`${username} : ${text}`);
 })
 .on("system", ({ text }) => {
  console.log(`-- ${text} --`);
 });

chat.join("Valiante", "Leon");
chat.sendMessage("Horror détecté dans le quartier nord : je pars maintenant");
```

---

## 5) LE PIÈGE DU BROADCAST NAÏF

Version naive que tout le monde écrit d'abord :

```js
// NE PAS FAIRE ÇA
wss.clients.forEach((client) => {
 client.send(JSON.stringify(message)); // envoie à TOUT LE MONDE, pas à une room
});
```

Résultat : Leon reçoit les messages de Valiante ET de Aldana.
`wss.clients` c'est tous les clients du serveur, pas ceux d'une room spécifique.
Le Room Manager avec Map + Set est obligatoire pour segmenter.

---

## RÉSUMÉ

Un chat room WebSocket en prod repose sur trois mécanismes : la gestion de rooms avec Map + Set, le broadcast ciblé avec vérification de `readyState`, et la reconnexion automatique côté client.
Ce qu'on oublie souvent : vérifier que le client est encore connecté avant d'envoyer, nettoyer les rooms vides, et passer l'historique au join.
Le piège classique : utiliser `wss.clients` pour broadcaster au lieu du Room Manager.

---

## EXERCICES

**EXO 1 : Le Conseil Multi-Villes de Garo**

Le Conseil surveille trois villes : Valiante, Aldana, et León.
Chaque Chevalier se connecte et rejoint la room de sa ville.
Implémente un serveur complet qui :

- gère les trois rooms
- limite à 5 chevaliers max par room (rejeter la connexion si full)
- affiche côté client le nombre de chevaliers présents dans la room au join

Contrainte : pas de bibliothèque externe, juste Node.js + `ws`.
(Indice : `rooms.get(roomName).size >= MAX` avant d'ajouter)

---

**EXO 2 : L'historique persistant entre redémarrages**

> **Dépendance** : cet exercice utilise `fs.promises` pour lire et écrire des fichiers.
> Si tu n'as pas encore fait `15_runtime_env/06_node_cli_scripts/02_filesystem_ops.md`, lis au minimum la section sur `readFile` et `writeFile` avant de commencer.
> L'exercice reste faisable sans le module complet : l'indice te donne les deux fonctions clés.

Le système actuel perd l'historique si le serveur redémarre.
Implémente un mécanisme simple :

- sauvegarder l'historique dans un fichier JSON à chaque nouveau message
- recharger l'historique depuis le fichier au démarrage du serveur
- limiter à 50 messages par room dans le fichier

Contrainte : opérations fichier asynchrones uniquement (`fs.promises`).
(Indice : `await fs.writeFile(path, JSON.stringify(data))` pour écrire, `JSON.parse(await fs.readFile(path, 'utf8'))` pour lire : wrapper le readFile dans un try/catch pour le cas où le fichier n'existe pas encore)
