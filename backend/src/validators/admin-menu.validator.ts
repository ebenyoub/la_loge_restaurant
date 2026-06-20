import type { Request, Response, NextFunction } from "express";
import { checkUnknownFields } from "./base.validator.js";

// Helper for slug format validation (letters, numbers, hyphens, underscores)
const SLUG_REGEX = /^[a-z0-9-_]+$/;

export function validateCreateCategory(req: Request, _res: Response, next: NextFunction) {
  const allowedKeys = ["name", "slug", "description", "displayOrder", "isActive"];

  const unknownFields = checkUnknownFields(req.body, allowedKeys);
  if (unknownFields.length > 0) {
    return next({
      status: 400,
      code: "INVALID_BODY",
      message: `Le corps de la requête contient des champs inconnus : ${unknownFields.join(", ")}.`
    });
  }

  const fields: Record<string, string> = {};
  const { name, slug, description, displayOrder, isActive } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    fields.name = "Le nom de la catégorie est requis.";
  }

  if (typeof slug !== "string" || slug.trim() === "") {
    fields.slug = "Le slug de la catégorie est requis.";
  } else if (!SLUG_REGEX.test(slug)) {
    fields.slug = "Format de slug invalide (lettres minuscules, chiffres, tirets et underscores uniquement).";
  }

  if (description !== undefined && description !== null && typeof description !== "string") {
    fields.description = "La description doit être une chaîne de caractères.";
  }

  if (typeof displayOrder !== "number" || !Number.isInteger(displayOrder)) {
    fields.displayOrder = "L'ordre d'affichage doit être un entier.";
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    fields.isActive = "L'état actif doit être un booléen.";
  }

  if (Object.keys(fields).length > 0) {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs de la catégorie sont invalides.",
      fields
    });
  }

  next();
}

export function validateUpdateCategory(req: Request, _res: Response, next: NextFunction) {
  const allowedKeys = ["name", "slug", "description", "displayOrder", "isActive"];

  const unknownFields = checkUnknownFields(req.body, allowedKeys);
  if (unknownFields.length > 0) {
    return next({
      status: 400,
      code: "INVALID_BODY",
      message: `Le corps de la requête contient des champs inconnus : ${unknownFields.join(", ")}.`
    });
  }

  const fields: Record<string, string> = {};
  const { name, slug, description, displayOrder, isActive } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") {
      fields.name = "Le nom de la catégorie doit être une chaîne non vide.";
    }
  }

  if (slug !== undefined) {
    if (typeof slug !== "string" || slug.trim() === "") {
      fields.slug = "Le slug de la catégorie doit être une chaîne non vide.";
    } else if (!SLUG_REGEX.test(slug)) {
      fields.slug = "Format de slug invalide.";
    }
  }

  if (description !== undefined && description !== null && typeof description !== "string") {
    fields.description = "La description doit être une chaîne.";
  }

  if (displayOrder !== undefined) {
    if (typeof displayOrder !== "number" || !Number.isInteger(displayOrder)) {
      fields.displayOrder = "L'ordre d'affichage doit être un entier.";
    }
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    fields.isActive = "L'état actif doit être un booléen.";
  }

  if (Object.keys(fields).length > 0) {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs de la catégorie sont invalides.",
      fields
    });
  }

  next();
}

export function validateCreateMenuItem(req: Request, _res: Response, next: NextFunction) {
  const allowedKeys = [
    "categoryId",
    "name",
    "description",
    "priceCents",
    "allergenInfo",
    "dietaryInfo",
    "availability",
    "imageAssetId",
    "displayOrder"
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
    categoryId,
    name,
    description,
    priceCents,
    allergenInfo,
    dietaryInfo,
    availability,
    imageAssetId,
    displayOrder
  } = req.body;

  if (typeof categoryId !== "string" || categoryId.trim() === "") {
    fields.categoryId = "L'identifiant de catégorie est requis.";
  }

  if (typeof name !== "string" || name.trim() === "") {
    fields.name = "Le nom du plat est requis.";
  }

  if (description !== undefined && description !== null && typeof description !== "string") {
    fields.description = "La description doit être une chaîne.";
  }

  if (typeof priceCents !== "number" || !Number.isInteger(priceCents) || priceCents < 0) {
    fields.priceCents = "Le prix doit être un entier positif (en centimes).";
  }

  if (allergenInfo !== undefined && allergenInfo !== null && typeof allergenInfo !== "string") {
    fields.allergenInfo = "Les allergènes doivent être décrits sous forme de chaîne.";
  }

  if (dietaryInfo !== undefined && dietaryInfo !== null && typeof dietaryInfo !== "string") {
    fields.dietaryInfo = "Les informations diététiques doivent être sous forme de chaîne.";
  }

  const validAvailabilities = ["disponible", "indisponible"];
  if (availability !== undefined) {
    if (typeof availability !== "string" || !validAvailabilities.includes(availability)) {
      fields.availability = `La disponibilité doit être l'une des valeurs suivantes : ${validAvailabilities.join(", ")}.`;
    }
  }

  if (imageAssetId !== undefined && imageAssetId !== null && typeof imageAssetId !== "string") {
    fields.imageAssetId = "L'identifiant de média doit être une chaîne.";
  }

  if (typeof displayOrder !== "number" || !Number.isInteger(displayOrder)) {
    fields.displayOrder = "L'ordre d'affichage doit être un entier.";
  }

  if (Object.keys(fields).length > 0) {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs du plat sont invalides.",
      fields
    });
  }

  next();
}

export function validateUpdateMenuItem(req: Request, _res: Response, next: NextFunction) {
  const allowedKeys = [
    "categoryId",
    "name",
    "description",
    "priceCents",
    "allergenInfo",
    "dietaryInfo",
    "availability",
    "imageAssetId",
    "displayOrder"
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
    categoryId,
    name,
    description,
    priceCents,
    allergenInfo,
    dietaryInfo,
    availability,
    imageAssetId,
    displayOrder
  } = req.body;

  if (categoryId !== undefined) {
    if (typeof categoryId !== "string" || categoryId.trim() === "") {
      fields.categoryId = "L'identifiant de catégorie doit être une chaîne non vide.";
    }
  }

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") {
      fields.name = "Le nom du plat doit être une chaîne non vide.";
    }
  }

  if (description !== undefined && description !== null && typeof description !== "string") {
    fields.description = "La description doit être une chaîne.";
  }

  if (priceCents !== undefined) {
    if (typeof priceCents !== "number" || !Number.isInteger(priceCents) || priceCents < 0) {
      fields.priceCents = "Le prix doit être un entier positif.";
    }
  }

  if (allergenInfo !== undefined && allergenInfo !== null && typeof allergenInfo !== "string") {
    fields.allergenInfo = "Les allergènes doivent être sous forme de chaîne.";
  }

  if (dietaryInfo !== undefined && dietaryInfo !== null && typeof dietaryInfo !== "string") {
    fields.dietaryInfo = "Les infos diététiques doivent être sous forme de chaîne.";
  }

  const validAvailabilities = ["disponible", "indisponible"];
  if (availability !== undefined) {
    if (typeof availability !== "string" || !validAvailabilities.includes(availability)) {
      fields.availability = "La disponibilité est invalide.";
    }
  }

  if (imageAssetId !== undefined && imageAssetId !== null && typeof imageAssetId !== "string") {
    fields.imageAssetId = "L'identifiant de média doit être une chaîne.";
  }

  if (displayOrder !== undefined) {
    if (typeof displayOrder !== "number" || !Number.isInteger(displayOrder)) {
      fields.displayOrder = "L'ordre d'affichage doit être un entier.";
    }
  }

  if (Object.keys(fields).length > 0) {
    return next({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Certains champs du plat sont invalides.",
      fields
    });
  }

  next();
}
