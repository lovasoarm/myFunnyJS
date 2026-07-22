---
stability: intemporel
---

# Parler à une base relationnelle sans la supplier
Temps de lecture ~12 min

T'as un système qui tient en mémoire : tableaux JS, objets, variables. Tu restart le serveur : tout disparaît. Une DB (database : base de données) relationnelle, c'est la mémoire qui survit au crash. SQL (structured query language : langage de requête structuré), c'est la langue qu'elle comprend.

Pourquoi ça compte vraiment en prod : 90% des bugs de perf en backend, c'est pas ton code JS qui rame, c'est ta requête SQL qui scanne 2 millions de lignes pour en retourner 5. Si tu comprends pas `EXPLAIN` (le plan d'exécution d'une requête), t'es aveugle face à ce genre de bug.

Avantage : structure stricte, intégrité garantie, le langage le plus universel du métier.
Inconvénient : moins flexible qu'une DB document quand ton schéma (la structure des données) change tout le temps.

---

## 1) SELECT : LIRE SANS TOUT RAMENER

```sql
-- intuition : tu demandes des colonnes précises, pas "tout"
SELECT id, ninja_name, village
FROM ninjas
WHERE rank = 'Jonin'
ORDER BY chakra_level DESC
LIMIT 20;
```

Le pourquoi technique : `SELECT *` ramène toutes les colonnes même celles que tu n'utilises pas (genre un champ `backstory` de 10 000 caractères). Chaque colonne en trop, c'est de la bande passante (network bandwidth) gaspillée et de la RAM en plus côté serveur DB et côté app.

```
SELECT * FROM ninjas      --> ramène tout, même ce que t'utilises pas
SELECT id, ninja_name FROM ninjas --> ramène juste ce qu'il faut
```

Le risque réel : tu fais `SELECT *` sur une table avec une colonne `JSON` ou `BLOB` (binary large object : gros bloc binaire, genre une image stockée en DB) de 5 Mo par ligne. Tu demandes 1000 lignes, ton serveur essaie de charger 5 Go en RAM. Crash. Comme lancer le Rasengan sans contrôle du chakra : la puissance est là, mais elle détruit celui qui la tient.

---

## 2) WHERE ET LES FILTRES : LE TRI AVANT LE TRI

```sql
-- plusieurs conditions, l'ordre logique compte pour ta lecture, pas pour la perf
SELECT *
FROM missions
WHERE status = 'active'
 AND danger_level > 3
 AND assigned_at BETWEEN '2026-01-01' AND '2026-06-01';
```

Le pourquoi : `WHERE` filtre ligne par ligne avant que les résultats partent vers toi. Sans lui, c'est `SELECT *` sur toute la table, puis tu filtres en JS. Tu viens de transformer ta DB en simple disque dur et ton serveur Node en moteur de filtrage : exactement l'inverse de ce que chaque outil doit faire.

```js
// Mauvais réflexe : filtrer en JS après avoir tout ramené
const allMissions = await db.query('SELECT * FROM missions')
const active = allMissions.filter(m => m.status === 'active')
// Tu as fait transiter 100 000 lignes pour en garder 200

// Bon réflexe : la DB fait le tri, elle est faite pour ça
const active = await db.query("SELECT * FROM missions WHERE status = 'active'")
```

---

## 3) JOIN : RECOLLER DES TABLES SÉPARÉES

Une DB relationnelle, c'est des tables séparées par design (normalisation, vue en détail dans `03_data_modeling`). `JOIN` (jointure) recolle les morceaux à la demande.

```sql
-- chaque mission a un ninja_id qui pointe vers la table ninjas
SELECT missions.id, missions.objective, ninjas.ninja_name
FROM missions
INNER JOIN ninjas ON missions.ninja_id = ninjas.id
WHERE missions.status = 'active';
```

```
INNER JOIN  --> garde que les lignes qui matchent dans les deux tables
LEFT JOIN  --> garde tout missions, même si pas de ninja trouvé (ninja_id NULL)
RIGHT JOIN  --> l'inverse, rarement utilisé en pratique
FULL JOIN  --> garde tout des deux côtés, rare aussi
```

Diagramme du `INNER JOIN` vs `LEFT JOIN` :

```
missions (5 lignes) --> JOIN --> ninjas (3 lignes)

INNER JOIN : missions.ninja_id DOIT exister dans ninjas
 résultat --> seulement les missions qui ont un ninja valide

LEFT JOIN : tout missions, même orphelin
 résultat --> toutes les missions, ninja = NULL si pas trouvé
```

Le risque réel : tu fais un `JOIN` sans `WHERE` ni `LIMIT` sur deux grosses tables. Tu viens de créer un jutsu cartésien (cross join : chaque ligne de A combinée avec chaque ligne de B) accidentel. 10 000 lignes x 10 000 lignes = 100 millions de lignes générées. Ton serveur DB fume. Même Naruto ne survive pas à ça sans préparation.

---

## 4) INDEX : LE RACCOURCI QUE PERSONNE NE VOIT

Sans index, chercher une ligne dans une table de 1 million de lignes = lire les 1 million de lignes une par une (full table scan : scan complet de la table). C'est O(n).

Un index, c'est une structure à part (souvent un B-Tree, vu en détail dans `09_data_structures/06_bst`) qui range les valeurs d'une colonne dans un ordre permettant une recherche en O(log n).

```sql
-- sans index sur ninja_name : la DB lit TOUTE la table
SELECT * FROM ninjas WHERE ninja_name = 'Kakashi';

-- avec index :
CREATE INDEX idx_ninjas_name ON ninjas(ninja_name);
-- maintenant la même requête est quasi instantanée même sur 10 millions de lignes
```

```
TABLE SANS INDEX :
recherche --> ligne 1 ? non --> ligne 2 ? non --> ... --> ligne 999 999 ? oui
coût : O(n)

TABLE AVEC INDEX (B-Tree) :
recherche --> branche gauche ou droite ? --> branche gauche ou droite ? --> trouvé
coût : O(log n)
```

Le piège que personne ne voit avant la prod : un index accélère la lecture (`SELECT`) mais ralentit l'écriture (`INSERT`, `UPDATE`, `DELETE`), parce que la DB doit aussi mettre à jour l'index à chaque écriture. Mettre un index sur chaque colonne "pour être sûr" : mauvaise idée. Tu indexes ce qui est cherché souvent (`WHERE`, `JOIN`, `ORDER BY`), pas tout.

```sql
-- mauvaise pratique : index sur une colonne jamais filtrée
CREATE INDEX idx_ninjas_backstory ON ninjas(backstory); -- inutile, personne ne fait WHERE backstory = '...'
```

---

## 5) EXPLAIN : VOIR CE QUE LA DB FAIT VRAIMENT

`EXPLAIN` te montre le plan d'exécution (query plan) choisi par la DB pour ta requête. Sans ça, t'optimises à l'aveugle.

```sql
EXPLAIN SELECT * FROM missions WHERE status = 'active';
```

```
Résultat typique (simplifié) :

Seq Scan on missions     --> mauvais signe : scan complet, pas d'index utilisé
 Filter: status = 'active'

vs

Index Scan using idx_status --> bon signe : l'index a été utilisé
 Index Cond: status = 'active'
```

Le quoi : un outil de diagnostic intégré à la DB.
Le pourquoi : sans lui, t'optimises au feeling, et le feeling se trompe souvent sur les DB (l'optimiseur de la DB prend parfois des décisions contre-intuitives).
Le quand : dès qu'une requête est lente, ou avant de mettre en prod une requête sur une table qui va grossir.
Le comment : tu lances `EXPLAIN` (ou `EXPLAIN ANALYZE` qui exécute vraiment la requête et donne le temps réel), tu lis "Seq Scan" comme un drapeau rouge sur une grosse table.
Vraie utilité : ça transforme "ça rame, je sais pas pourquoi" en "voilà exactement où ça coince". C'est la vision du Chevalier d'Or dans Garo : tu vois ce que les autres ne voient pas.

---

## 6) AGRÉGATIONS : COMPTER, SOMMER, GROUPER SANS BOUCLE JS

```sql
-- compter les missions par statut
SELECT status, COUNT(*) as total
FROM missions
GROUP BY status;

-- le total de chakra dépensé par chaque ninja, mais seulement les top dépenseurs
SELECT ninja_id, SUM(chakra_used) as total_chakra
FROM mission_logs
GROUP BY ninja_id
HAVING SUM(chakra_used) > 5000;
```

Le pourquoi : `GROUP BY` + fonctions d'agrégation (`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`) font en une requête ce qui te prendrait une boucle JS sur potentiellement des millions de lignes ramenées pour rien.

```
WHERE  --> filtre les LIGNES avant le groupement
HAVING --> filtre les GROUPES après le groupement
```

Erreur classique de débutant : utiliser `WHERE` pour filtrer sur une agrégation. Ça plante, parce que `WHERE` s'exécute avant que `SUM()` existe.

```sql
-- FAUX : SUM n'existe pas encore au moment du WHERE
SELECT ninja_id, SUM(chakra_used) FROM mission_logs WHERE SUM(chakra_used) > 5000 GROUP BY ninja_id;

-- CORRECT
SELECT ninja_id, SUM(chakra_used) FROM mission_logs GROUP BY ninja_id HAVING SUM(chakra_used) > 5000;
```

---

## 7) CE QUI CASSE (MAIS FUN) : LA REQUÊTE QUI FAIT TOMBER LA PROD

```sql
-- exemple minimal : ça marche
SELECT * FROM ninjas WHERE id = 1;

-- exemple réaliste : un dashboard qui liste les missions actives récentes
SELECT m.id, m.objective, n.ninja_name
FROM missions m
JOIN ninjas n ON m.ninja_id = n.id
WHERE m.assigned_at > NOW() - INTERVAL '7 days'
ORDER BY m.assigned_at DESC
LIMIT 50;

-- exemple qui casse : un dev a oublié le WHERE en debug, en prod direct
UPDATE missions SET status = 'cancelled';
-- aucun WHERE --> TOUTES les missions de TOUTE la DB sont annulées
-- c'est la version SQL du jutsu Tsukuyomi : tout le monde est touché, sans exception
-- toujours tester un UPDATE/DELETE avec un SELECT identique avant,
-- pour voir CE QUI serait touché
```

Le réflexe qui sauve des vies en prod : avant un `UPDATE` ou `DELETE`, tu écris le même `WHERE` dans un `SELECT` d'abord. Tu vérifies le nombre de lignes retournées. Si c'est le bon nombre, tu changes `SELECT *` en `UPDATE ... SET ...`.

```sql
-- étape 1 : vérifier la cible
SELECT * FROM missions WHERE status = 'pending' AND assigned_at < '2026-01-01';
-- 12 lignes retournées, ça correspond à ce que t'attendais

-- étape 2 : exécuter en confiance
UPDATE missions SET status = 'expired' WHERE status = 'pending' AND assigned_at < '2026-01-01';
```

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, on écrivait du SQL brut partout dans le code applicatif, concaténé à la main avec les variables directement dans la string. Résultat : injection SQL ouverte par défaut (vu en détail dans `22_security/01_xss_injection`). Maintenant, on utilise des requêtes paramétrées (placeholders `$1`, `?`, ou un ORM/query builder comme vu dans `05_db_in_js`) presque partout. Le switch existe pour la sécurité, pas pour le style.

```js
// Avant (dangereux) : concaténation directe
const query = `SELECT * FROM ninjas WHERE village = '${userInput}'`
// userInput = "' OR '1'='1" --> injection SQL, retourne TOUS les ninjas

// Maintenant : requête paramétrée
const query = 'SELECT * FROM ninjas WHERE village = $1'
const result = await db.query(query, [userInput])
// userInput est traité comme une VALEUR, jamais comme du code SQL
```

Le SQL brut reste utile : pour des requêtes complexes d'analytics, ou quand un ORM génère une requête tellement inefficace que tu reprends le contrôle à la main.

---

## EXERCICES

**EXO 1 : Le détective de lenteur**
On te donne une requête qui prend 4 secondes sur une table de 2 millions de lignes : `SELECT * FROM mission_logs WHERE ninja_id = 42 ORDER BY logged_at DESC`. Utilise `EXPLAIN` (mentalement ou sur une vraie DB locale) pour identifier pourquoi, et propose la correction exacte. (15 minutes)

**EXO 2 : Le rapport de mission**
Une table `combat_stats(id, ninja_id, chakra_used, outcome, fought_at)`. Écris la requête qui donne, pour chaque ninja, le total de chakra dépensé et le nombre de combats, mais seulement pour les ninjas ayant dépensé plus de 10 000 unités de chakra ce mois-ci. (20 minutes)

**EXO 3 : Le piège du JOIN**
On te donne deux tables `villages` (10 lignes) et `ninjas` (500 lignes) sans relation directe entre elles dans la requête. Explique ce qui se passe si on fait `SELECT * FROM villages, ninjas;` et calcule le nombre de lignes résultantes. (10 minutes, indice : produit cartésien)

---

## RÉSUMÉ

SQL c'est pas de la syntaxe à apprendre par cœur, c'est une façon de déléguer le travail lourd à un moteur fait pour ça. `WHERE` filtre avant de te ramener la donnée, `JOIN` recolle des tables séparées par design, `INDEX` transforme une recherche linéaire en recherche logarithmique, et `EXPLAIN` te montre ce qui se passe vraiment au lieu de deviner. Le danger numéro un reste humain : un `UPDATE` sans `WHERE` ne pardonne pas.
