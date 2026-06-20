# État du projet — La Loge Bar & Food

**Dernière mise à jour :** 20 juin 2026  
**Phase :** vitrine statique MVP créée ; socle backend initialisé ; modèles et logique métier non démarrés
**Développement fonctionnel :** non démarré
**Initialisation du projet :** terminée — Next.js, TypeScript et Tailwind CSS

## Objectif MVP verrouillé

Un site vitrine performant et administrable pour La Loge Bar & Food, avec une demande de réservation manuelle : le client soumet sa demande, le gérant la traite dans une administration et décide de la suite.

## Décisions de portée

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
| Schéma de données MVP | Implémenté (Prisma) | Traduit dans `backend/prisma/schema.prisma` et validé via `prisma generate`, sans base de données réelle ni migration. |
| Architecture backend MVP | Initialisé | MySQL, Prisma, Express et MVC sont validés dans `decisions.md`. Le dossier `backend/` contient le socle TypeScript, Express, Prisma, le schéma de données compilé et une route technique `/health`, sans route métier réelle. |
| Contrats d'API MVP | Documenté | `docs/api-contracts.md` définit les requêtes, réponses, validations, statuts HTTP et règles RGPD des flux Réservation et Contact ; aucun endpoint métier n'est créé. |
| Prérequis backend MVP | Documenté | `docs/backend-prerequisites.md` liste les décisions critiques de secrets, hébergement, MySQL, authentification, e-mail, RGPD, risques et validation avant installation. Aucun secret ou fichier `.env` réel n'est créé. |
| Sécurité dépendances backend | À surveiller | `npm audit --omit=dev` signale trois vulnérabilités modérées transitives liées à la CLI Prisma 7. Aucun correctif automatique ni downgrade majeur n'est appliqué ; revue requise avant déploiement. |
| Sitemap et navigation MVP | Validé | Le squelette des cinq routes publiques, le layout commun, le header temporaire et le footer temporaire sont créés et validés ; le détail fonctionnel reste défini dans `docs/sitemap-mvp.md`. |
| Accueil MVP | En cours | Les sections statiques Hero, Présentation, extrait de carte, Accès express et CTA final sont créées avec des contenus à valider ; aucune image, formulaire ou donnée métier n'est intégrée. |
| Carte MVP | En cours | Les sections statiques Introduction, catégories, plats provisoires, allergènes et CTA final sont créées avec des contenus à valider ; aucune image, formulaire ou donnée métier n'est intégrée. |
| Réservation MVP | En cours | Les sections statiques Introduction, message d'attente de confirmation, formulaire visuel désactivé, besoin urgent, informations utiles et CTA Contact sont créées avec des contenus à valider ; aucun envoi, image ou traitement métier n'est intégré. |
| Contact MVP | En cours | Les sections statiques Introduction, contacts, horaires, emplacement de carte, formulaire visuel désactivé et CTA Réservation sont créées avec des contenus à valider ; aucun lien de contact, itinéraire, envoi, image ou traitement métier n'est intégré. |
| Mentions légales MVP | En cours | Les sections statiques Introduction, sommaire par ancres, éditeur, publication, hébergement, propriété intellectuelle, confidentialité, cookies et contact sont créées ; aucune donnée juridique non validée n'est publiée. |
| P2 | Validé | Événements privés, galerie, avis clients, statut ouvert/fermé dynamique, statistiques, notifications, disponibilité fine, automatisation, Google Calendar et disposition avancée sont reportés. |

## Livrables documentaires disponibles

- [Cahier des charges](./cahier-des-charges.md)
- [Backlog produit](./product-backlog.md)
- [Décisions](./decisions.md)
- [Liste d'actions](./TODO.md)
- [Sitemap MVP](./docs/sitemap-mvp.md)

## Workflow de pilotage

- Codex lit `TASKS.md` avant chaque tâche et traite une seule tâche à la fois.
- `npm run lint` et `npm run build` sont obligatoires avant toute livraison.
- Le commit est créé avec `scripts/checkpoint.sh "<message>"`, après vérification des changements avec `scripts/review-state.sh`.
- ChatGPT est utilisé uniquement pour les arbitrages de produit, les décisions de périmètre ou les blocages nécessitant une décision humaine.

## Bloqueurs avant le développement

1. Informations publiques et légales exactes : adresse, horaires, coordonnées, identité juridique.
2. Responsable du traitement des demandes et délai de réponse annoncé.
3. Paramètres métier : créneaux, groupes, seuils de couverts et règles d'annulation.
4. Comptes administrateurs nécessaires et politique d'accès.
5. Assets et contenu : logo, photos exploitables, carte/menu, textes et réseaux.
6. Arbitrages techniques restants : domaine, fournisseur de base de données, e-mail transactionnel et authentification.

## Prochaine étape proposée — validation humaine requise

Créer les contrôleurs, validateurs et routes Express pour les endpoints publics `POST /api/v1/reservations` et `POST /api/v1/contact-messages` avec validation stricte selon les contrats d'API, sans persistance réelle ni envoi d'e-mails.
