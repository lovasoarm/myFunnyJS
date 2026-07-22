---
stability: intemporel
---

# 04a : first_click_log.md (template de livrable)

> À remplir **pendant** ou juste après la session `04_first_click_replay.md`.
> Un log par sujet. Trois sujets minimum pour valider la promesse "0-2
> hésitations > 5 s".

## Métadonnées

- Sujet : `<pseudo>`
- Profil : `<vrai débutant / a déjà tapé une commande / …>`
- Date : `<YYYY-MM-DD>`
- Machine : `<VM Ubuntu vierge / mac perso / …>`
- Version du repo testée : `<git sha ou tag>`

## Timeline horodatée

| t (mm:ss) | Action / événement    | Hésitation > 5 s ? | Verbatim (voix off) |
| --------- | --------------------- | ------------------ | ------------------- |
| 00:00     | Ouvre `START_HERE.md` | non                | "OK je lis…"        |
| 00:00     |                       |                    |                     |

## Compteurs

- Hésitations > 5 s : `<n>`
- Blocages > 30 s (a demandé de l'aide) : `<n>`
- Abandons (a fermé le repo) : `<0 attendu>`

## Verdict

- [ ] 0-2 hésitations > 5 s → promesse tenue pour ce sujet
- [ ] 3+ hésitations > 5 s → promesse cassée, remplir `04b_first_click_diff.md`
