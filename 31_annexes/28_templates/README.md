---
stability: intemporel
---

# Templates réutilisables

Temps de lecture ~2 min

Cet emplacement regroupe les templates qui servent à plusieurs modules à la
fois. Chaque module peut y pointer sans dépendre d'un chemin d'un autre
module.

| Template | Rôle | Utilisé par |
|---|---|---|
| `POSTMORTEM.md` | Squelette de post-mortem d'incident ou de mini-projet | 30_mini_projects, 26_observability, 22_security |
| `HYPOTHESES.md` | Grille d'hypothèses pour un debug méthodique | 04_debugging, 28_edge_cases, 26_observability |
| `PUBLICATION_CHECKLIST.md` | Checklist avant de publier un billet ou un repo | 30_mini_projects, 27_team_craft, 31_annexes/career |

## Convention

- Un template ne se lit pas comme une leçon : il se copie et se remplit.
- Ne jamais modifier le template en place quand tu remplis un cas concret :
  copie-le dans le mini-projet ou l'incident, puis remplis la copie.
- Un ajout de template ici doit être précédé d'au moins deux modules qui
  en ont besoin (sinon il reste dans le module d'origine).
