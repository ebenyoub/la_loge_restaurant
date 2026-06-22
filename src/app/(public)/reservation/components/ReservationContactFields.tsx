import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ReservationFormData } from "@/lib/validation/reservation";
import { Input } from "@/components/ui";

interface ReservationContactFieldsProps {
  register: UseFormRegister<ReservationFormData>;
  errors: FieldErrors<ReservationFormData>;
}

export function ReservationContactFields({
  register,
  errors,
}: ReservationContactFieldsProps) {
  return (
    <div className="border border-[#c9a96e]/10 p-4 sm:p-6 bg-[#141412]/30 space-y-5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/80 font-body border-b border-[#c9a96e]/10 pb-2">
        Vos coordonnées
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="lastName"
          type="text"
          required
          label="Nom *"
          placeholder="Dupont"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
        <Input
          id="firstName"
          type="text"
          required
          label="Prénom *"
          placeholder="Marie"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="phone"
          type="tel"
          required
          label="Téléphone *"
          placeholder="06 00 00 00 00"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          id="email"
          type="email"
          required
          label="Email *"
          placeholder="marie@email.fr"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
    </div>
  );
}
