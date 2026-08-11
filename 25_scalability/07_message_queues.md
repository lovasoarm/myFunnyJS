---
stability: intemporel
---

# Découpler pour ne pas tout bloquer en chaîne
Temps de lecture ~11 min

Rick Grimes enregistre un nouveau survivant au camp : le serveur doit sauvegarder le profil, générer une carte d'accès, notifier Daryl pour la garde, et envoyer une alerte radio au conseil. Si tu fais tout ça dans la même requête HTTP, le survivant attend 45 secondes devant un écran de chargement pendant que des Walkers approchent, et si la génération de carte échoue, tout échoue avec elle.

Une message queue (file de messages) dit : enregistre le profil tout de suite, mets le reste dans une file, un autre processus s'en occupe quand il peut. Rick a sa confirmation en 200ms.

Pourquoi ça compte : c'est la différence entre une appli qui répond en 200ms et une appli qui timeout, pour exactement la même quantité de travail au final.

Avantage : découplage (producteur et consommateur n'ont pas besoin d'être synchronisés), résilience (un crash du worker ne perd pas la tâche si bien configuré).
Inconvénient : complexité ajoutée, cohérence éventuelle (vu dans `24_databases/02_nosql_basics`) au lieu d'immédiate.

---

## 1) LE PRINCIPE : PRODUCTEUR, FILE, CONSOMMATEUR

```
PRODUCTEUR (ton serveur API)
  |
  v
 pousse un message dans la FILE
  |
  v
FILE (la queue elle-même, qui stocke les messages en attente)
  |
  v
 un ou plusieurs CONSOMMATEURS (workers) lisent et traitent
```

```js
// Producteur : ton endpoint d'upload, ultra rapide
app.post('/upload', async (req, res) => {
 const fileId = await saveFile(req.file) // rapide : juste sauvegarder le fichier brut

 await queue.push('video-processing', { fileId, userId: req.user.id })
 // on pousse la tâche lourde dans la file, et on répond TOUT DE SUITE

 res.json({ status: 'uploaded', message: 'Traitement en cours' })
})

// Consommateur : un process séparé, qui tourne en continu
async function worker() {
 while (true) {
  const job = await queue.pop('video-processing')
  if (job) {
   await generateThumbnail(job.fileId)
   await compressVideo(job.fileId)
   await notifyUser(job.userId)
  }
 }
}
```

Le pourquoi : l'utilisateur reçoit une réponse en quelques centaines de millisecondes au lieu d'attendre 45 secondes. Le traitement lourd continue en arrière-plan, et l'utilisateur peut être notifié plus tard (websocket vu dans `20_realtime`, email, ou juste un statut qui change quand il rafraîchit).

---

## 2) DÉCOUPLAGE : LE PRODUCTEUR NE CONNAÎT PAS LE CONSOMMATEUR

```
SANS queue (couplage direct) :
API appelle DIRECTEMENT generateThumbnail(), compressVideo(), notifyUser()
--> si compressVideo() crash, TOUTE la requête échoue, même la partie qui marchait
--> l'API doit attendre la fin de TOUT avant de répondre

AVEC queue (découplé) :
API pousse juste un message, répond immédiatement
--> le worker peut crasher et redémarrer SANS affecter l'API
--> tu peux ajouter/retirer des workers sans toucher au code de l'API
```

Le pourquoi c'est puissant : producteur et consommateur évoluent indépendamment. Tu peux changer la logique de traitement vidéo (le consommateur) sans redéployer l'API (le producteur), et vice versa. C'est aussi une porte vers le scale out ciblé (vu dans `02_horizontal_vs_vertical`) : si le traitement vidéo est le goulot d'étranglement, tu ajoutes des workers, pas des serveurs API.

```
Scale ciblé grâce au découplage :
API (légère, rapide) --> 2 instances suffisent
Workers (lourds, lents) --> 10 instances pour absorber la charge de traitement
```

---

## 3) AT-LEAST-ONCE VS EXACTLY-ONCE : LA GARANTIE QUI CHANGE TOUT

```
AT-MOST-ONCE
 --> le message peut être perdu, mais jamais traité deux fois
 --> rare en pratique, dangereux pour des tâches importantes

AT-LEAST-ONCE
 --> le message est garanti d'être traité, mais PEUT être traité plusieurs fois
 --> le cas le plus courant en pratique (la plupart des queues fonctionnent ainsi)

EXACTLY-ONCE
 --> le message est traité une fois et une seule, ni plus ni moins
 --> très difficile à garantir réellement, coûteux, rarement nécessaire
```

Le risque réel avec at-least-once (le cas par défaut) : si ton worker traite un message, mais crash juste APRÈS le traitement et AVANT de confirmer ("ack", acknowledgment) à la queue qu'il a fini, la queue va renvoyer le même message à un autre worker, qui va le retraiter.

```js
// exemple qui casse avec at-least-once mal géré
async function distribuerRations(job) {
 await preleverDuStock(job.quantite) // étape 1 : retire les rations du stock du camp
 // CRASH ICI, avant de pouvoir confirmer à la queue
 await queue.ack(job.id) // jamais atteint
}
// La queue, n'ayant pas reçu l'ack, renvoie le message
// Un autre worker reprend le job depuis le début --> double prélèvement du stock
```

La correction : rendre l'opération idempotente (vue aussi dans `21_api_craft/04_auth_jwt` pour le refresh token), c'est-à-dire que la rejouer plusieurs fois donne le MÊME résultat que la jouer une fois.

```js
// Idempotent : un identifiant unique de distribution empêche le double traitement
async function distribuerRations(job) {
 const dejaFait = await db.query(
  'SELECT id FROM distributions WHERE idempotency_key = $1', [job.idempotencyKey]
 )
 if (dejaFait.rows.length > 0) {
  return // déjà fait, on ne re-prélève pas le stock
 }
 await preleverDuStock(job.quantite, job.idempotencyKey)
 await queue.ack(job.id)
}
```

---

## 4) DEAD LETTER QUEUE : OÙ VONT LES MESSAGES QUI ÉCHOUENT TOUJOURS

```
Message échoue --> retry automatique --> échoue encore --> retry --> échoue encore
                                    |
                                    v
                             après N tentatives :
                             DEAD LETTER QUEUE
                             (file d'attente des morts)
```

Le pourquoi : sans ça, un message qui échoue systématiquement (genre une donnée corrompue qui fait crasher le worker à chaque fois) tourne en boucle de retry infinie, consommant des ressources pour rien, et masquant le fait qu'il y a un vrai problème à régler.

```js
async function processWithRetry(job, maxRetries = 3) {
 for (let attempt = 1; attempt <= maxRetries; attempt++) {
  try {
   await processJob(job)
   return // succès, on s'arrête là
  } catch (err) {
   if (attempt === maxRetries) {
    await deadLetterQueue.push(job) // on abandonne, mais on garde une trace
    await alertTeam(`Job ${job.id} a échoué ${maxRetries} fois`, err)
   }
  }
 }
}
```

Le vrai intérêt : la dead letter queue devient un endroit que l'équipe surveille (vu dans `26_observability`), pour comprendre pourquoi certains messages échouent systématiquement, sans que ça bloque le traitement normal des autres messages.

---

## 5) ORDRE DES MESSAGES : PAS TOUJOURS GARANTI, ET C'EST IMPORTANT DE LE SAVOIR

```
Plusieurs workers en parallèle traitent la MÊME file :

Message 1 (Rick ordonne : fortifier le mur nord) --> Worker A, prend 2 secondes
Message 2 (Rick ordonne : annuler la fortification) --> Worker B, prend 0.1 seconde

Si l'ordre n'est pas garanti et que les workers tournent en parallèle :
Worker B peut FINIR avant Worker A
--> la fortification est "annulée" avant même d'avoir été "lancée"
```

Le risque réel : si l'ordre des opérations a un sens métier (fortifier avant annuler, poster une sentinelle avant la relever), tu dois soit garantir l'ordre (souvent en sacrifiant le parallélisme pour CE type de message précis, par exemple en routant tous les ordres d'un même leader vers le même worker), soit concevoir chaque traitement pour être robuste face au désordre (vérifier l'état actuel avant d'agir, plutôt que de supposer un ordre).

---

## 6) CE QUI CASSE (MAIS FUN) : LA FILE QUI GROSSIT SANS FIN

```js
// exemple minimal : ça marche, 1 producteur, 1 consommateur, débit équilibré

// exemple réaliste : un pic de trafic (lancement produit) fait exploser
// le nombre de messages poussés dans la file, alors que le nombre de workers
// reste fixe

// exemple qui casse : la file grossit plus vite qu'elle ne se vide
// (producteur : 1000 messages/seconde, consommateur : 100 messages/seconde traités)
// Résultat : la file accumule 900 messages en attente PAR SECONDE
// Après 10 minutes : 540 000 messages en attente, certains users attendent
// des heures pour qu'une simple notification leur soit envoyée
```

La correction : surveiller la profondeur de la file (queue depth, vu dans `26_observability/03_metrics_alerting`) comme une métrique critique, et scaler le nombre de workers dynamiquement selon cette profondeur, pas selon une intuition. Un système de queue sans cette surveillance peut sembler fonctionner parfaitement... jusqu'à ce que tu réalises que la file contient 6 heures de retard accumulé.

---

## 7) KAFKA CONCRÈTEMENT : LE LOG QU'ON PEUT REJOUER

Une queue classique, c'est une boîte aux lettres : le facteur dépose, tu relèves, la lettre disparaît. Kafka, c'est le journal de bord du camp : chaque événement est écrit à la suite, à l'encre, et personne ne le gomme quand quelqu'un l'a lu. Deux lecteurs différents peuvent lire la même page, chacun à son rythme, et n'importe qui peut revenir trois pages en arrière.

C'est ça, un log distribué (journal ordonné et répliqué sur plusieurs machines) : le message n'est pas consommé au sens "supprimé", il est lu à une position.

```
QUEUE CLASSIQUE            LOG (Kafka & co)
[m1][m2][m3]               offset:  0   1   2   3   4
 worker pop m1              log:   [m1][m2][m3][m4][m5]   <- rien n'est effacé
 --> m1 disparaît            groupe A lit à l'offset 3
                             groupe B lit à l'offset 1  (indépendant de A)
```

### Partition : découper le journal pour aller plus vite

Un seul journal = un seul rythme d'écriture. Kafka découpe donc un **topic** (un sujet, genre `alertes-perimetre`) en **partitions** : plusieurs journaux parallèles pour le même sujet.

Chaque message part dans une partition choisie par sa **clé de partition** (souvent l'identifiant de l'entité concernée). Conséquence directe, et c'est la partie qui compte : l'ordre n'est garanti **qu'à l'intérieur d'une partition**. Tous les événements du secteur nord dans la même partition = ordre garanti pour le secteur nord. Entre secteur nord et secteur sud, aucun ordre global : et tu n'en as pas besoin.

```
topic "alertes-perimetre"
├── partition 0  [nord-1][nord-2][nord-3]      <- clé "nord", ordre garanti
├── partition 1  [sud-1][sud-2]                <- clé "sud", ordre garanti
└── partition 2  [est-1][est-2][est-3][est-4]  <- clé "est", ordre garanti
```

C'est la même tension que la section 5 : le parallélisme s'achète en renonçant à un ordre total. Kafka ne supprime pas le compromis, il te laisse choisir sa granularité avec la clé.

### Consumer group : qui lit quoi, sans se marcher dessus

Un **consumer group** (groupe de consommateurs, identifié par un nom) est un ensemble de workers qui se partagent le travail d'un topic. La règle tient en une phrase : chaque partition est assignée à **un seul** membre du groupe à un instant donné.

```
topic à 3 partitions

groupe "traitement-alertes" avec 2 workers :
  worker A --> partitions 0 et 1
  worker B --> partition 2

on ajoute un worker C (rééquilibrage automatique) :
  A --> p0     B --> p1     C --> p2

on ajoute un worker D :
  D --> rien du tout. 3 partitions, 4 workers : le 4e attend.
```

Deux conséquences très concrètes :

- Le nombre de partitions est ton **plafond de parallélisme** pour un groupe. Ajouter des workers au-delà ne sert à rien : c'est la première chose à vérifier quand "on a scalé les workers et ça n'accélère pas".
- Deux groupes **différents** sur le même topic lisent tout, chacun de son côté. Le groupe "notifications" et le groupe "analytics" voient les mêmes événements sans se gêner : un producteur, plusieurs usages, zéro duplication de la file.

### Offset : la position, pas la suppression

L'**offset** est le numéro de ligne où en est un groupe dans une partition. C'est une donnée que le groupe **commit** (enregistre) : "j'ai traité jusqu'à la ligne 4 812".

```js
// La mécanique, dépouillée de toute bibliothèque
async function consommer(partition, groupe) {
 let offset = await lireOffsetCommit(groupe, partition.id) // reprise où on s'était arrêté

 while (offset < partition.log.length) {
  const message = partition.log[offset] // on LIT à une position, on ne retire rien
  await traiter(message)
  offset++
  await commitOffset(groupe, partition.id, offset) // on avance le curseur
 }
}
```

Ce que ça change : le crash d'un worker ne perd rien, il repart au dernier offset commité, et les messages déjà traités depuis sont **rejoués**. On retombe pile sur la section 3 : at-least-once, donc idempotence obligatoire. Le log ne te dispense de rien, il rend juste la reprise possible.

### Le replay : la vraie raison d'y venir

Comme rien n'est effacé avant l'expiration de la rétention (durée de conservation configurée, souvent quelques jours), tu peux remettre le curseur d'un groupe à l'offset 0 et **tout relire**. Un bug dans le calcul des scores de risque depuis mardi ? Tu corriges le code, tu remets le groupe au mardi, tu relis. Avec une queue classique, les messages consommés sont partis : tu n'as plus rien à relire, il faut reconstituer à la main depuis la base.

C'est aussi ce qui permet de brancher un nouveau service sur un historique existant : le groupe "analytics" créé aujourd'hui peut lire les événements de la semaine dernière.

Le prix, parce qu'il y en a un : tu stockes tout pendant la rétention (disque, coût), tu gères des partitions et un rééquilibrage qui n'existent pas dans une queue simple, et un replay mal réfléchi renvoie des e-mails déjà envoyés. Un système à faible volume avec des tâches jetables n'a rien à gagner ici : `03-niveau-3-backend.md` de TECH-ILA traite en détail le moment où ce choix devient légitime.

### Ce qu'il faut retenir même quand Kafka aura disparu

Partitions, groupes, offsets, replay : ce ne sont pas des fonctionnalités d'un produit, c'est le modèle "log distribué". Pulsar, Redpanda, Kinesis reprennent les mêmes idées avec d'autres noms. La commande d'installation, elle, aura changé avant que tu aies fini de la retenir.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, beaucoup d'équipes géraient des tâches asynchrones avec des tables SQL dédiées ("table jobs avec un statut pending/done") interrogées en boucle (polling). Ça marche à petite échelle, mais ça sature vite la DB en lectures inutiles. Maintenant, des systèmes dédiés (RabbitMQ, SQS, Kafka pour des volumes massifs) gèrent nativement le push/pop efficace, les retries, et les dead letter queues, sans réinventer ça à la main sur une table SQL. Le switch existe pour la performance et la fiabilité native, pas par mode : une table SQL en polling reste suffisante pour un petit projet avec peu de volume.

---

## EXERCICES

**EXO 1 : Découpe l'inscription au Camp des Survivants**
Rick Grimes met en place un système d'inscription pour le camp : créer le profil du survivant en DB, envoyer une alerte radio au conseil de sécurité, générer une carte d'accès, et notifier Daryl pour l'affectation de garde. Identifie ce qui DOIT être synchrone (avant de confirmer l'inscription au survivant) et ce qui PEUT partir en file asynchrone. Justifie : une erreur sur quoi est inacceptable vs acceptable ? (15 minutes)

**EXO 2 : Rends la distribution de rations de Michonne idempotente**
Le réseau radio du camp est instable. Michonne soumet une distribution de rations pour un groupe de survivants, le serveur reçoit la requête, commence le prélèvement du stock, crash avant de répondre. Son client retente 3 fois. Sans idempotence, le stock est prélevé 4 fois. Reprends l'exemple `distribuerRations` de la section 3, écris ta propre version idempotente, puis compare. (15 minutes)

**EXO 3 : Diagnostique la file qui accumule les alertes**
Le camp de Rick reçoit les alertes de zombies avec 3 heures de retard depuis ce matin. Des survivants sont en danger parce que les notifications push n'arrivent plus. Décris les 3 premières choses à vérifier (métriques, logs) pour identifier si c'est un problème de producteur (capteurs), de file (broker), ou de consommateur (workers d'alerte). (15 minutes)

---

## RÉSUMÉ

Une message queue découple ce qui doit répondre vite de ce qui peut prendre son temps, en échange d'une cohérence éventuelle plutôt qu'immédiate. La garantie at-least-once (la plus courante) exige que tes traitements soient idempotents, sinon un simple crash de worker peut prélever deux fois le même stock. Une dead letter queue évite qu'un message cassé tourne en boucle infinie de retry, et surveiller la profondeur de la file est la seule façon de savoir si tes workers suivent vraiment le rythme du producteur.
