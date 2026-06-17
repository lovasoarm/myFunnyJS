# Grossir un serveur ou en ajouter dix

Ton serveur sature. Deux options : tu lui donnes plus de RAM et de CPU (scale up), ou tu ajoutes d'autres serveurs à côté (scale out). Ça paraît être un détail d'infra, c'est en fait une décision d'architecture qui impacte tout ton code derrière.

Pourquoi ça compte : si t'as codé ton appli en supposant qu'elle tourne sur UN seul serveur (état en mémoire locale, fichiers écrits sur le disque local), scale out ne marche pas tel quel. Tu dois corriger le code avant de pouvoir ajouter des machines.

Avantage du scale up : zéro changement de code, simple.
Inconvénient : plafond physique, et un seul point de panne (single point of failure) reste un seul point de panne, même énorme.

---

## 1) SCALE UP (VERTICAL) : LA MÊME MACHINE, EN PLUS GROS

```
AVANT : 1 serveur, 4 CPU, 8 Go RAM
APRÈS : 1 serveur, 32 CPU, 128 Go RAM
```

Le pourquoi c'est tentant : tu changes une config cloud (genre passer d'un plan AWS `t3.medium` à `m5.4xlarge`), tu redémarres, et ton code n'a RIEN à changer. Pas de réécriture, pas de gestion d'état partagé, rien.

```js
// Ton code reste identique, qu'il tourne sur une petite ou une grosse machine
app.listen(3000)
// scale up = changer la machine SOUS ce code, le code lui-même ne sait rien
```

Le risque réel, le plafond : tu ne peux pas scale up à l'infini. Il existe une plus grosse machine disponible chez ton cloud provider, et au-delà, tu es bloqué, peu importe combien tu payes. Et même avant d'atteindre ce plafond : un seul serveur, même énorme, reste UN SEUL serveur. S'il crash (panne hardware, mise à jour qui plante), ton appli entière est down. Pas de redondance.

```
SCALE UP :
1 serveur --> grossit --> grossit encore --> plafond physique atteint --> bloqué
ET pendant tout ce temps : 1 seul point de panne, toujours
```

---

## 2) SCALE OUT (HORIZONTAL) : PLUS DE MACHINES, PAS PLUS GROSSES

```
AVANT : 1 serveur, 4 CPU, 8 Go RAM
APRÈS : 5 serveurs, chacun 4 CPU, 8 Go RAM, derrière un load balancer (vu dans 01_load_balancing)
```

Le pourquoi c'est puissant à long terme : pas de plafond théorique, tu ajoutes des machines tant que tu en as besoin. Et la redondance est native : si un serveur tombe, les 4 autres continuent de servir le trafic (à condition que le load balancer ait détecté la panne via health check).

```
SCALE OUT :
5 serveurs --> 1 tombe --> 4 serveurs absorbent la charge --> pas de panne totale
besoin de plus ? --> ajoute un 6e serveur --> pas de plafond pratique
```

Le risque réel : scale out exige que ton code soit "stateless" (sans état local persistant), ce qui n'est PAS gratuit en réécriture si ton appli a été pensée pour un seul serveur depuis le début.

```js
// Mauvais pour le scale out : état stocké EN MÉMOIRE du process
let activeUsers = {} // existe UNIQUEMENT sur ce serveur précis

app.post('/login', (req, res) => {
  activeUsers[req.body.userId] = true
  // Si la prochaine requête de ce user atterrit sur un AUTRE serveur,
  // ce serveur-là ne sait RIEN de cette connexion
})
```

```js
// Bon pour le scale out : état externalisé, partagé par TOUS les serveurs
// (vu en détail dans 23_databases/04_redis_caching)
app.post('/login', async (req, res) => {
  await redis.set(`active:${req.body.userId}`, true)
  // N'IMPORTE QUEL serveur peut lire cette info ensuite
})
```

---

## 3) LE TABLEAU DE DÉCISION

```
SCALE UP, choisis ça si :
- ton appli n'a pas encore d'état partagé géré, et le réécrire coûte trop cher maintenant
- ta charge reste prévisible et sous le plafond d'une grosse machine
- tu veux la solution la plus simple à court terme

SCALE OUT, choisis ça si :
- tu veux de la redondance (tolérance de panne)
- ta charge va dépasser ce qu'une seule machine peut absorber
- tu peux (ou as déjà) rendre ton appli stateless
```

Le piège classique : scale up "en attendant", indéfiniment, parce que scale out demande un effort de refactoring (état externalisé, sessions partagées). Tu repousses la dette technique jusqu'au jour où la plus grosse machine dispo ne suffit déjà plus, et là tu dois faire le refactoring stateless EN PLUS de gérer une urgence de prod. Le bon réflexe : penser stateless dès le début, même en tournant sur un seul serveur, pour garder l'option scale out ouverte sans crise.

---

## 4) COMBINER LES DEUX : CE QUI SE FAIT VRAIMENT EN PROD

En pratique, la plupart des architectures sérieuses font les deux, pas un choix exclusif.

```
Chaque serveur individuel : dimensionné raisonnablement (scale up modéré)
                              |
                              v
Plusieurs de ces serveurs en parallèle (scale out)
                              |
                              v
Load balancer qui répartit entre eux (vu dans 01_load_balancing)
```

Le pourquoi : scale up pur a un plafond et zéro redondance. Scale out pur avec des machines minuscules multiplie le nombre de machines à gérer pour un gain qui pourrait être obtenu plus simplement. Le compromis réel : des machines de taille raisonnable, en nombre suffisant pour la redondance et la charge, ajustées au besoin.

---

## 5) CE QUI CASSE (MAIS FUN) : LE SCALE OUT QUI NE SCALE RIEN

```js
// exemple minimal : ça marche bien sur 1 serveur
const cache = new Map() // cache en mémoire locale du process

function getCachedProduct(id) {
  if (cache.has(id)) return cache.get(id)
  const product = fetchFromDB(id)
  cache.set(id, product)
  return product
}

// exemple réaliste : on scale out de 1 à 4 serveurs pour absorber le trafic du Black Friday

// exemple qui casse : chaque serveur a SON PROPRE cache local, complètement désynchronisé
// Server A a mis le produit 99 en cache avec l'ancien prix
// Server B vient de recevoir l'update du nouveau prix, son cache local est à jour
// Server C, D n'ont jamais mis ce produit en cache, ils tapent direct la DB
// Résultat : 4 utilisateurs qui demandent le MÊME produit au MÊME moment
// reçoivent potentiellement 3 prix différents selon le serveur qui les a traités
```

La leçon : scale out un serveur qui a de l'état local (cache, session, compteur en mémoire) sans externaliser cet état ne te donne pas 4x la capacité, ça te donne 4 versions incohérentes de ta vérité. Le scale out n'est une victoire que si l'état partagé a été pensé AVANT d'ajouter des machines.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, scale up était souvent le réflexe par défaut, parce que gérer plusieurs serveurs à la main (déploiement, synchronisation, load balancing) était lourd opérationnellement. Maintenant, avec les conteneurs (Docker, vu dans `30_annexes/toolchain/05_docker_basics`) et les orchestrateurs (Kubernetes), ajouter ou retirer des instances est devenu une opération quasi automatique (auto-scaling : le nombre de serveurs s'ajuste seul selon la charge mesurée). Le switch existe parce que l'outillage a rattrapé la complexité opérationnelle du scale out, pas parce que le scale up serait devenu inutile : il reste pertinent pour des charges de travail qui ne se parallélisent pas bien (calcul intensif sur une seule grosse tâche).

---

## EXERCICES

**EXO 1 : Le diagnostic avant le choix**
On te donne une appli avec : sessions en mémoire locale par serveur, pas de cache, une seule DB PostgreSQL. Elle doit absorber 10x son trafic actuel le mois prochain. Liste, dans l'ordre, ce qu'il faut corriger AVANT de pouvoir scale out efficacement. (15 minutes)

**EXO 2 : Calcule le plafond**
Une tâche de calcul (genre un traitement d'image) prend 2 secondes sur 1 CPU et se parallélise mal (elle ne peut pas être découpée facilement). Explique pourquoi scale out n'aide pas ici autant qu'on pourrait l'espérer, et ce que scale up apporte à la place. (10 minutes)

**EXO 3 : Trouve l'incohérence**
Reprends l'exemple du cache local du point 5. Propose la correction technique exacte (avec le nom de la techno) pour que les 4 serveurs partagent une vérité unique sur le prix d'un produit. (10 minutes)

---

## RÉSUMÉ

Scale up grossit une machine, simple mais limité par un plafond physique et toujours un seul point de panne. Scale out ajoute des machines, illimité en théorie et redondant, mais exige un code stateless pour ne pas créer plusieurs vérités incohérentes. La vraie question n'est jamais "lequel des deux", c'est "est-ce que mon code peut tourner sur plusieurs machines sans se contredire", et cette question doit se poser avant la crise de charge, pas pendant.
