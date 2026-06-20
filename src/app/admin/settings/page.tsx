"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./page.module.css";

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
      const res = await fetch("/api/v1/admin/settings", {
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
      const res = await fetch("/api/v1/admin/settings", {
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

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1>Réglages Généraux</h1>
        <p className={styles.subtitle}>Configurez les informations publiques, horaires de service, réseaux sociaux et SEO.</p>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}
      {success && <div className={styles.successBanner}>{success}</div>}

      {isLoading ? (
        <div className={styles.loader}>Chargement des paramètres...</div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Section: Restaurant Info */}
          <section className={styles.card}>
            <h2>Informations Générales</h2>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor="restaurantName">Nom du restaurant</label>
                <input
                  id="restaurantName"
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">Téléphone</label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">E-mail de contact</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="defaultLocale">Langue par défaut</label>
                <select
                  id="defaultLocale"
                  value={defaultLocale}
                  onChange={(e) => setDefaultLocale(e.target.value)}
                >
                  <option value="fr">Français (FR)</option>
                  <option value="en">English (EN)</option>
                </select>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="shortPresentation">Présentation courte</label>
                <textarea
                  id="shortPresentation"
                  value={shortPresentation}
                  onChange={(e) => setShortPresentation(e.target.value)}
                  rows={2}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="addressLine1">Adresse (Ligne 1)</label>
                <input
                  id="addressLine1"
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="addressLine2">Complément d&apos;adresse</label>
                <input
                  id="addressLine2"
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="postalCode">Code postal</label>
                <input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="city">Ville</label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="googleMapsUrl">URL Google Maps (Itinéraire)</label>
                <input
                  id="googleMapsUrl"
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </section>

          {/* Section: Opening Hours */}
          <section className={styles.card}>
            <h2>Horaires d&apos;Ouverture</h2>
            <p className={styles.sectionHelp}>Configurez les plages d&apos;ouverture hebdomadaires pour chaque jour.</p>
            <div className={styles.hoursList}>
              {openingHours.map((oh, idx) => (
                <div key={oh.dayOfWeek} className={styles.hourRow}>
                  <span className={styles.dayName}>{DAYS_OF_WEEK[oh.dayOfWeek]}</span>
                  <div className={styles.hourInputs}>
                    <input
                      type="time"
                      value={oh.opensAt || "12:00"}
                      onChange={(e) => handleHourChange(idx, "opensAt", e.target.value)}
                      disabled={oh.isClosed}
                    />
                    <span className={styles.hourSep}>à</span>
                    <input
                      type="time"
                      value={oh.closesAt || "23:00"}
                      onChange={(e) => handleHourChange(idx, "closesAt", e.target.value)}
                      disabled={oh.isClosed}
                    />
                  </div>
                  <label className={styles.closedCheckbox}>
                    <input
                      type="checkbox"
                      checked={oh.isClosed}
                      onChange={(e) => handleHourChange(idx, "isClosed", e.target.checked)}
                    />
                    Fermé
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Social Links */}
          <section className={styles.card}>
            <h2>Réseaux Sociaux</h2>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor="fb-url">Facebook (URL)</label>
                <input
                  id="fb-url"
                  type="text"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="ig-url">Instagram (URL)</label>
                <input
                  id="ig-url"
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </section>

          {/* Section: SEO Metadata */}
          <section className={styles.card}>
            <h2>Référencement &amp; SEO</h2>
            <p className={styles.sectionHelp}>Modifiez les balises Title, Meta Description et Keywords de chaque page.</p>
            <div className={styles.seoList}>
              {seoList.map((seo, idx) => (
                <div key={seo.route} className={styles.seoPageCard}>
                  <h3>Page : {DEFAULT_SEO_PAGES.find((p) => p.route === seo.route)?.label || seo.route} <code>({seo.route})</code></h3>
                  <div className={styles.grid}>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label htmlFor={`seo-title-${idx}`}>Titre de la Page (Title tag)</label>
                      <input
                        id={`seo-title-${idx}`}
                        type="text"
                        value={seo.title}
                        onChange={(e) => handleSeoChange(idx, "title", e.target.value)}
                        required
                      />
                    </div>

                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label htmlFor={`seo-desc-${idx}`}>Meta Description</label>
                      <textarea
                        id={`seo-desc-${idx}`}
                        value={seo.metaDescription}
                        onChange={(e) => handleSeoChange(idx, "metaDescription", e.target.value)}
                        rows={2}
                        required
                      />
                    </div>

                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label htmlFor={`seo-keywords-${idx}`}>Mots-clés locaux (séparés par des virgules)</label>
                      <input
                        id={`seo-keywords-${idx}`}
                        type="text"
                        value={seo.localKeywords || ""}
                        onChange={(e) => handleSeoChange(idx, "localKeywords", e.target.value)}
                        placeholder="ex: restaurant, lyon, celestins, terrasse"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.formSubmitBar}>
            <button type="submit" className={styles.btnSave}>
              Enregistrer tous les Réglages
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
