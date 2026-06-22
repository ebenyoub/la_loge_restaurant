import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse e-mail est requise")
    .email("Format d'adresse e-mail invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
