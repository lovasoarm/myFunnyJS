---
stability: intemporel
---

# AUDITER UNE PAGE : LES OUTILS ET LA MÉTHODE
Temps de lecture ~7 min

T'as appris ARIA, le clavier, le contraste, les lecteurs d'écran. Maintenant : comment tu vérifies, sur une vraie page, que tout ça tient debout ? Un audit a11y (accessibilité) combine outils automatiques et tests manuels. Les deux sont obligatoires : un outil automatique détecte environ 30 à 40% des problèmes réels. Le reste, c'est toi qui le trouves à la main.

## 1) AXE : LE SCANNER AUTOMATIQUE

axe (de Deque Systems) est l'outil le plus utilisé en industrie. Il scanne le DOM et liste les violations WCAG détectables automatiquement.

```js
// Utilisation en test automatisé (avec jest-axe par exemple)
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('la page de profil ninja est accessible', async () => {
 const { container } = render(<ProfilNinja nom="Sasuke" />);
 const resultats = await axe(container);
 expect(resultats).toHaveNoViolations(); // (échoue le test si une violation est détectée)
});
```

```
Ce que axe DÉTECTE bien :
- contraste insuffisant
- attribut alt manquant
- label de formulaire manquant
- rôle ARIA invalide ou contradictoire

Ce que axe NE DÉTECTE PAS :
- un focus trap mal géré (logique trop complexe pour un scan statique)
- un ordre de lecture illogique pour un humain
- un texte d'erreur qui n'a aucun sens contextuel
```

## 2) LIGHTHOUSE : LE RAPPORT VISUEL RAPIDE

Lighthouse (intégré dans Chrome DevTools) génère un score sur 100 et une liste priorisée de problèmes, accessible en deux clics.

```
Chrome DevTools --> onglet Lighthouse --> catégorie Accessibility --> Generate report
```

```js
// Exemple de ce que Lighthouse signale typiquement
// "Les éléments de formulaire n'ont pas de label associé" --> liste les inputs concernés
// "Les éléments d'image n'ont pas d'attribut [alt]" --> liste les images concernées
// "Le contraste de fond et de premier plan ne respecte pas le ratio seuil" --> liste les couleurs en cause
```

Risque réel : viser "100/100 sur Lighthouse" comme objectif final. Un score parfait sur un outil automatique ne garantit PAS une expérience réellement utilisable : Lighthouse ne teste jamais au clavier, jamais avec un vrai lecteur d'écran.

## 3) LE TEST MANUEL : LA PARTIE QUE PERSONNE NE PEUT AUTOMATISER

```
Checklist manuelle minimale :
1. Débrancher la souris, naviguer toute la page au clavier (Tab, Entrée, Échap)
2. Activer un vrai lecteur d'écran, traverser les flux principaux (formulaire, navigation, modal)
3. Zoomer la page à 200% : rien ne doit casser ou se chevaucher
4. Réduire les animations (prefers-reduced-motion) : tout doit rester fonctionnel
```

```js
// Respecter la préférence "réduire les animations" de l'utilisateur
const motionReduite = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!motionReduite) {
 element.classList.add('animation-entree'); // (animation seulement si l'utilisateur ne l'a pas désactivée)
}
```

Certaines personnes ont des troubles vestibulaires : une animation de parallax ou un carrousel qui défile vite peut littéralement déclencher des vertiges ou des migraines. Ignorer `prefers-reduced-motion`, c'est ignorer un signal explicite que l'utilisateur t'envoie.

## 4) MÉTHODE COMPLÈTE D'AUDIT, ÉTAPE PAR ÉTAPE

```
1. Lancer axe ou Lighthouse --> récupérer la liste des violations automatiques
2. Corriger les violations automatiques détectées --> labels, alt, contraste, rôles
3. Tester au clavier seul   --> tab order, focus trap, skip links
4. Tester avec lecteur d'écran --> noms accessibles, annonces dynamiques (aria-live)
5. Vérifier prefers-reduced-motion et le zoom 200%
6. Documenter les résultats  --> rapport avec gravité (bloquant / à corriger / acceptable)
```

Tu reconnais cette structure : c'est le même principe de gravité que le moteur d'audit du curriculum MyFunnyJS lui-même (bloquant, à corriger, améliorable, acceptable). L'accessibilité s'audite avec la même rigueur que tu audites du code.

## 5) LE PIÈGE QUI CASSE (MAIS FUN)

```js
// Ça casse : corriger UNIQUEMENT ce que axe signale, fermer le ticket, passer à autre chose
// axe dit "0 violations" --> l'équipe pense "on est accessible, terminé"

// Réalité : un focus trap cassé, un aria-live qui spam les annonces,
// un ordre de tab illogique : RIEN de tout ça n'apparaît dans le rapport axe
```

Un audit qui s'arrête à l'outil automatique, c'est comme tester son code en lisant juste le linter sans jamais lancer les tests unitaires. Le linter (analyseur de style) attrape les fautes de syntaxe, pas les bugs de logique. Pareil ici : axe attrape les erreurs de balisage, pas les erreurs d'expérience réelle.

---

## EXERCICES

EXO 1 : Le scan complet de Fox River :
Lance Lighthouse sur une page de ton projet en cours. Liste les 3 violations les plus graves, corrige-les, relance le scan, compare le score avant/après.

EXO 2 : L'audit en 4 étapes :
Prends une page simple (formulaire de contact par exemple) et applique la checklist manuelle complète : clavier seul, lecteur d'écran, zoom 200%, prefers-reduced-motion. Note chaque échec avec son niveau de gravité.

EXO 3 : Piège axe lui-même :
Construit volontairement une modal avec un focus trap cassé (Tab qui sort de la modal). Lance axe dessus. Vérifie qu'axe ne détecte RIEN, et explique pourquoi ce type de bug échappe aux scanners automatiques.

## RÉSUMÉ

axe et Lighthouse détectent les violations de balisage automatiquement (alt manquant, contraste, labels), mais ratent les problèmes de comportement réel (focus trap, ordre de lecture, annonces incohérentes). Un audit complet combine toujours outil automatique et test manuel au clavier et au lecteur d'écran. Respecter `prefers-reduced-motion` n'est pas un détail cosmétique : ça évite des vrais malaises physiques à certains utilisateurs. Un score parfait sur un scanner ne garantit jamais une expérience réellement accessible.
