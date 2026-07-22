---
stability: intemporel
---

# When NOT to code
Temps de lecture ~5 min

> La meilleure ligne de code est celle qu'on n'écrit pas.

## 5 scénarios

### 1. La spec est floue
Tu vas coder la mauvaise chose. **Retour au jutsu**. Une bonne question > 100 lignes.

### 2. Le besoin existe déjà (mieux fait)
Une lib mature, un outil CLI, un service managé. Écrire à la main = maintenance à vie.
**Contre-piège** : dépendance douteuse (voir `22_security/09_supply_chain_sbom.md`).

### 3. La feature est un cache-misère
Le vrai problème est UX, pas technique. Ajouter du code cache le symptôme, aggrave la dette.

### 4. Personne ne l'utilisera
Log-la comme "backlog", ne l'implémente pas. YAGNI.

### 5. La suppression est une feature
50 lignes de moins = moins de bugs, moins de tests, moins d'onboarding. **Supprimer est un livrable.**

## Exercice

Ouvre **un** de tes mini-projets. Trouve :
- 1 fonction qu'on peut **supprimer** sans que personne s'en rende compte.
- 1 dépendance qu'on peut **retirer**.
- 1 feature qu'on peut **remplacer par un lien** vers un outil existant.

Livre un `CLEANUP.md` avec ces 3 items.

---

## Quand NE PAS utiliser l'IA

Sept règles concrètes. Si l'une s'applique : ferme l'IA, réfléchis, décide toi-même.

1. **Tu ne peux pas juger la sortie.** Si tu ne saurais pas dire "c'est faux", n'accepte pas.
2. **Le contexte est sensible** (auth, tribut, RGPD, cryptographie). Le coût d'une hallucination dépasse celui de la lenteur humaine.
3. **La décision est architecturale et engage 6+ mois.** L'IA optimise le token suivant, pas ta dette à 6 mois.
4. **Tu apprends un concept pour la première fois.** Laisser l'IA écrire = ne pas apprendre.
5. **La spec est floue.** L'IA va combler par la médiane du web. Retourne au jutsu.
6. **Le code est déjà correct.** "Fais mieux" à l'IA sur du code juste = régression garantie.
7. **Tu es fatigué, pressé, sous stress.** L'IA amplifie tes mauvaises décisions autant que les bonnes.
