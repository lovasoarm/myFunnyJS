## TYPE

Micro-drill

## Niveau

🗸 Avancé

## CONTEXTE

Le code généré compile souvent et se trompe parfois : props inventées, hooks mal placés, `any` glissés. Il faut une check-list de relecture.

## APPLICATION

- Prends le composant généré à l'étape précédente et vérifie point par point : types réels, pas de `any`, directive client justifiée, accessibilité, nettoyage des effets.
- Corrige à la main tout ce qui échoue.
- Note les erreurs récurrentes de l'IA sur ta stack.

## Critère de réussite

- [ ] Corrige à la main tout ce qui échoue.
- [ ] Note les erreurs récurrentes de l'IA sur ta stack.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle erreur l'IA a-t-elle commise que le compilateur n'aurait pas attrapée ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta check-list de relecture existe.

Tu intègres du code généré sans importer ses défauts. Commit la check-list.
