---
stability: intemporel
---

# CAHIER DES CHARGES : TRAPSOUL RADIO

Temps de lecture ~14 min

## PRÉREQUIS

```
Node.js    : v20+
npm      : v10+
TypeScript   : v5+ (installé comme dépendance locale)
Variables env : aucune
Outils externes: axe-cli (pour les vérifications a11y), Lighthouse CLI

# Installation
$ npm install
$ npm install -g @axe-core/cli lighthouse  # outils de vérification

# Démarrer un serveur local (http-server ou équivalent)
$ npx http-server dist/ -p 3000

# Vérifier les types
$ npx tsc --noImplicitAny --noEmit

# Vérifier l'accessibilité
$ npx axe http://localhost:3000

# Audit Lighthouse
$ npx lighthouse http://localhost:3000 --only-categories=performance,accessibility

# Lancer les tests
$ npm test
```

Pas de framework (pas de React, pas de Vue). HTML + CSS + TypeScript natif compilé vers du JS. Le build step est `tsc` uniquement.

---

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Une plateforme de radio web dédiée au trapsoul, au RnB et au country underground. Des artistes du monde entier. Des auditeurs en France, au Japon, à Madagascar, aux États-Unis. L'interface doit fonctionner au clavier, à la souris, aux lecteurs d'écran, en 4 langues, sans que le code parte en vrille. Elle doit passer les contrôles d'accessibilité WCAG AA (Web Content Accessibility Guidelines : référentiel international d'accessibilité web). Et elle doit être rapide. Si un auditeur aveugle ne peut pas naviguer jusqu'à la piste suivante au clavier, la radio ne sort pas.

Ce que tu dois voir à la fin :

```
// Depuis le terminal (vérifications techniques)
$ npx tsc --noImplicitAny
  0 errors

$ npx axe http://localhost:3000
  0 violations

$ npx lighthouse http://localhost:3000 --only-categories=performance,accessibility
  Performance: 94
  Accessibility: 100

// Depuis l'interface (comportement visible)
- La track en cours change avec le nom, l'artiste, la durée
- En changeant la langue vers 日本語, tous les labels basculent
- Tab jusqu'au bouton "Piste suivante" : focus visible, espace pour déclencher
- Un lecteur d'écran annonce "En lecture : Bryson Tiller : Exchange"
```

Ce projet est le seul qui mixe TypeScript, accessibilité, et internationalisation ensemble. Ce n'est pas par accident : en prod, ces trois contraintes arrivent rarement séparément.

## POURQUOI CE PROJET EXISTE

Ce projet teste un réflexe que les devs n'ont pas naturellement : penser l'interface pour quelqu'un qui ne lui ressemble pas.

- **TypeScript n'est pas optionnel ici** : les clés de traduction typées garantissent qu'une clé manquante dans une locale est une erreur de compilation, pas un bug en production que quelqu'un remarque 3 mois plus tard.
- **l'accessibilité n'est pas un audit de fin de projet** : elle se construit dès le premier composant. Un `<button>` sans label, un focus invisible, un `div` cliquable à la place d'un vrai bouton interactif : chacun de ces choix ferme la porte à une partie des auditeurs.
- **l'i18n sans bibliothèque externe force à comprendre les vraies difficultés** : `Intl.DateTimeFormat` et `Intl.NumberFormat` existent. La pluralisation en malgache n'est pas la même qu'en anglais. Le faire sans library oblige à comprendre le problème avant de l'abstraire.

## LES 4 MODULES QUE CE PROJET COUVRE, ET OÙ ILS SE VOIENT DANS LE CODE

### `14_typescript` : types stricts, generics, utility types

**Où ça se voit** : tous les fichiers `.ts`. Les clés de traduction typées dans `i18n/types.ts`. Les generics sur les playlists `Playlist<Track>`.
**Pourquoi c'est nécessaire ici** : `TranslationKey` est un type union de toutes les clés valides. Si tu écris `t('player.now_playing_typo')` et que la clé n'existe pas : erreur à la compilation.

### `17_web_concepts` : browser render pipeline, LCP, INP, CLS

**Où ça se voit** : les optimisations de performance dans `src/player/`, les metadata dynamiques dans `src/pages/`.
**Pourquoi c'est nécessaire ici** : un changement de track déclenche un re-render. Si ce re-render fait sauter le CLS (Cumulative Layout Shift : décalage cumulatif de la mise en page), les scores Lighthouse s'effondrent.

### `19_web_inclusive` : ARIA, navigation clavier, contraste WCAG

**Où ça se voit** : chaque composant HTML dans `src/components/`. Les ARIA roles, les skip links, le focus management dans les modals.
**Pourquoi c'est nécessaire ici** : les composants audio custom (bouton play, slider de progression, sélecteur de track) n'ont pas de comportement clavier natif. Il faut le construire explicitement.

### `19_web_inclusive/i18n` : Intl, pluralisation, namespaces, locale detection

**Où ça se voit** : `src/i18n/` entier.
**Pourquoi c'est nécessaire ici** : 4 locales, pluralisation différente par langue, dates et durées formatées selon la locale, sans bibliothèque externe.

### Résumé visuel

```
14_typescript  --> types stricts, TranslationKey typé, Playlist<Track>, Readonly<Config>
17_web_concepts --> LCP < 2.5s, CLS < 0.1, INP < 200ms, metadata dynamiques
19_web_inclusive --> ARIA roles, navigation clavier, skip links, contraste WCAG AA
19_web_inclusive/i18n     --> Intl.DateTimeFormat, Intl.NumberFormat, pluralisation manuelle, 4 locales
```

## FLUX D'APPEL : QUI APPELLE QUI, DANS QUEL ORDRE

```
Navigateur charge la page
 --> localeDetector.detect()     // détecte la langue du navigateur
 --> i18n.init(locale)        // charge les traductions pour la locale
 --> player.init(playlist)      // initialise le lecteur avec la playlist
 --> render(AppShell)         // rendu initial de l'interface

Utilisateur clique "Piste suivante" (ou appuie sur espace)
 --> player.next()          // passe à la track suivante
 --> player.updateState(newTrack)   // met à jour l'état
 --> render(NowPlaying, newTrack)   // re-render le composant maintenant-en-lecture
 --> aria.announce(newTrack.title)  // annonce au lecteur d'écran via aria-live
 --> document.title = t('now_playing', { track: newTrack }) // met à jour le titre de l'onglet

Utilisateur change la langue
 --> i18n.setLocale('ja')       // bascule vers le japonais
 --> i18n.reloadAll()         // recharge toutes les traductions
 --> render(FullApp)         // re-render complet de l'interface
```

## L'ARCHITECTURE DU CODE, FICHIER PAR FICHIER

```
src/
├── i18n/
│  ├── types.ts
│  ├── localeDetector.ts
│  ├── translator.ts
│  └── locales/
│    ├── fr.ts
│    ├── en.ts
│    ├── ja.ts
│    └── mg.ts
│
├── player/
│  ├── player.ts
│  ├── playlist.ts
│  └── audioController.ts
│
├── components/
│  ├── NowPlaying.ts
│  ├── TrackList.ts
│  ├── LanguageSwitcher.ts
│  ├── SkipLink.ts
│  └── Modal.ts
│
├── types/
│  ├── track.ts
│  └── playlist.ts
│
├── a11y/
│  ├── focusManager.ts
│  ├── ariaAnnouncer.ts
│  └── keyboardNav.ts
│
├── utils/
│  ├── dateFormatter.ts
│  └── numberFormatter.ts
│
└── index.ts

tests/
├── i18n.test.ts
├── player.test.ts
├── a11y.test.ts
└── components.test.ts
```

### `src/i18n/types.ts`

**Ce que ça fait** : définit `TranslationKey` (union de toutes les clés de traduction valides) et `LocaleCode` (`'fr' | 'en' | 'ja' | 'mg'`).
**Entrée** : rien (définitions de types).
**Sortie** : types TypeScript exportés qui garantissent qu'une clé inexistante est une erreur de compilation.

### `src/i18n/translator.ts`

**Ce que ça fait** : la fonction `t(key, params?)` qui retourne la traduction pour la locale active. Gère la pluralisation.
**Entrée** : une `TranslationKey` et des paramètres optionnels `{ count?, artist?, track? }`.
**Sortie** : une chaîne traduite.

### `src/i18n/locales/fr.ts` (et en, ja, mg)

**Ce que ça fait** : l'objet de traductions pour une locale. Typé en `Record<TranslationKey, string | ((params) => string)>` pour la pluralisation.

### `src/player/player.ts`

**Ce que ça fait** : gère l'état du lecteur (track en cours, position, volume, état play/pause). Ne touche pas au DOM directement.
**Entrée** : des commandes (`play()`, `pause()`, `next()`, `prev()`, `seek(position)`).
**Sortie** : un état `PlayerState` mis à jour.

### `src/components/NowPlaying.ts`

**Ce que ça fait** : le composant "maintenant en lecture". Affiche le titre, l'artiste, la progression. A le rôle ARIA `region` avec `aria-label` traduit.
**Entrée** : l'état du player et la fonction `t`.
**Sortie** : du HTML avec les bons rôles ARIA.

### `src/a11y/focusManager.ts`

**Ce que ça fait** : gère le focus programmatique. Quand une modal s'ouvre, le focus va dedans et y reste (focus trap). Quand elle se ferme, le focus retourne à l'élément déclencheur.
**Entrée** : l'élément conteneur d'une modal.
**Sortie** : des event listeners installés et désinstallés proprement.

### `src/a11y/ariaAnnouncer.ts`

**Ce que ça fait** : un `div[aria-live="polite"]` invisible qui annonce les changements dynamiques aux lecteurs d'écran (changement de track, changement de langue).
**Entrée** : un message à annoncer.
**Sortie** : l'annonce est injectée dans le DOM live region.

### `src/utils/dateFormatter.ts` et `numberFormatter.ts`

**Ce que ça fait** : wrape `Intl.DateTimeFormat` et `Intl.NumberFormat` avec la locale active.
**Entrée** : une valeur à formater, la locale courante.
**Sortie** : une chaîne formatée selon la locale.

## L'ORDRE DE CONSTRUCTION (PAR OÙ COMMENCER)

```
1. src/types/       --> types de base, aucune logique
2. src/i18n/types.ts   --> TranslationKey doit exister avant les composants
3. src/i18n/locales/fr.ts --> commencer par une locale, les autres après
4. src/i18n/translator.ts --> dépend des types et des locales
5. src/utils/       --> Intl wrappers, testables seuls
6. src/player/player.ts  --> logique pure, testable sans DOM
7. src/a11y/ariaAnnouncer.ts --> simple, peu de dépendances
8. src/a11y/focusManager.ts --> plus complexe, dépend du DOM
9. src/a11y/keyboardNav.ts  --> dépend de focusManager
10. src/components/     --> dépendent de player + i18n + a11y
11. src/index.ts       --> branche tout
12. Vérifications finales : axe, Lighthouse, tsc
```

## ESTIMATION DE TEMPS ET ZONES DE RÉSISTANCE

**Durée totale estimée** : 25 à 40 heures de travail réel.

C'est le projet le plus exigeant en termes d'itération. TypeScript strict + accessibilité WCAG AA + i18n 4 locales : les trois contraintes s'additionnent et se frottent l'une contre l'autre. L'accessibilité ne se fait pas en une passe. Plan pour minimum 25h. Si c'est la première fois que tu fais de l'a11y sérieuse, plan pour 35-40h.

| Étape                           | Durée estimée | Zone de résistance                                                                                 |
| ------------------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| Types + i18n                    | 3h            | Moyenne : bien typer TranslationKey sans tout rigidifier                                           |
| player.ts                       | 2h            | Faible                                                                                             |
| Intl wrappers                   | 1h30          | Faible                                                                                             |
| ariaAnnouncer                   | 1h            | Faible                                                                                             |
| focusManager                    | 3-4h          | **Haute** : le focus trap dans une modal est subtil, surtout avec des éléments disabled            |
| keyboardNav                     | 2-3h          | **Haute** : gérer tab, shift+tab, escape, espace, et les edge cases (éléments hidden)              |
| Composants HTML                 | 3-4h          | Moyenne : ARIA correctement sur des contrôles custom audio                                         |
| i18n locales (4)                | 2h            | Faible mais répétitif                                                                              |
| Vérifications a11y              | 4-6h          | **Très haute** : faire passer axe à 0 violations sur un player audio custom est une vraie bataille |
| Optimisation perf (LCP/CLS/INP) | 2-3h          | Moyenne                                                                                            |

Le focus trap et les vérifications axe sont les deux points où la plupart des gens bloquent plus longtemps que prévu. La raison : les erreurs d'accessibilité se détectent seulement au runtime (axe, lecteur d'écran), pas à la compilation. Chaque correction peut en révéler une autre. C'est de l'itération, pas de la construction linéaire.

## EXEMPLE DE TEST REMPLI

```ts
// tests/i18n.test.ts
import { t, setLocale } from "../src/i18n/translator";

describe("translator", () => {
  test("retourne la traduction française par défaut", () => {
    setLocale("fr");
    expect(t("player.now_playing")).toBe("En lecture");
  });

  test("bascule vers le japonais", () => {
    setLocale("ja");
    expect(t("player.now_playing")).toBe("再生中");
  });

  test("pluralisation en français : 1 titre / N titres", () => {
    setLocale("fr");
    expect(t("playlist.track_count", { count: 1 })).toBe("1 titre");
    expect(t("playlist.track_count", { count: 5 })).toBe("5 titres");
  });

  test("pluralisation en malgache", () => {
    setLocale("mg");
    expect(t("playlist.track_count", { count: 1 })).toBe("1 hira");
    expect(t("playlist.track_count", { count: 5 })).toBe("5 hira");
  });
});

// tests/a11y.test.ts
import { FocusManager } from "../src/a11y/focusManager";

describe("FocusManager", () => {
  test("le focus reste dans la modal quand on tabule depuis le dernier élément", () => {
    document.body.innerHTML = `
   <div id="modal">
    <button id="btn1">Fermer</button>
    <button id="btn2">Confirmer</button>
   </div>
  `;
    const modal = document.getElementById("modal")!;
    const fm = new FocusManager(modal);
    fm.trapFocus();

    // Simuler Tab depuis le dernier bouton
    document.getElementById("btn2")!.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));

    expect(document.activeElement?.id).toBe("btn1"); // wrapping
  });
});
```

## CAS LIMITES À TESTER OBLIGATOIREMENT

1. **Clé de traduction manquante** : si une clé est dans `fr.ts` mais pas dans `ja.ts`, le compilateur TypeScript doit lever une erreur (pas un fallback silencieux).
2. **Pluralisation avec count = 0** : `t('playlist.track_count', { count: 0 })` doit retourner "0 titres" en français, pas "0 titre".
3. **Focus trap avec éléments désactivés** : si tous les boutons dans une modal sont `disabled`, le focus ne doit pas s'échapper de la modal.
4. **Changement de locale pendant la lecture** : la track en cours continue, seul le texte de l'interface change. L'`aria-live` annonce le changement de langue.
5. **Locale non supportée détectée** : si le navigateur est configuré en suédois, le localeDetector fall back sur `'en'` sans erreur.

## LES RÈGLES QUE TU NE DOIS JAMAIS CASSER

1. **Zéro `div` cliquable.** Si quelque chose est interactif, c'est un `<button>` ou un `<a>`. Pas de `div onClick`.
2. **Zéro clé de traduction en dur dans les composants.** Tout passe par `t('cle')`. Les composants ne connaissent pas la langue courante.
3. **Contraste WCAG AA partout.** Ratio minimum 4.5:1 pour le texte normal, 3:1 pour le texte large. Vérifié à la fin avec un outil (axe, Lighthouse).

## CE QUE TU NE FAIS PAS DANS CE PROJET

- Pas de lecture audio réelle (l'`audioController.ts` simule la lecture sans `<audio>` réel).
- Pas de backend, pas d'API.
- Pas de React/Vue. HTML, CSS, TypeScript natif uniquement.
- Pas de bibliothèque i18n (pas de i18next, pas de FormatJS).

## LES ADR

```
ADR/001-pourquoi-translationkey-type-union-plutot-que-string.md
ADR/002-pourquoi-intl-natif-plutot-que-library-i18n.md
ADR/003-pourquoi-aria-live-pour-les-changements-dynamiques.md
```

Exemple rempli :

```markdown
# ADR 001 : TranslationKey comme type union plutôt que string

## Contexte

La fonction `t()` accepte une clé de traduction. Si on type le paramètre comme
`string`, n'importe quelle chaîne est acceptée, y compris des clés qui n'existent
pas dans les fichiers de locale. L'erreur n'apparaît qu'à runtime.

## Décision

`TranslationKey` est un type union généré à partir des clés réelles :
`type TranslationKey = keyof typeof fr` (les clés du fichier de locale français
servant de référence). Toute nouvelle locale doit satisfaire ce type.

## Alternatives considérées

- `string` : rejeté, erreurs à runtime non détectables.
- Générer les types depuis un JSON : trop complexe pour ce projet, nécessite
  un step de build supplémentaire.

## Conséquences

- Ajouter une clé = l'ajouter dans `fr.ts` (la référence), puis TypeScript
  indique quelles autres locales doivent être mises à jour.
- Les composants qui utilisent `t()` ont l'autocomplétion sur les clés valides.
```

## QUAND EST-CE QUE LE PROJET EST VRAIMENT FINI

```
[ ] tsc --noImplicitAny retourne 0 erreurs
[ ] axe retourne 0 violations sur la page principale
[ ] Lighthouse accessibilité : 100
[ ] Lighthouse performance : > 90
[ ] les 4 locales fonctionnent (fr, en, ja, mg)
[ ] la navigation clavier complète est possible sans souris
[ ] le focus trap de la modal fonctionne (testé dans les tests)
[ ] les 5 cas limites ont chacun un test
[ ] zéro `div` cliquable dans le code HTML généré
[ ] les 3 ADR sont remplis avec contexte, décision, alternatives, conséquences
[ ] POSTMORTEM.md documente la violation a11y la plus difficile à corriger
```

## SPEC VOLONTAIREMENT INCOMPLÈTE (obligatoire, à traiter en premier)

Ce cahier des charges est **volontairement incomplet sur 3 points** (format de sortie exact d'un
détail d'interface, un critère d'acceptation mesurable, un choix technique laissé implicite).
Contrairement au _spec drift_ (voir `30_mini_projects/synthese/spec_drift.md`) qui simule une
spec qui **change** en cours de route, ici la spec est **floue dès le départ**, comme un vrai
ticket de jour 1 en entreprise.

Ta mission avant d'écrire une ligne de code :

1. Identifie les 3 zones de flou (elles sont réelles, pas piégeuses).
2. Écris dans `QUESTIONS_CLARIFICATION.md` les questions exactes que tu poserais à un vrai
   Product Owner. Utilise le protocole de `27_team_craft/08_how_to_ask.md`
   (question fermée > question ouverte, hypothèse explicite, coût du "je devine tout seul").
3. Fais ensuite des hypothèses raisonnables sur chaque point, et documente-les dans un ADR
   dédié (`ADR/000-hypotheses-spec-floue.md`) **avant** de coder.

Livrable de cette étape : `QUESTIONS_CLARIFICATION.md` + `ADR/000-hypotheses-spec-floue.md`,
commités **avant** le premier `feat:`.

---

## SÉCURITÉ (gate obligatoire)

Un projet qui marche mais qui est vulnérable n'est pas fini. Traite ces exigences OWASP contextuelles avant de livrer.

- Validation d'upload/stream (OWASP A03) : valider le type et la taille des flux entrants.
- Rate limiting (OWASP A04) : borner les requêtes par client pour protéger le stream.

Pour chaque exigence : documente dans `SECURITY.md` la menace, ta contre-mesure et le test qui la prouve. Le `verification_pack` de ce projet contient un test de sécurité qui doit passer.

---

## Securite (gate obligatoire, Partie I)

- **Exigence 1** : aucune donnee sensible (secret, token, cle) dans le code source ni dans les logs. Utiliser variables d'environnement + `.env.example` versionne (jamais `.env`).
- **Exigence 2** : toute entree externe (STDIN, fichier, HTTP, CLI) est validee AVANT usage (type, longueur, format). En cas d'invalidite : erreur explicite, jamais un crash silencieux.

Un test dans `node solution.js` (auto-verif ecrite par toi) doit prouver ces deux points (ex : lancer le programme avec une entree malformee et verifier qu'il refuse proprement).

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**
