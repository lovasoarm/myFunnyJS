---
stability: intemporel
---

# NUMBER FORMATS : 1,234.56 VS 1.234,56
Temps de lecture ~7 min

Tu affiches un prix : `1234.56`. En France, ça doit s'écrire `1 234,56`. Aux États-Unis, `1,234.56`. En Allemagne, `1.234,56`. Même nombre, trois écritures différentes, et la virgule et le point n'ont pas le même rôle d'un pays à l'autre. Si tu codes ton format en dur, tu fabriques un bug visible dès que ton app sort de son pays d'origine.

## 1) LE PIÈGE : VIRGULE ET POINT N'ONT PAS LE MÊME SENS PARTOUT

```js
// Ça casse (mais fun) : remplacer un point par une virgule "pour faire propre en français"
function formaterPrixFrancais(nombre) {
 return nombre.toString().replace('.', ','); // (1234.56 devient "1234,56" : et le séparateur de milliers ?)
}
// Résultat : "1234,56" : techniquement correct pour le décimal, mais illisible sans séparateur de milliers
// Et si le nombre est négatif, ou très grand, ce remplacement naïf part vite en vrille
```

```
Pays     Séparateur décimal  Séparateur de milliers  Exemple
France    virgule        espace          1 234,56
États-Unis  point         virgule          1,234.56
Allemagne  virgule        point           1.234,56
Japon    point         virgule          1,234.56
```

Le point et la virgule échangent littéralement leurs rôles entre la France et l'Allemagne. Un bricolage de `.replace()` ne peut JAMAIS couvrir tous les cas correctement.

## 2) INTL.NUMBERFORMAT : LE NAVIGATEUR FAIT LE TRAVAIL POUR TOI

```js
const nombre = 1234.56;

const formatteurFr = new Intl.NumberFormat('fr-FR');
console.log(formatteurFr.format(nombre)); // "1 234,56"

const formatteurUs = new Intl.NumberFormat('en-US');
console.log(formatteurUs.format(nombre)); // "1,234.56"

const formatteurDe = new Intl.NumberFormat('de-DE');
console.log(formatteurDe.format(nombre)); // "1.234,56"
```

`Intl.NumberFormat` connaît les règles de chaque locale (combinaison langue + pays) sans que tu aies à les mémoriser. Zéro lib externe nécessaire, c'est intégré au navigateur et à Node.

## 3) LES DEVISES : ENCORE UNE COUCHE DE COMPLEXITÉ

```js
// Mauvais : coller le symbole devise à la main devant le nombre
function afficherPrix(nombre) {
 return `${nombre}€`; // (et si le prix est en dollars ? et la position du symbole ?)
}
```

```js
// Correct : Intl gère aussi la position du symbole et l'espacement selon la locale
const prixEnEuros = new Intl.NumberFormat('fr-FR', {
 style: 'currency',
 currency: 'EUR',
}).format(1234.56);
console.log(prixEnEuros); // "1 234,56 €" (symbole APRÈS, avec espace)

const prixEnDollars = new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency: 'USD',
}).format(1234.56);
console.log(prixEnDollars); // "$1,234.56" (symbole AVANT, sans espace)
```

Le symbole € se place après le nombre en français, le symbole $ se place avant en anglais américain. Ce n'est pas arbitraire, c'est la convention de chaque langue. `Intl` la connaît, toi tu n'as pas besoin de la mémoriser.

## 4) POURCENTAGES ET UNITÉS : MÊME LOGIQUE

```js
const tauxVictoire = 0.847;

const formatteurPourcentage = new Intl.NumberFormat('fr-FR', { style: 'percent' });
console.log(formatteurPourcentage.format(tauxVictoire)); // "85 %" (espace avant le symbole, arrondi automatique)

const formatteurPourcentageUs = new Intl.NumberFormat('en-US', { style: 'percent' });
console.log(formatteurPourcentageUs.format(tauxVictoire)); // "85%" (pas d'espace)
```

Même détail apparemment minuscule (l'espace avant le `%`) qui change selon la locale, et qui passe inaperçu jusqu'à ce qu'un utilisateur français pointilleux te le signale.

## 5) LE CAS BALLON D'OR : CLASSER DES SCORES DE PLUSIEURS PAYS

Le CLI du Ballon d'Or agrège des votes de journalistes du monde entier. Si chaque pays envoie ses scores formatés différemment ("1.234,56" pour l'Allemagne, "1,234.56" pour les US) et que ton code les parse à l'aveugle, tu obtiens des nombres complètement faux.

```js
// Ça casse (mais fun) : parser un nombre formaté sans connaître sa locale d'origine
const scoreAllemand = "1.234,56"; // (format allemand)
console.log(parseFloat(scoreAllemand)); // 1.234 : FAUX, ça a coupé au premier point comme un décimal
```

```js
// Correct : connaître la locale source pour parser, ou normaliser AVANT le transport
// La règle la plus sûre : transporter les nombres en JSON natif (jamais en string formaté),
// et ne formater qu'à l'affichage final, jamais avant.
const score = 1234.56; // (nombre JS natif, pas de string ambiguë)
db.save({ score }); // (stocké comme nombre, pas comme texte formaté selon une locale)
```

---

## EXERCICES

EXO 1 : Le prix qui change de costume :
Affiche un même prix (par exemple 49.99) en euros pour la France et en dollars pour les US avec `Intl.NumberFormat`, style `currency`. Compare la position du symbole entre les deux résultats.

EXO 2 : Le piège du parsing à l'aveugle :
Prends la string `"1.234,56"` (format allemand) et essaie de la convertir en nombre avec `parseFloat()` directement. Note le résultat erroné, puis explique pourquoi transporter des nombres en JSON natif évite totalement ce problème.

EXO 3 : Le tableau de stats Ballon d'Or :
Affiche un taux de victoire (exemple 0.923) en pourcentage pour 3 locales différentes (fr-FR, en-US, de-DE) avec `Intl.NumberFormat` en style `percent`. Note les différences de formatage.

## RÉSUMÉ

Le point et la virgule échangent leurs rôles de séparateur décimal et de séparateur de milliers selon le pays : un `.replace()` à la main ne peut jamais couvrir tous les cas. `Intl.NumberFormat` connaît les règles de chaque locale pour les nombres, les devises et les pourcentages, sans librairie externe. La règle la plus sûre reste de toujours transporter les nombres en format natif (pas en string déjà formatée) et de ne formater qu'à l'affichage final.
