# Pilotage des tâches — La Loge Bar & Food

## État actuel du projet

- Socle Next.js, TypeScript et Tailwind CSS initialisé.
- Les pages Accueil, Carte et Réservation disposent d'une première version statique.
- Les pages Contact et Mentions légales restent à développer dans le périmètre public MVP.
- Les CSS Modules sont conservés jusqu'à la fin du MVP ; aucun refactor Tailwind n'est en cours.
- Aucun backend, base de données, administration ou envoi de formulaire n'est développé.

## Tâche en cours

Développer la page Contact MVP statique.

## Règles Codex

Une tâche correspond à un commit ou à une branche dédiée.

Avant toute intervention, Codex doit :

1. Lire `AGENTS.md`, `TASKS.md`, `PROJECT_STATE.md` et `TODO.md`.
2. Traiter une seule tâche à la fois et respecter son périmètre explicite.
3. Ne pas ajouter de fonctionnalités non demandées ni modifier de pages hors périmètre.
4. Exécuter `npm run lint` et `npm run build` avant livraison.
5. Présenter un résumé des fichiers modifiés, des validations et des données restant à valider.
6. Exécuter `scripts/review-state.sh` avant un checkpoint afin de vérifier les fichiers qui seront inclus.
7. Utiliser `scripts/checkpoint.sh "<message>"` pour créer le commit après validation de la tâche.

## Contraintes MVP

- Routes publiques limitées à `/`, `/carte`, `/reservation`, `/contact` et `/mentions-legales`.
- Pas de backend, base de données, administration, e-mail transactionnel ou logique métier avant instruction explicite.
- La réservation reste une demande en attente de confirmation ; aucune disponibilité automatique.
- Ne pas exposer de téléphone, adresse, horaire ou e-mail non validé.
- Ne pas intégrer les images importées avant validation écrite des droits par le client.
- Ne pas ajouter les éléments P2 : événements privés, galerie, avis clients ou statut ouvert/fermé dynamique.
- Conserver CSS Modules et `globals.css` jusqu'au refactor UI Tailwind post-MVP.

## Checklist avant validation

- [ ] Le périmètre de la tâche est respecté.
- [ ] Aucun contenu, contact ou asset non validé n'est publié comme définitif.
- [ ] L'accessibilité HTML et le responsive sont vérifiés dans le code.
- [ ] `npm run lint` passe.
- [ ] `npm run build` passe.
- [ ] `scripts/review-state.sh` a été exécuté.
- [ ] Les changements attendus sont prêts à être committés avec `scripts/checkpoint.sh`.

## Prochaine tâche

Développer la page Contact MVP statique.
