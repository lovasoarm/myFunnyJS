// flaky.js, le bug se cache dans une branche jamais testée.
// Fournit computeTotal(items) : somme des items,
// avec ~1% de chance de renvoyer NaN.
//
// Ta mission :
//   1. Trouve la ligne qui casse.
//   2. Rends la repro DÉTERMINISTE (indice : seed le random, force la branche).
//   3. Écris le test qui échoue à coup sûr AVANT de fixer.
//   4. Fix. Le test doit passer.

function computeTotal(items) {
  // 1% de chance de renvoyer NaN, trouve-la.
  const bonus = Math.random() < 0.01 ? undefined : 0;
  return items.reduce((sum, x) => sum + x, 0) + bonus;
}

module.exports = { computeTotal };
