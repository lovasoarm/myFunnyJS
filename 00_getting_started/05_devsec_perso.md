---
stability: intemporel
---

# 05 : Devsec perso : protège ton chakra avant d'affronter les ninjas renégats du net
Temps de lecture ~5 min

Ton laptop dev, c'est un coffre. Dedans : tes clés SSH, tes tokens GitHub, tes `.env` avec des vraies clés API. Le premier vol de compte dev, c'est presque toujours l'auteur qui a merdé.

## Le socle

1. **SSH keys** : `ssh-keygen -t ed25519 -C "toi@mail"`. Passphrase **obligatoire**.
2. **2FA GitHub** : app authenticator, pas SMS. Backup codes stockés hors ligne.
3. **`.gitignore` global** :
  ```
  git config --global core.excludesfile ~/.gitignore_global
  ```
  Dedans : `.env`, `.env.*`, `*.pem`, `.DS_Store`, `node_modules/`.
4. **Jamais de secret dans un commit.** Si ça arrive : révoque immédiatement, `git filter-repo` ensuite. L'ordre compte.
5. **`npm audit`** régulièrement. `npm audit fix` avec parcimonie (peut casser).

## Le piège Copilot

Une IA peut te générer du code sous licence GPL sans te prévenir. Voir `31_annexes/07_ethics_and_licenses.md`.

## Détecteur maison

```
# pre-commit hook basique
grep -rE "(api[_-]?key|secret|password)\s*=\s*['\"]" --include="*.js" .
```

## Mission

Configure `.gitignore` global, active 2FA GitHub, régénère une clé SSH ed25519 avec passphrase.
