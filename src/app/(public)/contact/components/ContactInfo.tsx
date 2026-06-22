import React from "react";
import { Card } from "@/components/ui";
import { DAYS_OF_WEEK, OpeningHour } from "@/components/settings-context";

interface ContactInfoProps {
  addressText: string | null;
  phoneText: string;
  emailText: string;
  googleMapsUrl?: string;
  openingHours?: OpeningHour[];
}

export function ContactInfo({
  addressText,
  phoneText,
  emailText,
  googleMapsUrl,
  openingHours,
}: ContactInfoProps) {
  const displayDays = [1, 2, 3, 4, 5, 6, 0];

  const getMapsUrl = () => {
    if (googleMapsUrl) return googleMapsUrl;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      addressText || "Place des Célestins, Lyon"
    )}`;
  };

  return (
    <div>
      <h2 className="font-body font-medium tracking-[-0.02em] text-2xl text-[#f0e8d8] mb-8">
        Informations pratiques
      </h2>

      <div className="space-y-7">
        {/* Adresse */}
        <Card variant="interactive" padding="md">
          <div className="flex gap-4">
            <svg
              className="w-5 h-5 text-[#c9a96e] mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/60 font-body mb-2">
                Adresse
              </p>
              <p className="text-[#f0e8d8]/65 text-sm font-body font-light">
                {addressText || "Place des Célestins, 69002 Lyon — France"}
              </p>
            </div>
          </div>
        </Card>

        {/* Contacts */}
        <Card variant="interactive" padding="md">
          <div className="flex gap-4">
            <svg
              className="w-5 h-5 text-[#c9a96e] mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/60 font-body mb-2">
                Contacts
              </p>
              <p className="text-[#f0e8d8]/65 text-sm font-body font-light">
                Tél : {phoneText}
              </p>
              <p className="text-[#f0e8d8]/65 text-sm font-body font-light">
                Email : {emailText}
              </p>
            </div>
          </div>
        </Card>

        {/* Horaires */}
        <Card variant="interactive" padding="md">
          <div className="flex gap-4">
            <svg
              className="w-5 h-5 text-[#c9a96e] mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/60 font-body mb-3">
                Horaires d&apos;ouverture
              </p>
              <div className="grid grid-cols-2 gap-y-2 text-sm font-body font-light">
                {displayDays.map((dayIdx) => {
                  const h = openingHours?.find((item) => item.dayOfWeek === dayIdx);
                  return (
                    <div key={dayIdx} className="contents">
                      <span className="text-[#f0e8d8]/50">
                        {DAYS_OF_WEEK[dayIdx]}
                      </span>
                      <span className="text-[#f0e8d8]/75 text-right lg:text-left">
                        {h ? (
                          h.isClosed ? (
                            <span className="text-[#8a8070]">Fermé</span>
                          ) : (
                            `${h.opensAt
                              ?.replace(":", "h")
                              .replace("00", "")} à ${h.closesAt
                              ?.replace(":", "h")
                              .replace("00", "")}`
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
        </Card>
      </div>

      {/* Direct CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <a
          href={`tel:${phoneText.replace(/\s+/g, "")}`}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold hover:bg-[#dbbe86] transition-colors"
        >
          Appeler
        </a>
        <a
          href={getMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-[#c9a96e]/35 text-[#c9a96e] text-[11px] tracking-[0.3em] uppercase font-body hover:bg-[#c9a96e] hover:text-[#0b0b09] transition-all"
        >
          Itinéraire
        </a>
      </div>
    </div>
  );
}
