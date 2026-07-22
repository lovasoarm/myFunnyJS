---
stability: intemporel
---

# ADR : DOCUMENTER UNE DÉCISION AVANT QU'ELLE DEVIENNE UN MYSTÈRE
Temps de lecture ~9 min

Dans six mois, quelqu'un va tomber sur ce bout de code et se demander :
"Pourquoi ils ont utilisé Redis ici et pas une DB normale ?"
"Pourquoi ce module est séparé ?"
"Qui a décidé d'utiliser cette lib et pour quelle raison ?"

Si personne a écrit la réponse : soit c'est le dev qui s'en souvient (bus factor à 1), soit c'est perdu.

Un ADR (Architecture Decision Record : document de décision architecturale) est la réponse à ce problème. Pas un document d'analyse de 40 pages. Une note structurée qui dit : on a choisi X plutôt que Y, voilà pourquoi, voilà ce qu'on a sacrifié.

---

## 1) POURQUOI LES DÉCISIONS DISPARAISSENT

```
CYCLE DE VIE D'UNE DÉCISION SANS ADR

Semaine 1 : débat en réunion ou sur Slack
      "on utilise JWT ou sessions ?"
      --> décision prise : JWT

Mois 3  : nouveau dev arrive
      "pourquoi JWT et pas sessions ici ?"
      --> personne sait plus vraiment, "c'est comme ça"

Mois 8  : bug de sécurité lié au JWT
      "on peut passer aux sessions ?"
      --> on ne sait pas ce que ça casse, on a peur de toucher
      --> on laisse le bug

Mois 14  : refactoring général
      "quelqu'un comprend pourquoi ce choix a été fait ?"
      --> silence
```

Un ADR coupe ce cycle. Il rend la décision traçable, compréhensible, et révisable.

---

## 2) CE QU'UN ADR N'EST PAS

Un ADR n'est pas :
- un document d'architecture complet
- un rapport de projet
- une présentation pour le management
- un commentaire de code

Un ADR c'est une décision + son contexte + ses alternatives + ses conséquences.
Ça tient en une page. Pas plus.

---

## 3) STRUCTURE D'UN ADR

Format standard (Madr : Markdown Architectural Decision Records, format répandu en open source) :

```markdown
# ADR-001 : [titre de la décision]

## Statut
[Proposé | Accepté | Déprécié | Remplacé par ADR-XXX]

## Contexte
[Le problème qu'on résout. Ce qui nous a forcé à prendre cette décision.
Pas de solution ici : juste le terrain.]

## Décision
[Ce qu'on a choisi. Une phrase claire. Pas de justification encore.]

## Alternatives considérées
[Ce qu'on aurait pu faire à la place.
Chaque alternative avec ses avantages et ses limites.]

## Conséquences
[Ce que cette décision change.
Ce qu'on gagne, ce qu'on sacrifie, ce qu'on devra gérer à cause de ce choix.]
```

---

## 4) UN ADR COMPLET EN EXEMPLE

Contexte : le projet `05_prison_break_api`. Michael Scofield a besoin d'une auth pour son API d'évasion.

```markdown
# ADR-001 : utiliser JWT stateless pour l'authentification des prisonniers

## Statut
Accepté : mars 2026

## Contexte
L'API Prison Break doit authentifier les prisonniers sur plusieurs endpoints.
Le service tourne sur deux instances Node derrière un load balancer (répartiteur de charge).
Les sessions côté serveur nécessitent un store partagé (Redis ou DB) pour fonctionner
sur plusieurs instances. On veut éviter cette dépendance supplémentaire au démarrage.
Charge prévue : 500 requêtes/minute en pic, profil de sécurité : données sensibles
(plans d'évasion, positions des gardes).

## Décision
On utilise JWT (JSON Web Token : jeton d'authentification sans état) signé avec RS256
(algorithme asymétrique : clé privée pour signer, clé publique pour vérifier).
Durée de vie : 15 minutes. Refresh token (jeton de renouvellement) stocké en httpOnly cookie
avec durée de vie 7 jours.

## Alternatives considérées

**Sessions serveur + Redis**
- Avantages : révocation instantanée possible, pas de données dans le token
- Limites : dépendance Redis obligatoire, complexité opérationnelle, latence sur chaque requête
- Rejeté parce que : ajoute Redis à l'infra dès le jour 1 pour un avantage (révocation)
 qu'on peut simuler avec un blacklist (liste noire) léger en mémoire

**JWT avec HS256 (algorithme symétrique)**
- Avantages : plus simple, une seule clé
- Limites : si la clé est compromise, tous les tokens existants sont invalides rétroactivement,
 et on ne peut pas déléguer la vérification sans partager le secret
- Rejeté parce que : RS256 permet de vérifier les tokens sur des services tiers
 sans exposer la clé de signature

**OAuth2 complet**
- Avantages : standard industriel, délégation possible
- Limites : complexité disproportionnée pour un service interne sans tiers externe
- Rejeté parce que : over-engineering pour le scope actuel

## Conséquences

Gains :
- aucune dépendance supplémentaire sur l'infra de départ
- stateless : le load balancer peut router vers n'importe quelle instance
- vérification possible par un service externe sans partager le secret

Sacrifices :
- révocation d'un token avant expiration : complexe : nécessite une blacklist
- si un token est volé, il reste valide 15 minutes (atténué par la durée courte)
- la rotation des clés RS256 doit être gérée manuellement

Décisions liées :
- ADR-002 portera sur la stratégie de stockage des refresh tokens
- si la révocation en temps réel devient requise avant 6 mois, passer à sessions + Redis
 et référencer ce document comme raison du pivot
```

---

## 5) QUAND ÉCRIRE UN ADR

Pas pour chaque ligne de code. Pour les décisions qui ont un impact durable.

```
MÉRITE UN ADR             NE MÉRITE PAS UN ADR
------------------------------     ------------------------------
choix de bibliothèque majeure     quel nom de variable utiliser
choix d'architecture (MVC vs event)  comment formater les dates
stratégie d'auth ou de cache      ordre des imports
format de communication entre     refactoring interne d'une fonction
services (REST vs GraphQL vs events)
structure des modules du projet
décision de ne PAS faire quelque chose
 (ex: "on n'utilise pas de framework UI")
```

**Règle simple :** si la décision est irréversible ou coûteuse à changer dans six mois, elle mérite un ADR.

---

## 6) LE STATUT D'UN ADR EST AUSSI UNE INFORMATION

```
Proposé  : la décision est en discussion, pas encore validée
Accepté  : validée et en vigueur
Déprécié : plus en vigueur, mais pas remplacée par une autre décision
Remplacé : remplacée par un ADR plus récent (ADR-001 remplacé par ADR-007)
```

Un ADR qu'on modifie pour le "mettre à jour" perd son utilité : il ne documente plus l'historique. La bonne pratique : créer un nouvel ADR et marquer l'ancien comme "Remplacé par ADR-XXX".

---

## 7) OÙ METTRE LES ADR DANS UN PROJET

```
projet/
├── src/
├── tests/
└── ADR/
  ├── ADR-001_auth_jwt.md
  ├── ADR-002_refresh_token_storage.md
  ├── ADR-003_no_orm_drizzle_only.md
  └── README.md  <-- index des ADR avec une ligne par décision
```

L'index `README.md` dans le dossier ADR :

```markdown
# INDEX DES DÉCISIONS ARCHITECTURALES

| ID   | Titre                | Statut  | Date    |
|---------|--------------------------------------|----------|------------|
| ADR-001 | Auth JWT avec RS256         | Accepté | 2026-03-12 |
| ADR-002 | Refresh tokens en httpOnly cookie  | Accepté | 2026-03-14 |
| ADR-003 | Pas d'ORM : Drizzle en mode requêtes | Accepté | 2026-03-20 |
```

---

## EXERCICES

**EXO 1 : décoder une décision silencieuse**

Tu rejoins le projet `04_breaking_cache` de Walter White.
Tu trouves dans le code :

```javascript
// cache des routes de livraison
const routeCache = new Map(); // et pas Redis, et pas localStorage, et pas une variable globale

function getCachedRoute(from, to) {
 const key = `${from}-${to}`;
 if (routeCache.has(key)) return routeCache.get(key);
 const route = computeShortestPath(from, to);
 routeCache.set(key, route);
 return route;
}
```

Écris l'ADR rétroactif qui documente ce choix. Imagine le contexte, propose deux alternatives, et liste les conséquences.

---

**EXO 2 : la décision de ne pas faire**

Écris un ADR pour la décision suivante :
"On n'utilise pas de framework frontend dans le projet `01_rasengan_engine`. L'interface est en HTML/CSS/JS pur."

(indice : la décision de ne PAS utiliser quelque chose mérite autant d'être documentée que la décision d'utiliser)

---

**EXO 3 : ADR sous pression**

Le projet `06_ultras_dashboard` vient de recevoir un pic de 50 000 connexions simultanées.
Redis est à 95% de mémoire. L'équipe doit décider en 30 minutes : on scale Redis ou on ajoute
un CDN pour les données statiques de match.

Écris l'ADR en temps limité (structure complète, décision tranchée, alternatives documentées).
L'exercice simule une décision prise sous pression : l'ADR doit quand même être lisible dans six mois.

---

## RÉSUMÉ

Un ADR documente une décision, pas un système complet. Une page suffit.
Le contexte est la partie la plus importante : sans lui, la décision semble arbitraire.
Les alternatives qu'on a rejetées sont aussi précieuses que le choix final.
Le statut d'un ADR évolue : on ne le modifie pas, on le remplace avec un nouveau.
Un dossier `ADR/` avec un index est le minimum viable pour un projet qui dure.
