# Wireframes basse fidélité — pages publiques

**Périmètre :** Accueil, Carte, Réservation, Contact et Mentions légales.  
**Niveau :** document de structure historique. La direction graphique courante est la capture Figma fournie par le client ; elle prévaut sur ces wireframes lorsqu'il y a conflit.

## Principes communs

### Navigation globale

```text
┌───────────────────────────────────────────────────────────────────┐
│ LOGO                  Carte   Contact  [Demander une réservation] │
└───────────────────────────────────────────────────────────────────┘
```

- Header visible sur toutes les pages publiques.
- Le CTA principal ouvre la page **Réservation** et emploie partout le libellé « Demander une réservation », avec la précision visible que la demande est à confirmer.
- Sur mobile : menu compact accessible avec cible tactile suffisante. Les actions d'appel ou d'itinéraire dépendent des coordonnées validées.

### Footer global

```text
┌───────────────────────────────────────────────────────────────────┐
│ La Loge Bar & Food     Horaires         Contact / Accès            │
│ Adresse                Téléphone        Réseaux sociaux            │
│ Mentions légales (confidentialité et cookies inclus)                │
└───────────────────────────────────────────────────────────────────┘
```

Le footer répond aux besoins pratiques sans forcer le visiteur à chercher une autre page : adresse, téléphone, horaires, réservation et liens légaux.

### Règles de hiérarchie

1. Le premier écran répond à l'intention de la page.
2. Une page présente un CTA principal unique ; les actions secondaires restent visuellement moins prioritaires.
3. Les informations non confirmées (carte, horaires exceptionnels et mentions légales) ne sont pas représentées comme définitives dans les wireframes.
4. Le mobile conserve le même ordre de décision que le desktop : comprendre → choisir → agir.

---

## 1. Accueil `/`

### Objectif utilisateur

**Objectif principal MVP :** découvrir le restaurant et son univers.

### Wireframe

```text
┌───────────────────────────────────────────────────────────────────┐
│ HEADER : logo · navigation · CTA demande de réservation            │
├───────────────────────────────────────────────────────────────────┤
│ HERO                                                              │
│ [Média d'ambiance]                                                 │
│ Restaurant & bar à cocktails, place des Célestins                  │
│ Cuisine / moment de vie / promesse courte                          │
│ Horaires du jour                                                    │
│ [Voir la carte]                    [Demander une réservation]     │
├───────────────────────────────────────────────────────────────────┤
│ REPÈRES CLÉS                                                      │
│ [Terrasse*] [Cocktails*] [Déjeuner*]                               │
├───────────────────────────────────────────────────────────────────┤
│ L'EXPÉRIENCE LA LOGE                                               │
│ Texte de présentation court            [Média lieu / plat / bar] │
├───────────────────────────────────────────────────────────────────┤
│ EXTRAIT DE CARTE                                                   │
│ [Catégorie / plat / prix] [Catégorie / plat / prix]               │
│ [Catégorie / plat / prix] [Catégorie / plat / prix]               │
│                                              [Voir toute la carte] │
├───────────────────────────────────────────────────────────────────┤
│ DÉJEUNER                         | SOIRÉE                         │
│ Formule / offre du midi*          | Bar / cocktails*               │
│ [Demander une réservation]        | [Demander une réservation]    │
├───────────────────────────────────────────────────────────────────┤
│ ACCÈS EXPRESS                                                      │
│ Adresse · horaires · téléphone            [Aperçu de carte]       │
│ [Contact & accès] [Itinéraire] [Appeler]                           │
├───────────────────────────────────────────────────────────────────┤
│ FOOTER                                                            │
└───────────────────────────────────────────────────────────────────┘
```

`*` Les repères et offres ne sont affichés qu'après validation des informations par le restaurant.

### Priorité des contenus

| Niveau | Contenu | Rôle |
| --- | --- | --- |
| 1 | Promesse, place des Célestins, horaires du jour | Faire découvrir le restaurant immédiatement |
| 2 | Expérience, extrait de carte, déjeuner/soirée | Donner envie et permettre d'approfondir |
| 3 | Accès express | Répondre au besoin pratique sans détourner l'objectif principal |

### Parcours utilisateur

```text
Recherche Google / lien social
        ↓
Hero : découvrir le lieu et ses horaires du jour
        ├── Approfondir l'offre → Voir la carte → Carte
        ├── Prendre une table → Demander une réservation → Réservation
        └── Préparer sa venue → Itinéraire / Appeler → Contact
```

---

## 2. Carte `/carte`

### Objectif utilisateur

**Objectif principal MVP :** consulter une offre lisible, à jour et structurée.

### Wireframe

```text
┌───────────────────────────────────────────────────────────────────┐
│ HEADER                                                            │
├───────────────────────────────────────────────────────────────────┤
│ INTRODUCTION                                                      │
│ Carte & menus                                                      │
│ Texte court sur la cuisine / saisonnalité                          │
│ Mise à jour : [date]                 [Demander une réservation]   │
├───────────────────────────────────────────────────────────────────┤
│ NAVIGATION PAR CATÉGORIE                                          │
│ [Entrées] [Plats] [Desserts] [Cocktails] [Boissons] [Midi]        │
├───────────────────────────────────────────────────────────────────┤
│ CATÉGORIE 1                                                       │
│ Nom de catégorie                                                   │
│ Plat · description courte · allergènes/régime · prix               │
│ Plat · description courte · allergènes/régime · prix               │
│ Plat · indisponible si concerné · prix                             │
├───────────────────────────────────────────────────────────────────┤
│ CATÉGORIE 2                                                       │
│ …                                                                  │
├───────────────────────────────────────────────────────────────────┤
│ FORMULES / MENU DU JOUR                                           │
│ Contenu · prix · disponibilité · date                              │
│ État explicite si indisponible       [Demander une réservation]    │
├───────────────────────────────────────────────────────────────────┤
│ ALLERGÈNES ET INFORMATIONS                                        │
│ Lien vers le détail · message de précaution        [Nous contacter]│
├───────────────────────────────────────────────────────────────────┤
│ ACTION DE FIN DE PAGE                                             │
│ Une table vous intéresse ?                [Demander une réservation]│
│ [Version imprimable PDF — facultatif]                              │
├───────────────────────────────────────────────────────────────────┤
│ FOOTER                                                            │
└───────────────────────────────────────────────────────────────────┘
```

### Hiérarchie de lecture

1. Identifier la catégorie recherchée sans défilement excessif.
2. Lire le plat, son prix et les informations utiles dans une même ligne/bloc.
3. Comprendre si l'offre est disponible aujourd'hui.
4. Envoyer une demande de réservation quand le choix est fait.

### Parcours utilisateur

```text
Accueil / résultat « menu restaurant Lyon »
        ↓
Choix d'une catégorie
        ↓
Consultation de l'offre et des informations allergènes
        ↓
Demander une réservation  ──→  Réservation
        └── Question spécifique ──→ Contact
```

---

## 3. Réservation `/reservation`

### Objectif utilisateur

**Objectif principal MVP :** envoyer une demande complète et comprendre immédiatement qu'elle reste en attente de confirmation par le restaurant.

### Wireframe — état initial

```text
┌───────────────────────────────────────────────────────────────────┐
│ HEADER                                                            │
├───────────────────────────────────────────────────────────────────┤
│ INTRODUCTION                                                      │
│ Demandez votre réservation                                        │
│ Adresse · horaires · délai de réponse annoncé                     │
│ « Votre demande sera confirmée par La Loge. »                     │
├───────────────────────────────────────────────────────────────────┤
│ FORMULAIRE                                                        │
│ Identité                                                          │
│ [Nom*] [Prénom*]                                                  │
│ [Téléphone*] [E-mail*]                                            │
│                                                                   │
│ Demande                                                           │
│ [Date souhaitée*] [Heure souhaitée*]                              │
│ [Nombre de personnes*]                                            │
│ [Occasion spéciale : — / anniversaire / repas pro / groupe / autre]│
│ [Message facultatif]                                              │
│ [ ] Consentement RGPD*                                            │
│                                                                   │
│                  [Envoyer ma demande de réservation]              │
├───────────────────────────────────────────────────────────────────┤
│ BESOIN IMMÉDIAT ?                                                 │
│ Pour une demande de dernière minute : [Appeler le restaurant]     │
│ INFORMATIONS UTILES                                               │
│ Pas de confirmation immédiate · annulation* · accès* · terrasse*  │
│ [Voir les accès]                                                  │
├───────────────────────────────────────────────────────────────────┤
│ FOOTER                                                            │
└───────────────────────────────────────────────────────────────────┘
```

### Wireframe — état après envoi valide

```text
┌───────────────────────────────────────────────────────────────────┐
│ HEADER                                                            │
├───────────────────────────────────────────────────────────────────┤
│ DEMANDE ENREGISTRÉE                                               │
│ Votre demande a bien été envoyée.                                 │
│ Elle est en attente de confirmation par La Loge.                  │
│ Un e-mail récapitulatif a été envoyé à [adresse client].          │
│ [Retour à l'accueil]             [Voir les accès]                 │
├───────────────────────────────────────────────────────────────────┤
│ FOOTER                                                            │
└───────────────────────────────────────────────────────────────────┘
```

### Hiérarchie et comportement attendu

- Le formulaire occupe la zone principale et ne partage pas l'écran avec des contenus promotionnels concurrents.
- Les champs sont regroupés par intention : identité puis demande.
- Les champs obligatoires et le consentement sont visibles avant l'action d'envoi.
- Les messages d'erreur doivent rester proches de leur champ ; le message final ne doit jamais être confondu avec une confirmation de table.
- Sur mobile, les champs sont empilés ; le bouton d'envoi reste pleinement visible après le dernier champ.

### Parcours utilisateur

```text
Accueil / Carte / CTA global
        ↓
Lire « en attente de confirmation »
        ↓
Renseigner identité + demande + consentement
        ↓
Envoyer la demande
        ↓
Écran de réception + e-mail récapitulatif
        ↓
Le gérant traite ensuite la demande hors du parcours public
```

---

## 4. Contact & accès `/contact`

### Objectif utilisateur

**Objectif principal MVP :** contacter ou trouver le restaurant.

### Wireframe

```text
┌───────────────────────────────────────────────────────────────────┐
│ HEADER                                                            │
├───────────────────────────────────────────────────────────────────┤
│ CONTACT & ACCÈS                                                   │
│ La Loge Bar & Food · place des Célestins                          │
├───────────────────────────────────────────────────────────────────┤
│ CONTACTS IMMÉDIATS                                                │
│ Adresse              Téléphone             E-mail                 │
│ [Itinéraire]         [Appeler]             [Écrire]               │
├───────────────────────────────────────────────────────────────────┤
│ HORAIRES                                                          │
│ Tableau jour par jour · exceptions*                                │
├───────────────────────────────────────────────────────────────────┤
│ CARTE ET VENIR À LA LOGE                                           │
│ [Carte / aperçu statique avec consentement si nécessaire]         │
│ [Ouvrir dans Maps]                                                │
├───────────────────────────────────────────────────────────────────┤
│ FORMULAIRE DE CONTACT                                             │
│ [Nom*] [E-mail*] [Téléphone facultatif]                           │
│ [Objet*]                                                          │
│ [Message*]                                                        │
│ [ ] Consentement RGPD*                                            │
│                                                [Envoyer le message]│
├───────────────────────────────────────────────────────────────────┤
│ FOOTER                                                            │
└───────────────────────────────────────────────────────────────────┘
```

### Hiérarchie de lecture

| Niveau | Contenu | Action attendue |
| --- | --- | --- |
| 1 | Adresse, téléphone, e-mail et carte | Contacter ou rejoindre le restaurant |
| 2 | Horaires | Préparer le déplacement |
| 3 | Formulaire | Poser une question non urgente |

### Parcours utilisateur

```text
Recherche locale / footer / lien Google Business
        ↓
Adresse + horaires
        ├── Se déplacer → Ouvrir dans Maps
        ├── Question urgente → Appeler
        ├── Question générale → Formulaire de contact
        └── Besoin d'une table → Demander une réservation
```

---

## 5. Mentions légales `/mentions-legales`

### Objectif utilisateur

**Objectif principal MVP :** trouver les informations légales et de transparence.

### Wireframe

```text
┌───────────────────────────────────────────────────────────────────┐
│ HEADER COMPACT : logo · retour aux pages principales · réservation │
├───────────────────────────────────────────────────────────────────┤
│ FIL D'ARIANE                                                      │
│ Accueil / Mentions légales                                        │
├───────────────────────────────────────────────────────────────────┤
│ TITRE                                                             │
│ Mentions légales                                                  │
│ Dernière mise à jour : [date]                                    │
├───────────────────────┬───────────────────────────────────────────┤
│ SOMMAIRE / ANCRES      │ CONTENU                                  │
│ - Éditeur              │ 1. Éditeur du site                       │
│ - Publication          │ 2. Responsable de publication            │
│ - Hébergement          │ 3. Hébergement                           │
│ - Propriété            │ 4. Propriété intellectuelle              │
│ - Contact              │ 5. Contact                               │
│ - Confidentialité      │ 6. Confidentialité                        │
│ - Cookies              │ 7. Cookies                                │
├───────────────────────┴───────────────────────────────────────────┤
│ SECTIONS DE LA PAGE                                                 │
│ [Confidentialité] [Cookies]                                        │
├───────────────────────────────────────────────────────────────────┤
│ FOOTER                                                            │
└───────────────────────────────────────────────────────────────────┘
```

### Hiérarchie et comportement attendu

- Le texte légal est structuré par titres, non présenté comme un bloc unique.
- Les données sont uniquement celles validées par le restaurant : aucune valeur fictive, notamment pour les numéros d'immatriculation.
- Sur mobile, le sommaire devient une liste d'ancres horizontale ou un bloc placé avant le contenu.
- La confidentialité et les cookies sont des sections de cette page, accessibles par ancres depuis le sommaire et le footer.

### Parcours utilisateur

```text
Footer / formulaire / bannière cookies
        ↓
Mentions légales
        ├── Identité et contact de l'éditeur
        ├── Section confidentialité
        └── Section cookies
```

---

## Parcours prioritaires transverses

| Intention | Point d'entrée | Chemin minimal | Fin attendue |
| --- | --- | --- | --- |
| Demander une réservation | Accueil, Carte, header, barre mobile | CTA → Réservation → formulaire | Demande envoyée, en attente de confirmation |
| Choisir avant de venir | Recherche locale, Accueil | Accueil → Carte → Réservation | Demande envoyée ou retour à l'accès |
| Venir sur place | Google Business, Contact, footer | Contact → itinéraire / appel | Ouverture de Maps ou appel |
| Poser une question | Contact, footer | Contact → formulaire | Message envoyé |
| Vérifier une donnée légale | Footer, consentement formulaire | Mentions légales → section concernée | Information consultée |

## Éléments reportés hors MVP

- Page et demandes dédiées aux **événements privés**.
- **Galerie** publique et administration de galerie.
- Bloc et gestion des **avis clients**.
- Indicateur dynamique **« ouvert / fermé »** calculé selon l'heure ; le MVP affiche les horaires du jour uniquement.

## Validation requise avant maquette graphique

- Adresse officielle, horaires, téléphone, e-mail et informations d'accès.
- Intitulé exact du CTA de réservation et délai de réponse à afficher.
- Catégories et données de la carte, y compris disponibilité et allergènes.
- Services réellement proposés pour le MVP (terrasse, animaux, accessibilité et formules).
- Mentions légales, politique de confidentialité et durée de conservation des données.
