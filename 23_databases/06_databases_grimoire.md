# Tout le vocabulaire DB en un seul endroit

Le grimoire du module 23. Pas un résumé : la référence complète que tu rouvres quand un terme te bloque, en review de code ou en lisant une doc technique.

---

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| DB relationnelle | Données rangées en tables avec un schéma fixe et des relations explicites entre elles. | `CREATE TABLE users (id INT, name TEXT);` | classeur à compartiments fixes / Excel avec règles strictes |
| SQL | Langage standard pour interroger et manipuler une DB relationnelle. | `SELECT * FROM users WHERE id = 1;` | langue commune à toutes les DB relationnelles / commande au resto |
| SELECT | Instruction pour lire des données, en choisissant les colonnes voulues. | `SELECT id, email FROM users;` | demander juste 2 plats sur le menu / extraire 2 colonnes d'un tableau |
| WHERE | Filtre les lignes selon une condition avant de les retourner. | `WHERE status = 'pending'` | trieur de courrier / filtre à café |
| JOIN | Recolle deux tables séparées via une colonne commune. | `JOIN users ON orders.user_id = users.id` | agrafer deux dossiers liés / fusion de deux listes |
| INNER JOIN | Garde seulement les lignes qui matchent dans les deux tables. | `INNER JOIN users ON o.user_id = u.id` | intersection de deux groupes / amis communs |
| LEFT JOIN | Garde toutes les lignes de la table de gauche, même sans match à droite. | `LEFT JOIN users ON o.user_id = u.id` | liste complète + infos si dispo / appel qui peut rester sans réponse |
| INDEX | Structure annexe qui accélère la recherche sur une colonne. | `CREATE INDEX idx_email ON users(email);` | index d'un livre / table des matières |
| EXPLAIN | Affiche le plan d'exécution réel choisi par la DB pour une requête. | `EXPLAIN SELECT * FROM orders WHERE id = 1;` | radiographie d'une requête / GPS qui montre l'itinéraire choisi |
| Full table scan | La DB lit toutes les lignes d'une table car aucun index ne peut aider. | (visible dans le résultat d'`EXPLAIN` comme `Seq Scan`) | chercher un nom en lisant tout l'annuaire / fouille page par page |
| GROUP BY | Regroupe les lignes par valeur commune pour appliquer une agrégation. | `GROUP BY status` | trier le linge par couleur avant lavage / classer par catégorie |
| HAVING | Filtre les groupes après agrégation, contrairement à WHERE qui filtre avant. | `GROUP BY user_id HAVING SUM(total) > 500` | filtre appliqué après le tri par paquets / contrôle qualité post-groupement |
| Transaction | Bloc d'opérations exécutées comme un tout : tout passe, ou rien ne passe. | `BEGIN; ... COMMIT;` | virement bancaire atomique / pack tout-ou-rien |
| ACID | Garanties d'une transaction fiable : atomicité, cohérence, isolation, durabilité. | (propriété du moteur DB, pas une instruction SQL) | contrat béton armé / serment incassable |
| Injection SQL | Faille où une entrée utilisateur non filtrée devient du code SQL exécuté. | `'OR '1'='1` glissé dans un champ texte | cheval de Troie dans un formulaire / faux passeport accepté |
| Requête paramétrée | Requête où les valeurs sont séparées du SQL, jamais concatenées en string. | `db.query('... WHERE id = $1', [id])` | bulletin de vote séparé de l'enveloppe / formulaire avec cases dédiées |
| Normalisation | Discipline qui élimine la duplication d'un même fait dans plusieurs tables. | `products` séparé de `orders`, référencé par `product_id` | un seul exemplaire du règlement, consulté par tous / source unique de vérité |
| Dénormalisation | Duplication volontaire de données pour accélérer la lecture ou figer un historique. | `orders.price_at_purchase` copié au moment de l'achat | photo prise à un instant T / reçu de caisse qui ne change jamais |
| Clé primaire (Primary Key) | Identifiant unique d'une ligne dans sa propre table. | `id SERIAL PRIMARY KEY` | numéro de sécu / plaque d'immatriculation |
| Clé étrangère (Foreign Key) | Référence vers la clé primaire d'une autre table, garantit l'intégrité. | `user_id INT REFERENCES users(id)` | renvoi vers une autre fiche / lien hypertexte obligatoire |
| Table de jointure (junction table) | Table intermédiaire qui gère une relation many-to-many. | `product_tags(product_id, tag_id)` | carnet de rendez-vous entre deux groupes / table de mise en relation |
| NoSQL | Famille de DB qui s'écarte du modèle relationnel strict pour gagner en flexibilité ou en vitesse. | MongoDB, Redis, Cassandra, Neo4j | boîte à outils à compartiments mobiles / kit modulable |
| DB document | Stocke des objets JSON-like à schéma flexible, pas de table fixe. | `{ _id: 1, name: "x", tags: ["a","b"] }` | dossier perso avec pièces jointes variables / fiche libre |
| DB clé-valeur | Stocke une valeur accessible directement par une clé unique, ultra rapide. | `redis.set('session:1', data)` | casier numéroté au vestiaire / étiquette + boîte |
| DB colonne large | Optimisée pour écrire et lire des volumes massifs répartis sur plusieurs machines. | Cassandra, ScyllaDB | entrepôt distribué sur plusieurs sites / chaîne de production parallèle |
| DB graphe | Stocke les relations comme structure de première classe, pas comme jointure. | `MATCH (a)-[:FRIEND]->(b) RETURN b` | carte du métro avec connexions / arbre généalogique |
| Eventual consistency | Garantie que la donnée finira par être cohérente partout, mais pas instantanément. | (comportement par défaut de beaucoup de DB distribuées) | rumeur qui finit par atteindre tout le monde / écho qui se propage |
| Cache | Couche de stockage temporaire et rapide qui évite de recalculer ou re-requêter. | `redis.get('product:1')` | pense-bête sur le bureau / brouillon gardé sous la main |
| TTL (time to live) | Durée de vie d'une donnée en cache avant expiration automatique. | `redis.set('key', val, 'EX', 3600)` | ticket de parking limité / date de péremption |
| Cache HIT / MISS | HIT = la donnée était en cache. MISS = elle n'y était pas, il faut aller la chercher. | `if (cached) { /* HIT */ } else { /* MISS */ }` | trouver direct dans le tiroir / devoir aller au sous-sol |
| Invalidation de cache | Suppression ou mise à jour du cache quand la donnée source change. | `redis.del('product:1')` après un `UPDATE` | jeter le brouillon périmé / mettre à jour le panneau d'affichage |
| Cache stampede | Des milliers de requêtes recalculent en même temps une donnée juste expirée. | (corrigé avec un lock, voir `04_redis_caching`) | foule qui se précipite à l'ouverture des portes / ruée vers le même guichet |
| Cache-aside | Stratégie où l'appli vérifie le cache d'abord, sinon va en DB et remplit le cache. | voir `getProduct(id)` dans `04_redis_caching` | demander au copain avant d'aller en bibliothèque / raccourci par défaut |
| Write-through | Stratégie où chaque écriture DB met aussi à jour le cache immédiatement. | écrire en DB + `redis.set` dans la même opération | mise à jour simultanée carnet + tableau affiché / double saisie immédiate |
| Driver (DB) | Bibliothèque bas niveau qui transporte les requêtes SQL brutes vers la DB. | `import { Pool } from 'pg'` | tuyau brut sans filtre / téléphone direct sans intermédiaire |
| Query builder | Couche qui construit le SQL via des méthodes JS chaînées, lisible et typé. | `db.select().from(users).where(...)` | kit de construction modulaire / Lego qui assemble la requête |
| ORM (object-relational mapping) | Couche qui mappe des objets JS vers des lignes de DB, génère le SQL pour toi. | `prisma.user.findUnique({ where: { id: 1 } })` | traducteur automatique / interprète qui gère la conversation |
| Problème N+1 | Une requête initiale suivie d'une requête supplémentaire par élément, au lieu d'une seule optimisée. | boucle qui requête une fois par user au lieu d'un `include` | demander l'addition plat par plat au lieu d'une note groupée / aller-retour répété évitable |
| Migration (DB) | Fichier versionné qui décrit un changement de schéma, appliqué dans un ordre connu. | `prisma migrate dev --name add_user_bio` | commit git mais pour la structure de la DB / plan de travaux daté |
| Pool de connexions | Ensemble de connexions DB réutilisées au lieu d'en ouvrir une nouvelle par requête. | `new Pool({ max: 10 })` | flotte de taxis partagée / standard téléphonique avec lignes limitées |
| BLOB (binary large object) | Donnée binaire volumineuse stockée directement dans une colonne DB. | colonne `image BYTEA` en PostgreSQL | colis lourd dans un casier prévu pour des lettres / pièce jointe énorme |
| Race condition (DB) | Deux opérations concurrentes qui se piétinent et produisent un résultat incohérent. | deux `UPDATE` simultanés sur le même JSON sans verrou | deux personnes qui écrivent sur le même post-it en même temps / portes qui se croisent |

---

## CE QUE TU DOIS RETENIR EN SORTANT DE CE MODULE

Une DB n'est jamais juste "l'endroit où on range les données". C'est un outil avec des compromis précis : SQL te donne l'intégrité et la rigueur au prix de la flexibilité, NoSQL te donne la flexibilité ou la vitesse au prix de garanties plus faibles, le cache te donne la vitesse au prix d'une fraîcheur relative que tu dois gérer activement.

Trois réflexes à garder à vie, peu importe le langage ou le framework du moment :

```
1. Avant un UPDATE/DELETE en prod : fais le SELECT équivalent d'abord
2. Avant de choisir une DB : regarde la forme de tes données ET de tes requêtes
3. Avant d'activer un ORM en confort : vérifie ce qui part vraiment en SQL (N+1, JOIN cachés)
```

Le reste (quel ORM est à la mode, quelle DB cloud est tendance) change tous les 2 ans. Ces trois réflexes ne changeront pas.
