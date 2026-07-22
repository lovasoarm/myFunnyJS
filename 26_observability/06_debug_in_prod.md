---
stability: perissable_2027
---

# Quand tu ne peux pas juste mettre un breakpoint
Temps de lecture ~9 min

Un bug arrive en prod, mais seulement pour 0,3% des shinobis, seulement le vendredi soir, seulement sur mobile. Tu ne peux pas le reproduire en local : ton environnement ne ressemble pas exactement à la prod, et tu ne peux clairement pas brancher un debugger sur un serveur qui sert des vrais shinobis en direct.

Debugger en prod, c'est une discipline différente du debugging local : tu ne mets jamais de breakpoint qui bloque le process, tu utilises des outils qui observent SANS interrompre, et tu prépares le terrain AVANT que le bug arrive, pas après.

Pourquoi ça compte : la majorité des bugs sérieux qui comptent vraiment ne se reproduisent jamais proprement en local. Si ta seule stratégie de debug est "je reproduis sur ma machine", tu es bloqué sur les bugs les plus importants.

Avantage : diagnostic possible sans interrompre le service, réduction du temps moyen de résolution (MTTR : mean time to resolution).
Inconvénient : demande une préparation en amont (logs, feature flags) qu'on ne peut pas improviser le jour J.

---

## 1) LE PRINCIPE : OBSERVER SANS BLOQUER, ET PRÉPARER AVANT LA CRISE

```
DEBUG LOCAL             DEBUG EN PROD
breakpoint qui FIGE le process --> observation passive, le process continue
reproduire le bug à la main   --> capturer le bug réel quand il survient
1 shinobi (toi)       --> des milliers de shinobis en simultané
```

Le pourquoi cette différence est fondamentale : un breakpoint classique arrête complètement l'exécution pour que tu inspectes l'état. En prod, arrêter le process pour un seul user pendant que 10 000 autres attendent leur réponse n'est juste pas une option. Tout l'outillage de debug en prod est donc construit autour de l'idée de ne jamais bloquer, seulement observer.

---

## 2) LOGS DE DIAGNOSTIC : LE PREMIER RÉFLEXE, S'ILS SONT BIEN PRÉPARÉS

```js
// Le bug n'est pas encore arrivé, mais tu prépares le terrain en amont
// avec des logs structurés (vus dans `26_observability/01_structured_logging`)
// suffisamment détaillés pour reconstruire le scénario après coup
logger.info({
 event: 'jutsu_started',
 userId: req.user.id,
 cartSize: cart.items.length,
 device: req.headers['user-agent'], // utile pour le bug "seulement sur mobile"
 requestId: req.requestId
})
```

Le risque réel : si tu n'as pas pensé à logguer le bon contexte AVANT que le bug arrive, tu ne peux pas l'ajouter rétroactivement. Le bug du vendredi soir sur mobile, sans log du device dans le contexte, restera un mystère jusqu'à ce qu'il se reproduise une deuxième fois (si tu as de la chance) avec, cette fois, le bon log en place.

---

## 3) SNAPSHOTS ET HEAP DUMPS : UNE PHOTO DE L'ÉTAT SANS ARRÊTER LE PROCESS

```
Une fuite mémoire (vue dans `08_memory_performance/04_profiling`) progresse
lentement en prod. Tu ne peux pas arrêter le serveur pour l'inspecter
en plein trafic.

SOLUTION : un heap snapshot (photo du tas mémoire) pris à chaud,
sans arrêter le process, à comparer avec un snapshot précédent
```

```js
// Node.js permet de générer un heap snapshot à la demande, sans tuer le process
const v8 = require('v8')
const fs = require('fs')

function takeHeapSnapshot() {
 const snapshotStream = v8.getHeapSnapshot()
 const fileName = `heap-${Date.now()}.heapsnapshot`
 const fileStream = fs.createWriteStream(fileName)
 snapshotStream.pipe(fileStream) // écrit la photo sur disque, le process continue de tourner
}
```

Le pourquoi : comparer deux snapshots pris à des moments différents révèle quels objets s'accumulent sans jamais être libérés (le signe classique d'une fuite mémoire), sans avoir eu besoin d'arrêter le service pour observer.

---

## 4) FEATURE FLAGS : ISOLER UN BUG SANS REDÉPLOYER

```
Un bug apparaît juste après le déploiement d'une nouvelle fonctionnalité
  |
  v
Au lieu de débugger en urgence sous pression, ou de tout rollback (revenir
en arrière) entièrement :
  |
  v
DÉSACTIVE juste cette fonctionnalité précise via un feature flag
(interrupteur de fonctionnalité), pour TOUS les shinobis ou un sous-groupe
  |
  v
Le reste de l'appli continue de tourner normalement, tu débuggues à froid
```

```js
// Un feature flag minimal : une simple vérification avant d'exécuter le code suspect
if (featureFlags.isEnabled('new-rasengan-flow', req.user.id)) {
 return newRasenganFlow(req)
} else {
 return legacyRasenganFlow(req) // chemin connu et stable, en attendant le diagnostic
}
```

Le pourquoi c'est puissant en situation de crise : tu reprends le contrôle immédiatement (le bug s'arrête pour les shinobis) sans devoir comprendre la cause exacte dans la seconde, ni redéployer du code en urgence sous pression (un redéploiement précipité est lui-même une source classique de nouveaux bugs). Tu désactives, tu respires, tu débuggues calmement, puis tu réactives une fois corrigé.

---

## 5) CANARY ET ROLLOUT PROGRESSIF : TESTER SUR UN PETIT GROUPE AVANT TOUT LE MONDE

```
DÉPLOIEMENT BRUTAL :
nouvelle version --> 100% des shinobis d'un coup --> si bug, 100% des shinobis touchés

DÉPLOIEMENT CANARY (progressif) :
nouvelle version --> 1% des shinobis --> si stable après surveillance --> 10% --> 50% --> 100%
             |
             v
         si bug détecté à 1% : rollback immédiat,
         99% des shinobis n'ont jamais rien vu
```

Le pourquoi : un déploiement canary combiné aux métriques (vues dans `26_observability/03_metrics_alerting`) permet de détecter une régression sur un petit échantillon avant qu'elle n'atteigne tout le monde. Si le taux d'erreur grimpe chez les 1% qui ont la nouvelle version, tu le sais en quelques minutes, pas en quelques heures après que toute ta base de shinobis ait été impactée.

---

## 6) CE QUI CASSE (MAIS FUN) : LE BUG QU'ON NE PEUT PLUS JAMAIS RETROUVER

```js
// exemple minimal : un bug reproductible facilement en local, debug classique

// exemple réaliste : un bug n'apparaît qu'en prod, sur un sous-ensemble
// de shinobis avec une configuration réseau particulière

// exemple qui casse : aucun log de contexte n'avait été prévu pour ce
// scénario précis, aucun feature flag n'isole la fonctionnalité concernée,
// et le bug ne s'est produit qu'une seule fois avant de "disparaître"
// (peut-être corrigé par un redémarrage de serveur, sans qu'on sache pourquoi)
// Résultat : impossible de savoir si c'est vraiment réglé, ou juste caché
// en attendant de revenir, plus tard, plus fort
```

La correction : accepter qu'un bug en prod non reproduit, sans feature flag ni log suffisant, n'est PAS résolu juste parce qu'il a disparu. La vraie discipline, c'est d'ajouter le log manquant et le feature flag manquant MAINTENANT, pour être prêt la prochaine fois qu'il réapparaît, plutôt que d'espérer qu'il ne revienne jamais.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, debugger en prod voulait souvent dire se connecter en SSH (accès distant sécurisé) directement sur le serveur pour lire des fichiers de logs locaux, parfois en ajoutant des `console.log` à chaud et en redéployant dans l'urgence. Maintenant, l'observabilité (logs structurés centralisés, tracing, métriques, Sentry, feature flags) permet de diagnostiquer la majorité des problèmes sans jamais se connecter à un serveur individuel, et les rollouts progressifs réduisent le besoin même de débugger en panique après un déploiement raté. Le switch existe parce que l'urgence sous pression produit de mauvaises décisions, pas par confort superflu.

---

## EXERCICES

**EXO 1 : Prépare le terrain**
Pour une fonctionnalité de tribut que tu vas déployer la semaine prochaine, liste les logs de contexte et le feature flag que tu mettrais en place AVANT le déploiement, pour être capable de débugger rapidement si un problème survient seulement chez une partie des shinobis. (15 minutes)

**EXO 2 : Isole sans rollback complet**
Un bug critique apparaît juste après un déploiement qui contenait 3 nouvelles fonctionnalités indépendantes. Explique pourquoi un feature flag par fonctionnalité aurait été préférable à un seul gros déploiement, et ce que tu ferais maintenant sans feature flags en place. (15 minutes)

**EXO 3 : Calibre un rollout progressif**
Propose un plan de rollout progressif (pourcentages et durées à chaque étape) pour une nouvelle version du moteur de recommandation d'un site e-commerce, avec les métriques que tu surveillerais à chaque palier avant de passer au suivant. (15 minutes)

---

## RÉSUMÉ

Débugger en prod exige d'observer sans jamais bloquer le process, contrairement à un breakpoint local qui peut tout arrêter sans conséquence. Les logs de contexte et les heap snapshots doivent être préparés avant la crise, pas improvisés pendant. Les feature flags permettent d'isoler un bug en quelques secondes sans redéployer sous pression, et un rollout progressif (canary) limite l'impact d'une régression à un petit groupe avant qu'elle n'atteigne tout le monde. Un bug en prod qui disparaît sans explication n'est jamais résolu, juste caché.
