# Décisions produit — La Loge Bar & Food

Ce document est la source de vérité des décisions de portée. Les propositions techniques non validées sont explicitement marquées comme telles.

## D-001 — Réservation MVP par demande manuelle

**Statut :** validée
**Date :** 20 juin 2026

Le site ne propose pas de moteur de réservation automatique complexe. Le client soumet une demande complète. Le gérant accepte, refuse ou contacte le client si nécessaire.

**Conséquence :** les libellés, e-mails et écrans doivent parler de « demande de réservation » et d'« attente de confirmation », jamais de table automatiquement réservée.

## D-002 — Champs du formulaire de demande

**Statut :** validée  
**Date :** 20 juin 2026

Le formulaire contient : nom, prénom, téléphone, e-mail, date souhaitée, heure souhaitée, nombre de personnes, message facultatif, occasion spéciale facultative (anniversaire, repas pro, groupe, autre), consentement RGPD et bouton « Envoyer ma demande de réservation ».

**Conséquence :** les champs nécessaires au traitement sont obligatoires et validés côté serveur ; les champs facultatifs ne doivent pas empêcher l'envoi.

## D-003 — Persistance et notifications e-mail

**Statut :** validée  
**Date :** 20 juin 2026

Après envoi valide, la demande est enregistrée en base de données, un e-mail est envoyé au gérant et un e-mail est envoyé au client. Le site affiche un message de réception clair.

**Conséquence :** l'enregistrement réussi est la condition préalable aux notifications ; les erreurs de traitement ne doivent jamais afficher une fausse confirmation.

## D-004 — Gestion admin des réservations

**Statut :** validée  
**Date :** 20 juin 2026

L'espace admin responsive permet de voir toutes les demandes, filtrer par date/statut/nom, consulter le détail, voir téléphone/e-mail, modifier le statut et ajouter une note interne.

Les seuls statuts sont : `nouvelle`, `en attente`, `confirmée`, `refusée`, `annulée`.

**Conséquence :** l'accès doit être authentifié et les données clients ne doivent jamais être rendues publiques.

## D-005 — Capacité : alerte, jamais blocage automatique au MVP

**Statut :** validée  
**Date :** 20 juin 2026

Le gérant peut définir un maximum de couverts par service et, facultativement, un maximum de demandes par créneau. L'administration visualise la charge et signale un dépassement potentiel.

**Conséquence :** une demande doit rester recevable même au-delà d'un seuil ; la décision finale reste humaine.

## D-006 — Administration de contenu structurée

**Statut :** validée  
**Date :** 20 juin 2026

L'administration gère : textes d'accueil et présentation, horaires, adresse, téléphone, e-mail, réseaux sociaux, carte/menu, catégories, plats, images, événements/privatisations, SEO principal et mentions légales.

**Conséquence :** le modèle de contenu doit couvrir ces objets sans imposer de modification de code pour les mises à jour courantes.

## D-007 — Pas de page builder au MVP

**Statut :** validée  
**Date :** 20 juin 2026

L'administration permet seulement d'activer/désactiver des sections prévues, modifier les textes et images et, si prévu, modifier l'ordre d'un nombre limité de sections. La mise en page est fixe, responsive et contrôlée.

**Conséquence :** aucun éditeur visuel de type Webflow, aucun composant libre, aucune personnalisation qui puisse casser le design, le SEO ou l'accessibilité.

## D-008 — Priorités post-MVP

**Statut :** validée  
**Date :** 20 juin 2026

Les statistiques simples, notifications SMS/WhatsApp/push, disponibilité automatique fine, synchronisation Google Calendar et modification avancée de la disposition sont P2.

**Conséquence :** ces fonctions ne doivent pas retarder la mise en ligne P1 ni influer sur l'interface MVP hors compatibilité raisonnable.

## D-009 — Stack technique de référence

**Statut :** proposée, à arbitrer avant développement  
**Date :** 20 juin 2026

Next.js, TypeScript, Tailwind CSS, PostgreSQL managé, ORM typé, prestataire d'e-mail transactionnel, authentification admin et déploiement Vercel constituent la base proposée.

**Conséquence :** le choix précis de l'hébergeur de base, de l'ORM, du prestataire e-mail et de l'authentification reste à valider avec les exigences de propriété, coût et RGPD.

## D-010 — Architecture backend MVP

**Statut :** validée
**Date :** 20 juin 2026

Le backend MVP utilise MySQL comme base de données, Prisma comme ORM, Express comme serveur backend et une architecture MVC. Cette décision remplace la préférence PostgreSQL/ORM non précisé de D-009 pour les éléments concernés.

**Conséquence :** le schéma de données est traduit ultérieurement en modèles Prisma MySQL et les règles métier sont exposées par une API Express séparée du frontend Next.js. L'installation de Prisma, la création du serveur Express, de la base MySQL, des API et des migrations restent soumises à une instruction d'implémentation distincte.
