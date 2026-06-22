# Inventaire des images importées — La Loge Bar & Food

**Date de collecte :** 20 juin 2026 — statut vérifié le 21 juin 2026
**Périmètre parcouru :**

- `https://la-loge-bar-food-restaurant-lyon.eatbu.com/?lang=fr`
- `https://la-loge-bar-food-restaurant-lyon.eatbu.com/?lang=en`

Le site existant est une vitrine mono-page : les liens publics sont des ancres de cette page et les deux versions de langue exposent les mêmes médias. Les images responsive d'un même visuel n'ont pas été dupliquées : seule la version la plus grande disponible a été conservée.

## Droits et règles d'utilisation

Ces fichiers sont importés uniquement pour préparer la refonte. **Ils ne doivent pas être utilisés ni publiés tant que le client n'a pas confirmé qu'il détient les droits de reproduction nécessaires**, y compris les éventuels droits à l'image des personnes reconnaissables. Toute référence existante dans l'interface doit être considérée comme provisoire et retirée ou autorisée avant mise en ligne.

Les sources proviennent du CDN de la plateforme DISH ; leur présence publique ne constitue pas à elle seule une cession de droits.

## Images retenues

| Fichier importé | URL source retenue | Dimensions | Poids WebP | Page/section d'origine | Remarque qualité et réutilisation |
| --- | --- | ---: | ---: | --- | --- |
| `restaurant-facade-nuit-01.webp` | `https://cdn.website.dish.co/media/fa/25/1064262/La-Loge-Bar-und-food-50424949-972554012938918-6234897319435698176-o.jpg` | 2000 × 1333 px | 523 956 octets | Accueil, hero `#home`, image Open Graph | Bonne définition pour un hero/accès. Photo nocturne avec décoration de fin d'année et personnes visibles : vérifier les droits à l'image et le caractère saisonnier avant usage. |
| `plat-salade-cesar-01.webp` | `https://cdn.website.dish.co/media/48/a6/1064280/La-Loge-Bar-und-food-o.jpg` | 1280 × 853 px | 103 346 octets | À propos `#aboutUs`, bloc « Salade Cesar » | Définition adaptée au web ; compression source modérée et cadrage simple. Réutilisable comme illustration de plat, sous réserve que le plat soit toujours proposé. |
| `logo-la-loge-bar-food-01.webp` | `https://cdn.website.dish.co/media/ea/21/1064276/La-Loge-Bar-und-food-22780656-722969237897398-7830470831913128686-n-2.jpg` | 1280 × 853 px | 61 280 octets | À propos `#aboutUs`, bloc « Notre Restaurant » | Visuel raster de logo sur fond bleu, non vectoriel. À considérer comme secours temporaire : demander le logo source SVG/AI/PDF au client avant intégration. |
| `menu-ardoise-01.webp` | `https://cdn.website.dish.co/media/5b/83/1064272/La-Loge-Bar-und-food-IMG-0012.jpg` | 2107 × 3264 px | 911 784 octets | Carte `#menu`, lien de téléchargement | Bonne résolution mais texte intégré dans une photo d'ardoise ; prix et plats potentiellement obsolètes. À archiver/inspirer, non à publier comme carte sans validation. L'intérieur est partiellement visible. |
| `menu-ardoise-02.webp` | `https://cdn.website.dish.co/media/3e/18/1064273/La-Loge-Bar-und-food-IMG-0013.jpg` | 2161 × 3264 px | 839 346 octets | Carte `#menu`, lien de téléchargement | Bonne résolution mais texte intégré dans une photo d'ardoise ; contenu Happy Hour/carte potentiellement obsolète. À archiver/inspirer, non à publier comme carte sans validation. L'intérieur est partiellement visible. |

## Images inspectées mais non importées

- Drapeaux de langues, favicons, icônes de fermeture/zoom et autres icônes de l'interface : éléments génériques sans valeur pour la refonte.
- Images de fond CSS `bg-reservations-*`, `bg-services-*`, carte monde de remplacement et icône de commande : médias génériques de la plateforme DISH, non propres à La Loge.
- Variantes responsive des trois photos retenues : même visuel, mais à résolution inférieure ; écartées pour éviter les doublons.
- Le script public `https://order.dish.co/hdfo.js` ne référence aucune image de contenu supplémentaire exploitable.

## Conversion

Les originaux JPEG ont été convertis en WebP sans redimensionnement, pour préparer leur usage futur tout en réduisant leur poids. Les originaux ne sont pas ajoutés au projet ; les URLs sources ci-dessus permettent de les retrouver tant qu'elles restent accessibles.

Avant toute intégration, vérifier : droits, actualité des photos, identité visuelle, exactitude des menus/prix et qualité sur les recadrages réellement retenus.
