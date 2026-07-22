---
stability: intemporel
---

# 05 : AI Famine Drill (ex-18bis) : simulation de survie technologique

Temps de lecture ~6 min. Temps de realisation : 6 a 10 heures sur 1 a 2 jours.

> **Contexte** : un jour, l'IA sera en rade, ton internet coupe, ton laptop
> volatilise. Tu recuperes une machine fraichement installee, sans Copilot,
> sans autocompletion intelligente, sans documentation en ligne. Tu dois
> reconstruire un module deja etudie **de memoire, avec des outils bruts**.
> Ce test ne mesure pas ta vitesse : il mesure ce qui reste quand toutes les
> bequilles ont saute.

## POURQUOI CE MINI-PROJET (18bis, pas 18)

Le mini-projet `18_human_vs_ai_smell` regarde le code IA de l'exterieur.
Celui-ci regarde ce que **tu** vaux quand l'IA disparait de l'equation.
Complementaire, pas redondant. Numerote 18bis exprès pour ne pas casser
l'ordre pedagogique existant tout en le greffant au bon endroit du parcours
(apres avoir vu les deux styles).

## PROTOCOLE DE SURVIE

### Setup obligatoire (30 min avant de commencer)

- **Machine** : VM Linux fraichement installee (Ubuntu Server minimal fait
  l'affaire) OU ordinateur secondaire vierge. Pas ton poste habituel.
- **Editeur autorise** : `vim`, `nano`, ou VSCode **sans aucune extension**.
- **Interdits stricts** : Copilot, tout LLM (ChatGPT, Claude, Gemini, Cursor,
  Windsurf), autocompletion basee sur ML (IntelliSense standard TypeScript
  OK, aide contextuelle IA interdite), StackOverflow, Google, MDN, GitHub
  Search, npm registry web, la doc officielle en ligne.
- **Autorises** : `man`, `--help`, `node --help`, `node --repl`, tes propres
  notes ecrites (papier ou markdown local), les `.md` du curriculum
  MyFunnyJS qui traitent du module choisi.
- **Reseau** : coupe le wifi apres avoir installe Node + npm. `sudo ip link
set wlan0 down` (Linux) ou equivalent. Rebranche uniquement pour publier
  a la fin.

### Choix du module a reconstruire

Un seul, choisi la veille sans y toucher :

- **Facile** : `03_async` (une Promise from scratch, un mini scheduler).
- **Moyen** : `08_memory_performance` (un LRU cache + un heap profiler
  minimal).
- **Difficile** : `11_functional_js` (une lib fonctionnelle : `pipe`,
  `curry`, `map/filter/reduce` immuables, `Maybe`, `Either`).

Le module choisi doit avoir ete etudie **avant** ce drill. Sinon ce n'est
plus un test de survie, c'est de l'apprentissage a nu.

### Livrables

```
18bis_ia_en_panne/
  README.md          <- tu es ici
  SETUP_LOG.md       <- commande par commande, ce que tu as installe
  RECONSTRUCTION.md  <- journal minute par minute, tes doutes, tes trous
  src/               <- le code, ecrit a la main
  tests/             <- tests ecrits AVANT le code, sans framework externe
                       (juste `node --test` de la stdlib)
  POSTMORTEM.md      <- rempli a la fin, franc
```

## REGLES DE SCORE (auto-attestees)

Chaque regle vaut 1 point. En dessous de 6/8, le drill n'a pas prouve ce
qu'il devait prouver : recommence dans deux semaines apres re-etude.

1. La machine etait vierge au demarrage. (Preuve : `SETUP_LOG.md` complet.)
2. Le reseau a ete coupe pendant toute la phase de code. (Preuve : trace
   `journalctl` ou photo horodatee.)
3. Aucun copier-coller depuis un autre projet. Tout est retape.
4. Les tests sont ecrits **avant** le code (TDD, rouge d'abord).
5. Le module fonctionne : `node --test tests/` passe au vert sur au moins
   80 % des cas nominaux.
6. Le journal `RECONSTRUCTION.md` contient au moins 3 moments d'oubli
   franc (« je ne me souvenais plus de la signature exacte de `Promise.all`,
   j'ai devine, j'ai teste, j'ai corrige »).
7. Le POSTMORTEM identifie **au moins un concept** que tu croyais maitriser
   et que tu ne maitrisais pas.
8. Le POSTMORTEM identifie **au moins un concept** que tu maitrises mieux
   que tu ne le pensais.

## POURQUOI CE DRILL EST DUR

Pas parce que le code est complique. Parce que tu vas realiser en direct
combien tu t'appuies sur des choses invisibles : la completion, le
squiggle rouge, la reponse instantanee a « comment on ecrit deja... ».
Ce drill est un miroir. Il ne se rejoue pas plus d'une fois par trimestre
sinon il perd son mordant.

## LIEN AVEC LE RESTE DU CURRICULUM

- Prerequis pedagogique : avoir termine le module cible **et** au moins un
  `EXO_JEUNE_IA.md` du meme module.
- Suite recommandee : ecrire un post retour d'experience dans
  `31_annexes/16_career/00_guide.md` (annexe personnelle) et referencer le
  POSTMORTEM.
- Cousin en aval : ce drill nourrit `31_annexes/16_career/03_plateau_playbook.md`
  si tu decouvres un plateau en le passant.

## RESUME

Six a dix heures, une machine vierge, aucune IA, aucun internet, un module
que tu croyais connaitre. A la fin, tu sauras exactement ce qui tient
quand la lumiere s'eteint.
