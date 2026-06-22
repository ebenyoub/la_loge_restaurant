import { z } from "zod";

export const reservationSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis.").trim(),
  lastName: z.string().min(1, "Le nom est requis.").trim(),
  phone: z.string().min(1, "Le numéro de téléphone est requis.").trim(),
  email: z
    .string()
    .min(1, "L'adresse e-mail est requise.")
    .email("Format d'adresse e-mail invalide.")
    .trim(),
  requestedDate: z.string().min(1, "La date est requise."),
  requestedTime: z.string().min(1, "L'heure est requise."),
  guestCount: z.number().min(1, "Le nombre de couverts doit être au moins 1."),
  occasion: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Votre consentement est requis.",
  }),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;
