---
stability: intemporel
---

# portfolio.md : la sortie unique du curriculum

Temps de lecture ~2 min


> Le CV technique de l'apprenant. Une seule page qui agrège les preuves
> éparpillées dans les 18 mini-projets : pierres travaillées, ADR clés,
> postmortems marquants, auto-évaluation. C'est ce que tu montres à un
> recruteur pressé en 3 minutes.

## Comment le remplir

Après chaque mini-projet terminé, remplis sa ligne : coche la/les pierre(s),
lie l'ADR décisif et le postmortem le plus instructif, note-toi de 0 à 5
(0 = pas fait, 5 = je peux le défendre 6 mois après). Génère la version
finale avec `31_annexes/14_generate_portfolio_report.md`.

## Les six pierres (rappel)

P1 Runtime · P2 Mémoire · P3 Asynchrone · P4 Architecture · P5 Debugging ·
P6 Pensée transférable.

## Tableau de preuves

| # | Mini-projet | Pierres | ADR clé | Postmortem clé | Auto-éval /5 |
|---|-------------|---------|---------|----------------|--------------|
| 01 | rasengan_engine | P1 P4 | `01_rasengan_engine/ADR/` | `01_rasengan_engine/POSTMORTEM.md` | _ |
| 02 | garo_no_kronika | P3 P5 | `02_garo_no_kronika/ADR/` | `02_garo_no_kronika/POSTMORTEM.md` | _ |
| 03 | walking_dead_protocol | P4 P5 | `03_walking_dead_protocol/ADR/` | `03_walking_dead_protocol/POSTMORTEM.md` | _ |
| 04 | breaking_cache | P2 P1 | `04_breaking_cache/ADR/` | `04_breaking_cache/POSTMORTEM.md` | _ |
| 05 | prison_break_api | P4 P3 | `05_prison_break_api/ADR/` | `05_prison_break_api/POSTMORTEM.md` | _ |
| 06 | ultras_dashboard | P1 P4 | `06_ultras_dashboard/ADR/` | `06_ultras_dashboard/POSTMORTEM.md` | _ |
| 07 | ballon_dor_cli | P6 P1 | `07_ballon_dor_cli/ADR/` | `07_ballon_dor_cli/POSTMORTEM.md` | _ |
| 08 | trapsoul_radio | P3 P2 | `08_trapsoul_radio/ADR/` | `08_trapsoul_radio/POSTMORTEM.md` | _ |
| 09 | oracle_glitch | P5 P4 | `09_oracle_glitch/ADR/` | `09_oracle_glitch/POSTMORTEM.md` | _ |
| 10 | legacy_dungeon | P5 P6 | `10_legacy_dungeon/ADR/` | `10_legacy_dungeon/POSTMORTEM.md` | _ |
| 11 | scheduler | P3 P1 | `11_scheduler/ADR/` | `11_scheduler/POSTMORTEM.md` | _ |
| 12 | legacy_takeover | P5 P6 | `12_legacy_takeover/ADR/` | `12_legacy_takeover/POSTMORTEM.md` | _ |
| 13 | memory_hunter | P2 P5 | `13_memory_hunter/ADR/` | `13_memory_hunter/POSTMORTEM.md` | _ |
| 14 | system_design_lab | P4 P3 | `14_system_design_lab/ADR/` | `14_system_design_lab/POSTMORTEM.md` | _ |
| 15 | porte_rasengan_engine_multilang | P6 P4 | `15_porte_rasengan_engine_multilang/ADR/` | `15_porte_rasengan_engine_multilang/POSTMORTEM.md` | _ |
| 16 | distributed_arena | P3 P4 | `16_distributed_arena/ADR/` | `16_distributed_arena/POSTMORTEM.md` | _ |
| 17 | polyglot_forge | P6 P4 | `17_polyglot_forge/ADR/` | `17_polyglot_forge/POSTMORTEM.md` | _ |

## Les trois preuves non-remplaçables (à savoir raconter par cœur)

1. **Diagnostic causal en prod dégradée** : quel bug, quelle décision-racine,
   comment tu l'as prouvé (voir `04_debugging/` + `13_memory_hunter/`).
2. **Arbitrage architectural sous contraintes contradictoires** : quel ADR,
   quels trade-offs (voir `14_system_design_lab/` + `31_annexes/12_trade_off_arena.md`).
3. **Portage cross-langage d'un concept** : JS -> Python/Go (voir
   `15_porte_rasengan_engine_multilang/` + `31_annexes/transferability/`).

## Score global

Somme des auto-évals / 85. En dessous de 60/85 (70 %), tu n'es pas encore
prêt à publier ce portfolio : cible d'abord les lignes à 0-2.
