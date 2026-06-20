"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./layout.module.css";

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
      <div className={styles.loadingContainer}>
        <p>Vérification des droits d&apos;accès...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      <header className={styles.adminHeader}>
        <div className={styles.navContainer}>
          <div className={styles.brandGroup}>
            <span className={styles.brandName}>La Loge - Admin</span>
            {adminUser && (
              <span className={styles.badge}>
                {adminUser.displayName} ({adminUser.role})
              </span>
            )}
          </div>
          <nav className={styles.navLinks}>
            <Link href="/admin/reservations">Réservations</Link>
            <Link href="/admin/contact-messages">Contacts</Link>
            <Link href="/admin/categories">Catégories</Link>
            <Link href="/admin/plats">Plats</Link>
            <Link href="/admin/settings">Réglages</Link>
          </nav>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Déconnexion
          </button>
        </div>
      </header>
      <main className={styles.adminMain}>{children}</main>
    </div>
  );
}
