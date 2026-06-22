"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ displayName: string; role: string } | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const knownReservationIdsRef = useRef<Set<string>>(new Set());
  const knownContactIdsRef = useRef<Set<string>>(new Set());
  const isInitialRef = useRef(true);

  // Sound generator using Web Audio API
  const playNotificationSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(start);
        osc.stop(start + duration);
      };
      
      const now = ctx.currentTime;
      playTone(523.25, now, 0.3); // C5
      playTone(659.25, now + 0.12, 0.4); // E5
    } catch (err) {
      console.error("Erreur de lecture sonore :", err);
    }
  };

  const toggleAudioNotifications = () => {
    const newEnabled = !audioEnabled;
    setAudioEnabled(newEnabled);
    if (newEnabled) {
      playNotificationSound();
    }
  };

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }
    const token = localStorage.getItem("admin_token");
    const userStr = localStorage.getItem("admin_user");

    if (!token || !userStr) {
      router.push("/admin/login");
    } else {
      Promise.resolve().then(() => {
        setIsAuthenticated(true);
        try {
          setAdminUser(JSON.parse(userStr));
        } catch {
          setAdminUser(null);
        }
      });
    }
  }, [router, pathname]);

  // Polling logic for new reservations & contacts
  useEffect(() => {
    if (!isAuthenticated || pathname === "/admin/login") return;

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    const poll = async () => {
      try {
        // Fetch new reservations
        const resReservations = await fetch(`${API_BASE_URL}/admin/reservations?status=nouvelle`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataReservations = await resReservations.json();

        // Fetch new contacts
        const resContacts = await fetch(`${API_BASE_URL}/admin/contact-messages?status=nouveau`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataContacts = await resContacts.json();

        let playedSound = false;

        if (resReservations.ok && dataReservations.data?.items) {
          const currentIds = dataReservations.data.items.map((item: { id: string }) => item.id);
          
          if (!isInitialRef.current) {
            const hasNew = currentIds.some((id: string) => !knownReservationIdsRef.current.has(id));
            if (hasNew) {
              playedSound = true;
            }
          }
          knownReservationIdsRef.current = new Set(currentIds);
        }

        if (resContacts.ok && dataContacts.data?.items) {
          const currentIds = dataContacts.data.items.map((item: { id: string }) => item.id);

          if (!isInitialRef.current) {
            const hasNew = currentIds.some((id: string) => !knownContactIdsRef.current.has(id));
            if (hasNew) {
              playedSound = true;
            }
          }
          knownContactIdsRef.current = new Set(currentIds);
        }

        if (playedSound && audioEnabled) {
          playNotificationSound();
        }

        isInitialRef.current = false;
      } catch (err) {
        console.error("Erreur de polling pour les notifications sonores :", err);
      }
    };

    poll();
    const interval = setInterval(poll, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated, pathname, audioEnabled]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0b09] flex items-center justify-center text-[#f0e8d8]/80 font-body">
        <p className="animate-pulse">Vérification des droits d&apos;accès...</p>
      </div>
    );
  }

  const navItems = [
    { label: "Réservations", href: "/admin/reservations" },
    { label: "Contacts", href: "/admin/contact-messages" },
    { label: "Sections de la carte", href: "/admin/categories" },
    { label: "Plats", href: "/admin/plats" },
    { label: "Réglages", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b09] text-[#f0e8d8] font-body flex flex-col">
      {/* Admin Navigation Bar */}
      <header className="bg-[#141412] border-b border-[#c9a96e]/15 sticky top-0 z-40">
        <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="group flex flex-col leading-none text-left focus:outline-none"
              aria-label="La Loge Bar & Food — Accueil"
            >
              <span className="font-body font-medium text-[16px] md:text-[18px] tracking-[0.06em] text-[#f0e8d8] group-hover:text-[#c9a96e] transition-colors duration-300">
                LA LOGE
              </span>
              <span className="text-[8px] tracking-[0.4em] uppercase text-[#c9a96e]/80 font-body -mt-0.5">
                BAR & FOOD
              </span>
            </Link>
            <div className="h-6 w-px bg-[#c9a96e]/20" />
            <span className="font-body font-medium text-xs md:text-sm text-[#f0e8d8] tracking-wide whitespace-nowrap">
              La Loge - <span className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-body ml-0.5">Admin</span>
            </span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6" aria-label="Navigation administration">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs uppercase tracking-wider transition-colors duration-200 ${
                    active
                      ? "text-[#c9a96e] font-semibold border-b border-[#c9a96e]/60 pb-1"
                      : "text-[#f0e8d8]/60 hover:text-[#f0e8d8] pb-1"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleAudioNotifications}
              className={`flex items-center gap-2 text-[10px] tracking-wider uppercase font-semibold px-3 py-2 border rounded transition-all cursor-pointer ${
                audioEnabled
                  ? "text-[#c9a96e] border-[#c9a96e]/30 bg-[#c9a96e]/5 hover:bg-[#c9a96e]/10"
                  : "text-[#f0e8d8]/40 border-[#c9a96e]/15 hover:text-[#f0e8d8]/60"
              }`}
              title={audioEnabled ? "Désactiver les notifications sonores" : "Activer les notifications sonores"}
            >
              {audioEnabled ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span className="hidden sm:inline">Son Actif</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zm11.95 3.182a9 9 0 000-12.728m-2.828 9.9a5 5 0 000-7.072" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                  <span className="hidden sm:inline">Son Inactif</span>
                </>
              )}
            </button>
            {adminUser && (
              <span className="inline-flex px-2.5 py-1 bg-[#c9a96e]/10 text-[#c9a96e] text-[10px] uppercase tracking-wider font-semibold border border-[#c9a96e]/20 rounded-full">
                {adminUser.displayName} ({adminUser.role})
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-[11px] tracking-wider uppercase text-red-400 hover:text-red-300 font-semibold px-4 py-2 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer rounded"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-[#c9a96e]/10 py-3 bg-[#141412]">
          <nav className="flex items-center overflow-x-auto scrollbar-none px-6 gap-6" aria-label="Navigation administration mobile">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[10px] uppercase tracking-wider whitespace-nowrap transition-colors duration-200 ${
                    active
                      ? "text-[#c9a96e] font-semibold"
                      : "text-[#f0e8d8]/60 hover:text-[#f0e8d8]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
