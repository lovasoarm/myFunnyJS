---
stability: intemporel
---

# Du single-node au cluster : le pont vers le distribué
Temps de lecture ~12 min

Tu viens de voir (dans `24_databases/01` à `24_databases/06`) une base tourner sur une seule machine : un process, un disque, une horloge, une source de vérité. Le module `25_scalability` va supposer que cette machine ne suffit plus : plusieurs répliques, plusieurs zones, plusieurs horloges. Entre les deux, il y a un pont conceptuel obligatoire que ce fichier tient : **CAP, réplication, partitioning, split-brain**.

Où l'analogie casse : les analogies "ninja / foot" ci-dessous simplifient la synchronisation entre noeuds. Un vrai cluster subit des délais réseau non bornés, des pertes de messages, et des horloges qui divergent, choses qu'aucune analogie n'égale exactement.

---

## 1) POURQUOI ON QUITTE LE SINGLE-NODE

Une seule machine est simple : une source de vérité, aucune synchronisation. Mais elle a trois plafonds :

- **Débit** : un CPU/disque, une limite dure de requêtes par seconde.
- **Disponibilité** : la machine tombe, le service tombe. Point.
- **Latence géographique** : un utilisateur à Tokyo attend 200 ms si la DB est à Paris.

Ajouter des noeuds répond aux trois. Ajouter des noeuds crée quatre nouveaux problèmes : réplication, partitioning, cohérence, split-brain.

---

## 2) CAP : LE THÉORÈME QU'ON NE PEUT PAS TROMPER

CAP dit : sur un système distribué, quand une **P**artition réseau survient (des noeuds ne peuvent plus se parler), tu dois choisir entre **C**onsistance et **A**vailability. Pas les deux.

```
NORMAL (pas de partition)                PARTITION RESEAU
+--------+       +--------+               +--------+  X   +--------+
| Node A |<----->| Node B |               | Node A |------| Node B |
+--------+       +--------+               +--------+      +--------+
   OK, C et A tenues                          il faut choisir :
                                              - CP : Node B refuse d'ecrire
                                              - AP : Node B accepte, divergence
```

- **CP** (Consistency + Partition-tolerance) : le noeud isolé refuse d'écrire, le client voit une erreur. Exemples : etcd, ZooKeeper, PostgreSQL en replication synchrone.
- **AP** (Availability + Partition-tolerance) : le noeud isolé accepte l'écriture, on réconcilie plus tard. Exemples : Cassandra, DynamoDB (mode par défaut), Riak.
- **CA** n'existe pas en distribué réel : la partition est un fait, pas un choix.

Où l'analogie casse (foot) : deux arbitres séparés par un tunnel de communication doivent choisir : soit ils refusent tout but tant que l'accord n'est pas confirmé (CP, jeu suspendu), soit chacun compte de son côté et on ré-arbitre après (AP, scores divergents temporairement). La vraie vie distribuée ajoute des messages qui arrivent dans le désordre, ce que l'arbitre ne subit pas.

---

## 3) RÉPLICATION : COMBIEN DE COPIES, ET SYNCHRONES OU ASYNCHRONES

Répliquer = stocker la même donnée sur N noeuds.

- **Réplication synchrone** : l'écriture n'est confirmée au client qu'après que tous les réplicas ont écrit. Sûr, lent, sensible à la panne d'une réplique.
- **Réplication asynchrone** : l'écriture est confirmée dès que le leader a écrit. Rapide, mais si le leader tombe avant de propager, la donnée est perdue.
- **Quorum** (`W + R > N`) : compromis. On écrit sur `W` noeuds sur `N`, on lit sur `R` noeuds. Si `W + R > N`, toute lecture intersecte au moins une écriture récente.

```
N=3, W=2, R=2 --> W+R=4 > 3 : coherent
N=3, W=1, R=1 --> W+R=2 < 3 : lecture peut renvoyer vieille valeur
```

---

## 4) PARTITIONING (SHARDING) : DECOUPER LA DONNÉE

Répliquer copie la même donnée. Partitionner la découpe : chaque noeud possède un sous-ensemble.

- **Par plage** (`user_id 0-999` sur A, `1000-1999` sur B) : bon pour les scans ordonnés, mauvais si un range est chaud.
- **Par hash** (`hash(user_id) % N`) : distribution uniforme, mais ajouter un noeud reshuffle presque tout. **Consistent hashing** limite le reshuffle aux clés voisines.
- **Par géographie** (users EU sur cluster EU, US sur US) : latence idéale, complexité juridique et transactionnelle.

Combinaison réelle : on **partitionne** pour scaler l'écriture, puis on **réplique** chaque partition pour tenir la panne.

---

## 5) SPLIT-BRAIN : LES DEUX MOITIÉS QUI SE CROIENT TOUTES SEULES CHEF

Deux répliques se perdent de vue. Chacune se croit leader. Chacune accepte des écritures. Quand le réseau revient, il y a deux versions incompatibles de la vérité.

```
AVANT :         Leader --replique--> Follower
PARTITION :     Leader  X  ??? Follower devient auto-leader
APRES :         Leader (v1)      Leader (v2)    <-- CONFLIT
```

Parades classiques :
- **Quorum de leader** : un noeud ne se déclare leader que s'il a l'accord de la majorité (`> N/2`). Une moitié minoritaire ne peut jamais s'auto-couronner.
- **Fencing** (STONITH) : le vieux leader est physiquement isolé (kill process, cut network) avant qu'un nouveau prenne la main.
- **Réconciliation applicative** : accepter le split, résoudre le conflit à la fusion (CRDT, last-write-wins, merge métier).

---

## 6) LA CHECKLIST DE PASSAGE 24 → 25

Avant d'attaquer `25_scalability`, tu dois pouvoir répondre en 30 secondes chacune :

1. Qu'est-ce que CAP force à choisir sous partition, et pourquoi CA n'existe pas ?
2. Différence entre réplication synchrone, asynchrone, quorum ?
3. Différence entre répliquer et partitionner ?
4. Qu'est-ce qu'un split-brain et une parade concrète ?
5. Pourquoi `consistent hashing` limite le reshuffle quand on ajoute un noeud ?

Si tu bloques sur une question, relis la section correspondante avant de passer au module suivant.

---

## EXERCICES

**EXO 1 : CP ou AP ?**
Pour chaque système, dis CP ou AP et pourquoi (2 lignes chacun) : (a) système de vote pour le Ballon d'Or en direct, (b) fil d'actualités d'un réseau social, (c) verrou distribué pour un lock exclusif, (d) compteur de likes. (10 min)

**EXO 2 : quorum**
Tu as `N=5` répliques. Calcule tous les couples `(W, R)` valides pour `W + R > N`. Lequel privilégie la lecture rapide, lequel privilégie l'écriture rapide ? (10 min)

**EXO 3 : split-brain minimal**
Écris en pseudo-code une routine `try_become_leader(nodes)` qui refuse le leadership si la majorité des noeuds n'est pas joignable. Fais tomber deux noeuds sur cinq et vérifie que la routine tient. (20 min)

---

## RÉSUMÉ

Passer du single-node au cluster impose de choisir sous partition (CAP), de décider comment on réplique (sync / async / quorum), de découper la donnée (partitioning), et de se prémunir contre le split-brain (quorum de leader, fencing). Sans ce socle, `25_scalability` devient une liste de patterns sans le "pourquoi" qui les rend nécessaires.
