import { Router } from "express";
import { getPublicSettings, getPublicMenu } from "../controllers/public.controller.js";

export const publicRouter = Router();

publicRouter.get("/api/v1/public/settings", getPublicSettings);
publicRouter.get("/api/v1/public/menu", getPublicMenu);
