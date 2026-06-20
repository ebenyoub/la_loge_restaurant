import Link from "next/link";
import styles from "./page.module.css";

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <section className={`${styles.section} ${styles.introduction}`} aria-labelledby="contact-title">
        <p className={styles.notice}>Informations provisoires à valider avec le restaurant</p>
        <p className={styles.eyebrow}>La Loge Bar &amp; Food · Lyon</p>
        <h1 id="contact-title">Contact &amp; accès</h1>
        <p className={styles.lead}>
          Retrouvez ici les informations pratiques pour contacter La Loge et préparer votre venue.
          Les coordonnées définitives seront publiées après validation par le restaurant.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="direct-contact-title">
        <p className={styles.notice}>Coordonnées à valider</p>
        <h2 id="direct-contact-title">Contacts immédiats</h2>
        <dl className={styles.contactList}>
          <div>
            <dt>Adresse</dt>
            <dd>Adresse exacte à confirmer, secteur place des Célestins, Lyon.</dd>
            <span className={styles.unavailableAction}>Itinéraire disponible après validation</span>
          </div>
          <div>
            <dt>Téléphone</dt>
            <dd>Numéro professionnel à confirmer.</dd>
            <span className={styles.unavailableAction}>Appel disponible après validation</span>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>Adresse e-mail professionnelle à confirmer.</dd>
            <span className={styles.unavailableAction}>Écriture disponible après validation</span>
          </div>
        </dl>
      </section>

      <section className={`${styles.section} ${styles.hoursSection}`} aria-labelledby="hours-title">
        <p className={styles.notice}>Horaires provisoires à valider</p>
        <h2 id="hours-title">Horaires</h2>
        <dl className={styles.hoursList}>
          <div>
            <dt>Lundi</dt>
            <dd>Horaires à confirmer</dd>
          </div>
          <div>
            <dt>Mardi</dt>
            <dd>Horaires à confirmer</dd>
          </div>
          <div>
            <dt>Mercredi</dt>
            <dd>Horaires à confirmer</dd>
          </div>
          <div>
            <dt>Jeudi</dt>
            <dd>Horaires à confirmer</dd>
          </div>
          <div>
            <dt>Vendredi</dt>
            <dd>Horaires à confirmer</dd>
          </div>
          <div>
            <dt>Samedi</dt>
            <dd>Horaires à confirmer</dd>
          </div>
          <div>
            <dt>Dimanche</dt>
            <dd>Horaires à confirmer</dd>
          </div>
        </dl>
        <p className={styles.helpText}>
          Les fermetures exceptionnelles et les horaires de service seront ajoutés après
          validation.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="access-title">
        <p className={styles.notice}>Plan et itinéraire à valider</p>
        <h2 id="access-title">Venir à La Loge</h2>
        <div className={styles.mapPlaceholder} aria-label="Emplacement de la carte à venir">
          <p>Carte et itinéraire Google Maps à intégrer après validation de l&apos;adresse exacte.</p>
        </div>
        <p className={styles.helpText}>
          Les indications d&apos;accès, de transports et de stationnement sont à confirmer avec le
          restaurant.
        </p>
      </section>

      <section className={`${styles.section} ${styles.formSection}`} aria-labelledby="form-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.notice}>Formulaire visuel statique</p>
            <h2 id="form-title">Envoyer un message</h2>
          </div>
          <p id="form-static-note" className={styles.staticMessage}>
            Cette maquette ne transmet aucune information. L&apos;envoi sera activé avec le
            traitement des demandes de contact du MVP.
          </p>
        </div>

        <form aria-describedby="form-static-note">
          <fieldset className={styles.formFields} disabled>
            <div className={styles.fieldGrid}>
              <p className={styles.field}>
                <label htmlFor="name">Nom *</label>
                <input id="name" name="name" type="text" autoComplete="name" />
              </p>
              <p className={styles.field}>
                <label htmlFor="email">E-mail *</label>
                <input id="email" name="email" type="email" autoComplete="email" />
              </p>
              <p className={styles.field}>
                <label htmlFor="phone">Téléphone <span>(facultatif)</span></label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" />
              </p>
              <p className={styles.field}>
                <label htmlFor="subject">Objet *</label>
                <input id="subject" name="subject" type="text" />
              </p>
            </div>
            <p className={styles.field}>
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" rows={6} />
            </p>
            <p className={styles.consent}>
              <input id="consent" name="consent" type="checkbox" />
              <label htmlFor="consent">
                J&apos;accepte que mes informations soient utilisées pour traiter mon message.{' '}
                <span>*</span>
              </label>
            </p>
            <button className={styles.submitAction} type="button">
              Envoyer le message
            </button>
          </fieldset>
        </form>
      </section>

      <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="reservation-title">
        <h2 id="reservation-title">Vous souhaitez réserver une table ?</h2>
        <p>Adressez une demande complète à La Loge. Elle reste en attente de confirmation.</p>
        <Link className={styles.primaryAction} href="/reservation">
          Demander une réservation
        </Link>
      </section>
    </div>
  );
}
