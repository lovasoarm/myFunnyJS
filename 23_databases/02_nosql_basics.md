# Quand ranger en tables fait plus de mal que de bien

`01_sql_basics` t'a montré la DB relationnelle : tables strictes, schéma fixe, relations propres. NoSQL (not only SQL), c'est la famille de DB qui dit "ton schéma change tout le temps, alors arrête de te battre contre lui".

Pourquoi ça compte : si tu modélises un catalogue produit avec 50 colonnes optionnelles différentes selon la catégorie (un t-shirt a une taille, un livre a un ISBN, un meuble a des dimensions) en SQL, tu te retrouves avec une table pleine de colonnes `NULL`. En NoSQL document, chaque produit a juste les champs qu'il a besoin.

Avantage : flexibilité du schéma, scalabilité horizontale native pour certains types.
Inconvénient : tu perds souvent les garanties d'intégrité fortes (vu dans `03_data_modeling`) et les JOINs propres.

---

## 1) LES QUATRE FAMILLES : PAS UNE SEULE "NOSQL"

Erreur de débutant : penser que "NoSQL" = MongoDB. NoSQL est une catégorie, pas une techno. Quatre familles principales :

```
DOCUMENT      -->  MongoDB, Firestore : des objets JSON-like, schéma flexible
CLÉ-VALEUR    -->  Redis, DynamoDB : une clé pointe vers une valeur, ultra rapide
COLONNE LARGE -->  Cassandra, ScyllaDB : optimisé pour écrire/lire des colonnes massives
GRAPHE        -->  Neo4j : optimisé pour les RELATIONS entre données (réseau social, recommandations)
```

Chaque famille résout un problème précis. Aucune n'est "la meilleure" : c'est la question qui est mal posée.

---

## 2) DOCUMENT : DES OBJETS, PAS DES LIGNES

```js
// Un document MongoDB : ressemble à un objet JS, parce que c'est littéralement du BSON
// (binary JSON : JSON encodé en binaire pour la perf)
{
  _id: "65f3a2...",
  username: "aramis",
  email: "dev@crazydevs.com",
  preferences: {
    theme: "dark",
    notifications: { email: true, push: false }
  },
  tags: ["js", "ts", "backend"]
}
```

Le pourquoi : pas besoin de `JOIN` pour récupérer les préférences d'un user, elles sont DANS le document. Tu lis un document, t'as tout ce qui concerne cet user d'un coup.

```
SQL : users (table) + preferences (table) --> JOIN pour tout récupérer
DOCUMENT : users (collection) avec preferences imbriqué --> 1 lecture, tout est là
```

Le risque réel : tu dupliques de la donnée partout (denormalisation : vue dans `03_data_modeling`) pour éviter les jointures. Si le `username` d'un user change, et que ce username est dupliqué dans 10 000 documents `orders` (pour éviter une jointure), tu dois mettre à jour 10 000 documents. En SQL, tu changes 1 ligne dans `users`, et le `JOIN` répercute automatiquement.

```js
// Exemple qui casse : duplication oubliée
// On a stocké le username dans chaque commande pour aller plus vite
{ orderId: 1, username: "aramis", total: 50 }
{ orderId: 2, username: "aramis", total: 30 }

// L'user change son username en "crazydevs"
// Si tu oublies de mettre à jour TOUTES les commandes existantes :
{ orderId: 1, username: "aramis", total: 50 }    // donnée périmée (stale data)
{ orderId: 2, username: "crazydevs", total: 30 } // mise à jour, incohérent avec orderId 1
```

---

## 3) CLÉ-VALEUR : LA VITESSE BRUTE

```
clé                  -->  valeur
"session:abc123"     -->  { userId: 42, role: "admin" }
"cache:product:99"   -->  { name: "...", price: 29.99 }
"ratelimit:ip:1.2.3.4" -->  12
```

Le pourquoi : pas de requête complexe, pas de `WHERE`, pas de `JOIN`. Tu connais la clé, tu demandes la valeur. C'est souvent en RAM (Redis), donc la latence (temps de réponse) est de l'ordre de la milliseconde, pas de la dizaine de millisecondes comme une requête SQL sur disque.

```js
// Lire/écrire une session : ultra simple, ultra rapide
await redis.set('session:abc123', JSON.stringify({ userId: 42 }), 'EX', 3600)
const session = JSON.parse(await redis.get('session:abc123'))
```

Le quand : cache (vu en détail dans `04_redis_caching`), sessions, rate limiting, compteurs en temps réel, queues simples. Pas pour des données qui ont besoin de requêtes complexes ("tous les users créés ce mois-ci avec plus de 5 commandes" : impossible nativement en clé-valeur pur).

---

## 4) COLONNE LARGE : ÉCRIRE BEAUCOUP, VITE, PARTOUT

Pensé pour des volumes massifs (logs, IoT, séries temporelles) répartis sur plusieurs machines (distributed : distribué).

```
TABLE SQL classique : une ligne = toutes ses colonnes ensemble, sur une machine

COLONNE LARGE : optimisé pour écrire des colonnes en masse,
réparties sur plusieurs noeuds (nodes) du cluster
```

Le pourquoi : quand t'as 50 000 capteurs IoT qui écrivent une métrique par seconde, une DB relationnelle classique sature vite en écriture sur une seule machine. Une DB colonne large comme Cassandra est faite pour distribuer cette charge d'écriture sur plusieurs machines sans single point of failure (point unique de panne).

Le risque réel : ces DB sacrifient souvent la cohérence forte (vu dans `24_scalability`) pour la disponibilité et la vitesse. Tu peux lire une donnée légèrement périmée juste après une écriture (eventual consistency : cohérence éventuelle). Si ton métier ne tolère pas ça (transaction bancaire), c'est disqualifiant.

---

## 5) GRAPHE : QUAND LA RELATION EST LA DONNÉE

```
SQL : pour "amis des amis qui aiment le même artiste"
--> plusieurs JOIN en cascade, ça devient illisible et lent

GRAPHE : User --[FOLLOWS]--> User --[LIKES]--> Artist
--> tu traverses le graphe directement, la relation EST la structure
```

Le pourquoi : dans un réseau social ou un moteur de recommandation, la question posée est presque toujours "qu'est-ce qui est connecté à quoi, à quelle distance". Une DB graphe (Neo4j) stocke les relations comme citoyens de première classe (pas comme une table de jointure de plus), donc traverser 3, 4, 5 niveaux de relation reste rapide.

```
SQL pour "amis de mes amis" : JOIN friends f1 JOIN friends f2 ON f1.friend_id = f2.user_id
--> coûte cher en JOIN multiples sur de gros volumes

GRAPHE : MATCH (me)-[:FRIEND]->()-[:FRIEND]->(foaf) RETURN foaf
--> traversal natif, pensé pour ça
```

Le quand : réseaux sociaux, recommandations, détection de fraude (réseaux de comptes liés), moteurs de recherche de chemin. Le risque : c'est une techno de niche, l'équipe doit apprendre un nouveau langage de requête (Cypher pour Neo4j), et c'est rarement justifié pour un produit simple.

---

## 6) CHOISIR : LA VRAIE QUESTION

```
Pose-toi ces questions, dans cet ordre :

1. Mes données ont-elles un schéma stable et des relations fortes ?
   --> OUI : SQL (relationnel) est probablement le bon choix par défaut

2. Mon schéma change souvent, ou varie énormément d'un enregistrement à l'autre ?
   --> OUI : DOCUMENT (MongoDB) peut t'éviter une table à 60 colonnes NULL

3. J'ai besoin de lire/écrire UNE valeur identifiée par UNE clé, ultra vite ?
   --> OUI : CLÉ-VALEUR (Redis)

4. Je dois ingérer des volumes massifs et continus, répartis sur plusieurs machines ?
   --> OUI : COLONNE LARGE (Cassandra)

5. Ma question métier principale, c'est "qu'est-ce qui est connecté à quoi" ?
   --> OUI : GRAPHE (Neo4j)
```

Le piège classique : choisir NoSQL parce que "c'est plus moderne" ou "c'est ce qu'utilise telle grosse boîte". La vraie question n'est jamais "SQL ou NoSQL", c'est "quelle est la forme de mes données et la forme de mes requêtes". Beaucoup de projets utilisent les deux : PostgreSQL pour les données métier structurées, Redis pour le cache, et c'est très bien comme ça.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Vers 2010-2015, il y a eu une mode "NoSQL partout, SQL c'est mort" (le mouvement "NoSQL movement"). En pratique, la plupart des startups qui sont parties 100% MongoDB se sont retrouvées à réimplémenter à la main des contraintes que SQL offre nativement depuis 40 ans (intégrité référentielle, transactions ACID vues dans `03_data_modeling`). Aujourd'hui le réflexe sain : SQL par défaut pour la donnée métier structurée, NoSQL pour les cas précis où ses forces (schéma flexible, vitesse clé-valeur, traversal de graphe) résolvent un vrai problème que tu as identifié, pas un problème que tu imagines avoir.

---

## EXERCICES

**EXO 1 : Le bon choix pour le bon problème**
Pour chacun de ces cas, choisis la famille NoSQL (ou SQL) la plus adaptée et justifie en une phrase : (a) système de cache de pages web, (b) catalogue produit e-commerce avec attributs variables par catégorie, (c) moteur de recommandation "personnes que vous connaissez peut-être", (d) logs d'accès de 10 000 requêtes par seconde. (15 minutes)

**EXO 2 : Le coût de la duplication**
Tu stockes le `username` dupliqué dans chaque document `comment` pour éviter une jointure. Liste 3 scénarios où cette décision te coûte cher à maintenir, et propose une alternative pour chacun. (15 minutes)

**EXO 3 : Migration inversée**
On te donne une base MongoDB avec une collection `orders` où chaque document a une structure totalement différente selon l'âge de la commande (le schéma a évolué 4 fois sans migration propre). Décris en pseudo-étapes comment tu remettrais de la cohérence, sans tout casser en prod. (20 minutes)

---

## RÉSUMÉ

NoSQL n'est pas une alternative à SQL, c'est quatre familles d'outils différents pour quatre formes de problèmes différentes. Document quand le schéma bouge trop, clé-valeur quand la vitesse brute prime, colonne large quand le volume d'écriture distribué prime, graphe quand la relation EST la donnée. Le bon réflexe : regarder la forme de tes données et de tes requêtes avant de choisir l'outil, jamais l'inverse.
