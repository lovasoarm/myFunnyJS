---
stability: intemporel
---

# 06 : Blind Debug

Temps de lecture ~5 min

> **Principe universel** : un bon debugger raisonne à partir des **symptômes**, pas du code. C'est ce que tu fais quand tu aides un collègue dont tu n'as pas le repo sous les yeux.

## Règle du jeu

- Un binôme (ou l'IA) tient le code.
- **Toi**, tu ne le vois pas.
- Tu poses **des questions** pour localiser le bug.
- Objectif : **nommer la ligne fautive** et le fix, sans ouvrir le fichier.

## 3 scénarios fournis (reproductibles, code fourni)

Le code de chaque scénario est dans [`scenarios/`](./scenarios/) : celui qui **tient le code** ouvre le fichier, celui qui **debug** ne le voit jamais.

1. Un `debounce` qui ne debounce pas -> [`scenarios/scenario_1_debounce.js`](./scenarios/scenario_1_debounce.js)
2. Une requête `POST` qui part deux fois -> [`scenarios/scenario_2_double_post.js`](./scenarios/scenario_2_double_post.js)
3. Un state React qui oublie une update -> [`scenarios/scenario_3_react_stale_state.jsx`](./scenarios/scenario_3_react_stale_state.jsx)

Les scénarios sont **reproductibles** : deux binômes différents jouent exactement le même bug, la comparaison de scores est valide.

## Rubrique de score

- Nombre de questions posées avant identification (moins = mieux).
- Les 3 meilleures questions à réutiliser plus tard.

## (attention) Piège

"Envoie-moi le code" = tu perds. La contrainte fait le muscle.
