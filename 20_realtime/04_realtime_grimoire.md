# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~13 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## 04_REALTIME GRIMOIRE : LE LEXIQUE DU WEB QUI RESPIRE

Tout ce qu'un dev doit avoir en tête sur le temps réel en JS.
Pas un résumé du module : un référentiel complet : les termes, les décisions, les pièges, les patterns de production.

---

## GLOSSAIRE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **WebSocket** | Protocole de communication bidirectionnel persistant sur une connexion TCP. Le serveur peut pousser des données sans attendre une requête du client. | `const ws = new WebSocket('wss://srv.com')` | Le canal radio Garo ouvert entre le QG du Conseil de Surveillance et Leon en patrouille : les deux parlent quand ils veulent, sans attendre que l'autre pose une question / le talkie-walkie de Rick Grimes au camp : en permanence allumé, n'importe qui du groupe peut émettre à tout moment |
| **SSE** (Server-Sent Events : événements envoyés par le serveur) | Connexion HTTP unidirectionnelle longue durée. Le serveur envoie des events en flux continu. Le navigateur reconnecte automatiquement. | `const s = new EventSource('/events')` | Le Conseil de Surveillance de Garo qui reçoit le flux live d'un combat : le Conseil écoute, Leon agit, le canal va dans un seul sens / Trapsoul Radio qui streame un set en direct : la station émet en continu, l'auditeur reçoit sans jamais demander |
| **WebRTC** (Web Real-Time Communication : communication web en temps réel) | API navigateur pour des connexions peer-to-peer audio, vidéo et data sans passer par un serveur central pour les flux. | `new RTCPeerConnection(config)` | Scofield et Lincoln qui communiquent directement sans passer par le système téléphonique de Fox River : peer-to-peer, le flux ne traverse pas la prison / deux Chevaliers de Garo qui coordonnent un combat sans repasser par le Conseil : connexion directe, latence minimale |
| **Handshake** (poignée de main protocolaire) | Échange initial entre client et serveur pour établir une connexion WebSocket. Commence comme du HTTP puis bascule en WS avec un statut `101 Switching Protocols`. | `GET /ws HTTP/1.1\nUpgrade: websocket` | L'embarquement avant un vol / le rituel de serrage de main avant un match de Garo |
| **readyState** (état courant de la connexion) | Propriété d'une WebSocket indiquant son état : 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED. Vérifier avant tout `send()`. | `if (ws.readyState === 1) ws.send(data)` | La jauge de chakra d'un ninja / le statut de l'armure de Leon avant un combat |
| **Broadcast** (diffusion à tous) | Envoyer un message à tous les clients connectés (ou à tous les membres d'une room). | `clients.forEach(c => c.send(payload))` | Un coach qui parle à toute l'équipe en même temps / un Horror qui crie dans la nuit |
| **Room** (salle) | Groupe de clients WebSocket partageant un canal de communication. Implémenté avec `Map<roomName, Set<WebSocket>>` côté serveur. | `rooms.get('Valiante').add(ws)` | Les vestiaires de chaque équipe / les différentes villes patrouillées par les Chevaliers |
| **Polling** (interrogation à intervalles réguliers) | Technique naïve pré-temps réel : le client interroge le serveur toutes les N secondes. Gaspillage de ressources. WebSocket et SSE l'éliminent. | `setInterval(() => fetch('/check'), 3000)` | Rick qui envoie Glenn vérifier le périmètre toutes les 5 minutes pour voir si des zombies approchent, même quand rien ne bouge : utile mais épuisant pour rien / Naruto qui relance un Kage Bunshin de reconnaissance toutes les 3 secondes au lieu d'utiliser son Sage Mode qui prévient automatiquement |
| **Long Polling** | Variante du polling : le client envoie une requête, le serveur la garde ouverte jusqu'à avoir quelque chose à envoyer. Précurseur de SSE. | `fetch('/wait-for-event').then(handleEvent)` | Rester en ligne au téléphone jusqu'à avoir une réponse / attendre devant la porte que quelqu'un ouvre |
| **Heartbeat** (battement de coeur) | Message périodique envoyé pour maintenir une connexion active. Empêche les proxies et load balancers de couper les connexions inactives. | `setInterval(() => ws.ping(), 25000)` | Le rythme cardiaque qui prouve qu'on est en vie / le feu de camp de Rick qui signale que le camp est actif |
| **Backoff exponentiel** (délai qui double à chaque tentative) | Stratégie de reconnexion : augmenter le délai entre les tentatives (1s, 2s, 4s, 8s...) pour ne pas saturer le serveur. | `Math.min(1000 * 2 ** retries, 30000)` | Frapper plus doucement à une porte à chaque fois qu'on recommence / attendre de plus en plus longtemps avant de rappeler |
| **EventSource** | API navigateur native pour consommer un flux SSE. Gère la reconnexion automatique et le `Last-Event-ID`. | `new EventSource('/events')` | Une radio qui se rebranche toute seule si le signal coupe / un abonnement au journal qui se renouvelle automatiquement |
| **Last-Event-ID** | Header HTTP envoyé automatiquement par EventSource lors d'une reconnexion SSE. Permet au serveur d'envoyer les events manqués. | `const id = req.headers['last-event-id']` | Le numéro du dernier épisode regardé pour reprendre au bon endroit / le checkpoint d'une sauvegarde de jeu vidéo |
| **Proxy buffering** (mise en buffer par le proxy) | Un proxy HTTP peut stocker les réponses avant de les transmettre. Catastrophique pour SSE : les events arrivent en batch au lieu d'arriver en direct. Désactiver avec `proxy_buffering off` dans Nginx. | `res.setHeader('X-Accel-Buffering', 'no')` | Un livreur qui attend d'avoir 10 colis avant de partir / un assistant qui accumule les messages avant de les transmettre |
| **SDP** (Session Description Protocol : protocole de description de session) | Format texte décrivant une session WebRTC : codecs supportés, bitrate, chiffrement. Généré par le navigateur, transporté via le signaling. | `await pc.createOffer()` | La fiche technique d'un combattant avant un match / les spécifications d'une armure de Chevalier |
| **ICE** (Interactive Connectivity Establishment : établissement interactif de connectivité) | Mécanisme WebRTC qui teste tous les chemins réseau possibles entre deux pairs et sélectionne le meilleur. | `pc.onicecandidate = ({candidate}) => ...` | Le GPS qui teste toutes les routes avant de choisir la plus rapide / Dijkstra appliqué aux connexions réseau |
| **ICE candidate** (candidat de connexion ICE) | Un chemin réseau possible pour atteindre un pair : IP locale, IP publique, ou adresse relais TURN. ICE en teste plusieurs et garde le meilleur. | `pc.addIceCandidate(new RTCIceCandidate(c))` | Plusieurs chemins pour aller d'une ville à une autre / plusieurs routes d'approvisionnement pour Walter White |
| **STUN** (Session Traversal Utilities for NAT) | Serveur qui retourne à un client son IP publique et le port que son NAT a ouvert. Permet à deux pairs de se trouver sur internet. | `{ urls: 'stun:stun.l.google.com:19302' }` | Un miroir qui te montre comment tu apparais de l'extérieur / demander à quelqu'un "comment t'as réussi à me joindre ?" |
| **TURN** (Traversal Using Relays around NAT) | Serveur relais WebRTC. Quand STUN échoue (NAT symétrique), les flux passent par TURN. Garantit la connexion dans 100% des cas mais coûte de la bande passante. | `{ urls: 'turn:srv.com', username, credential }` | Le serveur de signaling qui finit par transporter les données / l'intermédiaire qui fait passer les messages quand les deux partis ne peuvent pas communiquer directement |
| **Signaling server** (serveur de coordination) | Serveur WebSocket ou HTTP qui transporte les messages SDP et ICE candidates entre les pairs. Ne touche pas aux flux média. | `target.send(JSON.stringify({ offer, fromId }))` | Un arbitre qui transmet les règles du match sans jouer / le serveur postal qui transporte les enveloppes sans les ouvrir |
| **RTCPeerConnection** | L'objet principal de WebRTC. Gère la négociation SDP, la collecte ICE, et les flux média entre deux pairs. | `new RTCPeerConnection({ iceServers })` | Le moteur complet de l'armure de Garo / la connexion principale entre deux Chevaliers |
| **RTCDataChannel** | Canal de données bidirectionnel peer-to-peer dans WebRTC. Fonctionne comme une WebSocket mais sans passer par un serveur. | `pc.createDataChannel('chat')` | Un téléphone direct entre deux joueurs / une ligne rouge entre deux chefs d'état |
| **getUserMedia** | API navigateur qui capture l'audio et la vidéo depuis la caméra et le micro. Retourne un `MediaStream`. | `await navigator.mediaDevices.getUserMedia({ video, audio })` | Allumer la caméra et le micro pour la première fois / équiper l'armure de Leon avant un combat |
| **NAT** (Network Address Translation : traduction d'adresses réseau) | Mécanisme réseau qui permet à plusieurs machines sur un réseau local de partager une seule IP publique. Complique les connexions P2P car les machines ne sont pas directement accessibles depuis internet. | (pas de code : couche réseau) | Un immeuble avec une seule adresse postale pour tous les appartements / une boîte aux lettres collective |
| **Bitrate** (débit binaire) | Quantité de données transmises par seconde (en bits/s). En WebRTC : plus le bitrate est élevé, meilleure est la qualité vidéo, plus la bande passante consommée est grande. | `a=maxpbrrate:2500000` (dans un SDP) | La vitesse de transit des données / la résolution à laquelle Garo voit ses ennemis |
| **Codec** (compresseur-décompresseur) | Algorithme qui encode/décode les flux audio ou vidéo. Exemples : H.264, VP8, VP9 pour la vidéo ; Opus, PCMU pour l'audio. Négocié via SDP. | `a=rtpmap:96 VP8/90000` (dans un SDP) | Le dialecte choisi pour parler / le format d'armure sélectionné pour le combat |
| **Packet loss** (perte de paquets) | Pourcentage de paquets réseau qui n'arrivent pas à destination. En WebRTC : au-dessus de 5%, la qualité vidéo dégrade visiblement. Visible via `getStats()`. | `await pc.getStats()` | Des balles qui n'atteignent pas la cible / des messages qui se perdent en chemin |

---

## LES TROIS TECHNOLOGIES : QUAND CHOISIR QUOI

```
Besoin               Technologie    Raison
--------------------------------------------------------------------
Chat, jeux, co-édition       WebSocket     Bidirectionnel requis
Notifications, feeds, scores    SSE        Unidirectionnel suffisant + reconnexion gratuite
Appel vidéo / audio         WebRTC      Peer-to-peer, serveur hors boucle pour les flux
Transfert de fichiers P2P      WebRTC DataChannel Sans serveur central
Dashboard analytics live      SSE        Simple, robuste, HTTP natif
Collaboration en temps réel     WebSocket     Bidirectionnel avec rooms
Streaming serveur vers client    SSE        Naturel pour ce cas d'usage
```

---

## LES PIÈGES À ÉVITER

**WebSocket**
- Envoyer avant `readyState === 1` : le message est perdu sans erreur visible
- Ne pas implémenter la reconnexion : la connexion meurt et l'app se fige
- `wss.clients.forEach()` sans Room Manager : broadcast à tout le monde au lieu d'une room
- Pas de vérification `readyState` dans le broadcast : exception sur un client fermé

**SSE**
- Ne pas configurer `proxy_buffering off` dans Nginx : les events arrivent en batch
- Oublier le heartbeat : le proxy coupe la connexion après 30-60s d'inactivité
- Garder une liste non nettoyée de clients : memory leak (fuite mémoire) progressif
- Pas d'ID sur les events : impossible de reprendre après une reconnexion

**WebRTC**
- Ne pas avoir de serveur TURN : 20% des connexions échouent (NAT symétriques)
- Ignorer les erreurs `addIceCandidate` : la connexion semble établir mais freeze
- Créer le DataChannel après `createOffer()` : il ne sera pas dans la négociation SDP
- Oublier `muted` sur la vidéo locale : feedback audio immédiat

---

## PATTERNS DE PRODUCTION

**Room Manager robuste :**
```js
// Map<roomName, Set<WebSocket>> + propriété ws.currentRoom
// Nettoyage automatique des rooms vides au leave
// Vérification readyState avant chaque send
```

**SSE avec reprise :**
```js
// Chaque event a un id incrémental
// Les N derniers events sont gardés en mémoire
// Au connect avec Last-Event-ID : rejouer les events manqués
// Heartbeat toutes les 25s : ': ping\n\n'
```

**WebRTC minimal viable :**
```js
// Signaling WebSocket (transport SDP + ICE uniquement)
// RTCPeerConnection avec STUN + TURN
// Écouter iceConnectionState pour détecter les problèmes
// restartIce() en cas de 'failed' avant de recréer la connexion
```

---

## CE QUE CETTE SECTION COUVRE QUE LES TUTOS NE COUVRENT PAS

- Le buffering Nginx qui casse SSE silencieusement
- La reconnexion WebSocket avec backoff exponentiel
- Le Room Manager avec Map + Set au lieu de `wss.clients`
- Le heartbeat comme défense contre les proxies
- TURN obligatoire pour les NATs symétriques (les 20% qui manquent toujours)
- L'état `iceConnectionState === 'failed'` et `restartIce()`
- `Last-Event-ID` pour reprendre un flux SSE sans perdre d'events
- La distinction signaling (ton serveur) vs data path (peer-to-peer)

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: stable
