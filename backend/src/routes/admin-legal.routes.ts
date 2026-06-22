import { Router } from "express";
import { listLegalDocuments, updateLegalDocuments } from "../controllers/admin-legal.controller.js";
import { validateUpdateLegalDocuments } from "../validators/admin-legal.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

export const adminLegalRouter = Router();

// Scope authentication to admin paths so public routes remain accessible.
adminLegalRouter.use("/api/v1/admin", authMiddleware);
adminLegalRouter.use("/api/v1/admin", requireRole(["gerant", "editeur"]));

adminLegalRouter.get("/api/v1/admin/legal-documents", listLegalDocuments);
adminLegalRouter.put("/api/v1/admin/legal-documents", validateUpdateLegalDocuments, updateLegalDocuments);
