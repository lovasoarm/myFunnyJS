# POURQUOI LES TESTS — OU LA MORT EN PROD

T'as déjà pushé un fix qui cassait autre chose ?
T'as déjà dit "ça marche sur ma machine" et eu tort ?
T'as déjà refactoré un truc et paniqué parce que t'avais aucun filet ?

C'est le module qui répond à ça.
Les tests ne sont pas une option pour les devs sérieux : c'est ce qui sépare un dev qui livre de la valeur d'un dev qui livre du stress.

---

## 1) SANS TEST, TON CODE EST UNE BOÎTE NOIRE

Tu l'écris. Tu le lances à la main. Tu vois que ça marche.
Tu pousses en prod.
Trois semaines plus tard, quelqu'un touche à ce fichier. Rien n'est cassé en apparence. Mais un edge case silencieux s'est introduit. Il va exploser un vendredi soir.

C'est ça, le code sans tests : une boîte noire que seul toi tu comprends, et encore — seulement le jour où tu l'as écrit.

```js
// calculeScore.js
function calculeScore(kills, assists, deaths) {
  return (kills * 3 + assists) / deaths
}

// Ça marche.
// Sauf si deaths === 0.
// Division par zéro. NaN. Silencieux.
// Ton dashboard affiche NaN depuis 3 semaines.
// Personne n'a remarqué.
```

Un test aurait attrapé ça le jour J.

---

## 2) UN TEST, C'EST QUOI CONCRÈTEMENT

Un test c'est une fonction qui :
1. prépare un contexte (données d'entrée)
2. appelle ton code
3. vérifie que la sortie correspond à ce que t'attends

```js
// test manuel, sans framework, juste pour voir
function calculeScore(kills, assists, deaths) {
  if (deaths === 0) return 0
  return (kills * 3 + assists) / deaths
}

// test brut
const resultat = calculeScore(10, 5, 2)
const attendu = 12.5

if (resultat !== attendu) {
  console.error(`FAIL : attendu ${attendu}, reçu ${resultat}`)
} else {
  console.log('PASS : calculeScore fonctionne correctement')
}

// test edge case
const scoreZeroDeath = calculeScore(10, 5, 0)
if (scoreZeroDeath !== 0) {
  console.error(`FAIL : division par zéro mal gérée`)
} else {
  console.log('PASS : division par zéro gérée')
}
```

C'est ça un test. Pas de magie. Juste : j'appelle, je vérifie.
Les frameworks (Jest, Vitest) font exactement ça, mais avec de meilleures erreurs et plus d'outils.

---

## 3) LES QUATRE TYPES DE TESTS — LA PYRAMIDE

```
          /\
         /  \   E2E (Playwright, Cypress)
        /    \  lent, coûteux, réaliste
       /------\
      /        \  Intégration
     /          \  plusieurs modules ensemble
    /------------\
   /              \  Unit tests
  /                \  une fonction, isolée, rapide
 /------------------\
```

Règle d'or : plus c'est en bas de la pyramide, plus t'en veux.
- Unit tests : 80% de ta suite
- Intégration : 15%
- E2E : 5%

Pourquoi ? Parce que les unit tests sont instantanés. Les E2E prennent des minutes. Si tout est E2E, tu passes ta vie à attendre.

---

## 4) CE QU'UN TEST PROTÈGE VRAIMENT

Un test ne prouve pas que ton code est parfait.
Un test prouve que ton code fait ce qu'il est censé faire — aujourd'hui.

Et quand quelqu'un refactorise dans six mois : les tests lui disent si il a cassé quelque chose.
C'est ça le vrai pouvoir : pas la vérification aujourd'hui, mais la protection dans le temps.

```
Dev sans tests :
  écriture --> "ça marche" --> push --> espoir --> bug en prod

Dev avec tests :
  écriture --> test vert --> refacto --> test toujours vert --> push serein
```

---

## 5) LE COÛT DE NE PAS TESTER

Y'a un mythe tenace : "écrire des tests prend trop de temps".

En réalité :
- trouver un bug en test : 5 minutes
- trouver le même bug en prod à 23h un vendredi : 3 heures + tu dors mal

Le temps passé à écrire des tests est toujours récupéré.
Souvent dès le premier bug qu'ils t'évitent.

---

# EXERCICES

## EXO 1 : la fonction qui ment

Tu reçois cette fonction. Elle "marche". Mais elle a un bug silencieux.

```js
function nomComplet(prenom, nom) {
  return prenom + " " + nom
}
```

Écris trois tests manuels (sans framework) :
- le cas normal : `"Levi"`, `"Ackerman"` → `"Levi Ackerman"`
- le cas vide : `""`, `"Ackerman"` → que veux-tu qu'il se passe ? définis-le toi-même
- le cas null : `null`, `"Ackerman"` → ça explose ou ça gère ?

(Indice : un test c'est : appeler la fonction + comparer + logger PASS ou FAIL)

---

## EXO 2 : la pyramide de ton projet

Imagine une appli de vote pour le Ballon d'Or :
- une fonction qui valide qu'un joueur existe dans la liste
- un module qui enregistre un vote en base
- une page qui affiche le classement

Dessine la pyramide de tests pour cette appli.
Quels tests seraient unitaires ? Intégration ? E2E ?

(Pas de code à écrire : juste raisonner sur la structure)

---

# RÉSUMÉ

Un test c'est : appeller ton code + vérifier la sortie.
Sans tests, ton code est une boîte noire qui attend d'exploser en prod.
La pyramide : beaucoup de unit tests, peu d'E2E.
Le vrai gain : pas aujourd'hui — dans six mois, quand quelqu'un touche au code et que les tests lui disent immédiatement si il a cassé quelque chose.
