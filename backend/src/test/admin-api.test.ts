import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { app } from "../app.js";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";

vi.mock("../services/mail.service.js", () => ({
  sendContactReplyToClient: vi.fn().mockResolvedValue(true),
  sendReservationNotificationToManager: vi.fn(),
  sendReservationConfirmationToClient: vi.fn(),
  sendContactNotificationToManager: vi.fn(),
  sendContactConfirmationToClient: vi.fn(),
  sendReservationStatusEmail: vi.fn()
}));

const testAdmin = {
  id: "admin-123",
  email: "admin@example.com",
  displayName: "Test Admin",
  role: "gerant" as any,
  isActive: true,
  passwordHash: "$2b$10$abcdefghijklmnopqrstuv" // mock hash for testing
};

const editorAdmin = {
  id: "admin-456",
  email: "editor@example.com",
  displayName: "Editor Admin",
  role: "editeur" as any,
  isActive: true,
};

const mockToken = jwt.sign(
  { sub: testAdmin.id, email: testAdmin.email, role: testAdmin.role },
  env.jwtSecret
);

const mockEditorToken = jwt.sign(
  { sub: editorAdmin.id, email: editorAdmin.email, role: editorAdmin.role },
  env.jwtSecret
);

describe("Admin API Endpoints Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("Authentication and Route Protection (Auth Admin & Errors)", () => {
    it("should fail authentication on invalid credentials", async () => {
      vi.mocked(prisma.administrator.findUnique).mockResolvedValueOnce(null);

      const res = await request(app)
        .post("/api/v1/admin/login")
        .send({ email: "wrong@example.com", password: "password" });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should succeed login and return a token when credentials are valid", async () => {
      const plainPassword = "password123";
      const hash = await bcrypt.hash(plainPassword, 1); // low salt rounds for test speed
      const localAdmin = { ...testAdmin, passwordHash: hash };

      vi.mocked(prisma.administrator.findUnique).mockResolvedValueOnce(localAdmin as any);
      vi.mocked(prisma.administrator.update).mockResolvedValueOnce(localAdmin as any);

      const res = await request(app)
        .post("/api/v1/admin/login")
        .send({ email: "admin@example.com", password: plainPassword });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.admin.id).toBe(testAdmin.id);
    });

    it("should block request (401) on protected routes without authorization header", async () => {
      const res = await request(app).get("/api/v1/admin/reservations");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
      expect(res.body.error.message).toContain("Authentification requise");
    });

    it("should block request (401) on invalid or malformed tokens", async () => {
      const res = await request(app)
        .get("/api/v1/admin/reservations")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
      expect(res.body.error.message).toContain("invalide ou expiré");
    });

    it("should block request (401) if administrator is not found or inactive", async () => {
      vi.mocked(prisma.administrator.findUnique).mockResolvedValueOnce(null);

      const res = await request(app)
        .get("/api/v1/admin/reservations")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should block request (403) if user role is insufficient", async () => {
      // editeur is not allowed on adminReservationsRouter since it requires gerant role
      vi.mocked(prisma.administrator.findUnique).mockResolvedValueOnce(editorAdmin as any);

      const res = await request(app)
        .get("/api/v1/admin/reservations")
        .set("Authorization", `Bearer ${mockEditorToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });
  });

  describe("Admin Reservations Endpoint", () => {
    beforeEach(() => {
      vi.mocked(prisma.administrator.findUnique).mockResolvedValue(testAdmin as any);
    });

    it("should return a list of reservations with pagination and filtering", async () => {
      const mockResObj = {
        id: "res-1",
        requestedDate: new Date(),
        requestedTime: "19:30",
        firstName: "Jean",
        lastName: "Dupont",
        phone: "0600000000",
        email: "jean@example.com",
        guestCount: 2,
        occasion: "autre" as any,
        status: "nouvelle" as any,
      };

      vi.mocked(prisma.reservation.findMany).mockResolvedValueOnce([mockResObj as any]);
      vi.mocked(prisma.reservation.count).mockResolvedValueOnce(1);

      const res = await request(app)
        .get("/api/v1/admin/reservations?page=1&limit=10&status=nouvelle")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.total).toBe(1);
    });

    it("should fail listing if pagination parameters are invalid", async () => {
      const res = await request(app)
        .get("/api/v1/admin/reservations?page=-1")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 404 if retrieving a non-existent reservation ID", async () => {
      vi.mocked(prisma.reservation.findUnique).mockResolvedValueOnce(null);

      const res = await request(app)
        .get("/api/v1/admin/reservations/non-existent-id")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    it("should retrieve reservation details successfully", async () => {
      const mockRes = {
        id: "res-2",
        firstName: "Alice",
        lastName: "Martin",
        phone: "0600000000",
        email: "alice@example.com",
        requestedDate: new Date(),
        requestedTime: "19:30",
        guestCount: 2,
        occasion: "autre",
        message: "No gluten",
        status: "nouvelle" as any,
        notes: [],
        statusHistories: []
      } as any;

      vi.mocked(prisma.reservation.findUnique).mockResolvedValueOnce(mockRes as any);

      const res = await request(app)
        .get("/api/v1/admin/reservations/res-2")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("res-2");
    });

    it("should update reservation status successfully", async () => {
      const mockRes = { id: "res-3", status: "nouvelle" as any };
      vi.mocked(prisma.reservation.findUnique).mockResolvedValueOnce(mockRes as any);
      vi.mocked(prisma.reservation.update).mockResolvedValueOnce({
        id: "res-3",
        status: "confirmee" as any,
        statusChangedAt: new Date()
      } as any);

      const res = await request(app)
        .patch("/api/v1/admin/reservations/res-3/status")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ status: "confirmee" });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("confirmee");
    });

    it("should update reservation status with reason successfully", async () => {
      const mockRes = { 
        id: "res-3b", 
        status: "nouvelle" as any,
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        requestedDate: new Date("2026-06-22"),
        requestedTime: "12:00",
        guestCount: 2
      };
      vi.mocked(prisma.reservation.findUnique).mockResolvedValueOnce(mockRes as any);
      vi.mocked(prisma.reservation.update).mockResolvedValueOnce({
        id: "res-3b",
        status: "refusee" as any,
        statusChangedAt: new Date()
      } as any);

      const res = await request(app)
        .patch("/api/v1/admin/reservations/res-3b/status")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ status: "refusee", reason: "Restaurant complet" });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("refusee");
    });

    it("should add an internal note to a reservation", async () => {
      const mockRes = { id: "res-4" };
      vi.mocked(prisma.reservation.findUnique).mockResolvedValueOnce(mockRes as any);
      vi.mocked(prisma.reservationNote.create).mockResolvedValueOnce({
        id: "note-1",
        body: "Client VIP",
        createdAt: new Date(),
      } as any);

      const res = await request(app)
        .post("/api/v1/admin/reservations/res-4/notes")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ body: "Client VIP" });

      expect(res.status).toBe(201);
      expect(res.body.data.body).toBe("Client VIP");
    });
  });

  describe("Admin Contact Messages Endpoint", () => {
    beforeEach(() => {
      vi.mocked(prisma.administrator.findUnique).mockResolvedValue(testAdmin as any);
    });

    it("should return a list of contact messages", async () => {
      const mockMsg = {
        id: "msg-1",
        name: "Sophie",
        subject: "Question",
        status: "nouveau" as any,
        createdAt: new Date()
      };
      vi.mocked(prisma.contactMessage.findMany).mockResolvedValueOnce([mockMsg as any]);
      vi.mocked(prisma.contactMessage.count).mockResolvedValueOnce(1);

      const res = await request(app)
        .get("/api/v1/admin/contact-messages")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.items).toHaveLength(1);
    });

    it("should return 404 if getting details of non-existent contact ID", async () => {
      vi.mocked(prisma.contactMessage.findUnique).mockResolvedValueOnce(null);

      const res = await request(app)
        .get("/api/v1/admin/contact-messages/invalid-id")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
    });

    it("should successfully update contact message status", async () => {
      const mockMsg = { id: "msg-2", status: "nouveau" as any };
      vi.mocked(prisma.contactMessage.findUnique).mockResolvedValueOnce(mockMsg as any);
      vi.mocked(prisma.contactMessage.update).mockResolvedValueOnce({
        ...mockMsg,
        status: "traite" as any
      } as any);

      const res = await request(app)
        .patch("/api/v1/admin/contact-messages/msg-2/status")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ status: "traite" });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("traite");
    });

    it("should successfully reply to a contact message and change status to traite", async () => {
      const mockMsg = {
        id: "msg-3",
        name: "Jean Dupont",
        email: "jean@example.com",
        subject: "Question sur les vins",
        message: "Avez-vous des vins bio ?",
        status: "nouveau" as any,
        handledByAdminId: null,
        handledAt: null
      };

      vi.mocked(prisma.contactMessage.findUnique).mockResolvedValueOnce(mockMsg as any);
      vi.mocked(prisma.contactMessage.update).mockResolvedValueOnce({
        ...mockMsg,
        status: "traite" as any,
        handledByAdminId: "admin-123",
        handledAt: new Date()
      } as any);
      vi.mocked(prisma.administrator.findUnique).mockResolvedValueOnce(testAdmin as any);

      const res = await request(app)
        .post("/api/v1/admin/contact-messages/msg-3/reply")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ message: "Bonjour Jean, oui nous avons des vins bio." });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("traite");
    });

    it("should return validation error if reply message is empty", async () => {
      const res = await request(app)
        .post("/api/v1/admin/contact-messages/msg-3/reply")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ message: "" });

      expect(res.status).toBe(422);
    });

    it("should return validation error if reply message is too long", async () => {
      const longMessage = "a".repeat(2001);
      const res = await request(app)
        .post("/api/v1/admin/contact-messages/msg-3/reply")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ message: longMessage });

      expect(res.status).toBe(422);
    });
  });

  describe("Admin Menu Categories Endpoint", () => {
    beforeEach(() => {
      vi.mocked(prisma.administrator.findUnique).mockResolvedValue(testAdmin as any);
    });

    it("should list menu categories", async () => {
      vi.mocked(prisma.menuCategory.findMany).mockResolvedValueOnce([
        { id: "cat-1", name: "Entrées", slug: "entrees", displayOrder: 1, isActive: true } as any
      ]);

      const res = await request(app)
        .get("/api/v1/admin/menu-categories")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data[0].slug).toBe("entrees");
    });

    it("should create a new category", async () => {
      vi.mocked(prisma.menuCategory.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.menuCategory.create).mockResolvedValueOnce({
        id: "cat-2",
        name: "Plats",
        slug: "plats",
        displayOrder: 2,
        isActive: true
      } as any);

      const res = await request(app)
        .post("/api/v1/admin/menu-categories")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ name: "Plats", slug: "plats", displayOrder: 2, isActive: true });

      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe("plats");
    });

    it("should fail category creation if slug already exists (conflict)", async () => {
      vi.mocked(prisma.menuCategory.findUnique).mockResolvedValueOnce({ id: "cat-ex" } as any);

      const res = await request(app)
        .post("/api/v1/admin/menu-categories")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ name: "Plats", slug: "plats", displayOrder: 2 });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe("CONFLICT");
    });

    it("should delete a category", async () => {
      vi.mocked(prisma.menuCategory.findUnique).mockResolvedValueOnce({ id: "cat-3" } as any);
      vi.mocked(prisma.menuCategory.delete).mockResolvedValueOnce({ id: "cat-3" } as any);

      const res = await request(app)
        .delete("/api/v1/admin/menu-categories/cat-3")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe("Admin Menu Items/Plats Endpoint", () => {
    beforeEach(() => {
      vi.mocked(prisma.administrator.findUnique).mockResolvedValue(testAdmin as any);
    });

    it("should list menu items", async () => {
      vi.mocked(prisma.menuItem.findMany).mockResolvedValueOnce([
        { id: "item-1", name: "Salade César", priceCents: 1200, displayOrder: 1 } as any
      ]);

      const res = await request(app)
        .get("/api/v1/admin/menu-items")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data[0].name).toBe("Salade César");
    });

    it("should return 404 for non-existent item", async () => {
      vi.mocked(prisma.menuItem.findUnique).mockResolvedValueOnce(null);

      const res = await request(app)
        .get("/api/v1/admin/menu-items/non-existent")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
    });

    it("should create a menu item with valid data", async () => {
      vi.mocked(prisma.menuCategory.findUnique).mockResolvedValueOnce({ id: "cat-1" } as any);
      vi.mocked(prisma.menuItem.create).mockResolvedValueOnce({
        id: "item-2",
        name: "Burger",
        priceCents: 1500
      } as any);

      const res = await request(app)
        .post("/api/v1/admin/menu-items")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          categoryId: "cat-1",
          name: "Burger",
          priceCents: 1500,
          displayOrder: 1,
          availability: "disponible"
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Burger");
    });

    it("should fail validation on creation if pricing is negative", async () => {
      const res = await request(app)
        .post("/api/v1/admin/menu-items")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          categoryId: "cat-1",
          name: "Burger",
          priceCents: -500,
          displayOrder: 1
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("Admin Settings Endpoint", () => {
    beforeEach(() => {
      vi.mocked(prisma.administrator.findUnique).mockResolvedValue(testAdmin as any);
    });

    it("should retrieve settings details", async () => {
      const mockSettings = {
        id: "settings-1",
        restaurantName: "La Loge",
        openingHours: [],
        socialLinks: [],
      };
      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValueOnce(mockSettings as any);

      const res = await request(app)
        .get("/api/v1/admin/settings")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.restaurantName).toBe("La Loge");
    });

    it("should trigger validation errors on invalid settings formats", async () => {
      const res = await request(app)
        .patch("/api/v1/admin/settings")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          restaurantName: "", // invalid empty name
          email: "invalid-email-format"
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
