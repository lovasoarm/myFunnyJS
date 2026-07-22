---
stability: intemporel
---

# EVENT-DRIVEN ARCHITECTURE : RÉAGIR, PAS ANTICIPER
Temps de lecture ~9 min

Tu sais ce que font 90% des devs débutants ?
Ils câblent les modules ensemble directement.
Module A appelle Module B. Module B appelle Module C. C'est du spaghetti câblé en dur.

Event-driven change ça : personne n'appelle personne.
Tout le monde écoute. Tout le monde émet.
Comme des Chevaliers de Garo qui ne connaissent pas les autres unités : ils reçoivent juste un signal d'alerte, et ils réagissent.

Résultat : le couplage (dépendance directe entre modules) tombe à zéro.

---

## 1) LE PROBLÈME QUE L'EVENT-DRIVEN RÉSOUT

Architecture couplée classique :

```
UserService --> NotificationService --> EmailService --> SMSService
```

Tu changes l'EmailService ? Tu risques de casser le NotificationService.
Tu ajoutes un SlackService ? Tu dois modifier NotificationService.
C'est fragile. Chaque changement est une bombe à retardement.

Architecture event-driven :

```
UserService --> EventBus <-- NotificationService
           |   <-- EmailService
           |   <-- SlackService
           |   <-- SMSService
```

UserService émet un event `user.registered`.
Il ne sait pas qui écoute. Il ne sait pas combien. Il s'en fout.
Chaque listener (écouteur) réagit à sa façon, dans son coin.

---

## 2) L'EVENTEMITTER : LE COEUR DU TRUC

Node.js fournit `EventEmitter` nativement.
C'est la base de tout le pattern event-driven en JS.

```js
import { EventEmitter } from 'events'; // module natif Node.js

// Le bus d'événements : la tour de contrôle qui relaie les signaux
const bus = new EventEmitter();

// Listener 1 : le service email qui attend les nouvelles inscriptions
bus.on('user.registered', (payload) => {
 // payload (données transportées avec l'event) contient les infos de l'user
 console.log(`Email envoyé à ${payload.email}`);
});

// Listener 2 : le service analytics qui compte les inscriptions
bus.on('user.registered', (payload) => {
 console.log(`Analytics : +1 user depuis ${payload.country}`);
});

// L'émetteur : UserService ne sait pas qui écoute
function registerUser(userData) {
 // ... logique d'inscription en base

 // Émet l'event avec les données associées
 bus.emit('user.registered', {
  id: 'user_42',
  email: userData.email,
  country: userData.country,
 });
}

registerUser({ email: 'leon@kennedy.com', country: 'US' });
// => "Email envoyé à leon@kennedy.com"
// => "Analytics : +1 user depuis US"
```

`bus.on(event, listener)` : s'abonner à un event.
`bus.emit(event, data)` : déclencher un event avec des données.
`bus.off(event, listener)` : se désabonner (capital pour éviter les memory leaks).

---

## 3) CONSTRUIRE UN EVENT BUS PROPRE

EventEmitter brut c'est bien. Un wrapper typé et structuré c'est mieux.

```js
// EventBus maison : wrapper autour d'EventEmitter avec typage explicite
class EventBus {
 #emitter = new EventEmitter(); // propriété privée (# = privé en JS moderne)

 // S'abonner à un event et récupérer une fonction de désabonnement
 on(eventName, listener) {
  this.#emitter.on(eventName, listener);

  // Retourner une fonction cleanup (nettoyage) pour se désabonner proprement
  return () => this.#emitter.off(eventName, listener);
 }

 // Émettre un event avec ses données
 emit(eventName, payload) {
  this.#emitter.emit(eventName, payload);
 }

 // S'abonner une seule fois : l'event se déclenche, le listener disparaît
 once(eventName, listener) {
  this.#emitter.once(eventName, listener);
 }
}

const eventBus = new EventBus();

// Abonnement avec cleanup automatique
const unsubscribe = eventBus.on('mission.started', (mission) => {
 console.log(`Chevalier en route pour ${mission.location}`);
});

eventBus.emit('mission.started', { location: 'Osaka', threat: 'Horror B-class' });

// Plus besoin d'écouter : on se désabonne proprement
unsubscribe();
```

Le pattern `return () => off()` est essentiel.
Sans ça, les listeners s'accumulent en mémoire : c'est une fuite mémoire (memory leak) silencieuse.

---

## 4) EVENTS SYNCHRONES VS ASYNCHRONES

Par défaut, `EventEmitter` est synchrone : les listeners s'exécutent dans l'ordre, immédiatement.

```js
bus.on('horror.detected', () => console.log('1 - Analyse de la menace'));
bus.on('horror.detected', () => console.log('2 - Mobilisation du Chevalier'));

bus.emit('horror.detected'); // synchrone : 1 puis 2 dans l'ordre garanti
console.log('3 - Dispatch terminé');
// => 1 - Analyse de la menace
// => 2 - Mobilisation du Chevalier
// => 3 - Dispatch terminé
```

Si tu veux de l'async : tu l'handles (tu le gères) dans le listener.

```js
bus.on('horror.detected', async (data) => {
 // Le listener est async, mais EventEmitter ne l'attend pas
 await alertKnight(data); // cette promesse est lancée mais non awaited par emit
 console.log('Chevalier alerté');
});

bus.emit('horror.detected', { zone: 'Shibuya' });
console.log('Emit terminé'); // s'affiche AVANT "Chevalier alerté"
```

Risque : si `alertKnight` throw (lance une erreur), personne ne la catch.
Solution : wrapper le listener avec un try/catch explicite, toujours.

```js
bus.on('horror.detected', async (data) => {
 try {
  await alertKnight(data);
 } catch (err) {
  // L'erreur ne disparaît pas en silence
  console.error('Échec alerte Chevalier:', err.message);
 }
});
```

---

## 5) LE PATTERN PUBLISHER / SUBSCRIBER

EventBus c'est bien. Mais en architecture plus large, on parle de Pub/Sub (Publisher/Subscriber).

La différence conceptuelle :

```
EventEmitter  => émetteur sait qu'il émet vers un bus local
Pub/Sub    => publisher (émetteur) et subscriber (abonné) ne se connaissent pas du tout
```

Implémentation Pub/Sub simple :

```js
class PubSub {
 #channels = new Map(); // Map : structure clé-valeur pour stocker les channels

 // S'abonner à un channel (canal thématique)
 subscribe(channel, callback) {
  if (!this.#channels.has(channel)) {
   this.#channels.set(channel, new Set()); // Set : liste sans doublons
  }
  this.#channels.get(channel).add(callback);

  // Retourner la fonction de désabonnement
  return () => this.#channels.get(channel)?.delete(callback);
 }

 // Publier un message sur un channel
 publish(channel, data) {
  if (!this.#channels.has(channel)) return; // personne n'écoute, on s'arrête

  // Notifier tous les abonnés de ce channel
  for (const callback of this.#channels.get(channel)) {
   callback(data);
  }
 }
}

const pubsub = new PubSub();

// Le NotificationService s'abonne au channel 'missions'
pubsub.subscribe('missions', (mission) => {
 console.log(`Notification : mission ${mission.id} reçue`);
});

// L'ArmurerieService s'abonne aussi au même channel
pubsub.subscribe('missions', (mission) => {
 console.log(`Armurerie : préparer l'équipement pour mission ${mission.id}`);
});

// Le MissionService publie sans savoir qui écoute
pubsub.publish('missions', { id: 'MSN-001', items: ['katana', 'armure'], rank: 'A' });
```

---

## 6) QUAND EVENT-DRIVEN ET QUAND PAS

```
BON USAGE             MAUVAIS USAGE
------------------------------   ------------------------------
modules indépendants        logique séquentielle critique
réactions multiples à un event   besoin de résultat synchrone
découpler des services       debug qui doit être linéaire
notifications, logs, analytics   flux de données simples
systèmes distribués        petits projets avec 2 modules
```

Le piège classique : over-engineering (complexité inutile).
Une fonction qui appelle une autre fonction directement, c'est parfois la meilleure solution.
Event-driven n'est pas un dogme. C'est un outil pour des cas précis.

---

## 7) LE PIÈGE QUI FAIT MAL : L'EVENT CASCADE

```
event A --> event B --> event C --> event D --> ...
```

Chaque event déclenche un autre event qui déclenche un autre event.
En prod, c'est un cauchemar à debugger (retracer la chaîne est quasi impossible sans tooling).

Règle : un event ne devrait presque jamais émettre un autre event dans son listener.
Si tu le fais : documente-le explicitement, et surveille la profondeur.

---

## EXERCICES

**EXO 1 : Le système d'alerte de Garo**
Le Conseil de Surveillance doit être averti de chaque Horror détecté, chaque Chevalier mobilisé, et chaque combat terminé.
Construis un EventBus avec trois events : `horror.spotted`, `knight.dispatched`, `combat.resolved`.
Le Conseil s'abonne aux trois. Simule une séquence complète d'un incident.
(Contrainte : assure-toi que le désabonnement fonctionne après combat.resolved)

**EXO 2 : La fuite mémoire de Rick Grimes**
Rick a un système d'alerte zombie : chaque alerte ajoute un listener.
Après 100 alertes, son app plante (trop de listeners en mémoire).
Identifie le bug, propose la fix, et vérifie avec `emitter.listenerCount('event')`.
(Indice : EventEmitter a une limite par défaut de 10 listeners par event : regarde `setMaxListeners`)

**EXO 3 : Le Pub/Sub du Ballon d'Or**
Trois services s'abonnent au channel `votes` : le classement en direct, les analytics de vote, et le système anti-fraude.
Le système anti-fraude peut se désabonner si aucune anomalie n'est détectée pendant 5 votes.
Implémente le tout avec un Pub/Sub, et simule 10 votes dont 2 suspects.

---

## RÉSUMÉ

Event-driven, c'est choisir la réaction plutôt que le câblage direct.
Le coup d'oeil de Garo : personne ne sait qui combat à côté, tout le monde réagit au même signal.
Le vrai gain : tu peux ajouter un service, l'enlever, le modifier : sans toucher au reste.
Le vrai risque : la cascade d'events et les listeners qui s'accumulent en mémoire.
La règle d'or : toujours retourner une fonction de désabonnement. Toujours.
