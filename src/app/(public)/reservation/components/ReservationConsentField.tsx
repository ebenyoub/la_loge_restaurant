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
      label={
        <span>
          J&apos;accepte que mes coordonnées soient collectées et utilisées par {restaurantName} pour traiter ma demande de réservation conformément à la{" "}
          <a
            href="/mentions-legales#confidentialite"
            className="underline hover:text-[#c9a96e] transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            politique de confidentialité
          </a>
          . *
        </span>
      }
      error={error}
      {...register("consent")}
    />
  );
}
