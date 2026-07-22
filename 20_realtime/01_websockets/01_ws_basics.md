---
stability: intemporel
---

# 01_WS_BASICS : LE CYCLE DE VIE D'UNE WEBSOCKET
Temps de lecture ~9 min

HTTP est un contrat unidirectionnel : tu demandes, le serveur répond, la connexion meurt.
WebSocket, c'est un tunnel qui reste ouvert.
Le serveur peut te parler sans que tu aies rien demandé.
C'est ça le vrai temps réel.

Sans WebSocket : ton app doit poller (interroger à intervalles réguliers) le serveur toutes les X secondes : du gaspillage pur.
Avec WebSocket : le serveur envoie quand ça change. Zéro polling. Zéro gaspillage.

---

## 1) LE TUNNEL : CLIENT ET SERVEUR EN MÊME TEMPS

Avant d'écrire une ligne, comprendre qui parle à qui.
Une WebSocket c'est deux bouts : le navigateur et le serveur Node.js.
Les deux doivent tourner pour que ça fonctionne. Si le serveur n'est pas lancé, la connexion échoue.

```
Navigateur (client)           Node.js (serveur)
    |                    |
    | new WebSocket('wss://...')      | new WebSocketServer({ port: 8080 })
    |                    |
    |------------ handshake --------------->|
    |<----------- 101 Switching Protocols --|
    |                    |
    |<======= TUNNEL OUVERT, BIDIRECTIONNEL =======>|
    |                    |
    | socket.send('message') ------------->| ws.on('message', ...)
    |                    |
    | socket.on('message', ...) <-----------| ws.send('réponse')
    |                    |
    | socket.close()     ------------->| ws.on('close', ...)
```

Les deux côtés ont la même interface de base : `send()`, `on('message')`, `on('close')`.
C'est intentionnel. Tu raisonnes pareil des deux côtés.

**Côté serveur minimal : ce qui doit tourner avant que le client se connecte :**

```js
import { WebSocketServer } from "ws"; // bibliothèque Node.js : npm install ws

const wss = new WebSocketServer({ port: 8080 });
// wss écoute les connexions entrantes

wss.on("connection", (ws) => {
 // ws = la WebSocket individuelle de CE client précis
 // chaque nouveau client déclenche ce callback avec sa propre ws
 console.log("Nouveau client connecté");

 ws.on("message", (data) => {
  // data est un Buffer en Node.js:.toString() pour avoir la string
  const message = JSON.parse(data.toString());
  console.log("Reçu du client :", message);

  // Répondre à ce client uniquement
  ws.send(JSON.stringify({ type: "ack", received: message.type }));
 });

 ws.on("close", () => {
  console.log("Client déconnecté");
 });
});

console.log("Serveur WebSocket actif sur port 8080");
```

Ce serveur doit tourner avant que le client essaie de se connecter.
Sans lui : `new WebSocket('ws://localhost:8080')` échoue silencieusement avec un event `error`.

---

## 2) L'HANDSHAKE : COMMENT ÇA COMMENCE

Une WebSocket démarre comme une requête HTTP classique, puis demande un "upgrade".
Le serveur accepte. La connexion bascule en protocole WebSocket.
HTTP est juste le point d'entrée. Après l'handshake (poignée de main protocolaire), c'est du WebSocket pur.

```
Client            Serveur
 |               |
 |--- HTTP GET /ws ------------>|  (requête d'upgrade)
 |  Upgrade: websocket    |
 |               |
 |<-- 101 Switching Protocols --|  (accord : la connexion bascule)
 |               |
 |<=== WEBSOCKET TUNNEL OUVERT =>  (bidirectionnel, persistant)
 |               |
```

Sans cet upgrade, pas de WebSocket. C'est important à savoir pour debugger les proxies (intermédiaires réseau) qui bloquent les connexions longues.

---

## 3) LE CYCLE DE VIE COMPLET

```
new WebSocket(url)
   |
   v
 readyState: CONNECTING (0)  -- le handshake est en cours
   |
   v
 readyState: OPEN (1)     -- tunnel ouvert, send() autorisé
   |
   |<--> send() / on('message')  -- communication libre dans les deux sens
   |
   v
 readyState: CLOSING (2)   -- fermeture initiée (close() appelé)
   |
   v
 readyState: CLOSED (3)    -- tunnel fermé, plus rien ne passe
```

`readyState` est la propriété centrale. La vérifier avant chaque `send()`.
Envoyer sur une socket `CONNECTING` ou `CLOSED` : le message est perdu, parfois sans erreur visible.

---

## 4) OUVRIR UNE CONNEXION CÔTÉ CLIENT

```js
// 'ws://' pour HTTP, 'wss://' pour HTTPS:utiliser wss en prod, toujours
const socket = new WebSocket("wss://ton-serveur.com/ws");

// open : le tunnel est établi, on peut parler
socket.addEventListener("open", () => {
 console.log("Tunnel ouvert");

 // send accepte : string, ArrayBuffer, Blob
 // JSON.stringify pour envoyer des objets structurés
 socket.send(JSON.stringify({ type: "hello", payload: "Garo Leon" }));
});
```

**Règle critique :** envoyer avant `open` = message perdu ou exception.
Vérifier `socket.readyState === 1` si tu envoies en dehors du callback `open`.

---

## 5) RECEVOIR DES MESSAGES

```js
socket.addEventListener("message", (event) => {
 // event.data est une string côté navigateur (sauf binaire explicite)
 // JSON.parse obligatoire si le serveur envoie du JSON
 const data = JSON.parse(event.data);

 console.log("Message reçu :", data);

 if (data.type === "horror_alert") {
  console.log(`Horror détecté à ${data.location} : envoyer Leon`);
 }
});
```

Oublier le `JSON.parse` : tu travailles sur une string brute.
Accéder à `data.type` sans parser : `undefined` partout, crash silencieux.

---

## 6) LES ERREURS : CE QUI ARRIVE EN VRAI

```js
socket.addEventListener("error", (event) => {
 // L'event error ne donne pas de détails par design (raison de sécurité navigateur)
 // Pour le vrai message d'erreur : onglet Network > WS dans DevTools
 console.error("Erreur WebSocket : vérifier Network tab");
});
```

Les erreurs les plus fréquentes en prod :

- serveur coupé sans fermeture propre
- proxy qui tue les connexions longues (timeout de 30 à 60s typique)
- CORS mal configuré sur le serveur WebSocket
- `wss://` sur un serveur sans certificat valide

---

## 7) FERMER PROPREMENT

```js
// Fermeture initiée par le client
// code 1000 = fermeture normale:c'est le code standard
socket.close(1000, "Mission terminée");

socket.addEventListener("close", (event) => {
 console.log(
  `Connexion fermée : code : ${event.code}, raison : ${event.reason}`,
 );
 // wasClean : true si la fermeture était intentionnelle et propre
 // wasClean : false si la connexion a été coupée brutalement
 if (!event.wasClean) {
  console.log("Coupure brutale : prévoir une reconnexion");
 }
});
```

Codes importants :

- `1000` = fermeture normale
- `1001` = le client est parti (navigation vers une autre page)
- `1006` = connexion coupée brutalement (pas de frame de fermeture reçue)
- `1011` = erreur serveur interne

---

## 8) RECONNEXION : CE QUE TOUT LE MONDE OUBLIE

Une WebSocket ne se reconnecte pas toute seule.
Si le serveur redémarre, ta connexion meurt et c'est tout.
Tu dois implémenter la reconnexion toi-même.

```js
function createSocket(url, onMessage) {
 const socket = new WebSocket(url);

 socket.addEventListener("open", () => {
  console.log("Connecté");
 });

 socket.addEventListener("message", (event) => {
  onMessage(JSON.parse(event.data));
 });

 socket.addEventListener("close", (event) => {
  if (!event.wasClean) {
   // connexion perdue sans fermeture propre:on retente dans 3 secondes
   console.log("Connexion perdue : retry dans 3s");
   setTimeout(() => createSocket(url, onMessage), 3000);
  }
 });

 return socket;
}

const socket = createSocket("wss://ton-serveur.com/ws", (data) => {
 console.log("Reçu :", data);
});
```

En prod : backoff exponentiel (délai qui double à chaque tentative) pour ne pas saturer le serveur si tous les clients se reconnectent simultanément.
`Math.min(1000 * 2 ** retries, 30000)` : capé à 30s.

---

## RÉSUMÉ

Une WebSocket c'est un tunnel bidirectionnel persistant. Deux bouts : navigateur et serveur Node.js. Les deux doivent tourner.
Le cycle de vie : `CONNECTING --> OPEN --> send/receive --> CLOSING --> CLOSED`. Vérifier `readyState` avant chaque `send()`.
Ce qu'on oublie toujours : la reconnexion est manuelle, `wss://` est obligatoire en prod, et les erreurs WebSocket sont peu verboses : aller dans l'onglet Network pour le vrai message.
La puissance réelle : le serveur initie la communication sans que le client demande. C'est ce qui change tout.

---

## EXERCICES

**EXO 1 : Le système d'alerte Horror de Garo**

Le Conseil de Surveillance de Garo veut un système simple : quand un Horror est détecté, une alerte est envoyée à tous les clients connectés.
Implémente :

- un serveur WebSocket Node.js qui accepte les connexions
- un endpoint simulé `POST /horror` (Express ou simple `setInterval`) qui envoie un message à tous les clients connectés
- côté client : affiche l'alerte dès réception avec le nom du Horror et sa localisation

Contrainte : si la connexion est perdue, le client doit retenter automatiquement.
(Indice : `wss.clients` est un Set de toutes les connexions actives : itère et vérifie `readyState === 1` avant chaque `send()`)

---

**EXO 2 : Le détecteur de readyState**

Implémente une fonction `safeSocket(url, message)` qui :

- crée une WebSocket
- envoie `message` seulement quand la connexion est vraiment ouverte
- retourne une Promise qui resolve avec la première réponse du serveur
- rejette si la connexion échoue ou se ferme avant la réponse

Contrainte : la fonction doit fonctionner même si appelée immédiatement, sans attendre `open` manuellement.
(Indice : vérifie `readyState === 1` avant d'envoyer, sinon écoute `open` en premier : `{ once: true }` pour ne l'écouter qu'une fois)
