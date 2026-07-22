---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LE MODÈLE MENTAL JS EN 1 IMAGE
Temps de lecture ~10 min

Avant de plonger dans l'event loop, tu dois avoir UNE image en tête. Si tu ne l'as pas, la suite est du bruit.

---

## LA RÈGLE UNIQUE

> **JS a UNE seule pile d'exécution. Tout le reste est une file d'attente.**

Ta pile ("call stack") empile les appels de fonctions. Elle fait UNE chose à la fois. Point.

Tout ce qui n'est pas "en train de s'exécuter maintenant" attend dans une file : les timers, les I/O, les promises, les clics utilisateur. Un chef d'orchestre (l'event loop) pioche dans les files et pose le prochain morceau sur la pile QUAND ELLE EST VIDE.

---

## LE SCHÉMA À GRAVER

```
    ┌────────────────────────┐
    │   CALL STACK    │ ← 1 seule pile, LIFO
    │ [fonction courante]  │   "je fais UNE chose"
    └────────────▲───────────┘
           │ (event loop pousse quand vide)
  ┌─────────────────┴─────────────────┐
  │                  │
┌──┴──────────────┐      ┌───────┴──────────┐
│ MICROTASK QUEUE │ ←priorité│ MACROTASK QUEUE │
│ .then / await │      │ setTimeout, I/O │
└─────────────────┘      └──────────────────┘
```

Règle : la pile doit être VIDE pour que l'event loop pousse un nouveau job. Et il vide TOUTES les microtasks avant de toucher à une seule macrotask.

---

## (attention) CE QUE L'ANALOGIE (« chef d'orchestre ») CACHE

Il n'y a pas de "thread magique" qui exécute les I/O. C'est l'OS (libuv, kernel) qui prévient JS quand une donnée est prête. Le chef d'orchestre ne fait que planifier : il n'exécute rien lui-même.

---

## MINI-EXERCICE DE VISUALISATION

Dessine (à la main, sur papier) l'état de la pile et des deux files après chaque ligne :

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

Écris l'ordre d'affichage AVANT de tester. Puis lance-le. Si ton papier ment, c'est ton modèle mental qui doit changer, pas le code.

---

## PRINCIPES DURABLES

- Une pile, plusieurs files.
- Microtasks battent macrotasks.
- L'event loop ne pousse que sur pile vide.
- Les I/O sont déléguées à l'OS, pas exécutées par JS.

Prochain arrêt : [`04_event_loop/`](04_event_loop/).
