import Link from "next/link";
import styles from "./page.module.css";

export default function MentionsLegalesPage() {
  return (
    <div className={styles.page}>
      <section className={`${styles.introduction} ${styles.section}`} aria-labelledby="legal-title">
        <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Mentions légales</span>
        </nav>
        <p className={styles.notice}>Informations légales à valider avant publication</p>
        <h1 id="legal-title">Mentions légales</h1>
        <p className={styles.lead}>
          Cette page présente la structure des informations légales, de confidentialité et de
          cookies du site. Les données définitives seront intégrées après validation par La Loge.
        </p>
        <p className={styles.updated}>Dernière mise à jour : à valider.</p>
      </section>

      <div className={styles.contentLayout}>
        <nav className={styles.summary} aria-label="Sommaire des mentions légales">
          <p>Sommaire</p>
          <ul>
            <li><a href="#editeur">Éditeur du site</a></li>
            <li><a href="#publication">Responsable de publication</a></li>
            <li><a href="#hebergement">Hébergement</a></li>
            <li><a href="#propriete">Propriété intellectuelle</a></li>
            <li><a href="#confidentialite">Confidentialité</a></li>
            <li><a href="#cookies">Cookies</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className={styles.legalContent}>
          <section id="editeur" className={styles.legalSection} aria-labelledby="editeur-title">
            <p className={styles.notice}>À valider</p>
            <h2 id="editeur-title">Éditeur du site</h2>
            <p>
              La dénomination sociale, la forme juridique, l&apos;adresse du siège, le SIREN ou
              SIRET, le capital social le cas échéant et les coordonnées de l&apos;éditeur doivent
              être confirmés avant publication.
            </p>
          </section>

          <section id="publication" className={styles.legalSection} aria-labelledby="publication-title">
            <p className={styles.notice}>À valider</p>
            <h2 id="publication-title">Responsable de publication</h2>
            <p>
              L&apos;identité et les coordonnées du responsable de publication seront indiquées après
              validation par le restaurant.
            </p>
          </section>

          <section id="hebergement" className={styles.legalSection} aria-labelledby="hebergement-title">
            <p className={styles.notice}>À valider</p>
            <h2 id="hebergement-title">Hébergement</h2>
            <p>
              Le nom, l&apos;adresse et les coordonnées de l&apos;hébergeur seront ajoutés une fois le
              prestataire technique définitivement retenu.
            </p>
          </section>

          <section id="propriete" className={styles.legalSection} aria-labelledby="propriete-title">
            <p className={styles.notice}>À valider</p>
            <h2 id="propriete-title">Propriété intellectuelle</h2>
            <p>
              Les règles applicables aux textes, photographies, éléments graphiques et contenus
              du site seront publiées après confirmation de leurs titulaires et de leurs droits
              d&apos;utilisation.
            </p>
          </section>

          <section id="confidentialite" className={styles.legalSection} aria-labelledby="confidentialite-title">
            <p className={styles.notice}>À valider</p>
            <h2 id="confidentialite-title">Confidentialité</h2>
            <p>
              La politique de confidentialité précisera les données collectées, leur finalité,
              leur durée de conservation, les destinataires et les droits des personnes. Elle doit
              être validée avant l&apos;activation des formulaires de contact ou de réservation.
            </p>
          </section>

          <section id="cookies" className={styles.legalSection} aria-labelledby="cookies-title">
            <p className={styles.notice}>À valider</p>
            <h2 id="cookies-title">Cookies</h2>
            <p>
              La politique relative aux cookies et, si nécessaire, le mécanisme de consentement
              seront définis avant l&apos;ajout de services nécessitant un dépôt ou une lecture de
              cookies non essentiels.
            </p>
          </section>

          <section id="contact" className={styles.legalSection} aria-labelledby="contact-title">
            <p className={styles.notice}>À valider</p>
            <h2 id="contact-title">Contact</h2>
            <p>
              L&apos;adresse e-mail légale et les modalités de contact de l&apos;éditeur doivent être
              confirmées. Les informations pratiques du restaurant sont présentées sur la page
              Contact &amp; accès après validation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
