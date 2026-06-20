import { Router } from "express";
import { createContactMessage } from "../controllers/contact-messages.controller.js";
import { validateCreateContactMessage } from "../validators/contact-messages.validator.js";

export const contactMessagesRouter = Router();

contactMessagesRouter.post("/api/v1/contact-messages", validateCreateContactMessage, createContactMessage);
