---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
> (attention) **OUTIL PÉRISSABLE** : le tooling JS bouge chaque année. Traite ce module comme une REVUE, pas une bible. `Principes durables` en bas.

> **Périssable : valable 2026.** L'outil change vite ; le principe (build, format, lint, package) est **intemporel**.

# LOGGER STRUCTURÉ : SAVOIR CE QUI S'EST PASSÉ, DANS QUEL ORDRE, AVEC QUEL CONTEXTE
Temps de lecture ~8 min

`console.log("ici")` te dit que t'es passé "ici". Il te dit pas quand, il te dit pas dans quel contexte, il te dit pas si c'est grave ou normal. Un logger structuré répond à ces trois questions à chaque appel, sans que t'aies à y repenser à chaque fois.

---

## 1) LE PROBLÈME QUE CONSOLE.LOG NE RÉSOUT PAS

```js
// Du code typique sans logger structuré
console.log("démarrage du camp");
console.log("inventaire chargé");
console.log("erreur");
console.log(survivant);
```

```
problèmes concrets :
- aucun horodatage : QUAND chaque event s'est produit
- aucun niveau : c'est une info normale ou une vraie erreur ?
- format incohérent : parfois une string, parfois un objet brut
- impossible à filtrer : tu peux pas dire "montre-moi que les erreurs"
- impossible à chercher : si t'as 10 000 lignes, bonne chance pour trouver ce qui compte
```

**Pourquoi ça casse en prod :** un crash arrive à 3h du matin. Tu ouvres les logs. Tu as 50 000 lignes de `console.log` sans horodatage clair ni niveau de gravité. Tu sais pas par où chercher. Le logger structuré existe pour que ce moment-là dure 2 minutes au lieu de 2 heures. C'est le Sharingan de Kakashi appliqué aux logs : tu vois tout, dans le bon ordre, avec le contexte exact : au lieu de tâtonner à l'aveugle.

---

## 2) LA STRUCTURE MINIMALE D'UN LOG UTILE

Un bon log répond toujours à quatre questions :

```
QUAND  --> timestamp (horodatage)
QUOI  --> niveau de gravité (info, warn, error)
QUOI PRÉCISÉMENT --> le message lui-même
DANS QUEL CONTEXTE --> des données additionnelles (qui, où, avec quel état)
```

```js
// La forme qu'on vise, en JSON, facilement lisible par une machine ET un humain
{
 "timestamp": "2026-06-21T14:32:10.452Z",
 "level": "error",
 "message": "echec connexion radio",
 "context": { "frequence": 145.5, "tentative": 3 }
}
```

**Technique :** le format JSON n'est pas un choix esthétique. Un log en JSON peut être parsé (analysé automatiquement) par un outil, filtré par niveau, recherché par champ. Un log en texte libre, c'est lisible par un humain mais quasi impossible à exploiter automatiquement à grande échelle.

---

## 3) CONSTRUIRE LE LOGGER, ÉTAPE PAR ÉTAPE

```js
// logger.js

// Les niveaux de gravité, du moins grave au plus grave
const NIVEAUX = {
 debug: 0,  // détails techniques, utile en dev seulement
 info: 1,  // événement normal, ça se passe comme prévu
 warn: 2,  // quelque chose d'anormal mais pas bloquant
 error: 3,  // quelque chose a vraiment cassé
};

function creerLogger(niveauMinimum = "info") {
 const seuil = NIVEAUX[niveauMinimum];

 function log(niveau, message, context = {}) {
  // si le niveau du log est en dessous du seuil configuré, on l'ignore
  // (ex: en prod, on ignore souvent "debug" pour pas noyer les vrais events)
  if (NIVEAUX[niveau] < seuil) return;

  const entree = {
   timestamp: new Date().toISOString(),
   level: niveau,
   message,
   context,
  };

  // JSON.stringify transforme l'objet en une seule ligne de texte
  // une ligne par log = facile à parser ensuite, fichier par fichier
  console.log(JSON.stringify(entree));
 }

 return {
  debug: (message, context) => log("debug", message, context),
  info: (message, context) => log("info", message, context),
  warn: (message, context) => log("warn", message, context),
  error: (message, context) => log("error", message, context),
 };
}

module.exports = { creerLogger };
```

```js
// Utilisation, n'importe où dans un projet
const { creerLogger } = require('./logger');
const logger = creerLogger("info"); // ignore les logs "debug"

logger.info("camp démarré", { survivants: 12 });
logger.warn("stock de rations bas", { joursRestants: 2 });
logger.error("clôture compromise", { secteur: "nord", gravite: "critique" });

// Sortie, une ligne JSON par appel :
// {"timestamp":"2026-06-21T14:32:10.452Z","level":"info","message":"camp démarré","context":{"survivants":12}}
```

**Pourquoi cette forme :** la fonction `creerLogger` retourne un objet avec 4 méthodes, chacune pré-configurée avec son niveau. C'est une factory (fabrique) toute simple, qui te donne une API claire (`logger.error(...)`) au lieu d'avoir à répéter le niveau à chaque appel.

---

## 4) LE NIVEAU MINIMUM : FILTRER LE BRUIT

```js
// En dev, tu veux TOUT voir
const loggerDev = creerLogger("debug");
loggerDev.debug("variable x =", { x: 42 }); // s'affiche

// En "prod" simulée, tu veux ignorer le bruit de debug
const loggerProd = creerLogger("warn");
loggerProd.info("event normal"); // IGNORÉ, sous le seuil "warn"
loggerProd.warn("anomalie détectée"); // s'affiche
```

```
NIVEAUX[niveau] < seuil --> ignoré
NIVEAUX[niveau] >= seuil --> affiché

debug(0) info(1) warn(2) error(3)
       ^
     seuil="info" : ignore debug, affiche le reste
```

**Risque réel :** oublier de remonter le seuil avant un déploiement. Un projet qui log tout en `debug` en prod génère un volume de logs énorme, ralentit l'app, et noie les vraies erreurs sous des milliers de lignes inutiles.

---

## 5) LE CONTEXTE : CE QUI TRANSFORME UN LOG EN INDICE UTILE

```js
// MAUVAIS : un message sans contexte
logger.error("erreur de connexion");
// Quelle connexion ? Vers quoi ? Avec quel état ? Aucune idée.

// BON : le contexte raconte l'histoire complète
logger.error("erreur de connexion radio", {
 frequence: 145.5,
 tentative: 3,
 dernierMessageEnvoye: "RAS secteur nord",
 dureeAvantEchec_ms: 4200,
});
```

**Technique :** le contexte, c'est l'objet JS passé en deuxième argument. Il transforme un log d'une phrase vague en un instantané complet de la situation. Un bon réflexe : à chaque `logger.error`, demande-toi "si je lis CE log dans 6 mois sans aucun autre contexte, je comprends ce qui s'est passé ?". Michael Scofield dans Prison Break ne note pas "problème dans le couloir". Il note le numéro du couloir, l'heure, le garde en poste, et l'alternative disponible. Toi pareil dans tes logs.

---

## EXERCICES

EXO 1 : L'établi de base :
Implémente le logger ci-dessus, teste les 4 niveaux, et vérifie qu'un seuil à `"warn"` ignore bien `debug` et `info`.

EXO 2 : Le contexte qui sauve la nuit :
Prends une fonction qui peut échouer pour plusieurs raisons différentes (genre une fonction qui valide un stock de munitions et peut échouer si stock négatif, si type invalide, ou si quantité non numérique). Logge chaque échec avec un contexte assez riche pour que, SANS regarder le code, tu puisses comprendre exactement quel cas a déclenché l'erreur.

EXO 3 : Le filtre qui muet le bruit :
Crée un scénario avec 20 logs mélangeant les 4 niveaux. Configure le logger avec un seuil `"error"` et vérifie qu'un seul type de ligne sort. Explique en une phrase pourquoi ce filtrage est précieux sur un vrai projet avec des milliers de logs par jour.

---

## RÉSUMÉ

Un logger structuré répond toujours à quand, quoi, à quel niveau, et dans quel contexte, contrairement à un `console.log` brut qui répond à rien de tout ça de façon fiable. Le format JSON rend chaque ligne exploitable automatiquement, pas juste lisible à l'oeil. Le niveau minimum filtre le bruit selon l'environnement (tout en dev, l'essentiel en prod). Le contexte transforme un message vague en indice complet, suffisant pour comprendre un incident sans avoir à relire le code source.
