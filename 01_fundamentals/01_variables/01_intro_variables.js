/* 
LEÇON – Variables & Références
---------------------------------------------------

Bienvenue dans le monde où JS t'apprend pas juste à coder, mais à comprendre la vie secrète des variables.

1) Variable = Référence ?
   - Quand tu crées une variable primitive (number, string, boolean), tu copies la valeur. 
     Chaque variable vit sa vie, indépendante.
   - Quand tu crées un objet (array, object, function), tu ne copies pas la maison, tu copies la clé.
     Deux variables peuvent pointer sur la même maison : si tu changes l'intérieur avec une variable, l'autre le voit.

2) Pourquoi c’est un piège classique ?
   - Tu changes un objet en pensant que tu ne touches pas l’autre variable → chaos invisible.
   - Exemples : tableaux partagés, objets de config, backup mal géré.

3) Conseil d’ingénieur :
   - Savoir quand cloner profondément ou shallow copy
   - Toujours vérifier si tu bosses sur la vraie référence ou juste une copie
   - Visualise le tableau comme une maison et la variable comme la clé !

---------------------------------------------------
INSTRUCTIONS DE L’EXERCICE – Team Crazy Zombies

1. Crée un tableau `team` avec 3 zombies. Chaque zombie = objet `{name, hp}`.
2. Crée une nouvelle variable `backupTeam` qui pointe sur le même tableau.
3. Le boss zombie augmente le `hp` du premier zombie de `backupTeam` de +50.
4. Un virus attaque le deuxième zombie de `team` et le met à 0 hp.
5. Affiche `team` et `backupTeam` pour observer le chaos des références.

---------------------------------------------------
CODE DE DÉPART
*/

let team = [
  { name: "Zombie1", hp: 100 },
  { name: "Zombie2", hp: 100 },
  { name: "Zombie3", hp: 100 },
];
