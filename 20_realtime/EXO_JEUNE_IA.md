# EXO [JEUNE IA] : 20_realtime

Temps de lecture ~2 min


> Tag `[JEUNE IA]` : IA totalement coupee (Copilot/Claude/ChatGPT desactives).
> Duree : 45 min chrono. Auto-verifiable par le `verification_pack` du module.

## Consigne
Sans aucune assistance IA, sans autocompletion generative, resous le premier `drill` disponible dans `verification_pack/20_realtime/`. Si aucun drill n'existe : redige de memoire un mini-exercice couvrant le concept-cle du module (definition, exemple minimal runnable, un piege classique), puis fais-le tourner via `verify.sh`.

## Critere de reussite (deterministe)
```bash
bash verification_pack/20_realtime/verify.sh solution.js
# doit sortir avec code 0 et afficher "OK"
```
Binaire : soit `verify.sh` passe, soit non. Pas de zone grise.

## Preuve a livrer
- ta `solution.js` (aucun import IA, aucune completion generative acceptee).
- capture d'ecran de ton editeur avec Copilot/IA off.
- ton `HYPOTHESES.md` si tu as bloque > 10 min.
- ton `TDD_JOURNAL.md` optionnel : temps ecoule, blocages, ce que tu as du re-comprendre.

## Auto-evaluation (a cocher honnetement)
- [ ] IA coupee de bout en bout (0 completion, 0 chat).
- [ ] `verify.sh` passe en < 45 min.
- [ ] Je peux expliquer le concept a un debutant en 3 minutes, sans notes.

## Pourquoi c'est vital
Une connexion realtime (WebSocket, SSE) sans backpressure ni reconnexion, c'est un bug qui n'apparait qu'en prod sous charge. Ecrire ces controles sans IA prouve que tu les as compris, pas juste vus.
---
stability: intemporel
