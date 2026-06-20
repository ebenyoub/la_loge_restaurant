import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={`${styles.section} ${styles.hero}`} aria-labelledby="home-title">
        <p className={styles.notice}>Contenu provisoire à valider avec le restaurant</p>
        <p className={styles.eyebrow}>Place des Célestins · Lyon</p>
        <h1 id="home-title">La Loge Bar &amp; Food</h1>
        <p className={styles.lead}>
          Restaurant et bar à cocktails : une première présentation de l&apos;univers de La
          Loge, à confirmer avec l&apos;équipe.
        </p>
        <p className={styles.hours}>
          <strong>Horaires du jour — à confirmer :</strong> les horaires exacts seront publiés
          après validation client.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryAction} href="/carte">
            Voir la carte
          </Link>
          <Link className={styles.secondaryAction} href="/reservation">
            Demander une réservation
          </Link>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="presentation-title">
        <p className={styles.notice}>Texte provisoire à valider</p>
        <h2 id="presentation-title">Bienvenue à La Loge</h2>
        <p>
          Située à proximité de la place des Célestins, La Loge accueille ses clients pour le
          déjeuner ou la soirée. Cette présentation, l&apos;offre exacte et les services proposés
          seront validés avant publication.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="menu-title">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.notice}>Sélection provisoire à valider</p>
            <h2 id="menu-title">Un aperçu de la carte</h2>
          </div>
          <Link href="/carte">Voir toute la carte</Link>
        </div>
        <ul className={styles.menuList}>
          <li>
            <article>
              <h3>Entrée à la carte</h3>
              <p>Description, allergènes et prix à confirmer.</p>
            </article>
          </li>
          <li>
            <article>
              <h3>Plat du moment</h3>
              <p>Description, disponibilité et prix à confirmer.</p>
            </article>
          </li>
          <li>
            <article>
              <h3>Cocktail ou boisson</h3>
              <p>Sélection et tarifs à confirmer.</p>
            </article>
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="access-title">
        <p className={styles.notice}>Informations pratiques à valider</p>
        <h2 id="access-title">Accès express</h2>
        <dl className={styles.accessList}>
          <div>
            <dt>Adresse</dt>
            <dd>Adresse exacte à confirmer, secteur place des Célestins, Lyon 2.</dd>
          </div>
          <div>
            <dt>Horaires</dt>
            <dd>Horaires réguliers et fermetures exceptionnelles à confirmer.</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>Téléphone et e-mail professionnels à confirmer.</dd>
          </div>
        </dl>
        <Link className={styles.secondaryAction} href="/contact">
          Contact &amp; accès
        </Link>
      </section>

      <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="reservation-title">
        <h2 id="reservation-title">Préparez votre venue</h2>
        <p>
          Envoyez votre demande de réservation. Elle sera traitée par La Loge avant toute
          confirmation.
        </p>
        <Link className={styles.primaryAction} href="/reservation">
          Demander une réservation
        </Link>
      </section>
    </div>
  );
}
