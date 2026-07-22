---
stability: intemporel
---

# Le plan avant les murs
Temps de lecture ~12 min

T'as vu SQL (`01_sql_basics`) et les familles NoSQL (`02_nosql_basics`). Maintenant la vraie question : comment tu RANGES tes données pour qu'elles tiennent dans le temps, sans dupliquer n'importe comment ni te retrouver bloqué dans 6 mois.

Pourquoi ça compte vraiment : une mauvaise modélisation, ça ne plante pas le jour 1. Ça plante le jour où ta table a 5 millions de lignes et que chaque requête devient un calvaire, ou le jour où tu dois changer une donnée dupliquée à 50 endroits différents. Walter White a appris ça à ses dépens : une mauvaise organisation du réseau en début de saison, ça coûte dix fois plus cher à corriger à la saison 4.

Avantage d'un bon modèle : requêtes simples, intégrité garantie, évolutif.
Inconvénient d'un mauvais modèle : dette technique invisible jusqu'à ce qu'elle explose.

---

## 1) NORMALISATION : CHAQUE FAIT, UN SEUL ENDROIT

La normalisation, c'est la discipline qui dit : une information ne doit exister qu'à un seul endroit dans ta base.

```sql
-- Mauvais : dénormalisé, le nom du ninja est dupliqué dans chaque mission
CREATE TABLE missions (
 id INT,
 ninja_name VARCHAR(255),  -- dupliqué à chaque mission du même ninja
 village_name VARCHAR(255), -- dupliqué aussi
 objective TEXT
);

-- Bon : normalisé, le ninja existe une fois, la mission référence juste son id
CREATE TABLE ninjas (
 id INT PRIMARY KEY,
 ninja_name VARCHAR(255),
 village VARCHAR(255)
);

CREATE TABLE missions (
 id INT PRIMARY KEY,
 ninja_id INT REFERENCES ninjas(id),
 objective TEXT
);
```

Le pourquoi : si le village d'un ninja change, tu modifies UNE ligne dans `ninjas`. Version dénormalisée : tu dois retrouver et corriger CHAQUE mission qui contient ce ninja, ou tu te retrouves avec des données incohérentes entre anciennes et nouvelles missions.

```
NORMALISÉ :
ninjas (1 ligne par ninja) <-- missions (référence ninja_id)
1 source de vérité --> changement = 1 update

DÉNORMALISÉ :
missions (nom + village copiés à chaque mission)
N sources de vérité --> changement = N updates, risque d'incohérence
```

Les formes normales (1NF, 2NF, 3NF) formalisent ce principe par paliers. Tu n'as pas besoin de les réciter par cœur, tu as besoin de comprendre la règle de fond : pas de duplication d'un fait qui peut changer.

---

## 2) LE RISQUE DE LA NORMALISATION POUSSÉE À FOND : TROP DE JOIN

```sql
-- Modèle ultra normalisé : chaque détail dans sa propre table
SELECT m.id, n.ninja_name, c.clan_name, v.village_name, r.rank_name
FROM missions m
JOIN ninjas n ON m.ninja_id = n.id
JOIN clans c ON n.clan_id = c.id
JOIN villages v ON n.village_id = v.id
JOIN ranks r ON n.rank_id = r.id
WHERE m.id = 1;
-- 4 JOIN pour afficher une seule mission. Lisible ? Oui.
-- Rapide sur 50 millions de lignes ? Pas garanti.
```

```
Niveau de normalisation vs coût de lecture :

Normalisé à fond --> | intégrité max | joins multiples | lenteur possible
Dénormalisé    --> | duplicatas  | lectures rapides | maintenance complexe
         --> le bon curseur dépend de TON contexte
```

Le risque réel : normaliser à l'extrême donne un modèle "propre" sur le papier mais lent en pratique, parce que chaque lecture déclenche une cascade de `JOIN`. C'est le compromis central de la modélisation : intégrité parfaite vs vitesse de lecture.

---

## 3) DÉNORMALISATION : QUAND DUPLIQUER EST LE BON CHOIX

Parfois, dupliquer une donnée est une décision technique justifiée, pas une erreur.

```sql
-- Le rang d'un ninja AU MOMENT d'une mission DOIT être dupliqué, volontairement
CREATE TABLE missions (
 id INT PRIMARY KEY,
 ninja_id INT REFERENCES ninjas(id),
 rank_at_mission VARCHAR(50), -- copié au moment de l'assignation, intentionnellement
 objective TEXT
);
```

Le pourquoi : si un ninja passe de Genin à Chunin après la mission, un rapport d'archive doit garder son rang du moment. Référencer juste `ninja_id` et lire `ninjas.rank` te donnerait le rang ACTUEL sur une mission PASSÉE : un bug métier, pas un détail.

```
RÉFÉRENCE PURE (mauvais ici) :
missions.ninja_id --> ninjas.rank (toujours le rang ACTUEL)
résultat : l'historique de mission change tout seul. Catastrophe d'archives.

DÉNORMALISATION VOULUE (bon ici) :
missions.rank_at_mission = snapshot du rang au moment T
résultat : l'historique reste figé, correct, auditable
```

Le quand dénormaliser, en général : données historiques/légales qui doivent être figées, lectures ultra fréquentes où la jointure coûte plus cher que la duplication ne coûte de maintenance, systèmes en lecture massive avec peu d'écritures (cache de lecture, vu dans `04_redis_caching`).

---

## 4) RELATIONS : ONE-TO-ONE, ONE-TO-MANY, MANY-TO-MANY

```
ONE-TO-ONE  --> un ninja a UN profil de santé détaillé
ONE-TO-MANY --> un ninja a PLUSIEURS missions assignées
MANY-TO-MANY --> une mission a PLUSIEURS ninjas, un ninja participe à PLUSIEURS missions
```

Le many-to-many a besoin d'une table intermédiaire (table de jointure, junction table) :

```sql
CREATE TABLE ninjas (id INT PRIMARY KEY, ninja_name VARCHAR(255));
CREATE TABLE missions (id INT PRIMARY KEY, objective TEXT);

-- table pivot : pas de données métier, juste les deux clés étrangères
CREATE TABLE ninja_missions (
 ninja_id INT REFERENCES ninjas(id),
 mission_id INT REFERENCES missions(id),
 role VARCHAR(50), -- "leader", "support", "infiltration" : données de la RELATION
 PRIMARY KEY (ninja_id, mission_id)
);
```

```
ninjas <--> ninja_missions <--> missions

ninja 1 (Naruto) --> ninja_missions (ninja_id=1, mission_id=3, role="leader")
ninja 2 (Sasuke) --> ninja_missions (ninja_id=2, mission_id=3, role="support")
mission 3 est partagée par les deux
```

L'erreur classique de débutant : essayer de stocker les missions dans une colonne `missions_ids VARCHAR` séparés par virgule (`"3,7,12"`). Ça casse l'intégrité (impossible de chercher facilement "toutes les missions avec Naruto"), ça casse les index, et ça casse à la première virgule mal placée.

---

## 5) CLÉS : PRIMARY, FOREIGN, ET LE CHOIX DE L'ID

```sql
CREATE TABLE ninjas (
 id SERIAL PRIMARY KEY,     -- clé primaire : identifiant unique de la ligne
 ninja_name VARCHAR(255) UNIQUE -- contrainte d'unicité, pas une clé primaire
);

CREATE TABLE missions (
 id SERIAL PRIMARY KEY,
 ninja_id INT REFERENCES ninjas(id) -- clé étrangère : référence une autre table
);
```

```
PRIMARY KEY --> identifie une ligne de manière unique DANS sa table
FOREIGN KEY --> référence la primary key d'une AUTRE table, garantit l'intégrité
```

Le pourquoi de `REFERENCES` : sans contrainte de clé étrangère, rien n'empêche d'insérer `ninja_id = 9999` dans `missions` alors que ce ninja n'existe pas. Avec la contrainte, la DB refuse l'insertion. C'est l'intégrité référentielle (referential integrity) : la DB garantit elle-même que tes relations ont du sens, tu n'as pas à le vérifier à la main dans ton code JS.

Le débat ID auto-incrémenté (`1, 2, 3...`) vs UUID (identifiant unique généré, type `a1b2c3d4-...`) :

```
AUTO-INCRÉMENT :
+ lisible, compact, index performant
- prévisible (id=5 existe forcément si id=4 existe), expose le volume de données
- collision possible si tu fusionnes des DB de plusieurs sources

UUID :
+ généré côté client SANS aller demander à la DB, pas de collision entre systèmes
+ ne révèle rien sur le volume total
- plus lourd (16 bytes vs 4-8), index moins performant qu'un entier simple
```

Le choix dépend du contexte : un outil interne, auto-incrément suffit. Un système distribué qui génère des IDs sur plusieurs serveurs avant même de toucher la DB (vu dans `25_scalability`), UUID devient nécessaire.

---

## 6) TRANSACTIONS ET ACID : LA GARANTIE QU'UNE OPÉRATION NE FAIT PAS LES CHOSES À MOITIÉ

```sql
BEGIN;
UPDATE ninja_wallets SET ryo = ryo - 1000 WHERE ninja_id = 1; -- retire la récompense à Naruto
UPDATE mission_rewards SET claimed = true WHERE mission_id = 5; -- marque la mission comme payée
COMMIT;
```

Le pourquoi : si le serveur crash entre les deux `UPDATE`, sans transaction, Naruto perd 1000 ryos et la mission n'est pas marquée comme payée. Avec une transaction, soit les DEUX `UPDATE` passent, soit AUCUN ne passe (rollback automatique si erreur). C'est l'atomicité en action : comme dans Breaking Bad, un deal à moitié fait est pire qu'un deal pas fait.

```
ACID :
Atomicity (atomicité)   --> tout ou rien, jamais à moitié
Consistency (cohérence)  --> la DB respecte toujours ses contraintes après la transaction
Isolation         --> deux transactions simultanées ne se piétinent pas
Durability (durabilité)  --> une fois validée (COMMIT), la donnée survit même à un crash
```

Le risque réel sans transaction : exactement le bug "Naruto perd ses ryos sans que la mission soit fermée" ci-dessus. Ce genre de bug n'apparaît jamais en dev (tout va bien, tout est rapide) et arrive en prod sous charge, quand une requête timeout pile entre les deux `UPDATE`.

---

## 7) CE QUI CASSE (MAIS FUN) : LE MODÈLE QUI SEMBLAIT BON

```js
// exemple minimal : ça a l'air raisonnable au début
// "un ninja a une liste de jutsu, je les stocke en JSON dans la colonne"
{
 id: 1,
 ninja_name: "Kakashi",
 jutsu_list: '[{"name":"Chidori","element":"lightning"},{"name":"Kamui","element":"space"}]'
 // stocké en string JSON dans une colonne SQL
}

// exemple réaliste : 6 mois plus tard, on veut chercher "tous les ninjas
// qui maîtrisent un jutsu de type lightning" --> impossible proprement en SQL,
// il faut parser le JSON dans chaque ligne, aucun index ne peut aider

// exemple qui casse : un dev modifie la liste de jutsu en réécrivant tout le JSON,
// un autre dev fait pareil en même temps --> race condition (vu dans 03_async),
// la dernière écriture gagne, le jutsu ajouté par l'autre disparaît silencieusement
```

La leçon : stocker une liste de sous-entités qui mérite ses propres recherches/contraintes, dans une colonne JSON "pour aller plus vite au début", c'est reporter le vrai modèle à plus tard, avec intérêts. Une table `jutsu` séparée avec `ninja_id` aurait évité les trois problèmes.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, normaliser à fond (3NF partout) était presque un dogme académique : "la dénormalisation c'est sale". Maintenant, avec des volumes de lecture massifs (apps avec des millions de shinobis actifs), la dénormalisation ciblée est une décision d'ingénierie normale, documentée, pas une erreur de débutant. Le switch existe parce qu'on a compris que l'intégrité parfaite et la vitesse de lecture sont en tension, et que le bon dosage dépend du jutsu, pas d'un principe absolu.

---

## EXERCICES

**EXO 1 : Le schéma du Conseil des Cinq Kage**
Modélise les tables pour un système de missions nationales avec : villages, kage (un par village), missions, ninjas assignés. Un kage appartient à un seul village. Une mission peut avoir plusieurs ninjas assignés avec un rôle par ninja. Dessine les tables et leurs clés. (20 minutes)

**EXO 2 : Dénormaliser ou pas**
Pour chaque cas, décide si tu dénormalises ou pas, et justifie : (a) le nom du ninja dans chaque message de chat qu'il envoie au channel de l'équipe, (b) le rang d'un ninja dans un rapport de mission déjà archivé, (c) le nombre de missions actives d'un ninja mis à jour en temps réel. (15 minutes)

**EXO 3 : Trouve le bug d'intégrité**
On te donne un schéma où `missions.ninja_id` n'a pas de contrainte `REFERENCES ninjas(id)`. Décris un scénario concret où cette absence de contrainte cause un bug visible en prod, et la correction exacte. (10 minutes)

---

## RÉSUMÉ

Modéliser des données, c'est choisir où va vivre chaque fait, et combien de fois il est dupliqué. Normaliser élimine la duplication mais multiplie les `JOIN`. Dénormaliser accélère la lecture mais demande de la discipline pour ne pas désynchroniser les copies. Les transactions garantissent qu'une opération composée ne casse jamais ton état à moitié. Le bon modèle n'est jamais "le plus pur", c'est celui qui correspond à comment tes données sont vraiment lues et écrites.
