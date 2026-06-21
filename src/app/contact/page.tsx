"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { useSettings, usePageSeo, DAYS_OF_WEEK } from "@/components/settings-context";

interface FormErrors {
  global?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  consent?: string;
}

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dynamic SEO from database
  usePageSeo(
    "/contact",
    settings?.restaurantName ? `${settings.restaurantName} - Contact & Accès` : "La Loge Bar & Food - Contact & Accès",
    "Horaires, adresse, téléphone, e-mail et plan d'accès."
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null);

    const fieldsErrors: FormErrors = {};
    if (!formData.name.trim()) fieldsErrors.name = "Le nom est requis.";
    if (!formData.email.trim()) fieldsErrors.email = "L'adresse e-mail est requise.";
    if (!formData.subject.trim()) fieldsErrors.subject = "L'objet est requis.";
    if (!formData.message.trim()) fieldsErrors.message = "Le message est requis.";
    if (!formData.consent) fieldsErrors.consent = "Votre consentement est requis.";

    if (Object.keys(fieldsErrors).length > 0) {
      setErrors(fieldsErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          consent: formData.consent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error && result.error.code === "VALIDATION_ERROR" && result.error.fields) {
          setErrors(result.error.fields);
        } else {
          setErrors({
            global: result.error?.message || "Une erreur est survenue lors de l'envoi de votre message.",
          });
        }
      } else {
        setSuccessMessage(result.data.message || "Votre message a bien été envoyé !");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          consent: false,
        });
      }
    } catch {
      setErrors({
        global: "Impossible de joindre le serveur. Veuillez vérifier votre connexion.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restaurantName = settings?.restaurantName || "La Loge Bar & Food";

  // Build full address
  const getAddress = () => {
    if (!settings || !settings.addressLine1) return null;
    return `${settings.addressLine1}${settings.addressLine2 ? ', ' + settings.addressLine2 : ''}, ${settings.postalCode || ''} ${settings.city || ''}`;
  };

  const addressText = getAddress();
  const phoneText = settings?.phone || "04 78 00 00 00";
  const emailText = settings?.email || "contact@laloge-lyon.fr";

  // Day order for display (Lundi to Dimanche: [1, 2, 3, 4, 5, 6, 0])
  const displayDays = [1, 2, 3, 4, 5, 6, 0];

  const inputClass = "w-full bg-[#1e1e1b] border border-[#c9a96e]/15 text-[#f0e8d8] px-4 py-3.5 text-sm font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none focus:border-[#c9a96e]/50 transition-colors";
  const labelClass = "block text-[10px] tracking-[0.4em] uppercase font-body text-[#c9a96e]/70 mb-2";

  return (
    <div className="min-h-screen pt-[72px] bg-[#0b0b09] text-[#f0e8d8] font-body">
      {/* Introduction Header */}
      <div className="relative py-20 lg:py-28 px-6 text-center bg-[#0e0e0c]">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #c9a96e 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <SectionLabel>Nous joindre</SectionLabel>
          <h1 className="font-display italic text-[clamp(2.5rem,6vw,4.5rem)] text-[#f0e8d8]">
            Contact &amp; Accès
          </h1>
          <p className="mt-4 text-[#f0e8d8]/45 font-body font-light text-sm leading-relaxed max-w-md mx-auto">
            Retrouvez ici les informations pratiques pour contacter {restaurantName} et préparer votre venue.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-16">
          {/* Practical Info */}
          <div>
            <h2 className="font-display italic text-2xl text-[#f0e8d8] mb-8">Informations pratiques</h2>

            <div className="space-y-7">
              {/* Address */}
              <div className="flex gap-4 p-5 border border-[#c9a96e]/10 hover:border-[#c9a96e]/25 transition-colors bg-[#141412]/40">
                <svg className="w-5 h-5 text-[#c9a96e] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/60 font-body mb-2">Adresse</p>
                  <p className="text-[#f0e8d8]/65 text-sm font-body font-light">
                    {addressText || "Place des Célestins, 69002 Lyon — France"}
                  </p>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="flex gap-4 p-5 border border-[#c9a96e]/10 hover:border-[#c9a96e]/25 transition-colors bg-[#141412]/40">
                <svg className="w-5 h-5 text-[#c9a96e] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/60 font-body mb-2">Contacts</p>
                  <p className="text-[#f0e8d8]/65 text-sm font-body font-light">Tél : {phoneText}</p>
                  <p className="text-[#f0e8d8]/65 text-sm font-body font-light">Email : {emailText}</p>
                </div>
              </div>

              {/* Horaires */}
              <div className="flex gap-4 p-5 border border-[#c9a96e]/10 hover:border-[#c9a96e]/25 transition-colors bg-[#141412]/40">
                <svg className="w-5 h-5 text-[#c9a96e] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/60 font-body mb-3">Horaires d&apos;ouverture</p>
                  <div className="grid grid-cols-2 gap-y-2 text-sm font-body font-light">
                    {displayDays.map((dayIdx) => {
                      const h = settings?.openingHours?.find((item) => item.dayOfWeek === dayIdx);
                      return (
                        <div key={dayIdx} className="contents">
                          <span className="text-[#f0e8d8]/50">{DAYS_OF_WEEK[dayIdx]}</span>
                          <span className="text-[#f0e8d8]/75 text-right lg:text-left">
                            {h ? (
                              h.isClosed ? (
                                <span className="text-[#8a8070]">Fermé</span>
                              ) : (
                                `${h.opensAt?.replace(":", "h").replace("00", "")} à ${h.closesAt?.replace(":", "h").replace("00", "")}`
                              )
                            ) : (
                              "12h à 23h"
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href={`tel:${phoneText.replace(/\s+/g, "")}`}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold hover:bg-[#dbbe86] transition-colors"
              >
                Appeler
              </a>
              {settings?.googleMapsUrl ? (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-[#c9a96e]/35 text-[#c9a96e] text-[11px] tracking-[0.3em] uppercase font-body hover:bg-[#c9a96e] hover:text-[#0b0b09] transition-all"
                >
                  Itinéraire
                </a>
              ) : (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=Place+des+Célestins,+Lyon`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-[#c9a96e]/35 text-[#c9a96e] text-[11px] tracking-[0.3em] uppercase font-body hover:bg-[#c9a96e] hover:text-[#0b0b09] transition-all"
                >
                  Itinéraire
                </a>
              )}
            </div>
          </div>

          {/* Interactive Map */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display italic text-2xl text-[#f0e8d8]">Localisation</h2>
            <div className="flex-1 min-h-[380px] bg-[#141412] border border-[#c9a96e]/12 overflow-hidden relative">
              <iframe
                title="La Loge Bar & Food — Localisation"
                src={settings?.googleMapsUrl && settings.googleMapsUrl.includes("embed") ? settings.googleMapsUrl : `https://maps.google.com/maps?q=${encodeURIComponent(addressText || "Place des Célestins, Lyon")}&output=embed&z=16`}
                width="100%"
                height="100%"
                className="absolute inset-0 w-full h-full grayscale contrast-125 opacity-80"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 bg-[#0b0b09]/90 backdrop-blur-sm border border-[#c9a96e]/20 px-4 py-2.5">
                <p className="font-display italic text-[#f0e8d8] text-sm">La Loge</p>
                <p className="text-[#c9a96e]/70 text-[10px] tracking-wide font-body">Place des Célestins · Lyon 2e</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto border-t border-[#c9a96e]/12 pt-16">
          <div className="text-center mb-10">
            <SectionLabel>Formulaire de contact</SectionLabel>
            <h2 className="font-display italic text-2xl md:text-3xl text-[#f0e8d8]">
              Envoyer un message
            </h2>
          </div>

          {successMessage && (
            <div className="p-4 mb-6 bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 text-sm font-body">
              {successMessage}
            </div>
          )}

          {errors.global && (
            <div className="p-4 mb-6 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm font-body">
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <fieldset disabled={isLoading} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className={labelClass}>Nom *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className={inputClass}
                  />
                  {errors.name && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.name}</span>}
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vous@email.fr"
                    className={inputClass}
                  />
                  {errors.email && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.email}</span>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className={labelClass}>Téléphone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="06 00 00 00 00 (facultatif)"
                    className={inputClass}
                  />
                  {errors.phone && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.phone}</span>}
                </div>
                <div>
                  <label htmlFor="subject" className={labelClass}>Sujet *</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Demande d'information…"
                    className={inputClass}
                  />
                  {errors.subject && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.subject}</span>}
                </div>
              </div>
              <div>
                <label htmlFor="message" className={labelClass}>Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message…"
                  className={`${inputClass} resize-none`}
                />
                {errors.message && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.message}</span>}
              </div>

              <div className="flex items-start gap-3 py-2">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                  className="mt-1 h-4 w-4 bg-[#1e1e1b] border border-[#c9a96e]/20 text-[#c9a96e] focus:ring-[#c9a96e]/50 focus:ring-opacity-25"
                />
                <label htmlFor="consent" className="text-xs text-[#f0e8d8]/60 leading-tight select-none">
                  J&apos;accepte que mes informations soient collectées et utilisées par {restaurantName} pour traiter ma demande de contact conformément à la politique de confidentialité. *
                </label>
              </div>
              {errors.consent && <span className="text-red-400 text-[11px] font-body block">{errors.consent}</span>}

              <button
                type="submit"
                className="w-full py-4 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold hover:bg-[#dbbe86] transition-colors"
              >
                {isLoading ? "Envoi du message..." : "Envoyer le message"}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
