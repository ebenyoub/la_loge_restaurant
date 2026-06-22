import React from "react";
import { UseFormRegister } from "react-hook-form";
import { ReservationFormData } from "@/lib/validation/reservation";
import { Input } from "@/components/ui";

interface ReservationDateFieldProps {
  register: UseFormRegister<ReservationFormData>;
  error?: string;
}

export function ReservationDateField({ register, error }: ReservationDateFieldProps) {
  return (
    <Input
      id="requestedDate"
      type="date"
      required
      label="Date souhaitée *"
      className="[color-scheme:dark]"
      error={error}
      {...register("requestedDate")}
    />
  );
}
