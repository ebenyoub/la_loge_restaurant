# Pilotage des tâches — La Loge Bar & Food

## Tâche en cours

Aucune. P1-30 (Recette MVP finale) est terminé. La checklist de recette complète a été rédigée dans docs/checklist-recette-mvp.md couvrant tous les parcours publics, d'administration, ainsi que les contraintes SEO/RGPD et de performance.

## Règles de travail

1. Lire `AGENTS.md`, `PROJECT_STATE.md`, `TODO.md` et ce fichier avant une tâche.
2. Respecter le périmètre demandé ; ne pas modifier Prisma, migrations, backend ou e-mails lorsqu'ils sont hors demande.
3. Pour une modification applicative, exécuter au minimum `npm run lint` et `npm run build`; exécuter `npm run test:e2e` si le parcours public ou admin est impacté.
4. Ne jamais créer de commit automatique. Présenter l'état du diff et attendre une validation humaine.
5. Mettre à jour `PROJECT_STATE.md`, `TODO.md`, `decisions.md` et `product-backlog.md` lorsqu'une décision ou le périmètre change.

## Historique récent

- [x] Résolution des bugs critiques iPhone (burger menu cliquable, débordements horizontaux formulaires contact/réservation, et flexibilité).
- [x] Tests E2E publics ajoutés (carte publique, formulaire contact, formulaire réservation, validation horaire/jour fermé, menu burger mobile).
- [x] Redirection automatique vers la page de connexion si le token admin est invalide ou expiré (401), suppression du localStorage et affichage du message de session expirée.
- [x] Connexion de la carte publique et des réglages à l'API publique MySQL ; correction du routage admin qui interceptait les routes publiques.
- [x] Correction des données catégories/plats de l'admin : réponses API directes `data` lues correctement (9 catégories, 46 plats).
- [x] Synchronisation immédiate des changements de statut et notes internes dans l'administration.
- [x] Correction du login admin pour la soumission par `Enter` et l'autocomplétion navigateur.
- [x] Correction de l'offset des ancres de catégories de la carte et de la superposition de la barre admin sous le header fixe.
- [x] Passe typographique publique/admin : suppression des usages visibles serif et italiques, sans changer la logique métier.
- [x] Mise à jour documentaire selon l'état réel du dépôt.
- [x] Enregistrement de la décision D-016 (standard Frontend : RHF + Zod + UI Foundation).
- [x] Création de la fondation technique React Hook Form + Zod et exemples réutilisables.
- [x] Migration du formulaire de login admin vers React Hook Form + Zod.
- [x] Migration des formulaires publics de Contact et de Réservation vers React Hook Form + Zod.
- [x] Enregistrement de la décision d'architecture D-017 (Standard de Formulaires RHF + Zod).
- [x] Implémentation complète de P1-23 (Documents légaux / RGPD) : création des API publiques/admin, édition via RHF + Zod dans /admin/settings et dynamisation de /mentions-legales.
- [x] Implémentation complète de P1-27 (Contact, accès et horaires) : téléphone, itinéraire et e-mail cliquables et dynamisés depuis une source unique.
- [x] Implémentation complète de P1-26 (SEO local) : injection dynamique des metatags (OG, Twitter, canonical), donnees structurees JSON-LD (Restaurant) et routages sitemap.xml / robots.txt.
- [x] Implémentation complète de P1-28 (Optimisation des images et performances) : correction de sizes et des requetes media CSS pour les composants next/image, et validation du lazy loading de l'iframe Maps.
- [x] Implémentation complète de P1-29 (Conformité RGPD) : intégration du consentement explicite, politique de confidentialité liée et affichage des durées de conservation des données dans l'administration.
- [x] Implémentation complète de P1-30 (Recette MVP) : rédaction de la checklist de recette globale dans docs/checklist-recette-mvp.md.
- [x] Amélioration des notifications admin : sons distincts pour réservations et messages contact, remplacement des pastilles par un effet de texte arc-en-ciel animé resetable à l'ouverture de la section.
- [x] Envoi automatique d'e-mails au client lors d'un changement de statut de réservation (confirmée, refusée, annulée, en attente).

## Prochaine tâche proposée

Lancement & Mise en production :
- Récolter la validation écrite des droits d'images par le client (règle D-014)
- Obtenir les coordonnées, horaires et textes légaux définitifs
- Lancer le déploiement de l'API (MySQL managé, variables d'environnement, SMTP Brevo prod) et du client Next.js (Vercel ou serveur dédié)
