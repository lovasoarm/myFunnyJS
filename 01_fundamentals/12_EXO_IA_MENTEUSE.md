---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# EXO [IA MENTEUSE] : fundamentals (closures)

Temps de lecture ~2 min


> Tag `[IA MENTEUSE]` : une IA a généré ce code. Il tourne. Il a l'air propre. Il ment.
> Durée : 15 min chrono. Zéro exécution avant d'avoir écrit ta réponse.

## Contexte

Tu demandes à une IA générique de générer un tracker de progression pour trois barres de vie qui doivent chacune logger leur état toutes les 100ms, avec un léger décalage entre elles. Voici ce qu'elle te sort :

```js
function trackHealthBars(bars) {
 for (var i = 0; i < bars.length; i++) {
  setTimeout(() => {
   console.log(`Barre ${i} : ${bars[i]}% de vie`);
  }, 100 * i);
 }
}

trackHealthBars([100, 60, 30]);
```

L'IA t'assure : "ce code logue bien chaque barre avec son propre index, respecte l'ordre, et le délai croissant garantit un affichage propre dans le terminal."

## Consigne

Avant de lancer une seule ligne :

1. Prédis exactement ce que la console va afficher, ligne par ligne.
2. Identifie la phrase de l'IA qui est fausse, et explique pourquoi elle a l'air vraie.
3. Corrige le code avec la solution la plus simple possible (pas de librairie, pas de over-engineering).

Ensuite seulement, lance le code et compare à ta prédiction.

## Piège caché

`var` n'est pas block-scoped (voir `02_closure_trap.md`). Toutes les closures créées dans la boucle partagent la même variable `i`. Le délai croissant (`100 * i`) fait illusion : il donne l'impression que le timing "corrige" le bug, alors qu'il ne fait que repousser le moment où toutes les callbacks lisent la même valeur finale.

## Preuve à livrer

- ta prédiction écrite AVANT exécution (`prediction.txt`)
- le diff entre ta prédiction et le résultat réel
- ta version corrigée (`fix.js`), avec en commentaire la phrase exacte de l'IA que tu as invalidée

## Pourquoi c'est vital

Une IA qui génère un code qui tourne sans crash n'a pas généré un code correct. Elle a généré un code qui ne crash pas. Ce module t'apprend à distinguer les deux : c'est la compétence qui te rend difficile à remplacer.
