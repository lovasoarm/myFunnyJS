---
stability: perissable_2027
---

# Capturer l'erreur avant qu'un shinobi te l'envoie par email
Temps de lecture ~9 min

Une erreur explose en prod. Sans outil dédié, tu apprends son existence trois jours plus tard, via un email frustré d'un shinobi qui dit juste "ça marche pas". Tu n'as ni la stack trace (la pile d'appels qui montre exactement où le code a cassé), ni le contexte, ni combien de personnes sont touchées.

Sentry (et les outils similaires) capture chaque exception au moment où elle arrive, avec tout le contexte autour : qui était connecté, quelle action il faisait, quelle version du code tournait.

Pourquoi ça compte : la différence entre "un shinobi s'est plaint, je dois reproduire le bug à l'aveugle" et "j'ai la stack trace exacte, le contexte exact, et je vois que 340 autres users ont eu la même erreur dans les 10 dernières minutes".

Avantage : capture automatique, contexte riche, regroupement intelligent des erreurs similaires.
Inconvénient : mal configuré, bruit constant ou coût qui explose sur un volume élevé d'erreurs.

---

## 1) LE PRINCIPE : CAPTURER, PAS SEULEMENT LOGGUER

```
ERREUR survient dans le code
  |
  v
Sentry intercepte AVANT que le process crashe (ou juste après)
  |
  v
Envoie : stack trace + contexte (user, requête, version) + regroupement
  |
  v
Dashboard : liste d'erreurs uniques, triées par fréquence et gravité
```

```js
// Initialisation basique, capture automatique des exceptions non attrapées
const Sentry = require('@sentry/node')

Sentry.init({
 dsn: process.env.SENTRY_DSN, // l'adresse unique de ton projet Sentry
 environment: process.env.NODE_ENV, // pour distinguer prod, staging, dev
 tracesSampleRate: 0.1 // sampling, vu dans `26_observability/02_distributed_tracing`
})

// Capture manuelle d'une erreur attrapée volontairement (vu dans `05_error_handling`)
try {
 await chargeChakra(amount)
} catch (err) {
 Sentry.captureException(err) // envoyé à Sentry avec toute la stack trace
 throw err // propage quand même l'erreur, Sentry ne remplace pas ta gestion d'erreur
}
```

Le pourquoi : Sentry ne remplace ni try/catch ni tes custom errors (vus dans `05_error_handling/02_custom_errors`), il les complète. Ton code continue de décider comment réagir à l'erreur (retry, fallback, fail-fast), Sentry capture en parallèle ce qui s'est passé pour que l'équipe puisse l'analyser après coup, sans avoir eu besoin de reproduire le bug à la main.

---

## 2) CONTEXTE : UNE STACK TRACE SEULE NE RACONTE PAS L'HISTOIRE

```
Stack trace seule :
TypeError: Cannot read properties of undefined (reading 'id')
 at executeJutsu (jutsu.js:42)
--> tu sais OÙ ça casse, pas POURQUOI ni POUR QUI
```

```js
// Enrichir le contexte avant que l'erreur n'arrive, pour que la capture soit utile
Sentry.setUser({ id: req.user.id, email: req.user.email })
Sentry.setContext('jutsu', { jutsuId: req.params.jutsuId, chakra: req.body.chakra })
Sentry.setTag('feature', 'rasengan') // pour filtrer plus tard par fonctionnalité

// Si une exception arrive maintenant, TOUT ce contexte est attaché automatiquement
await executeJutsu(req.params.jutsuId)
```

Le pourquoi c'est puissant : la même `TypeError` capturée avec contexte devient "cette erreur arrive systématiquement pour les jutsus sans `chakraSource`, sur la fonctionnalité rasengan, depuis le déploiement de 14h32". Sans contexte, c'est juste une ligne de stack trace anonyme parmi des centaines d'autres.

---

## 3) REGROUPEMENT (FINGERPRINTING) : 1000 OCCURRENCES, 1 SEULE ERREUR À TRAITER

```
1000 users frappent le même bug --> 1000 exceptions envoyées à Sentry
  |
  v
Sentry regroupe par "fingerprint" (empreinte) : même type d'erreur,
même endroit dans le code --> affiché comme UNE SEULE entrée
avec un compteur "vu 1000 fois, touche 1000 users uniques"
```

Le pourquoi : sans regroupement, un dashboard d'erreurs en prod à fort trafic serait une liste infinie et inutilisable de milliers de lignes identiques. Avec regroupement, l'équipe voit "voici les 10 erreurs uniques qui ont le plus d'impact" et peut prioriser, plutôt que de scroller sans fin.

```js
// Parfois le regroupement automatique se trompe (deux erreurs différentes
// groupées ensemble, ou l'inverse), tu peux forcer une empreinte précise
Sentry.captureException(err, {
 fingerprint: ['chakra-timeout', req.route.path]
 // force ce type d'erreur à être groupé par route, pas juste par message d'erreur
})
```

Le risque réel à l'inverse : si ton code génère des messages d'erreur dynamiques (genre incluant un ID unique à chaque fois, `Jutsu 48291 not found`, `Jutsu 48292 not found`...), Sentry par défaut peut créer une entrée DIFFÉRENTE pour chaque ID, alors que c'est en réalité LE MÊME bug. Il faut alors structurer le message d'erreur pour que le fingerprinting fonctionne (vu aussi dans `05_error_handling/02_custom_errors` pour des erreurs nommées plutôt que des messages improvisés).

---

## 4) PRIORISER : SEVERITY ET IMPACT, PAS JUSTE L'ORDRE D'ARRIVÉE

```
Erreur A : crash total du rasengan-service, 5000 shinobis touchés en 1 heure
Erreur B : un warning cosmétique sur une page peu visitée, 3 shinobis touchés

Sans priorisation : les deux apparaissent pêle-mêle dans la même liste
Avec priorisation : Erreur A en haut, marquée "critical", assignée immédiatement
```

```js
Sentry.captureException(err, {
 level: 'fatal', // 'fatal', 'error', 'warning', 'info' : même logique que les niveaux de log
 tags: { impact: 'rasengan-blocked' }
})
```

Le pourquoi : Sentry calcule aussi un score d'impact basé sur la fréquence et le nombre d'users uniques touchés, pas juste l'ordre chronologique. Une erreur rare mais qui bloque totalement un parcours de tribut doit remonter avant un warning fréquent mais sans conséquence réelle.

---

## 5) CE QUI CASSE (MAIS FUN) : LE BRUIT QUI NOIE LE SIGNAL

```js
// exemple minimal : capture propre, peu d'erreurs, équipe réactive

// exemple réaliste : une dépendance tierce (librairie externe) commence
// à lancer un warning bénin à chaque appel, des milliers de fois par jour

// exemple qui casse : ce warning bénin est capturé comme une exception
// classique, noie le dashboard Sentry sous des dizaines de milliers
// d'entrées sans intérêt, et la VRAIE erreur critique du jour (un bug
// de tribut) se retrouve mélangée dans le bruit, repérée 6 heures
// trop tard
```

La correction : filtrer activement ce qui mérite d'être capturé (`beforeSend` dans Sentry permet d'ignorer certains types d'erreurs connues et sans impact), et traiter le volume de bruit comme un problème à corriger à la source plutôt que comme une fatalité à subir dans le dashboard.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, le suivi d'erreur en prod se résumait souvent à des emails d'alerte basiques envoyés à toute l'équipe à chaque exception, sans regroupement ni contexte, ce qui noyait vite tout le monde. Maintenant, des plateformes dédiées (Sentry, Rollbar, Bugsnag) regroupent intelligemment, attachent le contexte automatiquement (release, user, breadcrumbs : le fil des actions avant le crash), et s'intègrent avec l'alerting (vu dans `26_observability/03_metrics_alerting`). Le switch existe parce qu'un email par exception ne scale juste pas passé quelques shinobis, pas par mode.

---

## EXERCICES

**EXO 1 : Enrichis le contexte**
Pour une erreur qui survient pendant l'exécution d'un jutsu (vu aussi dans `21_api_craft/02_rest_crud_complete`), liste les 5 informations de contexte les plus utiles à attacher avant la capture, et explique pour chacune ce qu'elle permettrait de diagnostiquer plus vite. (15 minutes)

**EXO 2 : Corrige le fingerprinting**
Une erreur "Jutsu 48291 not found", "Jutsu 48292 not found" apparaît comme des centaines d'entrées différentes dans Sentry, alors que c'est le même bug. Propose la correction technique exacte pour qu'elles soient regroupées en une seule entrée. (10 minutes)

**EXO 3 : Filtre le bruit**
Une librairie tierce génère un warning bénin 10 000 fois par jour, noyant le dashboard. Décris la stratégie (et la fonction Sentry concernée) pour l'empêcher de polluer le signal, sans perdre la capacité de capturer une vraie erreur critique. (10 minutes)

---

## RÉSUMÉ

Sentry capture l'exception avec sa stack trace et tout le contexte qui l'entoure (user, requête, version), là où un simple log ne donnerait qu'une ligne anonyme. Le fingerprinting regroupe les occurrences identiques d'une même erreur pour garder un dashboard lisible, mais ça suppose des messages d'erreur structurés plutôt qu'improvisés. La priorisation par sévérité et impact réel (pas par ordre d'arrivée) permet de traiter en premier ce qui bloque vraiment des shinobis, et filtrer le bruit connu est aussi important que capturer le signal utile.
