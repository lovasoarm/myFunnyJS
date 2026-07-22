---
stability: intemporel
---

# SOLID PRINCIPLES
Temps de lecture ~9 min
Cinq lettres, cinq règles, un seul but : que ton code survive quand le projet grossit.
SOLID, c'est pas de la théorie de prof. C'est ce qui sépare une codebase qu'on peut faire évoluer et une codebase qu'on a peur de toucher.
Avantage : changement isolé, pas de réaction en chaîne. Inconvénient : si tu sur-appliques, tu te retrouves avec 50 fichiers pour afficher un bouton.

---

## 1) S : SINGLE RESPONSIBILITY PRINCIPLE

Une classe ou une fonction a UNE seule raison de changer.

```js
// mauvais : cette classe gère le combat ET l'affichage ET la sauvegarde
class Ninja {
 attack(target) {
  target.hp -= this.power
  console.log(`${this.name} attaque ${target.name}`)
  localStorage.setItem('lastFight', JSON.stringify({ attacker: this.name }))
 }
}
```

Si demain tu changes le système de log, ou le système de save, tu touches `Ninja`. Trois raisons de changer dans une seule classe = trois façons de tout casser.

```js
// bon : chaque classe a une seule responsabilité
class Ninja {
 attack(target) {
  target.hp -= this.power
  return { attacker: this.name, target: target.name, damage: this.power }
 }
}

class BattleLogger {
 log(result) {
  console.log(`${result.attacker} attaque ${result.target} pour ${result.damage}`)
 }
}

class FightHistory {
 save(result) {
  localStorage.setItem('lastFight', JSON.stringify(result))
 }
}
```

`Ninja` change si les règles de combat changent. `BattleLogger` change si le format de log change. Plus de collision.

**Quand s'en soucier :** dès qu'une classe ou une fonction dépasse ~50 lignes et mélange visiblement deux mots-clés différents (métier + I/O, calcul + log, transport + parsing). Signal déclencheur : deux tickets non liés touchent le même fichier dans la même semaine.

**Vraie utilité en prod :** un bug de log ne casse plus le combat ; on peut mocker le storage dans les tests sans instancier tout le domaine ; deux devs peuvent modifier la sauvegarde et le rendu en parallèle sans conflit de merge.

---

## 2) O : OPEN/CLOSED PRINCIPLE

Ton code doit être ouvert à l'extension, fermé à la modification. Tu ajoutes du comportement sans réécrire l'existant.

```js
// mauvais : chaque nouveau jutsu = on rouvre la fonction et on ajoute un if
function castJutsu(type, target) {
 if (type === 'rasengan') return applyDamage(target, 50)
 if (type === 'chidori') return applyDamage(target, 60)
 if (type === 'kamehameha') return applyDamage(target, 80) // ajouté en douce, risque de tout casser
}
```

Chaque nouvelle technique = tu rouvres une fonction qui marchait. Risque de régression à chaque ajout.

```js
// bon : chaque jutsu est un objet indépendant, la fonction centrale ne change jamais
const jutsus = {
 rasengan: target => applyDamage(target, 50),
 chidori: target => applyDamage(target, 60),
 kamehameha: target => applyDamage(target, 80)
}

function castJutsu(type, target) {
 return jutsus**type**
}

// ajouter un jutsu = ajouter une entrée, zéro risque sur l'existant
jutsus.rasenshuriken = target => applyDamage(target, 100)
```

```
castJutsu --> lookup dans jutsus --> exécution
          ^
          ajouter ici, jamais toucher castJutsu
```

**Quand s'en soucier :** dès que tu vois un `if/else if` ou un `switch` sur un type qui grossit à chaque nouvelle feature. Signal déclencheur : la 3e branche ajoutée en 2 semaines dans la même fonction.

**Vraie utilité en prod :** ajouter un nouveau moyen de paiement, un nouveau type d'event, un nouveau format d'export ne rouvre plus une fonction critique déjà testée. Zéro régression sur l'existant, la review se limite au nouveau fichier.

---

## 3) L : LISKOV SUBSTITUTION PRINCIPLE

Si `B` hérite de `A`, tu dois pouvoir utiliser `B` partout où `A` est attendu, sans surprise.

```js
// mauvais : ChevalierBronze casse le contrat de Chevalier
class Chevalier {
 fight() {
  return 'combat lancé'
 }
}

class ChevalierBronze extends Chevalier {
 fight() {
  throw new Error('pas encore prêt pour combattre') // surprise !
 }
}

function startBattle(chevalier) {
 return chevalier.fight() // crash si c'est un ChevalierBronze
}
```

Le code appelant fait confiance au contrat `fight()`. Si une sous-classe trahit ce contrat, tout code générique devient une mine antipersonnel.

```js
// bon : chaque sous-classe respecte le contrat, même si le résultat diffère
class Chevalier {
 fight() {
  return 'combat lancé'
 }
}

class ChevalierBronze extends Chevalier {
 fight() {
  return 'combat lancé en mode entraînement' // respecte le contrat, comportement adapté
 }
}

function startBattle(chevalier) {
 return chevalier.fight() // marche pour tous les types de Chevalier
}
```

**Quand s'en soucier :** dès que tu utilises `extends` ou que tu passes des objets polymorphes à une fonction générique. Signal déclencheur : une sous-classe qui throw, retourne `null`, ou impose une pré-condition plus stricte que la classe mère.

**Vraie utilité en prod :** le code appelant (framework, middleware, pipeline générique) ne fait plus de `if (obj instanceof X)` défensif. Les tests écrits pour la classe mère valident aussi les sous-classes, sans cas particuliers.

---

## 4) I : INTERFACE SEGREGATION PRINCIPLE

Pas d'interface fourre-tout. Personne ne doit dépendre de méthodes qu'il n'utilise jamais.

```js
// mauvais : un seul "contrat" géant pour tous les survivants
class Survivor {
 fight() { /* ... */ }
 cook() { /* ... */ }
 drive() { /* ... */ }
 negotiate() { /* ... */ }
}

// Carl (10 ans) doit "implémenter" negotiate et drive même si ça lui sert à rien
class Carl extends Survivor {
 fight() { return 'attaque avec le couteau' }
 cook() { throw new Error('pas son rôle') }
 drive() { throw new Error('trop jeune') }
 negotiate() { throw new Error('pas son rôle') }
}
```

```js
// bon : interfaces séparées, chacun implémente seulement ce qui le concerne
class Fighter {
 fight() { /* ... */ }
}

class Cook {
 cook() { /* ... */ }
}

class Driver {
 drive() { /* ... */ }
}

// Carl ne dépend que de ce qu'il fait vraiment
class Carl extends Fighter {
 fight() { return 'attaque avec le couteau' }
}
```

Si une classe a des méthodes qui throw "pas implémenté" ou "pas mon rôle" : c'est le signal qu'elle dépend d'une interface trop large.

**Quand s'en soucier :** dès qu'une interface (ou classe abstraite, ou type TS) dépasse 4-5 méthodes et qu'un implémenteur n'en utilise que la moitié. Signal déclencheur : des stubs `throw new Error('not implemented')` ou des méthodes vides `() => {}`.

**Vraie utilité en prod :** un consumer ne recompile pas / ne redéploie pas quand on ajoute une méthode qui ne le concerne pas. Les mocks de test tiennent en 3 lignes au lieu de 30. Moins de couplage transitif entre modules.

---

## 5) D : DEPENDENCY INVERSION PRINCIPLE

Le code de haut niveau ne doit pas dépendre du détail d'implémentation, mais d'une abstraction.

```js
// mauvais : PrisonBreakPlan dépend directement de MySQLDatabase
class MySQLDatabase {
 save(plan) { /* écrit dans MySQL */ }
}

class PrisonBreakPlan {
 constructor() {
  this.db = new MySQLDatabase() // couplage direct, dur à changer
 }
 saveProgress(data) {
  this.db.save(data)
 }
}
```

Si demain Michael Scofield migre vers Redis, tu dois modifier `PrisonBreakPlan`. Le haut niveau (le plan) dépend du détail (MySQL).

```js
// bon : PrisonBreakPlan dépend d'une abstraction, pas d'une implémentation précise
class PrisonBreakPlan {
 constructor(storage) {
  this.storage = storage // injecté de l'extérieur, n'importe quel storage avec .save()
 }
 saveProgress(data) {
  this.storage.save(data)
 }
}

class MySQLDatabase {
 save(plan) { /* écrit dans MySQL */ }
}

class RedisStorage {
 save(plan) { /* écrit dans Redis */ }
}

// on injecte ce qu'on veut, PrisonBreakPlan n'en sait rien
const plan = new PrisonBreakPlan(new RedisStorage())
```

```
PrisonBreakPlan --> Storage (abstraction)
            ^
            MySQLDatabase / RedisStorage (détails interchangeables)
```

Risque évité : sans inversion de dépendance, changer une techno = réécrire toute la logique métier qui n'a rien à voir avec le stockage.

**Quand s'en soucier :** dès qu'une classe de logique métier fait `new X()` sur une dépendance d'I/O (DB, HTTP client, logger, filesystem, horloge). Signal déclencheur : tu ne peux pas tester la logique sans lancer une vraie base de données.

**Vraie utilité en prod :** on swap Postgres ↔ Redis, Sentry ↔ console, `Date.now()` ↔ horloge fake, sans toucher au domaine. Les tests deviennent rapides et déterministes ; la migration d'infra devient un changement de câblage, pas une réécriture.

---

## EXERCICES

## EXO 1 : trouve la violation
Lis ce bloc et identifie quelle lettre de SOLID est violée (une seule lettre, justifie en 1 phrase) :

```js
class ApiResponse {
 parseAndLog(data) {
  const parsed = JSON.parse(data)
  console.log('Réponse reçue:', parsed)
  fetch('/analytics', { method: 'POST', body: JSON.stringify(parsed) })
  return parsed
 }
}
```

(indice : compte combien de raisons différentes cette méthode a de changer)

## EXO 2 : applique l'Open/Closed
Tu as un système de notation pour le Ballon d'Or avec cette fonction :

```js
function calculateBonus(category, baseScore) {
 if (category === 'goals') return baseScore * 1.5
 if (category === 'assists') return baseScore * 1.2
 if (category === 'titles') return baseScore * 2
}
```

Mission : refactore en utilisant un objet de lookup (comme l'exemple des jutsus), pour qu'ajouter une catégorie `'cleanSheets'` ne touche jamais à la fonction `calculateBonus`.

## EXO 3 : dependency inversion sur le dashboard
Le dashboard des Ultras a une classe `MatchDashboard` qui appelle directement `SentryLogger.send(error)` partout dans son code.

Mission : décris (sans code complet, juste la structure) comment injecter un `logger` générique dans `MatchDashboard` pour pouvoir swap Sentry par un logger console en test, sans toucher à la logique du dashboard.

---

## RÉSUMÉ
SOLID, c'est pas cinq règles à cocher : c'est cinq questions à se poser quand le code devient compliqué à changer. Une classe qui fait trop de choses, un switch qui grossit à chaque feature, une sous-classe qui crash là où la classe mère marchait : ce sont des signaux. SOLID te donne le vocabulaire pour nommer le problème et la direction pour le réparer.
