import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("API Endpoints Tests", () => {
  describe("GET /health", () => {
    it("should return 200 OK and health status", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({
        service: "la-loge-backend",
        status: "ok",
      });
    });
  });

  describe("POST /api/v1/reservations", () => {
    it("should fail validation on invalid payload", async () => {
      const res = await request(app)
        .post("/api/v1/reservations")
        .send({ firstName: "" });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should succeed and create reservation on valid payload", async () => {
      // Mock prisma reservation creation
      const mockReservation = {
        id: "mock-id",
        status: "nouvelle",
      };
      vi.mocked(prisma.reservation.create).mockResolvedValueOnce(mockReservation as any);
      vi.mocked(prisma.openingHour.findFirst).mockResolvedValueOnce(null);

      // Fix past date checking in validation: always supply a future date
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const res = await request(app)
        .post("/api/v1/reservations")
        .send({
          firstName: "Jean",
          lastName: "Dupont",
          phone: "0600000000",
          email: "jean@example.com",
          requestedDate: futureDate,
          requestedTime: "19:30",
          guestCount: 2,
          occasion: "anniversaire",
          message: "Pas de gluten",
          consent: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBe("mock-id");
    });

    it("should fail reservation if restaurant is closed on that day", async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const futureDateStr = futureDate.toISOString().split("T")[0];
      const dayOfWeek = futureDate.getDay();

      vi.mocked(prisma.openingHour.findFirst).mockResolvedValueOnce({
        id: "oh-1",
        dayOfWeek,
        isClosed: true,
      } as any);

      const res = await request(app)
        .post("/api/v1/reservations")
        .send({
          firstName: "Jean",
          lastName: "Dupont",
          phone: "0600000000",
          email: "jean@example.com",
          requestedDate: futureDateStr,
          requestedTime: "19:30",
          guestCount: 2,
          consent: true,
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("OUTSIDE_OPENING_HOURS");
    });

    it("should fail reservation if requested time is outside opening hours", async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const futureDateStr = futureDate.toISOString().split("T")[0];
      const dayOfWeek = futureDate.getDay();

      vi.mocked(prisma.openingHour.findFirst).mockResolvedValueOnce({
        id: "oh-1",
        dayOfWeek,
        isClosed: false,
        opensAt: "12:00",
        closesAt: "15:00",
      } as any);

      const res = await request(app)
        .post("/api/v1/reservations")
        .send({
          firstName: "Jean",
          lastName: "Dupont",
          phone: "0600000000",
          email: "jean@example.com",
          requestedDate: futureDateStr,
          requestedTime: "19:30",
          guestCount: 2,
          consent: true,
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("OUTSIDE_OPENING_HOURS");
    });
  });

  describe("POST /api/v1/contact-messages", () => {
    it("should fail validation on invalid payload", async () => {
      const res = await request(app)
        .post("/api/v1/contact-messages")
        .send({ name: "" });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should succeed and create contact message on valid payload", async () => {
      vi.mocked(prisma.contactMessage.create).mockResolvedValueOnce({
        id: "mock-contact-id",
        status: "nouveau",
      } as any);

      const res = await request(app)
        .post("/api/v1/contact-messages")
        .send({
          name: "Jean",
          email: "jean@example.com",
          phone: "0600000000",
          subject: "Question",
          message: "Est-ce ouvert le dimanche ?",
          consent: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBe("mock-contact-id");
      expect(res.body.data.status).toBe("nouveau");
    });
  });

  describe("POST /api/v1/admin/login", () => {
    it("should fail authentication on invalid credentials", async () => {
      vi.mocked(prisma.administrator.findUnique).mockResolvedValueOnce(null);

      const res = await request(app)
        .post("/api/v1/admin/login")
        .send({ email: "wrong@example.com", password: "password" });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });
  });

  describe("Protected Admin Routes Without Token", () => {
    it("should return 401 on GET /api/v1/admin/reservations without token", async () => {
      const res = await request(app).get("/api/v1/admin/reservations");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should return 401 on GET /api/v1/admin/contact-messages without token", async () => {
      const res = await request(app).get("/api/v1/admin/contact-messages");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should return 401 on GET /api/v1/admin/settings without token", async () => {
      const res = await request(app).get("/api/v1/admin/settings");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });
  });
});
