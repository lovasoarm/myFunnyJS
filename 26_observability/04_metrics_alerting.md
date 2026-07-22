---
stability: perissable_2027
---

# Les chiffres qui te préviennent avant que tout brûle
Temps de lecture ~10 min

Les logs te disent ce qui s'est passé sur UNE action précise. Le tracing te dit OÙ le temps a été perdu sur UNE action précise. Mais aucun des deux ne répond bien à "est-ce que mon équipe va globalement bien MAINTENANT, et est-ce que ça empire ?". C'est le rôle des métriques (counter, gauge, histogram) et de l'alerting (déclenchement automatique d'alarme) qui surveille ces métriques en continu, exactement comme un staff technique qui suit des stats en direct pendant un match plutôt que d'attendre le résumé du soir.

Pourquoi ça compte : sans métriques, tu découvres un problème quand un utilisateur se plaint. Avec, ton système te dit "le taux d'erreur vient de passer de 0,1% à 8%" avant que qui que ce soit n'ait eu le temps d'écrire un ticket de support.

Avantage : détection proactive, vision d'ensemble (pas requête par requête), coût de stockage faible comparé aux logs.
Inconvénient : agrège, donc perd le détail individuel (pour ça, retour aux logs ou au tracing).

---

## 1) LES TROIS TYPES DE MÉTRIQUES : CHACUN POUR UN USAGE PRÉCIS

```
COUNTER (compteur)
 --> une valeur qui ne fait QUE monter, jamais redescendre
 --> exemple : nombre total de buts marqués sur une carrière

GAUGE (jauge)
 --> une valeur qui monte ET descend librement, l'état actuel
 --> exemple : nombre de joueurs encore sur le terrain en ce moment

HISTOGRAM (histogramme)
 --> distribue les valeurs observées dans des compartiments (buckets),
   pour calculer des percentiles plutôt qu'une seule moyenne
 --> exemple : la distance parcourue par chaque joueur à chaque match de la saison
```

```js
// Counter : ne décroît jamais, sert à compter des occurrences cumulées
let totalGoals = 0
function onGoalScored() {
 totalGoals++ // incrémenté à chaque but, jamais remis à zéro manuellement
}

// Gauge : photo de l'état présent, peut monter ou descendre
let playersOnField = 11
function onRedCard() { playersOnField-- } // peut redescendre, contrairement au counter
function onSubstitution() { /* le nombre reste stable, mais peut varier en cas de blessure */ }

// Histogram : on enregistre chaque distance parcourue, l'outil calcule les percentiles derrière
function onMatchEnd(distanceKm) {
 matchDistanceHistogram.observe(distanceKm) // un point ajouté à la distribution
}
```

Le pourquoi confondre les trois est un piège classique : utiliser un counter pour "joueurs sur le terrain" donnerait un nombre qui ne fait que grossir, totalement faux dès qu'un carton rouge tombe. Utiliser une gauge pour "buts marqués sur la carrière" perdrait l'historique cumulé à chaque nouvelle saison. Le bon type dépend de la NATURE de ce que tu mesures, pas d'une préférence arbitraire.

---

## 2) PERCENTILES : POURQUOI LA MOYENNE TE MENT

```
10 matchs, temps de possession en % : 52, 55, 48, 51, 49, 50, 53, 47, 50, 5

MOYENNE : (52+55+48+51+49+50+53+47+50+5) / 10 = 46%
 --> donne l'impression que l'équipe domine moins qu'elle ne le fait vraiment

P50 (médiane) : 50%    --> la moitié des matchs sont équilibrés ou dominés
P99 (le pire match) : 5%  --> 1 match sur les 10 a été un naufrage total de possession
```

Le pourquoi le P99 compte plus que la moyenne : la moyenne est écrasée par les valeurs normales et cache les cas extrêmes. Le P99 te dit "voici la pire expérience vécue", et sur une saison de 38 matchs, ce 1% peut représenter exactement le match qui a fait perdre le titre, pendant que le bilan moyen restait flatteur.

```
Dashboard qui ment :
"Possession moyenne sur la saison : 54%" --> tout semble parfait

Dashboard honnête :
P50 : 55%  --> la majorité des matchs sont dominés
P95 : 35%  --> déjà plus tendu, à surveiller
P99 : 5%  --> 1% des matchs ont été un calvaire, et la moyenne ne le montrait pas
```

---

## 3) LES MÉTRIQUES QUI COMPTENT VRAIMENT : LES GOLDEN SIGNALS

```
LATENCY (latence)   --> combien de temps prennent les requêtes
TRAFFIC (trafic)    --> combien de requêtes le système reçoit
ERRORS (erreurs)    --> quel pourcentage de requêtes échoue
SATURATION       --> à quel point les ressources (CPU, RAM, queue) sont pleines
```

```js
// Exemple de métriques exposées pour un endpoint, format Prometheus typique
httpRequestsTotal.inc({ method: 'POST', route: '/orders', status: 500 }) // traffic + errors
httpRequestDuration.observe({ route: '/orders' }, durationMs)      // latency
cpuUsageGauge.set(currentCpuPercent)                   // saturation
```

Le pourquoi ces 4 signaux suffisent dans la majorité des cas : c'est l'équivalent des 4 jauges qu'un coach regarde en priorité pendant un match, la forme physique de l'équipe, le nombre d'occasions générées, le pourcentage d'échecs sur les transmissions, et la fatigue accumulée. Un dashboard qui n'a que ces 4 métriques, bien faites, vaut mieux que 50 métriques exotiques que personne ne regarde jamais.

---

## 4) ALERTING : QUAND LE SEUIL DOIT RÉVEILLER QUELQU'UN

```
MÉTRIQUE dépasse un SEUIL pendant une DURÉE
  |
  v
ALERTE déclenchée
  |
  v
notification (Slack, PagerDuty, SMS selon la gravité)
```

```js
// Règle d'alerte typique (pseudo-config, format proche de Prometheus Alertmanager)
const alertRule = {
 metric: 'error_rate',
 threshold: 0.05,    // 5% d'erreurs
 duration: '5m',     // pendant au moins 5 minutes, pas un pic d'1 seconde
 severity: 'critical',
 notify: ['#alerts-prod', 'pagerduty-oncall']
}
```

Le risque réel, l'alert fatigue (fatigue d'alerte) : si chaque petit pic déclenche une alerte qui réveille quelqu'un à 3h du matin, l'équipe finit par ignorer les alertes, ou les désactiver carrément, exactement comme un arbitre qui sifflerait pour chaque contact léger finit par perdre toute autorité quand vient la vraie faute. La durée minimale ("pendant au moins 5 minutes") existe précisément pour filtrer le bruit d'un pic ponctuel et ne garder que les dégradations qui durent.

```
Mauvaise alerte : déclenche sur 1 seconde de pic --> 20 alertes par nuit, ignorées
Bonne alerte : déclenche seulement si le seuil tient sur 5 minutes --> signal fiable
```

---

## 5) CE QUI CASSE (MAIS FUN) : LE DASHBOARD VERT PENDANT QUE TOUT BRÛLE

```js
// exemple minimal : un club, une métrique de possession moyenne, tout va bien

// exemple réaliste : l'équipe ajoute une stratégie défensive ultra reculée
// pendant 5% des matchs (face aux plus gros adversaires)

// exemple qui casse : la possession moyenne reste stable autour de 50%,
// parce que 95% des matchs restent dominés et écrasent la moyenne,
// alors que les 5% de matchs face aux gros (les vrais tests) tombent
// systématiquement à 10% de possession. Le dashboard de moyenne reste VERT
// en permanence. Les supporters qui vivent ces 5% de matchs, eux, vivent
// un calvaire chaque fois, et personne dans le staff ne s'en rend compte
// avant l'élimination en finale
```

La correction : surveiller systématiquement les percentiles hauts (P95, P99) en plus de la moyenne, et si possible séparer les métriques par contexte (match contre un gros vs un petit) plutôt que de tout agréger dans un seul chiffre global qui cache les cas extrêmes.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, le monitoring se résumait souvent à des checks basiques ("le serveur répond-il oui/non") et des moyennes simples calculées à la main sur des logs. Maintenant, des systèmes dédiés (Prometheus pour la collecte, Grafana pour la visualisation, ou des plateformes intégrées comme Datadog) calculent nativement les percentiles, gèrent l'agrégation à grande échelle, et déclenchent l'alerting automatiquement. Le switch existe parce que calculer un P99 fiable à la main sur des millions de points de données n'est juste pas réaliste, pas parce qu'un simple check de disponibilité serait devenu inutile : il reste la base, le strict minimum avant d'aller plus loin.

---

## EXERCICES

**EXO 1 : Choisis le bon type**
Pour chacune de ces mesures, choisis counter, gauge ou histogram et justifie : (a) nombre de buts marqués par un attaquant depuis ses débuts pro, (b) nombre de joueurs actuellement sur le terrain (titulaires + remplaçants entrés), (c) distance parcourue par chaque joueur à chaque match de la saison. (10 minutes)

**EXO 2 : Démasque la moyenne menteuse**
On te donne 20 matchs où 18 ont une possession autour de 55% et 2 tombent à 8%. Calcule la moyenne, puis explique en une phrase pourquoi cette moyenne donnerait une fausse impression de domination à quelqu'un qui ne regarde que ce chiffre. (10 minutes)

**EXO 3 : Calibre une alerte sans fatigue**
Propose une règle d'alerte complète (métrique, seuil, durée, sévérité) pour le taux d'erreur d'une API de tribut d'un club qui vend des billets en ligne, en justifiant pourquoi ce seuil et cette durée évitent à la fois de rater un vrai incident et de réveiller l'équipe pour rien. (15 minutes)

---

## RÉSUMÉ

Un counter ne fait que monter, une gauge monte et descend, un histogram capture une distribution complète pour calculer des percentiles. La moyenne cache les cas extrêmes : le P99 révèle ce que vit le pire 1% des cas, et c'est souvent là que se cache le vrai problème. Les golden signals (latency, traffic, errors, saturation) couvrent l'essentiel d'un système en bonne santé, et une alerte bien calibrée (seuil + durée minimale) protège l'équipe de l'alert fatigue sans jamais laisser passer une vraie dégradation.
