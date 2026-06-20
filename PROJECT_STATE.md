# État du projet — La Loge Bar & Food

**Dernière mise à jour :** 20 juin 2026  
**Phase :** Socle technique, base de données, APIs publiques, intégration des formulaires publics, routes d'administration backend et interface d'administration MVP frontend (login, réservations, contacts) opérationnels.

## 1. État réel actuel du projet

### Front-end (Next.js & CSS Modules)
- **Public** : Les 5 pages publiques sont prêtes, performantes, structurées et connectées au backend.
- **Administration** : Interface d'administration MVP opérationnelle (login, protection des routes client, tableau de bord des réservations avec historique et notes internes, tableau de bord des messages de contact).

### Backend Express (TypeScript & Express 5)
- **Opérationnel** : Serveur Express configuré avec injection de `requestId`, logs épurés et gestionnaire d'erreurs global sans fuite technique vers le client.
- **Prisma & MySQL** : Modèles Prisma complets traduits du schéma logique, base locale MySQL (`la_loge_db`) connectée, et migration initiale appliquée avec succès.
- **Endpoints publics** : Les routes `POST /api/v1/reservations` (avec écriture dans `Reservation` et historique `ReservationStatusHistory` en transaction) et `POST /api/v1/contact-messages` sont actives avec une validation stricte des corps de requêtes (formats, type, timezone et blocage des champs inconnus).
- **Authentification Admin** : Système d'authentification robuste implémenté (`POST /api/v1/admin/login` et middleware de protection de route `authMiddleware` via JWT et hashage `bcrypt`).
- **Sécurité JWT** : `JWT_SECRET` obligatoire au démarrage, devant faire au moins 32 caractères de long (échec automatique du serveur en cas d'absence ou clé trop faible).

### Éléments non développés / Restants du MVP
- **Interface d'administration (contenus)** : Espace d'administration visuel pour la carte (menu/plats) et les réglages généraux/SEO non développé.
- **E-mails transactionnels** : Envoi d'e-mails réels (restaurant/client) non configuré.

## 2. Décisions de portée

| Sujet | État | Décision |
| --- | --- | --- |
| Réservation | Validé | Formulaire de demande ; aucune confirmation automatique. |
| Traitement | Validé | Enregistrement en base, e-mail au gérant, e-mail au client, message d'attente sur le site. |
| Statuts | Validé | `nouvelle`, `en attente`, `confirmée`, `refusée`, `annulée`. |
| Capacité | Validé | Paramètres de seuil et alertes pour le gérant ; aucun blocage automatique MVP. |
| Administration réservations | Validé | Liste, filtres date/statut/nom, détail, coordonnées, notes et gestion des statuts, responsive. |
| Périmètre public MVP | Validé | Accueil, Carte, Réservation, Contact/Accès et Mentions légales uniquement. |
| Administration contenus | Validé | Infos générales, menu, images liées aux contenus MVP, SEO et légal ; interface structurée. |
| Mise en page | Validé | Sections limitées activables/désactivables et éventuellement réordonnables ; pas de page builder. |
| Architecture CSS | Validé | Les CSS Modules sont conservés jusqu'à la fin du MVP public. Tailwind reste configuré pour le socle technique ; aucune migration des styles existants n'est engagée avant le refactor UI après MVP. |
| Schéma de données MVP | Migré | Traduit dans `backend/prisma/schema.prisma` et migré sur MySQL local via `prisma migrate dev`. |
| Architecture backend MVP | Routes d'administration backend complètes | MySQL, Prisma, Express, bcrypt et JWT. Les routes d'administration des réservations, de la carte, des réglages généraux et des messages de contact sont opérationnelles et protégées par rôle. |
| Stratégie de tests backend | Opérationnelle | Vitest configuré avec Supertest, mock automatique de Prisma pour isoler les tests de base de données. Tests d'API passants sur health, validations, authentification et protection de routes. |
| Contrats d'API MVP | Documenté | `docs/api-contracts.md` définit les requêtes, réponses, validations, statuts HTTP et règles RGPD des flux Réservation et Contact. |
| Prérequis backend MVP | Documenté | `docs/backend-prerequisites.md` liste les décisions critiques de secrets, hébergement, MySQL, authentification, e-mail, RGPD, risques et validation avant installation. |
| Sécurité dépendances backend | À surveiller | `npm audit --omit=dev` signale des vulnérabilités modérées transitives liées à la CLI Prisma 7. Aucun correctif automatique ni downgrade majeur n'est appliqué ; revue requise avant déploiement. |
| Sitemap et navigation MVP | Validé | Le squelette des cinq routes publiques, le layout commun, le header temporaire et le footer temporaire sont créés et validés. |

## 3. Livrables documentaires disponibles

- [Cahier des charges](./cahier-des-charges.md)
- [Backlog produit](./product-backlog.md)
- [Décisions](./decisions.md)
- [Liste d'actions](./TODO.md)
- [Sitemap MVP](./docs/sitemap-mvp.md)

## 4. Workflow de pilotage

- Codex lit `TASKS.md` avant chaque tâche et traite une seule tâche à la fois.
- `npm run lint` et `npm run build` sont obligatoires avant toute livraison.
- The commit est créé avec `scripts/checkpoint.sh "<message>"`, après vérification des changements avec `scripts/review-state.sh`.

## 5. Bloqueurs avant le développement
1. Informations publiques et légales exactes : adresse, horaires, coordonnées, identité juridique.
2. Responsable du traitement des demandes et délai de réponse annoncé.
3. Paramètres métier : créneaux, groupes, seuils de couverts et règles d'annulation.
4. Comptes administrateurs nécessaires et politique d'accès.
5. Assets et contenu : logo, photos exploitables, carte/menu, textes et réseaux.
6. Arbitrages techniques restants : domaine, fournisseur de base de données, e-mail transactionnel et authentification.

## 6. Prochaine étape proposée — validation humaine requise

Implémenter l'interface d'administration pour la gestion de la carte (catégories et plats) côté frontend en connectant les APIs existantes.
