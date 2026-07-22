---
stability: intemporel
---

# Un seul serveur ne suffit jamais longtemps
Temps de lecture ~11 min

Le soir du match final, des milliers d'ultras tapent sur le serveur du dashboard en simultané. Ce matin ça tenait sans problème avec 10 requêtes, là c'est 100 000 en 30 secondes et le serveur fume. Le load balancer (répartiteur de charge) c'est le mec à l'entrée du stade qui dit "toi tu vas à cette tribune, toi à celle-là" : il distribue le trafic entrant sur plusieurs serveurs au lieu d'en saturer un seul.

Pourquoi ça compte vraiment en prod : un serveur qui tombe sous la charge, c'est pas un bug de code, c'est un problème d'architecture. Tu peux avoir le code le plus propre du monde, si tout le trafic frappe une seule machine, elle va lâcher à un moment.

Avantage : tolérance de panne, scalabilité horizontale possible (vu en détail dans `02_horizontal_vs_vertical`).
Inconvénient : complexité ajoutée, et certains états (sessions, vu plus bas) deviennent un piège si t'y penses pas.

---

## 1) LE PRINCIPE : UN POINT D'ENTRÉE, PLUSIEURS SERVEURS DERRIÈRE

```
             +----------+
     requête 1 ----> | Server A |
             +----------+
USER --> LOAD BALANCER -->
             +----------+
     requête 2 ----> | Server B |
             +----------+
             +----------+
     requête 3 ----> | Server C |
             +----------+
```

Le pourquoi : l'utilisateur tape une seule adresse (genre `api.crazydevs.com`), il ne sait même pas qu'il y a 3, 10, ou 50 serveurs derrière. Le load balancer reçoit tout, et décide à chaque requête vers quel serveur elle part.

```js
// Vue simplifiée de ce qu'un load balancer fait en interne
const servers = ['10.0.0.1', '10.0.0.2', '10.0.0.3']
let currentIndex = 0

function pickServer() {
 const server = servers[currentIndex]
 currentIndex = (currentIndex + 1) % servers.length // boucle, jamais d'index hors limite
 return server
}
```

---

## 2) ROUND-ROBIN : LE TOUR DE TABLE BÊTE ET EFFICACE

```
requête 1 --> Server A
requête 2 --> Server B
requête 3 --> Server C
requête 4 --> Server A (le cycle recommence)
requête 5 --> Server B
```

Le pourquoi : c'est l'algorithme le plus simple, chaque serveur reçoit le même nombre de requêtes sur la durée. Le risque réel : round-robin ne regarde JAMAIS la charge actuelle d'un serveur. Si Server A traite une requête lourde de 5 secondes (genre un export PDF) pendant que B et C traitent des requêtes de 50ms, round-robin continue d'envoyer sa part égale à A, qui accumule une file d'attente alors que B et C sont quasi inactifs.

```
Round-robin aveugle :
Server A : [requête lourde 5s] [nouvelle requête] [nouvelle requête] --> embouteillage
Server B : [requête légère] [vide] [vide] --> sous-utilisé
Server C : [requête légère] [vide] [vide] --> sous-utilisé
```

---

## 3) LEAST CONNECTIONS : ENVOYER VERS LE MOINS OCCUPÉ

```js
// Chaque serveur a un compteur de connexions actives
const servers = [
 { ip: '10.0.0.1', activeConnections: 12 },
 { ip: '10.0.0.2', activeConnections: 3 },
 { ip: '10.0.0.3', activeConnections: 8 }
]

function pickServer() {
 // on trie et on prend celui qui a le moins de connexions ouvertes en ce moment
 return servers.reduce((min, s) => s.activeConnections < min.activeConnections ? s : min)
}
```

Le pourquoi : contrairement à round-robin, cet algo regarde l'état RÉEL du système avant de décider. Si Server B n'a que 3 connexions actives contre 12 sur A, la prochaine requête part vers B, peu importe l'ordre d'arrivée.

```
LEAST CONNECTIONS, contrairement à round-robin :
Server A (12 connexions actives) --> évité temporairement
Server B (3 connexions actives) --> reçoit la prochaine requête
Server C (8 connexions actives) --> en attente de son tour
```

Le quand : utile dès que tes requêtes ont des durées très variables (certaines rapides, certaines lourdes). Round-robin suffit quand tes requêtes sont globalement homogènes en coût.

---

## 4) STICKY SESSIONS : QUAND LE UTILISATEUR DOIT RESTER SUR LE MÊME SERVEUR

```
SANS sticky session :
requête 1 (login) --> Server A --> session stockée EN MÉMOIRE sur A
requête 2 (profil) --> Server B --> Server B ne connaît pas cette session --> 401, déconnecté
```

Le pourquoi du problème : si chaque serveur garde les sessions en mémoire locale (vu le piège similaire pour le cache dans `24_databases/04_redis_caching`), et qu'un utilisateur atterrit sur un serveur différent à chaque requête, il perd sa session à chaque fois.

```js
// Sticky session : le load balancer force le MÊME user vers le MÊME serveur
// souvent via un cookie posé par le load balancer lui-même
// Header de réponse : Set-Cookie: SERVERID=serverA; Path=/
```

```
AVEC sticky session :
requête 1 (login) --> Server A --> cookie SERVERID=A posé
requête 2 (profil) --> cookie lu --> forcé vers Server A --> session retrouvée, ça marche
```

Le risque réel : sticky session résout le symptôme, pas la cause. Si Server A tombe, tous les utilisateurs "collés" à lui perdent leur session d'un coup, et le load balancer doit les réattribuer à un autre serveur qui ne connaît rien d'eux. La vraie solution durable (vue dans `24_databases/04_redis_caching`) : sortir la session de la mémoire locale du serveur et la mettre dans un store partagé (Redis), accessible par TOUS les serveurs. Là, sticky session devient optionnel, pas vital.

```
Architecture stateless (sans état local) recommandée :
Server A, B, C --> tous lisent/écrivent les sessions dans Redis partagé
N'importe quel serveur peut traiter N'IMPORTE QUELLE requête de N'IMPORTE QUEL user
```

---

## 5) HEALTH CHECKS : NE JAMAIS ENVOYER VERS UN SERVEUR MORT

```js
// Le load balancer interroge périodiquement chaque serveur
async function healthCheck(server) {
 try {
  const res = await fetch(`http://${server.ip}/health`, { timeout: 2000 })
  return res.status === 200
 } catch {
  return false // pas de réponse = serveur considéré mort
 }
}

// toutes les X secondes, le load balancer retire les serveurs en échec de la rotation
```

Le pourquoi : sans health check, le load balancer continue d'envoyer du trafic vers un serveur planté, et chaque requête vers lui timeout ou échoue. Avec health check, le serveur mort est retiré automatiquement de la liste, et le trafic se redistribue sur les serveurs vivants, sans intervention humaine.

```
SANS health check :
Server B crash --> load balancer continue d'envoyer 1/3 du trafic vers B --> 33% d'erreurs

AVEC health check :
Server B crash --> health check échoue --> B retiré de la rotation --> 0% d'erreur,
A et C absorbent temporairement toute la charge
```

---

## 6) CE QUI CASSE (MAIS FUN) : LE LOAD BALANCER QUI AMPLIFIE LA PANNE

```js
// exemple minimal : configuration saine
// 3 serveurs, health check toutes les 5 secondes, timeout 2 secondes

// exemple réaliste : un déploiement amène un bug qui ralentit les réponses
// (genre une requête DB sans index, vue dans 24_databases/01_sql_basics)
// Server A devient lent (3 secondes par requête au lieu de 50ms)

// exemple qui casse : le health check de A répond encore "200 OK" parce que
// l'endpoint /health ne teste QUE "le process tourne", pas "le serveur répond vite"
// Résultat : le load balancer continue d'envoyer du trafic vers A,
// qui accumule une file d'attente géante, jusqu'à épuiser ses propres ressources
// et tomber en cascade -- entraînant B et C qui reçoivent alors TOUT le trafic
// d'un coup, et qui tombent eux aussi quelques secondes après
```

La leçon : un health check qui vérifie juste "le process répond" sans vérifier "le process répond VITE et SAINEMENT" donne une fausse sécurité. Un bon health check teste une opération représentative (genre une requête DB légère), pas juste un endpoint statique qui répond toujours `200 OK`.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, le load balancing se configurait souvent à la main avec Nginx ou HAProxy directement sur des VM (machines virtuelles) gérées manuellement. Maintenant, dans un contexte cloud/Kubernetes, le load balancing est en grande partie géré automatiquement par l'orchestrateur (qui fait aussi le health check et le scaling, vu dans `02_horizontal_vs_vertical`). Le switch existe pour réduire l'opération manuelle et réagir plus vite à une panne, pas parce que Nginx serait dépassé : il reste très utilisé, en frontal (reverse proxy) ou dans des architectures plus simples qui n'ont pas besoin d'un orchestrateur complet.

---

## EXERCICES

**EXO 1 : Le QG des Chevaliers Garo distribue les missions**
Le Conseil de Makai reçoit des alertes Horror depuis 3 villes simultanément. Chaque Chevalier (= serveur) n'a pas la même charge : Léon est en combat prolongé, Alfonso vient de terminer. Pour chacun de ces scénarios, choisis round-robin ou least connections et justifie : (a) des alertes de détection rapide qui prennent toutes le même temps (< 100ms), (b) des missions d'exorcisme qui prennent entre 1 et 90 secondes selon l'intensité du Horror, (c) l'upload du rapport de combat (fichier vidéo lourd). (15 minutes)

**EXO 2 : Le faux health check du QG**
Le Conseil utilise un endpoint `/health` qui fait `return res.status(200).send('OK')` et rien d'autre. Alfonso répond encore "OK" mais met 8 secondes à chaque mission au lieu de 200ms : une bête de niveau A bloque sa connexion DB. Le load balancer continue de lui envoyer du trafic. Liste 3 scénarios de panne réelle que ce health check ne détecterait JAMAIS, et propose une version corrigée qui teste vraiment la santé du Chevalier. (15 minutes)

**EXO 3 : Les sessions de Honoo no Kokuin**
L'appli du Conseil stocke l'état de chaque Chevalier (armure active, position, énergie restante) en mémoire locale sur son serveur dédié. Le trafic explose lors d'une invasion massive, on passe de 1 à 5 serveurs. Décris le bug exact qui va apparaître (un Chevalier perd son état en cours de mission), et les deux solutions possibles (sticky session vs store partagé via Redis), avec les compromis de chacune. (15 minutes)

---

## RÉSUMÉ

Un load balancer distribue le trafic pour qu'aucun serveur seul ne porte tout le poids. Round-robin est simple mais aveugle à la charge réelle, least connections s'adapte mieux quand les requêtes sont inégales. Les sessions en mémoire locale créent un piège classique en multi-serveurs : la vraie solution est de sortir l'état du serveur, pas de forcer l'utilisateur à y rester collé. Et un health check qui ne teste pas la vraie santé du serveur donne une fausse sécurité qui peut amplifier une panne au lieu de la contenir.
