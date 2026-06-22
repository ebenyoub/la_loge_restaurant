import type { Request, Response, NextFunction } from "express";
import { checkUnknownFields, validateDate } from "./base.validator.js";

export function validateListReservations(req: Request, _res: Response, next: NextFunction) {
  const { date, status, name, page, pageSize } = req.query;
  const errors: Record<string, string> = {};

  if (date !== undefined) {
    if (typeof date !== "string" || !validateDate(date)) {
      errors.date = "Format de date invalide (YYYY-MM-DD attendu).";
    }
  }

  const validStatuses = ["nouvelle", "en_attente", "confirmee", "refusee", "annulee"];
  if (status !== undefined) {
    if (typeof status !== "string" || !validStatuses.includes(status)) {
      errors.status = `Le statut doit être l'un des suivants : ${validStatuses.join(", ")}.`;
    }
  }

  if (name !== undefined) {
    if (typeof name !== "string") {
      errors.name = "Le nom doit être une chaîne de caractères.";
    }
  }

  if (page !== undefined) {
    const p = Number(page);
    if (isNaN(p) || !Number.isInteger(p) || p <= 0) {
      errors.page = "La page doit être un entier strictement positif.";
    }
  }

  if (pageSize !== undefined) {
    const ps = Number(pageSize);
    if (isNaN(ps) || !Number.isInteger(ps) || ps <= 0 || ps > 100) {
      errors.pageSize = "La taille de page doit être un entier compris entre 1 et 100.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Paramètres de recherche invalides.",
      fields: errors
    });
  }

  next();
}

export function validateUpdateReservationStatus(req: Request, _res: Response, next: NextFunction) {
  const allowedKeys = ["status", "reason"];

  const unknownFields = checkUnknownFields(req.body, allowedKeys);
  if (unknownFields.length > 0) {
    return next({
      status: 400,
      code: "INVALID_BODY",
      message: `Le corps de la requête contient des champs inconnus : ${unknownFields.join(", ")}.`
    });
  }

  const { status, reason } = req.body;
  const validTransitions = ["en_attente", "confirmee", "refusee", "annulee"];

  if (typeof status !== "string" || status.trim() === "") {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs doivent être corrigés.",
      fields: { status: "Le statut est requis." }
    });
  }

  if (!validTransitions.includes(status)) {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs doivent être corrigés.",
      fields: { status: `Statut de transition invalide. Choix autorisés : ${validTransitions.join(", ")}.` }
    });
  }

  if (reason !== undefined && typeof reason !== "string") {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs doivent être corrigés.",
      fields: { reason: "Le motif doit être une chaîne de caractères." }
    });
  }

  next();
}

export function validateAddReservationNote(req: Request, _res: Response, next: NextFunction) {
  const allowedKeys = ["body"];

  const unknownFields = checkUnknownFields(req.body, allowedKeys);
  if (unknownFields.length > 0) {
    return next({
      status: 400,
      code: "INVALID_BODY",
      message: `Le corps de la requête contient des champs inconnus : ${unknownFields.join(", ")}.`
    });
  }

  const { body } = req.body;

  if (typeof body !== "string" || body.trim() === "") {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs doivent être corrigés.",
      fields: { body: "Le contenu de la note est requis." }
    });
  }

  if (body.length > 1000) {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs doivent être corrigés.",
      fields: { body: "Le contenu de la note ne peut pas dépasser 1000 caractères." }
    });
  }

  next();
}
