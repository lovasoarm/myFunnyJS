[INTEMPOREL]

![MyFunnyJS](./assets/title.svg)

**MyFunnyJS · Odin Edition : 33 modules + 16 mini-projets, apprenable seul.**
_Version v2026.4 : nettoyage structure 03/07/2026 (38 dossiers doublons dégagés, numérotation unifiée sur 33 modules, voir CHANGELOG.md)._

> **Nouveau ici ?** Va directement lire [`01_START_HERE.md`](./01_START_HERE.md).
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

## ROADMAP CONDENSÉE (33 modules)

```
01 -> 07   Fundamentals · Problem Solving · Async · Debugging · Errors · Testing · Math
08 -> 11   Memory · Data Structures · Algorithms · Functional
12 -> 16   Patterns · Refactoring · TypeScript · Runtime · Architecture
17 -> 22   Web Concepts · Accessibility · i18n · Realtime · API · Security
23 -> 24   AI-Native Dev · AI Agents & Autonomy                        [périssable]
25 -> 29   Databases · Scalability · Observability · Team · Edge Cases
30         OOP JS (mécanique profonde du langage)
31         16 mini-projets (Legacy Dungeon, Memory Hunter, Distributed Arena...)
32         Annexes : transférabilité, interview, portfolio, career, éthique
33         Tools                                                       [périssable 2026]
```

Arborescence complète, dépendances entre modules et noyau dur détaillé : [`32_annexes/00_arborescence_complete.md`](./32_annexes/00_arborescence_complete.md).

---

## COMMENT DÉMARRER (5 min)

```bash
node -v      # >= 20 (voir .nvmrc)
git --version
```

Puis ouvre [`01_START_HERE.md`](./01_START_HERE.md).

---

## POUR LES AUDITEURS / RECRUTEURS

- Portfolio auto-audité par CI : [`scripts/portfolio_ci/README.md`](./scripts/portfolio_ci/README.md)
- Épreuve finale cross-language obligatoire : [`32_annexes/transferability/08_final_cross_language_challenge.md`](./32_annexes/transferability/08_final_cross_language_challenge.md)
- Historique et postmortems d'audit : [`CHANGELOG.md`](./CHANGELOG.md)
- Nettoyage structure v2026.4 : 38 dossiers doublons dégagés (racine + verification_pack), numérotation unifiée 01→33, voir CHANGELOG entrée `v2026.4`.

Licence : voir `LICENSE`. Communauté : `COMMUNAUTE.md`.
