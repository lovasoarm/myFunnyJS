/*
===========================================================
MUTATION MADNESS — SHALLOW VS DEEP COPY
===========================================================

Bienvenue dans le chaos ultime.

Quand tu fais :

let monsters = [
  { name: "Goblin", hp: 100, attack: { dmg: 20, type: "slash" } },
  { name: "Orc", hp: 150, attack: { dmg: 30, type: "smash" } }
];

let shallowMonsters = [...monsters];

Tu as copié le tableau, mais pas les objets à l’intérieur.

Donc :

shallowMonsters[0].attack.dmg += 10;

Va aussi modifier monsters[0].attack.dmg.

----------------------------------
MÉMOIRE SIMPLIFIÉE
----------------------------------

Variable → tableau → objets → objets imbriqués

Shallow copy = nouveau tableau
               mais objets internes partagés

Deep copy = nouveau tableau
            + nouveaux objets
            + nouveaux objets imbriqués

Si tu ne comprends pas ça, tu vas créer des bugs invisibles.

----------------------------------
COMMENT FAIRE UNE VRAIE COPIE ?
----------------------------------

Pour copier seulement le tableau (shallow) :

let shallowMonsters = [...monsters];

Pour copier les objets à l’intérieur (deep) :

let deepMonsters = monsters.map(monster => ({
  ...monster,
  attack: { ...monster.attack }
}));

Pour objets très imbriqués :

let deepMonsters = structuredClone(monsters);

----------------------------------
POURQUOI C’EST CRUCIAL ?
----------------------------------

- En React / Vue → state immuable
- En backend → éviter de modifier un objet partagé par erreur
- En architecture → sécurité mémoire
- En performance → éviter des mutations surprises

===========================================================
MISSION MUTATION MADNESS
===========================================================

La Team Chaotique.

1) Crée un tableau "monsters" avec 3 monstres,
   chaque monstre = { name, hp, attack: { dmg, type } }

2) Crée une copie "shallowMonsters" avec spread operator [...]
3) Modifie dmg du premier monstre via shallowMonsters
4) Affiche monsters et shallowMonsters
   → Observe le chaos ! Les deux tableaux ont changé

Ensuite :

5) Crée une vraie copie "deepMonsters" avec map + spread
6) Modifie dmg du deuxième monstre via deepMonsters
7) Affiche monsters et deepMonsters
   → Observe que monsters reste intact

Comprends.
Ne regarde pas juste le résultat.
Réfléchis à la mémoire.
*/

let monsters = [
  { name: "Goblin", hp: 100, attack: { dmg: 20, type: "slash" } },
  { name: "Orc", hp: 150, attack: { dmg: 30, type: "smash" } },
  { name: "Troll", hp: 200, attack: { dmg: 40, type: "crush" } },
];

// Ton code ici
