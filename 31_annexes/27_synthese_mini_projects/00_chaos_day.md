---
stability: intemporel
---

# Chaos Day : 3 vagues de 30 min
Temps de lecture ~5 min

Simulation de journée pourrie en prod. Prends un de tes mini-projets. Applique les 3 vagues. Livre ADR modifié + journal de bord + rétro.

## Vague 1 : La DB est down (30 min)

Ta base primaire ne répond plus. Timeout à 5s. Tu dois :
- Mettre en place un cache local de secours (in-memory ou fichier).
- Décider ce qui est servable stale vs ce qui doit erreur proprement.
- Écrire un `ADR-chaos-01-cache-fallback.md`.

## Vague 2 : Le client veut du SSR maintenant (30 min)

Ton app est SPA. Le client dit "il me faut du SEO pour hier". Tu dois :
- Lister ce qui casse en SSR (accès à `window`, `localStorage`, etc.).
- Proposer une stratégie (island, full SSR, prerender).
- ADR : `ADR-chaos-02-rendering-strategy.md`.

## Vague 3 : Un dev a push du code non testé sur main (30 min)

Le build de prod pète. Tu es d'astreinte. Tu dois :
- Revert propre (pas force push).
- Post-mortem : cause racine, impact, prévention (hook, CI, review policy).
- ADR : `ADR-chaos-03-branch-protection.md`.

## Journal de bord

Pour chaque vague : minute par minute, note ce que tu as pensé, ce que tu as fait, ce que tu as raté. Format libre, mais **honnête**.

## Rétrospective (15 min)

- Une chose à garder.
- Une chose à changer.
- Une chose à documenter pour l'équipe.

## Piège

Ne prépare pas les vagues à l'avance. La panique fait partie de l'exercice.
