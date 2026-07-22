---
stability: stable
---

# GATE SBOM & SCAN DE DEPENDANCES (obligatoire mini-projets 06+)

OWASP couvre l'application. Cette gate couvre la **chaine
d'approvisionnement** : les paquets tiers que tu embarques sans les avoir
ecrits. Une CVE dans une transitive suffit a compromettre tout le projet.

## Ce qui est demande

Pour chaque mini-projet a partir du #06 (tout projet qui ajoute des
dependances npm) :

1. **Generer un SBOM** au format CycloneDX :
   ```bash
   npx @cyclonedx/cyclonedx-npm --output-file sbom.json
   ```
   Committer `sbom.json` a la racine du mini-projet.

2. **Scanner les dependances** :
   ```bash
   npm audit --audit-level=high
   ```
   Zero vulnerabilite `high` ou `critical` non-justifiee. Toute exception
   documentee dans `POSTMORTEM.md` (section "dette securite").

3. **Verifier les licences** (au moins reperer les `GPL`/`AGPL` si tu
   comptes distribuer) :
   ```bash
   npx license-checker --summary
   ```

## Grille (a cocher dans le POSTMORTEM)

- [ ] `sbom.json` commite et a jour du dernier commit de deps
- [ ] `npm audit` : 0 high / 0 critical, ou justification ecrite
- [ ] Licences des dependances directes listees dans le POSTMORTEM
- [ ] Politique de mise a jour documentee (Dependabot, Renovate, manuel)

Sans ces 4 cases, le mini-projet n'est pas livrable.

## Pourquoi cette gate

En 2026, les attaques supply-chain (typosquatting, compromission de
mainteneurs, dependency confusion) sont plus rentables pour un attaquant
que les XSS classiques. OWASP Top 10 ne suffit pas si tu ne sais pas ce
que tu embarques.
