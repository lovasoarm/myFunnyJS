---
stability: intemporel
---

[PORTFOLIO]

[ATELIER]

# TRAPSOUL RADIO

-> ~6 min

Plateforme de radio web dédiée au trapsoul, au RnB et au country underground. Des artistes du monde entier. Des auditeurs de toutes les langues. Une interface qui doit fonctionner au clavier, à la souris, aux lecteurs d'écran, et en 4 langues sans que le code parte en vrille.

Si un auditeur aveugle ne peut pas naviguer vers la prochaine track, la radio ne sort pas.

---

## CE QUE ÇA FAIT

```
$ npx http-server dist/ -p 3000
$ npx axe http://localhost:3000

 Contraste WCAG AA : toutes les combinaisons couleur/fond
 ARIA : role="radio" sur le lecteur, aria-live sur la track en cours
 Navigation clavier : tab order logique, skip link vers le contenu principal
 Focus visible sur tous les éléments interactifs
 0 violations trouvées

$ npx tsc --noImplicitAny --noEmit
 0 erreurs
```

---

## INSTALLATION

```
Node.js : v20+
npm : v10+
TypeScript : v5+
Outils externes: axe-cli, Lighthouse CLI
```

```bash
npm install
npm install -g @axe-core/cli lighthouse
npx http-server dist/ -p 3000 # serveur local
npx axe http://localhost:3000 # audit a11y
npm test # tests unitaires
```

---

## ARCHITECTURE

```
src/
├── types/
│ ├── track.ts # Track, Artist, Playlist (génériques)
│ ├── i18n.ts # TranslationKeys, Locale, avec clés typées en TS
│ └── player.ts # PlayerState, PlayerEvent
│
├── i18n/
│ ├── fr.ts # clés de traduction françaises
│ ├── en.ts
│ ├── ja.ts # japonais
│ ├── mg.ts # malgache
│ └── i18nService.ts # chargement, fallback, pluralisation
│
├── player/
│ ├── playerEngine.ts # logique de lecture : play, pause, skip, seek
│ ├── playerState.ts # état immutable du lecteur (Track, isPlaying, volume)
│ └── playerEvents.ts # EventEmitter pour les changements d'état
│
├── ui/
│ ├── trackDisplay.ts # aria-live sur la track en cours
│ ├── playlistNav.ts # navigation clavier dans la playlist
│ ├── focusTrap.ts # trap de focus dans les modals
│ └── skipLink.ts # "Aller au contenu" en haut de chaque page
│
├── formatting/
│ ├── dates.ts # Intl.DateTimeFormat par locale
│ └── numbers.ts # Intl.NumberFormat (durée des tracks)
│
└── index.ts

tests/
├── i18n.test.ts
├── playerEngine.test.ts
├── a11y.test.ts
└── formatting.test.ts
```

---

## MODULES CRAZYDEVS COUVERTS

| Module | Où ça se voit |
| ----------------------- | ----------------------------------------------------------------------- |
| `14_typescript` | Clés de traduction typées, `Track<T>`, types stricts sur tout le player |
| `17_web_concepts` | Browser render pipeline, LCP/CLS optimisés, métadonnées SEO |
| `19_web_inclusive` | ARIA complet, navigation clavier, contraste WCAG AA vérifié |
| `19_web_inclusive/i18n` | 4 locales, `Intl.DateTimeFormat`, pluralisation, fallback |

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. axe-cli retourne 0 violations avant chaque release
2. Toutes les clés de traduction sont typées en TS : clé absente = erreur de compilation
3. Navigation clavier complète : chaque action accessible sans souris
4. Aucune bibliothèque externe de dates (Intl.DateTimeFormat uniquement)
5. LCP < 2.5s, CLS < 0.1 sur Lighthouse (réseau simulé 4G)
```

---

## DOCUMENTS DU PROJET

```
cahierdescharges.md --> spécification complète, ordre de construction, cas limites
TDD_JOURNAL.md --> trace de l'écriture des tests, dans l'ordre réel
POSTMORTEM.md --> ce qui a coincé, ce qui a été appris
ADR/ --> décisions d'architecture documentées
```

---

## BENCH & DÉCISIONS (obligatoire)

Aucun mini-projet n'est "fini" sans cette section. Documente au moins **un**
trade-off chiffré :

- **Question** : "J'ai comparé X vs Y."
- **Charge** : (taille des données, N itérations, hardware).
- **Résultat** : `X = 12ms`, `Y = 48ms` sur 10 000 items.
- **Décision** : "J'ai retenu X car …"
- **Ce que je n'ai pas mesuré** : (mémoire, DX, coût cloud…).

Sans chiffres, ce n'est pas une décision, c'est une préférence.
Voir `08_memory_performance/00_measure_first.md`.

## Pitch 3 lignes

Ce projet démontre une compétence clé : lire du code inconnu, débugger sous pression, livrer un produit (ADR + tests) qu'un autre dev peut reprendre. Utilisable en portfolio et en entretien.

## Empreinte carbone (critère d'acceptation)

Estime l'empreinte carbone approximative de ton déploiement ou de ton algo. Justifie **un** choix d'optimisation (moins d'invocations, cache, batch, région serveur). Voir `31_annexes/03_finops_greenops.md`.

## THÈME NEUTRE (optionnel)

Si les références Naruto/DBZ ne te parlent pas, remplace mentalement par un domaine que tu connais (foot, cuisine, musique). Le concept technique reste identique.

## Structure attendue

Chaque mini-projet doit contenir a minima :

- `src/` : code source (obligatoire).
- `tests/` : tests unitaires et/ou d'intégration (obligatoire).
- `README.md` : présentation, objectifs, comment lancer.
- `TDD_JOURNAL.md` : trace de la démarche TDD.
- `POSTMORTEM.md` : ce qui a marché, ce qui a cassé, ce que tu retiens.
- `ADR/` : décisions architecturales (Architecture Decision Records).
- `cahierdescharges.md` : contraintes et périmètre.

Un CI check impose la présence de `src/` et `tests/` avant validation.

---

## REPRODUCTIBILITÉ

Installation canonique : `npm ci` (pas `npm install`). `npm ci` respecte strictement le `package-lock.json` : deux personnes qui clonent obtiennent exactement les mêmes versions. Committe toujours ton `package-lock.json`. Sans lui, un `npm install` 3 mois plus tard installera d'autres versions et tu debug un fantôme.
