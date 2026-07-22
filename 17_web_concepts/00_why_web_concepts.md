---
perennite: evolutif
stability: moderne
duree_de_vie_estimee: 3-5 ans
raison: HTTP/3, HTTPS, CORS : le stack web bouge par cycles.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : HTTP basics (21_api_craft anticipé), async (03_async). Sécurité (22_security anticipé) : ce module pointe vers la distinction authentication/authorization, creusée en détail plus tard. Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI CE MODULE MÉRITE TON TEMPS : WEB CONCEPTS

> **Durée de vie : 5+ ans.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Temps de lecture ~7 min

Tu sais écrire un `fetch`. Mais sais-tu pourquoi une requête échoue avec un 403 et pas un 401 ? Tu ne sais peut-être pas non plus ce qui se passe entre le moment où le navigateur reçoit du HTML et le moment où le pixel apparaît à l'écran, ni quand le cache devient ton allié ou ton pire ennemi.

Coder pour le web sans comprendre le web, c'est conduire une voiture sans savoir ce qu'il y a sous le capot. Tu avances, jusqu'au jour où ça tombe en panne et que tu ne sais même pas par où chercher.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Un ingénieur web qui ne maîtrise que la syntaxe d'un framework reste limité dès que le problème dépasse le cadre du framework. HTTP, les status codes, les headers : ce sont les fondations de toute communication client-serveur, peu importe l'outil utilisé par-dessus. Sans comprendre HTTP, un dev débugue à l'aveugle quand une requête échoue, parce qu'il ne sait même pas quoi chercher dans la réponse.

Ce module couvre ce qu'un ingénieur web doit avoir en tête, indépendamment de la stack : le pipeline de rendu du navigateur (comment l'HTML brut devient des pixels affichés), l'état et le flux de données dans une app (qui possède l'état, qui le lit, qui le modifie), les stratégies de cache (quand ça accélère, quand ça casse), l'authentification vs l'autorisation (deux problèmes différents qu'on confond souvent), la sérialisation des données, et les différents modes de rendu (SSR, SSG, CSR, ISR).

C'est la couche de compréhension qui te permet de raisonner sur n'importe quel problème web, peu importe si tu utilises React, Vue, ou rien du tout.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui ne comprend pas les status codes HTTP traite un 401 (non authentifié) et un 403 (authentifié mais pas autorisé) comme la même erreur, et code un message d'erreur générique qui n'aide jamais l'utilisateur à comprendre ce qui se passe réellement.

Le dev qui ne comprend pas le cache déploie une mise en cache agressive sur une donnée qui change souvent, et les utilisateurs voient des informations obsolètes sans qu'aucun bug apparent ne soit visible dans le code : le bug est dans la stratégie de cache, pas dans la logique.

Et le dev qui confond authentification et autorisation construit un système où un utilisateur connecté (authentifié) peut accéder à des ressources qu'il ne devrait pas pouvoir toucher (parce que l'autorisation, la vérification des permissions précises, n'a jamais été vérifiée séparément de la simple connexion).

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
requête qui échoue sans raison claire      --> status codes HTTP --> diagnostic précis de l'erreur
contenu qui devient obsolète chez l'utilisateur --> stratégie de cache --> invalidation correcte
utilisateur connecté qui accède à trop de choses --> auth vs authz   --> vérification de permissions distincte
app lente au premier chargement         --> rendu SSR/SSG/CSR --> choix du bon mode selon le besoin
données échangées entre client et serveur    --> sérialisation   --> format adapté (JSON, Protobuf)
```

Ces concepts ne sont pas spécifiques à un framework : ils sont la couche commune que tout système web partage, peu importe ce qui tourne par-dessus. Un dev qui change de stack tous les deux ans (et ça arrive) garde cette compréhension intacte, parce qu'elle ne dépend pas de l'outil.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

HTTP, les status codes, et le pipeline de rendu du navigateur sont des fondations stables qui évoluent lentement. Ce qui change plus vite, c'est la popularité relative des modes de rendu (SSR, SSG, CSR, ISR) selon les besoins de performance et de SEO du moment.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, le rendu côté client (CSR : client-side rendering) dominait avec la montée des SPA, au prix d'un temps de chargement initial plus long et d'un SEO (référencement) plus compliqué. Le balancier est revenu vers le rendu serveur avec le SSR (server-side rendering) et des approches hybrides comme l'ISR (incremental static regeneration), qui combinent la rapidité du contenu statique avec la fraîcheur du contenu dynamique.

Les stratégies de cache ont aussi gagné en sophistication : on est passé d'un cache "tout ou rien" vers des approches plus fines comme le stale-while-revalidate (servir une version en cache immédiatement tout en la rafraîchissant en arrière-plan), qui équilibre vitesse perçue et fraîcheur des données.

---

## 6) NOYAU DUR DU MÉTIER ?

Prérequis explicite pour plusieurs modules majeurs : `20_realtime` (prérequis `03_async` complet + `17_web_concepts`), `21_api_craft` (prérequis `15_runtime_env` + `17_web_concepts` + `05_error_handling`), et `22_security` (prérequis `21_api_craft` + `17_web_concepts`). C'est un module charnière qui conditionne ta capacité à construire des systèmes web sérieux et sécurisés.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

HTTP ne va pas disparaître. Le besoin de gérer un état applicatif, de mettre en cache intelligemment, de distinguer authentification et autorisation : ce sont des problèmes structurels du web qui resteront, peu importe le framework à la mode dans 5 ans. Un dev qui comprend ces concepts à un niveau protocole et architecture s'adapte instantanément à n'importe quel nouvel outil qui les implémente différemment.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

Un framework cache la complexité du web, mais ne la fait pas disparaître, et tu en as besoin dès que le problème dépasse ce que le framework gère pour toi. Ça casse de trois façons sans cette compréhension : diagnostics d'erreur ratés, cache mal géré, confusion entre authentification et autorisation. Ces fondations survivent à n'importe quelle mode de framework.

Maintenant, ouvre `01_http_rest_basics.md`. Et apprends enfin à lire une requête comme un vrai ingénieur, pas juste comme quelqu'un qui copie un exemple de doc.

> Ce module réutilise : l'asynchrone du module 03 (`03_async`), la gestion d'erreurs du module 05 (`05_error_handling`).
