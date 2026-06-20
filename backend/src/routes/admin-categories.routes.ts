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

// Apply auth and role protection globally
adminCategoriesRouter.use(authMiddleware);
adminCategoriesRouter.use(requireRole(["gerant", "editeur"]));

adminCategoriesRouter.get("/api/v1/admin/menu-categories", listCategories);
adminCategoriesRouter.get("/api/v1/admin/menu-categories/:id", getCategory);
adminCategoriesRouter.post("/api/v1/admin/menu-categories", validateCreateCategory, createCategory);
adminCategoriesRouter.patch("/api/v1/admin/menu-categories/:id", validateUpdateCategory, updateCategory);
adminCategoriesRouter.delete("/api/v1/admin/menu-categories/:id", deleteCategory);
