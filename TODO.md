# TODO — La Loge Bar & Food

**Règle de travail :** Le socle technique est initialisé. Ne pas développer les pages finales, l'administration, les formulaires métier ou le design complet sans instruction explicite.

## Tâche initiale — audit des actifs existants

- [ ] Obtenir la confirmation écrite du client sur les droits d'utilisation avant toute intégration d'image.

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
- [ ] Écrire les textes d'e-mails et le message affiché après envoi.
- [ ] Définir les règles d'alerte de charge, y compris les données prises en compte selon chaque statut.
- [ ] Définir la politique d'authentification et de réinitialisation de mot de passe admin.
- [ ] Préparer le plan de recette fonctionnelle, mobile, e-mail, sécurité, RGPD, SEO et accessibilité.
- [ ] Examiner l'alerte `npm audit --omit=dev` liée à la CLI Prisma 7 avant un déploiement ; ne pas appliquer de downgrade majeur sans décision technique.

- [x] Implémenter les routes d'administration des réservations (`GET /api/v1/admin/reservations`, `GET /api/v1/admin/reservations/:id`, `PATCH /api/v1/admin/reservations/:id/status` et création de notes internes) protégées par session admin/rôle, sans envoi d'e-mails ni frontend.
- [x] Implémenter les routes d'administration des messages de contact (`GET /api/v1/admin/contact-messages`, `GET /api/v1/admin/contact-messages/:id` et `PATCH /api/v1/admin/contact-messages/:id/status`) protégées par session admin/rôle, sans envoi d'e-mails ni frontend.
- [x] Mettre en place une stratégie de tests backend (Vitest + Supertest) avec couverture de base sur les endpoints publics, auth et routes protégées.

## Prochaine tâche proposée — à valider

- [ ] Liaison des formulaires publics frontend et backend (connecter les formulaires de `/reservation` et `/contact` aux routes d'API correspondantes).

## Après le MVP

- [ ] Refactor UI Tailwind après MVP : définir les tokens Tailwind, mutualiser les styles répétés et migrer les CSS Modules page par page après validation visuelle.

## Explicitement hors MVP

- [ ] Ne pas développer de confirmation ou blocage automatique des réservations.
- [ ] Ne pas intégrer Google Calendar.
- [ ] Ne pas intégrer de SMS, WhatsApp ou notifications push.
- [ ] Ne pas créer de page builder ou d'éditeur de disposition libre.
- [ ] Ne pas développer de statistiques avancées avant la P2.
- [ ] Ne pas développer d'événements privés, de galerie, d'avis clients ni de statut dynamique ouvert/fermé avant la P2.
