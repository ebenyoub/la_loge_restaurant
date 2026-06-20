import { Router } from "express";
import { login, getMe } from "../controllers/auth.controller.js";
import { validateLogin } from "../validators/auth.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/api/v1/admin/login", validateLogin, login);
authRouter.get("/api/v1/admin/me", authMiddleware, getMe);
