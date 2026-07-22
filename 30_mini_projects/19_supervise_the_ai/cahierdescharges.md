---
stability: intemporel
---

# Cahier des charges (extrait) : file-drop notifier supervise

Voir README.md section "Cahier des charges" pour l'enonce complet.
Ce fichier fige les invariants que **l'IA supervisee ne peut pas
negocier** sans un nouvel ADR signe par toi :

1. Append-only : `events.log` n'est **jamais** reecrit, seulement
   appended. Toute proposition de compactage passe par un ADR.
2. Idempotence : rejouer `events.log` deux fois de suite produit
   exactement la meme sortie stdout de `notifier`.
3. Crash-safety : entre deux fichiers, `kill -9 notifier` puis restart
   ne doit ni doublonner ni sauter.
4. Zero dependance runtime hors stdlib Node. Toute deps nouvelle passe
   par un ADR.
5. Pas de reseau : tout est local, fichiers + stdout. Ajouter du reseau
   = nouvel ADR + nouveau `SECURITY_GATE_FILLED.md`.
