---
stability: intemporel
---

# ADR-002 : périmètre du POSTMORTEM sur un repo hérité

## Statut
Accepté : 2026-05

## Contexte

Sur un repo repris, le POSTMORTEM peut vite virer au réquisitoire contre
l'auteur précédent. Ce n'est ni utile ni professionnel.

## Décision

Le POSTMORTEM du takeover répond à **quatre questions**, et à ces quatre
questions seulement :

1. Quel était le bug demandé, quelle était sa cause racine ?
2. Combien de temps entre `git clone` et le premier test rouge reproductible ?
3. Combien de temps entre le premier test rouge et le fix vert ?
4. Quelle dette a été identifiée sans être corrigée (liste bornée, 5 items max) ?

Interdit : jugements sur le code hérité, adjectifs sur l'auteur, spéculation
sur les motivations.

## Alternatives écartées

- **POSTMORTEM libre** : dérive systématiquement en catharsis. Écarté.
- **Aucun POSTMORTEM** : le takeover est un exercice d'apprentissage, il faut
  la trace. Écarté.

## Conséquences

- **Positif** : le POSTMORTEM reste réutilisable comme documentation d'entrée
  pour la personne suivante.
- **Négatif** : format contraint peut frustrer si le vécu était rude ;
  soupape prévue dans `NOTES_PERSO.md` (non versionné).
