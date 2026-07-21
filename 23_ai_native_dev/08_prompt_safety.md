---
stability: periss-2028
duree_de_vie_estimee: 1-2 ans
raison: Les surfaces de fuite via prompt évoluent avec les produits IA.
---

# Prompt safety : ce que tu ne colles jamais

Temps de lecture ~10 min

> `07_faux_positifs_ia.md` t'apprend à te méfier de l'output. Ce fichier t'apprend à te méfier de ton propre input. Les deux angles morts se complètent.

## LES 5 CATÉGORIES DE DONNÉES À NE JAMAIS COLLER

1. **Secrets** : clés API, tokens JWT, mots de passe, secrets d'infra, connexion DB, cookies de session. Un prompt "corrige-moi cette erreur AWS" avec la clé complète = leak public.
2. **PII (données personnelles identifiables)** : nom + email + téléphone + adresse d'un utilisateur réel. RGPD n'a pas d'exception "j'étais pressé".
3. **Code proprio sous NDA** : algorithme confidentiel de ton employeur, code sous licence commerciale, secret métier. Une clause NDA ne prévoit pas "sauf si c'est plus rapide avec ChatGPT".
4. **Données médicales / de santé** : dossier patient, résultat d'analyse, historique. HIPAA aux US, secret médical partout ailleurs. Interdit hors flux dédié.
5. **Données de mineurs** : identifiants, photos, contenus scolaires nominatifs. Cadre renforcé, zéro tolérance.

## LA CHECKLIST AVANT D'ENVOYER UN PROMPT

Avant `Cmd+Enter`, réponds à voix haute :

1. Si le contenu de ce prompt fuitait en clair sur Twitter demain, est-ce que je perds mon job / mon client / ma boîte / un utilisateur ?
2. Est-ce que ce prompt contient une valeur qui ressemble à une clé, un token, un hash de session ?
3. Est-ce que j'ai anonymisé les identifiants réels (nom -> "Naruto", email -> "user@example.com", ID -> "42") ?
4. Est-ce que je passe par un fournisseur qui a un accord "no training on prompt" pour mon workspace, ou par un compte public ?

Une seule réponse "je sais pas" = tu ne colles pas.

## LE PATTERN "REDACT AVANT PROMPT"

Prends l'habitude d'un helper local :

```js
function redact(s) {
  return s
    .replace(/[a-f0-9]{32,}/gi, '<HASH>')
    .replace(/(sk|pk|xoxb)-[A-Za-z0-9_-]{20,}/g, '<TOKEN>')
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '<EMAIL>')
    .replace(/\b\d{10,}\b/g, '<LONG_NUMBER>');
}
```

Passe systématiquement tout snippet d'erreur ou de log dans `redact()` avant de le coller dans un chat IA. C'est un filet, pas une garantie : ta lecture reste la première ligne.

## EXEMPLES DE FUITES HISTORIQUES DOCUMENTÉES

- Mars 2023 : Samsung interdit ChatGPT en interne après trois fuites de code propriétaire semi-conducteur en trois semaines.
- Juin 2023 : des credentials AWS collés dans un prompt public retrouvés indexés via des extensions tierces.
- 2024-2025 : des dumps réguliers de conversations "publiques" révélant clés Stripe, tokens GitHub, cookies de session.

Le pattern est toujours le même : rush, "juste cette fois", pas de review du prompt.

## LA RÈGLE FINALE

Traite chaque prompt comme un log qui pourrait finir sur pastebin. Si tu ne loguerais pas la donnée en clair dans un fichier de logs de prod, tu ne la colles pas dans un prompt.

## OÙ CET EXO S'ARTICULE

- Amont : `22_security/03_secrets_management.md` (comment gérer les secrets côté code).
- Aval : `27_team_craft/08_ai_governance.md` (comment poser la règle en équipe).
