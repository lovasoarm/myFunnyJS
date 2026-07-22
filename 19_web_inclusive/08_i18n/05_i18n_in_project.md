---
stability: intemporel
---

# I18N DANS UN VRAI PROJET : ORGANISATION, PERFORMANCE, DX
Temps de lecture ~7 min

Tu sais maintenant gérer les clés, les dates, les nombres, le pluriel. Reste la question que les tutos évitent : comment tout ça s'organise dans un VRAI projet, sans faire exploser le poids de ton bundle (le paquet de fichiers JS envoyé au navigateur) ni rendre la vie des devs infernale. L'i18n mal architecturée, c'est le genre de dette qui se paie cher six mois plus tard, exactement comme le code spaghetti du module 13_refactoring.

## 1) LE PIÈGE DU BUNDLE QUI GONFLE

```js
// Ça casse (mais fun) : charger TOUTES les langues d'un coup, pour tout le monde
import fr from './locales/fr.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import mg from './locales/mg.json';
// 4 langues chargées même si l'utilisateur n'en lit qu'une seule
```

Un utilisateur français télécharge aussi les traductions japonaises et malgaches qu'il n'utilisera jamais. Sur une grosse app avec 10 langues, ça peut représenter des centaines de Ko inutiles, ce qui touche directement le LCP (Largest Contentful Paint) du module 08_memory_performance.

```js
// Correct : chargement dynamique, seulement la langue active
async function chargerTraductions(locale) {
 const module = await import(`./locales/${locale}.json`); // (import dynamique : un seul fichier chargé)
 return module.default;
}

const traductions = await chargerTraductions('fr'); // (seul fr.json est téléchargé)
```

```
Sans lazy loading --> toutes les langues dans le bundle initial --> poids gonflé pour tout le monde
Avec lazy loading --> seule la langue active est chargée --> poids minimal, par utilisateur
```

## 2) DÉTECTER LA LANGUE DU UTILISATEUR

```js
function detecterLangue() {
 const langueNavigateur = navigator.language; // ("fr-FR", "ja-JP"...)
 const languesSupportees = ['fr', 'en', 'ja', 'mg'];
 const langueCourte = langueNavigateur.split('-')[0]; // ("fr-FR" devient "fr")

 return languesSupportees.includes(langueCourte) ? langueCourte : 'en'; // (fallback si non supportée)
}
```

Risque réel : forcer une langue par défaut sans détecter celle du navigateur, c'est imposer ta langue natale à un utilisateur japonais qui n'a jamais demandé ça. Détecter, puis laisser l'utilisateur changer manuellement s'il veut : les deux options ensemble, jamais une seule.

## 3) STRUCTURE DE FICHIERS QUI TIENT À L'ÉCHELLE

```
locales/
├── fr/
│  ├── auth.json
│  ├── profil.json
│  └── radio.json
├── en/
│  ├── auth.json
│  ├── profil.json
│  └── radio.json
└── ja/
  ├── auth.json
  ├── profil.json
  └── radio.json
```

Un fichier par namespace, par langue. Ça permet de charger SEULEMENT le namespace nécessaire à la page courante, en plus de la langue.

```js
// Charger uniquement ce dont la page a besoin : langue ET contexte
async function chargerNamespace(locale, namespace) {
 const module = await import(`./locales/${locale}/${namespace}.json`);
 return module.default;
}

const traductionsAuth = await chargerNamespace('fr', 'auth'); // (page de login : juste 'auth', pas 'radio')
```

## 4) LA DX (DEVELOPER EXPERIENCE) : ÉVITER LES CLÉS FANTÔMES

```js
// Problème courant : une clé existe en français mais a été oubliée en anglais
// fr/profil.json : { "titre": "Mon profil", "bouton": "Sauvegarder" }
// en/profil.json : { "titre": "My profile" } // ("bouton" a été oublié)
```

```js
// Script de vérification à lancer en CI (intégration continue, voir module 31_annexes)
function verifierClesManquantes(traductionsBase, traductionsCible) {
 const clesBase = Object.keys(traductionsBase);
 const clesCible = Object.keys(traductionsCible);
 const manquantes = clesBase.filter(cle => !clesCible.includes(cle));

 if (manquantes.length > 0) {
  throw new Error(`Clés manquantes en anglais : ${manquantes.join(', ')}`); // (bloque le build, pas la prod)
 }
}
```

Sans ce genre de vérification automatique, une clé oubliée passe inaperçue jusqu'à ce qu'un utilisateur anglophone tombe sur un trou ou un `undefined` dans l'interface. Mieux vaut que le build casse avant la mise en prod plutôt que l'utilisateur le découvre.

## 5) LE CAS TRAPSOUL RADIO : 4 LANGUES, ZÉRO COMPROMIS

Trapsoul Radio supporte français, anglais, japonais et malgache. Voici comment les pièces s'assemblent :

```js
async function initialiserI18n() {
 const locale = detecterLangue(); // (étape 2 : détection)
 const namespace = determinerNamespacePage(); // ("radio", "profil", "auth" selon la page)

 const traductions = await chargerNamespace(locale, namespace); // (étape 3 : chargement ciblé)

 return {
  t: (cle, params) => pluraliser(params?.nombre, cle, locale, traductions) ?? traductions[cle], // (étape 1+4 combinées)
 };
}
```

```
Page chargée --> détecte la langue du navigateur --> détecte le namespace utile --> charge SEULEMENT ce fichier précis
--> fonction t() prête, avec pluralisation et fallback intégrés
```

Risque réel à surveiller : multiplier les imports dynamiques sans cache peut recharger le même fichier plusieurs fois si l'utilisateur navigue entre les mêmes pages. Mets en cache le résultat de `chargerNamespace` en mémoire pour éviter de retélécharger ce qui est déjà là.

---

## EXERCICES

EXO 1 : Allège le bundle :
Transforme un import statique de plusieurs fichiers de traduction en import dynamique (`await import(...)`), et vérifie dans l'onglet Network de DevTools que seule la langue active est bien téléchargée.

EXO 2 : Le détective de clés manquantes :
Écris une fonction qui compare deux objets de traduction (français comme référence, anglais comme cible) et liste toutes les clés présentes en français mais absentes en anglais.

EXO 3 : Le namespace de Trapsoul Radio :
Organise 3 namespaces (`auth`, `radio`, `profil`) pour 2 langues (`fr`, `en`), avec une fonction qui charge uniquement le namespace demandé pour la langue active, sans jamais charger les autres.

## RÉSUMÉ

Charger toutes les langues d'un coup gonfle le bundle pour rien : utilise l'import dynamique pour ne charger que la langue active. Détecte la langue du navigateur en fallback intelligent, mais laisse toujours l'utilisateur la changer manuellement. Découpe les traductions par namespace et par fichier pour que ça tienne à l'échelle. Et automatise la détection des clés manquantes en CI, pour qu'un trou de traduction casse le build plutôt que l'expérience utilisateur en prod.
