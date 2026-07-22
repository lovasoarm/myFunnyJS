---
stability: perissable_2027
---

# TS MIGRATION GUIDE : MIGRER DU JS PUR VERS TYPESCRIPT : SANS TOUT RÉÉCRIRE EN UNE NUIT
Temps de lecture ~9 min

Michael a jamais essayé de faire sortir tous les prisonniers de Fox River en une seule nuit, par la même porte. Trop risqué, trop de points de défaillance simultanés. Le plan se fait par étapes, chaque étape validée avant de passer à la suivante. Migrer un projet JS vers TypeScript, c'est exactement ce genre de plan : progressif, vérifié à chaque pas, jamais en un seul bloc.

---

## 1) POURQUOI "TOUT RÉÉCRIRE D'UN COUP" ÉCHOUE PRESQUE TOUJOURS

```
PLAN NAÏF :
"on bloque les nouvelles features pendant 2 semaines, on réécrit tout en TS"

CE QUI SE PASSE EN VRAI :
semaine 1  --> motivation au top, 30% du projet migré
semaine 2  --> ça traîne, des cas complexes bloquent, 50% migré
semaine 3  --> la pression business force à reprendre les nouvelles features
résultat  --> projet à moitié migré, état hybride cassé, pire qu'avant
```

**Pourquoi ça échoue structurellement :** une migration complète d'un coup, c'est un changement à fort risque sur TOUT le système en même temps, sans pouvoir isoler un problème. Si un bug apparaît après la migration, impossible de savoir s'il vient du fichier A, B, ou C parmi les 200 fichiers migrés simultanément.

```
RÈGLE D'OR : une migration réussie est INVISIBLE pour l'utilisateur final,
et VÉRIFIABLE à chaque étape pour l'équipe technique.
```

---

## 2) ÉTAPE 1 : ALLOWJS, LE SAS DE TRANSITION

```json
// tsconfig.json, première version, ultra permissive
{
 "compilerOptions": {
  "allowJs": true,
  "checkJs": false,
  "strict": false,
  "noEmitOnError": false
 },
 "include": ["src/**/*"]
}
```

```
ÉTAT DU PROJET APRÈS CETTE ÉTAPE :
src/
├── ancien-module.js   <-- toujours du JS pur, AUCUN changement requis
├── autre-module.js   <-- pareil
└── index.js       <-- pareil

Rien n'a changé dans le code. Le projet compile (tsc) sans qu'aucune ligne ait bougé.
```

**Technique :** `allowJs: true` permet à `tsc` de traiter des fichiers `.js` comme faisant partie du projet TypeScript, sans exiger qu'ils soient typés. C'est littéralement la porte qui reste ouverte le temps que le plan se mette en place, sans rien casser tout de suite.

---

## 3) ÉTAPE 2 : CHECKJS + JSDOC, TYPER SANS RENOMMER

```js
// ancien-module.js
// On ajoute des annotations JSDoc, le fichier reste un .js, RIEN ne change à l'exécution

/**
 * Calcule le temps restant avant le prochain comptage des prisonniers
 * @param {number} heureActuelle - heure actuelle en minutes depuis minuit
 * @param {number} heureComptage - heure du comptage en minutes depuis minuit
 * @returns {number} minutes restantes
 */
function tempsAvantComptage(heureActuelle, heureComptage) {
 return heureComptage - heureActuelle;
}

module.exports = { tempsAvantComptage };
```

```json
// tsconfig.json mis à jour
{
 "compilerOptions": {
  "allowJs": true,
  "checkJs": true  // <-- activé maintenant
 }
}
```

```js
// Quelque part ailleurs dans le projet :
tempsAvantComptage("8h00", 1200);
// TypeScript hurle MAINTENANT, sur du JS pur, grâce au JSDoc + checkJs :
// "Argument of type 'string' is not assignable to parameter of type 'number'"
```

**Pourquoi cette étape compte :** tu gagnes la vérification de type AVANT même de migrer la syntaxe. C'est le moment où la migration commence à rapporter concrètement, sans avoir renommé un seul fichier.

---

## 4) ÉTAPE 3 : MIGRATION FICHIER PAR FICHIER, EN PARTANT DES FEUILLES

```
GRAPHE DE DÉPENDANCES TYPIQUE D'UN PROJET :

index.js
 └── routes.js
    └── controllers.js
       └── utils.js   <-- AUCUNE dépendance interne, c'est une "feuille"
       └── validators.js <-- pareil, une feuille
```

```
ORDRE DE MIGRATION RECOMMANDÉ : des feuilles vers la racine

1. utils.js --> utils.ts    (zéro dépendance interne à gérer)
2. validators.js --> validators.ts (idem)
3. controllers.js --> controllers.ts (dépend de utils et validators, DÉJÀ migrés)
4. routes.js --> routes.ts
5. index.js --> index.ts (en dernier, c'est la racine de tout)
```

**Technique :** migrer en partant des fichiers sans dépendances internes (les "feuilles" du graphe) garantit que chaque fichier migré peut être typé correctement sans attendre que d'autres fichiers le soient aussi. Migrer dans le mauvais sens (la racine en premier) force à typer des appels vers du code encore non typé, ce qui multiplie les `any` temporaires.

```js
// utils.ts, premier fichier migré
export function genererIdEvasion(prefixe: string, numero: number): string {
 return `${prefixe}-${numero.toString().padStart(4, '0')}`;
}
```

```
Qui casse en prod : migrer un fichier "racine" en premier (genre index.js),
alors qu'il dépend de 15 autres fichiers encore en JS pur.
Résultat : le fichier migré est truffé de "any" en attendant que le reste suive,
et tu perds l'intérêt principal de TypeScript sur ce fichier précis.
```

---

## 5) ÉTAPE 4 : RENFORCER LA STRICTNESS PROGRESSIVEMENT

```json
// Progression typique sur plusieurs semaines/mois, PAS en un coup

// Semaine 1 : base permissive
{ "strict": false, "noImplicitAny": false }

// Semaine 3 : première contrainte, la plus simple à corriger
{ "strict": false, "noImplicitAny": true }

// Semaine 6 : la grosse contrainte, gestion du null/undefined
{ "strict": false, "noImplicitAny": true, "strictNullChecks": true }

// Semaine 10 : tout activé, le projet est mûr
{ "strict": true }
```

**Pourquoi dans cet ordre :** `noImplicitAny` force à déclarer des types explicites, c'est fastidieux mais rarement complexe à corriger. `strictNullChecks` force à gérer chaque cas où une valeur peut être absente, c'est souvent plus profond et révèle de vrais bugs latents. Activer `strictNullChecks` en dernier, une fois le reste stabilisé, évite d'être submergé par deux types de douleur en même temps.

---

## 6) LE SIGNAL QUE LA MIGRATION EST TERMINÉE

```
checklist de fin de migration :
[ ] plus aucun fichier .js dans src/ (sauf exceptions documentées et justifiées)
[ ] strict: true activé sans exception désactivée
[ ] zéro "any" non justifié (un any commenté avec sa raison, c'est différent d'un any oublié)
[ ] allowJs peut être désactivé sans casser la compilation
```

```json
// tsconfig.json final, projet entièrement migré
{
 "compilerOptions": {
  "strict": true,
  "allowJs": false,  // plus besoin, signe que la migration est complète
  "noUnusedLocals": true,
  "noUnusedParameters": true
 }
}
```

---

## EXERCICES

EXO 1 : Le sas ouvert :
Prends un petit projet JS existant (ou crée-en un minimal, 3-4 fichiers avec des dépendances entre eux). Configure un `tsconfig.json` avec `allowJs: true` et vérifie que `tsc` compile le projet sans une seule erreur, sans avoir touché au code.

EXO 2 : Typer sans renommer :
Sur ce même projet, ajoute des annotations JSDoc à une fonction, active `checkJs: true`, et introduis volontairement un appel avec un mauvais type d'argument. Vérifie que TypeScript le détecte, toujours sur un fichier `.js` non renommé.

EXO 3 : La migration ordonnée :
Identifie dans ton petit projet quel fichier est une "feuille" (zéro dépendance interne) et lequel est la "racine". Migre-les dans le bon ordre (feuilles d'abord), fichier par fichier, en renommant `.js` en `.ts` et en ajoutant les types. Note combien de `any` temporaires t'as dû utiliser, et pourquoi.

---

## RÉSUMÉ

Une migration JS vers TS réussie avance par étapes vérifiables, jamais d'un seul bloc risqué. `allowJs` ouvre le sas sans rien casser, `checkJs` + JSDoc apporte la vérification de type avant même de renommer un fichier. La migration fichier par fichier suit l'ordre du graphe de dépendances : les feuilles d'abord, la racine en dernier, pour éviter une cascade de `any` temporaires. La strictness se renforce progressivement, `noImplicitAny` avant `strictNullChecks`, parce que les deux douleurs combinées d'un coup découragent l'équipe. Le signal de fin : plus de JS dans le projet, `strict: true` sans exception, et `allowJs` qui devient inutile.
