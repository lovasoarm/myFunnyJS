![MyFunnyJS](./assets/title.svg)

**MyFunnyJS : 32 modules de fond (01 -> 32) + 2 préludes (`00_getting_started/`, `00_referentiel/`) + 16 mini-projets, apprenable seul.**

> **Nouveau ici ?** Va directement lire [`START_HERE.md`](./START_HERE.md).
> Ce README tient en 60 lignes exprès. Le reste est en annexe.

---

> **AVANT TOUT** : si tu n'as jamais installé Node de ta vie, va faire [`00_getting_started/01_install.md`](00_getting_started/01_install.md) d'abord. Reviens ici après.

## CE QUE C'EST

Un curriculum pour passer de "je copie-colle" à "je comprends ce que je fais, pourquoi je le fais, et je peux le défendre 6 mois après".

JS n'est que le vecteur. On construit les **six pierres** qui te rendent difficile à remplacer par une IA : Runtime, Mémoire, Asynchrone, Architecture, Debugging, Pensée Transférable.

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
30        16 mini-projets (Legacy Dungeon, Memory Hunter, Distributed Arena...)
31        Annexes : transférabilité, interview, portfolio, career, éthique
32        Tools
```

Arborescence complète, dépendances entre modules et noyau dur détaillé : [`31_annexes/00_arborescence_complete.md`](./31_annexes/00_arborescence_complete.md).

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
`.nvmrc` (référence) détaillée dans `NODE_VERSIONS.md`. Journal d'audit interne (non pédagogique) : `31_annexes/_meta/` (dont
`CORRECTIONS_APPLIQUEES.md` et `DEPENDENCY_LEDGER.md`). L'apprenant peut l'ignorer.
