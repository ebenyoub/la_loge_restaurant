import type { Request, Response, NextFunction } from "express";
import { checkUnknownFields, validateEmail } from "./base.validator.js";

export function validateCreateContactMessage(req: Request, res: Response, next: NextFunction) {
  const allowedKeys = [
    "name",
    "email",
    "phone",
    "subject",
    "message",
    "consent"
  ];

  // 1. Check for unknown fields -> 400 INVALID_BODY
  const unknownFields = checkUnknownFields(req.body, allowedKeys);
  if (unknownFields.length > 0) {
    return next({
      status: 400,
      code: "INVALID_BODY",
      message: `Le corps de la requête contient des champs inconnus : ${unknownFields.join(", ")}.`
    });
  }

  const fields: Record<string, string> = {};

  const {
    name,
    email,
    phone,
    subject,
    message,
    consent
  } = req.body;

  // 2. Validate name
  if (typeof name !== "string" || name.trim() === "") {
    fields.name = "Le nom est requis.";
  } else if (name.length > 100) {
    fields.name = "Le nom ne peut pas dépasser 100 caractères.";
  }

  // 3. Validate email
  if (typeof email !== "string" || email.trim() === "") {
    fields.email = "L'adresse e-mail est requise.";
  } else if (!validateEmail(email)) {
    fields.email = "Format d'e-mail invalide.";
  }

  // 4. Validate phone
  if (phone !== undefined && phone !== null) {
    if (typeof phone !== "string" || phone.trim() === "") {
      fields.phone = "Le téléphone ne peut pas être vide s'il est fourni.";
    }
  }

  // 5. Validate subject
  if (typeof subject !== "string" || subject.trim() === "") {
    fields.subject = "L'objet du message est requis.";
  } else if (subject.length > 200) {
    fields.subject = "L'objet ne peut pas dépasser 200 caractères.";
  }

  // 6. Validate message
  if (typeof message !== "string" || message.trim() === "") {
    fields.message = "Le message est requis.";
  } else if (message.length > 5000) {
    fields.message = "Le message ne peut pas dépasser 5000 caractères.";
  }

  // 7. Validate consent
  if (consent !== true) {
    fields.consent = "Votre consentement est requis pour envoyer le message.";
  }

  if (Object.keys(fields).length > 0) {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs doivent être corrigés.",
      fields
    });
  }

  next();
}
