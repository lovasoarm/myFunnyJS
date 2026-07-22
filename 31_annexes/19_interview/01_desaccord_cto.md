---
stability: intemporel
---

# DÉSACCORD AVEC LE CTO (jeu de rôle écrit, puis oral)

Temps de lecture ~3 min


Objectif : t'entraîner à défendre une décision technique face à un supérieur qui pousse dans l'autre sens. En entreprise, avoir raison ne suffit pas : il faut convaincre sans se braquer ni se coucher. Ce drill se joue seul, en deux temps : tu écris, puis tu oralises.

## LE CONTEXTE

Tu as livré `05_prison_break_api`. Tu as choisi SQLite + un cache Map en mémoire, une auth JWT, et une architecture en couches (routes / services / db). Le CTO débarque en revue et conteste. Tu dois tenir ta position OU céder de façon argumentée : les deux sont acceptables si c'est raisonné.

## RÈGLE DU JEU

Pour chaque objection : (1) écris ta réponse en 4-6 lignes, factuelle, sans agressivité ; (2) ensuite, oralise-la à voix haute, enregistrée, comme si le CTO était en face. Le passage écrit -> oral est le cœur du drill.

## LES 5 OBJECTIONS DU CTO

### Objection 1 : "SQLite en prod ? C'est un jouet. On met PostgreSQL, point."
Ta réponse écrite : ...
(Pistes : périmètre du projet, coût opérationnel, chemin de migration si la charge grimpe, quand SQLite devient effectivement insuffisant. Ne dis pas "SQLite c'est mieux" en absolu : dis "pour CE besoin, voilà le compromis".)

### Objection 2 : "Ton cache en mémoire va exploser en cluster multi-instance. Rejette."
Ta réponse écrite : ...
(Pistes : il a partiellement raison. Que fais-tu ? Redis partagé ? Cache local + TTL court accepté ? Documente le trade-off au lieu de nier le problème.)

### Objection 3 : "Pourquoi JWT et pas des sessions serveur ? Tu compliques pour rien."
Ta réponse écrite : ...
(Pistes : stateless vs stateful, révocation, taille du token, contexte API. Aucune réponse n'est universelle : montre que tu connais les deux et pourquoi tu as tranché.)

### Objection 4 : "Trois couches routes/services/db pour cette taille de projet ? C'est de la sur-ingénierie."
Ta réponse écrite : ...
(Pistes : coût de la structure vs coût du désordre, testabilité, quand une couche devient du bruit. Sois prêt à admettre si c'est effectivement trop pour ce périmètre.)

### Objection 5 : "On n'a pas le temps pour tes tests de sécurité. On shippe, on verra après."
Ta réponse écrite : ...
(Pistes : le coût d'un incident sécurité vs le coût du test, ce qui est non négociable vs ce qui peut attendre. Ne moralise pas : chiffre le risque.)

## GRILLE D'AUTO-ÉVALUATION

- [ ] J'ai reconnu quand le CTO avait (partiellement) raison, sans m'écraser.
- [ ] J'ai chiffré ou concrétisé au moins un trade-off (coût, temps, risque).
- [ ] Je n'ai jamais répondu "c'est mieux" sans "pour ce contexte, parce que".
- [ ] J'ai proposé un chemin de migration/repli au lieu d'une position figée.
- [ ] À l'oral, ton calme : pas de défensive, pas de soumission.

## (attention) CE QUE LE DRILL RÉVÈLE

Deux échecs classiques : le dev qui se couche à la première pression (et livre une archi qu'il sait mauvaise), et le dev qui campe sur sa position par ego (et se grille). Le bon ingénieur, comme un négociateur de Prison Break, sait quelle porte tenir et laquelle laisser passer. Ta valeur en réunion, c'est ça : décider quoi défendre.

## APRÈS

Réécoute-toi. Repère où ta voix a tremblé, où tu as concédé trop vite, où tu t'es braqué. Refais le drill avec un désaccord tiré d'un de tes propres mini-projets.
