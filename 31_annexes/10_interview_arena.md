---
stability: intemporel
---

# Interview Arena : 10 sujets + grilles
Temps de lecture ~5 min

> Chaque sujet = 20-45 min. Timer obligatoire. Grille de score à la fin.

## 1. Live coding async

**Prompt** : "Implémente `pMap(items, mapper, { concurrency })` sans lib."
**Grille** :
- [ ] Signature correcte
- [ ] Gère les erreurs (fail-fast ou aggregate ?)
- [ ] Backpressure
- [ ] Test qui prouve la concurrence

## 2. Défense d'architecture

**Prompt** : "Présente l'archi d'un de tes mini-projets. On va challenger."
**Grille** :
- [ ] Contraintes énoncées avant les choix
- [ ] Trade-offs explicites
- [ ] Cite au moins 1 chose qu'on referait autrement

## 3. "Pourquoi vous et pas une IA ?"

**Attendu** : réponse structurée. L'IA génère, tu **décides**. Cite 1 cas où l'IA t'a proposé un mauvais choix et où tu l'as vu.

## 4. Debug live

**Prompt** : bug fourni, écran partagé. Tu penses à voix haute.
**Grille** : hypothèses avant actions, reproduction avant fix, explication en fin.

## 5. Design d'API

**Prompt** : "Design l'API d'un raccourcisseur d'URL."
**Grille** : idempotence, versioning, erreurs, rate limit, sécurité.

## 6. Sécurité

**Prompt** : "Cette route login est vulnérable. Trouve **trois** attaques."

## 7. SQL / DB

**Prompt** : requête N+1 dans un ORM. Détecte, explique, corrige.

## 8. Lecture de code

**Prompt** : 200 lignes d'un langage que tu ne connais pas. Explique.

## 9. Trade-off

**Prompt** : "Consistance forte ou disponibilité ? Justifie sur un cas."

## 10. Post-mortem

**Prompt** : "Raconte-moi un incident réel. Cause racine ? Prévention ?"

## Score global

- 8/10 → prêt.
- 5-7 → cible les 3 sujets faibles.
- <5 → refais un cycle de synthèses.


---

## Comment t'entraîner à l'oral

Écrire une bonne réponse ≠ savoir la **dire** sous stress.

### Protocole 3×3

1. **Enregistre-toi** (voix seule, 3 min) répondant à une question du pool.
2. **Réécoute** sans note. Note 3 défauts (hésitations, mots de remplissage,
  phrases sans verbe).
3. **Refais-la** 3 fois, en corrigeant un défaut à la fois.

### Reformulation à voix haute

Prends un concept du curriculum (ex: "closure", "event loop", "idempotence").
Explique-le à voix haute :

- en 15 secondes (elevator pitch),
- en 2 minutes (dev pair),
- en 5 minutes (dev senior qui challenge).

Voir `27_team_craft/12_three_audiences_intro.md` et `27_team_craft/13_three_audiences_drill.md`.

### Simulation avec un pair

Idéal : 1×/semaine, 30 min. Rôles :
- toi = candidat,
- pair = interviewer qui **coupe la parole** et **pose des sous-questions**.

Sans coupures, ce n'est pas un entretien, c'est un monologue.

### (attention) Ce que l'analogie "je sais donc je saurai dire" cache

Le cerveau qui code n'est pas le cerveau qui parle. Sans entraînement
oral, ta connaissance reste **inaccessible** en entretien. C'est le
principal filtre injuste du marché : assume-le, prépare-toi.
