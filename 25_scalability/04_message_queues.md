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

Le pourquoi : l'shinobi reçoit une réponse en quelques centaines de millisecondes au lieu d'attendre 45 secondes. Le traitement lourd continue en arrière-plan, et l'shinobi peut être notifié plus tard (websocket vu dans `20_realtime`, email, ou juste un statut qui change quand il rafraîchit).

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
async function processPayment(job) {
 await chargeCreditCard(job.amount) // étape 1 : prélève l'argent
 // CRASH ICI, avant de pouvoir confirmer à la queue
 await queue.ack(job.id) // jamais atteint
}
// La queue, n'ayant pas reçu l'ack, renvoie le message
// Un autre worker reprend le job depuis le début --> double prélèvement
```

La correction : rendre l'opération idempotente (vue aussi dans `21_api_craft/04_auth_jwt` pour le refresh token), c'est-à-dire que la rejouer plusieurs fois donne le MÊME résultat que la jouer une fois.

```js
// Idempotent : un identifiant unique de transaction empêche le double traitement
async function processPayment(job) {
 const alreadyProcessed = await db.query(
  'SELECT id FROM payments WHERE idempotency_key = $1', [job.idempotencyKey]
 )
 if (alreadyProcessed.rows.length > 0) {
  return // déjà fait, on ne refacture pas
 }
 await chargeCreditCard(job.amount, job.idempotencyKey)
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

Message 1 (créer ordre_mission) --> Worker A, prend 2 secondes
Message 2 (annuler ordre_mission) --> Worker B, prend 0.1 seconde

Si l'ordre n'est pas garanti et que les workers tournent en parallèle :
Worker B peut FINIR avant Worker A
--> la ordre_mission est "annulée" avant même d'avoir été "créée"
```

Le risque réel : si l'ordre des opérations a un sens métier (créer avant annuler, débiter avant créditer), tu dois soit garantir l'ordre (souvent en sacrifiant le parallélisme pour CE type de message précis, par exemple en routant tous les messages d'un même user vers le même worker), soit concevoir chaque traitement pour être robuste face au désordre (vérifier l'état actuel avant d'agir, plutôt que de supposer un ordre).

---

## 6) CE QUI CASSE (MAIS FUN) : LA FILE QUI GROSSIT SANS FIN

```js
// exemple minimal : ça marche, 1 producteur, 1 consommateur, débit équilibré

// exemple réaliste : un pic de trafic (lancement jutsu) fait exploser
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

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, beaucoup d'équipes géraient des tâches asynchrones avec des tables SQL dédiées ("table jobs avec un statut pending/done") interrogées en boucle (polling). Ça marche à petite échelle, mais ça sature vite la DB en lectures inutiles. Maintenant, des systèmes dédiés (RabbitMQ, SQS, Kafka pour des volumes massifs) gèrent nativement le push/pop efficace, les retries, et les dead letter queues, sans réinventer ça à la main sur une table SQL. Le switch existe pour la performance et la fiabilité native, pas par mode : une table SQL en polling reste suffisante pour un petit projet avec peu de volume.

---

## EXERCICES

**EXO 1 : Découpe l'inscription au Camp des Survivants**
Rick Grimes met en place un système d'inscription pour le camp : créer le profil du survivant en DB, envoyer une alerte radio au conseil de sécurité, générer une carte d'accès, et notifier Daryl pour l'affectation de garde. Identifie ce qui DOIT être synchrone (avant de confirmer l'inscription au survivant) et ce qui PEUT partir en file asynchrone. Justifie : une erreur sur quoi est inacceptable vs acceptable ? (15 minutes)

**EXO 2 : Rends le tribut de Michonne idempotent**
Le réseau radio du camp est instable. Michonne soumet un échange de ressources, le serveur reçoit la requête, commence le traitement, crash avant de répondre. Son client retente 3 fois. Sans idempotence, les ressources sont déduites 4 fois. Reprends l'exemple `processPayment` de la section 3, écris ta propre version idempotente, puis compare. (15 minutes)

**EXO 3 : Diagnostique la file qui accumule les alertes**
Le camp de Rick reçoit les alertes de zombies avec 3 heures de retard depuis ce matin. Des survivants sont en danger parce que les notifications push n'arrivent plus. Décris les 3 premières choses à vérifier (métriques, logs) pour identifier si c'est un problème de producteur (capteurs), de file (broker), ou de consommateur (workers d'alerte). (15 minutes)

---

## RÉSUMÉ

Une message queue découple ce qui doit répondre vite de ce qui peut prendre son temps, en échange d'une cohérence éventuelle plutôt qu'immédiate. La garantie at-least-once (la plus courante) exige que tes traitements soient idempotents, sinon un simple crash de worker peut doubler une facturation. Une dead letter queue évite qu'un message cassé tourne en boucle infinie de retry, et surveiller la profondeur de la file est la seule façon de savoir si tes workers suivent vraiment le rythme du producteur.
