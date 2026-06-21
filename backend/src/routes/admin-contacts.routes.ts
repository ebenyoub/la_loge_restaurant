import { Router } from "express";
import {
  listContactMessages,
  getContactMessage,
  updateContactMessageStatus
} from "../controllers/admin-contacts.controller.js";
import {
  validateListContactMessages,
  validateUpdateContactMessageStatus
} from "../validators/admin-contacts.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

export const adminContactsRouter = Router();

// Scope authentication to admin paths so public routes remain accessible.
adminContactsRouter.use("/api/v1/admin", authMiddleware);
adminContactsRouter.use("/api/v1/admin", requireRole(["gerant", "editeur"]));

adminContactsRouter.get("/api/v1/admin/contact-messages", validateListContactMessages, listContactMessages);
adminContactsRouter.get("/api/v1/admin/contact-messages/:id", getContactMessage);
adminContactsRouter.patch("/api/v1/admin/contact-messages/:id/status", validateUpdateContactMessageStatus, updateContactMessageStatus);
