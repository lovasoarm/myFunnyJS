---
stability: intemporel
---

# SPEC_DRIFT_DRILL : 45 min

> **But** : séparer l'ingénieur qui **subit** un changement de spec de celui
> qui le **traite comme un signal**. Aucun tuto ne t'entraînera à ça. Ici, tu
> le vis.

## Contrat de l'exercice

- Durée : **45 minutes chronométrées, en un seul bloc**.
- Interruption unique à la **20e minute** : la spec change. Tu ne peux pas
  la refuser silencieusement, tu ne peux pas la subir sans décider.
- Livrables : le code (même partiel), la **décision motivée** (refactor,
  adapter, refuser), et un **POSTMORTEM** signé.

## Énoncé initial (minute 0 → 20)

Tu écris un module `priceCart(items, coupon)` en JavaScript pur :

- `items` : `Array<{ id: string, unitPrice: number, qty: number }>`.
- `coupon` : `{ type: 'PERCENT' | 'FIXED', value: number } | null`.
- Retour : `{ subtotal: number, discount: number, total: number }`, tous
  arrondis au centime (2 décimales, half-away-from-zero).
- Contrainte : **pas de dépendance externe**, tests unitaires inclus.

Tu as **20 minutes** pour livrer une V1 verte (au moins 3 tests qui passent).

## DRIFT (à ouvrir uniquement à la minute 20)

<details>
<summary>(!)️ N'ouvre pas avant la minute 20. Chronomètre-toi.</summary>

**Nouvelle contrainte, non négociable côté produit** :

- Un `items[i]` peut désormais avoir `currency: 'EUR' | 'USD' | 'JPY'`
  (mixte dans un même panier autorisé).
- `coupon` peut être `Array<Coupon>` (empilable, ordre significatif).
- Le total doit être exprimé dans la devise du **premier** item.
- Les taux de change sont fournis par une fonction `getRate(from, to)`
  **synchrone** que tu peux mocker.
- Il te reste **25 minutes**. Tu ne peux pas demander de délai.

</details>

## Ta décision (obligatoire, écrite avant d'écrire une ligne de code)

Coche **une** case et **justifie en 3 phrases max** :

- [ ] **Refactor** : je casse l'API, j'assume la dette, je documente le breaking change.
- [ ] **Adapter** : je garde l'API V1 et j'ajoute une couche `priceCartMulti`.
- [ ] **Refuser** : la spec est incohérente / hors périmètre ; je livre V1 + note de refus argumentée.

> Une décision sans justification = drill échoué, même si le code compile.

## Règles anti-triche

- Pas d'IA générative pendant les 45 minutes (ni suggestion, ni chat).
- Pas de lecture de solution existante.
- Chronomètre visible.
- Si tu dépasses 45 min : tu t'arrêtes **et** tu notes le dépassement dans le POSTMORTEM.

## Livrable POSTMORTEM

Copie [`../31_annexes/28_templates/POSTMORTEM.md`](../31_annexes/28_templates/POSTMORTEM.md)
et adapte les sections suivantes :

1. **Signal reçu à la minute 20** : reformule la nouvelle spec avec tes mots.
2. **Option choisie** : refactor / adapter / refuser. Justification en 3 phrases.
3. **Ce que tu as jeté** : code, tests, hypothèses V1 abandonnées.
4. **Ce que tu as sauvé** : invariants, tests, structures réutilisées.
5. **Coût de bascule** : minutes réelles entre décision et premier test vert V2.
6. **Ce que tu ferais différemment si le drift arrivait à la minute 5** : pas à la 20.
7. **Score honnête** : Kick-Ass (0-3), Thor (0-3). Un total ≥ 5 = drill réussi.

## Pourquoi cet exercice existe

Un tuto t'apprend à finir. La réalité t'apprend à **rebasculer**. Le Thor n'est
pas celui qui code vite : c'est celui qui décide vite, écrit sa décision, et
ne confond pas _sunk cost_ et _engagement_. Ce drill est le seul endroit du
curriculum où on te force la main sur ce geste.

## Rythme conseillé

- **Trimestriel**. Change les invariants (devises → fuseaux → unités SI).
- Compare tes POSTMORTEMs entre deux passages : c'est là que tu vois ton
  vrai delta de séniorité.
