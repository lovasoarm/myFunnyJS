---
stability: perissable_2027
---

# Suivre un Rasengan qui traverse 6 couches de chakra sans perdre le fil
Temps de lecture ~10 min

Un Rasengan tissé par Naruto passe par 6 couches de chakra internes : concentration, condensation, rotation, compression, projection, impact. Le jutsu met 3 secondes au lieu de 0.3 pour se former. Laquelle des 6 couches ralentit ? Le correlation ID (vu dans `26_observability/01_structured_logging`) te dit QUE ces flux de chakra appartiennent au même jutsu. Il ne te dit PAS où le temps a été perdu.

Le distributed tracing (traçage distribué) répond exactement à ça : il découpe une requête en segments mesurés (spans), organisés en arbre, pour voir précisément combien de temps chaque couche a pris, et dans quel ordre.

Pourquoi ça compte : sans ça, débugger une lenteur dans une architecture à plusieurs services, c'est deviner. Avec, c'est lire un graphique qui montre exactement où les millisecondes sont parties.

Avantage : visibilité précise sur la latence inter-services, détection rapide du goulot d'étranglement.
Inconvénient : overhead (coût supplémentaire) de performance et de stockage, configuration plus lourde qu'un simple log.

Où l'analogie casse : un Rasengan est une action locale d'un seul ninja, alors qu'une trace distribuée traverse des processus indépendants qui peuvent tourner sur des machines différentes, en parallèle, et échanger via le réseau. L'analogie tient pour visualiser l'arbre de spans ; elle ne rend pas compte des pannes réseau ni de la concurrence entre spans frères.

---

## 1) LE PRINCIPE : TRACE, SPAN, ET LE TEMPS QUI SE DÉCOUPE

```
TRACE = le voyage complet du chakra, de la concentration à l'impact

TRACE "jutsu-7f3a9b"
 |
 +-- SPAN "Concentration"      [0ms ------ 20ms]
    |
    +-- SPAN "Condensation"    [20ms --- 35ms]
    |
    +-- SPAN "Rotation"        [35ms -------- 175ms]  <-- LE COUPABLE
       |
       +-- SPAN "Sous-couche instable, boucle de correction" [40ms --- 170ms]
```

```js
// Un span minimal : un segment de temps, avec un nom et un parent
function startSpan(name, parentSpanId, traceId) {
 return {
  spanId: crypto.randomUUID(),
  parentSpanId,      // null si c'est le premier span de la trace
  traceId,        // même traceId pour tous les spans d'une requête
  name,          // ex: "rotation"
  startTime: Date.now()
 }
}

function endSpan(span) {
 span.duration = Date.now() - span.startTime // combien de temps cette couche a pris
 sendToTracingBackend(span) // envoyé à l'outil qui reconstruit l'arbre (Jaeger, Datadog APM)
}
```

Le pourquoi : chaque span (segment) sait combien de temps il a pris ET quel est son parent. En reconstruisant l'arbre depuis tous les spans d'un même `traceId`, l'outil de tracing affiche un graphique en cascade (waterfall) qui montre visuellement où le temps a disparu, exactement comme l'analyse de propagation d'un signal à travers un réseau, appliquée au temps plutôt qu'au trajet.

---

## 2) PROPAGATION DU CONTEXTE : LE TRACEID DOIT VOYAGER ENTRE LES COUCHES

```
La couche Concentration délègue à la couche Condensation :
La couche appelante pose des infos de suivi dans le paquet sortant
  |
  v
La couche appelée les lit en entrée, et continue la MÊME trace, pas une nouvelle
```

```js
// Couche appelante : propage le contexte de trace dans les headers HTTP
async function callNextLayer(traceId, parentSpanId) {
 return fetch('http://condensation/receive', {
  headers: {
   'traceparent': `00-${traceId}-${parentSpanId}-01` // format standard W3C Trace Context
  }
 })
}

// Couche appelée : lit le header, continue la trace au lieu d'en créer une nouvelle
app.use((req, res, next) => {
 const incoming = req.headers['traceparent']
 req.traceId = incoming ? parseTraceId(incoming) : crypto.randomUUID()
 // si un traceparent existe déjà, on le respecte : on est un sous-span, pas une nouvelle trace
 next()
})
```

Le risque réel : si une seule couche de la chaîne oublie de propager le header de trace (souvent un intermédiaire ajouté en vitesse, sans respecter les conventions de l'équipe), la trace se "casse" à cet endroit précis. Tout ce qui se passe après cette couche devient une trace orpheline, déconnectée du reste, et tu perds la visibilité juste là où tu en avais le plus besoin.

```
Propagation cassée :
Concentration --[traceId OK]--> Condensation --[traceId OK]--> Rotation --[OUBLI]--> Impact
                                                                   |
                                                            nouvelle trace, déconnectée
                                                            impossible de relier Impact
                                                            au reste du parcours
```

---

## 3) SAMPLING : TRACER CHAQUE JUTSU COÛTE CHER, TRACER RIEN NE SERT À RIEN

```
SAMPLING À 100%
 --> chaque requête est tracée en détail
 --> overhead de performance et coût de stockage énorme à grande échelle

SAMPLING À 1%
 --> 1 requête sur 100 est tracée, les 99 autres passent sans overhead
 --> léger, mais tu peux manquer la trace EXACTE de l'incident qui t'intéresse

SAMPLING ADAPTATIF (le plus utilisé en prod)
 --> trace systématiquement les requêtes en erreur ou anormalement lentes
 --> trace un petit pourcentage des requêtes normales pour avoir une vue d'ensemble
```

```js
function shouldSample(req) {
 if (req.hasError) return true    // toujours tracer un incident
 if (req.duration > 60 * 1000) return true // toujours tracer une lenteur suspecte
 return Math.random() < 0.01       // sinon, 1% du trafic normal
}
```

Le pourquoi : tracer 100% des requêtes d'un service qui en traite des millions par jour génère une quantité de données ingérable et coûteuse pour un bénéfice marginal, puisque la plupart sont identiques et dans les temps. Le sampling adaptatif garde l'essentiel (les cas anormaux, là où tu as VRAIMENT besoin de creuser) sans payer le prix du tout-tracer.

---

## 4) LIRE UN WATERFALL : LE GRAPHIQUE QUI RACONTE L'HISTOIRE

```
TRACE jutsu-7f3a9b : durée totale : 195ms

Concentration [====]                                20ms
Condensation       [==]                             15ms
Rotation              [================================]    140ms
 Sous-couche instable    [==========================]        130ms
  Boucle de correction    [========================]         120ms
```

Le pourquoi cette lecture est immédiate : le span "Boucle de correction" prend 120ms sur un total de 195ms. Le problème n'est ni la Concentration, ni la Condensation, ni même la Rotation elle-même dans son ensemble : c'est une boucle de correction interne qui traîne. Sans le waterfall, l'équipe aurait probablement commencé par optimiser la Concentration, qui n'est pourtant pas le vrai coupable.

---

## 5) CE QUI CASSE (MAIS FUN) : LA TRACE QUI MENT PAR OMISSION

```js
// exemple minimal : 3 couches, propagation correcte, trace complète et lisible

// exemple réaliste : une 4e couche est ajoutée à la chaîne, mise en place en vitesse
// par quelqu'un qui ne connaît pas encore les conventions de suivi de l'équipe

// exemple qui casse : cette nouvelle couche ne lit ni ne propage le header
// 'traceparent'. Chaque requête qui passe par elle génère une trace neuve et isolée
// Résultat : dans l'outil de tracing, le parcours de la requête s'arrête
// "magiquement" à cette couche, comme s'il ne se passait plus rien après,
// alors que le flux continue bel et bien son chemin ailleurs
```

La correction : faire de la propagation du contexte de trace une responsabilité du framework HTTP partagé (middleware commun), pas une chose que chaque dev doit se souvenir d'ajouter manuellement à chaque nouveau service. Une checklist d'intégration d'un nouveau service doit inclure "propage le traceId" au même titre que "expose un endpoint /health" (vu dans `25_scalability/01_load_balancing` section 5).

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, chaque outil de tracing (Zipkin, Jaeger, propriétaire) avait son propre format de propagation, ce qui rendait la connexion entre outils différents pénible, surtout en environnement multi-cloud ou multi-fournisseur. Maintenant, le standard W3C Trace Context (le header `traceparent` utilisé plus haut) unifie le format, et OpenTelemetry s'est imposé comme la librairie d'instrumentation commune, peu importe le backend de visualisation choisi derrière. Le switch existe pour éviter le vendor lock-in (dépendance à un seul fournisseur) : tu instrumentes une fois avec OpenTelemetry, et tu peux changer de backend de tracing sans toucher au code applicatif.

---

## EXERCICES

**EXO 1 : Lis le waterfall**
On te donne une trace où Concentration prend 15ms, Condensation prend 10ms, Rotation prend 160ms, et un sous-span "buffer de stabilisation sans limite" à l'intérieur de Rotation prend 150ms. Identifie le vrai coupable et explique pourquoi optimiser la Concentration ne servirait à rien ici. (10 minutes)

**EXO 2 : Calibre ton sampling**
Un service traite 2000 requêtes par seconde, 99% répondent sous 100ms. Propose une stratégie de sampling concrète (quoi tracer à 100%, quoi tracer en partiel) et justifie le compromis coût/visibilité. (15 minutes)

**EXO 3 : Trouve la couche qui casse la chaîne**
Une trace s'arrête net après la couche "gateway auth" dans l'outil de tracing, alors que tu sais que la requête continue derrière (elle atteint bien le service final). Liste les 2 causes techniques les plus probables et comment les vérifier. (15 minutes)

---

## RÉSUMÉ

Le distributed tracing découpe une requête en spans organisés en arbre, pour voir précisément où le temps disparaît à travers plusieurs services, là où le simple correlation ID ne fait que relier des logs sans montrer la durée de chaque étape. La propagation du `traceId` doit voyager dans les headers HTTP entre chaque service, sinon la trace se casse et devient orpheline. Le sampling adaptatif (tout tracer sur les incidents et lenteurs, un échantillon sur le reste) évite de payer le coût d'un traçage à 100% sans perdre les cas qui comptent vraiment.
