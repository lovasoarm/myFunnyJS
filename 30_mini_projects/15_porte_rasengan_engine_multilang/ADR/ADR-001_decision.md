---
stability: intemporel
---

# ADR-001 : choix du langage de portage

## Statut
Accepté : 2026-05

## Contexte

L'objectif du mini-projet 15 est de **prouver le transfert de compétence**
en portant le Rasengan Engine (initialement en JS) dans un second langage.
Le choix du langage cible conditionne ce que l'exercice enseigne vraiment.

Trois candidats crédibles : Go, Rust, Python.

## Décision

**Go**, principalement pour son modèle de concurrence explicite (goroutines
et channels) qui contraste fort avec l'event loop mono-thread de JS. Le
portage force à réécrire la partie asynchrone, pas seulement à traduire la
syntaxe.

## Alternatives écartées

- **Python** : plus proche syntaxiquement du JS haut-niveau, donc moins
  formateur sur les concepts de concurrence. Le portage risque de dégénérer
  en traduction ligne à ligne. Écarté pour ce jet (option ouverte pour un
  troisième portage optionnel).
- **Rust** : excellent sur l'apprentissage mémoire, mais courbe
  d'apprentissage propriétaire (borrow checker) qui domine la charge
  cognitive et masque l'objectif « transfert d'architecture ». Écarté :
  l'apprenant se battrait avec le compilateur au lieu d'exercer son
  architecture.
- **TypeScript** : trivial, n'apporte rien. Écarté.

## Conséquences

- **Positif** : apprentissage maximal sur la concurrence (goroutines vs
  event loop), binaire unique déployable, écosystème mature pour l'outillage
  (test, benchmark, profiling natifs).
- **Négatif** : écosystème de libs applicatives plus petit que Python sur
  certains besoins (parsing, ML). Non bloquant pour ce mini-projet.
- **À surveiller** : si l'apprenant a déjà pratiqué Go, autoriser Rust
  comme substitut pour maximiser la difficulté.

## Signaux de révision

Rouvrir si :
- retour d'apprenants montrant que Go est trop familier pour leur profil,
- une évolution de Node (workers threads « comme goroutines ») rend le
  contraste moins pédagogique.
