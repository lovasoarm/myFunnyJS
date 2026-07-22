---
stability: intemporel
---

# I18N BASICS : PARLER TOUTES LES LANGUES SANS TOUT RÉÉCRIRE
Temps de lecture ~7 min

i18n (internationalisation : le i, 18 lettres, puis n) c'est l'art de construire ton app pour qu'elle parle n'importe quelle langue sans toucher au code à chaque fois. Le piège classique : coder en dur "Bienvenue" dans ton bouton, puis te rendre compte six mois plus tard qu'il faut aussi gérer l'anglais, le japonais, le malgache. Si t'as pas préparé le terrain, tu réécris tout. Si t'as préparé le terrain dès le départ, tu rajoutes juste un fichier.

## 1) LE PROBLÈME : LE TEXTE EN DUR EST UNE BOMBE À RETARDEMENT

```js
// Ça casse (mais fun) : le texte codé en dur, mélangé à la logique
function afficherMessageBienvenue(nomUtilisateur) {
 return `Bienvenue, ${nomUtilisateur} !`; // (et si l'utilisateur parle japonais ?)
}
```

Le jour où Trapsoul Radio veut ouvrir son audience à des auditeurs japonais, tu dois fouiller TOUT ton code, trouver chaque string en dur, et les traduire une par une. Sur une grosse app, c'est des centaines de strings éparpillées. Le risque réel : en oublier, et avoir une app à moitié traduite, moitié en français : l'horreur visuelle.

## 2) LES CLÉS DE TRADUCTION : LA SÉPARATION QUI SAUVE TOUT

L'idée centrale : ton code ne contient JAMAIS de texte direct. Il contient des clés (key), et un fichier séparé associe chaque clé à sa traduction.

```js
// fr.json
{
 "bienvenue": "Bienvenue, {nom} !",
 "deconnexion": "Se déconnecter"
}

// ja.json (japonais)
{
 "bienvenue": "ようこそ、{nom}さん！",
 "deconnexion": "ログアウト"
}
```

```js
// Le code ne change JAMAIS, peu importe la langue active
function afficherMessageBienvenue(nomUtilisateur, t) {
 return t('bienvenue', { nom: nomUtilisateur }); // (t = fonction de traduction, "translate")
}
```

```
Code --> appelle une clé --> la fonction t() cherche la traduction --> retourne le texte dans la langue active
```

Ajouter une langue devient : créer un nouveau fichier JSON. Zéro ligne de code touchée. C'est la vraie victoire de l'i18n bien faite.

## 3) NAMESPACES : RANGER LES CLÉS SANS TOUT MÉLANGER

Sur une grosse app, des centaines de clés dans un seul fichier plat devient ingérable. Les namespaces (espaces de noms) découpent les traductions par contexte.

```js
// Sans namespace : un fichier fourre-tout illisible
{
 "bienvenue": "Bienvenue",
 "boutonValider": "Valider",
 "erreurMotDePasse": "Mot de passe incorrect",
 "titrePageProfil": "Mon profil"
 // ... 500 clés plus tard, bon courage pour retrouver quoi que ce soit
}

// Avec namespace : organisé par contexte, comme des dossiers
{
 "auth": {
  "bienvenue": "Bienvenue",
  "erreurMotDePasse": "Mot de passe incorrect"
 },
 "profil": {
  "titre": "Mon profil",
  "boutonValider": "Valider"
 }
}
```

```js
// Utilisation avec namespace : on sait directement d'où vient chaque clé
t('auth.bienvenue');
t('profil.titre');
```

C'est le même principe que les modules de ce curriculum : tu ranges par dossier (`01_fundamentals`, `03_async`) plutôt que de tout balancer dans un seul fichier de 10 000 lignes.

## 4) FALLBACKS : NE JAMAIS LAISSER UN TROU VIDE

Un fallback (langue de repli) c'est la langue utilisée quand la traduction demandée n'existe pas encore.

```js
function t(cle, langue, traductions, langueFallback = 'en') {
 const traductionDemandee = traductions[langue]?.[cle];
 if (traductionDemandee) return traductionDemandee;

 const traductionFallback = traductions[langueFallback]?.[cle];
 if (traductionFallback) return traductionFallback; // (mieux vaut de l'anglais que rien)

 return `[clé manquante: ${cle}]`; // (dernier recours : signaler le trou plutôt que cacher le bug)
}
```

```
Demande en malgache --> clé absente en malgache --> fallback en anglais --> trouvée --> affichée
Demande en malgache --> clé absente PARTOUT --> "[clé manquante: deconnexion]" --> visible, pas silencieux
```

Risque réel : sans fallback ni signal d'erreur visible, une clé manquante affiche soit rien (un trou blanc dans l'interface), soit littéralement `undefined` à l'écran. Le pire bug i18n, c'est celui qui passe en prod sans bruit.

## 5) LE PIÈGE DU TEXTE CONCATÉNÉ

```js
// Ça casse (mais fun) : construire une phrase en assemblant des morceaux traduits séparément
function direNombreDeNinjas(nombre) {
 return t('il_y_a') + ' ' + nombre + ' ' + t('ninjas'); // ("Il y a" + "5" + "ninjas")
}
// En français : "Il y a 5 ninjas" : ok
// En japonais : l'ordre des mots n'est pas le même, ça donne un charabia grammaticalement faux
```

```js
// Correct : la phrase ENTIÈRE est une seule clé, avec interpolation
// fr.json : "nombre_ninjas": "Il y a {nombre} ninjas"
// ja.json : "nombre_ninjas": "{nombre}人の忍者がいます" (l'ordre des mots change, et c'est normal)

function direNombreDeNinjas(nombre, t) {
 return t('nombre_ninjas', { nombre }); // (chaque langue gère SON propre ordre de mots)
}
```

Chaque langue a sa propre grammaire. Découper une phrase en petits bouts traduits séparément, c'est supposer que toutes les langues suivent l'ordre des mots du français. C'est faux, et ça casse systématiquement sur le japonais, l'allemand, l'arabe.

---

## EXERCICES

EXO 1 : Traque les strings en dur :
Prends un petit composant de ton projet (un bouton, un message d'erreur) et liste tous les textes écrits en dur dans le code. Transforme-les en clés de traduction avec un fichier `fr.json`.

EXO 2 : Range le bazar Trapsoul Radio :
Trapsoul Radio a 3 zones : la page d'accueil, le lecteur audio, le profil artiste. Organise un fichier de traduction avec des namespaces clairs pour ces 3 zones.

EXO 3 : Le trou qui ne doit jamais être silencieux :
Construit une fonction `t()` qui retourne un message explicite (`[clé manquante: x]`) plutôt que `undefined` ou une chaîne vide quand une clé n'existe dans aucune langue, fallback inclus.

## RÉSUMÉ

L'i18n sépare le texte du code via des clés de traduction : le code ne change jamais, seul le fichier de langue change. Les namespaces rangent les clés par contexte pour éviter le fourre-tout sur une grosse app. Le fallback évite les trous silencieux quand une traduction manque. Et surtout : ne jamais concaténer des morceaux de phrase traduits séparément, chaque langue a son propre ordre de mots.
