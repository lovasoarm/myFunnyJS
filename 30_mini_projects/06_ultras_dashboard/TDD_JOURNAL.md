---
stability: intemporel
---

# TDD JOURNAL : ULTRAS DASHBOARD
Temps de lecture ~6 min

Ce journal trace l'ordre réel dans lequel les tests ont été écrits. En TypeScript strict, les tests servent aussi à valider que les types se composent correctement. Un test qui ne compile pas est déjà un feedback utile.

---

## ÉTAPE 1 : Types d'abord : aucun test, mais la fondation

Avant d'écrire le premier test, les types sont définis. Ce n'est pas du code qui tourne, mais si les types sont faux, tout le reste l'est aussi.

```typescript
// types/events.ts
type MatchEvent<T extends EventPayload> = {
 id: string;
 type: string;
 timestamp: number;
 matchId: string;
 payload: T;
};

type PassEvent = MatchEvent<{ joueur: string; destinataire: string; zone: string }>;
type GoalEvent = MatchEvent<{ joueur: string; xG: number; minute: number }>;
```

Test de compilation : `npx tsc --noImplicitAny --noEmit`. Zero erreur = les types tiennent.

---

## ÉTAPE 2 : `validateStage.ts` : premier test réel

```typescript
test('accepte un event avec xG entre 0 et 1', () => {
 const event: GoalEvent = buildGoalEvent({ xG: 0.75 });
 expect(() => validateStage.process(event)).not.toThrow();
});

test('lève une ValidationError si xG > 1', () => {
 const event: GoalEvent = buildGoalEvent({ xG: 1.5 });
 expect(() => validateStage.process(event)).toThrow(ValidationError);
});

test('lève une ValidationError si timestamp dans le futur', () => {
 const event = buildGoalEvent({ timestamp: Date.now() + 9999999 });
 expect(() => validateStage.process(event)).toThrow(ValidationError);
});
```

TypeScript a attrapé une tentative de passer `{ xG: "0.75" }` (string au lieu de number) avant même de lancer le test. C'est exactement le rôle des types.

---

## ÉTAPE 3 : `gauges.ts` et `counters.ts`

```typescript
test('update() avec un GoalEvent incrémente xG cumulé', () => {
 const gauges = new Gauges();
 gauges.update(buildGoalEvent({ xG: 0.3 }));
 gauges.update(buildGoalEvent({ xG: 0.5 }));

 expect(gauges.snapshot().xGCumule).toBeCloseTo(0.8);
});

test('snapshot() retourne un objet Readonly, pas une référence mutable', () => {
 const gauges = new Gauges();
 const snap = gauges.snapshot();
 // TypeScript interdit la mutation ici au compile time
 // Ce test vérifie le comportement runtime
 expect(() => {
  (snap as any).xGCumule = 999;
 }).toThrow(); // Object.freeze() en pratique
});
```

Le test de `Readonly` a mené à `Object.freeze()` sur le snapshot. Sans ça, le dashboard pouvait muter accidentellement les métriques en les lisant.

---

## ÉTAPE 4 : `alertEngine.ts`

```typescript
test('déclenche une alerte si xG cumulé dépasse le seuil configuré', () => {
 const engine = new AlertEngine({ xGThreshold: 2.0 });
 const alerts = engine.check({ xGCumule: 2.5, possession: 55 });

 expect(alerts).toContainEqual(expect.objectContaining({
  type: 'xG_HIGH',
  valeur: 2.5,
  seuil: 2.0
 }));
});

test('aucune alerte si toutes les métriques sont sous les seuils', () => {
 const engine = new AlertEngine({ xGThreshold: 3.0 });
 const alerts = engine.check({ xGCumule: 1.0, possession: 50 });

 expect(alerts).toHaveLength(0);
});
```

---

## ÉTAPE 5 : `tracer.ts` avec correlation ID

```typescript
test('chaque span a un traceId unique', () => {
 const span1 = tracer.startSpan('requête-A');
 const span2 = tracer.startSpan('requête-B');

 expect(span1.traceId).not.toBe(span2.traceId);
});

test('closeSpan() enregistre la durée', () => {
 const span = tracer.startSpan('test');
 jest.advanceTimersByTime(50);
 const closed = tracer.closeSpan(span);

 expect(closed.durationMs).toBeGreaterThanOrEqual(50);
});
```

---

## ÉTAPE 6 : `pipelineRunner.ts` : tests d'intégration

```typescript
test('un event valide passe tous les stages et sort enrichi', async () => {
 const pipeline = new PipelineRunner([
  validateStage,
  enrichStage,
  aggregateStage,
 ]);
 const input = buildPassEvent({ joueur: 'Messi', zone: 'C' });
 const output = await pipeline.run(input);

 expect(output.enriched).toBe(true);
 expect(output.matchMinute).toBeDefined();
});

test('un event invalide arrête le pipeline au premier stage', async () => {
 const pipeline = new PipelineRunner([validateStage, enrichStage]);
 const invalid = buildGoalEvent({ xG: 99 });

 await expect(pipeline.run(invalid)).rejects.toThrow(ValidationError);
});
```

---

## RÉCAPITULATIF DE L'ORDRE RÉEL

```
1. Types (compilation check, pas de tests unitaires)
2. validateStage.ts
3. gauges.ts + counters.ts
4. alertEngine.ts
5. tracer.ts
6. pipelineRunner.ts (intégration des stages)
7. server.ts (pas de tests unitaires : vérifié via les routes)
```

Total : 41 tests à la fin, répartis sur 4 fichiers de test TypeScript.

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Section obligatoire (chantier v14 #15.5). À remplir avec au moins un exemple
concret par refactoring notable du projet :

- Version pré-refacto : ...
- Ce qui bloquait : ...
- Refacto appliqué : ...
- Test devenu possible : ...
