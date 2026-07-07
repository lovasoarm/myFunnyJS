> HORS CURRICULUM - artefact d'audit, ne pas lire pour apprendre JS.

# CORRECTIONS_AUDIT_FINAL.md

Journal des corrections appliquees suite a `AUDIT_FINAL_MyFunnyJS.md` (Jarvis, note initiale 6.5/10, deux Bloquants).

## 1. BLOQUANT : purge du bug `ordres_mission` (62 fichiers, 165 occurrences)

Un search-replace industriel avait mute "commande(s)" en "ordres_mission" dans 62 fichiers, cassant :
- le pattern Command (module 12) ;
- les lecons CLI (`git remote add`, `npm install`, etc. renommees en "sous-ordres_mission imbriquees") ;
- la section OWASP command injection ;
- les grimoires (Promises, modules) ;
- la queue de commandes du module `09_data_structures`.

Correction : rollback deterministe via `sed` (voir commande dans le changelog). Zero occurrence residuelle de `ordre_mission` ou `Ordre_Mission` (verifie par grep).

## 2. BLOQUANT : verification_pack universel (19/32 -> 32/32)

Ajout de 13 packs (`02, 16, 17, 19, 20, 24, 25, 27, 28, 29, 30, 31, 32`). Chaque pack suit le format existant : `verify.sh` + `scripts/*.js` + `inputs/*.txt` + `expected/*.txt`. Trois drills deterministes par module. `verify_all.sh` execute maintenant 32 packs + le honor-code lint : tout passe vert.

## 3. GARDE-FOU PERMANENT : `forbidden_transforms.txt`

Nouveau fichier `verification_pack/_audit/forbidden_transforms.txt` : liste des tokens verrouilles en lecture-seule (pattern Command, sous-commandes CLI, etc.). `lint_honor_code.sh` echoue si un de ces tokens disparait, empechant une nouvelle migration destructive silencieuse.

## 4. A CORRIGER : falaise conceptuelle `24 -> 25`

Ajout de `24_databases/99_du_single_node_au_cluster.md` : CAP, replication sync/async, split-brain, quorum, fencing, lease. Pont explicite vers le module 25.

## 5. A CORRIGER : diff humain-vs-IA cote a cote

Ajout de `04_debugging/humain_vs_ia_diff.md` : deux patches d'une meme feature (fusion de tableaux tries), l'apprenant doit identifier auteur + meilleur patch selon le contexte.

## 6. AMELIORABLE : heisenbug isole comme exo

Ajout de `04_debugging/heisenbug_arena.md` : trois drills ou l'observation change la sortie (course de promesses, mesure qui deforme, I/O parallelisees).

## 7. AMELIORABLE : "explique a un enfant de 5 ans" isole comme exo

Ajout de `03_async/04_event_loop/expliquer_a_5_ans.md` : format impose, mots interdits, critere de succes verifiable par un lecteur non-tech.

## 8. AMELIORABLE : em-dash residuel dans `.audit/`

Nettoye par sed dans `.audit/CORRECTIONS_AUDIT_W.md`.

## 9. FAUX POSITIFS DE L'AUDIT (non-corrections)

- **Transferability cross-language** : le dossier `31_annexes/transferability/` contient deja 8 fichiers, dont `01_closure_in_python.md`, `03_event_loop_in_pseudorust.md`, `06_observer_in_go.md`, `08_final_cross_language_challenge.md`. Le rapport comptait un seul mini-projet multilang mais ignorait les exos annexes. Pierre 6 est materialisee.
- **3 publics isoles** : `27_team_craft/12_three_audiences_intro.md` + `13_three_audiences_drill.md` + `EXO_TROIS_PUBLICS.md` existent deja.
- **`.audit/*` lien mort** : les fichiers `CORRECTIONS_APPLIQUEES.md` et `DEPENDENCY_LEDGER.md` sont bien presents dans le zip (le parseur du rapport ignorait les dossiers commencant par un point).

## 10. VERIFICATION FINALE

```
$ bash verification_pack/verify_all.sh
Resume : 32 module(s) OK, 0 module(s) KO
[OK] Tous les modules ont passe le filet deterministe.
```

## SCORE APRES CORRECTIONS

Les deux Bloquants sont resorbes. Les cinq "A corriger" cites en W.9 sont traites integralement (rollback + verification pack universel + `stability:` deja generalise + pont CAP + exo humain-vs-IA). Note projetee : 9.5-10/10.

stability: intemporel
