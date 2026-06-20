import Link from "next/link";
import styles from "./page.module.css";

export default function CartePage() {
  return (
    <div className={styles.page}>
      <section className={`${styles.section} ${styles.introduction}`} aria-labelledby="menu-title">
        <p className={styles.notice}>Contenu provisoire à valider avec le restaurant</p>
        <p className={styles.eyebrow}>La Loge Bar &amp; Food · Lyon</p>
        <h1 id="menu-title">Carte &amp; menus</h1>
        <p className={styles.lead}>
          Cette première carte présente une structure de consultation. Les plats, descriptions,
          prix, disponibilités et formules seront confirmés avant publication.
        </p>
        <p className={styles.updated}>Dernière mise à jour : à confirmer.</p>
      </section>

      <nav className={styles.categoryNavigation} aria-label="Catégories de la carte">
        <a href="#entrees">Entrées</a>
        <a href="#plats">Plats</a>
        <a href="#desserts">Desserts</a>
        <a href="#boissons">Boissons</a>
      </nav>

      <section className={styles.section} id="entrees" aria-labelledby="entrees-title">
        <p className={styles.notice}>Catégorie et contenus à valider</p>
        <h2 id="entrees-title">Entrées</h2>
        <ul className={styles.itemList}>
          <li>
            <article>
              <h3>Entrée de saison</h3>
              <p>Description, allergènes et prix à confirmer.</p>
            </article>
          </li>
          <li>
            <article>
              <h3>Suggestion du moment</h3>
              <p>Disponibilité, allergènes et prix à confirmer.</p>
            </article>
          </li>
        </ul>
      </section>

      <section className={styles.section} id="plats" aria-labelledby="plats-title">
        <p className={styles.notice}>Catégorie et contenus à valider</p>
        <h2 id="plats-title">Plats</h2>
        <ul className={styles.itemList}>
          <li>
            <article>
              <h3>Plat signature</h3>
              <p>Description, garniture, allergènes et prix à confirmer.</p>
            </article>
          </li>
          <li>
            <article>
              <h3>Plat du moment</h3>
              <p>Disponibilité, description et prix à confirmer.</p>
            </article>
          </li>
        </ul>
      </section>

      <section className={styles.section} id="desserts" aria-labelledby="desserts-title">
        <p className={styles.notice}>Catégorie et contenus à valider</p>
        <h2 id="desserts-title">Desserts</h2>
        <ul className={styles.itemList}>
          <li>
            <article>
              <h3>Dessert à la carte</h3>
              <p>Description, allergènes et prix à confirmer.</p>
            </article>
          </li>
        </ul>
      </section>

      <section className={styles.section} id="boissons" aria-labelledby="boissons-title">
        <p className={styles.notice}>Catégorie et contenus à valider</p>
        <h2 id="boissons-title">Boissons</h2>
        <ul className={styles.itemList}>
          <li>
            <article>
              <h3>Boisson ou cocktail</h3>
              <p>Sélection, disponibilité et tarifs à confirmer.</p>
            </article>
          </li>
        </ul>
      </section>

      <section className={`${styles.section} ${styles.allergenSection}`} aria-labelledby="allergenes-title">
        <p className={styles.notice}>Information provisoire à valider</p>
        <h2 id="allergenes-title">Allergènes et informations</h2>
        <p>
          La liste des allergènes et les informations de régimes alimentaires doivent être
          confirmées avec le restaurant. Pour toute question, contactez directement La Loge avant
          votre venue.
        </p>
        <Link className={styles.secondaryAction} href="/contact">
          Nous contacter
        </Link>
      </section>

      <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="reservation-title">
        <h2 id="reservation-title">Une table vous intéresse ?</h2>
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
