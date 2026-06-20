import type { Request, Response, NextFunction } from "express";
import { checkUnknownFields, validateEmail } from "./base.validator.js";

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const allowedKeys = ["email", "password"];

  const unknownFields = checkUnknownFields(req.body, allowedKeys);
  if (unknownFields.length > 0) {
    return next({
      status: 400,
      code: "INVALID_BODY",
      message: `Le corps de la requête contient des champs inconnus : ${unknownFields.join(", ")}.`
    });
  }

  const fields: Record<string, string> = {};
  const { email, password } = req.body;

  if (typeof email !== "string" || email.trim() === "") {
    fields.email = "L'adresse e-mail est requise.";
  } else if (!validateEmail(email)) {
    fields.email = "Format d'e-mail invalide.";
  }

  if (typeof password !== "string" || password.trim() === "") {
    fields.password = "Le mot de passe est requis.";
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
