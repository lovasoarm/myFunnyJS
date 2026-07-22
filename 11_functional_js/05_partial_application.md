---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# APPLICATION PARTIELLE : FIXER MAINTENANT, PASSER LE RESTE PLUS TARD
Temps de lecture ~9 min

Le currying transforme la signature d'une fonction.
L'application partielle fait quelque chose de différent : elle pré-remplit certains arguments d'une fonction existante et retourne une nouvelle fonction qui attend le reste.

En pratique : tu as une fonction qui prend 3 arguments. Tu fixes le premier maintenant. Tu obtiens une fonction qui attend les 2 restants ensemble.

---

## 1) LA DIFFÉRENCE AVEC LE CURRYING

```js
// curry : f(a, b, c) -> f(a)(b)(c) :chaque arg séparé, obligatoirement
// partial : f(a, b, c) avec a=10 -> g(b, c) :le reste ensemble ou séparé

// curry
const add = (a) => (b) => a + b;
add(10)(5); // 15:forcément séquentiel

// partial application
function additionner(a, b, c) {
 return a + b + c;
}

const additionnerA10 = additionner.bind(null, 10);
additionnerA10(5, 3); // 18:b et c passés ensemble
additionnerA10(5)(3); // TypeError : additionnerA10(5) retourne 15, pas une fonction
```

Curry = chaque argument génère une fonction.
Partial = tu fixes des arguments, le reste est appelé normalement.

---

## 2) `Function.prototype.bind` : PARTIAL APPLICATION NATIVE

`bind` est la façon native de faire de l'application partielle en JS.

```js
function calculerSalaire(tauxBase, heures, primes) {
 return tauxBase * heures + primes;
}

// on fixe le taux de base
const salaireDev = calculerSalaire.bind(null, 85); // taux fixé à 85
const salaireDesigner = calculerSalaire.bind(null, 70);

salaireDev(40, 500); // 85 * 40 + 500 = 3900
salaireDesigner(35, 300); // 70 * 35 + 300 = 2750
```

`null` en premier argument de `bind` : c'est la valeur de `this`. En FP pure on s'en fout de `this`, donc `null`.

---

## 3) `partial` MAISON : PLUS FLEXIBLE QUE `bind`

`bind` a des limites : le contexte `this`, pas d'arguments "trou". Une version maison est plus propre.

```js
// partial basique
function partial(fn, ...argsFixés) {
 return function (...autresArgs) {
  return fn(...argsFixés, ...autresArgs);
 };
}

// exemple Ballon d'Or
function calculerScore(bonusButs, bonusPasses, bonusCL, joueur) {
 return (
  joueur.buts * bonusButs +
  joueur.passes * bonusPasses +
  (joueur.aCL ? bonusCL : 0)
 );
}

// on fixe les coefficients, pas le joueur
const scorerJoueur = partial(calculerScore, 0.5, 0.3, 30);

scorerJoueur({ buts: 45, passes: 20, aCL: true }); // 45*0.5 + 20*0.3 + 30 = 58.5
scorerJoueur({ buts: 60, passes: 8, aCL: false }); // 60*0.5 + 8*0.3 + 0 = 32.4
```

---

## 4) CAS RÉEL : CONFIGURATION D'API CALLS

L'application partielle brille quand tu as des paramètres de contexte (env, token, URL de base) que tu fixes une fois, et des paramètres de données qui changent à chaque appel.

```js
// fonction générale d'appel API
async function apiCall(baseURL, token, endpoint, body) {
 const response = await fetch(`${baseURL}${endpoint}`, {
  method: body ? "POST" : "GET",
  headers: {
   Authorization: `Bearer ${token}`,
   "Content-Type": "application/json",
  },
  body: body ? JSON.stringify(body) : undefined,
 });
 return response.json();
}

// configuration fixée selon l'environnement
const prisonBreakAPI = partial(
 apiCall,
 "https://api.foxriver.com",
 process.env.AUTH_TOKEN,
);

// utilisation : plus besoin de répéter base URL et token
const getPrisonniers = () => prisonBreakAPI("/prisonniers");
const getSection = (id) => prisonBreakAPI(`/sections/${id}`);
const ajouterAlert = (data) => prisonBreakAPI("/alertes", data);

// propre, sans duplication, sans avoir à curry la fonction apiCall
```

---

## 5) PARTIAL VS CURRY : QUAND UTILISER LEQUEL

```
CURRY quand :
 - tu veux composer dans un pipe
 - chaque argument arrive à un moment différent
 - tu veux des fonctions unaires strictes

PARTIAL quand :
 - tu veux fixer du contexte (config, token, env)
 - les arguments restants arrivent ensemble
 - la fonction existante n'est pas curryfiée
 - tu travailles avec du code tiers que tu ne peux pas modifier
```

```js
// curry : composition directe dans pipe
const filtrerParZone = (zone) => (missions) =>
 missions.filter((m) => m.zone === zone);

pipe(
 filtrerParZone("nord"), // s'insère naturellement
 trierParPriorite,
 prendreTop(2),
)(missions);

// partial : configuration d'une fonction existante
import { format } from "date-fns";
const formatDate = partial(format, new Date(), "dd/MM/yyyy");
// on fixe la date maintenant, le format peut changer
```

---

## 6) PARTIAL AVEC "TROU" : `_` COMME PLACEHOLDER

Parfois tu veux fixer le 2e argument mais pas le premier. Standard libraries (Ramda, Lodash/FP) supportent ça avec un placeholder.

Version maison minimale :

```js
const _ = Symbol("placeholder");

function partialWithHoles(fn, ...argsFixés) {
 return function (...autresArgs) {
  let idxAutres = 0;
  const argsComplets = argsFixés.map((arg) =>
   arg === _ ? autresArgs[idxAutres++] : arg,
  );
  // ajoute les args restants pas encore utilisés
  while (idxAutres < autresArgs.length) {
   argsComplets.push(autresArgs[idxAutres++]);
  }
  return fn(...argsComplets);
 };
}

function dispatcherMission(chevalier, niveauHorreur, zone) {
 return {
  chevalier,
  niveauHorreur,
  zone,
  urgence: niveauHorreur >= 4 ? "critique" : "standard",
 };
}

// on fixe la zone (3e arg) mais pas le chevalier (1er)
const missionNord = partialWithHoles(dispatcherMission, _, _, "nord");

missionNord("Leon", 5); // { chevalier: "Leon", niveauHorreur: 5, zone: "nord", urgence: "critique" }
missionNord("Rei", 2); // { chevalier: "Rei", niveauHorreur: 2, zone: "nord", urgence: "standard" }
```

---

## 7) LE CAS QUI CASSE : `this` ET LES MÉTHODES D'OBJET

L'application partielle avec `.bind` perd le contexte `this` des méthodes.

```js
const joueur = {
 nom: "Messi",
 buts: 45,
 décrire() {
  return `${this.nom} a marqué ${this.buts} buts`;
 },
};

const décrirePartiel = joueur.décrire.bind(null); // this = null
décrirePartiel(); // TypeError ou "undefined a marqué undefined buts"

// fix : passer l'objet comme this
const décrireAvecContexte = joueur.décrire.bind(joueur);
décrireAvecContexte(); // "Messi a marqué 45 buts"
```

En FP pure, on évite les méthodes sur `this`. On préfère des fonctions qui prennent l'objet en argument.

```js
// mieux en FP
const décrireJoueur = (joueur) => `${joueur.nom} a marqué ${joueur.buts} buts`;
const décrireMessi = partial(décrireJoueur, { nom: "Messi", buts: 45 });
```

---

## EXERCICES

## EXO 1 : le configurateur de mission

```js
function créerMission(serveur, token, niveau, chevalier, zone) {
 return {
  url: `${serveur}/missions`,
  auth: token,
  payload: { niveau, chevalier, zone },
 };
}

// 1. Utilise partial pour créer missionServeurProd (serveur et token fixés)
// 2. Utilise-la pour créer missionNiveauCritique (niveau fixé à 5 en plus)
// 3. L'appel final : missionNiveauCritique("Leon", "nord")
```

---

## EXO 2 : le scoreur paramétrable

```js
// Saison régulière : bonusButs=0.5, bonusPasses=0.3, bonusCL=30
// Saison monde : bonusButs=0.7, bonusPasses=0.2, bonusCL=50

function calculerScore(bonusButs, bonusPasses, bonusCL, joueur) {
 return (
  joueur.buts * bonusButs +
  joueur.passes * bonusPasses +
  (joueur.aCL ? bonusCL : 0)
 );
}

// Crée scorerSaisonReg et scorerSaisonMonde avec partial
// Applique les deux sur ce joueur et compare les scores
const haaland = { buts: 60, passes: 8, aCL: true };
```

---

## EXO 3 : partial vs curry : même résultat, deux chemins

Implémente `filtrerEtTrier(seuil, critere, joueurs)` qui filtre les joueurs avec buts >= seuil, puis les trie par critère.

Implémentes-la :

1. En version normale
2. En version curryfiée (utilisable dans pipe)
3. En version partial application (seuil et critère fixés ensemble)

Montre les 3 usages. Explique lequel tu utiliserais dans un pipe et pourquoi.

---

## EXO 4 : le formateur de logs

```js
function formatLog(service, niveau, correlationId, message) {
 return JSON.stringify({
  service,
  niveau,
  correlationId,
  message,
  timestamp: new Date().toISOString(),
 });
}

// Crée des loggers spécialisés avec partial :
// logPrisonBreak -> service fixé
// logPrisonBreakError -> service + niveau "ERROR" fixés
// logPrisonBreakError("abc-123", "Token invalide")
// doit produire le JSON correct
```

---

## RÉSUMÉ

L'application partielle : fixer certains arguments d'une fonction et retourner une fonction qui attend le reste.
`Function.prototype.bind` fait ça nativement. Une fonction `partial` maison est plus lisible.
L'usage principal : isoler la configuration (base URL, token, coefficients) du traitement des données.
Différence avec curry : partial garde les arguments restants ensemble, curry les sépare un par un.
Quand composer dans un pipe : curry. Quand fixer un contexte : partial.
