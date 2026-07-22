---
stability: intemporel
---

# 02_WEBRTC_DEMO : L'APPEL VIDÉO PEER-TO-PEER
Temps de lecture ~11 min

Les concepts du fichier précédent, maintenant en vrai code.
On construit un appel vidéo entre deux navigateurs.
Contexte : Léon et Alfonso de Garo Honoo no Kokuin ont besoin de se coordonner en secret : pas de serveur central pour les données vidéo.

Ce qu'on construit :

- un serveur de signaling WebSocket (juste pour coordonner)
- `SignalingClient` : la classe qui encapsule la communication de signaling
- la connexion WebRTC peer-to-peer complète (Caller + Callee)
- un `RTCDataChannel` pour envoyer des messages texte en parallèle du flux vidéo
- la page HTML finale

---

## 1) LE SERVEUR DE SIGNALING

```js
// server.js:Node.js + ws
// ce serveur ne touche JAMAIS aux flux vidéo
// il fait juste passer les messages entre les deux pairs
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// on garde juste deux pairs : l'appelant et le receveur
const peers = new Map(); // peerId --> WebSocket

wss.on("connection", (ws) => {
 ws.on("message", (data) => {
  const message = JSON.parse(data.toString());

  switch (message.type) {
   case "register": {
    // un pair s'enregistre avec son ID
    peers.set(message.peerId, ws);
    ws.peerId = message.peerId;
    console.log(`Pair enregistré : ${message.peerId}`);
    break;
   }

   case "offer":
   case "answer":
   case "ice_candidate": {
    // relayer le message au pair destinataire
    const target = peers.get(message.targetId);
    if (target && target.readyState === 1) {
     // 1 = OPEN
     target.send(
      JSON.stringify({
       ...message,
       fromId: ws.peerId, // ajouter l'expéditeur
      }),
     );
    }
    break;
   }
  }
 });

 ws.on("close", () => {
  if (ws.peerId) {
   peers.delete(ws.peerId);
   console.log(`Pair déconnecté : ${ws.peerId}`);
  }
 });
});

console.log("Signaling server actif sur port 8080");
```

Ce serveur ne sait pas ce qu'il transporte.
Il reçoit un message et le forward (transfère) au bon pair. C'est tout son rôle.

---

## 2) LA CLASSE DE SIGNALING : ISOLER LA COMMUNICATION

```js
// signaling.js:gère la connexion WebSocket de signaling
// cette classe est importée par Caller et Callee
class SignalingClient {
 constructor(url, peerId) {
  this.peerId = peerId;
  this.handlers = new Map(); // type de message --> handler
  this.ws = new WebSocket(url);

  this.ws.addEventListener("open", () => {
   // s'enregistrer dès la connexion ouverte
   this._send({ type: "register", peerId });
  });

  this.ws.addEventListener("message", (event) => {
   const message = JSON.parse(event.data);
   const handler = this.handlers.get(message.type);
   if (handler) handler(message);
  });
 }

 on(type, handler) {
  // enregistrer un handler pour un type de message
  this.handlers.set(type, handler);
  return this; // chainable
 }

 sendOffer(targetId, offer) {
  this._send({ type: "offer", targetId, offer });
 }

 sendAnswer(targetId, answer) {
  this._send({ type: "answer", targetId, answer });
 }

 sendIceCandidate(targetId, candidate) {
  this._send({ type: "ice_candidate", targetId, candidate });
 }

 _send(data) {
  // vérifier readyState avant d'envoyer:pas d'envoi sur une socket fermée
  if (this.ws.readyState === WebSocket.OPEN) {
   this.ws.send(JSON.stringify(data));
  }
 }
}
```

---

## 3) LA CONNEXION WEBRTC : L'APPELANT

```js
// caller.js:le pair qui initie l'appel (Léon)
class Caller {
 constructor(signalingUrl, myId, targetId) {
  this.targetId = targetId;
  this.signaling = new SignalingClient(signalingUrl, myId);
  this.pc = null; // RTCPeerConnection:créée après getUserMedia
  this.dataChannel = null; // RTCDataChannel:créé avant l'offer

  // écouter la réponse de l'autre pair
  this.signaling.on("answer", async ({ answer }) => {
   await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
   console.log("Answer reçue : connexion en cours...");
  });

  // recevoir et ajouter les ICE candidates de l'autre pair
  this.signaling.on("ice_candidate", async ({ candidate }) => {
   try {
    await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
   } catch (err) {
    console.error("Erreur addIceCandidate :", err);
   }
  });
 }

 async call() {
  // 1. capturer audio + vidéo
  const localStream = await navigator.mediaDevices.getUserMedia({
   video: { width: 1280, height: 720 },
   audio: true,
  });

  // afficher le flux local dans un <video> muted (sinon feedback audio immédiat)
  document.getElementById("local-video").srcObject = localStream;

  // 2. créer la RTCPeerConnection avec les serveurs STUN/TURN
  this.pc = new RTCPeerConnection({
   iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // en prod : ajouter un serveur TURN ici pour les NATs symétriques
   ],
  });

  // 3. créer le DataChannel AVANT l'offer:sinon il ne sera pas dans le SDP négocié
  this.dataChannel = this.pc.createDataChannel("secure-channel");
  this.dataChannel.onopen = () => console.log("DataChannel ouvert");
  this.dataChannel.onmessage = (e) => console.log("Message reçu :", e.data);

  // 4. ajouter les tracks locaux à la connexion
  localStream.getTracks().forEach((track) => {
   this.pc.addTrack(track, localStream);
  });

  // 5. gérer les ICE candidates générés localement
  this.pc.onicecandidate = ({ candidate }) => {
   if (candidate) {
    // envoyer chaque candidate à l'autre pair via le signaling
    this.signaling.sendIceCandidate(this.targetId, candidate);
   }
  };

  // 6. recevoir les flux de l'autre pair
  this.pc.ontrack = ({ streams }) => {
   document.getElementById("remote-video").srcObject = streams[0];
   console.log("Flux distant reçu");
  };

  // 7. suivre l'état de la connexion ICE:obligatoire pour détecter les problèmes
  this.pc.oniceconnectionstatechange = () => {
   console.log("ICE state :", this.pc.iceConnectionState);
  };

  // 8. créer et envoyer l'offer
  const offer = await this.pc.createOffer();
  await this.pc.setLocalDescription(offer);
  this.signaling.sendOffer(this.targetId, offer);
  console.log("Offer envoyée à", this.targetId);
 }

 sendMessage(text) {
  // envoyer un message texte via le DataChannel peer-to-peer
  if (this.dataChannel && this.dataChannel.readyState === "open") {
   this.dataChannel.send(text);
  }
 }

 hangUp() {
  if (this.pc) {
   this.pc.close();
   this.pc = null;
  }
 }
}
```

---

## 4) LA CONNEXION WEBRTC : LE RECEVEUR

```js
// callee.js:le pair qui reçoit l'appel (Alfonso)
class Callee {
 constructor(signalingUrl, myId) {
  this.myId = myId;
  this.signaling = new SignalingClient(signalingUrl, myId);
  this.pc = null;

  // écouter une offer entrante
  this.signaling.on("offer", async ({ offer, fromId }) => {
   console.log(`Appel entrant de ${fromId}`);
   this.callerId = fromId;
   await this._handleOffer(offer);
  });

  this.signaling.on("ice_candidate", async ({ candidate }) => {
   if (this.pc) {
    try {
     await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
     console.error("Erreur addIceCandidate :", err);
    }
   }
  });
 }

 async _handleOffer(offer) {
  // capturer le media local
  const localStream = await navigator.mediaDevices.getUserMedia({
   video: true,
   audio: true,
  });

  document.getElementById("local-video").srcObject = localStream;

  this.pc = new RTCPeerConnection({
   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  localStream.getTracks().forEach((track) => {
   this.pc.addTrack(track, localStream);
  });

  this.pc.onicecandidate = ({ candidate }) => {
   if (candidate) {
    this.signaling.sendIceCandidate(this.callerId, candidate);
   }
  };

  this.pc.ontrack = ({ streams }) => {
   document.getElementById("remote-video").srcObject = streams[0];
  };

  // recevoir le DataChannel ouvert par le Caller
  // ondatachannel se déclenche automatiquement si le Caller a créé un channel avant l'offer
  this.pc.ondatachannel = (event) => {
   const channel = event.channel;
   channel.onopen = () => console.log("DataChannel reçu et ouvert");
   channel.onmessage = (e) => console.log("Message de Léon :", e.data);
  };

  // définir l'offer reçue comme description distante
  await this.pc.setRemoteDescription(new RTCSessionDescription(offer));

  // créer et envoyer l'answer
  const answer = await this.pc.createAnswer();
  await this.pc.setLocalDescription(answer);
  this.signaling.sendAnswer(this.callerId, answer);
  console.log("Answer envoyée");
 }
}
```

---

## 5) LE DATACHANNEL : DONNÉES PEER-TO-PEER SANS SERVEUR

`RTCDataChannel` c'est une WebSocket entre les deux pairs, sans passer par le serveur.
Même connexion P2P que la vidéo. Zéro serveur dans la boucle pour les messages.

```
Léon             Alfonso
 |               |
 | dataChannel.send('message') |
 |========= P2P directement ===>|
 |               | channel.onmessage
```

Deux règles critiques :

1. Créer le DataChannel **avant** `createOffer()` : sinon il n'est pas dans le SDP et Alfonso ne reçoit jamais `ondatachannel`
2. Vérifier `readyState === 'open'` avant d'envoyer : exactement comme `readyState === 1` pour les WebSockets

```js
// les états possibles d'un DataChannel
// 'connecting' --> 'open' --> 'closing' --> 'closed'

dataChannel.onopen = () => {
 // maintenant on peut envoyer
 dataChannel.send("Canal sécurisé ouvert : Garo est en route");
};

dataChannel.onclose = () => {
 console.log("Canal fermé : appel terminé");
};
```

---

## 6) LES ÉTATS DE CONNEXION ICE : CE QU'ILS SIGNIFIENT

```
new     --> connexion créée, pas encore démarrée
checking   --> test des ICE candidates en cours
connected  --> connexion établie (tous les tests réussis)
completed  --> meilleure route sélectionnée
disconnected --> perte temporaire : peut revenir à "connected"
failed    --> connexion impossible : recommencer depuis zéro
closed    --> connexion fermée volontairement
```

En prod, écouter `iceConnectionState` est obligatoire pour détecter les problèmes.

```js
this.pc.oniceconnectionstatechange = () => {
 const state = this.pc.iceConnectionState;

 if (state === "failed") {
  // ICE restart : tenter de recréer les candidates sans recréer la connexion complète
  this.pc.restartIce();
 }

 if (state === "disconnected") {
  // temporaire : attendre quelques secondes avant de conclure
  console.log("Déconnexion temporaire : attente...");
 }
};
```

---

## 7) LA PAGE HTML MINIMALE

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="fr">
 <head>
  <meta charset="UTF-8" />
  <title>Garo Connect</title>
  <style>
   /* deux vidéos côte à côte */
   #videos {
    display: flex;
    gap: 16px;
   }
   video {
    width: 480px;
    background: #000;
    border-radius: 8px;
   }
   #local-video {
    transform: scaleX(-1);
   } /* effet miroir pour la cam locale */
  </style>
 </head>
 <body>
  <div id="videos">
   <video id="local-video" autoplay muted playsinline></video>
   <video id="remote-video" autoplay playsinline></video>
  </div>

  <button id="call-btn">Appeler Alfonso</button>
  <button id="hangup-btn" disabled>Raccrocher</button>
  <input id="msg-input" placeholder="Message à Alfonso..." />
  <button id="send-btn" disabled>Envoyer</button>

  <script type="module">
   import { Caller } from "./caller.js";
   import { Callee } from "./callee.js";

   // déterminer le rôle depuis l'URL : ?role=caller ou ?role=callee
   const params = new URLSearchParams(location.search);
   const role = params.get("role");

   if (role === "caller") {
    const caller = new Caller("ws://localhost:8080", "leon", "alfonso");

    document.getElementById("call-btn").onclick = async () => {
     await caller.call();
     document.getElementById("call-btn").disabled = true;
     document.getElementById("hangup-btn").disabled = false;
     document.getElementById("send-btn").disabled = false;
    };

    document.getElementById("hangup-btn").onclick = () => {
     caller.hangUp();
     document.getElementById("call-btn").disabled = false;
     document.getElementById("hangup-btn").disabled = true;
     document.getElementById("send-btn").disabled = true;
    };

    document.getElementById("send-btn").onclick = () => {
     const text = document.getElementById("msg-input").value;
     caller.sendMessage(text);
     document.getElementById("msg-input").value = "";
    };
   }

   if (role === "callee") {
    new Callee("ws://localhost:8080", "alfonso");
    document.getElementById("call-btn").style.display = "none";
   }
  </script>
 </body>
</html>
```

---

## RÉSUMÉ

Un appel WebRTC c'est deux parties : le signaling (ton serveur WebSocket qui transporte SDP et ICE candidates) et la connexion P2P (le navigateur qui gère tout après).
Le code se décompose en quatre responsabilités : `SignalingClient` (transport des messages), `Caller`/`Callee` (logique de connexion), `RTCDataChannel` (données texte P2P), et la page HTML (media et UI).
Deux règles qui sauvent tout : créer le DataChannel avant `createOffer()`, et ne jamais ignorer les erreurs `addIceCandidate()` : elles cassent la connexion silencieusement.
Ce qui rate le plus souvent en prod : le TURN manquant pour les NATs symétriques (20% des utilisateurs qui voient `failed` sans comprendre pourquoi).

---

## EXERCICES

**EXO 1 : Afficher les stats de connexion**

WebRTC expose des métriques via `RTCPeerConnection.getStats()`.
Implémente une fonction qui affiche toutes les 2 secondes :

- le codec vidéo utilisé
- le bitrate entrant et sortant
- le packet loss (pourcentage de paquets perdus)
- le round-trip time (temps aller-retour des paquets)

Contrainte : utiliser uniquement `getStats()`, pas de bibliothèque externe.
(Indice : `getStats()` retourne une `Promise<RTCStatsReport>` : itérer les entries avec `.forEach()`, filtrer par `type === 'inbound-rtp'` et `type === 'outbound-rtp'`)

---

**EXO 2 : Le DataChannel de secours**

La connexion vidéo peut tomber. Mais le DataChannel doit rester ouvert.
Implémente un système de "heartbeat DataChannel" :

- Léon envoie `{ type: 'ping', ts: Date.now() }` toutes les 5 secondes via le DataChannel
- Alfonso répond `{ type: 'pong', ts: Date.now(), latency: ... }` avec la latence calculée
- si Léon ne reçoit pas de pong dans les 10 secondes : logger `'DataChannel inactif : vérifier la connexion'`

Contrainte : ne pas toucher à la logique vidéo, uniquement le DataChannel.
(Indice : `setInterval` pour les pings, `clearTimeout`/`setTimeout` pour le timeout de pong)
