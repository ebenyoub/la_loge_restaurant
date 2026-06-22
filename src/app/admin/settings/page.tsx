"use client";

import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";

interface OpeningHour {
  id?: string;
  dayOfWeek: number;
  opensAt: string | null;
  closesAt: string | null;
  isClosed: boolean;
}

interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  isActive: boolean;
}

interface SeoMetadata {
  id?: string;
  route: string;
  title: string;
  metaDescription: string;
  localKeywords: string | null;
}

const DAYS_OF_WEEK = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const DEFAULT_SEO_PAGES = [
  { route: "/", label: "Accueil" },
  { route: "/carte", label: "La Carte" },
  { route: "/reservation", label: "Réservations" },
  { route: "/contact", label: "Contact & Accès" },
];

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // General Settings State
  const [restaurantName, setRestaurantName] = useState("");
  const [shortPresentation, setShortPresentation] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [defaultLocale, setDefaultLocale] = useState("fr");

  // Opening Hours State
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);

  // Social Links State
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  // SEO State
  const [seoList, setSeoList] = useState<SeoMetadata[]>([]);

  const fetchSettings = useCallback(async () => {
    Promise.resolve().then(() => {
      setIsLoading(true);
      setError(null);
    });
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "Erreur de chargement des réglages.");
      } else {
        const data = json.data;
        setRestaurantName(data.restaurantName || "");
        setShortPresentation(data.shortPresentation || "");
        setAddressLine1(data.addressLine1 || "");
        setAddressLine2(data.addressLine2 || "");
        setPostalCode(data.postalCode || "");
        setCity(data.city || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setGoogleMapsUrl(data.googleMapsUrl || "");
        setDefaultLocale(data.defaultLocale || "fr");

        // Set hours
        const initializedHours = Array.from({ length: 7 }, (_, i) => {
          const found = (data.openingHours || []).find((h: OpeningHour) => h.dayOfWeek === i);
          return found || { dayOfWeek: i, opensAt: "12:00", closesAt: "23:00", isClosed: false };
        });
        setOpeningHours(initializedHours);

        // Social links Platform setup
        const fb = (data.socialLinks || []).find((l: SocialLink) => l.platform.toLowerCase() === "facebook");
        const ig = (data.socialLinks || []).find((l: SocialLink) => l.platform.toLowerCase() === "instagram");
        setFacebookUrl(fb?.url || "");
        setInstagramUrl(ig?.url || "");

        // SEO setups
        const initializedSeo = DEFAULT_SEO_PAGES.map((page) => {
          const found = (data.seoMetadata || []).find((s: SeoMetadata) => s.route === page.route);
          return found || {
            route: page.route,
            title: `La Loge - ${page.label}`,
            metaDescription: `Découvrez la page ${page.label} de La Loge Bar & Food Lyon.`,
            localKeywords: "la loge, lyon, celestins",
          };
        });
        setSeoList(initializedSeo);
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchSettings();
    });
  }, [fetchSettings]);

  const handleHourChange = (index: number, key: keyof OpeningHour, value: string | number | boolean | null) => {
    setOpeningHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [key]: value } : h))
    );
  };

  const handleSeoChange = (index: number, key: keyof SeoMetadata, value: string | number | boolean | null) => {
    setSeoList((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: value } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem("admin_token");

    const payload = {
      restaurantName,
      shortPresentation: shortPresentation.trim() || null,
      addressLine1: addressLine1.trim() || null,
      addressLine2: addressLine2.trim() || null,
      postalCode: postalCode.trim() || null,
      city: city.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      googleMapsUrl: googleMapsUrl.trim() || null,
      defaultLocale,
      openingHours: openingHours.map((h) => ({
        dayOfWeek: h.dayOfWeek,
        opensAt: h.isClosed ? null : h.opensAt,
        closesAt: h.isClosed ? null : h.closesAt,
        isClosed: h.isClosed,
      })),
      socialLinks: [
        { platform: "facebook", url: facebookUrl, isActive: !!facebookUrl },
        { platform: "instagram", url: instagramUrl, isActive: !!instagramUrl },
      ],
      seoMetadata: seoList,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "Erreur de mise à jour des réglages.");
      } else {
        setSuccess("Réglages enregistrés avec succès.");
        fetchSettings();
      }
    } catch {
      setError("Erreur réseau.");
    }
  };

  const inputClass = "w-full bg-[#1e1e1b] border border-[#c9a96e]/15 text-[#f0e8d8] px-4 py-3 text-sm font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none focus:border-[#c9a96e]/40 transition-colors";
  const labelClass = "block text-[10px] tracking-[0.3em] uppercase font-body text-[#c9a96e]/70 mb-2";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="pb-6 border-b border-[#c9a96e]/15">
        <h1 className="font-body font-medium text-3xl text-[#f0e8d8]">Réglages Généraux</h1>
        <p className="text-xs text-[#f0e8d8]/55 font-body mt-1">Configurez les informations publiques, horaires de service, réseaux sociaux et SEO.</p>
      </header>

      {error && (
        <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm font-body">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 text-sm font-body">
          {success}
        </div>
      )}

      {isLoading ? (
        <div className="text-[#f0e8d8]/40 animate-pulse text-sm text-center py-20 font-body">Chargement des paramètres...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card 1: General Info */}
          <section className="border border-[#c9a96e]/15 bg-[#141412] p-6 space-y-6">
            <h2 className="font-body font-medium text-xl text-[#f0e8d8] border-b border-[#c9a96e]/10 pb-2">Informations Générales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="restaurantName" className={labelClass}>Nom du restaurant *</label>
                <input
                  id="restaurantName"
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>Téléphone</label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>E-mail de contact</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="defaultLocale" className={labelClass}>Langue par défaut</label>
                <select
                  id="defaultLocale"
                  value={defaultLocale}
                  onChange={(e) => setDefaultLocale(e.target.value)}
                  className={`${inputClass} bg-[#1e1e1b] cursor-pointer`}
                >
                  <option value="fr">Français (FR)</option>
                  <option value="en">English (EN)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="shortPresentation" className={labelClass}>Présentation courte</label>
                <textarea
                  id="shortPresentation"
                  value={shortPresentation}
                  onChange={(e) => setShortPresentation(e.target.value)}
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="addressLine1" className={labelClass}>Adresse (Ligne 1)</label>
                <input
                  id="addressLine1"
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="addressLine2" className={labelClass}>Complément d&apos;adresse</label>
                <input
                  id="addressLine2"
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="postalCode" className={labelClass}>Code postal</label>
                <input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="city" className={labelClass}>Ville</label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="googleMapsUrl" className={labelClass}>URL Google Maps (Itinéraire)</label>
                <input
                  id="googleMapsUrl"
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Card 2: Opening Hours */}
          <section className="border border-[#c9a96e]/15 bg-[#141412] p-6 space-y-6">
            <h2 className="font-body font-medium text-xl text-[#f0e8d8] border-b border-[#c9a96e]/10 pb-2">Horaires d&apos;Ouverture</h2>
            <p className="text-xs text-[#f0e8d8]/55 font-body">Configurez les plages d&apos;ouverture hebdomadaires pour chaque jour.</p>
            <div className="space-y-4">
              {openingHours.map((oh, idx) => (
                <div key={oh.dayOfWeek} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-[#1e1e1b]/30 border border-[#c9a96e]/5">
                  <span className="font-semibold text-sm w-28 text-[#f0e8d8]">{DAYS_OF_WEEK[oh.dayOfWeek]}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={oh.opensAt || "12:00"}
                      onChange={(e) => handleHourChange(idx, "opensAt", e.target.value)}
                      disabled={oh.isClosed}
                      className="bg-[#1e1e1b] border border-[#c9a96e]/15 text-[#f0e8d8] px-3 py-1.5 text-xs focus:outline-none focus:border-[#c9a96e]/40 [color-scheme:dark] disabled:opacity-40"
                    />
                    <span className="text-xs text-[#f0e8d8]/40">à</span>
                    <input
                      type="time"
                      value={oh.closesAt || "23:00"}
                      onChange={(e) => handleHourChange(idx, "closesAt", e.target.value)}
                      disabled={oh.isClosed}
                      className="bg-[#1e1e1b] border border-[#c9a96e]/15 text-[#f0e8d8] px-3 py-1.5 text-xs focus:outline-none focus:border-[#c9a96e]/40 [color-scheme:dark] disabled:opacity-40"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs font-body cursor-pointer text-[#f0e8d8]/75 select-none w-20">
                    <input
                      type="checkbox"
                      checked={oh.isClosed}
                      onChange={(e) => handleHourChange(idx, "isClosed", e.target.checked)}
                      className="h-4 w-4 bg-[#1e1e1b] border border-[#c9a96e]/20 text-[#c9a96e] focus:ring-[#c9a96e]/50 focus:ring-opacity-25"
                    />
                    Fermé
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Card 3: Social Links */}
          <section className="border border-[#c9a96e]/15 bg-[#141412] p-6 space-y-6">
            <h2 className="font-body font-medium text-xl text-[#f0e8d8] border-b border-[#c9a96e]/10 pb-2">Réseaux Sociaux</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fb-url" className={labelClass}>Facebook (URL)</label>
                <input
                  id="fb-url"
                  type="text"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="ig-url" className={labelClass}>Instagram (URL)</label>
                <input
                  id="ig-url"
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Card 4: SEO Metadata */}
          <section className="border border-[#c9a96e]/15 bg-[#141412] p-6 space-y-6">
            <h2 className="font-body font-medium text-xl text-[#f0e8d8] border-b border-[#c9a96e]/10 pb-2">Référencement &amp; SEO</h2>
            <p className="text-xs text-[#f0e8d8]/55 font-body">Modifiez les balises Title, Meta Description et Keywords de chaque page.</p>
            <div className="space-y-6">
              {seoList.map((seo, idx) => (
                <div key={seo.route} className="bg-[#1e1e1b]/30 border border-[#c9a96e]/10 p-5 space-y-4">
                  <h3 className="font-body font-medium text-lg text-[#f0e8d8] border-b border-[#c9a96e]/5 pb-2">
                    Page : {DEFAULT_SEO_PAGES.find((p) => p.route === seo.route)?.label || seo.route}{" "}
                    <code className="text-xs font-mono text-[#c9a96e] bg-[#141412] px-2 py-0.5 ml-2 border border-[#c9a96e]/10">({seo.route})</code>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor={`seo-title-${idx}`} className={labelClass}>Titre de la Page (Title tag) *</label>
                      <input
                        id={`seo-title-${idx}`}
                        type="text"
                        value={seo.title}
                        onChange={(e) => handleSeoChange(idx, "title", e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor={`seo-desc-${idx}`} className={labelClass}>Meta Description *</label>
                      <textarea
                        id={`seo-desc-${idx}`}
                        value={seo.metaDescription}
                        onChange={(e) => handleSeoChange(idx, "metaDescription", e.target.value)}
                        rows={2}
                        required
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div>
                      <label htmlFor={`seo-keywords-${idx}`} className={labelClass}>Mots-clés locaux (séparés par des virgules)</label>
                      <input
                        id={`seo-keywords-${idx}`}
                        type="text"
                        value={seo.localKeywords || ""}
                        onChange={(e) => handleSeoChange(idx, "localKeywords", e.target.value)}
                        placeholder="ex: restaurant, lyon, celestins, terrasse"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submission Bar */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-4 bg-[#c9a96e] text-[#0b0b09] text-xs font-semibold tracking-widest uppercase hover:bg-[#dbbe86] active:bg-[#b8924a] transition-all cursor-pointer border-0 w-full sm:w-auto"
            >
              Enregistrer tous les Réglages
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
