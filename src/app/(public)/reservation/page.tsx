"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import { useSettings, usePageSeo } from "@/components/settings-context";

interface FormErrors {
  global?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  requestedDate?: string;
  requestedTime?: string;
  guestCount?: string;
  occasion?: string;
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

export default function ReservationPage() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    requestedDate: "",
    requestedTime: "",
    guestCount: 2,
    occasion: "",
    message: "",
    consent: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dynamic SEO from database
  usePageSeo(
    "/reservation",
    settings?.restaurantName ? `${settings.restaurantName} - Réservations` : "La Loge Bar & Food - Réservations",
    "Demandez une table en ligne pour votre déjeuner, dîner ou événement spécial."
  );

  const getAvailableTimeSlots = useCallback(() => {
    if (!formData.requestedDate || !settings?.openingHours) return [];
    
    const [year, month, day] = formData.requestedDate.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    const dayHours = settings.openingHours.find((oh) => oh.dayOfWeek === dayOfWeek);
    if (!dayHours || dayHours.isClosed || !dayHours.opensAt || !dayHours.closesAt) {
      return [];
    }

    const slots: string[] = [];
    const [openH, openM] = dayHours.opensAt.split(":").map(Number);
    const [closeH, closeM] = dayHours.closesAt.split(":").map(Number);

    const current = new Date(year, month - 1, day, openH, openM);
    const end = new Date(year, month - 1, day, closeH, closeM);

    while (current <= end) {
      const h = String(current.getHours()).padStart(2, "0");
      const m = String(current.getMinutes()).padStart(2, "0");
      slots.push(`${h}:${m}`);
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  }, [formData.requestedDate, settings]);

  const slots = getAvailableTimeSlots();

  useEffect(() => {
    if (formData.requestedDate && settings?.openingHours) {
      const validSlots = getAvailableTimeSlots();
      if (formData.requestedTime && !validSlots.includes(formData.requestedTime)) {
        Promise.resolve().then(() => {
          setFormData((prev) => ({
            ...prev,
            requestedTime: "",
          }));
        });
      }
    }
  }, [formData.requestedDate, settings, getAvailableTimeSlots, formData.requestedTime]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    if (!formData.firstName.trim()) fieldsErrors.firstName = "Le prénom est requis.";
    if (!formData.lastName.trim()) fieldsErrors.lastName = "Le nom est requis.";
    if (!formData.phone.trim()) fieldsErrors.phone = "Le numéro de téléphone est requis.";
    if (!formData.email.trim()) fieldsErrors.email = "L'adresse e-mail est requise.";
    if (!formData.requestedDate) fieldsErrors.requestedDate = "La date est requise.";
    if (!formData.requestedTime) fieldsErrors.requestedTime = "L'heure est requise.";
    if (!formData.consent) fieldsErrors.consent = "Votre consentement est requis.";

    if (Object.keys(fieldsErrors).length > 0) {
      setErrors(fieldsErrors);
      setIsLoading(false);
      return;
    }

    try {
      const occasionMapped = formData.occasion === "repas-pro" ? "repas_pro" : formData.occasion || null;

      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          requestedDate: formData.requestedDate,
          requestedTime: formData.requestedTime,
          guestCount: Number(formData.guestCount),
          occasion: occasionMapped,
          message: formData.message || null,
          consent: formData.consent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error && result.error.code === "VALIDATION_ERROR" && result.error.fields) {
          setErrors(result.error.fields);
        } else {
          setErrors({
            global: result.error?.message || "Une erreur est survenue lors de l'envoi de votre demande.",
          });
        }
      } else {
        setSuccessMessage(result.data.message || "Votre demande de réservation a bien été envoyée !");
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          requestedDate: "",
          requestedTime: "",
          guestCount: 2,
          occasion: "",
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
  const phoneText = settings?.phone || "04 78 00 00 00";
  const emailText = settings?.email || "contact@laloge-lyon.fr";

  const inputClass = "w-full bg-[#1e1e1b] border border-[#c9a96e]/15 text-[#f0e8d8] px-4 py-3.5 text-sm font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none focus:border-[#c9a96e]/50 transition-colors duration-200";
  const labelClass = "block text-[10px] tracking-[0.4em] uppercase font-body text-[#c9a96e]/70 mb-2";

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

      <div className="max-w-2xl mx-auto px-6 py-16">
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

        {successMessage && (
          <div className="p-6 mb-10 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-center rounded-sm">
            <svg className="w-10 h-10 text-emerald-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="font-body font-medium tracking-[-0.02em] text-2xl text-[#f0e8d8] mb-3">Demande envoyée</h2>
            <p className="text-sm font-body font-light leading-relaxed max-w-sm mx-auto">
              {successMessage}
            </p>
          </div>
        )}

        {errors.global && (
          <div className="p-4 mb-6 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm font-body">
            {errors.global}
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <fieldset disabled={isLoading} className="space-y-6 min-w-0 w-full">
              {/* Coordonnées */}
              <div className="border border-[#c9a96e]/10 p-6 bg-[#141412]/30 space-y-5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/80 font-body border-b border-[#c9a96e]/10 pb-2">
                  Vos coordonnées
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="lastName" className={labelClass}>Nom *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Dupont"
                      className={inputClass}
                    />
                    {errors.lastName && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.lastName}</span>}
                  </div>
                  <div>
                    <label htmlFor="firstName" className={labelClass}>Prénom *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Marie"
                      className={inputClass}
                    />
                    {errors.firstName && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.firstName}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className={labelClass}>Téléphone *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="06 00 00 00 00"
                      className={inputClass}
                    />
                    {errors.phone && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.phone}</span>}
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
                      placeholder="marie@email.fr"
                      className={inputClass}
                    />
                    {errors.email && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.email}</span>}
                  </div>
                </div>
              </div>

              {/* Détails Demande */}
              <div className="border border-[#c9a96e]/10 p-6 bg-[#141412]/30 space-y-5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/80 font-body border-b border-[#c9a96e]/10 pb-2">
                  Détails de la réservation
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label htmlFor="requestedDate" className={labelClass}>Date souhaitée *</label>
                    <input
                      id="requestedDate"
                      name="requestedDate"
                      type="date"
                      required
                      value={formData.requestedDate}
                      onChange={handleChange}
                      className={`${inputClass} [color-scheme:dark]`}
                    />
                    {errors.requestedDate && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.requestedDate}</span>}
                  </div>
                  <div>
                    <label htmlFor="requestedTime" className={labelClass}>Heure *</label>
                    <select
                      id="requestedTime"
                      name="requestedTime"
                      required
                      value={formData.requestedTime}
                      onChange={handleChange}
                      disabled={!formData.requestedDate || slots.length === 0}
                      className={`${inputClass} appearance-none cursor-pointer bg-[#1e1e1b]`}
                    >
                      <option value="">
                        {!formData.requestedDate
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
                    </select>
                    {errors.requestedTime && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.requestedTime}</span>}
                  </div>
                  <div>
                    <label htmlFor="guestCount" className={labelClass}>Personnes *</label>
                    <select
                      id="guestCount"
                      name="guestCount"
                      required
                      value={formData.guestCount}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none cursor-pointer bg-[#1e1e1b]`}
                    >
                      {Array.from({ length: 14 }, (_, i) => i + 2).map((num) => (
                        <option key={num} value={num}>
                          {num} personne{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    {errors.guestCount && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.guestCount}</span>}
                  </div>
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
                <div>
                  <label htmlFor="message" className={labelClass}>Message particulier (facultatif)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Allergies, spécificités, table calme..."
                    className={`${inputClass} resize-none`}
                  />
                  {errors.message && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.message}</span>}
                </div>
              </div>

              {/* Consentement & Submit */}
              <div className="space-y-4">
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
                    J&apos;accepte que mes coordonnées soient utilisées par {restaurantName} pour traiter ma demande de réservation. *
                  </label>
                </div>
                {errors.consent && <span className="text-red-400 text-[11px] font-body block">{errors.consent}</span>}

                <button
                  type="submit"
                  className="w-full py-4 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold hover:bg-[#dbbe86] transition-colors"
                >
                  Envoyer ma demande de réservation
                </button>
              </div>
            </fieldset>
          </form>
        )}

        {/* Urgence */}
        <div className="mt-12 pt-10 border-t border-[#c9a96e]/12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/60 font-body mb-1">Besoin d&apos;une réponse urgente ?</p>
            <p className="text-[#f0e8d8]/45 text-sm font-body font-light">Tél : {phoneText} · Email : {emailText}</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#c9a96e]/35 text-[#c9a96e] text-xs uppercase tracking-wider font-body hover:bg-[#c9a96e] hover:text-[#0b0b09] transition-all"
          >
            Contact &amp; Accès
          </Link>
        </div>
      </div>
    </div>
  );
}
