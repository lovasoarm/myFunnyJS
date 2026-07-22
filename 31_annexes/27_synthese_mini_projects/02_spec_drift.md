---
stability: intemporel
---

# SPEC DRIFT : la spec qui bouge en cours de route

Temps de lecture ~4 min


-> ~2-4 h par exécution, à jouer sur un mini-projet AU CHOIX

Compétence visée : encaisser un changement de contrainte à 40% d'avancement sans jeter tout ton travail, sans perdre la trace des décisions. C'est le vrai visage de la prod, pas les cahiers des charges statiques d'un cours.

## POURQUOI CE FICHIER EXISTE

Les 18 cahiers des charges de `30_mini_projects/*` sont clairs à l'ouverture. C'est un mensonge pédagogique utile : tu apprends d'abord à décomposer, ensuite à absorber le flou. Ce fichier introduit **le flou mouvant** : après 40% d'avancement, une contrainte change. Tu dois t'adapter sans réécrire depuis zéro.

## PROJETS ÉLIGIBLES

Choisis UN projet parmi :

- `30_mini_projects/05_prison_break_api/` (recommandé pour un premier drift : contrainte de sécurité qui apparaît en cours de route).
- `30_mini_projects/06_ultras_dashboard/` (drift sur la volumétrie / temps réel).
- `30_mini_projects/16_distributed_arena/` (drift sur la cohérence).

Refait le drift 3 fois total, projets différents, pour couvrir 3 natures de changement.

> Note : `03_walking_dead_protocol/SPEC_DRIFT.md` et `14_system_design_lab/SPEC_DRIFT.md`
> ont déjà **leur drift pré-écrit** (pas de tirage), ce sont des exécutions dédiées,
> pas des projets éligibles au tirage aléatoire ci-dessous.

## DÉCLENCHEMENT

Tu déclares "40%" toi-même : à peu près quand la structure squelette est en place, que 2-3 endpoints fonctionnent, que les tests d'entrée passent. À ce moment, ouvre le tableau ci-dessous et tire **une** contrainte au hasard (dé, aléa Node, doigt au hasard).

## LES CONTRAINTES DE DRIFT

| # | Drift | Nature | Complication réelle |
|---|---|---|---|
| 1 | Le stockage doit désormais survivre à un crash processus (pas juste au restart normal). | Persistance | Il faut fsync, un WAL, ou basculer sur SQLite en mode strict. |
| 2 | La latence P99 doit passer sous 200 ms sur les 3 endpoints critiques. | Performance | Il faut profiler, cacher, revoir le pattern d'accès. |
| 3 | Un nouveau rôle "auditeur" doit pouvoir tout lire sans rien écrire, sans révélation d'ID interne. | Sécurité / autorisation | Il faut découper l'ACL, potentiellement anonymiser. |
| 4 | Le flux de messages doit garantir l'ordre par source (pas globalement). | Cohérence | File par shard, ou clé de partition explicite. |
| 5 | Un test de charge existant révèle une race à > 200 requêtes/s. | Concurrence | Renforcer la synchronisation, potentiellement une queue. |
| 6 | La contrainte "pas de dépendance externe" est levée : tu PEUX ajouter Redis OU un broker, mais tu dois justifier. | Trade-off | ADR obligatoire, alternative sans dépendance étudiée. |
| 7 | Une dépendance existante n'est plus autorisée en prod (lib X bannie). | Contrainte négative | Remplacer ou réécrire, sans casser les tests existants. |
| 8 | Le contrat de sortie d'un endpoint devient `{data, meta}` au lieu de `[]`. | Contrat d'API | Adapter clients internes + tests, garder la rétro-compat si possible. |

## PROTOCOLE OBLIGATOIRE

1. **STOP CODE** dès que tu tires le drift. Interdiction de toucher au code avant l'étape 2.
2. **ADR** : ajoute un ADR dans `ADR/` du projet. Format habituel : contexte, options, choix, conséquence. Cite le drift tiré.
3. **POSTMORTEM mis à jour** : ouvre `POSTMORTEM.md`, ajoute une section "Spec drift #<numéro>" avec :
   - Ce qui existait avant.
   - Ce qui doit changer.
   - Ce que tu jettes (et pourquoi).
   - Ce que tu récupères.
4. **TDD_JOURNAL** : ajoute les nouveaux tests d'acceptation avant tout code.
5. **Puis** tu codes le drift. Objectif : dette technique visible, pas cachée.
6. **INTERVIEW_DEFENSE_JOURNAL** (facultatif mais fortement recommandé) : oralise en 90 secondes "pourquoi j'ai choisi cette voie et pas l'autre" comme au scénario 4 de `31_annexes/career/interview_defense.md`.

## GRILLE DE VALIDATION

| # | Critère | OK |
|---|---|---|
| 1 | ADR daté, options listées, décision datée |  |
| 2 | POSTMORTEM mis à jour AVANT tout code post-drift |  |
| 3 | Tests d'acceptation du drift ajoutés AVANT implémentation |  |
| 4 | Ancienne fonctionnalité toujours verte (pas de régression silencieuse) |  |
| 5 | Nouvelle fonctionnalité verte |  |
| 6 | Le code jeté est ARCHIVÉ dans une branche ou un commentaire, pas supprimé sans trace |  |

6/6 obligatoire.

## POURQUOI ÇA COMPTE

Un ingénieur qui n'a jamais absorbé un spec drift croit que la conception initiale suffit. Un ingénieur qui l'a vécu 3 fois sait que **la conception initiale est un pari**, que l'ADR est ton assurance, et que le POSTMORTEM est la mémoire des paris perdus.

C'est le passage de "je sais construire" à "je sais construire ET ré-orienter". C'est la différence entre kick-ass et Thor sur la Pierre 4 (architecture).

## APRÈS

- Rejoue avec un autre projet et une autre contrainte.
- Puis rejoue avec un projet finalisé du portfolio, spec drift dans 6 mois. La vraie prod, c'est ça.
