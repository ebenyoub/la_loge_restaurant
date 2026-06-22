import { prisma } from "./lib/prisma.js";

async function main() {
  console.log("Beginning settings database seeding...");

  // Find or create settings row
  let settings = await prisma.restaurantSettings.findFirst();

  const settingsData = {
    restaurantName: "La Loge Bar & Food",
    shortPresentation: "Découvrez notre assortiment de burgers faits maison, nos poissons frais et nos desserts savoureux dans une ambiance chaleureuse Place des Célestins à Lyon. Profitez également de notre bar et de nos cocktails en soirée.",
    addressLine1: "7 Rue Charles Dullin",
    addressLine2: "Place des Célestins",
    postalCode: "69002",
    city: "Lyon",
    countryCode: "FR",
    phone: "06 85 40 26 37",
    email: "contact@lalogelyon.fr",
    googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.56276856754!2d4.8316191!3d45.7601884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4ea5475e53303%3A0xe54bb3f721ea7a6c!2s7%20Rue%20Charles%20Dullin%2C%2069002%20Lyon!5e0!3m2!1sfr!2sfr!4v1718972100000!5m2!1sfr!2sfr",
    defaultLocale: "fr"
  };

  if (settings) {
    settings = await prisma.restaurantSettings.update({
      where: { id: settings.id },
      data: settingsData
    });
  } else {
    settings = await prisma.restaurantSettings.create({
      data: settingsData
    });
  }

  // Clear and update opening hours
  await prisma.openingHour.deleteMany({
    where: { settingsId: settings.id }
  });

  const hours = [
    { dayOfWeek: 1, opensAt: null, closesAt: null, isClosed: true, displayOrder: 1 }, // Lundi
    { dayOfWeek: 2, opensAt: "12:00", closesAt: "23:00", isClosed: false, displayOrder: 2 }, // Mardi
    { dayOfWeek: 3, opensAt: "12:00", closesAt: "23:00", isClosed: false, displayOrder: 3 }, // Mercredi
    { dayOfWeek: 4, opensAt: "12:00", closesAt: "23:00", isClosed: false, displayOrder: 4 }, // Jeudi
    { dayOfWeek: 5, opensAt: "12:00", closesAt: "23:00", isClosed: false, displayOrder: 5 }, // Vendredi
    { dayOfWeek: 6, opensAt: "12:00", closesAt: "23:30", isClosed: false, displayOrder: 6 }, // Samedi
    { dayOfWeek: 0, opensAt: "12:00", closesAt: "22:00", isClosed: false, displayOrder: 7 }  // Dimanche
  ];

  for (const h of hours) {
    await prisma.openingHour.create({
      data: {
        settingsId: settings.id,
        ...h
      }
    });
  }

  // Clear and update social links
  await prisma.socialLink.deleteMany({
    where: { settingsId: settings.id }
  });

  const socialLinks = [
    { platform: "Facebook", url: "https://www.facebook.com/La-Loge-Bar-und-food-50424949-972554012938918/", isActive: true, displayOrder: 1 },
    { platform: "Instagram", url: "https://www.instagram.com/laloge.bar.food/", isActive: true, displayOrder: 2 }
  ];

  for (const s of socialLinks) {
    await prisma.socialLink.create({
      data: {
        settingsId: settings.id,
        ...s
      }
    });
  }

  // Seed legal documents
  const legalDocs = [
    {
      documentKey: "mentions_legales",
      title: "Mentions Légales",
      body: "Éditeur du site :\nLa dénomination sociale, la forme juridique, l'adresse du siège, le SIREN ou SIRET, le capital social le cas échéant et les coordonnées de l'éditeur doivent être confirmés avant publication.\n\nResponsable de publication :\nL'identité et les coordonnées du responsable de publication seront indiquées après validation par le restaurant.\n\nHébergement :\nLe nom, l'adresse et les coordonnées de l'hébergeur seront ajoutés une fois le prestataire technique définitivement retenu.\n\nPropriété intellectuelle :\nLes règles applicables aux textes, photographies, éléments graphiques et contenus du site seront publiées après confirmation de leurs titulaires et de leurs droits d'utilisation.\n\nContact :\nL'adresse e-mail légale et les modalités de contact de l'éditeur doivent être confirmées. Les informations pratiques du restaurant sont présentées sur la page Contact & accès après validation.",
      version: "1.0.0",
      publishedAt: new Date()
    },
    {
      documentKey: "confidentialite",
      title: "Politique de Confidentialité",
      body: "La politique de confidentialité précisera les données collectées, leur finalité, leur durée de conservation, les destinataires et les droits des personnes. Elle doit être validée avant l'activation des formulaires de contact ou de réservation.",
      version: "1.0.0",
      publishedAt: new Date()
    },
    {
      documentKey: "cookies",
      title: "Gestion des Cookies",
      body: "La politique relative aux cookies et, si nécessaire, le mécanisme de consentement seront définis avant l'ajout de services nécessitant un dépôt ou une lecture de cookies non essentiels.",
      version: "1.0.0",
      publishedAt: new Date()
    }
  ];

  for (const doc of legalDocs) {
    await prisma.legalDocument.upsert({
      where: { documentKey: doc.documentKey },
      update: {
        title: doc.title,
        body: doc.body,
        version: doc.version,
        publishedAt: doc.publishedAt
      },
      create: {
        documentKey: doc.documentKey,
        title: doc.title,
        body: doc.body,
        version: doc.version,
        publishedAt: doc.publishedAt
      }
    });
  }

  console.log("Settings and legal documents seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during settings seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
