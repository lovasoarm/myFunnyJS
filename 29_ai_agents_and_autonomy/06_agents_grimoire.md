---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~10 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## GRIMOIRE : AI AGENTS & AUTONOMY

## Concepts intemporels

| Terme | Définition | Code | Analogies |
|---|---|---|---|
| Agent | Entité qui enchaîne des actions sur la base d'une intention. | `while (!done) { act(plan.next()) }` | Un stagiaire à qui on confie une mission, pas une tâche / un pilote d'avion qui suit un plan de vol. |
| Trace | Suite ordonnée des décisions et actions d'un agent. | `log = [{step, decision, action, result}, ...]` | Boîte noire d'avion / journal de bord d'un capitaine. |
| Cahier des charges vérifiable machine | Spécification dont le succès se prouve par un commande à code de sortie 0/1. | `test.sh && echo OK \| \ / exit 1` / Contrat notarié avec clause d'exécution automatique / recette d'un plat testable au goût. |
| Décision-racine | Première décision d'une trace où tu aurais tranché différemment. Cause probable des dérives ultérieures. | `firstDivergence(trace, groundTruth)` | Premier faux-pas d'un randonneur perdu / première note fausse d'une partition. |
| Capability (vs confiance) | Ce que l'agent PEUT faire techniquement, pas ce qu'on lui demande de faire. | `sandbox.allow = ['read']` | Ce qu'une clé peut ouvrir vs ce qu'on autorise à ouvrir avec / permis de conduire vs choix de sortir la voiture. |
| Refus argumenté | Rejet d'un travail conforme mais indésirable, avec motif explicite. | `return { status: 'refused', why: '...' }` | Médecin qui refuse une ordonnance dangereuse / avocat qui refuse un dossier. |
| B.O.R.N.É. | Cadre de prompt : But, Output, Ressources, Non-buts, Épreuve. | `prompt = {but, output, res, nonbuts, epreuve}` | Cahier des charges d'appel d'offres / brief créatif publicitaire. |
| Sandbox | Zone d'exécution aux droits limités où un agent ne peut pas causer de dégât hors périmètre. | `docker run --read-only --network=none` | Parc pour enfants clôturé / bac à sable de laboratoire P4. |

## Réflexes à automatiser

| Réflexe | Pourquoi | Signal d'alerte | Contre-analogies |
|---|---|---|---|
| Rédiger B.O.R.N.É. avant de prompter | Un prompt vague = un audit d'1h. | "Fais-moi un truc qui..." sans épreuve définie. | Demander à un stagiaire de "s'occuper du client" sans brief / lâcher un genin en mission de rang S sans ordre de mission écrit. |
| Chercher la décision-racine, pas relire les diffs | La dérive vient d'un pivot ancien, pas de l'action 39. | Tu relis pour la 3e fois les 200 dernières lignes. | Le médecin qui traite les symptômes sans diagnostic / le mécano qui change des pièces au hasard sans lire le voyant. |
| Toujours sandboxer un agent | Un agent sans sandbox = un pistolet chargé qu'on laisse traîner. | `--network=host` ou `sudo` accordé "juste pour tester". | Laisser un apprenti seul avec la clé du coffre / donner les codes du labo à un inconnu "juste pour un test". |
| Refuser bien plutôt qu'accepter poliment | Un refus argumenté préserve la trace ; un OK menteur la pollue. | L'agent renvoie "done" sans avoir touché au code. | Le prestataire qui facture un travail qu'il n'a pas fait / le joueur qui célèbre un but hors-jeu non signalé. |

## Ce qui périra (2026-2028)

Les OUTILS (Devin, Cursor Composer, Claude Code, agents maison). Les CONCEPTS
resteront tant que "déléguer une intention à une machine" existera : soit tant
qu'existera le métier de dev.

## Vérification

Peux-tu, sans relire ce module :
- citer les 5 lettres de B.O.R.N.É. ?
- lister 3 des 7 interdits sandbox ?
- expliquer pourquoi la cause d'une trace ratée n'est presque jamais l'action 39 ?

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.
