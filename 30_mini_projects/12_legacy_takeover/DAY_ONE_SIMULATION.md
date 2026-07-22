---
stability: intemporel
scope: preuve d'employabilite immediate
---

# DAY_ONE_SIMULATION.md : 4h chrono, ton premier jour dans une equipe

Cette simulation te met **exactement** dans la posture d'un.e nouvel.le
embauche.e a qui on livre un legacy inconnu et une demande floue. Tu la joues
avant d'aller en entretien serieux. Sortie : quatre artefacts.

## Contexte fictif (a lire une seule fois)

Tu viens d'etre embauche.e. Ton lead te tend le codebase de `12_legacy_takeover`
et te dit :

> _"Salut. Cette API sert 12k requetes/jour, personne ne la comprend plus
> vraiment depuis le depart de l'auteur. Le CTO veut y ajouter un endpoint
> `/health` **et** avoir confiance qu'on ne casse rien. Tu as 4h. Fais-moi
> une proposition, pas une refonte."_

Tu ne demandes pas plus de contexte. Un vrai Day One, c'est ce niveau
d'ambiguite. Tu chronometre.

## Chrono (4h non negociables)

| Phase                   | Duree  | Livrable exige                                                                                  |
| ----------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| 1. Lecture cadree       | 30 min | `MAP_15MIN.md` (rempli en 15 min + 15 min de relecture)                                         |
| 2. Hypotheses testables | 30 min | `HYPOTHESES.md` (3 hypotheses, chacune verifiable en < 5 min)                                   |
| 3. Diff qui compile     | 2 h    | Une modification minimale (endpoint `/health`) qui **compile** et **passe les tests existants** |
| 4. Decision ecrite      | 1 h    | 1 `ADR-DAY_ONE.md` de 20 lignes max, format standard (Contexte / Decision / Consequence)        |

Total : 4h chrono. Tu depasses => tu livres ce que tu as et tu documentes le
depassement dans l'ADR.

## Contraintes non negociables

1. **1 MAP_15MIN.md** : produit avec le template
   `30_mini_projects/_templates/06_MAP_15MIN_TEMPLATE.md`. Rempli, pas ebauche.
2. **1 HYPOTHESES.md** : template
   `30_mini_projects/_templates/04_HYPOTHESES_TEMPLATE.md`. Trois hypotheses
   sur le comportement du legacy, chacune avec une commande de verification.
3. **1 diff qui compile** : `git diff` propre, `node --test` reste vert. Si
   tu casses un test, tu revertes et tu documentes pourquoi la modif etait
   plus grosse que ce que 4h autorisent.
4. **1 ADR de 20 lignes** : `ADR-DAY_ONE.md`. Format :
   - Contexte (5 lignes)
   - Decision (5 lignes)
   - Alternatives ecartees (5 lignes)
   - Consequences (5 lignes)

## Critere binaire d'employabilite immediate

- [ ] Les 4 artefacts existent a l'issue des 4h.
- [ ] Le diff compile et tous les tests existants passent (`node --test`).
- [ ] L'ADR est lisible par quelqu'un qui n'a pas lu le code.
- [ ] Le MAP_15MIN a bien limite la lecture (pas de "j'ai tout lu").
- [ ] Une des hypotheses au moins a ete refutee ou confirmee (avec preuve).

Si les 5 cases sont cochees, tu peux dire en entretien : _"J'ai deja simule
un Day One sur un legacy inconnu, voici les 4 artefacts."_ C'est la preuve.

## Rejouer

Cette simulation se rejoue tous les 6 mois. Compare l'ancien ADR au nouveau :
si tu ne rougis pas de l'ancien, c'est que tu n'as pas progresse.
