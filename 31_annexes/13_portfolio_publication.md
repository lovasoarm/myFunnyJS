---
stability: intemporel
---

# Publier ton portfolio proprement
Temps de lecture ~5 min

## Checklist par projet GitHub

- [ ] `README.md` : problème résolu, démo (GIF/screenshot), stack, `npm start` en 3 lignes.
- [ ] `ADR/` : au moins 1 décision documentée.
- [ ] `POSTMORTEM.md` si un incident réel a eu lieu.
- [ ] Lien vers `DEPENDENCY_LEDGER.md` racine.
- [ ] Démo déployée (Vercel/Netlify/fly.io) : URL en tête du README.
- [ ] Licence.
- [ ] Un test qui passe en CI (badge visible).

## Anti-pattern

- README auto-généré et jamais relu.
- 47 dépendances pour un TODO app.
- Screenshots datés d'il y a 6 mois.

## Livrable

Un dépôt qui passe la checklist. Fais-le relire par un pair **avant** de le mettre sur ton CV.


---

## RÈGLES DURCIES v2026.1

- **Publication GitHub OBLIGATOIRE** pour chaque mini-projet avant de passer au module suivant.
- **Peer-review OBLIGATOIRE** : voir `COMMUNAUTE.md`.
- **Lien du dépôt** à inscrire dans le `DEPENDENCY_LEDGER.md`.

## GRILLE D'AUTO-ÉVALUATION (10 points)

| Critère | 0 | 1 | 2 |
| --- | --- | --- | --- |
| README clair (pitch, install, run) | absent | présent flou | net + captures |
| Tests | 0 | quelques-uns | couverture des cas critiques |
| POSTMORTEM | absent | brouillon | publié |
| ADR (si projet ≥ moyen) | 0 | 1 | 1 par décision majeure |
| Peer-review reçue | 0 | 1 remarque | ≥ 3 remarques traitées |

Note < 6/10 → tu ne passes pas au module suivant. Point.
