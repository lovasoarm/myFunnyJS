---
stability: intemporel
---

# Grimoire : code d'honneur des analogies

Temps de lecture ~3 min

Ce fichier factorise le garde-fou commun à tous les grimoires du curriculum.
Chaque grimoire y renvoie via un lien court, au lieu de recopier deux
paragraphes identiques dans 15 fichiers.

## Le principe

Un grimoire regroupe le vocabulaire d'un domaine avec des analogies. Une
analogie n'est pas une preuve : c'est un raccourci mnémonique qui fonctionne
en attendant que le lecteur croise le vrai mécanisme.

## Les trois règles

1. **L'analogie sert à comprendre vite ; elle ment toujours un peu.** Sa
   valeur est proportionnelle à ce qu'elle te fait retenir, pas à sa
   fidélité littérale.
2. **Dès que tu peux formuler le mécanisme réel sans l'analogie, laisse
   l'analogie derrière.** Continuer à s'appuyer dessus en entretien ou en
   revue technique te fait passer pour quelqu'un qui n'a pas dépassé la
   couche pédagogique.
3. **Si une analogie t'induit en erreur dans un cas précis, note-le.** C'est
   là que tu passes du savoir prêt-à-porter au savoir personnel.

## Utilisation dans le curriculum

Chaque grimoire du curriculum contient cette ligne canonique en tête :

> Rappel : ce grimoire simplifie via analogies. Lire d'abord
> [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/18_GRIMOIRE_CODE_HONNEUR.md).

Cette ligne suffit. Pas de recopie. Pas de reformulation par grimoire (qui
finit toujours par se lire comme du remplissage généré).

---

## OÙ LES ANALOGIES CASSENT (règle B.2)

Les analogies de ce grimoire simplifient : elles ne définissent pas. Une
closure **nest pas** un tiroir ; un event loop **nest pas** un carrousel ;
une pile **nest pas** une pile de crêpes. Chaque analogie sert à visualiser
un mécanisme ; elle cesse dès que tu veux raisonner sur la complexité, la
mémoire, la concurrence ou les cas limites. Reviens toujours à la définition
technique avant de coder, débugger ou expliquer à un pair. Une analogie
prise pour la réalité devient un obstacle épistémologique.
