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

  const [hasNewReservations, setHasNewReservations] = useState(false);
  const [hasNewContacts, setHasNewContacts] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin/reservations")) {
      Promise.resolve().then(() => {
        setHasNewReservations(false);
      });
    }
    if (pathname.startsWith("/admin/contact-messages")) {
      Promise.resolve().then(() => {
        setHasNewContacts(false);
      });
    }
  }, [pathname]);

  // Sound generator using Web Audio API
  const playNotificationSound = (type: "booking" | "contact") => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const now = ctx.currentTime;
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
      
      if (type === "booking") {
        // Dual-tone ascending chime: C5 (523.25 Hz) -> E5 (659.25 Hz)
        playTone(523.25, now, 0.3);
        playTone(659.25, now + 0.12, 0.4);
      } else {
        // Triple-tone chime: G5 (783.99 Hz) -> D5 (587.33 Hz) -> G5 (783.99 Hz)
        playTone(783.99, now, 0.15);
        playTone(587.33, now + 0.1, 0.15);
        playTone(783.99, now + 0.2, 0.3);
      }
    } catch (err) {
      console.error("Erreur de lecture sonore :", err);
    }
  };

  const toggleAudioNotifications = () => {
    const newEnabled = !audioEnabled;
    setAudioEnabled(newEnabled);
    localStorage.setItem("admin_audio_enabled", String(newEnabled));
    if (newEnabled) {
      playNotificationSound("booking");
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("admin_audio_enabled");
    if (stored === "true") {
      Promise.resolve().then(() => {
        setAudioEnabled(true);
      });
    }
  }, []);

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

        let playedBookingSound = false;
        let playedContactSound = false;

        if (resReservations.ok && dataReservations.data?.items) {
          const currentIds = dataReservations.data.items.map((item: { id: string }) => item.id);
          
          if (!isInitialRef.current) {
            const hasNew = currentIds.some((id: string) => !knownReservationIdsRef.current.has(id));
            if (hasNew) {
              playedBookingSound = true;
              if (!pathname.startsWith("/admin/reservations")) {
                setHasNewReservations(true);
              }
              window.dispatchEvent(new CustomEvent("new-reservation"));
            }
          }
          knownReservationIdsRef.current = new Set(currentIds);
        }

        if (resContacts.ok && dataContacts.data?.items) {
          const currentIds = dataContacts.data.items.map((item: { id: string }) => item.id);

          if (!isInitialRef.current) {
            const hasNew = currentIds.some((id: string) => !knownContactIdsRef.current.has(id));
            if (hasNew) {
              playedContactSound = true;
              if (!pathname.startsWith("/admin/contact-messages")) {
                setHasNewContacts(true);
              }
              window.dispatchEvent(new CustomEvent("new-contact-message"));
            }
          }
          knownContactIdsRef.current = new Set(currentIds);
        }

        if (audioEnabled) {
          if (playedBookingSound) {
            playNotificationSound("booking");
          }
          if (playedContactSound) {
            playNotificationSound("contact");
          }
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
  }  const navItems = [
    { label: "Réservations", href: "/admin/reservations" },
    { label: "Contacts", href: "/admin/contact-messages" },
    { label: "Sections", href: "/admin/categories" },
    { label: "Plats", href: "/admin/plats" },
    { label: "Réglages", href: "/admin/settings" },
  ];
 
  return (
    <div className="min-h-screen bg-[#0b0b09] text-[#f0e8d8] font-body flex flex-col">
      {/* Admin Navigation Bar */}
      <header className="bg-[#141412] border-b border-[#c9a96e]/15 sticky top-0 z-40">
        <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#c9a96e] font-body font-medium whitespace-nowrap">
              Admin
            </span>
          </div>
               <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation administration">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const showDot = 
                (item.href === "/admin/reservations" && hasNewReservations) ||
                (item.href === "/admin/contact-messages" && hasNewContacts);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 relative ${
                    active
                      ? "text-[#c9a96e] font-medium border-b border-[#c9a96e]/60 pb-1"
                      : "text-[#f0e8d8]/65 hover:text-[#f0e8d8] pb-1"
                  }`}
                >
                  <span className={showDot ? "animate-rainbow-text" : ""}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
 
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAudioNotifications}
              className={`p-2 rounded border transition-all cursor-pointer flex items-center justify-center ${
                audioEnabled
                  ? "text-[#c9a96e] border-[#c9a96e]/30 bg-[#c9a96e]/5 hover:bg-[#c9a96e]/10"
                  : "text-[#f0e8d8]/40 border-[#c9a96e]/12 hover:text-[#f0e8d8]/60 hover:border-[#c9a96e]/30"
              }`}
              title={audioEnabled ? "Désactiver les notifications sonores" : "Activer les notifications sonores"}
            >
              {audioEnabled ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zm11.95 3.182a9 9 0 000-12.728m-2.828 9.9a5 5 0 000-7.072" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              )}
            </button>
            {adminUser && (
              <span className="inline-flex px-2 py-0.5 bg-[#c9a96e]/5 text-[#c9a96e] text-[9px] uppercase tracking-wider font-semibold border border-[#c9a96e]/15 rounded-sm">
                {adminUser.displayName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-[9px] tracking-widest uppercase text-red-400 hover:text-red-300 font-semibold px-2.5 py-1.5 border border-red-500/15 hover:border-red-500/35 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer rounded-sm"
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
              const showDot = 
                (item.href === "/admin/reservations" && hasNewReservations) ||
                (item.href === "/admin/contact-messages" && hasNewContacts);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[10px] uppercase tracking-wider whitespace-nowrap transition-colors duration-200 relative ${
                    active
                      ? "text-[#c9a96e] font-semibold"
                      : "text-[#f0e8d8]/60 hover:text-[#f0e8d8]"
                  }`}
                >
                  <span className={showDot ? "animate-rainbow-text" : ""}>{item.label}</span>
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
