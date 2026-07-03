[INTEMPOREL]

# HYPOTHESES_exemple.md : Observability (bug intermittent en prod, non reproductible en local)

Exemple rempli. Voir `../04_debugging/_TEMPLATE_HYPOTHESES.md`.

Contexte : 0,3% des users plantent au checkout, uniquement le vendredi soir, uniquement sur mobile. Impossible à reproduire en local (voir `06_debug_in_prod.md`).

## 1. Hypothèses

- A : timeout réseau plus fréquent sur mobile (connexion instable), la requête part deux fois.
- B : pic de trafic du vendredi soir sature une queue interne, les requêtes tardives arrivent dans un état inattendu.
- C : bug spécifique à une version de navigateur mobile qui gère mal une API récente utilisée au checkout.

## 2. Écartement

- C écartée : les logs structurés (`01_structured_logging.md`) montrent le crash sur tous les navigateurs mobiles, pas un seul.
- A partielle : le taux d'erreur réseau mobile est stable toute la semaine, pas de pic le vendredi soir précisément.

## 3. Retenue

Hypothèse B : la queue interne sature sous le pic de trafic du vendredi soir, et les requêtes traitées en retard arrivent avec un état déjà expiré côté panier.

## 4. Confirmation

- Expérience : ajouter une métrique de profondeur de queue (`03_tracing_paper_drill.md`) et croiser son pic avec l'horodatage exact des crashs sur une semaine.
- Attendu : si B est vraie, chaque crash correspond à un pic de profondeur de queue au-delà du seuil normal.
- Observé : corrélation à 94% entre pics de queue et crashs sur 7 jours de données.
- Verdict : confirmée.

## 5. Fix

- Alerte automatique (`03_metrics_alerting` fusionné dans `04_metrics_alerting.md`) dès que la profondeur de queue dépasse le seuil, avant que ça devienne un crash user.
- Timeout explicite côté panier avec message clair au lieu d'un crash silencieux.
- Dashboard de charge queue ajouté à l'astreinte (`08_oncall_drill.md`).
