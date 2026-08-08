## TYPE

Micro-drill

## Niveau

🗸 Fondamental

## CONTEXTE

`const` protège le **lien**, pas le **contenu**. Ton objet `personalInfo` déclaré en `const` ne peut pas être réassigné, mais toutes ses propriétés restent modifiables. L'outil natif de JavaScript pour vraiment figer un objet, c'est `Object.freeze()` : avec une limite majeure qu'il faut voir de ses propres yeux : le gel est **superficiel** (shallow), les objets imbriqués restent mutables.

## APPLICATION

- Prouve en 3 lignes qu'une propriété d'un objet `const` peut être modifiée : réassigne `personalInfo.role`, puis affiche l'objet.
- Applique `Object.freeze(personalInfo)` dans `data/personal.js`, retente la même modification et constate qu'elle est ignorée silencieusement (ou lève une erreur en mode strict).
- Ajoute à `personalInfo` un sous-objet, par exemple `contact: { email, linkedin }` (ou les `stats` d'un projet), gèle à nouveau l'objet parent, puis modifie `personalInfo.contact.email` : la modification passe. Note ce que ça démontre : `Object.freeze` ne gèle qu'un niveau.
- Écris une petite fonction `deepFreeze(obj)` qui parcourt les valeurs et rappelle `Object.freeze` sur chaque sous-objet, applique-la, et vérifie que le champ imbriqué est enfin protégé.

## Critère de réussite

- [ ] Prouve en 3 lignes qu'une propriété d'un objet `const` peut être modifiée.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle est la différence exacte entre `const` et `Object.freeze()`, et pourquoi un objet gelé peut-il encore changer ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes données personnelles sont protégées contre les mutations directes.

Tu sais maintenant distinguer un lien constant d'une valeur immuable, et tu connais la limite du gel superficiel. Tu sais maintenant distinguer `const`, `Object.freeze()` et une stratégie d'immutabilité profonde. Le `deepFreeze()` écrit ici est pédagogique : il ne couvre ni les cycles, ni les prototypes, ni les propriétés non énumérables, et n'est donc pas une stratégie de production. Commit `data/personal.js`.
