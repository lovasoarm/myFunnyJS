---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 00 : Prereq check : Design Patterns
Temps de lecture ~5 min

> Tu ne dois **pas** entrer dans ce module si tu ne peux pas répondre à ces questions
> **sans regarder**. Ce n'est pas un test noté, c'est un filtre anti-illusion.
> Ces questions portent sur `11_functional_js`, le module que tu viens de finir.

## Questions

1. Fonction pure : définition, avec un exemple qui n'en est PAS une.
2. Cite trois effets de bord classiques qu'une fonction pure ne doit jamais avoir.
3. Le curry, en une phrase.
4. Différence entre curry et application partielle ?

## Verdict

- **3+ réponses solides** → tu peux entrer.
- **2 ou moins** → retour à `11_functional_js/`, ou à sa synthèse `08_fp_grimoire.md`.

> Se sentir "prêt" ≠ être prêt. Les questions ci-dessus tranchent.

> **Note pour ce module précis** : ce qu'un pattern résout vraiment, la
> différence Strategy/State, pourquoi éviter Singleton, et la différence
> Factory/Builder sont le contenu que ce module va t'enseigner : normal de
> ne pas encore les maîtriser. Ta compréhension est testée en fin de
> module, dans `04_patterns_grimoire.md`.


## PRÉREQUIS OBLIGATOIRE : POO MENTALISÉE (v19)

Avant d'entrer dans ce module, tu **dois** avoir lu et mentalisé :

- `18_oop_js/01_prototype_chain_raw.md` (chaîne de prototypes brute)
- `18_oop_js/03_class_syntax_sugar.md` (class = sucre au-dessus des prototypes)
- `18_oop_js/06_inheritance_extends_super.md` (héritage vs composition)
- `18_oop_js/09_composition_vs_inheritance.md` (le choix par défaut moderne)

**Pourquoi c'est vital** : Strategy, Observer, Factory, Decorator sont des
patterns qui manipulent objets, méthodes, héritage et composition. Les nommer
sans avoir la POO comme réflexe mental produit du code-culte, pas de la
compréhension. La pierre Architecture s'effondre si POO n'est pas déjà en toi.

Si tu n'as pas encore fait `18_oop_js/`, ferme ce module maintenant, va
lire ces 4 fichiers, reviens. Ce n'est pas négociable.
