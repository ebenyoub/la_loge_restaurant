# Guide de contribution — La Loge Bar & Food

## État du projet

Le dépôt contient le socle Next.js, TypeScript et Tailwind CSS de la refonte. Les choix fonctionnels sont décrits dans `cahier-des-charges.md`, `product-backlog.md` et `decisions.md`.

## Règles de travail

- Utiliser l'App Router dans `src/app/`.
- Ajouter les composants réutilisables dans `src/components/` ; ne pas placer de logique réutilisable dans une page.
- Garder TypeScript strict et exécuter `npm run lint` avant de livrer une modification.
- Concevoir mobile first, accessible au clavier et avec des images optimisées.
- Ne jamais intégrer une image de `public/images/imported/` sans validation écrite des droits par le client.
- Ne pas créer de page builder, de réservation automatique ou de calendrier synchronisé : ces éléments ne font pas partie du MVP actuel.
- Toute évolution de périmètre doit mettre à jour `decisions.md`, `product-backlog.md`, `TODO.md` et `PROJECT_STATE.md` quand cela est pertinent.

## Ce qui est volontairement absent

Les pages finales, l'administration, la base de données, les e-mails transactionnels, les formulaires métier et le design final ne sont pas encore développés.
