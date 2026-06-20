import { test, expect } from "@playwright/test";

test.describe("Admin MVP Frontend Tests", () => {
  // Test Route Protection
  test("should redirect to login if not authenticated", async ({ page }) => {
    await page.goto("/admin/reservations");
    // Should be redirected to login
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("should allow access if admin token is present in localStorage", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("admin_token", "fake-jwt-token");
      window.localStorage.setItem(
        "admin_user",
        JSON.stringify({ displayName: "Directeur Test", role: "gérant" })
      );
    });

    // Mock the reservations API so it doesn't fail
    await page.route("**/api/v1/admin/reservations*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            items: [],
            meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
          },
        }),
      });
    });

    await page.goto("/admin/reservations");
    await expect(page).toHaveURL(/\/admin\/reservations/);
    await expect(page.locator("text=Directeur Test (gérant)")).toBeVisible();
  });

  // Test Admin Login Flow
  test("should login successfully with valid credentials and redirect", async ({ page }) => {
    // Intercept login request
    await page.route("**/api/v1/admin/login", async (route) => {
      if (route.request().method() === "POST") {
        const payload = route.request().postDataJSON();
        if (payload.email === "admin@example.com" && payload.password === "password123") {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              data: {
                token: "valid-jwt-token-123",
                admin: {
                  displayName: "Chef Admin",
                  role: "gérant",
                },
              },
            }),
          });
        } else {
          await route.fulfill({
            status: 401,
            contentType: "application/json",
            body: JSON.stringify({
              error: {
                message: "Identifiants incorrects.",
              },
            }),
          });
        }
      }
    });

    // Mock reservations dashboard request to avoid loading error
    await page.route("**/api/v1/admin/reservations*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: { items: [], meta: { total: 0 } },
        }),
      });
    });

    await page.goto("/admin/login");

    // Invalid credentials attempt
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpass");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Identifiants incorrects.")).toBeVisible();

    // Valid credentials attempt
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/admin\/reservations/);
    await expect(page.locator("text=Chef Admin (gérant)")).toBeVisible();
  });

  // Test Reservations List and Details
  test("should list reservations and show details on click", async ({ page }) => {
    // Inject token
    await page.addInitScript(() => {
      window.localStorage.setItem("admin_token", "fake-jwt-token");
      window.localStorage.setItem(
        "admin_user",
        JSON.stringify({ displayName: "Admin User", role: "gérant" })
      );
    });

    // Mock GET reservations list
    await page.route("**/api/v1/admin/reservations*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            items: [
              {
                id: "res-1",
                requestedDate: "2026-06-25",
                requestedTime: "20:00",
                customerName: "Jean Dupont",
                guestCount: 4,
                occasion: "Anniversaire",
                status: "nouvelle",
              },
              {
                id: "res-2",
                requestedDate: "2026-06-26",
                requestedTime: "12:30",
                customerName: "Marie Curie",
                guestCount: 2,
                occasion: null,
                status: "confirmee",
              },
            ],
            meta: { total: 2 },
          },
        }),
      });
    });

    // Mock GET reservation details for res-1
    await page.route("**/api/v1/admin/reservations/res-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: "res-1",
            requestedDate: "2026-06-25",
            requestedTime: "20:00",
            customerName: "Jean Dupont",
            guestCount: 4,
            occasion: "Anniversaire",
            status: "nouvelle",
            phone: "+33612345678",
            email: "jean.dupont@example.com",
            message: "Table près de la fenêtre svp.",
            statusHistory: [
              {
                id: "hist-1",
                previousStatus: null,
                nextStatus: "nouvelle",
                changedBy: "Système",
                createdAt: "2026-06-20T10:00:00Z",
              },
            ],
            notes: [
              {
                id: "note-1",
                body: "Client régulier.",
                author: "Chef Admin",
                createdAt: "2026-06-20T10:05:00Z",
              },
            ],
          },
        }),
      });
    });

    await page.goto("/admin/reservations");

    // Verify list items are visible
    await expect(page.locator("text=Jean Dupont")).toBeVisible();
    await expect(page.locator("text=Marie Curie")).toBeVisible();

    // Click on Jean Dupont to load details
    await page.click("text=Jean Dupont");

    // Verify details card information
    await expect(page.locator("h3:has-text('Jean Dupont')")).toBeVisible();
    await expect(page.locator("text=jean.dupont@example.com")).toBeVisible();
    await expect(page.locator("text=+33612345678")).toBeVisible();
    await expect(page.locator("text=Table près de la fenêtre svp.")).toBeVisible();
    await expect(page.locator("text=Client régulier.")).toBeVisible();
  });

  // Test Contact Messages List and Details
  test("should list contact messages and show details on click", async ({ page }) => {
    // Inject token
    await page.addInitScript(() => {
      window.localStorage.setItem("admin_token", "fake-jwt-token");
      window.localStorage.setItem(
        "admin_user",
        JSON.stringify({ displayName: "Admin User", role: "gérant" })
      );
    });

    // Mock GET contact messages list
    await page.route("**/api/v1/admin/contact-messages*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            items: [
              {
                id: "msg-1",
                status: "nouveau",
                name: "Pierre Martin",
                email: "pierre.martin@example.com",
                phone: "+33699887766",
                subject: "Demande de privatisation",
                createdAt: "2026-06-20T08:00:00Z",
              },
            ],
            meta: { total: 1 },
          },
        }),
      });
    });

    // Mock GET message details for msg-1
    await page.route("**/api/v1/admin/contact-messages/msg-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: "msg-1",
            status: "nouveau",
            name: "Pierre Martin",
            email: "pierre.martin@example.com",
            phone: "+33699887766",
            subject: "Demande de privatisation",
            message: "Bonjour, j'aimerais privatiser la salle pour 30 personnes le 14 juillet.",
            createdAt: "2026-06-20T08:00:00Z",
            handledAt: null,
            handledBy: null,
          },
        }),
      });
    });

    await page.goto("/admin/contact-messages");

    // Verify message list is visible
    await expect(page.locator("text=Pierre Martin")).toBeVisible();
    await expect(page.locator("text=Demande de privatisation")).toBeVisible();

    // Click on message to see details
    await page.click("text=Pierre Martin");

    // Verify details
    await expect(page.locator("h3:has-text('Demande de privatisation')")).toBeVisible();
    await expect(page.locator("text=Bonjour, j'aimerais privatiser la salle pour 30 personnes le 14 juillet.")).toBeVisible();
  });
});
