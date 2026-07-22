---
stability: intemporel
---

# Scénarios de blind debug

Trois bugs reproductibles. Le binôme (ou l'IA) charge le scénario et **ne montre pas le code** à celui qui debug. Ce dernier pose des questions ciblées jusqu'à identifier la ligne fautive et le fix.

Voir `04_debugging/06_blind_debug.md` pour la règle du jeu.

- `scenario_1_debounce.js` : un `debounce` qui ne debounce pas.
- `scenario_2_double_post.js` : une requête POST qui part deux fois.
- `scenario_3_react_stale_state.jsx` : un state React qui "oublie" une update.