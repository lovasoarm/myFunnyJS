---
stability: intemporel
---

# TRANSFORMER "ÇA MARCHE PAS" EN PROBLÈME PRÉCIS
Temps de lecture ~9 min

C'est le ticket le plus fréquent que tu vas recevoir dans ta carrière :

> *"ça marche pas"*
> *"c'est lent"*
> *"les utilisateurs se plaignent"*
> *"le truc fait pas ce qu'il devrait faire"*

Ces phrases ne sont pas des specs. Ce sont des symptômes.

Un dev junior ouvre le code et cherche le bug. Un dev senior s'arrête d'abord et transforme le symptôme en problème précis et attaquable.

---

## 1) POURQUOI LES SPECS SONT TOUJOURS FLOUES

Les gens qui écrivent les specs pensent dans leur domaine, pas dans le tien.

Rick Grimes ne pense pas en termes de structures de données. Il pense en termes de survie. Il dit "le système de rations marche pas" parce que c'est son problème à lui.

Ton boulot : traduire son problème en problème technique.

```
Ce qu'on reçoit           Ce qu'on doit produire
"ça marche pas"       -->   "fonction X retourne null pour input Y"
"c'est lent"         -->   "endpoint /api/camp prend 4s pour 200 records"
"les stats sont fausses"   -->   "goalDifference calculé avec les matchs nuls inclus"
"ça freeze parfois"     -->   "UI bloquée pendant 800ms lors de l'import CSV"
```

---

## 2) LE PROTOCOLE DE CLARIFICATION

Quand une spec est floue, tu poses cinq questions. Dans cet ordre.

**1. Qu'est-ce qui se passe actuellement ?**
Pas ce qui devrait se passer. Ce qui se passe réellement. Avec des exemples concrets.

**2. Qu'est-ce qui devrait se passer ?**
Le comportement attendu. Précis. Pas "ça devrait fonctionner correctement".

**3. Dans quelles conditions ça se produit ?**
Toujours ? Parfois ? Sur certains inputs ? Sur certains navigateurs ? À partir d'un certain volume ?

**4. C'est quoi l'impact réel ?**
Bloquant ? Contournable ? Affecte combien d'utilisateurs ? Depuis quand ?

**5. Qu'est-ce qui a changé récemment ?**
Nouveau déploiement ? Nouvelles données ? Changement de config ? Pic de trafic ?

```
Ticket reçu : "le classement du Ballon d'Or est faux"

Après le protocole :
- Actuellement  : Messi a 847 points mais apparaît 3ème
- Attendu    : Messi devrait être 1er (plus de points que les deux devant lui)
- Conditions   : seulement quand le vote dépasse 500 jurés
- Impact     : la cérémonie est dans 48h, le résultat sera publié en live
- Changé récemment : on a migré le système de vote de JSON flat à une DB il y a 3 jours
```

Maintenant c'est un problème attaquable.

---

## 3) LA TECHNIQUE DE LA REPRODUCTION MINIMALE

Un bug qu'on peut pas reproduire, on peut pas le corriger. Un bug qu'on peut reproduire sur 10 000 lignes de données, on peut rarement le comprendre.

La reproduction minimale : le plus petit exemple possible qui déclenche le problème.

```
// Bug : "le classement est faux pour Messi"

// Reproduction minimale :
const votes = [
 { joueur: "Messi",  points: 847 },
 { joueur: "Mbappé", points: 712 },
 { joueur: "Haaland", points: 698 }
]

const classement = calculerClassement(votes)
console.log(classement[0].joueur)
// attendu : "Messi"
// obtenu : "Haaland"

// Le bug est maintenant isolé dans une fonction, sur 3 inputs
// Plus besoin des 500 jurés, de la DB, ou du système de vote complet
```

La reproduction minimale te dit trois choses :
- où exactement est le bug
- qu'est-ce que la fonction fait vraiment
- comment écrire le test qui va protéger ce fix pour toujours

---

## 4) LES SPECS CONTRADICTOIRES

Parfois les specs ne sont pas juste floues. Elles sont contradictoires.

```
Spec A : "un prisonnier ne peut pas avoir deux cellules en même temps"
Spec B : "pendant un transfert, un prisonnier peut être associé à sa cellule d'origine ET sa cellule de destination"

Ces deux specs sont vraies. Et elles se contredisent.
```

Quand tu détectes une contradiction :

1. Tu ne choisis pas toi-même lequel respecter
2. Tu présentes les deux specs et leur contradiction de façon factuelle
3. Tu proposes deux implémentations possibles (une pour chaque interprétation)
4. Tu demandes une décision explicite

```
// Présentation factuelle de la contradiction :
// "Selon Spec A, un prisonnier a toujours exactement une cellule active.
// Selon Spec B, pendant un transfert, il en a deux.
//
// Option 1 : cellule unique avec un statut de transfert
//  prisonnier = { celluleActive, statut: 'normal' | 'enTransfert' }
//
// Option 2 : tableau de cellules avec des dates d'entrée/sortie
//  prisonnier = { cellules: [ { id, entrée, sortie | null } ] }
//
// Quelle option correspond au comportement attendu ?"
```

---

## 5) LES SPECS QUI CACHENT UN PROBLÈME XY

Le problème XY : quelqu'un a un problème X. Il pense que la solution est Y. Il te demande de l'aide sur Y. Mais Y est pas la bonne solution.

```
Demande reçue : "j'ai besoin d'un bouton qui rafraîchit la liste des matchs toutes les 5 secondes"

Problème réel (après questions) : "la liste des matchs n'est pas à jour en temps réel"

// La solution demandée : polling toutes les 5 secondes
// Le vrai problème  : synchronisation en temps réel
// La bonne solution  : WebSocket ou SSE

// Répondre à la demande Y sans comprendre le problème X :
// --> un bouton qui rafraîchit toutes les 5 secondes et qui surcharge l'API
// --> 5 secondes de retard sur des stats de match en direct
// --> des utilisateurs qui voient un score qui date
```

Le test : *"si j'implémente exactement ce qui est demandé, est-ce que ça résout le vrai problème ?"*
Si non : remonter au problème réel avant de toucher au clavier.

---

## 6) DOCUMENTER LA SPEC CLARIFIÉE

Une fois que le problème est précis, tu l'écris.

Format minimal :

```
CONTEXTE  : système de classement du Ballon d'Or
PROBLÈME  : Messi (847pts) apparaît 3ème au lieu de 1er
CONDITIONS : reproductible avec > 500 jurés dans la DB
CAUSE   : la requête de tri utilise ORDER BY total_pts mais total_pts
       est calculé sans les votes du jury international (ajouté lors de la migration)
FIX    : inclure jury_international_votes dans le calcul de total_pts
TEST    : 3 jurés = ordre correct, 501 jurés = ordre correct
```

Ce document : c'est ce que tu envoies avant de commencer à coder le fix.
Pas après. Avant.

---

## EXERCICES

## EXO 1 : Démêler le ticket de Rick Grimes

Rick t'envoie ce ticket :
> *"le système de rations marche plus depuis ce matin, les gardes du quart de nuit reçoivent pas leurs rations, c'est urgent, les zombies approchent"*

Applique le protocole de clarification. Écris les 5 questions que tu poses.
Invente des réponses plausibles. Produis la spec clarifiée en format `CONTEXTE / PROBLÈME / CONDITIONS / CAUSE / FIX`.

---

## EXO 2 : La spec contradictoire de Michael Scofield

Michael te donne deux specs pour son plan d'évasion :
- Spec A : *"chaque checkpoint ne peut être franchi qu'une seule fois"*
- Spec B : *"si le plan échoue, on peut recommencer depuis n'importe quel checkpoint déjà visité"*

Identifie la contradiction. Propose deux implémentations. Formule la question de décision.

---

## EXO 3 : Reproduire le bug de Walter White

Walter dit :
> *"parfois la route choisie par le système est pas la plus sûre"*

Ta mission : transformer ça en reproduction minimale.
Invente un graphe de 4 villes avec des poids de risque. Montre le bug sur ce graphe minimal.
Écris le test qui fixe ce bug pour toujours.

---

## RÉSUMÉ

Les specs floues sont la norme, pas l'exception. Ton boulot : transformer un symptôme en problème précis avant d'ouvrir l'éditeur. Le protocole de clarification en cinq questions. La reproduction minimale pour isoler le bug. Les contradictions : tu les présentes, tu proposes, tu demandes une décision. Le problème XY : tu remontes toujours au vrai problème avant de répondre à la demande.
