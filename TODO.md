# TODO — La Loge Bar & Food

**Règle de travail :** le socle technique est initialisé. Ne pas développer les pages finales, l'administration, les formulaires métier ou le design complet sans instruction explicite.

## Tâche initiale — audit des actifs existants

- [x] Scraper le site existant.
- [x] Récupérer toutes les images réutilisables exposées publiquement.
- [x] Classer les images dans `public/images/imported/`.
- [x] Documenter chaque image dans `docs/images-inventory.md`.
- [ ] Obtenir la confirmation écrite du client sur les droits d'utilisation avant toute intégration.

## Décisions déjà enregistrées

- [x] Le MVP utilise une demande de réservation manuelle, pas une réservation automatique.
- [x] La demande est enregistrée en base et génère deux e-mails : gérant et client.
- [x] Le gérant traite les statuts dans un espace admin responsive.
- [x] Les limites de capacité déclenchent une alerte, sans bloquer automatiquement les demandes.
- [x] L'administration de contenu est structurée et bornée ; aucun page builder n'est prévu au MVP.
- [x] Priorités P1/P2 synchronisées dans le cahier des charges et le backlog.
- [x] Sitemap fonctionnel MVP documenté dans `docs/sitemap-mvp.md`.

## Pilotage du projet

- [x] Utiliser `TASKS.md` pour piloter les prochaines tâches avec Codex.
- [x] Développer la page Contact MVP statique.
- [x] Développer la page Mentions légales MVP statique.
- [x] Documenter le schéma de données MVP dans `docs/database-schema.md`, sans implémentation backend.
- [x] Documenter l'architecture backend MVC Express et les flux métier dans `docs/backend-architecture.md`, sans implémentation backend.
- [x] Formaliser les contrats d'API Réservation et Contact dans `docs/api-contracts.md`, sans implémentation backend.
- [x] Préparer les prérequis de validation backend dans `docs/backend-prerequisites.md`, sans implémentation backend.
- [x] Initialiser le socle backend Express, TypeScript et Prisma/MySQL avec `/health`, sans logique métier ni base de données.

## À valider avec le client avant conception/développement

- [ ] Confirmer l'adresse officielle unique, les horaires, le téléphone et l'e-mail publiés.
- [ ] Désigner l'adresse e-mail destinataire des demandes et les personnes habilitées à les traiter.
- [ ] Définir le délai de réponse à afficher au client.
- [ ] Définir les créneaux proposés, le seuil groupe et les règles d'annulation/no-show.
- [ ] Définir le maximum indicatif de couverts par service et, si nécessaire, de demandes par créneau.
- [ ] Valider les statuts : nouvelle, en attente, confirmée, refusée, annulée.
- [ ] Confirmer qui a besoin d'un compte admin et le niveau d'accès nécessaire.
- [ ] Fournir logo, charte éventuelle, photos avec droits, carte/menu et formules du MVP.
- [ ] Valider les textes d'accueil, le positionnement, les contenus locaux et les réseaux sociaux actifs.
- [ ] Fournir les mentions légales et éléments RGPD exacts, dont la durée de conservation des demandes.
- [ ] Choisir le domaine, le propriétaire des comptes techniques et le prestataire d'e-mail transactionnel.

## À préparer à l'ouverture du développement

- [ ] Valider les maquettes de la vitrine et de l'administration mobile/desktop.
- [x] Formaliser le modèle de données : demande, statut, note interne, capacité, service, contenu, plat, catégorie, image et SEO. Voir `docs/database-schema.md`.
- [ ] Écrire les textes d'e-mails et le message affiché après envoi.
- [ ] Définir les règles d'alerte de charge, y compris les données prises en compte selon chaque statut.
- [ ] Définir la politique d'authentification et de réinitialisation de mot de passe admin.
- [ ] Préparer le plan de recette fonctionnelle, mobile, e-mail, sécurité, RGPD, SEO et accessibilité.
- [ ] Examiner l'alerte `npm audit --omit=dev` liée à la CLI Prisma 7 avant un déploiement ; ne pas appliquer de downgrade majeur sans décision technique.

## Prochaine tâche proposée — à valider

- [ ] Traduire `docs/database-schema.md` en modèles Prisma, générer le client et valider le schéma sans créer de migration ni de base de données.

## Après le MVP

- [ ] Refactor UI Tailwind après MVP : définir les tokens Tailwind, mutualiser les styles répétés et migrer les CSS Modules page par page après validation visuelle.

## Explicitement hors MVP

- [ ] Ne pas développer de confirmation ou blocage automatique des réservations.
- [ ] Ne pas intégrer Google Calendar.
- [ ] Ne pas intégrer de SMS, WhatsApp ou notifications push.
- [ ] Ne pas créer de page builder ou d'éditeur de disposition libre.
- [ ] Ne pas développer de statistiques avancées avant la P2.
- [ ] Ne pas développer d'événements privés, de galerie, d'avis clients ni de statut dynamique ouvert/fermé avant la P2.
