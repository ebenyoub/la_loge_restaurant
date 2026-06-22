"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings, usePageSeo } from "@/components/settings-context";
import { API_BASE_URL } from "@/lib/api";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  allergenInfo: string | null;
  dietaryInfo: string | null;
}

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  menuItems: MenuItem[];
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

export default function CartePage() {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Dynamic SEO from database
  usePageSeo(
    "/carte",
    settings?.restaurantName ? `${settings.restaurantName} - La Carte` : "La Loge Bar & Food - La Carte",
    "Découvrez les boissons, plats, formules et sélections de notre carte."
  );

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/menu`);
        if (!res.ok) throw new Error("Erreur de chargement");
        const json = await res.json();
        setCategories(json.data || []);
      } catch {
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const restaurantName = settings?.restaurantName || "La Loge Bar & Food";

  return (
    <div className="min-h-screen pt-[72px] bg-[#0b0b09] text-[#f0e8d8] font-body">
      {/* Introduction Header */}
      <div className="relative py-20 lg:py-28 px-6 text-center overflow-hidden bg-[#0e0e0c]">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #c9a96e 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <SectionLabel>{settings?.city ? `${restaurantName} · ${settings.city}` : `${restaurantName} · Lyon`}</SectionLabel>
          <h1 className="font-body font-light tracking-[-0.04em] text-[clamp(2.5rem,6vw,4.5rem)] text-[#f0e8d8]">
            La Carte
          </h1>
          <p className="mt-4 text-[#f0e8d8]/45 font-body font-light text-sm leading-relaxed max-w-md mx-auto">
            {settings?.shortPresentation 
              ? settings.shortPresentation
              : "Cette carte présente notre offre de restauration et nos cocktails, préparés à partir de produits frais et de saison."
            }
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center text-[#f0e8d8]/40">
          <p>Chargement de la carte...</p>
        </div>
      ) : loadError ? (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center border border-[#c9a96e]/15 bg-[#141412]/50 my-10">
          <p className="text-[#f0e8d8]/60 font-body font-medium text-xl">
            La carte est temporairement indisponible.
          </p>
          <p className="mt-3 text-[#f0e8d8]/40 text-sm">
            Veuillez réessayer dans quelques instants.
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center border border-dashed border-[#c9a96e]/20 bg-[#141412]/50 my-10">
          <p className="text-[#f0e8d8]/40 font-body font-medium text-xl">
            Carte en cours de préparation
          </p>
        </div>
      ) : (
        <>
          {/* Categories Nav (sticky) */}
          <nav className="sticky top-[72px] z-40 bg-[#0b0b09]/96 backdrop-blur-md border-b border-[#c9a96e]/12 overflow-x-auto scrollbar-none" aria-label="Sections de la carte">
            <div className="max-w-5xl mx-auto px-6 py-4 flex gap-8 justify-center min-w-max">
              {categories.map((cat) => (
                <a key={cat.id} href={`#${cat.slug}`} className="text-[10px] tracking-[0.4em] uppercase font-body text-[#f0e8d8]/50 hover:text-[#c9a96e] active:text-[#c9a96e] transition-colors whitespace-nowrap">
                  {cat.name}
                </a>
              ))}
            </div>
          </nav>

          {/* Categories Sections */}
          <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12">
            {categories.map((cat) => (
              <section key={cat.id} id={cat.slug} className="scroll-mt-36 py-14 border-b border-[#c9a96e]/10 last:border-b-0" aria-labelledby={`title-${cat.id}`}>
                <div className="mb-10 text-center lg:text-left">
                  <span className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]/70 font-body">Section de la carte</span>
                  <h2 id={`title-${cat.id}`} className="font-body font-medium tracking-[-0.02em] text-3xl text-[#f0e8d8] mt-1">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-[#f0e8d8]/55 text-sm font-body font-light mt-2 max-w-xl">{cat.description}</p>
                  )}
                </div>

                {cat.menuItems.length === 0 ? (
                  <p className="text-[#f0e8d8]/30 text-xs font-body">Section en cours de rédaction.</p>
                ) : (
                  <div className="divide-y divide-[#c9a96e]/10">
                    {cat.menuItems.map((item) => (
                      <div key={item.id} className="group py-6 flex items-start justify-between gap-6 hover:bg-[#141412]/40 -mx-4 px-4 transition-colors duration-150">
                        <div className="flex-1">
                          <h3 className="font-body font-medium text-[1.15rem] text-[#f0e8d8] group-hover:text-[#c9a96e] transition-colors duration-200">
                            {item.name}
                          </h3>
                          {item.description ? (
                            <p className="mt-1.5 text-[#f0e8d8]/40 text-sm font-body font-light leading-relaxed">
                              {item.description}
                            </p>
                          ) : (
                            <p className="mt-1.5 text-[#f0e8d8]/30 text-xs font-body">
                              Description à confirmer.
                            </p>
                          )}

                          {(item.allergenInfo || item.dietaryInfo) && (
                            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-body">
                              {item.dietaryInfo && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                                  {item.dietaryInfo}
                                </span>
                              )}
                              {item.allergenInfo && (
                                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/10">
                                  Allergènes : {item.allergenInfo}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="font-body font-medium text-lg text-[#c9a96e] shrink-0">
                          {(item.priceCents / 100).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </>
      )}

      {/* Allergens Info Section */}
      <section className="bg-[#141412]/50 border-t border-b border-[#c9a96e]/12 py-16 px-6 text-center" aria-labelledby="allergenes-title">
        <div className="max-w-2xl mx-auto">
          <h2 id="allergenes-title" className="font-body font-medium tracking-[-0.02em] text-2xl text-[#f0e8d8] mb-4">Informations Allergènes</h2>
          <p className="text-[#f0e8d8]/50 text-sm font-body font-light leading-relaxed mb-6">
            Pour toute allergie, intolérance alimentaire ou régime spécifique, nous vous prions d&apos;en informer nos équipes au moment de votre commande ou lors de votre demande de réservation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-[#c9a96e] text-[11px] tracking-[0.3em] uppercase font-body hover:text-[#dbbe86] transition-colors"
          >
            Nous écrire pour en savoir plus
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#0e0e0c] py-20 px-6 text-center" aria-labelledby="reservation-title">
        <div className="max-w-xl mx-auto">
          <h2 id="reservation-title" className="font-body font-medium tracking-[-0.02em] text-2xl md:text-3xl text-[#f0e8d8] mb-4">
            Une table vous intéresse ?
          </h2>
          <p className="text-[#f0e8d8]/50 text-sm font-body font-light mb-8 leading-relaxed">
            N&apos;hésitez pas à demander une réservation en ligne. Notre gérant vous recontactera au plus vite pour valider votre demande.
          </p>
          <Link
            href="/reservation"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold hover:bg-[#dbbe86] transition-colors"
          >
            Demander une réservation
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
