"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSettings, usePageSeo } from "@/components/settings-context";
import { API_BASE_URL } from "@/lib/api";

interface PreviewItem {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  categoryName: string;
}

interface APICategoryItem {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
}

interface APIMenuCategory {
  name: string;
  menuItems: APICategoryItem[];
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

export default function Home() {
  const { settings } = useSettings();
  const [menuPreview, setMenuPreview] = useState<PreviewItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [menuLoadError, setMenuLoadError] = useState(false);

  // Dynamic SEO from database
  usePageSeo(
    "/",
    settings?.restaurantName || "La Loge Bar & Food",
    settings?.shortPresentation || "Projet de refonte du site de La Loge Bar & Food à Lyon."
  );

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/menu`);
        if (!res.ok) throw new Error("Erreur de chargement");
        const json = await res.json();
        
        // Flatten active menu items from active categories
        const items: PreviewItem[] = (json.data || []).flatMap((cat: APIMenuCategory) =>
          (cat.menuItems || []).map((item: APICategoryItem) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            priceCents: item.priceCents,
            categoryName: cat.name,
          }))
        );
        // Show first 3 items as preview
        setMenuPreview(items.slice(0, 3));
      } catch {
        setMenuLoadError(true);
      } finally {
        setIsMenuLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const restaurantName = settings?.restaurantName || "La Loge Bar & Food";
  const presentation = settings?.shortPresentation || "Cuisine généreuse, cocktails d'auteur — dans l'écrin du Lyon historique.";
  
  // Format today's hours dynamically
  const getTodayHoursText = () => {
    if (!settings || !settings.openingHours || settings.openingHours.length === 0) {
      return "Horaires à confirmer";
    }
    const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const todayHours = settings.openingHours.find((h) => h.dayOfWeek === todayIndex);

    if (!todayHours) return "Horaires à confirmer";
    if (todayHours.isClosed) return "Fermé aujourd'hui";
    if (todayHours.opensAt && todayHours.closesAt) {
      const formatTime = (t: string) => t.replace(":", "h").replace("00", "");
      return `Ouvert aujourd'hui : de ${formatTime(todayHours.opensAt)} à ${formatTime(todayHours.closesAt)}`;
    }
    return "Horaires à confirmer";
  };

  // Format address
  const getAddressText = () => {
    if (!settings || !settings.addressLine1) return "Place des Célestins, 69002 Lyon.";
    return `${settings.addressLine1}${settings.addressLine2 ? ', ' + settings.addressLine2 : ''}, ${settings.postalCode || ''} ${settings.city || ''}`;
  };

  return (
    <div className="min-h-screen bg-[#0b0b09] text-[#f0e8d8] font-body overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden bg-[#0b0b09]" aria-labelledby="home-title">
        <Image
          src="/images/imported/restaurant-facade-nuit-01.webp"
          alt="La Loge — ambiance extérieure de nuit"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b09] via-[#0b0b09]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b09]/30 via-transparent to-[#0b0b09]/30" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <SectionLabel>{settings?.city ? `${settings.city} · France` : "Place des Célestins · Lyon 2e"}</SectionLabel>
          <h1
            id="home-title"
            className="font-body font-light tracking-[-0.04em] text-[clamp(3.5rem,10vw,6.5rem)] leading-[0.88] text-[#f0e8d8] mb-5"
          >
            {restaurantName.split(" ").slice(0, 2).join(" ")}
          </h1>
          <p className="text-[11px] tracking-[0.5em] uppercase text-[#c9a96e] font-body mb-7">
            {restaurantName.split(" ").slice(2).join(" ") || "Bar & Food"}
          </p>
          <p className="text-[#f0e8d8]/65 text-lg md:text-xl font-body font-light leading-relaxed max-w-md mx-auto mb-12">
            {presentation}
          </p>
          <p className="text-[#c9a96e]/80 text-xs tracking-widest font-body uppercase mb-10">
            <strong>{getTodayHoursText()}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="px-8 py-4 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold hover:bg-[#dbbe86] active:bg-[#b8924a] transition-colors duration-200 text-center"
            >
              Demander une réservation
            </Link>
            <Link
              href="/carte"
              className="px-8 py-4 border border-[#f0e8d8]/30 text-[#f0e8d8] text-[11px] tracking-[0.3em] uppercase font-body hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors duration-200 text-center"
            >
              Voir la carte
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-px h-10 bg-gradient-to-b from-[#c9a96e]/50 to-transparent" />
        </div>
      </section>

      {/* Presentation Section */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#0b0b09]" aria-labelledby="presentation-title">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-[#141412] border border-[#c9a96e]/10">
            <Image
              src="/images/imported/menu-ardoise-01.webp"
              alt="Ardoise du jour et ambiance de La Loge"
              fill
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0b0b09]/40 to-transparent" />
            <div className="absolute bottom-8 right-0 bg-[#c9a96e] text-[#0b0b09] px-6 py-4">
              <p className="text-[10px] tracking-[0.4em] uppercase font-body font-semibold">Ouvert 7j/7</p>
              <p className="text-[10px] tracking-[0.25em] font-body">dès 12h00</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <SectionLabel>Notre histoire</SectionLabel>
            <h2 id="presentation-title" className="font-body font-medium tracking-[-0.03em] text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.05] text-[#f0e8d8] mb-6">
              Un lieu vivant,<br />une cuisine sincère
            </h2>
            <div className="w-12 h-px bg-[#c9a96e]/50 mb-8" />
            <p className="text-[#f0e8d8]/60 text-base font-body font-light leading-loose mb-6">
              La Loge prend ses quartiers place des Célestins, au cœur du Lyon culturel.
              Une adresse pensée comme un refuge : chaleureux le midi pour un déjeuner bistronomique, animé et festif en soirée.
              La cuisine y est directe, généreuse, valorisant les circuits courts et le rythme des saisons.
            </p>
            <p className="text-[#f0e8d8]/60 text-base font-body font-light leading-loose mb-10">
              Derrière le bar, nos barmen composent des cocktails sur-mesure et revisitent les grands classiques avec des spiritueux de caractère. Du lundi au dimanche, La Loge est un véritable lieu de vie lyonnais.
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-[#c9a96e]/12 pt-8">
              {[
                { n: "2019", label: "Fondé à Lyon" },
                { n: "40+", label: "Couverts" },
                { n: "7j/7", label: "Ouverture" },
              ].map(({ n, label }) => (
                <div key={n}>
                  <p className="font-body font-medium text-2xl text-[#c9a96e] mb-1">{n}</p>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#f0e8d8]/40 font-body">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#0e0e0c]" aria-labelledby="menu-title">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>La carte</SectionLabel>
            <h2 id="menu-title" className="font-body font-medium tracking-[-0.03em] text-[clamp(2rem,4vw,3rem)] text-[#f0e8d8]">
              Quelques-uns de nos plats
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Chef image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1a17] border border-[#c9a96e]/10">
              <Image 
                src="/images/imported/plat-salade-cesar-01.webp" 
                alt="Plat signature proposé par notre chef" 
                fill
                className="object-cover"
                sizes="(max-w-1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141412]/80 via-transparent to-transparent" />
            </div>

            {/* Flat list of items */}
            {isMenuLoading ? (
              <p className="text-center text-[#f0e8d8]/40">Chargement de la carte...</p>
            ) : menuLoadError ? (
              <div className="text-center py-10 border border-[#c9a96e]/15 bg-[#141412]/50">
                <p className="text-[#f0e8d8]/50">La carte est temporairement indisponible.</p>
              </div>
            ) : menuPreview.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-[#c9a96e]/20 bg-[#141412]/50">
                <p className="text-[#f0e8d8]/40">Carte en cours de mise à jour.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {menuPreview.map((item) => (
                  <div key={item.id} className="group border-b border-[#c9a96e]/10 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-baseline gap-4 mb-2">
                      <span className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]/80 font-body">
                        {item.categoryName}
                      </span>
                      <span className="font-body font-medium text-lg text-[#c9a96e]">
                        {(item.priceCents / 100).toFixed(2)} €
                      </span>
                    </div>
                    <h3 className="font-body font-medium text-xl text-[#f0e8d8] group-hover:text-[#c9a96e] transition-colors duration-200">
                      {item.name}
                    </h3>
                    {item.description ? (
                      <p className="text-[#f0e8d8]/50 text-sm font-body font-light leading-relaxed mt-1">
                        {item.description}
                      </p>
                    ) : (
                      <p className="text-[#f0e8d8]/35 text-xs font-body mt-1">
                        Description à confirmer.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center">
            <Link
              href="/carte"
              className="inline-flex items-center gap-3 text-[#c9a96e] text-[11px] tracking-[0.35em] uppercase font-body border border-[#c9a96e]/35 px-8 py-3.5 hover:bg-[#c9a96e] hover:text-[#0b0b09] transition-all duration-200"
            >
              Consulter la carte complète
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#0b0b09] border-t border-[#c9a96e]/10" aria-labelledby="access-title">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Accès rapide</SectionLabel>
            <h2 id="access-title" className="font-body font-medium tracking-[-0.03em] text-[clamp(2rem,4vw,3rem)] text-[#f0e8d8]">
              Nous trouver
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1: Adresse */}
            <div className="border border-[#c9a96e]/12 p-8 bg-[#141412]/50 hover:border-[#c9a96e]/30 transition-colors duration-200">
              <div className="mb-5">
                <svg className="w-5 h-5 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e] font-body mb-4">Adresse</h3>
              <p className="text-[#f0e8d8]/65 text-sm font-body font-light leading-relaxed">
                <a
                  href={settings?.googleMapsUrl ? settings.googleMapsUrl : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(getAddressText())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  {getAddressText()}
                </a>
              </p>
              {settings?.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 text-[#c9a96e] text-[11px] tracking-[0.3em] uppercase font-body hover:text-[#dbbe86] transition-colors"
                >
                  Itinéraire
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>

            {/* Card 2: Contact */}
            <div className="border border-[#c9a96e]/12 p-8 bg-[#141412]/50 hover:border-[#c9a96e]/30 transition-colors duration-200">
              <div className="mb-5">
                <svg className="w-5 h-5 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e] font-body mb-4">Téléphone &amp; Email</h3>
              <p className="text-[#f0e8d8]/65 text-sm font-body font-light leading-relaxed">
                Tél :{" "}
                <a
                  href={`tel:${(settings?.phone || "04 78 00 00 00").replace(/\s+/g, "")}`}
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  {settings?.phone || "04 78 00 00 00"}
                </a>
              </p>
              <p className="text-[#f0e8d8]/65 text-sm font-body font-light leading-relaxed mt-1">
                Email :{" "}
                <a
                  href={`mailto:${settings?.email || "contact@laloge-lyon.fr"}`}
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  {settings?.email || "contact@laloge-lyon.fr"}
                </a>
              </p>
              <a
                href={`tel:${(settings?.phone || "04 78 00 00 00").replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 mt-6 text-[#c9a96e] text-[11px] tracking-[0.3em] uppercase font-body hover:text-[#dbbe86] transition-colors"
              >
                Appeler
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Card 3: Horaires */}
            <div className="border border-[#c9a96e]/12 p-8 bg-[#141412]/50 hover:border-[#c9a96e]/30 transition-colors duration-200">
              <div className="mb-5">
                <svg className="w-5 h-5 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e] font-body mb-4">Horaires généraux</h3>
              <p className="text-[#f0e8d8]/65 text-sm font-body font-light leading-relaxed">
                Ouvert 7 jours sur 7
              </p>
              <p className="text-[#f0e8d8]/50 text-xs font-body leading-relaxed mt-2">
                Consultez tous nos horaires détaillés dans l&apos;onglet Contact ou en bas de page.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#1e1e1b] text-[#f0e8d8] text-[11px] tracking-[0.3em] uppercase font-body hover:bg-[#252420] transition-colors duration-200"
            >
              Contact &amp; Accès détaillés
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Reservation Section */}
      <section className="relative py-28 lg:py-36 px-6 lg:px-10 overflow-hidden bg-[#0e0e0c]" aria-labelledby="reservation-title-footer">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(201,169,110,0.3) 39px, rgba(201,169,110,0.3) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(201,169,110,0.3) 39px, rgba(201,169,110,0.3) 40px)",
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center z-10">
          <SectionLabel>Réservation</SectionLabel>
          <h2 id="reservation-title-footer" className="font-body font-medium tracking-[-0.03em] text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.05] text-[#f0e8d8] mb-5">
            Réservez votre table<br />à La Loge
          </h2>
          <p className="text-[#f0e8d8]/50 font-body font-light leading-relaxed mb-3">
            Toute demande en ligne est traitée et validée par nos équipes selon les disponibilités réelles de l&apos;établissement.
          </p>
          <p className="text-[#c9a96e]/70 text-xs tracking-wide font-body mb-10">
            ⚠ Vous recevrez un email ou un appel de confirmation pour valider la réservation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="px-10 py-4 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold hover:bg-[#dbbe86] transition-colors duration-200 text-center"
            >
              Demander une réservation
            </Link>
            <a
              href={`tel:${(settings?.phone || "04 78 00 00 00").replace(/\s+/g, "")}`}
              className="px-10 py-4 border border-[#f0e8d8]/20 text-[#f0e8d8] text-[11px] tracking-[0.3em] uppercase font-body hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors duration-200 text-center"
            >
              Nous appeler directement
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
