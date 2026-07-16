---
stability: intemporel
---

# ENV MATRIX

| Version Node | Statut     | Note                                                     |
| ------------ | ---------- | -------------------------------------------------------- |
| 18.x         | ne tente pas | ES2022 partiel, plusieurs API manquantes                 |
| 20.x         | fonctionne | version cible (`.nvmrc`), ES2023 complet                 |
| 22.x         | fonctionne | supporté, non requis                                     |
| Deno / Bun   | non testé  | non couvert par le curriculum                            |

Code volontairement legacy doit être encadré par
`<!-- legacy-syntax: pre-node20 -->` ... `<!-- /legacy-syntax -->`.
