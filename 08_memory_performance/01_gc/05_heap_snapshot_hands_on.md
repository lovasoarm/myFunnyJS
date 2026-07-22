---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# HEAP SNAPSHOT HANDS-ON
Temps de lecture ~35 min

Tu vas ouvrir la mémoire de ton process comme on ouvre un capot. Pas de théorie recopiée
d'un blog : tu prends un snapshot, tu compares deux snapshots, tu pointes l'objet coupable.

Prérequis : Node 20+, Chrome ou Edge (pour DevTools Memory), `--expose-gc`, avoir fait
`03_leak_from_closure_walkthrough.md`.

---

## 1) LE PROTOCOLE (à suivre à la lettre)

```
1. Lance ton process avec : node --expose-gc --inspect=0.0.0.0:9229 script.js
2. Ouvre chrome://inspect → "inspect" sur le target Node
3. Onglet Memory → "Take heap snapshot"  (snapshot A, état de repos)
4. Provoque l'action suspectée de fuite (10 fois, pour amplifier le signal)
5. Force le GC : dans la Console DevTools, tape gc()
  (nécessite --expose-gc, sinon global.gc() n'existe pas)
6. "Take heap snapshot"           (snapshot B, après action + GC)
7. Compare B vs A : Filter "Comparison" en haut à gauche
8. Trie par "# Delta" décroissant. Le top 5 est ta liste de suspects.
```

Règle d'or : **si un objet apparaît en delta positif APRÈS un GC forcé, il est retenu.**
Pas retenu = pas de fuite. Retenu = quelqu'un le tient. Ton job : trouver qui.

---

## 2) POURQUOI `--expose-gc` ET `gc()`

Sans forcer le GC, ton snapshot B contient encore des objets *poubelle mais pas ramassés*.
Tu confonds alors "pas encore collecté" et "fuite". `gc()` élimine ce bruit. En prod, tu
n'auras pas ce luxe : tu devras raisonner avec des heuristiques (heap growth trend,
`--trace-gc`). Ici, on apprend à distinguer les deux mondes.

---

## 3) LIRE LE PANNEAU "COMPARISON"

```
Objet        # New  # Deleted  # Delta  Size Delta
------------------  ------  ---------  -------  ----------
(closure)      120   0      +120    48 KB    <-- SUSPECT
Array        12    11      +1     120 B
HTMLElement (det.)  47    0      +47    14 KB    <-- SUSPECT (DOM détaché)
```

- **(closure)** : capture une variable qui vit trop longtemps (listener non retiré,
 callback stocké dans un cache global).
- **Detached DOM** : nœud retiré du DOM mais encore référencé par du JS. Classique en SPA.
- **Array** en croissance linéaire : cache sans borne, buffer, log en RAM.

---

## 4) MISSION (livrable)

Prends la fixture `30_mini_projects/13_memory_hunter/fixture/`.
Exécute le protocole ci-dessus. Produis `LEAK_REPORT.md` (template dans le mini-projet)
avec :

1. Nom du/des objets fuyants (retainer path complet).
2. Ligne de code coupable.
3. Fix proposé (diff minimal).
4. Snapshot C après fix : delta doit revenir à 0 sur l'objet ciblé.

Si tu ne peux pas fournir les 4 points, tu n'as pas trouvé la fuite. Tu as trouvé un
symptôme. Recommence.

---

## 5) (attention) CE QUE L'OUTIL CACHE

DevTools montre la heap V8 uniquement. Il ne montre PAS :
- la mémoire native (Buffer, addons C++, WebAssembly linear memory),
- les fuites côté OS (file descriptors, sockets),
- les fuites côté worker thread (chaque worker a sa propre heap).

Pour ça : `process.memoryUsage()`, `process.report`, `lsof -p <pid>`. À creuser dans
`06_native_and_worker_leaks.md`.

Prochaine étape : `06_detached_dom_leak.md`.
