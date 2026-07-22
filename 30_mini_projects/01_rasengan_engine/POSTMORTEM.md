---
stability: intemporel
---

# POSTMORTEM : RASENGAN ENGINE
Temps de lecture ~6 min

---

## CE QUI A BIEN MARCHÉ

L'ordre de construction imposé par le cahier des charges (rng → cooldown → stats → factory → resolver → combat) a tenu du début à la fin. Chaque fichier testé isolément avant le suivant a évité l'effet boule de neige où un bug de fondation se découvre seulement à l'intégration finale. Le Strategy pattern sur les jutsus a fait exactement ce qui était prévu : ajouter `narutoOdama` n'a touché ni `combat.js` ni `turnResolver.js`.

---

## DÉCISION DIFFICILE N°1 : QUAND ARRÊTER DE LUTTER CONTRE L'IMMUTABILITÉ

Le moment le plus tendu du projet : `turnResolver.js`. Calculer le nouvel état d'un tour en copiant correctement les objets imbriqués (`{ ...state, attacker: { ...state.attacker, chakra: x } }`) devient vite verbeux quand l'état a plusieurs niveaux de profondeur (fighter → stats → cooldowns actifs).

Deux options étaient sur la table :
1. Continuer en spread manuel partout, accepter la verbosité.
2. Introduire une bibliothèque d'immutabilité (Immer ou équivalent).

Décision : option 1. La règle du projet est zéro dépendance externe, et le but pédagogique est justement de ressentir le coût réel de l'immutabilité manuelle. Une bibliothèque aurait caché ce coût, pas résolu le problème de fond.

**Conséquence acceptée :** `turnResolver.js` est le fichier le plus long du projet en proportion de sa logique réelle, à cause du spread imbriqué. C'est un compromis voulu, pas un oubli.

---

## DÉCISION DIFFICILE N°2 : LA SEED DU RNG, INJECTÉE OU GLOBALE

Le cahier des charges exige un mode déterministe pour les tests. Deux approches possibles : un singleton global avec un mode "switch" (`rng.setMode('test', [...])`), ou une instance de RNG injectée explicitement à chaque fonction qui en a besoin (dependency injection complète).

Décision : singleton avec mode switch, pas d'injection complète. Pour un projet de cette taille, l'injection complète aurait ajouté un paramètre `rng` à quasiment toutes les fonctions de `turnResolver.js`, `damageCalc.js`, et `combat.js`, pour un bénéfice marginal. Le singleton avec mode test reste simple et suffisant.

**Ce que ça coûte en vrai :** dans un projet plus gros avec plusieurs combats simultanés (par exemple un mode tournoi), un singleton global deviendrait un problème réel : deux combats en parallèle partageraient le même état RNG et pourraient interférer. Documenté ici pour la prochaine itération si ce projet grandit.

---

## CE QUI A SURPRIS

Le bug de référence partagée dans `fighterFactory.js` (détecté par le test "retourne un nouvel objet à chaque appel") n'était pas anticipé dans le cahier des charges. Il vient d'un piège classique : `fighterStats.js` exportait un objet de stats par ninja, et la première version de `createFighter` faisait juste `{ ...statsBase, jutsus: [...] }` en pensant que le spread suffisait à tout copier en profondeur. Mais les sous-objets (comme un objet `cooldowns: {}` imbriqué dans les stats) restaient des références partagées. Un spread n'est jamais profond : seulement le premier niveau.

**Leçon générale :** chaque fois qu'un objet a des sous-objets, vérifier explicitement par un test que muter une instance ne touche pas l'autre. Le spread donne une fausse impression de sécurité.

---

## CE QUI RESTERAIT À FAIRE DANS UNE V2

```
- Permettre plus de 2 fighters (combat en équipe)
- Un système de buffs/debuffs avec durée, pas juste des effets immédiats
- Externaliser les jutsus dans des fichiers JSON pour ajouter des ninjas sans toucher au code
```

Aucun de ces points n'était dans le scope initial, et c'est volontaire : le but du projet était la programmation fonctionnelle et les patterns, pas un moteur de jeu complet.


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
