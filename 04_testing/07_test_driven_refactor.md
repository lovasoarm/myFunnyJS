# TEST-DRIVEN REFACTOR : CHANGER TOUT SANS RIEN CASSER

Refactorer du code sans tests : c'est désamorcer une bombe les yeux bandés.
Tu changes quelque chose. Tu espères que rien d'autre ne casse. Tu vérifies à la main. Tu oublies la moitié des cas.

Refactorer avec des tests : les tests sont ton GPS. Tu refactorises, tu lances, tu vois immédiatement ce que tu as cassé.

---

## 1) LE PRINCIPE : LES TESTS BOUGENT PAS

Quand tu refactorises, une règle absolue : **les tests ne changent pas**.
Si les tests passent avant et après le refacto : t'as gardé le comportement externe. L'implémentation peut changer totalement.

```
Avant refacto :
  ✓ vote valide accepté
  ✓ double vote rejeté
  ✓ joueur vide rejeté
  → tu refactorises l'implémentation interne

Après refacto :
  ✓ vote valide accepté         (toujours)
  ✓ double vote rejeté          (toujours)
  ✓ joueur vide rejeté          (toujours)
  → comportement préservé
```

Si un test change pendant un refacto, deux cas : soit le test était mal écrit, soit tu as changé un comportement sans t'en rendre compte. Dans les deux cas : stop et analyse.

---

## 2) ÉCRIRE LES TESTS SUR DU CODE EXISTANT SANS TESTS

La situation classique : tu hérites d'un module spaghetti. Zéro test. Tu dois le refactoriser.

Étape 1 : comprendre le comportement existant (sans le changer)
Étape 2 : écrire les tests qui documentent ce comportement
Étape 3 : refactoriser

```js
// gestionCamp.js — version spaghetti Walking Dead
// Rick a codé ça en pleine attaque zombie

function traiterRation(inventaire, personnages) {
  let total = 0
  for (let i = 0; i < personnages.length; i++) {
    if (personnages[i].statut !== 'mort') {
      total += personnages[i].faim > 7 ? 2 : 1
    }
  }
  if (total > inventaire.rations) {
    inventaire.alerte = true
    return { ok: false, manque: total - inventaire.rations }
  }
  inventaire.rations -= total
  return { ok: true }
}
```

Avant de refactoriser : écrire les tests qui capturent le comportement actuel.

```js
// gestionCamp.test.js
describe('traiterRation', () => {
  it('distribue 1 ration par personne standard', () => {
    const inventaire = { rations: 10 }
    const personnages = [
      { statut: 'vivant', faim: 3 },
      { statut: 'vivant', faim: 5 }
    ]
    const résultat = traiterRation(inventaire, personnages)
    expect(résultat.ok).toBe(true)
    expect(inventaire.rations).toBe(8)
  })

  it('distribue 2 rations si faim > 7', () => {
    const inventaire = { rations: 10 }
    const personnages = [{ statut: 'vivant', faim: 9 }]
    traiterRation(inventaire, personnages)
    expect(inventaire.rations).toBe(8)
  })

  it('ignore les morts', () => {
    const inventaire = { rations: 10 }
    const personnages = [
      { statut: 'mort', faim: 9 },
      { statut: 'vivant', faim: 3 }
    ]
    traiterRation(inventaire, personnages)
    expect(inventaire.rations).toBe(9)
  })

  it('lève une alerte si rations insuffisantes', () => {
    const inventaire = { rations: 1 }
    const personnages = [
      { statut: 'vivant', faim: 3 },
      { statut: 'vivant', faim: 3 }
    ]
    const résultat = traiterRation(inventaire, personnages)
    expect(résultat.ok).toBe(false)
    expect(résultat.manque).toBe(1)
    expect(inventaire.alerte).toBe(true)
  })
})
```

Tous verts. Maintenant on peut refactoriser en sécurité.

---

## 3) REFACTORISER : AVEC LE FILET

```js
// gestionCamp.js — version refactorisée
// même comportement, code lisible

function calculerRationsNécessaires(personnages) {
  return personnages
    .filter(p => p.statut !== 'mort')
    .reduce((total, p) => total + (p.faim > 7 ? 2 : 1), 0)
}

function traiterRation(inventaire, personnages) {
  const rationsNécessaires = calculerRationsNécessaires(personnages)

  if (rationsNécessaires > inventaire.rations) {
    inventaire.alerte = true
    return { ok: false, manque: rationsNécessaires - inventaire.rations }
  }

  inventaire.rations -= rationsNécessaires
  return { ok: true }
}
```

On lance les tests. Tout vert. Le refacto est valide.

La logique `calculerRationsNécessaires` est maintenant extraite et testable séparément.

---

## 4) STRATÉGIE : DÉCOUPER LE REFACTO EN PETITS COMMITS

Un refacto qui dure 4 heures sans commit intermédiaire : c'est une catastrophe en attente.
Si quelque chose casse au milieu et que tu ne sais plus où tu en es, tu reparts de zéro.

```
Commit 1 : écrire les tests sur le code existant (sans changer le code)
Commit 2 : extraire calculerRationsNécessaires (tests toujours verts)
Commit 3 : renommer les variables (tests toujours verts)
Commit 4 : simplifier le if (tests toujours verts)
```

Chaque commit est un checkpoint. Si quelque chose casse entre deux commits : tu sais exactement quelle étape a introduit le problème.

---

## 5) LE REFACTO QUI DOIT CHANGER DES TESTS

Parfois le refacto change l'interface publique d'un module.
Exemple : tu renommes un paramètre, tu changes le format de retour.

Dans ce cas, les tests doivent changer aussi. Mais c'est un changement conscient, pas accidentel.

```
Comportement préservé → tests ne changent pas
Interface modifiée intentionnellement → tests se mettent à jour, mais on sait pourquoi
```

La différence : dans le premier cas, les tests sont un garde-fou.
Dans le second, les tests sont une documentation qui s'adapte.

---

# EXERCICES

## EXO 1 : le code de Rick qu'il faut pas toucher sans filet

Daryl a transmis ce module du camp Walking Dead. Il calcule un score de dangerosité pour décider qui garde la porte la nuit. Le code tourne depuis 3 mois. Personne ne sait exactement ce qu'il fait. Zéro test.

```js
function score(g) {
  return g.k > 0 ? ((g.k * 3 + (g.a || 0)) / (g.d > 0 ? g.d : 1)).toFixed(1) : '0.0'
}
```

Rick veut refactoriser ça pour que ce soit lisible. Mais si tu casses le calcul, le mauvais gardien prend la mauvaise porte, et tout le monde crève.

Ta mission : poser le filet avant de toucher quoi que ce soit.

Étape 1 : déduis tous les comportements du code et écris les tests qui les capturent.
Étape 2 : refactorise pour que la fonction soit lisible par un humain fatigué à 3h du matin.
Étape 3 : tous les tests passent — sans en avoir modifié un seul.

(Indice : `k`, `a`, `d` — cherche ce que ça peut vouloir dire dans un contexte de survie. La logique du calcul te donnera les cas de test.)

---

## EXO 2 : le module qui fait trop de choses

L'équipe de comptage du Ballon d'Or a une seule fonction qui agrège les votes, classe les joueurs, et formate le message de cérémonie. Trois responsabilités dans une seule fonction : si la cérémonie est retransmise en direct et que le format du message change au dernier moment, tu touches tout et tu casses tout.

```js
function publierRésultatsBallon(votes) {
  const totaux = {}
  for (const vote of votes) {
    totaux[vote.joueur] = (totaux[vote.joueur] || 0) + vote.points
  }
  const classement = Object.entries(totaux)
    .sort((a, b) => b[1] - a[1])
    .map(([nom, points], index) => ({ rang: index + 1, nom, points }))

  const vainqueur = classement[0]
  const message = `Le vainqueur du Ballon d'Or est ${vainqueur.nom} avec ${vainqueur.points} points`
  return { classement, message }
}
```

Ta mission : rendre chaque responsabilité modifiable sans risque.

Étape 1 : écris les tests sur la fonction existante. Tous verts avant de toucher le code.
Étape 2 : extrait `agrègeVotes` et `formateMessage` comme fonctions séparées. Les tests d'origine passent toujours.
Étape 3 : ajoute des tests unitaires ciblés sur chaque fonction extraite — prouve que tu peux changer le format du message sans toucher à l'agrégation.

---

# RÉSUMÉ

Refactoriser sans tests = espoir. Avec tests = certitude.
Avant de refactoriser du code sans tests : écrire les tests d'abord, tout vert, puis refactoriser.
Les tests ne bougent pas pendant un refacto : si un test change, c'est un changement de comportement, pas un refacto.
Petits commits : chaque étape du refacto est vérifiable et réversible.
