import { Router } from "express";
import {
  listReservations,
  getReservation,
  updateReservationStatus,
  addReservationNote
} from "../controllers/admin-reservations.controller.js";
import {
  validateListReservations,
  validateUpdateReservationStatus,
  validateAddReservationNote
} from "../validators/admin-reservations.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

export const adminReservationsRouter = Router();

// Scope authentication to admin paths so public routes remain accessible.
adminReservationsRouter.use("/api/v1/admin", authMiddleware);
adminReservationsRouter.use("/api/v1/admin", requireRole("gerant"));

adminReservationsRouter.get("/api/v1/admin/reservations", validateListReservations, listReservations);
adminReservationsRouter.get("/api/v1/admin/reservations/:id", getReservation);
adminReservationsRouter.patch("/api/v1/admin/reservations/:id/status", validateUpdateReservationStatus, updateReservationStatus);
adminReservationsRouter.post("/api/v1/admin/reservations/:id/notes", validateAddReservationNote, addReservationNote);
