---
stability: intemporel
---


Temps de lecture ~3 min

[PORTFOLIO]
[ATELIER]

# 16 : DISTRIBUTED ARENA

-> ~8h (réparties sur 3 sessions)

Tu ne montes pas Kubernetes. Tu ne loues pas un cloud. Tu écris un système à N
processus Node qui parlent entre eux, en local, et tu prouves qu'il survit à :

- une race condition déterministe,
- un timeout réseau,
- une panne partielle (kill -9 sur un noeud),
- un retry non idempotent qui corrompt les données SI tu ne le sécurises pas.

C'est le mini-projet manquant qui distingue un dev mid d'un dev senior en 2026.

Prérequis : `03_async` complet, `25_scalability`, `26_observability`.

---

## PITCH 3 LIGNES

Un mini système de "compteur distribué" : 4 workers Node qui incrémentent un total
partagé via un coordinateur. Tu injectes du chaos (latence, drop, kill). Tu prouves,
métriques à l'appui, que ton total final est correct ou honnêtement dégradé.

---

## CE QUE ÇA FAIT

```
$ node coordinator.js &
$ for i in 1 2 3 4; do node worker.js $i & done
$ node chaos.js --scenario race     # 500 incréments simultanés
$ node verify.js
  expected = 500 observed = 500    [OK]
$ node chaos.js --scenario kill-mid   # kill un worker à mi-parcours
$ node verify.js
  expected = 500 observed = 500    [OK, retry idempotent]
$ node chaos.js --scenario network-drop # drop 30% des messages
$ node verify.js
  expected = 500 observed = 500    [OK, at-least-once + dédup]
$ node chaos.js --scenario network-partition --duration 5s # coupe 2 workers du coordinateur pendant 5s (split-brain)
$ node verify.js
  expected = 500 observed = 500    [OK, quorum refuse le split OU réconcilie après reconnect]
```

---

## LES 5 LIVRABLES OBLIGATOIRES

1. `coordinator.js` : reçoit les increments, applique idempotence (clé unique par op).
2. `worker.js` : envoie des increments avec retry backoff.
3. `chaos.js` : injecte 4 scénarios (`race`, `kill-mid`, `network-drop`, `network-partition`). Sur `network-partition`, tu DOIS documenter dans l'ADR comment ton système réagit : refus d'écrire côté minoritaire (quorum type Raft) ou acceptation + réconciliation au reconnect (last-write-wins, CRDT, vector clock). Pas de bonne réponse, juste une décision assumée et défendable.
4. `verify.js` : compare total observé vs attendu, sort code 0 ou 1.
5. `ADR-001_decision.md` : pourquoi tu as choisi une clé UUID par op et pas un
  compteur monotone par worker. Trade-offs.

Bonus (mais fortement recommandé) : 6. `POSTMORTEM.md` d'un bug que tu n'as PAS anticipé au design et qui est apparu au chaos.

---

## GRILLE DE RÉUSSITE

- [ ] `verify.js` renvoie 0 sur les 4 scénarios chaos, 10 runs consécutifs.
- [ ] `network-partition` : ton système soit refuse d'écrire côté minoritaire, soit accepte + réconcilie honnêtement. Choix documenté dans l'ADR avec trade-offs (CAP : tu choisis C ou A, tu ne bluffes pas les deux).
- [ ] `race` reproduit un data race avant fix (branche `broken`), corrigé après.
- [ ] `kill-mid` : au moins 1 worker relance sa dernière op sans double-comptage.
- [ ] `network-drop` : at-least-once avec dédup côté coordinateur (par clé UUID).
- [ ] ADR argumente idempotent-by-key vs sequence-number, cite 2 sources.
- [ ] Métriques exportées (au moins : `ops_sent`, `ops_acked`, `retries`, `dups_rejected`).

---

## PIÈGES CONNUS (ne pas les éviter, les traverser)

- **Le retry naïf casse tout.** Un `retry` sans clé d'idempotence double le compteur
 au premier drop réseau. Tu vas le voir. C'est la leçon.
- **`Date.now()` comme clé** : deux workers peuvent collisionner à la même ms. Utilise
 `crypto.randomUUID()`.
- **Coordinator unique = SPOF.** À la fin du projet, écris 3 lignes dans l'ADR sur
 comment tu ferais un vrai consensus (Raft, Paxos) : tu ne l'implémentes pas, tu
 démontres que tu sais que c'est là.

---

## POURQUOI CE PROJET EXISTE

En 2026, "je sais faire du distribué" est le mot magique qui fait passer un CV de
mid à senior. La plupart des devs qui le disent ont fait un tuto Kubernetes. Toi,
tu auras cassé et réparé un système chaos-tested, avec un ADR défendable. C'est
un ordre de magnitude plus crédible en entretien.

---

## REPRODUCTIBILITÉ

Installation canonique : `npm ci` (pas `npm install`). `npm ci` respecte strictement le `package-lock.json` : deux personnes qui clonent obtiennent exactement les mêmes versions. Committe toujours ton `package-lock.json`. Sans lui, un `npm install` 3 mois plus tard installera d'autres versions et tu debug un fantôme.
