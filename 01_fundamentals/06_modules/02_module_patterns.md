---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ENCAPSULER, EXPOSER, PROTÉGER : LES VRAIS PATTERNS DE MODULES
Temps de lecture ~9 min

Savoir écrire `import` et `export` c'est la syntaxe. Savoir quoi exposer et quoi cacher : c'est l'architecture.

Un module mal conçu expose trop. Les autres fichiers se mettent à dépendre de ses détails internes. Tu changes un truc interne, ça casse ailleurs. Tu ne sais plus pourquoi. C'est comme ça que les projets deviennent ingérables.

Ce fichier t'apprend à penser en termes d'interface publique et d'implémentation privée.

---

## 1) LE PATTERN MODULE CLASSIQUE : private par défaut

Tout ce qui n'est pas exporté est privé. C'est la règle de base. Exploite-la.

```js
// scoring.js

// privé : personne ne peut toucher ça directement
let _totalMatchs = 0
const _historique = []

const _validerScore = (score) => {
 if (typeof score !== "number" || score < 0) {
  throw new Error(`Score invalide : ${score}`)
 }
}

// public : l'interface que le monde voit
export const enregistrerScore = (score) => {
 _validerScore(score)
 _historique.push(score)
 _totalMatchs++
}

export const getMoyenne = () =>
 _historique.length === 0
  ? 0
  : _historique.reduce((a, b) => a + b, 0) / _historique.length

export const getStats = () => ({
 totalMatchs: _totalMatchs,
 moyenne: getMoyenne(),
 // on retourne une copie, pas la référence directe
 historique: [..._historique]
})
```

`_historique` ne peut jamais être muté depuis l'extérieur. Quelqu'un qui importe `scoring.js` peut appeler `enregistrerScore`, `getMoyenne`, `getStats`. Il ne peut pas faire `_historique.push(999)` directement. Parce que `_historique` n'est pas exporté. C'est tout.

---

## 2) FAÇADE PATTERN : simplifier une interface complexe

Parfois tu as plusieurs modules internes qui font des choses compliquées. Tu crées un module façade qui expose une interface simple et cache la complexité.

```js
// internal/chakraEngine.js
export const calculerChakra = (ninja) => ninja.base * ninja.multiplicateur

// internal/jutsuResolver.js
export const resoudreJutsu = (jutsu, chakra) => jutsu.coutChakra <= chakra

// internal/combatLogger.js
export const logCombat = (attaquant, cible, resultat) =>
 `[COMBAT] ${attaquant} vs ${cible} : ${resultat}`
```

```js
// combat.js <-- la façade
import { calculerChakra } from "./internal/chakraEngine.js"
import { resoudreJutsu } from "./internal/jutsuResolver.js"
import { logCombat } from "./internal/combatLogger.js"

// l'API publique : une seule fonction claire
export const lancerAttaque = (attaquant, cible, jutsu) => {
 const chakra = calculerChakra(attaquant)
 const succes = resoudreJutsu(jutsu, chakra)
 const log = logCombat(attaquant.nom, cible.nom, succes ? "TOUCHÉ" : "RATÉ")
 console.log(log)
 return succes
}
```

```js
// main.js
import { lancerAttaque } from "./combat.js"
// pas besoin de savoir que chakraEngine, jutsuResolver et combatLogger existent
```

Le shinobi de `combat.js` appelle `lancerAttaque`. Il ne sait pas et n'a pas besoin de savoir que trois modules internes sont impliqués. Si tu refactores l'un d'eux, `main.js` ne change pas.

---

## 3) SINGLETON MODULE : une instance partagée

_*Note: Un singleton, c'est une façon de s'assurer qu'il n'existe qu'un seul exemplaire d'un truc dans tout ton code, et que tout le monde utilise le même. (ex:partager une seule et même chose (connexion BDD, config, etc.) sans risquer d'en créer plusieurs par erreur.)*_

En ES6, un module est chargé une seule fois. Si deux fichiers importent le même module, ils obtiennent la même instance. Pas une copie : la même.

```js
// config.js
const _config = {
 apiUrl: "https://api.crazydevs.io",
 timeout: 5000,
 debug: false
}

export const getConfig = () => ({ ..._config })

export const setDebug = (val) => {
 _config.debug = val
}
```

```js
// moduleA.js
import { setDebug } from "./config.js"
setDebug(true)
```

```js
// moduleB.js
import { getConfig } from "./config.js"
console.log(getConfig().debug) // true
// moduleA et moduleB partagent le même _config
```

C'est le singleton gratuit en JS. Pas de pattern compliqué, pas de classe. Juste le système de modules qui fait son boulot.

Danger : si `_config` est un objet et que tu le retournes directement (sans spread), quelqu'un peut le muter depuis l'extérieur. Le `{ ..._config }` dans `getConfig` protège contre ça.

---

## 4) PLUGIN PATTERN : un module qui s'enregistre lui-même

Pour les systèmes extensibles. Un module "core" (le coeur) expose une méthode `register`. Les plugins (des fonctionnalités) s'enregistrent eux-mêmes.

```js
// core/jutsuRegistry.js
const _registry = new Map()  // ← ça, c'est l'unique instance (singleton)

export const register = (nom, fn) => {
 if (_registry.has(nom)) throw new Error(`Jutsu "${nom}" déjà enregistré`)
 _registry.set(nom, fn)
}

export const executer = (nom, ...args) => {
 if (!_registry.has(nom)) throw new Error(`Jutsu "${nom}" inconnu`)
 return _registry.get(nom)(...args)
}

export const lister = () => [..._registry.keys()]
```

```js
// plugins/rasengan.js
import { register } from "../core/jutsuRegistry.js"

register("rasengan", (puissance) => ({
 nom: "Rasengan",
 degats: puissance * 150,
 element: "vent"
}))
```

```js
// main.js
import "../plugins/rasengan.js"  // juste importer suffit : le plugin s'enregistre
import { executer, lister } from "./core/jutsuRegistry.js"

console.log(lister())     // ["rasengan"]
console.log(executer("rasengan", 3))
```

L'import de `rasengan.js` déclenche son exécution, qui appelle `register`. Le core ne sait pas à l'avance quels plugins existent. Tu peux en ajouter sans toucher au core.

---

## 5) LE PIÈGE DU MODULE QUI EXPOSE TROP

Mauvais pattern :

```js
// player.js : expose trop
export let score = 0
export let vie = 100
export const nom = "Naruto"

// n'importe qui peut faire :
// import { score } de "./player.js"
// score = 9999  <- ERREUR en strict mode pour les live bindings (le lien en direct entre ton import et la variable originale dans le module)
// mais une valeur mutable exposée crée une dépendance sur l'implémentation interne
```

Meilleur pattern :

```js
// player.js : interface contrôlée
let score = 0
let vie = 100
const nom = "Naruto"

export const getEtat = () => ({ score, vie, nom })
export const ajouterScore = (points) => { score += points }
export const prendreDegats = (degats) => { vie = Math.max(0, vie - degats) }
```

L'état interne change : personne ne peut l'écraser directement. Tout passe par des fonctions. Ton module reste maître de son propre état.

---

## EXERCICES

## EXO 1 : le module de camp
Walking Dead. Tu construis `camp.js` : le module de gestion du camp de Rick.

State interne : liste de survivants, niveau de munitions, niveau de nourriture.

Interface publique :
- `ajouterSurvivant(nom)` : ajoute si pas déjà présent
- `consommerRessources(type, quantite)` : "munitions" ou "nourriture", ne descend pas sous 0
- `getStatsCamp()` : retourne une copie de l'état (pas la référence directe)
- `estEnDanger()` : retourne `true` si munitions < 10 OU nourriture < 5

Contrainte : les tableaux et valeurs internes ne sont jamais exposés directement.

---

## EXO 2 : la façade de Konoha
Trois modules internes :
- `ennemis.js` : génère des ennemis (nom, taille, puissance)
- `shinobis.js` : liste des shinobis disponibles (nom, rang, kunaï: boolean)
- `calcul.js` : `tauxSurvie(ennemi, shinobi)` retourne un pourcentage

Crée `konoha.js` : une façade qui expose une seule fonction :
`lancerMission(nomCible, nomShinobi)` qui retourne un rapport de mission complet.

`main.js` n'importe que `konoha.js`. Il ne sait pas que les trois modules internes existent.

---

## EXO 3 : le registre de plugins
Construit un système de calcul de stats de foot extensible.

`core/statsRegistry.js` : système de register / executer / lister (comme l'exemple ci-dessus)

Trois plugins à créer :
- `plugins/possession.js` : calcule la possession à partir des passes
- `plugins/xg.js` : calcule le xG à partir des tirs et leur position
- `plugins/rating.js` : calcule un rating joueur sur 10 à partir de ses stats brutes

`main.js` importe les trois plugins et les utilise via le registre. Si tu ajoutes un quatrième plugin plus tard, `main.js` ne change pas.

---

## RÉSUMÉ

Un module = une responsabilité. Une interface publique réduite. Un état interne protégé.

La façade simplifie ce qui est complexe. Le singleton module est gratuit en ES6. Le plugin pattern rend un système extensible sans le modifier.

Ce que tu n'exposes pas, tu ne le casses pas. Ce que tu exposes, tu t'engages à le maintenir. Réfléchis à ce que tu exportes avant de le faire.
