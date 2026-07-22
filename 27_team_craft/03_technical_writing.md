---
stability: intemporel
---

# TECHNICAL WRITING : ÉCRIRE POUR DES DEVS
Temps de lecture ~10 min

Un README qui ne marche pas le jour 1 : c'est un README mort.
Une doc qui explique le quoi sans le pourquoi : c'est de la décoration.
Un runbook (guide d'intervention opérationnelle) qu'on lit pendant un incident à 2h du matin sans trouver la réponse : c'est un runbook raté.

Écrire pour des devs c'est différent d'écrire pour des humains normaux. Les devs lisent en diagonal, ils cherchent l'info précise, ils veulent copier-coller le bon truc au bon moment, et ils détestent les introductions interminables.

Ce fichier t'apprend à écrire des docs que les devs ouvrent et ferment satisfaits.

---

## 1) LES QUATRE TYPES DE DOCUMENTATION

Ils n'ont pas le même objectif. Les confondre produit des docs qui font tout mal.

```
TYPE      QUESTION QU'IL RÉPOND     EXEMPLE
-----------   -----------------------    ----------------------------------
Tutorial    "comment je démarre ?"     quickstart, hello world
How-to     "comment je fais X ?"     "comment configurer l'auth JWT"
Reference    "qu'est-ce que X fait ?"    doc d'API, liste des params
Explanation   "pourquoi ça fonctionne    "architecture du système de cache"
        comme ça ?"
```

**L'erreur la plus fréquente :** mélanger les quatre dans un seul document.
Un README qui essaie d'être un tutorial, une référence, et une explication en même temps : c'est illisible.

---

## 2) README : LE CONTRAT D'ENTRÉE

Un README c'est la première chose qu'un dev lit. Il répond à quatre questions dans l'ordre :

```
1. C'est quoi ce truc ? (une ligne)
2. Comment je le fais tourner en 5 minutes ? (les commandes exactes)
3. Comment c'est organisé ? (structure du projet)
4. Où je trouve le reste ? (liens vers les autres docs)
```

Structure minimale qui fonctionne :

```markdown
# nom-du-projet

Une ligne qui explique ce que ça fait. Pas ce que c'est : ce que ça fait.

## Prérequis
- Node >= 20
- PostgreSQL 15
- Redis 7 (optionnel pour le cache)

## Installation

\```bash
git clone https://github.com/...
cd nom-du-projet
cp .env.example .env   # remplis les variables -- voir section Configuration
npm install
npm run migrate     # initialise la DB
npm run dev       # localhost:3000
\```

## Configuration
Variables d'environnement requises :
| Variable     | Description          | Exemple       |
|-------------------|--------------------------------|---------------------|
| DATABASE_URL   | connexion PostgreSQL      | postgresql://...  |
| JWT_SECRET    | clé de signature des tokens   | 64 chars minimum  |
| REDIS_URL     | optionnel, active le cache   | redis://localhost  |

## Structure du projet
\```
src/
├── routes/   -- handlers HTTP, validation des inputs
├── services/  -- logique métier, pas de HTTP ici
├── db/     -- requêtes SQL, pas d'ORM
└── middleware/ -- auth, rate limiting, error handling
\```

## Tests
\```bash
npm test       # tous les tests
npm run test:unit   # tests unitaires uniquement
npm run test:e2e   # nécessite une DB de test configurée
\```

## Liens
- `./ADR/` (exemple de chemin, non cliquable) -- décisions architecturales
- `./docs/runbook.md` (exemple de chemin, non cliquable) -- opérations courantes en prod
- `API Reference` (`./docs/api.md` : exemple, non fourni) -- endpoints documentés
```

**Ce qui manque souvent et qui fait souffrir tout le monde :**
- la version de Node exacte (pas juste "Node requis")
- les variables d'environnement avec des exemples
- ce qui se passe si on lance `npm test` sans avoir configuré la DB
- un lien vers "je suis bloqué, je fais quoi ?"

---

## 3) COMMENTAIRES DE CODE : LA RÈGLE DU POURQUOI

Un commentaire qui répète le code est inutile.

```javascript
// INUTILE : répète ce qu'on voit déjà
// incrémente le compteur
counter++;

// UTILE : explique le pourquoi ou le non-évident
// on incrémente avant d'envoyer la réponse parce que le client
// interprète le compteur comme "nombre de votes reçus incluant celui-ci"
// si on incrémente après : le client affiche un décalage d'une unité
counter++;
```

**Trois cas où un commentaire est obligatoire :**

```javascript
// CAS 1 : décision non évidente
// on utilise `setTimeout(fn, 0)` ici pour forcer l'exécution après le rendu du DOM
// sans ça, `element.scrollTop` retourne 0 car le DOM n'est pas encore mis à jour
setTimeout(() => { element.scrollTop = element.scrollHeight; }, 0);

// CAS 2 : workaround (contournement) avec sa raison
// workaround : Chromium 112 ignore `pointer-events: none` sur les SVG imbriqués
// ticket upstream : https://bugs.chromium.org/p/chromium/issues/detail?id=XXXXX
// à supprimer quand Chromium 115 sera le minimum supporté
svgElement.style.pointerEvents = 'all';

// CAS 3 : logique métier non déductible du code
// les votes des journalistes malgaches comptent 1.5x selon les règles FIFA 2025
// si ce ratio change : chercher tous les `VOTE_WEIGHT` dans le projet
const weight = journalist.country === 'MG' ? 1.5 : 1.0;
```

---

## 4) RUNBOOK : L'OUTIL DU 2H DU MATIN

Un runbook c'est une liste d'opérations courantes avec les commandes exactes.
Pas d'explications profondes. Juste : situation → commandes → résultat attendu.

```markdown
# RUNBOOK : prison-break-api

## Redémarrer le service en prod

\```bash
ssh user@prod-server
cd /opt/prison-break-api
pm2 restart prison-break-api
pm2 logs prison-break-api --lines 50  # vérifier que le démarrage est propre
\```

Résultat attendu : `[prison-break-api] online` dans les logs dans les 10 secondes.
Si le service reste en `errored` : voir section "Erreurs au démarrage" ci-dessous.

---

## Vider le cache Redis

Situation : les données de match affichées sont incorrectes / périmées.

\```bash
redis-cli -u $REDIS_URL FLUSHDB  # vide uniquement la DB utilisée par ce service
# NE PAS utiliser FLUSHALL : ça vide toutes les DB Redis du serveur
\```

Résultat attendu : les prochaines requêtes iront chercher les données directement en DB.
Temps de rechargement du cache : environ 30 secondes sous charge normale.

---

## Erreurs au démarrage

### `Error: connect ECONNREFUSED 127.0.0.1:5432`
La DB PostgreSQL n'est pas joignable.
\```bash
systemctl status postgresql
# si arrêtée :
systemctl start postgresql
\```

### `Error: JWT_SECRET is not defined`
Variable d'environnement manquante.
\```bash
cat /opt/prison-break-api/.env | grep JWT_SECRET
# si vide : récupérer la valeur depuis le vault secrets
\```
```

**Ce qui fait qu'un runbook est mauvais :**
- des commandes qui supposent un contexte (quel user ? quel serveur ? quel dossier ?)
- des sections "Troubleshooting" vides ou trop vagues
- une date de dernière mise à jour qui date de trois ans

---

## 5) POST-MORTEM : DOCUMENTER CE QUI A CASSÉ

Un post-mortem (bilan d'incident) n'est pas un rapport d'accusation. C'est un outil d'apprentissage collectif.

Structure standard :

```markdown
# POST-MORTEM : [titre de l'incident]

**Date :** 2026-04-14
**Durée :** 47 minutes (14h23 - 15h10)
**Sévérité :** critique (service totalement indisponible)
**Rédigé par :** [nom]

## Résumé
En une ou deux phrases : ce qui s'est passé, l'impact.

## Timeline
14h23 -- premier alert : taux d'erreur 5XX dépasse 80%
14h27 -- identification : l'instance Redis est à 100% de mémoire
14h31 -- tentative : restart Redis -- échec, mémoire rechargée immédiatement
14h45 -- décision : passer en mode no-cache temporairement
14h58 -- service rétabli, charge sur la DB augmentée de 400%
15h10 -- Redis re-configuré avec maxmemory-policy allkeys-lru

## Cause racine (root cause)
[La vraie raison, pas juste le symptôme]
La politique d'éviction Redis n'était pas configurée.
Résultat : Redis accumule des clés sans jamais en supprimer,
jusqu'à saturation mémoire.

## Ce qui a bien fonctionné
- l'alerting a détecté le problème en moins de 5 minutes
- la décision de passer en no-cache a été prise rapidement

## Ce qui peut être amélioré
- la configuration Redis n'était pas vérifiée dans le setup initial
- pas de runbook pour ce type d'incident

## Actions
| Action                    | Responsable | Deadline  |
|----------------------------------------------|-------------|------------|
| ajouter maxmemory-policy dans le setup Redis | [nom]    | 2026-04-21 |
| créer runbook "Redis saturation mémoire"   | [nom]    | 2026-04-28 |
| ajouter test d'éviction dans les smoke tests | [nom]    | 2026-05-05 |
```

**Ce qu'on n'écrit PAS dans un post-mortem :** les noms en mode blame. "Paul a oublié de configurer Redis" n'aide personne. "La configuration Redis n'était pas vérifiée dans le setup initial" identifie le problème sans détruire quelqu'un.

---

## EXERCICES

**EXO 1 : README qui marche le jour 1**

Le projet `07_ballon_dor_cli` a ce README actuel :

```markdown
# Ballon d'Or CLI

Un outil CLI pour gérer les votes du Ballon d'Or.

## Usage
npm start

## Note
Avoir Node installé. Et la DB. Voir la config.
```

Réécris ce README pour qu'un dev qui découvre le projet puisse le faire tourner en moins de 10 minutes, sans te poser de questions.

---

**EXO 2 : commenter le non-évident**

Ces trois bouts de code ont une logique non évidente. Écris le commentaire manquant pour chacun.

```javascript
// 1.
const scores = players.map(p => p.score).sort((a, b) => b - a).slice(0, 5);

// 2.
if (Date.now() - lastVoteTimestamp < 86400000) {
 throw new QuotaExceededError('daily limit reached');
}

// 3.
const safeScore = Number.isFinite(rawScore) ? rawScore : 0;
```

---

**EXO 3 : post-mortem sur l'incident Ultras**

L'incident suivant s'est produit lors de la finale de la Champions League :
Le `06_ultras_dashboard` a crashé 8 minutes après le coup d'envoi.
Cause : une requête N+1 (requête répétée pour chaque élément d'une liste en base de données) dans l'endpoint de possession par joueur, appelé toutes les 2 secondes par 12 000 clients.
Le service a été rétabli en remplaçant la requête N+1 par une seule requête avec JOIN.
Durée totale : 23 minutes.

Écris le post-mortem complet.

---

## RÉSUMÉ

Les quatre types de doc ont des objectifs différents : tutorial, how-to, référence, explication. Les mélanger produit une doc qui fait tout mal.
Un README répond à quatre questions dans l'ordre : quoi, comment démarrer, comment c'est organisé, où trouver le reste.
Un commentaire utile explique le pourquoi et le non-évident : pas ce qu'on voit déjà dans le code.
Un runbook contient les commandes exactes pour les situations courantes : pas des explications profondes.
Un post-mortem identifie les problèmes systémiques, sans blame individuel.
