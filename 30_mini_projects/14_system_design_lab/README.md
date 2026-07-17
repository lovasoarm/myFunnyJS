---
stability: intemporel
---


Temps de lecture ~2 min

[PORTFOLIO]

# 14 : SYSTEM DESIGN LAB

-> ~15 h

## PITCH 3 LIGNES

Deux services qui se parlent via une queue, avec retry, idempotence et tracing. Tu chaos-testes le tout et tu écris le postmortem. Le mini-projet qui prouve que tu penses en systèmes, pas en fonctions.

## MISSION

Tu construis un mini-écosystème :

```
  [ API-Front ] ──HTTP──► [ Broker (Redis/RabbitMQ) ] ──► [ Worker ]
    ▲                            │
    └─────────────── tracing (OpenTelemetry) ◄──────────────┘
```

Contraintes non négociables :

- Docker Compose : 3 services minimum (front, broker, worker).
- Retry avec backoff exponentiel côté worker.
- Idempotence : rejouer un message ne double PAS l'effet.
- Tracing distribué : un `trace_id` traverse les 3 services.

## LIVRABLES

1. `ARCHITECTURE.md` : diagramme ASCII + décisions (queue, DB, retry policy).
2. `ADR-001_decision.md` : pourquoi Redis vs RabbitMQ (ou autre).
3. Code fonctionnel + `docker-compose up` qui marche du premier coup.
4. **Chaos test** : tue le worker en plein traitement, tue le broker 30 s, coupe le réseau front↔broker. Vérifie que rien n'est perdu ni dupliqué.
5. `POSTMORTEM.md` : ce qui a cassé, ce que t'as appris, ce que tu changerais.
6. Dépôt GitHub public, lien dans le `DEPENDENCY_LEDGER.md`.

## CE QUE LE PROJET CACHE

L'idempotence a l'air simple ("juste un id unique"). En vrai, tu dois choisir OÙ tu stockes les ids vus, TTL, comment tu gères les collisions, quoi faire si le stockage d'idempotence tombe. Trois lignes de spec, deux jours de galère.

## THÈME NEUTRE (si Naruto/DBZ ne te parle pas)

Pense "mission assignée → notification au utilisateur". Même problème, même solution.

## AUTO-ÉVAL

- [ ] Chaos test survécu 3 scénarios sur 3
- [ ] Trace_id visible bout en bout
- [ ] Pas de duplication après retry
- [ ] POSTMORTEM publié
- [ ] Peer-review reçue avant merge final

## VARIANTE CHAOS (obligatoire)

Après 30 minutes de conception, tu reçois deux contraintes contradictoires imposées d'en haut, sans préavis (comme un vrai changement de scope) :

- "Le système doit maintenant supporter le mode offline côté front."
- "Le budget infra est divisé par deux : un service de moins."

Tu dois adapter ton architecture pour absorber les deux, ou arbitrer explicitement laquelle tu sacrifies partiellement et pourquoi. Documente la bascule dans un ADR supplémentaire `ADR-003_chaos_contraintes.md` : ce que tu changes, ce que tu abandonnes, le trade-off assumé. C'est le mur de Konoha pendant l'invasion de Pain : la brèche arrive quand tu ne l'attends pas, et l'ingénieur se juge à sa réaction, pas à son plan initial.

---

## REPRODUCTIBILITÉ

Installation canonique : `npm ci` (pas `npm install`). `npm ci` respecte strictement le `package-lock.json` : deux personnes qui clonent obtiennent exactement les mêmes versions. Committe toujours ton `package-lock.json`. Sans lui, un `npm install` 3 mois plus tard installera d'autres versions et tu debug un fantôme.
