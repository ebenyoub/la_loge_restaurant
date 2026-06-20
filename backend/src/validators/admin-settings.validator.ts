import type { Request, Response, NextFunction } from "express";
import { checkUnknownFields, validateEmail } from "./base.validator.js";

export function validateUpdateSettings(req: Request, _res: Response, next: NextFunction) {
  const allowedKeys = [
    "restaurantName",
    "shortPresentation",
    "addressLine1",
    "addressLine2",
    "postalCode",
    "city",
    "countryCode",
    "phone",
    "email",
    "googleMapsUrl",
    "defaultLocale"
  ];

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
    restaurantName,
    shortPresentation,
    addressLine1,
    addressLine2,
    postalCode,
    city,
    countryCode,
    phone,
    email,
    googleMapsUrl,
    defaultLocale
  } = req.body;

  if (restaurantName !== undefined) {
    if (typeof restaurantName !== "string" || restaurantName.trim() === "") {
      fields.restaurantName = "Le nom du restaurant doit être une chaîne non vide.";
    }
  }

  if (shortPresentation !== undefined && shortPresentation !== null) {
    if (typeof shortPresentation !== "string") {
      fields.shortPresentation = "La présentation courte doit être une chaîne.";
    }
  }

  if (addressLine1 !== undefined && addressLine1 !== null) {
    if (typeof addressLine1 !== "string") {
      fields.addressLine1 = "L'adresse doit être une chaîne.";
    }
  }

  if (addressLine2 !== undefined && addressLine2 !== null) {
    if (typeof addressLine2 !== "string") {
      fields.addressLine2 = "Le complément d'adresse doit être une chaîne.";
    }
  }

  if (postalCode !== undefined && postalCode !== null) {
    if (typeof postalCode !== "string") {
      fields.postalCode = "Le code postal doit être une chaîne.";
    }
  }

  if (city !== undefined && city !== null) {
    if (typeof city !== "string") {
      fields.city = "La ville doit être une chaîne.";
    }
  }

  if (countryCode !== undefined && countryCode !== null) {
    if (typeof countryCode !== "string") {
      fields.countryCode = "Le code pays doit être une chaîne.";
    }
  }

  if (phone !== undefined && phone !== null) {
    if (typeof phone !== "string") {
      fields.phone = "Le téléphone doit être une chaîne.";
    }
  }

  if (email !== undefined && email !== null) {
    if (typeof email !== "string") {
      fields.email = "L'e-mail doit être une chaîne.";
    } else if (email.trim() !== "" && !validateEmail(email)) {
      fields.email = "Format d'e-mail invalide.";
    }
  }

  if (googleMapsUrl !== undefined && googleMapsUrl !== null) {
    if (typeof googleMapsUrl !== "string") {
      fields.googleMapsUrl = "L'URL Google Maps doit être une chaîne.";
    }
  }

  if (defaultLocale !== undefined) {
    if (typeof defaultLocale !== "string" || defaultLocale.trim() === "") {
      fields.defaultLocale = "La langue par défaut doit être une chaîne non vide.";
    }
  }

  if (Object.keys(fields).length > 0) {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs de paramétrage sont invalides.",
      fields
    });
  }

  next();
}
