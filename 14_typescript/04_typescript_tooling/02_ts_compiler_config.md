---
stability: perissable_2027
---

# TS COMPILER CONFIG : TSCONFIG.JSON : CHAQUE OPTION EXPLIQUÉE AVEC SON IMPACT RÉEL
Temps de lecture ~9 min

Un plan d'évasion sans règles précises, c'est le chaos. "On sort par où on peut, quand on peut" : ça finit mal. `tsconfig.json` c'est le règlement strict du plan : qui a le droit de faire quoi, qu'est-ce qui est toléré, qu'est-ce qui fait tout annuler. Une option mal comprise dans ce fichier, c'est une faille dans le plan que personne a vue venir.

---

## 1) LA STRUCTURE DE BASE

```json
{
 "compilerOptions": {
  "target": "ES2022",
  "module": "ESNext",
  "strict": true,
  "outDir": "./dist",
  "rootDir": "./src"
 },
 "include": ["src/**/*"],
 "exclude": ["node_modules", "dist"]
}
```

```
compilerOptions --> le coeur : comment TS doit compiler et vérifier ton code
include      --> quels fichiers le compilateur doit considérer
exclude      --> quels fichiers il doit ignorer complètement
```

**Technique :** `tsc` (le compilateur TypeScript) lit ce fichier avant de toucher à un seul fichier source. Chaque option change soit la SORTIE (le JS généré), soit la VÉRIFICATION (ce qui est accepté ou rejeté à la compilation).

---

## 2) TARGET ET MODULE : OÙ TON CODE VA VIVRE

```json
{
 "target": "ES2022",  // quelle version de JS le code COMPILÉ doit utiliser
 "module": "ESNext"  // quel système de modules le code COMPILÉ doit utiliser
}
```

```ts
// Ton code source TypeScript :
const verifierAcces = (niveau: number) => niveau >= 3;

// Avec target: "ES5" (très ancien), TS transforme les arrow functions :
var verifierAcces = function (niveau) { return niveau >= 3; };

// Avec target: "ES2022" (moderne), TS garde quasi tel quel :
const verifierAcces = (niveau) => niveau >= 3;
```

**Pourquoi ça compte :** `target` détermine la compatibilité avec les environnements d'exécution. Un `target` trop ancien génère du code verbeux et parfois moins performant pour des environnements qui n'en ont plus besoin. Un `target` trop récent peut générer du code que d'anciens navigateurs ou d'anciennes versions de Node ne comprennent pas.

```
TIP D'ÉVOLUTION : avant, on visait souvent ES5 par défaut pour une compatibilité maximale.
Maintenant, en 2026, viser ES2022 (voire plus récent) pour du code backend Node est devenu
le standard, parce que les vieux navigateurs IE sont quasi inexistants, et Node supporte
nativement les fonctionnalités modernes depuis longtemps. Le choix dépend de ta cible réelle,
pas d'une habitude héritée.
```

---

## 3) STRICT : LE RÈGLEMENT QUI CHANGE TOUT

```json
{
 "strict": true  // active TOUTES les vérifications strictes d'un coup
}
```

`strict: true` n'est pas une seule option : c'est un interrupteur qui en active plusieurs en même temps.

```
strictNullChecks     --> null et undefined doivent être gérés explicitement
noImplicitAny       --> interdit les types "any" implicites (non déclarés)
strictFunctionTypes    --> vérifie la compatibilité des types de fonctions plus rigoureusement
strictPropertyInitialization --> force l'initialisation des propriétés de classe
alwaysStrict        --> émet du JS en mode strict ("use strict")
```

```ts
// SANS strictNullChecks :
function trouverPrisonnier(id: number): string {
 const prisonniers = { 1: "Michael", 2: "Lincoln" };
 return prisonniers[id]; // peut retourner undefined, mais TS te laisse faire
}

// AVEC strictNullChecks :
function trouverPrisonnier(id: number): string | undefined {
 const prisonniers: Record<number, string> = { 1: "Michael", 2: "Lincoln" };
 return prisonniers[id]; // TS T'OBLIGE à déclarer "| undefined", sinon erreur de compilation
}
```

**Qui casse en prod sans strict :** une fonction censée toujours retourner un `string` qui retourne en fait `undefined` dans un cas limite. Sans `strictNullChecks`, TypeScript laisse passer ça sans broncher. Le crash arrive en prod, là où ça coûte vraiment cher, alors que `strict: true` l'aurait bloqué à la compilation, gratuitement.

```
RÈGLE D'OR : démarre TOUJOURS un nouveau projet avec strict: true.
Désactiver une option stricte ponctuellement, après réflexion, c'est différent
de jamais l'avoir activée. La première approche est un choix. La seconde est une négligence.
```

---

## 4) ALLOWJS ET CHECKJS : LE PONT ENTRE JS ET TS

```json
{
 "allowJs": true,  // autorise les fichiers .js à coexister dans un projet TS
 "checkJs": true   // applique la vérification de type MÊME sur les fichiers .js
}
```

```js
// fichier.js, dans un projet avec allowJs + checkJs activés

/**
 * @param {number} distance
 * @param {number} vitesse
 * @returns {number}
 */
function calculerTemps(distance, vitesse) {
 return distance / vitesse;
}

calculerTemps("200", 50); // TS hurle, MÊME dans ce fichier .js, grâce à checkJs + JSDoc
```

**Technique :** `checkJs` combiné aux commentaires JSDoc (annotations de type dans les commentaires) permet de bénéficier de la vérification de type TypeScript SANS renommer le fichier en `.ts`. C'est le mécanisme central d'une migration progressive : tu gagnes en sécurité de type avant même d'avoir migré la syntaxe.

---

## 5) PATHS ET BASEURL : LES RACCOURCIS DU PLAN

```json
{
 "compilerOptions": {
  "baseUrl": "./src",
  "paths": {
   "@plans/*": ["plans/*"],
   "@comms/*": ["communications/*"]
  }
 }
}
```

```ts
// SANS paths, des imports relatifs qui deviennent vite illisibles :
import { RadioCrypte } from '../../../communications/radio';

// AVEC paths configurés :
import { RadioCrypte } from '@comms/radio';
```

**Qui casse en prod :** configurer `paths` dans `tsconfig.json` sans configurer l'équivalent côté bundler (Vite, Webpack) ou côté runtime Node. TypeScript compile sans erreur (il comprend `@comms/radio`), mais à l'exécution, Node ou le bundler ne savent pas résoudre cet alias, et ça plante avec un "module not found". `paths` est une info pour le compilateur TS, pas automatiquement pour tout le reste de la chaîne d'outils.

---

## 6) UN PROFIL DE CONFIG SELON LE CONTEXTE

```
PROJET GREENFIELD (parti de zéro), backend Node :
{
 "target": "ES2022",
 "module": "NodeNext",
 "strict": true,
 "esModuleInterop": true,
 "skipLibCheck": true
}

PROJET DE MIGRATION PROGRESSIVE :
{
 "allowJs": true,
 "checkJs": false,    // active fichier par fichier via JSDoc, pas globalement au début
 "strict": false,     // active progressivement, option par option, pas d'un coup
 "noImplicitAny": false  // souvent le dernier interrupteur qu'on active, le plus douloureux
}

LIBRAIRIE PUBLIÉE SUR NPM :
{
 "declaration": true,   // génère automatiquement les .d.ts pour les consommateurs
 "declarationMap": true, // permet de naviguer du .d.ts vers le .ts source en debug
 "strict": true
}
```

**Pourquoi ça compte :** il existe pas UN bon tsconfig universel. La config reflète où en est ton projet : un projet neuf peut se permettre toute la rigueur dès le départ, un projet en migration doit avancer par étapes pour pas tout bloquer d'un coup, une lib publiée a des besoins spécifiques (générer des `.d.ts` pour ses utilisateurs).

---

## EXERCICES

EXO 1 : Le règlement activé d'un coup :
Prends un petit projet TS avec `strict: false`, active `strict: true`, et compte combien d'erreurs de compilation apparaissent. Corrige-les une par une et note quel type d'erreur reviens le plus souvent (probablement `strictNullChecks` ou `noImplicitAny`).

EXO 2 : Le pont JS vers TS :
Crée un fichier `.js` avec des annotations JSDoc, active `allowJs` et `checkJs` dans ton `tsconfig.json`, et vérifie que TypeScript détecte bien une erreur de type dans ce fichier `.js` sans qu'il ait été renommé en `.ts`.

EXO 3 : L'alias qui casse à l'exécution :
Configure un alias dans `paths` (genre `@utils/*`), utilise-le dans un import, vérifie que `tsc` compile sans erreur. Puis essaie d'exécuter le JS compilé directement avec `node` (sans passer par un bundler qui résout les alias) et observe l'erreur "module not found". Explique en une phrase pourquoi `tsconfig.json` seul ne suffit pas pour que les alias fonctionnent partout.

---

## RÉSUMÉ

`tsconfig.json` détermine deux choses séparées : la sortie JS générée (`target`, `module`) et la rigueur de vérification (`strict` et ses sous-options). `strict: true` active plusieurs protections d'un coup, et désactiver une option stricte doit être un choix réfléchi, jamais un défaut négligé. `allowJs` et `checkJs` permettent une migration progressive en typant du JS via JSDoc sans renommage immédiat. `paths` est une info pour le compilateur TS uniquement : il faut la répliquer côté bundler ou runtime pour que ça fonctionne réellement à l'exécution. Le bon tsconfig dépend toujours du contexte du projet, pas d'un copier-coller universel.
