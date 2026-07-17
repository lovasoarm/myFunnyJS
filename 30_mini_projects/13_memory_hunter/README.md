---
stability: intemporel
---

[PORTFOLIO]

# 13 : MEMORY HUNTER

-> ~5 min

Un mini-serveur Node volontairement pourri. Cinq fuites cachées. Ton job : les traquer, les tuer, les documenter.

## Pitch 3 lignes

Ce projet prouve que je sais lire un heap snapshot, corréler une allocation à une closure, et écrire un post-mortem qu'un autre dev peut relire. Sans framework, sans magie.

## Les cinq bêtes

1. Closure qui capture un gros objet (voir `08_memory_performance/01_gc/03`).
2. Event listener jamais retiré (`.on()` sans `.off()`).
3. `setInterval` orphelin après un unref manqué.
4. Variable globale (`global.cache = []`) qui push à l'infini.
5. Cache Map sans éviction (LRU absent).

## Ce qu'on te livre

- `src/server.js` : le serveur avec les 5 pièges.
- `bench/spam.sh` : script pour envoyer 10 000 requêtes.
- `TEMPLATE_LEAK_REPORT.md` : à remplir pour chaque fuite trouvée.

## Ce que tu dois livrer

- `LEAK_REPORT_01.md` … `LEAK_REPORT_05.md` : cause racine, preuve (snapshot), correction, mesure.
- `ADR-001_decision.md` : quel LRU tu as choisi, pourquoi.
- `POSTMORTEM.md` : ce que tu ferais différemment.

## Critères d'acceptation

- Heap stable après 10 000 requêtes (< +5 MB par rapport à la baseline).
- Aucun `setInterval` restant sans `unref`.
- Empreinte carbone : estime l'impact d'un serveur qui fuit vs corrigé (voir `31_annexes/03_finops_greenops.md`).

## Piège

Corriger sans mesurer, c'est deviner. Snapshot avant, snapshot après, sinon ça compte pas.

## THÈME NEUTRE (optionnel)

Si les références Naruto/DBZ ne te parlent pas, remplace mentalement par un domaine que tu connais (foot, cuisine, musique). Le concept technique reste identique.

---

## REPRODUCTIBILITÉ

Installation canonique : `npm ci` (pas `npm install`). `npm ci` respecte strictement le `package-lock.json` : deux personnes qui clonent obtiennent exactement les mêmes versions. Committe toujours ton `package-lock.json`. Sans lui, un `npm install` 3 mois plus tard installera d'autres versions et tu debug un fantôme.
