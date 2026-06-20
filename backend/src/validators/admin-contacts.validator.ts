import type { Request, Response, NextFunction } from "express";
import { checkUnknownFields } from "./base.validator.js";

export function validateListContactMessages(req: Request, _res: Response, next: NextFunction) {
  const { status, page, pageSize } = req.query;
  const errors: Record<string, string> = {};

  const validStatuses = ["nouveau", "lu", "traite", "archive"];
  if (status !== undefined) {
    if (typeof status !== "string" || !validStatuses.includes(status)) {
      errors.status = `Le statut doit être l'un des suivants : ${validStatuses.join(", ")}.`;
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

export function validateUpdateContactMessageStatus(req: Request, _res: Response, next: NextFunction) {
  const allowedKeys = ["status"];

  const unknownFields = checkUnknownFields(req.body, allowedKeys);
  if (unknownFields.length > 0) {
    return next({
      status: 400,
      code: "INVALID_BODY",
      message: `Le corps de la requête contient des champs inconnus : ${unknownFields.join(", ")}.`
    });
  }

  const { status } = req.body;
  const validTransitions = ["lu", "traite", "archive"];

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

  next();
}
