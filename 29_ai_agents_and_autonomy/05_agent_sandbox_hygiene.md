---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# 05 : SANDBOX HYGIENE : CE QU'ON NE LAISSE JAMAIS FAIRE À UN AGENT

Temps de lecture ~15 min

Un agent qui a accès à `git push --force`, à ta clé AWS et à `rm -rf /` peut faire
en 30 secondes le travail d'une équipe pendant un mois de mauvaises décisions. Sans
haine, sans intention : juste par cohérence avec une consigne mal bornée.

C'est le paradoxe des agents : ils ne sont pas dangereux parce qu'ils sont
malveillants, ils sont dangereux parce qu'ils sont LITTÉRAUX et RAPIDES.
Un humain qui reçoit "nettoie la codebase" hésite, demande, prend un café.
Un agent enchaîne 40 actions dans le sens le plus plausible du prompt. Si
le plus plausible est destructeur, il détruit.

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

Chaque interdit correspond à un incident réel documenté quelque part sur
Internet. Ce ne sont pas des précautions théoriques : ce sont des
cicatrices d'équipes qui ont perdu des semaines à réparer.

## Le principe : capabilities, pas confiance

```
Confiance                                    Capability
---------                                    ----------
"je fais confiance à l'agent"                "l'agent ne PEUT PAS faire X, même s'il veut"
```

La confiance est une émotion, la capability est un contrat technique. Le
premier ingénieur qui a dit "je fais confiance à ce script cron" a perdu
sa production 2 semaines plus tard. Le second qui a mis le cron dans un
container en lecture seule avec un token de 4 heures dort mieux.

En pratique, une bonne sandbox pour un agent :

- container avec FS en lecture seule sauf répertoire de travail,
- réseau sortant whitelisté (registry npm + ton dépôt git, rien d'autre),
- token git à droits ÉCRITURE sur une branche `agent/*` uniquement,
- secrets injectés via variables d'env fictives en dev,
- shell avec `set -e` ET wrapper qui refuse `rm -rf` / `sudo` / `curl | sh`,
- durée de vie du container plafonnée (kill après 30 min),
- log complet de chaque commande exécutée (audit ex-post).

Aucun de ces 7 points n'est optionnel. Chaque point manquant est une porte
que l'agent poussera, statistiquement, dans les 100 prochaines runs.

## Le test de la promenade

Avant de brancher un agent sur ta codebase, imagine qu'un stagiaire malveillant a
son accès pendant 8h. Qu'est-ce qu'il peut casser ? Chaque case cochée = un
interdit à ajouter côté capability. Un agent, c'est un stagiaire malveillant qui
travaille 60× plus vite.

Checklist du test de la promenade :

- [ ] Peut-il pousser sur `main` ? (doit être : NON, techniquement bloqué)
- [ ] Peut-il lire `~/.aws/credentials` ou `.env` prod ? (NON)
- [ ] Peut-il installer un package inconnu ? (NON sans revue humaine)
- [ ] Peut-il modifier `.github/workflows/` ? (NON)
- [ ] Peut-il ouvrir un socket sortant vers `*.pastebin.com` ? (NON)
- [ ] Peut-il exécuter `docker`, `kubectl`, `helm` ? (NON en dev standard)
- [ ] Peut-il changer les permissions de fichiers (`chmod 777`) ? (NON)

Si tu réponds "OUI" ou "je sais pas" à un seul de ces points, ton
sandbox n'est pas prête. Répare AVANT de lancer le premier agent, pas
après le premier incident.

## Les 3 pièges classiques du "sandbox à moitié"

1. **Le token git trop large** : un token avec `repo` scope entier au
   lieu de `contents:write` sur une seule branche. L'agent finit par
   toucher les issues, les settings, ou les workflows.
2. **Le proxy réseau permissif** : le "j'ai whitelisté registry.npmjs.org"
   suffit... jusqu'à ce que l'agent découvre qu'il peut fetch un tarball
   arbitraire depuis un package NPM légitime qui l'a mis en `postinstall`.
3. **Le shell "presque bridé"** : tu as bloqué `sudo`, mais pas les
   commandes qui écrivent hors du workdir (`> /tmp/foo`, `> /var/log/…`).
   L'agent apprend à contourner sans le savoir.

Le vrai sandbox n'est pas une liste noire, c'est une **liste blanche
minimale** : par défaut tout est interdit, tu ouvres uniquement ce
dont l'agent a besoin pour la tâche, et tu refermes après.

## Le principe du "moindre privilège éphémère"

Les capabilities doivent être scopées à la tâche ET dans le temps :

- Scope : un agent qui refactore `src/auth/` n'a besoin d'écrire QUE
  dans `src/auth/` + `tests/auth/`. Rien d'autre.
- Temps : les tokens expirent en 30-60 min. Un agent qui n'a pas fini
  redemande un token, ce qui te force à re-valider.

Ce double scope est la différence entre "sandbox de démo" et "sandbox
de prod".

## Exercice

Écris `agent_capabilities.yml` pour ton propre projet : liste ce que l'agent peut
et ne peut PAS. Chaque interdit doit être appliqué techniquement, pas déclaratif.

Format proposé :

```yaml
# agent_capabilities.yml
identity:
  name: agent-refactor-auth
  ttl: 30m
filesystem:
  read:
    - src/**
    - tests/**
  write:
    - src/auth/**
    - tests/auth/**
  denied:
    - .github/**
    - .env*
    - infra/**
network:
  allow:
    - registry.npmjs.org
    - github.com/monorg/monrepo.git
  deny: "*"
shell:
  allow:
    - node
    - npm test
    - git (branch=agent/*)
  deny:
    - sudo
    - rm -rf
    - curl (except allowed hosts)
git:
  token_scope: contents:write
  branch_pattern: "agent/*"
  protected: [main, release/*]
```

Ensuite, matérialise techniquement chaque ligne : container Docker,
capabilities Linux, un proxy réseau, une CI qui refuse les merges depuis
un token agent. Ce fichier n'est pas un manifeste politique, c'est une
carte des points de contrôle.

## Le postmortem qu'on ne veut pas écrire

Un ingénieur qui saute cette étape écrit tôt ou tard le postmortem :
"L'agent a supprimé la table `users` en dev, mais la connexion pointait
en fait vers staging. 4 000 comptes perdus. Restauration : 6 h."

Ce postmortem est évitable. Il coûte 2 jours de setup sandbox. Tu paies
maintenant 2 jours, ou plus tard 6 jours + réputation. Choix simple.

## Le pont vers le chapitre 06

Une fois la sandbox propre, tu peux vraiment jouer avec les agents. Le
grimoire (chapitre 06) est ta bibliothèque de motifs, indexée par
nature d'échec : utile UNIQUEMENT si tu as la sandbox en place. Sinon
tu apprends à reconnaître les motifs pendant que ton système brûle.
