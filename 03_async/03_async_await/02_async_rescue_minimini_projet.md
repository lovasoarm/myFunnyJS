## CONTEXTE

Un `await` sans `try/catch` fait tomber la page entière. Sur un portfolio, un service tiers en panne ne doit jamais coûter la visite.

## APPLICATION

- Entoure ton fetch d'un `try/catch` et renvoie une valeur de repli explicite.
- Ajoute un `error.tsx` sur la route pour capturer ce qui échappe.
- Provoque volontairement une erreur pour vérifier les deux niveaux.

## Vérification

Quelle est la différence entre gérer l'erreur localement et laisser `error.tsx` la capturer ?

## 🎬 Ta page survit à une panne réseau

Deux filets de sécurité en place, testés à la main. Commit-les.
