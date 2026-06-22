import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Lazy-loaded transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }
  return transporter;
}

/**
 * Generic email sending helper that catches and logs errors silently
 */
async function sendMailSafe(options: nodemailer.SendMailOptions): Promise<boolean> {
  // If credentials are not set, log warning and skip
  if (!env.smtpUser || !env.smtpPass) {
    console.warn(
      `[Mail Service] E-mail non envoyé (SMTP_USER ou SMTP_PASS manquant). Sujet: "${options.subject}"`
    );
    return false;
  }

  try {
    const info = await getTransporter().sendMail({
      from: env.emailFrom,
      ...options,
    });
    console.log(`[Mail Service] E-mail envoyé avec succès. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Mail Service Error] Échec de l'envoi d'e-mail:`, error);
    return false;
  }
}

// ----------------------------------------------------
// Reservations
// ----------------------------------------------------

export function sendReservationNotificationToManager(res: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  requestedDate: string | Date;
  requestedTime: string;
  guestCount: number;
  occasion?: string | null;
  message?: string | null;
}) {
  const formattedDate = res.requestedDate instanceof Date 
    ? res.requestedDate.toLocaleDateString("fr-FR")
    : String(res.requestedDate);

  const html = `
    <h2>Nouvelle Demande de Réservation</h2>
    <p>Une nouvelle demande de réservation a été déposée sur le site internet :</p>
    <ul>
      <li><strong>Client :</strong> ${res.firstName} ${res.lastName}</li>
      <li><strong>Téléphone :</strong> ${res.phone}</li>
      <li><strong>E-mail :</strong> ${res.email}</li>
      <li><strong>Date &amp; Heure :</strong> Le ${formattedDate} à ${res.requestedTime}</li>
      <li><strong>Nombre de couverts :</strong> ${res.guestCount} personnes</li>
      ${res.occasion ? `<li><strong>Occasion :</strong> ${res.occasion}</li>` : ""}
      ${res.message ? `<li><strong>Message client :</strong> ${res.message}</li>` : ""}
    </ul>
    <p>Rendez-vous dans votre espace d'administration pour traiter cette demande.</p>
  `;

  // Asynchronous call (does not await)
  sendMailSafe({
    to: env.restaurantNotificationEmail,
    subject: `[Nouvelle Réservation] ${res.firstName} ${res.lastName} - ${res.guestCount} pers.`,
    html,
    text: `Nouvelle demande de réservation pour ${res.firstName} ${res.lastName} le ${formattedDate} à ${res.requestedTime} (${res.guestCount} personnes).`,
  });
}

export function sendReservationConfirmationToClient(res: {
  firstName: string;
  lastName: string;
  email: string;
  requestedDate: string | Date;
  requestedTime: string;
  guestCount: number;
}) {
  const formattedDate = res.requestedDate instanceof Date 
    ? res.requestedDate.toLocaleDateString("fr-FR")
    : String(res.requestedDate);

  const html = `
    <h2>Bonjour ${res.firstName},</h2>
    <p>Nous avons bien reçu votre demande de réservation pour <strong>${res.guestCount} personnes</strong> le <strong>${formattedDate} à ${res.requestedTime}</strong>.</p>
    <p style="color: #d4af37; font-weight: bold; font-size: 1.1rem;">
      Important : Cette demande est en cours de traitement et ne constitue pas une réservation confirmée.
    </p>
    <p>Notre équipe va vérifier nos disponibilités et vous enverra un e-mail de confirmation très rapidement.</p>
    <p>À bientôt,<br/>L'équipe de La Loge Bar &amp; Food</p>
  `;

  sendMailSafe({
    to: res.email,
    subject: `Votre demande de réservation - La Loge Bar & Food`,
    html,
    text: `Bonjour ${res.firstName}, nous avons bien reçu votre demande de réservation pour ${res.guestCount} personnes le ${formattedDate} à ${res.requestedTime}. Attention, celle-ci est en attente de confirmation. L'équipe de La Loge.`,
  });
}

export function sendReservationStatusEmail(res: {
  firstName: string;
  lastName: string;
  email: string;
  requestedDate: string | Date;
  requestedTime: string;
  guestCount: number;
  status: string;
}) {
  if (!res.email || !res.firstName) {
    console.warn("[Mail Service] Données de réservation insuffisantes pour envoyer l'email de changement de statut.");
    return;
  }

  const formattedDate = res.requestedDate instanceof Date 
    ? res.requestedDate.toLocaleDateString("fr-FR")
    : String(res.requestedDate);

  let subject = "";
  let html = "";
  let text = "";

  if (res.status === "confirmee") {
    subject = "Votre réservation est confirmée - La Loge Bar & Food";
    html = `
      <h2>Bonjour ${res.firstName},</h2>
      <p>Nous avons le plaisir de vous confirmer votre réservation pour <strong>${res.guestCount} personnes</strong> le <strong>${formattedDate} à ${res.requestedTime}</strong>.</p>
      <p>Nous nous réjouissons de vous accueillir prochainement.</p>
      <p>À très bientôt,<br/>L'équipe de La Loge Bar &amp; Food</p>
    `;
    text = `Bonjour ${res.firstName}, nous avons le plaisir de vous confirmer votre réservation pour ${res.guestCount} personnes le ${formattedDate} à ${res.requestedTime}. À bientôt, l'équipe de La Loge.`;
  } else if (res.status === "refusee") {
    subject = "Votre demande de réservation - La Loge Bar & Food";
    html = `
      <h2>Bonjour ${res.firstName},</h2>
      <p>Nous faisons suite à votre demande de réservation pour ${res.guestCount} personnes le ${formattedDate} à ${res.requestedTime}.</p>
      <p>Malheureusement, nous ne sommes pas en mesure de répondre favorablement à votre demande pour ce créneau spécifique.</p>
      <p>Nous espérons avoir le plaisir de vous accueillir à une autre occasion.</p>
      <p>Cordialement,<br/>L'équipe de La Loge Bar &amp; Food</p>
    `;
    text = `Bonjour ${res.firstName}, concernant votre demande de réservation pour ${res.guestCount} personnes le ${formattedDate} à ${res.requestedTime}, nous sommes au regret de ne pouvoir y répondre favorablement. L'équipe de La Loge.`;
  } else if (res.status === "annulee") {
    subject = "Annulation de votre réservation - La Loge Bar & Food";
    html = `
      <h2>Bonjour ${res.firstName},</h2>
      <p>Nous vous informons que votre réservation pour <strong>${res.guestCount} personnes</strong> le <strong>${formattedDate} à ${res.requestedTime}</strong> a bien été annulée.</p>
      <p>Si vous souhaitez réserver pour une autre date, n'hésitez pas à déposer une nouvelle demande sur notre site.</p>
      <p>À bientôt,<br/>L'équipe de La Loge Bar &amp; Food</p>
    `;
    text = `Bonjour ${res.firstName}, votre réservation pour ${res.guestCount} personnes le ${formattedDate} à ${res.requestedTime} a bien été annulée. L'équipe de La Loge.`;
  } else if (res.status === "en_attente") {
    subject = "Mise en attente de votre demande de réservation - La Loge Bar & Food";
    html = `
      <h2>Bonjour ${res.firstName},</h2>
      <p>Votre demande de réservation pour <strong>${res.guestCount} personnes</strong> le <strong>${formattedDate} à ${res.requestedTime}</strong> est actuellement en attente de traitement.</p>
      <p>Nous étudions nos disponibilités et vous contacterons rapidement pour vous confirmer ou non la table.</p>
      <p>À bientôt,<br/>L'équipe de La Loge Bar &amp; Food</p>
    `;
    text = `Bonjour ${res.firstName}, votre demande de réservation pour ${res.guestCount} personnes le ${formattedDate} à ${res.requestedTime} est actuellement en cours de traitement. L'équipe de La Loge.`;
  } else {
    // Ne rien faire pour les autres statuts (ex: "nouvelle")
    return;
  }

  // Envoi asynchrone sécurisé (ne bloque pas le thread principal)
  sendMailSafe({
    to: res.email,
    subject,
    html,
    text,
  });
}

// ----------------------------------------------------
// Contact Messages
// ----------------------------------------------------

export function sendContactNotificationToManager(msg: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}) {
  const html = `
    <h2>Nouveau Message de Contact</h2>
    <p>Un message a été envoyé via le formulaire de contact du site internet :</p>
    <ul>
      <li><strong>Expéditeur :</strong> ${msg.name}</li>
      <li><strong>E-mail :</strong> ${msg.email}</li>
      ${msg.phone ? `<li><strong>Téléphone :</strong> ${msg.phone}</li>` : ""}
      <li><strong>Sujet :</strong> ${msg.subject}</li>
    </ul>
    <p><strong>Contenu du message :</strong></p>
    <p style="background-color: #f6f8fa; padding: 1rem; border-left: 4px solid #d4af37; font-style: italic;">
      ${msg.message.replace(/\n/g, "<br/>")}
    </p>
  `;

  sendMailSafe({
    to: env.restaurantNotificationEmail,
    subject: `[Nouveau Contact] ${msg.subject} - par ${msg.name}`,
    html,
    text: `Nouveau message de contact de ${msg.name} (${msg.email}) : ${msg.subject}\n\n${msg.message}`,
  });
}

export function sendContactConfirmationToClient(msg: {
  name: string;
  email: string;
  subject: string;
}) {
  const html = `
    <h2>Bonjour ${msg.name},</h2>
    <p>Merci de nous avoir contactés. Nous avons bien reçu votre message concernant le sujet : <strong>"${msg.subject}"</strong>.</p>
    <p>Notre équipe va en prendre connaissance et vous répondra dans les meilleurs délais.</p>
    <p>Cordialement,<br/>L'équipe de La Loge Bar &amp; Food</p>
  `;

  sendMailSafe({
    to: msg.email,
    subject: `Accusé de réception de votre message - La Loge Bar & Food`,
    html,
    text: `Bonjour ${msg.name}, nous avons bien reçu votre message concernant "${msg.subject}". Notre équipe vous répondra rapidement. L'équipe de La Loge.`,
  });
}

export async function sendContactReplyToClient(msg: {
  name: string;
  email: string;
  subject: string;
  replyMessage: string;
}): Promise<boolean> {
  const html = `
    <h2>Bonjour ${msg.name},</h2>
    <p>Nous faisons suite à votre message concernant : <strong>"${msg.subject}"</strong>.</p>
    <div style="background-color: #f6f8fa; padding: 1rem; border-left: 4px solid #d4af37; white-space: pre-wrap; margin: 1.5rem 0;">${msg.replyMessage}</div>
    <p>Cordialement,<br/>L'équipe de La Loge Bar &amp; Food</p>
  `;

  return sendMailSafe({
    to: msg.email,
    subject: `Re: ${msg.subject}`,
    html,
    text: `Bonjour ${msg.name},\n\nNous faisons suite à votre message concernant "${msg.subject}" :\n\n${msg.replyMessage}\n\nCordialement,\nL'équipe de La Loge Bar & Food`,
  });
}

