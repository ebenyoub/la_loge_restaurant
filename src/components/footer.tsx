"use client";

import Link from "next/link";
import { useSettings, DAYS_OF_WEEK } from "@/components/settings-context";

export function Footer() {
  const { settings, isLoading } = useSettings();
  const restaurantName = settings?.restaurantName || "La Loge Bar & Food";

  // Address helper
  const getAddressLines = () => {
    if (!settings || !settings.addressLine1) {
      return ["Place des Célestins", "69002 Lyon — France"];
    }
    return [
      settings.addressLine1,
      ...(settings.addressLine2 ? [settings.addressLine2] : []),
      `${settings.postalCode || ""} ${settings.city || ""} — ${settings.countryCode || "France"}`
    ];
  };

  // Phone helper
  const phone = settings?.phone || "04 78 00 00 00";
  const email = settings?.email || "contact@laloge-lyon.fr";

  // Opening hours helper (sorted by dayOfWeek, starting with Monday = 1 to Sunday = 0/7)
  const getFormattedHours = () => {
    if (isLoading || !settings || !settings.openingHours || settings.openingHours.length === 0) {
      return [
        { label: "Lun – Jeu", value: "12h – 23h" },
        { label: "Ven – Sam", value: "12h – 01h" },
        { label: "Dimanche", value: "12h – 22h" }
      ];
    }

    // Sort days starting from Monday (1) to Sunday (0)
    const sortedHours = [...settings.openingHours].sort((a, b) => {
      const dayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
      const dayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
      return dayA - dayB;
    });

    return sortedHours.map((oh) => {
      const dayName = DAYS_OF_WEEK[oh.dayOfWeek];
      let timeStr = "Fermé";
      if (!oh.isClosed && oh.opensAt && oh.closesAt) {
        // format "12:00" to "12h" or "12h30"
        const formatTime = (t: string) => t.replace(":", "h").replace("00", "");
        timeStr = `${formatTime(oh.opensAt)} – ${formatTime(oh.closesAt)}`;
      }
      return {
        label: dayName,
        value: timeStr
      };
    });
  };

  return (
    <footer className="bg-[#080807] border-t border-[#c9a96e]/12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-body font-medium text-2xl text-[#f0e8d8] mb-1">
              La Loge
            </p>
            <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e]/70 font-body mb-5">
              Bar &amp; Food
            </p>
            <p className="text-[#f0e8d8]/50 text-sm font-body leading-relaxed">
              {settings?.shortPresentation || "Une expérience culinaire et cocktails au cœur du Lyon historique."}
            </p>
          </div>

          {/* Adresse & Contact */}
          <div>
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e] font-body mb-4">
              Adresse &amp; Contact
            </h3>
            <a
              href={settings?.googleMapsUrl ? settings.googleMapsUrl : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(getAddressLines().join(", "))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 mb-3 group"
            >
              <svg className="w-4 h-4 text-[#c9a96e]/60 mt-0.5 shrink-0 group-hover:text-[#c9a96e] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="text-[#f0e8d8]/60 text-sm font-body leading-relaxed group-hover:text-[#c9a96e] transition-colors">
                {getAddressLines().map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </a>
            <div className="flex items-center gap-2.5 mb-2.5">
              <svg className="w-4 h-4 text-[#c9a96e]/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="text-[#f0e8d8]/60 text-sm font-body hover:text-[#c9a96e] transition-colors">
                {phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#c9a96e]/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L20 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${email}`} className="text-[#f0e8d8]/60 text-sm font-body hover:text-[#c9a96e] transition-colors">
                {email}
              </a>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e] font-body mb-4">
              Horaires
            </h3>
            <div className="space-y-2 text-sm font-body">
              {getFormattedHours().map((h, idx) => (
                <div key={idx} className="flex justify-between gap-4">
                  <span className="text-[#f0e8d8]/50">{h.label}</span>
                  <span className="text-[#f0e8d8]/75">{h.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Réseaux */}
          <div>
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e] font-body mb-4">
              Suivez-nous
            </h3>
            <div className="flex gap-3 mb-6">
              {/* Instagram */}
              <a
                href={settings?.socialLinks?.find((s) => s.platform.toLowerCase() === "instagram")?.url || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-[#c9a96e]/25 flex items-center justify-center text-[#f0e8d8]/50 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth={2} />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2} />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href={settings?.socialLinks?.find((s) => s.platform.toLowerCase() === "facebook")?.url || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 border border-[#c9a96e]/25 flex items-center justify-center text-[#f0e8d8]/50 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#c9a96e]/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${email}`} className="text-[#f0e8d8]/50 text-sm font-body hover:text-[#c9a96e] transition-colors">
                {email}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#c9a96e]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#f0e8d8]/30 text-xs font-body tracking-wide">
            © 2025 {restaurantName} — Tous droits réservés
          </p>
          <Link
            href="/mentions-legales"
            className="text-[#f0e8d8]/30 text-xs font-body tracking-wide hover:text-[#c9a96e] transition-colors underline-offset-2 hover:underline"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}
