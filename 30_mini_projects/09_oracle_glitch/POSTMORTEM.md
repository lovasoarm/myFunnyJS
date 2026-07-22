---
stability: intemporel
---

# POSTMORTEM : ORACLE GLITCH
Temps de lecture ~7 min

> Ce document se remplit après avoir terminé le projet, pas pendant. L'honnêteté compte plus que l'image.

---

## CE QUI A COINCÉ

### Le streaming avant le schéma

Première erreur : commencer par coder `streamingClient.js` avant d'avoir défini `analysisSchema.js`. Résultat : le stream assemble des tokens en JSON, mais personne ne sait encore exactement quelle shape est attendue. Quand le schéma Zod a été posé plus tard, il a fallu retoucher le client pour que les champs correspondent. L'ordre correct est schéma → validator → stream, pas l'inverse.

**Leçon** : le contrat (schéma) passe toujours avant l'implémentation. Sans ça, tu codes pour une target qui n'existe pas encore.

---

### L'IA qui fabrique des fonctions

En faisant tourner le pipeline en conditions réelles (avec la vraie API), l'IA a retourné deux fois un `fix` qui appelait `validateNaN(x)` : une fonction qui n'existe pas dans Node.js. Le `LLMOutputValidator` ne détectait pas les noms de fonctions inexistants, il vérifiait juste la shape.

**Résolution** : ajout d'une règle dans `StrictValidator` : si le `codeFix` contient un appel de fonction non-standard (`validateNaN`, `checkIsNumber`, etc.), le fix est marqué comme "non-vérifiable" au lieu d'être retenu comme valide.

**Leçon** : valider la shape d'une sortie IA ne suffit pas. Le contenu des champs string peut aussi être faux. Le périmètre du validator est plus large qu'on ne le pense au départ.

---

### Le timeout à 3s était trop court

Sur une connexion lente ou un modèle occupé, le streaming démarrait à 2.8s, ce qui déclenchait `LLMTimeoutError` avant même le premier token. Le timeout de 3s avait été calibré pour le dev local, pas pour une connexion réelle variable.

**Résolution** : timeout séparé en deux : 5s pour le premier token (time-to-first-token), 2s entre chaque token suivant (inter-token timeout). Si l'IA démarre mais s'arrête en cours, le pipeline coupe après 2s de silence. Si elle ne démarre pas, il attend 5s avant de couper.

**Leçon** : timeout unique sur du streaming, c'est trop grossier. Il faut distinguer "ça ne démarre pas" de "ça s'est arrêté en plein milieu".

---

### Les tests d'edge cases qui ne testaient pas les bons edge cases

Les premiers tests de `edgeCases.test.js` vérifiaient surtout des cas de malformation JSON (`truncated`, `missing fields`). Les vrais edge cases JS (`NaN === NaN`, `0.1 + 0.2`, `undefined` dans un tableau) sont arrivés en deuxième passe, après une relecture du module `28_edge_cases`.

**Résolution** : réécrit en TDD strict : les pièges JS d'abord, puis les cas de malformation API. L'ordre final dans le TDD_JOURNAL reflète ça.

**Leçon** : "edge cases" veut dire deux choses distinctes ici : edge cases de l'API (réponse malformée) et edge cases JS (comportements contre-intuitifs du langage). Les deux comptent, et les JS edge cases sont les plus durs à penser sans le module en tête.

---

## CE QUI A VRAIMENT MARCHÉ

**L'architecture en couches** : `CodeAnalyzer` → `PromptBuilder` → `streamingClient` → `OutputValidator` a été testable module par module. Aucun test n'appelle l'API réelle. Le mock de `streamingClient` s'est écrit en 20 lignes et a rendu les 52 tests instantanés.

**L'héritage intentionnel** : `Validator` → `StrictValidator` → `LLMOutputValidator` était suspect au départ ("pourquoi 3 niveaux ?"). En pratique, quand il a fallu ajouter la règle "pas de fonctions inventées", elle est entrée proprement dans `StrictValidator` sans toucher `LLMOutputValidator`. La hiérarchie avait un sens réel, pas seulement pédagogique.

**Zod comme garde du corps** : chaque fois que l'IA a retourné quelque chose d'inattendu, Zod l'a attrapé avant que le reste du pipeline ne le traite. Zéro `undefined is not a function` en prod. Zod est du code défensif qui coûte 5 minutes à écrire et évite des heures de debug.

---

## CE QU'ON FERAIT DIFFÉREMMENT EN V2

```
1. Poser le schéma Zod en premier, avant n'importe quel autre fichier
2. Séparer les timeouts (first-token vs inter-token) dès le départ
3. Ajouter une couche de vérification sémantique (noms de fonctions valides)
  dans StrictValidator dès la conception, pas en correctif
4. Logger chaque sortie brute de l'IA dans un fichier séparé pour debug
  (en dev uniquement : en prod, la sortie brute ne doit pas traîner)
5. Documenter l'ADR du schéma Zod avant de commencer à coder le stream
```

---

## DÉCISIONS D'ARCHITECTURE TENUES VS ABANDONNÉES

| Décision initiale | Tenu ? | Résultat |
|---|---|---|
| streamingClient mocké dans tous les tests | OUI Tenu | 0 appel API réel, tests instantanés |
| Zod sur toute sortie IA sans exception | OUI Tenu | Aucune donnée non-validée dans le pipeline |
| Timeout unique de 3s | NON Abandonné | Remplacé par first-token/inter-token séparés |
| `LLMOutputValidator` hérite de `StrictValidator` | OUI Tenu | Ajout de règles propre sans régression |
| ADR avant chaque décision majeure | OUI Tenu | 4 ADR rédigés, pipeline lisible a posteriori |


## Protection des données

Si tu mentionnes des données réelles (users, clients, endpoints internes), anonymise-les ou remplace par des noms fictifs. Un post-mortem est destiné à circuler.


---

## PUBLICATION (obligatoire)

- Lien du dépôt public : `https://github.com/<toi>/<projet>`
- Lien du billet de blog (si rédigé) : ...
- Date de publication : ...
- Peer-review reçue de : `@pseudo`

## Comment j'ai encaissé le drift

Section obligatoire si `SPEC_DRIFT_MODE=on` (voir `SPEC_DRIFT_TRIGGERS.md`).
Une ligne par déclencheur activé (J+1, J+3, J+5) avec le coût réel payé.
---

## OWASP PASSE (obligatoire, gate securite)

> Cette section est un **gate**. Un POSTMORTEM sans elle est rejete par le
> la securite redevient un module theorique.
>
> Reference : `22_security/06_owasp_checklist.md`.

Pour chaque item OWASP Top 10, coche exactement une case :

- [ ] A01 Broken Access Control : verifie / non verifie / non applicable (justifier)
- [ ] A02 Cryptographic Failures : verifie / non verifie / non applicable (justifier)
- [ ] A03 Injection : verifie / non verifie / non applicable (justifier)
- [ ] A04 Insecure Design : verifie / non verifie / non applicable (justifier)
- [ ] A05 Security Misconfiguration : verifie / non verifie / non applicable (justifier)
- [ ] A06 Vulnerable Components : verifie / non verifie / non applicable (justifier)
- [ ] A07 Identification & Auth Failures : verifie / non verifie / non applicable (justifier)
- [ ] A08 Software & Data Integrity Failures : verifie / non verifie / non applicable (justifier)
- [ ] A09 Security Logging & Monitoring : verifie / non verifie / non applicable (justifier)
- [ ] A10 Server-Side Request Forgery : verifie / non verifie / non applicable (justifier)

> Une case "non applicable" sans justification = gate echoue.
