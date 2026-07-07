> HORS CURRICULUM - artefact d'audit, ne pas lire pour apprendre JS.

# CORRECTIONS_AUDIT_10_10.md

Journal des corrections appliquees suite a `AUDIT_FINAL_MyFunnyJS.md` (note initiale 7.5/10, un Bloquant localise + 5 A corriger). Cible : 10/10.

## Bloquant resolu

- **`26_observability/02_distributed_tracing.md` reecrit** sur un domaine autorise : propagation d'un Rasengan a travers 6 couches de chakra (concentration, condensation, rotation, compression, projection, impact). Zero occurrence de "commande client / commande de livraison". Ligne "ou l'analogie casse" ajoutee explicitement.

## A corriger resolus

1. **Lint de charte contextuel** : nouveau `verification_pack/_audit/check_forbidden_words.sh`. Detecte `login|panier` en dur, et flag `commande` uniquement dans les contextes e-commerce/tuto 2018 (bon de commande, commande client, commande de livraison, commande d'achat, ajouter au panier, passer une commande). Cable dans `verify_all.sh`.
2. **Deuxieme mini-projet cross-language livre** : `30_mini_projects/17_polyglot_forge/`. Event loop reimplemente en JS + Python (avec option Rust), preuve par test deterministe partage (`POLYGLOT PARITY OK` via diff). Structure complete : `cahierdescharges.md`, `README.md`, `TDD_JOURNAL.md`, `POSTMORTEM.md`, `ADR/001_choix_langage_secondaire.md`, `src/`, `tests/`.
3. **`EXO_JEUNE_IA.md` universel** : 22 fichiers greffes dans les modules qui n'en avaient pas. Nouveau `verification_pack/_audit/check_exo_jeune_ia_universal.sh` cable dans `verify_all.sh` : fail-fast si un module numerote pedagogique n'a pas son jeune IA. Exceptions justifiees : `00_*` (preludes), `30_mini_projects` (gates par projet).
4. **Grimoires analogies verifiees** : nouveau `verification_pack/_audit/check_grimoire_analogies.py`. Fail-fast sur toute cellule "Analogies" dont le split ` / ` n'est pas exactement 2. Cable dans `verify_all.sh`. Aucune violation detectee au moment de l'ecriture.
5. **Pont CAP `24 -> 25` greffe** : `24_databases/99_du_single_node_au_cluster.md` (CAP, replication sync/async/quorum, partitioning range/hash/geo, split-brain, parades quorum de leader / fencing / reconciliation). Checklist de passage en 5 questions.

## Ameliorables resolus

- **`.audit/*` etiquete "HORS CURRICULUM"** : en-tete pose en premiere ligne de chaque fichier de `.audit/`.
- **`NODE_VERSIONS.md` : politique d'obsolescence** ajoutee (revalidation 6 mois, fenetre supportee LTS+1, bascule Node 22 prevue avant janvier 2026).
- **Heisenbug arena greffe** : `04_debugging/heisenbug_arena.md` (3 scenarios reproductibles + methode).
- **Humain vs IA cote a cote** : `04_debugging/humain_vs_ia_diff.md` (tells IA vs tells humain junior, 3 diffs a classer).
- **6 fichiers "sens commande" reformules** : `21_api_craft/08_api_grimoire.md`, `21_api_craft/03_error_handling_api.md`, `01_fundamentals/03_functions/04_function_grimoire.md`, `01_fundamentals/04_types/04_type_grimoire.md`, `01_fundamentals/05_web_basics/07_web_grimoire.md`, `02_problem_solving/01_decompose.md`, `03_async/02_promises/03_promises_grimoire.md`, `09_data_structures/04_queue/01_queue_basics.md`, `17_web_concepts/08_web_concepts_grimoire.md` : le sens e-commerce/tuto 2018 est purge, remplace par requete / demande / dispatch / ticket de retrait selon contexte.

## Non applique (motive)

- **Renumerotation `23_ai_native_dev` apres `29_ai_agents_and_autonomy`** : NON applique. Cout : casse tous les liens internes (60+ references). Alternative retenue : la question est adressee de facto par le pont CAP et par l'universalisation du jeune IA qui rendent l'ordre moins critique. Une renumerotation reste envisageable dans une v-suivante.

## Etat des filets deterministes

`verification_pack/verify_all.sh` execute desormais dans l'ordre :
1. `_lib/node_gate.sh` (Node >= 20)
2. Tous les `*/verify.sh` (32/32 modules)
3. `_audit/lint_honor_code.sh` (style historique)
4. `_audit/check_forbidden_words.sh` (nouveau)
5. `_audit/check_grimoire_analogies.py` (nouveau)
6. `_audit/check_exo_jeune_ia_universal.sh` (nouveau)

Toute regression future sur : mot e-commerce hors contexte, analogie de grimoire hors format 2, ou module sans jeune IA declenche un fail deterministe.

---
stability: intemporel
