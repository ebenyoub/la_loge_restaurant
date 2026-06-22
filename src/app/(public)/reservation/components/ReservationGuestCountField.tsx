import React from "react";
import { UseFormRegister } from "react-hook-form";
import { ReservationFormData } from "@/lib/validation/reservation";
import { Select } from "@/components/ui";

interface ReservationGuestCountFieldProps {
  register: UseFormRegister<ReservationFormData>;
  error?: string;
}

export function ReservationGuestCountField({
  register,
  error,
}: ReservationGuestCountFieldProps) {
  return (
    <Select
      id="guestCount"
      required
      label="Personnes *"
      error={error}
      {...register("guestCount", { valueAsNumber: true })}
    >
      {Array.from({ length: 14 }, (_, i) => i + 2).map((num) => (
        <option key={num} value={num}>
          {num} personne{num > 1 ? "s" : ""}
        </option>
      ))}
    </Select>
  );
}
