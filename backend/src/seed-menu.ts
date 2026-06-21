import { prisma } from "./lib/prisma.js";

async function main() {
  console.log("Beginning menu database seeding with real items...");

  // Clear existing menu items and categories to ensure clean state
  await prisma.menuItem.deleteMany({});
  await prisma.menuCategory.deleteMany({});

  // 1. Entrées
  const entreesCat = await prisma.menuCategory.create({
    data: {
      name: "Entrées",
      slug: "entrees",
      description: "Nos entrées gourmandes et salades fraîches pour débuter votre repas.",
      displayOrder: 1,
      isActive: true,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: entreesCat.id,
        name: "Salade haricots, magret de canard et sauce aux noix",
        description: "Haricots frais croquants, fines tranches de magret de canard fumé, vinaigrette gourmande aux éclats de noix.",
        priceCents: 1200,
        availability: "disponible",
        displayOrder: 1,
      },
      {
        categoryId: entreesCat.id,
        name: "Tartare de bœuf",
        description: "Préparé minute au couteau, assaisonnement traditionnel, servi avec mouillettes beurrées.",
        priceCents: 1400,
        availability: "disponible",
        displayOrder: 2,
      },
      {
        categoryId: entreesCat.id,
        name: "Salade de chèvre",
        description: "Chèvre chaud sur toasts briochés, mesclun, miel de fleurs, vinaigre balsamique et pignons rôtis.",
        priceCents: 1100,
        availability: "disponible",
        displayOrder: 3,
      },
      {
        categoryId: entreesCat.id,
        name: "Terrine de lentilles lardées au foie de volaille",
        description: "Terrine artisanale maison aux lentilles vertes du Puy et foies de volaille fondants.",
        priceCents: 900,
        availability: "disponible",
        displayOrder: 4,
      },
      {
        categoryId: entreesCat.id,
        name: "Salade César au poulet",
        description: "Salade romaine, suprême de poulet croustillant, parmesan AOC, croûtons et sauce César maison.",
        priceCents: 1350,
        availability: "disponible",
        displayOrder: 5,
      },
      {
        categoryId: entreesCat.id,
        name: "Salade gourmande foie gras canard noix",
        description: "Salade de saison accompagnée de copeaux de foie gras de canard maison et cerneaux de noix.",
        priceCents: 1600,
        availability: "disponible",
        displayOrder: 6,
      },
      {
        categoryId: entreesCat.id,
        name: "Foie gras aux épices",
        description: "Foie gras de canard mi-cuit parfumé aux épices douces, chutney de figues et pain de campagne toasté.",
        priceCents: 1550,
        availability: "disponible",
        displayOrder: 7,
      },
    ],
  });

  // 2. Plats
  const platsCat = await prisma.menuCategory.create({
    data: {
      name: "Plats",
      slug: "plats",
      description: "Nos plats signatures cuisinés avec passion à base de produits frais.",
      displayOrder: 2,
      isActive: true,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: platsCat.id,
        name: "Paëlla poulet fruits de mer chorizo",
        description: "Recette traditionnelle revisitée : riz safrané, morceaux de poulet, crevettes, moules, calamars et chorizo doux.",
        priceCents: 1850,
        availability: "disponible",
        displayOrder: 1,
      },
      {
        categoryId: platsCat.id,
        name: "Jambon à l’os sauce porto purée",
        description: "Tranche généreuse de jambon à l'os braisé, sauce parfumée au Porto rouge et purée de pommes de terre maison à la fleur de sel.",
        priceCents: 1600,
        availability: "disponible",
        displayOrder: 2,
      },
      {
        categoryId: platsCat.id,
        name: "Gratin fruits de mer bisque de homard",
        description: "Méli-mélo de poissons, crevettes et moules gratiné au four sous une bisque de homard onctueuse.",
        priceCents: 1900,
        availability: "disponible",
        displayOrder: 3,
      },
      {
        categoryId: platsCat.id,
        name: "Salade de bœuf thaï",
        description: "Fines lamelles de bœuf saisies, coriandre fraîche, menthe, oignons rouges, cacahuètes et vinaigrette acidulée au citron vert.",
        priceCents: 1550,
        availability: "disponible",
        displayOrder: 4,
      },
      {
        categoryId: platsCat.id,
        name: "Salade savoyarde",
        description: "Mesclun, pommes de terre sautées, lardons grillés, reblochon fermier fondu sur toasts et cornichons.",
        priceCents: 1500,
        availability: "disponible",
        displayOrder: 5,
      },
      {
        categoryId: platsCat.id,
        name: "Burger de la Loge",
        description: "Pain brioché artisanal, steak haché frais, cheddar affiné, oignons caramélisés et notre sauce secrète, servi avec frites maison.",
        priceCents: 1700,
        availability: "disponible",
        displayOrder: 6,
      },
      {
        categoryId: platsCat.id,
        name: "Poire de bœuf crème de gorgonzola",
        description: "Pièce de bœuf tendre grillée selon votre convenance, nappée d'une crème onctueuse au Gorgonzola.",
        priceCents: 2100,
        availability: "disponible",
        displayOrder: 7,
      },
    ],
  });

  // 3. Desserts
  const dessertsCat = await prisma.menuCategory.create({
    data: {
      name: "Desserts",
      slug: "desserts",
      description: "Pour finir sur une note douce et sucrée.",
      displayOrder: 3,
      isActive: true,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: dessertsCat.id,
        name: "Camembert rôti au miel",
        description: "Petit camembert entier rôti au four avec un filet de miel crémeux, servi avec du pain toasté.",
        priceCents: 950,
        availability: "disponible",
        displayOrder: 1,
      },
      {
        categoryId: dessertsCat.id,
        name: "Assiette de fromages",
        description: "Sélection de trois fromages affinés de nos régions.",
        priceCents: 900,
        availability: "disponible",
        displayOrder: 2,
      },
      {
        categoryId: dessertsCat.id,
        name: "Faisselle de fromage blanc",
        description: "Servie nature, au coulis de fruits rouges maison ou à la crème double.",
        priceCents: 600,
        availability: "disponible",
        displayOrder: 3,
      },
      {
        categoryId: dessertsCat.id,
        name: "Dessert du jour",
        description: "Création sucrée du moment élaborée quotidiennement par notre chef.",
        priceCents: 750,
        availability: "disponible",
        displayOrder: 4,
      },
    ],
  });

  // 4. Planches maison
  const planchesCat = await prisma.menuCategory.create({
    data: {
      name: "Planches maison",
      slug: "planches",
      description: "Nos planches généreuses à partager en début de soirée ou pour l'apéro.",
      displayOrder: 4,
      isActive: true,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: planchesCat.id,
        name: "Foie gras et confiture de cerise noire",
        description: "Tranches de foie gras de canard mi-cuit maison, accompagnées de confiture de cerise noire et pain grillé.",
        priceCents: 1900,
        availability: "disponible",
        displayOrder: 1,
      },
      {
        categoryId: planchesCat.id,
        name: "Terrine de lentilles lardée au foie de volaille",
        description: "Format planche de notre terrine de campagne artisanale à partager.",
        priceCents: 1100,
        availability: "disponible",
        displayOrder: 2,
      },
      {
        categoryId: planchesCat.id,
        name: "Planche de charcuterie",
        description: "Sélection de charcuteries fines : jambon cru, rosette de Lyon, terrine maison et saucisson sec.",
        priceCents: 1500,
        availability: "disponible",
        displayOrder: 3,
      },
      {
        categoryId: planchesCat.id,
        name: "Planche de fromage",
        description: "Sélection de fromages affinés régionaux accompagnés de fruits secs.",
        priceCents: 1500,
        availability: "disponible",
        displayOrder: 4,
      },
      {
        categoryId: planchesCat.id,
        name: "Planche mixte",
        description: "Le meilleur des deux mondes : assortiment complet de fromages affinés et charcuteries artisanales.",
        priceCents: 1750,
        availability: "disponible",
        displayOrder: 5,
      },
    ],
  });

  // 5. Tapas
  const tapasCat = await prisma.menuCategory.create({
    data: {
      name: "Tapas",
      slug: "tapas",
      description: "Petites bouchées conviviales d'inspiration ibérique et d'ailleurs.",
      displayOrder: 5,
      isActive: true,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: tapasCat.id,
        name: "Nem cochon",
        description: "Nems croustillants farcis au porc et légumes d'inspiration asiatique (4 pièces).",
        priceCents: 700,
        availability: "disponible",
        displayOrder: 1,
      },
      {
        categoryId: tapasCat.id,
        name: "Tortillas de patata",
        description: "Omelette espagnole traditionnelle aux pommes de terre confites et oignons.",
        priceCents: 650,
        availability: "disponible",
        displayOrder: 2,
      },
      {
        categoryId: tapasCat.id,
        name: "Saumon fumé",
        description: "Fines tranches de saumon fumé au bois de hêtre, crème d'aneth et blinis tièdes.",
        priceCents: 800,
        availability: "disponible",
        displayOrder: 3,
      },
      {
        categoryId: tapasCat.id,
        name: "Croquettes au jambon",
        description: "Croquetas crémeuses au jambon Serrano croustillantes à l'extérieur (4 pièces).",
        priceCents: 700,
        availability: "disponible",
        displayOrder: 4,
      },
      {
        categoryId: tapasCat.id,
        name: "Ravioli chinois vapeur",
        description: "Raviolis vapeur garnis de farce fine aux herbes (4 pièces).",
        priceCents: 750,
        availability: "disponible",
        displayOrder: 5,
      },
      {
        categoryId: tapasCat.id,
        name: "Croque légume",
        description: "Mini croque-monsieur végétarien aux légumes grillés de saison et mozzarella fondante.",
        priceCents: 650,
        availability: "disponible",
        displayOrder: 6,
      },
      {
        categoryId: tapasCat.id,
        name: "Croque monsieur truffé",
        description: "Croque-monsieur gourmand au jambon blanc et béchamel parfumée à la truffe.",
        priceCents: 850,
        availability: "disponible",
        displayOrder: 7,
      },
      {
        categoryId: tapasCat.id,
        name: "Piments de Padrón",
        description: "Pimientos de Padrón frits à l'huile d'olive et parsemés de fleur de sel.",
        priceCents: 600,
        availability: "disponible",
        displayOrder: 8,
      },
      {
        categoryId: tapasCat.id,
        name: "Samoussa poulet",
        description: "Triangles de pâte filo croustillants farcis au poulet épicé (4 pièces).",
        priceCents: 700,
        availability: "disponible",
        displayOrder: 9,
      },
      {
        categoryId: tapasCat.id,
        name: "Samoussa bœuf",
        description: "Croustillants garnis de bœuf haché parfumé aux épices douces (4 pièces).",
        priceCents: 700,
        availability: "disponible",
        displayOrder: 10,
      },
      {
        categoryId: tapasCat.id,
        name: "Camembert rôti",
        description: "Rôti au four et relevé d'herbes aromatiques pour l'apéro.",
        priceCents: 900,
        availability: "disponible",
        displayOrder: 11,
      },
    ],
  });

  // 6. Cocktails
  const cocktailsCat = await prisma.menuCategory.create({
    data: {
      name: "Cocktails",
      slug: "cocktails",
      description: "Nos créations d'auteur et cocktails classiques préparés par nos barmen.",
      displayOrder: 6,
      isActive: true,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: cocktailsCat.id,
        name: "Le Célestins",
        description: "Whisky tourbé, miel de châtaigner, citron frais, thym fumé.",
        priceCents: 1400,
        availability: "disponible",
        displayOrder: 1,
      },
      {
        categoryId: cocktailsCat.id,
        name: "Lyon Sling",
        description: "Gin Hendrick's, infusion de verveine fraîche, citron vert, gingembre.",
        priceCents: 1300,
        availability: "disponible",
        displayOrder: 2,
      },
      {
        categoryId: cocktailsCat.id,
        name: "Negroni Maison",
        description: "Campari infusé, vermouth rouge artisanal, Gin botanique, zeste d'orange.",
        priceCents: 1300,
        availability: "disponible",
        displayOrder: 3,
      },
      {
        categoryId: cocktailsCat.id,
        name: "Spritz Doré",
        description: "Prosecco Nino Franco, Aperol, zeste de citron jaune, eau gazeuse.",
        priceCents: 1200,
        availability: "disponible",
        displayOrder: 4,
      },
    ],
  });

  // 7. Vins
  const vinsCat = await prisma.menuCategory.create({
    data: {
      name: "Vins",
      slug: "vins",
      description: "Notre sélection de domaines locaux et de grandes appellations.",
      displayOrder: 7,
      isActive: true,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: vinsCat.id,
        name: "Sélection de vins au verre",
        description: "Blanc, rouge ou rosé — découvrez la sélection du mois de notre sommelier.",
        priceCents: 700,
        availability: "disponible",
        displayOrder: 1,
      },
      {
        categoryId: vinsCat.id,
        name: "Bouteille de vin",
        description: "Sélection de vignerons locaux et grands crus d'appellations françaises.",
        priceCents: 2800,
        availability: "disponible",
        displayOrder: 2,
      },
    ],
  });

  // 8. Boissons chaudes
  const boissonsChaudesCat = await prisma.menuCategory.create({
    data: {
      name: "Boissons chaudes",
      slug: "boissons-chaudes",
      description: "Cafés de spécialité et sélections de thés fins pour accompagner vos desserts.",
      displayOrder: 8,
      isActive: true,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: boissonsChaudesCat.id,
        name: "Café Espresso",
        description: "Expresso Illy de tradition italienne.",
        priceCents: 250,
        availability: "disponible",
        displayOrder: 1,
      },
      {
        categoryId: boissonsChaudesCat.id,
        name: "Double Espresso",
        description: "Double expresso corsé.",
        priceCents: 400,
        availability: "disponible",
        displayOrder: 2,
      },
      {
        categoryId: boissonsChaudesCat.id,
        name: "Thé & Infusions",
        description: "Sélection fine de la maison Palais des Thés.",
        priceCents: 350,
        availability: "disponible",
        displayOrder: 3,
      },
    ],
  });

  // 9. Boissons fraîches
  const boissonsFraichesCat = await prisma.menuCategory.create({
    data: {
      name: "Boissons fraîches",
      slug: "boissons-fraiches",
      description: "Sodas, eaux minérales et bières de spécialité servies bien fraîches.",
      displayOrder: 9,
      isActive: true,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: boissonsFraichesCat.id,
        name: "Eaux minérales (75cl)",
        description: "Evian ou San Pellegrino.",
        priceCents: 400,
        availability: "disponible",
        displayOrder: 1,
      },
      {
        categoryId: boissonsFraichesCat.id,
        name: "Jus de fruits pressés",
        description: "Orange, pamplemousse ou pomme pressé minute (selon saison).",
        priceCents: 600,
        availability: "disponible",
        displayOrder: 2,
      },
      {
        categoryId: boissonsFraichesCat.id,
        name: "Bière pression",
        description: "Kronenbourg 1664 Blanc ou IPA locale artisanale.",
        priceCents: 500,
        availability: "disponible",
        displayOrder: 3,
      },
    ],
  });

  console.log("Database seeded successfully with all requested menu categories and items!");
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
