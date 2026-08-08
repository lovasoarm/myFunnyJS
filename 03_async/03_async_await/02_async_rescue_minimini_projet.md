## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

Un `await` peut propager une erreur lorsque la promesse rejetée n'est pas capturée à une frontière appropriée. Sur un portfolio, un service tiers en panne ne doit jamais coûter la visite.

## OBJECTIF

Ta page survit à une panne réseau.

## APPLICATION

- Entoure ton fetch d'un `try/catch` et renvoie une valeur de repli explicite.
- Ajoute un `error.tsx` sur la route pour capturer ce qui échappe.
- Provoque volontairement une erreur pour vérifier les deux niveaux.

## Critère de réussite

- [ ] Entoure ton fetch d'un `try/catch` et renvoie une valeur de repli explicite.
- [ ] Ajoute un `error.tsx` sur la route pour capturer ce qui échappe.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Que devient une erreur provenant d'un `await` lorsqu'aucune couche ne la capture ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta page survit à une panne réseau.

Deux filets de sécurité en place, testés à la main. Commit-les.
