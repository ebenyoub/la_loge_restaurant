import React from "react";
import { UseFormRegister } from "react-hook-form";
import { ReservationFormData } from "@/lib/validation/reservation";
import { Select } from "@/components/ui";

interface ReservationTimeFieldProps {
  register: UseFormRegister<ReservationFormData>;
  error?: string;
  slots: string[];
  hasDate: boolean;
}

export function ReservationTimeField({
  register,
  error,
  slots,
  hasDate,
}: ReservationTimeFieldProps) {
  return (
    <Select
      id="requestedTime"
      required
      label="Heure *"
      disabled={!hasDate || slots.length === 0}
      error={error}
      {...register("requestedTime")}
    >
      <option value="">
        {!hasDate
          ? "Choisir une date d'abord"
          : slots.length === 0
          ? "Fermé ce jour-là"
          : "-- Choisir une heure --"}
      </option>
      {slots.map((slot) => (
        <option key={slot} value={slot}>
          {slot}
        </option>
      ))}
    </Select>
  );
}
