# hallucination_detection : démonter le code IA plausible-mais-faux

> Pierre P5 (Debugging) + résilience IA. Une IA produit du code qui **compile,
> tourne, a l'air propre, et ment**. Ici tu apprends à le prouver faux avant de
> le lancer. Règle : pour chaque exercice, écris ta réponse AVANT d'exécuter.

Le drill déterministe associé vit dans `../scripts/` (validation, méthode
hallucinée, safeParse). Ces 5 exercices, eux, entraînent l'œil humain.

Format de réponse (fichier `REPONSES.md` à côté) pour chacun :
1. la prédiction exacte de la sortie ou du comportement,
2. la phrase de l'IA qui est fausse et pourquoi elle a l'air vraie,
3. le correctif minimal.

---

## EXO 1 : la méthode qui n'existe pas

```js
// "Aplatis puis somme les niveaux des ninjas."
const total = ninjas.map(n => n.niveau).flatten().reduce((a, b) => a + b, 0);
```
L'IA jure : "`flatten()` aplatit le tableau avant la somme."
Piège : `Array.prototype.flatten` n'existe pas (c'est `flat`). `TypeError` au runtime.

## EXO 2 : la closure dans la boucle

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
```
L'IA jure : "affiche 0, 1, 2." Piège : `var` -> une seule liaison partagée,
affiche `3, 3, 3`. Correctif : `let i`.

## EXO 3 : l'égalité flottante

```js
if (0.1 + 0.2 === 0.3) console.log("exact");
```
L'IA jure : "les maths sont exactes, ça log exact." Piège : IEEE 754,
`0.1 + 0.2 === 0.30000000000000004`. Rien ne s'affiche. Correctif :
comparer `Math.abs(a - b) < Number.EPSILON`.

## EXO 4 : l'async oublié

```js
function chargerScore(id) { const r = fetch(url(id)).then(x => x.json()); return r.score; }
```
L'IA jure : "retourne le score du joueur." Piège : `r` est une Promise,
`r.score` vaut `undefined`. Correctif : `async/await` et retourner la valeur
résolue.

## EXO 5 : le tri numérique par défaut

```js
[10, 2, 1, 20].sort();
```
L'IA jure : "trie les nombres croissants -> [1, 2, 10, 20]." Piège : `.sort()`
compare en chaînes -> `[1, 10, 2, 20]`. Correctif : `.sort((a, b) => a - b)`.

---

Score : 5/5 démontés sans exécuter = tu détectes l'hallucination à l'œil.
Moins de 4 : refais le module `23_ai_native_dev` et `03_validate_ai_output.md`.
