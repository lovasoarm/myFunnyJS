---
stability: stable
---

![MyFunnyJS](./assets/title.svg)

# MyFunnyJS

Temps de lecture ~2 min

**MyFunnyJS : 32 modules de fond (01 -> 32) + 2 préludes (`00_getting_started/`, `00_referentiel/`) + 17 mini-projets, apprenable seul.**

> **Nouveau ici ?** Va directement lire [`START_HERE.md`](./START_HERE.md).
> Ce README tient en 60 lignes exprès. Le reste est en annexe.

---

> **AVANT TOUT** : si tu n'as jamais installé Node de ta vie, va faire [`00_getting_started/01_install.md`](00_getting_started/01_install.md) d'abord. Reviens ici après.

> **`.tools/verification_pack/`** : le moteur de vérification automatique de tes exercices. Tu n'as pas besoin d'y toucher : il est appelé par les `verify.sh` cités dans chaque `EXO_JEUNE_IA.md`. Elle compare ta sortie à un résultat attendu ; si ça matche, le test passe. Considère-le comme une boîte noire fiable.

## CE QUE C'EST

Un curriculum pour passer de "je copie-colle" à "je comprends ce que je fais, pourquoi je le fais, et je peux le défendre 6 mois après".

JS n'est que le vecteur. On construit les **six pierres** (détaillées juste ici) qui te rendent difficile à remplacer par une IA : Runtime, Mémoire, Asynchrone, Architecture, Debugging, Pensée Transférable.

En 2026, taper du code vite ne vaut plus rien : l'IA le fait déjà. Ce qui reste rare : comprendre, choisir, sécuriser, débugger. Ce curriculum sert à ça.

---

## LES 5 RÈGLES DU JEU

1. **Lis chaque `.md` en entier avant de coder.** La leçon est dans le texte, pas dans le code.
2. **Code toi-même.** L'IA propose, tu décides. Copier-coller sans comprendre : seule faute grave.
3. **Finis les mini-projets.** C'est là que les concepts s'assemblent en vrai geste.
4. **Remplis TDD_JOURNAL, POSTMORTEM, ADR.** Ce ne sont pas des formalités.
5. **Rejoue le drill `solo_vs_copilot`** aux checkpoints imposés : sinon tu ne mesures rien.

---

## ROADMAP CONDENSÉE

> Deux préludes non numérotés ouvrent le parcours : `00_getting_started/`
> (installer Node/Git, premier code) et `00_referentiel/` (la boussole des six
> pierres et l'auto-diagnostic). Viennent ensuite les **32 modules de fond**,
> en séquence continue `01 -> 32`, sans trou :

```
01 -> 07  Fundamentals · Problem Solving · Async · Debugging · Errors · Testing · Math
08 -> 11  Memory · Data Structures · Algorithms · Functional
12 -> 17  Patterns · Refactoring · TypeScript · Runtime · Architecture · Web Concepts
18 -> 22  OOP · Web Inclusive · Realtime · API · Security
23        AI-Native Dev
24 -> 28  Databases · Scalability · Observability · Team · Edge Cases
29        AI Agents & Autonomy
30        17 mini-projets (Legacy Dungeon, Memory Hunter, Distributed Arena...)
31        Annexes : transférabilité, interview, portfolio, career, éthique
          Carte détaillée : 31_annexes/00_arborescence_complete.md
Templates réutilisables : 31_annexes/templates/  (POSTMORTEM, HYPOTHESES, PUBLICATION)
32        Tools
```

Arborescence complète, à consulter au besoin (pas à lire d'une traite) : [`31_annexes/00_arborescence_complete.md`](./31_annexes/00_arborescence_complete.md).

---

## COMMENT DÉMARRER (5 min)

```bash
node -v   # >= 20 (voir .nvmrc)
git --version
```

Puis ouvre [`START_HERE.md`](./START_HERE.md).

---

Licence : voir [`LICENSE`](./LICENSE) : tu peux réutiliser et adapter le matériel
dans le cadre qui y est décrit. Communauté : `COMMUNAUTE.md`. Version de Node :
`.nvmrc` (référence) détaillée dans `31_annexes/toolchain/NODE_VERSIONS.md`.
Journal d'audit interne (non pédagogique, ignore-le) : `.audit/`,
dont `DEPENDENCY_LEDGER.md`, fourni comme modèle vide à copier : ce n'est
pas TON registre personnel. Ton propre `DEPENDENCY_LEDGER.md` (voir
`00_getting_started/02_day_one.md`) est à créer et tenir à jour à la racine
de ton propre projet, pas un fichier fourni par le curriculum.
