---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# Garbage Collection : expliqué à 3 publics

-> ~10 min

## À UN ENFANT

Imagine ta chambre pleine de jouets. Certains, tu joues avec toutes les semaines. D'autres, tu ne les as pas touchés depuis 6 mois. Une fois par mois, ta mère passe et range dans un carton tous ceux qui traînent et que personne n'utilise. Elle ne jette **jamais** un jouet auquel tu es encore attaché : mais tout ce qui n'a plus de lien avec personne part au grenier. Le GC en JS fait pareil avec la mémoire : il libère ce qui n'est plus référencé.

## À UN PAIR DEV

Le GC de V8 est **generational** + **mark-and-sweep** + **incremental**. Concrètement :

- **New Space** (Scavenger) : objets fraîchement créés, GC toutes les 1-2 ms, très rapide.
- **Old Space** (Major GC) : objets qui ont survécu 2 cycles, GC plus lourd (10-100 ms), incrémental pour ne pas geler la main thread.
- **Racines** : globals, stack, closures actives. Tout objet joignable depuis une racine survit.
- **Fuite typique** : `Map` ou array global qui accumule, closure sur DOM détaché, listener non détaché.
- `WeakMap` / `WeakRef` : références qui **n'empêchent pas** la collecte.

## À UN CTO

Le GC est invisible tant que la mémoire est saine. Il devient une catastrophe business quand : (1) GC pauses > 200 ms bloquent le event loop et cassent le SLO latence, (2) fuite lente (100 Ko/heure) fait OOM au bout de 3 semaines : donc en pleine prod, jamais reproductible en staging. Signal d'embauche mid/senior : sait poser `process.memoryUsage()` + heap snapshot et lire la différence. Junior : croit que "JS a un GC donc pas de souci mémoire".
