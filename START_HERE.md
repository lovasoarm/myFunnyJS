# START HERE

-> ~3 min de lecture, puis 10 minutes d'actions concrètes.

## TES 3 ACTIONS DANS LES 10 PROCHAINES MINUTES

1. **Vérifie Node** dans un terminal : `node -v`. Si tu vois `v20.x` ou plus, va au 2. Sinon, ouvre `00_getting_started/01_install.md` et reviens ici après installation.
2. **Ouvre** `00_getting_started/02_day_one.md`. C'est ton premier fichier de lecture réelle : ~10 min. Il te fait écrire tes 3 premières lignes de JS et te dit où aller ensuite.
3. **Crée** un fichier vide `PLATEAU_JOURNAL.md` à côté de ce `START_HERE.md`. Tu ne l'ouvriras pas aujourd'hui. Tu l'utiliseras la première fois que tu bloques 2 jours de suite. Cf `31_annexes/career/plateau_playbook.md`.

C'est tout pour les 10 prochaines minutes. Le reste de ce fichier est le contexte.

---

## SI TU ES SUPER DÉBUTANT (jamais installé Node)

Commence par [`00_getting_started/01_install.md`](00_getting_started/01_install.md) pour installer Node, Git et ton terminal. Reviens ici après.

**Temps total estimé du curriculum** : ~250 h étalées sur 6 à 9 mois. Fractionne : 1 h/jour battra 8 h le samedi.

## COMPTE DES MODULES

**32 modules de fond** numérotés `01 -> 32` (séquence continue, sans trou) + **2 préludes** non numérotés (`00_getting_started/` = mise en place, `00_referentiel/` = boussole) = **34 dossiers au total**. Les deux comptes sont cohérents : 32 modules pédagogiques + 2 préludes utilitaires.

## COMMENT NAVIGUER (conventions de noms)

- `00_*` : leçon d'entrée d'un module (le "why").
- `_recall_*.md` / `_spaced_repetition.md` : trackers vivants, tu les remplis toi-même.
- `MAJ.md` en majuscules (README, CHANGELOG, CONTRIBUTING) : docs racine.
- `-> ~XX min` en tête de chaque fichier : budget-temps lecture + exercice.

## FILET DE SÉCURITÉ (pour plus tard, pas maintenant)

`verification_pack/<module>/verify.sh` exécute 3 drills à sortie déterministe par module. Tu l'utiliseras quand tu douteras d'un chapitre. Pas au début.

---

# BIENVENUE

Ce fichier fait moins de 120 lignes. C'est fait exprès. Lis-le en entier, ça prend 3 minutes, et tu sais exactement où aller ensuite.

---

## CE QU'IL TE FAUT SUR TA MACHINE

```
Node.js  : v20+
npm      : v10+ (inclus avec Node.js)
Éditeur  : VSCode recommandé (pas obligatoire)
Terminal : n'importe lequel, tu vas y vivre
```

Vérifie avec :

```bash
node -v
npm -v
```

Si t'as pas Node.js : va sur nodejs.org, télécharge la version LTS, installe-la. Reviens après.

---

## 15 MOTS QUE TU VAS CROISER DANS LA ROADMAP (juste en bas)

| Mot             | C'est quoi en une phrase                                                         |
| --------------- | -------------------------------------------------------------------------------- |
| Event Loop      | Le mécanisme qui fait tourner JS sur un seul thread sans jamais bloquer          |
| Runtime         | Le moteur qui exécute ton code pendant que tu regardes ailleurs                  |
| Memory          | Comment ton programme stocke et libère ses données en RAM                        |
| Algorithm       | Une suite d'étapes précises pour résoudre un problème                            |
| Functional (FP) | Coder sans muter d'état, juste des fonctions qui transforment des données        |
| Pattern         | Une solution standard à un problème de conception qui revient souvent            |
| Refactoring     | Améliorer du code qui marche déjà, sans changer ce qu'il fait                    |
| TypeScript (TS) | JavaScript avec des types : le compilateur attrape tes erreurs avant l'exécution |
| Architecture    | Comment organiser un projet pour qu'il tienne quand il grossit                   |
| a11y            | Accessibilité : coder pour que tout le monde puisse utiliser ton site            |
| i18n            | Internationalisation : adapter ton app à plusieurs langues et pays               |
| API             | Le point de contact par lequel deux programmes se parlent                        |
| Scalability     | Tenir la charge quand tu passes de 10 à 10 millions de shinobis                  |
| Observability   | Voir ce qui se passe en prod sans attendre qu'un client se plaigne               |
| OOP             | Programmation orientée objet : organiser le code autour d'objets et de classes   |

Tu ne comprends pas encore le mécanisme derrière chaque mot, normal. C'est tout l'objet du curriculum. Ce tableau sert juste à ce que la roadmap ne te paraisse pas en chinois.

---

## DANS QUEL ORDRE LIRE

```
1. START_HERE.md                          <= t'es ici
2. 00_getting_started/02_day_one.md       <= contexte du métier + poste de travail + premier code
3. 00_referentiel/where_you_stand.md      <= les 4 axes sur lesquels tu vas progresser
4. README.md                              <= la roadmap complète des 32 modules (01 -> 32)
5. 01_fundamentals/                       <= le vrai départ
```

Chaque fichier renvoie au suivant à sa fin. Suis le fil, te pose pas de question.

---

## FICHIERS RACINE (à quoi ils servent)

- `README.md` : porte d'entrée officielle (roadmap).
- `START_HERE.md` : tu es ici.
- `.nvmrc` : version de Node de référence (source de vérité unique, détaillée dans `NODE_VERSIONS.md`).
- `NODE_VERSIONS.md`, `POSTMORTEM_TEMPLATE.md` : gouvernance technique légère utile au parcours.
- `COMMUNAUTE.md`, `LICENSE` : gouvernance projet.
- Contexte des premiers pas : `00_getting_started/02_day_one.md`.
- Guide carrière : `31_annexes/career/00_guide.md`.
- Journal d'audit interne (pas pour l'apprenant) : `31_annexes/_meta/`.

Si ça t'encombre, ignore-les au début et suis juste l'ordre plus haut.

---

## CE QUE C'EST, EN UNE PHRASE

MyFunnyJS, c'est pas un cours JS de plus. C'est une méthode pour construire un cerveau d'ingénieur : comprendre le runtime, lire du code inconnu, debugger un vrai problème, prendre de bonnes décisions d'architecture. JavaScript est juste le terrain d'entraînement.

---

Direction `00_getting_started/02_day_one.md`.

---
stability: intemporel
