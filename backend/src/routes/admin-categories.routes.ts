import { Router } from "express";
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/admin-categories.controller.js";
import {
  validateCreateCategory,
  validateUpdateCategory
} from "../validators/admin-menu.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

export const adminCategoriesRouter = Router();

// Scope authentication to admin paths so public routes remain accessible.
adminCategoriesRouter.use("/api/v1/admin", authMiddleware);
adminCategoriesRouter.use("/api/v1/admin", requireRole(["gerant", "editeur"]));

adminCategoriesRouter.get("/api/v1/admin/menu-categories", listCategories);
adminCategoriesRouter.get("/api/v1/admin/menu-categories/:id", getCategory);
adminCategoriesRouter.post("/api/v1/admin/menu-categories", validateCreateCategory, createCategory);
adminCategoriesRouter.patch("/api/v1/admin/menu-categories/:id", validateUpdateCategory, updateCategory);
adminCategoriesRouter.delete("/api/v1/admin/menu-categories/:id", deleteCategory);
