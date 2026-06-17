# Le plan avant les murs

T'as vu SQL (`01_sql_basics`) et les familles NoSQL (`02_nosql_basics`). Maintenant la vraie question : comment tu RANGES tes données pour qu'elles tiennent dans le temps, sans dupliquer n'importe comment ni te retrouver bloqué dans 6 mois.

Pourquoi ça compte vraiment : une mauvaise modélisation, ça ne plante pas le jour 1. Ça plante le jour où ta table a 5 millions de lignes et que chaque requête devient un calvaire, ou le jour où tu dois changer une donnée dupliquée à 50 endroits différents.

Avantage d'un bon modèle : requêtes simples, intégrité garantie, évolutif.
Inconvénient d'un mauvais modèle : dette technique invisible jusqu'à ce qu'elle explose.

---

## 1) NORMALISATION : CHAQUE FAIT, UN SEUL ENDROIT

La normalisation, c'est la discipline qui dit : une information ne doit exister qu'à un seul endroit dans ta base.

```sql
-- Mauvais : dénormalisé, le nom du produit est dupliqué dans chaque commande
CREATE TABLE orders (
  id INT,
  product_name VARCHAR(255),  -- dupliqué à chaque commande du même produit
  product_price DECIMAL,      -- dupliqué aussi
  quantity INT
);

-- Bon : normalisé, le produit existe une fois, la commande référence juste son id
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  product_id INT REFERENCES products(id),
  quantity INT
);
```

Le pourquoi : si le prix du produit change, tu modifies UNE ligne dans `products`. Version dénormalisée : tu dois retrouver et corriger CHAQUE commande qui contient ce produit, ou tu te retrouves avec des prix incohérents entre anciennes et nouvelles commandes (et c'est en fait souvent voulu : le prix au moment de l'achat doit rester figé, voir section 3).

```
NORMALISÉ :
products (1 ligne par produit) <-- orders (référence product_id)
1 source de vérité --> changement = 1 update

DÉNORMALISÉ :
orders (nom + prix copiés à chaque commande)
N sources de vérité --> changement = N updates, risque d'incohérence
```

Les formes normales (1NF, 2NF, 3NF) formalisent ce principe par paliers. Tu n'as pas besoin de les réciter par cœur, tu as besoin de comprendre la règle de fond : **pas de duplication d'un fait qui peut changer**.

---

## 2) LE RISQUE DE LA NORMALISATION POUSSÉE À FOND : TROP DE JOIN

```sql
-- Modèle ultra normalisé : chaque détail dans sa propre table
SELECT o.id, p.name, c.name as category, b.name as brand, u.username
FROM orders o
JOIN products p ON o.product_id = p.id
JOIN categories c ON p.category_id = c.id
JOIN brands b ON p.brand_id = b.id
JOIN users u ON o.user_id = u.id
WHERE o.id = 1;
-- 4 JOIN pour afficher une seule commande. Lisible ? Oui.
-- Rapide sur 50 millions de lignes ? Pas garanti.
```

Le risque réel : normaliser à l'extrême donne un modèle "propre" sur le papier mais lent en pratique, parce que chaque lecture déclenche une cascade de `JOIN`. C'est le compromis central de la modélisation : intégrité parfaite vs vitesse de lecture.

---

## 3) DÉNORMALISATION : QUAND DUPLIQUER EST LE BON CHOIX

Parfois, dupliquer une donnée est une décision technique justifiée, pas une erreur.

```sql
-- Le prix au moment de l'achat DOIT être dupliqué, volontairement
CREATE TABLE orders (
  id INT PRIMARY KEY,
  product_id INT REFERENCES products(id),
  price_at_purchase DECIMAL,  -- copié au moment de la commande, intentionnellement
  quantity INT
);
```

Le pourquoi : si le produit coûte 20€ aujourd'hui et 25€ demain, une commande d'hier doit garder le prix d'hier. Référencer juste `product_id` et lire `products.price` te donnerait le prix ACTUEL sur une commande PASSÉE : un bug métier, pas un détail.

```
RÉFÉRENCE PURE (mauvais ici) :
orders.product_id --> products.price (toujours le prix ACTUEL)
résultat : l'historique de facturation change tout seul. Catastrophe comptable.

DÉNORMALISATION VOULUE (bon ici) :
orders.price_at_purchase = snapshot du prix au moment T
résultat : l'historique reste figé, correct, auditable
```

Le quand dénormaliser, en général : données historiques/légales qui doivent être figées, lectures ultra fréquentes où la jointure coûte plus cher que la duplication ne coûte de maintenance, systèmes en lecture massive avec peu d'écritures (cache de lecture, vu dans `04_redis_caching`).

---

## 4) RELATIONS : ONE-TO-ONE, ONE-TO-MANY, MANY-TO-MANY

```
ONE-TO-ONE   -->  un user a UN profil détaillé (souvent juste fusionné en 1 table)
ONE-TO-MANY  -->  un user a PLUSIEURS commandes (la table orders a un user_id)
MANY-TO-MANY -->  un produit a PLUSIEURS tags, un tag s'applique à PLUSIEURS produits
```

Le many-to-many a besoin d'une table intermédiaire (table de jointure, junction table) :

```sql
CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(255));
CREATE TABLE tags (id INT PRIMARY KEY, name VARCHAR(255));

-- table pivot : pas de données métier, juste les deux clés étrangères
CREATE TABLE product_tags (
  product_id INT REFERENCES products(id),
  tag_id INT REFERENCES tags(id),
  PRIMARY KEY (product_id, tag_id)
);
```

```
products <--> product_tags <--> tags

product 1 --> product_tags (product_id=1, tag_id=3) --> tag "js"
product 1 --> product_tags (product_id=1, tag_id=7) --> tag "backend"
product 2 --> product_tags (product_id=2, tag_id=3) --> tag "js" (réutilisé)
```

L'erreur classique de débutant : essayer de stocker les tags dans une colonne `tags VARCHAR` séparés par virgule (`"js,backend,ts"`). Ça casse l'intégrité (impossible de chercher facilement "tous les produits tagués backend"), ça casse les index, et ça casse à la première virgule mal placée.

---

## 5) CLÉS : PRIMARY, FOREIGN, ET LE CHOIX DE L'ID

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,        -- clé primaire : identifiant unique de la ligne
  email VARCHAR(255) UNIQUE     -- contrainte d'unicité, pas une clé primaire
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id)  -- clé étrangère : référence une autre table
);
```

```
PRIMARY KEY  -->  identifie une ligne de manière unique DANS sa table
FOREIGN KEY  -->  référence la primary key d'une AUTRE table, garantit l'intégrité
```

Le pourquoi de `REFERENCES` : sans contrainte de clé étrangère, rien n'empêche d'insérer `user_id = 9999` dans `orders` alors que cet user n'existe pas. Avec la contrainte, la DB refuse l'insertion. C'est l'intégrité référentielle (referential integrity) : la DB garantit elle-même que tes relations ont du sens, tu n'as pas à le vérifier à la main dans ton code JS.

Le débat ID auto-incrémenté (`1, 2, 3...`) vs UUID (identifiant unique généré, type `a1b2c3d4-...`) :

```
AUTO-INCRÉMENT :
+  lisible, compact, index performant
-  prévisible (id=5 existe forcément si id=4 existe), expose le volume de données
-  collision possible si tu fusionnes des DB de plusieurs sources

UUID :
+  généré côté client SANS aller demander à la DB, pas de collision entre systèmes
+  ne révèle rien sur le volume total
-  plus lourd (16 bytes vs 4-8), index moins performant qu'un entier simple
```

Le choix dépend du contexte : un blog perso, auto-incrément suffit. Un système distribué qui génère des IDs sur plusieurs serveurs avant même de toucher la DB (vu dans `24_scalability`), UUID devient nécessaire.

---

## 6) TRANSACTIONS ET ACID : LA GARANTIE QU'UNE OPÉRATION NE FAIT PAS LES CHOSES À MOITIÉ

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1; -- retire 100 à Alice
UPDATE accounts SET balance = balance + 100 WHERE id = 2; -- ajoute 100 à Bob
COMMIT;
```

Le pourquoi : si le serveur crash entre les deux `UPDATE`, sans transaction, Alice perd 100€ et Bob ne reçoit rien. L'argent disparaît. Avec une transaction, soit les DEUX `UPDATE` passent, soit AUCUN ne passe (rollback automatique si erreur).

```
ACID :
Atomicity (atomicité)     -->  tout ou rien, jamais à moitié
Consistency (cohérence)   -->  la DB respecte toujours ses contraintes après la transaction
Isolation                 -->  deux transactions simultanées ne se piétinent pas
Durability (durabilité)   -->  une fois validée (COMMIT), la donnée survit même à un crash
```

Le risque réel sans transaction : exactement le bug "Alice perd de l'argent, Bob ne reçoit rien" ci-dessus. C'est le genre de bug qui n'apparaît jamais en dev (tout va bien, tout est rapide) et qui arrive en prod sous charge, au moment où une requête timeout pile entre les deux `UPDATE`.

---

## 7) CE QUI CASSE (MAIS FUN) : LE MODÈLE QUI SEMBLAIT BON

```js
// exemple minimal : ça a l'air raisonnable au début
// "un user a une liste d'adresses, je les stocke en JSON dans la colonne user"
{
  id: 1,
  username: "aramis",
  addresses: '[{"city":"Antananarivo","zip":"101"}]' // stocké en string JSON dans une colonne SQL
}

// exemple réaliste : 6 mois plus tard, on veut chercher "tous les users
// qui ont une adresse à Antananarivo" --> impossible proprement en SQL,
// il faut parser le JSON dans chaque ligne, aucun index ne peut aider

// exemple qui casse : un dev modifie une adresse en réécrivant tout le JSON,
// un autre dev fait pareil en même temps --> race condition (vu dans 02_async),
// la dernière écriture gagne, l'autre adresse ajoutée disparaît silencieusement
```

La leçon : stocker une liste de sous-entités qui mérite ses propres recherches/contraintes, dans une colonne JSON "pour aller plus vite au début", c'est reporter le vrai modèle à plus tard, avec intérêts. Une table `addresses` séparée avec `user_id` aurait évité les trois problèmes.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, normaliser à fond (3NF partout) était presque un dogme académique : "la dénormalisation c'est sale". Maintenant, avec des volumes de lecture massifs (apps avec des millions d'utilisateurs actifs), la dénormalisation ciblée est une décision d'ingénierie normale, documentée, pas une erreur de débutant. Le switch existe parce qu'on a compris que l'intégrité parfaite et la vitesse de lecture sont en tension, et que le bon dosage dépend du produit, pas d'un principe absolu.

---

## EXERCICES

**EXO 1 : Le schéma d'un blog**
Modélise les tables pour un blog avec : articles, auteurs, commentaires, tags. Un article a un seul auteur. Un article peut avoir plusieurs tags. Un commentaire appartient à un article et a un auteur (qui peut être différent de l'auteur de l'article). Dessine les tables et leurs clés. (20 minutes)

**EXO 2 : Dénormaliser ou pas**
Pour chaque cas, décide si tu dénormalises ou pas, et justifie : (a) le nom d'affichage d'un user dans chaque message de chat qu'il envoie, (b) le total d'une commande déjà payée, (c) le nombre de likes d'un post mis à jour en temps réel. (15 minutes)

**EXO 3 : Trouve le bug d'intégrité**
On te donne un schéma où `orders.user_id` n'a pas de contrainte `REFERENCES users(id)`. Décris un scénario concret où cette absence de contrainte cause un bug visible en prod, et la correction exacte. (10 minutes)

---

## RÉSUMÉ

Modéliser des données, c'est choisir où va vivre chaque fait, et combien de fois il est dupliqué. Normaliser élimine la duplication mais multiplie les `JOIN`. Dénormaliser accélère la lecture mais demande de la discipline pour ne pas désynchroniser les copies. Les transactions garantissent qu'une opération composée ne casse jamais ton état à moitié. Le bon modèle n'est jamais "le plus pur", c'est celui qui correspond à comment tes données sont vraiment lues et écrites.
