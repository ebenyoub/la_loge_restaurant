import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import {
  sendReservationNotificationToManager,
  sendReservationConfirmationToClient
} from "../services/mail.service.js";

export async function createReservation(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      requestedDate,
      requestedTime,
      guestCount,
      occasion,
      message
    } = req.body;

    const requestId = (req as any).requestId;

    // Validate reservation time against opening hours
    const dateObj = new Date(requestedDate);
    const dayOfWeek = dateObj.getDay(); // 0 (Sunday) to 6 (Saturday)

    const openingHour = await prisma.openingHour.findFirst({
      where: { dayOfWeek }
    });

    if (openingHour) {
      if (openingHour.isClosed) {
        return next({
          status: 400,
          code: "OUTSIDE_OPENING_HOURS",
          message: "Le restaurant est fermé ce jour-là."
        });
      }

      if (openingHour.opensAt && openingHour.closesAt) {
        if (requestedTime < openingHour.opensAt || requestedTime > openingHour.closesAt) {
          return next({
            status: 400,
            code: "OUTSIDE_OPENING_HOURS",
            message: `Le restaurant est fermé à cette heure-là. Créneau ouvert : ${openingHour.opensAt} - ${openingHour.closesAt}.`
          });
        }
      }
    }

    // Create the reservation and its initial status history entry
    const reservation = await prisma.reservation.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        requestedDate: new Date(requestedDate),
        requestedTime,
        guestCount,
        occasion,
        message,
        consentAcceptedAt: new Date(),
        consentVersion: "v1",
        retentionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2), // 2 years retention
        statusHistories: {
          create: {
            nextStatus: "nouvelle"
          }
        }
      }
    });

    // Trigger emails asynchronously (non-blocking, silent errors)
    sendReservationNotificationToManager({
      firstName,
      lastName,
      phone,
      email,
      requestedDate,
      requestedTime,
      guestCount,
      occasion,
      message
    });
    sendReservationConfirmationToClient({
      firstName,
      lastName,
      email,
      requestedDate,
      requestedTime,
      guestCount
    });

    res.status(201).json({
      data: {
        id: reservation.id,
        status: reservation.status,
        requestedDate,
        requestedTime,
        guestCount,
        message: "Votre demande a bien été enregistrée. Elle reste en attente de confirmation par La Loge."
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}
