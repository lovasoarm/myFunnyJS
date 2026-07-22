---
stability: intemporel
---

# Scenarios Blind Debug

Trois bugs reproductibles pour l'exercice `06_blind_debug.md`.
Celui qui **tient le code** ouvre le fichier concerne. Celui qui **debug** ne le voit jamais.

- `scenario_1_debounce.js` : un `debounce` qui ne debounce pas.
- `scenario_2_double_post.js` : un `POST` qui part deux fois.
- `scenario_3_react_stale_state.jsx` : un state React qui oublie une update.

Regle : le "debugger" pose des questions, il ne demande jamais "envoie le code".
