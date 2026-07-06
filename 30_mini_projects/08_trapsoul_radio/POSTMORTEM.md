# POSTMORTEM : TRAPSOUL RADIO
Temps de lecture ~5 min

---

## CE QUI A BIEN MARCHÉ

Les clés de traduction typées en TypeScript ont été la meilleure décision du projet. Chaque fois qu'une clé de traduction a été ajoutée ou renommée, TypeScript a immédiatement signalé tous les endroits qui devaient être mis à jour. Sans ça, une clé renommée en silence aurait artefact des `undefined` à l'affichage, silencieusement, uniquement dans certaines locales.

Les tests a11y avec `jest-axe` ont attrapé 3 problèmes qui n'auraient pas été vus sans eux : le `aria-live` manquant sur la région de track, un bouton sans `aria-label` lisible, et une image d'artiste sans attribut `alt`.

---

## DÉCISION DIFFICILE N°1 : PLURALISATION MAISON OU BIBLIOTHÈQUE ?

La pluralisation est complexe : le japonais n'a pas de pluriel morphologique, le malgache a des règles différentes du français, l'arabe a 6 formes de pluriel.

Deux options :
1. Implémenter les règles de pluralisation pour les 4 locales cibles manuellement.
2. Utiliser `Intl.PluralRules` (natif dans le navigateur depuis ES2018).

Décision : `Intl.PluralRules`. C'est natif, sans dépendance externe, et couvre toutes les locales sans code custom.

```typescript
const pluralRule = new Intl.PluralRules(locale);
const form = pluralRule.select(count); // 'one', 'other', 'few', 'many', etc.
return translations[`track.count.${form}`];
```

**Ce que ça coûte :** les traductions doivent fournir une entrée pour chaque forme (`track.count.one`, `track.count.other`). Légèrement plus verbeux dans les fichiers de traduction.

---

## DÉCISION DIFFICILE N°2 : FOCUS TRAP DANS LES MODALS

Quand un modal s'ouvre (par exemple la fiche d'un artiste), le focus doit rester dans le modal. Sinon, un shinobi clavier peut "s'échapper" dans la page derrière, ce qui casse complètement l'expérience lecteur d'écran.

Décision : `focusTrap.ts` implémenté manuellement avec `querySelectorAll('[tabindex]:not([tabindex="-1"]), button:not([disabled]), ...')` et gestion du `Tab` / `Shift+Tab` via `addEventListener('keydown', ...)`.

**Ce que ça coûte :** le sélecteur de "focusable elements" est maintenu à la main. Si un nouveau type d'élément focusable est ajouté (par exemple un `<details>`), il faut penser à mettre à jour le sélecteur.

---

## CE QUI A SURPRIS

`Intl.DateTimeFormat` pour formater des durées de tracks (222 secondes → "3:42") est plus compliqué que prévu : `Intl.DateTimeFormat` est conçu pour des dates, pas pour des durées brutes. La solution propre : convertir la durée en millisecondes, créer un `Date` à epoch + durée, puis formater avec `{ minute: 'numeric', second: '2-digit' }`. Ça marche, mais c'est un hack qui exploite l'epoch de façon non intuitive. Documenté dans le code.

---

## CE QUI RESTERAIT À FAIRE DANS UNE V2

```
- Ajouter l'arabe comme 5ème locale (6 formes de pluriel : bon test de robustesse de i18nService)
- Mode offline : Service Worker qui cache les tracks récentes
- Annonces vocales personnalisées : laisser le shinobi choisir la verbosité du lecteur d'écran
```


## Protection des données

Si tu mentionnes des données réelles (users, clients, endpoints internes), anonymise-les ou remplace par des noms fictifs. Un post-mortem est destiné à circuler.


---

## PUBLICATION (obligatoire)

- Lien du dépôt public : `https://github.com/<toi>/<projet>`
- Lien du billet de blog (si rédigé) : ...
- Date de publication : ...
- Peer-review reçue de : `@pseudo`
