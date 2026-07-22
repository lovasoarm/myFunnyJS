---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---

# HYPOTHESES.md : Template standalone

> Formaliser ce que tu **crois** avant de toucher au code. Sans ça, chaque
> "essai" est un pari flou qui rend le debug irréfutable. Ce template est
> volontairement court : si tu passes plus de 15 min à le remplir, c'est
> que tu n'as pas encore reproduit.

## 1. Symptôme observé (factuel, pas interprété)

Décris ce que tu **vois**, sans cause supposée. Une ligne.

`<ex : "1 requête sur 100, /hit renvoie un total inférieur au nombre d'appels">`

## 2. Reproduction minimale

- Commande / script exact :
  ```
  <commande>
  ```
- Fréquence : `<1/100 environ>`
- Environnement : `<node vX, OS, config>`

## 3. Hypothèses ordonnées (de la plus probable à la moins probable)

| #   | Hypothèse                                     | Prédiction si vraie                      | Test qui la falsifie              |
| --- | --------------------------------------------- | ---------------------------------------- | --------------------------------- |
| H1  | `<ex : race condition sur variable partagée>` | `<ex : le bug disparaît en sérialisant>` | `<ex : mutex + rejouer 10k fois>` |
| H2  |                                               |                                          |                                   |
| H3  |                                               |                                          |                                   |

**Règle** : au moins une hypothèse doit être **falsifiable** en < 30 min. Si
aucune ne l'est, tu n'as pas encore d'hypothèses, tu as des intuitions.

## 4. Résultat des tests

| #   | Résultat                    | Verdict                             |
| --- | --------------------------- | ----------------------------------- |
| H1  | `<ce que le test a montré>` | [ ] Confirmée [ ] Réfutée [ ] Inconclusif |
| H2  |                             |                                     |
| H3  |                             |                                     |

## 5. Décision

- Hypothèse retenue : `<H?>`
- Remède retenu : `<en 1 phrase>`
- Pourquoi celui-ci et pas les autres : `<1-2 phrases → deviendra l'ADR>`

## 6. Condition de falsification du fix

Le bug est considéré mort ssi :

- `<test précis>` passe `<N>` fois sans échec
- sous `<charge / conditions>`
- observé sur `<plateforme>`

Sans ce paragraphe, le fix n'est pas mergeable.
