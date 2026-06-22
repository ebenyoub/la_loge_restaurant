import { describe, it, expect, vi, beforeEach } from "vitest";
import { env } from "../config/env.js";
import {
  sendReservationNotificationToManager,
  sendReservationConfirmationToClient,
  sendContactNotificationToManager,
  sendContactConfirmationToClient,
  sendContactReplyToClient,
} from "../services/mail.service.js";

const mockSendMail = vi.fn();

vi.mock("nodemailer", () => {
  const mockTransporter = {
    sendMail: (options: any) => mockSendMail(options),
  };
  return {
    default: {
      createTransport: vi.fn(() => mockTransporter),
    },
  };
});

describe("Mail Service Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSendMail.mockReset();

    // Default configuration for tests
    env.smtpUser = "test-user";
    env.smtpPass = "test-pass";
    env.emailFrom = "no-reply@laloge.fr";
    env.restaurantNotificationEmail = "manager@laloge.fr";
  });

  describe("SMTP non configuré", () => {
    it("should not call nodemailer if SMTP_USER is missing", async () => {
      env.smtpUser = undefined;

      sendReservationConfirmationToClient({
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        requestedDate: "2026-06-22",
        requestedTime: "12:00",
        guestCount: 2,
      });

      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it("should not call nodemailer if SMTP_PASS is missing", async () => {
      env.smtpPass = undefined;

      sendReservationConfirmationToClient({
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        requestedDate: "2026-06-22",
        requestedTime: "12:00",
        guestCount: 2,
      });

      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(mockSendMail).not.toHaveBeenCalled();
    });
  });

  describe("EMAIL_FROM absent", () => {
    it("should call sendMail with undefined from if emailFrom is absent", async () => {
      env.emailFrom = undefined;
      mockSendMail.mockResolvedValue({ messageId: "123" });

      sendReservationConfirmationToClient({
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        requestedDate: "2026-06-22",
        requestedTime: "12:00",
        guestCount: 2,
      });

      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: undefined,
          to: "jean@example.com",
        })
      );
    });
  });

  describe("RESTAURANT_NOTIFICATION_EMAIL absent", () => {
    it("should call sendMail with undefined to if restaurantNotificationEmail is absent", async () => {
      env.restaurantNotificationEmail = undefined;
      mockSendMail.mockResolvedValue({ messageId: "123" });

      sendReservationNotificationToManager({
        firstName: "Jean",
        lastName: "Dupont",
        phone: "0600000000",
        email: "jean@example.com",
        requestedDate: "2026-06-22",
        requestedTime: "12:00",
        guestCount: 2,
      });

      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: undefined,
        })
      );
    });
  });

  describe("Succès d'envoi", () => {
    it("should send reservation confirmation to client with correct data", async () => {
      mockSendMail.mockResolvedValue({ messageId: "client-success-id" });

      sendReservationConfirmationToClient({
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        requestedDate: "2026-06-22",
        requestedTime: "12:00",
        guestCount: 2,
      });

      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "no-reply@laloge.fr",
          to: "jean@example.com",
          subject: "Votre demande de réservation - La Loge Bar & Food",
        })
      );
    });

    it("should send reservation notification to manager with correct data", async () => {
      mockSendMail.mockResolvedValue({ messageId: "manager-success-id" });

      sendReservationNotificationToManager({
        firstName: "Jean",
        lastName: "Dupont",
        phone: "0600000000",
        email: "jean@example.com",
        requestedDate: "2026-06-22",
        requestedTime: "12:00",
        guestCount: 2,
      });

      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "no-reply@laloge.fr",
          to: "manager@laloge.fr",
          subject: "[Nouvelle Réservation] Jean Dupont - 2 pers.",
        })
      );
    });

    it("should send contact confirmation to client with correct data", async () => {
      mockSendMail.mockResolvedValue({ messageId: "contact-client-success-id" });

      sendContactConfirmationToClient({
        name: "Jean",
        email: "jean@example.com",
        subject: "Question",
      });

      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "no-reply@laloge.fr",
          to: "jean@example.com",
          subject: "Accusé de réception de votre message - La Loge Bar & Food",
        })
      );
    });

    it("should send contact notification to manager with correct data", async () => {
      mockSendMail.mockResolvedValue({ messageId: "contact-manager-success-id" });

      sendContactNotificationToManager({
        name: "Jean",
        email: "jean@example.com",
        phone: "0600000000",
        subject: "Question",
        message: "Bonjour",
      });

      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "no-reply@laloge.fr",
          to: "manager@laloge.fr",
          subject: "[Nouveau Contact] Question - par Jean",
        })
      );
    });

    it("should send contact reply to client with correct data", async () => {
      mockSendMail.mockResolvedValue({ messageId: "contact-reply-success-id" });

      const result = await sendContactReplyToClient({
        name: "Jean Dupont",
        email: "jean@example.com",
        subject: "Question sur la carte",
        replyMessage: "Voici la réponse."
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "no-reply@laloge.fr",
          to: "jean@example.com",
          subject: "Re: Question sur la carte",
        })
      );
    });
  });

  describe("Échec Nodemailer", () => {
    it("should catch and log error silently when nodemailer fails", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockSendMail.mockRejectedValue(new Error("SMTP Timeout Error"));

      sendReservationConfirmationToClient({
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        requestedDate: "2026-06-22",
        requestedTime: "12:00",
        guestCount: 2,
      });

      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Échec de l'envoi d'e-mail"),
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });
  });
});
