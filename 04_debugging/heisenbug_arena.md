# Heisenbug Arena : le bug qui change quand tu l'observes
Temps de lecture ~10 min

Un heisenbug est un bug qui disparaît ou change de forme dès que tu le regardes : ajouter un `console.log`, brancher un debugger, changer la charge, et pouf : la sortie n'est plus la même. Ce n'est pas de la magie, c'est un défaut de raisonnement sur la concurrence, l'ordre du scheduler, ou le garbage collector.

Où l'analogie casse : "Heisenberg" évoque la mécanique quantique où observer change vraiment l'état. En logiciel, observer change seulement le **timing**, ce qui suffit à réordonner des évènements concurrents mais ne modifie pas les lois du programme.

---

## 1) POURQUOI UN BUG "PART" QUAND TU L'OBSERVES

- **Timing modifié** : `console.log` synchronise sur stdout, ralentit la fonction de quelques µs, décale l'ordre relatif de deux tâches asynchrones.
- **GC déplacé** : ton observation alloue des objets, force le GC à passer ailleurs, change les pauses.
- **JIT deopté** : brancher un debugger désoptimise le code, le rend plus lent mais plus déterministe.
- **Optimizer désactivé** : un flag de debug désactive le reorder d'instructions du compilateur.

Le bug n'a pas disparu. Il s'est déplacé sous ton radar.

---

## 2) ARÈNE : 3 SCÉNARIOS À REPRODUIRE

### Scénario A : ordre du scheduler qui triche

```js
let compteur = 0
async function incr() {
 const v = compteur
 await Promise.resolve() // yield au scheduler
 compteur = v + 1
}
Promise.all([incr(), incr(), incr()]).then(() => console.log(compteur))
// Attendu : 3. Réel : souvent 1. Ajoute un console.log dans incr, ça peut passer à 2 ou 3.
```

**Ta mission** : reproduis un run à 3, un run à 1, un run à 2, en ajoutant/retirant un `console.log` ou un `await new Promise(r => setTimeout(r, 0))`. Explique en 5 lignes pourquoi le résultat change.

### Scénario B : GC qui déplace la latence

```js
function chaud() {
 const arr = new Array(1e5).fill(0)
 return arr.reduce((a, b) => a + b, 0)
}
const t0 = performance.now()
for (let i = 0; i < 1000; i++) chaud()
console.log(performance.now() - t0)
// Ajoute global.gc() (node --expose-gc) au milieu et regarde le temps changer.
```

**Ta mission** : lance en boucle, capture les 20 temps. Ajoute un `global.gc()` toutes les 100 itérations. Compare la variance. Explique où le temps est parti.

### Scénario C : reproduction déterministe forcée

Un heisenbug non déterministe reste non prouvable. Pour le figer :
- **seed** le random (`Math.random` remplacé par un PRNG seedé).
- **fake timers** (`jest.useFakeTimers()`, `sinon.useFakeTimers()`).
- **serialize** les tâches (un `for await` au lieu de `Promise.all`).
- **log ring buffer** : garde les 100 derniers évènements en mémoire, dumpe-les au crash au lieu de logger en continu.

---

## 3) MÉTHODE : PIÉGER LE BUG SANS LE FAIRE FUIR

1. **Reproduis d'abord sans observer** : lance 100 fois, mesure le taux d'échec.
2. **Instrumente léger** : ring buffer en mémoire, pas de `console.log` synchrone. Dumpe au crash.
3. **Isole la course** : quelles variables sont partagées ? Quel `await` ouvre la fenêtre ?
4. **Force le pire cas** : `await new Promise(r => setImmediate(r))` pour maximiser les yields.
5. **Prouve la correction** : rejoue les 100 essais, taux d'échec = 0.

---

## EXERCICES

**EXO 1** : Reproduis le scénario A à la main, montre 3 sorties différentes selon le nombre de `console.log` insérés. Livre : `heisenbug_A.js` + `RESULTATS.md`. (20 min)

**EXO 2** : Reprends `04_debugging/HYPOTHESES_TEMPLATE.md` et remplis-le pour le scénario B (hypothèse : le GC déplace la latence). Falsifie ou confirme. (25 min)

**EXO 3** : Écris un mini ring buffer de 100 évènements (`push(evt)` en O(1), `dump()` retourne dans l'ordre) et remplace tous les `console.log` d'un des scénarios par un `buf.push`. Compare le taux de reproduction avant/après. (25 min)

---

## RÉSUMÉ

Un heisenbug n'est pas mystique : il expose que ton raisonnement ignorait le timing, le GC, ou l'ordre du scheduler. La parade est méthodique : reproduire sans observer, instrumenter léger (ring buffer), forcer la fenêtre de course, prouver la correction sur N essais. C'est le pendant "temps" des `HYPOTHESES_*` : cause racine avant patch, mesure avant croyance.

---
stability: stable
