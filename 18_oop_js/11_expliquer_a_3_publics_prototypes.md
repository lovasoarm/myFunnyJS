---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# Prototypes : expliqué à 3 publics

-> ~10 min

## À UN ENFANT

Imagine un dictionnaire des mots que tu connais. Quand ta maîtresse te demande un mot que tu ne connais pas, tu ne dis pas "je ne sais pas" tout de suite : tu vas d'abord demander à ton grand frère, puis à ton père si ton frère ne sait pas, puis au dictionnaire de la maison. En JS, chaque objet a un "grand frère" (son prototype). Quand tu demandes une propriété qu'il n'a pas, il va la chercher chez son grand frère, puis chez le grand frère de son grand frère, jusqu'à `null`. C'est la **chaîne de prototypes**.

## À UN PAIR DEV

Tout objet a un lien interne `[[Prototype]]` (exposé via `Object.getPrototypeOf`). La résolution de propriété remonte cette chaîne jusqu'à `null`. `class Foo extends Bar` sucre sur `Foo.prototype.__proto__ = Bar.prototype`. Points chauds :

- `Object.create(null)` = objet SANS prototype, utile pour éviter la pollution.
- `Object.prototype.hasOwnProperty` vs `in` : le premier ignore la chaîne, le second la traverse.
- Prototype pollution : injecter `__proto__.polluted = true` corrompt **tous** les objets. Vecteur d'attaque réel (CVE Lodash 2019).

## À UN CTO

Les prototypes sont la mécanique sous-jacente de `class` en JS : un dev qui ne comprend que le sucre `class` sans le prototype chain se plantera sur (1) les questions de sécurité (prototype pollution), (2) les perfs (méthodes définies dans le constructeur vs sur le prototype), (3) le debug de code legacy pré-ES6. Le prototype chain est **le** différenciateur JS vs Java/C# : ignorer ça, c'est ignorer la nature du langage.
