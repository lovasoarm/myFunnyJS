---
stability: perissable_2027
---

# TYPES ET INTERFACES : PAS LES MÊMES ARMES
Temps de lecture ~8 min

TypeScript te donne deux façons de décrire la forme d'un objet : `type` et `interface`.
La plupart des devs utilisent les deux au hasard. Mauvaise idée.
Ce ne sont pas des synonymes. Ils ont des comportements différents là où ça compte : l'extension, la fusion, et les types complexes.
Comprendre la différence, c'est ne plus jamais avoir de bug bizarre au moment où tu composes deux modules.

---

## 1) INTERFACE : LE CONTRAT QUI PEUT S'OUVRIR

Une interface décrit la forme d'un objet. Comme un accord signé entre deux modules : "cet objet aura ces propriétés, point".

```ts
interface Ninja {
 name: string;
 chakra: number;
 village: string;
}

// Le contrat est respecté : Naruto est bien un Ninja
const naruto: Ninja = {
 name: "Naruto",
 chakra: 9000,
 village: "Konoha",
};
```

Ce qui rend `interface` unique : elle peut se **fusionner**.
Si tu déclares la même interface deux fois, TypeScript les fusionne. Pas d'erreur. Les deux versions coexistent.

```ts
interface Ninja {
 name: string;
}

interface Ninja {
 jutsu: string[]; // TypeScript ajoute ça à l'interface existante, pas d'erreur
}

// Maintenant Ninja = { name: string, jutsu: string[] }
const kakashi: Ninja = {
 name: "Kakashi",
 jutsu: ["Chidori", "Sharingan Copy"],
};
```

C'est la **declaration merging**. Puissant. Et dangereux si tu ne sais pas que ça existe.

---

## 2) TYPE : L'OUTIL QUI FAIT PLUS

`type` peut décrire tout ce qu'une interface peut décrire. Mais il va plus loin.

```ts
type Ninja = {
 name: string;
 chakra: number;
};

// Exactement pareil qu'avec interface pour un objet simple
const sasuke: Ninja = {
 name: "Sasuke",
 chakra: 7500,
};
```

Mais `type` peut aussi décrire des **unions**, des **intersections**, des **primitives**, des **tuples** :

```ts
// Union : un Ninja peut être vivant ou mort
type NinjaStatus = "alive" | "dead" | "missing";

// Intersection : un Ninja ET un Médecin en même temps
type MedicalNinja = Ninja & { healingPower: number };

// Tuple : une position en 2D, dans l'ordre exact
type Position = [number, number];

// Primitive aliasée : un ID est un string mais on lui donne un nom
type NinjaId = string;
```

Une interface ne peut pas faire ça. Tu essaies `interface NinjaStatus = "alive" | "dead"` : erreur immédiate.

---

## 3) EXTENSION : DEUX SYNTAXES, MÊME RÉSULTAT... PRESQUE

Les deux peuvent s'étendre. La syntaxe diffère.

```ts
// Interface étend une interface
interface Ninja {
 name: string;
 chakra: number;
}

interface SageNinja extends Ninja {
 sageMode: boolean; // un Ninja normal + le mode Sage
}

// Type étend un type (intersection)
type Ninja = {
 name: string;
 chakra: number;
};

type SageNinja = Ninja & {
 sageMode: boolean; // même résultat, syntaxe différente
};
```

La vraie différence : `interface extends` donne une erreur si les propriétés sont incompatibles.
`type &` silencieusement produit `never` si tu intersectes des types incompatibles.

```ts
interface A {
 value: string;
}

interface B extends A {
 value: number; // ERREUR : "number" n'est pas compatible avec "string"
}

type A = { value: string };
type B = A & { value: number };
// Pas d'erreur à la déclaration.
// Mais B.value est de type "never" : string & number = impossible
// Ce type piège n'existera jamais en runtime:et TypeScript ne t'avertit pas tout de suite
```

Diagramme :

```
interface extends interface --> erreur immédiate si conflit
type & type         --> never silencieux si conflit
```

---

## 4) LA RÈGLE SIMPLE POUR CHOISIR

```
objet public d'une API / lib / module partagé  --> interface
 (la declaration merging permet à d'autres de l'étendre)

union / intersection / tuple / type complexe  --> type
 (interface ne peut pas faire ça)

objet interne à un fichier ou une fonction   --> type ou interface, peu importe
```

En pratique dans MyFunnyJS : les types des modules exportés utilisent `interface`. Tout ce qui est complexe (union de statuts, tuples, types conditionnels) utilise `type`.

---

## 5) LE PIÈGE : DECLARATION MERGING EN PROD

C'est le bug classique avec les librairies tierces. Tu étends une interface depuis ta lib, sans le vouloir.

```ts
// quelque part dans ton code (ou dans un fichier d'un collègue)
interface Window {
 myCustomThing: () => void; // tu ajoutes ça à l'interface globale Window du navigateur
}

// maintenant PARTOUT dans ton projet, window.myCustomThing existe pour TypeScript
// mais pas en runtime si tu oublies de l'implémenter
window.myCustomThing(); // TypeScript : ok. Runtime : crash
```

`type Window = ...` aurait lancé une erreur : on ne peut pas redéclarer un `type`. L'interface le permet, silencieusement.

---

## EXERCICES

## EXO 1 : le vestiaire de l'équipe
_~10 min_

Tu construis le système de gestion d'une équipe de foot.
Un joueur a un nom, un numéro, un poste, et une nationalité.
Un capitaine est un joueur avec une propriété `armband: true` et un `yearsOfExperience: number`.

- Modélise `Player` et `Captain` avec des interfaces.
- Ajoute un troisième type `Transfer` : un joueur peut être transféré ou prêté. Utilise une union `type`.
- Bonus : essaie de mettre `value: string` dans Player et `value: number` dans Captain via `extends`. Lis l'erreur. Comprends pourquoi.

## EXO 2 : le réseau de distribution de Walter
_~12 min_

Tu modélises les noeuds d'un réseau.
Un noeud a un `id: string`, un `location: string`, et un `riskLevel: "low" | "medium" | "high"`.
Certains noeuds sont des `DistributionHub` : ils ont en plus un `capacity: number` et une liste de `connectedNodes: string[]`.

- Modélise avec `interface` et `extends`.
- Ajoute un type `NetworkEdge = [string, string, number]` pour représenter une arête (noeud A, noeud B, poids de la route).
- Essaie la même chose avec une interface. Observe le résultat.

## EXO 3 : le bug silencieux
_~15 min_

```ts
type EntityA = { id: string; score: number };
type EntityB = EntityA & { score: string };

declare const e: EntityB;
e.score; // quel est le type de score ici ?
```

Réponds sans lancer le code. Vérifie ensuite dans ton éditeur.
(indice : `string & number` donne quelque chose d'impossible)

---

## RÉSUMÉ

`interface` décrit la forme d'un objet et peut se fusionner. `type` fait tout ça plus les unions, intersections, tuples, et types complexes.
Pour les APIs publiques et les objets extensibles : `interface`. Pour tout ce qui dépasse la forme d'un objet : `type`.
La declaration merging est la vraie différence runtime : elle permet d'étendre une interface depuis n'importe où dans le projet, ce qui peut créer des bugs invisibles.
Choisir au hasard entre les deux, c'est exposer ton codebase à des comportements que personne n'a décidés.
