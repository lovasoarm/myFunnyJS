---
stability: évolutif
---

# i18n : Drill exécutable

> Un module conceptuel produit du savoir déclaratif. Le savoir déclaratif ne survit pas à un entretien. Ce drill te force à produire du savoir procédural.

## Objectif

Écris un script Node qui :

1. Charge **deux namespaces** de traductions (ex. `common.json` et `checkout.json`) depuis deux locales (`fr`, `en`).
2. **Applique** un des deux namespaces à un texte source et affiche le résultat.
3. **Mesure** le poids (en octets) ajouté par le chargement du second namespace vs. le premier seul.
4. **Vérifie** qu'un fallback fonctionne : si une clé manque en `fr`, le script doit retomber sur `en` sans crash.

## Contraintes

- Node >= 20, zéro dépendance externe (ni `i18next` ni autre). L'idée est de comprendre le mécanisme, pas d'utiliser une lib.
- Le script doit sortir un rapport JSON sur stdout :

  ```json
  {
    "loaded_namespaces": ["common", "checkout"],
    "bytes_before": 812,
    "bytes_after": 1543,
    "fallback_ok": true
  }
  ```

- Exit code `0` si `fallback_ok === true`, `1` sinon.

## Squelette

```js
// drill_i18n.js
import { readFile } from "node:fs/promises";
import { Buffer } from "node:buffer";

async function load(locale, ns) {
  const raw = await readFile(
    new URL(`./${locale}/${ns}.json`, import.meta.url),
  );
  return { bytes: raw.byteLength, data: JSON.parse(raw.toString("utf8")) };
}

function t(dict, fallback, key) {
  return dict[key] ?? fallback[key] ?? key;
}

const [common_fr, common_en] = await Promise.all([
  load("fr", "common"),
  load("en", "common"),
]);
const checkout_fr = await load("fr", "checkout");

const bytes_before = common_fr.bytes;
const bytes_after = common_fr.bytes + checkout_fr.bytes;

const fr = { ...common_fr.data, ...checkout_fr.data };
const en = { ...common_en.data };

const fallback_ok = t(fr, en, "key_only_in_en") === en.key_only_in_en;

console.log(
  JSON.stringify(
    {
      loaded_namespaces: ["common", "checkout"],
      bytes_before,
      bytes_after,
      fallback_ok,
    },
    null,
    2,
  ),
);
process.exit(fallback_ok ? 0 : 1);
```

## Critère de passage

Le script tourne, sort le JSON, exit code `0`. Si tu ne peux pas produire ce rapport en < 30 min, retourne à `01_i18n_basics.md`.

## Limite de l'exercice

Ce drill ne remplace pas une vraie stratégie i18n en prod (routing par locale, ICU MessageFormat, RTL, CDN de dictionnaires). Il prouve que tu as compris le **mécanisme minimal** : charger, appliquer, mesurer, fallback.
