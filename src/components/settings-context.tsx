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
    if (settings && settings.seoMetadata) {
      const pageSeo = settings.seoMetadata.find((s) => s.route === route);
      if (pageSeo) {
        document.title = pageSeo.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", pageSeo.metaDescription);
        }
      } else {
        document.title = fallbackTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", fallbackDesc);
        }
      }
    }
  }, [settings, route, fallbackTitle, fallbackDesc]);
}
