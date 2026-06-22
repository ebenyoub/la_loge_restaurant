# Composants partagés

Ce dossier contient les composants réutilisés par les pages publiques :

- `header.tsx` : navigation publique fixe, CTA de réservation et menu mobile accessible.
- `footer.tsx` : coordonnées, horaires et liens publics issus des réglages publics lorsque disponibles.
- `settings-context.tsx` : chargement des réglages depuis `GET /api/v1/public/settings`.

Les pages restent dans `src/app/`. Toute logique ou présentation réutilisée entre plusieurs pages doit être extraite ici plutôt que dupliquée.

La référence visuelle courante est la capture Figma fournie par le client. Les pages publiques utilisent une hiérarchie sans-serif et ne doivent pas réintroduire de texte visible en serif ou en italique sans validation explicite.
