---
stability: intemporel
---

# SIMULATION SOLO : défense orale sous pression

-> ~30 min par run, à répéter

Un apprenant qui termine MyFunnyJS sans avoir simulé une défense orale découvrira cette compétence... en vrai entretien. Ce fichier existe pour que ça n'arrive pas.

## PRINCIPE

Tu prends **une décision technique** d'un de tes mini-projets (un choix d'archi, un pattern, un trade-off ADR). Un adversaire (IA ou binôme) joue le **recruteur hostile** : il pose 3 objections structurées. Tu défends **sans t'effondrer**.

## FORMAT

1. Choisis une décision de ton portfolio (dans un `ADR/` de `30_mini_projects/`).
2. Colle le prompt ci-dessous à une IA (ou à un binôme qui joue le rôle).
3. Défends pendant 15 min chrono. Note tes hésitations.
4. Debrief 10 min : où tu as flanché, quelle objection t'a fait douter, ce que tu changerais.

## PROMPT POUR L'IA (rôle recruteur hostile)

```
Tu es CTO d'une scale-up de 200 devs. Tu recrutes un profil mid/senior.
Le candidat te présente une décision technique tirée d'un projet perso.

Ta mission :
1. Poser 3 objections DIFFICILES et RÉALISTES, une par une, en attendant sa réponse.
2. Ne JAMAIS le laisser s'en sortir avec "ça dépend" sans le pousser à préciser.
3. Utiliser au moins une fois : "OK, mais en prod avec 10M d'utilisateurs, tu tiens ?"
4. Tester si le candidat sait dire "je ne sais pas" plutôt qu'inventer.
5. À la fin, donner un verdict brutal : embauché / rappel / passe.

Décision technique du candidat : {COLLE_ICI_TON_ADR_OU_RESUME_3_LIGNES}

Commence par ta première objection. Ne pose qu'une objection à la fois.
```

## BANQUE D'OBJECTIONS TYPES (pour t'entraîner seul)

- "Pourquoi pas la solution évidente X ? Tu as sur-ingénieré."
- "En prod, ce que tu proposes coûte 3× plus cher en infra. Justifie."
- "Ton benchmark est fait sur 100 requêtes. Sur 100 000 tu tiens ?"
- "Tu as choisi Redis. Pourquoi pas Postgres avec un LISTEN/NOTIFY ?"
- "Ce pattern est cargo-culted depuis un blog. Tu peux citer une source _primaire_ ?"
- "Un dev junior lit ton code demain. Il comprend en combien de temps ?"
- "Cette décision t'engage sur 3 ans. Tu es prêt à la porter sans backup ?"

## RUBRIQUE DE SCORE

Après chaque simulation, note-toi de 1 à 3 sur :

- [ ] J'ai reconnu au moins une objection **valide** sans devenir défensif.
- [ ] J'ai dit "je ne sais pas" au moins une fois (bon signe si l'objection était vraiment dure).
- [ ] Je n'ai **jamais** inventé une source, un chiffre, un benchmark.
- [ ] J'ai proposé une **alternative** pour au moins une objection.
- [ ] Après 15 min, je pouvais résumer ma décision en 3 phrases plus fortes qu'au début.

3 sur 5 = tu es prêt pour un vrai entretien. Sous 3 : refais un run.

## FRÉQUENCE RECOMMANDÉE

- **1 run par mini-projet terminé** (18 mini-projets = 18 simulations sur la durée du cursus).
- **1 run par mois** en phase de recherche d'emploi active, sur un projet fort.
- **Enregistre-toi audio** au moins 3 fois : c'est brutal, c'est formateur.

## POURQUOI C'EST VITAL

En entretien, la question la plus dure n'est jamais "quelle est la différence entre `let` et `var`". C'est "**pourquoi as-tu fait ce choix ?**", posée 5 fois de suite avec des objections croissantes. Ton portfolio prouve que tu sais **construire**. Cette simulation prouve que tu sais **défendre**. Les deux sont indissociables.
