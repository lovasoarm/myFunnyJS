// Bug flaky : env. 1 fois sur 100, computeTotal([1,2,3]) renvoie NaN.
// Le "hasard" est ton ennemi : tu vas devoir le seed pour rendre le bug deterministe.
// Regle : n'ouvre pas ce fichier avant d'avoir ecrit ta reproduction en francais.

function jitter() {
  // Piege : Math.random() < 0.01 injecte un NaN silencieux dans la somme.
  return Math.random() < 0.01 ? NaN : 0;
}

function computeTotal(nums) {
  // On additionne avec un "bruit" qui, une fois sur cent, casse tout.
  return nums.reduce((acc, n) => acc + n + jitter(), 0);
}

module.exports = { computeTotal, jitter };
