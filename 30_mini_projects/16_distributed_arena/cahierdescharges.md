---
stability: intemporel
---

# CAHIER DES CHARGES : DISTRIBUTED ARENA

Temps de lecture ~2 min

## C'EST QUOI CE PROJET, CONCRÈTEMENT

N processus Node qui se parlent en local et survivent au chaos. C'est l'arène du Ballon d'Or : onze joueurs coordonnés, un blessé (kill -9), et le score final doit rester juste malgré tout.

## OBJECTIF

Construire un compteur distribué (coordinateur + workers) et prouver, métriques à l'appui, qu'il survit à race condition, timeout, panne partielle et retry non idempotent.

## CONTRAINTES NON NÉGOCIABLES

- Pas de Kubernetes ni de cloud : tout en local, N processus Node.
- Le total final doit être correct OU honnêtement dégradé (mesuré).
- Retry rendu idempotent explicitement.

## LIVRABLE

`coordinator.js`, `worker.js`, `chaos.js` (4 scénarios dont `network-partition`/split-brain), `verify.js`, rapport de chaos, `POSTMORTEM.md`.

## SÉCURITÉ (gate obligatoire)

Avant de considérer le projet fini, tu dois traiter ces exigences OWASP contextuelles. Un projet qui marche mais qui est vulnérable n'est pas fini.

- Intégrité des incréments (OWASP A08) : chaque incrément porte un id unique vérifié côté coordinateur pour empêcher un rejeu malveillant de gonfler le total.
- Autorisation inter-process (OWASP A01 - Broken Access Control) : un worker ne doit pouvoir écrire que ses propres incréments, pas réécrire le total global directement.

Pour chaque exigence : écris dans `SECURITY.md` la menace, ta contre-mesure, et le test qui la prouve. Le `verification_pack` de ce projet contient un test de sécurité qui doit passer.

## AUTO-ÉVALUATION

- [ ] Livrable complet et fonctionnel
- [ ] Contraintes respectées et vérifiées
- [ ] Section Sécurité traitée et testée
- [ ] ADR rédigé et relu
- [ ] POSTMORTEM honnête écrit

---

## Securite (gate obligatoire, Partie I)

- **Exigence 1** : aucune donnee sensible (secret, token, cle) dans le code source ni dans les logs. Utiliser variables d'environnement + `.env.example` versionne (jamais `.env`).
- **Exigence 2** : toute entree externe (STDIN, fichier, HTTP, CLI) est validee AVANT usage (type, longueur, format). En cas d'invalidite : erreur explicite, jamais un crash silencieux.

Un test dans `node solution.js` (auto-verif ecrite par toi) doit prouver ces deux points (ex : lancer le programme avec une entree malformee et verifier qu'il refuse proprement).

## SURPRISE MI-PARCOURS (spec drift, obligatoire)

Spec drift obligatoire, voir `30_mini_projects/synthese/spec_drift.md`
(protocole unique, tirage aléatoire, déclenchement à 40 % d'avancement).

Note pour ce projet : la nature distribuée fait que le drift #4 (ordre par
source), #5 (race > 200 req/s) et #8 (contrat `{data, meta}` renvoyé par
le coordinateur) sont particulièrement révélateurs. Si tu tires un autre
drift, ne le remplace PAS, c'est le hasard qui enseigne, pas ton confort.

---

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**

---

stability: intemporel

## ARBORESCENCE ATTENDUE

```
16_distributed_arena/
├── src/
│   ├── node.js            # 1 nœud du cluster : reçoit des messages, tient un log local
│   ├── cluster.js         # orchestrateur : lance N nœuds, simule latence/partition
│   ├── consensus.js       # implémentation naïve de Raft-like (leader election)
│   ├── replication.js     # réplication log entre leader et followers
│   └── failure.js         # injecteur de pannes (drop, delay, split-brain)
├── tests/
│   ├── single_node.test.js       # nœud isolé fonctionne
│   ├── leader_election.test.js   # 3 nœuds, un leader émerge, reste stable
│   ├── log_replication.test.js   # ordre total garanti même sous latence
│   ├── partition.test.js         # split-brain détecté, minorité stoppe writes
│   └── recovery.test.js          # nœud qui rejoint rattrape le log
├── fixtures/
│   └── scenarios/         # 5 scénarios de partition/panne pré-écrits
├── ADR/
│   ├── 001-choix-consensus.md    # pourquoi Raft-like et pas Paxos ni gossip pur
│   ├── 002-storage.md            # log append-only en JSON vs binaire
│   └── 003-timeouts.md           # valeurs de heartbeat et election timeout
├── SECURITY.md
├── POSTMORTEM.md
├── TDD_JOURNAL.md
└── RULES.md
```

## ORDRE DE CONSTRUCTION (obligatoire, sinon tu te perds)

1. **`node.js` seul** : un nœud reçoit un message, le stocke, renvoie ACK. Test unitaire vert avant de continuer.
2. **`cluster.js` sans consensus** : lance 3 nœuds, envoie un message à chacun, vérifie qu'ils l'ont tous. Pas de leader encore.
3. **`consensus.js` : leader election SEULE** : les 3 nœuds élisent un leader, un seul, stable. Ignore la réplication.
4. **`replication.js`** : le leader propage un `append`, les followers l'acceptent, ordre total.
5. **`failure.js`** : injecte drop 20% des messages, vérifie que le cluster converge quand même.
6. **Partition test** : coupe le réseau en 2×1 nœud + 2 nœuds. La minorité doit refuser les writes.

Ne saute AUCUNE étape. Un bug de consensus détecté à l'étape 5 alors que tu n'as pas fait l'étape 3 correctement est indebuggable.

## CAS LIMITES À COUVRIR (obligatoire)

- **Split-brain** : 2 leaders élus simultanément → un doit se rétracter dès qu'il voit le heartbeat de l'autre.
- **Nœud lent** (pas mort) : timeout de heartbeat plus grand que RTT normal, sinon fausses élections.
- **Message dupliqué** : idempotence des `append`, indexer par `(term, index)`.
- **Nœud qui revient après 10 min offline** : rattrapage du log via snapshot + tail.
- **Clock skew** entre nœuds : ne JAMAIS te reposer sur `Date.now()` pour ordonner : utilise un logical clock (index de log).
- **Charge asymétrique** : leader saturé → back-pressure ou re-élection.

## EXEMPLE DE TEST REMPLI (leader_election.test.js)

```js
import { Cluster } from "../src/cluster.js";

describe("Leader election", () => {
  it("élit exactement un leader parmi 3 nœuds sains", async () => {
    const cluster = new Cluster({
      nodes: 3,
      heartbeat: 50,
      electionTimeout: [150, 300],
    });
    await cluster.start();
    await cluster.waitStable(1000);

    const leaders = cluster.nodes.filter((n) => n.state === "leader");
    expect(leaders).toHaveLength(1);
    await cluster.stop();
  });

  it("réélit un nouveau leader si l'ancien crash", async () => {
    const cluster = new Cluster({
      nodes: 3,
      heartbeat: 50,
      electionTimeout: [150, 300],
    });
    await cluster.start();
    await cluster.waitStable(1000);
    const oldLeader = cluster.leader();
    await oldLeader.crash();
    await cluster.waitStable(1000);

    const newLeader = cluster.leader();
    expect(newLeader).toBeDefined();
    expect(newLeader.id).not.toBe(oldLeader.id);
    await cluster.stop();
  });
});
```

## ADR PRÉ-REMPLI (exemple, à adapter)

**ADR/001-choix-consensus.md**

- **Contexte** : besoin d'un consensus sur l'ordre des writes entre 3-7 nœuds, tolérant f=1 panne.
- **Options considérées** :
  1. **Raft** (choisi) : leader unique, log réplication explicite, littérature abondante.
  2. **Paxos classique** : plus général, mais démonstration formelle complexe, courbe d'apprentissage brutale.
  3. **Gossip pur (SWIM-like)** : pas d'ordre total, incompatible avec le besoin.
- **Décision** : Raft-like simplifié (pas de log compaction, pas de membership change dynamique).
- **Conséquences** :
  - - implémentation testable en 500-800 lignes.
  - - comportement prévisible sous partition.
  - - pas de membership dynamique : ajouter un nœud impose un restart cluster.

## POURQUOI CE PROJET EST LE POINT DE CONVERGENCE

Ce mini-projet est **la** pratique construite qui connecte les théories distribuées éparpillées dans le cursus (`24_databases/99_du_single_node_au_cluster.md`, patterns d'archi de 16, back-pressure de 25). Sans ce projet, la théorie reste théorie. Prends-le au sérieux : c'est le mini-projet le plus signal-fort de ton portfolio pour un poste senior/staff.
