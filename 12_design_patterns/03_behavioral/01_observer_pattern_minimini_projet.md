## CONTEXTE

Observer = s'abonner à un événement. `IntersectionObserver` anime les rangées à l'apparition, sans écouter le scroll en continu.

## APPLICATION

- Écris un hook `useInView` basé sur `IntersectionObserver`.
- Utilise-le pour faire apparaître les rangées en fondu au défilement.
- Désabonne-toi proprement au démontage et respecte `prefers-reduced-motion`.

## Vérification

Pourquoi un observer est-il préférable à un écouteur de scroll pour cet effet ?

## 🎬 Tes rangées s'animent à l'apparition

L'effet de défilement Netflix est en place, performant et accessible. Montre-le à quelqu'un en 2 minutes.
