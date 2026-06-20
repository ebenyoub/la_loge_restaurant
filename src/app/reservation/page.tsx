"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface FormErrors {
  global?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  requestedDate?: string;
  requestedTime?: string;
  guestCount?: string;
  occasion?: string;
  message?: string;
  consent?: string;
}

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    requestedDate: "",
    requestedTime: "",
    guestCount: 1,
    occasion: "",
    message: "",
    consent: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
    // Clear validation error on field change
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

    // Frontend validation checklist before sending
    const fieldsErrors: FormErrors = {};
    if (!formData.firstName.trim()) fieldsErrors.firstName = "Le prénom est requis.";
    if (!formData.lastName.trim()) fieldsErrors.lastName = "Le nom est requis.";
    if (!formData.phone.trim()) fieldsErrors.phone = "Le numéro de téléphone est requis.";
    if (!formData.email.trim()) fieldsErrors.email = "L'adresse e-mail est requise.";
    if (!formData.requestedDate) fieldsErrors.requestedDate = "La date est requise.";
    if (!formData.requestedTime) fieldsErrors.requestedTime = "L'heure est requise.";
    if (!formData.consent) fieldsErrors.consent = "Votre consentement est requis.";

    if (Object.keys(fieldsErrors).length > 0) {
      setErrors(fieldsErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Map occasion from dash to underscore format required by backend Prisma enum
      const occasionMapped = formData.occasion === "repas-pro" ? "repas_pro" : formData.occasion || null;

      const response = await fetch("/api/v1/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          requestedDate: formData.requestedDate,
          requestedTime: formData.requestedTime,
          guestCount: Number(formData.guestCount),
          occasion: occasionMapped,
          message: formData.message || null,
          consent: formData.consent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error && result.error.code === "VALIDATION_ERROR" && result.error.fields) {
          setErrors(result.error.fields);
        } else {
          setErrors({
            global: result.error?.message || "Une erreur est survenue lors de l'envoi de votre demande.",
          });
        }
      } else {
        setSuccessMessage(result.data.message || "Votre demande de réservation a bien été envoyée !");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          requestedDate: "",
          requestedTime: "",
          guestCount: 1,
          occasion: "",
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
            <h2 id="form-title">Votre demande</h2>
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
            <fieldset className={styles.fieldGroup}>
              <legend>Vos coordonnées</legend>
              <div className={styles.fieldGrid}>
                <p className={styles.field}>
                  <label htmlFor="lastName">Nom *</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.lastName}</span>}
                </p>
                <p className={styles.field}>
                  <label htmlFor="firstName">Prénom *</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.firstName}</span>}
                </p>
                <p className={styles.field}>
                  <label htmlFor="phone">Téléphone *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.phone}</span>}
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
              </div>
            </fieldset>

            <fieldset className={styles.fieldGroup}>
              <legend>Votre demande</legend>
              <div className={styles.fieldGrid}>
                <p className={styles.field}>
                  <label htmlFor="requestedDate">Date souhaitée *</label>
                  <input
                    id="requestedDate"
                    name="requestedDate"
                    type="date"
                    value={formData.requestedDate}
                    onChange={handleChange}
                    required
                  />
                  {errors.requestedDate && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.requestedDate}</span>}
                </p>
                <p className={styles.field}>
                  <label htmlFor="requestedTime">Heure souhaitée *</label>
                  <input
                    id="requestedTime"
                    name="requestedTime"
                    type="time"
                    value={formData.requestedTime}
                    onChange={handleChange}
                    required
                  />
                  {errors.requestedTime && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.requestedTime}</span>}
                </p>
                <p className={styles.field}>
                  <label htmlFor="guestCount">Nombre de personnes *</label>
                  <input
                    id="guestCount"
                    name="guestCount"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={formData.guestCount}
                    onChange={handleChange}
                    required
                  />
                  {errors.guestCount && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.guestCount}</span>}
                </p>
                <p className={styles.field}>
                  <label htmlFor="occasion">Occasion spéciale <span>(facultatif)</span></label>
                  <select
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                  >
                    <option value="">Choisir une occasion</option>
                    <option value="anniversaire">Anniversaire</option>
                    <option value="repas-pro">Repas professionnel</option>
                    <option value="groupe">Groupe</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errors.occasion && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.occasion}</span>}
                </p>
              </div>
              <p className={styles.field}>
                <label htmlFor="message">Message <span>(facultatif)</span></label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
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
                  J&apos;accepte que mes informations soient utilisées pour traiter ma demande de
                  réservation. <span>*</span>
                </label>
                {errors.consent && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>{errors.consent}</span>}
              </p>
            </fieldset>

            <button className={styles.submitAction} type="submit" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer ma demande de réservation"}
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
