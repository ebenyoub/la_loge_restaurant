import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function createReservation(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestedDate, requestedTime, guestCount } = req.body;
    const opaqueId = randomUUID();
    const requestId = (req as any).requestId;

    res.status(201).json({
      data: {
        id: opaqueId,
        status: "nouvelle",
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
