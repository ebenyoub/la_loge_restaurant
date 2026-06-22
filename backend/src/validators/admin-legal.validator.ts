import type { Request, Response, NextFunction } from "express";
import { checkUnknownFields } from "./base.validator.js";

export function validateUpdateLegalDocuments(req: Request, _res: Response, next: NextFunction) {
  const allowedKeys = ["documents"];

  const unknownFields = checkUnknownFields(req.body, allowedKeys);
  if (unknownFields.length > 0) {
    return next({
      status: 400,
      code: "INVALID_BODY",
      message: `Le corps de la requête contient des champs inconnus : ${unknownFields.join(", ")}.`
    });
  }

  const { documents } = req.body;
  const fields: Record<string, string> = {};

  if (!documents || !Array.isArray(documents)) {
    fields.documents = "Les documents doivent être fournis sous forme de tableau.";
  } else {
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      if (!doc.documentKey || typeof doc.documentKey !== "string") {
        fields[`documents[${i}].documentKey`] = "Le champ documentKey est requis et doit être une chaîne.";
      }
      if (!doc.title || typeof doc.title !== "string") {
        fields[`documents[${i}].title`] = "Le champ title est requis et doit être une chaîne.";
      }
      if (doc.body === undefined || typeof doc.body !== "string") {
        fields[`documents[${i}].body`] = "Le champ body est requis et doit être une chaîne.";
      }
      if (!doc.version || typeof doc.version !== "string") {
        fields[`documents[${i}].version`] = "Le champ version est requis et doit être une chaîne.";
      }
    }
  }

  if (Object.keys(fields).length > 0) {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs de documents légaux sont invalides.",
      fields
    });
  }

  next();
}
