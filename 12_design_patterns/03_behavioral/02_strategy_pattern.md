---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# STRATEGY PATTERN
Temps de lecture ~8 min

Tu code un perso qui attaque. Aujourd'hui c'est un coup de poing. Demain un coup de pied. Après-demain un kamehameha.

Si tu gères ça avec des `if/else` partout : chaque nouvelle attaque te fait toucher le code existant.

Strategy règle ça : chaque algo devient une fonction interchangeable, et le contexte choisit laquelle utiliser à l'exécution.

Avantage : ajouter une stratégie = ajouter une fonction, zéro modif du code existant.
Inconvénient : si t'as 2 stratégies à vie, c'est overkill : un `if/else` suffit largement.

---

## 1) LE PROBLÈME : LE IF/ELSE QUI GONFLE

```js
// Goku attaque. Quelle attaque ? ça dépend du mode.
function attack(power, mode) {
 if (mode === "kamehameha") {
  return power * 1.5
 } else if (mode === "kaioken") {
  return power * 2
 } else if (mode === "spirit_bomb") {
  return power * 3
 }
 // chaque nouvelle technique = une nouvelle branche ici
 throw new Error("technique inconnue")
}
```

Ça marche pour 3 techniques. Maintenant Vegeta arrive avec son Final Flash, Piccolo avec son Makankosappo, et Gohan avec sa Masenko.

```
mode "kamehameha" --> branche 1
mode "kaioken"   --> branche 2
mode "spirit_bomb" --> branche 3
nouveau perso   --> nouvelle vague de branches
```

Le `if/else` devient une god-function : tout le monde y touche, personne ne veut la lire, et un jour quelqu'un casse `kamehameha` en ajoutant `final_flash`.

---

## 2) LA SOLUTION : CHAQUE TECHNIQUE EST UNE FONCTION INDÉPENDANTE

```js
// chaque stratégie respecte la même signature : (power) => degats
// même contrat, comportement différent
const strategies = {
 kamehameha: (power) => power * 1.5,
 kaioken: (power) => power * 2,
 spirit_bomb: (power) => power * 3,
}

// attack ne connaît AUCUNE technique : il sait juste exécuter une stratégie
function attack(power, strategyKey) {
 const strategy = strategies[strategyKey]

 if (!strategy) {
  throw new Error(`technique inconnue : ${strategyKey}`)
 }

 return strategy(power)
}

console.log(attack(100, "kamehameha")) // 150
console.log(attack(100, "kaioken"))  // 200
```

Ajouter le Final Flash de Vegeta :

```js
strategies.final_flash = (power) => power * 2.8
// attack() n'a pas bougé d'une ligne
```

```
contexte (attack) --> délègue --> stratégie (kamehameha, kaioken, final_flash...)
```

Le contexte ne sait pas COMMENT chaque technique calcule ses dégâts. Il sait juste QUI appeler. La logique de calcul est isolée, testable seule, remplaçable sans toucher au reste.

**Risque réel** : si une stratégie ne respecte pas le contrat (genre elle retourne un objet au lieu d'un number, ou elle a besoin d'un paramètre en plus que les autres n'ont pas), tout le système qui appelle `attack()` plante sans prévenir. Le contrat implicite (même signature, même type de retour) doit être respecté par TOUTES les stratégies, sinon Strategy devient un piège à bugs silencieux.

---

## 3) STRATEGY AVEC DU CONTEXTE : QUAND L'ALGO A BESOIN DE PLUS QU'UN NOMBRE

Dans la vraie vie, une stratégie a souvent besoin de connaître l'état complet du combat, pas juste un `power`.

```js
// chaque stratégie reçoit l'état complet du combattant et de la cible
const combatStrategies = {
 kamehameha: (attacker, defender) => {
  const baseDamage = attacker.power * 1.5
  // si la cible a moins de chakra que l'attaquant, bonus de 20%
  const bonus = defender.chakra < attacker.chakra ? 1.2 : 1
  return Math.round(baseDamage * bonus)
 },

 // version défensive : protège plus mais frappe moins
 defensive_stance: (attacker, defender) => {
  return Math.round(attacker.power * 0.6)
 },
}

function executeAttack(attacker, defender, strategyKey) {
 const strategy = combatStrategies[strategyKey]
 if (!strategy) throw new Error("technique inconnue")

 const damage = strategy(attacker, defender)
 return { ...defender, hp: defender.hp - damage }
}
```

```
Goku (attacker) --> executeAttack --> strategy(attacker, defender) --> damage --> nouveau Vegeta (defender)
```

Toujours zéro mutation : `executeAttack` retourne un NOUVEAU `defender`, jamais modifié sur place. Strategy + immutabilité = combo qui revient tout au long de `12_design_patterns`.

---

## 4) STRATEGY VS SIMPLE FONCTION PASSÉE EN PARAMÈTRE

Question légitime : `array.sort((a, b) => a - b)` c'est déjà du Strategy non ?

Oui. Littéralement. `sort` est le contexte, la fonction de comparaison est la stratégie.

```js
const players = [{ name: "Messi", goals: 35 }, { name: "Mbappé", goals: 44 }]

// stratégie 1 : trier par buts décroissants
players.sort((a, b) => b.goals - a.goals)

// stratégie 2 : trier par nom alphabétique
players.sort((a, b) => a.name.localeCompare(b.name))
```

Le pattern Strategy "officiel" avec un objet `strategies = {...}` devient utile quand :
- tu as PLUSIEURS stratégies nommées qu'on choisit dynamiquement (par config, par input shinobi)
- tu veux pouvoir LISTER les stratégies disponibles (`Object.keys(strategies)`)
- les stratégies doivent être stockées, sérialisées, ou injectées depuis l'extérieur

Si c'est juste "une fonction qu'on passe une fois" : une callback suffit, pas besoin de sortir le nom "Strategy Pattern" en réunion.

---

## EXERCICES

## EXO 1 : le sélecteur de jutsu de Naruto

Naruto a 4 jutsus : `rasengan`, `kage_bunshin`, `rasenshuriken`, `sage_mode`.

Construis un objet `jutsus` où chaque clé est une fonction `(chakra) => degats`. Chaque jutsu a un multiplicateur différent (à toi de choisir, mais `rasenshuriken` doit être le plus violent et `kage_bunshin` le plus faible).

Écris une fonction `useJutsu(chakra, jutsuName)` qui :
- lance l'attaque correspondante
- si `jutsuName` n'existe pas dans `jutsus`, lève une erreur `"jutsu inconnu"`

(indice : ne fais AUCUN `if` sur le nom du jutsu dans `useJutsu`, seulement la vérification d'existence)

---

## EXO 2 : changer de stratégie pendant le match

Un attaquant de foot a 3 styles de tir : `puissance`, `precision`, `lob`.

Crée un objet `tireurs` avec ces 3 stratégies, chacune retournant une probabilité de but entre 0 et 1 selon la distance du but (`distance` en mètres, passé en paramètre).

Règle métier :
- `puissance` est meilleure de près (moins de 10m)
- `precision` est stable peu importe la distance
- `lob` est meilleure de loin (plus de 20m), nulle de près

Écris `tirer(distance, style)` qui retourne la probabilité, puis simule 3 tirs avec 3 styles différents sur la même distance et affiche lequel a le plus de chances de marquer.

---

## EXO 3 : le piège du contrat cassé

Voici un code fourni :

```js
const strategies = {
 rapide: (power) => power * 1.2,
 lente: (power, bonus) => power * 1.5 + bonus, // <-- bug caché ici
}

function attack(power, key) {
 return strategies**key**
}

console.log(attack(100, "rapide")) // ok
console.log(attack(100, "lente")) // ???
```

Sans exécuter le code : explique pourquoi `attack(100, "lente")` ne plante PAS (aucune erreur JS) mais retourne un résultat FAUX. Quelle est la valeur exacte retournée, et pourquoi ?

Ensuite, corrige `strategies.lente` pour qu'elle respecte le même contrat que les autres (une seule entrée : `power`).

---

## RÉSUMÉ

Strategy, c'est déléguer le "comment" à une fonction interchangeable, et garder le "qui appelle" complètement ignorant des détails. Le vrai gain c'est l'ajout sans modification : une nouvelle technique, un nouveau tri, un nouveau calcul, ça rentre sans toucher au code qui orchestre. Le vrai danger c'est le contrat silencieux : si une stratégie ne respecte pas la même signature que les autres, tout pète en douceur, sans erreur visible.
