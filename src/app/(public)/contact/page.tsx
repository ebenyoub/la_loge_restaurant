"use client";

import { useSettings, usePageSeo } from "@/components/settings-context";
import { useContactForm } from "./hooks/useContactForm";
import { ContactForm } from "./components/ContactForm";
import { ContactInfo } from "./components/ContactInfo";
import { ContactMap } from "./components/ContactMap";
import { Container, Section } from "@/components/ui";

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

export default function ContactPage() {
  const { settings } = useSettings();
  const {
    formData,
    isLoading,
    errors,
    successMessage,
    handleChange,
    handleSubmit,
  } = useContactForm();

  // Dynamic SEO from database
  usePageSeo(
    "/contact",
    settings?.restaurantName ? `${settings.restaurantName} - Contact & Accès` : "La Loge Bar & Food - Contact & Accès",
    "Horaires, adresse, téléphone, e-mail et plan d'accès."
  );

  const restaurantName = settings?.restaurantName || "La Loge Bar & Food";

  // Build full address
  const getAddress = () => {
    if (!settings || !settings.addressLine1) return null;
    return `${settings.addressLine1}${settings.addressLine2 ? ', ' + settings.addressLine2 : ''}, ${settings.postalCode || ''} ${settings.city || ''}`;
  };

  const addressText = getAddress();
  const phoneText = settings?.phone || "04 78 00 00 00";
  const emailText = settings?.email || "contact@laloge-lyon.fr";

  return (
    <div className="min-h-screen pt-[72px] bg-[#0b0b09] text-[#f0e8d8] font-body">
      {/* Introduction Header */}
      <div className="relative py-20 lg:py-28 px-6 text-center bg-[#0e0e0c]">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #c9a96e 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <SectionLabel>Nous joindre</SectionLabel>
          <h1 className="font-body font-light tracking-[-0.04em] text-[clamp(2.5rem,6vw,4.5rem)] text-[#f0e8d8]">
            Contact &amp; Accès
          </h1>
          <p className="mt-4 text-[#f0e8d8]/45 font-body font-light text-sm leading-relaxed max-w-md mx-auto">
            Retrouvez ici les informations pratiques pour contacter {restaurantName} et préparer votre venue.
          </p>
        </div>
      </div>

      <Container size="xl">
        <Section padding="none" className="py-16 lg:py-24">
          {/* Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-16">
            <ContactInfo
              addressText={addressText}
              phoneText={phoneText}
              emailText={emailText}
              googleMapsUrl={settings?.googleMapsUrl ?? undefined}
              openingHours={settings?.openingHours}
            />
            <ContactMap
              googleMapsUrl={settings?.googleMapsUrl ?? undefined}
              addressText={addressText}
            />
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto border-t border-[#c9a96e]/12 pt-16">
            <div className="text-center mb-10">
              <SectionLabel>Formulaire de contact</SectionLabel>
              <h2 className="font-body font-medium tracking-[-0.02em] text-2xl md:text-3xl text-[#f0e8d8]">
                Envoyer un message
              </h2>
            </div>
            <ContactForm
              formData={formData}
              isLoading={isLoading}
              errors={errors}
              successMessage={successMessage}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              restaurantName={restaurantName}
            />
          </div>
        </Section>
      </Container>
    </div>
  );
}
