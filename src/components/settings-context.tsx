"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export interface OpeningHour {
  id?: string;
  dayOfWeek: number;
  opensAt: string | null;
  closesAt: string | null;
  isClosed: boolean;
}

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  isActive: boolean;
}

export interface SeoMetadata {
  id?: string;
  route: string;
  title: string;
  metaDescription: string;
  localKeywords: string | null;
}

export interface SettingsData {
  restaurantName: string;
  shortPresentation: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  postalCode: string | null;
  city: string | null;
  countryCode: string | null;
  phone: string | null;
  email: string | null;
  googleMapsUrl: string | null;
  defaultLocale: string;
  openingHours: OpeningHour[];
  socialLinks: SocialLink[];
  seoMetadata: SeoMetadata[];
}

interface SettingsContextType {
  settings: SettingsData | null;
  isLoading: boolean;
  error: string | null;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: true,
  error: null,
});

export const useSettings = () => useContext(SettingsContext);

export const DAYS_OF_WEEK = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/settings`);
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des réglages");
        }
        const json = await res.json();
        setSettings(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, error }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function usePageSeo(route: string, fallbackTitle: string, fallbackDesc: string) {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings) return;

    const pageSeo = settings.seoMetadata?.find((s) => s.route === route);
    const title = pageSeo?.title || fallbackTitle;
    const description = pageSeo?.metaDescription || fallbackDesc;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalogelyon.fr";
    const canonicalUrl = `${siteUrl}${route === "/" ? "" : route}`;

    // 1. Update basic elements
    document.title = title;

    // Helper to upsert meta tags
    const setMeta = (nameOrProperty: string, value: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (isProperty) {
          el.setAttribute("property", nameOrProperty);
        } else {
          el.setAttribute("name", nameOrProperty);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta("description", description);

    // 2. OpenGraph
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "website", true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:site_name", settings.restaurantName || "La Loge Bar & Food", true);

    // 3. Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    // 4. Canonical Link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonicalUrl);

    // 5. JSON-LD structured data (Restaurant & LocalBusiness)
    const jsonLdId = "json-ld-restaurant";
    let scriptEl = document.getElementById(jsonLdId);
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = jsonLdId;
      scriptEl.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptEl);
    }

    const street = settings.addressLine1 || "";
    const comp = settings.addressLine2 ? `, ${settings.addressLine2}` : "";
    const streetAddress = `${street}${comp}`.trim();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const openingHoursSpec = settings.openingHours?.map((oh) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": days[oh.dayOfWeek],
      "opens": oh.isClosed ? "00:00" : (oh.opensAt || "12:00"),
      "closes": oh.isClosed ? "00:00" : (oh.closesAt || "23:00")
    })) || [];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "@id": `${siteUrl}/#restaurant`,
      "name": settings.restaurantName || "La Loge Bar & Food",
      "description": settings.shortPresentation || description,
      "url": siteUrl,
      "telephone": settings.phone || "",
      "email": settings.email || "",
      "menu": `${siteUrl}/carte`,
      "acceptsReservations": "true",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": streetAddress || "7 Rue Charles Dullin",
        "postalCode": settings.postalCode || "69002",
        "addressLocality": settings.city || "Lyon",
        "addressCountry": settings.countryCode || "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 45.760188,
        "longitude": 4.831619
      },
      "openingHoursSpecification": openingHoursSpec,
      "sameAs": settings.socialLinks?.map((sl) => sl.url) || []
    };

    scriptEl.textContent = JSON.stringify(structuredData);

  }, [settings, route, fallbackTitle, fallbackDesc]);
}
