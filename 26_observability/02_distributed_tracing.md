# Suivre une commande qui traverse 6 maillons sans perdre le fil

Une commande de Walter White passe par le labo, le grossiste, deux distributeurs intermédiaires, et le point de livraison final. Le tout prend 3 heures au lieu de 30 minutes. Lequel des 5 maillons est lent ? Le correlation ID (vu dans `26_observability/01_structured_logging`) te dit QUE ces logs appartiennent à la même commande. Il ne te dit PAS où le temps a été perdu.

Le distributed tracing (traçage distribué) répond exactement à ça : il découpe une requête en segments mesurés (spans), organisés en arbre, pour voir précisément combien de temps chaque maillon a pris, et dans quel ordre.

Pourquoi ça compte : sans ça, débugger une lenteur dans une architecture à plusieurs services, c'est deviner. Avec, c'est lire un graphique qui montre exactement où les minutes sont parties.

Avantage : visibilité précise sur la latence inter-services, détection rapide du goulot d'étranglement.
Inconvénient : overhead (coût supplémentaire) de performance et de stockage, configuration plus lourde qu'un simple log.

---

## 1) LE PRINCIPE : TRACE, SPAN, ET LE TEMPS QUI SE DÉCOUPE

```
TRACE = le voyage complet d'une commande, du labo à la livraison

TRACE "cmd-7f3a9b"
  |
  +-- SPAN "Labo (production)"        [0min ------ 20min]
        |
        +-- SPAN "Grossiste"               [20min --- 35min]
        |
        +-- SPAN "Distributeur"            [35min -------- 175min]   <-- LE COUPABLE
              |
              +-- SPAN "Route compromise, détour"  [40min --- 170min]
```

```js
// Un span minimal : un segment de temps, avec un nom et un parent
function startSpan(name, parentSpanId, traceId) {
  return {
    spanId: crypto.randomUUID(),
    parentSpanId,           // null si c'est le premier span de la trace
    traceId,                // même traceId pour tous les spans d'une requête
    name,                   // ex: "distributeur"
    startTime: Date.now()
  }
}

function endSpan(span) {
  span.duration = Date.now() - span.startTime // combien de temps ce maillon a pris
  sendToTracingBackend(span) // envoyé à l'outil qui reconstruit l'arbre (Jaeger, Datadog APM)
}
```

Le pourquoi : chaque span (segment) sait combien de temps il a pris ET quel est son parent. En reconstruisant l'arbre depuis tous les spans d'un même `traceId`, l'outil de tracing affiche un graphique en cascade (waterfall) qui montre visuellement où le temps a disparu, exactement comme l'analyse de réseau de distribution vue dans `04_breaking_cache` mais appliquée au temps plutôt qu'au risque.

---

## 2) PROPAGATION DU CONTEXTE : LE TRACEID DOIT VOYAGER ENTRE LES MAILLONS

```
Le Labo passe la commande au Grossiste :
Le Labo pose des infos de suivi dans le colis sortant
    |
    v
Le Grossiste les lit en entrée, et continue la MÊME trace, pas une nouvelle
```

```js
// Labo (appelant) : propage le contexte de trace dans les headers HTTP
async function passToGrossiste(traceId, parentSpanId) {
  return fetch('http://grossiste/receive', {
    headers: {
      'traceparent': `00-${traceId}-${parentSpanId}-01` // format standard W3C Trace Context
    }
  })
}

// Grossiste (appelé) : lit le header, continue la trace au lieu d'en créer une nouvelle
app.use((req, res, next) => {
  const incoming = req.headers['traceparent']
  req.traceId = incoming ? parseTraceId(incoming) : crypto.randomUUID()
  // si un traceparent existe déjà, on le respecte : on est un sous-span, pas une nouvelle trace
  next()
})
```

Le risque réel : si un seul maillon de la chaîne oublie de propager le header de trace (souvent un intermédiaire ajouté en vitesse, sans respecter les conventions de l'équipe), la trace se "casse" à cet endroit précis. Tout ce qui se passe après ce maillon devient une trace orpheline, déconnectée du reste, et tu perds la visibilité juste là où tu en avais le plus besoin.

```
Propagation cassée :
Labo --[traceId OK]--> Grossiste --[traceId OK]--> Distributeur --[OUBLI]--> Livraison
                                                                       |
                                                          nouvelle trace, déconnectée
                                                          impossible de relier Livraison
                                                          au reste du parcours
```

---

## 3) SAMPLING : TRACER TOUTE LA SUPPLY CHAIN COÛTE CHER, TRACER RIEN NE SERT À RIEN

```
SAMPLING À 100%
  --> chaque commande est tracée en détail
  --> overhead de performance et coût de stockage énorme à grande échelle

SAMPLING À 1%
  --> 1 commande sur 100 est tracée, les 99 autres passent sans overhead
  --> léger, mais tu peux manquer la trace EXACTE de l'incident qui t'intéresse

SAMPLING ADAPTATIF (le plus utilisé en prod)
  --> trace systématiquement les commandes en retard ou suspectes
  --> trace un petit pourcentage des commandes normales pour avoir une vue d'ensemble
```

```js
function shouldSample(order) {
  if (order.hasError) return true        // toujours tracer un incident
  if (order.duration > 60 * 60 * 1000) return true  // toujours tracer un retard suspect
  return Math.random() < 0.01             // sinon, 1% des commandes normales
}
```

Le pourquoi : tracer 100% des commandes d'une opération qui en traite des milliers par jour génère une quantité de données ingérable et coûteuse pour un bénéfice marginal, puisque la plupart sont identiques et dans les temps. Le sampling adaptatif garde l'essentiel (les cas anormaux, là où tu as VRAIMENT besoin de creuser) sans payer le prix du tout-tracer.

---

## 4) LIRE UN WATERFALL : LE GRAPHIQUE QUI RACONTE L'HISTOIRE

```
TRACE cmd-7f3a9b : durée totale : 195min

Labo              [====]                                              20min
Grossiste              [==]                                           15min
Distributeur               [================================]        140min
  Route compromise           [==========================]              130min
    Détour DEA évité            [========================]               120min
```

Le pourquoi cette lecture est immédiate : le span "Détour DEA évité" prend 120min sur un total de 195min. Le problème n'est ni le Labo, ni le Grossiste, ni même le Distributeur lui-même : c'est un détour de sécurité forcé qui traîne. Sans le waterfall, l'équipe aurait probablement commencé par optimiser la production au Labo, qui n'est pourtant pas le vrai coupable.

---

## 5) CE QUI CASSE (MAIS FUN) : LA TRACE QUI MENT PAR OMISSION

```js
// exemple minimal : 3 maillons, propagation correcte, trace complète et lisible

// exemple réaliste : un 4e maillon est ajouté à la chaîne, mis en place en vitesse
// par quelqu'un qui ne connaît pas encore les conventions de suivi de l'équipe

// exemple qui casse : ce nouveau maillon ne lit ni ne propage le header
// 'traceparent'. Chaque commande qui passe par lui génère une trace neuve et isolée
// Résultat : dans l'outil de tracing, le parcours de la commande s'arrête
// "magiquement" à ce maillon, comme s'il ne se passait plus rien après,
// alors que la commande continue bel et bien son chemin ailleurs
```

La correction : faire de la propagation du contexte de trace une responsabilité du framework HTTP partagé (middleware commun), pas une chose que chaque dev doit se souvenir d'ajouter manuellement à chaque nouveau maillon. Une checklist d'intégration d'un nouveau service doit inclure "propage le traceId" au même titre que "expose un endpoint /health" (vu dans `01_load_balancing` section 5).

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, chaque outil de tracing (Zipkin, Jaeger, propriétaire) avait son propre format de propagation, ce qui rendait la connexion entre outils différents pénible, surtout en environnement multi-cloud ou multi-fournisseur. Maintenant, le standard W3C Trace Context (le header `traceparent` utilisé plus haut) unifie le format, et OpenTelemetry s'est imposé comme la librairie d'instrumentation commune, peu importe le backend de visualisation choisi derrière. Le switch existe pour éviter le vendor lock-in (dépendance à un seul fournisseur) : tu instrumentes une fois avec OpenTelemetry, et tu peux changer de backend de tracing sans toucher au code applicatif.

---

## EXERCICES

**EXO 1 : Lis le waterfall**
On te donne une trace où Labo prend 15min, Grossiste prend 10min, Distributeur prend 160min, et un sous-span "stockage temporaire sans contrôle" à l'intérieur du Distributeur prend 150min. Identifie le vrai coupable et explique pourquoi optimiser le Labo ne servirait à rien ici. (10 minutes)

**EXO 2 : Calibre ton sampling**
Une opération traite 2000 commandes par jour, 99% livrées dans les temps. Propose une stratégie de sampling concrète (quoi tracer à 100%, quoi tracer en partiel) et justifie le compromis coût/visibilité. (15 minutes)

**EXO 3 : Trouve le maillon qui casse la chaîne**
Une trace s'arrête net après le maillon "Distributeur secondaire" dans l'outil de tracing, alors que tu sais que la commande continue derrière (elle arrive bien à destination). Liste les 2 causes techniques les plus probables et comment les vérifier. (15 minutes)

---

## RÉSUMÉ

Le distributed tracing découpe une requête en spans organisés en arbre, pour voir précisément où le temps disparaît à travers plusieurs services, là où le simple correlation ID ne fait que relier des logs sans montrer la durée de chaque étape. La propagation du `traceId` doit voyager dans les headers HTTP entre chaque service, sinon la trace se casse et devient orpheline. Le sampling adaptatif (tout tracer sur les incidents et retards, un échantillon sur le reste) évite de payer le coût d'un traçage à 100% sans perdre les cas qui comptent vraiment.
