[INTEMPOREL]

# HYPOTHESES_exemple.md : Mémoire (heap qui grimpe en prod)

Exemple rempli. Voir `../04_debugging/_TEMPLATE_HYPOTHESES.md`.

## 1. Hypothèses

- A : cache `Map<id, saiyan>` sans TTL.
- B : listeners `on('data')` empilés à chaque reconnexion websocket.
- C : gros `Buffer` gardé en global pour parser des CSV.

## 2. Écartement

- A écartée : `cache.size` reste sous 1 000.
- C écartée : le buffer est réassigné à chaque tick.

## 3. Retenue

Hypothèse B : chaque reconnexion websocket ajoute un listener sans retirer les anciens ; après 30 min, +5 000 listeners, +200 Mo.

## 4. Confirmation

- Expérience : instrumenter `emitter.listenerCount('data')` avant/après reconnexion.
- Attendu : compteur qui grimpe si bug, stable après fix.
- Observé : passait de 1 à 5 000, puis stable à 1 après `off('data')` dans le handler de reconnexion.
- Verdict : confirmée.

## 5. Fix

- `socket.off('data', h)` avant `socket.on('data', h)` sur reconnexion.
- Test : `listeners_dont_leak.test.js` qui reconnecte 100 fois et vérifie le compteur.
