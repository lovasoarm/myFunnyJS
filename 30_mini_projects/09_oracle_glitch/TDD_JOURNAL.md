---
stability: intemporel
---

# TDD JOURNAL : ORACLE GLITCH
Temps de lecture ~6 min

Ce journal trace l'ordre réel dans lequel les tests ont été écrits. Ce projet a une contrainte dure : aucun test ne doit appeler l'API Anthropic. L'objectif est de tester la logique du pipeline, pas le comportement de l'IA.

---

## ÉTAPE 1 : `schemas/analysisSchema.js` : définir ce qu'on attend

Avant de coder le validator, définir le schéma exact. C'est lui qui est la source de vérité.

```js
const analysisSchema = z.object({
 bugs: z.array(z.object({
  ligne: z.number().int().positive(),
  description: z.string().min(1),
  severite: z.enum(['critique', 'majeur', 'mineur']),
 })),
 fixes: z.array(z.object({
  ligneCible: z.number().int().positive(),
  codeFix: z.string().min(1),
  explication: z.string().min(1),
 })),
 tests: z.array(z.string().min(1)),
});
```

Pas de test Jest ici : le schéma est validé implicitement dans les tests du validator.

---

## ÉTAPE 2 : `LLMOutputValidator.js` : tester les cas qui cassent

```js
test('accepte une sortie IA valide', () => {
 const validOutput = {
  bugs: [{ ligne: 12, description: 'NaN comparison', severite: 'critique' }],
  fixes: [{ ligneCible: 12, codeFix: 'use Number.isNaN()', explication: 'NaN !== NaN' }],
  tests: ['expect(Number.isNaN(NaN)).toBe(true)'],
 };
 expect(() => validator.validate(validOutput)).not.toThrow();
});

test('rejette si bugs est absent', () => {
 expect(() => validator.validate({ fixes: [], tests: [] })).toThrow(MalformedResponseError);
});

test('rejette si severite n\'est pas dans l\'enum autorisé', () => {
 const badOutput = {
  bugs: [{ ligne: 5, description: 'x', severite: 'CATASTROPHIQUE' }],
  fixes: [], tests: [],
 };
 expect(() => validator.validate(badOutput)).toThrow(MalformedResponseError);
});
```

---

## ÉTAPE 3 : Edge cases : les pièges réels de l'IA

```js
// NaN : l'IA confond souvent NaN === NaN et Number.isNaN()
test('détecte un fix qui prétend que NaN === NaN est true', () => {
 const badFix = {
  bugs: [],
  fixes: [{
   ligneCible: 3,
   codeFix: 'if (x === NaN) return true; // NaN === NaN est true',
   explication: '...'
  }],
  tests: [],
 };
 expect(() => validator.validate(badFix)).toThrow(ValidationError);
 // LLMOutputValidator.js vérifie les patterns connus d'erreur IA dans le code
});

// JSON tronqué : l'IA peut s'arrêter à mi-chemin
test('rejette un JSON tronqué (réponse incomplète)', () => {
 const truncated = '{ "bugs": [{ "ligne": 5, "description": "err'; // coupé
 expect(() => validator.validateRaw(truncated)).toThrow(MalformedResponseError);
});

// 0.1 + 0.2 dans les métriques
test('signale 0.1 + 0.2 === 0.3 comme une erreur d\'égalité flottante dans le fix', () => {
 const badFix = {
  bugs: [],
  fixes: [{
   ligneCible: 7,
   codeFix: 'if (0.1 + 0.2 === 0.3) return true;',
   explication: '...'
  }],
  tests: [],
 };
 expect(() => validator.validate(badFix)).toThrow(ValidationError);
});

// undefined au milieu d'un tableau
test('rejette un tableau fixes contenant undefined', () => {
 const withUndefined = {
  bugs: [],
  fixes: [undefined, { ligneCible: 3, codeFix: 'x', explication: 'x' }],
  tests: [],
 };
 expect(() => validator.validate(withUndefined)).toThrow(MalformedResponseError);
});
```

---

## ÉTAPE 4 : `streamingClient.js` : mocking de l'API

```js
// Le mock simule le streaming token par token
jest.mock('./src/streaming/streamingClient.js', () => ({
 stream: jest.fn().mockImplementation(async (prompt, onToken) => {
  const tokens = ['{"bugs":', ' []', ', "fixes":', ' []', ', "tests":', ' []}'];
  for (const token of tokens) {
   await new Promise(r => setTimeout(r, 10));
   onToken(token);
  }
 })
}));

test('assemble correctement les tokens en JSON valide', async () => {
 const result = await analyzeFile('./tests/fixtures/simple.js');
 expect(result.bugs).toEqual([]);
 expect(result.fixes).toEqual([]);
});
```

Test de timeout :

```js
test('lève LLMTimeoutError si l\'IA ne répond plus après 3s', async () => {
 jest.mocked(streamingClient.stream).mockImplementation(async () => {
  await new Promise(r => setTimeout(r, 5000)); // bloque pour toujours
 });

 await expect(analyzeWithTimeout('./tests/fixtures/simple.js', 3000))
  .rejects.toThrow(LLMTimeoutError);
}, 6000); // timeout Jest plus grand que le timeout du système
```

---

## ÉTAPE 5 : `CodeAnalyzer.js` : analyse statique

```js
test('détecte un == au lieu de === dans le code cible', () => {
 const code = 'if (x == null) return;';
 const analysis = new CodeAnalyzer().analyze(code);
 expect(analysis.suspects).toContain('loose-equality');
});

test('détecte un NaN direct au lieu de Number.isNaN()', () => {
 const code = 'if (x === NaN) return false;';
 const analysis = new CodeAnalyzer().analyze(code);
 expect(analysis.suspects).toContain('nan-comparison');
});
```

---

## RÉCAPITULATIF DE L'ORDRE RÉEL

```
1. analysisSchema.js (schéma Zod, pas de test Jest)
2. LLMOutputValidator.js (tests de validation incluant les edge cases)
3. streamingClient.js (mock complet de l'API)
4. CodeAnalyzer.js (analyse statique)
5. PromptBuilder.js (construction du prompt)
6. cli.js (intégration finale, testé via les modules précédents)
```

Total : 52 tests à la fin, répartis sur 4 fichiers de test.

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Section obligatoire (chantier v14 #15.5). À remplir avec au moins un exemple
concret par refactoring notable du projet :

- Version pré-refacto : ...
- Ce qui bloquait : ...
- Refacto appliqué : ...
- Test devenu possible : ...
