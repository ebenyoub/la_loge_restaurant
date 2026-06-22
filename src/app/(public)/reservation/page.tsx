"use client";

import { useSettings, usePageSeo } from "@/components/settings-context";
import { useReservationForm } from "./hooks/useReservationForm";
import { ReservationStatusMessage } from "./components/ReservationStatusMessage";
import { ReservationForm } from "./components/ReservationForm";
import { ReservationInfoPanel } from "./components/ReservationInfoPanel";

function GoldLine() {
  return (
    <div className="flex items-center gap-4 justify-center">
      <div className="h-px flex-1 max-w-16 bg-[#c9a96e]/40" />
      <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a96e]/60" />
      <div className="h-px flex-1 max-w-16 bg-[#c9a96e]/40" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 mb-10">
      <GoldLine />
      <span className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e] font-body">
        {children}
      </span>
    </div>
  );
}

export default function ReservationPage() {
  const { settings } = useSettings();
  const {
    register,
    requestedDate,
    errors,
    isLoading,
    globalError,
    successMessage,
    slots,
    onSubmit,
  } = useReservationForm(settings);

  // Dynamic SEO from database
  usePageSeo(
    "/reservation",
    settings?.restaurantName ? `${settings.restaurantName} - Réservations` : "La Loge Bar & Food - Réservations",
    "Demandez une table en ligne pour votre déjeuner, dîner ou événement spécial."
  );

  const restaurantName = settings?.restaurantName || "La Loge Bar & Food";
  const phoneText = settings?.phone || "04 78 00 00 00";
  const emailText = settings?.email || "contact@laloge-lyon.fr";



  return (
    <div className="min-h-screen pt-[72px] bg-[#0b0b09] text-[#f0e8d8] font-body">
      {/* Introduction Header */}
      <div className="relative py-20 lg:py-28 px-6 text-center overflow-hidden bg-[#0e0e0c]">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #c9a96e 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <SectionLabel>Table disponible</SectionLabel>
          <h1 className="font-body font-light tracking-[-0.04em] text-[clamp(2.5rem,6vw,4.5rem)] text-[#f0e8d8]">
            Réserver une table
          </h1>
          <p className="mt-4 text-[#f0e8d8]/45 font-body font-light text-sm leading-relaxed max-w-md mx-auto">
            Indiquez les informations utiles à votre venue. {restaurantName} traite ensuite chaque demande avant de confirmer une table.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        {/* Pending Notice Banner */}
        <div className="flex gap-3 bg-[#c9a96e]/8 border border-[#c9a96e]/25 p-5 mb-10">
          <svg className="w-5 h-5 text-[#c9a96e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-[#c9a96e] text-sm font-body font-medium mb-1">
              Demande de réservation en attente de confirmation
            </p>
            <p className="text-[#f0e8d8]/55 text-xs font-body font-light leading-relaxed">
              Votre demande sera confirmée par {restaurantName} après vérification des disponibilités. Nous vous contacterons dans les meilleurs délais par téléphone ou email.
            </p>
          </div>
        </div>

        <ReservationStatusMessage
          successMessage={successMessage}
          globalError={globalError ?? undefined}
        />

        {!successMessage && (
          <ReservationForm
            register={register}
            errors={errors}
            requestedDate={requestedDate}
            isLoading={isLoading}
            slots={slots}
            onSubmit={onSubmit}
            restaurantName={restaurantName}
          />
        )}

        <ReservationInfoPanel
          phoneText={phoneText}
          emailText={emailText}
        />
      </div>
    </div>
  );
}
