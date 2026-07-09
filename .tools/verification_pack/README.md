---
stability: stable
---

# verification_pack : le filet déterministe

## Objectif

Prouver qu'une correction sur le curriculum n'a rien cassé. Pas une
promesse : une preuve exécutable, avec des sorties comparées à
l'octet près.

## Ce que le pack fait vraiment

Chaque module possède 3 drills minimum :
- `inputs/drill_N.txt` : une entrée concrète (ou fichier vide si le
  script ne lit rien).
- `expected/drill_N.txt` : la sortie attendue exacte.
- `scripts/drill_N.js` : le programme Node qui, exécuté sur l'input,
  doit produire l'expected.

Le `verify.sh` du module exécute chaque script, capture la sortie
réelle, et fait `diff -q` avec l'attendu. Si la moindre différence
apparaît (un caractère, un espace, une casse), le drill échoue et le
script sort en code non-zéro.

## Utilisation

Sanity individuel (un seul module) :
```
bash verification_pack/03_async/verify.sh
```

Filet complet (tous les modules) :
```
bash verification_pack/verify_all.sh
```

Sortie attendue : `[OK] Tous les modules ont passé le filet déterministe.`
et un code de retour 0. En cas d'échec, la sortie liste le drill fautif
avec un `diff -u` des 20 premières lignes de divergence.

## Prérequis

Node >= 20. La gate `_lib/node_gate.sh` bloque en amont si la version
est insuffisante. Bash >= 4 recommandé.

## Pourquoi c'est important

Sans ce pack, "j'ai refactoré, ça marche" veut dire "j'ai regardé
l'écran et rien n'a explosé pendant 3 secondes". Avec ce pack, ça veut
dire "35 drills passent tous, byte-for-byte, comme avant". C'est ce que
tu produis quand un contradicteur te demande la preuve.

## Étendre

Ajouter un drill à un module existant :
1. Créer `inputs/drill_N.txt`, `expected/drill_N.txt`, `scripts/drill_N.js`.
2. Relancer `bash verify_all.sh` : le drill est ramassé automatiquement
   par le `verify.sh` du module (glob sur `scripts/*.js`).

Ajouter un module :
1. Créer le dossier `verification_pack/<module>/` avec la même
   arborescence.
2. Copier un `verify.sh` existant : le template est générique.

## Ce que le pack N'EST PAS

Ce n'est pas une suite de tests unitaires pour chaque exercice
pédagogique. C'est un filet minimal qui prouve, en une requête, que
les fondations Node du curriculum tournent et produisent les sorties
attendues. Les tests unitaires vivent dans `06_testing/` et dans le
`tests/` de chaque mini-projet.
