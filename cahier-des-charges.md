# Cahier des charges — refonte du site La Loge Bar & Food

**Établissement :** La Loge Bar & Food  
**Localisation communiquée par le site actuel :** 7 rue Charles Dullin, place des Célestins, 69002 Lyon  
**Date :** 20 juin 2026  
**Statut :** document de cadrage — à valider avant conception et développement

## 1. Cadre et ambition du projet

La refonte doit transformer le site actuel en un site de restaurant indépendant, rapide et crédible, capable de convertir une visite en **demande de réservation**, appel ou demande d'événement privé. Il doit faire ressentir l'identité de La Loge : un lieu de restauration française décontractée, de bar et de cocktails, situé autour de la place des Célestins.

Le nouveau site ne doit pas être une simple brochure. Il doit répondre, en quelques secondes, aux questions décisives : **où est le restaurant, est-il ouvert, que peut-on y manger ou boire, quel est son univers, et comment envoyer une demande de réservation ?**

### Périmètre de cette phase

- Audit éditorial, UX/UI et SEO du site public actuel.
- Définition de l'architecture, des contenus, de la direction artistique, des fonctionnalités, des exigences techniques et du backlog.
- Préparation des décisions à obtenir du client.

### Décision produit MVP validée

La réservation est gérée comme une **demande manuelle**, et non comme une disponibilité confirmée automatiquement :

- le client envoie une demande de réservation exhaustive ;
- la demande est enregistrée en base, puis notifiée au gérant par e-mail ;
- le client reçoit un e-mail indiquant explicitement que sa demande est en attente de confirmation ;
- le gérant consulte la demande dans un espace admin, la confirme, la refuse, l'annule ou rappelle le client ;
- les limites de couverts servent d'alerte de charge pour le gérant et ne bloquent pas automatiquement le dépôt d'une demande dans le MVP.

Le même espace admin permet de gérer les contenus structurés du site. Il ne comprend pas d'éditeur de page libre ou de constructeur visuel type Webflow : la mise en page reste fixe, propre et responsive.

### Hors périmètre de cette phase

- Création du site, intégration, rédaction finale, prise de vue, création du logo ou mise en ligne.
- Développement du site et de l'administration : ils ne sont pas démarrés à cette phase.
- Moteur de disponibilité, confirmation et blocage automatiques des créneaux.
- Synchronisation Google Calendar, notifications SMS/WhatsApp/push et constructeur visuel de pages.

## 2. État des lieux du site actuel

### Constats factuels

Le site actuel est une page générée sur la plateforme Eatbu/DISH. Il présente une introduction, deux visuels de menu, une carte, un bloc de réservation, les horaires, les moyens de paiement, deux blocs « À propos », les services, un formulaire de contact et les mentions légales. La promesse affichée mêle cuisine française, burgers, poissons, desserts, bar et cocktails.  
Source auditée : [site actuel](https://la-loge-bar-food-restaurant-lyon.eatbu.com/?lang=fr), le 20 juin 2026.

Les informations suivantes sont visibles mais devront être confirmées : adresse 7 rue Charles Dullin, téléphone 06 85 40 26 37, fermeture lundi et dimanche, ouverture mardi à samedi de 11 h à 14 h 30 puis de 18 h à 1 h. Un annuaire tiers fait apparaître une adresse au **9** rue Charles Dullin ([référence consultée](https://www.sortir-lyon.com/etablissements/bars/la-loge-bar-food)) : cette incohérence doit être résolue avant toute publication afin de préserver le référencement local.

### 2.1 Points faibles UX/UI

| Constat | Effet sur le visiteur | Recommandation |
| --- | --- | --- |
| Page unique très longue, structurée comme un gabarit de plateforme | La lecture est séquentielle et l'accès aux contenus clés est peu direct | Créer des pages dédiées et une navigation courte ; conserver les informations critiques sur l'accueil |
| Hiérarchie de l'information faible | La carte, les cocktails, le lieu et la réservation se concurrencent au lieu de se renforcer | Poser un parcours : promesse → preuve visuelle → carte → réservation → accès |
| Design générique de plateforme | Le site ne porte pas l'identité du lieu et ne crée pas de préférence de marque | Concevoir une identité visuelle propriétaire avec iconographie, règles typographiques et composants cohérents |
| Réservation présente mais peu contextualisée | L'utilisateur ne sait pas immédiatement ce qui est disponible ni quel canal est utilisé | CTA « Réserver une table » fixe, module clair et alternatives téléphone / événements |
| Carte affichée comme deux images | Consultation difficile, zoom imprécis, contenu inaccessible aux moteurs et aux lecteurs d'écran | Carte HTML par catégories, prix et allergènes ; PDF imprimable en complément |
| Informations pratiques réparties entre plusieurs blocs | Effort inutile pour vérifier horaires, adresse, téléphone, terrasse ou accessibilité | Bloc « Infos pratiques » constant dans le footer et résumé en haut des pages stratégiques |
| Peu de preuves sociales ou éditoriales | Le lieu paraît impersonnel malgré son emplacement central | Mettre en avant avis Google sélectionnés, photos réelles, équipe, actualités et réponses aux questions courantes |

### 2.2 Problèmes de contenu

- Le texte principal est générique, peu différenciant et contient plusieurs formulations maladroites (« si vous voulez dégustez », « autour de plat français », « nous vous chouchoutera »). Il ne raconte ni le positionnement précis, ni le savoir-faire, ni l'expérience attendue.
- La proposition de valeur est dispersée : fait maison, cuisine française, burgers, poissons, terrasse, cocktails et événements sont énumérés sans priorisation.
- La carte visible n'est pas exploitable comme contenu web : elle est présentée sous forme d'images, sans descriptions, catégories, allergènes, disponibilité ou date de mise à jour.
- Le menu du jour, pourtant levier important à midi, n'est pas éditorialisé. Un annuaire lié à la plateforme indique par ailleurs qu'aucun menu du jour n'était saisi pour la semaine observée.
- Les deux blocs « À propos » sont trop pauvres : une salade César et une phrase en anglais (« The place to be ») ne suffisent pas à faire ressentir le lieu.
- Les événements privés sont mentionnés sans capacité, types d'événements, privatisation, exemple d'offre ou parcours de demande.
- Les informations de paiement et services sont utiles, mais elles prennent davantage de place que les contenus qui vendent l'expérience.

### 2.3 Problèmes de SEO local

- Le titre actuellement exposé (« Restaurant Lyon | Française cuisine près de moi | Réserver maintenant ») est générique, grammaticalement faible et peu distinctif. La marque, le quartier et la proposition de valeur devraient apparaître naturellement.
- Une seule page limite la capacité à se positionner sur des intentions distinctes : restaurant place des Célestins, bar à cocktails Lyon 2, restaurant de groupe à Lyon, privatisation, déjeuner, menu.
- Le contenu local est trop léger : l'adresse est présente, mais le quartier, les repères, les accès et l'environnement culturel ne sont pas valorisés.
- La carte image ne fournit pas de texte indexable sur les plats, boissons, prix et spécialités.
- Aucun maillage éditorial apparent entre des pages thématiques n'accompagne l'utilisateur ou les moteurs de recherche.
- Les incohérences potentielles d'adresse entre sources externes sont un risque direct pour le NAP (Name, Address, Phone), donc pour Google Maps et le SEO local.
- Les données structurées, les URL canoniques, le sitemap et la stratégie Google Business Profile sont à auditer et mettre en place sur le futur site.

### 2.4 Problèmes de crédibilité et de conformité

- Les mentions légales visibles contiennent des numéros d'immatriculation et fiscaux remplis de zéros. Cela est un signal de faible fiabilité et doit être remplacé par les données exactes ou retiré selon le cadre légal applicable.
- L'identité juridique, le SIREN/SIRET, l'hébergeur, le responsable de publication et les conditions de traitement des données doivent être validés par le client ou son conseil.
- L'adresse e-mail affichée est une adresse personnelle générique. Une adresse dédiée au domaine est préférable, par exemple `contact@laloge-lyon.fr` si le domaine est retenu.
- Il n'y a pas de preuve sociale clairement mise en scène : note Google, nombre d'avis, avis sélectionnés, médias, presse ou photos professionnelles.
- Les photos disponibles semblent peu nombreuses. Elles ne permettent pas de montrer de façon convaincante la salle, la terrasse, les plats, les cocktails, le service et l'ambiance de soirée.
- Le site est signé par la plateforme, ce qui renforce l'impression d'un site non propriétaire plutôt que d'une adresse établie.

### 2.5 Mobile et responsive

Le gabarit actuel est probablement adapté techniquement à un petit écran, mais l'expérience mobile reste limitée par la nature même du contenu : une longue page, des visuels de menu à lire/zoomer, une réservation insuffisamment persistante et des informations pratiques éloignées les unes des autres. Un audit sur appareils réels sera réalisé lors de la recette, mais la refonte doit traiter dès la conception les règles suivantes :

- un bouton de réservation fixe et accessible au pouce ;
- un numéro de téléphone cliquable, une ouverture dans Maps et des horaires lisibles sans zoom ;
- aucune image de menu nécessaire pour connaître l'offre ou les prix ;
- navigation mobile courte, sans sous-menus complexes ;
- formulaires avec champs larges, clavier adapté et messages d'erreur explicites ;
- médias au bon format, chargés progressivement, sans dégrader le temps de chargement en 4G.

### 2.6 Informations manquantes ou insuffisamment présentées

- Identité de marque : logo, histoire, équipe, ton, promesse et spécialités réellement différenciantes.
- Carte complète, boissons/cocktails, options végétariennes, allergènes, prix et rythme de mise à jour.
- Photos professionnelles et récentes de la salle, de la terrasse, des plats, du bar, des cocktails et des moments de vie.
- Outil et règles de réservation : nombre maximal de couverts, confirmation, annulation, groupes et no-show.
- Offre de privatisation : capacité, formats, créneaux, devis, menus groupe, équipements et conditions.
- Accès : stationnement, transports, itinéraire piéton depuis la place des Célestins, accessibilité et informations terrasse.
- Liens actifs vers l'ensemble des réseaux sociaux et ligne éditoriale associée.
- Avis clients vérifiables et éléments de réassurance.

## 3. Objectifs du nouveau site

| Objectif | Résultat attendu | Indicateur de suivi |
| --- | --- | --- |
| Porter une image professionnelle | Une identité cohérente, des contenus soignés et des photos authentiques | Validation client de la direction artistique ; taux d'engagement sur les pages |
| Rendre la demande de réservation évidente | Envoyer une demande complète en un ou deux gestes depuis toute page | Clics sur « Réserver », demandes envoyées, appels depuis mobile |
| Mettre en valeur le restaurant | Compréhension immédiate du lieu, de sa cuisine et de son ambiance | Consultation de la galerie/carte et profondeur de navigation |
| Développer le SEO local à Lyon | Visibilité sur les intentions liées à Lyon 2, Célestins, restaurant, bar et privatisation | Impressions et clics Search Console ; positions locales ; demandes d'itinéraire |
| Renforcer la confiance | Informations justes, légales, preuve sociale et parcours transparent | Taux de conversion, demandes qualifiées, baisse des questions récurrentes |
| Garantir un site rapide et accessible | Expérience fluide sur mobile comme sur ordinateur | Core Web Vitals « bons », Lighthouse, tests responsive et accessibilité de base |

### Cibles prioritaires

1. Déjeuner : actifs, riverains et visiteurs du centre-ville qui cherchent une table simple et rapide.
2. Afterwork et soirée : groupes d'amis à la recherche d'un bar-restaurant et de cocktails autour des Célestins.
3. Visiteurs de Lyon : personnes qui recherchent un restaurant accessible près de la place des Célestins, de Bellecour ou du Vieux Lyon.
4. Groupes et entreprises : demandes de repas, anniversaires, afterworks et privatisations.

## 4. Arborescence proposée

```text
Accueil /
├── Carte & menus /carte
├── Réservation /reservation
├── Événements privés /evenements-prives
├── Galerie /galerie
├── Contact & accès /contact
└── Mentions légales /mentions-legales
    ├── Politique de confidentialité /confidentialite
    └── Gestion des cookies /cookies
```

Le header contient le logo, les liens de niveau 1 et le CTA « Réserver une table ». Sur mobile, le CTA reste visible dans une barre basse fixe avec « Appeler » ou « Itinéraire » selon l'espace disponible. Le footer répète les coordonnées, horaires, liens sociaux et liens légaux.

## 5. Contenus attendus par page

### 5.1 Accueil

**Objectif.** Faire comprendre immédiatement l'offre et l'emplacement, donner envie de venir, puis orienter vers la réservation, la carte ou l'accès.

| Section | Contenu et textes à préparer | Images nécessaires | CTA |
| --- | --- | --- | --- |
| Hero | Accroche courte : « Restaurant & bar à cocktails, place des Célestins. » Sous-texte positionnant cuisine, ambiance et moment de consommation. Horaires du jour avec statut ouvert/fermé. | Une image forte, réelle, horizontale : salle vivante, terrasse ou cocktail au premier plan ; version mobile dédiée | Réserver une table ; Voir la carte |
| Preuves clés | 3 à 4 repères factuels : fait maison si confirmé, terrasse, cocktails, événements, accessibilité. Ne pas revendiquer sans preuve. | Icônes sobres ou détails photo | Découvrir La Loge |
| L'expérience La Loge | 80 à 120 mots sur l'atmosphère, la cuisine et le quartier. Éviter le texte générique. | Triptyque : plat signature, cocktail, salle/terrasse | Découvrir la galerie |
| Extrait de carte | 4 à 6 plats/boissons représentatifs avec prix indicatifs, allergènes ou régime si disponibles, lien vers la carte complète. | Photos de 2 à 3 références réelles | Voir toute la carte |
| Déjeuner / soirée | Deux blocs adaptés aux usages : formule du midi et bar/cocktails du soir, seulement après validation de l'offre. | Plat du jour et cocktail/ambiance nocturne | Réserver le midi ; Réserver ce soir |
| Événements privés | Proposition concise pour groupes et privatisations, capacité à confirmer. | Groupe en contexte réel, sans visages identifiables sans autorisation | Organiser un événement |
| Avis | 2 ou 3 avis récents et autorisés, avec source, prénom/initiale et lien vers le profil Google Business. | Pas nécessaire ; logo Google discret si les conditions le permettent | Lire les avis |
| Accès express | Adresse, horaires, téléphone, aperçu de carte et repère « place des Célestins ». | Carte légère ou photo extérieure | Itinéraire ; Nous appeler |

**Règle éditoriale.** La réservation, l'adresse et les horaires du jour doivent être visibles dans le premier écran ou immédiatement accessibles, sans défilement prolongé.

### 5.2 Carte & menus

**Objectif.** Aider à choisir et rassurer sur l'offre, sans remplacer la carte en salle ni dépendre d'images illisibles.

| Section | Contenu et textes à préparer | Images nécessaires | CTA |
| --- | --- | --- | --- |
| Introduction | Texte court sur la cuisine et la saisonnalité. Date de dernière mise à jour de la carte. | Photo de plat signature | Réserver une table |
| Navigation par catégorie | Entrées, plats, burgers ou spécialités si confirmés, desserts, cocktails, boissons, formule midi. Catégories définitives selon la carte. | Optionnel | Aller à une catégorie |
| Carte HTML | Nom, description courte, prix, pictogrammes allergènes/régimes, supplément éventuel. Mention « selon disponibilité » si nécessaire. | Une photo par grande catégorie, pas une image par ligne | Réserver |
| Formules et menu du jour | Prix, contenu, disponibilité et jour de mise à jour. Prévoir un état « indisponible aujourd'hui » clair. | Photo du plat du jour réutilisable | Réserver pour le déjeuner |
| Allergènes et informations | Lien ou modal vers la liste complète, contact avant venue pour allergies sévères, avec validation réglementaire. | Aucune | Nous contacter |
| Version imprimable | PDF accessible et daté, complément facultatif à la version HTML. | Aucune | Télécharger le PDF |

**Exigence de contenu.** Toute carte doit être validée par le restaurant avant publication. Aucun plat, prix, mention « fait maison », allergène ou photo ne sera supposé.

### 5.3 Réservation

**Objectif.** Convertir le trafic en demande de réservation complète, sans promettre une disponibilité immédiate. Le client sait que sa demande sera examinée et confirmée, refusée ou suivie d'un rappel par le gérant.

| Section | Contenu et textes à préparer | Images nécessaires | CTA |
| --- | --- | --- | --- |
| En-tête | « Demandez votre réservation à La Loge, place des Célestins. » Rappel de l'adresse, des horaires et du délai de réponse annoncé. | Fond léger ou photo d'ambiance secondaire | — |
| Formulaire de demande | Nom, prénom, téléphone, e-mail, date souhaitée, heure souhaitée, nombre de personnes, message facultatif, occasion spéciale facultative (anniversaire, repas pro, groupe, autre), consentement RGPD. Les champs obligatoires sont explicitement signalés. | Aucune | Envoyer ma demande de réservation |
| Confirmation | Après envoi, message site non ambigu : « Votre demande a bien été envoyée. Elle est en attente de confirmation par La Loge. » E-mail de réception au client avec récapitulatif. | Aucune | Retour à l'accueil |
| Alternatives | Téléphone cliquable et indication pour les demandes de dernière minute. | Aucune | Appeler le restaurant |
| Groupes | Seuil de groupe à confirmer, lien vers la page Événements privés, délais de réponse et conditions. | Photo de table de groupe | Faire une demande de groupe |
| Informations utiles | Absence de confirmation immédiate, politique d'annulation/no-show si applicable, accessibilité, animaux, terrasse sous réserve de disponibilité. | Aucune | Voir les accès |

**Règle MVP.** Une demande déposée a le statut initial `nouvelle`. Elle ne vaut pas réservation confirmée. Le gérant est responsable du changement de statut et du contact avec le client. Le système ne rejette pas automatiquement une demande lorsque les seuils de capacité sont atteints : il affiche une alerte interne de surcharge.

### 5.3.1 Espace admin — réservations

**Objectif.** Donner au gérant une vue mobile et desktop simple pour traiter les demandes, sans l'exposer à un outil de planning complexe.

| Fonction | Comportement MVP attendu |
| --- | --- |
| Liste des demandes | Afficher les demandes avec date/heure souhaitées, nom, nombre de personnes, occasion, statut et indicateur de charge. Tri antéchronologique par défaut. |
| Filtres | Filtrer par date, statut et nom. Le résultat est lisible sur mobile. |
| Détail | Voir toutes les données de la demande, téléphone et e-mail inclus, le statut, les notes internes et les alertes de capacité. |
| Statuts | Seuls les statuts suivants sont disponibles : `nouvelle`, `en attente`, `confirmée`, `refusée`, `annulée`. Chaque changement est enregistré avec sa date. |
| Notes internes | Le gérant peut ajouter et modifier une note non visible du client : appel effectué, demande de rappel, contrainte de table, etc. |
| Capacité | Paramétrer le nombre maximum de couverts par service et, facultativement, le nombre maximum de demandes par créneau. Les paramètres déclenchent une alerte, jamais un refus automatique. |
| Vision de charge | Pour chaque date/créneau, afficher au minimum le total des couverts demandés et le nombre de demandes ; mettre en évidence les seuils dépassés. |
| Sécurité | Accès réservé aux comptes administrateurs authentifiés. Les données clients ne sont visibles que par les personnes habilitées. |

### 5.3.2 Espace admin — contenus

**Objectif.** Maintenir les informations commerciales à jour dans une interface structurée, sans transformer le site en page builder.

| Contenu administrable | Gestion MVP attendue |
| --- | --- |
| Accueil et présentation | Modifier les textes d'accueil et de présentation ; activer/désactiver les sections prévues. |
| Informations pratiques | Modifier horaires, adresse, téléphone, e-mail et liens réseaux sociaux. |
| Carte | Créer/modifier/supprimer les catégories et les plats ; gérer nom, description, prix, image et disponibilité. |
| Galerie | Ajouter, réordonner et retirer des images, avec texte alternatif obligatoire. |
| Événements/privatisations | Mettre à jour les textes, images, capacités et offres structurées validées. |
| SEO | Modifier les titles, meta descriptions et mots-clés locaux de chaque page dans les limites prévues par le formulaire. |
| Légal | Modifier les mentions légales validées. |
| Mise en page | Modifier les textes et images, activer/désactiver des sections et, si l'interface le permet sans risque, réordonner une liste limitée de sections. La structure et les composants restent fixes. |

### 5.4 Événements privés

**Objectif.** Générer des demandes qualifiées de groupes, entreprises et privatisations.

| Section | Contenu et textes à préparer | Images nécessaires | CTA |
| --- | --- | --- | --- |
| Promesse | Phrase claire sur les occasions accueillies : repas de groupe, anniversaire, afterwork, entreprise, etc. | Grande photo d'une table ou d'une soirée réelle | Demander un devis |
| Espaces et capacités | Terrasse/salle/bar, nombre de personnes assises et debout, jours ou créneaux possibles. Informations strictement confirmées. | 3 à 5 photos d'espaces en configuration réelle | Découvrir les espaces |
| Formules | Exemples de menus groupe, boissons, options végétariennes, modalités de personnalisation et fourchette de budget si souhaitée. | Détails de table, cocktails, plats à partager | Recevoir une proposition |
| Déroulé | Étapes : demande, réponse, devis, confirmation ; délai de réponse cible. | Aucune | Faire une demande |
| Formulaire qualifiant | Nom, entreprise facultative, date, nombre de convives, budget facultatif, type d'événement, téléphone, e-mail, message, consentement. | Aucune | Envoyer ma demande |

### 5.5 Galerie

**Objectif.** Prouver l'ambiance et la qualité par des images authentiques qui donnent envie de se projeter.

| Section | Contenu et textes à préparer | Images nécessaires | CTA |
| --- | --- | --- | --- |
| Introduction | Une phrase sur les moments : déjeuner, apéritif, soirée, terrasse, événements. | Image d'ouverture, différente de l'accueil | Réserver |
| Filtres | Le lieu ; À table ; Cocktails ; Terrasse ; Soirées/événements. | 20 à 35 images finales, optimisées et légendées | — |
| Réassurance | Texte bref : images représentatives, disponibilité des espaces et plats selon saison. | Aucune | Organiser un événement |

**Direction photo.** Utiliser exclusivement des photos récentes de La Loge. Les visages reconnaissables nécessitent une autorisation. Les photos de banque d'images ne doivent pas représenter le restaurant ou ses plats.

### 5.6 Contact & accès

**Objectif.** Répondre aux besoins pratiques et convertir les visiteurs mobiles en itinéraires, appels ou messages.

| Section | Contenu et textes à préparer | Images nécessaires | CTA |
| --- | --- | --- | --- |
| Coordonnées | Adresse normalisée, téléphone cliquable, e-mail professionnel, horaires par jour. | Façade ou repère extérieur | Itinéraire ; Appeler |
| Carte et itinéraires | Carte Google Maps intégrée après consentement ou carte statique légère avec lien. Lien Apple Plans / Google Maps possible sur mobile. | Carte légère / embed contrôlé | Ouvrir dans Maps |
| Venir à La Loge | Texte local : place des Célestins, transports, parking, vélo, accessibilité PMR. Données à confirmer. | Photo de façade et éventuellement plan simplifié | Préparer mon itinéraire |
| Contact général | Formulaire nom, e-mail, téléphone facultatif, objet, message, consentement ; accusé de réception et canal de traitement. | Aucune | Envoyer le message |
| Questions fréquentes | Terrasse, animaux, privatisation, horaires, allergies, groupes — seulement pour les réponses validées. | Aucune | Réserver |

### 5.7 Mentions légales, confidentialité et cookies

**Objectif.** Assurer la transparence légale et rendre les formulaires, outils tiers et mesures d'audience conformes au cadre applicable.

| Page/section | Contenu attendu | CTA |
| --- | --- | --- |
| Mentions légales | Éditeur, forme sociale, SIREN/SIRET, capital si applicable, adresse, directeur de publication, hébergeur, contact, propriété intellectuelle | Nous contacter |
| Politique de confidentialité | Finalités, base légale, données collectées, durée de conservation, destinataires, droits, contact, réclamation CNIL | Exercer mes droits |
| Cookies | Catégories, fournisseurs, durée, preuve/gestion du consentement, refus aussi simple que l'acceptation | Gérer mes choix |

Une validation par le responsable légal ou un conseil compétent est requise avant mise en ligne. Le site ne doit jamais publier de numéros fictifs.

## 6. Charte graphique proposée

### Direction créative : « Célestins, du déjeuner à la nuit »

Le territoire visuel doit évoquer un bar-restaurant urbain et chaleureux, vivant du midi au soir, sans tomber dans les codes du pub ni dans le minimalisme froid. L'emplacement place des Célestins autorise un registre centre-ville élégant mais accessible : matière, lumière chaude, bleu profond, détails cuivrés et photographie spontanée.

Cette proposition part du caractère « bar & food » du lieu et pourra évoluer après réception du logo, des photos et des goûts du client. Les tons bleus rapportés par des sources tierces peuvent inspirer la base de palette, mais ne doivent pas être considérés comme une identité définitive sans validation.

### Palette initiale

| Rôle | Couleur | Usage |
| --- | --- | --- |
| Nuit des Célestins | `#112A3A` | Fond principal sombre, header, sections du soir |
| Ivoire chaud | `#F6F0E7` | Fond clair, lisibilité, respiration |
| Ocre ambré | `#C88037` | CTA prioritaires, détails, accents chauds |
| Bordeaux doux | `#7D3341` | Accents secondaires, contenus événementiels, hover mesuré |
| Bleu brume | `#8FAFBD` | Surfaces secondaires, badges et détails visuels |
| Encre | `#1D1D1B` | Texte sur fond clair |

Les contrastes devront respecter au minimum WCAG AA pour tous les textes et contrôles. La couleur ne doit jamais être le seul moyen de transmettre une information.

### Typographies

- **Titres :** une serif éditoriale, élégante et lisible (ex. *DM Serif Display* ou *Fraunces*), pour donner du caractère sans imiter le bouchon traditionnel.
- **Texte courant et interface :** une sans-serif contemporaine (ex. *Inter*, *Manrope* ou *DM Sans*) pour la lisibilité sur mobile.
- **Chiffres/prix :** même sans-serif, avec graisse semi-bold et alignement rigoureux.
- Limiter à deux familles typographiques et quatre graisses pour préserver performance et cohérence.

### Composants et mise en page

| Élément | Règle proposée |
| --- | --- |
| Boutons | Rectangulaires légèrement arrondis (6 à 8 px), texte en capitales modérées ou casse phrase, état hover/focus visible. CTA primaire ocre sur fond bleu nuit ; secondaire contour ivoire ou bleu nuit selon le contexte. |
| Cartes | Fond ivoire ou bleu profond, bordure fine très discrète, rayon 12 px maximum, ombre douce et faible. Priorité à la photo et à la hiérarchie, pas d'effets décoratifs excessifs. |
| Navigation | Header compact, contraste élevé, CTA réservation distinct. Sticky sur desktop ; barre d'action basse sur mobile. |
| Grille | Mise en page 12 colonnes desktop, 6 tablette, 4 mobile ; espacements généreux ; largeur de lecture limitée pour les paragraphes. |
| Icônes | Trait simple et cohérent ; libellé textuel systématique pour les actions importantes. |
| Mouvements | Transitions courtes et discrètes ; respect de `prefers-reduced-motion`; aucun carrousel automatique. |

### Style photographique

- Lumière chaude et naturelle ou lumière de soirée maîtrisée ; couleurs gourmandes, contrastes profonds mais détails lisibles.
- Privilégier les scènes réelles : geste du bar, plats servis, détail de table, terrasse, salle animée, équipe au travail.
- Mixer plans larges pour situer, plans moyens pour l'ambiance et gros plans pour les produits.
- Éviter les images trop posées, les filtres très saturés, les images génériques et les photos sombres où l'offre est illisible.
- Prévoir au minimum : 1 hero horizontal, 1 hero mobile vertical, 4 photos de lieu, 8 plats, 6 cocktails/boissons, 4 moments de vie et 3 photos événements.

### Ton éditorial

- **Voix :** directe, accueillante, précise, urbaine et sans jargon gastronomique inutile.
- **Style :** phrases courtes, informations vérifiables, vocabulaire concret. Le site invite et informe ; il n'accumule pas les superlatifs.
- **Exemple :** « À deux pas de la place des Célestins, La Loge vous accueille pour déjeuner, partager un dîner ou prolonger la soirée autour d'un cocktail. »
- Éviter : « le meilleur », « incontournable », « incroyable » ou toute affirmation non démontrée.

### Références d'inspiration à utiliser comme principes, non comme modèles à copier

- Brasserie contemporaine : grande photographie, carte facile à lire, typographie éditoriale et détails matériels.
- Bar de quartier premium : lumière de soirée, cocktails mis en scène, réservation toujours accessible.
- Restaurant de centre-ville : information pratique immédiate, plan d'accès clair, contenus localisés et service de groupe structuré.

## 7. Fonctionnalités attendues

### Socle fonctionnel obligatoire

- CTA « Réserver une table » visible dans le header de toutes les pages, dans le hero de l'accueil et dans une barre fixe mobile.
- Page de demande de réservation avec formulaire exhaustif, alternatives téléphone et demande de groupe.
- Enregistrement de chaque demande en base de données avec statut initial `nouvelle`, date de création et historique minimal des changements de statut.
- E-mail automatique au gérant pour chaque nouvelle demande, et e-mail de réception au client indiquant que la demande est en attente de confirmation.
- Message de confirmation clair sur le site, sans jamais laisser entendre qu'une table est automatiquement réservée.
- Espace admin responsive de traitement des réservations : liste, filtres date/statut/nom, détail, coordonnées, notes internes, statut, alertes de capacité et vue de charge.
- Espace admin de contenus structurés : textes, informations pratiques, carte/menu, images, événements, SEO principal et mentions légales.
- Carte/menu HTML responsive, filtrable par catégorie si le volume le justifie, avec PDF optionnel.
- Formulaire de contact sécurisé, accusé de réception, protection anti-spam non intrusive et traitement conforme à la politique de confidentialité.
- Formulaire spécifique aux événements privés, avec les informations permettant de qualifier la demande.
- Horaires structurés, statut « ouvert / fermé » calculé avec le fuseau Europe/Paris, et exception manuelle pour les jours fériés/fermetures.
- Coordonnées cliquables : téléphone (`tel:`), e-mail (`mailto:`), itinéraire Google Maps/Apple Plans.
- Carte Google Maps chargée avec consentement lorsque requis ; solution de remplacement sans suivi avant consentement.
- Liens sociaux vérifiés (Instagram, Facebook, TikTok ou autres uniquement s'ils sont actifs) et partage Open Graph lors de l'envoi d'un lien.
- Galerie optimisée, légendée et accessible au clavier.
- Footer avec NAP complet, horaires, réservation, réseaux sociaux et liens légaux.
- Gestion de contenu volontairement contrainte : sections activables/désactivables, contenus et médias modifiables, ordre limité lorsque prévu ; aucun éditeur visuel libre.

### Qualité, sécurité et conformité

- Responsive de 320 px à grand écran, testé sur navigateurs mobiles récents, Safari iOS et Chrome Android.
- Accessibilité de base : navigation clavier, focus visible, contrastes AA, structure de titres, textes alternatifs utiles, formulaires étiquetés, messages d'erreur compréhensibles.
- Conformité RGPD : collecte minimale, consentement explicite pour les formulaires, bannière de consentement si traceurs non essentiels, politiques à jour.
- Sécurité : HTTPS, validation serveur des formulaires, limitation anti-spam, protection des données envoyées par e-mail, dépendances maintenues.
- Données de réservation : accès administratif authentifié, mots de passe stockés de manière sûre, droits limités, journal minimal des changements de statut et durée de conservation définie dans la politique de confidentialité.
- Suivi d'audience minimal et consentement préalable lorsque nécessaire. Prévoir Matomo ou GA4 selon la décision client, avec événements : clic réservation, clic téléphone, itinéraire, envoi contact, envoi événement.

## 8. SEO local Lyon

### Fondations on-page

- Une page = une intention principale, une balise `title`, une meta description, un H1 unique et une URL lisible.
- Utiliser naturellement les termes géographiques validés : **Lyon**, **Lyon 2**, **place des Célestins**, **Presqu'île**, **centre-ville de Lyon**. Mentionner Bellecour ou Vieux Lyon seulement si l'accès est réellement pertinent et présenté comme repère, non pour surcharger les mots-clés.
- Décrire précisément les offres confirmées : restaurant, bar, cocktails, terrasse, déjeuner, dîner, groupe, événement privé. Ne pas viser « bouchon lyonnais », « brunch » ou « rooftop » s'ils ne correspondent pas à l'offre.
- Publier une carte HTML indexable et des textes originaux ; aucune duplication des descriptions de plateformes tierces.
- Déployer sitemap XML, robots.txt, canonical, redirections si un ancien domaine est remplacé, Open Graph et image de partage.

### Propositions de balises initiales

| Page | Title proposé | Meta description proposée |
| --- | --- | --- |
| Accueil | `La Loge Bar & Food | Restaurant & cocktails place des Célestins, Lyon` | `La Loge Bar & Food vous accueille place des Célestins à Lyon pour déjeuner, dîner ou partager un cocktail. Consultez la carte et réservez votre table.` |
| Carte | `Carte & menus | La Loge Bar & Food, Lyon 2` | `Découvrez la carte de La Loge Bar & Food, restaurant place des Célestins à Lyon 2 : plats, formules et boissons selon la saison.` |
| Réservation | `Réserver une table | La Loge Bar & Food, Lyon` | `Réservez votre table à La Loge Bar & Food, place des Célestins à Lyon. Retrouvez nos horaires et nos coordonnées.` |
| Événements privés | `Privatisation & repas de groupe | La Loge Bar & Food, Lyon 2` | `Organisez un repas de groupe, un afterwork ou un événement privé à La Loge Bar & Food, place des Célestins à Lyon.` |
| Galerie | `Galerie | La Loge Bar & Food, restaurant et bar à Lyon` | `Découvrez La Loge Bar & Food en images : salle, terrasse, cuisine, cocktails et moments de vie place des Célestins à Lyon.` |
| Contact | `Contact & accès | La Loge Bar & Food, place des Célestins à Lyon` | `Horaires, téléphone, itinéraire et accès : retrouvez La Loge Bar & Food, place des Célestins dans le 2e arrondissement de Lyon.` |

Ces formulations sont des propositions de départ. Elles seront ajustées après validation du positionnement exact et contrôle des requêtes dans Google Search Console / Keyword Planner.

### Données structurées

Implémenter un JSON-LD de type `Restaurant` (et, si pertinent et validé, le sous-type de service approprié) avec notamment :

- nom commercial, URL canonique, logo et photos ;
- adresse postale normalisée, coordonnées géographiques et téléphone ;
- horaires, jours d'exception, fourchette de prix et devises ;
- `servesCuisine` uniquement pour les cuisines réellement proposées ;
- liens vers la carte (`hasMenu`), la réservation et les réseaux sociaux ;
- modalités d'accessibilité et paiements si confirmés ;
- avis agrégés seulement si éligibles et conformes aux règles de Google ; ne pas auto-déclarer une note non vérifiable.

Les données structurées doivent correspondre exactement au contenu visible et aux informations du Google Business Profile.

### Google Business Profile et citations locales

- Revendiquer/valider la fiche, la catégorie principale et les catégories secondaires pertinentes.
- Uniformiser strictement nom, adresse, téléphone et URL entre le site, la fiche Google, les réseaux, les plateformes de réservation et les annuaires. Résoudre explicitement la divergence d'adresse 7/9 rue Charles Dullin avant diffusion.
- Choisir la catégorie la plus précise reflétant l'activité principale ; ne pas multiplier les catégories sans pertinence.
- Mettre à jour horaires réguliers, jours fériés, téléphone, site, lien de réservation, menu et attributs (terrasse, accessibilité, etc.) avec données vérifiées.
- Ajouter régulièrement des photos authentiques et récentes, publier les événements utiles, répondre factuellement aux avis et encourager les avis sans contrepartie.
- Suivre les requêtes, clics site, appels, demandes d'itinéraire et réservations via les statistiques de la fiche et des liens UTM lorsque l'outil le permet.

## 9. Contraintes et proposition technique

### Stack retenue pour le futur développement

| Domaine | Choix proposé | Justification |
| --- | --- | --- |
| Framework | Next.js (App Router) | Pages performantes, rendu statique/serveur adapté au SEO, métadonnées et images gérés proprement |
| Langage | TypeScript | Réduction des erreurs et maintenance plus fiable |
| Styles | Tailwind CSS | Système de design rapide à appliquer, responsive et maintenable |
| Composants | Composants React sobres et réutilisables | Cohérence entre pages sans dépendances visuelles inutiles |
| Images | `next/image`, WebP/AVIF, dimensions définies, CDN si nécessaire | Bon LCP, poids réduit et affichage stable |
| Formulaires | Route serveur Next.js + prestataire e-mail transactionnel validé | Protection des secrets, validation, accusés de réception et traitement contrôlé |
| Base de données | PostgreSQL managé (Vercel Postgres, Neon ou équivalent à arbitrer) | Persistance fiable des demandes, contenus et paramètres de capacité |
| Accès aux données | ORM typé (Prisma ou Drizzle, à arbitrer) | Schéma maintenable, migrations contrôlées et validations côté serveur |
| Réservation | Formulaire de demande interne, statuts manuels et alertes de capacité | Aucun blocage automatique ; décision finale conservée au gérant |
| Administration | Interface Next.js protégée par authentification | Gestion responsive des demandes et contenus sans outil tiers opaque |
| Hébergement | Vercel | Déploiement simple, HTTPS, CDN et prévisualisations |
| Domaine & e-mail | Domaine propre + e-mail professionnelle | Crédibilité, indépendance vis-à-vis de la plateforme actuelle |

### Principes non négociables

- **Mobile first** : interface conçue d'abord pour le smartphone, puis enrichie pour tablette et desktop.
- **Performance** : objectif LCP inférieur à 2,5 s sur mobile en conditions réalistes, INP inférieur à 200 ms et CLS inférieur à 0,1 pour les pages clés ; validation avant publication.
- **Pas de dépendance opaque** : le contenu, le domaine, les images et les données de réservation restent sous contrôle du restaurant.
- **Contenu maintenable et borné** : les menus, horaires, informations pratiques, images, événements, SEO principal et mentions légales doivent être mis à jour sans modifier le code. L'interface admin est structurée ; elle ne permet pas de reconstruire la page, de créer des composants libres ou de dégrader le responsive.
- **Réservation humaine** : la capacité n'est qu'un indicateur de vigilance dans le MVP. Aucune règle ne confirme, ne refuse ou ne ferme automatiquement les demandes.
- **Environnements** : préproduction protégée, validation client, puis production ; sauvegarde du contenu et accès documentés.

## 10. Backlog produit initial

Priorités : **P1** indispensable au MVP et à la mise en ligne ; **P2** amélioration explicitement reportée après lancement.

| ID | Fonctionnalité | Priorité | Description | Critères d'acceptation |
| --- | --- | --- | --- | --- |
| F-01 | Architecture & navigation | P1 | Créer les pages de l'arborescence et la navigation principale. | Toutes les pages prévues sont accessibles ; menu fonctionnel au clavier et sur mobile. |
| F-02 | Identité visuelle | P1 | Décliner logo, palette, typographies et composants validés. | Maquette validée ; contrastes AA contrôlés ; composants cohérents sur toutes les pages. |
| F-03 | Hero d'accueil | P1 | Présenter promesse, lieu, horaires du jour et CTA. | En premier écran mobile : marque, lieu et CTA de demande lisibles. |
| F-04 | CTA réservation persistant | P1 | Rendre la demande de réservation accessible depuis toute page. | Visible header desktop et barre mobile ; liens fonctionnels et tracés. |
| F-05 | Formulaire de demande de réservation | P1 | Collecter toutes les données de demande validées et le consentement RGPD. | Tous les champs requis sont validés ; message site clair ; une demande ne vaut pas confirmation. |
| F-06 | Enregistrement et statuts | P1 | Enregistrer la demande avec statut `nouvelle` et historique minimal. | Demande persistée ; statuts limités aux cinq statuts définis ; aucune suppression implicite. |
| F-07 | E-mails réservation | P1 | Notifier le gérant et accuser réception au client. | Deux e-mails envoyés après une demande valide ; e-mail client indique « en attente de confirmation ». |
| F-08 | Admin réservations | P1 | Traiter les demandes dans un espace authentifié responsive. | Liste, filtres date/statut/nom, détail, coordonnées, statuts et notes internes fonctionnent. |
| F-09 | Alertes de capacité | P1 | Signaler les dates/créneaux chargés au gérant. | Limites de couverts/demandes modifiables ; alerte visible ; aucune demande bloquée automatiquement. |
| F-10 | Admin contenu | P1 | Gérer les contenus structurés du site. | Textes, infos pratiques, carte, galerie, événements, SEO et légal sont modifiables sans code. |
| F-11 | Carte HTML | P1 | Afficher plats, boissons, prix et informations confirmées. | Lisible à 320 px ; indexable ; date de mise à jour ; aucune carte uniquement en image. |
| F-12 | Horaires et statut | P1 | Afficher les horaires et le statut ouvert/fermé. | Fuseau Europe/Paris ; horaires identiques aux données validées ; exceptions éditables. |
| F-13 | Contact & accès | P1 | Adresse, clic téléphone, e-mail, carte et itinéraires. | Coordonnées cohérentes ; boutons appellent/ouvrent Maps sur mobile ; carte ne charge pas de traceur avant consentement si applicable. |
| F-14 | Formulaire de contact | P1 | Permettre les demandes générales. | Champs validés côté serveur ; anti-spam ; accusé de réception ; e-mail reçu par le contact défini. |
| F-15 | Mentions légales & RGPD | P1 | Publier données légales exactes, confidentialité et cookies. | Aucune donnée fictive ; liens footer ; consentement conforme pour traceurs non essentiels. |
| F-16 | SEO technique | P1 | Mettre en place métadonnées, canonical, sitemap, robots et indexation. | Une title/meta par page ; sitemap accessible ; absence d'erreurs critiques dans Search Console. |
| F-17 | Schema Restaurant | P1 | Publier les données structurées cohérentes. | Validation sans erreur dans l'outil de test ; NAP identique au site et à la fiche Google. |
| F-18 | Optimisation images | P1 | Compresser, recadrer et servir les visuels au bon format. | Images avec dimensions/alt ; pas de décalage visible ; score performance conforme aux objectifs. |
| F-19 | Page événements privés | P1 | Présenter les offres de groupe et convertir les demandes. | Capacités/offres validées ; formulaire qualifiant ; notification reçue et testée. |
| F-20 | Galerie | P1 | Mettre en scène le lieu avec photos authentiques. | Images optimisées ; légendes/alt utiles ; navigation clavier ; consentements de droit à l'image collectés. |
| F-21 | Avis clients | P1 | Afficher une sélection sourcée et un lien vers les avis. | Avis vérifiables, non modifiés de manière trompeuse ; mise à jour définie ; pas de données structurées abusives. |
| F-22 | Google Business Profile | P1 | Harmoniser et enrichir la fiche locale. | Adresse 7/9 résolue ; site/réservation/menu/horaire corrects ; photos et catégories revues. |
| F-23 | Gestion menu du jour | P1 | Permettre de publier le menu du midi sans déploiement. | Publication/modification possible par la personne désignée ; état indisponible clair. |
| F-24 | Accessibilité de recette | P1 | Vérifier les parcours essentiels. | Test clavier, contrastes, formulaires et lecteur d'écran de base documentés ; anomalies bloquantes corrigées. |
| F-25 | Analytics de conversion | P2 | Mesurer les demandes, appels, itinéraires et formulaires. | Événements contrôlés ; consentement respecté ; tableau de suivi documenté. |
| F-26 | Notifications SMS / WhatsApp / push | P2 | Ajouter des alertes complémentaires au gérant ou client. | Canal, consentement, coûts et règles validés ; e-mail reste le canal MVP. |
| F-27 | Disponibilités automatisées | P2 | Déduire automatiquement les créneaux et bloquer/valider une demande. | Règles de service, capacité et exceptions modélisées ; décision validée avant implémentation. |
| F-28 | Synchronisation Google Calendar | P2 | Synchroniser les réservations ou demandes avec un calendrier externe. | Sens de synchronisation, conflits et droits définis ; aucune perte de données. |
| F-29 | Édition avancée de disposition | P2 | Étendre le contrôle de l'ordre/des composants de page. | Contraintes responsive et accessibilité garanties ; aucun page builder libre non validé. |
| F-30 | FAQ pratique | P2 | Répondre aux questions récurrentes validées. | Réponses validées ; balisage accessible ; pas de contenu dupliqué inutile. |
| F-31 | Actualités / événements ponctuels | P2 | Publier soirées, menus spéciaux ou fermetures exceptionnelles. | Date d'expiration ; affichage non intrusif ; partage social correctement illustré. |

## 11. Contenus, actifs et validations nécessaires

Avant la production, le restaurant doit désigner une personne qui valide les textes, prix, photos, offres et informations légales. Aucun site de restaurant ne reste fiable si la carte et les horaires ne disposent pas d'un responsable de mise à jour.

| Élément | Responsable à définir | Format / niveau attendu |
| --- | --- | --- |
| Logo et éléments de marque | Client / graphiste | Vectoriel SVG, variantes clair/sombre, règles d'usage |
| Photos | Client / photographe | Fichiers haute définition, droits d'utilisation, légendes, personnes autorisées |
| Carte | Restaurant | Source éditable avec catégories, descriptions, prix, allergènes, date de validité |
| Horaires & fermetures | Restaurant | Horaires réguliers, exceptions annuelles, dernière validation |
| Réservation | Restaurant | E-mail destinataire, délai de réponse, créneaux proposés, règles de groupe/annulation et personne habilitée à traiter les demandes |
| Événements privés | Restaurant | Capacité, espaces, menus, prix/fourchettes, délai de réponse |
| Données légales | Dirigeant / conseil | Dénomination, SIREN/SIRET, adresse, responsable, hébergeur, politique applicable |
| Réseaux sociaux | Restaurant | Liens, accès administrateur si nécessaire, ligne éditoriale et personnes responsables |
| Google Business Profile | Restaurant | Propriété/accès, informations validées, photos et avis |

## 12. Questions à poser au client avant la suite

### Identité et positionnement

1. Quel est le nom commercial exact à afficher partout : « La Loge Bar & Food », « La Loge », ou une autre variante ?
2. Disposez-vous d'un logo vectoriel et d'une charte existante ? Quelles variantes sont autorisées ?
3. Quelles couleurs, matières ou ambiances souhaitez-vous conserver, éviter ou faire évoluer ?
4. Comment décririez-vous La Loge en une phrase, puis en trois mots ?
5. Quelle part de l'activité souhaitez-vous prioriser : déjeuner, dîner, cocktails, afterwork, privatisation, événements ?
6. Quelles sont vos spécialités réelles et différenciantes ? Les mentions « fait maison », « cuisine française », burgers, poissons et cocktails sont-elles exactes et toujours actuelles ?
7. Quel ton souhaitez-vous : convivial de quartier, élégant, festif, familial, gastronomique accessible, autre ?
8. Quels sites de restaurants, bars ou hôtels aimez-vous, et qu'appréciez-vous précisément chez eux ?

### Informations pratiques et offre

9. Quelle est l'adresse postale exacte et officielle ? Pourquoi certaines sources indiquent-elles 7 et d'autres 9 rue Charles Dullin ?
10. Quels sont les horaires exacts, la date d'effet et les fermetures exceptionnelles ? Êtes-vous fermé tous les dimanches et lundis ?
11. Quel numéro, e-mail professionnel et nom de domaine doivent être publiés ?
12. Quels services sont effectivement proposés : terrasse, climatisation, Wi-Fi, PMR, animaux, paiement titres-restaurant, espèces, chèques, cartes, sans contact ?
13. Quels transports, parkings, repères et conditions d'accessibilité faut-il indiquer ?
14. Quelle est la carte complète et à quelle fréquence change-t-elle ? Existe-t-il une carte boissons/cocktails distincte ?
15. Quels allergènes, options végétariennes/végétaliennes ou autres régimes doivent être renseignés ?
16. Le plat du jour et les formules midi sont-ils toujours proposés ? Qui les publie, à quel moment et jusqu'à quelle heure ?

### Réservation et événements

17. Quelle adresse e-mail reçoit les demandes de réservation et quel gérant (ou quelle équipe) est habilité à les traiter ?
18. Quel délai de réponse réaliste peut être annoncé au client après sa demande ?
19. Quels créneaux, tailles de table et délais de réservation souhaitez-vous proposer dans le formulaire ?
20. Quelles règles d'annulation, de retard, d'acompte ou de no-show doivent être affichées ?
21. À partir de combien de personnes une demande doit-elle être considérée comme un groupe ou un événement privé ?
22. Quel nombre maximum de couverts par service doit servir de seuil d'alerte ? Souhaitez-vous aussi une limite indicative de demandes par créneau ?
23. Quelles sont les capacités assises/debout de chaque espace, les créneaux et les contraintes sonores ?
24. Quels événements acceptez-vous (anniversaire, entreprise, afterwork, privatisation totale/partielle) ?
25. Existe-t-il des menus groupe, forfaits boissons, équipements (écran, musique, micro) ou minimums de consommation ?
26. Quels membres de l'équipe ont besoin d'un accès admin et quel niveau d'accès leur faut-il ?

### Photos, preuve sociale et réseaux

27. Quelles photos récentes sont disponibles, avec quels droits ? Souhaitez-vous organiser un shooting ?
28. Pouvez-vous fournir des photos de la façade, salle, terrasse, équipe, plats, cocktails et événements ?
29. Avez-vous l'autorisation écrite des personnes reconnaissables sur les photos existantes ?
30. Quels liens sociaux sont actifs et qui les administre ? Instagram, Facebook, TikTok, autre ?
31. Avez-vous accès au Google Business Profile ? Quelles informations, photos et réponses aux avis doivent être mises à jour ?
32. Souhaitez-vous afficher des avis clients ? Si oui, lesquels et à quelle fréquence seront-ils vérifiés ?

### Légal, technique et exploitation

33. Quelle est la dénomination juridique complète, forme, SIREN/SIRET, capital éventuel, adresse du siège, directeur de publication et contact légal ?
34. Disposez-vous d'une politique de confidentialité et de conditions liées aux demandes de réservation validées ? Quelle durée de conservation des demandes est retenue ?
35. Quel domaine détenez-vous ou souhaitez-vous réserver ? Qui en sera propriétaire et administrateur ?
36. Quelle adresse e-mail doit recevoir les formulaires et qui doit avoir accès aux comptes techniques ?
37. Souhaitez-vous mesurer l'audience et les conversions ? Quel outil est acceptable au regard de vos obligations RGPD ?
38. Qui mettra à jour les cartes, horaires, événements et photos après la mise en ligne ? Quel niveau d'autonomie est attendu ?
39. Quelle date de lancement cible, quel budget et quelles contraintes de saisonnalité doivent guider les priorités ?

## 13. Prochaines étapes de validation

1. Valider le positionnement, la direction visuelle et l'arborescence.
2. Répondre aux questions client et réunir les actifs/données listés ci-dessus.
3. Verrouiller adresse, horaires, offre, seuils indicatifs de capacité, e-mails destinataires et données légales.
4. Valider les contenus et lancer, seulement ensuite, la phase de conception UX/UI et de développement.

---

### Décisions bloquantes avant développement

- Adresse officielle unique et cohérente sur toutes les plateformes.
- Carte, tarifs, horaires et services validés.
- Workflow de demande de réservation, destinataires e-mail, délai de réponse, seuils d'alerte et politique groupes/annulation.
- Logo, direction créative et photos exploitables.
- Mentions légales complètes et contact professionnel.
- Responsable de la maintenance éditoriale après lancement.
