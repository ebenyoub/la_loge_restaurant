"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const showMobileActionBar = ["/", "/carte", "/reservation", "/contact"].includes(
    pathname,
  );

  return (
    <header>
      <nav className="desktop-navigation" aria-label="Navigation principale">
        <Link href="/">La Loge Bar &amp; Food</Link>
        <ul>
          <li>
            <Link href="/carte">Carte</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <Link href="/reservation">Demander une réservation</Link>
      </nav>

      <nav className="mobile-navigation" aria-label="Navigation principale mobile">
        <Link href="/">La Loge Bar &amp; Food</Link>
        <details>
          <summary>Menu</summary>
          <ul>
            <li>
              <Link href="/carte">Carte</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </details>
      </nav>

      {showMobileActionBar ? (
        <nav className="mobile-action-bar" aria-label="Actions mobiles">
          <Link href="/reservation">Demander une réservation</Link>
        </nav>
      ) : null}
    </header>
  );
}
