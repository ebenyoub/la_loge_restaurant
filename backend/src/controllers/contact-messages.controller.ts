import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function createContactMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message
    } = req.body;

    const requestId = (req as any).requestId;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        consentAcceptedAt: new Date(),
        consentVersion: "v1",
        retentionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2) // 2 years retention
      }
    });

    res.status(201).json({
      data: {
        id: contactMessage.id,
        status: contactMessage.status,
        message: "Votre message a bien été enregistré."
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}
