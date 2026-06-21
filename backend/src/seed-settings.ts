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

  console.log("Settings seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during settings seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
