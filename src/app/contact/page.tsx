"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface FormErrors {
  global?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  consent?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null);

    const fieldsErrors: FormErrors = {};
    if (!formData.name.trim()) fieldsErrors.name = "Le nom est requis.";
    if (!formData.email.trim()) fieldsErrors.email = "L'adresse e-mail est requise.";
    if (!formData.subject.trim()) fieldsErrors.subject = "L'objet est requis.";
    if (!formData.message.trim()) fieldsErrors.message = "Le message est requis.";
    if (!formData.consent) fieldsErrors.consent = "Votre consentement est requis.";

    if (Object.keys(fieldsErrors).length > 0) {
      setErrors(fieldsErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/v1/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          consent: formData.consent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error && result.error.code === "VALIDATION_ERROR" && result.error.fields) {
          setErrors(result.error.fields);
        } else {
          setErrors({
            global: result.error?.message || "Une erreur est survenue lors de l'envoi de votre message.",
          });
        }
      } else {
        setSuccessMessage(result.data.message || "Votre message a bien été envoyé !");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          consent: false,
        });
      }
    } catch {
      setErrors({
        global: "Impossible de joindre le serveur. Veuillez vérifier votre connexion.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <h2 id="form-title">Envoyer un message</h2>
          </div>
        </div>

        {successMessage && (
          <div className={styles.successBlock} style={{ padding: "1rem", margin: "1rem 0", backgroundColor: "rgba(16, 185, 129, 0.1)", borderLeft: "4px solid #10b981", color: "#10b981", borderRadius: "4px" }}>
            <p>{successMessage}</p>
          </div>
        )}

        {errors.global && (
          <div className={styles.errorBlock} style={{ padding: "1rem", margin: "1rem 0", backgroundColor: "rgba(239, 68, 68, 0.1)", borderLeft: "4px solid #ef4444", color: "#ef4444", borderRadius: "4px" }}>
            <p>{errors.global}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <fieldset className={styles.formFields} disabled={isLoading}>
            <div className={styles.fieldGrid}>
              <p className={styles.field}>
                <label htmlFor="name">Nom *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.name}</span>}
              </p>
              <p className={styles.field}>
                <label htmlFor="email">E-mail *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.email}</span>}
              </p>
              <p className={styles.field}>
                <label htmlFor="phone">Téléphone <span>(facultatif)</span></label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.phone}</span>}
              </p>
              <p className={styles.field}>
                <label htmlFor="subject">Objet *</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                {errors.subject && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.subject}</span>}
              </p>
            </div>
            <p className={styles.field}>
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              />
              {errors.message && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.message}</span>}
            </p>
            <p className={styles.consent}>
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={formData.consent}
                onChange={handleChange}
                required
              />
              <label htmlFor="consent">
                J&apos;accepte que mes informations soient utilisées pour traiter mon message.{" "}
                <span>*</span>
              </label>
              {errors.consent && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.consent}</span>}
            </p>
            <button className={styles.submitAction} type="submit" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer le message"}
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
