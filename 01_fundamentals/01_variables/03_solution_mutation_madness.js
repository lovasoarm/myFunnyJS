let monsters = [
  { name: "Goblin", hp: 100, attack: { dmg: 20, type: "slash" } },
  { name: "Orc", hp: 150, attack: { dmg: 30, type: "smash" } },
  { name: "Troll", hp: 200, attack: { dmg: 40, type: "crush" } },
];

let shallowMonster = [...monsters];
shallowMonster[0].attack.dmg -= 10;
console.log(monsters);
console.log(shallowMonster);

//deep copy
let deepMonsters = monsters.map((monster) => ({
  ...monster,
  attack: { ...monster.attack },
})); //attack reste la même référence si on ne fait rien.
console.log(deepMonsters);
deepMonsters[1].attack.dmg -= 20;
console.log(monsters);
console.log(deepMonsters);

//deep copy version simplifiée
let another = structuredClone(monsters);
console.log(another);
another[2].attack.dmg -= 20;
console.log(another);
