import React from "react";
import { ReservationFormData, FormErrors } from "../types";
import { ReservationContactFields } from "./ReservationContactFields";
import { ReservationDateField } from "./ReservationDateField";
import { ReservationTimeField } from "./ReservationTimeField";
import { ReservationGuestCountField } from "./ReservationGuestCountField";
import { ReservationMessageField } from "./ReservationMessageField";
import { ReservationConsentField } from "./ReservationConsentField";

interface ReservationFormProps {
  formData: ReservationFormData;
  isLoading: boolean;
  errors: FormErrors;
  slots: string[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  restaurantName: string;
  inputClass: string;
  labelClass: string;
}

export function ReservationForm({
  formData,
  isLoading,
  errors,
  slots,
  handleChange,
  handleSubmit,
  restaurantName,
  inputClass,
  labelClass,
}: ReservationFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <fieldset disabled={isLoading} className="space-y-6 min-w-0 w-full">
        {/* Coordonnées */}
        <ReservationContactFields
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          inputClass={inputClass}
          labelClass={labelClass}
        />

        {/* Détails Demande */}
        <div className="border border-[#c9a96e]/10 p-4 sm:p-6 bg-[#141412]/30 space-y-5">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/80 font-body border-b border-[#c9a96e]/10 pb-2">
            Détails de la réservation
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <ReservationDateField
              value={formData.requestedDate}
              onChange={handleChange}
              error={errors.requestedDate}
              inputClass={inputClass}
              labelClass={labelClass}
            />
            <ReservationTimeField
              value={formData.requestedTime}
              onChange={handleChange}
              error={errors.requestedTime}
              slots={slots}
              hasDate={!!formData.requestedDate}
              inputClass={inputClass}
              labelClass={labelClass}
            />
            <ReservationGuestCountField
              value={formData.guestCount}
              onChange={handleChange}
              error={errors.guestCount}
              inputClass={inputClass}
              labelClass={labelClass}
            />
          </div>
          <div>
            <label htmlFor="occasion" className={labelClass}>Occasion spéciale</label>
            <select
              id="occasion"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className={`${inputClass} appearance-none cursor-pointer bg-[#1e1e1b]`}
            >
              <option value="">Aucune occasion particulière</option>
              <option value="anniversaire">Anniversaire</option>
              <option value="repas-pro">Repas d&apos;affaires / Professionnel</option>
              <option value="groupe">Groupe / Fête</option>
              <option value="autre">Autre occasion spéciale</option>
            </select>
            {errors.occasion && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.occasion}</span>}
          </div>
          <ReservationMessageField
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
            inputClass={inputClass}
            labelClass={labelClass}
          />
        </div>

        {/* Consentement & Submit */}
        <div className="space-y-4">
          <ReservationConsentField
            checked={formData.consent}
            onChange={handleChange}
            error={errors.consent}
            restaurantName={restaurantName}
          />
          <button
            type="submit"
            className="w-full py-4 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold hover:bg-[#dbbe86] transition-colors"
          >
            Envoyer ma demande de réservation
          </button>
        </div>
      </fieldset>
    </form>
  );
}
