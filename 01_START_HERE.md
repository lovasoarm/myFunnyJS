> 🆕 **SUPER DÉBUTANT (jamais installé Node de ta vie) ?**
> Commence par [`00_getting_started/01_install.md`](00_getting_started/01_install.md) pour installer Node, Git et ton terminal. Reviens ici après.
>
> **Temps total estimé du curriculum** : ~250 h étalées sur 6 à 9 mois. Fractionne : 1 h/jour battra 8 h le samedi.

## COMMENT NAVIGUER (conventions de noms)

- `00_*` : leçon d'entrée d'un module (le "why").
- `_recall_*.md` / `_spaced_repetition.md` : trackers vivants, tu les remplis toi-même.
- `MAJ.md` en majuscules (README, CHANGELOG, CONTRIBUTING, DEPENDENCY_LEDGER) : docs racine.
- `-> ~XX min` en tête de chaque fichier : budget-temps lecture + exercice.
- ` PÉRISSABLE` : contenu à revérifier chaque année (typescript, realtime, tooling…).
- ` Principes durables` : la partie intemporelle qui reste vraie même quand l'outil change.

## VÉRIFICATION OBJECTIVE

Filet de sécurité optionnel : `verification_pack/<module>/verify.sh` exécute 3 drills à sortie déterministe. Utilise-le quand tu doutes.

---


# START HERE

-> ~5 min

Bienvenue sur MyFunnyJS. Ce fichier fait 100 lignes max. C'est fait exprès. Lis-le en entier,
ça prend 3 minutes, et tu sais exactement où aller ensuite.

---

## CE QU'IL TE FAUT SUR TA MACHINE

```
Node.js  : v20+
npm    : v10+ (inclus avec Node.js)
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

| Mot       | C'est quoi en une phrase                             |
| --------------- | -------------------------------------------------------------------------------- |
| Event Loop   | Le mécanisme qui fait tourner JS sur un seul thread sans jamais bloquer     |
| Runtime     | Le moteur qui exécute ton code pendant que tu regardes ailleurs         |
| Memory     | Comment ton programme stocke et libère ses données en RAM            |
| Algorithm    | Une suite d'étapes précises pour résoudre un problème              |
| Functional (FP) | Coder sans muter d'état, juste des fonctions qui transforment des données    |
| Pattern     | Une solution standard à un problème de conception qui revient souvent      |
| Refactoring   | Améliorer du code qui marche déjà, sans changer ce qu'il fait          |
| TypeScript (TS) | JavaScript avec des types : le compilateur attrape tes erreurs avant l'exécution |
| Architecture  | Comment organiser un projet pour qu'il tienne quand il grossit          |
| a11y      | Accessibilité : coder pour que tout le monde puisse utiliser ton site      |
| i18n      | Internationalisation : adapter ton app à plusieurs langues et pays        |
| API       | Le point de contact par lequel deux programmes se parlent            |
| Scalability   | Tenir la charge quand tu passes de 10 à 10 millions d'shinobis          |
| Observability  | Voir ce qui se passe en prod sans attendre qu'un client se plaigne        |
| OOP       | Programmation orientée objet : organiser le code autour d'objets et de classes  |

Tu comprends pas encore le mécanisme derrière chaque mot, normal. C'est tout l'objet du
curriculum. Ce tableau sert juste à ce que la roadmap ne te paraisse pas en chinois.

---

## DANS QUEL ORDRE LIRE

```
1. 01_START_HERE.md     <= t'es ici
2. 02_DAY_ONE_intro.md       <= le contexte du métier dev en 2026, avant de toucher au code
3. 03_WHERE_YOU_STAND.md   <= les 4 axes sur lesquels tu vas progresser (coup d'oeil rapide)
4. README.md         <= la roadmap complète des 32 modules
5. 01_fundamentals/      <= le vrai départ
```

Chaque fichier renvoie au suivant à sa fin. Suis le fil, te pose pas de question.

---

## CE QUE C'EST, EN UNE PHRASE

MyFunnyJS, c'est pas un cours JS de plus. C'est une méthode pour construire un cerveau
d'ingénieur : comprendre le runtime, lire du code inconnu, debugger un vrai problème,
prendre de bonnes décisions d'architecture. JavaScript est juste le terrain d'entraînement.

---

Direction `02_DAY_ONE_intro.md`.
