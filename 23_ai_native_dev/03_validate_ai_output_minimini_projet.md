## CONTEXTE

Le code généré compile souvent et se trompe parfois : props inventées, hooks mal placés, `any` glissés. Il faut une check-list de relecture.

## APPLICATION

- Prends le composant généré à l'étape précédente et vérifie point par point : types réels, pas de `any`, directive client justifiée, accessibilité, nettoyage des effets.
- Corrige à la main tout ce qui échoue.
- Note les erreurs récurrentes de l'IA sur ta stack.

## Vérification

Quelle erreur l'IA a-t-elle commise que le compilateur n'aurait pas attrapée ?

##Ta check-list de relecture existe

Tu intègres du code généré sans importer ses défauts. Commit la check-list.
