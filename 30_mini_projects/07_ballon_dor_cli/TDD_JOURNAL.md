---
stability: intemporel
---

# TDD JOURNAL : BALLON D'OR CLI
Temps de lecture ~6 min

Ce journal trace l'ordre réel dans lequel les tests ont été écrits. Ce projet a une particularité : la v1 existait déjà, non testée. L'ordre de travail a donc été : tester la v1 existante → identifier les smells → refactorer → valider que les tests passent encore.

---

## PHASE 1 : TESTS DE CARACTÉRISATION SUR LA V1

Avant de toucher une seule ligne de la v1, écrire des tests qui capturent son comportement actuel. Pas pour dire que ce comportement est correct, mais pour savoir quand on le casse en refactorant.

```js
// Tests de caractérisation sur la v1 spaghetti
test('vote() enregistre un vote et l\'écrit sur le disque', () => {
 // Setup : créer un fichier de votes temporaire
 const tempPath = './tests/fixtures/votes_test.json';
 fs.writeFileSync(tempPath, '[]');

 vote('Vinicius Jr', 'LEquipe', 7, tempPath);

 const votes = JSON.parse(fs.readFileSync(tempPath, 'utf8'));
 expect(votes).toHaveLength(1);
 expect(votes[0].joueur).toBe('Vinicius Jr');
 expect(votes[0].points).toBe(7);
});
```

Ces tests de caractérisation ont révélé un comportement de la v1 non documenté : si le fichier JSON n'existe pas, `vote()` plante avec un `SyntaxError` non catchée au lieu de créer le fichier. Documenté avant de corriger.

---

## PHASE 2 : TESTS SUR LES ERREURS CUSTOM

```js
test('InvalidVoteError : lève une erreur si points hors de [1, 10]', () => {
 expect(() => new VoteCommand().execute({
  joueur: 'Vinicius Jr', journaliste: 'LEquipe', points: 11
 })).toThrow(InvalidVoteError);
});

test('PlayerNotFoundError : lève une erreur si le joueur n\'est pas dans la liste', () => {
 expect(() => new VoteCommand().execute({
  joueur: 'Ronaldo le Fenomène', journaliste: 'Marca', points: 7
 })).toThrow(PlayerNotFoundError);
});

test('QuotaExceededError : lève une erreur si le journaliste a voté 3 fois aujourd\'hui', () => {
 for (let i = 0; i < 3; i++) {
  new VoteCommand().execute({ joueur: 'Bellingham', journaliste: 'BBC', points: i + 1 });
 }
 expect(() => new VoteCommand().execute({
  joueur: 'Pedri', journaliste: 'BBC', points: 5
 })).toThrow(QuotaExceededError);
});
```

Le test `QuotaExceededError` a révélé que le comptage des votes par journaliste et par jour nécessite de comparer les timestamps. Première implémentation utilisait la date complète ISO (incluant les secondes). Fix : tronquer au jour avec `new Date().toISOString().split('T')[0]`.

---

## PHASE 3 : `voteStore.js` en isolation

```js
test('save() crée le fichier s\'il n\'existe pas', () => {
 const store = new VoteStore('./tests/tmp/nouveau.json');
 store.save({ joueur: 'Messi', points: 9 });

 expect(fs.existsSync('./tests/tmp/nouveau.json')).toBe(true);
});

test('readAll() retourne un tableau vide si le fichier est vide', () => {
 const store = new VoteStore('./tests/tmp/vide.json');
 expect(store.readAll()).toEqual([]);
});

test('save() et readAll() sont cohérents (round-trip)', () => {
 const store = new VoteStore('./tests/tmp/roundtrip.json');
 const vote = { joueur: 'Bellingham', journaliste: 'BBC', points: 8 };
 store.save(vote);

 const votes = store.readAll();
 expect(votes).toContainEqual(vote);
});
```

---

## PHASE 4 : `rankCommand.js`

```js
test('rank() trie les joueurs par points décroissants', () => {
 const store = new VoteStore('./tests/fixtures/votes_pre_remplis.json');
 const classement = new RankCommand(store).execute();

 expect(classement[0].points).toBeGreaterThanOrEqual(classement[1].points);
 expect(classement[0].points).toBeGreaterThanOrEqual(classement[2].points);
});

test('rank() groupe les votes par joueur avant de classer', () => {
 // 3 votes pour Vinicius, 2 pour Bellingham
 const classement = new RankCommand(storeAvecVotes).execute();
 expect(classement[0].joueur).toBe('Vinicius Jr');
});
```

---

## RÉCAPITULATIF DE L'ORDRE RÉEL

```
1. Tests de caractérisation sur la v1 (sans modifier le code)
2. Erreurs custom (InvalidVoteError, PlayerNotFoundError, QuotaExceededError)
3. voteStore.js (persistence isolée)
4. voteCommand.js (logique métier avec les erreurs)
5. rankCommand.js (agrégation et tri)
6. exportCommand.js (CSV)
7. simCommand.js (Worker Threads : testé via integration, pas unitaire)
```

Total : 38 tests à la fin, répartis sur 4 fichiers de test.

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Section obligatoire (chantier v14 #15.5). À remplir avec au moins un exemple
concret par refactoring notable du projet :

- Version pré-refacto : ...
- Ce qui bloquait : ...
- Refacto appliqué : ...
- Test devenu possible : ...
