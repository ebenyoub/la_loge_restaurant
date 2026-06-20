import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

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
