---
stability: perissable_2027
---

# 08 : On-call drill : il est 3h du matin
Temps de lecture ~5 min

> **INTEMPOREL** : l'astreinte existera tant que des systèmes tourneront
> en prod. Le protocole est plus important que la stack.

## Scénario

Ton téléphone sonne. PagerDuty : `rasengan-service p99 latency > 3s, error
rate 7%`. Tu ouvres ton laptop. Tu as **20 minutes** pour :

1. Diagnostiquer,
2. Contenir (mitigation temporaire),
3. Communiquer.

Correction du bug racine : **plus tard**, jamais à 3h du matin.

## Matériel fourni (à générer en atelier)

- 1 stack trace brute :

```
TypeError: Cannot read properties of undefined (reading 'currency')
  at applyChakraCost (/app/rasengan/chakra.js:42:19)
  at executeJutsu (/app/rasengan/jutsu.js:88:5)
  at async POST /rasengan (/app/routes/rasengan.js:12:3)
```

- 3 lignes de log corrélées (`traceId=abc123`) montrant un appel au service
 `currency-svc` qui répond `null` depuis 12 min.
- Un dashboard : `currency-svc` deploy il y a 15 min (release `v1.4.2`).

## Protocole (à suivre dans l'ordre)

### T+0 → T+5 : contexte

- Quel service ? Quel scope (100% des shinobis ? un pays ?) ?
- Quand ça a commencé ? Corrèle avec les déploys.
- **Hypothèse #1** : `v1.4.2` de `currency-svc` a introduit une régression.

### T+5 → T+10 : contenir (pas résoudre)

Options par ordre de préférence :

1. **Rollback** de `currency-svc` à `v1.4.1` (1 clic sur ton runbook).
2. **Feature flag off** si le code fautif est derrière un flag.
3. **Failover** vers une cache de devises figée (dégradation gracieuse).
4. **Circuit breaker manuel** : retourner une devise par défaut + log warn.

Choisis **la moins risquée** qui rétablit le SLA en < 5 min.

### T+10 → T+15 : communiquer

Statuspage / Slack `#incidents` :

```
[INVESTIGATING] rasengan errors 7% since 03:12 UTC.
Suspected cause: currency-svc v1.4.2 release.
Mitigation in progress: rollback to v1.4.1. ETA 5 min.
Next update: 03:35 UTC.
```

Règle : **mise à jour toutes les 15 min**, même si "rien de nouveau".

### T+15 → T+20 : vérifier

- Metrics : error rate revenu sous 1% ?
- P99 latency < 500ms ?
- Un shinobi test peut lancer un rasengan ?

Si OUI → tu clôtures l'urgence, tu vas te recoucher, tu écris la POSTMORTEM
demain matin (voir `06_debug_in_prod.md`).
Si NON → tu escalades. Tu ne joues pas au héros seul à 3h.

## Livrable

- `RUNBOOK_RASENGAN.md` : rollback, feature flags, failovers documentés
 **à l'avance**. Un runbook écrit à 3h du matin est un runbook trop tard.
- `POSTMORTEM.md` (le lendemain) : ligne du temps, cause racine, action items.

## (attention) Ce que l'analogie "cowboy dev sauveur" cache

Le meilleur on-call est celui qui **ne code pas** pendant l'incident. Il
active des mécanismes préparés. Coder en urgence = ajouter un bug au bug.
