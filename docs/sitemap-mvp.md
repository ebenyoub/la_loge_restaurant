# Sitemap fonctionnel MVP — La Loge Bar & Food

**Portée :** routes publiques, navigation, CTA, maillage interne et données à valider.  
**Exclusion :** aucun composant, route Next.js, design, backend, image ou parcours P2 n'est créé par ce document.

## Arborescence publique MVP

```text
/
├── /carte
├── /reservation
├── /contact
└── /mentions-legales
```

Les pages Événements privés, Galerie, Avis clients et le statut dynamique ouvert/fermé sont hors MVP. Elles ne doivent apparaître ni dans la navigation ni dans le maillage public de cette version.

## Routes

### `/` — Accueil

| Élément | Définition MVP |
| --- | --- |
| Objectif | Faire découvrir le restaurant, son emplacement place des Célestins et son offre générale. |
| CTA principal | `Voir la carte` → `/carte` |
| CTA secondaire | `Demander une réservation` → `/reservation` ; `Contact & accès` → `/contact`. |
| Liens entrants | Domaine nu, logo depuis toutes les pages, liens externes (Google Business Profile, réseaux sociaux), e-mails éventuels. |
| Liens sortants | `/carte`, `/reservation`, `/contact`, `/mentions-legales` via footer. |
| Données client à valider | Accroche, présentation, horaires du jour, adresse officielle, téléphone, services réellement proposés, éléments de carte mis en avant, textes d'accès. |

### `/carte` — Carte & menus

| Élément | Définition MVP |
| --- | --- |
| Objectif | Permettre de consulter une carte claire, structurée et à jour. |
| CTA principal | `Demander une réservation` → `/reservation` |
| CTA secondaire | `Nous contacter` → `/contact`, notamment pour une question allergène. |
| Liens entrants | `/`, header, lien direct issu des résultats de recherche, footer. |
| Liens sortants | `/reservation`, `/contact`, `/mentions-legales` via footer. |
| Données client à valider | Catégories, noms, descriptions, prix, disponibilité, formules, menu du jour, allergènes, date de mise à jour et éventuelle version PDF. |

### `/reservation` — Demande de réservation

| Élément | Définition MVP |
| --- | --- |
| Objectif | Envoyer une demande de réservation complète, clairement indiquée comme en attente de confirmation. |
| CTA principal | `Envoyer ma demande de réservation` → envoi du formulaire ; aucun changement de route requis dans le MVP. |
| CTA secondaire | `Appeler le restaurant` → lien téléphone pour les demandes urgentes. |
| Liens entrants | `/`, `/carte`, header, barre d'action mobile, footer. |
| Liens sortants | État de confirmation sur la même page ; lien de retour vers `/` et lien pratique vers `/contact`. |
| Données client à valider | Créneaux proposés, délai de réponse, seuil de groupe, règles d'annulation/no-show, destinataire e-mail, texte de consentement RGPD, politique de confidentialité et coordonnées exactes. |

### `/contact` — Contact & accès

| Élément | Définition MVP |
| --- | --- |
| Objectif | Contacter ou trouver le restaurant. |
| CTA principal | `Ouvrir dans Maps` → itinéraire externe vers l'adresse validée. |
| CTA secondaire | `Appeler le restaurant` → lien téléphone ; action locale du formulaire : `Envoyer le message`. |
| Liens entrants | `/`, header, footer, Google Business Profile, résultat de recherche local. |
| Liens sortants | `/reservation`, `/mentions-legales` via footer, lien Maps externe, téléphone et e-mail. |
| Données client à valider | Adresse officielle unique, téléphone, e-mail, horaires, URL/coordonnées Google Maps, texte d'accès et destinataire du formulaire de contact. |

### `/mentions-legales` — Mentions légales

| Élément | Définition MVP |
| --- | --- |
| Objectif | Mettre à disposition les informations légales et de transparence. |
| CTA principal | Aucun CTA commercial ; action principale : naviguer dans le sommaire par ancres. |
| CTA secondaire | Ancres `Confidentialité` et `Cookies` dans cette même page. |
| Liens entrants | Footer de toutes les pages ; liens placés près des formulaires et du consentement si nécessaire. |
| Liens sortants | Ancres légales de la même page et retour au footer. |
| Données client à valider | Dénomination, forme sociale, SIREN/SIRET, siège, capital si applicable, responsable de publication, hébergeur, e-mail légal, politique de confidentialité et durée de conservation des données. |

## Navigation globale

### Header desktop

```text
[Logo → /]     [Carte → /carte] [Contact → /contact]     [Demander une réservation → /reservation]
```

- Le logo est le seul lien vers l'accueil.
- `Carte` et `Contact` sont les deux entrées de navigation éditoriale MVP.
- `Demander une réservation` est l'unique CTA principal du header et reste visuellement distinct.
- Les mentions légales restent accessibles uniquement depuis le footer pour ne pas distraire de la navigation principale.

### Header mobile

```text
[Logo → /]                                      [Menu]

Menu : Carte · Contact
Barre basse fixe : [Demander une réservation → /reservation] [Appeler → tel:]
```

- La barre basse est présente sur les pages commerciales (`/`, `/carte`, `/reservation`, `/contact`) ; elle n'est pas nécessaire sur `/mentions-legales`.
- Le bouton d'appel est une action directe, pas une route supplémentaire.
- Le CTA réservation ouvre toujours `/reservation` : il ne promet pas de disponibilité immédiate.

### Footer

```text
La Loge Bar & Food
Adresse → /contact · Horaires · Téléphone · E-mail
Carte → /carte · Demander une réservation → /reservation
Mentions légales, confidentialité et cookies → /mentions-legales
```

- L'adresse renvoie à `/contact` ; l'itinéraire reste une action externe depuis cette page.
- Les horaires et coordonnées reprennent les données validées par le client.
- Les réseaux sociaux ne sont ajoutés que si les comptes actifs sont confirmés.

## Maillage interne MVP

| Origine | Lien | Destination | Intention utilisateur |
| --- | --- | --- | --- |
| Accueil | Voir la carte | `/carte` | Découvrir l'offre avant de choisir. |
| Accueil | Demander une réservation | `/reservation` | Envoyer une demande de table. |
| Accueil | Contact & accès | `/contact` | Préparer la venue ou joindre le restaurant. |
| Carte | Demander une réservation | `/reservation` | Réserver après consultation de la carte. |
| Carte | Nous contacter | `/contact` | Poser une question sur l'offre ou les allergènes. |
| Contact | Demander une réservation | `/reservation` | Basculer vers le parcours de demande de table. |
| Toutes les pages | Logo | `/` | Retour à la découverte du restaurant. |
| Footer | Mentions légales | `/mentions-legales` | Accéder aux informations réglementaires. |

## Données client manquantes avant implémentation

### Communes à toutes les routes

- Adresse officielle unique : divergence actuelle 7/9 rue Charles Dullin à résoudre.
- Téléphone, e-mail professionnel, horaires réguliers et fermetures exceptionnelles.
- Logo exploitable et confirmation des droits sur les photos disponibles.
- Liens actifs vers les réseaux sociaux, si leur affichage est retenu.

### Carte

- Carte complète et à jour : catégories, plats, descriptions, prix, disponibilités, formules et allergènes.
- Règle de mise à jour du menu du jour et responsable de publication.

### Réservation et contact

- Créneaux sélectionnables, seuil de groupe, délai de réponse et règles d'annulation/no-show.
- Adresse e-mail qui reçoit les demandes et personne chargée de les traiter.
- Texte de consentement et durée de conservation des demandes et messages.
- URL Google Maps ou coordonnées exactes de l'établissement.

### Mentions légales

- Informations juridiques complètes et validées ; aucune donnée fictive.
- Contenu approuvé de la politique de confidentialité et de la gestion des cookies.

## Conditions de passage à l'implémentation

1. Valider l'adresse et les coordonnées uniques.
2. Valider la navigation, les CTA et le maillage ci-dessus.
3. Fournir les données nécessaires à chaque page.
4. Valider les règles de réservation et les textes juridiques avant le développement des formulaires.
