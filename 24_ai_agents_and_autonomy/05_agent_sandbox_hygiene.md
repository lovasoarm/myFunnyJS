[INTEMPOREL]

# 05 : SANDBOX HYGIENE : CE QU'ON NE LAISSE JAMAIS FAIRE À UN AGENT
Temps de lecture ~15 min

Un agent qui a accès à `git push --force`, à ta clé AWS et à `rm -rf /` peut faire
en 30 secondes le travail d'une équipe pendant un mois de mauvaises décisions. Sans
haine, sans intention : juste par cohérence avec une consigne mal bornée.

## Les 7 interdits absolus

```
1. git push --force sur main / master / release/*
2. accès direct aux secrets prod (rotate secret côté agent, pas côté prod)
3. rm -rf, DROP TABLE, TRUNCATE
4. modification de la CI/CD (workflows, hooks)
5. installation de packages sans revue (npm install X && ...)
6. commit signé avec l'identité d'un humain
7. accès sortant vers domaines non listés (data exfil)
```

## Le principe : capabilities, pas confiance

```
Confiance                       Capability
---------                       ----------
"je fais confiance à l'agent"   "l'agent ne PEUT PAS faire X, même s'il veut"
```

En pratique :
- container avec FS en lecture seule sauf répertoire de travail,
- réseau sortant whitelisté (registry npm + ton dépôt git, rien d'autre),
- token git à droits ÉCRITURE sur une branche `agent/*` uniquement,
- secrets injectés via variables d'env fictives en dev.

## Le test de la promenade

Avant de brancher un agent sur ta codebase, imagine qu'un stagiaire malveillant a
son accès pendant 8h. Qu'est-ce qu'il peut casser ? Chaque case cochée = un
interdit à ajouter côté capability. Un agent, c'est un stagiaire malveillant qui
travaille 60× plus vite.

## Exercice

Écris `agent_capabilities.yml` pour ton propre projet : liste ce que l'agent peut
et ne peut PAS. Chaque interdit doit être appliqué techniquement, pas déclaratif.
