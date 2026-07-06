# Page verrouillée
Temps de lecture ~6 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

# GRIMOIRE DES MODULES ES6

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Named export** | Exporte un binding nommé depuis un module. Peut en avoir plusieurs par fichier. | `export const fn = () => {}` | une liste de plats au menu d'un restaurant / les techniques publiques d'un ninja |
| **Default export** | Export principal d'un module. Un seul par fichier. L'importeur choisit le nom. | `export default maFonction` | la spécialité de la maison / le jutsu signature d'un ninja |
| **Named import** | Importe un binding spécifique par son nom exact (avec accolades). | `import { fn } from "./mod.js"` | commander un plat précis / appeler un technique par son nom |
| **Default import** | Importe l'export default. Pas d'accolades. Nom libre côté importeur. | `import fn from "./mod.js"` | demander "la spécialité" sans préciser / le boss qui répond peu importe comment on l'appelle |
| **Namespace import** | Importe tous les exports nommés sous un seul objet. | `import * as Utils from "./utils.js"` | commander tout le menu / recruter tout un village de ninjas d'un coup |
| **Re-export** | Un module qui importe et ré-exporte pour créer un point d'entrée unique. | `export { fn } from "./mod.js"` | un agent qui représente plusieurs artistes / un jonin qui coordonne plusieurs équipes |
| **Barrel file** | Fichier `index.js` qui agrège et ré-exporte plusieurs modules d'un dossier. | `export { a } from "./a.js"; export { b } from "./b.js"` | un bureau de recrutement unique / le quartier général qui rassemble tous les rapports |
| **Dynamic import** | Chargement asynchrone d'un module au runtime, pas au démarrage. | `const m = await import("./mod.js")` | appeler des renforts uniquement quand la bataille commence / ouvrir un dossier classifié seulement sur demande |
| **Live binding** | Les exports nommés sont des références vivantes : si la valeur change côté module, l'importeur voit le changement. | `export let count = 0` puis `count++` met à jour tous les importeurs | un tableau de score partagé en direct / un écran de stat qui se met à jour en temps réel |
| **Module scope** | Chaque module a son propre scope. Pas de pollution globale. | `let x = 1` dans `a.js` est invisible dans `b.js` | chaque ninja a son propre scroll : personne n'écrit dessus sauf lui / chaque vestiaire d'équipe reste privé |
| **Circular dependency** | Deux modules qui s'importent mutuellement. Cause des valeurs `undefined` difficiles à tracer. | `a.js` importe `b.js` qui importe `a.js` | deux messagers qui attendent chacun la réponse de l'autre pour partir / une poule et un oeuf qui se bloquent mutuellement |
| **Tree shaking** | Un bundler (Webpack, Rollup) supprime les exports jamais importés du bundle final. | si `fn2` n'est jamais importée, elle disparaît du build | ne charger dans le sac que ce qu'on utilise vraiment / ne recruter que les ninjas qui servent dans la mission |
| **Side effect import** | Importer un module uniquement pour ses effets de bord, sans utiliser ses exports. | `import "./analytics.js"` | allumer une alarme sans l'éteindre / déclencher un jutsu en entrant dans une pièce |
| **Façade pattern** | Un module qui expose une interface simple en cachant la complexité de plusieurs sous-modules. | `export const exec = (...) => { /* appelle 3 modules internes */ }` | le capitaine qui donne un ordre simple alors que 10 ninjas travaillent derrière / un guichet unique pour une administration complexe |
| **Module singleton** | Un module est chargé une seule fois. Tous les importeurs partagent la même instance. | deux fichiers qui importent `config.js` partagent le même objet `_config` | un seul Hokage pour tout le village, peu importe combien de fois on l'appelle / une seule salle de contrôle partagée par toutes les équipes |

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
