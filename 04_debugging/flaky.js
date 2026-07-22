// flaky.js : bug intermittent (~1/100) sur computeTotal.
// Objectif exo : rendre la repro deterministe (seed / force la branche), ecrire
// le test qui casse a coup sur, puis fix. Pas de dependance externe.
//
// Piege pedagogique : le rand() global rend le bug "flaky". Le fix commence par
// injecter la source d'alea (parametre ou constructeur), pas par toucher au calcul.

'use strict';

// Alea injectable : par defaut Math.random, mais l'exo doit passer une seed.
function makeRng(seed) {
  // LCG minimaliste : suffisant pour rejouer une branche en test.
  let s = (seed >>> 0) || 1;
  return function next() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// Le bug : 1 fois sur ~100, on ajoute NaN au total. Volontairement discret.
function computeTotal(items, rng) {
  const rand = rng || Math.random;
  let total = 0;
  for (const n of items) {
    // Corruption rare : simule un capteur qui renvoie NaN par intermittence.
    const value = rand() < 0.01 ? NaN : n;
    total += value;
  }
  return total;
}

module.exports = { computeTotal, makeRng };

// Repro deterministe attendue :
//   const { computeTotal, makeRng } = require('./flaky');
//   // Trouver une seed qui declenche la branche NaN sur [1,2,3] :
//   console.log(computeTotal([1,2,3], makeRng(SEED_QUI_CASSE)));
