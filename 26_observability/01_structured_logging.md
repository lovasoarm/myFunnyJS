---
stability: perissable_2027
---

# Arrête d'écrire des logs que personne ne peut chercher
Temps de lecture ~10 min

Le Conseil de Surveillance de Garo reçoit chaque nuit des milliers de lignes du type "Chevalier a combattu un Horror". Ça veut tout dire et rien dire : lequel des 200 Chevaliers, quel Horror, dans quel quartier, ça a duré combien de temps ? Un log en texte libre, c'est une note griffonnée sur un post-it : ça te dit quelque chose au moment où tu l'écris, et ça devient inutile 10 minutes après.

Le structured logging (log structuré) dit : chaque log est un objet JSON, avec des champs fixes et cherchables, pas une phrase humaine improvisée.

Pourquoi ça compte : sans structure, tu ne peux pas filtrer "tous les combats du Chevalier Léon, dans le quartier nord, entre minuit et 1h". Avec structure, c'est une simple requête dans ton outil de logs (Datadog, ELK, vu aussi dans `24_databases/01_sql_basics` pour la logique de filtre).

Avantage : recherche et agrégation instantanées, corrélation entre plusieurs services.
Inconvénient : un peu plus verbeux à écrire, demande une discipline d'équipe pour rester cohérent.

---

## 1) LE PRINCIPE : UN LOG EST UNE DONNÉE, PAS UNE PHRASE

```
LOG EN TEXTE LIBRE (mauvais) :
"Le Chevalier Léon a combattu un Horror à 23h12 dans le quartier nord"
--> impossible à filtrer proprement, juste une string à grep (chercher dans du texte)

LOG STRUCTURÉ (JSON) :
{ "event": "horror_combat", "knightId": "leon_42", "district": "nord", "timestamp": "..." }
--> requêtable : "donne-moi tous les horror_combat où district = nord"
```

```js
// Mauvais : log texte libre, illisible à grande échelle
console.log(`Le Chevalier ${knightId} a combattu un Horror dans le quartier ${district}`)

// Bon : log structuré, chaque champ est une donnée exploitable
logger.warn({
 event: 'horror_combat',   // type d'événement, toujours en snake_case (mots séparés par underscore)
 knightId,          // qui est concerné
 district,          // contexte géographique
 outcome: 'armor_critical'  // pourquoi précisément ça mérite un warning
})
```

Le pourquoi : un humain qui lit `console.log` comprend une seule ligne à la fois. Un outil de logs qui lit du JSON peut indexer 10 millions de lignes et te répondre en 200ms "montre-moi tous les `horror_combat` de la dernière heure groupés par `outcome`". Le texte libre est fait pour un humain qui lit en direct, le JSON est fait pour une machine qui doit chercher après coup.

---

## 2) LES NIVEAUX DE LOG : PAS TOUT AU MÊME ÉTAGE

```
DEBUG --> détail technique fin, utile en dev, bruyant en prod
INFO  --> événement normal qui mérite d'être tracé (Chevalier en patrouille, combat gagné)
WARN  --> quelque chose d'anormal mais pas cassant (armure endommagée mais tenable)
ERROR --> quelque chose a vraiment cassé, une action a échoué
FATAL --> le process ne peut plus continuer, il va s'arrêter
```

```js
logger.debug({ event: 'patrol_scan', district: 'nord' })       // bruit utile seulement en dev
logger.info({ event: 'patrol_started', knightId: 'leon_42' })    // trace normale
logger.warn({ event: 'armor_damage', integrity: 0.4 })        // pas cassé, mais à surveiller
logger.error({ event: 'armor_collapse', knightId: 'leon_42' })    // ça a cassé
```

Le risque réel : si tout part en `INFO` (ou pire, tout en `ERROR`), le Conseil arrête de regarder les logs après deux semaines, parce que tout y ressemble à une urgence ou rien n'y ressemble à une urgence. Un niveau mal calibré tue la confiance dans les logs avant même qu'un vrai incident arrive.

```
Mauvaise calibration :
ERROR: scan de routine sans Horror détecté   <-- c'est juste normal, pas une erreur
ERROR: armure désintégrée, Chevalier à terre  <-- ça, c'est un vrai ERROR
--> les deux ont le même poids visuel, le Conseil ignore les alertes ERROR à force
```

---

## 3) CORRELATION ID : RELIER TOUS LES LOGS D'UNE MÊME REQUÊTE

```
Une alerte Horror traverse plusieurs étapes :
Détecteur --> Dispatcher de mission --> Chevalier assigné --> Conseil de Surveillance

Sans correlation ID (identifiant de corrélation) :
4 logs séparés, dans 4 services différents, AUCUN moyen de savoir
qu'ils appartiennent à la MÊME alerte
```

```js
// Middleware qui génère ou propage un correlation ID dès l'entrée de l'alerte
app.use((req, res, next) => {
 req.alertId = req.headers['x-alert-id'] || crypto.randomUUID()
 // si un service amont a déjà posé un ID, on le garde, sinon on en crée un
 next()
})

// Chaque log de cette alerte embarque le même ID, peu importe le service
logger.info({ event: 'knight_dispatched', alertId: req.alertId, knightId: 'leon_42' })
```

```
Avec correlation ID :
chaque log de cette alerte précise porte le même alertId : "alert-7f3a9b"
--> tu filtres sur "alert-7f3a9b" et tu vois TOUT le parcours, du détecteur au Conseil
```

Le pourquoi c'est puissant : ce concept est le socle de la leçon suivante, le distributed tracing (vu dans `26_observability/02_distributed_tracing`), qui va beaucoup plus loin que le simple ID, mais qui repose exactement sur cette même idée de fil qui traverse les services. Sans correlation ID dans tes logs structurés, le tracing distribué n'a rien à exploiter.

---

## 4) CE QUE TU NE LOGUES JAMAIS : LES DONNÉES SENSIBLES

```
INTERDIT dans un log, même structuré :
mot de passe en clair, numéro de carte bancaire complet, token JWT complet,
localisation domicile réelle d'un Chevalier hors mission, contenu d'un message privé
```

```js
// exemple qui casse : la localisation réelle de Léon (hors patrouille) finit dans les logs
logger.info({ event: 'knight_status', knightId: 'leon_42', realHomeAddress: req.body.address })
// CATASTROPHE : si l'outil de logs fuite, n'importe quel Horror ou ennemi infiltré
// sait où dort le Chevalier quand il n'a pas son armure

// correction : ne logue jamais le champ sensible, ou masque-le
logger.info({ event: 'knight_status', knightId: 'leon_42', realHomeAddress: '[REDACTED]' })
```

Le risque réel : un log fuité (accès non autorisé à l'outil de logs, mauvaise configuration de droits) avec une donnée sensible dedans, c'est une fuite de données aussi grave qu'une fuite de DB, sauf que personne ne pense à protéger les logs avec la même rigueur que la base de données principale (vue aussi dans `22_security/05_hashing_bcrypt` pour le même réflexe appliqué aux mots de passe).

---

## 5) CE QUI CASSE (MAIS FUN) : LE LOG QUI COÛTE PLUS CHER QUE LE BUG QU'IL DEVAIT TROUVER

```js
// exemple minimal : logguer chaque patrouille, ça marche bien avec 10 Chevaliers actifs

// exemple réaliste : Garo recrute, l'effectif grossit, 500 Chevaliers patrouillent,
// chaque scan de routine génère 8 logs DEBUG détaillés "pour être sûr de tout voir"

// exemple qui casse : la facture de l'outil de logs (facturé au volume ingéré)
// explose, ET les vrais ERROR importants (armure qui collapse) sont noyés sous
// des millions de lignes DEBUG qui ne servent à rien en prod
// Résultat : le Conseil désactive les logs en panique pour limiter la facture,
// et perd toute visibilité PILE le jour où un Horror de rang S attaque en masse
```

La correction : un niveau de log par défaut adapté à l'environnement (`DEBUG` en dev, `INFO` ou `WARN` en prod), et une vraie réflexion sur quoi logguer (un événement métier important) vs quoi ne pas logguer (chaque micro-étape interne sans valeur de diagnostic).

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, beaucoup de projets se contentaient de `console.log` partout, avec un grep manuel sur un fichier texte le jour du problème. Ça marchait sur un seul serveur avec peu de trafic. Maintenant, avec des architectures multi-services et du volume, le standard est un logger structuré (Pino, Winston) qui sort du JSON, ingéré par un outil centralisé (Datadog, ELK, Loki). Le switch existe parce que chercher dans des millions de lignes de texte brut à la main devient juste impossible passé une certaine échelle, pas parce que `console.log` serait "interdit" : il reste très bien en dev local sur un petit script.

---

## EXERCICES

**EXO 1 : Calibre les niveaux**
Pour chacun de ces événements du Conseil de Surveillance, choisis le niveau de log (DEBUG, INFO, WARN, ERROR, FATAL) et justifie en une phrase : (a) un scan de routine qui ne détecte rien, (b) une patrouille terminée sans incident, (c) un combat gagné mais avec armure endommagée à 30%, (d) la perte totale de contact radio avec un Chevalier en plein combat. (15 minutes)

**EXO 2 : Trace la fuite**
Repère, dans un payload de mission imaginaire `{ knightId, realHomeAddress, missionTarget, district }`, lesquels de ces champs ne doivent JAMAIS apparaître dans un log accessible à tout le Conseil, et propose comment logguer cette mission sans rien exposer d'inutile mais en gardant assez de contexte pour debugger. (10 minutes)

**EXO 3 : Le fil du correlation ID**
Une alerte Horror traverse Détecteur → Dispatcher → Chevalier → Conseil. Décris, étape par étape, comment l'`alertId` doit circuler entre ces 4 services pour que tu puisses, après coup, retrouver tous les logs liés à une seule alerte précise. (15 minutes)

---

## RÉSUMÉ

Un log structuré est une donnée JSON cherchable, pas une phrase humaine jetable. Les niveaux de log (DEBUG à FATAL) doivent rester calibrés pour que ERROR garde tout son poids d'alerte. Le correlation ID relie les logs d'une même requête à travers plusieurs services, et c'est le socle sur lequel repose le tracing distribué vu juste après. Et un log, structuré ou pas, ne contient jamais une donnée sensible : un log qui fuite avec une information critique en clair dedans est une fuite de données comme une autre.
