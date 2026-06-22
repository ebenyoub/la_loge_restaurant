# Guide de contribution — La Loge Bar & Food

## Lecture obligatoire avant toute tâche

Vous devez impérativement lire les documents suivants dans l'ordre :
1. [AGENTS.md](file:///Users/ebenyoub/Developer/loge_restaurant/AGENTS.md)
2. [PROJECT_STATE.md](file:///Users/ebenyoub/Developer/loge_restaurant/PROJECT_STATE.md)
3. [TASKS.md](file:///Users/ebenyoub/Developer/loge_restaurant/TASKS.md)
4. [TODO.md](file:///Users/ebenyoub/Developer/loge_restaurant/TODO.md)
5. [product-backlog.md](file:///Users/ebenyoub/Developer/loge_restaurant/product-backlog.md)

## Méthode de travail

### Une seule tâche à la fois
Respectez le cycle suivant :
Analyse → Validation → Développement → Vérification → Documentation → Commit

### Gestion du backlog
- **Respect du backlog :** Suivre strictement l'ordonnancement et les spécifications du backlog produit.
- **Périmètre du MVP :** Ne pas dériver ou étendre le périmètre des fonctionnalités sans décision explicite validée et documentée.
- **Priorisation (P1 / P2) :** Traiter en priorité absolue les fonctionnalités P1 (obligatoires pour le lancement). Les tickets ou améliorations P2 sont systématiquement différés après la mise en ligne.

### Git et Commit
- **Aucun commit automatique**
- **Aucun push automatique**
- À la fin de chaque tâche :
  - Lister les fichiers modifiés.
  - Lister les tests exécutés.
  - Proposer un message de commit.
  - Attendre la validation humaine avant tout commit ou push.

### Review obligatoire avant commit
Avant de soumettre une modification pour validation :
- Effectuer un `git diff` complet pour vérifier chaque ligne de code ajoutée ou modifiée.
- S'assurer que seuls les fichiers requis par la tâche en cours sont modifiés.
- Nettoyer tout code de diagnostic temporaire, console.log superflu ou commentaire expérimental.
- Valider le respect strict des conventions de formatage et de typage du projet.
- Présenter les risques connus, limitations restantes ou éléments à revalider.

### Documentation
Toute évolution doit synchroniser les fichiers suivants :
- [PROJECT_STATE.md](file:///Users/ebenyoub/Developer/loge_restaurant/PROJECT_STATE.md)
- [TASKS.md](file:///Users/ebenyoub/Developer/loge_restaurant/TASKS.md)
- [TODO.md](file:///Users/ebenyoub/Developer/loge_restaurant/TODO.md)
- [product-backlog.md](file:///Users/ebenyoub/Developer/loge_restaurant/product-backlog.md)
- [decisions.md](file:///Users/ebenyoub/Developer/loge_restaurant/decisions.md)

### Validation par type de tâche
- **Refactorisation interne (sans changement fonctionnel) :**
  - `npm run lint`
  - `npm run build`
- **Fonctionnalité isolée :**
  - `npm run lint`
  - `npm run build`
  - Tests ciblés uniquement
- **Backend / Auth / API :**
  - `npm run lint`
  - `npm run build`
  - Tests backend
  - Tests concernés (E2E suite)
- **Avant déploiement :**
  - Validation complète (lint, build, tests backend et E2E complets)

## Architecture Frontend

### Principes Généraux
- **Les pages orchestrent :** elles ne contiennent pas de logique métier complexe.
- La logique métier vit dans :
  - `hooks/`
  - `services/`
  - `lib/`
- Les types vivent dans :
  - `types.ts`

### Standards de Formulaire (RHF + Zod)
- **React Hook Form :** Tous les formulaires doivent utiliser React Hook Form pour la gestion de leur état.
- **Validation Zod :** Toutes les validations de saisie doivent être définies à l'aide de schémas Zod.
- **Centralisation des schémas :** Les schémas Zod doivent être centralisés dans `src/lib/validation/` (ou localement si spécifique à une feature).
- **Hooks de formulaires :** Chaque formulaire doit posséder son hook dédié (ex: `useXxxForm`) pour séparer la logique de l'affichage.
- **Découpage des champs :** Les champs doivent être découpés en composants réutilisables lorsque cela apporte de la valeur et s'intégrer avec les primitives `src/components/ui/`.
- **Pages orchestratrices :** Les pages doivent rester des orchestrateurs et contenir le moins de logique métier possible.
- **Nouveaux formulaires :** Toute nouvelle fonctionnalité de formulaire doit respecter strictement ce standard.

### Taille des pages
- **250 lignes :** la page est candidate à une refactorisation.
- **400 lignes :** la taille doit être justifiée.

### Structure recommandée pour une fonctionnalité
```
feature/
├── page.tsx
├── components/
├── hooks/
├── services/
└── types.ts
```

### UI Foundation
Tous les composants génériques réutilisables vont dans :
`src/components/ui/`

Composants existants dans la fondation :
- `Alert`
- `Button`
- `Card`
- `Checkbox`
- `Container`
- `Input`
- `Section`
- `Select`
- `Textarea`

### Règles de Refactorisation
Ne jamais refactoriser tout le projet d'un coup. Procédez par étapes :
1. Fondation
2. Migration d'une feature
3. Validation
4. Commit
5. Feature suivante

## Règles Métier & Réseau

### Images & Médias
- Concevoir mobile-first, accessible au clavier et avec des images optimisées.
- **Ne jamais intégrer** une image de `public/images/imported/` sans validation écrite des droits par le client.

### Hors périmètre (Ne pas développer)
- Ne pas créer de page builder, de réservation ou blocage automatique de capacité.
- Ne pas synchroniser de calendrier (ex. Google Calendar).
- Ne pas intégrer de captcha ou de rate limiting (sauf instruction explicite).
- Aucun e-mail de changement de statut ou de déploiement automatique.

### Diagnostics de Réseau Local
Les comportements observés liés au réseau (hotspot iPhone, réseau local, Next.js dev server, HMR) sont considérés comme des diagnostics d'environnement temporaires.
**Ne jamais intégrer** un correctif permanent dans le codebase sans une preuve reproductible et validée.
