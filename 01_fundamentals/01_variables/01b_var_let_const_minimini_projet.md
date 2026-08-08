## TYPE

Micro-drill

## Niveau

🗸 Fondamental

## Prérequis

- Comprendre les closures

## CONTEXTE

`var`, `let`, `const` ne diffèrent pas par le style mais par la portée. `var` a une portée de fonction : dans une boucle, toutes les itérations partagent **une seule et même variable**. `let` a une portée de bloc : dans une boucle `for`, JavaScript fournit une liaison distincte **par itération**. Le piège se voit surtout avec du code différé, et ton portfolio en aura : splash screen temporisé, effets de survol sur les cards.

## APPLICATION

- Dans un fichier de test rapide, écris une boucle qui prépare l'animation d'apparition de tes 6 cards :

  ```js
  for (var i = 0; i < 6; i++) {
    setTimeout(function () {
      console.log("card " + i + " apparaît");
    }, i * 100);
  }
  ```

- Lance-la et lis la sortie : note ce que tu attendais et ce que tu obtiens réellement.
- Explique en une phrase pourquoi toutes les lignes affichent la même valeur : le `setTimeout` s'exécute après la fin de la boucle, et les six closures pointent vers le **même** `i` de portée fonction.
- Remplace `var` par `let`, relance, et observe la différence : avec une boucle `for` utilisant `let`, JavaScript fournit une liaison distincte pour chaque itération. Chaque callback capture donc la liaison correspondant à son tour de boucle.
- Applique la conclusion au projet : mets tes déclarations de `data/personal.js` en `const`, garde `let` uniquement pour un compteur réellement réassigné, et bannis `var` en ajoutant la règle `no-var` à ta config ESLint.

## Critère de réussite

- [ ] Lance-la et lis la sortie.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi le passage de `var` à `let` change-t-il le résultat, alors que le corps de la boucle et le `setTimeout` sont identiques ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton animation de cards s'exécute dans le bon ordre.

Tu as reproduit, compris et corrigé le piège le plus classique de `var` : celui qui casse les animations décalées et les handlers générés en boucle. Commit la règle ESLint `no-var` : elle protègera aussi le code que tu écriras à 2 h du matin.
