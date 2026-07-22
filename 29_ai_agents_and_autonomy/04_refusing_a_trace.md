---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# 04 : L'ART DU REVERT ARGUMENTÉ

Temps de lecture ~15 min

Un agent a rendu un travail conforme à ta spec. Le résultat marche. Et pourtant, tu
refuses. Parce que la solution est plus complexe que le problème, ou parce qu'elle
crée une dette invisible. Refuser un résultat qui "marche" est l'acte le plus
adulte de ta carrière ingénieure : et le plus contesté par une équipe qui
mesure la vélocité en PR mergées.

Refuser sans argument = tu perds la confiance de l'équipe qui a validé l'agent.
Refuser avec argument = tu deviens la référence sur la codebase.

## Pourquoi c'est plus dur qu'accepter

Accepter, c'est rejoindre le flux : la CI est verte, la spec est cochée,
l'agent est content, le PM est content. Refuser, c'est mettre du sable
dans la machine et devoir expliquer pourquoi le sable est utile. Trois
forces poussent contre toi :

1. **La pression du "ça marche"** : la CI verte est un argument
   émotionnellement fort, même s'il ne prouve rien sur la dette future.
2. **Le sunk cost de l'agent** : l'agent a "travaillé", jeter son travail
   fait perdre le crédit d'exécution.
3. **La solitude cognitive** : tu es seul à voir la dette invisible.
   L'équipe ne la verra que dans 6 mois, et t'aura oublié comme lanceur d'alerte.

Un refus argumenté transforme ces trois forces en trois arguments : la
CI verte reste utile ("ce qui est fait est correct"), le sunk cost devient
apprentissage ("voici ce qu'on garde"), la solitude devient leadership
("voici ce qu'on paiera si on merge").

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

**Coût du revert vs coût du merge** : (arbitrage explicite, en heures)
```

Le "Ce qui est fait correctement" n'est pas de la politesse. C'est un
signal à ton équipe : tu as lu, tu as compris, tu ne rejettes pas par
paresse. Sans cette section, ton refus est perçu comme un ego trip.

## Les 4 motifs de refus légitimes

1. **Surdimensionné** : l'agent a introduit une abstraction pour 1 seul usage.
   Test rapide : compte les call sites. 1 seul = inline. 2 = tolérable si
   utile. 3+ = OK. L'abstraction préventive est un anti-pattern classique
   d'agent : il "prépare le futur" que personne n'a demandé.
2. **Sous-testé** : les tests ajoutés valident la sortie, pas les invariants.
   Un test qui vérifie que `add(2,2) === 4` est faible. Un test qui vérifie
   que `add(a,b) === add(b,a)` pour 100 tirages est fort. L'agent penche
   vers le premier ; c'est plus court.
3. **Sécurité** : gestion secret/PII discutable même si "ça marche".
   Toute décision de sécurité mérite un ADR, jamais une décision d'agent.
   Motifs classiques : hardcoded credentials en dev, logs qui fuient
   des tokens, headers CORS trop larges, `dangerouslySetInnerHTML`
   introduit "pour du markdown".
4. **Dette narrative** : le code ne raconte plus l'intention métier.
   Ton code doit se lire comme un roman où chaque fichier a une place.
   Un agent qui "harmonise le style" en dispersant la logique métier
   dans 5 utils crée de la dette narrative que tu paieras à chaque
   nouvelle recrue.

## (attention) Les 2 motifs illégitimes

1. **"Je l'aurais fait autrement."** Ce n'est pas un argument. Si le
   résultat de l'agent est sémantiquement équivalent à ta version, la
   sienne passe. Ton goût n'est pas une gate.
2. **"L'IA l'a écrit."** Non plus. Un humain qui l'aurait écrit passerait,
   donc ça passe. Le refus par principe anti-IA est un biais qui
   discrédite tes vrais refus.

## Le coût du revert vs coût du merge

Cette ligne est celle que 95 % des refus ratent. Un revert coûte du temps
immédiat (30 min à 3 h). Un merge coûte du temps futur (probabilité × impact).

Formule honnête :

```
Coût du merge = P(bug futur) × (temps de correction + temps d'enquête + coût réputationnel)
```

Si `P = 30 %`, correction = 2h, enquête = 4h, réputation = 2h, tu comptes
`0.3 × 8 = 2.4h` de coût futur espéré. Si le revert coûte 30 min, tu
révertes. Pas par principe : par arithmétique.

## Exercice

Prends une PR récente (à toi ou à un pair) et rédige un refus fictif en suivant
le template. Puis un accept. Compare la difficulté cognitive des deux exercices.
Refuser bien est PLUS dur qu'accepter : c'est pour ça que ça se travaille.

Fais-le 5 fois sur 5 PR différentes. Sur la 5e, tu remarqueras que ta
gate a des "trous" : des motifs de refus que tu ressens mais que le
template ne capture pas. Ajoute-les au template. C'est ainsi que tu
personnalises ton propre refus argumenté.

## Le refus dans une équipe qui mesure la vélocité

Si ton équipe mesure `PR mergées / semaine`, tu vas perdre chaque refus
sur le tableau de bord. Il faut basculer les indicateurs vers :

- `PR mergées sans revert à 30 jours / semaine` (qualité, pas quantité),
- `Temps moyen d'audit d'une PR agent` (efficacité de la spec en amont),
- `Coût d'incident post-merge` (dette matérialisée).

Sans ce basculement d'indicateurs, ta pratique de refus argumenté sera
puni par l'organisation. Anticipe ce combat, il fait partie du travail.

## Exemple qui casse (JS exécutable)

Un motif de refus doit passer 3 gates : (1) un des 4 motifs légitimes est cité,
(2) une alternative concrète est proposée, (3) l'arbitrage coût revert/merge
est explicite. Ce script les vérifie mécaniquement.

```js
// refusal_gate.js
const LEGIT = ["surdimensionné", "sous-testé", "sécurité", "dette narrative"];

function screenRefusal(text) {
  const lower = text.toLowerCase();
  const motif = LEGIT.find((m) => lower.includes(m));
  const hasAlt = /alternative proposée[\s\S]{0,300}[a-z]/i.test(text);
  const hasCost =
    /coût du revert vs coût du merge/i.test(text) &&
    /(heures?|jours?|min)/i.test(text);
  return { motif, hasAlt, hasCost, verdict: motif && hasAlt && hasCost };
}

// Faux refus : "je l'aurais fait autrement" déguisé
const bad = `## Revert de PR #123
Ce qui pose problème : je préfère un autre style.
Alternative proposée : à refaire.
Coût du revert vs coût du merge : bof.`;

// Vrai refus argumenté
const good = `## Revert de PR #123
Ce qui pose problème : abstraction sous-testée, un seul call site.
Alternative proposée : inliner la fonction dans le handler, ajouter 2 tests
d'invariant sur le TTL.
Coût du revert vs coût du merge : revert = 30 min, merge = 3 jours de dette
future (personne ne saura pourquoi cette abstraction existe).`;

console.log("bad :", screenRefusal(bad)); // verdict: false
console.log("good:", screenRefusal(good)); // verdict: true
```

Si ton refus ne passe pas cette gate, il ne tient pas en réunion non plus.

## Le refus comme brique de culture

Un refus argumenté bien écrit est réutilisé. Il devient jurisprudence : la
prochaine fois qu'un agent ou un humain produit le même motif, quelqu'un
le cite. À terme, ta gate de refus devient la gate de l'équipe. C'est
comme ça qu'un ingénieur seul finit par déplacer une organisation.
