---
perennite: perissable
stability: periss-2028
duree_de_vie_estimee: 1-2 ans
raison: Domaine en explosion, les patterns d'aujourd'hui seront réécrits.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **Avant de lire ce module**, va voir `00_bridge_exo.md` qui relie ça aux edge cases du 28.

# POURQUOI CE MODULE EXISTE

> **Durée de vie : 2-3 ans, revenir en 2028.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

> Ce module reutilise : IA native (23_ai_native_dev), observabilite (26_observability).
Temps de lecture ~10 min

`23_ai_native_dev` t'a appris à travailler avec un copilote qui te suggère du code
une ligne à la fois. Ce module te prépare au **niveau au-dessus** : les agents
autonomes multi-étapes (Devin, Cursor Composer, Claude Code, agents maison) qui
prennent une intention (`"corrige ce bug de prod"`) et exécutent 40 actions
d'affilée : lire, écrire, tester, commit, ouvrir une PR.

En 2028, la question ne sera plus "sais-tu écrire du code ?" mais "sais-tu diriger
un agent qui écrit 50× plus vite que toi sans qu'il ne casse la prod ?".

---

## LE PROBLÈME NOUVEAU

Un copilote se corrige à chaque ligne : tu vois, tu valides, tu passes. Un agent
autonome enchaîne 40 décisions avant que tu ne relises. Si la 3e est fausse, les 37
suivantes sont fausses aussi mais **cohérentes entre elles**. Le résultat compile,
passe les tests que l'agent a lui-même écrits, ouvre une PR propre : et introduit
une régression subtile que personne ne verra avant 3 mois.

C'est le nouveau piège. Ce module l'anatomise.

---

## QUI PREND CHER SI ON IGNORE CE SUJET

Le dev qui n'apprend pas à diriger un agent va se retrouver dans deux positions
également douloureuses en 2027-2028. Soit il refuse d'utiliser les agents par
méfiance et se fait dépasser en vitesse de livraison par ceux qui savent les
borner correctement (résultat : perçu comme "lent" en revue de perf, alors que la
qualité de son code n'est pas en cause). Soit il les utilise sans discipline,
merge des PRs générées qu'il n'a jamais vraiment auditées, et finit par porter la
responsabilité d'un incident de prod dont il ne peut même pas expliquer la cause
(l'agent a pris la décision, mais c'est son nom qui est sur le commit). Le rôle
de "reviewer d'agent" devient une compétence senior mesurable, au même titre que
la revue de code humain l'est aujourd'hui.

Les équipes prennent cher aussi : sans convention interne sur ce qu'un agent a le
droit de faire (créer des fichiers ? merger seul ? toucher aux migrations DB ?),
tu te retrouves avec des codebases qui divergent en semaines. Ce module te donne
le vocabulaire pour poser ces limites, pas juste pour toi mais pour toute une
équipe.

---

## LES IDÉES REÇUES À DÉMONTER

**"Un agent qui passe les tests, c'est bon."** Faux. L'agent écrit souvent les
tests lui-même à partir de la même compréhension biaisée du besoin. Le vert des
tests dit "le code fait ce que l'agent a cru que tu voulais", pas "le code fait
ce que tu voulais". La distinction est brutale en prod.

**"L'agent va bientôt être assez bon pour qu'on ait plus à relire."** L'histoire
des 15 dernières années sur le sujet (auto-complétion, linters, TDD, copilotes
LLM) montre que chaque saut de qualité déplace le curseur de la vigilance, mais
ne le supprime jamais. La responsabilité de "est-ce que ça correspond à
l'intention" reste chez l'humain, parce que l'intention vit dans l'humain.

**"C'est juste un copilote un peu plus puissant."** Non : la différence entre
"suggérer une ligne" et "enchaîner 40 actions sans checkpoint" est
qualitative, pas quantitative. Elle change le mode d'erreur (cohérente-mais-fausse
au lieu de ponctuelle-et-visible), donc elle change la discipline de review.

**"Ces outils vont tous disparaître, autant attendre."** Les OUTILS oui, sans
doute. La CATÉGORIE (agent multi-étapes autonome sur du code) va rester et se
généraliser. Attendre = perdre 2 ans d'entraînement au bon geste.

---

## LES 3 COMPÉTENCES CIBLES

1. **Cahier des charges vérifiable machine.** Un prompt vague donne 40 actions
   vagues. Un cahier des charges avec critères d'acceptation binaires (tests qui
   passent, fichier X existe, métrique Y sous seuil Z) borne l'agent.
2. **Audit d'une trace d'agent.** Lire les 40 actions comme on lit une stack trace :
   trouver la décision qui a tout dévié.
3. **Refuser une trace.** Reconnaître qu'un agent a bien fait le job DEMANDÉ mais
   pas le job VOULU. Politesse à part, savoir revert.

---

## ERREURS CLASSIQUES DE DÉBUTANT AVEC UN AGENT

- **Prompt-and-pray.** Envoyer une intention floue ("améliore la perf") et espérer
  que l'agent devine le bon axe. Il choisira l'axe le plus facile à mesurer, pas
  forcément le bon.
- **Merger sans lire la trace.** La PR est propre, les tests passent, le titre
  est bien formulé. Sauf que l'agent a peut-être supprimé un test qui le gênait
  ou introduit une dépendance discutable. Sans relire la trace complète, tu ne
  le vois pas.
- **Laisser l'agent écrire ses propres critères de succès.** Si tu ne fixes pas
  toi-même ce qui compte comme "réussi", l'agent va converger vers un état qui
  ressemble à un succès sans en être un. C'est le problème du "spec-writing
  bias" appliqué à du code.
- **Étendre le scope au fil de la session.** "Tant qu'on y est, refactorise
  aussi ce truc à côté." Chaque extension multiplie les décisions non-auditées.
- **Confondre "l'agent a fini" et "le problème est résolu".** L'agent s'arrête
  quand il pense avoir fini, pas quand tu l'as validé. La différence peut
  contenir un bug entier.

---

## CE QUI VA CHANGER VS CE QUI VA RESTER STABLE

**Va changer (2-3 ans) :** les outils exacts, leur UI, leurs quotas, la
qualité brute du modèle sous-jacent, le format des traces, l'intégration avec
l'IDE. Ne pas investir trop de mémoire sur les commandes précises d'un outil
donné, ça va bouger.

**Va rester stable (5+ ans, voire intemporel) :** le besoin d'un cahier des
charges bornable, la discipline de relire une trace comme on relit une stack
trace, la responsabilité humaine sur ce qui est mergé, la sécurité du sandbox
dans lequel l'agent tourne (pas d'accès prod, pas de secrets réels, pas de
`rm -rf` sans confirmation humaine). Investis ta mémoire là.

---

## PLAN DU MODULE

- `01_agents_vs_copilots.md`     : différence fondamentale, quand utiliser quoi
- `02_verifiable_specifications.md` : écrire un cahier des charges bornable
- `03_reading_agent_traces.md`    : analyser une trace de 40 actions
- `04_refusing_a_trace.md`      : l'art du revert argumenté
- `05_agent_sandbox_hygiene.md`   : sécurité : ce qu'on ne laisse jamais faire
- `06_agents_grimoire.md`      : synthèse
- `07_agent_hallucination_gym.md`  : 10 traces piégées, à démonter

---

## (attention) ATTENTION PÉRENNITÉ

Les OUTILS cités périront (Devin, Cursor, Claude Code peuvent disparaître). Les
CONCEPTS survivront : bornage par tests, audit de trace, refus argumenté. Reste
sur les concepts en lisant ce module. Chaque fichier isole ce qui est intemporel
de ce qui est daté 2026-2028.

Prérequis : `23_ai_native_dev` complet, `06_testing`, `22_security`.

> Ce module réutilise : l'IA native du module 23 (`23_ai_native_dev`), les tests du module 06 (`06_testing`), la sécurité du module 22 (`22_security`).
