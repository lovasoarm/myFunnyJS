let team = [
  { name: "Alpha", hp: 100 },
  { name: "Beta", hp: 100 },
  { name: "Gamma", hp: 100 },
];
let shadowTeam = team; //meme adresse memoire que team
shadowTeam[0].hp -= 50;
console.log(team);
console.log(shadowTeam);

let shadowTeam2 = [...team]; // meme adresse mémoire que team
shadowTeam2[1].hp -= 12;
console.log(shadowTeam2);

//Si on veut modifier uniquement un truc sans affectation (Deep copie)
let something = team.map((player) => ({ ...player }));
something[2].hp -= 12;
console.log(something);
