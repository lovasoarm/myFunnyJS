---
stability: intemporel
---

# TDD JOURNAL : TRAPSOUL RADIO
Temps de lecture ~6 min

Ce journal trace l'ordre réel dans lequel les tests ont été écrits. Ce projet a une contrainte inhabituelle : les tests d'accessibilité (a11y) et les tests TypeScript sont aussi importants que les tests de logique métier.

---

## ÉTAPE 1 : Types de traduction : test de compilation

```typescript
// types/i18n.ts
type TranslationKeys = {
 'player.play': string;
 'player.pause': string;
 'player.skip': string;
 'track.duration': string;
 'track.artist': string;
 'playlist.empty': string;
};

type Translation = Record<keyof TranslationKeys, string>;
```

Test : créer une traduction incomplète volontairement.

```typescript
// Ce code DOIT provoquer une erreur de compilation
const incomplet: Translation = {
 'player.play': 'Play',
 // 'player.pause' manquant
};
// TypeScript : Property 'player.pause' is missing in type...
```

Si TypeScript ne signale pas ça, les types sont mal définis. Ce "test" ne tourne pas avec Jest : c'est `npx tsc --noEmit` qui le valide.

---

## ÉTAPE 2 : `i18nService.ts`

```typescript
test('getTranslation() retourne la traduction correcte pour une clé donnée', () => {
 const service = new I18nService('fr');
 expect(service.get('player.play')).toBe('Lire');
});

test('getTranslation() utilise le fallback anglais si la clé manque en malgache', () => {
 const service = new I18nService('mg');
 // 'track.duration' n'existe pas encore en malgache
 expect(service.get('track.duration')).toBe('Duration'); // fallback EN
});

test('pluralize() gère les règles de pluralisation par locale', () => {
 const fr = new I18nService('fr');
 expect(fr.pluralize('track', 1)).toBe('1 morceau');
 expect(fr.pluralize('track', 3)).toBe('3 morceaux');

 const ja = new I18nService('ja');
 // le japonais n'a pas de pluriel morphologique : même forme
 expect(ja.pluralize('track', 3)).toBe('3曲');
});
```

La règle de pluralisation japonaise a nécessité de factoriser la logique par locale au lieu d'une règle unique.

---

## ÉTAPE 3 : `formatting/dates.ts` et `numbers.ts`

```typescript
test('formatDuration() affiche 3:42 en FR et EN', () => {
 const fr = new DateFormatter('fr');
 const en = new DateFormatter('en');
 expect(fr.formatDuration(222)).toBe('3:42'); // 222 secondes
 expect(en.formatDuration(222)).toBe('3:42'); // même format international
});

test('formatDuration() utilise Intl.DateTimeFormat, pas de bibliothèque externe', () => {
 // Vérification : pas d'import vers moment, luxon, date-fns dans le fichier
 const source = fs.readFileSync('./src/formatting/dates.ts', 'utf8');
 expect(source).not.toContain('import moment');
 expect(source).not.toContain('import { format }');
 expect(source).toContain('Intl.DateTimeFormat');
});
```

Le deuxième test vérifie directement le code source pour s'assurer qu'aucune bibliothèque externe n'a été importée. C'est inhabituel, mais la règle du projet est stricte.

---

## ÉTAPE 4 : `playerEngine.ts`

```typescript
test('skip() passe à la track suivante dans la playlist', () => {
 const engine = new PlayerEngine(playlist3Tracks);
 engine.play();
 engine.skip();
 expect(engine.getState().currentTrack.id).toBe(playlist3Tracks[1].id);
});

test('skip() sur la dernière track revient à la première (mode loop)', () => {
 const engine = new PlayerEngine(playlist3Tracks);
 engine.playTrack(playlist3Tracks[2]); // dernière track
 engine.skip();
 expect(engine.getState().currentTrack.id).toBe(playlist3Tracks[0].id);
});

test('pause() ne modifie pas la track en cours', () => {
 const engine = new PlayerEngine(playlist3Tracks);
 engine.play();
 const trackAvantPause = engine.getState().currentTrack;
 engine.pause();
 expect(engine.getState().currentTrack).toEqual(trackAvantPause);
 expect(engine.getState().isPlaying).toBe(false);
});
```

---

## ÉTAPE 5 : Tests d'accessibilité avec axe-core

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('le lecteur principal n\'a aucune violation WCAG', async () => {
 document.body.innerHTML = renderPlayer(defaultTrack);
 const results = await axe(document.body);
 expect(results).toHaveNoViolations();
});

test('aria-live est défini sur l\'élément de la track en cours', () => {
 document.body.innerHTML = renderPlayer(defaultTrack);
 const liveRegion = document.querySelector('[aria-live]');
 expect(liveRegion).not.toBeNull();
 expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
});

test('le bouton play a un aria-label descriptif', () => {
 document.body.innerHTML = renderPlayer(defaultTrack);
 const playBtn = document.querySelector('button[aria-label]');
 expect(playBtn?.getAttribute('aria-label')).toMatch(/lire|play/i);
});
```

Le test `aria-live` a immédiatement attrapé un oubli : la première version du `trackDisplay.ts` mettait à jour le texte du lecteur sans aucune région `aria-live`, rendant les changements de track invisibles pour un lecteur d'écran.

---

## RÉCAPITULATIF DE L'ORDRE RÉEL

```
1. Types TypeScript (compilation check, pas Jest)
2. i18nService.ts (traductions, fallback, pluralisation)
3. formatting/dates.ts + numbers.ts
4. playerEngine.ts (logique de lecture)
5. ui/trackDisplay.ts (rendu HTML)
6. Tests a11y avec jest-axe (validation ARIA)
7. Audit Lighthouse (LCP, CLS : vérification manuelle)
```

Total : 44 tests à la fin, répartis sur 4 fichiers de test.

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Section obligatoire (chantier v14 #15.5). À remplir avec au moins un exemple
concret par refactoring notable du projet :

- Version pré-refacto : ...
- Ce qui bloquait : ...
- Refacto appliqué : ...
- Test devenu possible : ...
