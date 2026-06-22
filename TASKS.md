# Pilotage des tâches — La Loge Bar & Food

## Tâche en cours

Aucune. P1-29 (Conformité RGPD) est terminé. Les formulaires de Contact et de Réservation intègrent désormais des consentements explicites obligatoires avec liens hypertexte vers la politique de confidentialité, et les durées de conservation des données sont affichées dans l'espace d'administration.

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
- [x] Implémentation complète de P1-29 (RGPD) : intégration du consentement explicite, politique de confidentialité liée et affichage des durées de conservation des données dans l'administration.

## Prochaine tâche proposée

Recette finale & Alignement Figma (P1-02, P1-03, P1-30) :
- valider l'alignement des espacements et contrastes avec la maquette Figma
- obtenir la validation finale des droits médias pour mise en ligne
