---
stability: intemporel
---

# MICROSERVICES : DÉCOUPER OU SOUFFRIR : MAIS PAS N'IMPORTE COMMENT
Temps de lecture ~9 min

La prison de Fox River était une architecture monolithique.
Tout était dans le même bâtiment : les cellules, la cuisine, l'administration, le couloir de la mort.
Un seul problème quelque part ? L'ensemble se paralysait.

Michael Scofield avait tout tatoué sur lui : un système distribué.
Chaque partie du plan vivait dans une zone indépendante.
Si un gardien trouvait un morceau du tatouage, il ne comprenait pas l'ensemble.

Microservices c'est ça : décomposer un système monolithique en services indépendants qui communiquent.
Mais Scofield avait aussi un plan béton avant de se tatouer.
Spoiler : la plupart des équipes qui font du microservices n'ont pas de plan.
Résultat : le chaos distribué.

---

## 1) MONOLITHE VS MICROSERVICES

**Monolithe (monolithic architecture) :**

```
[OrderService]
   |
   |-- [UserService]
   |-- [PaymentService]
   |-- [NotificationService]
   |-- [InventoryService]

Tout dans un seul process (processus), une seule base de code, un seul déploiement.
```

**Microservices :**

```
[OrderService]   --> HTTP / Message Queue --> [PaymentService]
[UserService]   --> HTTP / Message Queue --> [NotificationService]
[InventoryService] --> HTTP / Message Queue --> [OrderService]

Chaque service = process indépendant, base de code indépendante, déploiement indépendant.
```

---

## 2) LES VRAIES RAISONS DE DÉCOUPER

Pas "parce que Netflix le fait".
Netflix a 400 millions d'users. Toi tu as 400.

Les vraies raisons valides :

```
Raison            Explication
----------------------------- --------------------------------------------------
Scale indépendant       Le PaymentService a 10x plus de charge que le UserService
Deploy indépendant       L'équipe Payment déploie sans attendre l'équipe User
Isolation des pannes      Le NotificationService plante, les tributs continuent
Technologie différente     PaymentService en Go (perf), OrderService en Node, ML en Python
Équipes autonomes       Chaque équipe possède son service, pas de bottleneck inter-équipe
```

Les mauvaises raisons :

```
- "C'est la tendance"
- "Notre monolithe est lent" (ce n'est pas une raison de découper : c'est une raison de profiler)
- "On veut faire comme Spotify"
- "Notre archi est complexe" (un monolithe bien structuré est souvent moins complexe)
```

---

## 3) LA COMMUNICATION ENTRE SERVICES

Deux modes principaux :

**Synchrone (synchronous) : requête → réponse immédiate**

```
OrderService --HTTP GET--> UserService --200 OK + data--> OrderService
```

Avantage : simple, immédiat, résultat garanti.
Inconvénient : si UserService est down (hors ligne), OrderService est bloqué.
C'est du couplage temporel (temporal coupling) : les deux doivent être vivants en même temps.

```js
// OrderService qui appelle UserService directement via HTTP
async function getUser(userId) {
 // fetch vers le service externe : si ça timeout (délai dépassé), on gère l'erreur
 const response = await fetch(`http://user-service/users/${userId}`, {
  signal: AbortSignal.timeout(3000), // timeout (délai max) à 3 secondes
 });

 if (!response.ok) {
  // Le service est down ou a retourné une erreur : on le gère proprement
  throw new Error(`UserService error: ${response.status}`);
 }

 return response.json();
}
```

**Asynchrone (asynchronous) : message queue (file de messages)**

```
OrderService --PUBLISH--> [Queue: order.created] <--CONSUME-- NotificationService
                           <--CONSUME-- InventoryService
```

Avantage : découplage total dans le temps. NotificationService peut être down : le message attend.
Inconvénient : plus complexe, résultat non immédiat, debugging plus difficile.

```js
// Simuler une message queue simple en JS (sans Redis ni RabbitMQ pour l'exemple)
class MessageQueue {
 #queues = new Map(); // Map des channels avec leurs messages en attente

 // Publier un message dans une queue
 publish(queueName, message) {
  if (!this.#queues.has(queueName)) {
   this.#queues.set(queueName, []);
  }
  this.#queues.get(queueName).push(message); // le message attend en queue
 }

 // Consommer (lire et supprimer) le prochain message d'une queue
 consume(queueName) {
  return this.#queues.get(queueName)?.shift() ?? null; // shift() prend le premier élément
 }
}

const queue = new MessageQueue();

// OrderService publie l'event sans attendre de réponse
queue.publish('mission.assigned', { missionId: 'MSN-007', shinobiId: 'S-001', rank: 'B' });

// NotificationService consomme indépendamment (peut être décalé dans le temps)
const mission = queue.consume('mission.assigned');
if (mission) {
  console.log(`Notification : mission ${mission.missionId} assignée`);
}
```

---

## 4) SERVICE DISCOVERY ET API GATEWAY

En microservices, les services ne s'appellent pas par IP fixe.
Ils utilisent du service discovery (découverte de services) : un registre centralisé.

```
Client --> [API Gateway] --> [Service Registry] --> [OrderService instance 1]
                           --> [OrderService instance 2]
                           --> [PaymentService]
```

**API Gateway (passerelle API) :** point d'entrée unique.
Le client n'a aucune idée que derrière, il y a 12 services.
L'API Gateway route (dirige), authentifie, rate-limit (limite le débit), et log.

Sans API Gateway :
```
Client --> OrderService:3001
Client --> UserService:3002
Client --> PaymentService:3003
```
Le client doit connaître toutes les adresses. Cauchemar.

Avec API Gateway :
```
Client --> Gateway:80 --> /orders --> OrderService
           --> /users  --> UserService
           --> /payment --> PaymentService
```

---

## 5) LES PIÈGES QUI FONT MAL EN PROD

**Piège 1 : distributed monolith (monolithe distribué)**

```
OrderService --> UserService --> PaymentService --> InventoryService --> OrderService
```

Tout le monde s'appelle en chaîne, en synchrone.
C'est un monolithe, juste déployé en plusieurs endroits.
Si un service est down, toute la chaîne plante.
Pire qu'un vrai monolithe : la latence (délai de réseau) s'additionne à chaque hop (saut).

**Piège 2 : data sharing (partage de base de données)**

```
OrderService --|
        |--> [Shared DB]  <-- INTERDIT
UserService  --|
```

Si deux services partagent la même DB, ils sont couplés au niveau des données.
Modifier le schema (structure) pour OrderService casse UserService.
Règle absolue : une DB par service. Toujours.

**Piège 3 : microservices trop petits**

```
[GetUserNameService] [GetUserEmailService] [GetUserAgeService]
```

Ce n'est pas des microservices. C'est de la folie.
Un service doit représenter un domaine (domain) cohérent, pas une seule fonction.

---

## 6) QUAND NE PAS FAIRE DU MICROSERVICES

Rick Grimes a commencé avec un groupe de 4 survivants.
Il n'a pas construit une infrastructure pour 10 000 personnes dès le premier jour.

Microservices c'est pareil :

```
NE PAS FAIRE DE MICROSERVICES SI :
- ton équipe fait moins de 5 devs
- tu n'as pas encore de survivants en prod
- ton monolithe n'a pas de vrais problèmes de scale
- tu n'as pas d'équipes autonomes par domaine
- tu ne maîtrises pas le monitoring distribué

FAIRE DES MICROSERVICES SI :
- tu as des équipes qui se bloquent mutuellement
- tu as des services avec des besoins de scale radicalement différents
- tu as des parties du système avec des SLA (niveaux de service garantis) différents
- tu as déjà un monolithe qui fonctionne bien et que tu veux évoluer prudemment
```

---

## 7) ARCHITECTURE ÉVOLUTIVE : DU MONOLITHE AU SERVICE

Le bon chemin :

```
Phase 1 : Monolithe bien structuré (modules indépendants, pas de couplage interne)
   |
   v
Phase 2 : Identifier les domaines qui ont des besoins différents (scale, déploiement, équipe)
   |
   v
Phase 3 : Extraire progressivement les domaines en services
   |
   v
Phase 4 : Microservices avec API Gateway, service discovery, monitoring distribué
```

Ne jamais sauter Phase 1 et 2.
Un monolithe propre est la meilleure préparation au découpage.
Si ton monolithe est du spaghetti, tes microservices seront du spaghetti distribué.

---

## EXERCICES

**EXO 1 : Le plan de Scofield**
Fox River a 5 domaines : `prisonniers`, `gardes`, `sections`, `visiteurs`, `accès`.
Décide lesquels méritent d'être des services séparés et pourquoi.
Justifie chaque décision avec un argument concret : scale différent, équipe différente, SLA différent.
(Contrainte : tu dois en laisser au moins deux dans un monolithe. Justifie pourquoi.)

**EXO 2 : La communication qui évite le distributed monolith**
Tu as `OrderService`, `PaymentService`, et `NotificationService`.
Dessine deux architectures : une avec couplage synchrone en chaîne, une avec message queue.
Identifie le point de failure (point de défaillance) dans chaque cas.
Implémente la version message queue avec le `MessageQueue` de la leçon.

**EXO 3 : L'API Gateway de Prison Break**
Construis un API Gateway minimaliste en Node.js qui route les requêtes vers les bons "services" (simples fonctions qui retournent des données mockées).
Routes : `/api/prisoners`, `/api/guards`, `/api/sections`.
Ajoute un middleware de logging qui log (enregistre) chaque requête avec son timestamp.

---

## RÉSUMÉ

Microservices n'est pas une architecture pour être moderne. C'est un outil pour des problèmes spécifiques.
Le vrai problème que ça résout : des équipes qui se bloquent mutuellement et des services avec des besoins radicalement différents.
Le piège principal : croire que découper résout les problèmes de code. Non : ça distribue les problèmes.
Un monolithe propre avec des modules découplés vaut mieux que des microservices mal conçus.
La règle qui sauve : une DB par service, jamais partagée. Sans ça, c'est un monolithe déguisé.
