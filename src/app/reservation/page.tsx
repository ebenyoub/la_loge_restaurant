import Link from "next/link";
import styles from "./page.module.css";

export default function ReservationPage() {
  return (
    <div className={styles.page}>
      <section className={`${styles.section} ${styles.introduction}`} aria-labelledby="reservation-title">
        <p className={styles.notice}>Contenu provisoire à valider avec le restaurant</p>
        <p className={styles.eyebrow}>La Loge Bar &amp; Food · Lyon</p>
        <h1 id="reservation-title">Demandez votre réservation</h1>
        <p className={styles.lead}>
          Indiquez les informations utiles à votre venue. La Loge traite ensuite chaque demande
          avant de confirmer une table.
        </p>
        <p className={styles.confirmationNotice}>
          <strong>Important :</strong> votre demande de réservation reste en attente de
          confirmation par le restaurant.
        </p>
      </section>

      <section className={`${styles.section} ${styles.formSection}`} aria-labelledby="form-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.notice}>Formulaire visuel statique</p>
            <h2 id="form-title">Votre demande</h2>
          </div>
          <p id="form-static-note" className={styles.staticMessage}>
            Cette maquette ne transmet aucune information. L&apos;envoi sera activé avec le
            traitement de réservation du MVP.
          </p>
        </div>

        <form aria-describedby="form-static-note">
          <fieldset className={styles.formFields} disabled>
            <fieldset className={styles.fieldGroup}>
              <legend>Vos coordonnées</legend>
              <div className={styles.fieldGrid}>
                <p className={styles.field}>
                  <label htmlFor="last-name">Nom *</label>
                  <input id="last-name" name="last-name" type="text" autoComplete="family-name" />
                </p>
                <p className={styles.field}>
                  <label htmlFor="first-name">Prénom *</label>
                  <input id="first-name" name="first-name" type="text" autoComplete="given-name" />
                </p>
                <p className={styles.field}>
                  <label htmlFor="phone">Téléphone *</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" />
                </p>
                <p className={styles.field}>
                  <label htmlFor="email">E-mail *</label>
                  <input id="email" name="email" type="email" autoComplete="email" />
                </p>
              </div>
            </fieldset>

            <fieldset className={styles.fieldGroup}>
              <legend>Votre demande</legend>
              <div className={styles.fieldGrid}>
                <p className={styles.field}>
                  <label htmlFor="date">Date souhaitée *</label>
                  <input id="date" name="date" type="date" />
                </p>
                <p className={styles.field}>
                  <label htmlFor="time">Heure souhaitée *</label>
                  <input id="time" name="time" type="time" />
                </p>
                <p className={styles.field}>
                  <label htmlFor="guests">Nombre de personnes *</label>
                  <input id="guests" name="guests" type="number" min="1" inputMode="numeric" />
                </p>
                <p className={styles.field}>
                  <label htmlFor="occasion">Occasion spéciale <span>(facultatif)</span></label>
                  <select id="occasion" name="occasion" defaultValue="">
                    <option value="">Choisir une occasion</option>
                    <option value="anniversaire">Anniversaire</option>
                    <option value="repas-pro">Repas professionnel</option>
                    <option value="groupe">Groupe</option>
                    <option value="autre">Autre</option>
                  </select>
                </p>
              </div>
              <p className={styles.field}>
                <label htmlFor="message">Message <span>(facultatif)</span></label>
                <textarea id="message" name="message" rows={5} />
              </p>
              <p className={styles.consent}>
                <input id="consent" name="consent" type="checkbox" />
                <label htmlFor="consent">
                  J&apos;accepte que mes informations soient utilisées pour traiter ma demande de
                  réservation. <span>*</span>
                </label>
              </p>
            </fieldset>

            <button className={styles.submitAction} type="button">
              Envoyer ma demande de réservation
            </button>
          </fieldset>
        </form>
      </section>

      <section className={`${styles.section} ${styles.urgentSection}`} aria-labelledby="urgent-title">
        <p className={styles.notice}>Informations et coordonnées à valider</p>
        <h2 id="urgent-title">Besoin urgent ?</h2>
        <p>
          Pour une demande de dernière minute, contactez directement le restaurant. Les
          coordonnées de contact seront publiées après validation par La Loge.
        </p>
        <Link className={styles.secondaryAction} href="/contact">
          Contact &amp; accès
        </Link>
      </section>

      <section className={styles.section} aria-labelledby="information-title">
        <p className={styles.notice}>Informations provisoires à valider</p>
        <h2 id="information-title">Informations utiles</h2>
        <dl className={styles.informationList}>
          <div>
            <dt>Confirmation</dt>
            <dd>Aucune table n&apos;est confirmée immédiatement après l&apos;envoi d&apos;une demande.</dd>
          </div>
          <div>
            <dt>Délai de réponse</dt>
            <dd>Le délai de traitement sera précisé par le restaurant avant publication.</dd>
          </div>
          <div>
            <dt>Annulation</dt>
            <dd>Les conditions d&apos;annulation et de modification restent à confirmer.</dd>
          </div>
          <div>
            <dt>Accès</dt>
            <dd>L&apos;adresse, les horaires et les indications pratiques sont à valider.</dd>
          </div>
        </dl>
      </section>

      <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="contact-title">
        <h2 id="contact-title">Une question avant votre demande ?</h2>
        <p>Consultez les informations de contact et d&apos;accès de La Loge.</p>
        <Link className={styles.secondaryAction} href="/contact">
          Contact &amp; accès
        </Link>
      </section>
    </div>
  );
}
