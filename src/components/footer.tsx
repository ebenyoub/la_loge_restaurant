import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <nav aria-label="Navigation secondaire">
        <ul>
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
    </footer>
  );
}
