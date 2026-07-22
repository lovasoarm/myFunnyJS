---
stability: perissable_2027
---

# CLASSES TYPESCRIPT : L'ARMURE AVANT LE COMBAT
Temps de lecture ~8 min

Les classes JS existent depuis ES6. Les classes TypeScript, c'est les mêmes avec un casque, des gants, et une épée.
`public`, `private`, `protected`, `readonly`, `abstract` : chaque mot-clé est une contrainte délibérée sur ce qui peut toucher quoi.
En prod, ça veut dire des modules qui ne se marchent pas dessus, des données qu'on ne modifie pas par accident, et des erreurs détectées avant que le code tourne.

---

## 1) LA BASE : PROPRIÉTÉS ET CONSTRUCTEUR

Sans TypeScript, les propriétés d'une classe existent à partir du moment où tu les affectes. Avec TypeScript, elles sont déclarées avant et leur type est fixé.

```ts
class Ninja {
 name: string   // propriété déclarée, TypeScript sait que c'est un string
 chakra: number  // pareil pour chakra
 village: string

 constructor(name: string, chakra: number, village: string) {
  this.name = name
  this.chakra = chakra
  this.village = village
 }

 attack(): string {
  return `${this.name} lance un jutsu avec ${this.chakra} chakra`
 }
}

const naruto = new Ninja("Naruto", 9000, "Konoha")
naruto.name   // ok
naruto.chakra  // ok
```

Raccourci : tu peux déclarer et initialiser les propriétés directement dans le constructeur.

```ts
class Ninja {
 constructor(
  public name: string,   // public : accessible partout
  public chakra: number,  // TypeScript crée la propriété ET l'initialise
  public village: string
 ) {}
}
// identique à la version longue ci-dessus, juste plus court
```

---

## 2) PUBLIC, PRIVATE, PROTECTED

C'est là que les classes TypeScript deviennent des outils d'architecture, pas juste du sucre syntaxique.

```ts
class KnightArmor {
 public knight: string     // visible et modifiable depuis n'importe où
 private durability: number  // visible seulement dans cette classe
 protected energy: number   // visible dans cette classe ET ses sous-classes

 constructor(knight: string) {
  this.knight = knight
  this.durability = 100
  this.energy = 99.9
 }

 takeDamage(amount: number): void {
  this.durability -= amount  // ok : on est dans la classe
  if (this.durability <= 0) {
   throw new Error("L'armure s'est désintégrée. Mission échouée.")
  }
 }
}

const armor = new KnightArmor("Leon")
armor.knight   // ok : public
armor.durability // ERREUR : propriété private
armor.energy   // ERREUR : propriété protected
armor.takeDamage(20) // ok : méthode publique
```

Diagramme d'accès :

```
          dans la classe  sous-classe  extérieur
public       oui       oui      oui
protected      oui       oui      non
private       oui       non      non
```

`private` TypeScript vs `#` JS natif : `private` est vérifié à la compilation seulement. `#` est vérifié à la compilation ET au runtime. En 2026, préférer `#` pour les données vraiment sensibles.

```ts
class KnightArmor {
 #durability: number = 100 // private natif JS : inaccessible même via reflection
}
```

---

## 3) READONLY : IMMUABLE APRÈS CONSTRUCTION

`readonly` interdit toute modification après l'initialisation dans le constructeur.

```ts
class Player {
 readonly id: string    // fixé une fois, jamais modifié
 name: string

 constructor(id: string, name: string) {
  this.id = id      // ok : on est dans le constructeur
  this.name = name
 }

 rename(newName: string): void {
  this.name = newName   // ok : name n'est pas readonly
  this.id = "autre"    // ERREUR : impossible de modifier id après construction
 }
}
```

`readonly` dans les interfaces et les types aussi :

```ts
interface MatchResult {
 readonly homeTeam: string
 readonly awayTeam: string
 readonly score: [number, number]
 // une fois créé, ce résultat ne change plus
}
```

---

## 4) ABSTRACT : LE CONTRAT QU'ON NE PEUT PAS INSTANCIER

Une classe `abstract` définit une structure sans l'implémenter complètement.
Elle ne peut pas être instanciée directement. Elle sert de base pour les sous-classes.

```ts
abstract class Horror {
 abstract readonly name: string    // chaque Horror a un nom, défini par la sous-classe
 abstract attack(target: string): void // chaque Horror attaque différemment

 // une méthode concrète partagée par tous les Horrors
 manifest(): void {
  console.log(`${this.name} apparaît dans l'ombre`)
 }
}

class BladeHorror extends Horror {
 readonly name = "Blade Horror"

 attack(target: string): void {
  console.log(`${this.name} lacère ${target}`)
 }
}

const horror = new Horror()    // ERREUR : impossible d'instancier une classe abstraite
const blade = new BladeHorror()  // ok
blade.manifest()         // ok : hérité de Horror
blade.attack("Leon")       // ok : implémenté dans BladeHorror
```

Diagramme :

```
Horror (abstract)
 |-- BladeHorror  --> implémente attack()
 |-- FlameHorror  --> implémente attack()
 |-- ShadowHorror  --> implémente attack()
```

Chaque Horror est différent. Mais ils partagent tous `manifest()` et tous doivent implémenter `attack()`.

---

## 5) IMPLEMENTS : FORCER UNE CLASSE À RESPECTER UNE INTERFACE

Une classe peut `extend` une autre classe (héritage). Elle peut aussi `implement` une interface (contrat).

```ts
interface Auditable {
 createdAt: Date
 updatedAt: Date
 audit(): string
}

class Transaction implements Auditable {
 createdAt: Date
 updatedAt: Date
 amount: number

 constructor(amount: number) {
  this.amount = amount
  this.createdAt = new Date()
  this.updatedAt = new Date()
 }

 audit(): string {
  return `Transaction de ${this.amount} le ${this.createdAt.toISOString()}`
 }
}
```

Si `Transaction` n'implémente pas `audit()` ou n'a pas `createdAt` : erreur de compilation. Le contrat n'est pas respecté.

---

## 6) LE PIÈGE : PRIVATE NE PROTÈGE PAS EN RUNTIME

```ts
class WaltherVault {
 private secret: string = "methylamine"
}

const vault = new WaltherVault()
console.log((vault as any).secret) // compile. affiche "methylamine".
```

TypeScript `private` est une vérification statique. Elle disparaît à la compilation. Le JS généré est un objet normal. Quelqu'un qui cast en `any` contourne tout.

Pour une vraie protection : `#` natif JavaScript, ou une closure au lieu d'une classe.

---

## EXERCICES

## EXO 1 : le Chevalier d'Or
_~15 min_

Modélise un `GoldKnight` avec :
- `name` : public, readonly
- `energy` : protected (accessible dans la sous-classe `SilverKnight`)
- `#secretTechnique` : private natif JS
- une méthode abstraite `fight(horror: string): string`
- une méthode concrète `introduce(): string` qui retourne le nom du chevalier

Crée une sous-classe `SilverKnight extends GoldKnight` qui implémente `fight()`.
Vérifie qu'on ne peut pas accéder à `#secretTechnique` depuis `SilverKnight`.

## EXO 2 : le système d'inventaire du camp
_~15 min_

Inspiré de Walking Dead. Le camp a un inventaire.

Crée une classe `Inventory` avec :
- `readonly campId: string`
- `private items: Map<string, number>` (item name → quantity)
- méthode `add(item: string, qty: number): void`
- méthode `consume(item: string, qty: number): void` : lance une `InsufficientSupplyError` si pas assez
- méthode `report(): { item: string; qty: number }[]` : retour typé, pas d'`any`

Bonus : crée une interface `Auditable` avec `audit(): string` et fais implémenter `Inventory`.

## EXO 3 : le bug de l'any
_~20 min_

```ts
class SecureVault {
 private pin: string = "1234"
 validate(input: string): boolean {
  return input === this.pin
 }
}

const vault = new SecureVault()
// Comment accéder à pin sans passer par validate() ?
// Fais-le. Comprends pourquoi c'est possible.
// Qu'est-ce qui aurait vraiment bloqué l'accès ?
```

---

## RÉSUMÉ
`public` / `private` / `protected` définissent qui peut toucher quoi. Pas juste une convention : TypeScript bloque à la compilation.
`readonly` garantit qu'une propriété est fixée une fois pour toutes après la construction. Essentiel pour les identifiants et les configs.
`abstract` force les sous-classes à implémenter ce qui manque. C'est un contrat avec le compilateur, pas avec les humains.
`private` TypeScript est une protection statique. Elle disparaît à la compilation. `#` natif JS est la vraie protection.
`implements` sépare le contrat (interface) de l'implémentation (classe) : deux modules peuvent respecter le même contrat sans se connaître.
