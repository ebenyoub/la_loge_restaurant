# Validateurs

Les validateurs des flux publics et administratifs sont implémentés dans ce dossier. Ils contrôlent les corps de requête avant toute écriture MySQL ou notification.

Les demandes de réservation sont en outre refusées lorsque le créneau demandé ne respecte pas les horaires d'ouverture configurés. La référence des formats et réponses attendues est [../../../docs/api-contracts.md](../../../docs/api-contracts.md).
