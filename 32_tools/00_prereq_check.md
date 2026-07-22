---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
> (attention) **OUTIL PÉRISSABLE** : le tooling JS bouge chaque année. Traite ce module comme une REVUE, pas une bible. `Principes durables` en bas.

> **Périssable : valable 2026.** L'outil change vite ; le principe (build, format, lint, package) est **intemporel**.

# 00 : Prereq check : Tools
Temps de lecture ~5 min

> Tu ne dois **pas** entrer dans ce module si tu ne peux pas répondre à ces questions
> **sans regarder**. Ce n'est pas un test noté, c'est un filtre anti-illusion.
> Ces questions portent sur `28_edge_cases`, dernier module du tronc technique
> séquentiel avant ce bloc d'outils.

## Questions

1. Une race condition, en une phrase, avec un exemple concret ?
2. Cite trois cas limites d'un formulaire d'email qu'on oublie facilement.
3. Qu'est-ce qu'une erreur off-by-one, avec un exemple de code qui la produit ?
4. Cite un piège classique avec les dates et les fuseaux horaires.

## Verdict

- **3+ réponses solides** → tu peux entrer.
- **2 ou moins** → retour à `28_edge_cases/`, ou à sa synthèse `07_edge_cases_grimoire.md`.

> Se sentir "prêt" ≠ être prêt. Les questions ci-dessus tranchent.

> **Note pour ce module précis** : bootstrap un projet sans template,
> pourquoi verrouiller les versions, et la différence linter/formateur sont
> le contenu que ce module va t'enseigner : normal de ne pas encore les
> maîtriser. Ta compréhension est testée en fin de module, dans
> `05_tools_grimoire.md`.
