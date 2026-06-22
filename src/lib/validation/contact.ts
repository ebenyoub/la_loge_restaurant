import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").trim(),
  email: z
    .string()
    .min(1, "L'adresse e-mail est requise.")
    .email("Format d'adresse e-mail invalide.")
    .trim(),
  phone: z.string().optional(),
  subject: z.string().min(1, "L'objet est requis.").trim(),
  message: z.string().min(1, "Le message est requis.").trim(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Votre consentement est requis.",
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
