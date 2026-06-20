import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link className="site-footer-brand" href="/">
          La Loge Bar &amp; Food
        </Link>
        <nav aria-label="Navigation secondaire">
          <ul className="site-footer-links">
            <li>
              <Link href="/">Accueil</Link>
            </li>
            <li>
              <Link href="/carte">Carte</Link>
            </li>
            <li>
              <Link href="/reservation">Demander une réservation</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/mentions-legales">Mentions légales</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
