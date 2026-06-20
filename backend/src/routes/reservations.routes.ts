import { Router } from "express";
import { createReservation } from "../controllers/reservations.controller.js";
import { validateCreateReservation } from "../validators/reservations.validator.js";

export const reservationsRouter = Router();

reservationsRouter.post("/api/v1/reservations", validateCreateReservation, createReservation);
