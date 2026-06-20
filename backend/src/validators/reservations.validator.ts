import type { Request, Response, NextFunction } from "express";
import { checkUnknownFields, validateEmail, validateDate, validateTime } from "./base.validator.js";

export function validateCreateReservation(req: Request, res: Response, next: NextFunction) {
  const allowedKeys = [
    "firstName",
    "lastName",
    "phone",
    "email",
    "requestedDate",
    "requestedTime",
    "guestCount",
    "occasion",
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
    firstName,
    lastName,
    phone,
    email,
    requestedDate,
    requestedTime,
    guestCount,
    occasion,
    message,
    consent
  } = req.body;

  // 2. Validate firstName
  if (typeof firstName !== "string" || firstName.trim() === "") {
    fields.firstName = "Le prénom est requis.";
  } else if (firstName.length > 100) {
    fields.firstName = "Le prénom ne peut pas dépasser 100 caractères.";
  }

  // 3. Validate lastName
  if (typeof lastName !== "string" || lastName.trim() === "") {
    fields.lastName = "Le nom est requis.";
  } else if (lastName.length > 100) {
    fields.lastName = "Le nom ne peut pas dépasser 100 caractères.";
  }

  // 4. Validate phone
  if (typeof phone !== "string" || phone.trim() === "") {
    fields.phone = "Le numéro de téléphone est requis.";
  }

  // 5. Validate email
  if (typeof email !== "string" || email.trim() === "") {
    fields.email = "L'adresse e-mail est requise.";
  } else if (!validateEmail(email)) {
    fields.email = "Format d'e-mail invalide.";
  }

  // 6. Validate requestedDate
  if (typeof requestedDate !== "string" || requestedDate.trim() === "") {
    fields.requestedDate = "La date de réservation est requise.";
  } else if (!validateDate(requestedDate)) {
    fields.requestedDate = "Format de date invalide (YYYY-MM-DD attendu).";
  } else {
    // Check if requestedDate is in the past compared to the current date in Europe/Paris
    const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
    if (requestedDate < todayStr) {
      fields.requestedDate = "La date de réservation ne peut pas être dans le passé.";
    }
  }

  // 7. Validate requestedTime
  if (typeof requestedTime !== "string" || requestedTime.trim() === "") {
    fields.requestedTime = "L'heure de réservation est requise.";
  } else if (!validateTime(requestedTime)) {
    fields.requestedTime = "Format d'heure invalide (HH:mm attendu).";
  }

  // 8. Validate guestCount
  if (typeof guestCount !== "number" || !Number.isInteger(guestCount) || guestCount <= 0) {
    fields.guestCount = "Le nombre de personnes doit être un entier supérieur à zéro.";
  }

  // 9. Validate occasion
  const validOccasions = ["anniversaire", "repas_pro", "groupe", "autre"];
  if (occasion !== undefined && occasion !== null) {
    if (typeof occasion !== "string" || !validOccasions.includes(occasion)) {
      fields.occasion = `L'occasion doit être l'une des valeurs suivantes : ${validOccasions.join(", ")}.`;
    }
  }

  // 10. Validate message
  if (message !== undefined && message !== null) {
    if (typeof message !== "string") {
      fields.message = "Le message doit être une chaîne de caractères.";
    } else if (message.length > 1000) {
      fields.message = "Le message ne peut pas dépasser 1000 caractères.";
    }
  }

  // 11. Validate consent
  if (consent !== true) {
    fields.consent = "Votre consentement est requis pour envoyer la demande.";
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
