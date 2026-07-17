---
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Demander de l'aide efficacement est indépendant de la techno.
---

# Demander de l'aide efficacement

Temps de lecture ~8 min

> Une compétence que personne n'enseigne, que tout le monde attend. Se démerder tout seul jusqu'à un mur, puis poser une question qui obtient une réponse en 5 min plutôt qu'en 3 jours.

## LE TRIPLET AVANT LA QUESTION

Avant de solliciter quiconque (collègue, canal Slack, forum, IA), tu dois pouvoir formuler trois choses :

1. **Le contexte** : ce que tu essaies de faire, pas ce que tu bloques. "Je veux servir un fichier statique en dev sans reload manuel" et pas "npm start renvoie une erreur".
2. **L'hypothèse** : ce que tu crois qu'il se passe et pourquoi. "Je pense que Vite ne watch pas ce dossier parce qu'il n'est pas dans `src/`."
3. **La preuve** : ce que tu as testé pour confirmer ou infirmer l'hypothèse. "J'ai déplacé le fichier dans `src/` : le reload fonctionne. Donc je veux comprendre comment ajouter un dossier watché sans le déplacer."

Une question qui contient les trois obtient une réponse. Une question qui contient seulement le blocage obtient d'autres questions.

## LE CANEVAS DE MESSAGE

Pour Slack, un collègue, une PR bloquante :

```
Contexte : <une phrase, ce que tu tentes>
Ce que j'ai essayé : <2-3 puces, avec le résultat de chaque tentative>
Mon hypothèse actuelle : <une phrase, pourquoi>
Ce qui me bloque : <la question précise>
```

Ordre non négociable. Ne mets jamais la question en premier. La personne qui te lit doit pouvoir juger si le sujet vaut son temps avant de lire ta question.

## MAUVAISE vs BONNE DEMANDE

### Mauvaise (verdict : ignorée ou trollée)

> "Salut, ma promesse ne resolve pas, quelqu'un peut m'aider ?"

### Bonne (verdict : réponse en 5 min)

> Contexte : je fetch trois APIs en parallèle avec Promise.all, la 3e ne résout jamais.
> Ce que j'ai essayé : (a) log dans la 3e fonction : elle est bien appelée. (b) je l'appelle isolément : elle retourne bien. (c) j'ai remplacé Promise.all par Promise.allSettled : la 3e est bien en pending.
> Mon hypothèse : la 3e fonction ne fait pas de return sur son await, ça se voit pas dans le log parce que je log avant.
> Ce qui me bloque : je ne trouve pas le missing return après 20 min de relecture, je préfère demander qu'y passer une heure. Voici les 15 lignes de la fonction : [snippet]

Deux minutes à écrire, une réponse ciblée en retour.

## LA RÈGLE DES TROIS TENTATIVES

Avant de demander :

1. Cherche 5 min sur ton codebase et la doc officielle.
2. Cherche 5 min sur le web (mots-clés du message d'erreur exact).
3. Écris ton hypothèse et ta preuve avant de demander.

Si les trois échouent : demande. Ne demande pas avant. Demande sans faute après.

## ABORDER UN CODE HÉRITÉ SANS MÉPRIS

Le code que tu trouves moche a probablement été écrit par quelqu'un qui avait moins de contexte, moins de temps, ou une contrainte que tu ne vois pas. Trois postures utiles :

- **Lire l'historique git avant de juger** : `git log --pretty=format:'%h %an %s' -- <fichier>` révèle souvent une contrainte disparue.
- **Ne jamais dire "c'est de la merde"** dans un commentaire, un Slack, une revue. Dis "je ne comprends pas la raison de X, quelqu'un a le contexte ?"
- **Refactorer avec humilité** : commence petit, garde le comportement, prouve avec tests. Le code hérité qui tient depuis 5 ans encaisse des cas que ton refacto ignore.

## RECONNAÎTRE SES LIMITES

Trois signaux que tu bloques et que tu dois demander plutôt que persister :

1. Tu as passé plus de 45 min sans avancer d'un iota.
2. Tu recycles la même approche en boucle en la modifiant à la marge.
3. Tu es fatigué au point que tu relis 3 fois la même ligne sans la voir.

Reconnaître ça n'est pas faible. C'est du respect pour ton temps et celui des autres.

## OÙ CETTE FICHE S'ARTICULE

- Amont : `04_debugging/05_hypothesis_driven_debug.md` (formuler une hypothèse debug).
- Aval : `27_team_craft/03_code_review.md` (recevoir et donner des retours).
