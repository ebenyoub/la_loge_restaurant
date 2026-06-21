"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ displayName: string; role: string } | null>(null);

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
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display italic text-lg text-[#f0e8d8] tracking-wide">
              La Loge <span className="text-xs uppercase tracking-widest text-[#c9a96e] not-italic font-sans ml-2">Admin</span>
            </span>
            {adminUser && (
              <span className="hidden sm:inline px-2.5 py-0.5 bg-[#c9a96e]/10 text-[#c9a96e] text-[10px] uppercase tracking-wider font-semibold border border-[#c9a96e]/20 rounded-full">
                {adminUser.displayName} ({adminUser.role})
              </span>
            )}
          </div>
          
          <nav className="hidden md:flex items-center gap-6" aria-label="Navigation administration">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs uppercase tracking-wider transition-colors duration-200 ${
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

          <button
            onClick={handleLogout}
            className="text-[11px] tracking-wider uppercase text-red-400 hover:text-red-300 font-semibold px-4 py-2 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer animate-none"
          >
            Déconnexion
          </button>
        </div>

        {/* Mobile Subnav */}
        <div className="md:hidden border-t border-[#c9a96e]/10 flex items-center overflow-x-auto scrollbar-none py-3 px-6 gap-6 bg-[#141412]">
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
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
