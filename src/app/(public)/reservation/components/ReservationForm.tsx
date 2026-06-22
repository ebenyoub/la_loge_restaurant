import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ReservationFormData } from "@/lib/validation/reservation";
import { ReservationContactFields } from "./ReservationContactFields";
import { ReservationDateField } from "./ReservationDateField";
import { ReservationTimeField } from "./ReservationTimeField";
import { ReservationGuestCountField } from "./ReservationGuestCountField";
import { ReservationMessageField } from "./ReservationMessageField";
import { ReservationConsentField } from "./ReservationConsentField";
import { Select, Button } from "@/components/ui";

interface ReservationFormProps {
  register: UseFormRegister<ReservationFormData>;
  errors: FieldErrors<ReservationFormData>;
  requestedDate?: string;
  isLoading: boolean;
  slots: string[];
  onSubmit: (e: React.FormEvent) => void;
  restaurantName: string;
}

export function ReservationForm({
  register,
  errors,
  requestedDate,
  isLoading,
  slots,
  onSubmit,
  restaurantName,
}: ReservationFormProps) {

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <fieldset disabled={isLoading} className="space-y-6 min-w-0 w-full">
        {/* Coordonnées */}
        <ReservationContactFields
          register={register}
          errors={errors}
        />

        {/* Détails Demande */}
        <div className="border border-[#c9a96e]/10 p-4 sm:p-6 bg-[#141412]/30 space-y-5">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/80 font-body border-b border-[#c9a96e]/10 pb-2">
            Détails de la réservation
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <ReservationDateField
              register={register}
              error={errors.requestedDate?.message}
            />
            <ReservationTimeField
              register={register}
              error={errors.requestedTime?.message}
              slots={slots}
              hasDate={!!requestedDate}
            />
            <ReservationGuestCountField
              register={register}
              error={errors.guestCount?.message}
            />
          </div>
          <Select
            id="occasion"
            label="Occasion spéciale"
            error={errors.occasion?.message}
            {...register("occasion")}
          >
            <option value="">Aucune occasion particulière</option>
            <option value="anniversaire">Anniversaire</option>
            <option value="repas-pro">Repas d&apos;affaires / Professionnel</option>
            <option value="groupe">Groupe / Fête</option>
            <option value="autre">Autre occasion spéciale</option>
          </Select>
          <ReservationMessageField
            register={register}
            error={errors.message?.message}
          />
        </div>

        {/* Consentement & Submit */}
        <div className="space-y-4">
          <ReservationConsentField
            register={register}
            error={errors.consent?.message}
            restaurantName={restaurantName}
          />
          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            Envoyer ma demande de réservation
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
