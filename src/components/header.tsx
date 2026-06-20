import Link from "next/link";

export function Header() {
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

      <nav className="mobile-action-bar" aria-label="Actions mobiles">
        <Link href="/reservation">Demander une réservation</Link>
        <a
          href="tel:+33685402637"
          aria-label="Appeler le restaurant — numéro provisoire à confirmer"
        >
          Appeler
        </a>
      </nav>
    </header>
  );
}
