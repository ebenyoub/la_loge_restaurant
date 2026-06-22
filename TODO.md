# TODO — La Loge Bar & Food

**Mise à jour :** 22 juin 2026
**Règle :** ne pas élargir le périmètre sans décision documentée. Aucun commit automatique.

## À finaliser avant mise en ligne

- [ ] Obtenir la validation écrite des droits pour chaque photo qui sera publiée ; remplacer ou retirer tout média non validé.
- [ ] Confirmer l'adresse, le téléphone, l'e-mail, les horaires réguliers et les fermetures exceptionnelles affichés.
- [ ] Valider les mentions légales, la politique de confidentialité, le responsable de traitement et les durées de conservation.
- [ ] Valider les 9 catégories et 46 plats en base : noms, prix, descriptions, disponibilités, allergènes et date de mise à jour.
- [ ] Finaliser la recette visuelle desktop et mobile contre la capture Figma actuelle : header, hero, carte, formulaires, footer et états vides.
- [ ] Vérifier les parcours réels avec les paramètres SMTP et l'adresse de notification de production.
- [ ] Préparer le déploiement séparément : domaine, CORS, secrets, MySQL managé, sauvegardes, surveillance et revue `npm audit --omit=dev`.

## Livré

- [x] Redirection automatique de l'espace d'administration en cas de jeton invalide ou expiré (401), nettoyage du stockage local et cookie, et message d'avertissement.
- [x] Pages publiques et formulaires Réservation/Contact connectés au backend et migrés vers le standard React Hook Form + Zod.
- [x] Persistance MySQL et e-mails client/gérant pour les nouvelles demandes.
- [x] Validation des horaires d'ouverture pour les demandes de réservation.
- [x] Authentification JWT admin, routes protégées et administration complète des réservations, contacts, catégories, plats et réglages.
- [x] Carte publique connectée à MySQL et états d'erreur/absence de données distincts.
- [x] API frontend centralisée par `NEXT_PUBLIC_API_URL`; aucun appel frontend relatif `/api/v1`.
- [x] Actions admin de statut et de notes synchronisées immédiatement avec états de chargement.
- [x] Navigation admin visible sous le header fixe sur desktop et mobile.
- [x] Typographie publique sans-serif, sans italique visible, et correction des ancres de catégories de la carte.
- [x] Tests frontend : lint, build, Playwright admin et tests E2E publics validés (14 tests passants couvrant carte, contact, réservation, et menu burger).
- [x] Fondation technique RHF + Zod opérationnelle et formulaires Contact, Réservation, Login Admin et documents légaux migrés.
- [x] Implémentation complète de P1-23 (Documents légaux / RGPD) dynamisés depuis MySQL et administrables via React Hook Form + Zod.
- [x] Implémentation complète de P1-27 (Contact, accès, horaires cliquables et dynamiques sur les pages publiques et le footer).



## Explicitement hors périmètre actuel

- [ ] Confirmation/blocage automatiques de réservations, synchronisation calendrier ou Google Calendar.
- [ ] E-mails lors d'un changement de statut de réservation.
- [ ] Captcha et rate limiting, à planifier avant exposition publique si requis.
- [ ] SMS, WhatsApp, push, statistiques avancées, galerie, événements privés, avis clients et page builder.
