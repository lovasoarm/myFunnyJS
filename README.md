---
stability: stable
---

![MyFunnyJS](./assets/title.svg)

# MyFunnyJS

Temps de lecture ~3 min

**MyFunnyJS : 32 modules de fond (01 -> 32) + 2 preludes (`00_getting_started/`, `00_referentiel/`) + 18 mini-projets + 1 drill trimestriel de survie (voir `31_annexes/16_career/05_ai_famine_drill.md`), apprenable seul.**

> **Nouveau ici ?** Va directement lire [`START_HERE.md`](./START_HERE.md).
> Ce README tient volontairement court. Le detail est en annexe.

---

> **AVANT TOUT** : si tu n'as jamais installe Node de ta vie, va faire [`00_getting_started/01_install.md`](00_getting_started/01_install.md) d'abord. Reviens ici apres.

> **Auto-verification des exercices** : chaque `EXO_JEUNE_IA.md` te demande d'ecrire toi-meme le critere binaire de reussite (une commande `node solution.js`, une sortie attendue exacte). Pas de moteur cache, pas de boite noire : tu vois ton test, tu vois ta sortie, tu compares. C'est ca, la vraie discipline.

## CE QUE C'EST

Un curriculum pour passer de "je copie-colle" a "je comprends ce que je fais, pourquoi je le fais, et je peux le defendre 6 mois apres".

JS n'est que le vecteur. On construit les **six pierres** (detaillees dans `00_referentiel/`) qui te rendent difficile a remplacer par une IA : Runtime, Memoire, Asynchrone, Architecture, Debugging, Pensee Transferable.

En 2026, taper du code vite ne vaut plus rien : l'IA le fait deja. Ce qui reste rare : comprendre, choisir, securiser, debugger. Ce curriculum sert a ca.

---

## PAR OU COMMENCER (dans l'ordre, sans reflechir)

1. Lis `START_HERE.md` (5 min).
2. Ouvre `00_getting_started/02_day_one.md` : tu ecris tes 3 premieres lignes de JS.
3. Va voir `00_referentiel/where_you_stand.md` : tu comprends ou tu en es.
4. Reviens ici, regarde la roadmap ci-dessous.
5. Attaque `01_fundamentals/`. Un fichier apres l'autre.

Si tu bloques plus de 2 jours -> tu ouvres `PLATEAU_JOURNAL.md` (a toi de creer). Si 7 jours -> `31_annexes/16_career/03_plateau_playbook.md`.

---

## LES 5 REGLES DU JEU

1. **Lis chaque `.md` en entier avant de coder.** La lecon est dans le texte, pas dans le code.
2. **Code toi-meme.** L'IA propose, tu decides. Copier-coller sans comprendre : seule faute grave.
3. **Finis les mini-projets.** C'est la que les concepts s'assemblent en vrai geste. Chacun avec gate OWASP validee (voir `30_mini_projects/19_templates/01_POSTMORTEM_TEMPLATE.md`).
4. **Remplis TDD_JOURNAL, POSTMORTEM, ADR.** Ce ne sont pas des formalites. **Chaque ADR declenche un OBJECTION_STORM chronometre** (voir `31_annexes/19_interview/03_objection_storm.md`).
5. **Rejoue le drill `solo_vs_copilot`** aux checkpoints imposes : sinon tu ne mesures rien. **Checkpoint bloquant apres le module 14 : crosslang challenge** (voir `31_annexes/16_career/01_crosslang_challenge.md`).

---

## ROADMAP CONDENSEE

> Deux preludes non numerotes ouvrent le parcours : `00_getting_started/`
> (installer Node/Git, premier code) et `00_referentiel/` (la boussole des six
> pierres et l'auto-diagnostic). Viennent ensuite les **32 modules de fond**,
> en sequence continue `01 -> 32`, sans trou :

```
01 -> 07  Fundamentals · Problem Solving · Async · Debugging · Errors · Testing · Math
08 -> 11  Memory · Data Structures · Algorithms · Functional
12 -> 17  Patterns · Refactoring · TypeScript · Runtime · Architecture · Web Concepts
          [CHECKPOINT BLOQUANT apres 14 : crosslang challenge]
18 -> 22  OOP · Web Inclusive · Realtime · API · Security
23        AI-Native Dev
24 -> 28  Databases · Scalability · Observability · Team · Edge Cases
29        AI Agents & Autonomy
30        18 mini-projets (Legacy Dungeon, Memory Hunter, Distributed Arena...)
          + drill trimestriel "IA en panne" (voir 31_annexes/16_career/05_ai_famine_drill.md)
31        Annexes : transferabilite, interview, portfolio, career, ethique
          Carte detaillee : 31_annexes/15_ARBORESCENCE.md
Templates reutilisables : 31_annexes/28_templates/  (POSTMORTEM, HYPOTHESES, PUBLICATION)
32        Tools
```

Arborescence complete, a consulter au besoin (pas a lire d'une traite) : [`31_annexes/15_ARBORESCENCE.md`](./31_annexes/15_ARBORESCENCE.md).

---

## QUAND ES-TU "DIPLOME" DE MYFUNNYJS ?

Cinq conditions binaires. Aucune n'est optionnelle :

1. Les **32 modules** ont chacun un POSTMORTEM personnel signe.
2. Les **18 mini-projets** sont livres avec gate OWASP validee (0 TODO dans le POSTMORTEM).
3. Le **crosslang challenge** est passe (6/6 sur la grille, artefact commite dans un langage non-JS).
4. Un **first click replay** (`31_annexes/16_career/04_first_click_replay.md`) a ete filme avec un vrai debutant : 0 a 2 hesitations en 30 min.
5. Ton **DEPENDENCY_LEDGER.md** personnel tient depuis 3 mois avec dependance IA < 25 % et ratio lecture/ecriture >= 2x.

Tu peux te bloquer 4/5 pendant des mois : ca veut dire que tu progresses, pas que tu es arrive. Le diplome ne se distribue pas, il se defend a l'oral (`31_annexes/19_interview/03_objection_storm.md`).

---

## COMMENT DEMARRER (5 min)

```bash
node -v   # >= 22 (LTS 2026, voir .nvmrc) (voir .nvmrc, source de verite unique)
git --version
```

Puis ouvre [`START_HERE.md`](./START_HERE.md).

---

Licence : voir [`LICENSE`](./LICENSE) : tu peux reutiliser et adapter le materiel
dans le cadre qui y est decrit. Communaute : `COMMUNAUTE.md`. Version de Node :
`.nvmrc` (reference) detaillee dans `31_annexes/29_toolchain/08_NODE_VERSIONS.md`.
Le fichier `00_referentiel/DEPENDENCY_LEDGER.md` est fourni comme modele vide a copier :
ce n'est pas TON registre personnel. Ton propre `DEPENDENCY_LEDGER.md` (voir
`00_getting_started/02_day_one.md`) est a creer et tenir a jour a la racine
de ton propre projet, pas un fichier fourni par le curriculum.

---
