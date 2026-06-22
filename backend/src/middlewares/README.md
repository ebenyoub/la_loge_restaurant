# Middlewares

Les middlewares transverses sont implémentés dans ce dossier : authentification JWT, contrôle de rôle, validation, identifiant de requête et gestion centralisée des erreurs.

Les routeurs d'administration appliquent l'authentification uniquement sous le préfixe `/api/v1/admin`. Les routes publiques, notamment `/api/v1/public/menu` et `/api/v1/public/settings`, ne doivent jamais être interceptées par cette protection.

La limitation de débit et le captcha ne font pas partie de la livraison courante ; ils restent à traiter avant une ouverture publique si la politique de sécurité l'exige.
