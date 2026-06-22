import { z } from "zod";

export const legalDocumentSchema = z.object({
  title: z.string().min(1, "Le titre est requis.").trim(),
  body: z.string().min(1, "Le contenu est requis.").trim(),
  version: z.string().min(1, "La version est requise.").trim(),
});

export const legalSettingsSchema = z.object({
  mentions_legales: legalDocumentSchema,
  confidentialite: legalDocumentSchema,
  cookies: legalDocumentSchema,
});

export type LegalSettingsFormData = z.infer<typeof legalSettingsSchema>;
