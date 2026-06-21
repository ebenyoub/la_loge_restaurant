import { Router } from "express";
import {
  listMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from "../controllers/admin-items.controller.js";
import {
  validateCreateMenuItem,
  validateUpdateMenuItem
} from "../validators/admin-menu.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

export const adminItemsRouter = Router();

// Scope authentication to admin paths so public routes remain accessible.
adminItemsRouter.use("/api/v1/admin", authMiddleware);
adminItemsRouter.use("/api/v1/admin", requireRole(["gerant", "editeur"]));

adminItemsRouter.get("/api/v1/admin/menu-items", listMenuItems);
adminItemsRouter.get("/api/v1/admin/menu-items/:id", getMenuItem);
adminItemsRouter.post("/api/v1/admin/menu-items", validateCreateMenuItem, createMenuItem);
adminItemsRouter.patch("/api/v1/admin/menu-items/:id", validateUpdateMenuItem, updateMenuItem);
adminItemsRouter.delete("/api/v1/admin/menu-items/:id", deleteMenuItem);
