---
stability: intemporel
---

# TDD JOURNAL : RASENGAN ENGINE
Temps de lecture ~7 min

Ce journal trace l'ordre réel dans lequel les tests ont été écrits, pas l'ordre idéal a posteriori. Le cahier des charges impose : chaque fichier est testé avant de passer au suivant. Voici comment ça s'est vraiment passé.

---

## ÉTAPE 1 : `rng.js` : le socle déterministe

**Premier test écrit, avant tout le reste :**

```js
test('roll() retourne un nombre entre 0 et 1', () => {
 const valeur = rng.roll();
 expect(valeur).toBeGreaterThanOrEqual(0);
 expect(valeur).toBeLessThan(1);
});
```

Test vert immédiatement avec `Math.random()`. Mais le cahier des charges est clair : sans mode déterministe, tous les tests de combat plus tard seront flaky. Donc deuxième test, écrit avant d'avoir écrit la moindre ligne de `combat.js` :

```js
test('en mode test, roll() retourne les valeurs prédéfinies dans l\'ordre', () => {
 rng.setMode('test', [0.1, 0.9, 0.5]);
 expect(rng.roll()).toBe(0.1);
 expect(rng.roll()).toBe(0.9);
 expect(rng.roll()).toBe(0.5);
});
```

Rouge au début (`setMode` n'existait pas). Implémenté un état interne simple : un tableau de valeurs à consommer dans l'ordre, et un fallback sur `Math.random()` si le tableau est épuisé ou si on est en mode normal. Vert.

**Leçon retenue ici :** écrire ce test avant d'avoir besoin de `rng` dans le moteur a évité un blocage total trois étapes plus tard. Si ce test avait été écrit après `turnResolver.js`, il aurait fallu réécrire des appels déjà en place.

---

## ÉTAPE 2 : `cooldownCycle.js`

```js
test('tick() décrémente le cooldown sans descendre sous zéro', () => {
 expect(cooldownCycle.tick(2)).toBe(1);
 expect(cooldownCycle.tick(0)).toBe(0); // pas de négatif
});

test('isReady() retourne true seulement à cooldown 0', () => {
 expect(cooldownCycle.isReady(0)).toBe(true);
 expect(cooldownCycle.isReady(1)).toBe(false);
});
```

Vert rapidement. Aucune dépendance, comme prévu dans l'ordre de construction du cahier des charges.

---

## ÉTAPE 3 : `fighterStats.js` et les jutsus

Données statiques d'abord :

```js
test('getStats("naruto") retourne chakra, vitesse, force définis', () => {
 const stats = getStats('naruto');
 expect(stats.chakraMax).toBe(200);
 expect(stats.speed).toBeGreaterThan(0);
});
```

Puis les jutsus, testés comme de simples fonctions pures, sans passer par le moteur :

```js
test('rasengan() retourne des dégâts et un coût en chakra cohérents', () => {
 const resultat = rasengan({ attackerForce: 50 });
 expect(resultat.damages).toBeGreaterThan(0);
 expect(resultat.cooldown).toBeGreaterThan(0);
});
```

Aucune surprise ici : ce sont des fonctions pures testées isolément, exactement ce que prévoyait l'architecture.

---

## ÉTAPE 4 : `fighterFactory.js` : premier vrai test d'immutabilité

```js
test('crée un fighter Naruto avec les bonnes stats de base', () => {
 const naruto = createFighter('naruto');
 expect(naruto.chakra).toBe(200);
 expect(naruto.chakraMax).toBe(200);
});

test('retourne un nouvel objet à chaque appel (pas de référence partagée)', () => {
 const n1 = createFighter('naruto');
 const n2 = createFighter('naruto');
 n1.chakra = 0;
 expect(n2.chakra).toBe(200);
});
```

Le deuxième test a immédiatement attrapé un bug : la première version de `createFighter` retournait une référence vers un objet de stats partagé dans `fighterStats.js`, pas une copie. `n1.chakra = 0` modifiait aussi `n2.chakra`. Fix : `{ ...statsDeBase }` à la création de chaque fighter. Sans ce test, ce bug aurait survécu jusqu'au moteur de combat, où il aurait été beaucoup plus dur à localiser.

---

## ÉTAPE 5 : `turnResolver.js` : la zone de résistance annoncée

Le cahier des charges prévenait : c'est ici que la tentation de muter directement est la plus forte. Premier réflexe (mauvais, corrigé avant commit) :

```js
// Version rejetée avant même d'écrire le test
function resolveTurn(state) {
 state.attacker.chakra -= cost; // mutation directe
 return state;
}
```

Le test qui a forcé la bonne version :

```js
test('resolveTurn ne modifie pas l\'état reçu en entrée', () => {
 const stateInitial = { /* ... */ };
 const snapshot = structuredClone(stateInitial);

 resolveTurn(stateInitial);

 expect(stateInitial).toEqual(snapshot); // rien n'a changé sur l'original
});
```

Ce test a été écrit AVANT l'implémentation finale, volontairement, pour forcer la bonne architecture dès le départ plutôt que refactorer après coup. `resolveTurn` retourne maintenant un nouvel objet `{ ...state, attacker: { ...state.attacker, chakra: nouveauChakra } }`.

---

## ÉTAPE 6 : `combat.js` : la condition d'arrêt

```js
test('le combat s\'arrête quand un fighter atteint 0 chakra', () => {
 const result = startCombat(narutoSansChakra, sasuke);
 expect(result.winner).toBe('sasuke');
});

test('combat avec deux fighters identiques ne boucle pas à l\'infini', () => {
 const naruto1 = createFighter('naruto');
 const naruto2 = createFighter('naruto');
 const result = startCombat(naruto1, naruto2);
 expect(result.turns.length).toBeLessThan(1000); // garde-fou
});
```

Le deuxième test a révélé un vrai risque architectural : sans limite de tours explicite, deux fighters identiques avec le même RNG en mode test pouvaient produire une boucle techniquement finie mais beaucoup trop longue. Ajout d'un `maxTurns` par défaut dans `combat.start()`.

---

## RÉCAPITULATIF DE L'ORDRE RÉEL

```
1. rng.js (déterminisme d'abord, avant tout usage)
2. cooldownCycle.js
3. fighterStats.js + jutsus individuels
4. fighterFactory.js (révèle le bug de référence partagée)
5. turnResolver.js (test d'immutabilité écrit avant l'implémentation finale)
6. combat.js (révèle le besoin de maxTurns)
7. logger + index (pas de test unitaire, vérifié à l'oeil sur la sortie console)
```

Total : 58 tests à la fin, répartis sur les 4 fichiers de test.

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Section obligatoire (chantier v14 #15.5). À remplir avec au moins un exemple
concret par refactoring notable du projet :

- Version pré-refacto : ...
- Ce qui bloquait : ...
- Refacto appliqué : ...
- Test devenu possible : ...
