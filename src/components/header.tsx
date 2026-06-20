"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const showMobileActionBar = ["/", "/carte", "/reservation", "/contact"].includes(
    pathname,
  );

  return (
    <header className="site-header">
      <nav className="site-navigation desktop-navigation" aria-label="Navigation principale">
        <Link className="site-brand" href="/">
          <span>La Loge</span>
          <span>Bar &amp; Food</span>
        </Link>
        <ul className="site-navigation-links">
          <li>
            <Link href="/carte">Carte</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <Link className="site-reservation-action" href="/reservation">
          Demander une réservation
        </Link>
      </nav>

      <nav className="site-navigation mobile-navigation" aria-label="Navigation principale mobile">
        <Link className="site-brand" href="/">
          <span>La Loge</span>
          <span>Bar &amp; Food</span>
        </Link>
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
          <Link className="site-reservation-action" href="/reservation">
            Demander une réservation
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
