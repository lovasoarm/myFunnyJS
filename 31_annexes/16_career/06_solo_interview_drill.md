---
stability: intemporel
---

# Solo Interview Drill : 20 questions, rejouable trimestriellement

> Le maillon manquant entre « je sais coder » et « je sais défendre ».
> À rejouer trimestriellement en même temps que `05_ai_famine_drill.md`.

## Mode d'emploi

- **Durée cible** : 90 min (4-5 min par question, hors debrief).
- **Setup** : timer, carnet, éditeur ouvert, **aucune IA**, aucun Google.
- Réponds à voix haute ou à l'écrit. Note ta réponse **avant** de lire la rubrique.
- Auto-notation à la fin, seuil de passage : **≥ 60/100**.

## Bloc A : System design (7 questions, 35 min)

1. Conçois un raccourcisseur d'URL (bit.ly) : schéma DB, endpoints, comment
   tu générés les slugs, comment tu gères 10k req/s en lecture.
2. Un feed d'actualité type Twitter/X : fan-out en écriture vs en lecture,
   dans quel cas tu bascules.
3. Rate limiter distribué pour une API : algorithme (token bucket vs sliding
   window), où tu stockes l'état, comment tu tolères une panne Redis.
4. File d'envoi d'emails avec retry et backoff : garanties (at-least-once vs
   exactly-once), idempotency key, dead letter queue.
5. Cache multi-niveaux (L1 process, L2 Redis, L3 DB) : politique d'éviction,
   invalidation, stampede protection.
6. Chat temps réel à 100k utilisateurs simultanés : WebSocket vs SSE vs
   long-polling, sharding par room, présence.
7. Recherche full-text sur 10M documents : index inversé maison vs
   Elasticsearch, comment tu re-indexes sans downtime.

## Bloc B : Debugging (7 questions, 35 min)

8. Un endpoint p50=50ms, p99=5s. Par où tu commences ?
9. Une fuite mémoire en prod Node.js. Ta démarche complète, outils inclus.
10. Un test flaky qui passe 9 fois sur 10 : les 4 causes possibles, comment
    tu tranches sans le supprimer.
11. Un `useEffect` qui se déclenche en boucle infinie : les 3 causes
    classiques, comment tu identifies laquelle.
12. Une race condition qui se manifeste 1 fois sur 1000 en prod, jamais en
    dev. Stratégie de reproduction.
13. Un déploiement casse la production. Rollback vs forward-fix : ta
    matrice de décision.
14. Un requête SQL passe de 20ms à 20s d'un jour à l'autre : les 5 hypothèses
    à écarter dans l'ordre.

## Bloc C : Défense de décision (6 questions, 20 min)

15. Défends ton choix de framework pour ton dernier projet : les 2
    alternatives que tu as **rejetées** et **pourquoi**.
16. Un junior te propose de tout réécrire en microservices. Ta réponse
    argumentée en 2 minutes.
17. Le PM veut « juste ajouter un champ » à une table de 200M lignes.
    Explique-lui le coût réel sans jargonner.
18. Ton PR est refusé pour « pas assez de tests ». Tu penses que les tests
    demandés sont inutiles. Comment tu défends ta position sans t'énerver ?
19. On te demande d'estimer un projet de 3 mois. Donne ta fourchette et
    justifie les 2 chiffres (bas et haut).
20. Un pair te demande pourquoi tu utilises `Result<T, E>` plutôt que
    d'exceptions. Réponds en 60 secondes, sans religion.

## Rubrique d'auto-notation (sur 100)

Pour chaque question, note-toi de 0 à 5 :

- **0** : Pas de réponse, ou réponse hors sujet.
- **1** : Réponse générique (« ça dépend »).
- **2** : Réponse partielle, un axe cité mais pas justifié.
- **3** : Réponse structurée, 2+ axes, tradeoffs mentionnés.
- **4** : Comme 3 + un chiffre / une contrainte concrète (latence, RAM, coût).
- **5** : Comme 4 + un contre-argument que tu as toi-même levé et tranché.

Total sur 100 (20 × 5). **Seuil de passage : ≥ 60**.

- **< 40** : Rejoue dans 2 semaines. Identifie le bloc le plus faible et cible-le.
- **40 à 59** : Rejoue dans 1 mois. Écris 5 fiches courtes sur tes trous.
- **≥ 60** : Rejoue trimestriellement, ajoute 5 nouvelles questions maison.

## Journal

Après chaque session, écris 10 lignes dans `31_annexes/16_career/06_interview_drill_log.md`
(à créer au premier passage) : date, score, 3 questions ratées, 1 truc appris,
prochaine cadence prévue.
