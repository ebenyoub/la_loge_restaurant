import { test, expect } from "@playwright/test";

test.describe("Public MVP Frontend Tests", () => {
  // Common mock settings
  const mockSettings = {
    restaurantName: "La Loge Célestins Test",
    shortPresentation: "Bar & Food sur la place des Célestins",
    addressLine1: "1 Rue du Temple",
    postalCode: "69002",
    city: "Lyon",
    phone: "0478000000",
    email: "contact@laloge.fr",
    googleMapsUrl: "https://maps.google.com",
    openingHours: [
      { dayOfWeek: 1, opensAt: "12:00", closesAt: "23:00", isClosed: false }, // Lundi
      { dayOfWeek: 2, opensAt: "12:00", closesAt: "23:00", isClosed: false }, // Mardi
      { dayOfWeek: 3, opensAt: "12:00", closesAt: "23:00", isClosed: false }, // Mercredi
      { dayOfWeek: 4, opensAt: "12:00", closesAt: "23:00", isClosed: false }, // Jeudi
      { dayOfWeek: 5, opensAt: "12:00", closesAt: "23:30", isClosed: false }, // Vendredi
      { dayOfWeek: 6, opensAt: "12:00", closesAt: "23:30", isClosed: false }, // Samedi
      { dayOfWeek: 0, opensAt: "12:00", closesAt: "23:00", isClosed: true },  // Dimanche
    ]
  };

  test.beforeEach(async ({ page }) => {
    // Intercept settings request for all tests
    await page.route("**/api/v1/public/settings", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: mockSettings }),
      });
    });
  });

  test("should load categories and plats on /carte page", async ({ page }) => {
    // Mock the public menu API
    await page.route("**/api/v1/public/menu", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: "cat-1",
              name: "Boissons",
              slug: "boissons",
              description: "Nos rafraîchissements",
              menuItems: [
                { id: "item-1", name: "Chardonnay", description: "Verre de blanc", priceCents: 550, allergenInfo: "Sulfites", dietaryInfo: null },
                { id: "item-2", name: "Bière IPA", description: "Pinte artisanale", priceCents: 800, allergenInfo: "Gluten", dietaryInfo: null }
              ]
            },
            {
              id: "cat-2",
              name: "Plats",
              slug: "plats",
              description: "Cuisine maison",
              menuItems: [
                { id: "item-3", name: "Burger La Loge", description: "Frites maison", priceCents: 1650, allergenInfo: null, dietaryInfo: null }
              ]
            }
          ]
        }),
      });
    });

    await page.goto("/carte");

    // Verify information from public settings is loaded
    await expect(page.locator("text=La Loge Célestins Test · Lyon")).toBeVisible();
    await expect(page.locator("text=Bar & Food sur la place des Célestins").first()).toBeVisible();

    // Verify categories and items are displayed correctly
    await expect(page.locator("h2:has-text('Boissons')")).toBeVisible();
    await expect(page.locator("h2:has-text('Plats')")).toBeVisible();
    await expect(page.locator("text=Chardonnay")).toBeVisible();
    await expect(page.locator("text=5.50 €")).toBeVisible();
    await expect(page.locator("text=Bière IPA")).toBeVisible();
    await expect(page.locator("text=Burger La Loge")).toBeVisible();
    await expect(page.locator("text=16.50 €")).toBeVisible();
  });

  test("should submit contact form successfully", async ({ page }) => {
    // Mock contact API post request
    await page.route("**/api/v1/contact-messages", async (route) => {
      expect(route.request().method()).toBe("POST");
      const postData = route.request().postDataJSON();
      expect(postData.name).toBe("Jean Dupont");
      expect(postData.email).toBe("jean.dupont@example.com");
      expect(postData.subject).toBe("Privatisation");
      expect(postData.message).toBe("Bonjour, j'aimerais réserver pour 20 personnes.");
      
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { message: "Votre message a bien été envoyé !" }
        }),
      });
    });

    await page.goto("/contact");

    // Fill contact form fields
    await page.fill('input[id="name"]', "Jean Dupont");
    await page.fill('input[id="email"]', "jean.dupont@example.com");
    await page.fill('input[id="phone"]', "0600000000");
    await page.fill('input[id="subject"]', "Privatisation");
    await page.fill('textarea[id="message"]', "Bonjour, j'aimerais réserver pour 20 personnes.");
    await page.check('input[id="consent"]');

    // Click submit
    await page.click('button[type="submit"]');

    // Check success message
    await expect(page.locator("text=Votre message a bien été envoyé !")).toBeVisible();
  });

  test("should submit reservation form successfully", async ({ page }) => {
    // Mock reservation API post request
    await page.route("**/api/v1/reservations", async (route) => {
      expect(route.request().method()).toBe("POST");
      const postData = route.request().postDataJSON();
      expect(postData.firstName).toBe("Marie");
      expect(postData.lastName).toBe("Curie");
      expect(postData.email).toBe("marie.curie@example.com");
      expect(postData.requestedDate).toBe("2026-06-25"); // A Thursday
      expect(postData.requestedTime).toBe("19:30");
      expect(postData.guestCount).toBe(4);

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { message: "Votre demande de réservation a bien été envoyée !" }
        }),
      });
    });

    await page.goto("/reservation");

    // Fill form fields
    await page.fill('input[id="firstName"]', "Marie");
    await page.fill('input[id="lastName"]', "Curie");
    await page.fill('input[id="phone"]', "0612345678");
    await page.fill('input[id="email"]', "marie.curie@example.com");
    await page.fill('input[id="requestedDate"]', "2026-06-25");
    
    // Choose time slot (19:30 should be available since Thu opening is 12:00-23:00)
    await page.selectOption('select[id="requestedTime"]', "19:30");
    await page.selectOption('select[id="guestCount"]', "4");
    await page.selectOption('select[id="occasion"]', "repas-pro");
    await page.fill('textarea[id="message"]', "Une table calme.");
    await page.check('input[id="consent"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success banner
    await expect(page.locator("text=Votre demande de réservation a bien été envoyée !")).toBeVisible();
  });

  test("should refuse reservation if date falls on a closed day or invalid time slot", async ({ page }) => {
    // Mock reservation post to return 422 validation error if submitted
    await page.route("**/api/v1/reservations", async (route) => {
      await route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            code: "VALIDATION_ERROR",
            message: "Le restaurant est fermé à cette date."
          }
        }),
      });
    });

    await page.goto("/reservation");

    // Fill fields
    await page.fill('input[id="firstName"]', "Paul");
    await page.fill('input[id="lastName"]', "Valéry");
    await page.fill('input[id="phone"]', "0612345678");
    await page.fill('input[id="email"]', "paul.valery@example.com");
    
    // Set date to a Sunday (2026-06-28 is Sunday, closed in mockSettings)
    await page.fill('input[id="requestedDate"]', "2026-06-28");

    // Check time select list is empty or disabled
    const slotsSelect = page.locator('select[id="requestedTime"]');
    const optionsCount = await slotsSelect.locator('option').count();
    // It should only have the default placeholder option
    expect(optionsCount).toBeLessThanOrEqual(1);

    // Let's change date to Thursday and pick an out-of-bounds slot if possible, or trigger validation error
    await page.fill('input[id="requestedDate"]', "2026-06-25");
    await page.selectOption('select[id="requestedTime"]', "12:00");
    await page.check('input[id="consent"]');

    // Mock API returns error for this slot
    await page.click('button[type="submit"]');

    // Assert validation alert is displayed
    await expect(page.locator("text=Le restaurant est fermé à cette date.")).toBeVisible();
  });

  test("should open and close mobile navigation burger menu", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");

    // Locate mobile menu toggle button by its aria-label or tag
    const burgerButton = page.locator('button[aria-label="Ouvrir le menu"]');
    await expect(burgerButton).toBeVisible();

    // Click to open
    await burgerButton.click();

    // Verify mobile close button is visible
    const closeButton = page.locator('button[aria-label="Fermer le menu"]');
    await expect(closeButton).toBeVisible();

    // Click to close
    await closeButton.click();

    // Verify open button is back
    await expect(burgerButton).toBeVisible();
  });
});
