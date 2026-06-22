# Pilotage des tâches — La Loge Bar & Food

## Tâche en cours

Ajout des tests E2E publics Playwright (carte, formulaires contact/réservation, validation horaires/jours fermés, burger mobile) — terminée.

## Règles de travail

1. Lire `AGENTS.md`, `PROJECT_STATE.md`, `TODO.md` et ce fichier avant une tâche.
2. Respecter le périmètre demandé ; ne pas modifier Prisma, migrations, backend ou e-mails lorsqu'ils sont hors demande.
3. Pour une modification applicative, exécuter au minimum `npm run lint` et `npm run build`; exécuter `npm run test:e2e` si le parcours public ou admin est impacté.
4. Ne jamais créer de commit automatique. Présenter l'état du diff et attendre une validation humaine.
5. Mettre à jour `PROJECT_STATE.md`, `TODO.md`, `decisions.md` et `product-backlog.md` lorsqu'une décision ou le périmètre change.

## Historique récent

- [x] Tests E2E publics ajoutés (carte publique, formulaire contact, formulaire réservation, validation horaire/jour fermé, menu burger mobile).
- [x] Redirection automatique vers la page de connexion si le token admin est invalide ou expiré (401), suppression du localStorage et affichage du message de session expirée.
- [x] Connexion de la carte publique et des réglages à l'API publique MySQL ; correction du routage admin qui interceptait les routes publiques.
- [x] Correction des données catégories/plats de l'admin : réponses API directes `data` lues correctement (9 catégories, 46 plats).
- [x] Synchronisation immédiate des changements de statut et notes internes dans l'administration.
- [x] Correction du login admin pour la soumission par `Enter` et l'autocomplétion navigateur.
- [x] Correction de l'offset des ancres de catégories de la carte et de la superposition de la barre admin sous le header fixe.
- [x] Passe typographique publique/admin : suppression des usages visibles serif et italiques, sans changer la logique métier.
- [x] Mise à jour documentaire selon l'état réel du dépôt.

## Prochaine tâche proposée

P0 Mobile iPhone :
- vérifier menu burger réel sur iPhone
- corriger débordements formulaire réservation
- heure en liste de créneaux
- nombre de personnes en select 2 à 15
- vérifier carte et admin depuis iPhone
