import React from "react";

interface ContactMapProps {
  googleMapsUrl?: string;
  addressText: string | null;
}

export function ContactMap({ googleMapsUrl, addressText }: ContactMapProps) {
  const getEmbedSrc = () => {
    if (googleMapsUrl && googleMapsUrl.includes("embed")) {
      return googleMapsUrl;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(
      addressText || "Place des Célestins, Lyon"
    )}&output=embed&z=16`;
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="font-body font-medium tracking-[-0.02em] text-2xl text-[#f0e8d8]">
        Localisation
      </h2>
      <div className="flex-1 min-h-[380px] bg-[#141412] border border-[#c9a96e]/12 overflow-hidden relative">
        <iframe
          title="La Loge Bar & Food — Localisation"
          src={getEmbedSrc()}
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full grayscale contrast-125 opacity-80"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute bottom-4 left-4 bg-[#0b0b09]/90 backdrop-blur-sm border border-[#c9a96e]/20 px-4 py-2.5">
          <p className="font-body font-medium text-[#f0e8d8] text-sm">La Loge</p>
          <p className="text-[#c9a96e]/70 text-[10px] tracking-wide font-body">
            Place des Célestins · Lyon 2e
          </p>
        </div>
      </div>
    </div>
  );
}
