---
stability: perissable
---

# NODE_VERSIONS.md

Temps de lecture ~4 min

> **Source de vérité unique** : le fichier `.nvmrc` (racine) fixe la version
> Node de référence. Ce document ne fait que détailler, module par module,
> le minimum requis. En cas de doute, `.nvmrc` fait foi.
>
> **Dernière revue : juillet 2026** (voir « Politique de version » en bas).

## Version courante

- `.nvmrc` : **Node 20 LTS**
- Fenêtre supportée : Node 20 LTS et Node 22 LTS (curriculum testé sur les
  deux).

Vérifie ta version :

```bash
node -v
# si < 20 :
nvm install 20 && nvm use 20
```

## Minimum par module

| Module | Node min | Pourquoi |
|---|---|---|
| 01 → 07 | 18 | JS de base, aucune API récente. |
| 08 memory | 20 | `--heap-prof`, `performance.measureUserAgentSpecificMemory`. |
| 14 typescript | 20 | strip-types, `tsx` fiable. |
| 15 runtime_env | 20 | `node --watch`, `node:test` stable. |
| 20 realtime | 20 | `WebSocket` global sans flag. |
| 23 ai_native_dev | 20 | fetch / streams stables. |
| 24 → 28 | 20 | crypto, worker_threads stables. |
| 30 mini_projects | 20 LTS | référence de prod. |

Tout ce qui n'est pas listé fonctionne sur Node 20 LTS.

---

## Politique de version

**État au 07/2026 :** Node 20 LTS reste la référence du curriculum. Node 22
LTS est validé comme compatible (tests passés en juin 2026), mais n'est pas
promu source unique tant que Node 20 LTS reçoit ses derniers patches de
sécurité (fenêtre d'obsolescence : avril 2026 → avril 2027, cf. calendrier
officiel Node).

**Décision de ne PAS basculer .nvmrc sur 22 en 2026 :**

- Le curriculum est stable sur 20, changer `.nvmrc` casse la reproductibilité
  des snapshots d'exercice (heap-prof, --inspect, `node:test`) pour les
  apprenants en cours de parcours.
- Le bénéfice de 22 (WebSocket client, quelques micro-perfs) n'est utilisé
  par aucun exercice noyau.
- Bascule planifiée : `.nvmrc` → 22 en avril 2027, quand 20 sort de LTS.
- Bascule vers Node 24 LTS : à évaluer fin 2027, une fois les mini-projets
  30 revalidés dessus.

**Règle de gouvernance :**

- Revalider tous les 6 mois.
- Ne modifier `.nvmrc` que sur décision documentée dans
  `00_referentiel/DEPENDENCY_LEDGER.md`.
- Fenêtre supportée : « LTS active `.nvmrc` + LTS suivante ». Au-delà, le
  lecteur doit adapter.

Cette section est datée. Si tu la lis un an après juillet 2026 sans qu'une
nouvelle revue soit consignée : considère-la comme dette et signale-le.

---

## Mise a jour 2026 : Node 22 devient LTS

Depuis octobre 2024, **Node 22** est la ligne LTS active ; en 2026 c'est la
version de reference du curriculum. Le `.nvmrc` a la racine pointe sur `22`.
Node 20 reste supporte (fin de vie avril 2026) mais tous les nouveaux
mini-projets sont testes sur Node 22. Si tu es coince en 20, aucun exercice
ne casse : les APIs utilisees sont compatibles. Bascule des que tu peux avec
`nvm install 22 && nvm use 22`.
