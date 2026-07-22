---
stability: intemporel
---

# LIRE DU CODE HUMAIN vs LIRE DU CODE IA

Temps de lecture ~2 min


Deux styles, deux pièges, deux stratégies de lecture.

## Le code humain legacy

```js
// écrit en 2019, jamais retouché, prod critique
function processOrder(o) {
 var t = 0;
 for (var i = 0; i < o.items.length; i++) {
  t += o.items[i].p * o.items[i].q; // p=prix, q=quantite
  if (o.items[i].t) t += o.items[i].t; // taxe fixe si presente
 }
 return o.d ? t * (1 - o.d) : t; // d = discount 0..1
}
```

Piège : noms cryptiques, historique invisible, mais **cohérent avec lui-même**. Il y a une logique
implicite qu'un humain fatigué en 2019 a "casée" ici. Cherche cette logique avant de refactorer.

## Le code IA plausible mais faux

```js
// généré, "propre", ne compile pas dans ton runtime
async function processOrder(order) {
 const total = order.items.reduce(
  (acc, item) => acc + item.price * item.qty + (item.tax ?? 0),
  0
 );
 return order.discount ? total * (1 - order.discount) : total;
}
```

Piège : lisible, moderne, **mais** peut avoir inventé `item.tax` alors que le schema réel a `item.vat`.
L'IA optimise la vraisemblance, pas la vérité de ton schema.

## Stratégie de lecture

- Code humain : cherche l'intention derrière les raccourcis. Ne renomme pas avant d'avoir compris.
- Code IA : vérifie chaque nom de champ contre le schéma réel. Doute des defaults inventés.
- Dans les deux cas : `git blame` et tests > relecture seule.
