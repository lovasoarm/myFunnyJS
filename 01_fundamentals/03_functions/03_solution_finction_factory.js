function makeWeapon(name, damage) {
  return function useWeapon() {
    console.log(name + " attaque avec " + damage + " de degats");
  };
}
let arme1 = makeWeapon("dragonov", 200);
let arme2 = makeWeapon("magnum", 400);
arme1();
arme2();

let armes = [
  { name: "katana", damage: 100 },
  { name: "AKA", damage: 400 },
  { name: "bazooka", damage: 999 },
];
let armeFunctions = armes.map((arme) => makeWeapon(arme.name, arme.damage));
console.log(armeFunctions);

armeFunctions.forEach((fn) => fn());
