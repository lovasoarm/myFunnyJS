---
stability: intemporel
---

# Primitives distribuées : les bases qu'on te demandera en entretien
Temps de lecture ~5 min

Un système distribué, c'est deux machines qui essaient de se mettre d'accord alors que le réseau leur ment. Six concepts te sauvent 90 % du temps.

## 1. Idempotence

Une opération est idempotente si l'appeler 10 fois = l'appeler 1 fois.

- `DELETE /user/42` → idempotent (une fois supprimé, c'est supprimé).
- `POST /payment` → **pas** idempotent → utilise une `Idempotency-Key`.

Analogie : appuyer 10 fois sur le bouton d'ascenseur, la porte ne s'ouvre qu'une fois.

## 2. Retry avec exponential backoff + jitter

Serveur down ? Ne martèle pas.

```
attempt 1 : wait 100ms
attempt 2 : wait 200ms + random(0..100)
attempt 3 : wait 400ms + random(0..200)
...
```

Le **jitter** évite le "thundering herd" (10 000 clients qui retry en même temps).

## 3. Timeout (toujours)

Aucune requête réseau sans timeout. Aucune. `fetch(url, { signal: AbortSignal.timeout(5000) })`.

## 4. Circuit breaker

Après N échecs consécutifs, arrête d'appeler pendant T secondes. Puis teste avec un ping. Trois états : `CLOSED` (normal), `OPEN` (bloqué), `HALF_OPEN` (test).

## 5. CAP theorem, vulgarisé

Réseau qui part en vrille (P inévitable). Tu dois choisir :
- **CP** : cohérence garantie, mais indisponible en cas de split (ex: RDBMS avec réplication synchrone).
- **AP** : toujours disponible, mais peut retourner du vieux (ex: DynamoDB, Cassandra).

Il n'y a pas de "CA". Le réseau lâche, point.

## 6. At-least-once vs exactly-once

- Kafka par défaut : at-least-once. Duplicats possibles → **idempotence côté consommateur**.
- Exactly-once existe mais coûte cher (transactions distribuées). Pense-y avant de le demander.

## Ce que l'analogie cache

L'ascenseur idempotent, c'est simple. Un `POST /transfer` idempotent nécessite un **store de clés** (Redis) avec TTL et gestion des collisions. Le concept est facile, l'implémentation propre non.

## Mission

Modélise un échange de tribut entre `service_orders` et `service_payments`. Réseau non fiable. Livre :
- Séquence ASCII de la conversation.
- Où tu mets l'idempotence.
- Ta politique de retry.
- Un ADR qui justifie CP ou AP.
