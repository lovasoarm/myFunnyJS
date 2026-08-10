---
statut: revu
last_reviewed: 2026-08
proprietaire: mainteneur TECH-ILA
revue: trimestrielle
companion: MyFunnyJS
---

[← Sommaire TECH-ILA](../README.md)

> **Tu viens de** : [08-ia-exercices-marche-audit.md](./08-ia-exercices-marche-audit.md) : ou de nulle part, parce que ça brûle.
> **Tu dois déjà savoir** : lire un message d'erreur littéral, ouvrir un log, exécuter une commande dans le bon environnement.
> **Ensuite** : rien. En incident, on ne lit pas le reste du corpus. On revient après.

# Mode urgence

Ce fichier ne s'apprend pas. Il se **cherche**, en moins de 30 secondes, pendant que quelque chose est cassé. Deux index et une procédure. Rien d'autre.

Utilise `Ctrl+F` sur le message d'erreur **littéral**, avant toute autre chose.

---

## 1 : Index par message d'erreur

| Message littéral                                                                          | Cause la plus fréquente                                                  | Où lire                                                                                     |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `EADDRINUSE: address already in use :::3000`                                              | un process précédent n'est pas mort                                      | [01 : Node](./01-niveau-1-socle.md)                                                         |
| `ECONNREFUSED 127.0.0.1:5432`                                                             | la base n'écoute pas, ou pas sur cet hôte depuis un conteneur            | [01 : PostgreSQL](./01-niveau-1-socle.md) · [01 : Docker](./01-niveau-1-socle.md)           |
| `remote: Permission denied (publickey)`                                                   | clé SSH absente de l'agent ou du compte                                  | [01 : Git](./01-niveau-1-socle.md)                                                          |
| `error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'` | frontière non validée, `any` implicite en amont                          | [01 : TypeScript](./01-niveau-1-socle.md)                                                   |
| `Cannot find module 'X'` en production seulement                                          | dépendance en devDependencies, ou résolution runtime inexistante         | [01 : Node](./01-niveau-1-socle.md) · [04 : build/CI](./04-niveau-4-systemes.md)            |
| `__dirname is not defined`                                                                | paquet CommonJS chargé en ESM                                            | [01 : Node](./01-niveau-1-socle.md)                                                         |
| `CORS: No 'Access-Control-Allow-Origin' header is present`                                | réponse serveur, pas un bug de front                                     | [01 : HTTP](./01-niveau-1-socle.md) · [03 : Express](./03-niveau-3-backend.md)              |
| `401 Unauthorized` après un rafraîchissement de page                                      | jeton en mémoire seulement, ou cookie sans `SameSite` correct            | [03 : auth](./03-niveau-3-backend.md)                                                       |
| `duplicate key value violates unique constraint`                                          | deux écritures concurrentes ; c'est la contrainte qui te sauve           | [01 : SQL](./01-niveau-1-socle.md)                                                          |
| `deadlock detected`                                                                       | deux transactions verrouillent dans un ordre différent                   | [01 : SQL](./01-niveau-1-socle.md)                                                          |
| `too many connections`                                                                    | pas de pool, ou un pool par instance multiplié par le nombre de réplicas | [03 : Redis/pool](./03-niveau-3-backend.md) · [04 : scalabilité](./04-niveau-4-systemes.md) |
| `JavaScript heap out of memory`                                                           | cache sans limite ni TTL, ou fuite par closure                           | [04 : performance/mémoire](./04-niveau-4-systemes.md)                                       |
| `UnhandledPromiseRejection`                                                               | un `await` manquant, une erreur avalée                                   | [03 : Node asynchrone](./03-niveau-3-backend.md)                                            |
| `Hydration failed because the initial UI does not match what was rendered on the server`  | lecture de `window`/`localStorage` au premier rendu                      | [02 : rendu](./02-niveau-2-frontend.md)                                                     |
| `Maximum update depth exceeded`                                                           | effet qui écrit l'état dont il dépend                                    | [02 : React](./02-niveau-2-frontend.md)                                                     |
| `standard_init_linux.go: exec user process caused: exec format error`                     | image construite pour une autre architecture (arm64 vs amd64)            | [01 : Docker](./01-niveau-1-socle.md)                                                       |
| `OOMKilled` / exit code 137                                                               | limite mémoire du conteneur atteinte                                     | [04 : cloud/conteneurs](./04-niveau-4-systemes.md)                                          |
| `context deadline exceeded` / `ETIMEDOUT`                                                 | appel externe sans timeout, pool épuisé en cascade                       | [04 : résilience](./04-niveau-4-systemes.md)                                                |
| `429 Too Many Requests`                                                                   | tu satures un fournisseur : concurrence non bornée                       | [03 : files/queues](./03-niveau-3-backend.md)                                               |
| `certificate has expired`                                                                 | renouvellement automatique cassé, pas ton code                           | [04 : exploitation](./04-niveau-4-systemes.md)                                              |

---

## 2 : Index par symptôme

| Symptôme                                                 | Première mesure à prendre                                                    | Où lire                                         |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| « ça marche en local, pas en prod »                      | comparer les variables d'environnement et la version du runtime, pas le code | [04](./04-niveau-4-systemes.md)                 |
| « c'est lent de temps en temps »                         | regarder le p99, jamais la moyenne                                           | [04 : observabilité](./04-niveau-4-systemes.md) |
| « la mémoire monte sans redescendre »                    | heap snapshot, chercher une `Map` ou un tableau au niveau module             | [04 : mémoire](./04-niveau-4-systemes.md)       |
| « la base sature après un déploiement »                  | cache vidé, requêtes simultanées identiques : jitter + verrou de recalcul    | [03 : Redis](./03-niveau-3-backend.md)          |
| « un client voit les données d'un autre »                | état capturé par closure ou singleton partagé entre requêtes                 | [03 : Express](./03-niveau-3-backend.md)        |
| « le déploiement est parti, il faut revenir en arrière » | rollback avant diagnostic, toujours                                          | [04 : rollback](./04-niveau-4-systemes.md)      |
| « les chiffres du rapport sont faux d'un peu »           | fuseau horaire, ou arrondi en flottant                                       | [01 : SQL](./01-niveau-1-socle.md)              |
| « le temps réel écroule le serveur »                     | diffusion à tous au lieu des abonnés, pas de fenêtrage                       | [03 : temps réel](./03-niveau-3-backend.md)     |
| « le CI est vert mais la prod casse »                    | l'environnement de test ne reproduit pas la charge ni les données            | [04 : CI/CD](./04-niveau-4-systemes.md)         |
| « l'IA a rendu la suite verte »                          | vérifier qu'aucun test n'a été désactivé                                     | [06](./06-niveau-6-ia.md)                       |

---

## 3 : Procédure d'incident, sept gestes

1. **Arrêter l'hémorragie.** Rollback ou coupure de la fonctionnalité. Le diagnostic vient après, jamais avant.
2. **Noter l'heure et l'horodatage du dernier changement.** 80 % des incidents suivent un déploiement ou un changement de configuration.
3. **Dire ce que tu vois, pas ce que tu crois.** Un message d'erreur littéral, un taux, un graphe. Pas d'hypothèse énoncée comme un fait.
4. **Réduire le périmètre.** Un endpoint ? un client ? une région ? une version ? Chaque réponse divise l'espace de recherche.
5. **Reproduire, même partiellement.** Une reproduction, même en staging avec un jeu de données copié, vaut dix intuitions.
6. **Corriger la cause, pas le symptôme** : mais poser le pansement d'abord si le pansement tient.
7. **Postmortem sans nom de coupable, dans les 48 h.** Chronologie, cause, ce qui a rendu la détection lente, une action mesurable. Sans ça, l'incident revient.

> **Règle non négociable** : pendant un incident, une seule personne décide. Les autres proposent.

---

[← Audit et marché](./08-ia-exercices-marche-audit.md) · [Sommaire](../README.md)
