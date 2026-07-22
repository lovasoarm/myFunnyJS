---
stability: intemporel
---

# POSTMORTEM : GARO NO KRONIKA
Temps de lecture ~6 min

---

## CE QUI A BIEN MARCHÉ

L'architecture event-driven (Chevalier émet, Conseil écoute) a tenu sans aucune retouche depuis sa première version. C'est la preuve que le découplage annoncé dans l'ADR 002 fonctionne vraiment : ajouter un deuxième observateur (un test qui écoute juste pour vérifier qu'un événement a été émis, sans rien faire d'autre) n'a demandé aucune modification du Chevalier.

`Promise.allSettled` dans le dispatcher a aussi évité un piège classique dès le départ, parce que la décision avait été prise avant d'écrire le code (voir ADR 003), pas découverte après un bug en prod.

---

## BUG ASYNC RENCONTRÉ : LE TIMEOUT CODÉ EN DUR

Le bug le plus instructif du projet. Première version de `armor.js` :

```js
// Version rejetée
async function equipArmor(knight) {
 await delay(knight.prepTime);
 setTimeout(() => {
  throw new ArmorCollapseError({ knight: knight.id }); // PROBLÈME ICI
 }, 99900);
 return { equipped: true };
}
```

Deux problèmes en un :
1. `throw` à l'intérieur d'un `setTimeout` ne fait rien d'utile. Ça lève une exception non catchable dans le contexte async appelant : elle part directement crasher le process, ou pire, disparaît silencieusement selon le contexte d'exécution. Aucun `try/catch` extérieur ne peut l'attraper.
2. Le timeout de 99,9 secondes était codé en dur. Impossible de tester sans attendre 99,9 secondes à chaque exécution de test.

**La correction :** `equipArmor` ne lance jamais de timer qui throw tout seul. Il retourne un objet contenant une fonction `timeout(ms)` qui **retourne une Promise** qui reject après `ms`. C'est cette Promise qui est ensuite combinée avec la Promise du combat via `Promise.race` dans `missionRunner.js`. Le rejet redevient une vraie rejection de Promise, attrapable par un `try/catch` async classique.

**Leçon générale :** un `setTimeout` qui throw directement est un anti-pattern. Si une opération doit pouvoir échouer après un délai, elle doit le faire via une Promise qui reject, jamais via une exception lancée dans le vide depuis un callback.

---

## DÉCISION DIFFICILE : ABSORBER OU PROPAGER L'ERREUR D'UN HORROR ÉCHAPPÉ

Quand il y a plus de Horrors que de Chevaliers disponibles, deux choix : silencieusement ignorer les Horrors non assignés (juste les omettre du rapport), ou lever explicitement un `HorrorEscapeError` pour chacun.

Décision : propager explicitement. Le cahier des charges est strict sur ce point ("zéro catch vide"), et la cohérence imposait la même rigueur côté dispatch. Conséquence directe : le rapport final du Conseil distingue clairement "missions réussies", "missions échouées avec armure perdue", et "Horrors jamais traités par manque de Chevalier". Trois catégories différentes, trois significations opérationnelles différentes. Les fusionner aurait caché une vraie info : un Horror échappé n'est pas la même urgence qu'une armure désintégrée.

---

## CE QUI A SURPRIS

`Promise.race` ne "tue" pas la Promise perdante. Si le combat continue après que le timeout a déjà rejeté la course, le combat tourne quand même jusqu'au bout en arrière-plan, consomme toujours ses ressources, et son résultat est juste ignoré par `missionRunner.js`. Ce n'est pas un bug dans ce projet (les combats sont des fonctions pures sans effet de bord durable), mais c'est une réalité de `Promise.race` à connaître absolument avant de l'utiliser dans un contexte avec de vraies ressources externes (connexions réseau, fichiers ouverts) : il faudrait alors annuler explicitement la Promise perdante avec un `AbortController`, ce qui n'était pas dans le scope de ce projet.

---

## CE QUI RESTERAIT À FAIRE DANS UNE V2

```
- Un vrai AbortController pour annuler proprement un combat dont le timeout a déjà tranché
- Un système de priorité de dispatch (le Horror le plus CRITIQUE reçoit le Chevalier le plus fort)
- Persister l'historique des missions entre deux lancements du programme
```


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
