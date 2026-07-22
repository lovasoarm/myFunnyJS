---
stability: intemporel
---

# Security (template a remplir)

Le systeme est local, mais la supervision d'IA introduit ses propres
surfaces d'attaque a documenter ici avant publication :

- **Injection de prompt** : ajoute ici comment tu isoles les inputs
  utilisateurs des prompts systeme.
- **Exfiltration via logs** : ajoute ici les regles de scrubbing sur
  `events.log` et sur les artefacts partages avec l'IA.
- **Chaine d'approvisionnement des deps proposees par l'IA** : ajoute
  ici la procedure (npm audit + revue humaine) avant tout `npm install`.
- **Persistance des prompts** : ajoute ici la retention (jamais de
  secrets dans `prompts/`, jamais de token API en clair).

Remplace chaque "ajoute ici" avant de considerer ce fichier livre.
