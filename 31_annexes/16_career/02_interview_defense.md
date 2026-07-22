---
stability: intemporel
---

# INTERVIEW DEFENSE : 10 scénarios d'objection

-> ~45 min de premier passage, à rejouer autant que nécessaire

Compétence visée : défendre une décision technique à voix haute face à une objection réelle, sans s'effondrer, sans s'entêter bêtement. C'est le muscle qui sépare "ingénieur qui sait faire" de "ingénieur qu'on écoute".

Ce fichier est le **hub unique** de la défense orale. Il complète et référence :

- `31_annexes/interview/01_desaccord_cto.md` (mise en scène complète autour de `05_prison_break_api`).
- `31_annexes/interview/02_mock_interview_async.md` (défense sur le raisonnement asynchrone).
- `27_team_craft/14_argumentaire_technique.md` (structure de l'argument).
- `31_annexes/templates/POSTMORTEM.md` (renvoi : chaque décision de POSTMORTEM doit pouvoir être défendue oralement).

## RÈGLE DU JEU

Pour chaque scénario :

1. Écris ta réponse en 4-6 lignes, factuelle, chiffrée quand c'est possible.
2. Oralise à voix haute, enregistré (téléphone suffit), en < 90 secondes.
3. Ré-écoute et remplis la grille d'auto-eval (5 lignes).
4. Rejoue si tu échoues sur 2 lignes ou plus.

## GRILLE D'AUTO-EVAL (5 lignes, obligatoire à chaque scénario)

| #   | Critère                                                                              | Oui / Non |
| --- | ------------------------------------------------------------------------------------ | --------- |
| 1   | Ai-je attaqué le fond de l'objection ou juste concédé ?                              |           |
| 2   | Ai-je chiffré au moins un point (temps, coût, latence, complexité) ?                 |           |
| 3   | Ai-je posé au moins une contre-question pour clarifier le vrai besoin ?              |           |
| 4   | Ai-je nommé le trade-off explicite (ce que je sacrifie, pour quoi) ?                 |           |
| 5   | Ai-je tenu ma position OU cédé de façon argumentée, sans agressivité ni soumission ? |           |

3 "Non" sur 5 = re-joue le scénario.

## LES 10 SCÉNARIOS

### Scénario 1 : "Pourquoi pas la solution X à la place ?"

Contexte : ton mini-projet `01_rasengan_engine` utilise un pattern Strategy. Le sénior propose un simple `if/else`.
Angle : montre que tu connais les deux, chiffre le coût de chaque option pour CE périmètre.

### Scénario 2 : "Pourquoi vous plutôt qu'une IA ?"

Contexte : entretien final, le recruteur te sort la question directe.
Angle : cite 2 choses vérifiables que tu as faites et qu'une IA seule n'aurait pas faites (diagnostic sous stress, décision d'architecture assumée par ADR, refus d'une suggestion IA hallucinée avec preuve).

### Scénario 3 : "Prouve que ta race condition est bien cette hypothèse et pas autre chose."

Contexte : tu as diagnostiqué un bug asynchrone. Ton lead ne te croit pas.
Angle : rappelle `04_debugging/HYPOTHESES_EXEMPLE_REPRO_DETERMINISTE.md`. Reproduis la race de façon déterministe ; expose le protocole de falsification.

### Scénario 4 : "Ton architecture en couches est de la sur-ingénierie pour ce périmètre."

Contexte : voir aussi `31_annexes/interview/01_desaccord_cto.md` objection 4.
Angle : quel volume/vie du projet justifie ou disqualifie les couches ? Coût de la structure vs coût du désordre.

### Scénario 5 : "SQLite en prod ? Sérieusement ?"

Contexte : voir aussi `31_annexes/interview/01_desaccord_cto.md` objection 1.
Angle : périmètre, écritures concurrentes, chemin de migration. Nomme le seuil (~50 écritures/s soutenues) où tu bascules.

### Scénario 6 : "Pourquoi TypeScript ici ? C'est du bruit."

Contexte : projet de 200 lignes, l'équipe est full JS.
Angle : coût d'apprentissage vs bénéfice à la maintenance. Cite les 2 cas où TS gagne clairement (refactor massif, contrat d'API partagé) et les 2 cas où il perd (script one-shot, prototypage rapide).

### Scénario 7 : "Ta couverture de tests est à 92%. C'est du fétichisme."

Contexte : le PO trouve que tu passes trop de temps sur les tests.
Angle : distingue couverture de ligne (fétichisme) et couverture de comportement (utile). Cite `06_testing/00_why_testing.md` et mutation testing (`23_ai_native_dev/*_ai_grimoire.md` "Mutation score").

### Scénario 8 : "Pourquoi cet ADR ? Une décision se prend, elle ne se documente pas."

Contexte : ton lead trouve les ADR bureaucratiques.
Angle : coût de re-débattre une décision oubliée dans 6 mois vs 15 minutes d'écriture aujourd'hui. Cite un cas où un ADR t'a évité un revirement.

### Scénario 9 : "Ton code utilise `Object.create(null)`. C'est du folklore."

Contexte : revue de code, objection sur `28_edge_cases/07_edge_cases_grimoire.md`.
Angle : prototype pollution. Cite un scénario concret. Chiffre : combien coûte une CVE contre 4 caractères de plus dans le code ?

### Scénario 10 : "Tu as refusé cette suggestion IA. Prouve qu'elle était fausse."

Contexte : ton pair pense que tu es "anti-IA".
Angle : reprends `EXO_JEUNE_IA.md` du module concerné, montre le drill vérifiable qui a démenti la suggestion. Ne théorise pas : montre la trace.

## LIVRABLE

Un fichier `INTERVIEW_DEFENSE_JOURNAL.md` à côté de tes mini-projets (ou dans ton portfolio) qui archive :

- Les 10 scénarios joués (date, durée, verdict de la grille).
- Les 3 scénarios où tu as le plus galéré.
- Ce que tu changerais dans ta prochaine défense.

## ENCHAÎNEMENT RECOMMANDÉ

1. Fais les 10 scénarios en écrit d'abord.
2. Oralise-les sur 3 jours (3-3-4).
3. Rejoue les 3 pires 2 semaines plus tard.
4. Reviens dans 6 mois. Refais tout. Tu verras la différence.

---
