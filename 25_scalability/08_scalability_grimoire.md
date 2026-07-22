---
stability: intemporel
---

# Page verrouillée

> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/18_GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~9 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## Le vocabulaire de ceux qui tiennent la charge

Ce grimoire couvre tout le module 25. Pas juste un résumé : c'est ce qu'un dev DOIT savoir par cœur avant de toucher une archi qui doit scaler. Si un terme ici te paraît flou, retourne à la leçon correspondante avant d'avancer.

| Terme | Définition | Code | Analogies | Limite |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- / meme mecanique cote football : le staff repete jusqu'a ce que la tactique tienne sans le tableau | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Load balancer | Répartiteur de charge : reçoit tout le trafic entrant et le distribue sur plusieurs serveurs derrière lui | `const server = servers[i % servers.length]` (round-robin minimal) | le videur à l'entrée du club qui dirige vers les comptoirs / Tobi qui répartit les missions Akatsuki entre les membres | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Round-robin | Algorithme de répartition qui envoie chaque requête au serveur suivant dans la liste, en boucle, sans regarder la charge actuelle | `i = (i + 1) % servers.length` (toujours le suivant, jamais d'index hors limite) | un tour de garde à Fox River où chaque gardien prend son créneau peu importe ce qui se passe / une rotation de titulaires qui ne regarde pas la forme du jour | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Least connections | Algorithme qui envoie la requête vers le serveur ayant le moins de connexions actives en ce moment | `servers.reduce((min, s) => s.activeConnections < min.activeConnections ? s : min)` | Daryl qui envoie le groupe le moins fatigué en éclaireur / le coach qui titularise le joueur le plus frais physiquement | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Sticky session | Le load balancer force un même user à retourner toujours vers le même serveur, souvent via cookie | `Set-Cookie: SERVERID=serverA; Path=/` | Michael qui doit toujours repasser par le même garde corrompu pour son plan / un fan qui a toujours la même place attitrée au stade | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Health check | Vérification périodique par le load balancer qu'un serveur est vivant et répond correctement, pas juste "allumé" | `fetch('/health', { timeout: 2000 })` puis retire le serveur si échec | un appel radio aux Chevaliers pour vérifier qu'ils tiennent encore le combat / le contrôle médical avant chaque match | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Scale up (vertical) | Augmenter les ressources (CPU, RAM) d'une seule machine existante, sans changer le code | `t3.medium --> m5.4xlarge` (même code, machine plus grosse dessous) | Goku qui monte en Super Saiyan, même corps mais plus de puissance brute / un seul artiste qui monte le volume de sa voix au studio | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Scale out (horizontal) | Ajouter plusieurs machines en parallèle au lieu de grossir une seule | `1 serveur --> 5 serveurs derrière un load balancer` | l'Akatsuki qui recrute plus de membres au lieu de rendre un seul membre surpuissant / un label qui signe plusieurs artistes trapsoul au lieu de tout miser sur un seul | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Stateless | Un serveur qui ne garde aucun état local persistant entre deux requêtes : tout l'état est externalisé (DB, Redis) | `await redis.set('active:userId', true)` au lieu de `let activeUsers = {}` en mémoire locale | un survivant de Walking Dead qui n'a aucun bagage fixe et peut dormir dans n'importe quel camp / un joueur prêté qui peut jouer dans n'importe quel club sans s'attacher à un seul vestiaire | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Single point of failure (SPOF) | Point unique dans une architecture dont la panne fait tomber tout le système | un seul serveur scale up qui crash : tout est down | Naruto qui serait le seul ninja capable de combattre, s'il tombe tout le monde tombe / une équipe qui dépend d'un seul joueur vedette | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Rate limiting | Limitation du débit : bloque ou ralentit un client au-delà d'un certain nombre de requêtes dans un temps donné | `redis.incr(key)` puis comparaison à une limite, sinon `429` | la sécurité qui limite l'accès à un comptoir VIP / le coach qui limite les tirs au but à l'entraînement pour ne pas épuiser le gardien | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Fixed window | Algorithme de rate limiting qui compte les requêtes par blocs de temps fixes (minute 1, minute 2…) | `redis.expire(key, 60)` posé à la première requête de la fenêtre | un couvre-feu strict par heure pile à Fox River, sans nuance entre 23h59 et 00h00 / un quota de buts comptés uniquement par mi-temps, pas en continu | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Sliding window | Algorithme de rate limiting qui regarde en continu les X dernières secondes, sans frontière fixe | compte glissant sur "les 60 dernières secondes" peu importe l'instant `t` | une garde tournante en continu chez Rick, jamais un relâchement net à heure fixe / un classement Ballon d'Or qui regarde la forme des 12 derniers mois en continu | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Token bucket | Algorithme de rate limiting où un seau se remplit de jetons à vitesse constante, chaque requête consomme un jeton, autorise des pics courts | `this.tokens = Math.min(capacity, tokens + elapsed * refillRate)` | une réserve de chakra qui se régénère doucement mais permet un jutsu puissant d'un coup si elle est pleine / un crédit de temps de jeu qui se recharge entre deux sprints | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| 429 Too Many Requests | Code de statut HTTP qui signale qu'un client a dépassé sa limite de requêtes | `res.status(429).set('Retry-After', '30')` | un garde qui te dit "repasse dans 30 minutes, pas avant" / un agent qui refuse un nouveau transfert tant que le mercato n'est pas rouvert | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Idempotence | Propriété d'une opération qui donne le même résultat qu'elle soit exécutée une fois ou plusieurs fois | `if (alreadyProcessed) return` avant de débiter une carte | Carl qui revérifie toujours si une porte est déjà sécurisée avant de la sécuriser à nouveau / un arbitre qui ne valide pas deux fois le même but si la vidéo montre la même action | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Message queue | File de messages : stocke des tâches en attente entre un producteur et un ou plusieurs consommateurs | `await queue.push('video-processing', { fileId })` | une file d'attente de prisonniers qui attendent leur tour pour le parloir / un standard radio trapsoul qui empile les morceaux à diffuser sans les jouer tous en même temps | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Producteur / Consommateur | Le producteur pousse des tâches dans la file, le consommateur (worker) les lit et les traite, sans connaître l'un l'autre | `queue.push(...)` côté API, `queue.pop(...)` côté worker | Lincoln qui prépare un plan que Michael exécute sans qu'ils se voient en direct / un beatmaker qui envoie des prods qu'un artiste pioche plus tard sans contact direct | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| At-least-once | Garantie d'une queue où chaque message est traité au moins une fois, mais peut être traité plusieurs fois | message renvoyé si l'`ack` n'arrive jamais à la queue | un message radio répété tant que le Chevalier ne confirme pas réception / une consigne d'entraîneur répétée jusqu'à ce qu'un joueur confirme l'avoir comprise | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Dead letter queue | File secondaire où atterrissent les messages qui échouent systématiquement après plusieurs tentatives | `if (attempt === maxRetries) deadLetterQueue.push(job)` | les cas classés "trop dangereux, mis à l'isolement" à Fox River / les morceaux jamais validés par le label, mis de côté pour analyse | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Queue depth | Profondeur de la file : nombre de messages en attente, métrique critique à surveiller | producteur 1000/s, consommateur 100/s → la file grossit de 900/s | la file de fans devant le stade qui s'allonge plus vite que les contrôles d'entrée n'avancent / le nombre de Horrors signalés qui dépasse le nombre de Chevaliers disponibles | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---

## OÙ LES ANALOGIES CASSENT (règle B.2)

Les analogies de ce grimoire simplifient : elles ne définissent pas. Une
closure **nest pas** un tiroir ; un event loop **nest pas** un carrousel ;
une pile **nest pas** une pile de crêpes. Chaque analogie sert à visualiser
un mécanisme ; elle cesse dès que tu veux raisonner sur la complexité, la
mémoire, la concurrence ou les cas limites. Reviens toujours à la définition
technique avant de coder, débugger ou expliquer à un pair. Une analogie
prise pour la réalité devient un obstacle épistémologique.
