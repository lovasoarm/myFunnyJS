function attack() {
  console.log("Slash");
}
let move = attack;
move();
attack.damage = 50;
console.log(attack.damage);
let skills = [];
skills.push(attack);
skills[0]();
let otherVariable = attack;
if (attack === move && move === otherVariable) {
  console.log("yes");
}
