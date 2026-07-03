# NODE_VERSIONS.md
Temps de lecture ~5 min

> Version minimale de Node.js requise par module.
> Règle d'or : tout ce qui n'est pas listé fonctionne sur **Node 20 LTS**.

| Module | Node min | Pourquoi |
|---|---|---|
| 01–07 | 18 | JS de base, aucune API récente |
| 08 memory | 20 | `--heap-prof`, `performance.measureUserAgentSpecificMemory` |
| 14 typescript | 20 | strip-types, `tsx` fiable |
| 15 runtime_env | 20 | `node --watch`, `node:test` stable |
| 20 realtime | 20 | `WebSocket` global sans flag |
| 23 ai_native_dev | 20 | fetch/streams stables |
| 24–28 | 20 | crypto, worker_threads stables |
| 30 mini_projects | 20 LTS | référence de prod |

Vérifie ta version : `node -v`. Installe via `nvm install 20 && nvm use 20`.
