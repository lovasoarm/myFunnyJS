---
stability: intemporel
---

# Bloc 21-25 : API, sécu, IA, DB, scalabilité
Temps de lecture ~5 min

## Rétrospective guidée

- Qu'est-ce qui, dans le bloc, a été **le plus dur à intégrer** ?
- Cite **1 décision** que tu regrettes.
- Cite **1 décision** que tu re-prendrais.

## Mini-défi de re-contextualisation

Prends un exercice d'un module **antérieur au bloc** et refais-le avec les outils du bloc courant. Écris ce qui change.

## Rétro-ADR

Rejoue le drill solo-vs-copilot (`23_ai_native_dev/07_solo_vs_copilot_drill.md`).
Compare ton temps et ta confiance sur ce bloc (21-25) à ceux du bloc précédent.

## Question rituelle

> Relis ton ADR le plus ancien. Qu'est-ce que tu changerais aujourd'hui ? Pourquoi ?

## Chaos Day (si applicable)

Contraintes qui peuvent tomber :
1. "Le client veut du temps réel."
2. "On supprime la DB, tout en mémoire."
3. "L'API doit être idempotente."
4. "Un dev quitte, tu récupères son module sans doc."
5. "La sécu impose CSP strict."

Chaque changement → nouvel ADR (max 1 page).

---

> **Rappel `DEPENDENCY_LEDGER`** : avant de clore ce bloc, ouvre `DEPENDENCY_LEDGER.md` à la racine et ajoute une ligne par outil IA utilisé (quoi, quand, pourquoi, combien de temps gagné/perdu). Silence = drift.
