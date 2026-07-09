---
stability: intemporel
---

# TDD JOURNAL : WALKING DEAD PROTOCOL
Temps de lecture ~8 min

Ce projet a deux phases distinctes, et ce journal les sépare clairement, comme l'exige le cahier des charges : phase 1 (couvrir le legacy par les tests, sans y toucher), phase 2 (TDD pur sur la v2).

---

## PHASE 1 : COUVRIR `legacy/campV1.js`

## Lecture du legacy avant tout test

Avant d'écrire la moindre ligne de test, lecture complète de `campV1.js`. Aucune fonction exportée proprement : tout est dans `runCamp()`, une fonction de 300 lignes avec des variables globales (`let stockNourriture`, `let niveauxMenace`, etc.) modifiées un peu partout dans le fichier.

**Première décision de méthode :** impossible de tester des fonctions internes qui n'existent pas en tant qu'unités isolées. La seule interface testable du v1, c'est sa sortie console et son fichier de persistance JSON. Donc phase 1 = tests de bout en bout sur le comportement observable, pas des tests unitaires classiques.

## Premier test sur le legacy

```js
test('legacy : campV1 affiche le statut initial correctement', () => {
 const output = runLegacyCamp(['status']);
 expect(output).toContain('Alexandria');
 expect(output).toContain('jour');
});
```

Vert directement : on décrit ce que le code fait déjà, pas ce qu'il devrait faire. Ce n'est pas du TDD ici, c'est de la caractérisation (characterization testing) : capturer le comportement existant tel qu'il est, bugs compris s'il y en a.

## Le test qui a révélé un comportement surprenant du v1

```js
test('legacy : consume avec une quantité supérieure au stock', () => {
 const output = runLegacyCamp(['consume', 'food', '9999']);
 expect(output).toContain('jours restants');
});
```

Ce test a révélé que `campV1.js` ne valide jamais la quantité consommée. Une consommation de 9999 unités de nourriture fait passer le stock en négatif silencieusement, et affiche quand même "jours restants : -340" sans aucune erreur. C'est un bug du v1. Le test l'a capturé tel quel (le test attend ce comportement bugué), avec un commentaire explicite :

```js
// NOTE : ce test capture un bug connu du v1 (pas de validation de quantité).
// La v2 corrige ce comportement. Voir POSTMORTEM.md pour la décision.
```

**Pourquoi ne pas corriger le test pour qu'il attende le bon comportement :** la phase 1 a un seul but, décrire le v1 tel qu'il est, pour pouvoir comparer objectivement avec la v2 ensuite. Un test "corrigé" à ce stade ne décrit plus le legacy, il décrit une intention.

## Tests sur guards et security (legacy)

Même méthode appliquée à `guards.test.js` et `security.test.js` : observer la sortie console du v1 pour chaque commande, écrire le test qui la capture, sans jugement sur si c'est "bien" ou "mal".

**Fin de la phase 1 :** 19 tests de caractérisation, tous verts sur le v1, qui décrivent fidèlement (bugs inclus) le comportement du legacy. C'est le filet de sécurité de référence.

---

## PHASE 2 : TDD PUR SUR LA V2

## `fileStore.js`

```js
test('write puis read retourne les mêmes données', async () => {
 await fileStore.write('test.json', { a: 1 });
 const data = await fileStore.read('test.json');
 expect(data).toEqual({ a: 1 });
});
```

Vert rapidement avec `fs.promises`. Zéro dépendance comme prévu.

## `inventoryService.js` : le premier vrai test rouge du TDD

Red d'abord, volontairement, avant toute implémentation :

```js
test('consume throw si quantité insuffisante', () => {
 const inv = { food: { units: 10, dailyConsumption: 3 } };
 expect(() => consume(inv, 'food', 100)).toThrow('InsufficientResourceError');
});
```

Rouge (la fonction n'existe même pas encore). Implémentation minimale pour passer au vert : validation explicite avant toute opération. Ce test seul a corrigé, dans la v2, le bug exact capturé dans la phase 1 sur le v1. C'est noté dans `POSTMORTEM.md` comme une différence de comportement assumée.

```js
test('consume ne mute pas l\'inventaire original', () => {
 const inv = { food: { units: 42, dailyConsumption: 3 } };
 consume(inv, 'food', 9);
 expect(inv.food.units).toBe(42);
});
```

Ce test a forcé `consume` à retourner un nouvel objet (`{ ...inv, food: { ...inv.food, units: inv.food.units - amount } }`) plutôt que de muter l'inventaire reçu. Cohérent avec la règle du projet : les services ne mutent jamais, ils retournent un nouvel état.

## `guardService.js` : le cas limite du poste vacant

Test du cas limite 2 du cahier des charges, écrit avant l'implémentation :

```js
test('rotate priorise le remplissage d\'un poste vacant plutôt qu\'une rotation normale', () => {
 const guards = { postA: 'Daryl', postB: null }; // poste B vacant
 const result = rotateGuards(guards, ['Glenn', 'Carl']);
 expect(result.postB).not.toBeNull(); // priorité au poste vacant
});
```

Rouge au premier essai : la première implémentation faisait juste une rotation circulaire classique sans vérifier les postes vides. Réécrit pour trier les postes vacants en premier avant d'appliquer la rotation normale sur le reste.

## `handlers/` + `commandRouter.js` + `cli.js`

```js
test('status affiche les ressources du camp', () => {
 const output = execSync('node src/cli.js status', { encoding: 'utf-8' });
 expect(output).toContain('CAMP');
});
```

Vert une fois le routeur branché correctement. Pas de surprise architecturale ici : le pattern handler/router est direct.

## `threatSimulator.js` (Worker Thread) : la zone de résistance annoncée

```js
test('le thread principal reçoit un événement threat du Worker', (done) => {
 const worker = new Worker('./src/workers/threatSimulator.js', {
  workerData: { intensity: 'haute', duration: 100, perimeters: ['sud'] }
 });

 worker.on('message', (msg) => {
  expect(msg.type).toBe('threat');
  worker.terminate();
  done();
 });
});
```

Le premier essai a fait planter Jest par timeout : le Worker ne terminait jamais de lui-même, le test attendait indéfiniment. Fix : ajout d'un `worker.terminate()` explicite dès que le premier message attendu arrive, plutôt que d'attendre que le Worker se termine naturellement.

Test du cas limite 5 (Worker qui plante) :

```js
test('une exception dans le Worker ne crashe pas le process principal', (done) => {
 const worker = new Worker('./src/workers/threatSimulator.js', {
  workerData: { intensity: 'invalide' } // déclenche une erreur volontaire dans le Worker
 });

 worker.on('error', (err) => {
  expect(err).toBeDefined();
  done(); // le test passe SI l'erreur est capturée proprement, pas si le process crashe
 });
});
```

## `e2e/campWorkflow.spec.js`

Écrits en dernier, une fois toutes les commandes individuellement testées. Deux scénarios complets, du `reset` jusqu'à la vérification finale, exactement comme prévu dans le cahier des charges.

---

## RÉCAPITULATIF DE L'ORDRE RÉEL

```
PHASE 1 (caractérisation du legacy)
1. Lecture complète de campV1.js
2. tests/inventory.test.js sur le v1 (révèle le bug de validation manquante)
3. tests/guards.test.js sur le v1
4. tests/security.test.js sur le v1

PHASE 2 (TDD sur la v2)
5. fileStore.js
6. inventoryService.js (corrige le bug capturé en phase 1, immutabilité forcée par test)
7. guardService.js (cas limite poste vacant, rouge puis vert)
8. securityService.js + alertService.js
9. handlers + router + cli.js
10. threatSimulator.js (Worker Thread, fix du timeout de test)
11. scenarioReplayer.js
12. e2e/campWorkflow.spec.js
```

Total : 76 tests unitaires/intégration + 8 scénarios E2E.

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Section obligatoire (chantier v14 #15.5). À remplir avec au moins un exemple
concret par refactoring notable du projet :

- Version pré-refacto : ...
- Ce qui bloquait : ...
- Refacto appliqué : ...
- Test devenu possible : ...
