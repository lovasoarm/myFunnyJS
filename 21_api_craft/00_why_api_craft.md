---
perennite: evolutif
stability: moderne
duree_de_vie_estimee: 3-5 ans
raison: REST, GraphQL, tRPC : formats bougent, contrats restent.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : HTTP (17_web_concepts), erreurs (05_error_handling). Sécurité (22_security anticipé) : ce module touche à l'auth et aux headers de base, la profondeur (XSS, CSRF, injection) est vue plus tard. Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI CE MODULE MÉRITE TON TEMPS : API CRAFT

> **Durée de vie : 5+ ans.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Temps de lecture ~8 min

N'importe qui peut écrire `app.get('/route', () => res.send('ok'))`. Construire une API que d'autres équipes vont consommer pendant des années, faire évoluer sans tout casser, et documenter pour qu'un dev externe la comprenne sans te demander : ça, c'est un métier à part entière.

Une API mal construite, c'est une dette qui se paie pour toujours, parce que des clients externes dépendent de chaque détail, même ceux que tu n'avais pas prévus comme "publics".

---

## PRÉREQUIS

Ce module suppose que tu maîtrises :
- Node.js, process, streams : voir `15_runtime_env/`
- HTTP, verbes, status codes, headers : voir `17_web_concepts/01_http_rest_basics.md`
- gestion d'erreurs async : voir `05_error_handling/04_async_error_traps.md`

Si ces bases ne sont pas là : reviens ici après.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Construire une API qui marche pour un cas de test, c'est facile. Construire une API qui reste stable, sécurisée, et compréhensible alors que des dizaines de clients différents (apps mobile, frontend web, autres services internes) en dépendent, c'est une discipline complète.

Ce module couvre les éléments qui transforment un endpoint bricolé en API professionnelle :
- un CRUD (Create, Read, Update, Delete) complet et cohérent sur chaque ressource
- une gestion d'erreur uniforme avec des status codes et des formats d'erreur prévisibles
- l'authentification avec JWT (JSON Web Token : jeton signé qui prouve l'identité sans session côté serveur), gérée correctement de bout en bout (sign, verify, refresh)
- le versioning (gestion des versions) pour faire évoluer l'API sans casser les clients existants
- la documentation avec OpenAPI pour que n'importe qui puisse comprendre le contrat sans lire le code source

Sans cette discipline, chaque évolution de l'API devient un risque de casser un client externe que tu ne contrôles pas et que tu ne peux peut-être même pas contacter pour le prévenir.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Une API JWT mal implémentée (sans vérification correcte de l'expiration, sans rotation des refresh tokens) ouvre une faille de sécurité béante : un token volé une fois reste valide indéfiniment. C'est le scénario le plus grave, parce qu'il ne casse pas une feature, il expose tout le système.

Le dev qui construit une API sans discipline retourne des erreurs incohérentes : parfois un texte brut, parfois un objet JSON, parfois juste un status 500 sans aucun détail. Le client de l'API (qui peut être une autre équipe, un autre service, ou une app mobile) doit deviner ce qui s'est passé, ce qui rend l'intégration lente et fragile.

Sans versioning, modifier la forme d'une réponse pour "l'améliorer" casse silencieusement tous les clients qui dépendaient de l'ancien format, sans aucun avertissement préalable. Et sans documentation OpenAPI, chaque nouvelle intégration demande des allers-retours constants avec l'équipe qui a construit l'API, parce que le contrat n'est écrit nulle part de façon exploitable.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
ressource à créer/lire/modifier/supprimer    --> CRUD REST     --> verbes HTTP cohérents (GET, POST, PUT, PATCH, DELETE)
erreur d'API mal formée             --> error handling API --> format uniforme et status codes corrects
utilisateur qui doit prouver son identité    --> JWT        --> sign/verify/refresh sécurisé
nouvelle version de l'API qui change la réponse --> API versioning   --> anciens clients non cassés
intégration par une équipe externe        --> OpenAPI/Swagger  --> contrat documenté et exploitable
```

Une API n'est jamais un détail technique isolé : c'est un contrat public (même en interne) que d'autres équipes vont construire par-dessus, et que tu ne peux plus changer aussi librement une fois que des clients en dépendent réellement.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

REST reste le standard dominant pour la majorité des APIs, même si GraphQL a gagné du terrain pour des cas où le client a besoin de requêtes flexibles et précises. Les principes de versioning, de gestion d'erreur cohérente, et de documentation restent stables peu importe le style d'API choisi.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, beaucoup d'APIs étaient construites sans documentation formelle, avec un wiki interne maintenu à la main et rapidement obsolète. OpenAPI (anciennement Swagger) a changé cette dynamique en rendant la documentation générable directement depuis le code ou la spécification, ce qui la garde synchronisée avec la vraie implémentation plutôt que de dériver dans le temps.

GraphQL a aussi introduit une alternative sérieuse à REST pour certains cas d'usage : au lieu de multiplier les endpoints pour chaque combinaison de données nécessaires, un client GraphQL demande exactement les champs dont il a besoin en une seule requête. Ce n'est pas un remplacement universel de REST, mais une option supplémentaire selon le contexte (notamment quand le client a des besoins de données très variables).

---

## 6) NOYAU DUR DU MÉTIER ?

Oui, explicitement : "15 + 20, Architecture + API Craft : sans ça, t'es junior à vie". Prérequis direct : `15_runtime_env` + `17_web_concepts` + `05_error_handling`. Tu ne peux pas construire une API sérieuse sans déjà savoir où ton code s'exécute, comment fonctionne HTTP, et comment gérer les erreurs proprement. C'est aussi un prérequis direct pour `22_security`.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Construire des systèmes qui communiquent entre eux via des APIs ne va pas disparaître : ça reste le mode d'intégration dominant entre services, qu'ils soient internes ou externes. Le style exact (REST, GraphQL, ou autre chose) peut évoluer, mais la discipline de fond (contrat stable, gestion d'erreur cohérente, documentation fiable, versioning pensé) reste la marque d'un dev qui construit pour durer, pas juste pour faire passer un test.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

Une API n'est jamais juste "un endpoint qui marche" : c'est un contrat public dont d'autres dépendent durablement. Ça casse de trois façons sans cette discipline : erreurs incohérentes, clients cassés silencieusement par un changement non versionné, sécurité JWT fragile qui laisse un token volé valide pour toujours. Ce module fait partie du noyau dur qui distingue un junior d'un senior.

Maintenant, ouvre `01_express_from_scratch.md`. Et construis une API comme quelqu'un qui sait que d'autres vont en dépendre.

> Ce module réutilise : les web concepts du module 17 (`17_web_concepts`), l'architecture en couches du module 16 (`16_architecture_patterns`).

---

## AILLEURS QUE JS

- **Python (FastAPI)** : validation Pydantic, OpenAPI auto-genere.
- **Go (chi, gin)** : middleware compose, contexte propage. Meme grammaire.
- **Rust (axum)** : type-safety a la compilation pour les routes.
- **Partout** : versionnage, idempotence, retry, timeout, backpressure sont les memes 5 sujets.
