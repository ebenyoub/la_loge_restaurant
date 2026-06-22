import React from "react";
import { UseFormRegister } from "react-hook-form";
import { ReservationFormData } from "@/lib/validation/reservation";
import { Textarea } from "@/components/ui";

interface ReservationMessageFieldProps {
  register: UseFormRegister<ReservationFormData>;
  error?: string;
}

export function ReservationMessageField({
  register,
  error,
}: ReservationMessageFieldProps) {
  return (
    <Textarea
      id="message"
      rows={4}
      label="Message particulier (facultatif)"
      placeholder="Allergies, spécificités, table calme..."
      error={error}
      {...register("message")}
    />
  );
}
