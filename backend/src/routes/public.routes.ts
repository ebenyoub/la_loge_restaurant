import { Router } from "express";
import { getPublicSettings, getPublicMenu, getPublicLegalDocuments } from "../controllers/public.controller.js";

export const publicRouter = Router();

publicRouter.get("/api/v1/public/settings", getPublicSettings);
publicRouter.get("/api/v1/public/menu", getPublicMenu);
publicRouter.get("/api/v1/public/legal-documents", getPublicLegalDocuments);

