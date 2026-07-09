---
stability: intemporel
---

# TDD JOURNAL : GARO NO KRONIKA
Temps de lecture ~8 min

---

## ÉTAPE 1 : `errors/` : les trois erreurs custom, en premier

Avant d'écrire la moindre logique async, les trois classes d'erreur sont testées seules :

```js
test('ArmorCollapseError porte les métadonnées du Chevalier et de la durée', () => {
 const err = new ArmorCollapseError({ knight: 'leon', duration: 102 });
 expect(err.name).toBe('ArmorCollapseError');
 expect(err.knight).toBe('leon');
 expect(err.duration).toBe(102);
 expect(err).toBeInstanceOf(Error);
});
```

Vert immédiatement. Aucune surprise : ce sont des classes simples étendant `Error`. L'intérêt de les écrire en premier : tout le reste du projet va les lancer et les catcher, donc leur forme exacte (quelles métadonnées, quel nom) doit être fixée avant que `missionRunner.js` n'existe.

---

## ÉTAPE 2 : `armor.js` : premier vrai test async

```js
test('equip() résout quand le délai de préparation est écoulé', async () => {
 const leon = createKnight('leon');
 const armor = await equipArmor(leon);
 expect(armor.equipped).toBe(true);
});
```

Vert. Mais le deuxième test a immédiatement posé un problème de conception :

```js
test('timeout reject avec ArmorCollapseError après le délai', async () => {
 const leon = createKnight('leon');
 const { timeout } = await equipArmor(leon);
 await expect(timeout(50)).rejects.toThrow('ArmorCollapseError');
});
```

Rouge au début : la première version de `equipArmor` ne retournait pas de fonction `timeout` réutilisable, elle lançait un `setTimeout` interne directement. Impossible à tester avec un délai court sans modifier le vrai timer de 99,9 secondes. Fix : `equipArmor` retourne `{ equipped, timeout(ms) }`, où `timeout` est une fonction qui crée une Promise qui reject après `ms`. En prod elle est appelée avec `99900`, en test avec `50`.

**Leçon retenue :** un timer codé en dur dans une fonction async est un piège pour les tests. Le rendre paramétrable (même avec une valeur par défaut) coûte rien et rend tout testable sans attendre 99,9 secondes à chaque run de la suite.

---

## ÉTAPE 3 : `knight.js` + `streamEmitter.js`/`streamReceiver.js`

Testés ensemble volontairement, parce que l'un n'a aucun sens sans l'autre :

```js
test('un événement émis par le Chevalier est reçu par le Conseil', () => {
 const events = [];
 streamReceiver.on('combat:update', (e) => events.push(e));

 streamEmitter.emit('combat:update', { knight: 'leon', hp: 80 });

 expect(events).toHaveLength(1);
 expect(events[0].knight).toBe('leon');
});
```

Vert directement : `EventEmitter` natif de Node fait exactement ce qui est attendu. Le vrai test qui comptait est venu ensuite :

```js
test('le Conseil ne plante pas si un événement arrive après la fin de la mission', () => {
 streamReceiver.on('combat:update', (e) => { /* traite normalement */ });
 // on simule la fin de la mission, puis un événement tardif
 finalizeMission('leon');
 expect(() => streamEmitter.emit('combat:update', { knight: 'leon' })).not.toThrow();
});
```

Ce test correspond directement au cas limite 4 du cahier des charges. Il a forcé une vérification dans le handler du Conseil : ignorer silencieusement (avec un log, pas un crash) un événement dont la mission est déjà clôturée.

---

## ÉTAPE 4 : `combat.js`

```js
test('fight() résout avec une durée et un résultat', async () => {
 const result = await fight(createKnight('leon'), { name: 'Anima', level: 'CRITIQUE' });
 expect(result.duration).toBeGreaterThan(0);
 expect(['victoire', 'defaite']).toContain(result.outcome);
});
```

Vert. Fonction async simple, pas de surprise.

---

## ÉTAPE 5 : `missionRunner.js` : la zone de résistance annoncée

Le test le plus important du projet, écrit avant l'implémentation finale, pour forcer la bonne structure :

```js
test('Promise.race rejette avec ArmorCollapseError si le combat dépasse le timeout', async () => {
 const combatLent = () => new Promise((resolve) => setTimeout(resolve, 200)); // plus lent que le timeout
 const result = runMission(createKnight('leon'), horrorFort, { timeoutMs: 50, combatFn: combatLent });

 await expect(result).rejects.toBeInstanceOf(ArmorCollapseError);
});
```

Rouge au premier essai. La première version de `missionRunner.js` faisait `Promise.race([combat.fight(...), timeoutPromise])` mais le `timeoutPromise` rejetait avec une erreur générique (`new Error('timeout')`), pas avec `ArmorCollapseError`. Fix : le timeout interne construit explicitement l'erreur typée avec ses métadonnées avant de reject.

Deuxième round de tests, sur la distinction erreur fatale / erreur récupérable :

```js
test('un Horror qui résiste plus longtemps que prévu ne lève pas ArmorCollapseError tant que le timeout n\'est pas atteint', async () => {
 const combatLong = () => new Promise((resolve) => setTimeout(() => resolve({ outcome: 'victoire', duration: 90 }), 90));
 const result = await runMission(createKnight('leon'), horrorResistant, { timeoutMs: 99900, combatFn: combatLong });

 expect(result.outcome).toBe('victoire');
});
```

Ce test a confirmé que `Promise.race` fait bien la distinction attendue par construction : tant que le combat résout avant le timeout, peu importe que ce soit long, ce n'est pas une erreur.

---

## ÉTAPE 6 : `dispatcher.js` : allSettled, pas all

```js
test('allSettled retourne les deux résultats même si une mission échoue', async () => {
 const horrors = [{ location: 'Est', level: 'CRITIQUE' }, { location: 'Ouest', level: 'MODÉRÉ' }];
 const knights = [{ id: 'leon', available: true }, { id: 'alfonso', available: true }];

 const results = await dispatch(horrors, knights);

 expect(results).toHaveLength(2);
 results.forEach(r => expect(['fulfilled', 'rejected']).toContain(r.status));
});
```

Vert dès la première implémentation, parce que le choix de `Promise.allSettled` plutôt que `Promise.all` avait été pris avant d'écrire ce test (voir ADR 003). Si `Promise.all` avait été utilisé par erreur, ce test aurait explosé : une seule mission rejetée aurait fait planter tout le `dispatch`, masquant le résultat de l'autre mission.

Test du cas limite 2 (plus de Horrors que de Chevaliers) :

```js
test('un Horror sans Chevalier disponible déclenche HorrorEscapeError sans bloquer les autres missions', async () => {
 const horrors = [{ location: 'Est' }, { location: 'Ouest' }, { location: 'Nord' }];
 const knights = [{ id: 'leon', available: true }]; // un seul chevalier dispo

 const results = await dispatch(horrors, knights);

 const escaped = results.filter(r => r.status === 'rejected');
 expect(escaped.length).toBeGreaterThanOrEqual(2);
});
```

---

## RÉCAPITULATIF DE L'ORDRE RÉEL

```
1. errors/ (forme fixée avant tout usage ailleurs)
2. armor.js (révèle le besoin de timeout paramétrable)
3. knight.js + stream (testés ensemble, cas limite 4 confirmé)
4. combat.js
5. missionRunner.js (test écrit avant l'implémentation finale, deux rounds)
6. dispatcher.js (confirme le choix allSettled fait dans l'ADR 003)
7. council.js + index (pas de test unitaire isolé, vérifié sur la démo complète)
```

Total : 54 tests à la fin.

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Section obligatoire (chantier v14 #15.5). À remplir avec au moins un exemple
concret par refactoring notable du projet :

- Version pré-refacto : ...
- Ce qui bloquait : ...
- Refacto appliqué : ...
- Test devenu possible : ...
