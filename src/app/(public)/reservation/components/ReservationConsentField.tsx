import React from "react";
import { UseFormRegister } from "react-hook-form";
import { ReservationFormData } from "@/lib/validation/reservation";
import { Checkbox } from "@/components/ui";

interface ReservationConsentFieldProps {
  register: UseFormRegister<ReservationFormData>;
  error?: string;
  restaurantName: string;
}

export function ReservationConsentField({
  register,
  error,
  restaurantName,
}: ReservationConsentFieldProps) {
  return (
    <Checkbox
      id="consent"
      required
      label={`J&apos;accepte que mes coordonnées soient utilisées par ${restaurantName} pour traiter ma demande de réservation. *`}
      error={error}
      {...register("consent")}
    />
  );
}
