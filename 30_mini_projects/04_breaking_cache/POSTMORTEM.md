---
stability: intemporel
---

# POSTMORTEM : BREAKING CACHE
Temps de lecture ~5 min

---

## CE QUI A BIEN MARCHÉ

L'ordre de construction (heap → graphe → Dijkstra → traversées → tris → DP) a tenu. Chaque dépendance était résolue avant d'en avoir besoin. Dijkstra sans heap testé d'abord aurait été un chaos de debugging enchevêtré.

Le profilage systématique avec `performance.now()` a révélé quelque chose d'utile : sur des inputs de moins de 1000 éléments, Quick Sort et Merge Sort sont indiscernables. La différence ne se voit qu'à partir de 50k éléments. Sans mesurer, il aurait été impossible de répondre honnêtement à "quel tri choisir pour ce projet".

---

## DÉCISION DIFFICILE N°1 : PONDÉRATION DU GRAPHE PAR `cout` OU PAR `risque` ?

Le réseau de Walter a deux métriques par route : le coût de transport et le risque de la DEA. Dijkstra ne peut optimiser qu'une seule dimension à la fois.

Deux options :
1. Deux passes Dijkstra séparées, une par métrique.
2. Combiner en un score unique `score = cout + risque * facteur`.

Décision : option 2 avec un `facteur` configurable. Permet d'ajuster le rapport coût/risque selon l'urgence de la livraison sans réécrire l'algo.

**Ce que ça coûte :** le `facteur` est un paramètre implicite qui peut changer le résultat de façon non-intuitive. Documenté dans `graphData.js` avec les valeurs par défaut et leur justification.

---

## DÉCISION DIFFICILE N°2 : QUICKSORT RÉCURSIF OU ITÉRATIF ?

La version récursive de Quick Sort est lisible et directe. Sur de très grands tableaux (1M+ éléments), elle peut provoquer un stack overflow si le pivot est systématiquement mauvais.

Décision : version récursive, avec vérification de la taille du tableau avant chaque appel. Si le tableau dépasse 500k éléments, avertissement dans le benchmarker. Pour le scope de ce projet (réseau de distribution réaliste), 500k lots est déjà un cas extrême.

**Ce que ça coûte :** pas de protection totale contre le stack overflow sur des inputs pathologiques. Acceptable pour un contexte pédagogique; pas acceptable en prod sur des données inconnues.

---

## CE QUI A SURPRIS

Le test de stabilité de Merge Sort a révélé une subtilité : la condition `<=` vs `<` dans la boucle de fusion change la stabilité du résultat. Ce n'est pas intuitif parce que les deux versions produisent un tableau trié, mais l'ordre relatif des éléments égaux change. Sans le test de stabilité écrit avant l'implémentation, cette nuance aurait été invisible.

---

## CE QUI RESTERAIT À FAIRE DANS UNE V2

```
- Implémenter A* à côté de Dijkstra pour comparer les performances sur un graphe dense
- Ajouter un mode "simulation" : Walter reçoit un nouveau contrat, le système recalcule en temps réel
- Tester le knapsack avec des contraintes multiples (poids ET volume)
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
