---
perennite: evolutif
stability: moderne
duree_de_vie_estimee: 3-5 ans
raison: Les outils d'installation (Node, npm, VS Code) évoluent mais les principes restent.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

# Pourquoi ce dossier "getting started" ?

Temps de lecture ~2 min


> **Durée de vie : 5+ ans.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Parce que 80 % des abandons se jouent dans les 30 premières minutes. Pas
sur un concept dur, pas sur un exercice difficile : sur une version de
Node qui coince, un `PATH` mal réglé, un terminal qui ne comprend pas la
requête, une extension VSCode absente. Ce dossier existe pour tuer ces
30 minutes.

## Le pari

Un débutant "super nul" doit pouvoir :
- installer Node >= 20 sur Windows, macOS ou Linux ;
- vérifier son installation avec une requête unique ;
- ouvrir un premier fichier `.js`, le lancer, voir la sortie ;
- comprendre ce qu'est un terminal, un shell, un dossier de projet.

Sans jamais chercher sur Google. Sans jamais copier-coller une requête
qu'il ne comprend pas.

## Ce que tu y trouveras

- `01_install.md` : installation Node/pnpm/git, pas à pas, une plateforme
  à la fois, avec vérification à chaque étape.
- Les hypothèses matérielles minimales (RAM, OS, réseau).
- Le script de sanity check qui te dit oui/non tu es prêt.

## Ce que ce dossier n'est PAS

Ce n'est pas un cours JavaScript. Ce n'est pas non plus une doc
exhaustive de Node. C'est un tunnel : entrée = machine vierge, sortie =
"j'ai vu `Hello, world` dans mon terminal, je passe au module 01".

## Signal que tu peux quitter ce dossier

Tu tapes `node -v` sans réfléchir, tu vois `v20.x.x` ou plus, tu ouvres
un `.js`, tu lances `node fichier.js`, tu vois la sortie. Tu peux passer
à `../START_HERE.md` puis au module `01_fundamentals`.

## Signal que tu dois y rester encore un peu

Une requête te renvoie une erreur que tu ne comprends pas, un chemin ne
fonctionne pas, ou tu ne sais pas ce qu'est un shell. C'est normal. Ne
saute pas ce dossier "pour aller au vrai contenu" : le vrai contenu ne
tiendra pas si les fondations d'outillage sont fissurées.

## Pourquoi c'est traité en tout premier

Parce qu'un débutant qui bloque 40 minutes sur une install prend
souvent la décision inconsciente que "ce n'est pas pour moi", alors
que le problème n'a jamais été le langage. On coupe court à cette
sortie de route en la rendant impossible.
