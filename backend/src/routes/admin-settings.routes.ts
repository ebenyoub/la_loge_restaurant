import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/admin-settings.controller.js";
import { validateUpdateSettings } from "../validators/admin-settings.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

export const adminSettingsRouter = Router();

// Apply auth and role protection globally
adminSettingsRouter.use(authMiddleware);
adminSettingsRouter.use(requireRole(["gerant", "editeur"]));

adminSettingsRouter.get("/api/v1/admin/settings", getSettings);
adminSettingsRouter.patch("/api/v1/admin/settings", validateUpdateSettings, updateSettings);
