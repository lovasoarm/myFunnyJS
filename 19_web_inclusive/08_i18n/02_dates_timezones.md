---
stability: intemporel
---

# DATES ET TIMEZONES : LE CAUCHEMAR ET COMMENT LE RÉSOUDRE
Temps de lecture ~8 min

Tu stockes une date. Tu l'affiches. Ça marche sur ton écran, à Antananarivo, à 14h. Sauf que l'utilisateur à Tokyo voit une heure différente, et celui à New York encore une autre. Les fuseaux horaires (timezones) ne sont pas un détail cosmétique : c'est la source numéro un de bugs silencieux dans les apps qui touchent plusieurs pays. Walter White synchronise ses livraisons à la minute près : toi aussi, tu dois savoir exactement QUELLE heure tu manipules.

## 1) UTC : LA SEULE VÉRITÉ QUI NE BOUGE JAMAIS

UTC (Temps Universel Coordonné) c'est l'heure de référence mondiale, sans fuseau, sans changement d'heure été/hiver. La règle d'or : stocke TOUJOURS en UTC, affiche dans le fuseau local seulement à l'affichage final.

```js
// Ça casse (mais fun) : stocker l'heure locale du serveur, sans contexte
const dateCombat = new Date(); // (quelle heure exactement ? celle du serveur, où est-il ?)
db.save({ dateCombat: dateCombat.toString() }); // ("Mon Jun 16 2026 14:30:00 GMT+0300" : 3h de quoi ?)
```

```js
// Correct : stocker en UTC, format universel et non ambigu
const dateCombat = new Date();
db.save({ dateCombat: dateCombat.toISOString() }); // ("2026-06-16T11:30:00.000Z" : le Z = UTC, sans ambiguïté)
```

```
Serveur à Tana (UTC+3) génère l'heure --> convertit en UTC pour stocker --> chaque client reconvertit en SON fuseau pour afficher
```

## 2) LE PIÈGE DU CHANGEMENT D'HEURE

Certains pays appliquent l'heure d'été (passage en avance ou en retard d'une heure), d'autres non. Une date stockée naïvement "avant" le changement peut devenir fausse après.

```js
// Ça casse (mais fun) : calculer "dans 24h" en ajoutant des millisecondes brutes
function dansUneJournee(date) {
 return new Date(date.getTime() + 24 * 60 * 60 * 1000); // (faux le jour du changement d'heure !)
}
// Le jour du passage à l'heure d'été, une journée locale dure 23h, pas 24h
// Résultat : un rendez-vous "demain à la même heure" peut tomber une heure à côté
```

Le piège exact : `getTime()` renvoie des millisecondes depuis 1970, une mesure absolue qui ignore complètement les fuseaux. Ajouter "24h en millisecondes" suppose que chaque jour calendaire dure exactement 24h partout. C'est faux deux fois par an, dans les pays à heure d'été.

```js
// Correct : raisonner sur le CALENDRIER (année, mois, jour), pas sur les millisecondes brutes
function dansUneJournee(date) {
 const lendemain = new Date(date); // (copie de la date d'origine)
 lendemain.setDate(lendemain.getDate() + 1); // (avance d'UN jour calendaire, peu importe sa durée réelle en heures)
 return lendemain;
}
// setDate() raisonne en "jours du calendrier", pas en millisecondes : le moteur JS gère
// lui-même la conversion, y compris les jours de 23h ou 25h lors d'un changement d'heure
```

```
Millisecondes brutes (+86400000) --> ignore le calendrier --> faux les jours de changement d'heure
Composants de date (setDate +1)  --> respecte le calendrier --> correct même les jours de changement d'heure
```

Risque réel : coder l'arithmétique des dates en millisecondes brutes marche 363 jours sur 365, et plante exactement les jours de changement d'heure. Ces bugs sont les pires : rares, donc jamais détectés en test, et catastrophiques en prod le jour J. La règle simple à retenir : pour "+1 jour", "+1 mois", "+1 an", utilise toujours les méthodes `setDate`, `setMonth`, `setFullYear` du calendrier, jamais l'addition de millisecondes.

## 3) AFFICHER DANS LE FUSEAU DU UTILISATEUR

```js
// L'API Intl native du navigateur fait le travail sans librairie externe
const dateUTC = new Date('2026-06-16T11:30:00.000Z');

const formatteurTokyo = new Intl.DateTimeFormat('ja-JP', {
 timeZone: 'Asia/Tokyo',
 dateStyle: 'full',
 timeStyle: 'short',
});

console.log(formatteurTokyo.format(dateUTC)); // (affiche l'heure correcte pour Tokyo, calcul automatique)
```

```
Même instant UTC --> formatteur Tokyo --> "16 juin 2026, 20:30"
Même instant UTC --> formatteur Tana  --> "16 juin 2026, 14:30"
```

Une seule vérité stockée (UTC), des affichages multiples calculés à la demande. C'est le principe de single source of truth du module 17_web_concepts appliqué aux dates.

## 4) LE PIÈGE DU FUSEAU CÔTÉ CLIENT VS SERVEUR

```js
// Ça casse (mais fun) : faire confiance à l'heure locale de la machine de l'utilisateur
const heureLocale = new Date(); // (et si l'utilisateur a réglé sa machine sur le faux fuseau ?)
if (heureLocale.getHours() >= 22) {
 bloquerAccesNocturne(); // (logique de sécurité basée sur une horloge qu'on ne contrôle pas)
}
```

Pour toute logique sensible (sécurité, planification, facturation), ne fais JAMAIS confiance à l'horloge du client. Calcule côté serveur, en UTC, et compare avec le fuseau réel déclaré (pas deviné) de l'utilisateur.

```js
// Correct : le serveur calcule, en connaissant le fuseau RÉEL déclaré par l'utilisateur
function estHeureNocturne(maintenantUTC, fuseauSpectateur) {
 const heureLocaleReelle = DateTime.fromJSDate(maintenantUTC, { zone: fuseauSpectateur });
 return heureLocaleReelle.hour >= 22;
}
```

## 5) LE CAS GARO : COORDONNER DES CHEVALIERS DANS PLUSIEURS VILLES

Imagine le Conseil de Garo qui synchronise une patrouille entre Tokyo, Paris et New York. Si chaque Chevalier reçoit l'heure de combat dans SON fuseau local sans référence UTC commune, la coordination devient un carnage.

```js
// L'heure de rendez-vous, stockée en UTC, partagée entre TOUS les Chevaliers
const heureRendezVous = new Date('2026-06-16T22:00:00.000Z'); // (référence unique, peu importe où on est)

// Chaque Chevalier l'affiche dans SON fuseau local, mais c'est le MÊME instant pour tous
['Asia/Tokyo', 'Europe/Paris', 'America/New_York'].forEach(fuseau => {
 const formatteur = new Intl.DateTimeFormat('fr-FR', { timeZone: fuseau, timeStyle: 'short' });
 console.log(`${fuseau} : ${formatteur.format(heureRendezVous)}`);
});
```

---

## EXERCICES

EXO 1 : Le rendez-vous qui ne ment jamais :
Construit une fonction qui prend une date UTC et un fuseau cible, et retourne l'heure locale formatée correctement avec `Intl.DateTimeFormat`.

EXO 2 : Le piège du changement d'heure :
Trouve une date qui correspond à un changement d'heure dans un pays de ton choix (cherche "passage heure d'été" pour l'année en cours). Calcule "24h après" avec l'arithmétique naïve (+86400000 ms) puis avec une lib qui gère les fuseaux. Compare les résultats.

EXO 3 : La patrouille mondiale de Garo :
Affiche une même heure de rendez-vous UTC dans 3 fuseaux différents (Tokyo, Paris, New York) en utilisant `Intl.DateTimeFormat`, sans librairie externe.

## RÉSUMÉ

Stocke toujours les dates en UTC, jamais dans le fuseau local du serveur ou du client. N'écris jamais l'arithmétique des dates à la main (+86400000 ms pour "un jour") : le changement d'heure casse ce calcul silencieusement. Affiche dans le fuseau de l'utilisateur uniquement au moment final, avec `Intl.DateTimeFormat` ou une lib comme Luxon. Et pour toute logique sensible, ne fais jamais confiance à l'horloge locale du client.
