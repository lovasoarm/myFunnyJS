---
stability: intemporel
---

# Quand ranger en tables fait plus de mal que de bien
Temps de lecture ~10 min

`01_sql_basics` t'a montré la DB relationnelle : tables strictes, schéma fixe, relations propres. NoSQL (not only SQL), c'est la famille de DB qui dit "ton schéma change tout le temps, alors arrête de te battre contre lui".

Pourquoi ça compte : si tu modélises un profil de ninja avec 50 attributs optionnels selon son clan (un Uchiha a un Sharingan, un Hyuga a un Byakugan, un Uzumaki a des capacités de scellage) en SQL, tu te retrouves avec une table pleine de colonnes `NULL`. En NoSQL document, chaque ninja a juste les champs qu'il possède vraiment.

Avantage : flexibilité du schéma, scalabilité horizontale native pour certains types.
Inconvénient : tu perds souvent les garanties d'intégrité fortes (vu dans `03_data_modeling`) et les JOINs propres.

---

## 1) LES QUATRE FAMILLES : PAS UNE SEULE "NOSQL"

Erreur de débutant : penser que "NoSQL" = MongoDB. NoSQL est une catégorie, pas une techno. Quatre familles principales :

```
DOCUMENT   --> MongoDB, Firestore : des objets JSON-like, schéma flexible
CLÉ-VALEUR  --> Redis, DynamoDB : une clé pointe vers une valeur, ultra rapide
COLONNE LARGE --> Cassandra, ScyllaDB : optimisé pour écrire/lire des colonnes massives
GRAPHE    --> Neo4j : optimisé pour les RELATIONS entre données (réseau social, recommandations)
```

Chaque famille résout un problème précis. Aucune n'est "la meilleure" : c'est la question qui est mal posée.

---

## 2) DOCUMENT : DES OBJETS, PAS DES LIGNES

```js
// Un document MongoDB : ressemble à un objet JS, parce que c'est littéralement du BSON
// (binary JSON : JSON encodé en binaire pour la perf)
{
 _id: "65f3a2...",
 ninja_name: "Kakashi",
 village: "Konoha",
 abilities: {
  sharingan: true,
  chakra_nature: ["lightning", "earth", "water"]
 },
 missions_completed: 1141
}
```

Le pourquoi : pas besoin de `JOIN` pour récupérer les capacités d'un ninja, elles sont DANS le document. Tu lis un document, t'as tout ce qui concerne ce ninja d'un coup.

```
SQL : ninjas (table) + abilities (table) --> JOIN pour tout récupérer
DOCUMENT : ninjas (collection) avec abilities imbriqué --> 1 lecture, tout est là
```

Le risque réel : tu dupliques de la donnée partout (dénormalisation : vue dans `03_data_modeling`) pour éviter les jointures. Si le `village` d'un clan change de nom, et que ce nom est dupliqué dans 10 000 documents `missions` (pour éviter une jointure), tu dois mettre à jour 10 000 documents. En SQL, tu changes 1 ligne dans `villages`, et le `JOIN` répercute automatiquement.

```js
// Exemple qui casse : duplication oubliée
// On a stocké le village dans chaque mission pour aller plus vite
{ missionId: 1, village: "Konoha", objective: "Escorte" }
{ missionId: 2, village: "Konoha", objective: "Infiltration" }

// Le village change de nom suite à une réorganisation narrative
// Si tu oublies de mettre à jour TOUTES les missions existantes :
{ missionId: 1, village: "Konoha", objective: "Escorte" }  // donnée périmée (stale data)
{ missionId: 2, village: "Feuille", objective: "Infiltration" } // mise à jour, incohérent avec missionId 1
```

---

## 3) CLÉ-VALEUR : LA VITESSE BRUTE

```
clé           --> valeur
"session:abc123"    --> { ninjaId: 42, rank: "Jonin" }
"cache:mission:99"   --> { objective: "...", danger_level: 5 }
"ratelimit:ip:1.2.3.4" --> 12
```

Le pourquoi : pas de requête complexe, pas de `WHERE`, pas de `JOIN`. Tu connais la clé, tu demandes la valeur. C'est souvent en RAM (Redis), donc la latence (temps de réponse) est de l'ordre de la milliseconde, pas de la dizaine de millisecondes comme une requête SQL sur disque.

```js
// Lire/écrire une session : ultra simple, ultra rapide
await redis.set('session:abc123', JSON.stringify({ ninjaId: 42 }), 'EX', 3600)
const session = JSON.parse(await redis.get('session:abc123'))
```

Le quand : cache (vu en détail dans `04_redis_caching`), sessions, rate limiting, compteurs en temps réel, queues simples. Pas pour des données qui ont besoin de requêtes complexes ("tous les ninjas actifs ce mois avec plus de 5 missions" : impossible nativement en clé-valeur pur).

---

## 4) COLONNE LARGE : ÉCRIRE BEAUCOUP, VITE, PARTOUT

Pensé pour des volumes massifs (logs, IoT, séries temporelles) répartis sur plusieurs machines (distributed : distribué).

```
TABLE SQL classique : une ligne = toutes ses colonnes ensemble, sur une machine

COLONNE LARGE : optimisé pour écrire des colonnes en masse,
réparties sur plusieurs noeuds (nodes) du cluster
```

Le pourquoi : quand t'as 50 000 capteurs de surveillance du village qui écrivent une métrique par seconde, une DB relationnelle classique sature vite en écriture sur une seule machine. Une DB colonne large comme Cassandra est faite pour distribuer cette charge d'écriture sur plusieurs machines sans single point of failure (point unique de panne).

Le risque réel : ces DB sacrifient souvent la cohérence forte (vu dans `25_scalability`) pour la disponibilité et la vitesse. Tu peux lire une donnée légèrement périmée juste après une écriture (eventual consistency : cohérence éventuelle). Si ton métier ne tolère pas ça (transaction financière), c'est disqualifiant.

---

## 5) GRAPHE : QUAND LA RELATION EST LA DONNÉE

```
SQL : pour "alliés des alliés qui partagent le même Sensei"
--> plusieurs JOIN en cascade, ça devient illisible et lent

GRAPHE : Ninja --[TRAINED_BY]--> Sensei --[TRAINED]--> Ninja
--> tu traverses le graphe directement, la relation EST la structure
```

Le pourquoi : dans un réseau de clans ou un moteur de recommandation de missions, la question posée est presque toujours "qu'est-ce qui est connecté à quoi, à quelle distance". Une DB graphe (Neo4j) stocke les relations comme citoyens de première classe (pas comme une table de jointure de plus), donc traverser 3, 4, 5 niveaux de relation reste rapide.

```
SQL pour "alliés de mes alliés" : JOIN allies a1 JOIN allies a2 ON a1.ally_id = a2.ninja_id
--> coûte cher en JOIN multiples sur de gros volumes

GRAPHE : MATCH (me)-[:ALLY]->()-[:ALLY]->(indirect) RETURN indirect
--> traversal natif, pensé pour ça
```

Le quand : réseaux de clans, recommandations de missions par affinité, détection de trahisons (réseaux de ninjas liés à l'ennemi). Le risque : c'est une techno de niche, l'équipe doit apprendre un nouveau langage de requête (Cypher pour Neo4j), et c'est rarement justifié pour un jutsu simple.

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

Le piège classique : choisir NoSQL parce que "c'est plus moderne" ou "c'est ce qu'utilise telle grosse boîte". La vraie question n'est jamais "SQL ou NoSQL", c'est "quelle est la forme de mes données et la forme de mes requêtes". Michael Scofield dans Prison Break ne choisit pas ses outils d'évasion parce qu'ils sont populaires : il choisit exactement ce que la situation exige. Toi pareil avec les DB.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Vers 2010-2015, il y a eu une mode "NoSQL partout, SQL c'est mort" (le mouvement "NoSQL movement"). En pratique, la plupart des projets qui sont partis 100% MongoDB se sont retrouvés à réimplémenter à la main des contraintes que SQL offre nativement depuis 40 ans (intégrité référentielle, transactions ACID vues dans `03_data_modeling`). Aujourd'hui le réflexe sain : SQL par défaut pour la donnée métier structurée, NoSQL pour les cas précis où ses forces (schéma flexible, vitesse clé-valeur, traversal de graphe) résolvent un vrai problème que tu as identifié, pas un problème que tu imagines avoir.

---

## EXERCICES

**EXO 1 : Le bon choix pour le bon problème**
Pour chacun de ces cas, choisis la famille NoSQL (ou SQL) la plus adaptée et justifie en une phrase : (a) système de cache des profils de ninja affichés sur le tableau de missions, (b) base de données de jutsu avec des attributs totalement différents selon le type (Ninjutsu, Taijutsu, Genjutsu, Fuinjutsu), (c) moteur de recommandation "ninjas que tu pourrais affronter selon tes combats précédents", (d) logs de chakra de 10 000 shinobis par seconde depuis tout le pays. (15 minutes)

**EXO 2 : Le coût de la duplication**
Tu stockes le `clan_name` dupliqué dans chaque document `mission_report` pour éviter une jointure. Liste 3 scénarios où cette décision te coûte cher à maintenir, et propose une alternative pour chacun. (15 minutes)

**EXO 3 : Migration inversée**
On te donne une base MongoDB avec une collection `jutsu_records` où chaque document a une structure totalement différente selon l'âge de l'enregistrement (le schéma a évolué 4 fois sans migration propre). Décris en pseudo-étapes comment tu remettrais de la cohérence, sans tout casser en prod. (20 minutes)

---

## RÉSUMÉ

NoSQL n'est pas une alternative à SQL, c'est quatre familles d'outils différents pour quatre formes de problèmes différentes. Document quand le schéma bouge trop, clé-valeur quand la vitesse brute prime, colonne large quand le volume d'écriture distribué prime, graphe quand la relation EST la donnée. Le bon réflexe : regarder la forme de tes données et de tes requêtes avant de choisir l'outil, jamais l'inverse.
