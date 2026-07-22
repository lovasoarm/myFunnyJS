---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# COMPOSITION VS INHERITANCE : LA VRAIE DÉCISION SENIOR

Temps de lecture ~8 min

Le fichier 06 a montré le piège des hiérarchies profondes. Ce fichier répond à la question qui suit logiquement : qu'est-ce qu'on fait à la place ? La réponse n'est pas "l'héritage est mauvais". La réponse est : `extends` répond à une question précise ("is-a", est un), la composition en répond à une autre ("has-a", possède un), et confondre les deux questions, c'est là que naissent les hiérarchies qui piègent.

## 1) "IS-A" : QUAND L'HÉRITAGE EST LA BONNE QUESTION

```js
class Horror {
  constructor(nom) {
    this.nom = nom;
  }

  apparaitre() {
    return `${this.nom} surgit de l'ombre`;
  }
}

class HorrorAlpha extends Horror {
  devorer() {
    return `${this.nom} devore sa cible`;
  }
}
```

`HorrorAlpha` EST un `Horror`, dans tous les sens du terme, pour toujours, sans exception. Cette relation est stable, naturelle, et ne va pas se retrouver à devoir gérer 6 variantes incompatibles dans 6 mois. C'est le cas où `extends` est légitime : une vraie relation "is-a" (est un), stable dans le temps.

## 2) "HAS-A" : QUAND LA COMPOSITION EST LA BONNE QUESTION

```js
const peutVoler = {
  voler() {
    return `${this.nom} s'envole`;
  },
};

const peutNager = {
  nager() {
    return `${this.nom} plonge sous l'eau`;
  },
};

class HorrorAmphibie {
  constructor(nom) {
    this.nom = nom;
    Object.assign(this, peutVoler, peutNager); // composition : possède ces capacités
  }
}

const titan = new HorrorAmphibie("Titan des Abysses");
titan.voler(); // "Titan des Abysses s'envole"
titan.nager(); // "Titan des Abysses plonge sous l'eau"
```

`HorrorAmphibie` n'EST pas "un vol" ni "une nage" : il POSSÈDE la capacité de voler et de nager. C'est une relation "has-a" (possède un). La composition assemble des comportements indépendants, sans créer de lien de parenté hiérarchique entre eux.

## 3) LE TEST QUI TRANCHE : "IS-A" OU "HAS-A" ?

```
Un Carré EST une Forme        --> is-a, extends légitime
Un Carré A une Couleur        --> has-a, composition (propriété, pas héritage)

Un ChevalierGaro EST un Chevalier   --> is-a, extends légitime
Un ChevalierGaro A une ArmureDeFeu  --> has-a, composition

Un AdminUser EST un User       --> is-a, parfois légitime, parfois piège (voir section 5)
```

Si tu hésites entre les deux mots en français pour décrire la relation, c'est souvent le signal que tu es en train de forcer un `extends` là où une simple propriété aurait suffi.

## 4) LES MIXINS : LA COMPOSITION QUI RESSEMBLE À DE L'HÉRITAGE

```js
const Combattant = (Base) =>
  class extends Base {
    attaquer() {
      return `${this.nom} attaque`;
    }
  };

const Soigneur = (Base) =>
  class extends Base {
    soigner(cible) {
      return `${this.nom} soigne ${cible}`;
    }
  };

class Entite {
  constructor(nom) {
    this.nom = nom;
  }
}

class Paladin extends Combattant(Soigneur(Entite)) {}

const paladin = new Paladin("Garo");
paladin.attaquer(); // hérité du mixin Combattant
paladin.soigner("Kaoru"); // hérité du mixin Soigneur
```

Un mixin (fonction qui prend une classe et retourne une classe étendue) permet d'assembler plusieurs comportements sans créer une hiérarchie unique et rigide. `Paladin` combine deux capacités indépendantes, sans qu'aucune des deux ne soit son "vrai parent" conceptuel. C'est un compromis entre composition pure et syntaxe `extends`.

## 5) L'EXEMPLE QUI CASSE : LE FAUX "IS-A"

```js
class Oiseau {
  voler() {
    return `${this.nom} s'envole`;
  }
}

class Pingouin extends Oiseau {
  // un pingouin EST un oiseau... mais ne vole pas
}

const pingu = new Pingouin();
pingu.nom = "Pingu";
pingu.voler(); // "Pingu s'envole" : faux, logiquement cassé
```

Biologiquement, un pingouin EST un oiseau. Mais dans ce modèle de code, `Oiseau` porte une capacité (`voler`) que tous ses enfants n'ont pas réellement. L'héritage syntaxique a forcé une relation "is-a" qui ne tient pas dans le comportement réel. Le vrai risque de prod : ce genre de faux "is-a" passe inaperçu à la création, puis explose 2 ans plus tard quand quelqu'un ajoute un cas qui casse l'hypothèse de départ (ici, un type qui ne vole pas).

```
hiérarchie pensée à la création :
  Oiseau --> tous volent

réalité qui arrive plus tard :
  Pingouin extends Oiseau, mais ne vole pas
  Autruche extends Oiseau, mais ne vole pas non plus
    |
    v
chaque nouveau cas force soit un mensonge (override qui annule le comportement),
soit un if() qui vérifie le type avant d'appeler voler()
```

## TIPS D'ÉVOLUTION

Pendant longtemps, l'héritage a été enseigné comme LA solution OOP par défaut, héritée de langages comme Java où la culture du "tout est une classe parente" était dominante. Depuis plusieurs années, la position dominante en JS (et ailleurs) a changé : "favoriser la composition sur l'héritage" (composition over inheritance) est devenue la règle par défaut chez les devs seniors. Pas parce que `extends` est cassé : parce que la composition échoue de façon plus prévisible (un objet n'a juste pas la capacité) alors que l'héritage mal posé échoue de façon catastrophique (toute une branche de la hiérarchie repose sur une fausse hypothèse).

## EXERCICES

EXO 1 : le bon "is-a" :
Modélise une relation `ZombieCoureur extends Zombie` sur le thème de Walking Dead, où la relation est stable et logique dans tous les cas (tout `ZombieCoureur` reste un `Zombie` valide, sans exception cachée). Justifie en commentaire pourquoi `extends` est légitime ici.

EXO 2 : composition de capacités :
Construis un système de capacités indépendantes (`peutCourir`, `peutMordre`, `peutInfecter`) sous forme d'objets ou de mixins, et assemble-les sur 2 types de zombies différents qui n'ont pas exactement les mêmes capacités. Démontre que la composition évite de forcer une hiérarchie unique.

EXO 3 : démasquer le faux "is-a" :
Reprends l'exemple `Oiseau`/`Pingouin` de la section 5, mais sur le thème Naruto (`Jutsu` qui "vole()" alors que certains jutsus : invocation, terre : ne volent pas). Identifie le faux "is-a", puis propose une refonte avec composition qui corrige le problème sans dupliquer de code.

## RÉSUMÉ

`extends` répond à la question "est-ce que cet objet EST l'autre, sans exception, pour toujours ?". La composition répond à "est-ce que cet objet POSSÈDE cette capacité, indépendamment des autres ?". Confondre les deux pousse à forcer des hiérarchies qui semblent logiques au départ, mais qui explosent dès qu'un cas réel ne respecte pas l'hypothèse de base. La position par défaut chez un dev senior : privilégier la composition, et réserver `extends` aux relations vraiment stables et universelles.
