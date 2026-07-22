---
stability: intemporel
---

# ADR-001 : clés de traduction typées en TypeScript avec erreur de compilation sur clé manquante
Temps de lecture ~6 min

## Statut
Accepté : 2026-01

## Contexte
Trapsoul Radio doit fonctionner en 4 locales : français, anglais, japonais, malgache. Chaque string de l'interface (titre d'une piste, label d'un bouton, message d'erreur) a une traduction par locale. La question centrale : comment garantir qu'une clé de traduction manquante dans une locale est détectée avant la mise en prod, pas après qu'un auditeur japonais voit `[missing: ja.player.play]` s'afficher sur son écran ?

Le projet couvre `14_typescript`, `19_web_inclusive/i18n`, `19_web_inclusive`. Le système de traduction est la colonne vertébrale de l'interface : une clé manquante brise silencieusement l'expérience de tous les auditeurs de cette locale.

## Décision
On type les clés de traduction en TypeScript : le dictionnaire de traductions est un objet dont les clés sont un type union exhaustif, et chaque locale doit implémenter toutes les clés : faute de quoi `tsc` refuse de compiler.

```typescript
// Toutes les clés sont un type union littéral
type TranslationKey =
 | 'player.play'
 | 'player.pause'
 | 'player.next'
 | 'track.by'
 | 'error.notFound'
 | 'nav.home'
 | 'nav.discover';

// Chaque locale est un Record complet sur ce type
type Translations = Record<TranslationKey, string>;

// Si une clé est manquante dans ja.ts, TypeScript bloque la compilation
const ja: Translations = {
 'player.play': '再生',
 'player.pause': '一時停止',
 // 'player.next' manquant --> erreur TS : Property 'player.next' is missing
};
```

La fonction `t(key: TranslationKey)` ne peut recevoir qu'une clé du type union : une faute de frappe (`t('player.plya')`) échoue au compile time, pas au runtime.

## Alternatives considérées

**Bibliothèque i18next avec fichiers JSON de traduction**
- Avantages : gestion des namespaces, pluralisation avancée, lazy loading des locales, plugin ecosystem
- Limites : les clés JSON sont des strings : `i18next.t('player.plya')` ne produit aucune erreur de compilation, juste une string vide ou la clé brute au runtime ; la détection des clés manquantes nécessite un plugin supplémentaire ou un audit manuel
- Rejeté parce que : le projet enseigne l'API native `Intl` (DateTimeFormat, NumberFormat, PluralRules) sans bibliothèque externe : utiliser i18next contourne l'apprentissage central du module `19_web_inclusive/i18n` ; et le typage natif TS sur les clés de traduction est précisément ce qu'on veut démontrer

**Fichiers de traduction JSON sans typage**
- Avantages : format standard, lisible par des non-développeurs (traducteurs)
- Limites : `const ja = require('./locales/ja.json')` charge un objet non typé ; toutes les clés sont des `string` génériques ; une clé manquante ne produit aucune erreur jusqu'à ce qu'un utilisateur l'atteigne en production
- Rejeté parce que : l'objectif de ce projet est de montrer que TypeScript peut attraper les erreurs d'i18n au compile time : les fichiers JSON non typés offrent exactement la même sécurité que du JavaScript pur

## Conséquences

Gains :
- `tsc --noImplicitAny --noEmit` détecte toute clé manquante dans n'importe quelle locale avant le déploiement
- ajouter une nouvelle clé de traduction force explicitement de l'ajouter dans les 4 locales : le compilateur rejette les locales incomplètes
- la fonction `t()` est auto-complétée par l'IDE sur le type union : l'apprenant ne peut pas taper une mauvaise clé par erreur

Sacrifices :
- ajouter une nouvelle locale (ex : arabe, avec RTL) nécessite de déclarer une nouvelle `const ar: Translations` complète : un fichier JSON aurait pu être ajouté sans toucher au code TypeScript
- le type union `TranslationKey` grossit avec le projet : à 200+ clés, le maintien du type devient un travail à part entière (atténué par des outils de génération automatique en prod, hors périmètre ici)

Décisions liées :
- ADR-002 portera sur la gestion du contraste WCAG : les 4 thèmes de couleur (clair/sombre par locale) doivent passer le ratio 4.5:1 : décision sur l'outil de vérification (axe en CI vs vérification manuelle avec le colour contrast checker)
- ADR-003 portera sur la stratégie de rendu SEO pour les pages d'artistes : HTML statique généré au build vs rendu dynamique côté serveur
