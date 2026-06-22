"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/components/settings-context";

export function Header() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const restaurantName = settings?.restaurantName || "La Loge Bar & Food";
  
  // Format the brand name nicely by splitting it (like "La Loge" and "Bar & Food")
  const parts = restaurantName.split(" ");
  const brandFirst = parts.length > 2 ? parts.slice(0, 2).join(" ") : parts[0] || "La Loge";
  const brandSecond = parts.length > 2 ? parts.slice(2).join(" ") : parts.slice(1).join(" ") || "Bar & Food";

  const isTransparent = pathname === "/" && !scrolled && !mobileOpen;

  const links = [
    { name: "Carte", href: "/carte" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "bg-transparent"
          : "bg-[#0b0b09]/96 backdrop-blur-md border-b border-[#c9a96e]/12"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between" aria-label="Navigation principale">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="group flex flex-col leading-none text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b09]"
          aria-label="La Loge Bar & Food — Accueil"
        >
          <span className="font-body font-medium text-[22px] tracking-[0.06em] text-[#f0e8d8] group-hover:text-[#c9a96e] transition-colors duration-300">
            {brandFirst}
          </span>
          <span className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e]/80 font-body -mt-0.5">
            {brandSecond}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] tracking-[0.35em] uppercase font-body transition-colors duration-200 focus:outline-none focus-visible:text-[#c9a96e] ${
                pathname === link.href
                  ? "text-[#c9a96e]"
                  : "text-[#f0e8d8]/70 hover:text-[#f0e8d8]"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/reservation"
            className="px-6 py-2.5 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold hover:bg-[#dbbe86] active:bg-[#b8924a] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b09]"
          >
            Demander une réservation
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden -mr-2 inline-flex w-12 h-12 relative z-50 items-center justify-center text-[#f0e8d8] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e] cursor-pointer"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[300px] opacity-100 border-b border-[#c9a96e]/12" : "max-h-0 opacity-0 pointer-events-none"
        } bg-[#0b0b09] border-t border-[#c9a96e]/12`}
      >
        <div className="px-6 py-7 flex flex-col gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-left text-[11px] tracking-[0.4em] uppercase font-body text-[#f0e8d8]/75 hover:text-[#c9a96e] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/reservation"
            onClick={() => setMobileOpen(false)}
            className="w-full px-6 py-3.5 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold text-center hover:bg-[#dbbe86] transition-colors"
          >
            Demander une réservation
          </Link>
        </div>
      </div>
    </header>
  );
}
