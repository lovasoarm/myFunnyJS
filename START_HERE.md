---
stability: intemporel
---

# START HERE

-> ~5 min de lecture, puis 10 minutes d'actions concretes.

> **Tu es debutant, tu ne sais pas par ou commencer, tu as peur de te perdre.**
> C'est exactement pour toi que ce fichier existe. Lis les 3 actions dans les
> 10 prochaines minutes, execute-les, puis reviens lire le reste. Le reste
> est du contexte, pas de l'obstacle.

## TES 3 ACTIONS DANS LES 10 PROCHAINES MINUTES

1. **Verifie Node** dans un terminal : `node -v`. Si tu vois `v20.x` ou plus, va au 2. Sinon, ouvre `00_getting_started/01_install.md` et reviens ici apres installation.
2. **Tape tes 3 premieres lignes de JS maintenant** (minute 2, pas minute 8) :

   ```bash
   mkdir day_one && cd day_one
   echo 'console.log(1 + 1)' > hello.js
   node hello.js
   ```

   Attendu : `2`. Si tu vois autre chose, tu viens de faire ton premier bug : note-le dans un carnet, pas dans ta tete. Le contexte complet et la suite (`casse volontairement`, `repare`, TDD_JOURNAL) sont dans [`00_getting_started/02_day_one.md`](00_getting_started/02_day_one.md).

3. **Cree** un fichier vide `PLATEAU_JOURNAL.md` a cote de ce `START_HERE.md`. Tu ne l'ouvriras pas aujourd'hui. Seuil unique : **2 jours sans progres -> tu commences a surveiller ; 7 jours -> tu declenches** `31_annexes/16_career/03_plateau_playbook.md`.

C'est tout pour les 10 prochaines minutes. Le reste de ce fichier est le contexte.

---

## SI TU ES SUPER DEBUTANT (jamais installe Node)

Commence par [`00_getting_started/01_install.md`](00_getting_started/01_install.md) pour installer Node, Git et ton terminal. Reviens ici apres.

**Temps total estime du curriculum** : ~250 h etalees sur 6 a 9 mois. Fractionne : 1 h/jour battra 8 h le samedi.

---

## TON PARCOURS EN UNE IMAGE (l'arrivee des le depart)

Tu dois savoir ou tu vas. Voici le chemin entier, du "je n'ai jamais installe Node"
jusqu'a "je maitrise tout MyFunnyJS" :

```
[Aujourd'hui : tu es ici]
       |
       v
[00_getting_started]  <- installer Node/Git/terminal, ecrire 3 lignes de JS
       |
       v
[00_referentiel]      <- comprendre les 6 pierres et t'auto-diagnostiquer
       |
       v
[01 -> 07]  Fundamentals / Problem Solving / Async / Debug / Errors / Testing / Math
       |    (+ mini-projets 01 a 05 des que tu finis le module 07)
       v
[08 -> 13]  Memory / Data Structures / Algos / Functional / Patterns / Refactoring
       |    (+ mini-projets 06 a 10)
       v
[14 -> 22]  TypeScript / Runtime / Architecture / Web / OOP / a11y / Realtime / API / Security
       |    (+ CHECKPOINT BLOQUANT apres 14 : crosslang challenge, voir plus bas)
       |    (+ mini-projets 11 a 14)
       v
[23 -> 29]  AI-Native / Databases / Scale / Observability / Team / Edge Cases / AI Agents
       |    (+ mini-projets 15 a 18 ; drill trimestriel: 31_annexes/16_career/05_ai_famine_drill.md)
       v
[31_annexes] Career / Interview / Portfolio / Ethics
       |
       v
[Diplome MyFunnyJS] <- tu es diplome quand :
                       1. Les 32 modules ont un POSTMORTEM personnel
                       2. Les 18 mini-projets sont livres avec gate OWASP OK
                       3. Le crosslang challenge est passe (Pierre 6 prouvee)
                       4. Un "first click replay" (31_annexes/16_career/04_...)
                          a ete filme avec un vrai debutant : 0 a 2 hesitations
                       5. Ton DEPENDENCY_LEDGER.md tient depuis 3 mois avec
                          un ratio lecture/ecriture >= 2x et dependance IA < 25%
```

Tu ne comprends pas encore chaque etape. Normal. Tu vois la ligne d'arrivee.
Ca suffit pour partir.

---

## QUAND ES-TU "DIPLOME" DE MYFUNNYJS ?

Question legitime, reponse binaire (les 5 conditions ci-dessus). Aucune n'est
optionnelle. Tu peux etre a 4/5 pendant des mois : ca veut dire que tu progresses,
pas que tu es arrive. Le diplome n'est pas remis par le repo. Il se declare
soi-meme, et se defend a l'oral (voir `31_annexes/19_interview/03_objection_storm.md`).

---

## QUELS FICHIERS FONT QUOI (la carte)

| Fichier / dossier                                        | Ce que ca fait                                                                           | Quand y aller                |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------- |
| `START_HERE.md`                                          | Tu es ici. Point d'entree unique.                                                        | Maintenant.                  |
| `README.md`                                              | Roadmap condensee des 32 modules.                                                        | Apres `02_day_one.md`.       |
| `.nvmrc`                                                 | Version de Node de reference (20 LTS).                                                   | Lu par `nvm`, pas par toi.   |
| `00_getting_started/`                                    | Installer, ecrire ton premier code.                                                      | Jour 1.                      |
| `00_referentiel/`                                        | Les 6 pierres, auto-diagnostic, ledger.                                                  | Jour 2.                      |
| `01_...` a `29_...`                                      | Les 32 modules de fond.                                                                  | Dans l'ordre.                |
| `30_mini_projects/`                                      | 18 projets (drill trimestriel IA en panne : 31_annexes/16_career/05_ai_famine_drill.md). | Au fil du parcours.          |
| `31_annexes/`                                            | Carriere, interview, portfolio, ethique.                                                 | Quand tu es pret a defendre. |
| `32_tools/`                                              | Outillage complementaire.                                                                | Au besoin.                   |
| `PLATEAU_JOURNAL.md` (a toi de creer)                    | Ton journal de blocage.                                                                  | Apres 2 jours sans progres.  |
| `DEPENDENCY_LEDGER.md` (a toi de creer dans tes projets) | Mesure ta dependance IA + ratio lecture/ecriture.                                        | Chaque fin de semaine.       |

## SCRIPTS ET FICHIERS EXECUTABLES : CE QU'ILS FONT

- `node solution.js` (auto-verif ecrite par toi) : dans chaque `EXO_JEUNE_IA.md`,
  tu ecris toi-meme le critere binaire de reussite. Pas de moteur cache.
- `node --test` : lanceur de tests natif Node 20 utilise partout dans les mini-projets.
- `npm audit --json > /tmp/audit.json` : scan de vulnerabilites, commite dans `SECURITY.md`.
- `crosslang_compare.sh` : compare ta sortie JS et ta sortie dans un autre langage
  (voir `31_annexes/16_career/01_crosslang_challenge.md`).
- `SPEC_DRIFT_MODE=on` : variable d'env qui active les triggers de spec changeante
  dans les mini-projets (voir `SPEC_DRIFT_TRIGGERS.md` de chaque projet).

---

## COMMENT T'EXERCER (le rythme)

- **Chaque jour** : 1 h minimum. 1 h/jour bat 8 h le samedi.
- **Chaque fichier** : lis en entier avant de coder. La lecon est dans le texte.
- **Chaque module** : finis un `EXO_JEUNE_IA.md` avant de passer au suivant.
- **Chaque semaine** : une entree dans ton `DEPENDENCY_LEDGER.md` personnel.
- **Chaque mini-projet** : POSTMORTEM signe + gate OWASP validee + un OBJECTION_STORM
  par ADR.
- **Chaque trimestre** : un drill `31_annexes/16_career/05_ai_famine_drill.md` (reconstruire un module sans IA).

---

## COMMENT NAVIGUER (conventions de noms)

- `00_*` : lecon d'entree d'un module (le "why").
- `_recall_*.md` / `_spaced_repetition.md` : trackers vivants, tu les remplis toi-meme.
- `MAJ.md` en majuscules (README, CHANGELOG, CONTRIBUTING) : docs racine.
- `-> ~XX min` en tete de chaque fichier : budget-temps lecture + exercice.

---

## FILET DE SECURITE (le "moteur manuel")

Chaque `EXO_JEUNE_IA.md` te demande d'ecrire toi-meme le critere binaire de
reussite : une commande `node solution.js`, une sortie attendue exacte. **Pas
de moteur cache.** Tu comprends ce que tu verifies. C'est la contrepartie
assumee de la suppression du dossier `.internal/` : un peu plus de discipline
demandee, un peu moins de boite noire subie. Plus formateur, plus honnete.
Utile quand tu doutes d'un chapitre. Pas au demarrage.

---

## BIENVENUE

Ce fichier fait moins de 200 lignes. C'est fait expres. Tu vois deja la ligne
d'arrivee, tu connais la carte, tu sais ce qui t'attend. Tu ne peux plus dire
"je me suis perdu au premier click". Si tu te perds quand meme : le `first
click replay` (`31_annexes/16_career/04_first_click_replay.md`) sert exactement
a corriger cette trahison-la.

---

## CE QU'IL TE FAUT SUR TA MACHINE

```
Node.js  : v20+
npm      : v10+ (inclus avec Node.js)
Editeur  : VSCode recommande (pas obligatoire)
Terminal : n'importe lequel, tu vas y vivre
```

Verifie avec :

```bash
node -v
npm -v
```

Si t'as pas Node.js : va sur nodejs.org, telecharge la version LTS, installe-la. Reviens apres.

---

## 15 MOTS QUE TU VAS CROISER DANS LA ROADMAP (juste en bas)

| Mot             | C'est quoi en une phrase                                                         |
| --------------- | -------------------------------------------------------------------------------- |
| Event Loop      | Le mecanisme qui fait tourner JS sur un seul thread sans jamais bloquer          |
| Runtime         | Le moteur qui execute ton code pendant que tu regardes ailleurs                  |
| Memory          | Comment ton programme stocke et libere ses donnees en RAM                        |
| Algorithm       | Une suite d'etapes precises pour resoudre un probleme                            |
| Functional (FP) | Coder sans muter d'etat, juste des fonctions qui transforment des donnees        |
| Pattern         | Une solution standard a un probleme de conception qui revient souvent            |
| Refactoring     | Ameliorer du code qui marche deja, sans changer ce qu'il fait                    |
| TypeScript (TS) | JavaScript avec des types : le compilateur attrape tes erreurs avant l'execution |
| Architecture    | Comment organiser un projet pour qu'il tienne quand il grossit                   |
| a11y            | Accessibilite : coder pour que tout le monde puisse utiliser ton site            |
| i18n            | Internationalisation : adapter ton app a plusieurs langues et pays               |
| API             | Le point de contact par lequel deux programmes se parlent                        |
| Scalability     | Tenir la charge quand tu passes de 10 a 10 millions d'utilisateurs               |
| Observability   | Voir ce qui se passe en prod sans attendre qu'un client se plaigne               |
| OOP             | Programmation orientee objet : organiser le code autour d'objets et de classes   |

Tu ne comprends pas encore le mecanisme derriere chaque mot, normal. C'est tout l'objet du curriculum. Ce tableau sert juste a ce que la roadmap ne te paraisse pas en chinois.

---

## DANS QUEL ORDRE LIRE (rappel)

```
1. START_HERE.md                          <= t'es ici
2. 00_getting_started/02_day_one.md       <= contexte du metier + poste de travail + premier code
3. 00_referentiel/where_you_stand.md      <= les 4 axes sur lesquels tu vas progresser
4. README.md                              <= la roadmap complete des 32 modules (01 -> 32)
5. 01_fundamentals/                       <= le vrai depart
```

Chaque fichier renvoie au suivant a sa fin. Suis le fil, te pose pas de question.

---

## FICHIERS RACINE (a quoi ils servent)

- `README.md` : porte d'entree officielle (roadmap).
- `START_HERE.md` : tu es ici.
- `.nvmrc` : version de Node de reference (source de verite unique, detaillee dans `31_annexes/29_toolchain/08_NODE_VERSIONS.md`).
- `31_annexes/29_toolchain/08_NODE_VERSIONS.md`, `31_annexes/28_templates/POSTMORTEM.md` : gouvernance technique legere utile au parcours.
- `COMMUNAUTE.md`, `LICENSE` : gouvernance projet.
- Contexte des premiers pas : `00_getting_started/02_day_one.md`.
- Guide carriere : `31_annexes/16_career/00_guide.md`.
- Tu veux savoir quel module vieillit vite ? -> `31_annexes/20_PERISSABILITE.md` (et l'index `31_annexes/21_PERISSABILITE_INDEX.md`).
- Zones grises entre modules 12, 13, 16, 18 (patterns / refactoring / architecture / OOP) ? -> `31_annexes/17_frontieres_modules.md`.

Si ca t'encombre, ignore-les au debut et suis juste l'ordre plus haut.

---

## CE QUE C'EST, EN UNE PHRASE

MyFunnyJS, c'est pas un cours JS de plus. C'est une methode pour construire un cerveau d'ingenieur : comprendre le runtime, lire du code inconnu, debugger un vrai probleme, prendre de bonnes decisions d'architecture. JavaScript est juste le terrain d'entrainement.

---

Direction `00_getting_started/02_day_one.md`.
