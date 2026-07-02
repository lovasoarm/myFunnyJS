[INTEMPOREL]

# 04 : L'ART DU REVERT ARGUMENTÉ
Temps de lecture ~15 min

Un agent a rendu un travail conforme à ta spec. Le résultat marche. Et pourtant, tu
refuses. Parce que la solution est plus complexe que le problème, ou parce qu'elle
crée une dette invisible.

Refuser sans argument = tu perds la confiance de l'équipe qui a validé l'agent.
Refuser avec argument = tu deviens la référence sur la codebase.

## Template de refus

```markdown
## Revert de PR #123

**Ce qui est fait correctement** : (3 lignes, honnête)

**Ce qui pose problème** : (le vrai motif, pas "je préfère autrement")
- Complexité ajoutée disproportionnée au bénéfice ?
- Couplage nouveau non nécessaire ?
- Décision d'architecture non discutée ?
- Test qui camoufle un edge case au lieu de le gérer ?

**Alternative proposée** : (chemin concret, pas juste "à refaire")

**Coût du revert vs coût du merge** : (arbitrage explicite)
```

## Les 4 motifs de refus légitimes

1. **Surdimensionné** : l'agent a introduit une abstraction pour 1 seul usage.
2. **Sous-testé** : les tests ajoutés valident la sortie, pas les invariants.
3. **Sécurité** : gestion secret/PII discutable même si "ça marche".
4. **Dette narrative** : le code ne raconte plus l'intention métier.

## (attention) Les 2 motifs illégitimes

1. "Je l'aurais fait autrement." Ce n'est pas un argument.
2. "L'IA l'a écrit." Non plus. Un humain qui l'aurait écrit passerait, donc ça passe.

## Exercice

Prends une PR récente (à toi ou à un pair) et rédige un refus fictif en suivant
le template. Puis un accept. Compare la difficulté cognitive des deux exercices.
Refuser bien est PLUS dur qu'accepter : c'est pour ça que ça se travaille.
