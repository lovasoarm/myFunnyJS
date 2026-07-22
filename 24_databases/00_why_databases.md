---
perennite: perissable
stability: moderne
duree_de_vie_estimee: 3-5 ans
raison: SQL éternel, moteurs et modes managés bougent.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : structures de données (09_data_structures), async (03_async). Scalabilité (25_scalability anticipé) : ce module pose les bases (index, requêtes), la vraie scalabilité de la couche données est vue plus tard. Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI CE MODULE MÉRITE TON TEMPS : DATABASES

> **Durée de vie : 5+ ans.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Temps de lecture ~8 min

Ton app peut avoir le frontend le plus poli du monde, l'architecture la plus propre, l'API la mieux documentée : si tes données sont mal modélisées, tout le reste s'effondre dès que le volume augmente. Une requête qui prend 5ms sur 1000 lignes peut en prendre 8 secondes sur 10 millions, juste parce que personne n'a posé un index au bon endroit.

La base de données n'est pas un détail d'infrastructure qu'on configure une fois et qu'on oublie. C'est la fondation qui décide si ton système tient debout à l'échelle ou s'effondre.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Stocker une donnée semble simple : tu mets ça dans une table ou une collection, et ça reste là. Le vrai problème commence quand tu dois la retrouver rapidement, la garder cohérente face à des accès concurrents, et la faire évoluer sans tout casser. Une mauvaise modélisation (relations mal pensées, absence d'index sur les colonnes interrogées souvent, duplication incohérente) transforme une opération qui devrait être instantanée en goulot d'étranglement qui ralentit tout le système.

Ce module couvre les deux grandes familles de bases de données et comment choisir entre elles : le relationnel (SQL, avec JOIN, INDEX, et le langage de requête EXPLAIN pour comprendre comment une requête est exécutée) pour des données structurées avec des relations fortes, et le NoSQL (document, clé-valeur, graphe) pour des cas où la flexibilité du schéma ou la scalabilité horizontale priment sur les relations strictes.

Il couvre aussi la modélisation de données (normalisation pour éviter la duplication, dénormalisation quand la performance de lecture prime sur la pureté du modèle), le cache avec Redis pour absorber la charge sur les données consultées souvent, et l'intégration en JS via des ORM/query builders modernes (Prisma, Drizzle) sans tomber dans le piège classique de l'"ORM hell" (dépendance excessive à l'abstraction qui cache ce qui se passe vraiment côté base de données).

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui ne modélise pas ses données correctement découvre, une fois l'app en prod avec des vrais volumes, que des requêtes simples deviennent lentes parce qu'aucun index n'a été posé sur les colonnes filtrées en permanence. Le correctif après coup (ajouter un index sur une table déjà énorme en prod) devient une opération risquée et délicate, alors qu'elle aurait coûté zéro effort si elle avait été pensée dès la conception.

Le dev qui choisit NoSQL par mode plutôt que par besoin réel se retrouve à réimplémenter manuellement des relations et des contraintes que le relationnel gérait nativement, ou inversement, force un modèle relationnel rigide sur des données qui auraient été beaucoup plus naturelles dans un document flexible.

Et sans cache bien pensé, chaque lecture d'une donnée consultée des milliers de fois par seconde retape la base de données à chaque fois, ce qui sature le système pour des données qui auraient pu être servies instantanément depuis une couche de cache.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
recherche fréquente sur une colonne précise      --> index       --> requête rapide même à grande échelle
données fortement relationnelles (personnages, missions) --> SQL        --> intégrité référentielle garantie
données flexibles, schéma qui évolue souvent      --> NoSQL document  --> flexibilité sans migration lourde
donnée consultée des milliers de fois par seconde    --> Redis cache    --> latence quasi nulle
accès JS à la base de données              --> ORM/query builder --> requêtes sûres et lisibles
```

Le choix de la base de données et de sa modélisation n'est jamais "juste un détail technique" : c'est une décision structurelle qui détermine directement la capacité du système à tenir la charge réelle, pas la charge de la démo.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Le relationnel (SQL) est une technologie mature et stable depuis des décennies, toujours dominante pour la majorité des cas d'usage métier. Le NoSQL est plus récent dans son adoption massive, porté par les besoins de scalabilité horizontale des applications web à très grande échelle. Les deux coexistent aujourd'hui, chacun avec ses cas d'usage légitimes.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, le relationnel dominait presque sans alternative sérieuse pour la majorité des projets web. La montée des applications à très grande échelle (réseaux sociaux, plateformes avec des volumes massifs et une croissance rapide) a popularisé le NoSQL, vendu parfois comme un remplacement universel, ce qui a mené beaucoup d'équipes à l'adopter par mode plutôt que par besoin réel.

Le retour de balancier actuel est plus nuancé : la tendance privilégie de choisir l'outil selon le besoin réel plutôt que la mode, et beaucoup de bases relationnelles modernes (PostgreSQL en tête) ont intégré des capacités proches du NoSQL (stockage de documents JSON natif, par exemple), ce qui réduit le besoin de choisir un camp strict dès le départ.

---

## 6) NOYAU DUR DU MÉTIER ?

Pas dans les 6 blocs prioritaires explicitement listés, mais central dans le mini-projet `05_prison_break_api`, qui combine `21_api_craft`, `22_security`, `24_databases`, et `17_web_concepts` pour une infrastructure complète où la modélisation de données et le cache Redis sont des conditions directes de tenue sous pression du système.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Peu importe à quel point les outils et les frameworks autour évoluent, le besoin de stocker, retrouver, et garder cohérentes des données à l'échelle reste un problème fondamental et permanent de l'ingénierie logicielle. Comprendre comment une requête est réellement exécutée (via EXPLAIN, par exemple), pourquoi un index change tout, et quand choisir relationnel ou NoSQL : ce sont des compétences qui transcendent l'outil précis utilisé à un instant donné.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

Une base de données mal modélisée transforme un système rapide en démo en système qui s'effondre à l'échelle réelle. Ça casse de trois façons sans cette compréhension : requêtes lentes faute d'index, mauvais choix entre SQL et NoSQL fait par mode, absence de cache qui sature le système. Ce problème reste permanent peu importe les outils du moment.

Maintenant, ouvre `01_sql_basics.md`. Et commence à lire une requête comme quelqu'un qui sait ce qu'elle coûte vraiment.

> Ce module réutilise : les structures de données du module 09 (`09_data_structures`), l'asynchrone du module 03 (`03_async`).

---

## AILLEURS QUE JS

- **Python (Django ORM, SQLAlchemy)** : les memes N+1, les memes migrations. Vocabulaire identique.
- **Java (JPA/Hibernate)** : ORM historique, memes pieges de lazy loading.
- **Go (sqlx, sqlc)** : plus proche du SQL brut, moins d'abstraction. La lecture de plan (EXPLAIN) reste la meme.
- **Rust (sqlx, diesel)** : verifications a la compilation. La DB reste externe, les regles ACID sont universelles.
