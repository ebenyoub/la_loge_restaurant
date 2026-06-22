# Compétences et contrôles projet

Ce fichier liste les pratiques à appliquer lors des prochaines phases ; il ne remplace pas les instructions d'exécution disponibles dans l'environnement de travail.

| Domaine | Pratique attendue | Moment d'application |
| --- | --- | --- |
| UX/UI | La capture Figma actuelle fournie par le client est la référence visuelle ; vérifier desktop et mobile, composants cohérents et accessibles | À chaque évolution publique |
| Images | Vérifier droits, dimensions, poids, recadrage et texte alternatif | Avant toute intégration d'image |
| SEO local | Métadonnées par page, NAP cohérent, données structurées Restaurant et sitemap | Lors de la création des pages publiques |
| Formulaires | Validation serveur et erreurs accessibles sont livrées ; anti-spam et rate limiting restent à planifier avant exposition publique | Avant mise en ligne |
| Administration | Authentification JWT, droits minimaux, vue responsive et données personnelles protégées | À chaque évolution admin |
| Qualité | `npm run lint`, build de production et recette responsive | Avant chaque livraison |

La liste d'images disponibles et leurs limites est maintenue dans [docs/images-inventory.md](./docs/images-inventory.md).
