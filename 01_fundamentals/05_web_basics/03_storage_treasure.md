---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# STORAGE TREASURE : LE TRÉSOR DU NAVIGATEUR
Temps de lecture ~7 min

Ton navigateur peut garder des données. Même si la page est rechargée. Même si l'utilisateur ferme le site. Même s'il revient demain matin avec un café.

C'est comme un petit coffre-fort.

Deux outils principaux : **LocalStorage** et **Cookies**(le seul que le serveur peut lire.). Aujourd'hui on parle surtout de LocalStorage : parce que c'est simple et utilisé partout.

---

## 1) LE PROBLÈME DU WEB NORMAL

Un site web classique oublie tout. Tu recharges la page :

**POUF.**

Toutes les variables disparaissent.

```javascript
let score = 100;
// refresh la page → score = perdu.
```

Donc les navigateurs ont inventé **LocalStorage** : un petit disque dur intégré dans ton navigateur.

---

## 2) LOCALSTORAGE : LE COFFRE DU NAVIGATEUR

LocalStorage = stockage **permanent** dans le navigateur.

Permanent veut dire : même après refresh, même après fermeture de l'onglet, même après avoir éteint l'ordi et rallumé trois jours plus tard.

**Règle importante :** LocalStorage stocke uniquement des **strings** (texte). Même les nombres deviennent du texte. On y reviendra.

---

## 3) LES 4 OPÉRATIONS

**Sauvegarder :**

```javascript
localStorage.setItem("hero", "Blob");
// stocke : hero → "Blob"
```

**Lire :**

```javascript
let hero = localStorage.getItem("hero");
console.log(hero); // "Blob"
```

**Supprimer un élément :**

```javascript
localStorage.removeItem("hero");
```

**Tout effacer :**

```javascript
localStorage.clear(); // détruit tout le coffre : sans confirmation, sans pitié
```

---

## 4) LE PROBLÈME DES OBJETS

LocalStorage n'accepte que des strings. Donc ça ne marche pas :

```javascript
let player = { name: "Blob", hp: 100 };
localStorage.setItem("player", player);

localStorage.getItem("player"); // "[object Object]" ← inutilisable
```

---

## 5) JSON : LA SOLUTION

```javascript
JSON.stringify(); // objet → texte
JSON.parse(); // texte → objet
```

**Sauvegarder un objet :**

```javascript
let player = { name: "Blob", hp: 100 };

localStorage.setItem("player", JSON.stringify(player));
// stocke : '{"name":"Blob","hp":100}'
```

**Le récupérer :**

```javascript
let data = localStorage.getItem("player");
let playerObject = JSON.parse(data);

console.log(playerObject.name); // "Blob"
```

> C'est le pattern universel : `stringify` pour sauvegarder, `parse` pour récupérer. Tu vas l'écrire des centaines de fois.

---

## 6) COOKIES (VERSION RAPIDE)

Cookies = autre système de stockage, mais avec une différence majeure :

|          | LocalStorage            | Cookies         |
| ----------------- | ----------------------------------- | ------------------------ |
| Envoyé au serveur | non                 | **oui, automatiquement** |
| Simplicité    | simple               | plus complexe      |
| Utilisé pour   | préférences, thème, données locales | auth, sessions, tracking |

LocalStorage reste côté navigateur. Les cookies font l'aller-retour avec le serveur à chaque requête.

---

## 7) À QUOI ÇA SERT EN VRAI ?

- Sauvegarder un thème dark/light
- Garder un token de connexion
- Stocker la progression d'un jeu
- Mémoriser les préférences utilisateur
- Sauvegarder une progression de jeu

C'est un mini disque dur du navigateur. Discret, rapide, et il ne se plaint jamais.

---

## MISSIONS

## MISSION 1 : LE TRÉSOR DU JOUEUR

Crée un objet joueur :

```javascript
{ name: "Blob", gold: 500, level: 3 }
```

Sauvegarde-le dans `localStorage`, récupère-le et affiche :

```
"Player chargé : Blob niveau 3"
```

---

## MISSION 2 : LE COMPTEUR IMMORTEL

Crée un compteur qui augmente de `+1` à chaque chargement de page.

Étapes :

1. Lire la valeur dans `localStorage`
2. Convertir en nombre
3. Augmenter de 1
4. Sauvegarder

Affiche : `"Visite numéro : X"`

---

## MISSION 3 : L'INVENTAIRE MAGIQUE

Crée ce tableau :

```javascript
["épée", "potion", "bouclier"];
```

Sauvegarde-le dans `localStorage`. Recharge la page, récupère l'inventaire, affiche chaque item avec `forEach()`.

---

## MISSION 4 : LE BOUTON DE L'OUBLI

Crée un bouton HTML. Quand on clique : `localStorage.clear()`. Puis affiche :

```
"Le trésor a été détruit."
```

---

## MISSION 5 : LE DARK MODE PERSISTANT

Crée un bouton `"Toggle Dark Mode"`. Au clic :

1. Ajoute ou enlève la classe `"dark"` sur le body
2. Sauvegarde l'état dans `localStorage`

Quand la page recharge, le thème doit rester. _(Le mode dark ne disparaît pas juste parce que l'utilisateur a appuyé F5.)_

_Indice : `localStorage.getItem("theme")`_

---

## RÉSUMÉ

```
setItem  → sauvegarder
getItem  → lire
removeItem → supprimer
clear   → tout effacer
```

LocalStorage ne parle que strings. Donc :

```javascript
// Sauvegarder un objet
localStorage.setItem("key", JSON.stringify(obj));

// Le récupérer
const obj = JSON.parse(localStorage.getItem("key"));
```
Si tu maîtrises ça, tu peux construire des apps web intelligentes qui se souviennent de l'utilisateur.

---


### Tableau BONUS récap :
| | localStorage | sessionStorage | Cookie |
|---|---|---|---|
| **Durée** | Pour toujours | Jusqu'à fermeture onglet | Tu choisis |
| **Serveur peut lire ?** | nope | nope | ok |
| **Usage typique** | Préférences user | Données temporaires | Authentification |



#### SessionStorage -> La table pendant un cours :

Tes données survivent aux rechargements mais **meurent quand tu fermes l'onglet**. Contrairement à une variable qui meurt au moindre rechargement, elle tient le coup pendant toute ta session.
```js
// Écrire
sessionStorage.setItem("etape", "2");
// Lire
const etape = sessionStorage.getItem("etape");
console.log(etape); // "2"
// Supprimer
sessionStorage.removeItem("etape");
```
> Parfait pour : formulaire multi-étapes, quiz en cours, données temporaires sensibles.

#### Cookie -> Le post-it que le serveur peut lire :

Le seul des trois que **le serveur peut lire**. Tu peux lui mettre une date d'expiration. C'est lui qui gère l'authentification et tout ce qui doit traverser le réseau.

```js
// Écrire un cookie
document.cookie = "pseudo=Prometheus; max-age=604800"; // expire dans 7 jours
// Lire les cookies
console.log(document.cookie); // "pseudo=Prometheus"
// Supprimer un cookie
document.cookie = "pseudo=; max-age=0"; // max-age à 0 = suppression
```
> Parfait pour : session de connexion, langue côté serveur, tracking.
