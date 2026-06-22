import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

describe("Legal Document Endpoints Tests", () => {
  describe("GET /api/v1/public/legal-documents", () => {
    it("should return 200 OK and all legal documents", async () => {
      const mockDocs = [
        { documentKey: "mentions_legales", title: "Mentions", body: "Text 1", version: "1.0.0" },
        { documentKey: "confidentialite", title: "Privacy", body: "Text 2", version: "1.0.0" }
      ];
      vi.mocked(prisma.legalDocument.findMany).mockResolvedValueOnce(mockDocs as any);

      const res = await request(app).get("/api/v1/public/legal-documents");
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockDocs);
    });
  });

  describe("Protected Admin Legal Routes", () => {
    it("should return 401 on GET /api/v1/admin/legal-documents without token", async () => {
      const res = await request(app).get("/api/v1/admin/legal-documents");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should return 401 on PUT /api/v1/admin/legal-documents without token", async () => {
      const res = await request(app)
        .put("/api/v1/admin/legal-documents")
        .send({ documents: [] });
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("should allow get and update legal documents when authenticated as admin", async () => {
      // Mock administrator findUnique
      const mockAdmin = { id: "admin-id", email: "admin@example.com", role: "gerant", isActive: true };
      vi.mocked(prisma.administrator.findUnique).mockResolvedValue(mockAdmin as any);

      // Generate a mock token
      const token = jwt.sign(
        { sub: "admin-id", email: "admin@example.com", role: "gerant" },
        env.jwtSecret
      );

      const mockDocs = [
        { documentKey: "mentions_legales", title: "Mentions", body: "Text 1", version: "1.0.0" }
      ];
      vi.mocked(prisma.legalDocument.findMany).mockResolvedValueOnce(mockDocs as any);

      // Test GET
      const getRes = await request(app)
        .get("/api/v1/admin/legal-documents")
        .set("Authorization", `Bearer ${token}`);
      
      console.log("GET RESPONSE:", getRes.body);
      expect(getRes.status).toBe(200);
      expect(getRes.body.data).toEqual(mockDocs);

      // Test PUT
      vi.mocked(prisma.administrator.findUnique).mockResolvedValue(mockAdmin as any);
      vi.mocked(prisma.legalDocument.upsert).mockResolvedValueOnce({
        documentKey: "mentions_legales",
        title: "New Title",
        body: "New Body",
        version: "1.1.0"
      } as any);

      const putRes = await request(app)
        .put("/api/v1/admin/legal-documents")
        .set("Authorization", `Bearer ${token}`)
        .send({
          documents: [
            {
              documentKey: "mentions_legales",
              title: "New Title",
              body: "New Body",
              version: "1.1.0"
            }
          ]
        });

      expect(putRes.status).toBe(200);
      expect(putRes.body.data[0].title).toBe("New Title");
    });

    it("should fail validation on invalid payload for PUT", async () => {
      // Mock administrator findUnique
      const mockAdmin = { id: "admin-id", email: "admin@example.com", role: "gerant", isActive: true };
      vi.mocked(prisma.administrator.findUnique).mockResolvedValue(mockAdmin as any);

      const token = jwt.sign(
        { sub: "admin-id", email: "admin@example.com", role: "gerant" },
        env.jwtSecret
      );

      const res = await request(app)
        .put("/api/v1/admin/legal-documents")
        .set("Authorization", `Bearer ${token}`)
        .send({
          documents: [
            {
              documentKey: "",
              title: "Title",
              body: "Body"
            }
          ]
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
