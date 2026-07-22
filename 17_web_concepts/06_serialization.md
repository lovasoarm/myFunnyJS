---
stability: intemporel
---

# SÉRIALISATION : TRANSPORTER LES DONNÉES SANS LES PERDRE
Temps de lecture ~9 min

Walter White a un problème de communication.
Il doit transmettre des instructions précises à ses distributeurs sans erreur de traduction.
Un mauvais format de message : mauvaise quantité, mauvais timing, catastrophe.

Sérialisation (serialization) : convertir des données en mémoire en un format transportable (string, bytes).
Désérialisation (deserialization) : l'inverse : reconstruire les données depuis le format transporté.

Tu fais de la sérialisation à chaque `JSON.stringify()`. Tu en fais aussi à chaque `fetch()`.
La question n'est pas "est-ce que je sérialise" mais "est-ce que je sérialise correctement".

---

## 1) JSON : LE FORMAT PAR DÉFAUT DU WEB

JSON (JavaScript Object Notation) : format texte basé sur un sous-ensemble de JS.
Universel, lisible par les humains, supporté partout.

```js
// Les bases : aller-retour JSON
const data = {
 ninja: 'Naruto',
 level: 9001,
 jutsus: ['Rasengan', 'Shadow Clone'],
 stats: { chakra: 100, speed: 95 },
 active: true,
};

const json = JSON.stringify(data);
// => '{"ninja":"Naruto","level":9001,"jutsus":["Rasengan","Shadow Clone"],"stats":{"chakra":100,"speed":95},"active":true}'

const parsed = JSON.parse(json);
// => Objet JS reconstruit : identique à data
```

**Ce que JSON ne peut pas transporter :**

```js
const problematic = {
 fn: () => 'je suis une fonction',     // PERDU : les fonctions ne sérialisent pas
 undef: undefined,             // PERDU : undefined disparaît
 sym: Symbol('id'),             // PERDU : les Symbol disparaissent
 inf: Infinity,               // PERDU : devient null
 nan: NaN,                 // PERDU : devient null
 date: new Date(),             // DÉGRADÉ : devient une string ISO (pas une Date)
 map: new Map([['key', 'value']]),     // PERDU : les Map deviennent {}
 set: new Set([1, 2, 3]),          // PERDU : les Set deviennent {}
 circular: null,              // EXPLOSE : les références circulaires throwent
};

JSON.stringify(problematic);
// => '{"undef":null,"inf":null,"nan":null,"date":"2026-06-16T...","map":{},"set":{}}'
// Les clés fn et sym ont disparu silencieusement
// Circular reference aurait throwé une erreur
```

---

## 2) JSON.STRINGIFY : LES OPTIONS QUI SAUVENT

```js
// Deuxième argument : replacer (transformateur) pour personnaliser la sérialisation
const data = {
 id: 'user_42',
 password: 'motdepasse123', // ne jamais sérialiser ça en prod
 createdAt: new Date(),
 score: Infinity,
};

// Replacer fonction : contrôler ce qui est sérialisé
const safe = JSON.stringify(data, (key, value) => {
 if (key === 'password') return undefined; // exclure les données sensibles
 if (value instanceof Date) return value.toISOString(); // normaliser les dates
 if (!isFinite(value)) return null;    // remplacer Infinity et NaN
 return value;
});
// => '{"id":"user_42","createdAt":"2026-06-16T...","score":null}'

// Replacer tableau : inclure seulement certaines clés
const minimal = JSON.stringify(data, ['id', 'score']);
// => '{"id":"user_42","score":null}'

// Troisième argument : indentation pour lisibilité (debug uniquement, alourdit la taille)
const pretty = JSON.stringify({ name: 'Naruto', level: 99 }, null, 2);
// => '{\n "name": "Naruto",\n "level": 99\n}'
```

---

## 3) GÉRER LES DATES ET LES CAS SPÉCIAUX

Les dates sont le piège classique de JSON :

```js
const original = { date: new Date('2026-06-16') };
const json = JSON.stringify(original);
// => '{"date":"2026-06-16T00:00:00.000Z"}'

const parsed = JSON.parse(json);
parsed.date; // => "2026-06-16T00:00:00.000Z" (une string, PAS une Date !)
parsed.date instanceof Date; // => false

// Pour restaurer les dates : utiliser le reviver (restaurateur)
const restored = JSON.parse(json, (key, value) => {
 // Détecter les strings qui ressemblent à des dates ISO
 if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
  return new Date(value); // reconstruire l'objet Date
 }
 return value;
});
restored.date instanceof Date; // => true
```

---

## 4) MESSAGEPAK ET PROTOBUF : QUAND JSON NE SUFFIT PLUS

JSON a deux inconvénients : taille et vitesse de parsing.
Pour les systèmes à fort volume (microservices, temps réel, IoT), des formats binaires (binary) s'imposent.

**Comparaison :**

```
Format    Lisible  Taille  Speed parse  Typage strict
----------  -------  -------  -----------  -------------
JSON     Oui    Grande  Moyen     Non
MessagePack  Non    x0.6   Rapide    Non
Protobuf   Non    x0.3   Très rapide  Oui (schema)
```

**MessagePack :** JSON binaire. Même structure, 40% plus petit, plus rapide à parser.

```js
import { encode, decode } from '@msgpack/msgpack';

const data = { ninja: 'Naruto', level: 9001, jutsus: ['Rasengan', 'Chidori'] };

const binary = encode(data);
// => Uint8Array (tableau d'octets) : beaucoup plus compact que JSON

const decoded = decode(binary);
// => Objet JS identique à data

// Comparaison de taille
const jsonSize = new Blob([JSON.stringify(data)]).size; // en bytes
const msgpackSize = binary.length;
console.log(`JSON: ${jsonSize}b, MessagePack: ${msgpackSize}b`);
// JSON: 65b, MessagePack: 43b (sur cet exemple)
```

**Protobuf (Protocol Buffers) :** le format de Google. Schéma défini, typage strict, le plus compact.

```js
// Protobuf nécessite un schéma défini (fichier .proto)
// Exemple conceptuel avec la lib protobufjs

// Définition du schéma (ninja.proto) :
// message Ninja {
//  required string name = 1;
//  required int32 level = 2;
//  repeated string jutsus = 3;
// }

import protobuf from 'protobufjs';

const root = await protobuf.load('ninja.proto');
const NinjaMessage = root.lookupType('Ninja');

// Encoder
const payload = { name: 'Naruto', level: 9001, jutsus: ['Rasengan'] };
const message = NinjaMessage.create(payload);
const buffer = NinjaMessage.encode(message).finish(); // Uint8Array

// Décoder
const decoded = NinjaMessage.decode(buffer);
// => { name: 'Naruto', level: 9001, jutsus: ['Rasengan'] }
```

---

## 5) SÉRIALISATION PERSONNALISÉE AVEC TOJSON

Tu peux définir comment un objet se sérialise en JSON via `toJSON()` :

```js
class Ninja {
 constructor(name, level, secretTechnique) {
  this.name = name;
  this.level = level;
  this._secretTechnique = secretTechnique; // underscore = convention "privé"
 }

 // JSON.stringify appellera automatiquement toJSON si elle existe
 toJSON() {
  return {
   name: this.name,
   level: this.level,
   // _secretTechnique n'est pas incluse : ne sort jamais dans l'API
  };
 }
}

const naruto = new Ninja('Naruto', 99, 'Six Paths Sage Mode');
JSON.stringify(naruto);
// => '{"name":"Naruto","level":99}'
// Le secret ne fuite pas
```

---

## 6) STREAM SERIALIZATION POUR LES GROS VOLUMES

Pour sérialiser / désérialiser de grandes quantités de données sans charger tout en mémoire :

```js
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

// NDJSON (Newline Delimited JSON) : un objet JSON par ligne
// Permet de processer ligne par ligne sans charger tout le fichier
async function processLargeDataset(filePath) {
 const fileStream = createReadStream(filePath);
 const rl = createInterface({ input: fileStream });

 let processedCount = 0;

 for await (const line of rl) {
  if (!line.trim()) continue; // ignorer les lignes vides

  try {
   const record = JSON.parse(line); // parser une ligne = un objet
   await processRecord(record);  // traiter sans tout garder en mémoire
   processedCount++;
  } catch {
   console.error(`Ligne ${processedCount} invalide : ${line.slice(0, 50)}...`);
  }
 }

 return processedCount;
}
```

---

## EXERCICES

**EXO 1 : Le transmetteur sécurisé de Scofield**
Tu dois sérialiser un plan d'évasion qui contient :
- des dates (creation, deadline)
- des Maps (sections -> codes d'accès)
- des champs sensibles à exclure (passCodes, guardNames)
- des valeurs Infinity (distances inconnues)

Écris un `stringify` sûr et un `parse` avec reviver qui reconstruit les dates et les Maps.

**EXO 2 : Le benchmark JSON vs MessagePack**
Génère un tableau de 10 000 objets `{ id, name, score, tags[] }`.
Mesure avec `performance.now()` :
1. Temps de sérialisation JSON
2. Taille JSON (en bytes)
3. Temps de sérialisation MessagePack
4. Taille MessagePack

Présente les résultats dans un tableau.

**EXO 3 : La classe Jutsu sérialisable**
Crée une classe `Jutsu` avec `name`, `chakraCost`, `cooldown`, `_internalId` (privé).
Implémente `toJSON()` pour exclure `_internalId`.
Crée une méthode statique `Jutsu.fromJSON(obj)` pour reconstruire depuis JSON.
Vérifie que le cycle `fromJSON(JSON.parse(JSON.stringify(jutsu)))` reconstruit un objet identique.

---

## RÉSUMÉ

JSON sérialise les primitives, objets, tableaux. Il perd les fonctions, Symbol, undefined, Map, Set, Date (dégradée en string).
`JSON.stringify(data, replacer, indent)` : le replacer contrôle ce qui sort. Utilise-le pour exclure les données sensibles.
`JSON.parse(json, reviver)` : le reviver reconstruit les types spéciaux (Date, Map) lors du parsing.
Pour les systèmes à fort volume : MessagePack (40% plus compact, même structure) ou Protobuf (schéma strict, le plus compact).
`toJSON()` sur une classe : contrôler exactement ce qui est sérialisé. La protection la plus simple contre les fuites de données.
