# Product backlog — La Loge Bar & Food

**Référence :** MVP de demande de réservation manuelle  
**Statut :** implémentation MVP avancée ; les critères de validation éditoriale, légale, visuelle et de mise en ligne restent ouverts.
**Convention :** P1 = obligatoire avant mise en ligne ; P2 = explicitement reporté après lancement.

## Règle produit centrale

Une demande de réservation **n'est pas une réservation confirmée**. Le gérant décide manuellement de la confirmer, de la refuser, de l'annuler ou de recontacter le client. Les seuils de capacité produisent des alertes dans l'administration ; ils ne bloquent pas automatiquement une demande dans le MVP.

## État d'implémentation au 22 juin 2026

- Livré : P1-01, P1-04 à P1-09, P1-11 à P1-15, P1-19 (réglages structurés), P1-20, P1-23 (partiel, édition SEO OK) et P1-25. Les pages publiques, formulaires, API, persistance, e-mails de création, login JWT, réservation/contact admin, sections/plats admin et réglages sont opérationnels. Les derniers ajustements incluent la séparation nette des layouts public et admin (plus de double barre de navigation), la redirection automatique 401 vers la page de login avec message de session expirée, le support de la validation par touche `Enter` et d'autocomplétion sur le login, et l'alignement précis des ancres sur la carte.
- Partiel ou à valider : P1-02 (alignement final avec la capture Figma et médias autorisés), P1-03 (recette responsive - tests iPhone local à revalider après déploiement ou sur réseau Wi-Fi stable), P1-16 à P1-18 (lecture de charge à confirmer), P1-23 (éditions des mentions légales non structurée/différée), P1-26 à P1-30.
- Différé explicitement : anti-spam et limitation de débit de P1-10, e-mails de changement de statut et déploiement. Ils ne doivent pas être ajoutés avant la finalisation contenus/images/fidélité visuelle, sauf décision contraire documentée.

| ID | Fonctionnalité | Priorité | Description | Critères d'acceptation |
| --- | --- | --- | --- | --- |
| P1-01 | Site vitrine responsive | P1 | Réaliser les pages Accueil, Carte, Réservation, Contact/Accès et Mentions légales. | Toutes les pages MVP sont utilisables de 320 px au desktop ; navigation clavier et mobile opérationnelles. |
| P1-02 | Direction visuelle | P1 | Appliquer l'identité validée : palette, typographies, composants, photos et CTA. | Charte validée ; contrastes AA ; rendu cohérent sur les pages. |
| P1-03 | CTA de demande persistant | P1 | Rendre le dépôt d'une demande accessible sur chaque page. | CTA visible dans le header desktop et la barre d'action mobile ; libellé non trompeur. |
| P1-04 | Formulaire de demande | P1 | Collecter nom, prénom, téléphone, e-mail, date, heure, couverts, message facultatif, occasion facultative et consentement RGPD. | Tous les champs obligatoires sont validés ; occasions : anniversaire, repas pro, groupe, autre ; bouton « Envoyer ma demande de réservation ». |
| P1-05 | Message de confirmation web | P1 | Confirmer la réception sans confirmer de table. | Après envoi valide : message clair indiquant que la demande est en attente de confirmation. |
| P1-06 | Persistance des demandes | P1 | Enregistrer chaque demande en base de données. | La demande contient toutes les données soumises, un identifiant, une date de création et le statut initial `nouvelle`. |
| P1-07 | Statuts de réservation | P1 | Encadrer le cycle de traitement humain. | Seuls `nouvelle`, `en attente`, `confirmée`, `refusée`, `annulée` sont proposés ; le changement est daté. |
| P1-08 | E-mail au gérant | P1 | Informer le gérant d'une nouvelle demande. | Un e-mail récapitulatif est envoyé à l'adresse configurée après enregistrement réussi. |
| P1-09 | E-mail au client | P1 | Accuser réception de la demande. | Un e-mail récapitulatif indique explicitement « en attente de confirmation » ; aucune formulation ne garantit une table. |
| P1-10 | Protection formulaire | P1 | Sécuriser le dépôt de demandes. | Validation serveur et erreurs accessibles sont en place ; anti-spam et limitation de débit restent à planifier avant ouverture publique. |
| P1-11 | Authentification admin | P1 | Restreindre l'administration aux personnes habilitées. | Les routes admin sont protégées ; aucun client public ne peut consulter les demandes ou données personnelles. |
| P1-12 | Liste admin réservations | P1 | Afficher toutes les demandes dans une interface responsive. | La liste montre au minimum date/heure, nom, couverts, occasion, statut et indicateur de charge ; tri antéchronologique par défaut. |
| P1-13 | Filtres admin | P1 | Retrouver rapidement une demande. | Filtres opérationnels par date, statut et nom, sur mobile et desktop. |
| P1-14 | Détail & note interne | P1 | Consulter les données et consigner le suivi. | Téléphone, e-mail, message, occasion, statut et note interne sont visibles ; la note n'est jamais exposée au client. |
| P1-15 | Changement de statut | P1 | Permettre le traitement par le gérant. | Le gérant peut passer une demande entre les cinq statuts autorisés ; le changement est persisté et daté. |
| P1-16 | Paramètres de capacité | P1 | Définir des seuils indicatifs par service et éventuellement par créneau. | Le gérant peut modifier le maximum de couverts par service et, si activé, le maximum de demandes par créneau. |
| P1-17 | Alertes de surcharge | P1 | Rendre visibles les créneaux chargés. | L'administration affiche couverts demandés et nombre de demandes par date/créneau ; seuil dépassé = alerte visuelle, jamais blocage automatique. |
| P1-18 | Tableau de bord de charge | P1 | Donner une lecture rapide de la charge. | Une vue permet d'identifier sans ouvrir chaque fiche les dates ou créneaux proches/dépassant les seuils. |
| P1-19 | Admin contenus généraux | P1 | Gérer texte d'accueil, présentation, horaires, adresse, téléphone, e-mail et réseaux sociaux. | Les modifications sont sauvegardées et visibles sur le site sans modification du code. |
| P1-20 | Admin carte/menu | P1 | Gérer catégories et plats. | Catégories et plats sont créables/modifiables ; un plat comprend nom, description, prix, image et disponibilité. |
| P1-23 | Admin SEO et légal | P1 | Gérer les métadonnées principales et mentions légales. | Title, meta description, mots-clés locaux et mentions légales sont éditables dans des champs structurés. |
| P1-24 | Gestion de sections bornée | P1 | Donner une autonomie simple sans page builder. | Une section prévue peut être activée/désactivée ; textes/images sont modifiables ; l'ordre ne peut changer que pour les sections explicitement autorisées. |
| P1-25 | Carte HTML publique | P1 | Rendre les menus lisibles, indexables et maintenus. | Plats, prix et disponibilités sont lisibles sans zoom à 320 px ; un plat indisponible n'est pas présenté comme commandable. |
| P1-26 | SEO local | P1 | Mettre en place les fondations SEO de Lyon et de la place des Célestins. | Titles/metas uniques, NAP cohérent, sitemap, canonical, données structurées Restaurant et contenu local validé. |
| P1-27 | Contact, accès, horaires | P1 | Fournir les informations pratiques et actions mobiles. | Téléphone, e-mail et itinéraire sont cliquables ; horaires et adresse sont administrables. |
| P1-28 | Images et performance | P1 | Optimiser tous les médias. | Formats modernes, dimensions définies, textes alternatifs et objectifs Core Web Vitals respectés sur pages clés. |
| P1-29 | RGPD et données clients | P1 | Encadrer la collecte et l'accès aux données de réservation. | Consentement de formulaire, politique de confidentialité, accès admin restreint et durée de conservation définie avant lancement. |
| P1-30 | Recette MVP | P1 | Valider les parcours avant publication. | Tests documentés : demande, deux e-mails, gestion admin, alertes de charge, contenus, SEO, responsive et accessibilité de base. |

> Note de traçabilité : `P1-21` est reporté en `P2-08` ; `P1-22` est reporté en `P2-09`.

| P2-01 | Statistiques simples | P2 | Afficher des métriques de demandes, appels et conversions. | Source de données, consentement et métriques décidés ; aucun suivi non conforme. |
| P2-02 | Notifications SMS / WhatsApp | P2 | Ajouter un canal d'alerte complémentaire. | Consentement, prestataire, coûts, règles d'envoi et échecs de délivrance cadrés. |
| P2-03 | Notifications push | P2 | Notifier le gérant sur appareil compatible. | Opt-in, appareil cible et stratégie de repli par e-mail définis. |
| P2-04 | Disponibilités fines | P2 | Calculer les disponibilités et règles de capacité plus précisément. | Services, tables, exceptions et conflits modélisés et validés avec le restaurant. |
| P2-05 | Blocage/confirmation automatiques | P2 | Automatiser tout ou partie du traitement des demandes. | Règles métier testées, messages client adaptés et procédure de reprise manuelle validée. |
| P2-06 | Google Calendar | P2 | Synchroniser les demandes/réservations avec un calendrier. | Sens de synchronisation, droits, conflits et suppression sont définis avant intégration. |
| P2-07 | Disposition avancée | P2 | Étendre la personnalisation de la mise en page. | Garde-fous responsive, SEO et accessibilité définis ; aucun builder libre sans décision spécifique. |
| P2-08 | Galerie publique et administration | P2 | Créer une galerie publique et permettre sa gestion dans l'administration. | Ajout, retrait, ordre et texte alternatif des images sont possibles ; droits des images validés avant publication. |
| P2-09 | Événements privés | P2 | Créer une page, un parcours et une gestion de contenu pour les groupes et privatisations. | Capacités, offres, demandes et délais de réponse sont validés avant publication. |
| P2-10 | Avis clients | P2 | Afficher une sélection d'avis clients et son lien source. | Avis vérifiables, actualisés et non trompeurs ; règles d'affichage définies. |
| P2-11 | Statut ouvert / fermé dynamique | P2 | Calculer et afficher le statut à partir des horaires et exceptions. | Fuseau Europe/Paris, jours fériés et exceptions sont correctement pris en compte ; les horaires restent visibles en repli. |
